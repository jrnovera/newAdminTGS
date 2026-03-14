import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { supabase } from '../lib/supabase';

// =============================================================================
// INTERFACES  (kept identical so all downstream pages/tabs still work)
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
  isPremium?: boolean;
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
  accommodationHeroImage?: string;

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
// HELPERS
// =============================================================================

const toAppStatus = (s?: string | null): 'Active' | 'Draft' | 'Inactive' => {
  if (!s) return 'Draft';
  const cap = s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
  if (cap === 'Active' || cap === 'Inactive') return cap;
  return 'Draft';
};

const toAppSub = (s?: string | null): 'Essentials' | 'Standard' | 'Featured' | 'Premium' => {
  if (!s) return 'Essentials';
  const cap = s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
  if (cap === 'Standard' || cap === 'Featured' || cap === 'Premium') return cap as any;
  return 'Essentials';
};

// =============================================================================
// MAP FROM DB ROWS → Venue interface
// =============================================================================

function mapFromRetreat(r: any): Venue {
  const city = r.city || '';
  const state = r.state || '';
  const street = r.street_address || '';
  return {
    id: r.id,
    type: 'Retreat',
    date: r.created_at || '',

    // Basic Info
    name: r.venue_name || '',
    description: r.property_description || '',
    shortDescription: r.short_description || '',
    primaryVenueType: r.primary_venue_type || '',
    retreatVenueType: r.retreat_venue_type || [],
    hireType: r.hire_type || '',

    // Editorial
    quote: r.hero_quote || '',
    introParagraph1: r.introduction_text || '',
    introParagraph2: '',

    // Property Details
    propertySizeValue: r.property_size || 0,
    propertySizeUnit: r.property_size_unit || 'Acres',
    established: r.year_established || '',
    architectureStyle: r.architecture_style || '',

    // Experience
    experienceTitle: r.experience_title || '',
    experienceSubtitle: r.experience_subtitle || '',
    experienceDescription: r.experience_description || '',
    modalities: r.modalities || [],
    idealRetreatTypes: r.ideal_retreat_types || [],

    // Location
    streetAddress: street,
    suburb: city,
    postcode: r.postcode || '',
    stateProvince: state,
    country: r.country || 'Australia',
    climate: r.climate || '',
    locationType: r.location_type || [],
    locationSetting: '',
    gpsCoordinates: r.gps_coordinates || '',
    nearestAirport: r.nearest_airport || '',
    transportAccess: r.transport_access || [],

    // Derived display
    shortLoc: city && state ? `${city}, ${state}` : city,
    location: street ? `${street}, ${city}` : city,

    // Status & Listing
    status: toAppStatus(r.listing_status),
    propertyStatus: r.property_status || 'Operational',
    subscription: toAppSub(r.subscription_level),
    sanctumVetted: r.sanctum_vetted ?? false,
    featuredListing: r.featured_listing ?? false,
    instantBooking: r.instant_booking ?? false,
    isPremium: r.is_premium ?? false,
    isAvailable: true,
    showOnWebsite: true,

    // Images
    heroImage: r.overview_hero_image || '',
    experienceFeatureImage: r.experience_feature_image || '',
    galleryPhotos: r.gallery_photos || [],

    // Required fields with defaults (satellite tables load these later)
    hasAccommodation: true,
    capacity: 0,
    maxGuests: 0,
    minGuests: 1,
    totalBedrooms: 0,
    totalBathrooms: 0,
    sharedBathrooms: 0,
    privateEnsuites: 0,
    amenities: [],
    facilities: [],
    pricingTiers: [],
    services: [],
    packages: [],
    addOns: [],
    practitioners: [],
    retreatFacilities: [],
    individualRooms: [],
    whatsIncluded: [],
    accommodationAmenities: [],
    owner: '',
    email: '',
    phone: '',
    website: '',
    bedConfiguration: {
      kingBeds: 0, queenBeds: 0, doubleBeds: 0, singleBeds: 0,
      twinBeds: 0, bunkBeds: 0, sofaBeds: 0, rollawayBeds: 0,
    },

    // Not applicable for retreat
    wellnessVenueTypes: [],
    wellnessCategories: [],
    bestFor: [],
    webAmenities: [],
    retreatFacilitiesLabel: 'Retreat Spaces',
    retreatFacilitiesTabImage: '',
    retreatFacilitiesTitle: '',
    retreatFacilitiesSubtitle: '',
    retreatFacilitiesIntro: '',
    retreatFacilitiesNotes: '',
    supportedRetreatTypes: [],
    startingPrice: 0,
    totalBookings: 0,
    internalNotes: '',
    availabilityTime: '',
  };
}

