-- Fix catering_inquiries RLS: auth.role() doesn't work with Supabase SSR
-- cookie auth in this project; use auth.uid() like menu_items / site_settings
-- were fixed in migration 006.
DROP POLICY IF EXISTS "Admin read catering" ON catering_inquiries;
DROP POLICY IF EXISTS "Admin update catering" ON catering_inquiries;

CREATE POLICY "Admin read catering" ON catering_inquiries
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admin update catering" ON catering_inquiries
  FOR UPDATE USING (auth.uid() IS NOT NULL);
