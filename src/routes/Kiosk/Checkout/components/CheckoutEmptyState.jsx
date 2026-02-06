import { ShoppingCart } from "lucide-react";

const CartEmptyState = ({ onBrowseMenu }) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
      <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-6">
        <ShoppingCart size={40} className="text-muted-foreground" />
      </div>
      <h2 className="text-2xl font-bold text-foreground mb-2">Your cart is empty</h2>
      <p className="text-muted-foreground text-center mb-8">Add some items to get started.</p>
      <button 
        onClick={onBrowseMenu}
        className="px-8 py-4 rounded-2xl bg-primary text-primary-foreground font-semibold text-lg hover:bg-primary/90 transition-colors min-h-[56px]"
      >
        Browse menu
      </button>
    </div>
  );
};

export default CartEmptyState;
