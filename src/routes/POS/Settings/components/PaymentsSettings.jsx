import { useState } from "react";
import appConfig from "@/app.config";

const ToggleSwitch = ({ enabled, onChange, disabled }) => (
  <button
    onClick={() => !disabled && onChange(!enabled)}
    disabled={disabled}
    className={`relative w-10 h-5 rounded-full transition-colors ${
      disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
    } ${enabled ? "bg-primary" : "bg-muted"}`}
  >
    <span
      className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
        enabled ? "translate-x-5" : "translate-x-0"
      }`}
    />
  </button>
);

const PaymentsSettings = () => {
  const { payments } = appConfig.mockData.pos.settings;
  
  const [methods, setMethods] = useState(
    payments.methods.reduce((acc, m) => ({ ...acc, [m.id]: m.enabled }), {})
  );
  const [tipsEnabled, setTipsEnabled] = useState(payments.tipsEnabled);
  const [signatureEnabled, setSignatureEnabled] = useState(payments.signatureEnabled);
  const [offlineModeEnabled, setOfflineModeEnabled] = useState(payments.offlineModeEnabled);

  const toggleMethod = (id) => {
    setMethods(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-4">
      {/* Payment Methods */}
      <div>
        <p className="text-xs font-medium text-muted-foreground mb-3">{payments.sectionTitle}</p>
        <div className="space-y-2">
          {payments.methods.map((method) => (
            <label key={method.id} className="flex items-center gap-3 p-3 bg-muted/50 border border-border rounded-lg cursor-pointer">
              <input
                type="checkbox"
                checked={methods[method.id]}
                onChange={() => toggleMethod(method.id)}
                className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
              />
              <span className="text-sm text-foreground">{method.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="flex items-center justify-between p-3 bg-muted/50 border border-border rounded-lg">
        <span className="text-sm text-foreground">{payments.tipsLabel}</span>
        <ToggleSwitch enabled={tipsEnabled} onChange={setTipsEnabled} />
      </div>

      {/* Signature */}
      <div className="flex items-center justify-between p-3 bg-muted/50 border border-border rounded-lg">
        <span className="text-sm text-foreground">{payments.signatureLabel}</span>
        <ToggleSwitch enabled={signatureEnabled} onChange={setSignatureEnabled} />
      </div>

      {/* Offline Mode */}
      <div className="p-3 bg-muted/50 border border-border rounded-lg">
        <div className="flex items-center justify-between">
          <span className="text-sm text-foreground">{payments.offlineModeLabel}</span>
          <ToggleSwitch enabled={offlineModeEnabled} onChange={setOfflineModeEnabled} disabled />
        </div>
        <p className="text-xs text-muted-foreground mt-1">{payments.offlineModeHelper}</p>
      </div>
    </div>
  );
};

export default PaymentsSettings;
