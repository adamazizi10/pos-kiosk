import { CheckCircle } from "lucide-react";

const SuccessIcon = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="relative">
        <div className="absolute inset-0 bg-green-500/20 rounded-full blur-2xl scale-150" />
        <div className="relative bg-green-500/10 rounded-full p-6">
          <CheckCircle className="w-20 h-20 text-green-500" strokeWidth={1.5} />
        </div>
      </div>
    </div>
  );
};

export default SuccessIcon;
