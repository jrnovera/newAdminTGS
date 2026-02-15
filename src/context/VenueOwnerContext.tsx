import { createContext, useContext, useState, type ReactNode } from 'react';

export interface VenueOwner {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  venues: number;
  status: 'Active' | 'Pending' | 'Inactive';
  joined: string;
  revenue: string;
  bio: string;
  company: string;
  website: string;
  venueNames: string[];
}

interface VenueOwnerContextType {
  owners: VenueOwner[];
  addOwner: (owner: Omit<VenueOwner, 'id' | 'joined'>) => void;
  updateOwner: (id: string, owner: Partial<VenueOwner>) => void;
  deleteOwner: (id: string) => void;
  getOwner: (id: string) => VenueOwner | undefined;
}

const VenueOwnerContext = createContext<VenueOwnerContextType | null>(null);

const initialOwners: VenueOwner[] = [
  {
    id: 'o1', name: 'Sarah Mitchell', email: 'sarah@moraeafarm.com', phone: '+61 412 345 678',
    location: 'Berry, NSW', venues: 2, status: 'Active', joined: 'Jan 15, 2026', revenue: '$4,280',
    bio: 'Passionate wellness advocate with over 10 years of experience in retreat hospitality. Sarah founded Moraea Farm to create a sanctuary for those seeking connection with nature.',
    company: 'Moraea Farm Retreats Pty Ltd', website: 'https://moraeafarm.com',
    venueNames: ['Moraea Farm', 'Moraea Cottage'],
  },
  {
    id: 'o2', name: 'James Thornton', email: 'james@curraweena.com', phone: '+61 402 987 654',
    location: 'Kangaroo Valley, NSW', venues: 1, status: 'Active', joined: 'Jan 10, 2026', revenue: '$2,100',
    bio: 'Heritage property enthusiast who restored Curraweena House to become one of the most sought-after retreat venues in the Southern Highlands.',
    company: 'Thornton Heritage Properties', website: 'https://curraweenahouse.com',
    venueNames: ['Curraweena House'],
  },
  {
    id: 'o3', name: 'Kenji Yamamoto', email: 'kenji@hakoneonsen.jp', phone: '+81 460 85 1234',
    location: 'Hakone, Japan', venues: 1, status: 'Active', joined: 'Dec 28, 2025', revenue: '$6,450',
    bio: 'Third-generation onsen operator bringing traditional Japanese bathing culture to an international audience through The Global Sanctum.',
    company: 'Yamamoto Onsen Group', website: 'https://hakoneonsenryokan.jp',
    venueNames: ['Hakone Onsen Ryokan'],
  },
  {
    id: 'o4', name: 'Mei Lin Chen', email: 'mei@soakwellness.com.au', phone: '+61 432 111 222',
    location: 'West End, QLD', venues: 3, status: 'Active', joined: 'Dec 15, 2025', revenue: '$8,920',
    bio: 'Award-winning wellness entrepreneur who has built Soak Wellness into Brisbane\'s premier urban spa destination with multiple locations.',
    company: 'Soak Wellness Group', website: 'https://soakwellness.com.au',
    venueNames: ['Soak Wellness', 'Soak Day Spa', 'Soak Thermal'],
  },
  {
    id: 'o5', name: 'Roberto Bellini', email: 'roberto@lagocomovilla.it', phone: '+39 031 950 123',
    location: 'Bellagio, Italy', venues: 1, status: 'Pending', joined: 'Feb 1, 2026', revenue: '$0',
    bio: 'Italian hotelier transitioning a historic Lake Como villa into a world-class wellness destination. Currently completing the onboarding process.',
    company: 'Villa Bellini Hospitality', website: 'https://lakecomowellnessvilla.it',
    venueNames: ['Lake Como Wellness Villa'],
  },
  {
    id: 'o6', name: 'Wayan Sudira', email: 'wayan@ubudhealing.com', phone: '+62 812 3456 7890',
    location: 'Ubud, Bali', venues: 2, status: 'Active', joined: 'Nov 20, 2025', revenue: '$5,340',
    bio: 'Balinese healer and entrepreneur combining traditional healing practices with modern wellness programming in the heart of Ubud.',
    company: 'Ubud Healing Ventures', website: 'https://ubudhealingcentre.com',
    venueNames: ['Ubud Healing Centre', 'Ubud Rice Terrace Retreat'],
  },
  {
    id: 'o7', name: 'Amanda Foster', email: 'amanda@sedonaspirit.com', phone: '+1 928 555 0123',
    location: 'Sedona, AZ', venues: 1, status: 'Active', joined: 'Oct 5, 2025', revenue: '$7,120',
    bio: 'Former corporate executive turned spiritual retreat leader. Amanda brings a unique blend of business acumen and spiritual depth to Sedona Spirit Lodge.',
    company: 'Sedona Spirit LLC', website: 'https://sedonaspiritlodge.com',
    venueNames: ['Sedona Spirit Lodge'],
  },
  {
    id: 'o8', name: 'Tom Walsh', email: 'tom@byronretreat.com.au', phone: '+61 498 765 432',
    location: 'Byron Bay, NSW', venues: 1, status: 'Inactive', joined: 'Sep 12, 2025', revenue: '$1,850',
    bio: 'Surf instructor and wellness advocate who created Byron Bay Retreat House as a space for surf and yoga retreats. Currently on sabbatical.',
    company: 'Walsh Retreats', website: 'https://byronbayretreathouse.com.au',
    venueNames: ['Byron Bay Retreat House'],
  },
];

export function VenueOwnerProvider({ children }: { children: ReactNode }) {
  const [owners, setOwners] = useState<VenueOwner[]>(initialOwners);

  const addOwner = (owner: Omit<VenueOwner, 'id' | 'joined'>) => {
    const now = new Date();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const dateStr = `${months[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;
    const newOwner: VenueOwner = {
      ...owner,
      id: `o${Date.now()}`,
      joined: dateStr,
    };
    setOwners((prev) => [newOwner, ...prev]);
  };

  const updateOwner = (id: string, updates: Partial<VenueOwner>) => {
    setOwners((prev) =>
      prev.map((o) => (o.id === id ? { ...o, ...updates } : o))
    );
  };

  const deleteOwner = (id: string) => {
    setOwners((prev) => prev.filter((o) => o.id !== id));
  };

  const getOwner = (id: string) => owners.find((o) => o.id === id);

  return (
    <VenueOwnerContext.Provider value={{ owners, addOwner, updateOwner, deleteOwner, getOwner }}>
      {children}
    </VenueOwnerContext.Provider>
  );
}

export function useVenueOwners() {
  const ctx = useContext(VenueOwnerContext);
  if (!ctx) throw new Error('useVenueOwners must be used within VenueOwnerProvider');
  return ctx;
}
