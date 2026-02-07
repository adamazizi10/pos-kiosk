import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/utils/supabase.utils";

const USER_SESSIONS_KEY = ["userSessions"];

export const listUserSessions = async ({ userId, startDate, endDate } = {}) => {
  let query = supabase
    .from("user_sessions")
    .select(`
      *,
      profiles!user_sessions_user_id_fkey(full_name, email, role)
    `);

  if (userId) {
    query = query.eq("user_id", userId);
  }

  if (startDate) {
    query = query.gte("logged_in_at", startDate);
  }

  if (endDate) {
    query = query.lte("logged_in_at", endDate);
  }

  query = query.order("logged_in_at", { ascending: false });

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message || "Failed to load user sessions");
  }

  // Transform the data to flatten the nested relationships
  const transformedData = (data || []).map((session) => ({
    ...session,
    user_name: session.profiles?.full_name || "Unknown",
    user_email: session.profiles?.email || null,
    user_role: session.profiles?.role || null,
  }));

  return transformedData;
};

export const useUserSessionsQuery = ({ userId, startDate, endDate } = {}) =>
  useQuery({
    queryKey: [...USER_SESSIONS_KEY, { userId, startDate, endDate }],
    queryFn: () => listUserSessions({ userId, startDate, endDate }),
  });
