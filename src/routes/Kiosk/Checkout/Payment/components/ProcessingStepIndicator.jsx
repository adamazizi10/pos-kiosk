import appConfig from '../../../../../app.config.js';

const ProcessingStepIndicator = ({ currentStep = 0 }) => {
  const { processing } = appConfig.mockData.kiosk;

  return (
    <div className="flex items-center justify-center gap-4">
      {processing.steps.map((step, index) => {
        const isActive = index === currentStep;
        const isComplete = index < currentStep;

        return (
          <div key={step} className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div
                className={`
                  w-4 h-4 rounded-full transition-colors
                  ${isActive ? 'bg-primary animate-pulse' : isComplete ? 'bg-primary' : 'bg-muted'}
                `}
              />
              <span
                className={`
                  text-base font-semibold transition-colors
                  ${isActive ? 'text-foreground' : 'text-muted-foreground'}
                `}
              >
                {step}
              </span>
            </div>
            {index < processing.steps.length - 1 && (
              <div className="w-10 h-0.5 bg-muted" />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ProcessingStepIndicator;
