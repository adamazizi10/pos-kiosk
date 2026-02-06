import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Home } from "lucide-react";
import { printReceipt } from "@/hardware";
import usePosCart from "@/context/usePosCart";
import { supabase } from "@/utils/supabase.utils";
import usePOSCartPanelConfig from "@/routes/POS/hooks/usePOSCartPanelConfig";

const SuccessRoute = () => {
  const navigate = useNavigate();
  const { lastSuccessfulTransaction, resetAll, resetCartForNewSale } = usePosCart();
  const location = useLocation();
  const hasPrintedRef = useRef(false);
  const [paymentStatus, setPaymentStatus] = useState(
    lastSuccessfulTransaction?.paymentMethod === "CARD" ? "CHECKING" : "PAID"
  );
  const snapshot =
    lastSuccessfulTransaction || {
      orderNumber: null,
      items: [],
      subtotalCents: 0,
      taxCents: 0,
      totalCents: 0,
      paymentMethod: "CASH",
      timestamp: new Date().toISOString(),
    };

  useEffect(() => {
    resetCartForNewSale();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cartPanelConfig = useMemo(
    () => ({
      topActions: {
        showSideButton: false,
        showOpenDrawerButton: true,
      },
      itemControls: {
        showIncrement: false,
        showDecrement: false,
        showClearItem: false,
      },
      checkoutAction: {
        visible: true,
        label: "Back to Home",
        to: "/pos",
        requireItems: false,
        icon: Home,
        onClick: () => {
          resetAll();
          navigate("/pos");
        },
      },
    }),
    [navigate, resetAll]
  );

  usePOSCartPanelConfig(cartPanelConfig);

  useEffect(() => {
    if (snapshot.paymentMethod !== "CARD" || !snapshot.orderId) return;
    const FINALSUCCESS = ["PAID", "SUCCEEDED"];
    const FINALFAILURE = ["FAILED", "PAYMENTFAILED", "CANCELLED"];
    let cancelled = false;
    let intervalId = null;

    const checkStatus = async () => {
      const { data, error } = await supabase
        .from("payments")
        .select("status")
        .eq("order_id", snapshot.orderId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (cancelled) return;
      if (error) {
        console.error("Payment status check failed", error);
        return;
      }

      const status = data?.status || "REQUIRES_PAYMENT";
      setPaymentStatus(status);

      if (FINALSUCCESS.includes(status) || FINALFAILURE.includes(status)) {
        if (intervalId) clearInterval(intervalId);
        if (FINALFAILURE.includes(status)) {
          navigate("/pos/checkout/failure", { replace: true });
        }
      }
    };

    checkStatus();
    intervalId = setInterval(checkStatus, 1000);

    return () => {
      cancelled = true;
      if (intervalId) clearInterval(intervalId);
    };
  }, [snapshot.paymentMethod, snapshot.orderId, navigate]);

  const dateObj = new Date(snapshot.timestamp || Date.now());
  const pickupTimeLabel =
    snapshot.pickupTime === "asap"
      ? "ASAP"
      : snapshot.pickupTime || "ASAP";
  const receiptData = {
    transactionNumber: snapshot.orderNumber || snapshot.orderId || "—",
    status: "Completed",
    receiptNumber: snapshot.orderNumber ? `REC-${snapshot.orderNumber}` : "REC-—",
    customerName: snapshot.customerName || "—",
    device: snapshot.device || "POS Terminal",
    terminal: snapshot.terminal || "Main",
    paymentSummary: snapshot.paymentMethod || "—",
    dateLabel: dateObj.toLocaleDateString(),
    timeLabel: dateObj.toLocaleTimeString(),
    cashier: snapshot.cashier || "—",
    items:
      snapshot.items?.map((i) => ({
        name: i.name,
        qtyLabel: `${i.qty}×`,
        priceLabel: `$${(i.lineTotalCents / 100).toFixed(2)}`,
      })) || [],
    totals: {
      subtotalLabel: `$${(snapshot.subtotalCents / 100).toFixed(2)}`,
      taxLabel: `$${(snapshot.taxCents / 100).toFixed(2)}`,
      totalLabel: `$${(snapshot.totalCents / 100).toFixed(2)}`,
    },
    primaryActionLabel: "Back to Main Screen",
    printLabel: "Print Receipt",
  };

  const buildReceiptPayload = () => ({
    orderId: snapshot.orderId,
    orderNumber: snapshot.orderNumber,
    items: snapshot.items || [],
    subtotalCents: snapshot.subtotalCents,
    taxCents: snapshot.taxCents,
    totalCents: snapshot.totalCents,
    paymentMethod: receiptData.paymentSummary,
    cashier: receiptData.cashier,
    timestamp: snapshot.timestamp || new Date().toISOString(),
  });

  useEffect(() => {
    if (hasPrintedRef.current) return;
    hasPrintedRef.current = true;
    const payload = buildReceiptPayload();
    console.log("🧾 RECEIPT PAYLOAD", payload);
    printReceipt(payload).catch((err) => {
      console.error("Receipt print failed", err);
    });
  }, []);

  const handlePrint = () => {
    const payload = buildReceiptPayload();
    console.log("🧾 RECEIPT PAYLOAD", payload);
    printReceipt(payload).catch((err) => {
      console.error("Receipt print failed", err);
    });
  };

  const FINALSUCCESS = ["PAID", "SUCCEEDED"];
  const isFinalizing =
    snapshot.paymentMethod === "CARD" && !FINALSUCCESS.includes(paymentStatus);

  return (
    <div className="flex h-full bg-background p-6">
      <div className="relative flex-1 bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="rotate-[-24deg] text-green-500 text-7xl font-extrabold opacity-10">
            Transaction Approved
          </span>
        </div>

        <div className="relative h-full flex flex-col gap-6 p-8">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-foreground">Transaction Details</h1>
            <p className="text-sm text-muted-foreground">
              {isFinalizing
                ? "Finalizing payment..."
                : `Payment approved for ${snapshot.customerName || "—"}`}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <DetailRow label="Date" value={receiptData.dateLabel || "—"} />
            <DetailRow label="Time" value={receiptData.timeLabel || "—"} />
            <DetailRow label="Order #" value={receiptData.transactionNumber || "—"} />
            <DetailRow label="Device" value={receiptData.device || "POS"} />
            <DetailRow label="Payment Method" value={receiptData.paymentSummary || "—"} />
            <DetailRow label="Customer Name" value={snapshot.customerName || "—"} />
            <DetailRow label="Special Instructions" value={snapshot.specialInstruction || "—"} />
            <DetailRow label="Pickup Time" value={pickupTimeLabel} />
            <DetailRow label="Order Type" value={snapshot.orderType || "—"} />
          </div>

          <div className="mt-auto pt-4 border-t border-border">
            <button
              onClick={handlePrint}
              className="w-full h-14 rounded-xl border border-border bg-background hover:bg-muted transition-colors text-sm font-semibold flex items-center justify-center gap-2"
            >
              Print Receipt
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessRoute;

const DetailRow = ({ label, value }) => (
  <div className="flex flex-col">
    <span className="text-xs text-muted-foreground">{label}</span>
    <span className="text-base font-semibold text-foreground">{value}</span>
  </div>
);
