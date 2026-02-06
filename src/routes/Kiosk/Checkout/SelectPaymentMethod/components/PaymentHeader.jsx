import { ArrowLeft } from 'lucide-react';
import { useNavigate } from "react-router-dom";

const PaymentHeader = () => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
      <div className="px-6 py-4 grid grid-cols-3 items-center">
        <div className="flex items-center">
          <button
            onClick={() => navigate("/kiosk/checkout")}
            className="inline-flex items-center gap-3 px-5 py-3 rounded-xl bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors text-lg font-semibold"
          >
            <ArrowLeft size={28} />
            <span>Back to Checkout</span>
          </button>
        </div>

        <h1 className="text-xl font-bold text-foreground text-center">
          Select Payment Method
        </h1>

        <div />
      </div>
    </header>
  );
};

export default PaymentHeader;
