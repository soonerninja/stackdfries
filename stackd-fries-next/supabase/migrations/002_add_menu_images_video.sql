-- Add missing video_url and images columns to menu_items
ALTER TABLE menu_items
  ADD COLUMN IF NOT EXISTS video_url text,
  ADD COLUMN IF NOT EXISTS images text[];
