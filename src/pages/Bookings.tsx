import { useState, useEffect, useMemo } from 'react';
import { Download, Search, Filter, MoreHorizontal, ChevronLeft, ChevronRight, Clock, CheckCircle, XCircle, AlertCircle, X, Mail, MapPin, Users, Calendar, Tag, User, CreditCard } from 'lucide-react';
import { supabase } from '../lib/supabase';

// ── Types ──────────────────────────────────────────────────────────────────────
interface Booking {
  id: string;
  venue_id: string | null;
  venue_name: string;
  venue_location: string | null;
  venue_type: string | null;
  service_name: string;
  service_price: string | null;
  service_duration: string | null;
  preferred_date: string;
  preferred_time: string | null;
  guest_count: number;
  customer_name: string;
  customer_email: string;
  special_requests: string | null;
  status: string;
  stripe_session_id: string | null;
  stripe_payment_intent_id: string | null;
  amount_total: number | null;
  created_at: string;
  user_id: string | null;
}

// ── Helpers ────────────────────────────────────────────────────────────────────
function formatDate(iso: string | null): string {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch { return iso; }
}

function formatPreferredDate(dateStr: string | null): string {
  if (!dateStr) return '—';
  try {
    // preferred_date is a plain date string (YYYY-MM-DD) — parse without timezone shift
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day).toLocaleDateString('en-AU', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
  } catch { return dateStr; }
}

function formatAmount(cents: number | null): string {
  if (cents === null || cents === undefined) return '—';
  return `$${(cents / 100).toFixed(2)}`;
}

function normaliseStatus(s: string): string {
  switch (s?.toLowerCase()) {
    case 'pending':   return 'Pending';
    case 'confirmed': return 'Confirmed';
    case 'cancelled':
    case 'canceled':  return 'Cancelled';
    case 'completed': return 'Completed';
    default:          return s ?? 'Pending';
  }
}

function referenceId(id: string): string {
  return `BKG-${id.slice(0, 6).toUpperCase()}`;
}

const PAGE_SIZE = 8;

// ── Booking Detail Modal ───────────────────────────────────────────────────────
interface BookingDetailModalProps {
  booking: Booking;
  onClose: () => void;
  onStatusUpdate: (id: string, status: string) => Promise<void>;
}

