-- ============================================================
-- PUBLIC READ POLICIES FOR RETREAT FACILITIES
-- Allows the anon key (web portal visitors) to read retreat
-- facility config and retreat spaces.
-- Run in Supabase SQL Editor
-- ============================================================

-- retreat_facilities: public read
CREATE POLICY "Public read retreat facilities"
    ON public.retreat_facilities
    FOR SELECT
    USING (true);

-- retreat_spaces: public read
CREATE POLICY "Public read retreat spaces"
    ON public.retreat_spaces
    FOR SELECT
    USING (true);
