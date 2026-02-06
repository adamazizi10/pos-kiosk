import { ShoppingCart } from "lucide-react";
import usePosCart from "@/context/usePosCart";

const POSCartActions = ({ checkoutAction, onCheckoutAction }) => {
  const { items } = usePosCart();

  if (!checkoutAction?.visible) return null;

  const Icon = checkoutAction.icon || ShoppingCart;
  const disabled =
    checkoutAction.requireItems && items.length === 0;

  return (
    <div className="px-4 py-4 border-t border-border">
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={onCheckoutAction}
          disabled={disabled}
          className="col-span-2 h-20 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-bold text-xl flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Icon className="h-7 w-7" />
          {checkoutAction.label}
        </button>
      </div>
    </div>
  );
};

export default POSCartActions;
