import appConfig from "@/app.config";

const SuccessOrderNumber = ({ orderNumber }) => {
  const { success } = appConfig.mockData.kiosk;
  const label = success.orderNumberLabel;
  const number = orderNumber || success.orderNumber;

  return (
    <div className="text-center">
      <div className="inline-flex flex-col items-center bg-secondary rounded-2xl px-12 py-8">
        <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          {label}
        </span>
        <span className="text-6xl font-bold text-foreground tracking-tight">
          {number}
        </span>
      </div>
    </div>
  );
};

export default SuccessOrderNumber;
