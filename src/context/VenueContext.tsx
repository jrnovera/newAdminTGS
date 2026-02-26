import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { supabase } from '../lib/supabase';

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

  // New comprehensive wellness fields
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

  // Detailed policies and practical info
  houseRules?: string;
  healthSafety?: string;
  ageRequirements?: string;
  cancellationPolicy?: string;
  bookingPolicy?: string;
  directions?: string;
  modalities?: string[];
  locationSetting?: string;

  // New Retreat-Specific Fields (Consistently CamelCased)
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

const defaultBedConfig = {
  kingBeds: 0, queenBeds: 0, doubleBeds: 0, singleBeds: 0,
  twinBeds: 0, bunkBeds: 0, sofaBeds: 0, rollawayBeds: 0,
};

export function VenueProvider({ children }: { children: ReactNode }) {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);

  const mapFromDB = (v: any): Venue => ({
    id: v.id,
    name: v.name,
    location: v.location,
    shortLoc: v.short_loc,
    type: (v.venue_category === 'Retreat' || v.retreat_type) ? 'Retreat' : 'Wellness',
    capacity: v.capacity,
    status: v.status,
    subscription: v.subscription,
    date: v.date_added,
    owner: v.owner_name,
    email: v.owner_email,
    phone: v.owner_phone,
    description: v.description,
    website: v.website_url,
    amenities: v.facilities_list || [], // fallback
    services: v.services,
    openingTime: v.opening_time,
    closingTime: v.closing_time,
    packages: v.packages,
    venueTypeCategory: v.venue_category,
    established: v.established_date,
    bestFor: v.best_for,
    availabilityTime: v.availability_notes,
    wheelchairAccessible: v.is_wheelchair_accessible,
    languages: v.languages_spoken,
    policies: v.access_policies,
    isAvailable: v.is_available,
    heroImage: v.hero_image_url,
    galleryPhotos: v.gallery_photo_urls,
    quote: v.brand_quote,
    introParagraph1: v.intro_para_1,
    introParagraph2: v.intro_para_2,
    ownerAddress: v.owner_address,
    showAccommodationSection: v.show_accommodation_section,
    showOnWebsite: v.show_on_website,
    whatsIncluded: v.whats_included,
    accommodationAmenities: v.accommodation_amenities,
    addOns: v.add_ons,
    individualRooms: v.individual_rooms,
    hasAccommodation: v.has_accommodation,
    retreatType: v.retreat_type,
    hasKitchen: v.has_kitchen,
    hasGarden: v.has_garden,
    hasMeditationHall: v.has_meditation_hall,
    wellnessType: v.wellness_type,
    offersTherapeuticServices: v.offers_therapeutic_services,
    facilities: v.facilities_list || [],
    pricingTiers: v.pricing_tiers || [],
    practitioners: v.practitioners || [],

    // Mapping new fields
    houseRules: v.house_rules,
    healthSafety: v.health_safety,
    ageRequirements: v.age_requirements,
    cancellationPolicy: v.cancellation_policy,
    bookingPolicy: v.booking_policy,
    directions: v.directions,
    modalities: v.modalities || [],
    locationSetting: v.location_setting,
  });

  const mapToDB = (v: any) => ({
    name: v.name,
    location: v.location,
    short_loc: v.shortLoc,
    capacity: v.capacity,
    status: v.status,
    subscription: v.subscription,
    owner_name: v.owner,
    owner_email: v.email,
    owner_phone: v.phone,
    description: v.description,
    website_url: v.website,
    services: v.services,
    opening_time: v.openingTime,
    closing_time: v.closingTime,
    packages: v.packages,
    venue_category: v.type === 'Retreat' ? 'Retreat' : v.venueTypeCategory,
    established_date: v.established,
    best_for: v.bestFor,
    availability_notes: v.availabilityTime,
    is_wheelchair_accessible: v.wheelchairAccessible,
    languages_spoken: v.languages,
    access_policies: v.policies,
    is_available: v.isAvailable,
    hero_image_url: v.heroImage,
    gallery_photo_urls: v.galleryPhotos,
    brand_quote: v.quote,
    intro_para_1: v.introParagraph1,
    intro_para_2: v.introParagraph2,
    owner_address: v.ownerAddress,
    show_accommodation_section: v.showAccommodationSection,
    show_on_website: v.showOnWebsite,
    whats_included: v.whatsIncluded,
    accommodation_amenities: v.accommodationAmenities,
    add_ons: v.addOns,
    individual_rooms: v.individualRooms,
    has_accommodation: v.hasAccommodation,
    retreat_type: v.retreatType,
    has_kitchen: v.hasKitchen,
    has_garden: v.hasGarden,
    has_meditation_hall: v.hasMeditationHall,
    wellness_type: v.wellnessType,
    offers_therapeutic_services: v.offersTherapeuticServices,
    facilities_list: v.facilities,
    pricing_tiers: v.pricingTiers,
    practitioners: v.practitioners,

    // Mapping new fields
    house_rules: v.houseRules,
    health_safety: v.healthSafety,
    age_requirements: v.ageRequirements,
    cancellation_policy: v.cancellationPolicy,
    booking_policy: v.bookingPolicy,
    directions: v.directions,
    modalities: v.modalities || [],
    location_setting: v.locationSetting,
  });

  // Specialized mapping for the new retreat_venues table
  const mapRetreatFromDB = (v: any): Venue => ({
    id: v.id,
    name: v.name,
    location: v.location,
    shortLoc: v.short_loc,
    type: 'Retreat',
    capacity: v.max_guests,
    status: v.status,
    subscription: v.subscription,
    date: v.created_at,
    owner: v.owner_name,
    email: v.owner_email,
    phone: v.owner_phone,
    description: v.description,
    website: v.website_url,
    heroImage: v.hero_image_url,
    quote: v.brand_quote,
    galleryPhotos: v.gallery_photo_urls || [],
    amenities: v.modalities || [],
    facilities: v.retreat_venue_type || [],

    // Retreat Specific Fields
    shortDescription: v.short_description,
    retreatVenueType: v.retreat_venue_type || [],
    hireType: v.hire_type,
    experienceFeatureImage: v.experience_feature_image,
    introText: v.intro_text,
    retreatStyles: v.retreat_styles || [],
    idealRetreatTypes: v.ideal_retreat_types || [],
    experienceTitle: v.experience_title,
    experienceSubtitle: v.experience_subtitle,
    experienceDescription: v.experience_description,
    propertySizeValue: v.property_size_value,
    propertySizeUnit: v.property_size_unit,
    architectureStyle: v.architecture_style,
    established: v.established_date,
    streetAddress: v.street_address,
    suburb: v.suburb,
    postcode: v.postcode,
    stateProvince: v.state_province,
    country: v.country,
    climate: v.climate,
    locationType: v.location_type || [],
    gpsCoordinates: v.gps_coordinates,
    nearestAirport: v.nearest_airport,
    transportAccess: v.transport_access || [],
    maxGuests: v.max_guests,
    minGuests: v.min_guests,
    totalBedrooms: v.total_bedrooms,
    totalBathrooms: v.total_bathrooms,
    sharedBathrooms: v.shared_bathrooms,
    privateEnsuites: v.private_ensuites,
    accommodationStyle: v.accommodation_style,
    propertyType: v.property_type,
    accommodationDescription: v.accommodation_description,
    bedConfigKing: v.bed_config_king,
    bedConfigQueen: v.bed_config_queen,
    bedConfigDouble: v.bed_config_double,
    bedConfigSingle: v.bed_config_single,
    bedConfigTwin: v.bed_config_twin,
    bedConfigBunk: v.bed_config_bunk,
    bedConfigSofa: v.bed_config_sofa,
    bedConfigRollaway: v.bed_config_rollaway,
    checkInTime: v.check_in_time,
    checkOutTime: v.check_out_time,
    earlyCheckInAvailable: v.early_check_in_available,
    lateCheckOutAvailable: v.late_check_out_available,
    childrenAllowed: v.children_allowed,
    minimumChildAge: v.minimum_child_age,
    petsAllowed: v.pets_allowed,
    smokingAllowed: v.smoking_allowed,
    propertyStatus: v.property_status,
    sanctumVetted: v.sanctum_vetted,
    featuredListing: v.featured_listing,
    instantBooking: v.instant_booking,
    internalNotes: v.internal_notes,
    venuePolicies: v.house_rules || '',

    // Interface placeholders
    hasAccommodation: true, // Retreats typically have accommodation
    bestFor: v.best_for || [],
    availabilityTime: v.availability_notes,
    wheelchairAccessible: v.is_wheelchair_accessible,
    languages: v.languages_spoken || [],
    isAvailable: v.is_available,
    ownerAddress: v.owner_address,
    showAccommodationSection: true,
    showOnWebsite: true,
    whatsIncluded: v.whats_included || [],
    accommodationAmenities: v.accommodation_amenities || [],
    addOns: v.add_ons || [],
    individualRooms: v.individual_rooms || [],
    pricingTiers: v.pricing_tiers || [],
    practitioners: v.practitioners || [],
    services: v.services || [],
    packages: v.packages || [],
    bedConfiguration: { ...defaultBedConfig },
  });

  const mapRetreatToDB = (v: any) => ({
    name: v.name,
    location: v.location,
    short_loc: v.shortLoc,
    status: v.status,
    subscription: v.subscription,
    owner_name: v.owner,
    owner_email: v.email,
    owner_phone: v.phone,
    website_url: v.website,
    hero_image_url: v.heroImage,
    brand_quote: v.quote,
    gallery_photo_urls: v.galleryPhotos,
    description: v.description,
    short_description: v.shortDescription,
    retreat_venue_type: v.retreatVenueType,
    hire_type: v.hireType,
    experience_feature_image: v.experienceFeatureImage || '',
    intro_text: v.introText || '',
    retreat_styles: v.retreatStyles || [],
    ideal_retreat_types: v.idealRetreatTypes || [],
    experience_title: v.experienceTitle || '',
    experience_subtitle: v.experienceSubtitle || '',
    experience_description: v.experienceDescription || '',
    property_size_value: v.propertySizeValue || 0,
    property_size_unit: v.propertySizeUnit || 'Acres',
    architecture_style: v.architectureStyle || '',
    established_date: v.established || '',
    street_address: v.streetAddress || '',
    suburb: v.suburb || '',
    postcode: v.postcode || '',
    state_province: v.stateProvince || '',
    country: v.country || '',
    climate: v.climate || '',
    location_type: v.locationType || [],
    gps_coordinates: v.gpsCoordinates || '',
    nearest_airport: v.nearestAirport || '',
    transport_access: v.transportAccess || [],
    max_guests: v.maxGuests || 0,
    min_guests: v.minGuests || 1,
    total_bedrooms: v.totalBedrooms || 0,
    total_bathrooms: v.totalBathrooms || 0,
    shared_bathrooms: v.sharedBathrooms || 0,
    private_ensuites: v.privateEnsuites || 0,
    accommodation_style: v.accommodationStyle || '',
    property_type: v.propertyType || '',
    accommodation_description: v.accommodationDescription || '',
    bed_config_king: v.bedConfigKing || 0,
    bed_config_queen: v.bedConfigQueen || 0,
    bed_config_double: v.bedConfigDouble || 0,
    bed_config_single: v.bedConfigSingle || 0,
    bed_config_twin: v.bedConfigTwin || 0,
    bed_config_bunk: v.bed_config_bunk, // Wait, fixing underscore here too
    bed_config_sofa: v.bed_config_sofa,
    bed_config_rollaway: v.bed_config_rollaway,
    check_in_time: v.checkInTime || '',
    check_out_time: v.checkOutTime || '',
    early_check_in_available: v.earlyCheckInAvailable || false,
    late_check_out_available: v.lateCheckInAvailable || false,
    children_allowed: v.childrenAllowed || true,
    minimum_child_age: v.minimumChildAge || 0,
    pets_allowed: v.petsAllowed || false,
    smoking_allowed: v.smokingAllowed || false,
    property_status: v.propertyStatus || 'Operational',
    sanctum_vetted: v.sanctumVetted || false,
    featured_listing: v.featuredListing || false,
    instant_booking: v.instantBooking || false,
    internal_notes: v.internalNotes || '',
    house_rules: v.houseRules || '',
    health_safety: v.healthSafety || '',
    cancellation_policy: v.cancellationPolicy || '',
    booking_policy: v.bookingPolicy || '',
  });

  const fetchVenues = async () => {
    try {
      setLoading(true);
      // Fetch from both tables in parallel
      const [wellnessRes, retreatRes] = await Promise.all([
        supabase.from('wellness_venues').select('*').order('created_at', { ascending: false }),
        supabase.from('retreat_venues').select('*').order('created_at', { ascending: false })
      ]);

      if (wellnessRes.error) throw wellnessRes.error;
      if (retreatRes.error) throw retreatRes.error;

      const combinedVenues = [
        ...(wellnessRes.data || []).map(mapFromDB),
        ...(retreatRes.data || []).map(mapRetreatFromDB)
      ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      setVenues(combinedVenues);
    } catch (err) {
      console.error('Error fetching venues:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVenues();
  }, []);

  const addVenue = async (venue: Omit<Venue, 'id' | 'date'>) => {
    try {
      const isRetreat = venue.type === 'Retreat';
      const tableName = isRetreat ? 'retreat_venues' : 'wellness_venues';
      const dbData = isRetreat ? mapRetreatToDB(venue) : mapToDB(venue);

      // Remove any undefined values to avoid Supabase errors, replace with null for DB
      Object.keys(dbData).forEach(key => {
        if ((dbData as any)[key] === undefined) {
          (dbData as any)[key] = null;
        }
      });

      console.log(`Inserting venue into ${tableName}:`, dbData);

      const { data, error } = await supabase
        .from(tableName)
        .insert([dbData])
        .select();

      if (error) {
        console.error('Supabase Insert Error:', error);
        throw error;
      }

      if (data) {
        console.log('Successfully inserted:', data[0]);
        const mapped = isRetreat ? mapRetreatFromDB(data[0]) : mapFromDB(data[0]);
        setVenues((prev) => [mapped, ...prev]);
      }
    } catch (err: any) {
      console.error('Full Error Object:', err);
      // Re-throw with more context
      const message = err.message || 'Check browser console for details';
      alert(`Database Insert Failed: ${message}`);
      throw err;
    }
  };

  const updateVenue = async (id: string, updates: Partial<Venue>) => {
    try {
      // Find the venue to determine its type/table
      const existing = venues.find(v => v.id === id);
      if (!existing) throw new Error('Venue not found');

      const isRetreat = existing.type === 'Retreat';
      const tableName = isRetreat ? 'retreat_venues' : 'wellness_venues';
      const dbUpdates = isRetreat ? mapRetreatToDB(updates) : mapToDB(updates);

      // Sanitization
      Object.keys(dbUpdates).forEach(key => {
        if ((dbUpdates as any)[key] === undefined) {
          delete (dbUpdates as any)[key]; // Don't send undefined keys for updates
        }
      });

      console.log(`Updating venue in ${tableName}:`, id, dbUpdates);

      const { data, error } = await supabase
        .from(tableName)
        .update(dbUpdates)
        .eq('id', id)
        .select();

      if (error) {
        console.error('Supabase Update Error:', error);
        throw error;
      }

      if (data) {
        const mapped = isRetreat ? mapRetreatFromDB(data[0]) : mapFromDB(data[0]);
        setVenues((prev) =>
          prev.map((v) => (v.id === id ? mapped : v))
        );
      }
    } catch (err: any) {
      console.error('Update operation failed:', err);
      alert(`Database Update Failed: ${err.message}`);
      throw err;
    }
  };

  const deleteVenue = async (id: string) => {
    try {
      const existing = venues.find(v => v.id === id);
      if (!existing) throw new Error('Venue not found');

      const tableName = existing.type === 'Retreat' ? 'retreat_venues' : 'wellness_venues';

      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', id);

      if (error) throw error;
      setVenues((prev) => prev.filter((v) => v.id !== id));
    } catch (err) {
      console.error('Error deleting venue:', err);
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
      refreshVenues: fetchVenues
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
