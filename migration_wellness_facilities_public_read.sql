-- ============================================================
-- PUBLIC READ POLICIES FOR WELLNESS FACILITIES
-- Allows the anon key (web portal visitors) to read facility
-- config and facility items for wellness venues.
-- Run in Supabase SQL Editor
-- ============================================================

-- venue_wellness_facilities: public read
CREATE POLICY "Public read venue wellness facilities"
    ON public.venue_wellness_facilities
    FOR SELECT
    USING (true);

-- wellness_facility_items: public read
CREATE POLICY "Public read wellness facility items"
    ON public.wellness_facility_items
    FOR SELECT
    USING (true);
