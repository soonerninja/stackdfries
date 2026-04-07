CREATE TABLE IF NOT EXISTS page_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page text NOT NULL,
  referrer text,
  user_agent text,
  ip_address text,
  screen_width integer,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;

-- Anyone can insert (public tracking)
CREATE POLICY "Public insert page views" ON page_views FOR INSERT WITH CHECK (true);

-- Only authenticated users can read (admin dashboard)
CREATE POLICY "Admin read page views" ON page_views FOR SELECT USING (auth.role() = 'authenticated');

-- Index for dashboard queries
CREATE INDEX idx_page_views_created_at ON page_views (created_at DESC);
CREATE INDEX idx_page_views_page ON page_views (page);
