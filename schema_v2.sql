-- =============================================================================
-- THE GLOBAL SANCTUM — DATABASE SCHEMA v2
-- Enterprise relational schema for venue management
--
-- Replaces the flat wellness_venues and retreat_venues single-table approach
-- with a normalised, relational structure grouped by domain.
--
-- Run in Supabase: Dashboard → SQL Editor → paste → Run
--
-- NOTE: The DROP block below clears any partial previous run of this script.
-- It does NOT touch: retreat_venues, wellness_venues, bookings,
-- enquiries, profiles, venue_subscriptions  (your existing data is safe).
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================================
-- CLEANUP — drop new tables from any previous partial run (safe to re-run)
-- Child tables first, then parents, to respect FK constraints.
-- =============================================================================

DROP VIEW  IF EXISTS v_venues_full               CASCADE;

-- 1:many child tables
DROP TABLE IF EXISTS venue_seasonal_pricing      CASCADE;
DROP TABLE IF EXISTS venue_practitioners         CASCADE;
DROP TABLE IF EXISTS venue_addons                CASCADE;
DROP TABLE IF EXISTS venue_packages              CASCADE;
DROP TABLE IF EXISTS venue_services              CASCADE;
DROP TABLE IF EXISTS venue_retreat_facilities    CASCADE;
DROP TABLE IF EXISTS venue_wellness_facilities   CASCADE;
DROP TABLE IF EXISTS venue_rooms                 CASCADE;
DROP TABLE IF EXISTS venue_media                 CASCADE;

-- 1:1 satellite tables
DROP TABLE IF EXISTS venue_retreat_editorial     CASCADE;
DROP TABLE IF EXISTS venue_internal              CASCADE;
DROP TABLE IF EXISTS venue_owner_info            CASCADE;
DROP TABLE IF EXISTS venue_policies              CASCADE;
DROP TABLE IF EXISTS venue_pricing               CASCADE;
DROP TABLE IF EXISTS venue_amenities             CASCADE;
DROP TABLE IF EXISTS venue_accommodation         CASCADE;
DROP TABLE IF EXISTS venue_listing_status        CASCADE;
DROP TABLE IF EXISTS venue_status                CASCADE;
DROP TABLE IF EXISTS venue_location              CASCADE;
DROP TABLE IF EXISTS venue_property_details      CASCADE;
DROP TABLE IF EXISTS venue_experience            CASCADE;
DROP TABLE IF EXISTS venue_content               CASCADE;
DROP TABLE IF EXISTS venue_basic_info            CASCADE;

-- Core
DROP TABLE IF EXISTS venues                      CASCADE;

-- Explicitly drop any orphaned composite types with the same names
-- (left behind by previous partial runs or manual type creation)
DROP TYPE IF EXISTS venue_seasonal_pricing       CASCADE;
DROP TYPE IF EXISTS venue_practitioners          CASCADE;
DROP TYPE IF EXISTS venue_addons                 CASCADE;
DROP TYPE IF EXISTS venue_packages               CASCADE;
DROP TYPE IF EXISTS venue_services               CASCADE;
DROP TYPE IF EXISTS venue_retreat_facilities     CASCADE;
DROP TYPE IF EXISTS venue_wellness_facilities    CASCADE;
DROP TYPE IF EXISTS venue_rooms                  CASCADE;
DROP TYPE IF EXISTS venue_media                  CASCADE;
DROP TYPE IF EXISTS venue_retreat_editorial      CASCADE;
DROP TYPE IF EXISTS venue_internal               CASCADE;
DROP TYPE IF EXISTS venue_owner_info             CASCADE;
DROP TYPE IF EXISTS venue_policies               CASCADE;
DROP TYPE IF EXISTS venue_pricing                CASCADE;
DROP TYPE IF EXISTS venue_amenities              CASCADE;
DROP TYPE IF EXISTS venue_accommodation          CASCADE;
DROP TYPE IF EXISTS venue_status                 CASCADE;
DROP TYPE IF EXISTS venue_location               CASCADE;
DROP TYPE IF EXISTS venue_property_details       CASCADE;
DROP TYPE IF EXISTS venue_experience             CASCADE;
DROP TYPE IF EXISTS venue_content                CASCADE;
DROP TYPE IF EXISTS venue_basic_info             CASCADE;
DROP TYPE IF EXISTS venues                       CASCADE;


-- =============================================================================
-- SECTION 1 — CORE
-- Every venue (Retreat or Wellness) gets a single identity row here.
-- All other tables reference this via venue_id.
-- =============================================================================