function BookingDetailModal({ booking, onClose, onStatusUpdate }: BookingDetailModalProps) {
  const [updating, setUpdating] = useState<string | null>(null);

  const handleStatusUpdate = async (newStatus: string) => {
    setUpdating(newStatus);
    await onStatusUpdate(booking.id, newStatus);
    setUpdating(null);
  };

  const statusActions: { label: string; value: string; style: React.CSSProperties }[] = [
    {
      label: 'Confirm',
      value: 'confirmed',
      style: { backgroundColor: '#E8F4EA', color: '#4A7C59', border: '1px solid #4A7C59' },
    },
    {
      label: 'Complete',
      value: 'completed',
      style: { backgroundColor: '#EEF3FB', color: '#6B8EC9', border: '1px solid #6B8EC9' },
    },
    {
      label: 'Cancel',
      value: 'cancelled',
      style: { backgroundColor: '#FCE8E8', color: '#C45C5C', border: '1px solid #C45C5C' },
    },
  ].filter(a => a.value !== booking.status.toLowerCase());

  const statusBadgeClass = (() => {
    switch (normaliseStatus(booking.status)) {
      case 'Confirmed':  return 'active';
      case 'Completed':  return 'active';
      case 'Pending':    return 'pending';
      case 'Cancelled':  return 'error';
      default:           return 'pending';
    }
  })();

  const statusIcon = (() => {
    switch (normaliseStatus(booking.status)) {
      case 'Pending':   return <Clock size={12} />;
      case 'Confirmed': return <CheckCircle size={12} />;
      case 'Completed': return <CheckCircle size={12} />;
      case 'Cancelled': return <XCircle size={12} />;
      default:          return null;
    }
  })();

  const DetailRow = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '10px 0', borderBottom: '1px solid rgba(184,184,184,0.15)' }}>
      <div style={{ color: '#B8B8B8', marginTop: 2, flexShrink: 0 }}>{icon}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', color: '#B8B8B8', textTransform: 'uppercase', marginBottom: 2 }}>{label}</div>
        <div style={{ fontSize: 13, color: '#313131' }}>{value || '—'}</div>
      </div>
    </div>
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" style={{ maxWidth: 620 }} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <h2 className="modal-title">Booking Details</h2>
              <span style={{ fontFamily: 'monospace', fontSize: 11, letterSpacing: 1, color: '#B8B8B8', fontWeight: 500 }}>
                {referenceId(booking.id)}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className={`status-badge ${statusBadgeClass}`}>
                {statusIcon}
                {normaliseStatus(booking.status)}
              </span>
              {booking.amount_total !== null && (
                <span style={{ fontSize: 13, fontWeight: 600, color: '#4A7C59' }}>
                  {formatAmount(booking.amount_total)}
                </span>
              )}
            </div>
          </div>
          <button className="modal-close" onClick={onClose}><X size={20} /></button>
        </div>

        {/* Body */}
        <div className="modal-body" style={{ padding: '8px 28px 24px' }}>

          {/* Guest Info */}
          <div style={{ marginBottom: 4, marginTop: 16, fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#B8B8B8' }}>
            Guest Information
          </div>
          <DetailRow icon={<User size={15} />} label="Name"  value={booking.customer_name} />
          <DetailRow icon={<Mail size={15} />} label="Email" value={
            <a href={`mailto:${booking.customer_email}`} style={{ color: '#313131', textDecoration: 'underline' }}>
              {booking.customer_email}
            </a>
          } />
          <DetailRow icon={<Users size={15} />} label="Guest Count" value={`${booking.guest_count} ${booking.guest_count === 1 ? 'guest' : 'guests'}`} />

          {/* Venue & Service */}
          <div style={{ marginBottom: 4, marginTop: 20, fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#B8B8B8' }}>
            Venue & Service
          </div>
          <DetailRow icon={<MapPin size={15} />} label="Venue" value={
            <span>
              {booking.venue_name}
              {booking.venue_type && <span style={{ color: '#B8B8B8', marginLeft: 6, fontSize: 11 }}>({booking.venue_type})</span>}
              {booking.venue_location && <div style={{ fontSize: 11, color: '#B8B8B8', marginTop: 2 }}>{booking.venue_location}</div>}
            </span>
          } />
          <DetailRow icon={<Tag size={15} />} label="Service" value={
            <span>
              {booking.service_name}
              {(booking.service_price || booking.service_duration) && (
                <span style={{ color: '#B8B8B8', marginLeft: 6, fontSize: 11 }}>
                  {[booking.service_duration, booking.service_price].filter(Boolean).join(' · ')}
                </span>
              )}
            </span>
          } />

          {/* Booking Details */}
          <div style={{ marginBottom: 4, marginTop: 20, fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#B8B8B8' }}>
            Booking Details
          </div>
          <DetailRow icon={<Calendar size={15} />} label="Preferred Date" value={
            booking.preferred_time
              ? `${formatPreferredDate(booking.preferred_date)} at ${booking.preferred_time}`
              : formatPreferredDate(booking.preferred_date)
          } />
          <DetailRow icon={<CreditCard size={15} />} label="Amount Paid" value={formatAmount(booking.amount_total)} />
          <DetailRow icon={<Clock size={15} />}     label="Booked On"    value={formatDate(booking.created_at)} />

          {/* Payment IDs */}
          {(booking.stripe_session_id || booking.stripe_payment_intent_id) && (
            <>
              <div style={{ marginBottom: 4, marginTop: 20, fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#B8B8B8' }}>
                Payment Reference
              </div>
              {booking.stripe_session_id && (
                <DetailRow icon={<CreditCard size={15} />} label="Stripe Session" value={
                  <span style={{ fontFamily: 'monospace', fontSize: 11, letterSpacing: 0.5, color: '#6B8EC9' }}>
                    {booking.stripe_session_id}
                  </span>
                } />
              )}
              {booking.stripe_payment_intent_id && (
                <DetailRow icon={<CreditCard size={15} />} label="Payment Intent" value={
                  <span style={{ fontFamily: 'monospace', fontSize: 11, letterSpacing: 0.5, color: '#6B8EC9' }}>
                    {booking.stripe_payment_intent_id}
                  </span>
                } />
              )}
            </>
          )}

          {/* Special Requests */}
          {booking.special_requests && (
            <div style={{ marginTop: 20 }}>
              <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#B8B8B8', marginBottom: 8 }}>
                Special Requests
              </div>
              <div style={{ backgroundColor: '#F7F5F1', borderRadius: 10, padding: '14px 16px', fontSize: 13, lineHeight: 1.7, color: '#313131', fontStyle: 'italic' }}>
                "{booking.special_requests}"
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button className="btn btn-secondary btn-small" onClick={onClose}>Close</button>
          {statusActions.length > 0 && (
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <span style={{ fontSize: 12, color: '#B8B8B8' }}>Update status:</span>
              {statusActions.map(action => (
                <button
                  key={action.value}
                  className="btn btn-small"
                  style={{ ...action.style, borderRadius: 20, opacity: updating ? 0.6 : 1, cursor: updating ? 'not-allowed' : 'pointer' }}
                  disabled={!!updating}
                  onClick={() => handleStatusUpdate(action.value)}
                >
                  {updating === action.value ? 'Saving…' : action.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Component ──────────────────────────────────────────────────────────────────
export default function Bookings() {
  const [activeTab, setActiveTab]             = useState(0);
  const [search, setSearch]                   = useState('');
  const [page, setPage]                       = useState(1);
  const [bookings, setBookings]               = useState<Booking[]>([]);
  const [loading, setLoading]                 = useState(true);
  const [error, setError]                     = useState('');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  // ── Fetch ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      const { data, error: err } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });
      if (err) { setError(err.message); }
      else { setBookings(data ?? []); }
      setLoading(false);
    };
    load();
  }, []);

  // ── Status update ─────────────────────────────────────────────────────────
  const updateStatus = async (id: string, newStatus: string) => {
    const { error: err } = await supabase
      .from('bookings')
      .update({ status: newStatus })
      .eq('id', id);
    if (!err) {
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));
      setSelectedBooking(prev => prev?.id === id ? { ...prev, status: newStatus } : prev);
    }
  };

  // ── Derived stats ──────────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const pending   = bookings.filter(b => b.status === 'pending').length;
    const confirmed = bookings.filter(b => b.status === 'confirmed').length;
    const completed = bookings.filter(b => b.status === 'completed').length;
    const cancelled = bookings.filter(b => ['cancelled', 'canceled'].includes(b.status)).length;
    const revenue   = bookings
      .filter(b => b.status !== 'cancelled' && b.status !== 'canceled')
      .reduce((sum, b) => sum + (b.amount_total ?? 0), 0);
    return { pending, confirmed, completed, cancelled, revenue };
  }, [bookings]);

  const tabDefs = [
    { label: 'All Bookings', count: bookings.length },
    { label: 'Pending',      count: stats.pending },
    { label: 'Confirmed',    count: stats.confirmed },
    { label: 'Completed',    count: stats.completed },
    { label: 'Cancelled',    count: stats.cancelled },
  ];

  // ── Tab filter ────────────────────────────────────────────────────────────
  const tabFiltered = useMemo(() => {
    const statusMap: Record<number, string[]> = {
      1: ['pending'],
      2: ['confirmed'],
      3: ['completed'],
      4: ['cancelled', 'canceled'],
    };
    if (activeTab === 0) return bookings;
    return bookings.filter(b => statusMap[activeTab].includes(b.status));
  }, [bookings, activeTab]);

  // ── Search filter ─────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    if (!search.trim()) return tabFiltered;
    const q = search.toLowerCase();
    return tabFiltered.filter(b =>
      (b.customer_name  ?? '').toLowerCase().includes(q) ||
      (b.customer_email ?? '').toLowerCase().includes(q) ||
      (b.venue_name     ?? '').toLowerCase().includes(q) ||
      (b.service_name   ?? '').toLowerCase().includes(q)
    );
  }, [tabFiltered, search]);

  // ── Pagination ────────────────────────────────────────────────────────────
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage   = Math.min(page, totalPages);
  const pageItems  = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const goToPage   = (p: number) => setPage(Math.max(1, Math.min(p, totalPages)));
  useEffect(() => { setPage(1); }, [activeTab, search]);

  // ── Badge helpers ─────────────────────────────────────────────────────────
  const statusIcon = (s: string) => {
    switch (normaliseStatus(s)) {
      case 'Pending':   return <Clock size={13} />;
      case 'Confirmed': return <CheckCircle size={13} />;
      case 'Completed': return <CheckCircle size={13} />;
      case 'Cancelled': return <XCircle size={13} />;
      default:          return <AlertCircle size={13} />;
    }
  };

  const statusClass = (s: string): string => {
    switch (normaliseStatus(s)) {
      case 'Pending':   return 'pending';
      case 'Confirmed': return 'active';
      case 'Completed': return 'active';
      case 'Cancelled': return 'error';
      default:          return 'pending';
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      <header className="page-header">
        <div>
          <h1 className="page-title">Bookings</h1>
          <p className="page-subtitle">Manage guest bookings and payments</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-secondary"><Download size={16} /> Export</button>
        </div>
      </header>

      {/* ── Stat Cards ───────────────────────────────────────────────────── */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <div className="stat-card">
          <div className="stat-label">Total Bookings</div>
          <div className="stat-value">{loading ? '…' : bookings.length}</div>
          <div className="stat-change positive">
            {loading ? '' : `${stats.pending} awaiting confirmation`}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Pending</div>
          <div className="stat-value" style={{ color: stats.pending > 0 ? '#D4A853' : undefined }}>
            {loading ? '…' : stats.pending}
          </div>
          <div className="stat-breakdown">Awaiting confirmation</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Confirmed</div>
          <div className="stat-value" style={{ color: '#4A7C59' }}>
            {loading ? '…' : stats.confirmed}
          </div>
          <div className="stat-breakdown">
            {loading ? '' : `${stats.completed} completed`}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Revenue</div>
          <div className="stat-value" style={{ color: '#4A7C59' }}>
            {loading ? '…' : `$${(stats.revenue / 100).toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          </div>
          <div className="stat-breakdown">Excl. cancelled bookings</div>
        </div>
      </div>

      {/* ── Tabs ─────────────────────────────────────────────────────────── */}
      <div className="tabs-container">
        {tabDefs.map((tab, i) => (
          <div
            key={i}
            className={`tab${activeTab === i ? ' active' : ''}`}
            onClick={() => setActiveTab(i)}
          >
            {tab.label} <span className="tab-count">{loading ? '–' : tab.count}</span>
          </div>
        ))}
      </div>

      {/* ── Toolbar ──────────────────────────────────────────────────────── */}
      <div className="toolbar">
        <div className="search-box">
          <Search size={18} color="#B8B8B8" />
          <input
            type="text"
            placeholder="Search by guest, email, venue, or service…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="toolbar-actions">
          <button className="filter-btn"><Filter size={16} /> Filters</button>
        </div>
      </div>

      {/* ── Table ────────────────────────────────────────────────────────── */}
      <div className="data-table-container">
        {error ? (
          <div style={{ padding: '40px 24px', textAlign: 'center', color: '#C45C5C', fontSize: 13 }}>
            Failed to load bookings: {error}
          </div>
        ) : loading ? (
          <div style={{ padding: '60px 24px', textAlign: 'center', color: '#B8B8B8', fontSize: 13 }}>
            Loading bookings…
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: '60px 24px', textAlign: 'center', color: '#B8B8B8', fontSize: 13 }}>
            {search ? 'No bookings match your search.' : 'No bookings found.'}
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Guest</th>
                <th>Venue</th>
                <th>Service</th>
                <th>Date</th>
                <th>Guests</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Booked</th>
                <th style={{ width: 50 }}></th>
              </tr>
            </thead>
            <tbody>
              {pageItems.map(b => (
                <tr
                  key={b.id}
                  onClick={() => setSelectedBooking(b)}
                  style={{ cursor: 'pointer' }}
                >
                  <td style={{ fontWeight: 500, fontSize: 11, fontFamily: 'monospace', letterSpacing: 1 }}>
                    {referenceId(b.id)}
                  </td>
                  <td>
                    <div style={{ fontWeight: 500 }}>{b.customer_name}</div>
                    <div style={{ fontSize: 12, color: '#B8B8B8' }}>{b.customer_email}</div>
                  </td>
                  <td>
                    <div>{b.venue_name}</div>
                    {b.venue_type && (
                      <div style={{ fontSize: 11, color: '#B8B8B8' }}>{b.venue_type}</div>
                    )}
                  </td>
                  <td>
                    <div style={{ fontSize: 13 }}>{b.service_name}</div>
                    {b.service_price && (
                      <div style={{ fontSize: 11, color: '#B8B8B8' }}>{b.service_price}</div>
                    )}
                  </td>
                  <td style={{ fontSize: 13 }}>
                    <div>{formatPreferredDate(b.preferred_date)}</div>
                    {b.preferred_time && (
                      <div style={{ fontSize: 11, color: '#B8B8B8' }}>{b.preferred_time}</div>
                    )}
                  </td>
                  <td style={{ fontSize: 13 }}>
                    {b.guest_count} {b.guest_count === 1 ? 'guest' : 'guests'}
                  </td>
                  <td style={{ fontSize: 13, fontWeight: 500 }}>
                    {formatAmount(b.amount_total)}
                  </td>
                  <td>
                    <span className={`status-badge ${statusClass(b.status)}`}>
                      {statusIcon(b.status)} {normaliseStatus(b.status)}
                    </span>
                  </td>
                  <td style={{ fontSize: 12, color: '#B8B8B8' }}>{formatDate(b.created_at)}</td>
                  <td onClick={ev => ev.stopPropagation()}>
                    <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8, color: '#B8B8B8' }}>
                      <MoreHorizontal size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* ── Pagination ─────────────────────────────────────────────────── */}
        {!loading && !error && filtered.length > 0 && (
          <div className="pagination">
            <div className="pagination-info">
              Showing {Math.min((safePage - 1) * PAGE_SIZE + 1, filtered.length)}–{Math.min(safePage * PAGE_SIZE, filtered.length)} of {filtered.length} booking{filtered.length !== 1 ? 's' : ''}
            </div>
            <div className="pagination-controls">
              <button className="page-btn" onClick={() => goToPage(safePage - 1)} disabled={safePage === 1}>
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                const start = Math.max(1, Math.min(safePage - 2, totalPages - 4));
                const p = start + i;
                return p <= totalPages ? (
                  <button
                    key={p}
                    className={`page-btn${safePage === p ? ' active' : ''}`}
                    onClick={() => goToPage(p)}
                  >
                    {p}
                  </button>
                ) : null;
              })}
              <button className="page-btn" onClick={() => goToPage(safePage + 1)} disabled={safePage === totalPages}>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Booking Detail Modal ───────────────────────────────────────────── */}
      {selectedBooking && (
        <BookingDetailModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          onStatusUpdate={updateStatus}
        />
      )}
    </>
  );
}
