import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/utils/supabase.utils";
import { dollarsToCents } from "../utils/money";

const PRODUCT_KEY = ["products"];

export const listProducts = async ({ categoryId, search } = {}) => {
  let query = supabase
    .from("products")
    .select("*");

  if (categoryId) {
    query = query.eq("category_id", categoryId);
  }

  if (search) {
    const searchTerm = `%${search}%`;
    query = query.or(
      `name.ilike.${searchTerm},sku.ilike.${searchTerm}`
    );
  }

  query = query.order("created_at", { ascending: true });

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message || "Failed to load products");
  }

  return data || [];
};

export const createProduct = async (payload) => {
  const insertPayload = {
    name: payload.name,
    sku: payload.sku || null,
    category_id: payload.category_id || null,
    price_cents: dollarsToCents(payload.price),
    image_url: payload.image_url || null,
    is_active: payload.is_active ?? true,
    availability: payload.availability ?? "ALL_DEVICES_PRODUCT",
    options_schema: payload.optionsschema ?? payload.options_schema ?? {},
  };

  const { data, error } = await supabase
    .from("products")
    .insert(insertPayload)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message || "Failed to create product");
  }

  return data;
};

export const updateProduct = async (id, payload) => {
  const updatePayload = {
    name: payload.name,
    sku: payload.sku || null,
    category_id: payload.category_id || null,
    price_cents: dollarsToCents(payload.price),
    image_url: payload.image_url || null,
    is_active: payload.is_active ?? true,
    availability: payload.availability ?? "ALL_DEVICES_PRODUCT",
    options_schema: payload.optionsschema ?? payload.options_schema ?? {},
  };

  const { data, error } = await supabase
    .from("products")
    .update(updatePayload)
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message || "Failed to update product");
  }

  return data;
};

export const deleteProduct = async (id) => {
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) {
    throw new Error(error.message || "Failed to delete product");
  }
  return true;
};

export const useProductsQuery = ({ categoryId, search } = {}) =>
  useQuery({
    queryKey: [...PRODUCT_KEY, { categoryId, search }],
    queryFn: () => listProducts({ categoryId, search }),
  });

export const useCreateProductMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEY });
    },
  });
};

export const useUpdateProductMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }) => updateProduct(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEY });
    },
  });
};

export const useDeleteProductMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEY });
    },
  });
};
