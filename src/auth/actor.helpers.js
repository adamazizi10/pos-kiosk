import { useAuth } from "./AuthProvider";

export const getActorUserId = (context, { authProfile } = {}) => {
  if (["admin", "pos", "kiosk"].includes(context)) {
    return authProfile?.id || null;
  }
  return null;
};

export const useActorUserId = (context) => {
  const { profile: authProfile } = useAuth();
  return getActorUserId(context, { authProfile });
};
