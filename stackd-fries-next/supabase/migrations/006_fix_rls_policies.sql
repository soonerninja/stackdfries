-- Drop old policies that might not be working
DROP POLICY IF EXISTS "Admin update menu" ON menu_items;
DROP POLICY IF EXISTS "Admin insert menu" ON menu_items;
DROP POLICY IF EXISTS "Admin delete menu" ON menu_items;

-- Recreate with auth.uid() check instead of auth.role()
CREATE POLICY "Admin update menu" ON menu_items FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admin insert menu" ON menu_items FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Admin delete menu" ON menu_items FOR DELETE USING (auth.uid() IS NOT NULL);

-- Also fix site_settings if it has the same issue
DROP POLICY IF EXISTS "Authenticated users can update" ON site_settings;
DROP POLICY IF EXISTS "Authenticated users can insert" ON site_settings;
CREATE POLICY "Auth update settings" ON site_settings FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "Auth insert settings" ON site_settings FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