function mapFromWellness(w: any): Venue {
  const city = w.city || '';
  const state = w.state || '';
  const street = w.street_address || '';
  const venueTypes: string[] = w.wellness_venue_type || [];
  return {
    id: w.id,
    type: 'Wellness',
    date: w.created_at || '',

    // Basic Info
    name: w.venue_name || '',
    description: w.venue_description || '',
    shortDescription: w.short_description || '',
    primaryVenueType: w.primary_venue_type || 'Wellness Venue',
    wellnessVenueTypes: venueTypes,
    wellnessCategories: w.wellness_categories || [],
    wellnessType: venueTypes[0] as any || undefined,

    // Venue Details
    totalTreatmentRooms: w.treatment_rooms || 0,
    couplesRooms: w.couples_suites || 0,
    propertySizeValue: w.floor_area_sqm || 0,
    propertySizeUnit: 'sqm',
    established: w.year_established || '',
    maxGuests: w.max_concurrent_clients || 0,
    capacity: w.max_concurrent_clients || 0,

    // Editorial
    quote: w.hero_quote || '',
    introParagraph1: w.introduction_text || '',
    introText: w.introduction_text || '',   // alias — WellnessOverviewTab reads this
    introParagraph2: '',

    // Experience
    experienceTitle: w.experience_title || '',
    experienceSubtitle: w.experience_subtitle || '',
    experienceDescription: w.experience_description || '',
    modalities: w.signature_treatments || [],
    bestFor: w.best_for || [],

    // Location
    streetAddress: street,
    suburb: city,
    postcode: w.postcode || '',
    stateProvince: state,
    country: w.country || 'Australia',
    locationType: w.location_type || [],
    locationSetting: '',
    gpsCoordinates: w.gps_coordinates || '',
    nearestAirport: w.nearest_transport || '',
    transportAccess: w.parking_access || [],

    // Derived display
    shortLoc: city && state ? `${city}, ${state}` : city,
    location: street ? `${street}, ${city}` : city,

    // Status & Listing
    status: toAppStatus(w.listing_status),
    propertyStatus: w.business_status || 'Operational',
    subscription: toAppSub(w.subscription_level),
    sanctumVetted: w.sanctum_vetted ?? false,
    featuredListing: w.featured_listing ?? false,
    instantBooking: w.online_booking ?? false,
    isPremium: w.is_premium ?? false,
    isAvailable: true,
    showOnWebsite: true,

    // Images
    heroImage: w.overview_hero_image || '',
    experienceFeatureImage: w.experience_feature_image || '',
    galleryPhotos: w.gallery_photos || [],

    // Operating Hours
    operatingHours: w.operating_hours || undefined,
    holidayNote: w.holiday_note || '',
    afterHoursAvailable: w.after_hours_available ?? false,

    // Required fields with defaults (satellite tables load these later)
    hasAccommodation: false,
    minGuests: 1,
    totalBedrooms: 0,
    totalBathrooms: 0,
    sharedBathrooms: 0,
    privateEnsuites: 0,
    amenities: [],
    facilities: [],
    pricingTiers: [],
    services: [],
    packages: [],
    addOns: [],
    practitioners: [],
    retreatFacilities: [],
    individualRooms: [],
    whatsIncluded: [],
    accommodationAmenities: [],
    owner: '',
    email: '',
    phone: '',
    website: '',
    bedConfiguration: {
      kingBeds: 0, queenBeds: 0, doubleBeds: 0, singleBeds: 0,
      twinBeds: 0, bunkBeds: 0, sofaBeds: 0, rollawayBeds: 0,
    },

    // Not applicable for wellness
    retreatVenueType: [],
    hireType: '',
    climate: '',
    webAmenities: [],
    startingPrice: 0,
    totalBookings: 0,
    internalNotes: '',
    availabilityTime: '',
  };
}

// =============================================================================
// BUILD DB ROWS FROM Venue
// =============================================================================

