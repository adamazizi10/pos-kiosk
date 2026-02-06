import appConfig from "@/app.config";

const SuccessCustomerInfo = ({ customerName }) => {
  const { success } = appConfig.mockData.kiosk;
  const name = customerName || success.customerName;

  return (
    <div className="text-center">
      <p className="text-3xl text-foreground">
        <span className="text-muted-foreground">{success.orderForLabel} </span>
        <span className="font-bold">{name}</span>
      </p>
    </div>
  );
};

export default SuccessCustomerInfo;
