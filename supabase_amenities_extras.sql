-- =============================================================================
-- Add extra amenity columns to venue_amenities table
-- Run this in your Supabase SQL Editor
-- =============================================================================
-- These columns store the additional form fields from the Amenities tab.
-- The core facilities_list column should already exist.

-- Kitchen & Dining extras
ALTER TABLE venue_amenities ADD COLUMN IF NOT EXISTS dining_capacity_indoor  INTEGER;
ALTER TABLE venue_amenities ADD COLUMN IF NOT EXISTS dining_capacity_outdoor INTEGER;

-- Technology & Connectivity extras
ALTER TABLE venue_amenities ADD COLUMN IF NOT EXISTS wifi_speed    TEXT;
ALTER TABLE venue_amenities ADD COLUMN IF NOT EXISTS wifi_coverage TEXT DEFAULT 'Whole Property';

-- Outdoor & Grounds extras
ALTER TABLE venue_amenities ADD COLUMN IF NOT EXISTS property_size TEXT;
ALTER TABLE venue_amenities ADD COLUMN IF NOT EXISTS pool_type     TEXT;

-- Parking & Transport extras
ALTER TABLE venue_amenities ADD COLUMN IF NOT EXISTS parking_spaces        INTEGER;
ALTER TABLE venue_amenities ADD COLUMN IF NOT EXISTS distance_nearest_town TEXT;

-- Good to Know sections
ALTER TABLE venue_amenities ADD COLUMN IF NOT EXISTS wifi_details        TEXT;
ALTER TABLE venue_amenities ADD COLUMN IF NOT EXISTS mobile_coverage     TEXT;
ALTER TABLE venue_amenities ADD COLUMN IF NOT EXISTS wheelchair_access   TEXT;
ALTER TABLE venue_amenities ADD COLUMN IF NOT EXISTS dietary_capability  TEXT;
ALTER TABLE venue_amenities ADD COLUMN IF NOT EXISTS smoking_policy      TEXT;
ALTER TABLE venue_amenities ADD COLUMN IF NOT EXISTS pets_policy         TEXT;

-- Additional notes
ALTER TABLE venue_amenities ADD COLUMN IF NOT EXISTS additional_notes TEXT;

-- Tab images
ALTER TABLE venue_amenities ADD COLUMN IF NOT EXISTS amenities_hero_image TEXT;
ALTER TABLE venue_amenities ADD COLUMN IF NOT EXISTS section_break_image  TEXT;
