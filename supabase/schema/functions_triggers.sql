-- supabase/schema/functions_triggers.sql

-- Assign daily order numbers (1..999) per business_date (America/Toronto).
-- App must NOT provide order_number or business_date; DB will set them.

CREATE OR REPLACE FUNCTION public.assign_daily_order_number()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  d date;
  n integer;
BEGIN
  -- Store-local business date (hardcoded; change if you later read from app_settings)
  d := (now() AT TIME ZONE 'America/Toronto')::date;

  -- Ensure business_date always matches store-local date
  NEW.business_date := d;

  -- Atomically increment/create counter for the day (wrap at 999)
  INSERT INTO public.daily_order_counters (business_date, last_number)
  VALUES (d, 1)
  ON CONFLICT (business_date)
  DO UPDATE SET last_number = CASE
    WHEN public.daily_order_counters.last_number >= 999 THEN 1
    ELSE public.daily_order_counters.last_number + 1
  END
  RETURNING last_number INTO n;

  NEW.order_number := n;

  RETURN NEW;
END;
$$;

-- Create trigger only if it doesn't already exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_trigger
    WHERE tgname = 'trg_assign_daily_order_number'
  ) THEN
    CREATE TRIGGER trg_assign_daily_order_number
    BEFORE INSERT ON public.orders
    FOR EACH ROW
    EXECUTE FUNCTION public.assign_daily_order_number();
  END IF;
END $$;

-- Optional safety: prevent updating order_number/business_date after insert
-- (Keeps order numbers truly DB-owned and immutable)
CREATE OR REPLACE FUNCTION public.prevent_order_number_update()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.order_number IS DISTINCT FROM OLD.order_number
     OR NEW.business_date IS DISTINCT FROM OLD.business_date THEN
    RAISE EXCEPTION 'order_number and business_date are immutable';
  END IF;

  RETURN NEW;
END;
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_trigger
    WHERE tgname = 'trg_prevent_order_number_update'
  ) THEN
    CREATE TRIGGER trg_prevent_order_number_update
    BEFORE UPDATE ON public.orders
    FOR EACH ROW
    EXECUTE FUNCTION public.prevent_order_number_update();
  END IF;
END $$;
