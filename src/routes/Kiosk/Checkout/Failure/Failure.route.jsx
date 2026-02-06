import appConfig from "@/app.config";
import FailureIcon from "./components/FailureIcon";
import FailureActions from "./components/FailureActions";

const FailureRoute = () => {
  const { failure } = appConfig.mockData.kiosk;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Main content - centered */}
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-lg space-y-10 text-center">
          {/* Failure icon */}
          <FailureIcon />

          {/* Headline */}
          <h1 className="text-5xl font-bold text-foreground">
            {failure.headline}
          </h1>

          {/* Action buttons */}
          <FailureActions />
        </div>
      </main>
    </div>
  );
};

export default FailureRoute;
