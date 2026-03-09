-- ============================================================
-- PUBLIC READ POLICIES FOR RETREAT ACCOMMODATION
-- Allows the anon key (web portal visitors) to read retreat
-- accommodation config and individual room details.
-- Run in Supabase SQL Editor
-- ============================================================

-- retreat_accommodation: public read
CREATE POLICY "Public read retreat accommodation"
    ON public.retreat_accommodation
    FOR SELECT
    USING (true);

-- retreat_rooms: public read
CREATE POLICY "Public read retreat rooms"
    ON public.retreat_rooms
    FOR SELECT
    USING (true);
