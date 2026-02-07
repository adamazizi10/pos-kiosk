import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/utils/supabase.utils";

const CASH_DRAWER_EVENTS_KEY = ["cashDrawerEvents"];

export const listCashDrawerEvents = async ({
  cashDrawerId,
  type,
  startDate,
  endDate
} = {}) => {
  let query = supabase
    .from("cash_drawer_events")
    .select(`
      *,
      cash_drawers!cash_drawer_events_drawer_fk(label),
      profiles!cash_drawer_events_user_fk(full_name)
    `);

  if (cashDrawerId) {
    query = query.eq("cash_drawer_id", cashDrawerId);
  }

  if (type) {
    query = query.eq("type", type);
  }

  if (startDate) {
    query = query.gte("created_at", startDate);
  }

  if (endDate) {
    query = query.lte("created_at", endDate);
  }

  query = query.order("created_at", { ascending: false });

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message || "Failed to load cash drawer events");
  }

  // Transform the data to flatten the nested relationships
  const transformedData = (data || []).map((event) => ({
    ...event,
    drawer_label: event.cash_drawers?.label || "Unknown",
    user_name: event.profiles?.full_name || null,
  }));

  return transformedData;
};

export const createCashDrawerEvent = async (payload) => {
  const insertPayload = {
    cash_drawer_id: payload.cash_drawer_id,
    type: payload.type,
    delta_cents: payload.delta_cents,
    reason: payload.reason || null,
    user_id: payload.user_id || null,
  };

  const { data, error } = await supabase
    .from("cash_drawer_events")
    .insert(insertPayload)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message || "Failed to create cash drawer event");
  }

  return data;
};

export const useCashDrawerEventsQuery = ({
  cashDrawerId,
  type,
  startDate,
  endDate
} = {}) =>
  useQuery({
    queryKey: [...CASH_DRAWER_EVENTS_KEY, { cashDrawerId, type, startDate, endDate }],
    queryFn: () => listCashDrawerEvents({ cashDrawerId, type, startDate, endDate }),
  });

export const useCreateCashDrawerEventMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCashDrawerEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CASH_DRAWER_EVENTS_KEY });
    },
  });
};
