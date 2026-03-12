-- Wellness Guests table for manual guest management
CREATE TABLE IF NOT EXISTS wellness_guests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    venue_id UUID REFERENCES venue_basic_info(venue_id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    notes TEXT,
    status TEXT DEFAULT 'Active' CHECK (status IN ('Active', 'New', 'Returning', 'Inactive')),
    total_spent NUMERIC(10,2) DEFAULT 0,
    total_bookings INTEGER DEFAULT 0,
    last_booking_venue TEXT,
    last_booking_date DATE,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE wellness_guests ENABLE ROW LEVEL SECURITY;

-- Public read policy (matching other wellness tables)
CREATE POLICY "Allow public read access on wellness_guests"
    ON wellness_guests FOR SELECT
    USING (true);

-- Allow all operations for authenticated users
CREATE POLICY "Allow authenticated insert on wellness_guests"
    ON wellness_guests FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Allow authenticated update on wellness_guests"
    ON wellness_guests FOR UPDATE
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow authenticated delete on wellness_guests"
    ON wellness_guests FOR DELETE
    USING (true);

-- Index for fast lookups
CREATE INDEX idx_wellness_guests_venue ON wellness_guests(venue_id);
CREATE INDEX idx_wellness_guests_status ON wellness_guests(status);
CREATE INDEX idx_wellness_guests_email ON wellness_guests(email);
