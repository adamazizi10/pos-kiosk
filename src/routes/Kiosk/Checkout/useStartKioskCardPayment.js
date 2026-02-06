import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/utils/supabase.utils";
import useKioskCart from "@/context/useKioskCart";
import { persistPaymentFailure } from "@/utils/paymentFailure";

const TAX_RATE = 0.13;

const useStartKioskCardPayment = (selectedMethod) => {
  const navigate = useNavigate();
  const {
    items,
    subtotalCents,
    customerName,
    specialInstructions,
    orderType,
    setPendingOrderId,
    setPendingPaymentId,
    setPendingClientSecret,
  } = useKioskCart();

  return useCallback(async () => {
    if (selectedMethod !== "card") return;
    let orderId = null;
    let paymentAttempted = false;
    try {
      const now = new Date().toISOString();
      const taxCents = Math.round(subtotalCents * TAX_RATE);
      const totalCents = subtotalCents + taxCents;

      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          subtotal_cents: subtotalCents,
          tax_cents: taxCents,
          total_cents: totalCents,
          status: "CREATED",
          source: "KIOSK",
          dining_option: orderType === "DINE_IN" ? "DINE_IN" : "TAKEOUT",
          customer_name: customerName || null,
          notes: specialInstructions || null,
          created_at: now,
        })
        .select()
        .single();
      if (orderError) throw orderError;
      orderId = order.id;

      const orderItemsPayload = items.map((item) => ({
        order_id: orderId,
        product_id: item.productId,
        name_snapshot: item.name,
        unit_price_cents_snapshot: item.unitPriceCents,
        qty: item.qty,
        line_total_cents: item.lineTotalCents,
        selected_options: item.selectedOptions || null,
      }));
      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItemsPayload);
      if (itemsError) throw itemsError;

      paymentAttempted = true;
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error("No Supabase session found");
      }
      const piRes = await fetch(import.meta.env.VITE_STRIPE_CREATE_PAYMENT_INTENT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ amount_cents: totalCents, currency: "cad" }),
      });
      const piData = await piRes.json();
      const clientSecret = piData?.client_secret || piData?.clientSecret;
      const paymentIntentId = piData?.payment_intent_id || piData?.paymentIntentId;
      if (!piRes.ok || !clientSecret || !paymentIntentId) {
        throw new Error(piData?.error || "Failed to create payment intent");
      }

      const { data: payment, error: paymentError } = await supabase
        .from("payments")
        .insert({
          order_id: orderId,
          status: "REQUIRES_PAYMENT",
          method: "CARD",
          amount_cents: totalCents,
          provider: "STRIPE_TERMINAL",
          provider_payment_intent_id: paymentIntentId,
        })
        .select()
        .single();
      if (paymentError) throw paymentError;

      setPendingOrderId(order.id);
      setPendingPaymentId(payment?.id || null);
      setPendingClientSecret(clientSecret);

      navigate("/kiosk/checkout/payment");
    } catch (err) {
      if (orderId && paymentAttempted) {
        await persistPaymentFailure({
          orderId,
          status: "FAILED",
          error: err,
          method: "CARD",
          amountCents: subtotalCents + Math.round(subtotalCents * TAX_RATE),
          provider: "STRIPE_TERMINAL",
        });
      }
      console.error("Kiosk card checkout init failed", err);
      navigate("/kiosk/checkout/failure", { replace: true });
    }
  }, [
    selectedMethod,
    subtotalCents,
    customerName,
    specialInstructions,
    orderType,
    setPendingOrderId,
    setPendingPaymentId,
    setPendingClientSecret,
    navigate,
  ]);
};

export default useStartKioskCardPayment;
