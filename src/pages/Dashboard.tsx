import { useState, useEffect } from 'react';
import {
  Upload,
  Plus,
  Home,
  CalendarDays,
  MessageSquare,
  UserPlus,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useVenues } from '../context/VenueContext';
import CreateRetreatModal from '../components/CreateRetreatModal';
import CreateWellnessModal from '../components/CreateWellnessModal';

interface ActivityItem {
  id: string;
  type: 'venue' | 'booking' | 'enquiry';
  text: string;
  detail: string;
  time: string;
  timestamp: number;
}

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diffMs = now - then;
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins} minute${mins > 1 ? 's' : ''} ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
  const d = new Date(dateStr);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { addVenue } = useVenues();
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loadingActivity, setLoadingActivity] = useState(true);

  // Real stats
  const [totalVenues, setTotalVenues] = useState(0);
  const [retreatCount, setRetreatCount] = useState(0);
  const [wellnessCount, setWellnessCount] = useState(0);
  const [bookingsThisMonth, setBookingsThisMonth] = useState(0);
  const [pendingBookings, setPendingBookings] = useState(0);
  const [confirmedBookings, setConfirmedBookings] = useState(0);
  const [cancelledBookings, setCancelledBookings] = useState(0);
  const [enquiryCount, setEnquiryCount] = useState(0);
  const [newUsersCount, setNewUsersCount] = useState(0);

  // Add venue modal
  const [showVenueTypeChoice, setShowVenueTypeChoice] = useState(false);
  const [showCreateRetreat, setShowCreateRetreat] = useState(false);
  const [showCreateWellness, setShowCreateWellness] = useState(false);

  useEffect(() => {
    fetchRecentActivity();
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

      const [retreatRes, wellnessRes, bookingsRes, enquiriesRes, usersRes] = await Promise.all([
        supabase.from('retreat_venues').select('id', { count: 'exact', head: true }),
        supabase.from('wellness_venues').select('id', { count: 'exact', head: true }),
        supabase.from('bookings').select('id, status, created_at').gte('created_at', startOfMonth),
        supabase.from('enquiries').select('id', { count: 'exact', head: true }),
        supabase.from('wellness_guests').select('id', { count: 'exact', head: true }).gte('created_at', startOfMonth),
      ]);

      const rCount = retreatRes.count || 0;
      const wCount = wellnessRes.count || 0;
      setRetreatCount(rCount);
      setWellnessCount(wCount);
      setTotalVenues(rCount + wCount);

      const bookings = bookingsRes.data || [];
      setBookingsThisMonth(bookings.length);
      setPendingBookings(bookings.filter(b => b.status === 'pending').length);
      setConfirmedBookings(bookings.filter(b => b.status === 'confirmed').length);
      setCancelledBookings(bookings.filter(b => b.status === 'cancelled').length);

      setEnquiryCount(enquiriesRes.count || 0);
      setNewUsersCount(usersRes.count || 0);
    } catch (err) {
      console.error('[Dashboard] fetchStats error:', err);
    }
  };

  const fetchRecentActivity = async () => {
    try {
      setLoadingActivity(true);

      const [retreatRes, wellnessRes, bookingsRes, enquiriesRes] = await Promise.all([
        supabase.from('retreat_venues').select('id, venue_name, created_at').order('created_at', { ascending: false }).limit(5),
        supabase.from('wellness_venues').select('id, venue_name, created_at').order('created_at', { ascending: false }).limit(5),
        supabase.from('bookings').select('id, guest_name, service_name, status, created_at').order('created_at', { ascending: false }).limit(5),
        supabase.from('enquiries').select('id, customer_name, venue_name, enquiry_type, created_at').order('created_at', { ascending: false }).limit(5),
      ]);

      const items: ActivityItem[] = [];

      for (const v of (retreatRes.data || [])) {
        items.push({
          id: `rv-${v.id}`,
          type: 'venue',
          text: `New retreat venue added: <strong>${v.venue_name}</strong>`,
          detail: 'Retreat Venue',
          time: timeAgo(v.created_at),
          timestamp: new Date(v.created_at).getTime(),
        });
      }

      for (const v of (wellnessRes.data || [])) {
        items.push({
          id: `wv-${v.id}`,
          type: 'venue',
          text: `New wellness venue added: <strong>${v.venue_name}</strong>`,
          detail: 'Wellness Venue',
          time: timeAgo(v.created_at),
          timestamp: new Date(v.created_at).getTime(),
        });
      }

      for (const b of (bookingsRes.data || [])) {
        const service = b.service_name ? ` for <strong>${b.service_name}</strong>` : '';
        items.push({
          id: `bk-${b.id}`,
          type: 'booking',
          text: `<strong>${b.guest_name || 'Guest'}</strong> made a booking${service}`,
          detail: `Status: ${b.status || 'pending'}`,
          time: timeAgo(b.created_at),
          timestamp: new Date(b.created_at).getTime(),
        });
      }

      for (const e of (enquiriesRes.data || [])) {
        items.push({
          id: `eq-${e.id}`,
          type: 'enquiry',
          text: `<strong>${e.customer_name}</strong> enquired about <strong>${e.venue_name}</strong>`,
          detail: e.enquiry_type || 'General Enquiry',
          time: timeAgo(e.created_at),
          timestamp: new Date(e.created_at).getTime(),
        });
      }

      items.sort((a, b) => b.timestamp - a.timestamp);
      setActivities(items.slice(0, 10));
    } catch (err) {
      console.error('[Dashboard] fetchRecentActivity error:', err);
    } finally {
      setLoadingActivity(false);
    }
  };

  const handleAddVenueClick = () => {
    setShowVenueTypeChoice(true);
  };

  const handleVenueTypeSelect = (type: 'retreat' | 'wellness') => {
    setShowVenueTypeChoice(false);
    if (type === 'retreat') {
      setShowCreateRetreat(true);
    } else {
      setShowCreateWellness(true);
    }
  };

  return (
    <>
      {/* Page Header */}
      <header className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Welcome back, Kate. Here's what's happening today.</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-secondary">
            <Upload size={16} />
            Export
          </button>
          <button className="btn btn-primary" onClick={handleAddVenueClick}>
            <Plus size={16} />
            Add Venue
          </button>
        </div>
      </header>

      {/* Stats Cards */}
      <section className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Venues</div>
          <div className="stat-value">{totalVenues}</div>
          <div className="stat-breakdown">{retreatCount} Retreat · {wellnessCount} Wellness</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Bookings This Month</div>
          <div className="stat-value">{bookingsThisMonth}</div>
          <div className="stat-breakdown">{confirmedBookings} Confirmed · {pendingBookings} Pending · {cancelledBookings} Cancelled</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Enquiries</div>
          <div className="stat-value">{enquiryCount}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">New Guests This Month</div>
          <div className="stat-value">{newUsersCount}</div>
        </div>
      </section>

      {/* Alerts Section */}
      <section className="alerts-section">
        <div className="section-header">
          <h2 className="section-title">Requires Attention</h2>
          <a href="#" className="card-action">View All</a>
        </div>
        <div className="alerts-grid">
          <div className="alert-card warning" style={{ cursor: 'pointer' }} onClick={() => navigate('/enquiries')}>
            <div className="alert-count">{enquiryCount}</div>
            <div className="alert-text">
              <div className="alert-title">Enquiries</div>
              <div className="alert-subtitle">View all enquiries</div>
            </div>
          </div>
          <div className="alert-card warning" style={{ cursor: 'pointer' }} onClick={() => navigate('/bookings')}>
            <div className="alert-count">{pendingBookings}</div>
            <div className="alert-text">
              <div className="alert-title">Pending Bookings</div>
              <div className="alert-subtitle">Awaiting confirmation</div>
            </div>
          </div>
          <div className="alert-card error">
            <div className="alert-count">0</div>
            <div className="alert-text">
              <div className="alert-title">Failed Payment</div>
              <div className="alert-subtitle">Subscription renewal failed</div>
            </div>
          </div>
          <div className="alert-card info">
            <div className="alert-count">0</div>
            <div className="alert-text">
              <div className="alert-title">Incomplete Profiles</div>
              <div className="alert-subtitle">Venues missing key info</div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Grid */}
      <section className="content-grid">
        {/* Quick Actions */}
        <div className="content-card">
          <div className="card-header">
            <h3 className="card-title">Quick Actions</h3>
          </div>
          <div className="card-body">
            <div className="quick-actions">
              <div className="quick-action" style={{ cursor: 'pointer' }} onClick={handleAddVenueClick}>
                <div className="quick-action-icon">
                  <Home size={22} />
                </div>
                <div>
                  <div className="quick-action-title">Add New Venue</div>
                  <div className="quick-action-subtitle">Create a new listing</div>
                </div>
              </div>
              <div className="quick-action" style={{ cursor: 'pointer' }} onClick={() => navigate('/bookings')}>
                <div className="quick-action-icon">
                  <CalendarDays size={22} />
                </div>
                <div>
                  <div className="quick-action-title">View Pending Bookings</div>
                  <div className="quick-action-subtitle">{pendingBookings} awaiting review</div>
                </div>
              </div>
              <div className="quick-action" style={{ cursor: 'pointer' }} onClick={() => navigate('/enquiries')}>
                <div className="quick-action-icon">
                  <MessageSquare size={22} />
                </div>
                <div>
                  <div className="quick-action-title">Enquiries</div>
                  <div className="quick-action-subtitle">{enquiryCount} total enquiries</div>
                </div>
              </div>
              <div className="quick-action" style={{ cursor: 'pointer' }} onClick={() => navigate('/wellness-guests')}>
                <div className="quick-action-icon">
                  <UserPlus size={22} />
                </div>
                <div>
                  <div className="quick-action-title">View New Users</div>
                  <div className="quick-action-subtitle">{newUsersCount} registered this month</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="content-card">
          <div className="card-header">
            <h3 className="card-title">Recent Activity</h3>
          </div>
          <div className="card-body">
            {loadingActivity ? (
              <div style={{ textAlign: 'center', padding: '24px 0', color: '#B8B8B8', fontSize: 14 }}>
                Loading recent activity...
              </div>
            ) : activities.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '24px 0', color: '#B8B8B8', fontSize: 14 }}>
                No recent activity found
              </div>
            ) : (
              <ul className="activity-list">
                {activities.map((a) => (
                  <li key={a.id} className="activity-item">
                    <div className={`activity-dot ${a.type === 'venue' ? 'venue' : a.type === 'booking' ? 'booking' : 'user'}`}></div>
                    <div className="activity-content">
                      <div className="activity-text" dangerouslySetInnerHTML={{ __html: a.text }} />
                      <div className="activity-time">{a.time}</div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>

      {/* Venue Type Chooser Modal */}
      {showVenueTypeChoice && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#1E1E1E', borderRadius: 12, padding: 32, width: '100%', maxWidth: 400, border: '1px solid #333', textAlign: 'center' }}>
            <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Add New Venue</h2>
            <p style={{ fontSize: 14, color: '#B8B8B8', marginBottom: 24 }}>Choose venue type</p>
            <div style={{ display: 'flex', gap: 12 }}>
              <button
                className="btn btn-primary"
                style={{ flex: 1, padding: '14px 16px' }}
                onClick={() => handleVenueTypeSelect('retreat')}
              >
                Retreat Venue
              </button>
              <button
                className="btn btn-primary"
                style={{ flex: 1, padding: '14px 16px' }}
                onClick={() => handleVenueTypeSelect('wellness')}
              >
                Wellness Venue
              </button>
            </div>
            <button
              className="btn btn-secondary"
              style={{ marginTop: 12, width: '100%' }}
              onClick={() => setShowVenueTypeChoice(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Create Modals */}
      <CreateRetreatModal
        isOpen={showCreateRetreat}
        onClose={() => { setShowCreateRetreat(false); fetchStats(); }}
        onSubmit={async (data) => {
          await addVenue(data);
          setShowCreateRetreat(false);
          fetchStats();
        }}
      />
      <CreateWellnessModal
        isOpen={showCreateWellness}
        onClose={() => { setShowCreateWellness(false); fetchStats(); }}
        onSubmit={async (data) => {
          await addVenue(data);
          setShowCreateWellness(false);
          fetchStats();
        }}
      />
    </>
  );
}
