import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { supabase } from '../lib/supabase';

// =============================================================================
// INTERFACES  (kept identical to original so all downstream pages still work)
// =============================================================================

export interface PricingTier {
  label: string;
  days: number;
  price: string;
}

export interface AddOn {
  name: string;
  price: string;
}

export interface BedConfiguration {
  kingBeds: number;
  queenBeds: number;
  doubleBeds: number;
  singleBeds: number;
  twinBeds: number;
  bunkBeds: number;
  sofaBeds: number;
  rollawayBeds: number;
}

export interface IndividualRoom {
  id: string;
  roomName: string;
  roomImage: string;
  websiteDescription: string;
  roomType: string;
  bedConfiguration: BedConfiguration;
  maxOccupancy: number;
  bathroom: string;
  roomSize: string;
  floor: string;
  pricePerNight: string;
  roomAmenities?: string[];
}

export interface VenueService {
  name: string;
  price: string;
  duration?: string;
}

export interface VenuePackage {
  name: string;
  price: string;
  thumbnail?: string;
  description?: string;
  includedServices?: string[];
  minGuests?: number;
  maxGuests?: number;
}

export interface Practitioner {
  id: string;
  name: string;
  photo: string;
}

export interface RetreatFacility {
  id: string;
  name: string;
  type: string;
  setting: string;
  viewType: string;
  capacity: number;
  sizeSqm: number;
  description: string;
  image?: string;
  isFeatured: boolean;
  isAvailable: boolean;
  equipment: string[];
  flooring?: string;
  climateControl?: string;
  lighting?: string;
  acoustics?: string;
  suitableFor?: string[];
  theatreCapacity?: number;
  boardroomCapacity?: number;
  classroomCapacity?: number;
  hasLawn?: boolean;
  hasCoveredOutdoor?: boolean;
  hasFirePit?: boolean;
  hasWalkingTrails?: boolean;
  hasLabyrinth?: boolean;
  outdoorSeatingCapacity?: number;
}

export interface Venue {
  id: string;
  name: string;
  location: string;
  shortLoc: string;
  type: 'Retreat' | 'Wellness';
  capacity: number;
  status: 'Active' | 'Draft' | 'Inactive';
  subscription: 'Essentials' | 'Standard' | 'Featured' | 'Premium';
  date: string;
  owner: string;
  email: string;
  phone: string;
  description: string;
  website: string;
  amenities: string[];
  services?: VenueService[];
  openingTime?: string;
  closingTime?: string;
  packages?: VenuePackage[];
  venueTypeCategory?: string;
  established?: string;
  bestFor?: string[];
  availabilityTime?: string;
  wheelchairAccessible?: boolean;
  languages?: string[];
  policies?: string;
  isAvailable?: boolean;
  heroImage?: string;
  galleryPhotos?: string[];
  quote?: string;
  introParagraph1?: string;
  introParagraph2?: string;
  ownerAddress?: string;
  showAccommodationSection?: boolean;
  showOnWebsite?: boolean;
  whatsIncluded?: string[];
  accommodationAmenities?: string[];
  addOns?: AddOn[];
  bedConfiguration?: BedConfiguration;
  individualRooms?: IndividualRoom[];
  hasAccommodation: boolean;
  retreatType?: 'Separate Building' | 'Group Hosting';
  hasKitchen?: boolean;
  hasGarden?: boolean;
  hasMeditationHall?: boolean;
  wellnessType?: 'Bathhouse' | 'Treatment Centre' | 'Hotel' | 'Wellness Center';
  offersTherapeuticServices?: boolean;
  facilities: string[];
  pricingTiers: PricingTier[];
  practitioners?: Practitioner[];
  houseRules?: string;
  healthSafety?: string;
  ageRequirements?: string;
  cancellationPolicy?: string;
  bookingPolicy?: string;
  directions?: string;
  modalities?: string[];
  locationSetting?: string;
  retreatVenueType?: string[];
  experienceFeatureImage?: string;
  introText?: string;
  retreatStyles?: string[];
  idealRetreatTypes?: string[];
  experienceTitle?: string;
  experienceSubtitle?: string;
  experienceDescription?: string;
  propertySizeValue?: number;
  propertySizeUnit?: string;
  architectureStyle?: string;
  streetAddress?: string;
  suburb?: string;
  postcode?: string;
  stateProvince?: string;
  country?: string;
  climate?: string;
  locationType?: string[];
  gpsCoordinates?: string;
  nearestAirport?: string;
  transportAccess?: string[];
  maxGuests?: number;
  minGuests?: number;
  totalBedrooms?: number;
  totalBathrooms?: number;
  sharedBathrooms?: number;
  privateEnsuites?: number;
  accommodationStyle?: string;
  propertyType?: string;
  accommodationDescription?: string;
  bedConfigKing?: number;
  bedConfigQueen?: number;
  bedConfigDouble?: number;
  bedConfigSingle?: number;
  bedConfigTwin?: number;
  bedConfigBunk?: number;
  bedConfigSofa?: number;
  bedConfigRollaway?: number;
  checkInTime?: string;
  checkOutTime?: string;
  earlyCheckInAvailable?: boolean;
  lateCheckOutAvailable?: boolean;
  childrenAllowed?: boolean;
  minimumChildAge?: number;
  petsAllowed?: boolean;
  smokingAllowed?: boolean;
  propertyStatus?: string;
  sanctumVetted?: boolean;
  featuredListing?: boolean;
  instantBooking?: boolean;
  hireType?: string;
  internalNotes?: string;
  shortDescription?: string;
  venuePolicies?: string;
  retreatFacilities?: RetreatFacility[];
  retreatFacilitiesTabImage?: string;
  retreatFacilitiesLabel?: string;
  retreatFacilitiesTitle?: string;
  retreatFacilitiesSubtitle?: string;
  retreatFacilitiesIntro?: string;
  retreatFacilitiesNotes?: string;
  supportedRetreatTypes?: string[];
  startingPrice?: number;
  totalBookings?: number;
  primaryVenueType?: string;
}

