import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, Users, Download, Upload, X, Check } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { Venue } from '../../context/VenueContext';

interface Props {
    venue: Venue;
    onUpdate: (updates: Partial<Venue>) => void;
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
    check_in_date: string; // YYYY-MM-DD
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

export default function WellnessBookingsTab({ venue }: Props) {
    const today = new Date();
    const [viewYear, setViewYear]   = useState(today.getFullYear());
    const [viewMonth, setViewMonth] = useState(today.getMonth());

    // Selection — multi-select dates
    const [selectedDates, setSelectedDates] = useState<Set<string>>(new Set());

    // Data from Supabase
    const [blocks, setBlocks]   = useState<DateBlock[]>([]);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);

    // Filter tab for booking list
    const [activeBookingTab, setActiveBookingTab] = useState('All');

    // Modals
    const [showBlockModal, setShowBlockModal] = useState(false);
    const [blockReason, setBlockReason]         = useState('');
    const [blockSaving, setBlockSaving]         = useState(false);

    const [showBookingModal, setShowBookingModal] = useState(false);
    const [bookingForm, setBookingForm] = useState({
        guest_name: '',
        guest_email: '',
        guest_phone: '',
        service_name: '',
        time_slot: '',
        guests: 1,
        amount: '',
        notes: '',
        status: 'confirmed' as Booking['status'],
    });
    const [bookingSaving, setBookingSaving] = useState(false);

    // -------------------------------------------------------------------------
    // Fetch data
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
    const bookedSet  = new Set(
        bookings
            .filter(b => b.status === 'confirmed' || b.status === 'pending')
            .map(b => b.check_in_date)
    );
    const pendingSet = new Set(
        bookings.filter(b => b.status === 'pending').map(b => b.check_in_date)
    );

