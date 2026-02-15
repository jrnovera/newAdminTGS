import { useState } from 'react';
import { Upload, Search, Filter, MoreHorizontal, ChevronLeft, ChevronRight, TrendingUp } from 'lucide-react';

const payments = [
  { id: 'PAY-001', description: 'Subscription - Featured', venue: 'Moraea Farm', amount: '$249.00', type: 'Subscription', status: 'Completed', date: 'Feb 8, 2026' },
  { id: 'PAY-002', description: 'Booking Commission', venue: 'Soak Wellness', amount: '$147.00', type: 'Commission', status: 'Completed', date: 'Feb 7, 2026' },
  { id: 'PAY-003', description: 'Subscription - Premium', venue: 'Sedona Spirit Lodge', amount: '$449.00', type: 'Subscription', status: 'Completed', date: 'Feb 6, 2026' },
  { id: 'PAY-004', description: 'Booking Commission', venue: 'Hakone Onsen Ryokan', amount: '$294.00', type: 'Commission', status: 'Completed', date: 'Feb 5, 2026' },
  { id: 'PAY-005', description: 'Subscription - Essentials', venue: 'Byron Bay Retreat House', amount: '$79.00', type: 'Subscription', status: 'Failed', date: 'Feb 4, 2026' },
  { id: 'PAY-006', description: 'Payout to Owner', venue: 'Ubud Healing Centre', amount: '-$1,240.00', type: 'Payout', status: 'Processing', date: 'Feb 3, 2026' },
  { id: 'PAY-007', description: 'Booking Commission', venue: 'Curraweena House', amount: '$98.00', type: 'Commission', status: 'Completed', date: 'Feb 2, 2026' },
  { id: 'PAY-008', description: 'Payout to Host', venue: 'Moraea Farm', amount: '-$2,340.00', type: 'Payout', status: 'Pending', date: 'Feb 1, 2026' },
];

const tabs = [
  { label: 'All Transactions', count: 156 },
  { label: 'Subscriptions', count: 47 },
  { label: 'Commissions', count: 89 },
  { label: 'Payouts', count: 18 },
  { label: 'Failed', count: 2 },
];

export default function Payments() {
  const [activeTab, setActiveTab] = useState(0);

  const typeStyle = (type: string): React.CSSProperties => {
    switch (type) {
      case 'Subscription': return { backgroundColor: '#E8EFF9', color: '#6B8EC9', padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 500 };
      case 'Commission': return { backgroundColor: '#E8F4EA', color: '#4A7C59', padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 500 };
      case 'Payout': return { backgroundColor: '#F3E8F9', color: '#8B5A8B', padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 500 };
      default: return {};
    }
  };

  const statusClass = (s: string) => {
    switch (s) {
      case 'Completed': return 'active';
      case 'Processing': return 'pending';
      case 'Pending': return 'pending';
      case 'Failed': return 'error';
      default: return '';
    }
  };

  return (
    <>
      <header className="page-header">
        <div>
          <h1 className="page-title">Payments</h1>
          <p className="page-subtitle">Track all financial transactions and payouts</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-secondary"><Upload size={16} /> Export</button>
        </div>
      </header>

      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <div className="stat-card">
          <div className="stat-label">Revenue MTD</div>
          <div className="stat-value">$14,280</div>
          <div className="stat-change positive"><TrendingUp size={14} /> +24% vs last month</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Subscription Revenue</div>
          <div className="stat-value success">$8,420</div>
          <div className="stat-breakdown">38 active subscriptions</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Commission Revenue</div>
          <div className="stat-value info">$5,860</div>
          <div className="stat-breakdown">89 booking commissions</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Pending Payouts</div>
          <div className="stat-value" style={{ color: '#D4A853' }}>$3,580</div>
          <div className="stat-breakdown">2 payouts ready to process</div>
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
          <input type="text" placeholder="Search transactions..." />
        </div>
        <div className="toolbar-actions">
          <button className="filter-btn"><Filter size={16} /> Filters</button>
        </div>
      </div>

      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Transaction ID</th>
              <th>Description</th>
              <th>Venue</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Date</th>
              <th style={{ width: 50 }}></th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p, i) => (
              <tr key={i}>
                <td style={{ fontWeight: 500, fontSize: 12 }}>{p.id}</td>
                <td>{p.description}</td>
                <td>{p.venue}</td>
                <td><span style={typeStyle(p.type)}>{p.type}</span></td>
                <td style={{ fontWeight: 600, color: p.amount.startsWith('-') ? '#C45C5C' : '#4A7C59' }}>{p.amount}</td>
                <td><span className={`status-badge ${statusClass(p.status)}`}>{p.status}</span></td>
                <td style={{ fontSize: 12, color: '#B8B8B8' }}>{p.date}</td>
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
          <div className="pagination-info">Showing 1-8 of 156 transactions</div>
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
