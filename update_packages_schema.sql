-- ==========================================================
-- SQL MIGRATION SCRIPT: VENUE POLICIES & PACKAGE REFINEMENT
-- ==========================================================
-- Run this script in the Supabase SQL Editor to synchronize your database.

-- 1. ADD NEW POLICY AND INFORMATION COLUMNS
-- Adding these columns to the wellness_venues table to match our new schema.
ALTER TABLE wellness_venues 
ADD COLUMN IF NOT EXISTS house_rules TEXT,
ADD COLUMN IF NOT EXISTS health_safety TEXT,
ADD COLUMN IF NOT EXISTS age_requirements TEXT,
ADD COLUMN IF NOT EXISTS cancellation_policy TEXT,
ADD COLUMN IF NOT EXISTS booking_policy TEXT,
ADD COLUMN IF NOT EXISTS directions TEXT;

-- 2. MIGRATE PACKAGES JSONB STRUCTURE
-- This logic ensures every item in the 'packages' JSONB array has a 'thumbnail' key.
-- It defaults any missing thumbnails to null, preventing potential frontend errors.
UPDATE wellness_venues
SET packages = (
  SELECT jsonb_agg(
    CASE 
      WHEN pkg ? 'thumbnail' THEN pkg 
      ELSE pkg || '{"thumbnail": null}'::jsonb 
    END
  )
  FROM jsonb_array_elements(packages) AS pkg
)
WHERE packages IS NOT NULL 
  AND jsonb_array_length(packages) > 0;

-- 3. VERIFICATION
-- Check if the columns were added and the first few records have the new structure.
SELECT name, house_rules, directions, packages 
FROM wellness_venues 
LIMIT 5;
