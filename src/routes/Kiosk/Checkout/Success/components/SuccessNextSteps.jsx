import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const SuccessNextSteps = ({ onNewOrder }) => {
  const navigate = useNavigate();

  return (
    <div className="text-center">
      <Button 
        variant="outline" 
        size="lg"
        className="gap-3 min-h-[80px] px-12 text-xl font-semibold"
        onClick={() => {
          onNewOrder?.();
          navigate("/kiosk");
        }}
      >
        Start New Order
        <ArrowRight className="w-6 h-6" />
      </Button>
    </div>
  );
};

export default SuccessNextSteps;
