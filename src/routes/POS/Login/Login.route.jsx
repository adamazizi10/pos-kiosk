import SharedHeader from "@/components/SharedHeader";
import UserPasswordLogin from "@/components/UserPasswordLogin";

const POSLoginRoute = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SharedHeader />
      
      <div className="flex-1 flex items-center justify-center p-8">
        <UserPasswordLogin
          title="POS Login"
          description="Select your name and enter your password."
          allowedRoles={["ADMIN", "EMPLOYEE"]}
          redirectTo="/pos"
          loginPath="/pos/login"
        />
      </div>
    </div>
  );
};

export default POSLoginRoute;
