-- Add location_setting column to wellness_venues table
ALTER TABLE wellness_venues 
ADD COLUMN IF NOT EXISTS location_setting TEXT;

-- Add location_setting column to retreat_venues table (if applicable)
-- ALTER TABLE retreat_venues ADD COLUMN IF NOT EXISTS location_setting TEXT;
