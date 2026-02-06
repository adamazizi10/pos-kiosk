import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import appConfig from "@/app.config";
import { useNavigate } from "react-router-dom";

const FailureActions = () => {
  const { failure } = appConfig.mockData.kiosk;
  const navigate = useNavigate();

  return (
    <div className="w-full max-w-md mx-auto">
      <Button 
        size="lg" 
        className="w-full min-h-[80px] text-xl gap-3 font-semibold"
        onClick={() => navigate("/kiosk/checkout/select-payment-method")}
      >
        <RotateCcw className="w-6 h-6" />
        {failure.tryAgainText}
      </Button>
    </div>
  );
};

export default FailureActions;
