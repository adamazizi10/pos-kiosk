import { ArrowLeft } from "lucide-react";

const CartHeader = ({ onBack, title = "Your Cart" }) => {
  return (
    <header className="sticky top-0 z-50 grid grid-cols-3 items-center px-6 py-4 bg-background border-b border-border">
      <div className="flex items-center">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-3 px-5 py-3 rounded-xl bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors text-lg font-semibold"
        >
          <ArrowLeft size={28} />
          <span>Back to Menu</span>
        </button>
      </div>

      <h1 className="text-2xl font-bold text-foreground text-center">{title}</h1>

      <div />
    </header>
  );
};

export default CartHeader;
