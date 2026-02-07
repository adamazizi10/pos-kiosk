import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/utils/supabase.utils";

const CASH_DRAWER_KEY = ["cashDrawers"];

export const listCashDrawers = async () => {
  const { data, error } = await supabase
    .from("cash_drawers")
    .select("*")
    .order("updated_at", { ascending: false });

  if (error) {
    throw new Error(error.message || "Failed to load cash drawers");
  }

  return data || [];
};

export const createCashDrawer = async (payload) => {
  const insertPayload = {
    label: payload.label,
    current_balance_cents: payload.current_balance_cents ?? 0,
  };

  const { data, error } = await supabase
    .from("cash_drawers")
    .insert(insertPayload)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message || "Failed to create cash drawer");
  }

  return data;
};

export const updateCashDrawer = async (id, payload) => {
  const updatePayload = {
    label: payload.label,
    current_balance_cents: payload.current_balance_cents,
  };

  const { data, error } = await supabase
    .from("cash_drawers")
    .update(updatePayload)
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message || "Failed to update cash drawer");
  }

  return data;
};

export const deleteCashDrawer = async (id) => {
  const { error } = await supabase.from("cash_drawers").delete().eq("id", id);
  if (error) {
    throw new Error(error.message || "Failed to delete cash drawer");
  }
  return true;
};

export const useCashDrawersQuery = () =>
  useQuery({
    queryKey: CASH_DRAWER_KEY,
    queryFn: listCashDrawers,
  });

export const useCreateCashDrawerMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCashDrawer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CASH_DRAWER_KEY });
    },
  });
};

export const useUpdateCashDrawerMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }) => updateCashDrawer(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CASH_DRAWER_KEY });
    },
  });
};

export const useDeleteCashDrawerMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCashDrawer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CASH_DRAWER_KEY });
    },
  });
};
