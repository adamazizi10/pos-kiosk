import { AlertCircle } from "lucide-react";

const FailureIcon = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="relative">
        <div className="absolute inset-0 bg-red-500/20 rounded-full blur-2xl scale-150" />
        <div className="relative bg-red-500/10 rounded-full p-6">
          <AlertCircle className="w-20 h-20 text-red-500" strokeWidth={1.5} />
        </div>
      </div>
    </div>
  );
};

export default FailureIcon;
