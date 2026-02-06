import { useLocation } from "react-router-dom";
import usePosCart from "@/context/usePosCart";
import { formatMoney } from "@/utils/money";

const POSCartSummary = () => {
  const { subtotalLabel, taxLabel, cashSelectedCents, totalCents, lastSuccessfulTransaction } =
    usePosCart();
  const { pathname } = useLocation();
  const isSuccess = pathname.startsWith("/pos/checkout/success");
  const snapshot = isSuccess ? lastSuccessfulTransaction : null;

  const subtotalValue = snapshot?.subtotalCents ?? null;
  const taxValue = snapshot?.taxCents ?? null;
  const effectiveTotal = snapshot?.totalCents ?? totalCents;
  const effectiveSubtotalLabel =
    subtotalValue != null ? formatMoney(subtotalValue) : subtotalLabel;
  const effectiveTaxLabel = taxValue != null ? formatMoney(taxValue) : taxLabel;
  const effectiveTotalLabel = formatMoney(effectiveTotal);

  const cashCents = snapshot?.cashGivenCents ?? cashSelectedCents;
  const isSplit = snapshot?.paymentMethod === "CASH + CARD";
  const cardCents = isSplit
    ? Math.max((snapshot?.totalCents ?? effectiveTotal) - (cashCents || 0), 0)
    : snapshot?.paymentMethod === "CARD"
    ? snapshot?.totalCents ?? effectiveTotal
    : null;

  const showChange = snapshot
    ? (snapshot.cashGivenCents || 0) > effectiveTotal
    : cashSelectedCents > totalCents;
  const changeCents = snapshot
    ? Math.max((snapshot.cashGivenCents || 0) - effectiveTotal, 0)
    : Math.max(cashSelectedCents - totalCents, 0);

  return (
    <div className="px-4 py-3 border-t border-border bg-muted/50">
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="text-foreground">{effectiveSubtotalLabel}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Tax (13%)</span>
          <span className="text-foreground">{effectiveTaxLabel}</span>
        </div>
        {cardCents ? (
          <div className="flex justify-between text-sm text-blue-600">
            <span className="font-semibold">Card</span>
            <span className="font-semibold">{formatMoney(cardCents)}</span>
          </div>
        ) : null}
        {cashCents > 0 ? (
          <div className="flex justify-between text-sm text-green-600">
            <span className="font-semibold">Cash</span>
            <span className="font-semibold">{formatMoney(cashCents)}</span>
          </div>
        ) : null}
        <div className="flex justify-between text-lg font-bold pt-2 border-t border-border">
          <span className="text-foreground">Total</span>
          <span className="text-foreground">{effectiveTotalLabel}</span>
        </div>
        {showChange ? (
          <div className="flex justify-between text-sm font-semibold text-red-600">
            <span>Give Customer Back</span>
            <span>{formatMoney(changeCents)}</span>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default POSCartSummary;