interface VenueContextType {
  venues: Venue[];
  loading: boolean;
  addVenue: (venue: Omit<Venue, 'id' | 'date'>) => Promise<void>;
  updateVenue: (id: string, venue: Partial<Venue>) => Promise<void>;
  deleteVenue: (id: string) => Promise<void>;
  getVenue: (id: string) => Venue | undefined;
  refreshVenues: () => Promise<void>;
}

const VenueContext = createContext<VenueContextType | null>(null);

// =============================================================================
// HELPERS — value conversions between app (Title Case) and DB (snake_case)
// =============================================================================

const toAppStatus = (s: string): 'Active' | 'Draft' | 'Inactive' =>
  (s ? s.charAt(0).toUpperCase() + s.slice(1) : 'Draft') as 'Active' | 'Draft' | 'Inactive';

const toAppSub = (s: string): 'Essentials' | 'Standard' | 'Featured' | 'Premium' =>
  (s ? s.charAt(0).toUpperCase() + s.slice(1) : 'Essentials') as 'Essentials' | 'Standard' | 'Featured' | 'Premium';

// "Exclusive Use" → "exclusive_use"
const toDbHireType = (h?: string): string | null => {
  if (!h) return null;
  return h.toLowerCase().replace(/\s+/g, '_');
};

// "Operational" → "operational", "Temporarily Closed" → "temporarily_closed"
const toDbPropertyStatus = (s?: string): string => {
  if (!s) return 'operational';
  return s.toLowerCase().replace(/\s+/g, '_');
};

// "Square Metres" → "sqm"
const toDbSizeUnit = (u?: string): string | null => {
  if (!u) return null;
  if (u.toLowerCase().includes('square')) return 'sqm';
  return u.toLowerCase();
};

// =============================================================================
// MAP FROM v_venues_full VIEW → Venue interface
// =============================================================================

