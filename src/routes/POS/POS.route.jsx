import { useState } from "react";
import { Outlet } from "react-router-dom";
import POSCartPanel from "./components/POSCartPanel";
import { defaultCartPanelConfig } from "@/routes/POS/hooks/usePOSCartPanelConfig";

const POSRoute = () => {
  const [cartPanelConfig, setCartPanelConfig] = useState(defaultCartPanelConfig);

  return (
    <div className="h-screen w-screen grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_420px] bg-background overflow-hidden">
      {/* Left Panel - Dynamic content via Outlet */}
      <Outlet context={{ setCartPanelConfig }} />

      {/* Right Panel - Cart Rail (persistent, fixed 420px) */}
      <POSCartPanel config={cartPanelConfig} />
    </div>
  );
};

export default POSRoute;
