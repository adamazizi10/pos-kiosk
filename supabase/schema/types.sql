CREATE TYPE public.category_availability AS ENUM (
  'POS_CATEGORY',
  'KIOSK_CATEGORY',
  'ALL_DEVICES_CATEGORY'
);

CREATE TYPE public.device_event_type AS ENUM (
  'TEST_PRINT',
  'TEST_PAYMENT',
  'OPEN_DRAWER',
  'SCAN'
);

CREATE TYPE public.device_status AS ENUM (
  'CONNECTED',
  'DISCONNECTED'
);

CREATE TYPE public.device_type AS ENUM (
  'RECEIPT_PRINTER',
  'PAYMENT_TERMINAL',
  'CASH_DRAWER',
  'BARCODE_SCANNER'
);

CREATE TYPE public.dining_option AS ENUM (
  'DINE_IN',
  'TAKEOUT'
);

CREATE TYPE public.order_source AS ENUM (
  'POS',
  'KIOSK'
);

CREATE TYPE public.order_status AS ENUM (
  'CREATED',
  'PAID',
  'IN_PROGRESS',
  'READY',
  'COMPLETED',
  'CANCELED'
);

CREATE TYPE public.payment_method AS ENUM (
  'CARD',
  'CASH',
  'WALLET'
);

CREATE TYPE public.payment_provider AS ENUM (
  'STRIPE_TERMINAL',
  'MANUAL',
  'OTHER'
);

CREATE TYPE public.payment_status AS ENUM (
  'REQUIRES_PAYMENT',
  'PROCESSING',
  'SUCCEEDED',
  'FAILED',
  'CANCELED',
  'REFUNDED',
  'VOIDED'
);

CREATE TYPE public.product_availability AS ENUM (
  'POS_PRODUCT',
  'KIOSK_PRODUCT',
  'ALL_DEVICES_PRODUCT'
);

CREATE TYPE public.refund_status AS ENUM (
  'PENDING',
  'SUCCEEDED',
  'FAILED'
);

CREATE TYPE public.user_role AS ENUM (
  'ADMIN',
  'EMPLOYEE',
  'KIOSK_ROLE'
);
