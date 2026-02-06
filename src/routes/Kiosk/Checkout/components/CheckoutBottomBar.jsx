import { ArrowRight, Plus } from "lucide-react";

const CartBottomBar = ({
  onCheckout,
  onAddMore,
  disabled,
  ctaLabel,
  specialInstructions,
}) => {
  const hasInstructions = Boolean((specialInstructions || "").trim());
  return (
    <div className="space-y-4">
      <button
        onClick={onCheckout}
        disabled={disabled}
        className="w-full py-6 rounded-2xl bg-primary text-primary-foreground font-bold text-xl hover:bg-primary/90 transition-colors flex items-center justify-center gap-3 min-h-[80px] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span>{ctaLabel}</span>
        <ArrowRight size={28} />
      </button>
      <div className="space-y-2">
        <button
          onClick={onAddMore}
          className="w-full py-5 rounded-xl bg-secondary text-secondary-foreground font-semibold text-lg hover:bg-secondary/80 transition-colors flex items-center justify-center gap-2 min-h-[72px]"
        >
          {!hasInstructions && <Plus size={24} />}
          <span>{hasInstructions ? "Edit Special Instructions" : "Add Special Instructions"}</span>
        </button>
        {hasInstructions && (
          <p className="text-sm text-muted-foreground italic text-left">
            {specialInstructions}
          </p>
        )}
      </div>
    </div>
  );
};

export default CartBottomBar;
