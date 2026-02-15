import { useState } from 'react';
import { Upload, Plus, Search, Filter, MoreHorizontal, Eye, Edit3, ChevronLeft, ChevronRight, TrendingUp } from 'lucide-react';

const articles = [
  { title: 'The Art of Forest Bathing', category: 'Wellness Trends', author: 'Kate Morrison', status: 'Published', views: '2,847', date: 'Feb 10, 2026', featured: true },
  { title: '5 Ayurvedic Morning Rituals', category: 'Ayurveda', author: 'Dr. Amelia Santos', status: 'Published', views: '1,923', date: 'Feb 8, 2026', featured: false },
  { title: 'Sound Healing: A Beginner\'s Guide', category: 'Sound Therapy', author: 'Clare O\'Brien', status: 'Published', views: '3,156', date: 'Feb 5, 2026', featured: true },
  { title: 'Mindful Eating for Retreat Guests', category: 'Nutrition', author: 'Anna Martinez', status: 'Draft', views: '-', date: 'Feb 12, 2026', featured: false },
  { title: 'Japanese Onsen Etiquette', category: 'Culture', author: 'Yuki Tanaka', status: 'Published', views: '4,201', date: 'Jan 28, 2026', featured: false },
  { title: 'Breathwork Techniques for Anxiety', category: 'Mental Health', author: 'Marcus Wellbeing', status: 'Review', views: '-', date: 'Feb 11, 2026', featured: false },
  { title: 'Top 10 Wellness Retreats 2026', category: 'Guides', author: 'Kate Morrison', status: 'Published', views: '8,432', date: 'Jan 15, 2026', featured: true },
  { title: 'Yoga Nidra: Deep Rest Practice', category: 'Yoga', author: 'Sophie Laurent', status: 'Draft', views: '-', date: 'Feb 13, 2026', featured: false },
];

const tabs = [
  { label: 'All Articles', count: 45 },
  { label: 'Published', count: 32 },
  { label: 'Draft', count: 8 },
  { label: 'In Review', count: 3 },
  { label: 'Featured', count: 5 },
];

export default function WellnessEdit() {
  const [activeTab, setActiveTab] = useState(0);

  const statusClass = (s: string) => {
    switch (s) {
      case 'Published': return 'active';
      case 'Draft': return 'pending';
      case 'Review': return 'pending';
      default: return 'inactive';
    }
  };

  return (
    <>
      <header className="page-header">
        <div>
          <h1 className="page-title">The Wellness Edit</h1>
          <p className="page-subtitle">Manage editorial content and wellness articles</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-secondary"><Upload size={16} /> Export</button>
          <button className="btn btn-primary"><Plus size={16} /> New Article</button>
        </div>
      </header>

      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <div className="stat-card">
          <div className="stat-label">Total Articles</div>
          <div className="stat-value">45</div>
          <div className="stat-change positive"><TrendingUp size={14} /> +6 this month</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Views (Feb)</div>
          <div className="stat-value success">24,590</div>
          <div className="stat-change positive"><TrendingUp size={14} /> +32% vs Jan</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Avg Read Time</div>
          <div className="stat-value">4.2m</div>
          <div className="stat-breakdown">Target: 5 minutes</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Newsletter CTR</div>
          <div className="stat-value info">18.4%</div>
          <div className="stat-change positive"><TrendingUp size={14} /> +2.1% vs last send</div>
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
          <input type="text" placeholder="Search articles..." />
        </div>
        <div className="toolbar-actions">
          <button className="filter-btn"><Filter size={16} /> Filters</button>
        </div>
      </div>

      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Article</th>
              <th>Category</th>
              <th>Author</th>
              <th>Status</th>
              <th>Views</th>
              <th>Date</th>
              <th style={{ width: 100 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {articles.map((a, i) => (
              <tr key={i}>
                <td>
                  <div style={{ fontWeight: 500 }}>
                    {a.featured && <span style={{ color: '#D4A853', marginRight: 6 }}>★</span>}
                    {a.title}
                  </div>
                </td>
                <td><span className="badge badge-wellness">{a.category}</span></td>
                <td>{a.author}</td>
                <td><span className={`status-badge ${statusClass(a.status)}`}>{a.status}</span></td>
                <td style={{ fontWeight: a.views !== '-' ? 500 : 400, color: a.views === '-' ? '#B8B8B8' : undefined }}>{a.views}</td>
                <td style={{ fontSize: 12, color: '#B8B8B8' }}>{a.date}</td>
                <td>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, borderRadius: 6, color: '#B8B8B8' }} title="View">
                      <Eye size={14} />
                    </button>
                    <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, borderRadius: 6, color: '#B8B8B8' }} title="Edit">
                      <Edit3 size={14} />
                    </button>
                    <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, borderRadius: 6, color: '#B8B8B8' }} title="More">
                      <MoreHorizontal size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="pagination">
          <div className="pagination-info">Showing 1-8 of 45 articles</div>
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
