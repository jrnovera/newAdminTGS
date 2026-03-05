-- =============================================================================
-- venue_reviews table for TGS Admin
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard → SQL Editor)
-- =============================================================================

CREATE TABLE IF NOT EXISTS venue_reviews (
    id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    venue_id    UUID NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
    user_name   TEXT NOT NULL,
    user_image  TEXT,
    rating      INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT NOT NULL,
    created_at  TIMESTAMPTZ DEFAULT now()
);

-- Index for fast lookups by venue
CREATE INDEX IF NOT EXISTS idx_venue_reviews_venue_id ON venue_reviews(venue_id);

-- Index for sorting by date
CREATE INDEX IF NOT EXISTS idx_venue_reviews_created_at ON venue_reviews(created_at DESC);

-- =============================================================================
-- Row Level Security (RLS)
-- Allow full access for authenticated users (admin panel)
-- =============================================================================

ALTER TABLE venue_reviews ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read all reviews
CREATE POLICY "Allow authenticated read" ON venue_reviews
    FOR SELECT TO authenticated USING (true);

-- Allow authenticated users to insert reviews
CREATE POLICY "Allow authenticated insert" ON venue_reviews
    FOR INSERT TO authenticated WITH CHECK (true);

-- Allow authenticated users to update reviews
CREATE POLICY "Allow authenticated update" ON venue_reviews
    FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- Allow authenticated users to delete reviews
CREATE POLICY "Allow authenticated delete" ON venue_reviews
    FOR DELETE TO authenticated USING (true);

-- Also allow anon access if your admin uses anon key
CREATE POLICY "Allow anon read" ON venue_reviews
    FOR SELECT TO anon USING (true);

CREATE POLICY "Allow anon insert" ON venue_reviews
    FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow anon update" ON venue_reviews
    FOR UPDATE TO anon USING (true) WITH CHECK (true);

CREATE POLICY "Allow anon delete" ON venue_reviews
    FOR DELETE TO anon USING (true);