const mapFromView = (v: any): Venue => ({
  id: v.id,
  type: v.venue_type === 'retreat' ? 'Retreat' : 'Wellness',
  date: v.created_at,

  // Basic Info
  name: v.name || '',
  primaryVenueType: v.primary_venue_type || '',
  retreatVenueType: v.venue_type_tags || [],
  hireType: v.hire_type ? v.hire_type.replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()) : '',
  bestFor: v.best_for || [],
  languages: v.languages_spoken || [],
  wheelchairAccessible: v.is_wheelchair_accessible ?? false,

  // Content
  shortDescription: v.short_description || '',
  description: v.description || '',
  quote: v.brand_quote || '',
  introParagraph1: v.intro_paragraph || '',
  introParagraph2: '',

  // Experience
  experienceTitle: v.experience_title || '',
  experienceSubtitle: v.experience_subtitle || '',
  experienceDescription: v.experience_description || '',
  modalities: v.modalities || [],
  idealRetreatTypes: v.ideal_retreat_types || [],
  retreatStyles: v.retreat_styles || [],

  // Property Details
  propertySizeValue: v.property_size_value || 0,
  propertySizeUnit: v.property_size_unit
    ? v.property_size_unit === 'sqm' ? 'Square Metres' : v.property_size_unit.charAt(0).toUpperCase() + v.property_size_unit.slice(1)
    : 'Acres',
  established: v.established_year || '',
  architectureStyle: v.architecture_style || '',

  // Location
  streetAddress: v.street_address || '',
  suburb: v.suburb || '',
  postcode: v.postcode || '',
  stateProvince: v.state_province || '',
  country: v.country || 'Australia',
  shortLoc: v.short_loc || '',
  location: v.full_location || '',
  gpsCoordinates: v.gps_lat != null && v.gps_lng != null ? `${v.gps_lat}, ${v.gps_lng}` : '',
  climate: v.climate || '',
  locationType: v.location_types || [],
  locationSetting: v.location_setting || '',
  nearestAirport: v.nearest_airport || '',
  transportAccess: v.transport_access || [],
  directions: v.directions || '',

  // Status & Listing
  status: toAppStatus(v.status),
  propertyStatus: v.property_status
    ? v.property_status.replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())
    : 'Operational',
  subscription: toAppSub(v.subscription_tier),
  sanctumVetted: v.sanctum_vetted ?? false,
  featuredListing: v.featured_listing ?? false,
  instantBooking: v.instant_booking ?? false,
  isAvailable: v.is_available ?? true,
  showOnWebsite: v.show_on_website ?? true,
  startingPrice: v.starting_price || 0,

  // Accommodation
  hasAccommodation: v.venue_type === 'retreat',
  capacity: v.max_guests || 0,
  maxGuests: v.max_guests || 0,
  minGuests: v.min_guests || 1,
  totalBedrooms: v.total_bedrooms || 0,
  totalBathrooms: v.total_bathrooms || 0,
  sharedBathrooms: v.shared_bathrooms || 0,
  privateEnsuites: v.private_ensuites || 0,
  accommodationStyle: v.accommodation_style || '',
  propertyType: v.property_type || '',
  accommodationDescription: v.accommodation_description || '',
  showAccommodationSection: v.show_accommodation_section ?? true,
  accommodationAmenities: v.accommodation_amenities || [],
  bedConfigKing: v.beds_king || 0,
  bedConfigQueen: v.beds_queen || 0,
  bedConfigDouble: v.beds_double || 0,
  bedConfigSingle: v.beds_single || 0,
  bedConfigTwin: v.beds_twin || 0,
  bedConfigBunk: v.beds_bunk || 0,
  bedConfigSofa: v.beds_sofa || 0,
  bedConfigRollaway: v.beds_rollaway || 0,
  checkInTime: v.check_in_time || '',
  checkOutTime: v.check_out_time || '',
  earlyCheckInAvailable: v.early_check_in_available ?? false,
  lateCheckOutAvailable: v.late_check_out_available ?? false,
  childrenAllowed: v.children_allowed ?? true,
  minimumChildAge: v.minimum_child_age || 0,
  petsAllowed: v.pets_allowed ?? false,
  smokingAllowed: v.smoking_allowed ?? false,

  // Amenities
  amenities: v.facilities_list || [],
  facilities: v.facilities_list || [],
  whatsIncluded: v.whats_included || [],

  // Policies
  cancellationPolicy: v.cancellation_policy || '',
  bookingPolicy: v.booking_policy || '',
  houseRules: v.house_rules || '',
  healthSafety: v.health_safety || '',
  ageRequirements: v.age_requirements || '',
  policies: v.access_policies || '',
  venuePolicies: v.general_policies || '',

  // Owner / Manager
  owner: v.owner_name || '',
  email: v.owner_email || '',
  phone: v.owner_phone || '',
  ownerAddress: v.owner_address || '',
  website: v.website_url || '',

  // Internal / CRM
  internalNotes: v.internal_notes || '',
  availabilityTime: v.availability_notes || '',
  totalBookings: v.total_bookings || 0,

  // Retreat Facilities editorial
  retreatFacilitiesTabImage: v.retreat_tab_image_url || '',
  retreatFacilitiesLabel: v.retreat_facilities_label || 'Retreat Spaces',
  retreatFacilitiesTitle: v.retreat_facilities_title || '',
  retreatFacilitiesSubtitle: v.retreat_facilities_subtitle || '',
  retreatFacilitiesIntro: v.retreat_facilities_intro || '',
  retreatFacilitiesNotes: v.retreat_facilities_notes || '',
  supportedRetreatTypes: v.retreat_supported_types || [],

  // Child-table data (not in view — loaded separately on the detail page)
  heroImage: '',
  galleryPhotos: [],
  experienceFeatureImage: '',
  services: [],
  packages: [],
  addOns: [],
  pricingTiers: [],
  practitioners: [],
  retreatFacilities: [],
  individualRooms: [],
  bedConfiguration: {
    kingBeds: v.beds_king || 0,
    queenBeds: v.beds_queen || 0,
    doubleBeds: v.beds_double || 0,
    singleBeds: v.beds_single || 0,
    twinBeds: v.beds_twin || 0,
    bunkBeds: v.beds_bunk || 0,
    sofaBeds: v.beds_sofa || 0,
    rollawayBeds: v.beds_rollaway || 0,
  },
});

