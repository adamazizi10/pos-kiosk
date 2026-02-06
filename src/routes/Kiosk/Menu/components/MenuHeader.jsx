import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import appConfig from "../../../../app.config.js";

const MenuHeader = () => {
  const navigate = useNavigate();
  const { store } = appConfig;
  const { header } = appConfig.mockData.kiosk;

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-6 bg-background border-b border-border">
      <button
        onClick={() => navigate("/kiosk")}
        className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors font-semibold text-lg"
      >
        <ArrowLeft size={26} />
        <span>Home</span>
      </button>

      <div className="flex-1 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-xl">{header.logoLetter}</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">{store.name}</h1>
        </div>
      </div>

      <div className="w-[100px]" />
    </header>
  );
};

export default MenuHeader;
