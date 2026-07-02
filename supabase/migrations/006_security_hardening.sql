-- C3: Prevent profile privilege escalation (role, loyalty, blocked, email)
CREATE OR REPLACE FUNCTION public.protect_profile_privileged_columns()
RETURNS TRIGGER AS $$
BEGIN
  IF NOT public.is_admin() THEN
    NEW.role := OLD.role;
    NEW.loyalty_points := OLD.loyalty_points;
    NEW.is_blocked := OLD.is_blocked;
    NEW.email := OLD.email;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS profiles_protect_privileged_columns ON public.profiles;
CREATE TRIGGER profiles_protect_privileged_columns
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.protect_profile_privileged_columns();

-- H13: Idempotency key for duplicate order protection
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS idempotency_key TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS idx_orders_idempotency_key
  ON public.orders (idempotency_key)
  WHERE idempotency_key IS NOT NULL;

-- C7 + C8: Remove client-side order creation (service role API only)
DROP POLICY IF EXISTS "Users create own orders" ON public.orders;
DROP POLICY IF EXISTS "Users insert order items" ON public.order_items;

REVOKE INSERT ON public.orders FROM anon, authenticated;
REVOKE INSERT ON public.order_items FROM anon, authenticated;
REVOKE UPDATE ON public.orders FROM anon, authenticated;
REVOKE INSERT ON public.payments FROM anon, authenticated;
REVOKE UPDATE ON public.payments FROM anon, authenticated;

-- Loyalty balance cannot go negative
ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS profiles_loyalty_points_non_negative;

ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_loyalty_points_non_negative
  CHECK (loyalty_points >= 0);

-- Payment idempotency helpers
CREATE UNIQUE INDEX IF NOT EXISTS idx_orders_razorpay_order_id
  ON public.orders (razorpay_order_id)
  WHERE razorpay_order_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_payments_order_id ON public.payments (order_id);
