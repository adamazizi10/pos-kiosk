import { NavLink, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { logout } from "@/auth/auth.service";
import { useAuth } from "@/auth/AuthProvider";

const navItems = [
  { label: "Dashboard", path: "/admin" },
  { label: "Transactions", path: "/admin/transactions" },
  { label: "Menu", path: "/admin/menu" },
  { label: "Users", path: "/admin/users" },
  { label: "Devices", path: "/admin/devices" },
  { label: "Settings", path: "/admin/settings" },
];

const AdminSidebar = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();

  const handleSignOut = async () => {
    try {
      await logout(profile?.id);
    } catch (err) {
      console.error("Failed to sign out", err);
    }
    navigate("/admin/login", { replace: true });
  };

  return (
    <aside className="w-64 h-screen bg-card border-r border-border flex flex-col shrink-0">
      {/* Header */}
      <div className="px-6 py-6 border-b border-border">
        <h1 className="text-xl font-semibold text-foreground">Admin</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                end={item.path === "/admin"}
                className={({ isActive }) =>
                  cn(
                    "block px-4 py-3 rounded-lg text-base font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="px-4 py-4 border-t border-border">
        <button
          onClick={handleSignOut}
          className="w-full px-4 py-3 rounded-lg text-base font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          Sign out
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
