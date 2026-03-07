import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { supabase } from '../lib/supabase';

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
  loading: boolean;
  addOwner: (owner: Omit<VenueOwner, 'id' | 'joined'>) => void;
  updateOwner: (id: string, owner: Partial<VenueOwner>) => void;
  deleteOwner: (id: string) => void;
  getOwner: (id: string) => VenueOwner | undefined;
  refreshOwners: () => Promise<void>;
}

const VenueOwnerContext = createContext<VenueOwnerContextType | null>(null);

function formatDate(dateStr: string | null): string {
  if (!dateStr) return 'N/A';
  const d = new Date(dateStr);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

export function VenueOwnerProvider({ children }: { children: ReactNode }) {
  const [owners, setOwners] = useState<VenueOwner[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOwners = async () => {
    try {
      setLoading(true);

      // Fetch all owner/manager records
      const { data: ownerRows, error: ownerError } = await supabase
        .from('venue_owner_manager')
        .select('*')
        .order('created_at', { ascending: false });

      if (ownerError) {
        console.error('[VenueOwnerContext] fetch error:', ownerError);
        return;
      }

      if (!ownerRows || ownerRows.length === 0) {
        setOwners([]);
        return;
      }

      // Collect venue IDs grouped by type
      const retreatIds = ownerRows.filter(r => r.venue_type === 'retreat').map(r => r.venue_id);
      const wellnessIds = ownerRows.filter(r => r.venue_type === 'wellness').map(r => r.venue_id);

      // Fetch venue details for names and locations
      const [retreatRes, wellnessRes] = await Promise.all([
        retreatIds.length > 0
          ? supabase.from('retreat_venues').select('id, venue_name, city, state, listing_status').in('id', retreatIds)
          : Promise.resolve({ data: [], error: null }),
        wellnessIds.length > 0
          ? supabase.from('wellness_venues').select('id, venue_name, city, state, listing_status').in('id', wellnessIds)
          : Promise.resolve({ data: [], error: null }),
      ]);

      // Build venue lookup map
      const venueMap = new Map<string, { name: string; location: string; status: string }>();
      for (const v of (retreatRes.data || [])) {
        venueMap.set(v.id, {
          name: v.venue_name,
          location: [v.city, v.state].filter(Boolean).join(', '),
          status: v.listing_status || 'Draft',
        });
      }
      for (const v of (wellnessRes.data || [])) {
        venueMap.set(v.id, {
          name: v.venue_name,
          location: [v.city, v.state].filter(Boolean).join(', '),
          status: v.listing_status || 'Draft',
        });
      }

      // Group owner rows by email (same owner can manage multiple venues)
      const grouped = new Map<string, typeof ownerRows>();
      for (const row of ownerRows) {
        const key = (row.email || `${row.first_name}_${row.last_name}_${row.id}`).toLowerCase();
        if (!grouped.has(key)) grouped.set(key, []);
        grouped.get(key)!.push(row);
      }

      // Build VenueOwner objects
      const result: VenueOwner[] = [];
      for (const [, rows] of grouped) {
        const primary = rows[0];
        const name = [primary.first_name, primary.last_name].filter(Boolean).join(' ') || 'Unknown';
        const venueNames: string[] = [];
        const locations: string[] = [];
        const statuses: string[] = [];

        for (const row of rows) {
          const venue = venueMap.get(row.venue_id);
          if (venue) {
            venueNames.push(venue.name);
            if (venue.location && !locations.includes(venue.location)) locations.push(venue.location);
            statuses.push(venue.status);
          }
        }

        // Derive owner status from venue listing statuses
        let status: 'Active' | 'Pending' | 'Inactive' = 'Pending';
        if (statuses.some(s => s === 'Published' || s === 'Active')) {
          status = 'Active';
        } else if (statuses.every(s => s === 'Archived' || s === 'Inactive')) {
          status = 'Inactive';
        }

        result.push({
          id: primary.id,
          name,
          email: primary.email || '',
          phone: primary.phone_primary || '',
          location: locations.join(' / ') || primary.mailing_address || 'N/A',
          venues: rows.length,
          status,
          joined: formatDate(primary.created_at),
          revenue: '$0',
          bio: primary.host_bio || '',
          company: primary.business_name || '',
          website: '',
          venueNames,
        });
      }

      setOwners(result);
    } catch (err) {
      console.error('[VenueOwnerContext] fetchOwners error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOwners();
  }, []);

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
    <VenueOwnerContext.Provider value={{ owners, loading, addOwner, updateOwner, deleteOwner, getOwner, refreshOwners: fetchOwners }}>
      {children}
    </VenueOwnerContext.Provider>
  );
}

export function useVenueOwners() {
  const ctx = useContext(VenueOwnerContext);
  if (!ctx) throw new Error('useVenueOwners must be used within VenueOwnerProvider');
  return ctx;
}
