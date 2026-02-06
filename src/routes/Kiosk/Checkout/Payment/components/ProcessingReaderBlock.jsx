import { CreditCard, Wifi, CreditCard as ChipIcon } from 'lucide-react';
import appConfig from '../../../../../app.config.js';

const ProcessingReaderBlock = () => {
  const { processing } = appConfig.mockData.kiosk;

  return (
    <div className="w-full max-w-lg bg-card border border-border rounded-xl shadow-sm p-10">
      {/* Title */}
      <h1 className="text-3xl font-bold text-foreground text-center mb-10">
        Ready for Payment
      </h1>

      {/* Visual instruction row */}
      <div className="flex justify-center gap-10 mb-10">
        <div className="flex flex-col items-center gap-4">
          <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center">
            <Wifi className="w-12 h-12 text-foreground" />
          </div>
          <span className="text-lg font-medium text-foreground">Tap</span>
        </div>
        <div className="flex flex-col items-center gap-4">
          <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center">
            <ChipIcon className="w-12 h-12 text-foreground" />
          </div>
          <span className="text-lg font-medium text-foreground">Insert</span>
        </div>
        <div className="flex flex-col items-center gap-4">
          <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center">
            <CreditCard className="w-12 h-12 text-foreground" />
          </div>
          <span className="text-lg font-medium text-foreground">Swipe</span>
        </div>
      </div>

      {/* Accepted methods */}
      <div className="flex flex-wrap justify-center gap-3">
        {processing.acceptedCards.map((method) => (
          <span
            key={method}
            className="px-4 py-2 rounded-full bg-muted text-muted-foreground text-base font-medium"
          >
            {method}
          </span>
        ))}
      </div>
    </div>
  );
};

export default ProcessingReaderBlock;
