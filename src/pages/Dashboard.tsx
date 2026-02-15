import {
  TrendingUp,
  Upload,
  Plus,
  Home,
  CalendarDays,
  DollarSign,
  UserPlus,
} from 'lucide-react';

export default function Dashboard() {
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
            <a href="#" className="card-action">View All</a>
          </div>
          <div className="card-body">
            <ul className="activity-list">
              <li className="activity-item">
                <div className="activity-dot booking"></div>
                <div className="activity-content">
                  <div className="activity-text"><strong>Sarah Mitchell</strong> booked <strong>Moraea Farm</strong></div>
                  <div className="activity-time">12 minutes ago</div>
                </div>
              </li>
              <li className="activity-item">
                <div className="activity-dot venue"></div>
                <div className="activity-content">
                  <div className="activity-text">New venue added: <strong>Curraweena House</strong></div>
                  <div className="activity-time">2 hours ago</div>
                </div>
              </li>
              <li className="activity-item">
                <div className="activity-dot payment"></div>
                <div className="activity-content">
                  <div className="activity-text">Payment received: <strong>$490</strong> from Byron Wellness Retreat</div>
                  <div className="activity-time">3 hours ago</div>
                </div>
              </li>
              <li className="activity-item">
                <div className="activity-dot user"></div>
                <div className="activity-content">
                  <div className="activity-text"><strong>Tom Cronin</strong> registered as Retreat Host</div>
                  <div className="activity-time">5 hours ago</div>
                </div>
              </li>
              <li className="activity-item">
                <div className="activity-dot booking"></div>
                <div className="activity-content">
                  <div className="activity-text">Booking confirmed: <strong>Anna's Nutrition Retreat</strong></div>
                  <div className="activity-time">Yesterday</div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
