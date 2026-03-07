-- ============================================================
-- TGS Venue Schema Migration
-- Full recreation of all Retreat & Wellness Venue tables
-- Source of truth: VENUE_SCHEMA_REFERENCE.md
-- Run in Supabase SQL Editor
-- ============================================================


-- ============================================================
-- UTILITY: updated_at auto-trigger function
-- ============================================================
CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- ============================================================
-- DROP ALL TABLES
-- Order: child tables first, then parent tables
-- CASCADE handles any remaining FK dependencies
-- ============================================================
DROP TABLE IF EXISTS venue_reviews            CASCADE;
DROP TABLE IF EXISTS venue_blocked_dates      CASCADE;
DROP TABLE IF EXISTS bookings                 CASCADE;
DROP TABLE IF EXISTS venue_team_members       CASCADE;
DROP TABLE IF EXISTS venue_owner_manager      CASCADE;
DROP TABLE IF EXISTS venue_internal           CASCADE;
DROP TABLE IF EXISTS venue_videos             CASCADE;
DROP TABLE IF EXISTS venue_gallery            CASCADE;
DROP TABLE IF EXISTS venue_media              CASCADE;
DROP TABLE IF EXISTS venue_seasonal_pricing   CASCADE;
DROP TABLE IF EXISTS venue_pricing            CASCADE;
DROP TABLE IF EXISTS wellness_facility_items  CASCADE;
DROP TABLE IF EXISTS venue_wellness_facilities CASCADE;
DROP TABLE IF EXISTS venue_practitioners      CASCADE;
DROP TABLE IF EXISTS venue_wellness_services  CASCADE;
DROP TABLE IF EXISTS venue_amenities          CASCADE;
DROP TABLE IF EXISTS wellness_accommodation   CASCADE;
DROP TABLE IF EXISTS retreat_spaces           CASCADE;
DROP TABLE IF EXISTS retreat_facilities       CASCADE;
DROP TABLE IF EXISTS retreat_rooms            CASCADE;
DROP TABLE IF EXISTS retreat_accommodation    CASCADE;
DROP TABLE IF EXISTS retreat_venues           CASCADE;
DROP TABLE IF EXISTS wellness_venues          CASCADE;


