import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/utils/supabase.utils";

const ORDERS_KEY = ["orders"];

export const listOrders = async ({
  status,
  source,
  diningOption,
  startDate,
  endDate,
  page = 1,
  limit = 10,
} = {}) => {
  let query = supabase
    .from("orders")
    .select(`
      *,
      order_items(
        id,
        name_snapshot,
        unit_price_cents_snapshot,
        qty,
        line_total_cents,
        selected_options
      )
    `, { count: 'exact' });

  if (status) {
    query = query.eq("status", status);
  }

  if (source) {
    query = query.eq("source", source);
  }

  if (diningOption) {
    query = query.eq("dining_option", diningOption);
  }

  if (startDate) {
    query = query.gte("created_at", startDate);
  }

  if (endDate) {
    query = query.lte("created_at", endDate);
  }

  // Pagination
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  query = query
    .order("created_at", { ascending: false })
    .range(from, to);

  const { data, error, count } = await query;

  if (error) {
    throw new Error(error.message || "Failed to load orders");
  }

  return {
    orders: data || [],
    totalCount: count || 0,
    totalPages: Math.ceil((count || 0) / limit),
  };
};

export const getOrderDetails = async (orderId) => {
  const { data, error } = await supabase
    .from("orders")
    .select(`
      *,
      order_items(
        id,
        name_snapshot,
        unit_price_cents_snapshot,
        qty,
        line_total_cents,
        selected_options
      ),
      payments(
        id,
        method,
        amount_cents,
        status,
        created_at
      )
    `)
    .eq("id", orderId)
    .single();

  if (error) {
    throw new Error(error.message || "Failed to load order details");
  }

  return data;
};

export const useOrdersQuery = ({
  status,
  source,
  diningOption,
  startDate,
  endDate,
  page = 1,
  limit = 10,
} = {}) =>
  useQuery({
    queryKey: [...ORDERS_KEY, { status, source, diningOption, startDate, endDate, page, limit }],
    queryFn: () => listOrders({ status, source, diningOption, startDate, endDate, page, limit }),
  });

export const useOrderDetailsQuery = (orderId) =>
  useQuery({
    queryKey: [...ORDERS_KEY, "details", orderId],
    queryFn: () => getOrderDetails(orderId),
    enabled: !!orderId,
  });
