import { ExternalLink } from "lucide-react";
import appConfig from "@/app.config";

const AboutSettings = () => {
  const { about } = appConfig.mockData.pos.settings;

  const handleLinkClick = (link) => {
    console.log(`${link} clicked`);
  };

  return (
    <div className="space-y-4">
      {/* App Info Card */}
      <div className="p-4 bg-muted/50 border border-border rounded-lg">
        <h3 className="text-lg font-semibold text-foreground mb-4">{about.appName}</h3>
        
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{about.versionLabel}</span>
            <span className="font-mono text-foreground">{about.version}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{about.buildLabel}</span>
            <span className="text-foreground">{about.build}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{about.licenseLabel}</span>
            <span className="text-foreground">{about.licenseValue}</span>
          </div>
        </div>
      </div>

      {/* Support */}
      <div className="p-4 bg-muted/50 border border-border rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{about.supportLabel}</p>
            <p className="text-sm font-medium text-primary">{about.supportLink}</p>
          </div>
          <ExternalLink className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>

      {/* Legal Links */}
      <div className="flex gap-2">
        <button
          onClick={() => handleLinkClick("Terms")}
          className="flex-1 px-4 py-2 text-xs font-medium text-muted-foreground bg-muted hover:bg-muted/80 rounded-lg transition-colors"
        >
          {about.termsText}
        </button>
        <button
          onClick={() => handleLinkClick("Privacy")}
          className="flex-1 px-4 py-2 text-xs font-medium text-muted-foreground bg-muted hover:bg-muted/80 rounded-lg transition-colors"
        >
          {about.privacyText}
        </button>
      </div>
    </div>
  );
};

export default AboutSettings;