// =============================================================================
// BUILD SATELLITE TABLE PAYLOADS
// Converts a Venue object into row objects for each 1:1 satellite table.
// =============================================================================

function buildSatellitePayloads(venueId: string, venue: Partial<Venue>) {
  // Split GPS coordinate string into separate lat/lng numbers
  let gpsLat: number | null = null;
  let gpsLng: number | null = null;
  if (venue.gpsCoordinates) {
    const parts = venue.gpsCoordinates.split(',').map((p) => parseFloat(p.trim()));
    if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
      [gpsLat, gpsLng] = parts;
    }
  }

  return {
    basic_info: {
      venue_id: venueId,
      name: venue.name ?? '',
      primary_venue_type: venue.primaryVenueType ?? null,
      venue_type_tags: venue.retreatVenueType ?? [],
      hire_type: toDbHireType(venue.hireType),
      best_for: venue.bestFor ?? [],
      languages_spoken: venue.languages ?? [],
      is_wheelchair_accessible: venue.wheelchairAccessible ?? false,
    },
    content: {
      venue_id: venueId,
      short_description: venue.shortDescription ?? null,
      description: venue.description ?? null,
      brand_quote: venue.quote ?? null,
      intro_paragraph: venue.introParagraph1 ?? null,
    },
    experience: {
      venue_id: venueId,
      experience_title: venue.experienceTitle ?? null,
      experience_subtitle: venue.experienceSubtitle ?? null,
      experience_description: venue.experienceDescription ?? null,
      modalities: venue.modalities ?? [],
      ideal_retreat_types: venue.idealRetreatTypes ?? [],
      retreat_styles: venue.retreatStyles ?? [],
    },
    property_details: {
      venue_id: venueId,
      property_size_value: venue.propertySizeValue ?? null,
      property_size_unit: toDbSizeUnit(venue.propertySizeUnit),
      established_year: venue.established ?? null,
      architecture_style: venue.architectureStyle ?? null,
    },
    location: {
      venue_id: venueId,
      street_address: venue.streetAddress ?? null,
      suburb: venue.suburb ?? null,
      postcode: venue.postcode ?? null,
      state_province: venue.stateProvince ?? null,
      country: venue.country ?? 'Australia',
      short_loc: venue.shortLoc ?? null,
      full_location: venue.location ?? null,
      gps_lat: gpsLat,
      gps_lng: gpsLng,
      climate: venue.climate ?? null,
      location_types: venue.locationType ?? [],
      location_setting: venue.locationSetting ?? null,
      nearest_airport: venue.nearestAirport ?? null,
      transport_access: venue.transportAccess ?? [],
      directions: venue.directions ?? null,
    },
    status: {
      venue_id: venueId,
      status: (venue.status ?? 'Draft').toLowerCase(),
      property_status: toDbPropertyStatus(venue.propertyStatus),
      subscription_tier: (venue.subscription ?? 'Essentials').toLowerCase(),
      sanctum_vetted: venue.sanctumVetted ?? false,
      featured_listing: venue.featuredListing ?? false,
      instant_booking: venue.instantBooking ?? false,
      is_available: venue.isAvailable ?? true,
      show_on_website: venue.showOnWebsite ?? true,
      starting_price: venue.startingPrice ?? null,
    },
    accommodation: {
      venue_id: venueId,
      max_guests: venue.maxGuests ?? 0,
      min_guests: venue.minGuests ?? 1,
      total_bedrooms: venue.totalBedrooms ?? 0,
      total_bathrooms: venue.totalBathrooms ?? 0,
      shared_bathrooms: venue.sharedBathrooms ?? 0,
      private_ensuites: venue.privateEnsuites ?? 0,
      accommodation_style: venue.accommodationStyle ?? null,
      property_type: venue.propertyType ?? null,
      accommodation_description: venue.accommodationDescription ?? null,
      show_accommodation_section: venue.showAccommodationSection ?? true,
      accommodation_amenities: venue.accommodationAmenities ?? [],
      beds_king: venue.bedConfigKing ?? 0,
      beds_queen: venue.bedConfigQueen ?? 0,
      beds_double: venue.bedConfigDouble ?? 0,
      beds_single: venue.bedConfigSingle ?? 0,
      beds_twin: venue.bedConfigTwin ?? 0,
      beds_bunk: venue.bedConfigBunk ?? 0,
      beds_sofa: venue.bedConfigSofa ?? 0,
      beds_rollaway: venue.bedConfigRollaway ?? 0,
      check_in_time: venue.checkInTime ?? null,
      check_out_time: venue.checkOutTime ?? null,
      early_check_in_available: venue.earlyCheckInAvailable ?? false,
      late_check_out_available: venue.lateCheckOutAvailable ?? false,
      children_allowed: venue.childrenAllowed ?? true,
      minimum_child_age: venue.minimumChildAge ?? null,
      pets_allowed: venue.petsAllowed ?? false,
      smoking_allowed: venue.smokingAllowed ?? false,
    },
    amenities: {
      venue_id: venueId,
      facilities_list: venue.facilities ?? [],
      whats_included: venue.whatsIncluded ?? [],
    },
    policies: {
      venue_id: venueId,
      cancellation_policy: venue.cancellationPolicy ?? null,
      booking_policy: venue.bookingPolicy ?? null,
      house_rules: venue.houseRules ?? null,
      health_safety: venue.healthSafety ?? null,
      age_requirements: venue.ageRequirements ?? null,
      access_policies: venue.policies ?? null,
      general_policies: venue.venuePolicies ?? null,
    },
    owner_info: {
      venue_id: venueId,
      owner_name: venue.owner ?? null,
      owner_email: venue.email ?? null,
      owner_phone: venue.phone ?? null,
      owner_address: venue.ownerAddress ?? null,
      website_url: venue.website ?? null,
    },
    internal: {
      venue_id: venueId,
      internal_notes: venue.internalNotes ?? null,
      availability_notes: venue.availabilityTime ?? null,
      total_bookings: venue.totalBookings ?? 0,
    },
    retreat_editorial: {
      venue_id: venueId,
      tab_image_url: venue.retreatFacilitiesTabImage ?? null,
      label: venue.retreatFacilitiesLabel ?? 'Retreat Spaces',
      title: venue.retreatFacilitiesTitle ?? null,
      subtitle: venue.retreatFacilitiesSubtitle ?? null,
      intro_text: venue.retreatFacilitiesIntro ?? null,
      notes: venue.retreatFacilitiesNotes ?? null,
      supported_retreat_types: venue.supportedRetreatTypes ?? [],
    },
  };
}

