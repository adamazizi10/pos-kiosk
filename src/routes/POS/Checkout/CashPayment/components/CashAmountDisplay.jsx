import { X } from "lucide-react";

const CashAmountDisplay = ({ label, value, onClear }) => {
  return (
    <div className="flex items-center gap-4">
      {/* X button on the left */}
      <button
        onClick={onClear}
        className="p-3 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
        title="Clear"
      >
        <X className="h-6 w-6" />
      </button>
      
      {/* Cash received label and value */}
      <div className="flex-1">
        <span className="text-sm text-muted-foreground">{label}</span>
        <div className="text-5xl font-bold text-foreground mt-2 font-mono">
          {value}
        </div>
      </div>
    </div>
  );
};

export default CashAmountDisplay;
