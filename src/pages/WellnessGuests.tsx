import { useState } from 'react';
import { Upload, Search, Filter, MoreHorizontal, ChevronLeft, ChevronRight, TrendingUp } from 'lucide-react';

const guests = [
  { name: 'Emily Watson', email: 'emily.w@gmail.com', bookings: 3, lastBooking: 'Moraea Farm', spent: '$2,840', status: 'Active', joined: 'Oct 15, 2025' },
  { name: 'David Nguyen', email: 'david.n@outlook.com', bookings: 5, lastBooking: 'Hakone Onsen Ryokan', spent: '$6,200', status: 'Active', joined: 'Aug 22, 2025' },
  { name: 'Rachel Green', email: 'rachel.g@yahoo.com', bookings: 1, lastBooking: 'Soak Wellness', spent: '$490', status: 'Active', joined: 'Jan 5, 2026' },
  { name: 'Marco Rossi', email: 'marco.r@gmail.com', bookings: 2, lastBooking: 'Lake Como Wellness Villa', spent: '$3,100', status: 'Active', joined: 'Nov 8, 2025' },
  { name: 'Hannah Schmidt', email: 'hannah.s@web.de', bookings: 4, lastBooking: 'Ubud Healing Centre', spent: '$4,560', status: 'Active', joined: 'Sep 30, 2025' },
  { name: 'Alex Turner', email: 'alex.t@proton.me', bookings: 1, lastBooking: 'Sedona Spirit Lodge', spent: '$1,200', status: 'New', joined: 'Feb 10, 2026' },
  { name: 'Priya Sharma', email: 'priya.s@gmail.com', bookings: 6, lastBooking: 'Byron Bay Retreat House', spent: '$7,800', status: 'Active', joined: 'Jul 14, 2025' },
  { name: 'Jack O\'Brien', email: 'jack.o@icloud.com', bookings: 2, lastBooking: 'Curraweena House', spent: '$1,950', status: 'Inactive', joined: 'Jun 2, 2025' },
];

const tabs = [
  { label: 'All Guests', count: 189 },
  { label: 'Active', count: 156 },
  { label: 'New', count: 18 },
  { label: 'Returning', count: 89 },
  { label: 'Inactive', count: 15 },
];

export default function WellnessGuests() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <>
      <header className="page-header">
        <div>
          <h1 className="page-title">Wellness Guests</h1>
          <p className="page-subtitle">Manage guest profiles and booking history</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-secondary"><Upload size={16} /> Export</button>
        </div>
      </header>

      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <div className="stat-card">
          <div className="stat-label">Total Guests</div>
          <div className="stat-value">189</div>
          <div className="stat-change positive"><TrendingUp size={14} /> +18 this month</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Returning Guests</div>
          <div className="stat-value success">89</div>
          <div className="stat-breakdown">47% return rate</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Avg Spend per Guest</div>
          <div className="stat-value">$1,420</div>
          <div className="stat-change positive"><TrendingUp size={14} /> +12% vs last month</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Avg Bookings</div>
          <div className="stat-value">2.3</div>
          <div className="stat-breakdown">Per guest lifetime</div>
        </div>
      </div>

      <div className="tabs-container">
        {tabs.map((tab, i) => (
          <div key={i} className={`tab${activeTab === i ? ' active' : ''}`} onClick={() => setActiveTab(i)}>
            {tab.label} <span className="tab-count">{tab.count}</span>
          </div>
        ))}
      </div>

      <div className="toolbar">
        <div className="search-box">
          <Search size={18} color="#B8B8B8" />
          <input type="text" placeholder="Search guests by name or email..." />
        </div>
        <div className="toolbar-actions">
          <button className="filter-btn"><Filter size={16} /> Filters</button>
        </div>
      </div>

      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Guest</th>
              <th>Bookings</th>
              <th>Last Booking</th>
              <th>Total Spent</th>
              <th>Status</th>
              <th>Joined</th>
              <th style={{ width: 50 }}></th>
            </tr>
          </thead>
          <tbody>
            {guests.map((g, i) => (
              <tr key={i}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, #6B8EC9, #5a7db8)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 600, fontSize: 14, flexShrink: 0 }}>
                      {g.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div style={{ fontWeight: 500 }}>{g.name}</div>
                      <div style={{ fontSize: 12, color: '#B8B8B8' }}>{g.email}</div>
                    </div>
                  </div>
                </td>
                <td style={{ fontWeight: 500 }}>{g.bookings}</td>
                <td>{g.lastBooking}</td>
                <td style={{ fontWeight: 500 }}>{g.spent}</td>
                <td>
                  <span className={`status-badge ${g.status === 'Active' ? 'active' : g.status === 'New' ? 'pending' : 'inactive'}`}>
                    {g.status}
                  </span>
                </td>
                <td style={{ fontSize: 12, color: '#B8B8B8' }}>{g.joined}</td>
                <td>
                  <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8, color: '#B8B8B8' }}>
                    <MoreHorizontal size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="pagination">
          <div className="pagination-info">Showing 1-8 of 189 guests</div>
          <div className="pagination-controls">
            <button className="page-btn"><ChevronLeft size={16} /></button>
            <button className="page-btn active">1</button>
            <button className="page-btn">2</button>
            <button className="page-btn">3</button>
            <button className="page-btn"><ChevronRight size={16} /></button>
          </div>
        </div>
      </div>
    </>
  );
}
