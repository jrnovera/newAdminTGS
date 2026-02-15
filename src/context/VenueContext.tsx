import { createContext, useContext, useState, type ReactNode } from 'react';

export interface PricingTier {
  label: string;
  days: number;
  price: string;
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
  // New fields from requirements
  hasAccommodation: boolean;

  // Retreat-specific fields
  retreatType?: 'Separate Building' | 'Group Hosting';
  hasKitchen?: boolean;
  hasGarden?: boolean;
  hasMeditationHall?: boolean;

  // Wellness-specific fields
  wellnessType?: 'Bathhouse' | 'Treatment Centre' | 'Hotel' | 'Wellness Center';
  offersTherapeuticServices?: boolean;

  // Wellness-specific fields (existing)
  facilities: string[];
  pricingTiers: PricingTier[];
}

interface VenueContextType {
  venues: Venue[];
  addVenue: (venue: Omit<Venue, 'id' | 'date'>) => void;
  updateVenue: (id: string, venue: Partial<Venue>) => void;
  deleteVenue: (id: string) => void;
  getVenue: (id: string) => Venue | undefined;
}

const VenueContext = createContext<VenueContextType | null>(null);

const initialVenues: Venue[] = [
  {
    id: 'v1', name: 'Moraea Farm', location: 'Berry, NSW, Australia', shortLoc: 'Berry, NSW',
    type: 'Retreat', capacity: 12, status: 'Active', subscription: 'Featured', date: 'Feb 8, 2026',
    owner: 'Sarah Mitchell', email: 'sarah@moraeafarm.com', phone: '+61 412 345 678',
    description: 'A tranquil retreat set among rolling hills in the Southern Highlands. Moraea Farm offers a unique blend of luxury accommodation and nature-based wellness experiences.',
    website: 'https://moraeafarm.com', amenities: ['Pool', 'Yoga Studio', 'Organic Garden', 'Meditation Room'],
    hasAccommodation: true, retreatType: 'Group Hosting', hasKitchen: true, hasGarden: true, hasMeditationHall: true,
    facilities: [], pricingTiers: [],
  },
  {
    id: 'v2', name: 'Curraweena House', location: 'Kangaroo Valley, NSW, Australia', shortLoc: 'Kangaroo Valley, NSW',
    type: 'Retreat', capacity: 14, status: 'Active', subscription: 'Standard', date: 'Feb 6, 2026',
    owner: 'James Thornton', email: 'james@curraweena.com', phone: '+61 402 987 654',
    description: 'Heritage-listed property in the heart of Kangaroo Valley. Perfect for intimate retreats and wellness workshops with stunning valley views.',
    website: 'https://curraweenahouse.com', amenities: ['Spa', 'Bushwalking Trails', 'Fire Pit', 'Workshop Space'],
    hasAccommodation: true, retreatType: 'Separate Building', hasKitchen: true, hasGarden: false, hasMeditationHall: false,
    facilities: [], pricingTiers: [],
  },
  {
    id: 'v3', name: 'Soak Wellness', location: 'West End, QLD, Australia', shortLoc: 'West End, QLD',
    type: 'Wellness', capacity: 40, status: 'Active', subscription: 'Premium', date: 'Feb 4, 2026',
    owner: 'Mei Lin Chen', email: 'mei@soakwellness.com.au', phone: '+61 432 111 222',
    description: 'Urban wellness centre offering day spa experiences, thermal bathing circuits, and holistic health treatments in Brisbane\'s vibrant West End.',
    website: 'https://soakwellness.com.au', amenities: [],
    hasAccommodation: false, wellnessType: 'Bathhouse', offersTherapeuticServices: true,
    facilities: ['Thermal Pools', 'Sauna', 'Steam Room', 'Treatment Rooms', 'Cafe', 'Cold Plunge'],
    pricingTiers: [
      { label: 'Single Session', days: 1, price: '$89' },
      { label: '3-Day Pass', days: 3, price: '$229' },
      { label: '7-Day Pass', days: 7, price: '$449' },
    ],
  },
  {
    id: 'v4', name: 'Byron Bay Retreat House', location: 'Byron Bay, NSW, Australia', shortLoc: 'Byron Bay, NSW',
    type: 'Retreat', capacity: 20, status: 'Draft', subscription: 'Essentials', date: 'Feb 2, 2026',
    owner: 'Tom Walsh', email: 'tom@byronretreat.com.au', phone: '+61 498 765 432',
    description: 'A beachside retreat space just moments from Byron Bay\'s iconic beaches. Ideal for yoga retreats, surf and wellness programs.',
    website: 'https://byronbayretreathouse.com.au', amenities: ['Beach Access', 'Yoga Deck', 'Surf Gear', 'BBQ Area'],
    hasAccommodation: true, retreatType: 'Group Hosting', hasKitchen: true, hasGarden: true, hasMeditationHall: true,
    facilities: [], pricingTiers: [],
  },
  {
    id: 'v5', name: 'Hakone Onsen Ryokan', location: 'Hakone, Kanagawa, Japan', shortLoc: 'Hakone, Japan',
    type: 'Wellness', capacity: 24, status: 'Active', subscription: 'Featured', date: 'Jan 28, 2026',
    owner: 'Kenji Yamamoto', email: 'kenji@hakoneonsen.jp', phone: '+81 460 85 1234',
    description: 'Traditional Japanese ryokan with natural hot spring baths overlooking Mount Fuji. Offering authentic onsen experiences and kaiseki cuisine.',
    website: 'https://hakoneonsenryokan.jp', amenities: [],
    hasAccommodation: true, wellnessType: 'Hotel', offersTherapeuticServices: true,
    facilities: ['Onsen Baths', 'Kaiseki Dining', 'Tea Ceremony Room', 'Japanese Garden', 'Private Rotenburo'],
    pricingTiers: [
      { label: 'Single Session', days: 1, price: '$120' },
      { label: '3-Day Stay', days: 3, price: '$320' },
      { label: '5-Day Stay', days: 5, price: '$499' },
    ],
  },
  {
    id: 'v6', name: 'Ubud Healing Centre', location: 'Ubud, Bali, Indonesia', shortLoc: 'Ubud, Bali',
    type: 'Retreat', capacity: 18, status: 'Active', subscription: 'Standard', date: 'Jan 25, 2026',
    owner: 'Wayan Sudira', email: 'wayan@ubudhealing.com', phone: '+62 812 3456 7890',
    description: 'Nestled in the rice terraces of Ubud, this healing centre combines traditional Balinese healing practices with modern wellness programs.',
    website: 'https://ubudhealingcentre.com', amenities: ['Rice Terrace Views', 'Healing Temple', 'Yoga Shala', 'Organic Restaurant'],
    hasAccommodation: true, retreatType: 'Group Hosting', hasKitchen: true, hasGarden: true, hasMeditationHall: true,
    facilities: [], pricingTiers: [],
  },
  {
    id: 'v7', name: 'Sedona Spirit Lodge', location: 'Sedona, Arizona, USA', shortLoc: 'Sedona, AZ',
    type: 'Retreat', capacity: 16, status: 'Active', subscription: 'Premium', date: 'Jan 20, 2026',
    owner: 'Amanda Foster', email: 'amanda@sedonaspirit.com', phone: '+1 928 555 0123',
    description: 'Set among Sedona\'s famous red rock formations, this lodge offers transformative retreat experiences with a focus on spiritual growth and energy healing.',
    website: 'https://sedonaspiritlodge.com', amenities: ['Vortex Tours', 'Sweat Lodge', 'Sound Healing Room', 'Labyrinth'],
    hasAccommodation: true, retreatType: 'Separate Building', hasKitchen: true, hasGarden: false, hasMeditationHall: true,
    facilities: [], pricingTiers: [],
  },
  {
    id: 'v8', name: 'Lake Como Wellness Villa', location: 'Bellagio, Lombardy, Italy', shortLoc: 'Bellagio, Italy',
    type: 'Wellness', capacity: 30, status: 'Draft', subscription: 'Standard', date: 'Jan 15, 2026',
    owner: 'Roberto Bellini', email: 'roberto@lagocomovilla.it', phone: '+39 031 950 123',
    description: 'A stunning lakeside villa offering luxury wellness retreats with panoramic views of Lake Como. Combines Italian hospitality with world-class spa treatments.',
    website: 'https://lakecomowellnessvilla.it', amenities: [],
    hasAccommodation: true, wellnessType: 'Hotel', offersTherapeuticServices: true,
    facilities: ['Infinity Pool', 'Spa', 'Pilates Studio', 'Wine Cellar', 'Lake Access', 'Hydrotherapy Circuit'],
    pricingTiers: [
      { label: 'Single Session', days: 1, price: '$150' },
      { label: '3-Day Package', days: 3, price: '$399' },
      { label: '7-Day Package', days: 7, price: '$750' },
    ],
  },
];

export function VenueProvider({ children }: { children: ReactNode }) {
  const [venues, setVenues] = useState<Venue[]>(initialVenues);

  const addVenue = (venue: Omit<Venue, 'id' | 'date'>) => {
    const now = new Date();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const dateStr = `${months[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;
    const newVenue: Venue = {
      ...venue,
      id: `v${Date.now()}`,
      date: dateStr,
    };
    setVenues((prev) => [newVenue, ...prev]);
  };

  const updateVenue = (id: string, updates: Partial<Venue>) => {
    setVenues((prev) =>
      prev.map((v) => (v.id === id ? { ...v, ...updates } : v))
    );
  };

  const deleteVenue = (id: string) => {
    setVenues((prev) => prev.filter((v) => v.id !== id));
  };

  const getVenue = (id: string) => venues.find((v) => v.id === id);

  return (
    <VenueContext.Provider value={{ venues, addVenue, updateVenue, deleteVenue, getVenue }}>
      {children}
    </VenueContext.Provider>
  );
}

export function useVenues() {
  const ctx = useContext(VenueContext);
  if (!ctx) throw new Error('useVenues must be used within VenueProvider');
  return ctx;
}