// Upsert all 1:1 satellite tables in parallel for a given venueId + venue data
async function upsertSatelliteTables(venueId: string, venue: Partial<Venue>) {
  const p = buildSatellitePayloads(venueId, venue);

  const results = await Promise.allSettled([
    supabase.from('venue_basic_info').upsert(p.basic_info, { onConflict: 'venue_id' }),
    supabase.from('venue_content').upsert(p.content, { onConflict: 'venue_id' }),
    supabase.from('venue_experience').upsert(p.experience, { onConflict: 'venue_id' }),
    supabase.from('venue_property_details').upsert(p.property_details, { onConflict: 'venue_id' }),
    supabase.from('venue_location').upsert(p.location, { onConflict: 'venue_id' }),
    supabase.from('venue_status').upsert(p.status, { onConflict: 'venue_id' }),
    supabase.from('venue_accommodation').upsert(p.accommodation, { onConflict: 'venue_id' }),
    supabase.from('venue_amenities').upsert(p.amenities, { onConflict: 'venue_id' }),
    supabase.from('venue_policies').upsert(p.policies, { onConflict: 'venue_id' }),
    supabase.from('venue_owner_info').upsert(p.owner_info, { onConflict: 'venue_id' }),
    supabase.from('venue_internal').upsert(p.internal, { onConflict: 'venue_id' }),
    supabase.from('venue_retreat_editorial').upsert(p.retreat_editorial, { onConflict: 'venue_id' }),
  ]);

  results.forEach((r, i) => {
    const tableNames = [
      'venue_basic_info', 'venue_content', 'venue_experience', 'venue_property_details',
      'venue_location', 'venue_status', 'venue_accommodation', 'venue_amenities',
      'venue_policies', 'venue_owner_info', 'venue_internal', 'venue_retreat_editorial',
    ];
    if (r.status === 'rejected') {
      console.error(`[VenueContext] upsert failed for ${tableNames[i]}:`, r.reason);
    } else if (r.value.error) {
      console.error(`[VenueContext] upsert error in ${tableNames[i]}:`, r.value.error.message);
    }
  });
}

