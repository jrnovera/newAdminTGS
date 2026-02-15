import { useState, useEffect, useRef } from 'react';
import { Upload, Search, Filter, MoreHorizontal, ChevronLeft, ChevronRight, UserPlus, Eye, Edit3, Trash2, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useVenueOwners } from '../context/VenueOwnerContext';
import type { VenueOwner } from '../context/VenueOwnerContext';
import OwnerFormModal from '../components/OwnerFormModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';

export default function VenueOwners() {
  const { owners, addOwner, updateOwner, deleteOwner } = useVenueOwners();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingOwner, setEditingOwner] = useState<VenueOwner | null>(null);
  const [deletingOwner, setDeletingOwner] = useState<VenueOwner | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: string } | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close action menu on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Auto-dismiss toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (message: string, type = 'success') => setToast({ message, type });

  // Filter owners based on tab and search
  const filteredOwners = owners.filter((o) => {
    const matchesSearch =
      searchQuery === '' ||
      o.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.location.toLowerCase().includes(searchQuery.toLowerCase());

    switch (activeTab) {
      case 1: return matchesSearch && o.status === 'Active';
      case 2: return matchesSearch && o.status === 'Pending';
      case 3: return matchesSearch && o.status === 'Inactive';
      default: return matchesSearch;
    }
  });

  // Dynamic tab counts
  const tabCounts = [
    owners.length,
    owners.filter((o) => o.status === 'Active').length,
    owners.filter((o) => o.status === 'Pending').length,
    owners.filter((o) => o.status === 'Inactive').length,
  ];

  const tabs = [
    { label: 'All Owners' },
    { label: 'Active' },
    { label: 'Pending' },
    { label: 'Inactive' },
  ];

  // Dynamic stats
  const totalVenues = owners.reduce((sum, o) => sum + o.venues, 0);
  const activeOwners = owners.filter((o) => o.status === 'Active').length;
  const maxVenues = owners.length > 0 ? Math.max(...owners.map((o) => o.venues)) : 0;
  const avgVenues = owners.length > 0 ? (totalVenues / owners.length).toFixed(1) : '0';

  const handleCreate = (data: Omit<VenueOwner, 'id' | 'joined'>) => {
    addOwner(data);
    showToast(`"${data.name}" has been added successfully`);
  };

  const handleUpdate = (data: Omit<VenueOwner, 'id' | 'joined'>) => {
    if (editingOwner) {
      updateOwner(editingOwner.id, data);
      showToast(`"${data.name}" has been updated successfully`);
      setEditingOwner(null);
    }
  };

  const handleDelete = () => {
    if (deletingOwner) {
      const name = deletingOwner.name;
      deleteOwner(deletingOwner.id);
      showToast(`"${name}" has been removed`, 'error');
      setDeletingOwner(null);
    }
  };

  return (
    <>
      {/* Toast Notification */}
      {toast && (
        <div className="toast-container">
          <div className={`toast ${toast.type}`}>
            <CheckCircle size={18} />
            {toast.message}
          </div>
        </div>
      )}

      <header className="page-header">
        <div>
          <h1 className="page-title">Venue Owners</h1>
          <p className="page-subtitle">Manage venue owner accounts and profiles</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-secondary"><Upload size={16} /> Export</button>
          <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
            <UserPlus size={16} /> Add Owner
          </button>
        </div>
      </header>

      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <div className="stat-card">
          <div className="stat-label">Total Owners</div>
          <div className="stat-value">{owners.length}</div>
          <div className="stat-change positive">+6 this month</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Active Owners</div>
          <div className="stat-value success">{activeOwners}</div>
          <div className="stat-breakdown">Managing {totalVenues} venues</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Avg Venues per Owner</div>
          <div className="stat-value">{avgVenues}</div>
          <div className="stat-breakdown">Max: {maxVenues} venues</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Revenue (Owners)</div>
          <div className="stat-value">$36,060</div>
          <div className="stat-change positive">+22% vs last month</div>
        </div>
      </div>

      <div className="tabs-container">
        {tabs.map((tab, i) => (
          <div key={i} className={`tab${activeTab === i ? ' active' : ''}`} onClick={() => setActiveTab(i)}>
            {tab.label} <span className="tab-count">{tabCounts[i]}</span>
          </div>
        ))}
      </div>

      <div className="toolbar">
        <div className="search-box">
          <Search size={18} color="#B8B8B8" />
          <input
            type="text"
            placeholder="Search owners by name, email, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="toolbar-actions">
          <button className="filter-btn"><Filter size={16} /> Filters</button>
        </div>
      </div>

      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Owner</th>
              <th>Location</th>
              <th>Venues</th>
              <th>Status</th>
              <th>Revenue MTD</th>
              <th>Joined</th>
              <th style={{ width: 50 }}></th>
            </tr>
          </thead>
          <tbody>
            {filteredOwners.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '48px 20px', color: '#B8B8B8' }}>
                  <div style={{ fontSize: 16, marginBottom: 8 }}>No owners found</div>
                  <div style={{ fontSize: 13 }}>
                    {searchQuery ? 'Try adjusting your search or filters' : 'Click "Add Owner" to register a new venue owner'}
                  </div>
                </td>
              </tr>
            ) : (
              filteredOwners.map((o) => (
                <tr key={o.id}>
                  <td onClick={() => navigate(`/venue-owners/${o.id}`)} style={{ cursor: 'pointer' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, #B8B8B8, #888)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 600, fontSize: 14, flexShrink: 0 }}>
                        {o.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div style={{ fontWeight: 500 }}>{o.name}</div>
                        <div style={{ fontSize: 12, color: '#B8B8B8' }}>{o.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>{o.location}</td>
                  <td style={{ fontWeight: 500 }}>{o.venues}</td>
                  <td>
                    <span className={`status-badge ${o.status === 'Active' ? 'active' : o.status === 'Pending' ? 'pending' : 'inactive'}`}>
                      {o.status}
                    </span>
                  </td>
                  <td style={{ fontWeight: 500 }}>{o.revenue}</td>
                  <td style={{ fontSize: 12, color: '#B8B8B8' }}>{o.joined}</td>
                  <td>
                    <div className="action-menu-wrapper" ref={openMenuId === o.id ? menuRef : null}>
                      <button
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8, color: '#B8B8B8' }}
                        onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === o.id ? null : o.id); }}
                      >
                        <MoreHorizontal size={16} />
                      </button>
                      {openMenuId === o.id && (
                        <div className="action-menu">
                          <button className="action-menu-item" onClick={() => { setOpenMenuId(null); navigate(`/venue-owners/${o.id}`); }}>
                            <Eye size={14} /> View Profile
                          </button>
                          <button className="action-menu-item" onClick={() => { setOpenMenuId(null); setEditingOwner(o); }}>
                            <Edit3 size={14} /> Edit Owner
                          </button>
                          <div className="action-menu-divider"></div>
                          <button className="action-menu-item danger" onClick={() => { setOpenMenuId(null); setDeletingOwner(o); }}>
                            <Trash2 size={14} /> Delete Owner
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {filteredOwners.length > 0 && (
          <div className="pagination">
            <div className="pagination-info">Showing 1-{filteredOwners.length} of {filteredOwners.length} owners</div>
            <div className="pagination-controls">
              <button className="page-btn"><ChevronLeft size={16} /></button>
              <button className="page-btn active">1</button>
              <button className="page-btn"><ChevronRight size={16} /></button>
            </div>
          </div>
        )}
      </div>

      {/* Create Owner Modal */}
      <OwnerFormModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreate}
        mode="create"
      />

      {/* Edit Owner Modal */}
      <OwnerFormModal
        isOpen={!!editingOwner}
        onClose={() => setEditingOwner(null)}
        onSubmit={handleUpdate}
        initialData={editingOwner}
        mode="edit"
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deletingOwner}
        onClose={() => setDeletingOwner(null)}
        onConfirm={handleDelete}
        venueName={deletingOwner?.name || ''}
      />
    </>
  );
}
