-- ============================================================
-- WELLNESS SERVICE PACKAGES
-- New table for service packages + capacity column on items
-- Run in Supabase SQL Editor
-- ============================================================

-- 1. Add capacity column to wellness_service_items (if not exists)
ALTER TABLE public.wellness_service_items
ADD COLUMN IF NOT EXISTS capacity TEXT;

-- 2. Create wellness_service_packages table
CREATE TABLE IF NOT EXISTS public.wellness_service_packages (
    id               UUID         DEFAULT gen_random_uuid() PRIMARY KEY,
    venue_id         UUID         NOT NULL,
    name             TEXT,
    display_name     TEXT,
    price            TEXT,
    original_price   TEXT,
    description      TEXT,
    duration         TEXT,
    image_url        TEXT,
    tags             TEXT[]       DEFAULT '{}',
    included_service_ids TEXT[]   DEFAULT '{}',
    is_featured      BOOLEAN      DEFAULT false,
    show_on_website  BOOLEAN      DEFAULT true,
    sort_order       INTEGER      DEFAULT 0,
    created_at       TIMESTAMPTZ  DEFAULT NOW(),
    updated_at       TIMESTAMPTZ  DEFAULT NOW()
);

-- 3. Enable RLS
ALTER TABLE public.wellness_service_packages ENABLE ROW LEVEL SECURITY;

-- 4. Authenticated write (admin)
CREATE POLICY "Authenticated users manage wellness packages"
    ON public.wellness_service_packages
    FOR ALL
    USING  (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- 5. Public read (web portal anon key)
CREATE POLICY "Public read wellness service packages"
    ON public.wellness_service_packages
    FOR SELECT
    USING (true);

-- 6. Public read for wellness_service_items (web portal anon key)
--    Skip if it already exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE tablename = 'wellness_service_items'
          AND policyname = 'Public read wellness service items'
    ) THEN
        CREATE POLICY "Public read wellness service items"
            ON public.wellness_service_items
            FOR SELECT
            USING (true);
    END IF;
END $$;

-- 7. Index for fast venue lookups
CREATE INDEX IF NOT EXISTS idx_wellness_service_packages_venue
    ON public.wellness_service_packages(venue_id);
