-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loyalty_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id OR public.is_admin());
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id OR public.is_admin());
CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (public.is_admin());
CREATE POLICY "Admins can update all profiles" ON public.profiles
  FOR UPDATE USING (public.is_admin());

-- Admins
CREATE POLICY "Admins can view admins" ON public.admins
  FOR SELECT USING (public.is_admin());

-- Addresses
CREATE POLICY "Users manage own addresses" ON public.addresses
  FOR ALL USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Users insert own addresses" ON public.addresses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Categories (public read, admin write)
CREATE POLICY "Anyone can view active categories" ON public.categories
  FOR SELECT USING (is_active = TRUE OR public.is_admin());
CREATE POLICY "Admins manage categories" ON public.categories
  FOR ALL USING (public.is_admin());

-- Products (public read available, admin write)
CREATE POLICY "Anyone can view available products" ON public.products
  FOR SELECT USING (is_available = TRUE OR public.is_admin());
CREATE POLICY "Admins manage products" ON public.products
  FOR ALL USING (public.is_admin());

-- Product images
CREATE POLICY "Anyone can view product images" ON public.product_images
  FOR SELECT USING (TRUE);
CREATE POLICY "Admins manage product images" ON public.product_images
  FOR ALL USING (public.is_admin());

-- Cart items
CREATE POLICY "Users manage own cart" ON public.cart_items
  FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users insert own cart" ON public.cart_items
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Coupons (public read active, admin write)
CREATE POLICY "Anyone can view active coupons" ON public.coupons
  FOR SELECT USING (
    (is_active = TRUE AND (expires_at IS NULL OR expires_at > NOW()))
    OR public.is_admin()
  );
CREATE POLICY "Admins manage coupons" ON public.coupons
  FOR ALL USING (public.is_admin());

-- Orders
CREATE POLICY "Users view own orders" ON public.orders
  FOR SELECT USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Users create own orders" ON public.orders
  FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "Admins manage orders" ON public.orders
  FOR ALL USING (public.is_admin());

-- Order items
CREATE POLICY "Users view own order items" ON public.order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = order_id AND (o.user_id = auth.uid() OR public.is_admin())
    )
  );
CREATE POLICY "Users insert order items" ON public.order_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = order_id AND (o.user_id = auth.uid() OR public.is_admin())
    )
  );
CREATE POLICY "Admins manage order items" ON public.order_items
  FOR ALL USING (public.is_admin());

-- Payments
CREATE POLICY "Users view own payments" ON public.payments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = order_id AND (o.user_id = auth.uid() OR public.is_admin())
    )
  );
CREATE POLICY "Service role manages payments" ON public.payments
  FOR ALL USING (public.is_admin());

-- Reviews
CREATE POLICY "Anyone can view visible reviews" ON public.reviews
  FOR SELECT USING (is_visible = TRUE OR auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Users create own reviews" ON public.reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own reviews" ON public.reviews
  FOR UPDATE USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Admins manage reviews" ON public.reviews
  FOR ALL USING (public.is_admin());

-- Favorites
CREATE POLICY "Users manage own favorites" ON public.favorites
  FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users insert own favorites" ON public.favorites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Loyalty points
CREATE POLICY "Users view own loyalty points" ON public.loyalty_points
  FOR SELECT USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Admins manage loyalty points" ON public.loyalty_points
  FOR ALL USING (public.is_admin());

-- Notifications
CREATE POLICY "Users view own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Users update own notifications" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins manage notifications" ON public.notifications
  FOR ALL USING (public.is_admin());

-- Settings (public read certain keys, admin write)
CREATE POLICY "Anyone can view public settings" ON public.settings
  FOR SELECT USING (
    key IN ('business_name', 'business_phone', 'business_email', 'business_address',
            'delivery_fee', 'min_order_value', 'loyalty_points_rate', 'hero_banner',
            'opening_hours', 'about', 'contact')
    OR public.is_admin()
  );
CREATE POLICY "Admins manage settings" ON public.settings
  FOR ALL USING (public.is_admin());

-- Storage buckets policies (run in Supabase dashboard or separate migration)
-- products bucket: public read, admin write
