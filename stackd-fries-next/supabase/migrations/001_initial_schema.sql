-- Stack'd Fries Database Schema

-- Tracker Status (single row for current live/offline state)
CREATE TABLE tracker_status (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  is_live boolean DEFAULT false,
  location_name text,
  latitude decimal,
  longitude decimal,
  went_live_at timestamptz,
  went_offline_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Menu Items
CREATE TABLE menu_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price decimal NOT NULL,
  category text NOT NULL,
  image_url text,
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Current Drop (rotating special)
CREATE TABLE current_drop (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  teaser_text text,
  available_date text,
  image_url text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Email Signups
CREATE TABLE email_signups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  signed_up_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE tracker_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE current_drop ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_signups ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public read tracker" ON tracker_status FOR SELECT USING (true);
CREATE POLICY "Public read menu" ON menu_items FOR SELECT USING (true);
CREATE POLICY "Public read drops" ON current_drop FOR SELECT USING (true);

-- Public insert for email signups
CREATE POLICY "Public insert emails" ON email_signups FOR INSERT WITH CHECK (true);

-- Authenticated write access (admin)
CREATE POLICY "Admin all tracker" ON tracker_status FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all menu" ON menu_items FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all drops" ON current_drop FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin read emails" ON email_signups FOR SELECT USING (auth.role() = 'authenticated');

-- Seed data: initial tracker status row (offline)
INSERT INTO tracker_status (is_live, location_name) VALUES (false, null);

-- Seed data: menu items from existing site
INSERT INTO menu_items (name, description, price, category, sort_order, is_active) VALUES
  ('Buffalo Chicken', 'Crispy fries, shredded buffalo chicken, ranch, blue cheese crumbles', 12, 'loaded_fries', 1, true),
  ('Carne Asada', 'Seasoned steak, pico, queso, cilantro-lime crema', 13, 'loaded_fries', 2, true),
  ('Mexican Street Corn', 'Elote-style corn, cotija, tajin, lime crema', 11, 'loaded_fries', 3, true),
  ('Rotating Special', 'You''ll know it when you taste it.', 13, 'loaded_fries', 4, true),
  ('Funnel Cake', 'Classic carnival funnel cake, powdered sugar', 8, 'sides_drinks', 5, true),
  ('Dirty Sodas', 'Coconut cream, vanilla, cherry, or strawberry syrups', 5, 'sides_drinks', 6, true);
