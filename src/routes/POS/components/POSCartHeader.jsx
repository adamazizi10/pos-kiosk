import { Menu, DoorOpen, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAuth } from "@/auth/AuthProvider";
import { logout } from "@/auth/auth.service";
import { openCashDrawer } from "@/hardware";

const POSCartHeader = ({
  topActions = { showSideButton: true, showOpenDrawerButton: true },
}) => {
  const navigate = useNavigate();
  const { profile } = useAuth();

  return (
    <div className="px-4 py-4 border-b border-border">
      <div className="flex items-center justify-end gap-2">
        {/* Open Drawer */}
        {topActions.showOpenDrawerButton && (
          <button
            className="w-14 h-14 rounded-xl bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors flex items-center justify-center"
            title="Open Drawer"
            onClick={() => {
              openCashDrawer();
            }}
          >
            <DoorOpen className="h-6 w-6" />
          </button>
        )}

        {/* Menu Sidebar - matching prior behavior with added Sign-Off */}
        {topActions.showSideButton && (
          <Sheet>
            <SheetTrigger asChild>
              <button
                className="w-10 h-10 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center justify-center"
                title="Menu"
              >
                <Menu className="h-5 w-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[320px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle className="text-2xl font-bold">Menu</SheetTitle>
              </SheetHeader>
              <nav className="mt-8 flex flex-col gap-4">
                <button
                  onClick={() => navigate("/pos")}
                  className="w-full h-16 rounded-xl bg-muted text-foreground hover:bg-accent hover:text-accent-foreground transition-colors font-semibold text-lg text-left px-6 flex items-center gap-3"
                >
                  Home
                </button>
                <button
                  onClick={() => navigate("/transactions")}
                  className="w-full h-16 rounded-xl bg-muted text-foreground hover:bg-accent hover:text-accent-foreground transition-colors font-semibold text-lg text-left px-6 flex items-center gap-3"
                >
                  Transactions Page
                </button>
                <button
                  onClick={() => navigate("/active-orders")}
                  className="w-full h-16 rounded-xl bg-muted text-foreground hover:bg-accent hover:text-accent-foreground transition-colors font-semibold text-lg text-left px-6 flex items-center gap-3"
                >
                  Active Orders
                </button>
                <button
                  onClick={async () => {
                    localStorage.setItem("POS_CART_RESET", "1");
                    try {
                      await logout(profile?.id);
                    } catch (err) {
                      console.error("Failed to sign out", err);
                    }
                    navigate("/pos/login");
                  }}
                  className="w-full h-16 rounded-xl bg-muted text-foreground hover:bg-accent hover:text-accent-foreground transition-colors font-semibold text-lg text-left px-6 flex items-center gap-3"
                >
                  <LogOut className="h-5 w-5" />
                  Sign-Off
                </button>
              </nav>
            </SheetContent>
          </Sheet>
        )}
      </div>
    </div>
  );
};

export default POSCartHeader;
