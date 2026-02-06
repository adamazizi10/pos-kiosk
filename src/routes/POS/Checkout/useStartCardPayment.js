import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/utils/supabase.utils";
import usePosCart from "@/context/usePosCart";
import { persistPaymentFailure } from "@/utils/paymentFailure";

// Shared starter for card payments used by checkout and cash-payment flows.
const useStartCardPayment = () => {
  const navigate = useNavigate();
  const {
    items,
    customerName,
    specialInstructions,
    orderType,
    subtotalCents,
    taxCents,
    totalCents,
    setPendingOrderId,
    setPendingPaymentId,
    setPendingClientSecret,
  } = usePosCart();

  return useCallback(async () => {
    let orderId = null;
    let paymentAttempted = false;
    try {
      const now = new Date().toISOString();

      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          subtotal_cents: subtotalCents,
          tax_cents: taxCents,
          total_cents: totalCents,
          status: "CREATED",
          source: "POS",
          dining_option: orderType?.toUpperCase?.() === "DINE-IN" ? "DINE_IN" : "TAKEOUT",
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

      navigate("/pos/card-payment");
    } catch (err) {
      if (orderId && paymentAttempted) {
        await persistPaymentFailure({
          orderId,
          status: "FAILED",
          error: err,
          method: "CARD",
          amountCents: totalCents,
          provider: "STRIPE_TERMINAL",
        });
      }
      console.error("Card checkout init failed", err);
      navigate("/pos/checkout/failure", { replace: true });
    }
  }, [
    customerName,
    specialInstructions,
    orderType,
    subtotalCents,
    taxCents,
    totalCents,
    items,
    setPendingOrderId,
    setPendingPaymentId,
    setPendingClientSecret,
    navigate,
  ]);
};

export default useStartCardPayment;
