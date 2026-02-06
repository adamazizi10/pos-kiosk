CREATE TABLE public.app_settings (
  id integer NOT NULL DEFAULT 1,
  store_name text,
  timezone text,
  currency text NOT NULL DEFAULT 'CAD'::text,
  tax_rate numeric(6,4) NOT NULL DEFAULT 0,
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE public.cash_drawer_events (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  cash_drawer_id uuid NOT NULL,
  type text NOT NULL,
  delta_cents integer NOT NULL,
  reason text,
  user_id uuid,
  device_id uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE public.cash_drawers (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  label text NOT NULL DEFAULT 'Main Cash Drawer'::text,
  current_balance_cents integer NOT NULL DEFAULT 0,
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE public.categories (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  availability category_availability NOT NULL DEFAULT 'ALL_DEVICES_CATEGORY'::category_availability
);

CREATE TABLE public.daily_order_counters (
  business_date date NOT NULL,
  last_number integer NOT NULL
);

CREATE TABLE public.device_events (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  device_id uuid NOT NULL,
  event_type device_event_type NOT NULL,
  success boolean NOT NULL DEFAULT true,
  payload_json jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE public.devices (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  type device_type NOT NULL,
  label text NOT NULL,
  status device_status NOT NULL DEFAULT 'DISCONNECTED'::device_status,
  config_json jsonb NOT NULL DEFAULT '{}'::jsonb,
  last_seen_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE public.order_items (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL,
  product_id uuid,
  name_snapshot text NOT NULL,
  unit_price_cents_snapshot integer NOT NULL,
  qty integer NOT NULL,
  line_total_cents integer NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  selected_options jsonb NOT NULL DEFAULT '{}'::jsonb
);

CREATE TABLE public.orders (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  order_number bigint NOT NULL,
  source USER-DEFINED NOT NULL DEFAULT 'POS'::order_source,
  status USER-DEFINED NOT NULL DEFAULT 'CREATED'::order_status,
  dining_option USER-DEFINED NOT NULL DEFAULT 'TAKEOUT'::dining_option,
  customer_name text,
  notes text,
  subtotal_cents integer NOT NULL DEFAULT 0 CHECK (subtotal_cents >= 0),
  tax_cents integer NOT NULL DEFAULT 0 CHECK (tax_cents >= 0),
  total_cents integer NOT NULL DEFAULT 0 CHECK (total_cents >= 0),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  paid_at timestamp with time zone,
  business_date date NOT NULL DEFAULT ((now() AT TIME ZONE 'America/Toronto'::text))::date,
  CONSTRAINT orders_pkey PRIMARY KEY (id)
);

CREATE TABLE public.payments (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL,
  status payment_status NOT NULL DEFAULT 'REQUIRES_PAYMENT'::payment_status,
  method payment_method NOT NULL,
  amount_cents integer NOT NULL,
  provider payment_provider NOT NULL DEFAULT 'OTHER'::payment_provider,
  provider_payment_intent_id text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  finalized_at timestamp with time zone
);

CREATE TABLE public.products (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  category_id uuid,
  name text NOT NULL,
  sku text,
  price_cents integer NOT NULL,
  image_url text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  availability product_availability NOT NULL DEFAULT 'ALL_DEVICES_PRODUCT'::product_availability,
  options_schema jsonb NOT NULL DEFAULT '{"groups": []}'::jsonb
);

CREATE TABLE public.profiles (
  id uuid NOT NULL,
  full_name text,
  role user_role NOT NULL DEFAULT 'EMPLOYEE'::user_role,
  pin integer,
  is_active boolean NOT NULL DEFAULT true,
  last_login_at timestamp with time zone,
  last_logout_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE public.receipts (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL,
  payment_id uuid,
  receipt_number bigint NOT NULL,
  content_json jsonb NOT NULL DEFAULT '{}'::jsonb,
  printed_at timestamp with time zone,
  reprinted_count integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE public.refunds (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  payment_id uuid NOT NULL,
  amount_cents integer NOT NULL,
  reason text,
  status refund_status NOT NULL DEFAULT 'PENDING'::refund_status,
  provider_refund_id text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE public.user_sessions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  device_id uuid,
  logged_in_at timestamp with time zone NOT NULL DEFAULT now(),
  logged_out_at timestamp with time zone
);

ALTER TABLE public.app_settings
  ADD CONSTRAINT app_settings_pkey PRIMARY KEY (id);

ALTER TABLE public.cash_drawer_events
  ADD CONSTRAINT cash_drawer_events_pkey PRIMARY KEY (id);

ALTER TABLE public.cash_drawers
  ADD CONSTRAINT cash_drawers_pkey PRIMARY KEY (id);

ALTER TABLE public.categories
  ADD CONSTRAINT categories_pkey PRIMARY KEY (id);

ALTER TABLE public.daily_order_counters
  ADD CONSTRAINT daily_order_counters_pkey PRIMARY KEY (business_date);

ALTER TABLE public.device_events
  ADD CONSTRAINT device_events_pkey PRIMARY KEY (id);

ALTER TABLE public.devices
  ADD CONSTRAINT devices_pkey PRIMARY KEY (id);

ALTER TABLE public.order_items
  ADD CONSTRAINT order_items_pkey PRIMARY KEY (id);

ALTER TABLE public.orders
  ADD CONSTRAINT orders_pkey PRIMARY KEY (id);

ALTER TABLE public.payments
  ADD CONSTRAINT payments_pkey PRIMARY KEY (id);

ALTER TABLE public.products
  ADD CONSTRAINT products_pkey PRIMARY KEY (id);

ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_pkey PRIMARY KEY (id);

ALTER TABLE public.receipts
  ADD CONSTRAINT receipts_pkey PRIMARY KEY (id);

ALTER TABLE public.refunds
  ADD CONSTRAINT refunds_pkey PRIMARY KEY (id);

ALTER TABLE public.user_sessions
  ADD CONSTRAINT user_sessions_pkey PRIMARY KEY (id);

ALTER TABLE public.cash_drawers
  ADD CONSTRAINT cash_drawers_current_balance_cents_check
  CHECK (current_balance_cents >= 0);

ALTER TABLE public.order_items
  ADD CONSTRAINT order_items_line_total_cents_check
  CHECK (line_total_cents >= 0);

ALTER TABLE public.order_items
  ADD CONSTRAINT order_items_qty_check
  CHECK (qty > 0);

ALTER TABLE public.order_items
  ADD CONSTRAINT order_items_selected_options_shape_chk
  CHECK (jsonb_typeof(selected_options) = 'object'::text);

ALTER TABLE public.order_items
  ADD CONSTRAINT order_items_unit_price_cents_snapshot_check
  CHECK (unit_price_cents_snapshot >= 0);

ALTER TABLE public.orders
  ADD CONSTRAINT orders_subtotal_cents_check
  CHECK (subtotal_cents >= 0);

ALTER TABLE public.orders
  ADD CONSTRAINT orders_tax_cents_check
  CHECK (tax_cents >= 0);

ALTER TABLE public.orders
  ADD CONSTRAINT orders_total_cents_check
  CHECK (total_cents >= 0);

ALTER TABLE public.payments
  ADD CONSTRAINT payments_amount_cents_check
  CHECK (amount_cents >= 0);

ALTER TABLE public.products
  ADD CONSTRAINT products_options_schema_shape_chk
  CHECK (
    jsonb_typeof(options_schema) = 'object'::text
    AND jsonb_typeof(options_schema -> 'groups'::text) = 'array'::text
  );

ALTER TABLE public.products
  ADD CONSTRAINT products_price_cents_check
  CHECK (price_cents >= 0);

ALTER TABLE public.receipts
  ADD CONSTRAINT receipts_reprinted_count_check
  CHECK (reprinted_count >= 0);

ALTER TABLE public.refunds
  ADD CONSTRAINT refunds_amount_cents_check
  CHECK (amount_cents > 0);

ALTER TABLE public.cash_drawer_events
  ADD CONSTRAINT cash_drawer_events_device_fk
  FOREIGN KEY (device_id) REFERENCES public.devices(id);

ALTER TABLE public.cash_drawer_events
  ADD CONSTRAINT cash_drawer_events_drawer_fk
  FOREIGN KEY (cash_drawer_id) REFERENCES public.cash_drawers(id);

ALTER TABLE public.cash_drawer_events
  ADD CONSTRAINT cash_drawer_events_user_fk
  FOREIGN KEY (user_id) REFERENCES public.profiles(id);

ALTER TABLE public.device_events
  ADD CONSTRAINT device_events_device_id_fkey
  FOREIGN KEY (device_id) REFERENCES public.devices(id) ON DELETE CASCADE;

ALTER TABLE public.order_items
  ADD CONSTRAINT order_items_order_id_fkey
  FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;

ALTER TABLE public.order_items
  ADD CONSTRAINT order_items_product_id_fkey
  FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE SET NULL;

ALTER TABLE public.payments
  ADD CONSTRAINT payments_order_id_fkey
  FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;

ALTER TABLE public.products
  ADD CONSTRAINT products_category_id_fkey
  FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE SET NULL;

ALTER TABLE public.receipts
  ADD CONSTRAINT receipts_order_id_fkey
  FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;

ALTER TABLE public.receipts
  ADD CONSTRAINT receipts_payment_id_fkey
  FOREIGN KEY (payment_id) REFERENCES public.payments(id) ON DELETE SET NULL;

ALTER TABLE public.refunds
  ADD CONSTRAINT refunds_payment_id_fkey
  FOREIGN KEY (payment_id) REFERENCES public.payments(id) ON DELETE CASCADE;

ALTER TABLE public.user_sessions
  ADD CONSTRAINT user_sessions_device_fk
  FOREIGN KEY (device_id) REFERENCES public.devices(id) ON DELETE SET NULL;

ALTER TABLE public.user_sessions
  ADD CONSTRAINT user_sessions_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
