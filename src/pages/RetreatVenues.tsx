import { Upload, Plus, Search, Filter, SlidersHorizontal, MoreHorizontal, ChevronLeft, ChevronRight, Eye, Edit3, Trash2, CheckCircle, Loader2 } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVenues } from '../context/VenueContext';
import type { Venue } from '../context/VenueContext';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import CreateRetreatModal from '../components/CreateRetreatModal';

export default function RetreatVenues() {
    const { venues, loading, deleteVenue, addVenue } = useVenues();
    const navigate = useNavigate();
    const [showCreateModal, setShowCreateModal] = useState(false);

    const [activeTab, setActiveTab] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [deletingVenue, setDeletingVenue] = useState<Venue | null>(null);
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const [toast, setToast] = useState<{ message: string; type: string } | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);

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

    // Filter venues to only include Retreats, then apply tab/search filters
    const retreatVenues = venues.filter(v => v.type === 'Retreat');

    const filteredVenues = retreatVenues.filter((v) => {
        const matchesSearch =
            searchQuery === '' ||
            v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            v.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
            v.owner.toLowerCase().includes(searchQuery.toLowerCase());

        switch (activeTab) {
            case 1: return matchesSearch && v.status === 'Active';
            case 2: return matchesSearch && v.status === 'Draft';
            case 3: return matchesSearch && v.status === 'Inactive';
            default: return matchesSearch;
        }
    });

    // Dynamic tab counts for Retreats
    const tabCounts = [
        retreatVenues.length,
        retreatVenues.filter((v) => v.status === 'Active').length,
        retreatVenues.filter((v) => v.status === 'Draft').length,
        retreatVenues.filter((v) => v.status === 'Inactive').length,
    ];

    const tabs = [
        { label: 'All Retreats' },
        { label: 'Active' },
        { label: 'Draft' },
        { label: 'Inactive' },
    ];

    const handleDelete = async () => {
        if (deletingVenue) {
            const name = deletingVenue.name;
            try {
                await deleteVenue(deletingVenue.id);
                showToast(`"${name}" has been deleted`, 'error');
                setDeletingVenue(null);
            } catch (err) {
                showToast('Failed to delete venue', 'error');
            }
        }
    };

    const toggleSelect = (id: string) => {
        setSelectedIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id); else next.add(id);
            return next;
        });
    };

    const toggleSelectAll = () => {
        if (selectedIds.size === filteredVenues.length && filteredVenues.length > 0) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(filteredVenues.map(v => v.id)));
        }
    };

    const handleBulkDelete = async () => {
        const count = selectedIds.size;
        try {
            await Promise.all([...selectedIds].map(id => deleteVenue(id)));
            showToast(`${count} venue(s) deleted`, 'error');
            setSelectedIds(new Set());
        } catch (err) {
            showToast('Failed to delete some venues', 'error');
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
                    <h1 className="page-title">Retreat Venues</h1>
                    <p className="page-subtitle">Manage all retreat venue listings across the platform</p>
                </div>
                <div className="header-actions">
                    <button className="btn btn-secondary"><Upload size={16} /> Export</button>
                    <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
                        <Plus size={16} /> Add Retreat
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
                        placeholder="Search retreats by name, location, or owner..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="toolbar-actions">
                    <button className="filter-btn"><Filter size={16} /> Filters</button>
                    <button className="filter-btn"><SlidersHorizontal size={16} /> Columns</button>
                </div>
            </div>

            {selectedIds.size > 0 && (
                <div className="bulk-action-bar">
                    <span className="bulk-count">{selectedIds.size} retreat{selectedIds.size !== 1 ? 's' : ''} selected</span>
                    <button className="btn btn-danger" onClick={() => setShowBulkDeleteModal(true)}>
                        <Trash2 size={14} /> Delete Selected
                    </button>
                    <button className="btn btn-secondary" onClick={() => setSelectedIds(new Set())}>
                        Clear
                    </button>
                </div>
            )}

            <div className="data-table-container venue-list-table-container">
                <table className="data-table venue-list-table">
                    <thead>
                        <tr>
                            <th style={{ width: 40 }}>
                                <input
                                    type="checkbox"
                                    checked={filteredVenues.length > 0 && selectedIds.size === filteredVenues.length}
                                    ref={(el) => { if (el) el.indeterminate = selectedIds.size > 0 && selectedIds.size < filteredVenues.length; }}
                                    onChange={toggleSelectAll}
                                />
                            </th>
                            <th className="sortable">Venue Name</th>
                            <th className="sortable">Location</th>
                            <th className="sortable">Capacity</th>
                            <th className="sortable">Status</th>
                            <th className="sortable">Subscription</th>
                            <th className="sortable">Added</th>
                            <th style={{ width: 50 }}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={8} style={{ textAlign: 'center', padding: '48px 20px' }}>
                                    <Loader2 className="animate-spin" size={32} style={{ margin: '0 auto', color: '#8B4513' }} />
                                    <div style={{ marginTop: 12, color: '#666' }}>Loading retreats...</div>
                                </td>
                            </tr>
                        ) : filteredVenues.length === 0 ? (
                            <tr>
                                <td colSpan={8} style={{ textAlign: 'center', padding: '48px 20px', color: '#B8B8B8' }}>
                                    <div style={{ fontSize: 16, marginBottom: 8 }}>No retreat venues found</div>
                                    <div style={{ fontSize: 13 }}>
                                        {searchQuery ? 'Try adjusting your search or filters' : 'Click "Add Retreat" to create your first venue'}
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            filteredVenues.map((v) => (
                                <tr key={v.id} style={selectedIds.has(v.id) ? { backgroundColor: 'rgba(245, 158, 11, 0.06)' } : {}}>
                                    <td onClick={(e) => e.stopPropagation()}>
                                        <input type="checkbox" checked={selectedIds.has(v.id)} onChange={() => toggleSelect(v.id)} />
                                    </td>
                                    <td onClick={() => navigate(`/venues/${v.id}`)} style={{ cursor: 'pointer' }}>
                                        <div style={{ fontWeight: 500 }}>{v.name}</div>
                                        <div style={{ fontSize: 12, color: '#B8B8B8' }}>{v.location}</div>
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
                                                    <button className="action-menu-item" onClick={() => { setOpenMenuId(null); navigate(`/venues/${v.id}`); }}>
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
                        <div className="pagination-info">Showing 1-{filteredVenues.length} of {filteredVenues.length} retreats</div>
                        <div className="pagination-controls">
                            <button className="page-btn"><ChevronLeft size={16} /></button>
                            <button className="page-btn active">1</button>
                            <button className="page-btn"><ChevronRight size={16} /></button>
                        </div>
                    </div>
                )}
            </div>

            {/* Create Retreat Modal */}
            <CreateRetreatModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onSubmit={async (data) => {
                    await addVenue(data);
                    setShowCreateModal(false);
                }}
            />

            {/* Bulk Delete Modal */}
            <DeleteConfirmModal
                isOpen={showBulkDeleteModal}
                onClose={() => setShowBulkDeleteModal(false)}
                onConfirm={handleBulkDelete}
                venueName={`${selectedIds.size} selected retreat${selectedIds.size !== 1 ? 's' : ''}`}
            />

            {/* Single Delete Modal */}
            <DeleteConfirmModal
                isOpen={!!deletingVenue}
                onClose={() => setDeletingVenue(null)}
                onConfirm={handleDelete}
                venueName={deletingVenue?.name || ''}
            />
        </>
    );
}
