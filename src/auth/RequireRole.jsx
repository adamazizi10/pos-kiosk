import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./AuthProvider";

const RequireRole = ({ roles = ["ADMIN"], children }) => {
  const { isLoading, user, profile, session } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!session || !user) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }

  const hasAccess = profile?.role && roles.includes(profile.role);

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

export default RequireRole;
