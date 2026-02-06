import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { payWithCard } from "@/hardware";
import { supabase } from "@/utils/supabase.utils";
import useKioskCart from "@/context/useKioskCart";
import ProcessingHeader from "./components/ProcessingHeader";
import ProcessingReaderBlock from "./components/ProcessingReaderBlock";
import ProcessingStepIndicator from "./components/ProcessingStepIndicator";
import { persistPaymentFailure } from "@/utils/paymentFailure";

const FINALSUCCESS = ["PAID", "SUCCEEDED"];
const FINALFAILURE = ["FAILED", "PAYMENTFAILED", "CANCELLED"];
const TAX_RATE = 0.13;

const ProcessingRoute = () => {
  const navigate = useNavigate();
  const {
    pendingClientSecret,
    pendingOrderId,
    items,
    subtotalCents,
    customerName,
    specialInstructions,
    orderType,
    setLastSuccessfulTransaction,
    resetAfterSuccess,
  } = useKioskCart();
  const [currentStep, setCurrentStep] = useState(0);
  const didRunRef = useRef(false);
  const pollRef = useRef(null);
  const cancelledRef = useRef(false);
  const startTimeRef = useRef(null);
  const taxCents = Math.round(subtotalCents * TAX_RATE);
  const totalCents = subtotalCents + taxCents;

  useEffect(() => {
    const run = async () => {
      if (didRunRef.current) return;
      didRunRef.current = true;

      if (!pendingClientSecret || !pendingOrderId) {
        console.error("Missing client secret or order id");
        navigate("/kiosk/checkout/failure", { replace: true });
        return;
      }

      try {
        setCurrentStep(0);
        await payWithCard({ clientSecret: pendingClientSecret });
        setCurrentStep(1);
        setTimeout(() => setCurrentStep(2), 800);
        startTimeRef.current = Date.now();

        const poll = async () => {
          if (startTimeRef.current && Date.now() - startTimeRef.current > 60000) {
            clearInterval(pollRef.current);
            await persistPaymentFailure({
              orderId: pendingOrderId,
              status: "FAILED",
              error: new Error("Payment timed out"),
              method: "CARD",
              amountCents: totalCents,
              provider: "STRIPE_TERMINAL",
            });
            navigate("/kiosk/checkout/failure", { replace: true });
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

            const taxCents = Math.round(subtotalCents * TAX_RATE);
            const totalCents = subtotalCents + taxCents;
            const snapshot = {
              orderId: pendingOrderId,
              orderNumber: orderData?.order_number || null,
              businessDate: orderData?.business_date || null,
              items: items.map((i) => ({
                productId: i.productId,
                name: i.name,
                qty: i.qty,
                unitPriceCents: i.unitPriceCents,
                lineTotalCents: i.lineTotalCents,
              })),
              subtotalCents,
              taxCents,
              totalCents,
              paymentMethod: "CARD",
              paymentId: null,
              cashGivenCents: 0,
              changeDueCents: 0,
              timestamp: new Date().toISOString(),
              device: "Kiosk",
              orderType,
              customerName: orderData?.customer_name || customerName || null,
              specialInstruction: specialInstructions || null,
            };
            setLastSuccessfulTransaction(snapshot);
            resetAfterSuccess();
            navigate("/kiosk/checkout/success", { replace: true });
          }
          if (FINALFAILURE.includes(status)) {
            clearInterval(pollRef.current);
            await persistPaymentFailure({
              orderId: pendingOrderId,
              status,
              method: "CARD",
              amountCents: totalCents,
              provider: "STRIPE_TERMINAL",
            });
            navigate("/kiosk/checkout/failure", { replace: true });
          }
        };

        poll();
        pollRef.current = setInterval(poll, 1000);
      } catch (err) {
        console.error("Kiosk card payment error", err);
        await persistPaymentFailure({
          orderId: pendingOrderId,
          status: "FAILED",
          error: err,
          method: "CARD",
          amountCents: totalCents,
          provider: "STRIPE_TERMINAL",
        });
        navigate("/kiosk/checkout/failure", { replace: true });
      }
    };

    run();

    return () => {
      cancelledRef.current = true;
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [navigate, pendingClientSecret, pendingOrderId]);

  return (
    <div className="min-h-screen bg-background">
      <ProcessingHeader />

      <main className="flex flex-col items-center justify-center px-6 py-10">
        <div className="space-y-8 flex flex-col items-center">
          <ProcessingStepIndicator currentStep={currentStep} />
          <ProcessingReaderBlock />
        </div>
      </main>
    </div>
  );
};

export default ProcessingRoute;