function buildRetreatDBRow(v: Partial<Venue>) {
  return {
    venue_name: v.name || '',
    primary_venue_type: v.primaryVenueType || null,
    retreat_venue_type: v.retreatVenueType || [],
    hire_type: v.hireType || null,
    property_description: v.description || '',
    short_description: v.shortDescription || null,
    hero_quote: v.quote || null,
    introduction_text: v.introParagraph1 || null,
    property_size: v.propertySizeValue || null,
    property_size_unit: v.propertySizeUnit || null,
    year_established: v.established || null,
    architecture_style: v.architectureStyle || null,
    experience_title: v.experienceTitle || null,
    experience_subtitle: v.experienceSubtitle || null,
    experience_description: v.experienceDescription || null,
    modalities: v.modalities || [],
    ideal_retreat_types: v.idealRetreatTypes || [],
    street_address: v.streetAddress || '',
    city: v.suburb || '',
    postcode: v.postcode || '',
    state: v.stateProvince || '',
    country: v.country || 'Australia',
    climate: v.climate || null,
    location_type: v.locationType || [],
    gps_coordinates: v.gpsCoordinates || null,
    nearest_airport: v.nearestAirport || null,
    transport_access: v.transportAccess || [],
    listing_status: v.status || 'Draft',
    property_status: v.propertyStatus || null,
    subscription_level: v.subscription || 'Essentials',
    sanctum_vetted: v.sanctumVetted ?? false,
    featured_listing: v.featuredListing ?? false,
    instant_booking: v.instantBooking ?? false,
    is_premium: v.isPremium ?? false,
    overview_hero_image: v.heroImage || null,
    experience_feature_image: v.experienceFeatureImage || null,
    gallery_photos: v.galleryPhotos?.length ? v.galleryPhotos : null,
  };
}

function buildWellnessDBRow(v: Partial<Venue>) {
  return {
    venue_name: v.name || '',
    primary_venue_type: v.primaryVenueType || 'Wellness Venue',
    wellness_venue_type: v.wellnessVenueTypes || [],
    wellness_categories: v.wellnessCategories || [],
    venue_description: v.description || '',
    short_description: v.shortDescription || null,
    treatment_rooms: v.totalTreatmentRooms || null,
    couples_suites: v.couplesRooms || null,
    floor_area_sqm: v.propertySizeValue || null,
    year_established: v.established || null,
    max_concurrent_clients: v.maxGuests || null,
    hero_quote: v.quote || null,
    introduction_text: v.introParagraph1 || v.introText || null,
    experience_title: v.experienceTitle || null,
    experience_subtitle: v.experienceSubtitle || null,
    experience_description: v.experienceDescription || null,
    signature_treatments: v.modalities || [],
    best_for: v.bestFor || [],
    street_address: v.streetAddress || '',
    city: v.suburb || '',
    postcode: v.postcode || '',
    state: v.stateProvince || '',
    country: v.country || 'Australia',
    location_type: v.locationType || [],
    gps_coordinates: v.gpsCoordinates || null,
    nearest_transport: v.nearestAirport || null,
    parking_access: v.transportAccess || [],
    listing_status: v.status || 'Draft',
    business_status: v.propertyStatus || null,
    subscription_level: v.subscription || 'Essentials',
    sanctum_vetted: v.sanctumVetted ?? false,
    featured_listing: v.featuredListing ?? false,
    online_booking: v.instantBooking ?? false,
    is_premium: v.isPremium ?? false,
    overview_hero_image: v.heroImage || null,
    experience_feature_image: v.experienceFeatureImage || null,
    gallery_photos: v.galleryPhotos?.length ? v.galleryPhotos : null,
    operating_hours: v.operatingHours ?? null,
    holiday_note: v.holidayNote || null,
    after_hours_available: v.afterHoursAvailable ?? false,
  };
}

// =============================================================================
// ACCOMMODATION SATELLITE TABLE HELPERS
// =============================================================================

/** Map a retreat_rooms / wellness_rooms DB row → IndividualRoom */
function mapRoomFromDB(r: any): IndividualRoom {
  return {
    id: r.id,
    roomName: r.room_name || '',
    roomImage: r.room_image || '',
    websiteDescription: r.room_description || '',
    roomType: r.room_type || 'Standard',
    bedConfiguration: {
      kingBeds: r.king_beds || 0,
      queenBeds: r.queen_beds || 0,
      doubleBeds: 0,
      singleBeds: r.single_beds || 0,
      twinBeds: 0,
      bunkBeds: 0,
      sofaBeds: 0,
      rollawayBeds: 0,
    },
    maxOccupancy: r.max_occupancy || 2,
    bathroom: r.bathroom_type || 'Private Ensuite',
    roomSize: '',
    floor: '',
    pricePerNight: '',
    roomAmenities: r.room_amenities || [],
  };
}

