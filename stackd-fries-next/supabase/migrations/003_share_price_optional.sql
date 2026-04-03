-- Add share_price column and make price optional
ALTER TABLE menu_items ADD COLUMN IF NOT EXISTS share_price decimal;
ALTER TABLE menu_items ALTER COLUMN price DROP NOT NULL;
