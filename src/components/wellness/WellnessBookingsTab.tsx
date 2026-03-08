import { useState, useEffect, useCallback } from 'react';
import type { CSSProperties } from 'react';
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

interface PkgOption {
    name: string;
    type: string;
    price: string;
    per: string;
}

const TIME_SLOTS = [
    '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM',
];

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function toDateKey(year: number, month: number, day: number): string {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function formatDateKey(dateStr: string): string {
    const d = new Date(dateStr + 'T00:00:00');
    return `${d.toLocaleString('en', { month: 'short' })} ${d.getDate()}, ${d.getFullYear()}`;
}

export default function WellnessBookingsTab({ venue }: Props) {
    const today = new Date();
    const [viewYear, setViewYear] = useState(today.getFullYear());
    const [viewMonth, setViewMonth] = useState(today.getMonth());

    // Multi-select dates
    const [selectedDates, setSelectedDates] = useState<Set<string>>(new Set());

    // Data from Supabase
    const [blocks, setBlocks] = useState<DateBlock[]>([]);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);

    // Filter tab
    const [activeBookingTab, setActiveBookingTab] = useState('All');

    // Block modal
    const [showBlockModal, setShowBlockModal] = useState(false);
    const [blockReason, setBlockReason] = useState('');
    const [blockSaving, setBlockSaving] = useState(false);

    // Booking modal
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);
    const [bookingDate, setBookingDate] = useState('');
    const [availablePackages, setAvailablePackages] = useState<PkgOption[]>([]);
    const [selectedPkgIdx, setSelectedPkgIdx] = useState<number | null>(null);
    const [customServiceName, setCustomServiceName] = useState('');
    const [selectedTimeSlots, setSelectedTimeSlots] = useState<Set<string>>(new Set());
    const [dateBookings, setDateBookings] = useState<Booking[]>([]);
    const [bookingForm, setBookingForm] = useState({
        guest_name: '',
        guest_email: '',
        guest_phone: '',
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
    const bookedSet = new Set(
        bookings.filter(b => b.status === 'confirmed' || b.status === 'pending').map(b => b.check_in_date)
    );
    const pendingSet = new Set(bookings.filter(b => b.status === 'pending').map(b => b.check_in_date));

    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay();
    const daysInPrev = new Date(viewYear, viewMonth, 0).getDate();

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
    // Block Dates
    // -------------------------------------------------------------------------
    async function handleBlockDates() {
        if (selectedDates.size === 0) return;
        setBlockSaving(true);
        const rows = Array.from(selectedDates).map(d => ({ venue_id: venue.id, block_date: d, reason: blockReason || null }));
        const { error } = await supabase.from('venue_date_blocks').upsert(rows, { onConflict: 'venue_id,block_date' });
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
    // Open Booking Modal — fetch packages + existing bookings for that date
    // -------------------------------------------------------------------------
    async function openBookingModal() {
        const date = Array.from(selectedDates).sort()[0];
        setBookingDate(date);
        setSelectedPkgIdx(null);
        setCustomServiceName('');
        setSelectedTimeSlots(new Set());
        setDateBookings([]);
        setBookingForm({ guest_name: '', guest_email: '', guest_phone: '', guests: 1, amount: '', notes: '', status: 'confirmed' });
        setModalLoading(true);
        setShowBookingModal(true);

        const [pricingRes, dateBookingsRes] = await Promise.all([
            supabase
                .from('venue_pricing')
                .select('packages')
                .eq('venue_id', venue.id)
                .eq('venue_type', 'wellness')
                .maybeSingle(),
            supabase
                .from('venue_bookings')
                .select('*')
                .eq('venue_id', venue.id)
                .eq('check_in_date', date)
                .in('status', ['confirmed', 'pending']),
        ]);

        // Parse packages from JSON
        let pkgs: PkgOption[] = [];
        if (pricingRes.data?.packages) {
            try {
                const raw = typeof pricingRes.data.packages === 'string'
                    ? JSON.parse(pricingRes.data.packages)
                    : pricingRes.data.packages;
                pkgs = (raw as Array<{ name: string; type: string; price: string; per: string; active?: boolean }>)
                    .filter(p => p.active !== false)
                    .map(p => ({ name: p.name, type: p.type, price: p.price, per: p.per }));
            } catch {
                pkgs = [];
            }
        }

        setAvailablePackages(pkgs);
        setDateBookings(dateBookingsRes.data || []);
        setModalLoading(false);
    }

    // -------------------------------------------------------------------------
    // Time slot helpers
    // -------------------------------------------------------------------------
    function getSlotInfo(slot: string): { status: 'available' | 'partial' | 'blocked'; count: number } {
        const atSlot = dateBookings.filter(b => b.time_slot === slot);
        const hasGlobalBlock = atSlot.some(b => b.service_name === null);
        if (hasGlobalBlock) return { status: 'blocked', count: atSlot.length };
        if (atSlot.length > 0) return { status: 'partial', count: atSlot.length };
        return { status: 'available', count: 0 };
    }

    function getSlotStyle(slot: string): CSSProperties {
        const info = getSlotInfo(slot);
        const isSel = selectedTimeSlots.has(slot);

        if (info.status === 'blocked') {
            return {
                background: 'rgba(220,53,53,0.10)',
                border: '2px solid rgba(220,53,53,0.30)',
                color: '#dc3535',
                cursor: 'not-allowed',
                opacity: 0.65,
                borderRadius: 8,
                padding: '10px 6px',
                textAlign: 'center',
                fontSize: 13,
                fontWeight: 500,
                position: 'relative',
                userSelect: 'none',
            };
        }
        if (info.status === 'partial') {
            return {
                background: isSel ? 'rgba(245,158,11,0.25)' : 'rgba(245,158,11,0.08)',
                border: `2px solid ${isSel ? '#f59e0b' : 'rgba(245,158,11,0.40)'}`,
                color: '#f59e0b',
                cursor: 'pointer',
                borderRadius: 8,
                padding: '10px 6px',
                textAlign: 'center',
                fontSize: 13,
                fontWeight: 500,
                position: 'relative',
                transition: 'all 0.15s',
                userSelect: 'none',
            };
        }
        // available
        return {
            background: isSel ? 'var(--primary-btn, #2f855a)' : 'var(--secondary-bg)',
            border: `2px solid ${isSel ? 'var(--primary-btn, #2f855a)' : 'var(--border, #333)'}`,
            color: isSel ? '#fff' : 'var(--text-primary, #e0e0e0)',
            cursor: 'pointer',
            borderRadius: 8,
            padding: '10px 6px',
            textAlign: 'center',
            fontSize: 13,
            fontWeight: 500,
            position: 'relative',
            transition: 'all 0.15s',
            userSelect: 'none',
        };
    }

    function handleSelectTimeSlot(slot: string) {
        const info = getSlotInfo(slot);
        if (info.status === 'blocked') return;
        setSelectedTimeSlots(prev => {
            const next = new Set(prev);
            if (next.has(slot)) next.delete(slot);
            else next.add(slot);
            return next;
        });
    }

    // -------------------------------------------------------------------------
    // Package tile selection
    // -------------------------------------------------------------------------
    function handleSelectPackage(idx: number) {
        if (selectedPkgIdx === idx) {
            setSelectedPkgIdx(null);
            setBookingForm(p => ({ ...p, amount: '' }));
        } else {
            setSelectedPkgIdx(idx);
            setCustomServiceName('');
            const pkg = availablePackages[idx];
            const numericPrice = parseFloat(pkg.price.replace(/[^0-9.]/g, ''));
            if (!isNaN(numericPrice)) {
                setBookingForm(p => ({ ...p, amount: String(numericPrice) }));
            }
        }
    }

    // -------------------------------------------------------------------------
    // Add Booking
    // -------------------------------------------------------------------------
    async function handleAddBooking() {
        if (!bookingDate || !bookingForm.guest_name || selectedTimeSlots.size === 0) return;
        setBookingSaving(true);

        const selectedPkg = selectedPkgIdx !== null ? availablePackages[selectedPkgIdx] : null;
        const serviceName = selectedPkg?.name || customServiceName.trim() || null;
        const amountVal = bookingForm.amount ? parseFloat(bookingForm.amount) : null;

        const rows = Array.from(selectedTimeSlots).sort().map(slot => ({
            venue_id: venue.id,
            guest_name: bookingForm.guest_name,
            guest_email: bookingForm.guest_email || null,
            guest_phone: bookingForm.guest_phone || null,
            service_name: serviceName,
            check_in_date: bookingDate,
            time_slot: slot,
            guests: bookingForm.guests,
            amount: amountVal,
            notes: bookingForm.notes || null,
            status: bookingForm.status,
            source: 'admin',
        }));

        const { error } = await supabase.from('venue_bookings').insert(rows);

        if (!error) {
            await fetchData();
            setShowBookingModal(false);
            setSelectedDates(new Set());
        }
        setBookingSaving(false);
    }

    // -------------------------------------------------------------------------
    // Update / Delete booking
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
    // Stats
    // -------------------------------------------------------------------------
    const totalBookings = bookings.length;
    const completedBookings = bookings.filter(b => b.status === 'completed').length;
    const upcomingBookings = bookings.filter(b => b.status === 'confirmed').length;
    const pendingBookings = bookings.filter(b => b.status === 'pending').length;
    const totalRevenue = bookings
        .filter(b => b.status === 'confirmed' || b.status === 'completed')
        .reduce((sum, b) => sum + (b.amount || 0), 0);

    const filteredBookings = bookings.filter(b => {
        if (activeBookingTab === 'All') return true;
        if (activeBookingTab === 'Upcoming') return b.status === 'confirmed';
        if (activeBookingTab === 'Pending') return b.status === 'pending';
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

    // Calendar grid
    const totalCells = 42;
    const cellsBefore = firstDayOfWeek;
    const cellsAfter = totalCells - cellsBefore - daysInMonth;
    const todayKey = toDateKey(today.getFullYear(), today.getMonth(), today.getDate());

    // -------------------------------------------------------------------------
    // Render
    // -------------------------------------------------------------------------
    return (
        <div className="content-area">

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
                                    className="btn btn-secondary btn-small"
                                    onClick={() => setShowBlockModal(true)}
                                >
                                    <CalendarIcon size={14} /> Block Dates
                                </button>
                                <button
                                    className="btn btn-primary btn-small"
                                    onClick={openBookingModal}
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
                        {Array.from({ length: cellsBefore }).map((_, i) => (
                            <div key={`prev-${i}`} className="wb-calendar-day other-month">
                                <span className="wb-calendar-day-number">{daysInPrev - cellsBefore + i + 1}</span>
                            </div>
                        ))}
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
                <section className="form-section">
                    <div className="form-section-header">
                        <div>
                            <h3 className="form-section-title">Blocked Dates</h3>
                            <p className="form-section-subtitle">Dates marked as unavailable for bookings</p>
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
                        <h3 className="form-section-title">All Appointments</h3>
                        <p className="form-section-subtitle">Manage service bookings and appointments</p>
                    </div>
                    <button className="btn btn-secondary btn-small">
                        <Download size={14} /> Export
                    </button>
                </div>
                <div className="form-section-body">
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
                            const yr = d.getFullYear();
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
                                            <div className="wb-booking-title">{b.service_name || 'General Appointment'}</div>
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
                                                {(b.status === 'confirmed' || b.status === 'completed') && <Check size={12} strokeWidth={2} />}
                                                {b.status === 'pending' && <Clock size={12} strokeWidth={2} />}
                                                {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
                                            </span>
                                            {b.amount != null && (
                                                <div className="wb-booking-amount">${b.amount.toLocaleString()}</div>
                                            )}
                                            <div className="wb-booking-actions">
                                                {b.status === 'pending' && (
                                                    <button className="btn btn-primary btn-small" onClick={() => updateBookingStatus(b.id, 'confirmed')}>Confirm</button>
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

            {/* Calendar Sync */}
            <section className="form-section">
                <div className="form-section-header">
                    <div>
                        <h3 className="form-section-title">Calendar Sync</h3>
                        <p className="form-section-subtitle">Sync availability with external calendars</p>
                    </div>
                </div>
                <div className="form-section-body">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
                        <div style={{ padding: '20px', background: 'var(--secondary-bg)', borderRadius: '10px' }}>
                            <div style={{ fontWeight: 600, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Download size={20} /> Export Calendar (iCal)
                            </div>
                            <p style={{ fontSize: '12px', color: 'var(--accent)', marginBottom: '12px' }}>Share this link with other platforms to export TGS bookings</p>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <input type="text" className="form-input" value={`https://theglobalsanctum.com/ical/${venue.id}`} style={{ flex: 1, fontSize: '12px' }} readOnly />
                                <button className="btn btn-secondary btn-small">Copy</button>
                            </div>
                        </div>
                        <div style={{ padding: '20px', background: 'var(--secondary-bg)', borderRadius: '10px' }}>
                            <div style={{ fontWeight: 600, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Upload size={20} /> Import Calendar
                            </div>
                            <p style={{ fontSize: '12px', color: 'var(--accent)', marginBottom: '12px' }}>Import availability from Mindbody, Fresha, or other platforms</p>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <input type="text" className="form-input" placeholder="Paste iCal URL here…" style={{ flex: 1, fontSize: '12px' }} />
                                <button className="btn btn-primary btn-small">Import</button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ------------------------------------------------------------------ */}
            {/* BLOCK DATES MODAL                                                   */}
            {/* ------------------------------------------------------------------ */}
            {showBlockModal && (
                <div className="modal-overlay" onClick={() => setShowBlockModal(false)}>
                    <div className="modal-container modal-small" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3 className="modal-title">Block Dates</h3>
                            <button className="modal-close" onClick={() => setShowBlockModal(false)}><X size={20} /></button>
                        </div>
                        <div className="modal-body">
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
                            <div className="form-group">
                                <label className="form-label">Reason (optional)</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="e.g. Maintenance, Staff holiday, Private event…"
                                    value={blockReason}
                                    onChange={e => setBlockReason(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={() => setShowBlockModal(false)}>Cancel</button>
                            <button className="btn btn-primary" onClick={handleBlockDates} disabled={blockSaving}>
                                {blockSaving ? 'Saving…' : 'Block Dates'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ------------------------------------------------------------------ */}
            {/* ADD BOOKING MODAL — redesigned                                      */}
            {/* ------------------------------------------------------------------ */}
            {showBookingModal && (
                <div className="modal-overlay" onClick={() => setShowBookingModal(false)}>
                    <div
                        className="modal-container"
                        onClick={e => e.stopPropagation()}
                        style={{ maxWidth: 660, maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}
                    >
                        {/* Modal Header */}
                        <div className="modal-header" style={{ flexShrink: 0 }}>
                            <div>
                                <h3 className="modal-title">Add Booking</h3>
                                <p style={{ fontSize: 12, color: 'var(--accent)', marginTop: 2 }}>
                                    {bookingDate ? formatDateKey(bookingDate) : '—'}
                                </p>
                            </div>
                            <button className="modal-close" onClick={() => setShowBookingModal(false)}><X size={20} /></button>
                        </div>

                        {/* Modal Body — scrollable */}
                        <div className="modal-body" style={{ overflowY: 'auto', flex: 1 }}>

                            {modalLoading ? (
                                <p style={{ fontSize: 13, color: 'var(--accent)', padding: '20px 0', textAlign: 'center' }}>
                                    Loading services and availability…
                                </p>
                            ) : (
                                <>
                                    {/* ---- Section 1: Service / Package ---- */}
                                    <div style={{ marginBottom: 24 }}>
                                        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 8 }}>
                                            <h4 style={{ fontSize: 13, fontWeight: 600, margin: 0 }}>Service / Package</h4>
                                            <span style={{ fontSize: 11, color: 'var(--accent)' }}>Optional</span>
                                        </div>

                                        {/* No service warning */}
                                        {selectedPkgIdx === null && !customServiceName.trim() && (
                                            <div style={{
                                                fontSize: 11, color: '#f59e0b',
                                                background: 'rgba(245,158,11,0.08)',
                                                border: '1px solid rgba(245,158,11,0.25)',
                                                borderRadius: 6, padding: '6px 10px', marginBottom: 12,
                                            }}>
                                                No service selected — this time slot will be blocked for <strong>all</strong> services on this date.
                                            </div>
                                        )}

                                        {/* Package tiles */}
                                        {availablePackages.length > 0 ? (
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8, marginBottom: 10 }}>
                                                {availablePackages.map((pkg, idx) => {
                                                    const isSel = selectedPkgIdx === idx;
                                                    return (
                                                        <button
                                                            key={idx}
                                                            type="button"
                                                            onClick={() => handleSelectPackage(idx)}
                                                            style={{
                                                                background: isSel ? 'rgba(var(--primary-rgb, 47,133,90), 0.15)' : 'var(--secondary-bg)',
                                                                border: `2px solid ${isSel ? 'var(--primary-btn, #2f855a)' : 'var(--border, #333)'}`,
                                                                borderRadius: 8,
                                                                padding: '10px 12px',
                                                                textAlign: 'left',
                                                                cursor: 'pointer',
                                                                transition: 'all 0.15s',
                                                            }}
                                                        >
                                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 6 }}>
                                                                <div>
                                                                    <div style={{ fontSize: 13, fontWeight: 600, color: isSel ? 'var(--primary-btn, #2f855a)' : 'var(--text-primary, #e0e0e0)', marginBottom: 2 }}>
                                                                        {pkg.name}
                                                                    </div>
                                                                    <div style={{ fontSize: 11, color: 'var(--accent)' }}>{pkg.type}</div>
                                                                </div>
                                                                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                                                    <div style={{ fontSize: 13, fontWeight: 700, color: isSel ? 'var(--primary-btn, #2f855a)' : 'var(--text-primary, #e0e0e0)' }}>
                                                                        {pkg.price}
                                                                    </div>
                                                                    <div style={{ fontSize: 10, color: 'var(--accent)' }}>{pkg.per}</div>
                                                                </div>
                                                            </div>
                                                            {isSel && (
                                                                <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--primary-btn, #2f855a)' }}>
                                                                    <Check size={11} strokeWidth={2.5} /> Selected
                                                                </div>
                                                            )}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        ) : (
                                            <p style={{ fontSize: 12, color: 'var(--accent)', marginBottom: 10 }}>
                                                No packages configured for this venue yet.
                                            </p>
                                        )}

                                        {/* Custom service name */}
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            {availablePackages.length > 0 && (
                                                <span style={{ fontSize: 12, color: 'var(--accent)', flexShrink: 0 }}>or</span>
                                            )}
                                            <input
                                                type="text"
                                                className="form-input"
                                                placeholder="Enter custom service name…"
                                                value={customServiceName}
                                                onChange={e => {
                                                    setCustomServiceName(e.target.value);
                                                    if (e.target.value) setSelectedPkgIdx(null);
                                                }}
                                                style={{ fontSize: 13 }}
                                            />
                                            {(selectedPkgIdx !== null || customServiceName) && (
                                                <button
                                                    type="button"
                                                    onClick={() => { setSelectedPkgIdx(null); setCustomServiceName(''); setBookingForm(p => ({ ...p, amount: '' })); }}
                                                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent)', fontSize: 12, flexShrink: 0, whiteSpace: 'nowrap' }}
                                                >
                                                    Clear
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {/* ---- Section 2: Time Slot ---- */}
                                    <div style={{ marginBottom: 24 }}>
                                        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 8 }}>
                                            <h4 style={{ fontSize: 13, fontWeight: 600, margin: 0 }}>
                                                Select Time Slot(s) <span style={{ color: '#dc3535' }}>*</span>
                                            </h4>
                                            {selectedTimeSlots.size > 0 && (
                                                <span style={{ fontSize: 12, color: 'var(--primary-btn, #2f855a)', fontWeight: 500 }}>
                                                    {selectedTimeSlots.size} slot{selectedTimeSlots.size > 1 ? 's' : ''} selected
                                                </span>
                                            )}
                                        </div>

                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                                            {TIME_SLOTS.map(slot => {
                                                const info = getSlotInfo(slot);
                                                return (
                                                    <div
                                                        key={slot}
                                                        style={getSlotStyle(slot)}
                                                        onClick={() => handleSelectTimeSlot(slot)}
                                                    >
                                                        <div>{slot}</div>
                                                        {info.count > 0 && (
                                                            <div style={{
                                                                fontSize: 10,
                                                                marginTop: 3,
                                                                opacity: 0.85,
                                                            }}>
                                                                {info.status === 'blocked'
                                                                    ? 'Unavailable'
                                                                    : `${info.count} booked`}
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        {/* Legend */}
                                        <div style={{ display: 'flex', gap: 16, marginTop: 10 }}>
                                            {[
                                                { color: 'var(--primary-btn, #2f855a)', label: 'Available' },
                                                { color: '#f59e0b', label: 'Partially booked' },
                                                { color: '#dc3535', label: 'Unavailable' },
                                            ].map(item => (
                                                <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--accent)' }}>
                                                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: item.color, display: 'inline-block', flexShrink: 0 }} />
                                                    {item.label}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* ---- Section 3: Guest Details ---- */}
                                    <div>
                                        <h4 style={{ fontSize: 13, fontWeight: 600, margin: '0 0 12px' }}>Guest Details</h4>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                                <label className="form-label">Guest Name <span style={{ color: '#dc3535' }}>*</span></label>
                                                <input
                                                    type="text"
                                                    className="form-input"
                                                    value={bookingForm.guest_name}
                                                    onChange={e => setBookingForm(p => ({ ...p, guest_name: e.target.value }))}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label">Guest Email</label>
                                                <input
                                                    type="email"
                                                    className="form-input"
                                                    value={bookingForm.guest_email}
                                                    onChange={e => setBookingForm(p => ({ ...p, guest_email: e.target.value }))}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label">Guest Phone</label>
                                                <input
                                                    type="text"
                                                    className="form-input"
                                                    value={bookingForm.guest_phone}
                                                    onChange={e => setBookingForm(p => ({ ...p, guest_phone: e.target.value }))}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label">Guests</label>
                                                <input
                                                    type="number"
                                                    className="form-input"
                                                    min={1}
                                                    value={bookingForm.guests}
                                                    onChange={e => setBookingForm(p => ({ ...p, guests: parseInt(e.target.value) || 1 }))}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label">Amount (AUD)</label>
                                                <input
                                                    type="number"
                                                    className="form-input"
                                                    value={bookingForm.amount}
                                                    placeholder="0.00"
                                                    onChange={e => setBookingForm(p => ({ ...p, amount: e.target.value }))}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label">Status</label>
                                                <select
                                                    className="form-input form-select"
                                                    value={bookingForm.status}
                                                    onChange={e => setBookingForm(p => ({ ...p, status: e.target.value as Booking['status'] }))}
                                                >
                                                    <option value="confirmed">Confirmed</option>
                                                    <option value="pending">Pending</option>
                                                </select>
                                            </div>
                                            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                                <label className="form-label">Notes</label>
                                                <textarea
                                                    className="form-input form-textarea"
                                                    rows={2}
                                                    value={bookingForm.notes}
                                                    onChange={e => setBookingForm(p => ({ ...p, notes: e.target.value }))}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="modal-footer" style={{ flexShrink: 0 }}>
                            <div style={{ fontSize: 11, color: 'var(--accent)', flex: 1 }}>
                                {selectedTimeSlots.size === 0 && <span style={{ color: '#dc3535' }}>Please select at least one time slot</span>}
                                {selectedTimeSlots.size > 0 && !bookingForm.guest_name && <span style={{ color: '#dc3535' }}>Please enter guest name</span>}
                            </div>
                            <button className="btn btn-secondary" onClick={() => setShowBookingModal(false)}>Cancel</button>
                            <button
                                className="btn btn-primary"
                                onClick={handleAddBooking}
                                disabled={bookingSaving || !bookingForm.guest_name || selectedTimeSlots.size === 0 || modalLoading}
                            >
                                {bookingSaving ? 'Saving…' : 'Add Booking'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
