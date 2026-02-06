import { useState } from "react";
import { ChevronDown } from "lucide-react";
import appConfig from "@/app.config";

const GeneralSettings = () => {
  const { store } = appConfig;
  const { general } = appConfig.mockData.pos.settings;
  
  const [timezone, setTimezone] = useState("est");
  const [language, setLanguage] = useState("en");
  const [dateFormat, setDateFormat] = useState("mdy");

  const handleResetDefaults = () => {
    console.log("Reset to defaults clicked");
  };

  return (
    <div className="space-y-4">
      {/* Store Name (Read-only) */}
      <div>
        <label className="block text-xs font-medium text-muted-foreground mb-1.5">
          {general.storeNameLabel}
        </label>
        <input
          type="text"
          value={store.name}
          readOnly
          className="w-full px-3 py-2 text-sm bg-muted border border-border rounded-lg text-muted-foreground cursor-not-allowed"
        />
      </div>

      {/* Timezone */}
      <div>
        <label className="block text-xs font-medium text-muted-foreground mb-1.5">
          {general.timezoneLabel}
        </label>
        <div className="relative">
          <select
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary"
          >
            {general.timezoneOptions.map((option) => (
              <option key={option.id} value={option.id}>{option.label}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        </div>
      </div>

      {/* Language */}
      <div>
        <label className="block text-xs font-medium text-muted-foreground mb-1.5">
          {general.languageLabel}
        </label>
        <div className="relative">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary"
          >
            {general.languageOptions.map((option) => (
              <option key={option.id} value={option.id}>{option.label}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        </div>
      </div>

      {/* Date Format */}
      <div>
        <label className="block text-xs font-medium text-muted-foreground mb-1.5">
          {general.dateFormatLabel}
        </label>
        <div className="relative">
          <select
            value={dateFormat}
            onChange={(e) => setDateFormat(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary"
          >
            {general.dateFormatOptions.map((option) => (
              <option key={option.id} value={option.id}>{option.label}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        </div>
      </div>

      {/* Reset to Defaults */}
      <div className="pt-2">
        <button
          onClick={handleResetDefaults}
          className="px-4 py-2 text-xs font-medium text-muted-foreground bg-muted hover:bg-muted/80 rounded-lg transition-colors"
        >
          {general.resetDefaultsText}
        </button>
      </div>
    </div>
  );
};

export default GeneralSettings;
