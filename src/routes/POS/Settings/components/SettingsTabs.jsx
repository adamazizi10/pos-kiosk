import appConfig from "@/app.config";

const SettingsTabs = ({ activeTab, onTabChange }) => {
  const { settings } = appConfig.mockData.pos;

  return (
    <div className="flex items-center gap-1 px-4 py-2 border-b border-border bg-muted/30 overflow-x-auto">
      {settings.tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`px-4 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
            activeTab === tab.id
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default SettingsTabs;
