import { useState } from 'react';
import { Upload, Plus, Search, Filter, MoreHorizontal, Eye, Edit3, ChevronLeft, ChevronRight, TrendingUp, Mail } from 'lucide-react';

const posts = [
  { title: 'February Wellness Roundup', category: 'Newsletter', author: 'Kate Morrison', status: 'Sent', subscribers: '2,847', openRate: '42%', date: 'Feb 10, 2026' },
  { title: 'New Year, New Retreat Intentions', category: 'Newsletter', author: 'Kate Morrison', status: 'Sent', subscribers: '2,712', openRate: '38%', date: 'Jan 15, 2026' },
  { title: 'Spring Wellness Calendar', category: 'Feature', author: 'Kate Morrison', status: 'Draft', subscribers: '-', openRate: '-', date: 'Feb 13, 2026' },
  { title: 'Meet Our Hosts: Tom Cronin', category: 'Profile', author: 'Kate Morrison', status: 'Published', subscribers: '-', openRate: '-', date: 'Feb 6, 2026' },
  { title: 'The Science of Cold Therapy', category: 'Education', author: 'Dr. Amelia Santos', status: 'Published', subscribers: '-', openRate: '-', date: 'Feb 3, 2026' },
  { title: 'Venue Spotlight: Moraea Farm', category: 'Spotlight', author: 'Kate Morrison', status: 'Published', subscribers: '-', openRate: '-', date: 'Jan 28, 2026' },
  { title: 'Holiday Detox Retreat Guide', category: 'Guide', author: 'Anna Martinez', status: 'Sent', subscribers: '2,650', openRate: '45%', date: 'Dec 20, 2025' },
  { title: 'March Newsletter Preview', category: 'Newsletter', author: 'Kate Morrison', status: 'Scheduled', subscribers: '2,847', openRate: '-', date: 'Mar 1, 2026' },
];

const tabs = [
  { label: 'All Posts', count: 38 },
  { label: 'Newsletters', count: 12 },
  { label: 'Articles', count: 18 },
  { label: 'Profiles', count: 5 },
  { label: 'Scheduled', count: 3 },
];

export default function SanctumJournal() {
  const [activeTab, setActiveTab] = useState(0);

  const statusClass = (s: string) => {
    switch (s) {
      case 'Published': return 'active';
      case 'Sent': return 'active';
      case 'Draft': return 'pending';
      case 'Scheduled': return 'pending';
      default: return 'inactive';
    }
  };

  const categoryStyle = (c: string): React.CSSProperties => {
    switch (c) {
      case 'Newsletter': return { backgroundColor: '#F3E8F9', color: '#8B5A8B', padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 500 };
      case 'Feature': return { backgroundColor: '#FEF9E7', color: '#D4A853', padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 500 };
      case 'Profile': return { backgroundColor: '#E8EFF9', color: '#6B8EC9', padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 500 };
      case 'Education': return { backgroundColor: '#E8F4EA', color: '#4A7C59', padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 500 };
      case 'Spotlight': return { backgroundColor: 'rgba(212,168,83,0.15)', color: '#9A7B3C', padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 500 };
      case 'Guide': return { backgroundColor: '#E8F4EA', color: '#4A7C59', padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 500 };
      default: return { backgroundColor: '#F7F5F1', color: '#B8B8B8', padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 500 };
    }
  };

  return (
    <>
      <header className="page-header">
        <div>
          <h1 className="page-title">Sanctum Journal</h1>
          <p className="page-subtitle">Manage journal content, newsletters, and subscriber communications</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-secondary"><Mail size={16} /> Send Newsletter</button>
          <button className="btn btn-primary"><Plus size={16} /> New Post</button>
        </div>
      </header>

      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <div className="stat-card">
          <div className="stat-label">Total Subscribers</div>
          <div className="stat-value">2,847</div>
          <div className="stat-change positive"><TrendingUp size={14} /> +135 this month</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Avg Open Rate</div>
          <div className="stat-value success">42%</div>
          <div className="stat-breakdown">Industry avg: 21%</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Published Posts</div>
          <div className="stat-value">38</div>
          <div className="stat-change positive"><TrendingUp size={14} /> +4 this month</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Avg Click Rate</div>
          <div className="stat-value info">18.4%</div>
          <div className="stat-breakdown">Industry avg: 2.6%</div>
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
          <input type="text" placeholder="Search journal posts..." />
        </div>
        <div className="toolbar-actions">
          <button className="filter-btn"><Filter size={16} /> Filters</button>
          <button className="filter-btn"><Upload size={16} /> Export</button>
        </div>
      </div>

      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Author</th>
              <th>Status</th>
              <th>Subscribers</th>
              <th>Open Rate</th>
              <th>Date</th>
              <th style={{ width: 100 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((p, i) => (
              <tr key={i}>
                <td style={{ fontWeight: 500 }}>{p.title}</td>
                <td><span style={categoryStyle(p.category)}>{p.category}</span></td>
                <td>{p.author}</td>
                <td><span className={`status-badge ${statusClass(p.status)}`}>{p.status}</span></td>
                <td style={{ color: p.subscribers === '-' ? '#B8B8B8' : undefined }}>{p.subscribers}</td>
                <td style={{ fontWeight: p.openRate !== '-' ? 500 : 400, color: p.openRate === '-' ? '#B8B8B8' : '#4A7C59' }}>{p.openRate}</td>
                <td style={{ fontSize: 12, color: '#B8B8B8' }}>{p.date}</td>
                <td>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, borderRadius: 6, color: '#B8B8B8' }}><Eye size={14} /></button>
                    <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, borderRadius: 6, color: '#B8B8B8' }}><Edit3 size={14} /></button>
                    <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, borderRadius: 6, color: '#B8B8B8' }}><MoreHorizontal size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="pagination">
          <div className="pagination-info">Showing 1-8 of 38 posts</div>
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
