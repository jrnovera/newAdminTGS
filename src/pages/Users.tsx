import { useState } from 'react';
import { Upload, Search, UserPlus } from 'lucide-react';

const users = [
  { name: 'Kate Morrison', email: 'kate@theglobalsanctum.com', initials: 'KM', role: 'Admin', roleBadge: 'admin', status: 'Active', online: 'Online', permissions: ['Full Access'], lastActive: 'Now', location: 'Brisbane, AU' },
  { name: 'Izhar', email: 'izhar@webflow.dev', initials: 'IZ', role: 'Developer', roleBadge: 'developer', status: 'Active', online: 'Online', permissions: ['Venues', 'Content', 'Settings'], lastActive: 'Now', location: 'Remote' },
  { name: 'Maria Santos', email: 'maria@theglobalsanctum.com', initials: 'MS', role: 'Virtual Assistant', roleBadge: 'va', status: 'Active', online: 'Online', permissions: ['Venues', 'Enquiries', 'Bookings'], lastActive: 'Now', location: 'Manila, PH' },
  { name: 'Tom Cronin', email: 'tom@advisor.com', initials: 'TC', role: 'Advisor', roleBadge: 'advisor', status: 'Active', online: 'Away', permissions: ['Analytics', 'Reports'], lastActive: '2h ago', location: 'Sydney, AU' },
  { name: 'Emily Chen', email: 'emily@theglobalsanctum.com', initials: 'EC', role: 'Content Writer', roleBadge: 'content', status: 'Active', online: 'Offline', permissions: ['Journal', 'Wellness Edit'], lastActive: '5h ago', location: 'Melbourne, AU' },
  { name: 'David Park', email: 'david@theglobalsanctum.com', initials: 'DP', role: 'Support', roleBadge: 'support', status: 'Active', online: 'Offline', permissions: ['Enquiries', 'Users'], lastActive: 'Yesterday', location: 'Auckland, NZ' },
  { name: 'Sophie Laurent', email: 'sophie@freelance.fr', initials: 'SL', role: 'Content Writer', roleBadge: 'content', status: 'Invited', online: 'Offline', permissions: ['Journal'], lastActive: 'Pending', location: 'Nice, FR' },
  { name: 'RJ Developer', email: 'rj@dev.com', initials: 'RJ', role: 'Developer', roleBadge: 'developer', status: 'Active', online: 'Offline', permissions: ['Full Access'], lastActive: '1d ago', location: 'Remote' },
];

const tabs = [
  { label: 'All Users', count: 8 },
  { label: 'Roles & Permissions', count: null },
  { label: 'Activity Log', count: null },
  { label: 'Pending Invites', count: 1 },
];

const roles = [
  { name: 'Administrator', icon: '👑', count: 1, desc: 'Full system access and control', color: 'admin', permissions: ['All Modules', 'User Management', 'Settings', 'Billing'] },
  { name: 'Developer', icon: '💻', count: 2, desc: 'Technical access for development', color: 'developer', permissions: ['Venues', 'Content', 'Settings', 'API Access'] },
  { name: 'Virtual Assistant', icon: '🎧', count: 1, desc: 'Day-to-day operations management', color: 'va', permissions: ['Venues', 'Enquiries', 'Bookings', 'Contacts'] },
  { name: 'Advisor', icon: '📊', count: 1, desc: 'Strategic oversight and reporting', color: 'advisor', permissions: ['Analytics', 'Reports', 'Dashboard'] },
  { name: 'Content Writer', icon: '✍️', count: 2, desc: 'Content creation and editing', color: 'content', permissions: ['Journal', 'Wellness Edit', 'Media'] },
  { name: 'Support', icon: '💬', count: 1, desc: 'Customer support and communications', color: 'support', permissions: ['Enquiries', 'Users', 'Contacts'] },
];

