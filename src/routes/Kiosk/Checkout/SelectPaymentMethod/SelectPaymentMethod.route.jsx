import { useState } from "react";
import PaymentHeader from "./components/PaymentHeader";
import PaymentMethodSelector from "./components/PaymentMethodSelector";
import PaymentSummaryPanel from "./components/PaymentSummaryPanel";
import useStartKioskCardPayment from "../useStartKioskCardPayment";
import BlockingLoadingModal from "@/components/BlockingLoadingModal";

const PaymentRoute = () => {
  const [selectedMethod, setSelectedMethod] = useState("card");
  const startPayment = useStartKioskCardPayment(selectedMethod);
  const [startingPayment, setStartingPayment] = useState(false);

  const handleStartPayment = async () => {
    if (startingPayment) return;
    setStartingPayment(true);
    try {
      await startPayment();
    } catch (e) {
      setStartingPayment(false);
      throw e;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <BlockingLoadingModal open={startingPayment} text="Starting payment..." />
      <PaymentHeader />

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
          
          {/* Left Column - Payment Method */}
          <div>
            <PaymentMethodSelector
              selectedMethod={selectedMethod}
              onMethodSelect={setSelectedMethod}
            />
          </div>

          {/* Right Column - Sticky Summary Panel */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <PaymentSummaryPanel onStartPayment={handleStartPayment} disabled={startingPayment} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default PaymentRoute;
