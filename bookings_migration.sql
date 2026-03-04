-- =============================================================================
-- BOOKINGS MIGRATION
-- Run this in the Supabase SQL Editor
-- Creates venue_date_blocks and venue_bookings tables
-- =============================================================================

-- -----------------------------------------------------------------------------
-- STEP 1: venue_date_blocks
-- Admin-controlled date blocking per venue (e.g. maintenance, holiday closure)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS venue_date_blocks (
    id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    venue_id    uuid NOT NULL,
    block_date  date NOT NULL,
    reason      text,
    created_at  timestamptz DEFAULT now()
);

-- Unique constraint: one block record per venue per date
CREATE UNIQUE INDEX IF NOT EXISTS idx_venue_date_blocks_unique
    ON venue_date_blocks (venue_id, block_date);

-- RLS
ALTER TABLE venue_date_blocks ENABLE ROW LEVEL SECURITY;

-- Authenticated admins can do everything
CREATE POLICY "venue_date_blocks_admin_all" ON venue_date_blocks
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Public (anon) can read blocked dates to show availability on client
CREATE POLICY "venue_date_blocks_public_read" ON venue_date_blocks
    FOR SELECT TO anon USING (true);

-- -----------------------------------------------------------------------------
-- STEP 2: venue_bookings
-- Manual + customer bookings per venue
-- status: pending | confirmed | cancelled | completed
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS venue_bookings (
    id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    venue_id        uuid NOT NULL,
    guest_name      text NOT NULL,
    guest_email     text,
    guest_phone     text,
    service_name    text,            -- wellness: service/treatment name
    check_in_date   date NOT NULL,   -- wellness: appointment date; retreat: check-in
    check_out_date  date,            -- retreat only (nullable for wellness day-spa)
    time_slot       text,            -- e.g. "10:00 AM" (wellness)
    guests          int DEFAULT 1,
    amount          numeric(10,2),
    currency        text DEFAULT 'AUD',
    status          text DEFAULT 'pending' CHECK (status IN ('pending','confirmed','cancelled','completed')),
    notes           text,
    source          text DEFAULT 'admin', -- 'admin' | 'website' | 'enquiry'
    created_at      timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_venue_bookings_venue_id ON venue_bookings (venue_id);
CREATE INDEX IF NOT EXISTS idx_venue_bookings_checkin  ON venue_bookings (check_in_date);

-- RLS
ALTER TABLE venue_bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "venue_bookings_admin_all" ON venue_bookings
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Anon can read for availability checks (no PII leak — only dates matter client-side)
CREATE POLICY "venue_bookings_public_read" ON venue_bookings
    FOR SELECT TO anon USING (true);
