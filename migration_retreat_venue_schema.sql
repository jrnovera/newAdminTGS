-- ============================================================
-- CREATE: retreat_venues TABLE
-- Separate table for retreat/venue listings
-- Based on Moraea Farm portal design + provided field screenshots
-- ============================================================

CREATE TABLE IF NOT EXISTS retreat_venues (

  -- ============================================================
  -- IDENTITY & SYSTEM
  -- ============================================================
  id                          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at                  TIMESTAMPTZ DEFAULT NOW(),
  date_added                  DATE DEFAULT CURRENT_DATE,

  -- ============================================================
  -- VENUE LIST FIELDS (visible on the Venues index table)
  -- ============================================================
  name                        TEXT NOT NULL,
  -- Full name + location displayed on list

  type                        TEXT NOT NULL DEFAULT 'Retreat',
  -- Badge: 'Retreat' | 'Wellness'

  location                    TEXT,
  -- Full location string, e.g. 'Berry, NSW, Australia'

  short_loc                   TEXT,
  -- Short form, e.g. 'Berry, NSW'

  capacity                    INTEGER DEFAULT 0,
  -- Max Guests (number)

  status                      TEXT NOT NULL DEFAULT 'Draft',
  -- 'Active' | 'Draft' | 'Inactive'

  subscription                TEXT DEFAULT 'Essentials',
  -- Tier badge: 'Essentials' | 'Standard' | 'Featured' | 'Premium'

  -- ============================================================
  -- RETREAT VENUE TYPE
  -- ============================================================
  retreat_venue_type          TEXT[],
  -- Multi-select from:
  -- 'Dedicated Retreat Centre', 'Eco Lodge', 'Private Estate',
  -- 'Boutique Hotel', 'Mountain Lodge', 'Beach Property',
  -- 'Wellness Resort', 'Monastery / Ashram', 'Farm / Ranch',
  -- 'Villa', 'Castle / Historic', 'Glamping / Tented'

  hire_type                   TEXT DEFAULT 'Exclusive Use',
  -- 'Exclusive Use' | 'Shared Use' | 'Room Only'

  -- ============================================================
  -- MEDIA & CONTENT
  -- ============================================================
  hero_image_url              TEXT,
  -- Primary hero image

  gallery_photo_urls          TEXT[] DEFAULT '{}',
  -- Additional gallery photos

  experience_feature_image    TEXT,
  -- Image for 'The Experience' editorial block

  brand_quote                 TEXT,
  -- Hero quote overlay text

  intro_text                  TEXT,
  -- Single introduction paragraph (editorial voice for the Overview tab)

  retreat_styles              TEXT[] DEFAULT '{}',
  -- Retreat style tags shown on listing overview

  -- ============================================================
  -- RETREAT SPECIALTIES
  -- ============================================================
  modalities                  TEXT[] DEFAULT '{}',
  -- e.g. ['Yoga', 'Meditation', 'Nutrition', 'Wellness', 'Cooking']

  ideal_retreat_types         TEXT[] DEFAULT '{}',
  -- e.g. ['Nutrition Retreats', 'Corporate Wellness', 'Small Group Gatherings']

  -- ============================================================
  -- EDITORIAL CONTENT BLOCK: THE EXPERIENCE
  -- ============================================================
  experience_title            TEXT,
  experience_subtitle         TEXT,
  experience_description      TEXT,

  -- ============================================================
  -- PROPERTY DETAILS
  -- ============================================================
  description                 TEXT,
  -- Factual property description

  short_description           TEXT,
  -- One-liner for listing cards

  property_size_value         NUMERIC,
  property_size_unit          TEXT DEFAULT 'Acres',
  -- 'Acres' | 'Hectares' | 'Square Metres'

  established_date            TEXT,
  -- Year established, e.g. '2018'

  architecture_style          TEXT,
  -- 'Contemporary Rural' | 'Traditional' | 'Minimalist' | 'Balinese' |
  -- 'Japanese' | 'Mediterranean' | 'Colonial' | 'Eco/Sustainable'

  -- ============================================================
  -- LOCATION (EXTENDED)
  -- ============================================================
  street_address              TEXT,
  suburb                      TEXT,
  postcode                    TEXT,
  state_province              TEXT,
  country                     TEXT DEFAULT 'Australia',
  climate                     TEXT,
  -- 'Temperate' | 'Tropical' | 'Arid' | 'Alpine' | 'Mediterranean'

  location_type               TEXT[] DEFAULT '{}',
  -- Tags: e.g. ['Rural', 'Countryside', 'Coastal']

  location_setting            TEXT,
  -- 'Coastal & Beach' | 'Mountain & Alpine' | 'Forest & Jungle' | 'Urban' |
  -- 'Desert' | 'Island & Tropical' | 'Countryside' | 'Lakeside' | 'Volcanic / Geothermal'

  gps_coordinates             TEXT,
  -- e.g. '-34.7754, 150.6989'

  nearest_airport             TEXT,
  -- e.g. 'Sydney (SYD) - 130km / 1hr 45min'

  transport_access            TEXT[] DEFAULT '{}',
  -- Tags: e.g. ['Car Recommended', 'Airport Transfers Available']

  -- ============================================================
  -- ACCOMMODATION (Overview)
  -- ============================================================
  max_guests                  INTEGER,
  min_guests                  INTEGER DEFAULT 1,
  total_bedrooms              INTEGER,
  total_bathrooms             INTEGER,
  shared_bathrooms            INTEGER,
  private_ensuites            INTEGER,
  accommodation_style         TEXT,
  -- e.g. 'Hotel-Style', 'Villa-Style', 'Dormitory'
  property_type               TEXT,
  -- e.g. 'House', 'Chalet', 'Barn', 'Tented Camp'
  accommodation_description   TEXT,
  show_accommodation_section  BOOLEAN DEFAULT TRUE,
  accommodation_amenities     TEXT[] DEFAULT '{}',

  -- ============================================================
  -- BED CONFIGURATION (Global / Total across all rooms)
  -- ============================================================
  bed_config_king             INTEGER DEFAULT 0,
  bed_config_queen            INTEGER DEFAULT 0,
  bed_config_double           INTEGER DEFAULT 0,
  bed_config_single           INTEGER DEFAULT 0,
  bed_config_twin             INTEGER DEFAULT 0,
  bed_config_bunk             INTEGER DEFAULT 0,
  bed_config_sofa             INTEGER DEFAULT 0,
  bed_config_rollaway         INTEGER DEFAULT 0,

  -- ============================================================
  -- INDIVIDUAL ROOMS (JSONB array, one per room)
  -- Each room object: {
  --   id, roomName, roomImage, websiteDescription,
  --   roomType (e.g. 'Suite'), badgeNumber,
  --   bedConfiguration: { kingBeds, queenBeds, ... },
  --   maxOccupancy, hasRollaway, bathroom (e.g. 'Private Ensuite'),
  --   roomAmenities[], floor, roomSize, pricePerNight
  -- }
  -- ============================================================
  individual_rooms            JSONB[] DEFAULT '{}',

  -- ============================================================
  -- CHECK-IN / CHECK-OUT POLICIES
  -- ============================================================
  check_in_time               TEXT,
  -- e.g. '15:00'

  check_out_time              TEXT,
  -- e.g. '11:00'

  early_check_in_available    BOOLEAN DEFAULT FALSE,
  late_check_out_available    BOOLEAN DEFAULT FALSE,
  children_allowed            BOOLEAN DEFAULT TRUE,
  minimum_child_age           INTEGER,
  pets_allowed                BOOLEAN DEFAULT FALSE,
  smoking_allowed             BOOLEAN DEFAULT FALSE,

  -- ============================================================
  -- FACILITIES
  -- ============================================================
  facilities_list             TEXT[] DEFAULT '{}',
  has_kitchen                 BOOLEAN DEFAULT FALSE,
  has_garden                  BOOLEAN DEFAULT FALSE,
  has_meditation_hall         BOOLEAN DEFAULT FALSE,
  whats_included              TEXT[] DEFAULT '{}',
  -- Items included in the base price/stay

  -- ============================================================
  -- WELLNESS SERVICES
  -- ============================================================
  services                    JSONB DEFAULT '[]',
  -- [{name, price, duration}]

  packages                    JSONB DEFAULT '[]',
  -- [{name, price, thumbnail}]

  add_ons                     JSONB DEFAULT '[]',
  -- [{name, price}]

  practitioners               JSONB DEFAULT '[]',
  -- [{id, name, photo}]

  -- ============================================================
  -- PRICING
  -- ============================================================
  pricing_tiers               JSONB DEFAULT '[]',
  -- [{label, days, price}] e.g. [{label: '2 Nights', days: 2, price: '$8,000'}]

  -- ============================================================
  -- DETAILED POLICIES
  -- ============================================================
  house_rules                 TEXT,
  health_safety               TEXT,
  age_requirements            TEXT,
  cancellation_policy         TEXT,
  booking_policy              TEXT,
  directions                  TEXT,
  access_policies             TEXT,

  -- ============================================================
  -- BEST FOR & ACCESSIBILITY
  -- ============================================================
  best_for                    TEXT[] DEFAULT '{}',
  -- 'Couples' | 'Solo' | 'Groups' | 'Families' | 'Corporate' | 'Friends'

  is_wheelchair_accessible    BOOLEAN DEFAULT FALSE,
  languages_spoken            TEXT[] DEFAULT '{}',

  -- ============================================================
  -- STATUS & LISTING FLAGS
  -- ============================================================
  property_status             TEXT DEFAULT 'Operational',
  -- 'Operational' | 'Under Construction' | 'Seasonal' | 'Temporarily Closed'

  sanctum_vetted              BOOLEAN DEFAULT FALSE,
  -- TGS has personally visited and approved this venue

  featured_listing            BOOLEAN DEFAULT FALSE,
  -- Appears in featured section on the website

  instant_booking             BOOLEAN DEFAULT FALSE,
  -- Guests can book instantly (vs. enquiry workflow)

  is_available                BOOLEAN DEFAULT TRUE,
  show_on_website             BOOLEAN DEFAULT TRUE,

  -- ============================================================
  -- OWNER / MANAGER
  -- ============================================================
  owner_name                  TEXT,
  owner_email                 TEXT,
  owner_phone                 TEXT,
  owner_address               TEXT,
  website_url                 TEXT,

  -- ============================================================
  -- INTERNAL / CRM
  -- ============================================================
  availability_notes          TEXT,
  internal_notes              TEXT
);

-- ============================================================
-- INDEXES for common filter/search operations
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_retreat_venues_status    ON retreat_venues(status);
CREATE INDEX IF NOT EXISTS idx_retreat_venues_country   ON retreat_venues(country);
CREATE INDEX IF NOT EXISTS idx_retreat_venues_capacity  ON retreat_venues(capacity);
CREATE INDEX IF NOT EXISTS idx_retreat_venues_modalities ON retreat_venues USING GIN(modalities);
CREATE INDEX IF NOT EXISTS idx_retreat_venues_types     ON retreat_venues USING GIN(retreat_venue_type);

-- ============================================================
-- ENABLE ROW LEVEL SECURITY (Best practice for Supabase)
-- ============================================================
ALTER TABLE retreat_venues ENABLE ROW LEVEL SECURITY;

-- Policy: allow service role (admin) full access
CREATE POLICY "Admin full access" ON retreat_venues
  FOR ALL USING (true);
