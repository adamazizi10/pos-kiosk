import SharedHeader from "@/components/SharedHeader";
import UserPasswordLogin from "@/components/UserPasswordLogin";

const KioskLoginRoute = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SharedHeader />

      <div className="flex-1 flex items-center justify-center p-8">
        <UserPasswordLogin
          title="Kiosk Login"
          description="Select your name and enter your password."
          allowedRoles={["ADMIN", "KIOSK_ROLE"]}
          redirectTo="/kiosk"
          loginPath="/kiosk/login"
        />
      </div>
    </div>
  );
};

export default KioskLoginRoute;