/** Merge retreat_accommodation + retreat_rooms rows into a Retreat Venue object */
function mergeRetreatAccom(v: Venue, accom: any | null, rooms: any[]): Venue {
  if (!accom) return { ...v, individualRooms: rooms.map(mapRoomFromDB) };
  return {
    ...v,
    maxGuests: accom.max_guests ?? v.maxGuests,
    minGuests: accom.min_guests ?? v.minGuests,
    totalBedrooms: accom.total_bedrooms ?? v.totalBedrooms,
    totalBathrooms: accom.total_bathrooms ?? v.totalBathrooms,
    sharedBathrooms: accom.shared_bathrooms ?? v.sharedBathrooms,
    privateEnsuites: accom.private_ensuites ?? v.privateEnsuites,
    accommodationStyle: accom.accommodation_style ?? v.accommodationStyle,
    propertyType: accom.property_type ?? v.propertyType,
    accommodationDescription: accom.accommodation_description ?? v.accommodationDescription,
    bedConfigKing: accom.king_beds ?? v.bedConfigKing,
    bedConfigQueen: accom.queen_beds ?? v.bedConfigQueen,
    bedConfigDouble: accom.double_beds ?? v.bedConfigDouble,
    bedConfigSingle: accom.single_beds ?? v.bedConfigSingle,
    bedConfigTwin: accom.twin_beds ?? v.bedConfigTwin,
    bedConfigBunk: accom.bunk_beds ?? v.bedConfigBunk,
    bedConfigSofa: accom.sofa_beds ?? v.bedConfigSofa,
    bedConfigRollaway: accom.rollaway_beds ?? v.bedConfigRollaway,
    checkInTime: accom.checkin_time ?? v.checkInTime,
    checkOutTime: accom.checkout_time ?? v.checkOutTime,
    earlyCheckInAvailable: accom.early_checkin ?? v.earlyCheckInAvailable,
    lateCheckOutAvailable: accom.late_checkout ?? v.lateCheckOutAvailable,
    childrenAllowed: accom.children_allowed ?? v.childrenAllowed,
    minimumChildAge: accom.min_child_age ?? v.minimumChildAge,
    petsAllowed: accom.pets_allowed ?? v.petsAllowed,
    smokingAllowed: accom.smoking_allowed ?? v.smokingAllowed,
    individualRooms: rooms.map(mapRoomFromDB),
  };
}

/** Merge wellness_accommodation + wellness_rooms rows into a Wellness Venue object */
function mergeWellnessAccom(v: Venue, accom: any | null, rooms: any[]): Venue {
  if (!accom) return { ...v, individualRooms: rooms.map(mapRoomFromDB) };
  return {
    ...v,
    hasAccommodation: accom.has_accommodation ?? v.hasAccommodation,
    accommodationHeroImage: accom.accommodation_hero_image || v.accommodationHeroImage || '',
    whatsIncluded: accom.whats_included ?? v.whatsIncluded,
    introParagraph2: accom.intro_paragraph_2 ?? v.introParagraph2,
    capacity: accom.max_concurrent_clients ?? v.capacity,
    totalTreatmentRooms: accom.treatment_rooms ?? v.totalTreatmentRooms,
    couplesRooms: accom.couples_suites ?? v.couplesRooms,
    maxGuests: accom.max_guests ?? v.maxGuests,
    minGuests: accom.min_guests ?? v.minGuests,
    totalBedrooms: accom.total_bedrooms ?? v.totalBedrooms,
    totalBathrooms: accom.total_bathrooms ?? v.totalBathrooms,
    sharedBathrooms: accom.shared_bathrooms ?? v.sharedBathrooms,
    privateEnsuites: accom.private_ensuites ?? v.privateEnsuites,
    accommodationStyle: accom.accommodation_style ?? v.accommodationStyle,
    bedConfigKing: accom.king_beds ?? v.bedConfigKing,
    bedConfigQueen: accom.queen_beds ?? v.bedConfigQueen,
    bedConfigDouble: accom.double_beds ?? v.bedConfigDouble,
    bedConfigSingle: accom.single_beds ?? v.bedConfigSingle,
    bedConfigTwin: accom.twin_beds ?? v.bedConfigTwin,
    bedConfigBunk: accom.bunk_beds ?? v.bedConfigBunk,
    bedConfigSofa: accom.sofa_beds ?? v.bedConfigSofa,
    bedConfigRollaway: accom.rollaway_beds ?? v.bedConfigRollaway,
    checkInTime: accom.checkin_time ?? v.checkInTime,
    checkOutTime: accom.checkout_time ?? v.checkOutTime,
    earlyCheckInAvailable: accom.early_checkin ?? v.earlyCheckInAvailable,
    lateCheckOutAvailable: accom.late_checkout ?? v.lateCheckOutAvailable,
    childrenAllowed: accom.children_allowed ?? v.childrenAllowed,
    minimumChildAge: accom.min_child_age ?? v.minimumChildAge,
    petsAllowed: accom.pets_allowed ?? v.petsAllowed,
    smokingAllowed: accom.smoking_allowed ?? v.smokingAllowed,
    individualRooms: rooms.map(mapRoomFromDB),
  };
}

