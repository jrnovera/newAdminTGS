import { useState } from 'react';
import { Upload, Search, Filter, MoreHorizontal, ChevronLeft, ChevronRight, UserPlus, TrendingUp } from 'lucide-react';

const hosts = [
  { name: 'Tom Cronin', email: 'tom@thetomcronin.com', specialty: 'Meditation & Mindfulness', retreats: 8, rating: 4.9, status: 'Active', location: 'Sydney, AU', revenue: '$12,400' },
  { name: 'Dr. Amelia Santos', email: 'amelia@holistichealth.com', specialty: 'Holistic Health', retreats: 12, rating: 4.8, status: 'Active', location: 'Byron Bay, AU', revenue: '$18,200' },
  { name: 'Yuki Tanaka', email: 'yuki@zenjourney.jp', specialty: 'Zen & Tea Ceremony', retreats: 5, rating: 5.0, status: 'Active', location: 'Kyoto, Japan', revenue: '$9,800' },
  { name: 'Anna Martinez', email: 'anna@nutritionretreats.com', specialty: 'Nutrition & Detox', retreats: 6, rating: 4.7, status: 'Active', location: 'Bali, Indonesia', revenue: '$7,600' },
  { name: 'Marcus Wellbeing', email: 'marcus@breathwork.co', specialty: 'Breathwork', retreats: 4, rating: 4.6, status: 'Active', location: 'Sedona, AZ', revenue: '$5,200' },
  { name: 'Sophie Laurent', email: 'sophie@yogaretreat.fr', specialty: 'Yoga & Pilates', retreats: 15, rating: 4.9, status: 'Active', location: 'Nice, France', revenue: '$22,100' },
  { name: 'Raj Patel', email: 'raj@ayurvedawise.in', specialty: 'Ayurveda', retreats: 3, rating: 4.5, status: 'Pending', location: 'Kerala, India', revenue: '$0' },
  { name: 'Clare O\'Brien', email: 'clare@soundhealing.ie', specialty: 'Sound Healing', retreats: 7, rating: 4.8, status: 'Active', location: 'Galway, Ireland', revenue: '$8,900' },
];

const tabs = [
  { label: 'All Hosts', count: 76 },
  { label: 'Active', count: 68 },
  { label: 'Pending', count: 5 },
  { label: 'Inactive', count: 3 },
];

export default function RetreatHosts() {
  const [activeTab, setActiveTab] = useState(0);

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
          <div className="stat-value">76</div>
          <div className="stat-change positive"><TrendingUp size={14} /> +8 this month</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Active Hosts</div>
          <div className="stat-value success">68</div>
          <div className="stat-breakdown">Running 156 retreats</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Avg Rating</div>
          <div className="stat-value" style={{ color: '#D4A853' }}>4.8</div>
          <div className="stat-breakdown">Based on 1,240 reviews</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Host Revenue MTD</div>
          <div className="stat-value">$84,200</div>
          <div className="stat-change positive"><TrendingUp size={14} /> +31% vs last month</div>
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
          <input type="text" placeholder="Search hosts by name, specialty, or location..." />
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
              <th>Specialty</th>
              <th>Location</th>
              <th>Retreats</th>
              <th>Rating</th>
              <th>Status</th>
              <th>Revenue MTD</th>
              <th style={{ width: 50 }}></th>
            </tr>
          </thead>
          <tbody>
            {hosts.map((h, i) => (
              <tr key={i}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, #4A7C59, #3d6b4a)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 600, fontSize: 14, flexShrink: 0 }}>
                      {h.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div style={{ fontWeight: 500 }}>{h.name}</div>
                      <div style={{ fontSize: 12, color: '#B8B8B8' }}>{h.email}</div>
                    </div>
                  </div>
                </td>
                <td><span className="badge badge-retreat">{h.specialty}</span></td>
                <td>{h.location}</td>
                <td style={{ fontWeight: 500 }}>{h.retreats}</td>
                <td>
                  <span style={{ color: '#D4A853', fontWeight: 600 }}>★ {h.rating}</span>
                </td>
                <td>
                  <span className={`status-badge ${h.status === 'Active' ? 'active' : h.status === 'Pending' ? 'pending' : 'inactive'}`}>
                    {h.status}
                  </span>
                </td>
                <td style={{ fontWeight: 500 }}>{h.revenue}</td>
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
          <div className="pagination-info">Showing 1-8 of 76 hosts</div>
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
