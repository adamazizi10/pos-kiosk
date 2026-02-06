import { RotateCcw, XCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import appConfig from "@/app.config";
import usePOSCartPanelConfig from "@/routes/POS/hooks/usePOSCartPanelConfig";
import usePosCart from "@/context/usePosCart";
import { supabase } from "@/utils/supabase.utils";

const failureData = appConfig.mockData.pos.failure;

const FailureRoute = () => {
  const navigate = useNavigate();
  const { resetAll, pendingOrderId } = usePosCart();
  const [failureMessage, setFailureMessage] = useState("");
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
        label: "Cancel & Return Home",
        to: "/pos",
        requireItems: false,
        icon: XCircle,
        onClick: () => {
          resetAll();
          navigate("/pos");
        },
      },
    }),
    [navigate, resetAll]
  );

  useEffect(() => {
    let cancelled = false;
    const loadFailureDetails = async () => {
      if (!pendingOrderId) return;
      const { data, error } = await supabase
        .from("payments")
        .select("failure_code, failure_reason")
        .eq("order_id", pendingOrderId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (cancelled || error) return;
      if (data?.failure_code && data?.failure_reason) {
        setFailureMessage(`${data.failure_code}: ${data.failure_reason}`);
      }
    };

    loadFailureDetails();
    return () => {
      cancelled = true;
    };
  }, [pendingOrderId]);

  usePOSCartPanelConfig(cartPanelConfig);

  return (
    <div className="flex flex-col h-full bg-background px-6 py-8">
      {/* Centered failure container */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="flex flex-col items-center text-center max-w-lg -mt-8">
          {/* Error Icon */}
          <div className="mb-8">
            <div className="h-28 w-28 rounded-full bg-red-100 flex items-center justify-center">
              <XCircle className="h-14 w-14 text-red-600" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl font-semibold text-foreground mb-3">
            {failureData.pageTitle}
          </h1>

          {/* Subtext */}
          <p className="text-lg text-muted-foreground mb-10">
            {failureMessage || failureData.message}
          </p>

          <button
            type="button"
            onClick={() => navigate("/pos/checkout")}
            className="w-fit px-20 h-24 rounded-2xl border border-border bg-background hover:bg-muted transition-colors text-3xl font-bold flex items-center justify-center gap-3"
          >
            <RotateCcw className="h-9 w-9" />
            Retry Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default FailureRoute;
