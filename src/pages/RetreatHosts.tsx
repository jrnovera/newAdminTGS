import { useState, useEffect } from 'react';
import { Upload, Search, Filter, MoreHorizontal, ChevronLeft, ChevronRight, UserPlus, TrendingUp } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface RetreatHost {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  location: string;
  venues: number;
  venueNames: string[];
  status: 'Active' | 'Pending' | 'Inactive';
  joined: string;
  company: string;
  // Host Public Profile fields
  hostDisplayName: string;
  hostImageUrl: string;
  hostQuote: string;
  hostBio: string;
  showHostProfile: boolean;
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return 'N/A';
  const d = new Date(dateStr);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

export default function RetreatHosts() {
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [hosts, setHosts] = useState<RetreatHost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHosts();
  }, []);

  const fetchHosts = async () => {
    try {
      setLoading(true);

      // Fetch owner/manager records for retreat venues only
      const { data: ownerRows, error: ownerError } = await supabase
        .from('venue_owner_manager')
        .select('*')
        .eq('venue_type', 'retreat')
        .order('created_at', { ascending: false });

      if (ownerError) {
        console.error('[RetreatHosts] fetch error:', ownerError);
        return;
      }

      if (!ownerRows || ownerRows.length === 0) {
        setHosts([]);
        return;
      }

      // Fetch retreat venue details
      const venueIds = ownerRows.map(r => r.venue_id);
      const { data: venues } = await supabase
        .from('retreat_venues')
        .select('id, venue_name, city, state, listing_status')
        .in('id', venueIds);

      const venueMap = new Map<string, { name: string; location: string; status: string }>();
      for (const v of (venues || [])) {
        venueMap.set(v.id, {
          name: v.venue_name,
          location: [v.city, v.state].filter(Boolean).join(', '),
          status: v.listing_status || 'Draft',
        });
      }

      // Group by email (same host can manage multiple retreat venues)
      const grouped = new Map<string, typeof ownerRows>();
      for (const row of ownerRows) {
        const key = (row.email || `${row.first_name}_${row.last_name}_${row.id}`).toLowerCase();
        if (!grouped.has(key)) grouped.set(key, []);
        grouped.get(key)!.push(row);
      }

      const result: RetreatHost[] = [];
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
          role: primary.role || 'Host',
          location: locations.join(' / ') || primary.mailing_address || 'N/A',
          venues: rows.length,
          venueNames,
          status,
          joined: formatDate(primary.created_at),
          company: primary.business_name || '',
          hostDisplayName: primary.host_display_name || '',
          hostImageUrl: primary.host_image_url || '',
          hostQuote: primary.host_quote || '',
          hostBio: primary.host_bio || '',
          showHostProfile: primary.show_host_profile ?? true,
        });
      }

      setHosts(result);
    } catch (err) {
      console.error('[RetreatHosts] fetchHosts error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter hosts based on tab and search
  const filteredHosts = hosts.filter((h) => {
    const matchesSearch =
      searchQuery === '' ||
      h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.venueNames.some(v => v.toLowerCase().includes(searchQuery.toLowerCase()));

    switch (activeTab) {
      case 1: return matchesSearch && h.status === 'Active';
      case 2: return matchesSearch && h.status === 'Pending';
      case 3: return matchesSearch && h.status === 'Inactive';
      default: return matchesSearch;
    }
  });

  // Dynamic tab counts
  const tabCounts = [
    hosts.length,
    hosts.filter((h) => h.status === 'Active').length,
    hosts.filter((h) => h.status === 'Pending').length,
    hosts.filter((h) => h.status === 'Inactive').length,
  ];

  const tabs = [
    { label: 'All Hosts' },
    { label: 'Active' },
    { label: 'Pending' },
    { label: 'Inactive' },
  ];

  const activeHosts = hosts.filter(h => h.status === 'Active').length;
  const totalVenues = hosts.reduce((sum, h) => sum + h.venues, 0);

  return (
    <>
      <header className="page-header">
        <div>
          <h1 className="page-title">Retreat Hosts</h1>
          <p className="page-subtitle">Manage retreat host profiles and activity</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-secondary"><Upload size={16} /> Export</button>
          <button className="btn btn-primary"><UserPlus size={16} /> Add Host</button>
        </div>
      </header>

      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <div className="stat-card">
          <div className="stat-label">Total Hosts</div>
          <div className="stat-value">{hosts.length}</div>
          <div className="stat-change positive"><TrendingUp size={14} /> Retreat hosts</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Active Hosts</div>
          <div className="stat-value success">{activeHosts}</div>
          <div className="stat-breakdown">Managing {totalVenues} retreat venues</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Pending Hosts</div>
          <div className="stat-value" style={{ color: '#D4A853' }}>{tabCounts[2]}</div>
          <div className="stat-breakdown">Awaiting activation</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Inactive Hosts</div>
          <div className="stat-value">{tabCounts[3]}</div>
          <div className="stat-breakdown">Currently inactive</div>
        </div>
      </div>

      <div className="tabs-container">
        {tabs.map((tab, i) => (
          <div key={i} className={`tab${activeTab === i ? ' active' : ''}`} onClick={() => setActiveTab(i)}>
            {tab.label} <span className="tab-count">{tabCounts[i]}</span>
          </div>
        ))}
      </div>

      <div className="toolbar">
        <div className="search-box">
          <Search size={18} color="#B8B8B8" />
          <input
            type="text"
            placeholder="Search hosts by name, email, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="toolbar-actions">
          <button className="filter-btn"><Filter size={16} /> Filters</button>
        </div>
      </div>

      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Host</th>
              <th>Display Name</th>
              <th>Location</th>
              <th>Venues</th>
              <th>Quote</th>
              <th>Profile</th>
              <th>Status</th>
              <th style={{ width: 50 }}></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={9} style={{ textAlign: 'center', padding: '48px 20px', color: '#B8B8B8' }}>
                  <div style={{ fontSize: 16 }}>Loading hosts...</div>
                </td>
              </tr>
            ) : filteredHosts.length === 0 ? (
              <tr>
                <td colSpan={9} style={{ textAlign: 'center', padding: '48px 20px', color: '#B8B8B8' }}>
                  <div style={{ fontSize: 16, marginBottom: 8 }}>No retreat hosts found</div>
                  <div style={{ fontSize: 13 }}>
                    {searchQuery ? 'Try adjusting your search or filters' : 'Retreat hosts will appear here once venues have owner/manager data'}
                  </div>
                </td>
              </tr>
            ) : (
              filteredHosts.map((h) => (
                <tr key={h.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      {h.hostImageUrl ? (
                        <img
                          src={h.hostImageUrl}
                          alt={h.hostDisplayName || h.name}
                          style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
                        />
                      ) : (
                        <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, #4A7C59, #3d6b4a)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 600, fontSize: 14, flexShrink: 0 }}>
                          {h.name.split(' ').map(n => n[0]).join('')}
                        </div>
                      )}
                      <div>
                        <div style={{ fontWeight: 500 }}>{h.name}</div>
                        <div style={{ fontSize: 12, color: '#B8B8B8' }}>{h.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ fontWeight: 500 }}>{h.hostDisplayName || '—'}</td>
                  <td>{h.location}</td>
                  <td>
                    <div style={{ fontWeight: 500 }}>{h.venues}</div>
                    {h.venueNames.length > 0 && (
                      <div style={{ fontSize: 11, color: '#B8B8B8' }}>{h.venueNames.join(', ')}</div>
                    )}
                  </td>
                  <td>
                    {h.hostQuote ? (
                      <div style={{ fontSize: 12, fontStyle: 'italic', color: '#999', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        "{h.hostQuote}"
                      </div>
                    ) : (
                      <span style={{ color: '#B8B8B8' }}>—</span>
                    )}
                  </td>
                  <td>
                    <span className={`status-badge ${h.showHostProfile ? 'active' : 'inactive'}`}>
                      {h.showHostProfile ? 'Visible' : 'Hidden'}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${h.status === 'Active' ? 'active' : h.status === 'Pending' ? 'pending' : 'inactive'}`}>
                      {h.status}
                    </span>
                  </td>
                  <td>
                    <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8, color: '#B8B8B8' }}>
                      <MoreHorizontal size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {filteredHosts.length > 0 && (
          <div className="pagination">
            <div className="pagination-info">Showing 1-{filteredHosts.length} of {filteredHosts.length} hosts</div>
            <div className="pagination-controls">
              <button className="page-btn"><ChevronLeft size={16} /></button>
              <button className="page-btn active">1</button>
              <button className="page-btn"><ChevronRight size={16} /></button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
