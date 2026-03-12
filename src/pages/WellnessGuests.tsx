import { useState, useEffect, useCallback } from 'react';
import { Upload, Search, ChevronLeft, ChevronRight, Plus, X, Save, Loader, Trash2, Edit3 } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface WellnessGuest {
  id: string;
  venue_id: string | null;
  name: string;
  email: string | null;
  phone: string | null;
  notes: string | null;
  status: 'Active' | 'New' | 'Returning' | 'Inactive';
  total_spent: number;
  total_bookings: number;
  last_booking_venue: string | null;
  last_booking_date: string | null;
  created_at: string;
  updated_at: string;
}

const EMPTY_FORM: Omit<WellnessGuest, 'id' | 'created_at' | 'updated_at'> = {
  venue_id: null,
  name: '',
  email: null,
  phone: null,
  notes: null,
  status: 'New',
  total_spent: 0,
  total_bookings: 0,
  last_booking_venue: null,
  last_booking_date: null,
};

const STATUS_OPTIONS: WellnessGuest['status'][] = ['Active', 'New', 'Returning', 'Inactive'];

const tabs = [
  { label: 'All Guests', filter: null },
  { label: 'Active', filter: 'Active' },
  { label: 'New', filter: 'New' },
  { label: 'Returning', filter: 'Returning' },
  { label: 'Inactive', filter: 'Inactive' },
];