export default function Users() {
  const [activeTab, setActiveTab] = useState(0);

  const avatarBg = (role: string) => {
    switch (role) {
      case 'admin': return 'linear-gradient(135deg, #313131, #4a4a4a)';
      case 'developer': return 'linear-gradient(135deg, #6B8EC9, #5a7db8)';
      case 'va': return 'linear-gradient(135deg, #4A7C59, #3d6b4a)';
      case 'advisor': return 'linear-gradient(135deg, #8B5A8B, #6B4A6B)';
      case 'content': return 'linear-gradient(135deg, #D4A853, #b8923a)';
      case 'support': return 'linear-gradient(135deg, #6BC9C9, #5ab8b8)';
      default: return '#B8B8B8';
    }
  };

  const onlineDotClass = (s: string) => {
    switch (s) {
      case 'Online': return '#4A7C59';
      case 'Away': return '#D4A853';
      default: return '#B8B8B8';
    }
  };

  return (
    <>
      <div className="page-header">
        <div className="page-title-group">
          <h1 className="page-title">Users & Team</h1>
          <span style={{ padding: '6px 12px', background: 'linear-gradient(135deg, #E8EFF9, #E8F4EA)', borderRadius: 20, fontSize: 11, fontWeight: 500, color: '#6B8EC9' }}>
            Internal Operations
          </span>
        </div>
        <div className="header-actions">
          <button className="btn btn-secondary"><Upload size={16} /> Export</button>
          <button className="btn btn-primary"><UserPlus size={16} /> Invite User</button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
        <div className="stat-card" style={{ textAlign: 'center' }}>
          <div className="stat-value">8</div>
          <div className="stat-label">Total Team</div>
        </div>
        <div className="stat-card" style={{ textAlign: 'center' }}>
          <div className="stat-value success">6</div>
          <div className="stat-label">Active</div>
        </div>
        <div className="stat-card" style={{ textAlign: 'center' }}>
          <div className="stat-value info">1</div>
          <div className="stat-label">Pending Invite</div>
        </div>
        <div className="stat-card" style={{ textAlign: 'center' }}>
          <div className="stat-value">3</div>
          <div className="stat-label">Online Now</div>
        </div>
        <div className="stat-card" style={{ textAlign: 'center' }}>
          <div className="stat-value">6</div>
          <div className="stat-label">Roles</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs-container">
        {tabs.map((tab, i) => (
          <div key={i} className={`tab${activeTab === i ? ' active' : ''}`} onClick={() => setActiveTab(i)}>
            {tab.label} {tab.count !== null && <span className="tab-count">{tab.count}</span>}
          </div>
        ))}
      </div>

      {/* Tab: All Users */}
      {activeTab === 0 && (
        <>
          <div className="filters-row">
            <select className="filter-select">
              <option>All Roles</option>
              <option>Admin</option>
              <option>Developer</option>
              <option>Virtual Assistant</option>
              <option>Advisor</option>
              <option>Content Writer</option>
              <option>Support</option>
            </select>
            <select className="filter-select">
              <option>All Status</option>
              <option>Active</option>
              <option>Invited</option>
              <option>Inactive</option>
            </select>
            <div className="search-box" style={{ maxWidth: 280 }}>
              <Search size={16} color="#B8B8B8" />
              <input type="text" placeholder="Search team members..." />
            </div>
          </div>

          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Permissions</th>
                  <th>Last Active</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u, i) => (
                  <tr key={i}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 40, height: 40, borderRadius: '50%', background: avatarBg(u.roleBadge), display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 600, fontSize: 14, flexShrink: 0 }}>
                          {u.initials}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600 }}>{u.name}</div>
                          <div style={{ fontSize: 12, color: '#B8B8B8' }}>{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td><span className={`role-badge ${u.roleBadge}`}>{u.role}</span></td>
                    <td>
                      <span className={`status-badge ${u.status === 'Active' ? 'active' : u.status === 'Invited' ? 'pending' : 'inactive'}`}>{u.status}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4, fontSize: 12 }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: onlineDotClass(u.online) }}></div>
                        <span>{u.online}</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                        {u.permissions.map((p, pi) => (
                          <span key={pi} style={{
                            padding: '2px 6px', borderRadius: 4, fontSize: 10,
                            backgroundColor: p === 'Full Access' ? '#313131' : '#F7F5F1',
                            color: p === 'Full Access' ? '#fff' : '#313131',
                          }}>{p}</span>
                        ))}
                      </div>
                    </td>
                    <td>
                      <div>{u.lastActive}</div>
                      <div style={{ fontSize: 11, color: '#B8B8B8' }}>{u.location}</div>
                    </td>
                    <td>
                      <button className="btn btn-secondary btn-small">Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Tab: Roles & Permissions */}
      {activeTab === 1 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {roles.map((r, i) => (
            <div key={i} className="content-card" style={{ cursor: 'pointer', transition: 'all 0.2s', padding: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, backgroundColor: r.color === 'admin' ? '#313131' : r.color === 'developer' ? '#E8EFF9' : r.color === 'va' ? '#E8F4EA' : r.color === 'advisor' ? '#F3E8F9' : r.color === 'content' ? '#FEF9E7' : '#E8F9F9' }}>
                  {r.icon}
                </div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 600 }}>{r.count}</div>
              </div>
              <h3 style={{ fontSize: 20, marginBottom: 4 }}>{r.name}</h3>
              <p style={{ fontSize: 12, color: '#B8B8B8', marginBottom: 16 }}>{r.desc}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {r.permissions.map((p, pi) => (
                  <span key={pi} style={{ padding: '4px 8px', backgroundColor: '#F7F5F1', borderRadius: 4, fontSize: 10 }}>{p}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab: Activity Log */}
      {activeTab === 2 && (
        <div className="content-card">
          <div className="card-header" style={{ backgroundColor: '#F7F5F1' }}>
            <h3 className="card-title">Recent Activity</h3>
            <button className="btn btn-small btn-secondary">Export Log</button>
          </div>
          <div className="card-body">
            <ul className="activity-list" style={{ maxHeight: 500, overflowY: 'auto' }}>
              {[
                { user: 'Kate Morrison', initials: 'KM', action: 'Updated venue settings for', target: 'Moraea Farm', type: 'edit', time: '10 minutes ago' },
                { user: 'Izhar', initials: 'IZ', action: 'Deployed new feature:', target: 'Booking Calendar v2', type: 'create', time: '2 hours ago' },
                { user: 'Maria Santos', initials: 'MS', action: 'Responded to enquiry from', target: 'Sarah Mitchell', type: 'edit', time: '3 hours ago' },
                { user: 'Kate Morrison', initials: 'KM', action: 'Logged in from', target: 'Brisbane, AU', type: 'login', time: '5 hours ago' },
                { user: 'Emily Chen', initials: 'EC', action: 'Published article:', target: 'The Art of Forest Bathing', type: 'create', time: '6 hours ago' },
                { user: 'David Park', initials: 'DP', action: 'Exported', target: 'Monthly Reports', type: 'export', time: 'Yesterday' },
                { user: 'Tom Cronin', initials: 'TC', action: 'Viewed analytics for', target: 'Q1 Revenue', type: 'edit', time: 'Yesterday' },
              ].map((a, i) => (
                <li key={i} className="activity-item">
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#6B8EC9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 600, fontSize: 11, flexShrink: 0 }}>
                    {a.initials}
                  </div>
                  <div className="activity-content">
                    <div className="activity-text"><strong>{a.user}</strong> {a.action} <strong>{a.target}</strong></div>
                    <div className="activity-time">{a.time}</div>
                  </div>
                  <span style={{
                    padding: '2px 8px', borderRadius: 4, fontSize: 10, fontWeight: 500,
                    backgroundColor: a.type === 'login' ? '#E8F4EA' : a.type === 'edit' ? '#E8EFF9' : a.type === 'create' ? '#FEF9E7' : a.type === 'export' ? '#F3E8F9' : '#F7F5F1',
                    color: a.type === 'login' ? '#4A7C59' : a.type === 'edit' ? '#6B8EC9' : a.type === 'create' ? '#D4A853' : a.type === 'export' ? '#8B5A8B' : '#B8B8B8',
                  }}>{a.type}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Tab: Pending Invites */}
      {activeTab === 3 && (
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Invitee</th>
                <th>Role</th>
                <th>Invited By</th>
                <th>Date Sent</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, #D4A853, #b8923a)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 600, fontSize: 14 }}>SL</div>
                    <div>
                      <div style={{ fontWeight: 500 }}>Sophie Laurent</div>
                      <div style={{ fontSize: 12, color: '#B8B8B8' }}>sophie@freelance.fr</div>
                    </div>
                  </div>
                </td>
                <td><span className="role-badge content">Content Writer</span></td>
                <td>Kate Morrison</td>
                <td style={{ fontSize: 12, color: '#B8B8B8' }}>Feb 10, 2026</td>
                <td><span className="status-badge pending">Pending</span></td>
                <td>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn btn-small btn-secondary">Resend</button>
                    <button className="btn btn-small btn-secondary" style={{ color: '#C45C5C', borderColor: '#C45C5C' }}>Revoke</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
