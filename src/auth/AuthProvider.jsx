import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "@/utils/supabase.utils";
import { toast } from "@/components/ui/use-toast";
import { logout } from "./auth.service";

const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const signOut = async () => {
    await logout(user?.id);
  };

  useEffect(() => {
    let isMounted = true;

    const loadProfile = async (userId) => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (!isMounted) return null;

      if (error || !data) {
        toast({
          title: "Profile missing",
          description: "Please sign in again.",
          variant: "destructive",
        });
        try {
          await logout(userId);
        } catch (err) {
          console.error("Failed to sign out after missing profile", err);
        }
        return null;
      }

      return data;
    };

    const fetchSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (!isMounted) return;

        if (error) {
          console.error("Error fetching session", error);
        }

        const nextSession = data?.session || null;
        setSession(nextSession);
        setUser(nextSession?.user || null);
        if (!nextSession?.user) {
          setProfile(null);
          setIsLoading(false);
          return;
        }

        const nextProfile = await loadProfile(nextSession.user.id);
        if (!isMounted) return;
        setProfile(nextProfile);
        setIsLoading(false);
      } catch (err) {
        if (isMounted) {
          console.error("Unexpected error fetching session", err);
          setIsLoading(false);
        }
      }
    };

    fetchSession();

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, nextSession) => {
        setSession(nextSession);
        setUser(nextSession?.user || null);
        if (!nextSession?.user) {
          setProfile(null);
          setIsLoading(false);
          return;
        }

        setIsLoading(true);
        loadProfile(nextSession.user.id)
          .then((nextProfile) => {
            if (isMounted) {
              setProfile(nextProfile);
            }
          })
          .finally(() => {
            if (isMounted) {
              setIsLoading(false);
            }
          });
      }
    );

    return () => {
      isMounted = false;
      subscription?.subscription?.unsubscribe();
    };
  }, []);

  const value = useMemo(
    () => ({
      session,
      user,
      profile,
      isLoading,
      signOut,
    }),
    [session, user, profile, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthProvider;
