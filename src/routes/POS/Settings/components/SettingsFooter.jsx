import appConfig from "@/app.config";

const SettingsFooter = () => {
  const { footer } = appConfig.mockData.pos.settings;

  const handleSave = () => {
    console.log("Save changes clicked");
  };

  const handleDiscard = () => {
    console.log("Discard clicked");
  };

  return (
    <div className="sticky bottom-0 px-4 py-3 border-t border-border bg-background">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">{footer.helperText}</p>
        <div className="flex items-center gap-2">
          <button
            onClick={handleDiscard}
            className="px-4 py-2 text-xs font-medium text-muted-foreground bg-muted hover:bg-muted/80 rounded-lg transition-colors"
          >
            {footer.discardText}
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg transition-colors"
          >
            {footer.saveText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsFooter;
