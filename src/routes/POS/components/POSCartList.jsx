import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import POSCartItem from "./POSCartItem";
import appConfig from "@/app.config";
import usePosCart from "@/context/usePosCart";

const POSCartList = ({
  itemControls = { showIncrement: true, showDecrement: true, showClearItem: true },
}) => {
  const [selectedId, setSelectedId] = useState(null);
  const { pathname } = useLocation();
  const { items, lastSuccessfulTransaction } = usePosCart();
  const { cart } = appConfig.mockData.pos;
  const isSuccess = pathname.startsWith("/pos/checkout/success");
  const readOnly = !itemControls.showIncrement &&
    !itemControls.showDecrement &&
    !itemControls.showClearItem;
  useEffect(() => {
    if (readOnly || isSuccess) {
      setSelectedId(null);
    }
  }, [isSuccess, readOnly]);
  const effectiveItems =
    isSuccess && lastSuccessfulTransaction?.items?.length
      ? lastSuccessfulTransaction.items
      : items;

  if (!effectiveItems.length) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 text-center">
        <ShoppingCart className="h-12 w-12 text-muted-foreground mb-3" />
        <p className="font-medium text-foreground">{cart.emptyMessage}</p>
        <p className="text-sm text-muted-foreground">{cart.emptySubtext}</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {effectiveItems.map((item) => {
        const itemKey = item.key || item.productId;
        return (
        <POSCartItem
          key={itemKey}
          item={item}
          isSelected={selectedId === itemKey}
          onSelect={
            readOnly
              ? undefined
              : () =>
                  setSelectedId(itemKey === selectedId ? null : itemKey)
          }
          readOnly={readOnly}
          itemControls={itemControls}
        />
        );
      })}
    </div>
  );
};

export default POSCartList;
