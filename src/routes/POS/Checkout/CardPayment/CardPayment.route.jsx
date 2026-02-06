import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { payWithCard } from "@/hardware";
import { supabase } from "@/utils/supabase.utils";
import usePosCart from "@/context/usePosCart";
import ProcessingStepIndicator from "@/routes/Kiosk/Checkout/Payment/components/ProcessingStepIndicator";
import ProcessingReaderBlock from "@/routes/Kiosk/Checkout/Payment/components/ProcessingReaderBlock";
import usePOSCartPanelConfig from "@/routes/POS/hooks/usePOSCartPanelConfig";
import { useAuth } from "@/auth/AuthProvider";
import { recordCashDrawerSale } from "../helpers/cashDrawer";
import { persistPaymentFailure } from "@/utils/paymentFailure";

const CardPaymentRoute = () => {
  const navigate = useNavigate();
  const {
    totalCents,
    items,
    subtotalCents,
    taxCents,
    setLastSuccessfulTransaction,
    resetCartForNewSale,
    customerName,
    specialInstructions,
    pickupTime,
    orderType,
    pendingOrderId,
    pendingPaymentId,
    setPendingOrderId,
    setPendingPaymentId,
    pendingClientSecret,
    setPendingClientSecret,
    cashSelectedCents,
  } = usePosCart();
  const { profile } = useAuth();
  const didRunRef = useRef(false);
  const pollRef = useRef(null);
  const cancelledRef = useRef(false);
  const startTimeRef = useRef(null);
  const [currentStep, setCurrentStep] = useState(0);

  const FINALSUCCESS = ["PAID", "SUCCEEDED"];
  const FINALFAILURE = ["FAILED", "PAYMENTFAILED", "CANCELLED"];
  const safeTotalCents = Number.isFinite(totalCents) ? totalCents : 0;
  const safeCashCents = Math.max(cashSelectedCents || 0, 0);
  const cardAmountCents = Math.max(safeTotalCents - safeCashCents, 0);

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
        visible: false,
        label: "",
        to: "",
      },
    }),
    []
  );

  usePOSCartPanelConfig(cartPanelConfig);

  useEffect(() => {
    if (didRunRef.current) return;
    didRunRef.current = true;

    const run = async () => {
      try {
        if (!pendingClientSecret || !pendingOrderId) {
          console.error("Missing client secret or order id for card payment");
          navigate("/pos/checkout/failure", { replace: true });
          return;
        }

        startTimeRef.current = Date.now();
        setCurrentStep(0);
        console.log(`
          ===================
          Step 0 - Entering payWithCard()
          `)
        await payWithCard({ clientSecret: pendingClientSecret });
        setTimeout(() => setCurrentStep(1), 800);
        console.log(`
          ===================
          Step 1 - Waiting for Stripe Webhook to approve & update Payment Status
          `)
        const poll = async () => {
          if (startTimeRef.current && Date.now() - startTimeRef.current > 60000) {
            clearInterval(pollRef.current);
            await persistPaymentFailure({
              orderId: pendingOrderId,
              status: "FAILED",
              error: new Error("Payment timed out"),
              method: "CARD",
              amountCents: cardAmountCents,
              provider: "STRIPE_TERMINAL",
            });
            navigate("/pos/checkout/failure", { replace: true });
            return;
          }

          const { data, error } = await supabase
            .from("payments")
            .select("status")
            .eq("order_id", pendingOrderId)
            .order("created_at", { ascending: false })
            .limit(1)
            .maybeSingle();

          if (cancelledRef.current) return;
          if (error) {
            console.warn("Payment status poll failed", error);
            return;
          }

          const status = data?.status || "REQUIRES_PAYMENT";
          if (FINALSUCCESS.includes(status)) {
            clearInterval(pollRef.current);

            const { data: orderData } = await supabase
              .from("orders")
              .select("order_number, business_date, customer_name")
              .eq("id", pendingOrderId)
              .maybeSingle();

            const splitCashCents = Math.max(cashSelectedCents || 0, 0);
            const isSplitTender =
              splitCashCents > 0 && splitCashCents < (Number.isFinite(totalCents) ? totalCents : 0);

            if (isSplitTender) {
              const finalizedAt = new Date().toISOString();
              console.info("[split-tender] finalize cash portion", {
                orderId: pendingOrderId,
                amountCents: splitCashCents,
              });

              const { data: cashPayment, error: cashPaymentUpdateError } = await supabase
                .from("payments")
                .update({
                  status: "SUCCEEDED",
                  provider: "MANUAL",
                  finalized_at: finalizedAt,
                })
                .eq("order_id", pendingOrderId)
                .eq("method", "CASH")
                .select()
                .maybeSingle();

              if (cashPaymentUpdateError) {
                console.error("[split-tender] cash payment update failed", cashPaymentUpdateError);
              } else {
                await recordCashDrawerSale({
                  supabase,
                  amountCents: splitCashCents,
                  orderId: pendingOrderId,
                  paymentId: cashPayment?.id || null,
                  userId: profile?.id || null,
                  isSplit: true,
                  openDrawer: true,
                });
              }
            }

            const snapshot = {
              orderId: pendingOrderId || null,
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
              totalCents: Number.isFinite(totalCents) ? totalCents : 0,
              paymentMethod: isSplitTender ? "CASH + CARD" : "CARD",
              paymentId: pendingPaymentId || null,
              cashGivenCents: splitCashCents,
              changeDueCents: 0,
              timestamp: new Date().toISOString(),
              device: "POS Terminal",
              orderType,
              customerName: orderData?.customer_name || customerName || null,
              specialInstruction: specialInstructions || null,
              pickupTime: pickupTime || null,
            };
            setLastSuccessfulTransaction(snapshot);
            setPendingOrderId(null);
            setPendingPaymentId(null);
            setPendingClientSecret(null);
            resetCartForNewSale();
            navigate("/pos/checkout/success", { replace: true });
          }
          if (FINALFAILURE.includes(status)) {
            clearInterval(pollRef.current);
            await persistPaymentFailure({
              orderId: pendingOrderId,
              status,
              method: "CARD",
              amountCents: cardAmountCents,
              provider: "STRIPE_TERMINAL",
            });
            navigate("/pos/checkout/failure", { replace: true });
          }
        };

        poll();
        pollRef.current = setInterval(poll, 1000);
      } catch (err) {
        console.error("Card payment error", err);
        await persistPaymentFailure({
          orderId: pendingOrderId,
          status: "FAILED",
          error: err,
          method: "CARD",
          amountCents: cardAmountCents,
          provider: "STRIPE_TERMINAL",
        });
        navigate("/pos/checkout/failure", { replace: true });
      }
    };

    run();
  }, [
    navigate,
    totalCents,
    pendingOrderId,
    pendingPaymentId,
    pendingClientSecret,
    items,
    subtotalCents,
    taxCents,
    customerName,
    specialInstructions,
    pickupTime,
    orderType,
    setLastSuccessfulTransaction,
    setPendingOrderId,
    setPendingPaymentId,
    setPendingClientSecret,
    resetCartForNewSale,
  ]);

  useEffect(() => {
    return () => {
      cancelledRef.current = true;
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 py-10">
      <div className="space-y-8 flex flex-col items-center">
        <ProcessingStepIndicator currentStep={currentStep} />
        <ProcessingReaderBlock />
      </div>
    </div>
  );
};

export default CardPaymentRoute;
