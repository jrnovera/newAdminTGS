-- =============================================================================
-- THE GLOBAL SANCTUM — WELLNESS COMPLETE MIGRATION
-- Run this in the Supabase SQL Editor to fix wellness venue data persistence.
--
-- PROBLEM: The base schema (schema_v2.sql) was designed for Retreat venues.
-- Wellness-specific fields were missing from the DB tables and the convenience
-- view (v_venues_full), so any Wellness venue data saved from the admin portal
-- was silently lost (upsert errors caught by Promise.allSettled).
--
-- THIS FILE:
--   1. Adds all missing wellness columns to existing satellite tables
--   2. Creates venue_operating_hours and venue_wellness_config tables
--   3. Recreates v_venues_full view with ALL columns needed by VenueContext
--
-- SAFE TO RE-RUN: Uses ADD COLUMN IF NOT EXISTS and CREATE TABLE IF NOT EXISTS.
-- =============================================================================


-- =============================================================================
-- STEP 1 — Extend venue_basic_info with wellness venue type tags
-- =============================================================================

ALTER TABLE venue_basic_info
    ADD COLUMN IF NOT EXISTS wellness_venue_types   TEXT[]   DEFAULT '{}',
    ADD COLUMN IF NOT EXISTS wellness_categories    TEXT[]   DEFAULT '{}',
    ADD COLUMN IF NOT EXISTS treatment_rooms        INTEGER  DEFAULT 0,
    ADD COLUMN IF NOT EXISTS couples_suites         INTEGER  DEFAULT 0,
    ADD COLUMN IF NOT EXISTS total_practitioners    INTEGER  DEFAULT 0;


-- =============================================================================
-- STEP 2 — Extend venue_content with wellness intro text
-- =============================================================================

ALTER TABLE venue_content
    ADD COLUMN IF NOT EXISTS intro_text TEXT;


-- =============================================================================
-- STEP 3 — Extend venue_amenities with wellness-specific amenity fields
-- (kitchen_facilities, living_facilities, tech_facilities, outdoor_facilities
--  already exist in the base schema — only the wellness-exclusive ones below
--  are added here)
-- =============================================================================

ALTER TABLE venue_amenities
    ADD COLUMN IF NOT EXISTS web_amenities      TEXT[]   DEFAULT '{}',
    ADD COLUMN IF NOT EXISTS parking_amenities  TEXT[]   DEFAULT '{}',
    ADD COLUMN IF NOT EXISTS pool_type          TEXT,
    ADD COLUMN IF NOT EXISTS parking_spaces     INTEGER  DEFAULT 0;


-- =============================================================================
-- STEP 4 — Extend venue_owner_info with full business / host contact details
-- =============================================================================

ALTER TABLE venue_owner_info
    ADD COLUMN IF NOT EXISTS first_name             TEXT,
    ADD COLUMN IF NOT EXISTS last_name              TEXT,
    ADD COLUMN IF NOT EXISTS owner_role             TEXT,
    ADD COLUMN IF NOT EXISTS phone_secondary        TEXT,
    ADD COLUMN IF NOT EXISTS business_name          TEXT,
    ADD COLUMN IF NOT EXISTS tax_id                 TEXT,
    ADD COLUMN IF NOT EXISTS business_type          TEXT,
    ADD COLUMN IF NOT EXISTS gst_registered         BOOLEAN  DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS host_bio               TEXT,
    ADD COLUMN IF NOT EXISTS show_host_profile      BOOLEAN  DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS relationship_notes     TEXT;


-- =============================================================================
-- STEP 5 — Extend venue_internal with CRM / pipeline tracking fields
-- =============================================================================

ALTER TABLE venue_internal
    ADD COLUMN IF NOT EXISTS pipeline_stage         TEXT,
    ADD COLUMN IF NOT EXISTS lead_source            TEXT,
    ADD COLUMN IF NOT EXISTS lead_owner             TEXT,
    ADD COLUMN IF NOT EXISTS founder_discount       TEXT,
    ADD COLUMN IF NOT EXISTS billing_cycle          TEXT,
    ADD COLUMN IF NOT EXISTS booking_commission     TEXT,
    ADD COLUMN IF NOT EXISTS experience_commission  TEXT,
    ADD COLUMN IF NOT EXISTS stripe_connected       BOOLEAN  DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS market_segment         TEXT,
    ADD COLUMN IF NOT EXISTS venue_tier             TEXT;


