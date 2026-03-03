import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, Users, Download, Upload, Filter } from 'lucide-react';
import type { Venue } from '../../context/VenueContext';

interface Props {
    venue: Venue;
    onUpdate: (updates: Partial<Venue>) => void;
}

export default function WellnessBookingsTab({ venue: _venue, onUpdate: _onUpdate }: Props) {
    const [activeBookingTab, setActiveBookingTab] = useState('All');

    // Calendar variables
    const daysInMonth = 28; // Feb 2026

    return (
        <div className="wvd-content">
            {/* Booking Stats */}
            <div className="wb-stats">
                <div className="wb-stat">
                    <div className="wb-stat-value">47</div>
                    <div className="wb-stat-label">Total Appointments</div>
                </div>
                <div className="wb-stat">
                    <div className="wb-stat-value success">42</div>
                    <div className="wb-stat-label">Completed</div>
                </div>
                <div className="wb-stat">
                    <div className="wb-stat-value warning">3</div>
                    <div className="wb-stat-label">Upcoming</div>
                </div>
                <div className="wb-stat">
                    <div className="wb-stat-value info">2</div>
                    <div className="wb-stat-label">Pending</div>
                </div>
                <div className="wb-stat">
                    <div className="wb-stat-value">$8,450</div>
                    <div className="wb-stat-label">Total Revenue</div>
                </div>
            </div>

            {/* Calendar */}
            <div className="wb-calendar-section">
                <div className="wb-calendar-header">
                    <div className="wb-calendar-nav">
                        <button className="wb-calendar-nav-btn"><ChevronLeft size={20} /></button>
                        <span className="wb-calendar-month">February 2026</span>
                        <button className="wb-calendar-nav-btn"><ChevronRight size={20} /></button>
                    </div>
                    <div className="wb-calendar-actions">
                        <button className="wvd-btn-secondary wvd-btn-small">
                            <CalendarIcon size={14} /> Block Dates
                        </button>
                        <button className="wvd-btn-primary wvd-btn-small">
                            <Clock size={14} /> Add Booking
                        </button>
                    </div>
                </div>
                <div className="wb-calendar-grid">
                    <div className="wb-calendar-weekdays">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                            <div key={day} className="wb-calendar-weekday">{day}</div>
                        ))}
                    </div>
                    <div className="wb-calendar-days">
                        {/* Previous Month Days */}
                        {[26, 27, 28, 29, 30, 31].map(num => (
                            <div key={`prev-${num}`} className="wb-calendar-day other-month"><span className="wb-calendar-day-number">{num}</span></div>
                        ))}

                        {/* Current Month Days */}
                        {Array.from({ length: daysInMonth }).map((_, i) => {
                            const day = i + 1;
                            let statusClass = '';
                            let indicatorClass = '';

                            if (day === 10) statusClass = 'today';
                            else if ([20, 21, 22, 23].includes(day)) {
                                statusClass = 'booked';
                                indicatorClass = 'confirmed';
                            } else if ([27, 28].includes(day)) {
                                statusClass = 'enquiry';
                                indicatorClass = 'pending';
                            }

                            return (
                                <div key={`curr-${day}`} className={`wb-calendar-day ${statusClass}`}>
                                    <span className="wb-calendar-day-number">{day}</span>
                                    {indicatorClass && <span className={`wb-calendar-day-indicator ${indicatorClass}`}></span>}
                                </div>
                            );
                        })}

                        {/* Next Month Days */}
                        {[1, 2, 3, 4, 5, 6].slice(0, 42 - (6 + daysInMonth)).map(num => (
                            <div key={`next-${num}`} className="wb-calendar-day other-month"><span className="wb-calendar-day-number">{num}</span></div>
                        ))}
                    </div>
                </div>
                <div className="wb-calendar-legend">
                    <div className="wb-legend-item">
                        <span className="wb-legend-dot confirmed"></span> Confirmed Booking
                    </div>
                    <div className="wb-legend-item">
                        <span className="wb-legend-dot pending"></span> Pending / Enquiry
                    </div>
                    <div className="wb-legend-item">
                        <span className="wb-legend-dot blocked"></span> Blocked Dates
                    </div>
                </div>
            </div>

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
                    {/* Booking Tabs */}
                    <div className="wb-booking-tabs">
                        {['All', 'Upcoming', 'Pending', 'Completed', 'Cancelled'].map(tab => {
                            const counts: Record<string, number> = { All: 47, Upcoming: 3, Pending: 2, Completed: 42, Cancelled: 0 };
                            return (
                                <button
                                    key={tab}
                                    className={`wb-booking-tab ${activeBookingTab === tab ? 'active' : ''}`}
                                    onClick={() => setActiveBookingTab(tab)}
                                >
                                    {tab}<span className="wb-booking-tab-count">({counts[tab]})</span>
                                </button>
                            );
                        })}
                    </div>

                    <div className="wb-booking-list">

                        {/* Pending Appointment */}
                        <div className="wb-booking-card">
                            <div className="wb-booking-date-strip warning">
                                <span className="wb-date-month">Feb</span>
                                <span className="wb-date-day">13</span>
                                <span className="wb-date-year">2026</span>
                            </div>
                            <div className="wb-booking-content">
                                <div className="wb-booking-info">
                                    <div className="wb-booking-title">Signature Relaxation Massage</div>
                                    <div className="wb-booking-subtitle">Sarah Thompson • 10:00 AM</div>
                                    <div className="wb-booking-details">
                                        <span className="wb-booking-detail"><Clock size={14} /> 90 minutes</span>
                                        <span className="wb-booking-detail"><Users size={14} /> 1 guest</span>
                                        <span className="wb-booking-detail text-warning"><Clock size={14} /> Awaiting confirmation</span>
                                    </div>
                                </div>
                                <div className="wb-booking-meta">
                                    <span className="wb-booking-status pending">
                                        <Clock size={12} strokeWidth={2} /> Pending
                                    </span>
                                    <div className="wb-booking-amount">$195</div>
                                    <div className="wb-booking-actions">
                                        <button className="wvd-btn-primary wvd-btn-small">Confirm</button>
                                        <button className="wvd-btn-secondary wvd-btn-small">Reschedule</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Upcoming Confirmed (1) */}
                        <div className="wb-booking-card">
                            <div className="wb-booking-date-strip">
                                <span className="wb-date-month">Feb</span>
                                <span className="wb-date-day">14</span>
                                <span className="wb-date-year">2026</span>
                            </div>
                            <div className="wb-booking-content">
                                <div className="wb-booking-info">
                                    <div className="wb-booking-title">Couples Day Spa Package</div>
                                    <div className="wb-booking-subtitle">Michael & Emma Roberts • 2:00 PM</div>
                                    <div className="wb-booking-details">
                                        <span className="wb-booking-detail"><Clock size={14} /> 3 hours</span>
                                        <span className="wb-booking-detail"><Users size={14} /> 2 guests</span>
                                    </div>
                                </div>
                                <div className="wb-booking-meta">
                                    <span className="wb-booking-status confirmed">
                                        <Filter size={12} strokeWidth={2} /> Confirmed
                                    </span>
                                    <div className="wb-booking-amount">$550</div>
                                    <div className="wb-booking-actions">
                                        <button className="wvd-btn-secondary wvd-btn-small">View Details</button>
                                        <button className="wvd-btn-secondary wvd-btn-small">Message</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Upcoming Confirmed (2) */}
                        <div className="wb-booking-card">
                            <div className="wb-booking-date-strip">
                                <span className="wb-date-month">Feb</span>
                                <span className="wb-date-day">15</span>
                                <span className="wb-date-year">2026</span>
                            </div>
                            <div className="wb-booking-content">
                                <div className="wb-booking-info">
                                    <div className="wb-booking-title">Hydrating Facial Treatment</div>
                                    <div className="wb-booking-subtitle">Jennifer Liu • 11:30 AM</div>
                                    <div className="wb-booking-details">
                                        <span className="wb-booking-detail"><Clock size={14} /> 60 minutes</span>
                                        <span className="wb-booking-detail"><Users size={14} /> 1 guest</span>
                                    </div>
                                </div>
                                <div className="wb-booking-meta">
                                    <span className="wb-booking-status confirmed">
                                        <Filter size={12} strokeWidth={2} /> Confirmed
                                    </span>
                                    <div className="wb-booking-amount">$165</div>
                                    <div className="wb-booking-actions">
                                        <button className="wvd-btn-secondary wvd-btn-small">View Details</button>
                                        <button className="wvd-btn-secondary wvd-btn-small">Message</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Pending Appointment 2 */}
                        <div className="wb-booking-card">
                            <div className="wb-booking-date-strip warning">
                                <span className="wb-date-month">Feb</span>
                                <span className="wb-date-day">16</span>
                                <span className="wb-date-year">2026</span>
                            </div>
                            <div className="wb-booking-content">
                                <div className="wb-booking-info">
                                    <div className="wb-booking-title">Hot Stone Therapy</div>
                                    <div className="wb-booking-subtitle">David Kim • 4:00 PM</div>
                                    <div className="wb-booking-details">
                                        <span className="wb-booking-detail"><Clock size={14} /> 75 minutes</span>
                                        <span className="wb-booking-detail"><Users size={14} /> 1 guest</span>
                                        <span className="wb-booking-detail text-warning"><Clock size={14} /> Awaiting confirmation</span>
                                    </div>
                                </div>
                                <div className="wb-booking-meta">
                                    <span className="wb-booking-status pending">
                                        <Clock size={12} strokeWidth={2} /> Pending
                                    </span>
                                    <div className="wb-booking-amount">$185</div>
                                    <div className="wb-booking-actions">
                                        <button className="wvd-btn-primary wvd-btn-small">Confirm</button>
                                        <button className="wvd-btn-secondary wvd-btn-small">Reschedule</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Completed */}
                        <div className="wb-booking-card opacity-70">
                            <div className="wb-booking-date-strip muted">
                                <span className="wb-date-month">Feb</span>
                                <span className="wb-date-day">11</span>
                                <span className="wb-date-year">2026</span>
                            </div>
                            <div className="wb-booking-content">
                                <div className="wb-booking-info">
                                    <div className="wb-booking-title">Deep Tissue Massage</div>
                                    <div className="wb-booking-subtitle">James Wilson • 3:30 PM</div>
                                    <div className="wb-booking-details">
                                        <span className="wb-booking-detail"><Clock size={14} /> 60 minutes</span>
                                        <span className="wb-booking-detail"><Users size={14} /> 1 guest</span>
                                    </div>
                                </div>
                                <div className="wb-booking-meta">
                                    <span className="wb-booking-status completed">
                                        <Filter size={12} strokeWidth={2} /> Completed
                                    </span>
                                    <div className="wb-booking-amount">$145</div>
                                    <div className="wb-booking-actions">
                                        <button className="wvd-btn-secondary wvd-btn-small">View Details</button>
                                        <button className="wvd-btn-secondary wvd-btn-small">Request Review</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* Revenue Summary */}
            <section className="wvd-form-section">
                <div className="wvd-form-section-header">
                    <div>
                        <h3 className="wvd-form-section-title">Revenue Summary</h3>
                        <p className="wvd-form-hint">Service revenue for this venue</p>
                    </div>
                </div>
                <div className="wvd-form-section-body">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '32px' }}>
                        <div>
                            <div className="wb-revenue-row">
                                <span className="wb-revenue-label">Total Booking Value</span>
                                <span className="wb-revenue-value">$8,830</span>
                            </div>
                            <div className="wb-revenue-row">
                                <span className="wb-revenue-label">Confirmed Revenue</span>
                                <span className="wb-revenue-value">$8,070</span>
                            </div>
                            <div className="wb-revenue-row">
                                <span className="wb-revenue-label">Pending Revenue</span>
                                <span className="wb-revenue-value" style={{ color: 'var(--warning)' }}>$380</span>
                            </div>
                        </div>
                        <div>
                            <div className="wb-revenue-row">
                                <span className="wb-revenue-label">TGS Commission (10%)</span>
                                <span className="wb-revenue-value">$807</span>
                            </div>
                            <div className="wb-revenue-row">
                                <span className="wb-revenue-label">Stripe Fees (3%)</span>
                                <span className="wb-revenue-value">$242</span>
                            </div>
                            <div className="wb-revenue-row">
                                <span className="wb-revenue-label">Venue Net Revenue</span>
                                <span className="wb-revenue-value total">$7,021</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* iCal Sync */}
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
                                <input type="text" className="wvd-form-input" value="https://theglobalsanctum.com/ical/bodhi-day-spa-xyz789" style={{ flex: 1, fontSize: '12px' }} readOnly />
                                <button className="wvd-btn-secondary wvd-btn-small">Copy</button>
                            </div>
                        </div>
                        <div style={{ padding: '20px', background: 'var(--secondary-bg)', borderRadius: '10px' }}>
                            <div style={{ fontWeight: 600, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Upload size={20} /> Import Calendar
                            </div>
                            <p style={{ fontSize: '12px', color: 'var(--accent)', marginBottom: '12px' }}>Import availability from Mindbody, Fresha, or other platforms</p>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <input type="text" className="wvd-form-input" placeholder="Paste iCal URL here..." style={{ flex: 1, fontSize: '12px' }} />
                                <button className="wvd-btn-primary wvd-btn-small">Import</button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
}
