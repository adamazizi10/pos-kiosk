import { Button } from "@/components/ui/button";
import useKioskCart from "@/context/useKioskCart";
import { formatMoney } from "@/utils/money";

const TAX_RATE = 0.13;

const PaymentSummaryPanel = ({ onStartPayment, disabled = false }) => {
  const { subtotalCents } = useKioskCart();

  const taxCents = Math.round(subtotalCents * TAX_RATE);
  const totalCents = subtotalCents + taxCents;

  const handleStartPayment = () => {
    onStartPayment?.();
  };

  return (
    <div className="space-y-5">
      {/* Summary Container */}
      <div className="bg-card rounded-2xl border border-border p-5 space-y-5">
        {/* Summary Title */}
        <h2 className="text-lg font-semibold text-foreground">
          Order Summary
        </h2>

        {/* Summary Lines */}
        <div className="space-y-3">
          <div className="flex justify-between text-foreground">
            <span>Subtotal</span>
            <span>{formatMoney(subtotalCents)}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>HST 13%</span>
            <span>{formatMoney(taxCents)}</span>
          </div>
          <div className="border-t border-border pt-3 flex justify-between text-lg font-bold text-foreground">
            <span>Total</span>
            <span>{formatMoney(totalCents)}</span>
          </div>
        </div>
      </div>

      {/* CTAs - Outside container */}
      <div className="space-y-4">
        <Button
          size="lg"
          className="w-full h-20 text-xl font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleStartPayment}
          disabled={disabled}
        >
          Start Payment
        </Button>
      </div>
    </div>
  );
};

export default PaymentSummaryPanel;
