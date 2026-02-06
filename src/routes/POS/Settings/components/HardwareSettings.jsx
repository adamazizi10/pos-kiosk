import { useState } from "react";
import { CheckCircle, XCircle, RefreshCw } from "lucide-react";
import appConfig from "@/app.config";

const ToggleSwitch = ({ enabled, onChange }) => (
  <button
    onClick={() => onChange(!enabled)}
    className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer ${
      enabled ? "bg-primary" : "bg-muted"
    }`}
  >
    <span
      className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
        enabled ? "translate-x-5" : "translate-x-0"
      }`}
    />
  </button>
);

const HardwareSettings = () => {
  const { hardware } = appConfig.mockData.pos.settings;
  
  const [cashDrawerEnabled, setCashDrawerEnabled] = useState(hardware.cashDrawerEnabled);

  const handleTestDevice = (device) => {
    console.log(`Test ${device} clicked`);
  };

  const handleRefreshDevices = () => {
    console.log("Refresh devices clicked");
  };

  const getStatusIcon = (status) => {
    const isConnected = status === "Connected" || status === "Ready";
    return isConnected ? (
      <CheckCircle className="h-4 w-4 text-primary" />
    ) : (
      <XCircle className="h-4 w-4 text-destructive" />
    );
  };

  const getStatusColor = (status) => {
    const isConnected = status === "Connected" || status === "Ready";
    return isConnected ? "text-primary" : "text-destructive";
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-medium text-muted-foreground">{hardware.sectionTitle}</p>
        <button
          onClick={handleRefreshDevices}
          className="flex items-center gap-1.5 px-2 py-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          {hardware.refreshDevicesText}
        </button>
      </div>

      {/* Card Reader */}
      <div className="flex items-center justify-between p-3 bg-muted/50 border border-border rounded-lg">
        <div className="flex items-center gap-3">
          {getStatusIcon(hardware.cardReaderStatus)}
          <div>
            <p className="text-sm text-foreground">{hardware.cardReaderLabel}</p>
            <p className={`text-xs ${getStatusColor(hardware.cardReaderStatus)}`}>
              {hardware.cardReaderStatus}
            </p>
          </div>
        </div>
        <button
          onClick={() => handleTestDevice("card reader")}
          className="px-3 py-1.5 text-xs font-medium text-muted-foreground bg-background border border-border rounded-lg hover:bg-muted transition-colors"
        >
          {hardware.testDeviceText}
        </button>
      </div>

      {/* Printer */}
      <div className="flex items-center justify-between p-3 bg-muted/50 border border-border rounded-lg">
        <div className="flex items-center gap-3">
          {getStatusIcon(hardware.printerStatus)}
          <div>
            <p className="text-sm text-foreground">{hardware.printerLabel}</p>
            <p className={`text-xs ${getStatusColor(hardware.printerStatus)}`}>
              {hardware.printerStatus}
            </p>
          </div>
        </div>
        <button
          onClick={() => handleTestDevice("printer")}
          className="px-3 py-1.5 text-xs font-medium text-muted-foreground bg-background border border-border rounded-lg hover:bg-muted transition-colors"
        >
          {hardware.testDeviceText}
        </button>
      </div>

      {/* Cash Drawer */}
      <div className="flex items-center justify-between p-3 bg-muted/50 border border-border rounded-lg">
        <div>
          <p className="text-sm text-foreground">{hardware.cashDrawerLabel}</p>
          <p className="text-xs text-muted-foreground">
            {cashDrawerEnabled ? "Enabled" : "Disabled"}
          </p>
        </div>
        <ToggleSwitch enabled={cashDrawerEnabled} onChange={setCashDrawerEnabled} />
      </div>
    </div>
  );
};

export default HardwareSettings;
