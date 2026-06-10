-- Seed categories
INSERT INTO public.categories (name, slug, description, sort_order) VALUES
  ('Snacks', 'snacks', 'Crispy snacks and quick bites', 1),
  ('Fast Food', 'fast-food', 'Burgers, pizzas and more', 2),
  ('Tiffins', 'tiffins', 'Homestyle meals and combos', 3),
  ('Beverages', 'beverages', 'Refreshing drinks', 4),
  ('Special Items', 'special-items', 'Chef specials and seasonal items', 5);

-- Seed products
-- Alias columns: cat_slug, name, slug, description, price, compare_at, featured, special, popular, sort_order
-- is_available is hardcoded TRUE in the SELECT (not part of VALUES)
INSERT INTO public.products (category_id, name, slug, description, price, compare_at_price, is_available, is_featured, is_special, is_popular, sort_order)
SELECT c.id, p.name, p.slug, p.description, p.price, p.compare_at, TRUE, p.featured, p.special, p.popular, p.sort_order
FROM (VALUES
  ('snacks',        'Samosa (2 pcs)',       'samosa-2pcs',          'Crispy potato-filled samosas with chutney',           30.00,  NULL::DECIMAL, FALSE, FALSE, TRUE,  1),
  ('snacks',        'Veg Spring Roll',      'veg-spring-roll',      'Crispy rolls stuffed with vegetables',                60.00,  70.00,         TRUE,  FALSE, TRUE,  2),
  ('snacks',        'French Fries',         'french-fries',         'Golden crispy fries with seasoning',                  80.00,  NULL,          FALSE, FALSE, TRUE,  3),
  ('fast-food',     'Veg Burger',           'veg-burger',           'Grilled patty with fresh veggies and sauce',          99.00,  120.00,        TRUE,  FALSE, TRUE,  1),
  ('fast-food',     'Margherita Pizza',     'margherita-pizza',     'Classic cheese pizza with basil',                    199.00,  249.00,        TRUE,  TRUE,  TRUE,  2),
  ('fast-food',     'Paneer Wrap',          'paneer-wrap',          'Soft wrap with spiced paneer filling',               129.00,  NULL,          TRUE,  FALSE, TRUE,  3),
  ('tiffins',       'Masala Dosa',          'masala-dosa',          'Crispy dosa with potato masala and chutneys',          80.00,  NULL,          TRUE,  FALSE, TRUE,  1),
  ('tiffins',       'Veg Thali',            'veg-thali',            'Complete meal with rice, roti, dal and sabzi',       150.00,  180.00,        TRUE,  TRUE,  TRUE,  2),
  ('tiffins',       'Idli Sambar (3 pcs)',  'idli-sambar',          'Steamed idlis with sambar and chutney',                60.00,  NULL,          TRUE,  FALSE, TRUE,  3),
  ('beverages',     'Masala Chai',          'masala-chai',          'Hot spiced tea',                                     20.00,  NULL,          TRUE,  FALSE, TRUE,  1),
  ('beverages',     'Cold Coffee',          'cold-coffee',          'Chilled coffee with ice cream',                        80.00,  NULL,          TRUE,  FALSE, TRUE,  2),
  ('beverages',     'Fresh Lime Soda',      'fresh-lime-soda',      'Refreshing lime soda',                                 40.00,  NULL,          TRUE,  FALSE, TRUE,  3),
  ('special-items', 'Chef Special Biryani', 'chef-special-biryani', 'Aromatic veg biryani with raita',                     220.00,  280.00,        TRUE,  TRUE,  TRUE,  1),
  ('special-items', 'Weekend Combo',        'weekend-combo',        'Burger + Fries + Drink combo',                       199.00,  250.00,        TRUE,  TRUE,  TRUE,  2)
) AS p(cat_slug, name, slug, description, price, compare_at, featured, special, popular, sort_order)
JOIN public.categories c ON c.slug = p.cat_slug;

-- Seed coupons
INSERT INTO public.coupons (code, description, discount_type, discount_value, min_order_value, max_discount, is_active, expires_at) VALUES
  ('WELCOME10', '10% off on first order', 'percentage', 10, 150, 100, TRUE, NOW() + INTERVAL '1 year'),
  ('FLAT50', 'Flat ₹50 off', 'fixed', 50, 300, NULL, TRUE, NOW() + INTERVAL '6 months'),
  ('FOOD20', '20% off on orders above ₹500', 'percentage', 20, 500, 200, TRUE, NOW() + INTERVAL '3 months');

-- Seed settings
INSERT INTO public.settings (key, value) VALUES
  ('business_name', '"Ammu''s Chai With Maska Bun"'),
  ('business_phone', '"8121805929"'),
  ('business_email', '""'),
  ('business_address', '"Mini Bypass Road, near 1947 Restaurant, opposite DSR Guest Inn, Magunta Layout, Nellore, Andhra Pradesh 524003"'),
  ('delivery_fee', '40'),
  ('min_order_value', '99'),
  ('loyalty_points_rate', '10'),
  ('hero_banner', '{"title": "Ammu''s Chai With Maska Bun", "subtitle": "Authentic chai & maska bun in Nellore", "image": "/images/hero.jpg"}'),
  ('opening_hours', '{"monday": "9:00 AM - 10:00 PM", "tuesday": "9:00 AM - 10:00 PM", "wednesday": "9:00 AM - 10:00 PM", "thursday": "9:00 AM - 10:00 PM", "friday": "9:00 AM - 11:00 PM", "saturday": "9:00 AM - 11:00 PM", "sunday": "10:00 AM - 10:00 PM"}'),
  ('about', '"Ammu''s Chai With Maska Bun — your spot for authentic chai, maska bun, and homestyle snacks in Nellore. Located at DSR Guest Inn, Magunta Layout."'),
  ('contact', '{"whatsapp": "+918121805929", "maps_url": "https://maps.app.goo.gl/DR6a7BL2Px58JnKo7", "location_note": "Located in: DSR Guest Inn", "plus_code": "CXHF+Q9 Nellore, Andhra Pradesh"}'),
  ('telegram_chat_id', '""'),
  ('admin_email', '""');

-- Seed sample reviews (requires users - will be empty until users exist)
-- Reviews will be created by customers after orders
