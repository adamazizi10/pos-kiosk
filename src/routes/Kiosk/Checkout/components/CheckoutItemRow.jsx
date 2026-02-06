import { Minus, Plus, Trash2 } from "lucide-react";
import { formatMoney } from "@/utils/money";

const CartItemRow = ({ item, quantity, onIncrement, onDecrement, onRemove }) => {
  const optionEntries = item.selectedOptions
    ? Object.entries(item.selectedOptions)
    : [];

  return (
    <div className="flex gap-4 p-4 bg-card rounded-2xl border border-border">
      <div className="w-20 h-20 rounded-xl bg-muted overflow-hidden flex-shrink-0">
        <img 
          src={item.image_url || item.image || "/placeholder.svg"}
          alt={item.name}
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="font-semibold text-foreground text-lg truncate">{item.name}</h3>
            {optionEntries.length > 0 ? (
              <div className="text-muted-foreground text-sm mt-0.5 space-y-1">
                {optionEntries.map(([k, v]) => (
                  <p key={k} className="truncate capitalize">
                    {k}: {v}
                  </p>
                ))}
              </div>
            ) : null}
          </div>
          <button 
            onClick={() => onRemove?.(item)}
            className="w-10 h-10 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors flex items-center justify-center flex-shrink-0"
          >
            <Trash2 size={18} />
          </button>
        </div>
        
        <div className="flex items-center justify-between mt-3">
          <span className="text-lg font-bold text-foreground">
            {formatMoney(item.unitPriceCents)}
          </span>
          
          <div className="flex items-center gap-1 bg-secondary rounded-xl">
            <button 
              onClick={() => onDecrement?.(item)}
              className="w-12 h-12 rounded-xl text-secondary-foreground hover:bg-secondary/80 transition-colors flex items-center justify-center"
            >
              <Minus size={20} />
            </button>
            <span className="w-8 text-center font-semibold text-foreground text-lg">
              {quantity}
            </span>
            <button 
              onClick={() => onIncrement?.(item)}
              className="w-12 h-12 rounded-xl text-secondary-foreground hover:bg-secondary/80 transition-colors flex items-center justify-center"
            >
              <Plus size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItemRow;
