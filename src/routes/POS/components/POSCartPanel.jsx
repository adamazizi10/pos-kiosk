import { useNavigate } from "react-router-dom";
import POSCartHeader from "./POSCartHeader";
import POSCartList from "./POSCartList";
import POSCartSummary from "./POSCartSummary";
import POSCartActions from "./POSCartActions";
import { defaultCartPanelConfig } from "@/routes/POS/hooks/usePOSCartPanelConfig";
import usePosCart from "@/context/usePosCart";

const POSCartPanel = ({ config = defaultCartPanelConfig }) => {
  const navigate = useNavigate();
  const { setCashSelectedCents } = usePosCart();
  const topActions = config?.topActions || defaultCartPanelConfig.topActions;
  const itemControls = config?.itemControls || defaultCartPanelConfig.itemControls;
  const checkoutAction = config?.checkoutAction || defaultCartPanelConfig.checkoutAction;
  const handleCheckoutAction = () => {
    if (checkoutAction.onClick) {
      checkoutAction.onClick();
      return;
    }
    if (checkoutAction.clearCashOnNavigate) {
      setCashSelectedCents(0);
    }
    navigate(checkoutAction.to);
  };

  return (
    <aside className="flex flex-col h-full bg-background border-l border-border overflow-hidden">
      <POSCartHeader topActions={topActions} />
      <POSCartList itemControls={itemControls} />
      {/* Sticky bottom section */}
      <div className="mt-auto">
        <POSCartSummary />
        <POSCartActions
          checkoutAction={checkoutAction}
          onCheckoutAction={handleCheckoutAction}
        />
      </div>
    </aside>
  );
};

export default POSCartPanel;
