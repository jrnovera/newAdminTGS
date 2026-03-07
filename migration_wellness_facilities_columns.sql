-- ============================================================
-- SQL MIGRATION: WELLNESS FACILITIES TAB — ADD MISSING COLUMNS
-- ============================================================
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor).
-- Adds all new config columns to venue_wellness_facilities.
-- Also deduplicates retreat_facilities rows if upsert created duplicates.

-- ────────────────────────────────────────────────────────────
-- 1. Add new config columns to venue_wellness_facilities
-- ────────────────────────────────────────────────────────────
ALTER TABLE venue_wellness_facilities
  -- Facility Summary
  ADD COLUMN IF NOT EXISTS facility_space_sqm      INTEGER   DEFAULT 0,
  ADD COLUMN IF NOT EXISTS facility_philosophy     TEXT,
  ADD COLUMN IF NOT EXISTS facility_highlights     TEXT,
  -- Treatment Rooms
  ADD COLUMN IF NOT EXISTS total_treatment_rooms   INTEGER   DEFAULT 0,
  ADD COLUMN IF NOT EXISTS private_suites          INTEGER   DEFAULT 0,
  ADD COLUMN IF NOT EXISTS couples_rooms           INTEGER   DEFAULT 0,
  ADD COLUMN IF NOT EXISTS group_spaces            INTEGER   DEFAULT 0,
  ADD COLUMN IF NOT EXISTS room_sizes              TEXT,
  ADD COLUMN IF NOT EXISTS tables_available        BOOLEAN   DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS specialized_equipment   TEXT,
  ADD COLUMN IF NOT EXISTS room_features           TEXT,
  -- Supporting Facilities
  ADD COLUMN IF NOT EXISTS supporting_facilities   TEXT[]    DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS steam_room_count        INTEGER   DEFAULT 0,
  ADD COLUMN IF NOT EXISTS support_details         TEXT,
  -- Thermal & Sauna
  ADD COLUMN IF NOT EXISTS thermal_types           TEXT[]    DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS indoor_pool_count       INTEGER   DEFAULT 0,
  ADD COLUMN IF NOT EXISTS outdoor_pool_count      INTEGER   DEFAULT 0,
  ADD COLUMN IF NOT EXISTS thermal_features        TEXT,
  -- Traditional Bathing
  ADD COLUMN IF NOT EXISTS bathing_sections        JSONB     DEFAULT '{}',
  -- Medical Spa
  ADD COLUMN IF NOT EXISTS med_spa_suites          BOOLEAN   DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS med_suite_count         INTEGER   DEFAULT 0,
  -- Changing & Locker
  ADD COLUMN IF NOT EXISTS changing_details        TEXT,
  ADD COLUMN IF NOT EXISTS shower_details          TEXT,
  ADD COLUMN IF NOT EXISTS towels_provided         BOOLEAN   DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS slippers_provided       BOOLEAN   DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS changing_amenities      TEXT,
  -- Certifications
  ADD COLUMN IF NOT EXISTS med_certs               TEXT,
  ADD COLUMN IF NOT EXISTS trad_certs              TEXT,
  ADD COLUMN IF NOT EXISTS water_testing           TEXT,
  ADD COLUMN IF NOT EXISTS safety_standards        TEXT,
  ADD COLUMN IF NOT EXISTS sustainability          TEXT,
  -- Accessibility
  ADD COLUMN IF NOT EXISTS accessibility_features  TEXT[]    DEFAULT '{}',
  -- Other
  ADD COLUMN IF NOT EXISTS other_facilities_available BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS other_facility_types    TEXT;

-- ────────────────────────────────────────────────────────────
-- 2. Fix retreat_facilities duplicate rows (if any)
--    Keeps the most recently created row per venue_id
-- ────────────────────────────────────────────────────────────
DELETE FROM retreat_facilities
WHERE id NOT IN (
  SELECT DISTINCT ON (venue_id) id
  FROM retreat_facilities
  ORDER BY venue_id, created_at DESC
);

-- ────────────────────────────────────────────────────────────
-- 3. Add explicit UNIQUE CONSTRAINT to retreat_facilities
--    (prevents future duplicates; unique index already exists
--     but an explicit constraint guarantees upsert resolution)
-- ────────────────────────────────────────────────────────────
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conrelid = 'retreat_facilities'::regclass
      AND conname = 'retreat_facilities_venue_id_key'
      AND contype = 'u'
  ) THEN
    ALTER TABLE retreat_facilities
      ADD CONSTRAINT retreat_facilities_venue_id_key UNIQUE (venue_id);
  END IF;
END $$;
