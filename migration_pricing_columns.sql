-- =============================================================================
-- TGS — Pricing Columns Migration
-- Run in: Supabase Dashboard → SQL Editor → paste → Run
--
-- This migration:
--   1. Allows NULL on venue_pricing.pricing_model (previously NOT NULL)
--   2. Adds shared column: pricing_notes TEXT
--   3. Adds all wellness-specific columns to venue_pricing
--   4. Ensures RLS policies exist for venue_pricing and venue_seasonal_pricing
-- =============================================================================


-- -----------------------------------------------------------------------------
-- 1. Allow NULL on pricing_model (it was created NOT NULL in schema_v2.sql
--    but the admin form does not require it on first save)
-- -----------------------------------------------------------------------------

ALTER TABLE venue_pricing
    ALTER COLUMN pricing_model DROP NOT NULL;


-- -----------------------------------------------------------------------------
-- 2. Shared column
-- -----------------------------------------------------------------------------

ALTER TABLE venue_pricing
    ADD COLUMN IF NOT EXISTS pricing_notes TEXT;


-- -----------------------------------------------------------------------------
-- 3. Wellness-specific columns
-- -----------------------------------------------------------------------------

-- Packages tab toggle & content
ALTER TABLE venue_pricing ADD COLUMN IF NOT EXISTS show_packages_tab        BOOLEAN DEFAULT FALSE;
ALTER TABLE venue_pricing ADD COLUMN IF NOT EXISTS package_section_label    TEXT;
ALTER TABLE venue_pricing ADD COLUMN IF NOT EXISTS package_section_subtitle TEXT;
ALTER TABLE venue_pricing ADD COLUMN IF NOT EXISTS package_intro            TEXT;
ALTER TABLE venue_pricing ADD COLUMN IF NOT EXISTS packages                 JSONB   DEFAULT '[]'::jsonb;

-- Day pass
ALTER TABLE venue_pricing ADD COLUMN IF NOT EXISTS day_pass_available       BOOLEAN DEFAULT FALSE;
ALTER TABLE venue_pricing ADD COLUMN IF NOT EXISTS day_pass_price           TEXT;
ALTER TABLE venue_pricing ADD COLUMN IF NOT EXISTS day_pass_duration        TEXT;
ALTER TABLE venue_pricing ADD COLUMN IF NOT EXISTS day_pass_includes        TEXT;

-- Memberships
ALTER TABLE venue_pricing ADD COLUMN IF NOT EXISTS memberships_available    BOOLEAN DEFAULT FALSE;
ALTER TABLE venue_pricing ADD COLUMN IF NOT EXISTS membership_details       TEXT;

-- Vouchers
ALTER TABLE venue_pricing ADD COLUMN IF NOT EXISTS vouchers_available       BOOLEAN DEFAULT FALSE;
ALTER TABLE venue_pricing ADD COLUMN IF NOT EXISTS voucher_validity         TEXT;

-- Booking rules (wellness)
ALTER TABLE venue_pricing ADD COLUMN IF NOT EXISTS advance_booking          TEXT;
ALTER TABLE venue_pricing ADD COLUMN IF NOT EXISTS min_notice               TEXT;
ALTER TABLE venue_pricing ADD COLUMN IF NOT EXISTS max_advance              TEXT;
ALTER TABLE venue_pricing ADD COLUMN IF NOT EXISTS group_bookings           BOOLEAN DEFAULT FALSE;
ALTER TABLE venue_pricing ADD COLUMN IF NOT EXISTS max_group_size           TEXT;
ALTER TABLE venue_pricing ADD COLUMN IF NOT EXISTS couples_bookings         BOOLEAN DEFAULT FALSE;

-- Deposit & payment (wellness)
ALTER TABLE venue_pricing ADD COLUMN IF NOT EXISTS deposit_required         BOOLEAN DEFAULT FALSE;
ALTER TABLE venue_pricing ADD COLUMN IF NOT EXISTS deposit_amount           TEXT;
ALTER TABLE venue_pricing ADD COLUMN IF NOT EXISTS payment_due              TEXT;

-- Cancellation (wellness)
ALTER TABLE venue_pricing ADD COLUMN IF NOT EXISTS free_cancellation_period TEXT;
ALTER TABLE venue_pricing ADD COLUMN IF NOT EXISTS late_fee                 TEXT;
ALTER TABLE venue_pricing ADD COLUMN IF NOT EXISTS no_show_fee              TEXT;
ALTER TABLE venue_pricing ADD COLUMN IF NOT EXISTS cancellation_text        TEXT;

