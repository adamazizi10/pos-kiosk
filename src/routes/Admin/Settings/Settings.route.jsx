import SettingsHeader from "./components/SettingsHeader";
import SettingsTabs from "./components/SettingsTabs";
import SettingsFooter from "./components/SettingsFooter";

const SettingsRoute = () => {
  const handleSave = () => {
    // UI only
  };

  const handleReset = () => {
    // UI only
  };

  return (
    <div className="flex h-full flex-col gap-6 p-6">
      <SettingsHeader />
      <div className="flex-1 overflow-auto">
        <SettingsTabs />
      </div>
      <SettingsFooter onSave={handleSave} onReset={handleReset} />
    </div>
  );
};

export default SettingsRoute;