export default function WellnessGuests() {
  const [activeTab, setActiveTab] = useState(0);
  const [guests, setGuests] = useState<WellnessGuest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingGuest, setEditingGuest] = useState<WellnessGuest | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const perPage = 10;

  const fetchGuests = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('wellness_guests')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setGuests(data as WellnessGuest[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchGuests();
  }, [fetchGuests]);

  // Filtering
  const filtered = guests.filter(g => {
    const tab = tabs[activeTab];
    if (tab.filter && g.status !== tab.filter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        g.name.toLowerCase().includes(q) ||
        (g.email && g.email.toLowerCase().includes(q)) ||
        (g.phone && g.phone.toLowerCase().includes(q))
      );
    }
    return true;
  });

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  // Stats
  const totalGuests = guests.length;
  const activeGuests = guests.filter(g => g.status === 'Active').length;
  const returningGuests = guests.filter(g => g.status === 'Returning').length;
  const avgSpend = totalGuests > 0
    ? (guests.reduce((s, g) => s + (g.total_spent || 0), 0) / totalGuests).toFixed(0)
    : '0';
  const avgBookings = totalGuests > 0
    ? (guests.reduce((s, g) => s + (g.total_bookings || 0), 0) / totalGuests).toFixed(1)
    : '0';

  const tabCounts = [
    guests.length,
    guests.filter(g => g.status === 'Active').length,
    guests.filter(g => g.status === 'New').length,
    guests.filter(g => g.status === 'Returning').length,
    guests.filter(g => g.status === 'Inactive').length,
  ];

  // Form handlers
  const openAddModal = () => {
    setEditingGuest(null);
    setForm({ ...EMPTY_FORM });
    setShowModal(true);
  };

  const openEditModal = (guest: WellnessGuest) => {
    setEditingGuest(guest);
    setForm({
      venue_id: guest.venue_id,
      name: guest.name,
      email: guest.email,
      phone: guest.phone,
      notes: guest.notes,
      status: guest.status,
      total_spent: guest.total_spent,
      total_bookings: guest.total_bookings,
      last_booking_venue: guest.last_booking_venue,
      last_booking_date: guest.last_booking_date,
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingGuest(null);
    setForm({ ...EMPTY_FORM });
  };

  const handleSave = async () => {
    if (!form.name.trim()) return;
    setSaving(true);

    const payload = {
      name: form.name.trim(),
      email: form.email?.trim() || null,
      phone: form.phone?.trim() || null,
      notes: form.notes?.trim() || null,
      status: form.status,
      total_spent: Number(form.total_spent) || 0,
      total_bookings: Number(form.total_bookings) || 0,
      last_booking_venue: form.last_booking_venue?.trim() || null,
      last_booking_date: form.last_booking_date || null,
      updated_at: new Date().toISOString(),
    };

    if (editingGuest) {
      await supabase.from('wellness_guests').update(payload).eq('id', editingGuest.id);
    } else {
      await supabase.from('wellness_guests').insert([payload]);
    }

    setSaving(false);
    closeModal();
    fetchGuests();
  };

  const handleDelete = async (id: string) => {
    await supabase.from('wellness_guests').delete().eq('id', id);
    setDeleteConfirm(null);
    fetchGuests();
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatCurrency = (amount: number) => {
    return `$${Number(amount || 0).toLocaleString()}`;
  };

  return (
    <>
      <header className="page-header">
        <div>
          <h1 className="page-title">Wellness Guests</h1>
          <p className="page-subtitle">Manage guest profiles and booking history</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-secondary"><Upload size={16} /> Export</button>
          <button className="btn btn-primary" onClick={openAddModal}><Plus size={16} /> Add Guest</button>
        </div>
      </header>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Guests</div>
          <div className="stat-value">{totalGuests}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Active Guests</div>
          <div className="stat-value success">{activeGuests}</div>
          <div className="stat-breakdown">
            {totalGuests > 0 ? Math.round((returningGuests / totalGuests) * 100) : 0}% return rate
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Avg Spend per Guest</div>
          <div className="stat-value">${avgSpend}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Avg Bookings</div>
          <div className="stat-value">{avgBookings}</div>
          <div className="stat-breakdown">Per guest lifetime</div>
        </div>
      </div>

      <div className="tabs-container">
        {tabs.map((tab, i) => (
          <div key={i} className={`tab${activeTab === i ? ' active' : ''}`} onClick={() => { setActiveTab(i); setPage(1); }}>
            {tab.label} <span className="tab-count">{tabCounts[i]}</span>
          </div>
        ))}
      </div>

      <div className="toolbar">
        <div className="search-box">
          <Search size={18} color="#B8B8B8" />
          <input
            type="text"
            placeholder="Search guests by name, email, or phone..."
            value={searchQuery}
            onChange={e => { setSearchQuery(e.target.value); setPage(1); }}
          />
        </div>
      </div>

      <div className="data-table-container contact-list-table-container">
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}>
            <Loader size={24} className="spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 24px', color: '#B8B8B8' }}>
            <p style={{ fontSize: 16, marginBottom: 8 }}>No guests found</p>
            <p style={{ fontSize: 13 }}>Click "Add Guest" to manually add a wellness guest.</p>
          </div>
        ) : (
          <>
            <table className="data-table contact-list-table">
              <thead>
                <tr>
                  <th>Guest</th>
                  <th>Phone</th>
                  <th>Bookings</th>
                  <th>Last Booking</th>
                  <th>Total Spent</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th style={{ width: 80 }}></th>
                </tr>
              </thead>
              <tbody>
                {paginated.map(g => (
                  <tr key={g.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, #6B8EC9, #5a7db8)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 600, fontSize: 14, flexShrink: 0 }}>
                          {g.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontWeight: 500 }}>{g.name}</div>
                          <div style={{ fontSize: 12, color: '#B8B8B8' }}>{g.email || '—'}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ fontSize: 13, color: '#B8B8B8' }}>{g.phone || '—'}</td>
                    <td style={{ fontWeight: 500 }}>{g.total_bookings}</td>
                    <td>{g.last_booking_venue || '—'}</td>
                    <td style={{ fontWeight: 500 }}>{formatCurrency(g.total_spent)}</td>
                    <td>
                      <span className={`status-badge ${g.status === 'Active' ? 'active' : g.status === 'New' ? 'pending' : g.status === 'Returning' ? 'active' : 'inactive'}`}>
                        {g.status}
                      </span>
                    </td>
                    <td style={{ fontSize: 12, color: '#B8B8B8' }}>{formatDate(g.created_at)}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button
                          onClick={() => openEditModal(g)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, color: '#B8B8B8' }}
                          title="Edit guest"
                        >
                          <Edit3 size={15} />
                        </button>
                        {deleteConfirm === g.id ? (
                          <button
                            onClick={() => handleDelete(g.id)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, color: '#e74c3c' }}
                            title="Confirm delete"
                          >
                            <Trash2 size={15} />
                          </button>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirm(g.id)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, color: '#B8B8B8' }}
                            title="Delete guest"
                          >
                            <Trash2 size={15} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="pagination">
              <div className="pagination-info">Showing {(page - 1) * perPage + 1}-{Math.min(page * perPage, filtered.length)} of {filtered.length} guests</div>
              <div className="pagination-controls">
                <button className="page-btn" disabled={page <= 1} onClick={() => setPage(p => p - 1)}><ChevronLeft size={16} /></button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(p => (
                  <button key={p} className={`page-btn${page === p ? ' active' : ''}`} onClick={() => setPage(p)}>{p}</button>
                ))}
                <button className="page-btn" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}><ChevronRight size={16} /></button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Add / Edit Guest Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#1E1E1E', borderRadius: 12, width: '100%', maxWidth: 560, maxHeight: '90vh', overflow: 'auto', border: '1px solid #333' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid #333' }}>
              <h2 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>
                {editingGuest ? 'Edit Guest' : 'Add New Guest'}
              </h2>
              <button onClick={closeModal} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#B8B8B8', padding: 4 }}>
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Name */}
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6, color: '#ccc' }}>
                  Full Name <span style={{ color: '#e74c3c' }}>*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Emily Watson"
                  style={inputStyle}
                />
              </div>

              {/* Email & Phone row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={labelStyle}>Email</label>
                  <input
                    type="email"
                    value={form.email || ''}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    placeholder="email@example.com"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Phone</label>
                  <input
                    type="tel"
                    value={form.phone || ''}
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    placeholder="+1 234 567 890"
                    style={inputStyle}
                  />
                </div>
              </div>

              {/* Status */}
              <div>
                <label style={labelStyle}>Status</label>
                <select
                  value={form.status}
                  onChange={e => setForm(f => ({ ...f, status: e.target.value as WellnessGuest['status'] }))}
                  style={inputStyle}
                >
                  {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              {/* Bookings & Spend row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={labelStyle}>Total Bookings</label>
                  <input
                    type="number"
                    min={0}
                    value={form.total_bookings}
                    onChange={e => setForm(f => ({ ...f, total_bookings: parseInt(e.target.value) || 0 }))}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Total Spent ($)</label>
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    value={form.total_spent}
                    onChange={e => setForm(f => ({ ...f, total_spent: parseFloat(e.target.value) || 0 }))}
                    style={inputStyle}
                  />
                </div>
              </div>

              {/* Last Booking row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={labelStyle}>Last Booking Venue</label>
                  <input
                    type="text"
                    value={form.last_booking_venue || ''}
                    onChange={e => setForm(f => ({ ...f, last_booking_venue: e.target.value }))}
                    placeholder="e.g. Moraea Farm"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Last Booking Date</label>
                  <input
                    type="date"
                    value={form.last_booking_date || ''}
                    onChange={e => setForm(f => ({ ...f, last_booking_date: e.target.value }))}
                    style={inputStyle}
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label style={labelStyle}>Notes</label>
                <textarea
                  value={form.notes || ''}
                  onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                  placeholder="Any additional notes about this guest..."
                  rows={3}
                  style={{ ...inputStyle, resize: 'vertical' }}
                />
              </div>
            </div>

            {/* Footer */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, padding: '16px 24px', borderTop: '1px solid #333' }}>
              <button onClick={closeModal} className="btn btn-secondary">Cancel</button>
              <button
                onClick={handleSave}
                disabled={saving || !form.name.trim()}
                className="btn btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: 6 }}
              >
                {saving ? <Loader size={16} className="spin" /> : <Save size={16} />}
                {editingGuest ? 'Update Guest' : 'Add Guest'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 13,
  fontWeight: 500,
  marginBottom: 6,
  color: '#ccc',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 12px',
  background: '#2a2a2a',
  border: '1px solid #444',
  borderRadius: 8,
  color: '#fff',
  fontSize: 14,
  outline: 'none',
  boxSizing: 'border-box',
};
