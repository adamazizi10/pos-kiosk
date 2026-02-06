import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/utils/supabase.utils";

const CATEGORY_KEY = ["categories"];

export const listCategories = async () => {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(error.message || "Failed to load categories");
  }

  return data || [];
};

export const createCategory = async (payload) => {
  const insertPayload = {
    name: payload.name,
    sort_order: payload.sort_order ?? 0,
    is_active: payload.is_active ?? true,
    availability: payload.availability ?? "ALL_DEVICES_CATEGORY",
  };

  const { data, error } = await supabase
    .from("categories")
    .insert(insertPayload)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message || "Failed to create category");
  }

  return data;
};

export const updateCategory = async (id, payload) => {
  const updatePayload = {
    name: payload.name,
    sort_order: payload.sort_order ?? 0,
    is_active: payload.is_active ?? true,
    availability: payload.availability ?? "ALL_DEVICES_CATEGORY",
  };

  const { data, error } = await supabase
    .from("categories")
    .update(updatePayload)
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message || "Failed to update category");
  }

  return data;
};

export const deleteCategory = async (id) => {
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) {
    throw new Error(error.message || "Failed to delete category");
  }
  return true;
};

export const useCategoriesQuery = () =>
  useQuery({
    queryKey: CATEGORY_KEY,
    queryFn: listCategories,
  });

export const useCreateCategoryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORY_KEY });
    },
  });
};

export const useDeleteCategoryMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORY_KEY });
    },
  });
};

export const useUpdateCategoryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }) => updateCategory(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORY_KEY });
    },
  });
};
