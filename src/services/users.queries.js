import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/utils/supabase.utils";
import { listProfiles } from "./users.service";

const PROFILES_KEY = ["profiles"];
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export function useProfilesQuery() {
  return useQuery({
    queryKey: PROFILES_KEY,
    queryFn: listProfiles,
  });
}

export function useCreateProfileMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ full_name, email, password, role, is_active }) => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      console.log("admin-users:create session", session?.user?.id || "none");
      if (!session?.access_token) {
        throw new Error("No Supabase session found");
      }
      if (!SUPABASE_ANON_KEY) {
        throw new Error("Missing Supabase anon key");
      }
      const { data, error } = await supabase.functions.invoke("admin-users", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          apikey: SUPABASE_ANON_KEY,
        },
        body: {
          action: "create",
          full_name,
          email,
          password,
          role,
          is_active,
        },
      });
      if (error) throw new Error(error.message || "Failed to create user");
      if (data?.error) throw new Error(data.error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILES_KEY });
    },
  });
}

export function useUpdateProfileMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, patch }) => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      console.log("admin-users:update session", session?.user?.id || "none");
      if (!session?.access_token) {
        throw new Error("No Supabase session found");
      }
      if (!SUPABASE_ANON_KEY) {
        throw new Error("Missing Supabase anon key");
      }
      const { data, error } = await supabase.functions.invoke("admin-users", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          apikey: SUPABASE_ANON_KEY,
        },
        body: {
          action: "update",
          user_id: id,
          ...patch,
        },
      });
      if (error) throw new Error(error.message || "Failed to update user");
      if (data?.error) throw new Error(data.error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILES_KEY });
    },
  });
}

export function useDeleteProfileMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      console.log("admin-users:delete session", session?.user?.id || "none");
      if (!session?.access_token) {
        throw new Error("No Supabase session found");
      }
      if (!SUPABASE_ANON_KEY) {
        throw new Error("Missing Supabase anon key");
      }
      const { data, error } = await supabase.functions.invoke("admin-users", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          apikey: SUPABASE_ANON_KEY,
        },
        body: { action: "delete", user_id: id },
      });
      if (error) throw new Error(error.message || "Failed to delete user");
      if (data?.error) throw new Error(data.error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILES_KEY });
    },
  });
}

export function useResetProfilePasswordMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, newPassword }) => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      console.log("admin-users:reset_password session", session?.user?.id || "none");
      if (!session?.access_token) {
        throw new Error("No Supabase session found");
      }
      if (!SUPABASE_ANON_KEY) {
        throw new Error("Missing Supabase anon key");
      }
      const { data, error } = await supabase.functions.invoke("admin-users", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          apikey: SUPABASE_ANON_KEY,
        },
        body: { action: "reset_password", user_id: id, new_password: newPassword },
      });
      if (error) throw new Error(error.message || "Failed to reset password");
      if (data?.error) throw new Error(data.error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILES_KEY });
    },
  });
}
