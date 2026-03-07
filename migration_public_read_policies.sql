-- ============================================================
-- PUBLIC READ POLICIES FOR WEB PORTAL
-- Allows the anon key (unauthenticated web portal visitors)
-- to read Active venue listings and their associated media.
-- All writes still require authentication.
-- ============================================================

-- wellness_venues: public read for Active listings
CREATE POLICY "Public read active wellness venues"
  ON wellness_venues
  FOR SELECT
  USING (listing_status = 'Active');

-- retreat_venues: public read for Active listings
CREATE POLICY "Public read active retreat venues"
  ON retreat_venues
  FOR SELECT
  USING (listing_status = 'Active');

-- venue_media: public read (images are already public URLs anyway)
CREATE POLICY "Public read venue media"
  ON venue_media
  FOR SELECT
  USING (true);

-- venue_pricing: public read (needed for service filter in availability modal)
CREATE POLICY "Public read venue pricing"
  ON venue_pricing
  FOR SELECT
  USING (true);
