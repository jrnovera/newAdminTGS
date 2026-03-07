import { useState, useEffect } from 'react';
import {
  TrendingUp,
  Upload,
  Plus,
  Home,
  CalendarDays,
  DollarSign,
  UserPlus,
} from 'lucide-react';
import { supabase } from '../lib/supabase';

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
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loadingActivity, setLoadingActivity] = useState(true);

  useEffect(() => {
    fetchRecentActivity();
  }, []);

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

      // Sort all by timestamp descending, take top 10
      items.sort((a, b) => b.timestamp - a.timestamp);
      setActivities(items.slice(0, 10));
    } catch (err) {
      console.error('[Dashboard] fetchRecentActivity error:', err);
    } finally {
      setLoadingActivity(false);
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
          <button className="btn btn-primary">
            <Plus size={16} />
            Add Venue
          </button>
        </div>
      </header>

      {/* Stats Cards */}
      <section className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Venues</div>
          <div className="stat-value">47</div>
          <div className="stat-change positive">
            <TrendingUp size={14} />
            +12 this month
          </div>
          <div className="stat-breakdown">32 Active · 10 Draft · 5 Inactive</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Bookings This Month</div>
          <div className="stat-value">23</div>
          <div className="stat-change positive">
            <TrendingUp size={14} />
            +18% vs last month
          </div>
          <div className="stat-breakdown">19 Confirmed · 3 Pending · 1 Cancelled</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Revenue MTD</div>
          <div className="stat-value">$14,280</div>
          <div className="stat-change positive">
            <TrendingUp size={14} />
            +24% vs last month
          </div>
          <div className="stat-breakdown">$8,420 Subscriptions · $5,860 Commissions</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Contacts</div>
          <div className="stat-value">312</div>
          <div className="stat-change positive">
            <TrendingUp size={14} />
            +8 new this week
          </div>
          <div className="stat-breakdown">189 Guests · 76 Hosts · 47 Owners</div>
        </div>
      </section>

      {/* Alerts Section */}
      <section className="alerts-section">
        <div className="section-header">
          <h2 className="section-title">Requires Attention</h2>
          <a href="#" className="card-action">View All</a>
        </div>
        <div className="alerts-grid">
          <div className="alert-card warning">
            <div className="alert-count">5</div>
            <div className="alert-text">
              <div className="alert-title">New Enquiries</div>
              <div className="alert-subtitle">Awaiting response</div>
            </div>
          </div>
          <div className="alert-card warning">
            <div className="alert-count">3</div>
            <div className="alert-text">
              <div className="alert-title">Pending Bookings</div>
              <div className="alert-subtitle">Awaiting confirmation</div>
            </div>
          </div>
          <div className="alert-card error">
            <div className="alert-count">1</div>
            <div className="alert-text">
              <div className="alert-title">Failed Payment</div>
              <div className="alert-subtitle">Subscription renewal failed</div>
            </div>
          </div>
          <div className="alert-card info">
            <div className="alert-count">5</div>
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
              <div className="quick-action">
                <div className="quick-action-icon">
                  <Home size={22} />
                </div>
                <div>
                  <div className="quick-action-title">Add New Venue</div>
                  <div className="quick-action-subtitle">Create a new listing</div>
                </div>
              </div>
              <div className="quick-action">
                <div className="quick-action-icon">
                  <CalendarDays size={22} />
                </div>
                <div>
                  <div className="quick-action-title">View Pending Bookings</div>
                  <div className="quick-action-subtitle">3 awaiting review</div>
                </div>
              </div>
              <div className="quick-action">
                <div className="quick-action-icon">
                  <DollarSign size={22} />
                </div>
                <div>
                  <div className="quick-action-title">Process Payouts</div>
                  <div className="quick-action-subtitle">$2,340 ready to send</div>
                </div>
              </div>
              <div className="quick-action">
                <div className="quick-action-icon">
                  <UserPlus size={22} />
                </div>
                <div>
                  <div className="quick-action-title">View New Users</div>
                  <div className="quick-action-subtitle">8 registered this week</div>
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
    </>
  );
}
