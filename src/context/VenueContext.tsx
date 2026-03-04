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

  // ── Wellness-specific basic info ──
  wellnessVenueTypes?: string[];
  wellnessCategories?: string[];
  operatingHours?: Record<string, { open: string; close: string; isOpen: boolean }>;
  holidayNote?: string;
  afterHoursAvailable?: boolean;

  // ── Wellness amenities ──
  webAmenities?: string[];
  kitchenAmenities?: string[];
  livingAmenities?: string[];
  techAmenities?: string[];
  outdoorAmenities?: string[];
  parkingAmenities?: string[];
  wifiSpeed?: string;
  poolType?: string;
  parkingSpaces?: number;
  aboutP1?: string;
  aboutP2?: string;
  showAbout?: boolean;
  weProvide?: string;
  pleaseBring?: string;
  optionalItems?: string;
  showBring?: boolean;

  // ── Extended owner / business ──
  firstName?: string;
  lastName?: string;
  ownerRole?: string;
  phoneSecondary?: string;
  businessName?: string;
  taxId?: string;
  businessType?: string;
  gstRegistered?: boolean;
  hostBio?: string;
  showHostProfile?: boolean;
  relationshipNotes?: string;

  // ── Internal / CRM ──
  pipelineStage?: string;
  leadSource?: string;
  leadOwner?: string;
  founderDiscount?: string;
  billingCycle?: string;
  bookingCommission?: string;
  experienceCommission?: string;
  stripeConnected?: boolean;
  marketSegment?: string;
  venueTier?: string;

  // ── Wellness pricing & booking config ──
  dayPassAvailable?: boolean;
  dayPassPrice?: string;
  dayPassDuration?: string;
  dayPassIncludes?: string;
  membershipsAvailable?: boolean;
  membershipDetails?: string;
  vouchersAvailable?: boolean;
  voucherValidity?: string;
  depositRequired?: boolean;
  depositAmount?: string;
  paymentDue?: string;
  freeCancellationPeriod?: string;
  lateFee?: string;
  noShowFee?: string;
  cancellationText?: string;
  bookingPlatform?: string;
  bookingUrl?: string;
  calendarSync?: boolean;
  autoConfirm?: boolean;
  reminders?: string;
  pricingNotes?: string;
  advanceBooking?: string;
  minNotice?: string;
  maxAdvance?: string;
  groupBookings?: boolean;
  maxGroupSize?: string;
  couplesBookings?: boolean;
  packagePricing?: boolean;
  membershipOptions?: boolean;
  dropInWelcome?: boolean;
  appointmentRequired?: boolean;

  // ── Wellness services config ──
  serviceDescription?: string;
  practitionerSpecialties?: string;
  onsiteNutritionist?: boolean;
  offeringTags?: string[];
  dietaryTags?: string[];

  // ── Wellness facilities config ──
  facilityPhilosophy?: string;
  facilityHighlights?: string;
  totalTreatmentRooms?: number;
  privateSuites?: number;
  couplesRooms?: number;
  groupSpaces?: number;
  indoorPoolCount?: number;
  outdoorPoolCount?: number;
  thermalFeatures?: string;
  towelsProvided?: boolean;
  slippersProvided?: boolean;
  facilityCertifications?: Record<string, any>;
  bathingSections?: Record<string, any>;
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

  // ── Wellness basic info ──
  wellnessVenueTypes: v.wellness_venue_types || [],
  wellnessCategories: v.wellness_categories || [],
  introText: v.intro_text || '',
  holidayNote: v.holiday_note || '',
  afterHoursAvailable: v.after_hours_available ?? false,
  operatingHours: {
    Monday:    { open: v.monday_open    || '9:00 AM',  close: v.monday_close    || '8:00 PM',  isOpen: v.monday_is_open    ?? true },
    Tuesday:   { open: v.tuesday_open   || '9:00 AM',  close: v.tuesday_close   || '8:00 PM',  isOpen: v.tuesday_is_open   ?? true },
    Wednesday: { open: v.wednesday_open || '9:00 AM',  close: v.wednesday_close || '8:00 PM',  isOpen: v.wednesday_is_open ?? true },
    Thursday:  { open: v.thursday_open  || '9:00 AM',  close: v.thursday_close  || '9:00 PM',  isOpen: v.thursday_is_open  ?? true },
    Friday:    { open: v.friday_open    || '9:00 AM',  close: v.friday_close    || '9:00 PM',  isOpen: v.friday_is_open    ?? true },
    Saturday:  { open: v.saturday_open  || '9:00 AM',  close: v.saturday_close  || '6:00 PM',  isOpen: v.saturday_is_open  ?? true },
    Sunday:    { open: v.sunday_open    || '10:00 AM', close: v.sunday_close    || '5:00 PM',  isOpen: v.sunday_is_open    ?? true },
  },

  // ── Wellness amenities ──
  webAmenities: v.web_amenities || [],
  kitchenAmenities: v.kitchen_facilities || [],
  livingAmenities: v.living_facilities || [],
  techAmenities: v.tech_facilities || [],
  outdoorAmenities: v.outdoor_facilities || [],
  parkingAmenities: v.parking_amenities || [],
  poolType: v.pool_type || '',
  parkingSpaces: v.parking_spaces || 0,
  aboutP1: v.about_p1 || '',
  aboutP2: v.about_p2 || '',
  showAbout: v.show_about ?? true,
  weProvide: v.we_provide || '',
  pleaseBring: v.please_bring || '',
  optionalItems: v.optional_items || '',
  showBring: v.show_bring ?? true,

  // ── Extended owner / business ──
  firstName: v.first_name || '',
  lastName: v.last_name || '',
  ownerRole: v.owner_role || '',
  phoneSecondary: v.phone_secondary || '',
  businessName: v.business_name || '',
  taxId: v.tax_id || '',
  businessType: v.business_type || '',
  gstRegistered: v.gst_registered ?? false,
  hostBio: v.host_bio || '',
  showHostProfile: v.show_host_profile ?? false,
  relationshipNotes: v.relationship_notes || '',

  // ── Internal / CRM ──
  pipelineStage: v.pipeline_stage || '',
  leadSource: v.lead_source || '',
  leadOwner: v.lead_owner || '',
  founderDiscount: v.founder_discount || '',
  billingCycle: v.billing_cycle || '',
  bookingCommission: v.booking_commission || '',
  experienceCommission: v.experience_commission || '',
  stripeConnected: v.stripe_connected ?? false,
  marketSegment: v.market_segment || '',
  venueTier: v.venue_tier || '',

  // ── Wellness pricing & booking config ──
  dayPassAvailable: v.day_pass_available ?? false,
  dayPassPrice: v.day_pass_price || '',
  dayPassDuration: v.day_pass_duration || '',
  dayPassIncludes: v.day_pass_includes || '',
  membershipsAvailable: v.memberships_available ?? false,
  membershipDetails: v.membership_details || '',
  vouchersAvailable: v.vouchers_available ?? false,
  voucherValidity: v.voucher_validity || '',
  depositRequired: v.deposit_required ?? false,
  depositAmount: v.deposit_amount || '',
  paymentDue: v.payment_due || '',
  freeCancellationPeriod: v.free_cancellation_period || '',
  lateFee: v.late_fee || '',
  noShowFee: v.no_show_fee || '',
  cancellationText: v.cancellation_text || '',
  bookingPlatform: v.booking_platform || '',
  bookingUrl: v.booking_url || '',
  calendarSync: v.calendar_sync ?? false,
  autoConfirm: v.auto_confirm ?? false,
  reminders: v.reminders || '',
  pricingNotes: v.pricing_notes || '',
  advanceBooking: v.advance_booking || '',
  minNotice: v.min_notice || '',
  maxAdvance: v.max_advance || '',
  groupBookings: v.group_bookings ?? false,
  maxGroupSize: v.max_group_size || '',
  couplesBookings: v.couples_bookings ?? true,
  packagePricing: v.package_pricing ?? false,
  membershipOptions: v.membership_options ?? false,
  dropInWelcome: v.drop_in_welcome ?? true,
  appointmentRequired: v.appointment_required ?? false,

  // ── Wellness services config ──
  serviceDescription: v.service_description || '',
  practitionerSpecialties: v.practitioner_specialties || '',
  onsiteNutritionist: v.onsite_nutritionist ?? false,
  offeringTags: v.offering_tags || [],
  dietaryTags: v.dietary_tags || [],

  // ── Wellness facilities config ──
  facilityPhilosophy: v.facility_philosophy || '',
  facilityHighlights: v.facility_highlights || '',
  totalTreatmentRooms: v.wc_total_treatment_rooms || 0,
  privateSuites: v.private_suites || 0,
  couplesRooms: v.couples_rooms || 0,
  groupSpaces: v.group_spaces || 0,
  indoorPoolCount: v.indoor_pool_count || 0,
  outdoorPoolCount: v.outdoor_pool_count || 0,
  thermalFeatures: v.thermal_features || '',
  towelsProvided: v.towels_provided ?? true,
  slippersProvided: v.slippers_provided ?? false,
  facilityCertifications: v.facility_certifications || {},
  bathingSections: v.bathing_sections || {},

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

    // ── Extended basic info (wellness-specific) ──
    wellness_basic: {
      venue_id: venueId,
      wellness_venue_types: venue.wellnessVenueTypes ?? [],
      wellness_categories: venue.wellnessCategories ?? [],
      treatment_rooms: venue.totalTreatmentRooms ?? 0,
      couples_suites: venue.couplesRooms ?? 0,
      total_practitioners: 0,
    },

    // ── Extended content (wellness intro_text) ──
    wellness_content: {
      venue_id: venueId,
      intro_text: venue.introText ?? null,
    },

    // ── Extended amenities (wellness-specific) ──
    wellness_amenities: {
      venue_id: venueId,
      web_amenities: venue.webAmenities ?? [],
      kitchen_facilities: venue.kitchenAmenities ?? [],
      living_facilities: venue.livingAmenities ?? [],
      tech_facilities: venue.techAmenities ?? [],
      outdoor_facilities: venue.outdoorAmenities ?? [],
      parking_amenities: venue.parkingAmenities ?? [],
      pool_type: venue.poolType ?? null,
      parking_spaces: venue.parkingSpaces ?? 0,
    },

    // ── Extended owner/business info ──
    wellness_owner: {
      venue_id: venueId,
      first_name: venue.firstName ?? null,
      last_name: venue.lastName ?? null,
      owner_role: venue.ownerRole ?? null,
      phone_secondary: venue.phoneSecondary ?? null,
      business_name: venue.businessName ?? null,
      tax_id: venue.taxId ?? null,
      business_type: venue.businessType ?? null,
      gst_registered: venue.gstRegistered ?? false,
      host_bio: venue.hostBio ?? null,
      show_host_profile: venue.showHostProfile ?? false,
      relationship_notes: venue.relationshipNotes ?? null,
    },

    // ── Extended internal / CRM ──
    wellness_internal: {
      venue_id: venueId,
      pipeline_stage: venue.pipelineStage ?? null,
      lead_source: venue.leadSource ?? null,
      lead_owner: venue.leadOwner ?? null,
      founder_discount: venue.founderDiscount ?? null,
      billing_cycle: venue.billingCycle ?? null,
      booking_commission: venue.bookingCommission ?? null,
      experience_commission: venue.experienceCommission ?? null,
      stripe_connected: venue.stripeConnected ?? false,
      market_segment: venue.marketSegment ?? null,
      venue_tier: venue.venueTier ?? null,
    },

    // ── Operating hours ──
    operating_hours: (() => {
      const h = venue.operatingHours;
      return {
        venue_id: venueId,
        monday_open:      h?.Monday?.open    ?? '9:00 AM',
        monday_close:     h?.Monday?.close   ?? '8:00 PM',
        monday_is_open:   h?.Monday?.isOpen  ?? true,
        tuesday_open:     h?.Tuesday?.open   ?? '9:00 AM',
        tuesday_close:    h?.Tuesday?.close  ?? '8:00 PM',
        tuesday_is_open:  h?.Tuesday?.isOpen ?? true,
        wednesday_open:   h?.Wednesday?.open   ?? '9:00 AM',
        wednesday_close:  h?.Wednesday?.close  ?? '8:00 PM',
        wednesday_is_open:h?.Wednesday?.isOpen ?? true,
        thursday_open:    h?.Thursday?.open   ?? '9:00 AM',
        thursday_close:   h?.Thursday?.close  ?? '9:00 PM',
        thursday_is_open: h?.Thursday?.isOpen ?? true,
        friday_open:      h?.Friday?.open   ?? '9:00 AM',
        friday_close:     h?.Friday?.close  ?? '9:00 PM',
        friday_is_open:   h?.Friday?.isOpen ?? true,
        saturday_open:    h?.Saturday?.open   ?? '9:00 AM',
        saturday_close:   h?.Saturday?.close  ?? '6:00 PM',
        saturday_is_open: h?.Saturday?.isOpen ?? true,
        sunday_open:      h?.Sunday?.open   ?? '10:00 AM',
        sunday_close:     h?.Sunday?.close  ?? '5:00 PM',
        sunday_is_open:   h?.Sunday?.isOpen ?? true,
        holiday_note:           venue.holidayNote ?? null,
        after_hours_available:  venue.afterHoursAvailable ?? false,
      };
    })(),

    // ── Wellness config (pricing, services, facilities, amenity editorial) ──
    wellness_config: {
      venue_id: venueId,
      // Pricing
      day_pass_available:       venue.dayPassAvailable ?? false,
      day_pass_price:           venue.dayPassPrice ?? null,
      day_pass_duration:        venue.dayPassDuration ?? null,
      day_pass_includes:        venue.dayPassIncludes ?? null,
      memberships_available:    venue.membershipsAvailable ?? false,
      membership_details:       venue.membershipDetails ?? null,
      vouchers_available:       venue.vouchersAvailable ?? false,
      voucher_validity:         venue.voucherValidity ?? null,
      deposit_required:         venue.depositRequired ?? false,
      deposit_amount:           venue.depositAmount ?? null,
      payment_due:              venue.paymentDue ?? null,
      free_cancellation_period: venue.freeCancellationPeriod ?? null,
      late_fee:                 venue.lateFee ?? null,
      no_show_fee:              venue.noShowFee ?? null,
      cancellation_text:        venue.cancellationText ?? null,
      booking_platform:         venue.bookingPlatform ?? null,
      booking_url:              venue.bookingUrl ?? null,
      calendar_sync:            venue.calendarSync ?? false,
      auto_confirm:             venue.autoConfirm ?? false,
      reminders:                venue.reminders ?? null,
      pricing_notes:            venue.pricingNotes ?? null,
      advance_booking:          venue.advanceBooking ?? null,
      min_notice:               venue.minNotice ?? null,
      max_advance:              venue.maxAdvance ?? null,
      group_bookings:           venue.groupBookings ?? false,
      max_group_size:           venue.maxGroupSize ?? null,
      couples_bookings:         venue.couplesBookings ?? true,
      package_pricing:          venue.packagePricing ?? false,
      membership_options:       venue.membershipOptions ?? false,
      drop_in_welcome:          venue.dropInWelcome ?? true,
      appointment_required:     venue.appointmentRequired ?? false,
      // Services
      service_description:      venue.serviceDescription ?? null,
      practitioner_specialties: venue.practitionerSpecialties ?? null,
      onsite_nutritionist:      venue.onsiteNutritionist ?? false,
      offering_tags:            venue.offeringTags ?? [],
      dietary_tags:             venue.dietaryTags ?? [],
      // Facilities
      facility_philosophy:      venue.facilityPhilosophy ?? null,
      facility_highlights:      venue.facilityHighlights ?? null,
      total_treatment_rooms:    venue.totalTreatmentRooms ?? 0,
      private_suites:           venue.privateSuites ?? 0,
      couples_rooms:            venue.couplesRooms ?? 0,
      group_spaces:             venue.groupSpaces ?? 0,
      indoor_pool_count:        venue.indoorPoolCount ?? 0,
      outdoor_pool_count:       venue.outdoorPoolCount ?? 0,
      thermal_features:         venue.thermalFeatures ?? null,
      towels_provided:          venue.towelsProvided ?? true,
      slippers_provided:        venue.slippersProvided ?? false,
      facility_certifications:  venue.facilityCertifications ?? {},
      bathing_sections:         venue.bathingSections ?? {},
      // Amenities editorial
      about_p1:                 venue.aboutP1 ?? null,
      about_p2:                 venue.aboutP2 ?? null,
      show_about:               venue.showAbout ?? true,
      we_provide:               venue.weProvide ?? null,
      please_bring:             venue.pleaseBring ?? null,
      optional_items:           venue.optionalItems ?? null,
      show_bring:               venue.showBring ?? true,
    },
  };
}

