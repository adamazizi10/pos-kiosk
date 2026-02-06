import { HelpCircle } from 'lucide-react';
import appConfig from '../../../app.config.js';

const KioskFooter = () => {
  const { footer } = appConfig.mockData.kiosk;

  return (
    <footer className="mt-auto px-8 py-6 bg-muted/50 border-t border-border">
      <div className="flex items-center justify-center gap-2 text-muted-foreground">
        <HelpCircle size={18} />
        <span className="text-sm">{footer.helpText}</span>
      </div>
    </footer>
  );
};

export default KioskFooter;
