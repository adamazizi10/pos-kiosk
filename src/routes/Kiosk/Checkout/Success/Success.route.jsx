import SuccessIcon from "./components/SuccessIcon";
import SuccessOrderNumber from "./components/SuccessOrderNumber";
import SuccessCustomerInfo from "./components/SuccessCustomerInfo";
import SuccessNextSteps from "./components/SuccessNextSteps";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useKioskCart from "@/context/useKioskCart";
import appConfig from "@/app.config";

const SuccessRoute = () => {
  const navigate = useNavigate();
  const {
    lastSuccessfulTransaction,
    clearCheckoutState,
  } = useKioskCart();

  useEffect(() => {
    if (!lastSuccessfulTransaction) {
      navigate("/kiosk", { replace: true });
    }
  }, [lastSuccessfulTransaction, navigate]);

  if (!lastSuccessfulTransaction) return null;

  const { success } = appConfig.mockData.kiosk;
  const displayCustomerName = lastSuccessfulTransaction.customerName || "Guest";
  const orderNumber = lastSuccessfulTransaction.orderNumber;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Main content - centered */}
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-lg space-y-10 text-center">
          {/* Success icon */}
          <SuccessIcon />

          {/* Headline */}
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-foreground">
              {success.headline}
            </h1>
            <p className="text-xl text-muted-foreground">
              {success.subtext}
            </p>
          </div>

          {/* Order number display */}
          <SuccessOrderNumber orderNumber={orderNumber} />

          {/* Customer name */}
          <SuccessCustomerInfo customerName={displayCustomerName} />

          {/* Next steps and actions */}
          <SuccessNextSteps onNewOrder={clearCheckoutState} />

          {/* Store name footer */}
          <p className="text-sm text-muted-foreground/50 pt-8">
            Kitchen Co.
          </p>
        </div>
      </main>
    </div>
  );
};

export default SuccessRoute;
