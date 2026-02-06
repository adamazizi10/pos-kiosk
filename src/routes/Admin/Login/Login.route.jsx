import { useLocation } from "react-router-dom";
import SharedHeader from "@/components/SharedHeader";
import UserPasswordLogin from "@/components/UserPasswordLogin";

const AdminLoginRoute = () => {
  const location = useLocation();
  const redirectTo = location.state?.from || "/admin";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SharedHeader />
      
      <div className="flex-1 flex items-center justify-center p-6">
        <UserPasswordLogin
          title="Admin Login"
          description="Select your name and enter your password."
          allowedRoles={["ADMIN"]}
          redirectTo={redirectTo}
          loginPath="/admin/login"
        />
      </div>
    </div>
  );
};

export default AdminLoginRoute;
