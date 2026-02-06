import { useState } from "react";
import { ChevronDown } from "lucide-react";
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

const ReceiptsSettings = () => {
  const { receipts } = appConfig.mockData.pos.settings;
  
  const [defaultMethod, setDefaultMethod] = useState("print");
  const [autoPrint, setAutoPrint] = useState(receipts.autoPrintEnabled);
  const [showOrderNumber, setShowOrderNumber] = useState(receipts.showOrderNumberEnabled);
  const [footerText, setFooterText] = useState(receipts.footerTextPlaceholder);

  return (
    <div className="space-y-4">
      {/* Default Receipt Method */}
      <div>
        <label className="block text-xs font-medium text-muted-foreground mb-1.5">
          {receipts.defaultMethodLabel}
        </label>
        <div className="relative">
          <select
            value={defaultMethod}
            onChange={(e) => setDefaultMethod(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary"
          >
            {receipts.methodOptions.map((option) => (
              <option key={option.id} value={option.id}>{option.label}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        </div>
      </div>

      {/* Auto-print */}
      <div className="flex items-center justify-between p-3 bg-muted/50 border border-border rounded-lg">
        <span className="text-sm text-foreground">{receipts.autoPrintLabel}</span>
        <ToggleSwitch enabled={autoPrint} onChange={setAutoPrint} />
      </div>

      {/* Show Order Number */}
      <div className="flex items-center justify-between p-3 bg-muted/50 border border-border rounded-lg">
        <span className="text-sm text-foreground">{receipts.showOrderNumberLabel}</span>
        <ToggleSwitch enabled={showOrderNumber} onChange={setShowOrderNumber} />
      </div>

      {/* Footer Text */}
      <div>
        <label className="block text-xs font-medium text-muted-foreground mb-1.5">
          {receipts.footerTextLabel}
        </label>
        <textarea
          value={footerText}
          onChange={(e) => setFooterText(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg resize-none focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>
    </div>
  );
};

export default ReceiptsSettings;