// =============================================================================
// PROVIDER
// =============================================================================

export function VenueProvider({ children }: { children: ReactNode }) {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);

  // ── Fetch all venues from the v_venues_full convenience view ───────────────
  const fetchVenues = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('v_venues_full')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setVenues((data || []).map(mapFromView));
    } catch (err) {
      console.error('[VenueContext] fetchVenues error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVenues();
  }, []);

  // ── Create venue ───────────────────────────────────────────────────────────
  // 1. Insert a core row into `venues` to get the id
  // 2. Upsert all 1:1 satellite tables with that id
  // 3. Re-fetch the full row from v_venues_full and prepend to local state
  const addVenue = async (venue: Omit<Venue, 'id' | 'date'>) => {
    try {
      // Step 1 — core identity row
      const { data: coreRow, error: coreErr } = await supabase
        .from('venues')
        .insert({ venue_type: venue.type === 'Retreat' ? 'retreat' : 'wellness' })
        .select('id')
        .single();

      if (coreErr || !coreRow) {
        console.error('[VenueContext] venues insert error:', coreErr);
        throw coreErr ?? new Error('Failed to create venue core record');
      }

      const venueId = coreRow.id as string;

      // Step 2 — satellite tables
      await upsertSatelliteTables(venueId, venue);

      // Step 3 — fetch complete row and add to state
      const { data: fullRow, error: fetchErr } = await supabase
        .from('v_venues_full')
        .select('*')
        .eq('id', venueId)
        .single();

      if (fetchErr || !fullRow) throw fetchErr ?? new Error('Could not re-fetch new venue');

      setVenues((prev) => [mapFromView(fullRow), ...prev]);
    } catch (err: any) {
      const msg = err?.message || 'Unknown error — check browser console';
      console.error('[VenueContext] addVenue failed:', err);
      alert(`Failed to create venue: ${msg}`);
      throw err;
    }
  };

  // ── Update venue ───────────────────────────────────────────────────────────
  // Merges updates with existing data, upserts all satellite tables,
  // then patches local state (no full re-fetch needed).
  const updateVenue = async (id: string, updates: Partial<Venue>) => {
    try {
      const existing = venues.find((v) => v.id === id);
      if (!existing) throw new Error(`Venue ${id} not found in local state`);

      const merged: Venue = { ...existing, ...updates };

      await upsertSatelliteTables(id, merged);

      setVenues((prev) => prev.map((v) => (v.id === id ? merged : v)));
    } catch (err: any) {
      console.error('[VenueContext] updateVenue failed:', err);
      alert(`Failed to update venue: ${err?.message}`);
      throw err;
    }
  };

  // ── Delete venue ───────────────────────────────────────────────────────────
  // Deleting the `venues` row cascades to all satellite tables automatically.
  const deleteVenue = async (id: string) => {
    try {
      const { error } = await supabase.from('venues').delete().eq('id', id);
      if (error) throw error;
      setVenues((prev) => prev.filter((v) => v.id !== id));
    } catch (err) {
      console.error('[VenueContext] deleteVenue failed:', err);
      throw err;
    }
  };

  const getVenue = (id: string) => venues.find((v) => v.id === id);

  return (
    <VenueContext.Provider value={{
      venues,
      loading,
      addVenue,
      updateVenue,
      deleteVenue,
      getVenue,
      refreshVenues: fetchVenues,
    }}>
      {children}
    </VenueContext.Provider>
  );
}

export function useVenues() {
  const ctx = useContext(VenueContext);
  if (!ctx) throw new Error('useVenues must be used within VenueProvider');
  return ctx;
}
