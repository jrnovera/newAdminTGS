import { useState } from 'react';
import { Upload, Search, Filter, MoreHorizontal, ChevronLeft, ChevronRight, MessageSquare, Clock, CheckCircle, XCircle } from 'lucide-react';

const enquiries = [
  { id: 'ENQ-001', guest: 'Sarah Mitchell', email: 'sarah@email.com', venue: 'Moraea Farm', type: 'Retreat Booking', status: 'New', date: 'Feb 13, 2026', priority: 'High' },
  { id: 'ENQ-002', guest: 'James Chen', email: 'james.c@email.com', venue: 'Hakone Onsen Ryokan', type: 'Group Enquiry', status: 'New', date: 'Feb 12, 2026', priority: 'High' },
  { id: 'ENQ-003', guest: 'Emma Wilson', email: 'emma.w@email.com', venue: 'Byron Bay Retreat House', type: 'Pricing Enquiry', status: 'In Progress', date: 'Feb 11, 2026', priority: 'Medium' },
  { id: 'ENQ-004', guest: 'Michael Brown', email: 'michael.b@email.com', venue: 'Soak Wellness', type: 'Availability Check', status: 'In Progress', date: 'Feb 10, 2026', priority: 'Medium' },
  { id: 'ENQ-005', guest: 'Lisa Patel', email: 'lisa.p@email.com', venue: 'Ubud Healing Centre', type: 'Custom Package', status: 'New', date: 'Feb 10, 2026', priority: 'Low' },
  { id: 'ENQ-006', guest: 'David Kim', email: 'david.k@email.com', venue: 'Curraweena House', type: 'Retreat Booking', status: 'Resolved', date: 'Feb 8, 2026', priority: 'Low' },
  { id: 'ENQ-007', guest: 'Olivia Harper', email: 'olivia.h@email.com', venue: 'Sedona Spirit Lodge', type: 'Group Enquiry', status: 'Resolved', date: 'Feb 7, 2026', priority: 'Medium' },
  { id: 'ENQ-008', guest: 'Ryan Torres', email: 'ryan.t@email.com', venue: 'Lake Como Wellness Villa', type: 'Pricing Enquiry', status: 'Closed', date: 'Feb 5, 2026', priority: 'Low' },
];

const tabs = [
  { label: 'All Enquiries', count: 24 },
  { label: 'New', count: 5 },
  { label: 'In Progress', count: 8 },
  { label: 'Resolved', count: 9 },
  { label: 'Closed', count: 2 },
];

export default function Enquiries() {
  const [activeTab, setActiveTab] = useState(0);

  const statusIcon = (s: string) => {
    switch (s) {
      case 'New': return <MessageSquare size={14} />;
      case 'In Progress': return <Clock size={14} />;
      case 'Resolved': return <CheckCircle size={14} />;
      case 'Closed': return <XCircle size={14} />;
      default: return null;
    }
  };

  const statusStyle = (s: string) => {
    switch (s) {
      case 'New': return 'active';
      case 'In Progress': return 'pending';
      case 'Resolved': return 'active';
      case 'Closed': return 'inactive';
      default: return '';
    }
  };

  const priorityStyle = (p: string): React.CSSProperties => {
    switch (p) {
      case 'High': return { color: '#C45C5C', backgroundColor: '#FCE8E8', padding: '2px 8px', borderRadius: 10, fontSize: 11, fontWeight: 500 };
      case 'Medium': return { color: '#D4A853', backgroundColor: '#FEF9E7', padding: '2px 8px', borderRadius: 10, fontSize: 11, fontWeight: 500 };
      case 'Low': return { color: '#B8B8B8', backgroundColor: '#F7F5F1', padding: '2px 8px', borderRadius: 10, fontSize: 11, fontWeight: 500 };
      default: return {};
    }
  };

  return (
    <>
      <header className="page-header">
        <div>
          <h1 className="page-title">Enquiries</h1>
          <p className="page-subtitle">Manage guest enquiries and communications</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-secondary"><Upload size={16} /> Export</button>
        </div>
      </header>

      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <div className="stat-card">
          <div className="stat-label">Total Enquiries</div>
          <div className="stat-value">24</div>
          <div className="stat-change positive">+5 this week</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">New (Unread)</div>
          <div className="stat-value" style={{ color: '#C45C5C' }}>5</div>
          <div className="stat-breakdown">Awaiting first response</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Avg Response Time</div>
          <div className="stat-value">2.4h</div>
          <div className="stat-change positive">-18% vs last week</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Resolution Rate</div>
          <div className="stat-value" style={{ color: '#4A7C59' }}>87%</div>
          <div className="stat-change positive">+4% vs last month</div>
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
          <input type="text" placeholder="Search enquiries..." />
        </div>
        <div className="toolbar-actions">
          <button className="filter-btn"><Filter size={16} /> Filters</button>
        </div>
      </div>

      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Guest</th>
              <th>Venue</th>
              <th>Type</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Date</th>
              <th style={{ width: 50 }}></th>
            </tr>
          </thead>
          <tbody>
            {enquiries.map((e, i) => (
              <tr key={i}>
                <td style={{ fontWeight: 500, fontSize: 12 }}>{e.id}</td>
                <td>
                  <div style={{ fontWeight: 500 }}>{e.guest}</div>
                  <div style={{ fontSize: 12, color: '#B8B8B8' }}>{e.email}</div>
                </td>
                <td>{e.venue}</td>
                <td>{e.type}</td>
                <td><span style={priorityStyle(e.priority)}>{e.priority}</span></td>
                <td>
                  <span className={`status-badge ${statusStyle(e.status)}`}>
                    {statusIcon(e.status)} {e.status}
                  </span>
                </td>
                <td style={{ fontSize: 12, color: '#B8B8B8' }}>{e.date}</td>
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
          <div className="pagination-info">Showing 1-8 of 24 enquiries</div>
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
