-- Marketing CMS tables (normalized, admin-managed storefront content)

CREATE TABLE public.marketing_trust_badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  icon_name TEXT NOT NULL DEFAULT 'shield-check',
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.marketing_hero_trust_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  label TEXT NOT NULL,
  icon_name TEXT NOT NULL DEFAULT 'star',
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.marketing_why_features (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  icon_name TEXT NOT NULL DEFAULT 'leaf',
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.marketing_influencers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  handle TEXT NOT NULL,
  followers TEXT NOT NULL DEFAULT '',
  quote TEXT NOT NULL DEFAULT '',
  photo_url TEXT,
  reel_thumbnail_url TEXT,
  reel_url TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.marketing_google_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reviewer TEXT NOT NULL,
  review_date TEXT NOT NULL DEFAULT '',
  rating INT NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT NOT NULL,
  photo_url TEXT,
  google_review_id TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.marketing_gallery_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  image_url TEXT,
  customer_name TEXT,
  instagram_handle TEXT,
  caption TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.marketing_video_testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_name TEXT NOT NULL,
  quote TEXT,
  thumbnail_url TEXT,
  video_url TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.marketing_stories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  thumbnail_url TEXT,
  story_url TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.marketing_announcements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  message TEXT NOT NULL,
  link_url TEXT,
  link_label TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.marketing_faqs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.marketing_seo_pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_key TEXT NOT NULL UNIQUE,
  meta_title TEXT,
  meta_description TEXT,
  keywords TEXT,
  og_image_url TEXT,
  canonical_path TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.marketing_homepage_sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section_key TEXT NOT NULL UNIQUE,
  title_override TEXT,
  subtitle_override TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  is_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.marketing_social_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  platform TEXT NOT NULL UNIQUE,
  url TEXT NOT NULL DEFAULT '',
  handle TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- updated_at triggers
CREATE TRIGGER marketing_trust_badges_updated_at
  BEFORE UPDATE ON public.marketing_trust_badges
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER marketing_hero_trust_items_updated_at
  BEFORE UPDATE ON public.marketing_hero_trust_items
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER marketing_why_features_updated_at
  BEFORE UPDATE ON public.marketing_why_features
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER marketing_influencers_updated_at
  BEFORE UPDATE ON public.marketing_influencers
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER marketing_google_reviews_updated_at
  BEFORE UPDATE ON public.marketing_google_reviews
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER marketing_gallery_items_updated_at
  BEFORE UPDATE ON public.marketing_gallery_items
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER marketing_video_testimonials_updated_at
  BEFORE UPDATE ON public.marketing_video_testimonials
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER marketing_stories_updated_at
  BEFORE UPDATE ON public.marketing_stories
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER marketing_announcements_updated_at
  BEFORE UPDATE ON public.marketing_announcements
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER marketing_faqs_updated_at
  BEFORE UPDATE ON public.marketing_faqs
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER marketing_seo_pages_updated_at
  BEFORE UPDATE ON public.marketing_seo_pages
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER marketing_homepage_sections_updated_at
  BEFORE UPDATE ON public.marketing_homepage_sections
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER marketing_social_links_updated_at
  BEFORE UPDATE ON public.marketing_social_links
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- RLS
ALTER TABLE public.marketing_trust_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketing_hero_trust_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketing_why_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketing_influencers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketing_google_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketing_gallery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketing_video_testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketing_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketing_announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketing_faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketing_seo_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketing_homepage_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketing_social_links ENABLE ROW LEVEL SECURITY;

-- Public read active; admin full access
DO $$
DECLARE
  t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'marketing_trust_badges',
    'marketing_hero_trust_items',
    'marketing_why_features',
    'marketing_influencers',
    'marketing_google_reviews',
    'marketing_gallery_items',
    'marketing_video_testimonials',
    'marketing_stories',
    'marketing_announcements',
    'marketing_faqs',
    'marketing_seo_pages',
    'marketing_social_links'
  ]
  LOOP
    EXECUTE format(
      'CREATE POLICY "Public read active %1$s" ON public.%1$I FOR SELECT USING (is_active = TRUE OR public.is_admin())',
      t
    );
    EXECUTE format(
      'CREATE POLICY "Admins manage %1$s" ON public.%1$I FOR ALL USING (public.is_admin())',
      t
    );
  END LOOP;
END $$;

CREATE POLICY "Public read enabled homepage sections" ON public.marketing_homepage_sections
  FOR SELECT USING (is_enabled = TRUE OR public.is_admin());
CREATE POLICY "Admins manage homepage sections" ON public.marketing_homepage_sections
  FOR ALL USING (public.is_admin());

-- Seed homepage section registry
INSERT INTO public.marketing_homepage_sections (section_key, sort_order, is_enabled) VALUES
  ('hero', 10, TRUE),
  ('trust_bar', 20, TRUE),
  ('categories', 30, TRUE),
  ('featured_by', 40, TRUE),
  ('todays_special', 50, TRUE),
  ('best_sellers', 60, TRUE),
  ('google_reviews', 70, TRUE),
  ('recommended', 80, TRUE),
  ('customer_gallery', 90, TRUE),
  ('video_testimonials', 100, TRUE),
  ('why_people_love_us', 110, TRUE),
  ('offers', 120, TRUE),
  ('instagram_cta', 130, TRUE),
  ('customer_reviews', 140, TRUE)
ON CONFLICT (section_key) DO NOTHING;

-- Seed SEO pages
INSERT INTO public.marketing_seo_pages (page_key, meta_title, meta_description, canonical_path) VALUES
  ('home', 'Order Food Online', 'Order authentic chai, maska bun and snacks online.', '/'),
  ('community', 'Community', 'Featured creators and customer stories.', '/community'),
  ('menu', 'Menu', 'Browse our full menu.', '/menu')
ON CONFLICT (page_key) DO NOTHING;

-- Seed social platforms
INSERT INTO public.marketing_social_links (platform, url, handle, sort_order) VALUES
  ('instagram', 'https://instagram.com/ammuschai', 'ammuschai', 1),
  ('google_reviews', 'https://www.google.com/maps/search/?api=1&query=Ammu''s+Chai+With+Maska+Bun+Nellore', NULL, 2)
ON CONFLICT (platform) DO NOTHING;

-- Settings: marketing theme (optional storefront tweaks)
INSERT INTO public.settings (key, value) VALUES
  ('marketing_theme', '{"show_announcement_bar": false}')
ON CONFLICT (key) DO NOTHING;

-- Extend public settings read for marketing_theme
-- (admin-only theme; no public policy change needed if read via server only)
