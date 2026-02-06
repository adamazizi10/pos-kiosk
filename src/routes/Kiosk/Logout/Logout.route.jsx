import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/auth/AuthProvider";
import { logout } from "@/auth/auth.service";
import appConfig from "@/app.config";

const KioskLogoutRoute = () => {
  const { store, mockData } = appConfig;
  const { header } = mockData.kiosk;
  const navigate = useNavigate();
  const { profile } = useAuth();

  const handleLogout = async () => {
    try {
      await logout(profile?.id);
    } catch (err) {
      console.error("Failed to sign out", err);
    }
    navigate("/kiosk/login", { replace: true });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="flex items-center justify-center px-8 py-6 bg-background border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-xl">{header.logoLetter}</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">{store.name}</h1>
            <p className="text-sm text-muted-foreground">{store.tagline}</p>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center">
        <div className="flex gap-10">
          <button
            onClick={handleLogout}
            className="flex flex-col items-center gap-8 p-16 bg-background rounded-3xl border-2 border-border hover:border-primary hover:bg-primary/5 transition-all duration-200 group min-w-[320px]"
          >
            <div className="w-28 h-28 rounded-full bg-secondary flex items-center justify-center group-hover:bg-primary/10 transition-colors">
              <LogOut size={56} className="text-foreground" />
            </div>
            <span className="text-4xl font-semibold text-foreground">Log out</span>
          </button>
        </div>
      </main>
    </div>
  );
};

export default KioskLogoutRoute;
