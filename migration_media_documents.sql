-- ============================================================
-- Migration: venue_documents table
-- Downloadable assets for both retreat and wellness venues
-- ============================================================

CREATE TABLE IF NOT EXISTS venue_documents (
  id              UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_id        UUID    NOT NULL,
  venue_type      TEXT    NOT NULL CHECK (venue_type IN ('retreat', 'wellness')),
  file_url        TEXT    NOT NULL,
  file_name       TEXT    NOT NULL,
  file_size_bytes BIGINT,
  file_type       TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_venue_documents_venue ON venue_documents(venue_id, venue_type);

ALTER TABLE venue_documents ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'venue_documents'
      AND policyname = 'Authenticated users only'
  ) THEN
    CREATE POLICY "Authenticated users only" ON venue_documents
      FOR ALL USING (auth.role() = 'authenticated');
  END IF;
END $$;