-- ============================================================
-- TABLE 1: retreat_venues
-- Tab: Overview (Retreat only)
-- ============================================================
CREATE TABLE retreat_venues (
  id                        UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Basic Information
  venue_name                TEXT        NOT NULL,
  primary_venue_type        TEXT,
  retreat_venue_type        TEXT[],
  hire_type                 TEXT,
  property_description      TEXT        NOT NULL,
  short_description         TEXT,
  -- Editorial Content
  hero_quote                TEXT,
  introduction_text         TEXT,
  -- Property Details
  property_size             NUMERIC,
  property_size_unit        TEXT,
  year_established          TEXT,
  architecture_style        TEXT,
  -- The Experience
  experience_title          TEXT,
  experience_subtitle       TEXT,
  experience_description    TEXT,
  -- Retreat Specialties
  modalities                TEXT[],
  ideal_retreat_types       TEXT[],
  -- Location
  street_address            TEXT        NOT NULL,
  city                      TEXT        NOT NULL,
  postcode                  TEXT        NOT NULL,
  state                     TEXT        NOT NULL,
  country                   TEXT        NOT NULL,
  climate                   TEXT,
  location_type             TEXT[],
  gps_coordinates           TEXT,
  nearest_airport           TEXT,
  transport_access          TEXT[],
  -- Status & Listing
  listing_status            TEXT        NOT NULL DEFAULT 'Draft',
  property_status           TEXT,
  subscription_level        TEXT,
  sanctum_vetted            BOOLEAN     DEFAULT FALSE,
  featured_listing          BOOLEAN     DEFAULT FALSE,
  instant_booking           BOOLEAN     DEFAULT FALSE,
  -- Tab Images
  overview_hero_image       TEXT,
  experience_feature_image  TEXT,
  -- Timestamps
  created_at                TIMESTAMPTZ DEFAULT NOW(),
  updated_at                TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER set_updated_at_retreat_venues
  BEFORE UPDATE ON retreat_venues
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();


-- ============================================================
-- TABLE 2: wellness_venues
-- Tab: Overview (Wellness only)
-- ============================================================
CREATE TABLE wellness_venues (
  id                        UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Basic Information
  venue_name                TEXT        NOT NULL,
  primary_venue_type        TEXT        DEFAULT 'Wellness Venue',
  wellness_venue_type       TEXT[],
  wellness_categories       TEXT[],
  venue_description         TEXT        NOT NULL,
  short_description         TEXT,
  -- Venue Details
  treatment_rooms           INTEGER,
  couples_suites            INTEGER,
  total_practitioners       INTEGER,
  floor_area_sqm            NUMERIC,
  year_established          TEXT,
  max_concurrent_clients    INTEGER,
  -- Editorial Content
  hero_quote                TEXT,
  introduction_text         TEXT,
  -- The Experience
  experience_title          TEXT,
  experience_subtitle       TEXT,
  experience_description    TEXT,
  -- Service Specialties
  signature_treatments      TEXT[],
  best_for                  TEXT[],
  -- Location
  street_address            TEXT        NOT NULL,
  suite_level               TEXT,
  city                      TEXT        NOT NULL,
  postcode                  TEXT        NOT NULL,
  state                     TEXT        NOT NULL,
  country                   TEXT        NOT NULL,
  location_type             TEXT[],
  gps_coordinates           TEXT,
  nearest_transport         TEXT,
  parking_access            TEXT[],
  -- Status & Listing
  listing_status            TEXT        NOT NULL DEFAULT 'Draft',
  business_status           TEXT,
  subscription_level        TEXT,
  sanctum_vetted            BOOLEAN     DEFAULT FALSE,
  featured_listing          BOOLEAN     DEFAULT FALSE,
  online_booking            BOOLEAN     DEFAULT FALSE,
  -- Tab Images
  overview_hero_image       TEXT,
  experience_feature_image  TEXT,
  -- Timestamps
  created_at                TIMESTAMPTZ DEFAULT NOW(),
  updated_at                TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER set_updated_at_wellness_venues
  BEFORE UPDATE ON wellness_venues
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();


-- ============================================================
-- TABLE 3: retreat_accommodation
-- Tab: Accommodation (Retreat only — 1-to-1)
-- ============================================================
CREATE TABLE retreat_accommodation (
  id                          UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_id                    UUID    NOT NULL REFERENCES retreat_venues(id) ON DELETE CASCADE,
  -- Capacity Overview
  max_guests                  INTEGER NOT NULL,
  min_guests                  INTEGER,
  total_bedrooms              INTEGER NOT NULL,
  total_bathrooms             INTEGER NOT NULL,
  shared_bathrooms            INTEGER,
  private_ensuites            INTEGER,
  accommodation_style         TEXT,
  property_type               TEXT,
  accommodation_description   TEXT,
  -- Bed Configuration (total property summary)
  king_beds                   INTEGER DEFAULT 0,
  queen_beds                  INTEGER DEFAULT 0,
  double_beds                 INTEGER DEFAULT 0,
  single_beds                 INTEGER DEFAULT 0,
  twin_beds                   INTEGER DEFAULT 0,
  bunk_beds                   INTEGER DEFAULT 0,
  sofa_beds                   INTEGER DEFAULT 0,
  rollaway_beds               INTEGER DEFAULT 0,
  -- Additional Information
  checkin_time                TEXT    DEFAULT '3:00 PM',
  checkout_time               TEXT    DEFAULT '10:00 AM',
  early_checkin               BOOLEAN DEFAULT FALSE,
  late_checkout               BOOLEAN DEFAULT FALSE,
  children_allowed            BOOLEAN DEFAULT TRUE,
  min_child_age               INTEGER,
  pets_allowed                BOOLEAN DEFAULT FALSE,
  smoking_allowed             BOOLEAN DEFAULT FALSE,
  -- Timestamps
  created_at                  TIMESTAMPTZ DEFAULT NOW(),
  updated_at                  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER set_updated_at_retreat_accommodation
  BEFORE UPDATE ON retreat_accommodation
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE UNIQUE INDEX idx_retreat_accommodation_venue_id ON retreat_accommodation(venue_id);


-- ============================================================
-- TABLE 4: retreat_rooms
-- Tab: Accommodation (Retreat only — 1-to-many room cards)
-- ============================================================
CREATE TABLE retreat_rooms (
  id               UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_id         UUID    NOT NULL REFERENCES retreat_venues(id) ON DELETE CASCADE,
  room_name        TEXT,
  room_image       TEXT,
  room_description TEXT,
  room_type        TEXT,
  -- Bed Config per room
  king_beds        INTEGER DEFAULT 0,
  queen_beds       INTEGER DEFAULT 0,
  single_beds      INTEGER DEFAULT 0,
  max_occupancy    INTEGER,
  bathroom_type    TEXT,
  room_amenities   TEXT[],
  sort_order       INTEGER DEFAULT 0,
  -- Timestamps
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER set_updated_at_retreat_rooms
  BEFORE UPDATE ON retreat_rooms
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE INDEX idx_retreat_rooms_venue_id ON retreat_rooms(venue_id);


-- ============================================================
-- TABLE 5: wellness_accommodation
-- Tab: Accommodation (Wellness only — 1-to-1)
-- Covers service/treatment capacity, not sleeping
-- ============================================================
CREATE TABLE wellness_accommodation (
  id                        UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_id                  UUID    NOT NULL REFERENCES wellness_venues(id) ON DELETE CASCADE,
  treatment_rooms           INTEGER,
  couples_suites            INTEGER,
  total_practitioners       INTEGER,
  floor_area_sqm            NUMERIC,
  max_concurrent_clients    INTEGER,
  price_range_per_session   TEXT,
  package_pricing_available BOOLEAN DEFAULT FALSE,
  membership_options        BOOLEAN DEFAULT FALSE,
  appointment_required      BOOLEAN DEFAULT FALSE,
  online_booking_available  BOOLEAN DEFAULT FALSE,
  -- Timestamps
  created_at                TIMESTAMPTZ DEFAULT NOW(),
  updated_at                TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER set_updated_at_wellness_accommodation
  BEFORE UPDATE ON wellness_accommodation
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE UNIQUE INDEX idx_wellness_accommodation_venue_id ON wellness_accommodation(venue_id);


-- ============================================================
-- TABLE 6: retreat_facilities
-- Tab: Retreat Facilities (Retreat only — 1-to-1)
-- ============================================================
CREATE TABLE retreat_facilities (
  id                            UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_id                      UUID    NOT NULL REFERENCES retreat_venues(id) ON DELETE CASCADE,
  -- Tab Images & Content
  facilities_hero_image         TEXT,
  section_label                 TEXT    DEFAULT 'Retreat Spaces',
  section_title                 TEXT,
  section_subtitle              TEXT,
  intro_paragraph               TEXT,
  -- Retreat Types Supported
  supports_yoga_retreats        BOOLEAN DEFAULT FALSE,
  supports_meditation_retreats  BOOLEAN DEFAULT FALSE,
  supports_nutrition_detox      BOOLEAN DEFAULT FALSE,
  supports_womens_retreats      BOOLEAN DEFAULT FALSE,
  supports_corporate_wellness   BOOLEAN DEFAULT FALSE,
  supports_mindfulness          BOOLEAN DEFAULT FALSE,
  supports_sound_healing        BOOLEAN DEFAULT FALSE,
  supports_silent_retreats      BOOLEAN DEFAULT FALSE,
  supports_breathwork           BOOLEAN DEFAULT FALSE,
  supports_plant_medicine       BOOLEAN DEFAULT FALSE,
  supports_creative_art         BOOLEAN DEFAULT FALSE,
  supports_leadership_coaching  BOOLEAN DEFAULT FALSE,
  facility_notes                TEXT,
  -- Timestamps
  created_at                    TIMESTAMPTZ DEFAULT NOW(),
  updated_at                    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER set_updated_at_retreat_facilities
  BEFORE UPDATE ON retreat_facilities
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE UNIQUE INDEX idx_retreat_facilities_venue_id ON retreat_facilities(venue_id);


-- ============================================================
-- TABLE 7: retreat_spaces
-- Tab: Retreat Facilities (Retreat only — 1-to-many space cards)
-- ============================================================
CREATE TABLE retreat_spaces (
  id                 UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_id           UUID    NOT NULL REFERENCES retreat_venues(id) ON DELETE CASCADE,
  space_name         TEXT,
  space_image        TEXT,
  is_featured        BOOLEAN DEFAULT FALSE,
  is_available       BOOLEAN DEFAULT TRUE,
  space_description  TEXT,
  space_type         TEXT,
  setting            TEXT,
  view_type          TEXT,
  capacity           INTEGER,
  size_sqm           NUMERIC,
  flooring           TEXT,
  equipment_provided TEXT[],
  sort_order         INTEGER DEFAULT 0,
  -- Timestamps
  created_at         TIMESTAMPTZ DEFAULT NOW(),
  updated_at         TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER set_updated_at_retreat_spaces
  BEFORE UPDATE ON retreat_spaces
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE INDEX idx_retreat_spaces_venue_id ON retreat_spaces(venue_id);


-- ============================================================
-- TABLE 8: venue_amenities
-- Tab: Amenities (Shared — 1-to-1 per venue)
-- venue_type: 'retreat' | 'wellness'
-- ============================================================
CREATE TABLE venue_amenities (
  id                          UUID  PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_id                    UUID  NOT NULL,
  venue_type                  TEXT  NOT NULL CHECK (venue_type IN ('retreat', 'wellness')),
  -- Tab Images
  amenities_hero_image        TEXT,
  section_break_image         TEXT,
  -- Kitchen & Dining
  has_commercial_kitchen      BOOLEAN DEFAULT FALSE,
  has_domestic_kitchen        BOOLEAN DEFAULT FALSE,
  has_full_fridge             BOOLEAN DEFAULT FALSE,
  has_walkin_pantry           BOOLEAN DEFAULT FALSE,
  has_dishwasher              BOOLEAN DEFAULT FALSE,
  has_oven_stove              BOOLEAN DEFAULT FALSE,
  has_microwave               BOOLEAN DEFAULT FALSE,
  has_coffee_machine          BOOLEAN DEFAULT FALSE,
  has_blender                 BOOLEAN DEFAULT FALSE,
  has_formal_dining           BOOLEAN DEFAULT FALSE,
  has_outdoor_dining          BOOLEAN DEFAULT FALSE,
  has_bbq                     BOOLEAN DEFAULT FALSE,
  has_pizza_oven              BOOLEAN DEFAULT FALSE,
  has_breakfast_bar           BOOLEAN DEFAULT FALSE,
  has_cookware                BOOLEAN DEFAULT FALSE,
  dining_capacity_indoor      INTEGER,
  dining_capacity_outdoor     INTEGER,
  -- Living & Entertainment
  has_living_room             BOOLEAN DEFAULT FALSE,
  has_fireplace               BOOLEAN DEFAULT FALSE,
  has_smart_tv                BOOLEAN DEFAULT FALSE,
  has_streaming               BOOLEAN DEFAULT FALSE,
  has_sound_system            BOOLEAN DEFAULT FALSE,
  has_library                 BOOLEAN DEFAULT FALSE,
  has_games_room              BOOLEAN DEFAULT FALSE,
  has_board_games             BOOLEAN DEFAULT FALSE,
  has_piano                   BOOLEAN DEFAULT FALSE,
  has_projector               BOOLEAN DEFAULT FALSE,
  has_home_cinema             BOOLEAN DEFAULT FALSE,
  has_gym_equipment           BOOLEAN DEFAULT FALSE,
  -- Technology & Connectivity
  has_wifi                    BOOLEAN DEFAULT FALSE,
  has_high_speed_internet     BOOLEAN DEFAULT FALSE,
  has_starlink                BOOLEAN DEFAULT FALSE,
  has_mobile_signal           BOOLEAN DEFAULT FALSE,
  has_ev_charging             BOOLEAN DEFAULT FALSE,
  has_printer                 BOOLEAN DEFAULT FALSE,
  has_office_space            BOOLEAN DEFAULT FALSE,
  wifi_speed_mbps             TEXT,
  wifi_coverage               TEXT,
  -- Outdoor & Grounds
  has_swimming_pool           BOOLEAN DEFAULT FALSE,
  has_heated_pool             BOOLEAN DEFAULT FALSE,
  has_indoor_pool             BOOLEAN DEFAULT FALSE,
  has_garden                  BOOLEAN DEFAULT FALSE,
  has_outdoor_seating         BOOLEAN DEFAULT FALSE,
  has_verandah                BOOLEAN DEFAULT FALSE,
  has_fire_pit                BOOLEAN DEFAULT FALSE,
  has_tennis_court            BOOLEAN DEFAULT FALSE,
  has_golf_access             BOOLEAN DEFAULT FALSE,
  has_farm_animals            BOOLEAN DEFAULT FALSE,
  has_orchard                 BOOLEAN DEFAULT FALSE,
  has_walking_trails          BOOLEAN DEFAULT FALSE,
  has_beach_access            BOOLEAN DEFAULT FALSE,
  has_lake_river_access       BOOLEAN DEFAULT FALSE,
  pool_type                   TEXT,
  -- Parking & Transport
  has_free_parking            BOOLEAN DEFAULT FALSE,
  has_onsite_parking          BOOLEAN DEFAULT FALSE,
  has_covered_parking         BOOLEAN DEFAULT FALSE,
  has_bus_coach_access        BOOLEAN DEFAULT FALSE,
  has_airport_transfers       BOOLEAN DEFAULT FALSE,
  has_helipad                 BOOLEAN DEFAULT FALSE,
  parking_spaces              INTEGER,
  distance_to_nearest_town    TEXT,
  -- Laundry & Housekeeping
  has_washing_machine         BOOLEAN DEFAULT FALSE,
  has_dryer                   BOOLEAN DEFAULT FALSE,
  has_iron                    BOOLEAN DEFAULT FALSE,
  has_linens                  BOOLEAN DEFAULT FALSE,
  has_towels                  BOOLEAN DEFAULT FALSE,
  has_daily_housekeeping      BOOLEAN DEFAULT FALSE,
  has_laundry_service         BOOLEAN DEFAULT FALSE,
  -- Climate & Comfort
  has_air_conditioning        BOOLEAN DEFAULT FALSE,
  has_central_heating         BOOLEAN DEFAULT FALSE,
  has_fireplace_heater        BOOLEAN DEFAULT FALSE,
  has_ceiling_fans            BOOLEAN DEFAULT FALSE,
  has_underfloor_heating      BOOLEAN DEFAULT FALSE,
  has_heated_bathroom_floors  BOOLEAN DEFAULT FALSE,
  -- Safety & Security
  has_smoke_detectors         BOOLEAN DEFAULT FALSE,
  has_co_detector             BOOLEAN DEFAULT FALSE,
  has_fire_extinguisher       BOOLEAN DEFAULT FALSE,
  has_first_aid               BOOLEAN DEFAULT FALSE,
  has_security_system         BOOLEAN DEFAULT FALSE,
  has_gated_property          BOOLEAN DEFAULT FALSE,
  has_cctv                    BOOLEAN DEFAULT FALSE,
  has_onsite_security         BOOLEAN DEFAULT FALSE,
  -- Good to Know
  wifi_details                TEXT,
  mobile_coverage_details     TEXT,
  wheelchair_access_details   TEXT,
  dietary_capability          TEXT,
  smoking_policy              TEXT,
  pets_policy                 TEXT,
  additional_amenity_notes    TEXT,
  -- Timestamps
  created_at                  TIMESTAMPTZ DEFAULT NOW(),
  updated_at                  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (venue_id, venue_type)
);

CREATE TRIGGER set_updated_at_venue_amenities
  BEFORE UPDATE ON venue_amenities
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE INDEX idx_venue_amenities_venue ON venue_amenities(venue_id, venue_type);


-- ============================================================
-- TABLE 9: venue_wellness_services
-- Tab: Wellness Services (Shared — 1-to-1 per venue)
-- ============================================================
CREATE TABLE venue_wellness_services (
  id                              UUID  PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_id                        UUID  NOT NULL,
  venue_type                      TEXT  NOT NULL CHECK (venue_type IN ('retreat', 'wellness')),
  -- Tab Content
  services_hero_image             TEXT,
  tab_label                       TEXT  DEFAULT 'Experiences & Add-Ons',
  tab_title                       TEXT  DEFAULT 'Enhance Your Retreat',
  tab_subtitle                    TEXT,
  intro_paragraph                 TEXT,
  -- Practitioners Section
  practitioners_section_label     TEXT  DEFAULT 'Resident Practitioners',
  practitioners_section_subtitle  TEXT,
  -- Service Availability
  onsite_practitioners            BOOLEAN DEFAULT FALSE,
  external_practitioners_welcome  BOOLEAN DEFAULT FALSE,
  byo_facilitator                 BOOLEAN DEFAULT FALSE,
  can_arrange_services            BOOLEAN DEFAULT FALSE,
  advance_booking_required        TEXT,
  service_pricing_model           TEXT,
  -- Massage & Bodywork
  has_swedish_massage             BOOLEAN DEFAULT FALSE,
  has_deep_tissue                 BOOLEAN DEFAULT FALSE,
  has_remedial_massage            BOOLEAN DEFAULT FALSE,
  has_aromatherapy_massage        BOOLEAN DEFAULT FALSE,
  has_hot_stone                   BOOLEAN DEFAULT FALSE,
  has_lymphatic_drainage          BOOLEAN DEFAULT FALSE,
  has_thai_massage                BOOLEAN DEFAULT FALSE,
  has_reflexology                 BOOLEAN DEFAULT FALSE,
  has_shiatsu                     BOOLEAN DEFAULT FALSE,
  has_craniosacral                BOOLEAN DEFAULT FALSE,
  has_myofascial                  BOOLEAN DEFAULT FALSE,
  has_pregnancy_massage           BOOLEAN DEFAULT FALSE,
  -- Movement & Fitness
  has_yoga                        BOOLEAN DEFAULT FALSE,
  has_pilates                     BOOLEAN DEFAULT FALSE,
  has_meditation                  BOOLEAN DEFAULT FALSE,
  has_breathwork                  BOOLEAN DEFAULT FALSE,
  has_tai_chi                     BOOLEAN DEFAULT FALSE,
  has_personal_training           BOOLEAN DEFAULT FALSE,
  has_nature_walks                BOOLEAN DEFAULT FALSE,
  has_sound_healing               BOOLEAN DEFAULT FALSE,
  has_dance_therapy               BOOLEAN DEFAULT FALSE,
  -- Holistic & Energy
  has_reiki                       BOOLEAN DEFAULT FALSE,
  has_energy_healing              BOOLEAN DEFAULT FALSE,
  has_acupuncture                 BOOLEAN DEFAULT FALSE,
  has_acupressure                 BOOLEAN DEFAULT FALSE,
  has_kinesiology                 BOOLEAN DEFAULT FALSE,
  has_hypnotherapy                BOOLEAN DEFAULT FALSE,
  has_crystal_healing             BOOLEAN DEFAULT FALSE,
  has_shamanic_healing            BOOLEAN DEFAULT FALSE,
  has_ayurvedic                   BOOLEAN DEFAULT FALSE,
  -- Nutrition & Detox
  has_nutritional_consultation    BOOLEAN DEFAULT FALSE,
  has_cooking_classes             BOOLEAN DEFAULT FALSE,
  has_juice_cleanse               BOOLEAN DEFAULT FALSE,
  has_detox_programs              BOOLEAN DEFAULT FALSE,
  has_plant_based_menu            BOOLEAN DEFAULT FALSE,
  has_fasting_programs            BOOLEAN DEFAULT FALSE,
  has_iv_therapy                  BOOLEAN DEFAULT FALSE,
  has_colonic_hydrotherapy        BOOLEAN DEFAULT FALSE,
  -- Mind & Spirit
  has_life_coaching               BOOLEAN DEFAULT FALSE,
  has_counselling                 BOOLEAN DEFAULT FALSE,
  has_mindfulness_training        BOOLEAN DEFAULT FALSE,
  has_psychotherapy               BOOLEAN DEFAULT FALSE,
  has_cacao_ceremony              BOOLEAN DEFAULT FALSE,
  has_mens_womens_circles         BOOLEAN DEFAULT FALSE,
  has_journaling_workshops        BOOLEAN DEFAULT FALSE,
  has_tarot_reading               BOOLEAN DEFAULT FALSE,
  has_astrology                   BOOLEAN DEFAULT FALSE,
  -- Beauty & Spa
  has_facials                     BOOLEAN DEFAULT FALSE,
  has_body_scrubs                 BOOLEAN DEFAULT FALSE,
  has_manicure_pedicure           BOOLEAN DEFAULT FALSE,
  has_hair_treatments             BOOLEAN DEFAULT FALSE,
  has_waxing                      BOOLEAN DEFAULT FALSE,
  has_makeup_services             BOOLEAN DEFAULT FALSE,
  -- Notes
  service_notes                   TEXT,
  -- Timestamps
  created_at                      TIMESTAMPTZ DEFAULT NOW(),
  updated_at                      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (venue_id, venue_type)
);

CREATE TRIGGER set_updated_at_venue_wellness_services
  BEFORE UPDATE ON venue_wellness_services
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE INDEX idx_venue_wellness_services_venue ON venue_wellness_services(venue_id, venue_type);


-- ============================================================
-- TABLE 10: venue_practitioners
-- Tab: Wellness Services (Shared — 1-to-many practitioner cards)
-- ============================================================
CREATE TABLE venue_practitioners (
  id                    UUID  PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_id              UUID  NOT NULL,
  venue_type            TEXT  NOT NULL CHECK (venue_type IN ('retreat', 'wellness')),
  avatar_url            TEXT,
  practitioner_name     TEXT,
  practitioner_title    TEXT,
  services              TEXT[],
  website_display_title TEXT,
  website_description   TEXT,
  show_on_website       BOOLEAN DEFAULT TRUE,
  sort_order            INTEGER DEFAULT 0,
  -- Timestamps
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  updated_at            TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER set_updated_at_venue_practitioners
  BEFORE UPDATE ON venue_practitioners
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE INDEX idx_venue_practitioners_venue ON venue_practitioners(venue_id, venue_type);


-- ============================================================
-- TABLE 11: venue_wellness_facilities
-- Tab: Wellness Facilities (Shared — 1-to-1 section header)
-- ============================================================
CREATE TABLE venue_wellness_facilities (
  id                    UUID  PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_id              UUID  NOT NULL,
  venue_type            TEXT  NOT NULL CHECK (venue_type IN ('retreat', 'wellness')),
  -- Tab Content
  facilities_hero_image TEXT,
  section_label         TEXT  DEFAULT 'Water & Healing',
  section_title         TEXT,
  section_subtitle      TEXT,
  intro_paragraph       TEXT,
  -- Timestamps
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  updated_at            TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (venue_id, venue_type)
);

CREATE TRIGGER set_updated_at_venue_wellness_facilities
  BEFORE UPDATE ON venue_wellness_facilities
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE INDEX idx_venue_wellness_facilities_venue ON venue_wellness_facilities(venue_id, venue_type);


-- ============================================================
-- TABLE 12: wellness_facility_items
-- Tab: Wellness Facilities (Shared — 1-to-many facility cards)
-- e.g. Sauna, Pool, Cold Plunge, Hot Plunge, Treatment Rooms
-- ============================================================
CREATE TABLE wellness_facility_items (
  id                    UUID  PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_id              UUID  NOT NULL,
  venue_type            TEXT  NOT NULL CHECK (venue_type IN ('retreat', 'wellness')),
  facility_name         TEXT,
  facility_image        TEXT,
  show_on_website       BOOLEAN DEFAULT TRUE,
  is_available          BOOLEAN DEFAULT TRUE,
  website_display_title TEXT,
  website_description   TEXT,
  -- Shared Detail Fields
  facility_type         TEXT,
  setting               TEXT,
  capacity              INTEGER,
  temperature_range     TEXT,
  is_private            BOOLEAN DEFAULT FALSE,
  operating_hours       TEXT,
  -- Pool-specific
  pool_type             TEXT,
  is_heated             BOOLEAN DEFAULT FALSE,
  pool_size             TEXT,
  pool_depth            TEXT,
  lap_swimming          BOOLEAN DEFAULT FALSE,
  -- Cold Plunge-specific
  plunge_type           TEXT,
  -- Hot Tub/Spa-specific
  hot_tub_type          TEXT,
  -- Generic features
  features              TEXT[],
  sort_order            INTEGER DEFAULT 0,
  -- Timestamps
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  updated_at            TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER set_updated_at_wellness_facility_items
  BEFORE UPDATE ON wellness_facility_items
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE INDEX idx_wellness_facility_items_venue ON wellness_facility_items(venue_id, venue_type);


-- ============================================================
-- TABLE 13: venue_pricing
-- Tab: Pricing & Booking (Shared — 1-to-1 per venue)
-- ============================================================
CREATE TABLE venue_pricing (
  id                            UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_id                      UUID    NOT NULL,
  venue_type                    TEXT    NOT NULL CHECK (venue_type IN ('retreat', 'wellness')),
  -- Tab Content
  pricing_hero_image            TEXT,
  section_label                 TEXT    DEFAULT 'Booking & Terms',
  section_title                 TEXT    DEFAULT 'Plan Your Retreat',
  section_subtitle              TEXT,
  -- Base Pricing
  currency                      TEXT    NOT NULL DEFAULT 'AUD',
  pricing_model                 TEXT    NOT NULL,
  price_range_category          TEXT,
  base_nightly_rate             NUMERIC,
  weekend_rate                  NUMERIC,
  weekly_rate                   NUMERIC,
  cleaning_fee                  NUMERIC,
  -- Group Discounts
  group_discounts_available     BOOLEAN DEFAULT FALSE,
  group_discount_percentage     NUMERIC,
  min_nights_for_discount       INTEGER,
  group_discount_details        TEXT,
  -- Seasonal
  holiday_surcharge_percentage  NUMERIC,
  -- Booking Rules
  min_stay_default              INTEGER,
  min_stay_weekends             INTEGER,
  max_stay                      INTEGER,
  advance_booking_required      TEXT,
  booking_window_opens          TEXT,
  checkin_day_restrictions      TEXT,
  checkin_time                  TEXT,
  checkout_time                 TEXT,
  -- Deposit & Payment
  booking_deposit               TEXT,
  deposit_due                   TEXT,
  balance_due                   TEXT,
  security_bond                 NUMERIC,
  bond_collection_method        TEXT,
  accepted_payment_methods      TEXT[],
  -- Cancellation Policy
  cancellation_policy_type      TEXT,
  cancellation_grace_period     TEXT,
  refund_policy_details         TEXT,
  -- Timestamps
  created_at                    TIMESTAMPTZ DEFAULT NOW(),
  updated_at                    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (venue_id, venue_type)
);

CREATE TRIGGER set_updated_at_venue_pricing
  BEFORE UPDATE ON venue_pricing
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE INDEX idx_venue_pricing_venue ON venue_pricing(venue_id, venue_type);


-- ============================================================
-- TABLE 14: venue_seasonal_pricing
-- Tab: Pricing & Booking (Shared — 1-to-many seasonal rows)
-- ============================================================
CREATE TABLE venue_seasonal_pricing (
  id            UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_id      UUID    NOT NULL,
  venue_type    TEXT    NOT NULL CHECK (venue_type IN ('retreat', 'wellness')),
  season_name   TEXT,
  date_range    TEXT,
  season_type   TEXT,
  nightly_rate  NUMERIC,
  minimum_stay  TEXT,
  -- Timestamps
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER set_updated_at_venue_seasonal_pricing
  BEFORE UPDATE ON venue_seasonal_pricing
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE INDEX idx_venue_seasonal_pricing_venue ON venue_seasonal_pricing(venue_id, venue_type);


-- ============================================================
-- TABLE 15: venue_media
-- Tab: Media (Shared — 1-to-1 per venue)
-- ============================================================
CREATE TABLE venue_media (
  id                  UUID  PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_id            UUID  NOT NULL,
  venue_type          TEXT  NOT NULL CHECK (venue_type IN ('retreat', 'wellness')),
  hero_image_url      TEXT,
  hero_image_alt      TEXT,
  hero_image_caption  TEXT,
  virtual_tour_url    TEXT,
  social_share_image  TEXT,
  twitter_card_image  TEXT,
  -- Timestamps
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (venue_id, venue_type)
);

CREATE TRIGGER set_updated_at_venue_media
  BEFORE UPDATE ON venue_media
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE INDEX idx_venue_media_venue ON venue_media(venue_id, venue_type);


-- ============================================================
-- TABLE 16: venue_gallery
-- Tab: Media (Shared — 1-to-many photos)
-- ============================================================
CREATE TABLE venue_gallery (
  id          UUID  PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_id    UUID  NOT NULL,
  venue_type  TEXT  NOT NULL CHECK (venue_type IN ('retreat', 'wellness')),
  image_url   TEXT  NOT NULL,
  category    TEXT,
  sort_order  INTEGER DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_venue_gallery_venue ON venue_gallery(venue_id, venue_type);


-- ============================================================
-- TABLE 17: venue_videos
-- Tab: Media (Shared — 1-to-many videos)
-- ============================================================
CREATE TABLE venue_videos (
  id                UUID  PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_id          UUID  NOT NULL,
  venue_type        TEXT  NOT NULL CHECK (venue_type IN ('retreat', 'wellness')),
  video_url         TEXT,
  video_title       TEXT,
  video_type        TEXT,
  is_featured       BOOLEAN DEFAULT FALSE,
  video_description TEXT,
  -- Timestamps
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER set_updated_at_venue_videos
  BEFORE UPDATE ON venue_videos
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE INDEX idx_venue_videos_venue ON venue_videos(venue_id, venue_type);


-- ============================================================
-- TABLE 18: venue_internal
-- Tab: Internal (Shared — 1-to-1, admin only)
-- ============================================================
CREATE TABLE venue_internal (
  id                              UUID  PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_id                        UUID  NOT NULL,
  venue_type                      TEXT  NOT NULL CHECK (venue_type IN ('retreat', 'wellness')),
  -- Verification Status
  identity_verified               BOOLEAN DEFAULT FALSE,
  identity_verified_date          DATE,
  property_ownership_verified     BOOLEAN DEFAULT FALSE,
  insurance_verified              BOOLEAN DEFAULT FALSE,
  insurance_details               TEXT,
  business_registration_verified  BOOLEAN DEFAULT FALSE,
  site_visit_completed            BOOLEAN DEFAULT FALSE,
  photo_verification_done         BOOLEAN DEFAULT FALSE,
  -- Pipeline & Sales
  lead_source                     TEXT,
  lead_owner                      TEXT,
  acquisition_date                DATE,
  pipeline_stage                  TEXT,
  first_contact_date              DATE,
  -- Subscription & Financials
  subscription_tier               TEXT,
  founder_discount                TEXT,
  billing_cycle                   TEXT,
  subscription_start_date         DATE,
  next_billing_date               DATE,
  booking_commission_rate         TEXT,
  experience_commission_rate      TEXT,
  stripe_connect_status           BOOLEAN DEFAULT FALSE,
  -- Internal Tags & Categorisation
  internal_tags                   TEXT[],
  priority_flags                  TEXT[],
  market_segment                  TEXT,
  venue_tier                      TEXT,
  -- Timestamps
  created_at                      TIMESTAMPTZ DEFAULT NOW(),
  updated_at                      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (venue_id, venue_type)
);

CREATE TRIGGER set_updated_at_venue_internal
  BEFORE UPDATE ON venue_internal
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE INDEX idx_venue_internal_venue ON venue_internal(venue_id, venue_type);
CREATE INDEX idx_venue_internal_pipeline ON venue_internal(pipeline_stage);


-- ============================================================
-- TABLE 19: venue_owner_manager
-- Tab: Owner/Manager (Shared — 1-to-1 per venue)
-- ============================================================
CREATE TABLE venue_owner_manager (
  id                            UUID  PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_id                      UUID  NOT NULL,
  venue_type                    TEXT  NOT NULL CHECK (venue_type IN ('retreat', 'wellness')),
  -- Contact Details
  first_name                    TEXT,
  last_name                     TEXT,
  role                          TEXT,
  email                         TEXT,
  phone_primary                 TEXT,
  phone_secondary               TEXT,
  mailing_address               TEXT,
  timezone                      TEXT,
  preferred_language            TEXT,
  -- Business Details
  business_name                 TEXT,
  abn_tax_id                    TEXT,
  business_type                 TEXT,
  registered_business_address   TEXT,
  gst_registered                BOOLEAN DEFAULT FALSE,
  -- Host Public Profile
  host_display_name             TEXT,
  host_image_url                TEXT,
  host_quote                    TEXT,
  host_bio                      TEXT,
  show_host_profile             BOOLEAN DEFAULT TRUE,
  -- Communication Preferences
  preferred_contact_method      TEXT,
  best_time_to_call             TEXT,
  response_time                 TEXT,
  booking_notifications         BOOLEAN DEFAULT TRUE,
  marketing_emails              BOOLEAN DEFAULT FALSE,
  platform_updates              BOOLEAN DEFAULT TRUE,
  -- Timestamps
  created_at                    TIMESTAMPTZ DEFAULT NOW(),
  updated_at                    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (venue_id, venue_type)
);

CREATE TRIGGER set_updated_at_venue_owner_manager
  BEFORE UPDATE ON venue_owner_manager
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE INDEX idx_venue_owner_manager_venue ON venue_owner_manager(venue_id, venue_type);


-- ============================================================
-- TABLE 20: venue_team_members
-- Tab: Owner/Manager (Shared — 1-to-many team cards)
-- ============================================================
CREATE TABLE venue_team_members (
  id          UUID  PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_id    UUID  NOT NULL,
  venue_type  TEXT  NOT NULL CHECK (venue_type IN ('retreat', 'wellness')),
  name        TEXT,
  role        TEXT,
  avatar_url  TEXT,
  status      TEXT,
  -- Timestamps
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER set_updated_at_venue_team_members
  BEFORE UPDATE ON venue_team_members
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE INDEX idx_venue_team_members_venue ON venue_team_members(venue_id, venue_type);


-- ============================================================
-- TABLE 21: bookings
-- Tab: Bookings (Shared — booking records)
-- ============================================================
CREATE TABLE bookings (
  id            UUID  PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_id      UUID  NOT NULL,
  venue_type    TEXT  NOT NULL CHECK (venue_type IN ('retreat', 'wellness')),
  guest_name    TEXT,
  guest_email   TEXT,
  guest_phone   TEXT,
  service_name  TEXT,
  checkin_date  DATE,
  checkout_date DATE,
  guest_count   INTEGER,
  amount        NUMERIC,
  status        TEXT  DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  notes         TEXT,
  -- Timestamps
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER set_updated_at_bookings
  BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE INDEX idx_bookings_venue        ON bookings(venue_id, venue_type);
CREATE INDEX idx_bookings_status       ON bookings(status);
CREATE INDEX idx_bookings_checkin_date ON bookings(checkin_date);


-- ============================================================
-- TABLE 22: venue_blocked_dates
-- Tab: Bookings (Shared — calendar blocked dates)
-- ============================================================
CREATE TABLE venue_blocked_dates (
  id            UUID  PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_id      UUID  NOT NULL,
  venue_type    TEXT  NOT NULL CHECK (venue_type IN ('retreat', 'wellness')),
  blocked_date  DATE  NOT NULL,
  block_reason  TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_venue_blocked_dates_venue ON venue_blocked_dates(venue_id, venue_type);
CREATE INDEX idx_venue_blocked_dates_date  ON venue_blocked_dates(blocked_date);


-- ============================================================
-- TABLE 23: venue_reviews
-- Tab: Reviews (Shared — guest reviews)
-- ============================================================
CREATE TABLE venue_reviews (
  id              UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_id        UUID    NOT NULL,
  venue_type      TEXT    NOT NULL CHECK (venue_type IN ('retreat', 'wellness')),
  user_name       TEXT    NOT NULL,
  user_image_url  TEXT,
  rating          INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  review_text     TEXT    NOT NULL,
  review_date     DATE    DEFAULT CURRENT_DATE,
  -- Timestamps
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER set_updated_at_venue_reviews
  BEFORE UPDATE ON venue_reviews
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE INDEX idx_venue_reviews_venue  ON venue_reviews(venue_id, venue_type);
CREATE INDEX idx_venue_reviews_rating ON venue_reviews(rating);


-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- Enable RLS on all 23 tables.
-- Policy: authenticated users (admin staff) have full access.
-- This matches the existing pattern on enquiries, profiles, etc.
-- ============================================================

-- Retreat-specific tables
ALTER TABLE retreat_venues             ENABLE ROW LEVEL SECURITY;
ALTER TABLE retreat_accommodation      ENABLE ROW LEVEL SECURITY;
ALTER TABLE retreat_rooms              ENABLE ROW LEVEL SECURITY;
ALTER TABLE retreat_facilities         ENABLE ROW LEVEL SECURITY;
ALTER TABLE retreat_spaces             ENABLE ROW LEVEL SECURITY;

-- Wellness-specific tables
ALTER TABLE wellness_venues            ENABLE ROW LEVEL SECURITY;
ALTER TABLE wellness_accommodation     ENABLE ROW LEVEL SECURITY;

-- Shared tables
ALTER TABLE venue_amenities            ENABLE ROW LEVEL SECURITY;
ALTER TABLE venue_wellness_services    ENABLE ROW LEVEL SECURITY;
ALTER TABLE venue_practitioners        ENABLE ROW LEVEL SECURITY;
ALTER TABLE venue_wellness_facilities  ENABLE ROW LEVEL SECURITY;
ALTER TABLE wellness_facility_items    ENABLE ROW LEVEL SECURITY;
ALTER TABLE venue_pricing              ENABLE ROW LEVEL SECURITY;
ALTER TABLE venue_seasonal_pricing     ENABLE ROW LEVEL SECURITY;
ALTER TABLE venue_media                ENABLE ROW LEVEL SECURITY;
ALTER TABLE venue_gallery              ENABLE ROW LEVEL SECURITY;
ALTER TABLE venue_videos               ENABLE ROW LEVEL SECURITY;
ALTER TABLE venue_internal             ENABLE ROW LEVEL SECURITY;
ALTER TABLE venue_owner_manager        ENABLE ROW LEVEL SECURITY;
ALTER TABLE venue_team_members         ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings                   ENABLE ROW LEVEL SECURITY;
ALTER TABLE venue_blocked_dates        ENABLE ROW LEVEL SECURITY;
ALTER TABLE venue_reviews              ENABLE ROW LEVEL SECURITY;


-- ============================================================
-- RLS POLICIES
-- Single "authenticated users only" policy per table (FOR ALL).
-- Covers SELECT, INSERT, UPDATE, DELETE in one rule.
-- ============================================================

-- Retreat-specific
CREATE POLICY "Authenticated users only" ON retreat_venues
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users only" ON retreat_accommodation
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users only" ON retreat_rooms
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users only" ON retreat_facilities
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users only" ON retreat_spaces
  FOR ALL USING (auth.role() = 'authenticated');

-- Wellness-specific
CREATE POLICY "Authenticated users only" ON wellness_venues
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users only" ON wellness_accommodation
  FOR ALL USING (auth.role() = 'authenticated');

-- Shared
CREATE POLICY "Authenticated users only" ON venue_amenities
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users only" ON venue_wellness_services
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users only" ON venue_practitioners
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users only" ON venue_wellness_facilities
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users only" ON wellness_facility_items
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users only" ON venue_pricing
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users only" ON venue_seasonal_pricing
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users only" ON venue_media
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users only" ON venue_gallery
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users only" ON venue_videos
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users only" ON venue_internal
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users only" ON venue_owner_manager
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users only" ON venue_team_members
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users only" ON bookings
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users only" ON venue_blocked_dates
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users only" ON venue_reviews
  FOR ALL USING (auth.role() = 'authenticated');


-- ============================================================
-- MIGRATION COMPLETE
-- 23 tables created with RLS enabled:
--
-- Retreat-specific (5):
--   retreat_venues, retreat_accommodation, retreat_rooms,
--   retreat_facilities, retreat_spaces
--
-- Wellness-specific (2):
--   wellness_venues, wellness_accommodation
--
-- Shared via venue_id + venue_type (16):
--   venue_amenities, venue_wellness_services, venue_practitioners,
--   venue_wellness_facilities, wellness_facility_items,
--   venue_pricing, venue_seasonal_pricing,
--   venue_media, venue_gallery, venue_videos,
--   venue_internal, venue_owner_manager, venue_team_members,
--   bookings, venue_blocked_dates, venue_reviews
-- ============================================================
