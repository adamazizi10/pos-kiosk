import { useMemo, useState } from "react";
import SettingsHeader from "./components/SettingsHeader";
import SettingsTabs from "./components/SettingsTabs";
import GeneralSettings from "./components/GeneralSettings";
import PaymentsSettings from "./components/PaymentsSettings";
import ReceiptsSettings from "./components/ReceiptsSettings";
import HardwareSettings from "./components/HardwareSettings";
import StaffSettings from "./components/StaffSettings";
import AboutSettings from "./components/AboutSettings";
import SettingsFooter from "./components/SettingsFooter";
import usePOSCartPanelConfig, { defaultCartPanelConfig } from "@/routes/POS/hooks/usePOSCartPanelConfig";

const SettingsRoute = () => {
  const [activeTab, setActiveTab] = useState("general");
  const cartPanelConfig = useMemo(() => defaultCartPanelConfig, []);

  usePOSCartPanelConfig(cartPanelConfig);

  const renderTabContent = () => {
    switch (activeTab) {
      case "general":
        return <GeneralSettings />;
      case "payments":
        return <PaymentsSettings />;
      case "receipts":
        return <ReceiptsSettings />;
      case "hardware":
        return <HardwareSettings />;
      case "staff":
        return <StaffSettings />;
      case "about":
        return <AboutSettings />;
      default:
        return <GeneralSettings />;
    }
  };

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden">
      {/* Header */}
      <SettingsHeader />

      {/* Tabs */}
      <SettingsTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {renderTabContent()}
      </div>

      {/* Footer */}
      <SettingsFooter />
    </div>
  );
};

export default SettingsRoute;