-- Online booking / settings (wellness)
ALTER TABLE venue_pricing ADD COLUMN IF NOT EXISTS online_booking           BOOLEAN DEFAULT FALSE;
ALTER TABLE venue_pricing ADD COLUMN IF NOT EXISTS booking_platform         TEXT;
ALTER TABLE venue_pricing ADD COLUMN IF NOT EXISTS booking_url              TEXT;
ALTER TABLE venue_pricing ADD COLUMN IF NOT EXISTS calendar_sync            BOOLEAN DEFAULT FALSE;
ALTER TABLE venue_pricing ADD COLUMN IF NOT EXISTS auto_confirm             BOOLEAN DEFAULT FALSE;
ALTER TABLE venue_pricing ADD COLUMN IF NOT EXISTS reminders                TEXT;


-- -----------------------------------------------------------------------------
-- 4. RLS policies
--    Uses the safe DO $$ … END $$ guard so repeated runs are idempotent.
-- -----------------------------------------------------------------------------

ALTER TABLE venue_pricing          ENABLE ROW LEVEL SECURITY;
ALTER TABLE venue_seasonal_pricing ENABLE ROW LEVEL SECURITY;

-- venue_pricing — authenticated users can read/write
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE tablename = 'venue_pricing'
          AND policyname = 'Authenticated users can select venue_pricing'
    ) THEN
        CREATE POLICY "Authenticated users can select venue_pricing"
            ON venue_pricing FOR SELECT
            TO authenticated
            USING (true);
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE tablename = 'venue_pricing'
          AND policyname = 'Authenticated users can insert venue_pricing'
    ) THEN
        CREATE POLICY "Authenticated users can insert venue_pricing"
            ON venue_pricing FOR INSERT
            TO authenticated
            WITH CHECK (true);
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE tablename = 'venue_pricing'
          AND policyname = 'Authenticated users can update venue_pricing'
    ) THEN
        CREATE POLICY "Authenticated users can update venue_pricing"
            ON venue_pricing FOR UPDATE
            TO authenticated
            USING (true)
            WITH CHECK (true);
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE tablename = 'venue_pricing'
          AND policyname = 'Authenticated users can delete venue_pricing'
    ) THEN
        CREATE POLICY "Authenticated users can delete venue_pricing"
            ON venue_pricing FOR DELETE
            TO authenticated
            USING (true);
    END IF;
END $$;

-- venue_seasonal_pricing — authenticated users can read/write
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE tablename = 'venue_seasonal_pricing'
          AND policyname = 'Authenticated users can select venue_seasonal_pricing'
    ) THEN
        CREATE POLICY "Authenticated users can select venue_seasonal_pricing"
            ON venue_seasonal_pricing FOR SELECT
            TO authenticated
            USING (true);
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE tablename = 'venue_seasonal_pricing'
          AND policyname = 'Authenticated users can insert venue_seasonal_pricing'
    ) THEN
        CREATE POLICY "Authenticated users can insert venue_seasonal_pricing"
            ON venue_seasonal_pricing FOR INSERT
            TO authenticated
            WITH CHECK (true);
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE tablename = 'venue_seasonal_pricing'
          AND policyname = 'Authenticated users can update venue_seasonal_pricing'
    ) THEN
        CREATE POLICY "Authenticated users can update venue_seasonal_pricing"
            ON venue_seasonal_pricing FOR UPDATE
            TO authenticated
            USING (true)
            WITH CHECK (true);
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE tablename = 'venue_seasonal_pricing'
          AND policyname = 'Authenticated users can delete venue_seasonal_pricing'
    ) THEN
        CREATE POLICY "Authenticated users can delete venue_seasonal_pricing"
            ON venue_seasonal_pricing FOR DELETE
            TO authenticated
            USING (true);
    END IF;
END $$;


-- -----------------------------------------------------------------------------
-- Verify: list all new columns
-- -----------------------------------------------------------------------------

SELECT column_name, data_type, is_nullable, column_default
FROM   information_schema.columns
WHERE  table_name = 'venue_pricing'
ORDER  BY ordinal_position;
