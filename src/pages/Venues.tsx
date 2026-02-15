import { Upload, Plus, Search, Filter, SlidersHorizontal, MoreHorizontal, ChevronLeft, ChevronRight, Eye, Edit3, Trash2, CheckCircle } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVenues } from '../context/VenueContext';
import type { Venue } from '../context/VenueContext';
import VenueFormModal from '../components/VenueFormModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';

export default function Venues() {
  const { venues, addVenue, updateVenue, deleteVenue } = useVenues();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingVenue, setEditingVenue] = useState<Venue | null>(null);
  const [deletingVenue, setDeletingVenue] = useState<Venue | null>(null);
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

  // Filter venues based on tab and search
  const filteredVenues = venues.filter((v) => {
    const matchesSearch =
      searchQuery === '' ||
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.owner.toLowerCase().includes(searchQuery.toLowerCase());

    switch (activeTab) {
      case 1: return matchesSearch && v.type === 'Retreat';
      case 2: return matchesSearch && v.type === 'Wellness';
      case 3: return matchesSearch && v.status === 'Active';
      case 4: return matchesSearch && v.status === 'Draft';
      case 5: return matchesSearch && v.status === 'Inactive';
      default: return matchesSearch;
    }
  });

  // Dynamic tab counts
  const tabCounts = [
    venues.length,
    venues.filter((v) => v.type === 'Retreat').length,
    venues.filter((v) => v.type === 'Wellness').length,
    venues.filter((v) => v.status === 'Active').length,
    venues.filter((v) => v.status === 'Draft').length,
    venues.filter((v) => v.status === 'Inactive').length,
  ];

  const tabs = [
    { label: 'All Venues' },
    { label: 'Retreat Venues' },
    { label: 'Wellness Venues' },
    { label: 'Active' },
    { label: 'Draft' },
    { label: 'Inactive' },
  ];

  const handleCreate = (data: Omit<Venue, 'id' | 'date'>) => {
    addVenue(data);
    showToast(`"${data.name}" has been created successfully`);
  };

  const handleUpdate = (data: Omit<Venue, 'id' | 'date'>) => {
    if (editingVenue) {
      updateVenue(editingVenue.id, data);
      showToast(`"${data.name}" has been updated successfully`);
      setEditingVenue(null);
    }
  };

  const handleDelete = () => {
    if (deletingVenue) {
      const name = deletingVenue.name;
      deleteVenue(deletingVenue.id);
      showToast(`"${name}" has been deleted`, 'error');
      setDeletingVenue(null);
    }
  };

  const subClass = (sub: string) => {
    switch (sub) {
      case 'Essentials': return 'sub-essentials';
      case 'Standard': return 'sub-standard';
      case 'Featured': return 'sub-featured';
      case 'Premium': return 'sub-premium';
      default: return '';
    }
  };

  const statusClass = (s: string) => {
    switch (s) {
      case 'Active': return 'status-active';
      case 'Draft': return 'status-draft';
      case 'Inactive': return 'status-inactive';
      default: return '';
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
          <h1 className="page-title">Venues</h1>
          <p className="page-subtitle">Manage all venue listings across the platform</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-secondary"><Upload size={16} /> Export</button>
          <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
            <Plus size={16} /> Add Venue
          </button>
        </div>
      </header>

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
            placeholder="Search venues by name, location, or owner..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="toolbar-actions">
          <button className="filter-btn"><Filter size={16} /> Filters</button>
          <button className="filter-btn"><SlidersHorizontal size={16} /> Columns</button>
        </div>
      </div>

      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: 40 }}><input type="checkbox" /></th>
              <th className="sortable">Venue Name</th>
              <th className="sortable">Type</th>
              <th className="sortable">Location</th>
              <th className="sortable">Capacity</th>
              <th className="sortable">Status</th>
              <th className="sortable">Subscription</th>
              <th className="sortable">Added</th>
              <th style={{ width: 50 }}></th>
            </tr>
          </thead>
          <tbody>
            {filteredVenues.length === 0 ? (
              <tr>
                <td colSpan={9} style={{ textAlign: 'center', padding: '48px 20px', color: '#B8B8B8' }}>
                  <div style={{ fontSize: 16, marginBottom: 8 }}>No venues found</div>
                  <div style={{ fontSize: 13 }}>
                    {searchQuery ? 'Try adjusting your search or filters' : 'Click "Add Venue" to create your first venue'}
                  </div>
                </td>
              </tr>
            ) : (
              filteredVenues.map((v) => (
                <tr key={v.id}>
                  <td onClick={(e) => e.stopPropagation()}><input type="checkbox" /></td>
                  <td onClick={() => navigate(`/venues/${v.id}`)} style={{ cursor: 'pointer' }}>
                    <div style={{ fontWeight: 500 }}>{v.name}</div>
                    <div style={{ fontSize: 12, color: '#B8B8B8' }}>{v.location}</div>
                  </td>
                  <td>
                    <span className={`badge ${v.type === 'Retreat' ? 'badge-retreat' : 'badge-wellness'}`}>
                      {v.type}
                    </span>
                  </td>
                  <td>{v.shortLoc}</td>
                  <td style={{ fontWeight: 500 }}>{v.capacity}</td>
                  <td>
                    <span className={`status ${statusClass(v.status)}`}>
                      <span className="status-dot"></span> {v.status}
                    </span>
                  </td>
                  <td><span className={`subscription-badge ${subClass(v.subscription)}`}>{v.subscription}</span></td>
                  <td style={{ fontSize: 12, color: '#B8B8B8' }}>{v.date}</td>
                  <td style={{ textAlign: 'center' }}>
                    <div className="action-menu-wrapper" ref={openMenuId === v.id ? menuRef : null}>
                      <button
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8, borderRadius: 6, color: '#B8B8B8' }}
                        onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === v.id ? null : v.id); }}
                      >
                        <MoreHorizontal size={16} />
                      </button>
                      {openMenuId === v.id && (
                        <div className="action-menu">
                          <button className="action-menu-item" onClick={() => { setOpenMenuId(null); navigate(`/venues/${v.id}`); }}>
                            <Eye size={14} /> View Details
                          </button>
                          <button className="action-menu-item" onClick={() => { setOpenMenuId(null); setEditingVenue(v); }}>
                            <Edit3 size={14} /> Edit Venue
                          </button>
                          <div className="action-menu-divider"></div>
                          <button className="action-menu-item danger" onClick={() => { setOpenMenuId(null); setDeletingVenue(v); }}>
                            <Trash2 size={14} /> Delete Venue
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
        {filteredVenues.length > 0 && (
          <div className="pagination">
            <div className="pagination-info">Showing 1-{filteredVenues.length} of {filteredVenues.length} venues</div>
            <div className="pagination-controls">
              <button className="page-btn"><ChevronLeft size={16} /></button>
              <button className="page-btn active">1</button>
              <button className="page-btn"><ChevronRight size={16} /></button>
            </div>
          </div>
        )}
      </div>

      {/* Create Venue Modal */}
      <VenueFormModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreate}
        mode="create"
      />

      {/* Edit Venue Modal */}
      <VenueFormModal
        isOpen={!!editingVenue}
        onClose={() => setEditingVenue(null)}
        onSubmit={handleUpdate}
        initialData={editingVenue}
        mode="edit"
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deletingVenue}
        onClose={() => setDeletingVenue(null)}
        onConfirm={handleDelete}
        venueName={deletingVenue?.name || ''}
      />
    </>
  );
}
