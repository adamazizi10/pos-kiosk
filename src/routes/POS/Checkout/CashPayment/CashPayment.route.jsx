import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import appConfig from "@/app.config";
import CashAmountDisplay from "./components/CashAmountDisplay";
import CashKeypad from "./components/CashKeypad";
import QuickBillsGrid from "./components/QuickBillsGrid";
import CashPaymentActions from "./components/CashPaymentActions";
import usePosCart from "@/context/usePosCart";
import { supabase } from "@/utils/supabase.utils";
import { useAuth } from "@/auth/AuthProvider";
import { openCashDrawer } from "@/hardware";
import useStartCardPayment from "../useStartCardPayment";
import usePOSCartPanelConfig from "@/routes/POS/hooks/usePOSCartPanelConfig";
import { ShoppingCart } from "lucide-react";
import { recordCashDrawerSale } from "../helpers/cashDrawer";
import BlockingLoadingModal from "@/components/BlockingLoadingModal";
import { persistPaymentFailure } from "@/utils/paymentFailure";

const CashPaymentRoute = () => {
  const navigate = useNavigate();
  const { store } = appConfig;
  const { cashPayment, customer } = appConfig.mockData.pos;
  const [cashValueCents, setCashValueCents] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const {
    totalCents,
    subtotalCents,
    taxCents,
    items,
    setCashSelectedCents,
    setLastSuccessfulTransaction,
    resetCartForNewSale,
    customerName,
    specialInstructions,
    pickupTime,
    orderType,
    setPendingOrderId,
    setPendingPaymentId,
    setPendingClientSecret,
    pendingOrderId,
  } = usePosCart();
  const startCardPayment = useStartCardPayment();
  const { profile } = useAuth();

  const cartPanelConfig = useMemo(
    () => ({
      topActions: {
        showSideButton: false,
        showOpenDrawerButton: false,
      },
      itemControls: {
        showIncrement: false,
        showDecrement: false,
        showClearItem: false,
      },
      checkoutAction: {
        visible: true,
        label: "Back to Checkout",
        to: "/pos/checkout",
        requireItems: false,
        icon: ShoppingCart,
        clearCashOnNavigate: true,
      },
    }),
    []
  );

  usePOSCartPanelConfig(cartPanelConfig);

  const handleKeyPress = (key) => {
    if (key === "clear") {
      setCashValueCents(0);
      return;
    }
    if (key === "backspace") {
      setCashValueCents((prev) => Math.floor(prev / 10));
      return;
    }
    if (key === "exact") {
      setCashValueCents(totalCents);
      return;
    }
    if (/^[0-9]$/.test(key)) {
      setCashValueCents((prev) => {
        const next = prev * 10 + Number(key);
        return next;
      });
    }
  };

  const handleQuickBill = (value) => {
    const numeric = parseFloat(value);
    if (Number.isFinite(numeric)) {
      setCashValueCents((prev) => prev + Math.round(numeric * 100));
    }
  };

  const cashSelectedCents = cashValueCents;

  useEffect(() => {
    setCashSelectedCents(cashSelectedCents);
  }, [cashSelectedCents, setCashSelectedCents]);

  const handleComplete = async () => {
    if (isProcessing) return;
    if (cashSelectedCents <= 0) return;
    setIsProcessing(true);

    let orderId = null;
    let paymentAttempted = false;
    let paymentCreated = false;

    try {
      const now = new Date().toISOString();

      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .insert({
          subtotal_cents: subtotalCents,
          tax_cents: taxCents,
          total_cents: totalCents,
          status: "PAID",
          paid_at: now,
          source: "POS",
          dining_option:
            orderType?.toUpperCase?.() === "DINE-IN" ? "DINE_IN" : "TAKEOUT",
          customer_name: customerName || null,
          notes: specialInstructions || null,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      orderId = orderData.id;

      const orderItemsPayload = items.map((i) => ({
        order_id: orderId,
        product_id: i.productId,
        name_snapshot: i.name,
        unit_price_cents_snapshot: i.unitPriceCents,
        qty: i.qty,
        line_total_cents: i.lineTotalCents,
        selected_options: i.selectedOptions || null,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItemsPayload);
      if (itemsError) throw itemsError;

      paymentAttempted = true;
      const { data: paymentData, error: paymentError } = await supabase
        .from("payments")
        .insert({
          order_id: orderId,
          status: "SUCCEEDED",
          method: "CASH",
          amount_cents: totalCents,
          provider: "MANUAL",
          finalized_at: now,
        })
        .select()
        .single();
      if (paymentError) throw paymentError;
      paymentCreated = true;

      const receiptContent = {
        order: orderData,
        items: orderItemsPayload,
        payment: paymentData,
      };

      const { error: receiptError } = await supabase.from("receipts").insert({
        order_id: orderId,
        payment_id: paymentData.id,
        content_json: receiptContent,
      });
      if (receiptError) throw receiptError;

      await recordCashDrawerSale({
        supabase,
        amountCents: totalCents,
        orderId,
        paymentId: paymentData?.id || null,
        userId: profile?.id || null,
        isSplit: false,
        openDrawer: false,
      });

      const { error: orderUpdateError } = await supabase
        .from("orders")
        .update({
          status: "PAID",
          paid_at: now,
          dining_option:
            orderType?.toUpperCase?.() === "DINE-IN" ? "DINE_IN" : "TAKEOUT",
          customer_name: customerName || null,
          notes: specialInstructions || null,
        })
        .eq("id", orderId);
      if (orderUpdateError) console.error("Order update error", orderUpdateError);

      const snapshot = {
        orderId,
        orderNumber: orderData?.order_number || null,
        businessDate: orderData?.business_date || null,
        items: items.map((i) => ({
          productId: i.productId,
          name: i.name,
          qty: i.qty,
          unitPriceCents: i.unitPriceCents,
          lineTotalCents: i.lineTotalCents,
          selectedOptions: i.selectedOptions || null,
        })),
        subtotalCents,
        taxCents,
        totalCents,
        paymentMethod: "CASH",
        cashGivenCents: cashSelectedCents,
        changeDueCents: Math.max(cashSelectedCents - totalCents, 0),
        timestamp: now,
        device: "POS Terminal",
        orderType,
        customerName: customerName || null,
        specialInstruction: specialInstructions || null,
        pickupTime: pickupTime || null,
      };
      setLastSuccessfulTransaction(snapshot);
      resetCartForNewSale();
      try {
        await openCashDrawer();
      } catch (drawerErr) {
        console.error("Failed to open cash drawer", drawerErr);
      }
      navigate("/pos/checkout/success", { replace: true });
    } catch (err) {
      console.error("Complete cash sale failed", err);
      if (orderId && paymentAttempted && !paymentCreated) {
        await persistPaymentFailure({
          orderId,
          status: "FAILED",
          error: err,
          method: "CASH",
          amountCents: totalCents,
          provider: "MANUAL",
        });
      }
      setIsProcessing(false);
      navigate("/pos/checkout/failure", { replace: true });
    }
  };

  const handleCancel = () => {
    setCashValueCents(0);
  };

  const handleSplitCard = () => {
    if (isProcessing) return;
    const cashAmount = Math.max(cashSelectedCents, 0);
    const remainingAmount = Math.max(totalCents - cashAmount, 0);
    console.info("[split-tender] init", {
      cashAmount,
      remainingAmount,
      totalCents,
    });

    // If nothing remains, just run the normal cash completion.
    if (remainingAmount <= 0) {
      handleComplete();
      return;
    }

    setIsProcessing(true);
    (async () => {
      let orderId = pendingOrderId;
      let cashPaymentAttempted = false;
      let cashPaymentCreated = false;
      let cardPaymentAttempted = false;
      let cardPaymentCreated = false;
      try {
        const now = new Date().toISOString();

        let createdOrder = false;
        if (!orderId) {
          const { data: order, error: orderError } = await supabase
            .from("orders")
            .insert({
              subtotal_cents: subtotalCents,
              tax_cents: taxCents,
              total_cents: totalCents,
              status: "CREATED",
              source: "POS",
              dining_option:
                orderType?.toUpperCase?.() === "DINE-IN" ? "DINE_IN" : "TAKEOUT",
              customer_name: customerName || null,
              notes: specialInstructions || null,
              created_at: now,
            })
            .select()
            .single();
          if (orderError) throw orderError;
          orderId = order.id;
          setPendingOrderId(orderId);
          createdOrder = true;
        }

        if (createdOrder) {
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
        }

        cashPaymentAttempted = true;
        const { data: cashPayment, error: cashPaymentError } = await supabase
          .from("payments")
          .insert({
            order_id: orderId,
            status: "REQUIRES_PAYMENT",
            method: "CASH",
            amount_cents: cashAmount,
            provider: "MANUAL",
          })
          .select()
          .single();
        if (cashPaymentError) throw cashPaymentError;
        cashPaymentCreated = true;
        console.info("[split-tender] cash payment created", {
          orderId,
          paymentId: cashPayment?.id,
          amountCents: cashAmount,
        });

        cardPaymentAttempted = true;
        const { data: { session: authSession } } = await supabase.auth.getSession();
        if (!authSession?.access_token) {
          throw new Error("No Supabase session found");
        }
        const piRes = await fetch(import.meta.env.VITE_STRIPE_CREATE_PAYMENT_INTENT_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
            Authorization: `Bearer ${authSession.access_token}`,
          },
          body: JSON.stringify({ amount_cents: remainingAmount, currency: "cad" }),
        });
        const piData = await piRes.json();
        const clientSecret = piData?.client_secret || piData?.clientSecret;
        const paymentIntentId = piData?.payment_intent_id || piData?.paymentIntentId;
        if (!piRes.ok || !clientSecret || !paymentIntentId) {
          throw new Error(piData?.error || "Failed to create payment intent");
        }

        const { data: cardPayment, error: cardPaymentError } = await supabase
          .from("payments")
          .insert({
            order_id: orderId,
            status: "REQUIRES_PAYMENT",
            method: "CARD",
            amount_cents: remainingAmount,
          provider: "STRIPE_TERMINAL",
          provider_payment_intent_id: paymentIntentId,
        })
          .select()
          .single();
        if (cardPaymentError) throw cardPaymentError;
        cardPaymentCreated = true;

        setPendingOrderId(orderId);
        setPendingPaymentId(cardPayment?.id || null);
        setPendingClientSecret(clientSecret);

        navigate("/pos/card-payment");
      } catch (err) {
        console.error("Split tender init failed", err);
        if (orderId && cardPaymentAttempted && !cardPaymentCreated) {
          await persistPaymentFailure({
            orderId,
            status: "FAILED",
            error: err,
            method: "CARD",
            amountCents: remainingAmount,
            provider: "STRIPE_TERMINAL",
          });
        } else if (orderId && cashPaymentAttempted && !cashPaymentCreated) {
          await persistPaymentFailure({
            orderId,
            status: "FAILED",
            error: err,
            method: "CASH",
            amountCents: cashAmount,
            provider: "MANUAL",
          });
        }
        setIsProcessing(false);
        navigate("/pos/checkout/failure", { replace: true });
      }
    })();
  };

  const displayValue = `${store.currencySymbol}${(cashValueCents / 100).toFixed(2)}`;
  const remainingCents = Math.max(totalCents - cashSelectedCents, 0);
  const showPayRestWithCard = cashSelectedCents > 0 && cashSelectedCents < totalCents;

  return (
    <div className="h-full w-full flex items-center justify-center p-4 bg-muted/30 overflow-auto">
      <BlockingLoadingModal open={isProcessing} text="Processing payment..." />
      <div className="w-full max-w-[780px] bg-background rounded-2xl border border-border shadow-lg">
        {/* Quick Bills + Keypad Row */}
        <div className="px-8 py-6 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <div className="text-left">
              <p className="text-sm text-muted-foreground">Cash Entered</p>
              <p className="text-2xl font-bold text-foreground">{displayValue}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Remaining Balance</p>
              <p className="text-2xl font-bold text-foreground">
                {store.currencySymbol}
                {(remainingCents / 100).toFixed(2)}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            {/* Left: Quick Bills (3x4 grid) */}
            <QuickBillsGrid
              bills={cashPayment.quickBills}
              onBillSelect={handleQuickBill}
              onExact={() => handleKeyPress("exact")}
              exactLabel={cashPayment.exactLabel}
            />
            
            {/* Right: Keypad */}
            <CashKeypad onKeyPress={handleKeyPress} />
          </div>
        </div>

        {/* Actions */}
        <div className="px-8 py-5">
          <CashPaymentActions
            completeLabel={cashPayment.completeButtonText}
            cancelLabel={cashPayment.cancelButtonText}
            onComplete={handleComplete}
            onCancel={handleCancel}
            onPayRestWithCard={handleSplitCard}
            showPayRestWithCard={showPayRestWithCard}
            disableComplete={cashSelectedCents < totalCents || isProcessing}
            disablePayRestWithCard={isProcessing}
          />
        </div>
      </div>
    </div>
  );
};

export default CashPaymentRoute;
