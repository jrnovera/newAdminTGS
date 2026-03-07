-- ============================================================
-- Migration: venue_internal_notes table
-- Internal notes for both retreat and wellness venues
-- ============================================================

CREATE TABLE IF NOT EXISTS venue_internal_notes (
  id          UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_id    UUID    NOT NULL,
  venue_type  TEXT    NOT NULL CHECK (venue_type IN ('retreat', 'wellness')),
  note_text   TEXT    NOT NULL,
  author      TEXT    NOT NULL DEFAULT 'Admin',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_venue_internal_notes_venue ON venue_internal_notes(venue_id, venue_type);

ALTER TABLE venue_internal_notes ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'venue_internal_notes'
      AND policyname = 'Authenticated users only'
  ) THEN
    CREATE POLICY "Authenticated users only" ON venue_internal_notes
      FOR ALL USING (auth.role() = 'authenticated');
  END IF;
END $$;