-- =============================================================================
-- STEP 6 — Create venue_operating_hours (wellness hours per day of week)
-- =============================================================================

CREATE TABLE IF NOT EXISTS venue_operating_hours (
    venue_id                UUID        PRIMARY KEY REFERENCES venues(id) ON DELETE CASCADE,
    monday_open             TEXT        DEFAULT '9:00 AM',
    monday_close            TEXT        DEFAULT '8:00 PM',
    monday_is_open          BOOLEAN     DEFAULT TRUE,
    tuesday_open            TEXT        DEFAULT '9:00 AM',
    tuesday_close           TEXT        DEFAULT '8:00 PM',
    tuesday_is_open         BOOLEAN     DEFAULT TRUE,
    wednesday_open          TEXT        DEFAULT '9:00 AM',
    wednesday_close         TEXT        DEFAULT '8:00 PM',
    wednesday_is_open       BOOLEAN     DEFAULT TRUE,
    thursday_open           TEXT        DEFAULT '9:00 AM',
    thursday_close          TEXT        DEFAULT '9:00 PM',
    thursday_is_open        BOOLEAN     DEFAULT TRUE,
    friday_open             TEXT        DEFAULT '9:00 AM',
    friday_close            TEXT        DEFAULT '9:00 PM',
    friday_is_open          BOOLEAN     DEFAULT TRUE,
    saturday_open           TEXT        DEFAULT '9:00 AM',
    saturday_close          TEXT        DEFAULT '6:00 PM',
    saturday_is_open        BOOLEAN     DEFAULT TRUE,
    sunday_open             TEXT        DEFAULT '10:00 AM',
    sunday_close            TEXT        DEFAULT '5:00 PM',
    sunday_is_open          BOOLEAN     DEFAULT TRUE,
    holiday_note            TEXT,
    after_hours_available   BOOLEAN     DEFAULT FALSE
);

ALTER TABLE venue_operating_hours ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE tablename = 'venue_operating_hours'
          AND policyname = 'Authenticated full access'
    ) THEN
        CREATE POLICY "Authenticated full access" ON venue_operating_hours
            FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE tablename = 'venue_operating_hours'
          AND policyname = 'Public read operating hours'
    ) THEN
        CREATE POLICY "Public read operating hours" ON venue_operating_hours
            FOR SELECT TO anon USING (TRUE);
    END IF;
END;
$$;


-- =============================================================================
-- STEP 7 — Create venue_wellness_config
-- Pricing, booking, services, facilities, and amenity editorial config
-- =============================================================================

CREATE TABLE IF NOT EXISTS venue_wellness_config (
    venue_id                    UUID        PRIMARY KEY REFERENCES venues(id) ON DELETE CASCADE,

    -- Pricing & Booking
    day_pass_available          BOOLEAN     DEFAULT FALSE,
    day_pass_price              TEXT,
    day_pass_duration           TEXT,
    day_pass_includes           TEXT,
    memberships_available       BOOLEAN     DEFAULT FALSE,
    membership_details          TEXT,
    vouchers_available          BOOLEAN     DEFAULT FALSE,
    voucher_validity            TEXT,
    deposit_required            BOOLEAN     DEFAULT FALSE,
    deposit_amount              TEXT,
    payment_due                 TEXT,
    free_cancellation_period    TEXT,
    late_fee                    TEXT,
    no_show_fee                 TEXT,
    cancellation_text           TEXT,
    booking_platform            TEXT,
    booking_url                 TEXT,
    calendar_sync               BOOLEAN     DEFAULT FALSE,
    auto_confirm                BOOLEAN     DEFAULT FALSE,
    reminders                   TEXT,
    pricing_notes               TEXT,
    advance_booking             TEXT,
    min_notice                  TEXT,
    max_advance                 TEXT,
    group_bookings              BOOLEAN     DEFAULT FALSE,
    max_group_size              TEXT,
    couples_bookings            BOOLEAN     DEFAULT TRUE,
    package_pricing             BOOLEAN     DEFAULT FALSE,
    membership_options          BOOLEAN     DEFAULT FALSE,
    drop_in_welcome             BOOLEAN     DEFAULT TRUE,
    appointment_required        BOOLEAN     DEFAULT FALSE,

    -- Services
    service_description         TEXT,
    practitioner_specialties    TEXT,
    onsite_nutritionist         BOOLEAN     DEFAULT FALSE,
    offering_tags               TEXT[]      DEFAULT '{}',
    dietary_tags                TEXT[]      DEFAULT '{}',

    -- Facilities
    facility_philosophy         TEXT,
    facility_highlights         TEXT,
    total_treatment_rooms       INTEGER     DEFAULT 0,
    private_suites              INTEGER     DEFAULT 0,
    couples_rooms               INTEGER     DEFAULT 0,
    group_spaces                INTEGER     DEFAULT 0,
    indoor_pool_count           INTEGER     DEFAULT 0,
    outdoor_pool_count          INTEGER     DEFAULT 0,
    thermal_features            TEXT,
    towels_provided             BOOLEAN     DEFAULT TRUE,
    slippers_provided           BOOLEAN     DEFAULT FALSE,
    facility_certifications     JSONB       DEFAULT '{}',
    bathing_sections            JSONB       DEFAULT '{}',

    -- Amenities editorial (shown in the "What to Bring" / "About" sections)
    about_p1                    TEXT,
    about_p2                    TEXT,
    show_about                  BOOLEAN     DEFAULT TRUE,
    we_provide                  TEXT,
    please_bring                TEXT,
    optional_items              TEXT,
    show_bring                  BOOLEAN     DEFAULT TRUE
);