function buildRetreatAccomRow(venueId: string, v: Partial<Venue>) {
  return {
    venue_id: venueId,
    max_guests: v.maxGuests ?? 0,
    min_guests: v.minGuests ?? 1,
    total_bedrooms: v.totalBedrooms ?? 0,
    total_bathrooms: v.totalBathrooms ?? 0,
    shared_bathrooms: v.sharedBathrooms ?? 0,
    private_ensuites: v.privateEnsuites ?? 0,
    accommodation_style: v.accommodationStyle ?? null,
    property_type: v.propertyType ?? null,
    accommodation_description: v.accommodationDescription ?? null,
    king_beds: v.bedConfigKing ?? 0,
    queen_beds: v.bedConfigQueen ?? 0,
    double_beds: v.bedConfigDouble ?? 0,
    single_beds: v.bedConfigSingle ?? 0,
    twin_beds: v.bedConfigTwin ?? 0,
    bunk_beds: v.bedConfigBunk ?? 0,
    sofa_beds: v.bedConfigSofa ?? 0,
    rollaway_beds: v.bedConfigRollaway ?? 0,
    checkin_time: v.checkInTime ?? '3:00 PM',
    checkout_time: v.checkOutTime ?? '10:00 AM',
    early_checkin: v.earlyCheckInAvailable ?? false,
    late_checkout: v.lateCheckOutAvailable ?? false,
    children_allowed: v.childrenAllowed ?? true,
    min_child_age: v.minimumChildAge ?? null,
    pets_allowed: v.petsAllowed ?? false,
    smoking_allowed: v.smokingAllowed ?? false,
  };
}

function buildWellnessAccomRow(venueId: string, v: Partial<Venue>) {
  return {
    venue_id: venueId,
    has_accommodation: v.hasAccommodation ?? false,
    accommodation_hero_image: v.accommodationHeroImage || null,
    treatment_rooms: v.totalTreatmentRooms ?? null,
    couples_suites: v.couplesRooms ?? null,
    max_concurrent_clients: v.capacity ?? null,
    whats_included: v.whatsIncluded?.length ? v.whatsIncluded : null,
    intro_paragraph_2: v.introParagraph2 ?? null,
    max_guests: v.maxGuests ?? null,
    min_guests: v.minGuests ?? null,
    total_bedrooms: v.totalBedrooms ?? null,
    total_bathrooms: v.totalBathrooms ?? null,
    shared_bathrooms: v.sharedBathrooms ?? null,
    private_ensuites: v.privateEnsuites ?? null,
    accommodation_style: v.accommodationStyle ?? null,
    king_beds: v.bedConfigKing ?? 0,
    queen_beds: v.bedConfigQueen ?? 0,
    double_beds: v.bedConfigDouble ?? 0,
    single_beds: v.bedConfigSingle ?? 0,
    twin_beds: v.bedConfigTwin ?? 0,
    bunk_beds: v.bedConfigBunk ?? 0,
    sofa_beds: v.bedConfigSofa ?? 0,
    rollaway_beds: v.bedConfigRollaway ?? 0,
    checkin_time: v.checkInTime ?? '3:00 PM',
    checkout_time: v.checkOutTime ?? '10:00 AM',
    early_checkin: v.earlyCheckInAvailable ?? false,
    late_checkout: v.lateCheckOutAvailable ?? false,
    children_allowed: v.childrenAllowed ?? true,
    min_child_age: v.minimumChildAge ?? null,
    pets_allowed: v.petsAllowed ?? false,
    smoking_allowed: v.smokingAllowed ?? false,
  };
}

