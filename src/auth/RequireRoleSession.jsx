import { useEffect, useMemo, useState } from "react";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { toast } from "@/components/ui/use-toast";

const RequireRoleSession = ({ roles = [], redirectTo = "/admin/login", children }) => {
  const { isLoading, session, profile, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isBlocking, setIsBlocking] = useState(false);

  const hasAccess = useMemo(() => {
    if (!profile?.role) return false;
    if (profile?.is_active === false) return false;
    if (!roles?.length) return true;
    return roles.includes(profile.role);
  }, [profile, roles]);

  useEffect(() => {
    if (isLoading || isBlocking) return;
    if (!session) return;
    if (!profile || !hasAccess) {
      setIsBlocking(true);
      toast({
        title: "Access denied",
        description: "Your account does not have access to this area.",
        variant: "destructive",
      });
      signOut()
        .catch((err) => console.error("Failed to sign out", err))
        .finally(() => {
          navigate(redirectTo, { replace: true, state: { from: location.pathname } });
        });
    }
  }, [
    isLoading,
    isBlocking,
    session,
    profile,
    hasAccess,
    navigate,
    redirectTo,
    location.pathname,
    signOut,
  ]);

  if (isLoading || isBlocking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!session) {
    return <Navigate to={redirectTo} replace state={{ from: location.pathname }} />;
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-2">
          <p className="text-xl font-semibold">Not authorized</p>
          <p className="text-sm text-muted-foreground">
            You do not have access to this page.
          </p>
        </div>
      </div>
    );
  }

  return children || <Outlet />;
};

export default RequireRoleSession;
