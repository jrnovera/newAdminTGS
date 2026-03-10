import { useState, useEffect, useMemo } from 'react';
import { Download, Search, Filter, MoreHorizontal, ChevronLeft, ChevronRight, Clock, CheckCircle, XCircle, AlertCircle, X, Mail, MapPin, Users, Calendar, Tag, User, CreditCard, Smartphone, Monitor } from 'lucide-react';
import { supabase } from '../lib/supabase';

// ── Types ──────────────────────────────────────────────────────────────────────
// Mirrors the venue_bookings table (single source of truth for all bookings).
// Admin bookings: source='admin', amount=direct $, amount_total=null
// Client Stripe bookings: source='client', amount=parsed display $, amount_total=cents from Stripe
interface Booking {
  id: string;
  venue_id: string | null;
  venue_name: string | null;
  venue_location: string | null;
  venue_type: string | null;
  guest_name: string;
  guest_email: string | null;
  guest_phone: string | null;
  service_name: string | null;
  service_price: string | null;
  service_duration: string | null;
  check_in_date: string;
  check_out_date: string | null;
  time_slot: string | null;
  guests: number;
  amount: number | null;
  amount_total: number | null;
  status: string;
  notes: string | null;
  source: string | null;
  booking_type: string | null;
  practitioner_name: string | null;
  add_ons: { name: string; price: number }[] | null;
  stripe_session_id: string | null;
  stripe_payment_intent_id: string | null;
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

function formatCheckInDate(dateStr: string | null): string {
  if (!dateStr) return '—';
  try {
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day).toLocaleDateString('en-AU', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
  } catch { return dateStr; }
}

// Client bookings: amount_total in cents from Stripe; admin bookings: amount in direct $
function displayAmount(b: Booking): string {
  if (b.amount_total !== null && b.amount_total !== undefined) {
    return `$${(b.amount_total / 100).toFixed(2)}`;
  }
  if (b.amount !== null && b.amount !== undefined) {
    return `$${b.amount.toFixed(2)}`;
  }
  return '—';
}

function revenueValue(b: Booking): number {
  if (b.amount_total !== null && b.amount_total !== undefined) return b.amount_total / 100;
  return b.amount ?? 0;
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

const PAGE_SIZE = 10;

// ── Booking Detail Modal ───────────────────────────────────────────────────────
interface BookingDetailModalProps {
  booking: Booking;
  onClose: () => void;
  onStatusUpdate: (id: string, status: string) => Promise<void>;
}

function BookingDetailModal({ booking, onClose, onStatusUpdate }: BookingDetailModalProps) {
  const [updating, setUpdating] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(booking.status?.toLowerCase() ?? 'pending');

  const handleStatusChange = async (newStatus: string) => {
    setSelectedStatus(newStatus);
    setUpdating(true);
    await onStatusUpdate(booking.id, newStatus);
    setUpdating(false);
  };

  const statusBadgeClass = (() => {
    switch (normaliseStatus(booking.status)) {
      case 'Confirmed': case 'Completed': return 'active';
      case 'Pending':   return 'pending';
      case 'Cancelled': return 'error';
      default:          return 'pending';
    }
  })();

  const statusIcon = (() => {
    switch (normaliseStatus(booking.status)) {
      case 'Pending':   return <Clock size={12} />;
      case 'Confirmed': case 'Completed': return <CheckCircle size={12} />;
      case 'Cancelled': return <XCircle size={12} />;
      default: return null;
    }
  })();

  const DetailRow = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '10px 0', borderBottom: '1px solid rgba(184,184,184,0.12)' }}>
      <div style={{ color: '#B8B8B8', marginTop: 2, flexShrink: 0 }}>{icon}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', color: '#B8B8B8', textTransform: 'uppercase', marginBottom: 2 }}>{label}</div>
        <div style={{ fontSize: 13, color: '#313131' }}>{value || '—'}</div>
      </div>
    </div>
  );

  const SectionLabel = ({ children }: { children: string }) => (
    <div style={{ marginTop: 20, marginBottom: 4, fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#B8B8B8' }}>
      {children}
    </div>
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container modal-detail" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <h2 className="modal-title">Booking Details</h2>
              <span style={{ fontFamily: 'monospace', fontSize: 11, letterSpacing: 1, color: '#B8B8B8', fontWeight: 500 }}>
                {referenceId(booking.id)}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <span className={`status-badge ${statusBadgeClass}`}>
                {statusIcon}{normaliseStatus(booking.status)}
              </span>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#4A7C59' }}>
                {displayAmount(booking)}
              </span>
              {booking.source && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#B8B8B8', border: '1px solid rgba(184,184,184,0.3)', borderRadius: 20, padding: '2px 8px' }}>
                  {booking.source === 'client'
                    ? <><Smartphone size={10} /> Online</>
                    : <><Monitor size={10} /> Admin</>
                  }
                </span>
              )}
              {booking.booking_type && booking.booking_type !== 'service' && (
                <span style={{ fontSize: 11, color: '#B8B8B8', border: '1px solid rgba(184,184,184,0.3)', borderRadius: 20, padding: '2px 8px', textTransform: 'capitalize' }}>
                  {booking.booking_type}
                </span>
              )}
            </div>
          </div>
          <button className="modal-close" onClick={onClose}><X size={20} /></button>
        </div>

        {/* Body */}
        <div className="modal-body modal-body-detail">

          {/* Guest Info */}
          <SectionLabel>Guest Information</SectionLabel>
          <DetailRow icon={<User size={15} />}  label="Name"  value={booking.guest_name} />
          <DetailRow icon={<Mail size={15} />}  label="Email" value={
            booking.guest_email
              ? <a href={`mailto:${booking.guest_email}`} style={{ color: '#313131', textDecoration: 'underline' }}>{booking.guest_email}</a>
              : null
          } />
          {booking.guest_phone && (
            <DetailRow icon={<User size={15} />} label="Phone" value={booking.guest_phone} />
          )}
          <DetailRow icon={<Users size={15} />} label="Guests" value={`${booking.guests} ${booking.guests === 1 ? 'guest' : 'guests'}`} />

          {/* Venue & Service */}
          <SectionLabel>Venue & Service</SectionLabel>
          <DetailRow icon={<MapPin size={15} />} label="Venue" value={
            <span>
              {booking.venue_name || '—'}
              {booking.venue_type && <span style={{ color: '#B8B8B8', marginLeft: 6, fontSize: 11 }}>({booking.venue_type})</span>}
              {booking.venue_location && <div style={{ fontSize: 11, color: '#B8B8B8', marginTop: 2 }}>{booking.venue_location}</div>}
            </span>
          } />
          <DetailRow icon={<Tag size={15} />} label="Service" value={
            <span>
              {booking.service_name || '—'}
              {(booking.service_duration || booking.service_price) && (
                <span style={{ color: '#B8B8B8', marginLeft: 6, fontSize: 11 }}>
                  {[booking.service_duration, booking.service_price].filter(Boolean).join(' · ')}
                </span>
              )}
            </span>
          } />
          {booking.practitioner_name && (
            <DetailRow icon={<User size={15} />} label="Practitioner" value={booking.practitioner_name} />
          )}

          {/* Booking Schedule */}
          <SectionLabel>Booking Schedule</SectionLabel>
          <DetailRow icon={<Calendar size={15} />} label="Date & Time" value={
            booking.time_slot
              ? `${formatCheckInDate(booking.check_in_date)} at ${booking.time_slot}`
              : formatCheckInDate(booking.check_in_date)
          } />
          {booking.check_out_date && (
            <DetailRow icon={<Calendar size={15} />} label="Check-out" value={formatCheckInDate(booking.check_out_date)} />
          )}
          <DetailRow icon={<CreditCard size={15} />} label="Amount Paid" value={displayAmount(booking)} />
          <DetailRow icon={<Clock size={15} />}     label="Booked On"   value={formatDate(booking.created_at)} />

          {/* Add-ons */}
          {booking.add_ons && booking.add_ons.length > 0 && (
            <>
              <SectionLabel>Add-ons Purchased</SectionLabel>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8 }}>
                {booking.add_ons.map((a, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#313131', backgroundColor: '#F7F5F1', borderRadius: 8, padding: '8px 14px' }}>
                    <span>{a.name}</span>
                    <span style={{ fontWeight: 500 }}>${a.price.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Special Requests / Notes */}
          {booking.notes && (
            <>
              <SectionLabel>Notes / Special Requests</SectionLabel>
              <div style={{ backgroundColor: '#F7F5F1', borderRadius: 10, padding: '14px 16px', fontSize: 13, lineHeight: 1.7, color: '#313131', fontStyle: 'italic' }}>
                "{booking.notes}"
              </div>
            </>
          )}

          {/* Payment References */}
          {(booking.stripe_session_id || booking.stripe_payment_intent_id) && (
            <>
              <SectionLabel>Payment Reference</SectionLabel>
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
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button className="btn btn-secondary btn-small" onClick={onClose}>Close</button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 12, color: '#B8B8B8', flexShrink: 0 }}>Update status:</span>
            <select
              value={selectedStatus}
              onChange={e => handleStatusChange(e.target.value)}
              disabled={updating}
              style={{
                fontSize: 13,
                padding: '6px 32px 6px 12px',
                borderRadius: 20,
                border: '1px solid rgba(184,184,184,0.4)',
                backgroundColor: '#fff',
                color: (selectedStatus === 'confirmed' || selectedStatus === 'completed') ? '#4A7C59'
                     : selectedStatus === 'pending' ? '#D4A853'
                     : '#C45C5C',
                fontWeight: 500,
                cursor: updating ? 'not-allowed' : 'pointer',
                opacity: updating ? 0.6 : 1,
                outline: 'none',
                appearance: 'none',
                WebkitAppearance: 'none',
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23B8B8B8' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 10px center',
              }}
            >
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            {updating && <span style={{ fontSize: 12, color: '#B8B8B8' }}>Saving…</span>}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function Bookings() {
  const [activeTab, setActiveTab]             = useState(0);
  const [search, setSearch]                   = useState('');
  const [page, setPage]                       = useState(1);
  const [bookings, setBookings]               = useState<Booking[]>([]);
  const [loading, setLoading]                 = useState(true);
  const [error, setError]                     = useState('');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  // ── Fetch from venue_bookings (single source of truth) ────────────────────
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      const { data, error: err } = await supabase
        .from('venue_bookings')
        .select('*')
        .order('created_at', { ascending: false });
      if (err) { setError(err.message); }
      else { setBookings((data ?? []) as Booking[]); }
      setLoading(false);
    };
    load();
  }, []);

  // ── Status update ─────────────────────────────────────────────────────────
  const updateStatus = async (id: string, newStatus: string) => {
    const { error: err } = await supabase
      .from('venue_bookings')
      .update({ status: newStatus })
      .eq('id', id);
    if (!err) {
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));
      setSelectedBooking(prev => prev?.id === id ? { ...prev, status: newStatus } : prev);
    }
  };

  // ── Stats ─────────────────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const pending   = bookings.filter(b => b.status === 'pending').length;
    const confirmed = bookings.filter(b => b.status === 'confirmed').length;
    const completed = bookings.filter(b => b.status === 'completed').length;
    const cancelled = bookings.filter(b => ['cancelled', 'canceled'].includes(b.status)).length;
    const revenue   = bookings
      .filter(b => !['cancelled', 'canceled'].includes(b.status))
      .reduce((sum, b) => sum + revenueValue(b), 0);
    return { pending, confirmed, completed, cancelled, revenue };
  }, [bookings]);

  const tabDefs = [
    { label: 'All Bookings', count: bookings.length },
    { label: 'Pending',      count: stats.pending },
    { label: 'Confirmed',    count: stats.confirmed },
    { label: 'Completed',    count: stats.completed },
    { label: 'Cancelled',    count: stats.cancelled },
  ];

  // ── Tab + search filter ───────────────────────────────────────────────────
  const tabFiltered = useMemo(() => {
    const statusMap: Record<number, string[]> = {
      1: ['pending'], 2: ['confirmed'], 3: ['completed'], 4: ['cancelled', 'canceled'],
    };
    if (activeTab === 0) return bookings;
    return bookings.filter(b => statusMap[activeTab].includes(b.status));
  }, [bookings, activeTab]);

  const filtered = useMemo(() => {
    if (!search.trim()) return tabFiltered;
    const q = search.toLowerCase();
    return tabFiltered.filter(b =>
      (b.guest_name    ?? '').toLowerCase().includes(q) ||
      (b.guest_email   ?? '').toLowerCase().includes(q) ||
      (b.venue_name    ?? '').toLowerCase().includes(q) ||
      (b.service_name  ?? '').toLowerCase().includes(q)
    );
  }, [tabFiltered, search]);

  // ── Pagination ────────────────────────────────────────────────────────────
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage   = Math.min(page, totalPages);
  const pageItems  = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const goToPage   = (p: number) => setPage(Math.max(1, Math.min(p, totalPages)));
  useEffect(() => { setPage(1); }, [activeTab, search]);

  // ── Status badge helpers ──────────────────────────────────────────────────
  const statusIcon = (s: string) => {
    switch (normaliseStatus(s)) {
      case 'Pending':   return <Clock size={13} />;
      case 'Confirmed': case 'Completed': return <CheckCircle size={13} />;
      case 'Cancelled': return <XCircle size={13} />;
      default:          return <AlertCircle size={13} />;
    }
  };

  const statusClass = (s: string): string => {
    switch (normaliseStatus(s)) {
      case 'Confirmed': case 'Completed': return 'active';
      case 'Pending':   return 'pending';
      case 'Cancelled': return 'error';
      default:          return 'pending';
    }
  };

  // ── Export CSV ────────────────────────────────────────────────────────────
  const handleExport = () => {
    const rows = [
      ['Ref', 'Guest', 'Email', 'Phone', 'Venue', 'Service', 'Date', 'Time', 'Guests', 'Amount', 'Status', 'Source', 'Booked On'],
      ...filtered.map(b => [
        referenceId(b.id),
        b.guest_name,
        b.guest_email ?? '',
        b.guest_phone ?? '',
        b.venue_name ?? '',
        b.service_name ?? '',
        b.check_in_date,
        b.time_slot ?? '',
        String(b.guests),
        displayAmount(b),
        normaliseStatus(b.status),
        b.source ?? '',
        formatDate(b.created_at),
      ]),
    ];
    const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `tgs-bookings-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
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
          <button className="btn btn-secondary" onClick={handleExport}>
            <Download size={16} /> Export
          </button>
        </div>
      </header>

      {/* ── Stat Cards ───────────────────────────────────────────────────── */}
      <div className="stats-grid">
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
            {loading ? '…' : `$${stats.revenue.toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
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
      <div className="data-table-container record-list-table-container">
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
          <table className="data-table record-list-table">
            <thead>
              <tr>
                <th>Ref</th>
                <th>Guest</th>
                <th>Venue</th>
                <th>Service</th>
                <th>Date & Time</th>
                <th>Guests</th>
                <th>Amount</th>
                <th>Source</th>
                <th>Status</th>
                <th>Booked</th>
                <th style={{ width: 40 }}></th>
              </tr>
            </thead>
            <tbody>
              {pageItems.map(b => (
                <tr
                  key={b.id}
                  onClick={() => setSelectedBooking(b)}
                  style={{ cursor: 'pointer' }}
                >
                  <td style={{ fontWeight: 500, fontSize: 11, fontFamily: 'monospace', letterSpacing: 1, color: '#B8B8B8' }}>
                    {referenceId(b.id)}
                  </td>
                  <td>
                    <div style={{ fontWeight: 500 }}>{b.guest_name}</div>
                    {b.guest_email && <div style={{ fontSize: 12, color: '#B8B8B8' }}>{b.guest_email}</div>}
                  </td>
                  <td>
                    <div>{b.venue_name || '—'}</div>
                    {b.venue_type && <div style={{ fontSize: 11, color: '#B8B8B8' }}>{b.venue_type}</div>}
                  </td>
                  <td>
                    <div style={{ fontSize: 13 }}>{b.service_name || '—'}</div>
                    {b.service_price && <div style={{ fontSize: 11, color: '#B8B8B8' }}>{b.service_price}</div>}
                  </td>
                  <td style={{ fontSize: 13 }}>
                    <div>{formatCheckInDate(b.check_in_date)}</div>
                    {b.time_slot && <div style={{ fontSize: 11, color: '#B8B8B8' }}>{b.time_slot}</div>}
                  </td>
                  <td style={{ fontSize: 13 }}>
                    {b.guests} {b.guests === 1 ? 'guest' : 'guests'}
                  </td>
                  <td style={{ fontSize: 13, fontWeight: 500 }}>
                    {displayAmount(b)}
                  </td>
                  <td>
                    {b.source === 'client' ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#6B8EC9' }}>
                        <Smartphone size={11} /> Online
                      </span>
                    ) : b.source === 'admin' ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#B8B8B8' }}>
                        <Monitor size={11} /> Admin
                      </span>
                    ) : (
                      <span style={{ fontSize: 11, color: '#B8B8B8' }}>—</span>
                    )}
                  </td>
                  <td>
                    <span className={`status-badge ${statusClass(b.status)}`}>
                      {statusIcon(b.status)} {normaliseStatus(b.status)}
                    </span>
                  </td>
                  <td style={{ fontSize: 12, color: '#B8B8B8' }}>{formatDate(b.created_at)}</td>
                  <td onClick={ev => ev.stopPropagation()}>
                    <button
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8, color: '#B8B8B8' }}
                      onClick={() => setSelectedBooking(b)}
                    >
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
                  <button key={p} className={`page-btn${safePage === p ? ' active' : ''}`} onClick={() => goToPage(p)}>
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
