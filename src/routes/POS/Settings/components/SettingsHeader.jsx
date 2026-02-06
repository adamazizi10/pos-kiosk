import appConfig from "@/app.config";

const SettingsHeader = () => {
  const { store } = appConfig;
  const { settings } = appConfig.mockData.pos;

  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-background">
      <div>
        <h1 className="text-sm font-semibold text-foreground">{settings.pageTitle}</h1>
        <p className="text-xs text-muted-foreground">{store.name} • {settings.terminalLabel}</p>
      </div>
      
      <div className="flex items-center gap-2">
        <span className="px-2 py-1 text-xs font-mono text-muted-foreground bg-muted rounded">
          v{settings.meta.version}
        </span>
        <span className="px-2 py-1 text-xs font-medium text-amber-600 bg-amber-500/10 rounded">
          {settings.meta.environment}
        </span>
      </div>
    </div>
  );
};

export default SettingsHeader;
