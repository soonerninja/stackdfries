-- Site Settings (key/value store for admin-editable site configuration)
--
-- NOTE: This migration was reconstructed after the fact. The `site_settings`
-- table was originally created by hand in the Supabase dashboard, so no
-- migration for it existed in the repo — meaning the schema could not be
-- rebuilt from source. The shape below is derived from how the application
-- reads and writes the table:
--
--   src/lib/banner.ts          -> key 'banner', value { enabled, text }
--   src/lib/popup.ts           -> key 'popup',  value { enabled, title, body,
--                                                       ctaLabel, ctaUrl }
--   src/app/admin/settings/    -> keys 'hours', 'banner', 'popup'
--   src/components/LiveTracker.tsx, LiveStatusBadge.tsx
--
-- Every statement is idempotent (IF NOT EXISTS / DROP ... IF EXISTS), so
-- running this against the existing production database is a no-op and will
-- not disturb live data.

CREATE TABLE IF NOT EXISTS site_settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Public read: the banner, promo popup, and business hours are rendered for
-- anonymous visitors on the public site.
DROP POLICY IF EXISTS "Public read settings" ON site_settings;
CREATE POLICY "Public read settings" ON site_settings
  FOR SELECT USING (true);

-- Writes are admin-only. Migration 006 replaces these with auth.uid() checks;
-- they are created here so this file stands alone on a fresh database.
DROP POLICY IF EXISTS "Auth update settings" ON site_settings;
CREATE POLICY "Auth update settings" ON site_settings
  FOR UPDATE USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Auth insert settings" ON site_settings;
CREATE POLICY "Auth insert settings" ON site_settings
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
