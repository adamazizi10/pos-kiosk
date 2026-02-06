import { Button } from '@/components/ui/button';
import appConfig from '../../../../../app.config.js';

const ProcessingHeader = () => {
  const { processing } = appConfig.mockData.kiosk;

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Cancel button */}
        <Button
          variant="ghost"
          className="h-12 px-4 rounded-full text-muted-foreground"
          onClick={() => console.log('Cancel payment')}
        >
          {processing.cancelText}
        </Button>

        {/* Title */}
        <h1 className="text-xl font-bold text-foreground">
          Payment
        </h1>

        {/* Empty placeholder for layout balance */}
        <div className="h-12 w-12" />
      </div>
    </header>
  );
};

export default ProcessingHeader;