/** Delete-and-reinsert all rooms for a venue (clean sync on every save) */
async function syncRooms(
  table: 'retreat_rooms' | 'wellness_rooms',
  venueId: string,
  rooms: IndividualRoom[],
) {
  const { error: delErr } = await supabase.from(table).delete().eq('venue_id', venueId);
  if (delErr) { console.error(`[VenueContext] syncRooms delete ${table}:`, delErr); return; }
  if (rooms.length === 0) return;
  const { error: insErr } = await supabase.from(table).insert(
    rooms.map((r, i) => ({
      venue_id: venueId,
      room_name: r.roomName || null,
      room_image: r.roomImage || null,
      room_description: r.websiteDescription || null,
      room_type: r.roomType || null,
      king_beds: r.bedConfiguration?.kingBeds ?? 0,
      queen_beds: r.bedConfiguration?.queenBeds ?? 0,
      single_beds: r.bedConfiguration?.singleBeds ?? 0,
      max_occupancy: r.maxOccupancy || null,
      bathroom_type: r.bathroom || null,
      room_amenities: r.roomAmenities || [],
      sort_order: i,
    })),
  );
  if (insErr) console.error(`[VenueContext] syncRooms insert ${table}:`, insErr);
}

// =============================================================================
// PROVIDER
// =============================================================================

