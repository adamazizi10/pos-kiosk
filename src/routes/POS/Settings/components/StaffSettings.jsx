import { useState } from "react";
import { User } from "lucide-react";
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

const StaffSettings = () => {
  const { staff } = appConfig.mockData.pos.settings;
  
  const [pinRequired, setPinRequired] = useState(staff.pinRequiredEnabled);
  const [shiftReminders, setShiftReminders] = useState(staff.shiftRemindersEnabled);

  const handleSwitchCashier = () => {
    console.log("Switch cashier clicked");
  };

  return (
    <div className="space-y-4">
      {/* Active Cashier */}
      <div className="flex items-center justify-between p-3 bg-muted/50 border border-border rounded-lg">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
            <User className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{staff.activeCashierLabel}</p>
            <p className="text-sm font-medium text-foreground">{staff.activeCashier}</p>
          </div>
        </div>
        <button
          onClick={handleSwitchCashier}
          className="px-3 py-1.5 text-xs font-medium text-foreground bg-secondary hover:bg-secondary/80 rounded-lg transition-colors"
        >
          {staff.switchCashierText}
        </button>
      </div>

      {/* PIN Required for Refunds */}
      <div className="flex items-center justify-between p-3 bg-muted/50 border border-border rounded-lg">
        <span className="text-sm text-foreground">{staff.pinRequiredLabel}</span>
        <ToggleSwitch enabled={pinRequired} onChange={setPinRequired} />
      </div>

      {/* Shift Reminders */}
      <div className="flex items-center justify-between p-3 bg-muted/50 border border-border rounded-lg">
        <span className="text-sm text-foreground">{staff.shiftRemindersLabel}</span>
        <ToggleSwitch enabled={shiftReminders} onChange={setShiftReminders} />
      </div>
    </div>
  );
};

export default StaffSettings;