    const daysInMonth   = new Date(viewYear, viewMonth + 1, 0).getDate();
    const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay(); // 0=Sun
    const daysInPrev    = new Date(viewYear, viewMonth, 0).getDate();

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
        const classes: string[] = ['wb-calendar-day'];
        if (isToday) classes.push('today');
        if (selectedDates.has(key)) classes.push('selected');
        if (blockedSet.has(key)) classes.push('blocked');
        else if (pendingSet.has(key)) classes.push('enquiry');
        else if (bookedSet.has(key)) classes.push('booked');
        return classes.join(' ');
    }

    function getDayIndicator(key: string): string {
        if (blockedSet.has(key)) return 'blocked';
        if (pendingSet.has(key)) return 'pending';
        if (bookedSet.has(key)) return 'confirmed';
        return '';
    }

    // -------------------------------------------------------------------------
    // Block Dates action
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
    // Add Booking action
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
            time_slot:      bookingForm.time_slot || null,
            guests:         bookingForm.guests,
            amount:         bookingForm.amount ? parseFloat(bookingForm.amount) : null,
            notes:          bookingForm.notes || null,
            status:         bookingForm.status,
            source:         'admin',
        });

        if (!error) {
            await fetchData();
            setShowBookingModal(false);
            setBookingForm({ guest_name:'', guest_email:'', guest_phone:'', service_name:'', time_slot:'', guests:1, amount:'', notes:'', status:'confirmed' });
            setSelectedDates(new Set());
        }
        setBookingSaving(false);
    }

    // -------------------------------------------------------------------------
    // Update booking status
    // -------------------------------------------------------------------------
    async function updateBookingStatus(id: string, status: Booking['status']) {
        await supabase.from('venue_bookings').update({ status }).eq('id', id);
        await fetchData();
    }

    async function deleteBooking(id: string) {
        await supabase.from('venue_bookings').delete().eq('id', id);
        await fetchData();
    }

    // -------------------------------------------------------------------------
    // Derived stats
    // -------------------------------------------------------------------------
    const totalBookings     = bookings.length;
    const completedBookings = bookings.filter(b => b.status === 'completed').length;
    const upcomingBookings  = bookings.filter(b => b.status === 'confirmed').length;
    const pendingBookings   = bookings.filter(b => b.status === 'pending').length;
    const totalRevenue      = bookings
        .filter(b => b.status === 'confirmed' || b.status === 'completed')
        .reduce((sum, b) => sum + (b.amount || 0), 0);

    const filteredBookings = bookings.filter(b => {
        if (activeBookingTab === 'All') return true;
        if (activeBookingTab === 'Upcoming') return b.status === 'confirmed';
        if (activeBookingTab === 'Pending')  return b.status === 'pending';
        if (activeBookingTab === 'Completed') return b.status === 'completed';
        if (activeBookingTab === 'Cancelled') return b.status === 'cancelled';
        return true;
    });

    const tabCounts: Record<string, number> = {
        All: totalBookings,
        Upcoming: upcomingBookings,
        Pending: pendingBookings,
        Completed: completedBookings,
        Cancelled: bookings.filter(b => b.status === 'cancelled').length,
    };

    // -------------------------------------------------------------------------
    // Calendar grid cells
    // -------------------------------------------------------------------------
    const totalCells = 42;
    const cellsBefore = firstDayOfWeek;
    const cellsAfter  = totalCells - cellsBefore - daysInMonth;

    const todayKey = toDateKey(today.getFullYear(), today.getMonth(), today.getDate());

    // -------------------------------------------------------------------------
    // Render
    // -------------------------------------------------------------------------
    return (
        <div className="wvd-content">

            {/* Booking Stats */}
            <div className="wb-stats">
                <div className="wb-stat">
                    <div className="wb-stat-value">{totalBookings}</div>
                    <div className="wb-stat-label">Total Appointments</div>
                </div>
                <div className="wb-stat">
                    <div className="wb-stat-value success">{completedBookings}</div>
                    <div className="wb-stat-label">Completed</div>
                </div>
                <div className="wb-stat">
                    <div className="wb-stat-value warning">{upcomingBookings}</div>
                    <div className="wb-stat-label">Upcoming</div>
                </div>
                <div className="wb-stat">
                    <div className="wb-stat-value info">{pendingBookings}</div>
                    <div className="wb-stat-label">Pending</div>
                </div>
                <div className="wb-stat">
                    <div className="wb-stat-value">${totalRevenue.toLocaleString()}</div>
                    <div className="wb-stat-label">Total Revenue</div>
                </div>
            </div>

            {/* Calendar */}
            <div className="wb-calendar-section">
                <div className="wb-calendar-header">
                    <div className="wb-calendar-nav">
                        <button className="wb-calendar-nav-btn" onClick={prevMonth}><ChevronLeft size={20} /></button>
                        <span className="wb-calendar-month">{MONTHS[viewMonth]} {viewYear}</span>
                        <button className="wb-calendar-nav-btn" onClick={nextMonth}><ChevronRight size={20} /></button>
                    </div>
                    <div className="wb-calendar-actions">
                        {selectedDates.size > 0 && (
                            <>
                                <span style={{ fontSize: 12, color: 'var(--accent)', alignSelf: 'center' }}>
                                    {selectedDates.size} date{selectedDates.size > 1 ? 's' : ''} selected
                                </span>
                                <button
                                    className="wvd-btn-secondary wvd-btn-small"
                                    onClick={() => setShowBlockModal(true)}
                                >
                                    <CalendarIcon size={14} /> Block Dates
                                </button>
                                <button
                                    className="wvd-btn-primary wvd-btn-small"
                                    onClick={() => setShowBookingModal(true)}
                                >
                                    <Clock size={14} /> Add Booking
                                </button>
                            </>
                        )}
                        {selectedDates.size === 0 && (
                            <span style={{ fontSize: 12, color: 'var(--accent)' }}>Click dates to select</span>
                        )}
                    </div>
                </div>

                <div className="wb-calendar-grid">
                    <div className="wb-calendar-weekdays">
                        {WEEKDAYS.map(d => <div key={d} className="wb-calendar-weekday">{d}</div>)}
                    </div>
                    <div className="wb-calendar-days">
                        {/* Prev month padding */}
                        {Array.from({ length: cellsBefore }).map((_, i) => (
                            <div key={`prev-${i}`} className="wb-calendar-day other-month">
                                <span className="wb-calendar-day-number">{daysInPrev - cellsBefore + i + 1}</span>
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
                                    <span className="wb-calendar-day-number">{day}</span>
                                    {indicator && <span className={`wb-calendar-day-indicator ${indicator}`}></span>}
                                </div>
                            );
                        })}

                        {/* Next month padding */}
                        {Array.from({ length: cellsAfter }).map((_, i) => (
                            <div key={`next-${i}`} className="wb-calendar-day other-month">
                                <span className="wb-calendar-day-number">{i + 1}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="wb-calendar-legend">
                    <div className="wb-legend-item"><span className="wb-legend-dot confirmed"></span> Confirmed Booking</div>
                    <div className="wb-legend-item"><span className="wb-legend-dot pending"></span> Pending / Enquiry</div>
                    <div className="wb-legend-item"><span className="wb-legend-dot blocked"></span> Blocked Dates</div>
                </div>
            </div>

            {/* Blocked Dates List */}
            {blocks.length > 0 && (
                <section className="wvd-form-section">
                    <div className="wvd-form-section-header">
                        <div>
                            <h3 className="wvd-form-section-title">Blocked Dates</h3>
                            <p className="wvd-form-hint">Dates marked as unavailable for bookings</p>
                        </div>
                    </div>
                    <div className="wvd-form-section-body">
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
            <section className="wvd-form-section">
                <div className="wvd-form-section-header">
                    <div>
                        <h3 className="wvd-form-section-title">All Appointments</h3>
                        <p className="wvd-form-hint">Manage service bookings and appointments</p>
                    </div>
                    <button className="wvd-btn-secondary wvd-btn-small">
                        <Download size={14} /> Export
                    </button>
                </div>
                <div className="wvd-form-section-body">
                    <div className="wb-booking-tabs">
                        {['All', 'Upcoming', 'Pending', 'Completed', 'Cancelled'].map(tab => (
                            <button
                                key={tab}
                                className={`wb-booking-tab ${activeBookingTab === tab ? 'active' : ''}`}
                                onClick={() => setActiveBookingTab(tab)}
                            >
                                {tab}<span className="wb-booking-tab-count">({tabCounts[tab]})</span>
                            </button>
                        ))}
                    </div>

                    {loading && <p style={{ color: 'var(--accent)', fontSize: 13 }}>Loading bookings…</p>}

                    {!loading && filteredBookings.length === 0 && (
                        <p style={{ color: 'var(--accent)', fontSize: 13, padding: '20px 0' }}>No bookings found.</p>
                    )}

                    <div className="wb-booking-list">
                        {filteredBookings.map(b => {
                            const d = new Date(b.check_in_date + 'T00:00:00');
                            const mon = d.toLocaleString('en', { month: 'short' });
                            const day = d.getDate();
                            const yr  = d.getFullYear();
                            const stripClass = b.status === 'pending' ? 'warning' : b.status === 'completed' ? 'muted' : '';
                            return (
                                <div key={b.id} className={`wb-booking-card ${b.status === 'completed' ? 'opacity-70' : ''}`}>
                                    <div className={`wb-booking-date-strip ${stripClass}`}>
                                        <span className="wb-date-month">{mon}</span>
                                        <span className="wb-date-day">{day}</span>
                                        <span className="wb-date-year">{yr}</span>
                                    </div>
                                    <div className="wb-booking-content">
                                        <div className="wb-booking-info">
                                            <div className="wb-booking-title">{b.service_name || 'Appointment'}</div>
                                            <div className="wb-booking-subtitle">
                                                {b.guest_name}{b.time_slot ? ` • ${b.time_slot}` : ''}
                                            </div>
                                            <div className="wb-booking-details">
                                                {b.guests > 1 && <span className="wb-booking-detail"><Users size={14} /> {b.guests} guests</span>}
                                                {b.guest_email && <span className="wb-booking-detail"><Clock size={14} /> {b.guest_email}</span>}
                                                {b.notes && <span className="wb-booking-detail">{b.notes}</span>}
                                            </div>
                                        </div>
                                        <div className="wb-booking-meta">
                                            <span className={`wb-booking-status ${b.status}`}>
                                                {b.status === 'confirmed' && <Check size={12} strokeWidth={2} />}
                                                {b.status === 'pending'   && <Clock size={12} strokeWidth={2} />}
                                                {b.status === 'completed' && <Check size={12} strokeWidth={2} />}
                                                {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
                                            </span>
                                            {b.amount != null && (
                                                <div className="wb-booking-amount">${b.amount.toLocaleString()}</div>
                                            )}
                                            <div className="wb-booking-actions">
                                                {b.status === 'pending' && (
                                                    <button className="wvd-btn-primary wvd-btn-small" onClick={() => updateBookingStatus(b.id, 'confirmed')}>Confirm</button>
                                                )}
                                                {b.status === 'confirmed' && (
                                                    <button className="wvd-btn-primary wvd-btn-small" onClick={() => updateBookingStatus(b.id, 'completed')}>Complete</button>
                                                )}
                                                <button className="wvd-btn-secondary wvd-btn-small" onClick={() => deleteBooking(b.id)}>Remove</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Calendar Sync */}
            <section className="wvd-form-section">
                <div className="wvd-form-section-header">
                    <div>
                        <h3 className="wvd-form-section-title">Calendar Sync</h3>
                        <p className="wvd-form-hint">Sync availability with external calendars</p>
                    </div>
                </div>
                <div className="wvd-form-section-body">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
                        <div style={{ padding: '20px', background: 'var(--secondary-bg)', borderRadius: '10px' }}>
                            <div style={{ fontWeight: 600, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Download size={20} /> Export Calendar (iCal)
                            </div>
                            <p style={{ fontSize: '12px', color: 'var(--accent)', marginBottom: '12px' }}>Share this link with other platforms to export TGS bookings</p>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <input type="text" className="wvd-form-input" value={`https://theglobalsanctum.com/ical/${venue.id}`} style={{ flex: 1, fontSize: '12px' }} readOnly />
                                <button className="wvd-btn-secondary wvd-btn-small">Copy</button>
                            </div>
                        </div>
                        <div style={{ padding: '20px', background: 'var(--secondary-bg)', borderRadius: '10px' }}>
                            <div style={{ fontWeight: 600, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Upload size={20} /> Import Calendar
                            </div>
                            <p style={{ fontSize: '12px', color: 'var(--accent)', marginBottom: '12px' }}>Import availability from Mindbody, Fresha, or other platforms</p>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <input type="text" className="wvd-form-input" placeholder="Paste iCal URL here…" style={{ flex: 1, fontSize: '12px' }} />
                                <button className="wvd-btn-primary wvd-btn-small">Import</button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ------------------------------------------------------------------ */}
            {/* BLOCK DATES MODAL                                                   */}
            {/* ------------------------------------------------------------------ */}
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
                                <input
                                    type="text"
                                    className="wvd-form-input"
                                    placeholder="e.g. Maintenance, Staff holiday, Private event…"
                                    value={blockReason}
                                    onChange={e => setBlockReason(e.target.value)}
                                />
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

            {/* ------------------------------------------------------------------ */}
            {/* ADD BOOKING MODAL                                                   */}
            {/* ------------------------------------------------------------------ */}
            {showBookingModal && (
                <div className="wvd-modal-overlay" onClick={() => setShowBookingModal(false)}>
                    <div className="wvd-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 520 }}>
                        <div className="wvd-modal-header">
                            <h3 className="wvd-modal-title">Add Booking</h3>
                            <button className="wvd-modal-close" onClick={() => setShowBookingModal(false)}><X size={20} /></button>
                        </div>
                        <div className="wvd-modal-body">
                            <p style={{ fontSize: 13, color: 'var(--accent)', marginBottom: 16 }}>
                                Booking date: <strong>{Array.from(selectedDates).sort()[0] ? formatDateKey(Array.from(selectedDates).sort()[0]) : '—'}</strong>
                            </p>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                <div className="wvd-form-group" style={{ gridColumn: '1 / -1' }}>
                                    <label className="wvd-form-label">Guest Name *</label>
                                    <input type="text" className="wvd-form-input" value={bookingForm.guest_name}
                                        onChange={e => setBookingForm(p => ({ ...p, guest_name: e.target.value }))} />
                                </div>
                                <div className="wvd-form-group">
                                    <label className="wvd-form-label">Guest Email</label>
                                    <input type="email" className="wvd-form-input" value={bookingForm.guest_email}
                                        onChange={e => setBookingForm(p => ({ ...p, guest_email: e.target.value }))} />
                                </div>
                                <div className="wvd-form-group">
                                    <label className="wvd-form-label">Guest Phone</label>
                                    <input type="text" className="wvd-form-input" value={bookingForm.guest_phone}
                                        onChange={e => setBookingForm(p => ({ ...p, guest_phone: e.target.value }))} />
                                </div>
                                <div className="wvd-form-group">
                                    <label className="wvd-form-label">Service / Treatment</label>
                                    <input type="text" className="wvd-form-input" value={bookingForm.service_name}
                                        placeholder="e.g. Deep Tissue Massage"
                                        onChange={e => setBookingForm(p => ({ ...p, service_name: e.target.value }))} />
                                </div>
                                <div className="wvd-form-group">
                                    <label className="wvd-form-label">Time Slot</label>
                                    <input type="text" className="wvd-form-input" value={bookingForm.time_slot}
                                        placeholder="e.g. 10:00 AM"
                                        onChange={e => setBookingForm(p => ({ ...p, time_slot: e.target.value }))} />
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