ALTER TABLE venue_wellness_config ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE tablename = 'venue_wellness_config'
          AND policyname = 'Authenticated full access'
    ) THEN
        CREATE POLICY "Authenticated full access" ON venue_wellness_config
            FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE tablename = 'venue_wellness_config'
          AND policyname = 'Public read wellness config'
    ) THEN
        CREATE POLICY "Public read wellness config" ON venue_wellness_config
            FOR SELECT TO anon USING (TRUE);
    END IF;
END;
$$;


-- =============================================================================
-- STEP 8 — Recreate v_venues_full to expose ALL columns
--
-- Must DROP first because CREATE OR REPLACE cannot change column order/add
-- columns when existing dependents exist.  The CASCADE drops any views or
-- functions that depend on this view; re-grant after.
-- =============================================================================

DROP VIEW IF EXISTS v_venues_full CASCADE;

CREATE VIEW v_venues_full AS
SELECT
    -- ── Core identity ──────────────────────────────────────────────────────────
    v.id,
    v.venue_type,
    v.created_at,
    v.updated_at,

    -- ── Basic Info ─────────────────────────────────────────────────────────────
    bi.name,
    bi.slug,
    bi.primary_venue_type,
    bi.venue_type_tags,
    bi.hire_type,
    bi.best_for,
    bi.languages_spoken,
    bi.is_wheelchair_accessible,
    -- Wellness-specific basic info
    bi.wellness_venue_types,
    bi.wellness_categories,
    bi.treatment_rooms        AS bi_treatment_rooms,
    bi.couples_suites         AS bi_couples_suites,
    bi.total_practitioners    AS bi_total_practitioners,

    -- ── Content ────────────────────────────────────────────────────────────────
    c.short_description,
    c.description,
    c.brand_quote,
    c.intro_paragraph,
    c.intro_text,             -- Wellness additional intro block

    -- ── Experience ─────────────────────────────────────────────────────────────
    e.experience_title,
    e.experience_subtitle,
    e.experience_description,
    e.modalities,
    e.ideal_retreat_types,
    e.retreat_styles,

    -- ── Property Details ───────────────────────────────────────────────────────
    pd.property_size_value,
    pd.property_size_unit,
    pd.established_year,
    pd.architecture_style,

    -- ── Location ───────────────────────────────────────────────────────────────
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

    -- ── Status & Listing ───────────────────────────────────────────────────────
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

    -- ── Accommodation ──────────────────────────────────────────────────────────
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

    -- ── Amenities ──────────────────────────────────────────────────────────────
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
    -- Wellness-specific amenity fields
    am.web_amenities,
    am.parking_amenities,
    am.pool_type,
    am.parking_spaces,

    -- ── Pricing (retreat) ──────────────────────────────────────────────────────
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

    -- ── Policies ───────────────────────────────────────────────────────────────
    po.cancellation_policy,
    po.booking_policy,
    po.house_rules,
    po.health_safety,
    po.age_requirements,
    po.access_policies,
    po.general_policies,

    -- ── Owner / Manager Info ───────────────────────────────────────────────────
    oi.owner_name,
    oi.owner_email,
    oi.owner_phone,
    oi.owner_address,
    oi.website_url,
    -- Wellness extended owner/business fields
    oi.first_name,
    oi.last_name,
    oi.owner_role,
    oi.phone_secondary,
    oi.business_name,
    oi.tax_id,
    oi.business_type,
    oi.gst_registered,
    oi.host_bio,
    oi.show_host_profile,
    oi.relationship_notes,

    -- ── Internal / CRM (admin-only) ────────────────────────────────────────────
    i.internal_notes,
    i.availability_notes,
    i.total_bookings,
    -- Wellness CRM fields
    i.pipeline_stage,
    i.lead_source,
    i.lead_owner,
    i.founder_discount,
    i.billing_cycle,
    i.booking_commission,
    i.experience_commission,
    i.stripe_connected,
    i.market_segment,
    i.venue_tier,

    -- ── Retreat Facilities Editorial ───────────────────────────────────────────
    re.tab_image_url           AS retreat_tab_image_url,
    re.label                   AS retreat_facilities_label,
    re.title                   AS retreat_facilities_title,
    re.subtitle                AS retreat_facilities_subtitle,
    re.intro_text              AS retreat_facilities_intro,
    re.notes                   AS retreat_facilities_notes,
    re.supported_retreat_types AS retreat_supported_types,

    -- ── Operating Hours (wellness) ─────────────────────────────────────────────
    oh.monday_open,     oh.monday_close,     oh.monday_is_open,
    oh.tuesday_open,    oh.tuesday_close,    oh.tuesday_is_open,
    oh.wednesday_open,  oh.wednesday_close,  oh.wednesday_is_open,
    oh.thursday_open,   oh.thursday_close,   oh.thursday_is_open,
    oh.friday_open,     oh.friday_close,     oh.friday_is_open,
    oh.saturday_open,   oh.saturday_close,   oh.saturday_is_open,
    oh.sunday_open,     oh.sunday_close,     oh.sunday_is_open,
    oh.holiday_note,
    oh.after_hours_available,

    -- ── Wellness Config ────────────────────────────────────────────────────────
    -- Pricing & Booking
    wc.day_pass_available,
    wc.day_pass_price,
    wc.day_pass_duration,
    wc.day_pass_includes,
    wc.memberships_available,
    wc.membership_details,
    wc.vouchers_available,
    wc.voucher_validity,
    wc.deposit_required,
    wc.deposit_amount,
    wc.payment_due,
    wc.free_cancellation_period,
    wc.late_fee,
    wc.no_show_fee,
    wc.cancellation_text,
    wc.booking_platform,
    wc.booking_url,
    wc.calendar_sync,
    wc.auto_confirm,
    wc.reminders,
    wc.pricing_notes,
    wc.advance_booking,
    wc.min_notice,
    wc.max_advance,
    wc.group_bookings,
    wc.max_group_size,
    wc.couples_bookings,
    wc.package_pricing,
    wc.membership_options,
    wc.drop_in_welcome,
    wc.appointment_required,
    -- Services
    wc.service_description,
    wc.practitioner_specialties,
    wc.onsite_nutritionist,
    wc.offering_tags,
    wc.dietary_tags,
    -- Facilities
    wc.facility_philosophy,
    wc.facility_highlights,
    wc.total_treatment_rooms    AS wc_total_treatment_rooms,
    wc.private_suites,
    wc.couples_rooms,
    wc.group_spaces,
    wc.indoor_pool_count,
    wc.outdoor_pool_count,
    wc.thermal_features,
    wc.towels_provided,
    wc.slippers_provided,
    wc.facility_certifications,
    wc.bathing_sections,
    -- Amenities editorial
    wc.about_p1,
    wc.about_p2,
    wc.show_about,
    wc.we_provide,
    wc.please_bring,
    wc.optional_items,
    wc.show_bring

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
LEFT JOIN venue_retreat_editorial   re  ON re.venue_id  = v.id
LEFT JOIN venue_operating_hours     oh  ON oh.venue_id  = v.id
LEFT JOIN venue_wellness_config     wc  ON wc.venue_id  = v.id;


-- =============================================================================
-- STEP 9 — Grants
-- Supabase requires explicit GRANT on views for roles to query them.
-- =============================================================================

GRANT SELECT ON venue_operating_hours  TO authenticated;
GRANT SELECT ON venue_operating_hours  TO anon;
GRANT SELECT ON venue_wellness_config  TO authenticated;
GRANT SELECT ON venue_wellness_config  TO anon;
GRANT SELECT ON v_venues_full          TO authenticated;
GRANT SELECT ON v_venues_full          TO anon;
