-- ── enquiries table ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS enquiries (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_id             TEXT,
  venue_name           TEXT NOT NULL,
  venue_type           TEXT DEFAULT 'Retreat',
  enquiry_type         TEXT NOT NULL DEFAULT 'General Enquiry',
  customer_name        TEXT NOT NULL,
  customer_email       TEXT NOT NULL,
  customer_phone       TEXT,
  preferred_date_from  DATE,
  preferred_date_to    DATE,
  guest_count          INTEGER NOT NULL DEFAULT 1,
  message              TEXT,
  status               TEXT NOT NULL DEFAULT 'new'
                         CHECK (status IN ('new','in_progress','resolved','closed')),
  priority             TEXT NOT NULL DEFAULT 'medium'
                         CHECK (priority IN ('high','medium','low')),
  user_id              UUID,
  created_at           TIMESTAMPTZ DEFAULT NOW(),
  updated_at           TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_enquiries_status      ON enquiries (status);
CREATE INDEX IF NOT EXISTS idx_enquiries_created_at  ON enquiries (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_enquiries_customer    ON enquiries (customer_email);

-- Row-level security (allow service role full access, anon/auth read nothing)
ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;

-- Service role bypasses RLS automatically; no extra policy needed for the API.
-- Allow authenticated users to read their own enquiries (optional)
CREATE POLICY "Users can view own enquiries"
  ON enquiries FOR SELECT
  USING (auth.uid() = user_id);
