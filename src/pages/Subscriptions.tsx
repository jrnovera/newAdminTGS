import { useState } from 'react';
import { Upload, Search, Filter, MoreHorizontal, ChevronLeft, ChevronRight, TrendingUp } from 'lucide-react';

const subscriptions = [
  { venue: 'Moraea Farm', owner: 'Sarah Mitchell', plan: 'Featured', amount: '$249/mo', status: 'Active', nextBilling: 'Mar 8, 2026', started: 'Aug 8, 2025' },
  { venue: 'Soak Wellness', owner: 'Mei Lin Chen', plan: 'Premium', amount: '$449/mo', status: 'Active', nextBilling: 'Mar 4, 2026', started: 'Jun 4, 2025' },
  { venue: 'Hakone Onsen Ryokan', owner: 'Kenji Yamamoto', plan: 'Featured', amount: '$249/mo', status: 'Active', nextBilling: 'Feb 28, 2026', started: 'Sep 28, 2025' },
  { venue: 'Curraweena House', owner: 'James Thornton', plan: 'Standard', amount: '$149/mo', status: 'Active', nextBilling: 'Mar 6, 2026', started: 'Oct 6, 2025' },
  { venue: 'Ubud Healing Centre', owner: 'Wayan Sudira', plan: 'Standard', amount: '$149/mo', status: 'Active', nextBilling: 'Feb 25, 2026', started: 'Nov 25, 2025' },
  { venue: 'Sedona Spirit Lodge', owner: 'Amanda Foster', plan: 'Premium', amount: '$449/mo', status: 'Active', nextBilling: 'Feb 20, 2026', started: 'May 20, 2025' },
  { venue: 'Byron Bay Retreat House', owner: 'Tom Walsh', plan: 'Essentials', amount: '$79/mo', status: 'Past Due', nextBilling: 'Overdue', started: 'Dec 2, 2025' },
  { venue: 'Lake Como Wellness Villa', owner: 'Roberto Bellini', plan: 'Standard', amount: '$149/mo', status: 'Trial', nextBilling: 'Mar 1, 2026', started: 'Feb 1, 2026' },
];

const tabs = [
  { label: 'All Subscriptions', count: 47 },
  { label: 'Active', count: 38 },
  { label: 'Trial', count: 4 },
  { label: 'Past Due', count: 3 },
  { label: 'Cancelled', count: 2 },
];

export default function Subscriptions() {
  const [activeTab, setActiveTab] = useState(0);

  const planClass = (plan: string) => {
    switch (plan) {
      case 'Essentials': return 'sub-essentials';
      case 'Standard': return 'sub-standard';
      case 'Featured': return 'sub-featured';
      case 'Premium': return 'sub-premium';
      default: return '';
    }
  };

  const statusClass = (s: string) => {
    switch (s) {
      case 'Active': return 'active';
      case 'Trial': return 'pending';
      case 'Past Due': return 'error';
      case 'Cancelled': return 'inactive';
      default: return '';
    }
  };

  return (
    <>
      <header className="page-header">
        <div>
          <h1 className="page-title">Subscriptions</h1>
          <p className="page-subtitle">Manage venue subscription plans and billing</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-secondary"><Upload size={16} /> Export</button>
        </div>
      </header>

      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <div className="stat-card">
          <div className="stat-label">Monthly Recurring Revenue</div>
          <div className="stat-value">$8,420</div>
          <div className="stat-change positive"><TrendingUp size={14} /> +18% vs last month</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Active Subscriptions</div>
          <div className="stat-value success">38</div>
          <div className="stat-breakdown">4 trials converting soon</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Avg Revenue / Venue</div>
          <div className="stat-value">$222</div>
          <div className="stat-change positive"><TrendingUp size={14} /> +8% vs last month</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Churn Rate</div>
          <div className="stat-value" style={{ color: '#4A7C59' }}>2.1%</div>
          <div className="stat-breakdown">1 cancellation this month</div>
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
          <input type="text" placeholder="Search subscriptions..." />
        </div>
        <div className="toolbar-actions">
          <button className="filter-btn"><Filter size={16} /> Filters</button>
        </div>
      </div>

      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Venue</th>
              <th>Owner</th>
              <th>Plan</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Next Billing</th>
              <th>Started</th>
              <th style={{ width: 50 }}></th>
            </tr>
          </thead>
          <tbody>
            {subscriptions.map((s, i) => (
              <tr key={i}>
                <td style={{ fontWeight: 500 }}>{s.venue}</td>
                <td style={{ color: '#B8B8B8' }}>{s.owner}</td>
                <td><span className={`subscription-badge ${planClass(s.plan)}`}>{s.plan}</span></td>
                <td style={{ fontWeight: 500 }}>{s.amount}</td>
                <td><span className={`status-badge ${statusClass(s.status)}`}>{s.status}</span></td>
                <td style={{ fontSize: 12, color: s.nextBilling === 'Overdue' ? '#C45C5C' : '#B8B8B8', fontWeight: s.nextBilling === 'Overdue' ? 600 : 400 }}>{s.nextBilling}</td>
                <td style={{ fontSize: 12, color: '#B8B8B8' }}>{s.started}</td>
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
          <div className="pagination-info">Showing 1-8 of 47 subscriptions</div>
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
