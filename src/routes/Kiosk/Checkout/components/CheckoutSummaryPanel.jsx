import { formatMoney } from "@/utils/money";

const CartSummaryPanel = ({ subtotalCents, taxCents, totalCents }) => {
  return (
    <div className="bg-card rounded-2xl border border-border p-5">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-medium text-foreground">{formatMoney(subtotalCents)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">HST 13%</span>
          <span className="font-medium text-foreground">{formatMoney(taxCents)}</span>
        </div>
        <div className="border-t border-border pt-3">
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-foreground">Total</span>
            <span className="text-xl font-bold text-foreground">{formatMoney(totalCents)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartSummaryPanel;