export function VenueProvider({ children }: { children: ReactNode }) {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchVenues = async () => {
    try {
      setLoading(true);

      // Load main tables
      const [retreatRes, wellnessRes] = await Promise.all([
        supabase.from('retreat_venues').select('*').order('created_at', { ascending: false }),
        supabase.from('wellness_venues').select('*').order('created_at', { ascending: false }),
      ]);

      if (retreatRes.error) console.error('[VenueContext] retreat fetch error:', retreatRes.error);
      if (wellnessRes.error) console.error('[VenueContext] wellness fetch error:', wellnessRes.error);

      const retreats = (retreatRes.data || []).map(mapFromRetreat);
      const wellness = (wellnessRes.data || []).map(mapFromWellness);

      // Load accommodation satellite tables in parallel
      const retreatIds = retreats.map(v => v.id);
      const wellnessIds = wellness.map(v => v.id);

      const [raRes, rrRes, waRes, wrRes] = await Promise.all([
        retreatIds.length
          ? supabase.from('retreat_accommodation').select('*').in('venue_id', retreatIds)
          : Promise.resolve({ data: [] as any[], error: null }),
        retreatIds.length
          ? supabase.from('retreat_rooms').select('*').in('venue_id', retreatIds).order('sort_order')
          : Promise.resolve({ data: [] as any[], error: null }),
        wellnessIds.length
          ? supabase.from('wellness_accommodation').select('*').in('venue_id', wellnessIds)
          : Promise.resolve({ data: [] as any[], error: null }),
        wellnessIds.length
          ? supabase.from('wellness_rooms').select('*').in('venue_id', wellnessIds).order('sort_order')
          : Promise.resolve({ data: [] as any[], error: null }),
      ]);

      // Index by venue_id for O(1) lookup
      const raMap: Record<string, any> = {};
      (raRes.data || []).forEach((r: any) => { raMap[r.venue_id] = r; });

      const rrMap: Record<string, any[]> = {};
      (rrRes.data || []).forEach((r: any) => {
        if (!rrMap[r.venue_id]) rrMap[r.venue_id] = [];
        rrMap[r.venue_id].push(r);
      });

      const waMap: Record<string, any> = {};
      (waRes.data || []).forEach((r: any) => { waMap[r.venue_id] = r; });

      const wrMap: Record<string, any[]> = {};
      (wrRes.data || []).forEach((r: any) => {
        if (!wrMap[r.venue_id]) wrMap[r.venue_id] = [];
        wrMap[r.venue_id].push(r);
      });

      // Merge satellite data into venue objects
      const mergedRetreats = retreats.map(v => mergeRetreatAccom(v, raMap[v.id] || null, rrMap[v.id] || []));
      const mergedWellness = wellness.map(v => mergeWellnessAccom(v, waMap[v.id] || null, wrMap[v.id] || []));

      // Sort by created_at descending
      const all = [...mergedRetreats, ...mergedWellness].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      );

      setVenues(all);
    } catch (err) {
      console.error('[VenueContext] fetchVenues error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVenues();
  }, []);

  // ── Create venue ────────────────────────────────────────────────────────────
  const addVenue = async (venue: Omit<Venue, 'id' | 'date'>) => {
    try {
      if (venue.type === 'Retreat') {
        const { data, error } = await supabase
          .from('retreat_venues')
          .insert(buildRetreatDBRow(venue))
          .select()
          .single();
        if (error || !data) throw error ?? new Error('retreat_venues insert failed');

        // Create satellite accommodation row (ignore error — table may be empty on first load)
        await supabase.from('retreat_accommodation').insert(buildRetreatAccomRow(data.id, venue));

        setVenues(prev => [mapFromRetreat(data), ...prev]);
      } else {
        const { data, error } = await supabase
          .from('wellness_venues')
          .insert(buildWellnessDBRow(venue))
          .select()
          .single();
        if (error || !data) throw error ?? new Error('wellness_venues insert failed');

        // Create satellite accommodation row
        await supabase.from('wellness_accommodation').insert(buildWellnessAccomRow(data.id, venue));

        setVenues(prev => [mapFromWellness(data), ...prev]);
      }
    } catch (err: any) {
      console.error('[VenueContext] addVenue failed:', err);
      alert(`Failed to create venue: ${err?.message}`);
      throw err;
    }
  };

  // ── Update venue ────────────────────────────────────────────────────────────
  // Updates main table + upserts satellite accommodation table + syncs rooms.
  const updateVenue = async (id: string, updates: Partial<Venue>) => {
    try {
      const existing = venues.find(v => v.id === id);
      if (!existing) throw new Error(`Venue ${id} not found in local state`);

      const merged: Venue = { ...existing, ...updates };

      if (existing.type === 'Retreat') {
        const { error: mainErr } = await supabase
          .from('retreat_venues')
          .update(buildRetreatDBRow(merged))
          .eq('id', id);
        if (mainErr) throw mainErr;

        // Upsert retreat_accommodation (creates if missing, updates if exists)
        const { error: accomErr } = await supabase
          .from('retreat_accommodation')
          .upsert(buildRetreatAccomRow(id, merged), { onConflict: 'venue_id' });
        if (accomErr) console.error('[VenueContext] retreat_accommodation upsert:', accomErr);

        // Sync rooms only when the rooms array was explicitly changed
        if (updates.individualRooms !== undefined) {
          await syncRooms('retreat_rooms', id, merged.individualRooms || []);
        }
      } else {
        const { error: mainErr } = await supabase
          .from('wellness_venues')
          .update(buildWellnessDBRow(merged))
          .eq('id', id);
        if (mainErr) throw mainErr;

        // Upsert wellness_accommodation
        const { error: accomErr } = await supabase
          .from('wellness_accommodation')
          .upsert(buildWellnessAccomRow(id, merged), { onConflict: 'venue_id' });
        if (accomErr) console.error('[VenueContext] wellness_accommodation upsert:', accomErr);

        // Sync wellness rooms
        if (updates.individualRooms !== undefined) {
          await syncRooms('wellness_rooms', id, merged.individualRooms || []);
        }
      }

      setVenues(prev => prev.map(v => (v.id === id ? merged : v)));
    } catch (err: any) {
      console.error('[VenueContext] updateVenue failed:', err);
      alert(`Failed to update venue: ${err?.message}`);
      throw err;
    }
  };

  // ── Delete venue ────────────────────────────────────────────────────────────
  // CASCADE in DB removes all child table rows automatically.
  const deleteVenue = async (id: string) => {
    try {
      const venue = venues.find(v => v.id === id);
      if (!venue) throw new Error(`Venue ${id} not found`);

      const table = venue.type === 'Retreat' ? 'retreat_venues' : 'wellness_venues';
      const { error } = await supabase.from(table).delete().eq('id', id);
      if (error) throw error;

      setVenues(prev => prev.filter(v => v.id !== id));
    } catch (err) {
      console.error('[VenueContext] deleteVenue failed:', err);
      throw err;
    }
  };

  const getVenue = (id: string) => venues.find(v => v.id === id);

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
