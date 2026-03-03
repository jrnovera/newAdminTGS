-- ============================================================
-- MIGRATION: Update retreat_venues table
-- Adds new fields: starting_price, total_bookings, primary_venue_type
-- These are needed for the Create Retreat Venue modal
-- ============================================================

-- Add starting_price column
ALTER TABLE retreat_venues
ADD COLUMN IF NOT EXISTS starting_price NUMERIC DEFAULT 0;
COMMENT ON COLUMN retreat_venues.starting_price IS 'Starting price for venue bookings';

-- Add total_bookings column
ALTER TABLE retreat_venues
ADD COLUMN IF NOT EXISTS total_bookings INTEGER DEFAULT 0;
COMMENT ON COLUMN retreat_venues.total_bookings IS 'Total number of bookings received';

-- Add primary_venue_type column
ALTER TABLE retreat_venues
ADD COLUMN IF NOT EXISTS primary_venue_type TEXT;
COMMENT ON COLUMN retreat_venues.primary_venue_type IS 'Primary venue type classification: Retreat Venue, Wellness Centre, Day Spa, etc.';

-- Add updated_at column with auto-update trigger
ALTER TABLE retreat_venues
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Create or replace the trigger function for auto-updating updated_at
CREATE OR REPLACE FUNCTION update_retreat_venues_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop the trigger if it exists, then recreate
DROP TRIGGER IF EXISTS set_retreat_venues_updated_at ON retreat_venues;

CREATE TRIGGER set_retreat_venues_updated_at
  BEFORE UPDATE ON retreat_venues
  FOR EACH ROW
  EXECUTE FUNCTION update_retreat_venues_updated_at();

-- ============================================================
-- INDEX for the new columns
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_retreat_venues_starting_price
  ON retreat_venues(starting_price);

CREATE INDEX IF NOT EXISTS idx_retreat_venues_primary_type
  ON retreat_venues(primary_venue_type);

-- ============================================================
-- SUMMARY OF ALL retreat_venues COLUMNS
-- (for reference, not executed)
-- ============================================================
/*
  EXISTING COLUMNS:
  - id (UUID, PK)
  - created_at (TIMESTAMPTZ)
  - date_added (DATE)
  - name (TEXT, NOT NULL)
  - type (TEXT, default 'Retreat')
  - location (TEXT)
  - short_loc (TEXT)
  - capacity (INTEGER)
  - status (TEXT, default 'Draft')
  - subscription (TEXT, default 'Essentials')
  - retreat_venue_type (TEXT[])
  - hire_type (TEXT)
  - hero_image_url (TEXT)
  - gallery_photo_urls (TEXT[])
  - experience_feature_image (TEXT)
  - brand_quote (TEXT)
  - intro_text (TEXT)
  - retreat_styles (TEXT[])
  - modalities (TEXT[])
  - ideal_retreat_types (TEXT[])
  - experience_title (TEXT)
  - experience_subtitle (TEXT)
  - experience_description (TEXT)
  - description (TEXT)
  - short_description (TEXT)
  - property_size_value (NUMERIC)
  - property_size_unit (TEXT)
  - established_date (TEXT)
  - architecture_style (TEXT)
  - street_address (TEXT)
  - suburb (TEXT)
  - postcode (TEXT)
  - state_province (TEXT)
  - country (TEXT)
  - climate (TEXT)
  - location_type (TEXT[])
  - location_setting (TEXT)
  - gps_coordinates (TEXT)
  - nearest_airport (TEXT)
  - transport_access (TEXT[])
  - max_guests (INTEGER)
  - min_guests (INTEGER)
  - total_bedrooms (INTEGER)
  - total_bathrooms (INTEGER)
  - shared_bathrooms (INTEGER)
  - private_ensuites (INTEGER)
  - accommodation_style (TEXT)
  - property_type (TEXT)
  - accommodation_description (TEXT)
  - show_accommodation_section (BOOLEAN)
  - accommodation_amenities (TEXT[])
  - bed_config_king..rollaway (INTEGER)
  - individual_rooms (JSONB[])
  - check_in_time (TEXT)
  - check_out_time (TEXT)
  - early_check_in_available (BOOLEAN)
  - late_check_out_available (BOOLEAN)
  - children_allowed (BOOLEAN)
  - minimum_child_age (INTEGER)
  - pets_allowed (BOOLEAN)
  - smoking_allowed (BOOLEAN)
  - facilities_list (TEXT[])
  - has_kitchen, has_garden, has_meditation_hall (BOOLEAN)
  - whats_included (TEXT[])
  - services, packages, add_ons, practitioners (JSONB)
  - pricing_tiers (JSONB)
  - house_rules, health_safety, age_requirements (TEXT)
  - cancellation_policy, booking_policy, directions (TEXT)
  - access_policies (TEXT)
  - best_for (TEXT[])
  - is_wheelchair_accessible (BOOLEAN)
  - languages_spoken (TEXT[])
  - property_status (TEXT)
  - sanctum_vetted, featured_listing, instant_booking (BOOLEAN)
  - is_available, show_on_website (BOOLEAN)
  - owner_name, owner_email, owner_phone, owner_address (TEXT)
  - website_url (TEXT)
  - availability_notes, internal_notes (TEXT)

  NEW COLUMNS (this migration):
  - starting_price (NUMERIC, default 0)
  - total_bookings (INTEGER, default 0)
  - primary_venue_type (TEXT)
  - updated_at (TIMESTAMPTZ, auto-updated via trigger)
*/
