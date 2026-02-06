import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import PinKeypad from "@/components/PinKeypad";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/utils/supabase.utils";
import { createUserSession, logout } from "@/auth/auth.service";
import { CheckCircle, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

const UserPasswordLogin = ({
  title,
  description,
  allowedRoles = [],
  redirectTo,
  loginPath,
}) => {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState([]);
  const [isLoadingProfiles, setIsLoadingProfiles] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const loadProfiles = async () => {
      setIsLoadingProfiles(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, email, role, is_active")
        .eq("is_active", true)
        .order("full_name", { ascending: true });

      if (!isMounted) return;
      if (error) {
        toast({
          title: "Failed to load users",
          description: error.message || "Unable to load user list",
          variant: "destructive",
        });
        setProfiles([]);
      } else {
        setProfiles(data || []);
      }
      setIsLoadingProfiles(false);
    };

    loadProfiles();
    return () => {
      isMounted = false;
    };
  }, []);

  const roleLabel = useMemo(() => {
    if (!selectedUser?.role) return "—";
    return selectedUser.role;
  }, [selectedUser]);

  const handleSubmit = async () => {
    if (!selectedUser) return;
    if (!selectedUser.email) {
      toast({
        title: "Missing email",
        description: "This user does not have an email on file.",
        variant: "destructive",
      });
      return;
    }

    if (!password) return;
    setIsSubmitting(true);
    let signedInUserId = null;

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: selectedUser.email,
        password,
      });

      if (error) throw new Error(error.message || "Invalid credentials");

      const userId = data?.user?.id;
      if (!userId) throw new Error("Missing user session");
      signedInUserId = userId;

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (profileError || !profile) {
        throw new Error(profileError?.message || "Failed to load profile");
      }

      if (profile.is_active === false) {
        try {
          await logout(profile.id);
        } catch (logoutError) {
          console.error("Failed to sign out inactive user", logoutError);
        }
        toast({
          title: "Account disabled",
          description: "Please contact an administrator.",
          variant: "destructive",
        });
        navigate(loginPath, { replace: true });
        return;
      }

      if (allowedRoles.length && !allowedRoles.includes(profile.role)) {
        try {
          await logout(profile.id);
        } catch (logoutError) {
          console.error("Failed to sign out unauthorized user", logoutError);
        }
        toast({
          title: "Access denied",
          description: "Your account does not have access to this area.",
          variant: "destructive",
        });
        navigate(loginPath, { replace: true });
        return;
      }

      await createUserSession(profile.id);

      toast({
        title: "Logged in",
        description: (
          <div className="flex items-center gap-2">
            <span>Welcome back</span>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </div>
        ),
        bottomLeft: true,
      });

      navigate(redirectTo, { replace: true });
    } catch (err) {
      if (signedInUserId) {
        try {
          await logout(signedInUserId);
        } catch (logoutError) {
          console.error("Failed to sign out after login error", logoutError);
        }
      }
      toast({
        title: "Login failed",
        description: err?.message || "Unable to sign in",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-3xl p-4">
      <CardHeader className="text-center pb-6">
        <CardTitle className="text-4xl">{title}</CardTitle>
        {description ? (
          <CardDescription className="text-lg mt-2">{description}</CardDescription>
        ) : null}
      </CardHeader>
      <CardContent className="space-y-6">
        {!selectedUser ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">Select your name</p>
              {isLoadingProfiles ? (
                <span className="text-xs text-muted-foreground">Loading...</span>
              ) : null}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {isLoadingProfiles ? (
                <div className="col-span-full text-center text-sm text-muted-foreground py-6">
                  Loading users...
                </div>
              ) : profiles.length === 0 ? (
                <div className="col-span-full text-center text-sm text-muted-foreground py-6">
                  No active users found.
                </div>
              ) : (
                profiles.map((profile) => (
                  <button
                    key={profile.id}
                    onClick={() => {
                      setSelectedUser(profile);
                      setPassword("");
                    }}
                    className="flex items-center justify-between gap-4 px-4 py-4 rounded-xl border border-border bg-background hover:bg-muted transition-colors text-left"
                  >
                    <div>
                      <p className="text-base font-semibold text-foreground">
                        {profile.full_name || "Unnamed User"}
                      </p>
                      <p className="text-xs text-muted-foreground">{profile.email || "No email"}</p>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {profile.role || "—"}
                    </Badge>
                  </button>
                ))
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => {
                  setSelectedUser(null);
                  setPassword("");
                }}
              >
                <ChevronLeft className="h-4 w-4" />
                Back
              </Button>
              <div className="flex items-center gap-2">
                <p className="text-base font-semibold text-foreground">
                  {selectedUser.full_name || "Unnamed User"}
                </p>
                <Badge variant="secondary" className="text-xs">
                  {roleLabel}
                </Badge>
              </div>
            </div>
            <div className="flex flex-col items-center space-y-6">
              <div
                className={cn(
                  "text-4xl font-mono select-none",
                  password ? "text-foreground tracking-[0.3em]" : "text-muted-foreground"
                )}
              >
                {password ? "•".repeat(password.length) : "Enter password"}
              </div>
              <PinKeypad
                value={password}
                onChange={setPassword}
                maxLength={64}
                large
                onEnter={password.length > 0 ? handleSubmit : undefined}
              />
              <Button
                className="w-full max-w-[420px] h-14 text-lg"
                disabled={!password || isSubmitting}
                onClick={handleSubmit}
              >
                {isSubmitting ? "Signing in..." : "Sign In"}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserPasswordLogin;
