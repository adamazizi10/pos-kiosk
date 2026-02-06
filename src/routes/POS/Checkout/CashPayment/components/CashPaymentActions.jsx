const CashPaymentActions = ({
  completeLabel,
  cancelLabel,
  onComplete,
  onCancel,
  onPayRestWithCard,
  showPayRestWithCard,
  disableComplete,
  disablePayRestWithCard,
}) => {
  return (
    <div className="grid grid-cols-5 gap-3">
      {/* Clear — always 20% */}
      <button
        onClick={onCancel}
        className="col-span-1 h-[68px] rounded-xl bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors font-medium border border-border"
      >
        Clear
      </button>

      {/* Pay rest with card — 40% when shown */}
      {showPayRestWithCard && (
        <button
          onClick={onPayRestWithCard}
          disabled={disablePayRestWithCard}
          className="col-span-2 h-[68px] rounded-xl bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors font-medium border border-border disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Pay The Rest with card
        </button>
      )}

      {/* Complete — 80% or 40% depending on layout */}
      <button
        onClick={onComplete}
        disabled={disableComplete}
        className={`h-[68px] rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed ${
          showPayRestWithCard ? "col-span-2" : "col-span-4"
        }`}
      >
        {completeLabel}
      </button>
    </div>
  );
};

export default CashPaymentActions;
