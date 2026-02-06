import { Plus, Minus, X } from "lucide-react";
import usePosCart from "@/context/usePosCart";
import { formatMoney } from "@/utils/money";

const POSCartItem = ({
  item,
  isSelected,
  onSelect,
  readOnly = false,
  itemControls = { showIncrement: true, showDecrement: true, showClearItem: true },
}) => {
  const { increment, decrement, remove } = usePosCart();
  const optionEntries = item.selectedOptions
    ? Object.entries(item.selectedOptions)
    : [];
  const showControls =
    itemControls.showIncrement || itemControls.showDecrement || itemControls.showClearItem;

  return (
    <div
      onClick={onSelect}
      className={`px-4 py-4 border-b border-border ${
        onSelect ? "cursor-pointer hover:bg-muted" : ""
      } transition-colors ${isSelected ? "bg-accent" : ""}`}
    >
      <div className="flex items-center gap-4">
        {/* Quantity Controls */}
        <div className="flex items-center gap-2">
          {readOnly || !showControls ? (
            <span className="w-10 text-center font-bold text-foreground text-lg">
              {item.qty}
            </span>
          ) : (
            <>
              {itemControls.showDecrement && (
                <button
                  className="w-12 h-12 rounded-xl bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground flex items-center justify-center transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    decrement(item.key || item.productId);
                  }}
                >
                  <Minus className="h-6 w-6" />
                </button>
              )}
              <span className="w-10 text-center font-bold text-foreground text-lg">
                {item.qty}
              </span>
              {itemControls.showIncrement && (
                <button
                  className="w-12 h-12 rounded-xl bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground flex items-center justify-center transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    increment(item.key || item.productId);
                  }}
                >
                  <Plus className="h-6 w-6" />
                </button>
              )}
            </>
          )}
        </div>

        {/* Item Name */}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-foreground text-base truncate">
            {item.name}
          </p>
          {optionEntries.length > 0 && (
            <div className="text-muted-foreground text-sm space-y-1 mt-1">
              {optionEntries.map(([k, v]) => (
                <p key={k} className="truncate capitalize">
                  {k}: {v}
                </p>
              ))}
            </div>
          )}
        </div>

        {/* Price */}
        <p className="font-semibold text-foreground text-base whitespace-nowrap">
          {formatMoney(item.lineTotalCents)}
        </p>

        {/* Remove Button */}
        {!readOnly && itemControls.showClearItem && (
          <button
            className="w-12 h-12 rounded-xl text-muted-foreground hover:bg-destructive hover:text-destructive-foreground flex items-center justify-center transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              remove(item.key || item.productId);
            }}
          >
            <X className="h-6 w-6" />
          </button>
        )}
      </div>
    </div>
  );
};

export default POSCartItem;