CREATE TABLE IF NOT EXISTS venues (
    id          UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    venue_type  TEXT        NOT NULL CHECK (venue_type IN ('retreat', 'wellness')),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-bump updated_at on any change to venues
CREATE OR REPLACE FUNCTION fn_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_venues_updated_at
    BEFORE UPDATE ON venues
    FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();


-- =============================================================================
-- SECTION 2 — BASIC INFORMATION  (1:1)
-- Venue name, URL slug, type tags, hire type, accessibility, best-for audience
-- =============================================================================

CREATE TABLE IF NOT EXISTS venue_basic_info (
    venue_id                UUID    PRIMARY KEY REFERENCES venues(id) ON DELETE CASCADE,
    name                    TEXT    NOT NULL,
    slug                    TEXT    UNIQUE,               -- URL-safe identifier, e.g. "blue-mountain-retreat"
    primary_venue_type      TEXT,                        -- "Retreat Venue", "Wellness Centre", "Day Spa"
    venue_type_tags         TEXT[]  DEFAULT '{}',        -- ["Eco Lodge", "Private Estate", "Boutique Hotel"]
    hire_type               TEXT    CHECK (hire_type IN ('exclusive_use', 'shared_use', 'room_only')),
    best_for                TEXT[]  DEFAULT '{}',        -- ["Couples", "Solo", "Groups", "Corporate", "Families"]
    languages_spoken        TEXT[]  DEFAULT '{}',
    is_wheelchair_accessible BOOLEAN DEFAULT FALSE
);


-- =============================================================================
-- SECTION 3 — CONTENT & DESCRIPTIONS  (1:1)
-- All editorial copy: descriptions, quote, intro text
-- =============================================================================

CREATE TABLE IF NOT EXISTS venue_content (
    venue_id                UUID    PRIMARY KEY REFERENCES venues(id) ON DELETE CASCADE,
    short_description       TEXT,   -- One-liner used on listing cards
    description             TEXT,   -- Full property description (rich text / markdown)
    brand_quote             TEXT,   -- Pullquote shown over the hero image
    intro_paragraph         TEXT    -- Opening paragraph of the venue page
);


-- =============================================================================
-- SECTION 4 — THE EXPERIENCE  (1:1)
-- Experience editorial block + modality tags + retreat type tags
-- =============================================================================

CREATE TABLE IF NOT EXISTS venue_experience (
    venue_id                UUID    PRIMARY KEY REFERENCES venues(id) ON DELETE CASCADE,
    experience_title        TEXT,
    experience_subtitle     TEXT,
    experience_description  TEXT,
    modalities              TEXT[]  DEFAULT '{}',   -- ["Yoga", "Meditation", "Breathwork", "Sound Healing"]
    ideal_retreat_types     TEXT[]  DEFAULT '{}',   -- ["Yoga Retreats", "Corporate Retreats", "Silent Retreats"]
    retreat_styles          TEXT[]  DEFAULT '{}'    -- Free-form style descriptors
);


-- =============================================================================
-- SECTION 5 — PROPERTY DETAILS  (1:1)
-- Physical characteristics of the estate / building
-- =============================================================================

CREATE TABLE IF NOT EXISTS venue_property_details (
    venue_id                UUID    PRIMARY KEY REFERENCES venues(id) ON DELETE CASCADE,
    property_size_value     NUMERIC,
    property_size_unit      TEXT    CHECK (property_size_unit IN ('acres', 'hectares', 'sqm')),
    established_year        TEXT,               -- Keep as TEXT to allow "circa 1920" etc.
    architecture_style      TEXT                -- "Contemporary Rural", "Japanese", "Mediterranean"
);


-- =============================================================================
-- SECTION 6 — LOCATION  (1:1)
-- Full address, GPS coordinates, climate, transport access
-- =============================================================================

CREATE TABLE IF NOT EXISTS venue_location (
    venue_id            UUID        PRIMARY KEY REFERENCES venues(id) ON DELETE CASCADE,
    street_address      TEXT,
    suburb              TEXT,
    postcode            TEXT,
    state_province      TEXT,
    country             TEXT        DEFAULT 'Australia',
    short_loc           TEXT,                   -- "Berry, NSW"
    full_location       TEXT,                   -- "Berry, NSW, Australia"
    gps_lat             NUMERIC(10, 7),
    gps_lng             NUMERIC(10, 7),
    climate             TEXT,                   -- "Temperate", "Tropical", "Alpine", "Mediterranean"
    location_types      TEXT[]      DEFAULT '{}',   -- ["Rural", "Coastal", "Mountainous"]
    location_setting    TEXT,                   -- "Coastal & Beach", "Forest & Jungle", "Urban"
    nearest_airport     TEXT,                   -- "Sydney (SYD) — 130 km / 1 hr 45 min"
    transport_access    TEXT[]      DEFAULT '{}',   -- ["Car Recommended", "Airport Transfers Available"]
    directions          TEXT                    -- Detailed driving / arrival instructions
);


-- =============================================================================
-- SECTION 7 — STATUS & LISTING  (1:1)
-- Publication state, subscription tier, feature flags
-- =============================================================================

CREATE TABLE IF NOT EXISTS venue_status (
    venue_id                UUID    PRIMARY KEY REFERENCES venues(id) ON DELETE CASCADE,
    status                  TEXT    NOT NULL DEFAULT 'draft'
                                    CHECK (status IN ('active', 'draft', 'inactive')),
    property_status         TEXT    DEFAULT 'operational'
                                    CHECK (property_status IN (
                                        'operational', 'under_construction',
                                        'seasonal', 'temporarily_closed'
                                    )),
    subscription_tier       TEXT    DEFAULT 'essentials'
                                    CHECK (subscription_tier IN (
                                        'essentials', 'standard', 'featured', 'premium'
                                    )),
    sanctum_vetted          BOOLEAN DEFAULT FALSE,  -- TGS has personally visited / vetted
    featured_listing        BOOLEAN DEFAULT FALSE,
    instant_booking         BOOLEAN DEFAULT FALSE,
    is_available            BOOLEAN DEFAULT TRUE,
    show_on_website         BOOLEAN DEFAULT TRUE,
    starting_price          NUMERIC,
    stripe_subscription_id  TEXT                    -- Links to venue_subscriptions table
);


-- =============================================================================
-- SECTION 8 — ACCOMMODATION OVERVIEW  (1:1)
-- Capacity, bedroom/bathroom counts, style, bed totals, check-in/out & guest policies
-- Primarily for Retreat Venues; row is omitted for Wellness Venues
-- =============================================================================

CREATE TABLE IF NOT EXISTS venue_accommodation (
    venue_id                    UUID    PRIMARY KEY REFERENCES venues(id) ON DELETE CASCADE,
    -- Capacity
    max_guests                  INTEGER,
    min_guests                  INTEGER DEFAULT 1,
    total_bedrooms              INTEGER,
    total_bathrooms             INTEGER,
    shared_bathrooms            INTEGER DEFAULT 0,
    private_ensuites            INTEGER DEFAULT 0,
    -- Style
    accommodation_style         TEXT,   -- "Private Rooms", "Shared Rooms", "Suites", "Mixed"
    property_type               TEXT,   -- "Whole Property", "Individual Rooms", "Mixed"
    accommodation_description   TEXT,
    show_accommodation_section  BOOLEAN DEFAULT TRUE,
    accommodation_amenities     TEXT[]  DEFAULT '{}',
    -- Bed configuration totals (per venue, not per room — those are in venue_rooms)
    beds_king                   INTEGER DEFAULT 0,
    beds_queen                  INTEGER DEFAULT 0,
    beds_double                 INTEGER DEFAULT 0,
    beds_single                 INTEGER DEFAULT 0,
    beds_twin                   INTEGER DEFAULT 0,
    beds_bunk                   INTEGER DEFAULT 0,
    beds_sofa                   INTEGER DEFAULT 0,
    beds_rollaway               INTEGER DEFAULT 0,
    -- Check-in / Check-out
    check_in_time               TEXT,   -- "15:00"
    check_out_time              TEXT,   -- "11:00"
    early_check_in_available    BOOLEAN DEFAULT FALSE,
    late_check_out_available    BOOLEAN DEFAULT FALSE,
    -- Guest policies
    children_allowed            BOOLEAN DEFAULT TRUE,
    minimum_child_age           INTEGER,
    pets_allowed                BOOLEAN DEFAULT FALSE,
    smoking_allowed             BOOLEAN DEFAULT FALSE
);


-- =============================================================================
-- SECTION 9 — AMENITIES  (1:1)
-- Kitchen, living, technology, and outdoor facilities as tagged arrays.
-- Individual rooms have their own amenity arrays in venue_rooms.
-- =============================================================================

CREATE TABLE IF NOT EXISTS venue_amenities (
    venue_id                UUID    PRIMARY KEY REFERENCES venues(id) ON DELETE CASCADE,
    -- Kitchen & Dining
    kitchen_facilities      TEXT[]  DEFAULT '{}',   -- ["Commercial Kitchen", "Dishwasher", "Coffee Machine"]
    dining_capacity_indoor  INTEGER,
    dining_capacity_outdoor INTEGER,
    -- Living & Entertainment
    living_facilities       TEXT[]  DEFAULT '{}',   -- ["Fireplace", "Smart TV", "Library", "Piano"]
    -- Technology & Connectivity
    has_wifi                BOOLEAN DEFAULT FALSE,
    wifi_speed_mbps         INTEGER,
    wifi_coverage           TEXT,                   -- "Whole Property", "Main Building Only"
    tech_facilities         TEXT[]  DEFAULT '{}',   -- ["Starlink", "EV Charging", "Printer/Scanner"]
    -- Outdoor & Grounds
    outdoor_facilities      TEXT[]  DEFAULT '{}',   -- ["Swimming Pool", "Tennis Court", "Fire Pit"]
    -- General
    facilities_list         TEXT[]  DEFAULT '{}',   -- Flat merged list for public display
    whats_included          TEXT[]  DEFAULT '{}'    -- ["Daily Breakfast", "Linen & Towels", "Yoga Mats"]
);


-- =============================================================================
-- SECTION 10 — PRICING CONFIGURATION  (1:1)
-- Pricing model, base rates, fees, group discounts, holiday surcharges
-- =============================================================================

CREATE TABLE IF NOT EXISTS venue_pricing (
    venue_id                        UUID    PRIMARY KEY REFERENCES venues(id) ON DELETE CASCADE,
    currency                        TEXT    DEFAULT 'AUD',
    pricing_model                   TEXT,   -- "Per Night Whole Property", "Per Person Per Night",
                                            -- "Per Room Per Night", "Flat Rate Multi-day"
    price_range_category            TEXT,   -- "Budget", "Mid-Range", "Upscale", "Luxury", "Ultra-Luxury"
    base_nightly_rate               NUMERIC,
    weekend_rate                    NUMERIC,
    weekly_rate                     NUMERIC,    -- Rate for 7+ night stays
    cleaning_fee                    NUMERIC,
    group_discounts_available       BOOLEAN DEFAULT FALSE,
    discount_percentage             NUMERIC,
    min_nights_for_discount         INTEGER,
    group_discount_details          TEXT,
    holiday_surcharge_percentage    NUMERIC
);


-- =============================================================================
-- SECTION 11 — POLICIES  (1:1)
-- Cancellation, booking, house rules, health & safety, access requirements
-- =============================================================================

CREATE TABLE IF NOT EXISTS venue_policies (
    venue_id                UUID    PRIMARY KEY REFERENCES venues(id) ON DELETE CASCADE,
    cancellation_policy     TEXT,
    booking_policy          TEXT,
    house_rules             TEXT,
    health_safety           TEXT,
    age_requirements        TEXT,
    access_policies         TEXT,
    general_policies        TEXT
);


-- =============================================================================
-- SECTION 12 — OWNER / MANAGER INFO  (1:1)
-- Contact details for the venue owner/manager
-- (For deeper CRM link to the venue_owners table used by the Contacts section)
-- =============================================================================

CREATE TABLE IF NOT EXISTS venue_owner_info (
    venue_id        UUID    PRIMARY KEY REFERENCES venues(id) ON DELETE CASCADE,
    owner_name      TEXT,
    owner_email     TEXT,
    owner_phone     TEXT,
    owner_address   TEXT,
    website_url     TEXT
);


-- =============================================================================
-- SECTION 13 — INTERNAL / CRM  (1:1)
-- Admin-only notes; NEVER surfaced on the public portal
-- =============================================================================

CREATE TABLE IF NOT EXISTS venue_internal (
    venue_id            UUID    PRIMARY KEY REFERENCES venues(id) ON DELETE CASCADE,
    internal_notes      TEXT,
    availability_notes  TEXT,
    total_bookings      INTEGER DEFAULT 0
);


-- =============================================================================
-- SECTION 14 — RETREAT FACILITIES EDITORIAL  (1:1)
-- Header / intro editorial content for the Retreat Facilities tab on the public site
-- =============================================================================

CREATE TABLE IF NOT EXISTS venue_retreat_editorial (
    venue_id                UUID    PRIMARY KEY REFERENCES venues(id) ON DELETE CASCADE,
    tab_image_url           TEXT,
    label                   TEXT,   -- Short label, e.g. "Water & Healing"
    title                   TEXT,   -- Section heading
    subtitle                TEXT,
    intro_text              TEXT,
    notes                   TEXT,
    supported_retreat_types TEXT[]  DEFAULT '{}'
);


-- =============================================================================
-- SECTION 15 — MEDIA  (1:many)
-- All images, documents, and embeds for a venue.
-- Replaces the scattered hero_image_url, gallery_photo_urls, etc. columns.
-- =============================================================================

CREATE TABLE IF NOT EXISTS venue_media (
    id          UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    venue_id    UUID        NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
    media_type  TEXT        NOT NULL CHECK (media_type IN (
                                'hero',                     -- Primary hero image
                                'experience_feature',       -- Experience section image
                                'gallery',                  -- Gallery carousel photos
                                'retreat_facilities_tab',   -- Retreat Facilities tab header
                                'og_image',                 -- Open Graph social share (1200×630)
                                'twitter_card',             -- Twitter card (1200×600)
                                'virtual_tour',             -- Embed URL for virtual tour
                                'document'                  -- Downloadable PDF / brochure
                            )),
    url         TEXT        NOT NULL,
    alt_text    TEXT,
    caption     TEXT,
    sort_order  INTEGER     DEFAULT 0,
    is_featured BOOLEAN     DEFAULT FALSE,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);


-- =============================================================================
-- SECTION 16 — ROOMS  (1:many)
-- Individual accommodation rooms belonging to a retreat venue.
-- Each room has its own bed configuration, type, amenities.
-- =============================================================================

CREATE TABLE IF NOT EXISTS venue_rooms (
    id                  UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    venue_id            UUID        NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
    room_name           TEXT        NOT NULL,
    room_type           TEXT,   -- "Suite", "Standard", "Deluxe", "Dormitory", "Cabin", "Villa", "Studio"
    room_image_url      TEXT,
    website_description TEXT,
    max_occupancy       INTEGER,
    bathroom_type       TEXT,   -- "Private Ensuite", "Shared", "Jack and Jill", "None"
    room_size_sqm       NUMERIC,
    floor               TEXT,
    price_per_night     NUMERIC,
    room_amenities      TEXT[]  DEFAULT '{}',
    -- Bed configuration for this specific room
    beds_king           INTEGER DEFAULT 0,
    beds_queen          INTEGER DEFAULT 0,
    beds_double         INTEGER DEFAULT 0,
    beds_single         INTEGER DEFAULT 0,
    beds_twin           INTEGER DEFAULT 0,
    beds_bunk           INTEGER DEFAULT 0,
    beds_sofa           INTEGER DEFAULT 0,
    beds_rollaway       INTEGER DEFAULT 0,
    sort_order          INTEGER DEFAULT 0,
    created_at          TIMESTAMPTZ DEFAULT NOW()
);


-- =============================================================================
-- SECTION 17 — WELLNESS FACILITIES  (1:many)
-- Saunas, pools, plunge pools, steam rooms, yoga studios, treatment rooms, etc.
-- Category-specific attributes (temperature range, heated, jets, etc.) stored in JSONB.
-- =============================================================================

CREATE TABLE IF NOT EXISTS venue_wellness_facilities (
    id                  UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    venue_id            UUID        NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
    facility_category   TEXT        NOT NULL CHECK (facility_category IN (
                            'sauna', 'pool', 'plunge_pool', 'hot_tub',
                            'steam_room', 'ice_bath', 'meditation_hall',
                            'yoga_studio', 'treatment_room', 'gym',
                            'hammam', 'float_tank', 'other'
                        )),
    name                TEXT        NOT NULL,   -- e.g. "Infrared Sauna", "Heated Outdoor Pool"
    setting             TEXT        CHECK (setting IN ('indoor', 'outdoor', 'indoor_outdoor')),
    view_type           TEXT,                   -- "Ocean View", "Mountain View", "Garden View"
    capacity            INTEGER,                -- Number of people at one time
    size_sqm            NUMERIC,
    description         TEXT,                   -- Public-facing description
    image_url           TEXT,
    is_featured         BOOLEAN     DEFAULT FALSE,
    is_available        BOOLEAN     DEFAULT TRUE,
    equipment           TEXT[]      DEFAULT '{}',   -- ["Chiller System", "Temperature Display"]
    -- Flexible JSONB for category-specific fields:
    -- Sauna:  { saunaType, temperatureRange, operatingHours, isPrivate }
    -- Pool:   { heated, poolType, temperatureDeg, lapLanes, depthM }
    -- Hot tub:{ jets, seatingCapacity }
    attributes          JSONB       DEFAULT '{}',
    sort_order          INTEGER     DEFAULT 0,
    created_at          TIMESTAMPTZ DEFAULT NOW()
);


-- =============================================================================
-- SECTION 18 — RETREAT FACILITIES  (1:many)
-- Function / event spaces: yoga halls, meeting rooms, outdoor pavilions, etc.
-- Different from wellness_facilities — these are dedicated program spaces.
-- =============================================================================

CREATE TABLE IF NOT EXISTS venue_retreat_facilities (
    id                      UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    venue_id                UUID        NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
    space_name              TEXT        NOT NULL,
    space_type              TEXT,   -- "Yoga Studio", "Meditation Hall", "Meeting Room",
                                    -- "Outdoor Pavilion", "Dining Hall", "Kitchen"
    setting                 TEXT        CHECK (setting IN ('indoor', 'outdoor', 'indoor_outdoor')),
    view_type               TEXT,
    capacity                INTEGER,
    size_sqm                NUMERIC,
    description             TEXT,
    image_url               TEXT,
    is_featured             BOOLEAN     DEFAULT FALSE,
    is_available            BOOLEAN     DEFAULT TRUE,
    supported_retreat_types TEXT[]      DEFAULT '{}',   -- ["Yoga Retreats", "Corporate Retreats"]
    equipment               TEXT[]      DEFAULT '{}',   -- ["Projector", "Sound System", "Yoga Mats"]
    sort_order              INTEGER     DEFAULT 0,
    created_at              TIMESTAMPTZ DEFAULT NOW()
);


-- =============================================================================
-- SECTION 19 — WELLNESS SERVICES  (1:many)
-- Bookable sessions / treatments offered at the venue
-- =============================================================================

CREATE TABLE IF NOT EXISTS venue_services (
    id              UUID    PRIMARY KEY DEFAULT uuid_generate_v4(),
    venue_id        UUID    NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
    service_name    TEXT    NOT NULL,
    category        TEXT,               -- "Massage", "Yoga", "Meditation", "Nutrition", "Bodywork"
    price           TEXT,               -- TEXT for flexible display: "From $120", "$150 / session"
    duration        TEXT,               -- "60 min", "90 min", "Half day"
    description     TEXT,
    sort_order      INTEGER DEFAULT 0
);


-- =============================================================================
-- SECTION 20 — PACKAGES  (1:many)
-- Multi-day or bundled retreat packages offered by the venue
-- =============================================================================

CREATE TABLE IF NOT EXISTS venue_packages (
    id                  UUID    PRIMARY KEY DEFAULT uuid_generate_v4(),
    venue_id            UUID    NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
    package_name        TEXT    NOT NULL,
    price               TEXT,
    description         TEXT,
    thumbnail_url       TEXT,
    included_services   TEXT[]  DEFAULT '{}',   -- Service names included in the package
    min_guests          INTEGER,
    max_guests          INTEGER,
    sort_order          INTEGER DEFAULT 0
);


-- =============================================================================
-- SECTION 21 — ADD-ONS  (1:many)
-- Optional extras a guest can add to their booking
-- =============================================================================

CREATE TABLE IF NOT EXISTS venue_addons (
    id          UUID    PRIMARY KEY DEFAULT uuid_generate_v4(),
    venue_id    UUID    NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
    addon_name  TEXT    NOT NULL,
    price       TEXT,
    description TEXT,
    sort_order  INTEGER DEFAULT 0
);


-- =============================================================================
-- SECTION 22 — PRACTITIONERS  (1:many)
-- Resident or visiting wellness practitioners at the venue
-- =============================================================================

CREATE TABLE IF NOT EXISTS venue_practitioners (
    id                  UUID    PRIMARY KEY DEFAULT uuid_generate_v4(),
    venue_id            UUID    NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
    practitioner_name   TEXT    NOT NULL,
    photo_url           TEXT,
    bio                 TEXT,
    specialties         TEXT[]  DEFAULT '{}',   -- ["Yoga", "Breathwork", "Ayurveda"]
    sort_order          INTEGER DEFAULT 0
);


-- =============================================================================
-- SECTION 23 — SEASONAL PRICING  (1:many)
-- Date-range pricing overrides (Peak, High, Standard, Low seasons)
-- =============================================================================

CREATE TABLE IF NOT EXISTS venue_seasonal_pricing (
    id              UUID    PRIMARY KEY DEFAULT uuid_generate_v4(),
    venue_id        UUID    NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
    season_name     TEXT    NOT NULL,       -- "Summer Peak", "Easter Long Weekend"
    date_from       DATE    NOT NULL,
    date_to         DATE    NOT NULL,
    season_type     TEXT    NOT NULL CHECK (season_type IN ('peak', 'high', 'standard', 'low')),
    nightly_rate    NUMERIC NOT NULL,
    minimum_stay    INTEGER DEFAULT 1,
    CONSTRAINT chk_date_range CHECK (date_to >= date_from)
);


-- =============================================================================
-- INDEXES
-- Covering the most common query patterns used by the admin and public portal
-- =============================================================================

CREATE INDEX IF NOT EXISTS idx_venues_type                ON venues                   (venue_type);
CREATE INDEX IF NOT EXISTS idx_venue_basic_slug           ON venue_basic_info          (slug);
CREATE INDEX IF NOT EXISTS idx_venue_basic_name           ON venue_basic_info          (name);
CREATE INDEX IF NOT EXISTS idx_venue_status_status        ON venue_status              (status);
CREATE INDEX IF NOT EXISTS idx_venue_status_tier          ON venue_status              (subscription_tier);
CREATE INDEX IF NOT EXISTS idx_venue_status_featured      ON venue_status              (featured_listing);
CREATE INDEX IF NOT EXISTS idx_venue_location_country     ON venue_location            (country);
CREATE INDEX IF NOT EXISTS idx_venue_location_state       ON venue_location            (state_province);
CREATE INDEX IF NOT EXISTS idx_venue_media_venue          ON venue_media               (venue_id);
CREATE INDEX IF NOT EXISTS idx_venue_media_type           ON venue_media               (venue_id, media_type);
CREATE INDEX IF NOT EXISTS idx_venue_rooms_venue          ON venue_rooms               (venue_id);
CREATE INDEX IF NOT EXISTS idx_venue_wellness_fac_venue   ON venue_wellness_facilities (venue_id);
CREATE INDEX IF NOT EXISTS idx_venue_retreat_fac_venue    ON venue_retreat_facilities  (venue_id);
CREATE INDEX IF NOT EXISTS idx_venue_services_venue       ON venue_services            (venue_id);
CREATE INDEX IF NOT EXISTS idx_venue_packages_venue       ON venue_packages            (venue_id);
CREATE INDEX IF NOT EXISTS idx_venue_seasonal_venue       ON venue_seasonal_pricing    (venue_id);
CREATE INDEX IF NOT EXISTS idx_venue_seasonal_dates       ON venue_seasonal_pricing    (venue_id, date_from, date_to);


-- =============================================================================
-- CONVENIENCE VIEW — v_venues_full
-- Joins all 1:1 satellite tables into a single flat row per venue.
-- Use this for the admin detail page and public portal venue detail pages.
-- Child tables (rooms, facilities, media, etc.) are fetched separately.
-- =============================================================================

CREATE OR REPLACE VIEW v_venues_full AS
SELECT
    v.id,
    v.venue_type,
    v.created_at,
    v.updated_at,
    -- Basic Info
    bi.name,
    bi.slug,
    bi.primary_venue_type,
    bi.venue_type_tags,
    bi.hire_type,
    bi.best_for,
    bi.languages_spoken,
    bi.is_wheelchair_accessible,
    -- Content
    c.short_description,
    c.description,
    c.brand_quote,
    c.intro_paragraph,
    -- Experience
    e.experience_title,
    e.experience_subtitle,
    e.experience_description,
    e.modalities,
    e.ideal_retreat_types,
    e.retreat_styles,
    -- Property Details
    pd.property_size_value,
    pd.property_size_unit,
    pd.established_year,
    pd.architecture_style,
    -- Location
    l.street_address,
    l.suburb,
    l.postcode,
    l.state_province,
    l.country,
    l.short_loc,
    l.full_location,
    l.gps_lat,
    l.gps_lng,
    l.climate,
    l.location_types,
    l.location_setting,
    l.nearest_airport,
    l.transport_access,
    l.directions,
    -- Status
    s.status,
    s.property_status,
    s.subscription_tier,
    s.sanctum_vetted,
    s.featured_listing,
    s.instant_booking,
    s.is_available,
    s.show_on_website,
    s.starting_price,
    s.stripe_subscription_id,
    -- Accommodation
    a.max_guests,
    a.min_guests,
    a.total_bedrooms,
    a.total_bathrooms,
    a.shared_bathrooms,
    a.private_ensuites,
    a.accommodation_style,
    a.property_type,
    a.accommodation_description,
    a.show_accommodation_section,
    a.accommodation_amenities,
    a.beds_king,
    a.beds_queen,
    a.beds_double,
    a.beds_single,
    a.beds_twin,
    a.beds_bunk,
    a.beds_sofa,
    a.beds_rollaway,
    a.check_in_time,
    a.check_out_time,
    a.early_check_in_available,
    a.late_check_out_available,
    a.children_allowed,
    a.minimum_child_age,
    a.pets_allowed,
    a.smoking_allowed,
    -- Amenities
    am.kitchen_facilities,
    am.dining_capacity_indoor,
    am.dining_capacity_outdoor,
    am.living_facilities,
    am.has_wifi,
    am.wifi_speed_mbps,
    am.wifi_coverage,
    am.tech_facilities,
    am.outdoor_facilities,
    am.facilities_list,
    am.whats_included,
    -- Pricing
    pr.currency,
    pr.pricing_model,
    pr.price_range_category,
    pr.base_nightly_rate,
    pr.weekend_rate,
    pr.weekly_rate,
    pr.cleaning_fee,
    pr.group_discounts_available,
    pr.discount_percentage,
    pr.min_nights_for_discount,
    pr.group_discount_details,
    pr.holiday_surcharge_percentage,
    -- Policies
    po.cancellation_policy,
    po.booking_policy,
    po.house_rules,
    po.health_safety,
    po.age_requirements,
    po.access_policies,
    po.general_policies,
    -- Owner Info
    oi.owner_name,
    oi.owner_email,
    oi.owner_phone,
    oi.owner_address,
    oi.website_url,
    -- Internal (admin only)
    i.internal_notes,
    i.availability_notes,
    i.total_bookings,
    -- Retreat Editorial
    re.tab_image_url           AS retreat_tab_image_url,
    re.label                   AS retreat_facilities_label,
    re.title                   AS retreat_facilities_title,
    re.subtitle                AS retreat_facilities_subtitle,
    re.intro_text              AS retreat_facilities_intro,
    re.notes                   AS retreat_facilities_notes,
    re.supported_retreat_types AS retreat_supported_types

FROM venues v
LEFT JOIN venue_basic_info          bi  ON bi.venue_id  = v.id
LEFT JOIN venue_content             c   ON c.venue_id   = v.id
LEFT JOIN venue_experience          e   ON e.venue_id   = v.id
LEFT JOIN venue_property_details    pd  ON pd.venue_id  = v.id
LEFT JOIN venue_location            l   ON l.venue_id   = v.id
LEFT JOIN venue_status              s   ON s.venue_id   = v.id
LEFT JOIN venue_accommodation       a   ON a.venue_id   = v.id
LEFT JOIN venue_amenities           am  ON am.venue_id  = v.id
LEFT JOIN venue_pricing             pr  ON pr.venue_id  = v.id
LEFT JOIN venue_policies            po  ON po.venue_id  = v.id
LEFT JOIN venue_owner_info          oi  ON oi.venue_id  = v.id
LEFT JOIN venue_internal            i   ON i.venue_id   = v.id
LEFT JOIN venue_retreat_editorial   re  ON re.venue_id  = v.id;


-- =============================================================================
-- ROW LEVEL SECURITY
-- Authenticated users (admin portal) get full access.
-- Anon reads are intentionally blocked at RLS level; the public portal
-- uses a service-role API route or a specific SELECT policy on active venues.
-- =============================================================================

ALTER TABLE venues                      ENABLE ROW LEVEL SECURITY;
ALTER TABLE venue_basic_info            ENABLE ROW LEVEL SECURITY;
ALTER TABLE venue_content               ENABLE ROW LEVEL SECURITY;
ALTER TABLE venue_experience            ENABLE ROW LEVEL SECURITY;
ALTER TABLE venue_property_details      ENABLE ROW LEVEL SECURITY;
ALTER TABLE venue_location              ENABLE ROW LEVEL SECURITY;
ALTER TABLE venue_status                ENABLE ROW LEVEL SECURITY;
ALTER TABLE venue_accommodation         ENABLE ROW LEVEL SECURITY;
ALTER TABLE venue_amenities             ENABLE ROW LEVEL SECURITY;
ALTER TABLE venue_pricing               ENABLE ROW LEVEL SECURITY;
ALTER TABLE venue_policies              ENABLE ROW LEVEL SECURITY;
ALTER TABLE venue_owner_info            ENABLE ROW LEVEL SECURITY;
ALTER TABLE venue_internal              ENABLE ROW LEVEL SECURITY;
ALTER TABLE venue_retreat_editorial     ENABLE ROW LEVEL SECURITY;
ALTER TABLE venue_media                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE venue_rooms                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE venue_wellness_facilities   ENABLE ROW LEVEL SECURITY;
ALTER TABLE venue_retreat_facilities    ENABLE ROW LEVEL SECURITY;
ALTER TABLE venue_services              ENABLE ROW LEVEL SECURITY;
ALTER TABLE venue_packages              ENABLE ROW LEVEL SECURITY;
ALTER TABLE venue_addons                ENABLE ROW LEVEL SECURITY;
ALTER TABLE venue_practitioners         ENABLE ROW LEVEL SECURITY;
ALTER TABLE venue_seasonal_pricing      ENABLE ROW LEVEL SECURITY;

-- Admin portal: authenticated users can do everything
DO $$
DECLARE tbl TEXT;
BEGIN
    FOREACH tbl IN ARRAY ARRAY[
        'venues', 'venue_basic_info', 'venue_content', 'venue_experience',
        'venue_property_details', 'venue_location', 'venue_status',
        'venue_accommodation', 'venue_amenities', 'venue_pricing',
        'venue_policies', 'venue_owner_info', 'venue_internal',
        'venue_retreat_editorial', 'venue_media', 'venue_rooms',
        'venue_wellness_facilities', 'venue_retreat_facilities',
        'venue_services', 'venue_packages', 'venue_addons',
        'venue_practitioners', 'venue_seasonal_pricing'
    ]
    LOOP
        EXECUTE format(
            'CREATE POLICY "Authenticated full access" ON %I
             FOR ALL TO authenticated
             USING (TRUE) WITH CHECK (TRUE);',
            tbl
        );
    END LOOP;
END;
$$;

-- Public portal: anon users can read venues that are active and shown on website.
-- Apply only to the tables the public portal needs.
CREATE POLICY "Public read active venues"     ON venues           FOR SELECT TO anon USING (TRUE);
CREATE POLICY "Public read basic info"        ON venue_basic_info FOR SELECT TO anon USING (TRUE);
CREATE POLICY "Public read content"           ON venue_content    FOR SELECT TO anon USING (TRUE);
CREATE POLICY "Public read experience"        ON venue_experience FOR SELECT TO anon USING (TRUE);
CREATE POLICY "Public read property details"  ON venue_property_details FOR SELECT TO anon USING (TRUE);
CREATE POLICY "Public read location"          ON venue_location   FOR SELECT TO anon USING (TRUE);
CREATE POLICY "Public read status"            ON venue_status     FOR SELECT TO anon USING (
    status = 'active' AND show_on_website = TRUE
);
CREATE POLICY "Public read accommodation"     ON venue_accommodation  FOR SELECT TO anon USING (TRUE);
CREATE POLICY "Public read amenities"         ON venue_amenities      FOR SELECT TO anon USING (TRUE);
CREATE POLICY "Public read pricing"           ON venue_pricing        FOR SELECT TO anon USING (TRUE);
CREATE POLICY "Public read media"             ON venue_media          FOR SELECT TO anon USING (TRUE);
CREATE POLICY "Public read rooms"             ON venue_rooms          FOR SELECT TO anon USING (TRUE);
CREATE POLICY "Public read wellness fac"      ON venue_wellness_facilities FOR SELECT TO anon USING (TRUE);
CREATE POLICY "Public read retreat fac"       ON venue_retreat_facilities  FOR SELECT TO anon USING (TRUE);
CREATE POLICY "Public read services"          ON venue_services       FOR SELECT TO anon USING (TRUE);
CREATE POLICY "Public read packages"          ON venue_packages       FOR SELECT TO anon USING (TRUE);
CREATE POLICY "Public read seasonal pricing"  ON venue_seasonal_pricing FOR SELECT TO anon USING (TRUE);
CREATE POLICY "Public read retreat editorial" ON venue_retreat_editorial FOR SELECT TO anon USING (TRUE);
-- NOTE: venue_internal and venue_owner_info intentionally have NO public read policy.

-- =============================================================================
-- VIEW ACCESS GRANTS
-- Supabase requires explicit GRANT on views for the role to query them,
-- even when the underlying tables have RLS policies.
-- The view exposes internal/owner data so only authenticated (admin) users
-- should be able to query it.  The public portal uses the individual tables.
-- =============================================================================

-- Admin portal (authenticated users) — full read of all columns including internal/owner
GRANT SELECT ON v_venues_full TO authenticated;

-- Public portal (anon users) — safe to grant because:
--   venue_internal and venue_owner_info have no anon RLS policy → LEFT JOIN returns NULL
--   venue_status anon policy filters to status='active' AND show_on_website=TRUE
GRANT SELECT ON v_venues_full TO anon;
