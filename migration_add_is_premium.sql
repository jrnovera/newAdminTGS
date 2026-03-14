-- Migration: Add is_premium column to retreat_venues and wellness_venues
-- Run this in your Supabase SQL editor

-- Add is_premium to retreat_venues
ALTER TABLE retreat_venues
  ADD COLUMN IF NOT EXISTS is_premium BOOLEAN NOT NULL DEFAULT false;

-- Add is_premium to wellness_venues
ALTER TABLE wellness_venues
  ADD COLUMN IF NOT EXISTS is_premium BOOLEAN NOT NULL DEFAULT false;

-- Optional: index for filtering premium venues
CREATE INDEX IF NOT EXISTS idx_retreat_venues_is_premium ON retreat_venues(is_premium);
CREATE INDEX IF NOT EXISTS idx_wellness_venues_is_premium ON wellness_venues(is_premium);

-- Optional: set existing venues as premium based on subscription level
-- UPDATE retreat_venues SET is_premium = true WHERE subscription_level = 'Premium';
-- UPDATE wellness_venues SET is_premium = true WHERE subscription_level = 'Premium';
