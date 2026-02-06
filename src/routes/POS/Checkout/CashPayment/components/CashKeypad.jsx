import { Delete } from "lucide-react";

const CashKeypad = ({ onKeyPress }) => {
  const keys = [
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"],
    [".", "0", "backspace"],
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {keys.flat().map((key) => (
        <button
          key={key}
          onClick={() => onKeyPress(key)}
          className={`h-20 rounded-lg transition-colors text-2xl font-semibold ${
            key === "backspace"
              ? "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              : "bg-muted text-foreground hover:bg-accent hover:text-accent-foreground active:bg-primary active:text-primary-foreground"
          }`}
        >
          {key === "backspace" ? <Delete className="h-6 w-6 mx-auto" /> : key}
        </button>
      ))}
    </div>
  );
};

export default CashKeypad;
