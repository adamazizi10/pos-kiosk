import { useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { ShoppingCart } from "lucide-react";

export const defaultCartPanelConfig = {
  topActions: {
    showSideButton: true,
    showOpenDrawerButton: true,
  },
  itemControls: {
    showIncrement: true,
    showDecrement: true,
    showClearItem: true,
  },
  checkoutAction: {
    visible: true,
    label: "Checkout",
    to: "/pos/checkout",
    requireItems: true,
    icon: ShoppingCart,
  },
};

const usePOSCartPanelConfig = (config) => {
  const { setCartPanelConfig } = useOutletContext();

  useEffect(() => {
    setCartPanelConfig(config);
    return () => setCartPanelConfig(defaultCartPanelConfig);
  }, [config, setCartPanelConfig]);
};

export default usePOSCartPanelConfig;
