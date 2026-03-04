import { useState, useEffect, useCallback } from 'react';
import { Calendar, Download, RefreshCw, Check, X, Users, Clock } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Venue } from '../context/VenueContext';

interface BookingsTabProps {
    venue: Venue;
    onUpdate?: (updates: Partial<Venue>) => void;
}

interface DateBlock {
    id: string;
    block_date: string; // YYYY-MM-DD
    reason: string | null;
}

interface Booking {
    id: string;
    guest_name: string;
    guest_email: string | null;
    guest_phone: string | null;
    service_name: string | null;
    check_in_date: string;
    check_out_date: string | null;
    time_slot: string | null;
    guests: number;
    amount: number | null;
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
    notes: string | null;
    source: string;
}

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const WEEKDAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

function toDateKey(year: number, month: number, day: number): string {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function formatDateKey(dateStr: string): string {
    const d = new Date(dateStr + 'T00:00:00');
    return `${d.toLocaleString('en', { month: 'short' })} ${d.getDate()}, ${d.getFullYear()}`;
}

// Get all dates between check_in and check_out (inclusive) for range blocking
function dateRange(startStr: string, endStr: string | null): string[] {
    if (!endStr) return [startStr];
    const dates: string[] = [];
    const cur = new Date(startStr + 'T00:00:00');
    const end = new Date(endStr + 'T00:00:00');
    while (cur <= end) {
        dates.push(cur.toISOString().slice(0, 10));
        cur.setDate(cur.getDate() + 1);
    }
    return dates;
}

export default function BookingsTab({ venue }: BookingsTabProps) {
    const today = new Date();
    const [viewYear, setViewYear]   = useState(today.getFullYear());
    const [viewMonth, setViewMonth] = useState(today.getMonth());

    const [selectedDates, setSelectedDates] = useState<Set<string>>(new Set());

    const [blocks, setBlocks]     = useState<DateBlock[]>([]);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading]   = useState(true);

    const [activeSubTab, setActiveSubTab] = useState('All');

    const [showBlockModal, setShowBlockModal] = useState(false);
    const [blockReason, setBlockReason]       = useState('');
    const [blockSaving, setBlockSaving]       = useState(false);

    const [showBookingModal, setShowBookingModal] = useState(false);
    const [bookingForm, setBookingForm] = useState({
        guest_name: '',
        guest_email: '',
        guest_phone: '',
        service_name: '',
        check_out_date: '',
        guests: 1,
        amount: '',
        notes: '',
        status: 'confirmed' as Booking['status'],
    });
    const [bookingSaving, setBookingSaving] = useState(false);

    // -------------------------------------------------------------------------
    // Fetch
    // -------------------------------------------------------------------------
    const fetchData = useCallback(async () => {
        if (!venue.id) return;
        setLoading(true);
        const [blocksRes, bookingsRes] = await Promise.all([
            supabase.from('venue_date_blocks').select('id, block_date, reason').eq('venue_id', venue.id),
            supabase.from('venue_bookings').select('*').eq('venue_id', venue.id).order('check_in_date', { ascending: false }),
        ]);
        setBlocks(blocksRes.data || []);
        setBookings(bookingsRes.data || []);
        setLoading(false);
    }, [venue.id]);

    useEffect(() => { fetchData(); }, [fetchData]);

    // -------------------------------------------------------------------------
    // Calendar helpers
    // -------------------------------------------------------------------------
    const blockedSet = new Set(blocks.map(b => b.block_date));

    // For retreat venues, bookings span multiple nights — expand all dates in range
    const bookedDates = new Set<string>();
    const pendingDates = new Set<string>();
    bookings.forEach(b => {
        const dates = dateRange(b.check_in_date, b.check_out_date);
        if (b.status === 'confirmed') dates.forEach(d => bookedDates.add(d));
        if (b.status === 'pending')   dates.forEach(d => pendingDates.add(d));
    });

    const daysInMonth    = new Date(viewYear, viewMonth + 1, 0).getDate();
    const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay();
    const daysInPrev     = new Date(viewYear, viewMonth, 0).getDate();

    function prevMonth() {
        if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
        else setViewMonth(m => m - 1);
        setSelectedDates(new Set());
    }
    function nextMonth() {
        if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
        else setViewMonth(m => m + 1);
        setSelectedDates(new Set());
    }

    function toggleDate(key: string) {
        setSelectedDates(prev => {
            const next = new Set(prev);
            if (next.has(key)) next.delete(key);
            else next.add(key);
            return next;
        });
    }

    function getDayClass(key: string, isToday: boolean): string {
        const classes = ['calendar-day'];
        if (isToday) classes.push('today');
        if (selectedDates.has(key)) classes.push('selected');
        if (blockedSet.has(key)) classes.push('blocked');
        else if (pendingDates.has(key)) classes.push('enquiry');
        else if (bookedDates.has(key)) classes.push('booked');
        return classes.join(' ');
    }

    function getDayIndicator(key: string): string {
        if (blockedSet.has(key)) return 'blocked';
        if (pendingDates.has(key)) return 'pending';
        if (bookedDates.has(key)) return 'confirmed';
        return '';
    }

    const totalCells = 42;
    const cellsBefore = firstDayOfWeek;
    const cellsAfter  = totalCells - cellsBefore - daysInMonth;
    const todayKey = toDateKey(today.getFullYear(), today.getMonth(), today.getDate());

    // -------------------------------------------------------------------------
    // Block Dates
    // -------------------------------------------------------------------------
    async function handleBlockDates() {
        if (selectedDates.size === 0) return;
        setBlockSaving(true);
        const rows = Array.from(selectedDates).map(d => ({
            venue_id: venue.id,
            block_date: d,
            reason: blockReason || null,
        }));
        const { error } = await supabase
            .from('venue_date_blocks')
            .upsert(rows, { onConflict: 'venue_id,block_date' });
        if (!error) {
            await fetchData();
            setShowBlockModal(false);
            setBlockReason('');
            setSelectedDates(new Set());
        }
        setBlockSaving(false);
    }

    async function handleUnblockDate(id: string) {
        await supabase.from('venue_date_blocks').delete().eq('id', id);
        await fetchData();
    }

    // -------------------------------------------------------------------------
    // Add Booking
    // -------------------------------------------------------------------------
    async function handleAddBooking() {
        if (selectedDates.size === 0 || !bookingForm.guest_name) return;
        setBookingSaving(true);
        const sortedDates = Array.from(selectedDates).sort();
        const checkIn = sortedDates[0];

        const { error } = await supabase.from('venue_bookings').insert({
            venue_id:       venue.id,
            guest_name:     bookingForm.guest_name,
            guest_email:    bookingForm.guest_email || null,
            guest_phone:    bookingForm.guest_phone || null,
            service_name:   bookingForm.service_name || null,
            check_in_date:  checkIn,
            check_out_date: bookingForm.check_out_date || null,
            guests:         bookingForm.guests,
            amount:         bookingForm.amount ? parseFloat(bookingForm.amount) : null,
            notes:          bookingForm.notes || null,
            status:         bookingForm.status,
            source:         'admin',
        });

        if (!error) {
            await fetchData();
            setShowBookingModal(false);
            setBookingForm({ guest_name:'', guest_email:'', guest_phone:'', service_name:'', check_out_date:'', guests:1, amount:'', notes:'', status:'confirmed' });
            setSelectedDates(new Set());
        }
        setBookingSaving(false);
    }

    async function updateBookingStatus(id: string, status: Booking['status']) {
        await supabase.from('venue_bookings').update({ status }).eq('id', id);
        await fetchData();
    }

    async function deleteBooking(id: string) {
        await supabase.from('venue_bookings').delete().eq('id', id);
        await fetchData();
    }

    // -------------------------------------------------------------------------
    // Stats
    // -------------------------------------------------------------------------
    const totalBookings     = bookings.length;
    const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length;
    const pendingBookings   = bookings.filter(b => b.status === 'pending').length;
    const completedBookings = bookings.filter(b => b.status === 'completed').length;
    const totalRevenue      = bookings
        .filter(b => b.status === 'confirmed' || b.status === 'completed')
        .reduce((sum, b) => sum + (b.amount || 0), 0);

    const tabCounts: Record<string, number> = {
        All: totalBookings,
        Upcoming: confirmedBookings,
        Enquiries: pendingBookings,
        Completed: completedBookings,
        Cancelled: bookings.filter(b => b.status === 'cancelled').length,
    };

    const filteredBookings = bookings.filter(b => {
        if (activeSubTab === 'All') return true;
        if (activeSubTab === 'Upcoming') return b.status === 'confirmed';
        if (activeSubTab === 'Enquiries') return b.status === 'pending';
        if (activeSubTab === 'Completed') return b.status === 'completed';
        if (activeSubTab === 'Cancelled') return b.status === 'cancelled';
        return true;
    });

    // -------------------------------------------------------------------------
    // Render
    // -------------------------------------------------------------------------
    return (
        <div>
            {/* Booking Stats */}
            <div className="booking-stats">
                <div className="booking-stat">
                    <div className="booking-stat-value">{totalBookings}</div>
                    <div className="booking-stat-label">Total Bookings</div>
                </div>
                <div className="booking-stat">
                    <div className="booking-stat-value success">{confirmedBookings}</div>
                    <div className="booking-stat-label">Confirmed</div>
                </div>
                <div className="booking-stat">
                    <div className="booking-stat-value warning">{pendingBookings}</div>
                    <div className="booking-stat-label">Pending</div>
                </div>
                <div className="booking-stat">
                    <div className="booking-stat-value info">{completedBookings}</div>
                    <div className="booking-stat-label">Completed</div>
                </div>
                <div className="booking-stat">
                    <div className="booking-stat-value">${totalRevenue.toLocaleString()}</div>
                    <div className="booking-stat-label">Total Revenue</div>
                </div>
            </div>

            {/* Calendar */}
            <div className="calendar-section">
                <div className="calendar-header">
                    <div className="calendar-nav">
                        <button className="calendar-nav-btn" onClick={prevMonth}>
                            <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <polyline points="15,18 9,12 15,6" />
                            </svg>
                        </button>
                        <span className="calendar-month">{MONTHS[viewMonth]} {viewYear}</span>
                        <button className="calendar-nav-btn" onClick={nextMonth}>
                            <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <polyline points="9,18 15,12 9,6" />
                            </svg>
                        </button>
                    </div>
                    <div className="calendar-actions">
                        {selectedDates.size > 0 ? (
                            <>
                                <span style={{ fontSize: 12, color: 'var(--accent)', alignSelf: 'center' }}>
                                    {selectedDates.size} date{selectedDates.size > 1 ? 's' : ''} selected
                                </span>
                                <button className="btn btn-secondary btn-small" onClick={() => setShowBlockModal(true)}>
                                    <span style={{ marginRight: 6 }}>⊘</span> Block Dates
                                </button>
                                <button className="btn btn-primary btn-small" onClick={() => setShowBookingModal(true)}>
                                    <span style={{ marginRight: 6 }}>+</span> Add Booking
                                </button>
                            </>
                        ) : (
                            <span style={{ fontSize: 12, color: 'var(--accent)' }}>Click dates to select</span>
                        )}
                    </div>
                </div>

                <div className="calendar-grid">
                    <div className="calendar-weekdays">
                        {WEEKDAYS.map(d => <div key={d} className="calendar-weekday">{d}</div>)}
                    </div>
                    <div className="calendar-days">
                        {/* Prev month padding */}
                        {Array.from({ length: cellsBefore }).map((_, i) => (
                            <div key={`prev-${i}`} className="calendar-day other-month">
                                <span className="calendar-day-number">{daysInPrev - cellsBefore + i + 1}</span>
                            </div>
                        ))}

                        {/* Current month */}
                        {Array.from({ length: daysInMonth }).map((_, i) => {
                            const day = i + 1;
                            const key = toDateKey(viewYear, viewMonth, day);
                            const isToday = key === todayKey;
                            const indicator = getDayIndicator(key);
                            return (
                                <div
                                    key={key}
                                    className={getDayClass(key, isToday)}
                                    onClick={() => toggleDate(key)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <span className="calendar-day-number">{day}</span>
                                    {indicator && <span className={`calendar-day-indicator ${indicator}`}></span>}
                                </div>
                            );
                        })}

                        {/* Next month padding */}
                        {Array.from({ length: cellsAfter }).map((_, i) => (
                            <div key={`next-${i}`} className="calendar-day other-month">
                                <span className="calendar-day-number">{i + 1}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="calendar-legend">
                    <div className="legend-item"><span className="legend-dot confirmed"></span> Confirmed Booking</div>
                    <div className="legend-item"><span className="legend-dot pending"></span> Pending / Enquiry</div>
                    <div className="legend-item"><span className="legend-dot blocked"></span> Blocked Dates</div>
                </div>
            </div>

            {/* Blocked Dates List */}
            {blocks.length > 0 && (
                <section className="form-section">
                    <div className="form-section-header">
                        <div>
                            <h3 className="form-section-title">Blocked Dates</h3>
                            <p className="form-section-subtitle">Dates marked as unavailable</p>
                        </div>
                    </div>
                    <div className="form-section-body">
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            {blocks.map(b => (
                                <div key={b.id} style={{
                                    display: 'flex', alignItems: 'center', gap: '6px',
                                    background: 'var(--secondary-bg)', borderRadius: '6px',
                                    padding: '6px 10px', fontSize: '13px',
                                }}>
                                    <span style={{ fontWeight: 500 }}>{formatDateKey(b.block_date)}</span>
                                    {b.reason && <span style={{ color: 'var(--accent)' }}>— {b.reason}</span>}
                                    <button
                                        onClick={() => handleUnblockDate(b.id)}
                                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent)', display: 'flex', alignItems: 'center' }}
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Bookings List */}
            <section className="form-section">
                <div className="form-section-header">
                    <div>
                        <h3 className="form-section-title">All Bookings</h3>
                        <p className="form-section-subtitle">Manage enquiries, bookings, and past stays</p>
                    </div>
                    <button className="btn btn-secondary btn-small">
                        <Download className="icon icon-small" style={{ marginRight: 6 }} />
                        Export
                    </button>
                </div>
                <div className="form-section-body">
                    <div className="booking-tabs">
                        {['All', 'Upcoming', 'Enquiries', 'Completed', 'Cancelled'].map(tab => (
                            <button
                                key={tab}
                                className={`booking-tab ${activeSubTab === tab ? 'active' : ''}`}
                                onClick={() => setActiveSubTab(tab)}
                            >
                                {tab}<span className="booking-tab-count">({tabCounts[tab]})</span>
                            </button>
                        ))}
                    </div>

                    {loading && <p style={{ color: 'var(--accent)', fontSize: 13 }}>Loading bookings…</p>}
                    {!loading && filteredBookings.length === 0 && (
                        <p style={{ color: 'var(--accent)', fontSize: 13, padding: '20px 0' }}>No bookings found.</p>
                    )}

                    <div className="booking-list">
                        {filteredBookings.map(b => {
                            const d = new Date(b.check_in_date + 'T00:00:00');
                            const mon = d.toLocaleString('en', { month: 'short' });
                            const day = d.getDate();
                            const yr  = d.getFullYear();
                            const stripBg = b.status === 'pending' ? 'var(--warning)' : b.status === 'completed' ? 'var(--accent)' : '';
                            return (
                                <div key={b.id} className="booking-card" style={b.status === 'completed' ? { opacity: 0.7 } : {}}>
                                    <div className="booking-date-strip" style={stripBg ? { backgroundColor: stripBg } : {}}>
                                        <span className="booking-date-month">{mon}</span>
                                        <span className="booking-date-day">{day}</span>
                                        <span className="booking-date-year">{yr}</span>
                                    </div>
                                    <div className="booking-content">
                                        <div className="booking-info">
                                            <div className="booking-title">{b.service_name || 'Retreat Booking'}</div>
                                            <div className="booking-subtitle">{b.guest_name}</div>
                                            <div className="booking-details">
                                                {(b.check_out_date) && (
                                                    <span className="booking-detail">
                                                        <Calendar className="icon icon-small" />
                                                        {formatDateKey(b.check_in_date)} – {formatDateKey(b.check_out_date)}
                                                    </span>
                                                )}
                                                {b.guests > 1 && (
                                                    <span className="booking-detail">
                                                        <Users size={14} /> {b.guests} guests
                                                    </span>
                                                )}
                                                {b.status === 'pending' && (
                                                    <span className="booking-detail" style={{ color: 'var(--warning)' }}>
                                                        <Clock size={14} /> Awaiting confirmation
                                                    </span>
                                                )}
                                                {b.notes && <span className="booking-detail">{b.notes}</span>}
                                            </div>
                                        </div>
                                        <div className="booking-meta">
                                            <span className={`booking-status ${b.status === 'confirmed' ? 'confirmed' : b.status === 'pending' ? 'pending' : b.status === 'completed' ? 'completed' : ''}`}>
                                                {(b.status === 'confirmed' || b.status === 'completed') && <Check width="12" height="12" strokeWidth="2" />}
                                                {b.status === 'pending' && <Clock width="12" height="12" strokeWidth="2" />}
                                                {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
                                            </span>
                                            {b.amount != null && (
                                                <div className="booking-amount">${b.amount.toLocaleString()}</div>
                                            )}
                                            <div className="booking-actions">
                                                {b.status === 'pending' && (
                                                    <button className="btn btn-primary btn-small" onClick={() => updateBookingStatus(b.id, 'confirmed')}>Accept</button>
                                                )}
                                                {b.status === 'confirmed' && (
                                                    <button className="btn btn-primary btn-small" onClick={() => updateBookingStatus(b.id, 'completed')}>Complete</button>
                                                )}
                                                <button className="btn btn-secondary btn-small" onClick={() => deleteBooking(b.id)}>Remove</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Revenue Summary */}
            <section className="form-section">
                <div className="form-section-header">
                    <div>
                        <h3 className="form-section-title">Revenue Summary</h3>
                        <p className="form-section-subtitle">Booking revenue for {venue.name}</p>
                    </div>
                </div>
                <div className="form-section-body">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 32 }}>
                        <div>
                            <div className="revenue-row">
                                <span className="revenue-label">Total Booking Value</span>
                                <span className="revenue-value">${bookings.reduce((s,b) => s + (b.amount||0), 0).toLocaleString()}</span>
                            </div>
                            <div className="revenue-row">
                                <span className="revenue-label">Confirmed Revenue</span>
                                <span className="revenue-value">${bookings.filter(b=>b.status==='confirmed'||b.status==='completed').reduce((s,b)=>s+(b.amount||0),0).toLocaleString()}</span>
                            </div>
                            <div className="revenue-row">
                                <span className="revenue-label">Pending Revenue</span>
                                <span className="revenue-value" style={{ color: 'var(--warning)' }}>${bookings.filter(b=>b.status==='pending').reduce((s,b)=>s+(b.amount||0),0).toLocaleString()}</span>
                            </div>
                        </div>
                        <div>
                            <div className="revenue-row">
                                <span className="revenue-label">TGS Commission (5%)</span>
                                <span className="revenue-value">${(totalRevenue * 0.05).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                            </div>
                            <div className="revenue-row">
                                <span className="revenue-label">Stripe Fees (3%)</span>
                                <span className="revenue-value">${(totalRevenue * 0.03).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                            </div>
                            <div className="revenue-row">
                                <span className="revenue-label">Venue Net Revenue</span>
                                <span className="revenue-value total">${(totalRevenue * 0.92).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* iCal Sync */}
            <section className="form-section">
                <div className="form-section-header">
                    <div>
                        <h3 className="form-section-title">Calendar Sync</h3>
                        <p className="form-section-subtitle">Sync availability with external calendars</p>
                    </div>
                </div>
                <div className="form-section-body">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24 }}>
                        <div style={{ padding: 20, background: 'var(--secondary-bg)', borderRadius: 10 }}>
                            <div style={{ fontWeight: 600, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                                <Download width="20" height="20" strokeWidth="1.5" /> Export Calendar (iCal)
                            </div>
                            <p style={{ fontSize: 12, color: 'var(--accent)', marginBottom: 12 }}>Share this link with other platforms to export TGS bookings</p>
                            <div style={{ display: 'flex', gap: 8 }}>
                                <input type="text" className="form-input" value={`https://theglobalsanctum.com/ical/${venue.id}`} style={{ flex: 1, fontSize: 12 }} readOnly />
                                <button className="btn btn-secondary btn-small">Copy</button>
                            </div>
                        </div>
                        <div style={{ padding: 20, background: 'var(--secondary-bg)', borderRadius: 10 }}>
                            <div style={{ fontWeight: 600, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                                <RefreshCw width="20" height="20" strokeWidth="1.5" /> Import Calendar
                            </div>
                            <p style={{ fontSize: 12, color: 'var(--accent)', marginBottom: 12 }}>Import availability from Airbnb, VRBO, or other platforms</p>
                            <div style={{ display: 'flex', gap: 8 }}>
                                <input type="text" className="form-input" placeholder="Paste iCal URL here…" style={{ flex: 1, fontSize: 12 }} />
                                <button className="btn btn-primary btn-small">Import</button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --------------------------------------------------------------- */}
            {/* BLOCK DATES MODAL                                                 */}
            {/* --------------------------------------------------------------- */}
            {showBlockModal && (
                <div className="wvd-modal-overlay" onClick={() => setShowBlockModal(false)}>
                    <div className="wvd-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 480 }}>
                        <div className="wvd-modal-header">
                            <h3 className="wvd-modal-title">Block Dates</h3>
                            <button className="wvd-modal-close" onClick={() => setShowBlockModal(false)}><X size={20} /></button>
                        </div>
                        <div className="wvd-modal-body">
                            <p style={{ fontSize: 13, color: 'var(--accent)', marginBottom: 16 }}>
                                Marking {selectedDates.size} date{selectedDates.size > 1 ? 's' : ''} as unavailable:
                            </p>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
                                {Array.from(selectedDates).sort().map(d => (
                                    <span key={d} style={{ background: 'var(--secondary-bg)', borderRadius: 4, padding: '3px 8px', fontSize: 12 }}>
                                        {formatDateKey(d)}
                                    </span>
                                ))}
                            </div>
                            <div className="wvd-form-group">
                                <label className="wvd-form-label">Reason (optional)</label>
                                <input type="text" className="wvd-form-input" value={blockReason}
                                    placeholder="e.g. Maintenance, Private event…"
                                    onChange={e => setBlockReason(e.target.value)} />
                            </div>
                        </div>
                        <div className="wvd-modal-footer">
                            <button className="wvd-btn-secondary" onClick={() => setShowBlockModal(false)}>Cancel</button>
                            <button className="wvd-btn-primary" onClick={handleBlockDates} disabled={blockSaving}>
                                {blockSaving ? 'Saving…' : 'Block Dates'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* --------------------------------------------------------------- */}
            {/* ADD BOOKING MODAL                                                 */}
            {/* --------------------------------------------------------------- */}
            {showBookingModal && (
                <div className="wvd-modal-overlay" onClick={() => setShowBookingModal(false)}>
                    <div className="wvd-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 520 }}>
                        <div className="wvd-modal-header">
                            <h3 className="wvd-modal-title">Add Booking</h3>
                            <button className="wvd-modal-close" onClick={() => setShowBookingModal(false)}><X size={20} /></button>
                        </div>
                        <div className="wvd-modal-body">
                            <p style={{ fontSize: 13, color: 'var(--accent)', marginBottom: 16 }}>
                                Check-in: <strong>{Array.from(selectedDates).sort()[0] ? formatDateKey(Array.from(selectedDates).sort()[0]) : '—'}</strong>
                            </p>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                <div className="wvd-form-group" style={{ gridColumn: '1 / -1' }}>
                                    <label className="wvd-form-label">Guest / Group Name *</label>
                                    <input type="text" className="wvd-form-input" value={bookingForm.guest_name}
                                        onChange={e => setBookingForm(p => ({ ...p, guest_name: e.target.value }))} />
                                </div>
                                <div className="wvd-form-group">
                                    <label className="wvd-form-label">Email</label>
                                    <input type="email" className="wvd-form-input" value={bookingForm.guest_email}
                                        onChange={e => setBookingForm(p => ({ ...p, guest_email: e.target.value }))} />
                                </div>
                                <div className="wvd-form-group">
                                    <label className="wvd-form-label">Phone</label>
                                    <input type="text" className="wvd-form-input" value={bookingForm.guest_phone}
                                        onChange={e => setBookingForm(p => ({ ...p, guest_phone: e.target.value }))} />
                                </div>
                                <div className="wvd-form-group" style={{ gridColumn: '1 / -1' }}>
                                    <label className="wvd-form-label">Retreat / Event Name</label>
                                    <input type="text" className="wvd-form-input" value={bookingForm.service_name}
                                        placeholder="e.g. Women's Wellness Retreat"
                                        onChange={e => setBookingForm(p => ({ ...p, service_name: e.target.value }))} />
                                </div>
                                <div className="wvd-form-group">
                                    <label className="wvd-form-label">Check-out Date</label>
                                    <input type="date" className="wvd-form-input" value={bookingForm.check_out_date}
                                        onChange={e => setBookingForm(p => ({ ...p, check_out_date: e.target.value }))} />
                                </div>
                                <div className="wvd-form-group">
                                    <label className="wvd-form-label">Guests</label>
                                    <input type="number" className="wvd-form-input" min={1} value={bookingForm.guests}
                                        onChange={e => setBookingForm(p => ({ ...p, guests: parseInt(e.target.value) || 1 }))} />
                                </div>
                                <div className="wvd-form-group">
                                    <label className="wvd-form-label">Amount (AUD)</label>
                                    <input type="number" className="wvd-form-input" value={bookingForm.amount}
                                        placeholder="0.00"
                                        onChange={e => setBookingForm(p => ({ ...p, amount: e.target.value }))} />
                                </div>
                                <div className="wvd-form-group">
                                    <label className="wvd-form-label">Status</label>
                                    <select className="wvd-form-select" value={bookingForm.status}
                                        onChange={e => setBookingForm(p => ({ ...p, status: e.target.value as Booking['status'] }))}>
                                        <option value="confirmed">Confirmed</option>
                                        <option value="pending">Pending</option>
                                    </select>
                                </div>
                                <div className="wvd-form-group" style={{ gridColumn: '1 / -1' }}>
                                    <label className="wvd-form-label">Notes</label>
                                    <textarea className="wvd-form-textarea" rows={2} value={bookingForm.notes}
                                        onChange={e => setBookingForm(p => ({ ...p, notes: e.target.value }))} />
                                </div>
                            </div>
                        </div>
                        <div className="wvd-modal-footer">
                            <button className="wvd-btn-secondary" onClick={() => setShowBookingModal(false)}>Cancel</button>
                            <button className="wvd-btn-primary" onClick={handleAddBooking}
                                disabled={bookingSaving || !bookingForm.guest_name}>
                                {bookingSaving ? 'Saving…' : 'Add Booking'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
