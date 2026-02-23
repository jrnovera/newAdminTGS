-- SQL Migration: Add Modalities Column
-- Adding a JSONB column to store an array of wellness modalities.

ALTER TABLE wellness_venues 
ADD COLUMN IF NOT EXISTS modalities JSONB DEFAULT '[]';

-- Verification
SELECT name, modalities FROM wellness_venues LIMIT 5;