// Upsert all 1:1 satellite tables in parallel for a given venueId + venue data
async function upsertSatelliteTables(venueId: string, venue: Partial<Venue>) {
  const p = buildSatellitePayloads(venueId, venue);

  // Base satellite upserts (both retreat and wellness)
  const baseUpserts = Promise.allSettled([
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
    // Wellness extensions — these upsert wellness-specific columns on top of the base row
    supabase.from('venue_basic_info').upsert(p.wellness_basic, { onConflict: 'venue_id' }),
    supabase.from('venue_content').upsert(p.wellness_content, { onConflict: 'venue_id' }),
    supabase.from('venue_amenities').upsert(p.wellness_amenities, { onConflict: 'venue_id' }),
    supabase.from('venue_owner_info').upsert(p.wellness_owner, { onConflict: 'venue_id' }),
    supabase.from('venue_internal').upsert(p.wellness_internal, { onConflict: 'venue_id' }),
    supabase.from('venue_operating_hours').upsert(p.operating_hours, { onConflict: 'venue_id' }),
    supabase.from('venue_wellness_config').upsert(p.wellness_config, { onConflict: 'venue_id' }),
  ]);

  const results = await baseUpserts;

  results.forEach((r, i) => {
    const tableNames = [
      'venue_basic_info', 'venue_content', 'venue_experience', 'venue_property_details',
      'venue_location', 'venue_status', 'venue_accommodation', 'venue_amenities',
      'venue_policies', 'venue_owner_info', 'venue_internal', 'venue_retreat_editorial',
      'venue_basic_info(wellness)', 'venue_content(wellness)', 'venue_amenities(wellness)',
      'venue_owner_info(wellness)', 'venue_internal(wellness)',
      'venue_operating_hours', 'venue_wellness_config',
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
