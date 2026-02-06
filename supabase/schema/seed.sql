-- supabase/schema/indexes.sql

-- Enforce uniqueness of the human-friendly order number per business day
CREATE UNIQUE INDEX IF NOT EXISTS orders_unique_per_day_idx
ON public.orders (business_date, order_number);

-- Helpful query indexes (safe defaults)

-- Commonly used for listing orders by newest
CREATE INDEX IF NOT EXISTS orders_created_at_idx
ON public.orders (created_at DESC);

-- Fast lookups for order relations
CREATE INDEX IF NOT EXISTS order_items_order_id_idx
ON public.order_items (order_id);

CREATE INDEX IF NOT EXISTS payments_order_id_idx
ON public.payments (order_id);

CREATE INDEX IF NOT EXISTS receipts_order_id_idx
ON public.receipts (order_id);

-- Optional: speed up menu browsing (active products/categories)
CREATE INDEX IF NOT EXISTS products_category_id_idx
ON public.products (category_id);

CREATE INDEX IF NOT EXISTS products_is_active_idx
ON public.products (is_active);

CREATE INDEX IF NOT EXISTS categories_is_active_idx
ON public.categories (is_active);

-- Optional: device/event lookups
CREATE INDEX IF NOT EXISTS device_events_device_id_created_at_idx
ON public.device_events (device_id, created_at DESC);

CREATE INDEX IF NOT EXISTS cash_drawer_events_drawer_id_created_at_idx
ON public.cash_drawer_events (cash_drawer_id, created_at DESC);

CREATE INDEX IF NOT EXISTS user_sessions_user_id_logged_in_at_idx
ON public.user_sessions (user_id, logged_in_at DESC);
