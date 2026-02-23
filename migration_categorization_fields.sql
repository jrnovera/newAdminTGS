-- Combined SQL Migration for Venue Categorization
-- Run this in your Supabase SQL Editor to add the necessary columns

-- 1. Add 'modalities' column as JSONB (defaults to an empty array)
ALTER TABLE wellness_venues 
ADD COLUMN IF NOT EXISTS modalities JSONB DEFAULT '[]'::jsonb;

-- 2. Add 'location_setting' column as TEXT
ALTER TABLE wellness_venues 
ADD COLUMN IF NOT EXISTS location_setting TEXT;

-- Verify columns were added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'wellness_venues' 
AND column_name IN ('modalities', 'location_setting');
