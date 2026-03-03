import { useState } from 'react';
import { Calendar, Download, RefreshCw, Check } from 'lucide-react';
import type { Venue } from '../context/VenueContext';

interface BookingsTabProps {
    venue: Venue;
    onUpdate?: (updates: Partial<Venue>) => void;
}

export default function BookingsTab({ venue }: BookingsTabProps) {
    const [activeSubTab, setActiveSubTab] = useState('All');

    return (
        <div>
            {/* Booking Stats */}
            <div className="booking-stats">
                <div className="booking-stat">
                    <div className="booking-stat-value">3</div>
                    <div className="booking-stat-label">Total Bookings</div>
                </div>
                <div className="booking-stat">
                    <div className="booking-stat-value success">2</div>
                    <div className="booking-stat-label">Confirmed</div>
                </div>
                <div className="booking-stat">
                    <div className="booking-stat-value warning">1</div>
                    <div className="booking-stat-label">Pending</div>
                </div>
                <div className="booking-stat">
                    <div className="booking-stat-value info">1</div>
                    <div className="booking-stat-label">Enquiries</div>
                </div>
                <div className="booking-stat">
                    <div className="booking-stat-value">$31,500</div>
                    <div className="booking-stat-label">Total Revenue</div>
                </div>
            </div>

            {/* Calendar */}
            <div className="calendar-section">
                <div className="calendar-header">
                    <div className="calendar-nav">
                        <button className="calendar-nav-btn">
                            <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <polyline points="15,18 9,12 15,6" />
                            </svg>
                        </button>
                        <span className="calendar-month">February 2026</span>
                        <button className="calendar-nav-btn">
                            <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <polyline points="9,18 15,12 9,6" />
                            </svg>
                        </button>
                    </div>
                    <div className="calendar-actions">
                        <button className="btn btn-secondary btn-small">
                            <span style={{ marginRight: 6 }}>⊘</span> Block Dates
                        </button>
                        <button className="btn btn-primary btn-small">
                            <span style={{ marginRight: 6 }}>+</span> Add Booking
                        </button>
                    </div>
                </div>
                <div className="calendar-grid">
                    <div className="calendar-weekdays">
                        <div className="calendar-weekday">Sun</div>
                        <div className="calendar-weekday">Mon</div>
                        <div className="calendar-weekday">Tue</div>
                        <div className="calendar-weekday">Wed</div>
                        <div className="calendar-weekday">Thu</div>
                        <div className="calendar-weekday">Fri</div>
                        <div className="calendar-weekday">Sat</div>
                    </div>
                    <div className="calendar-days">
                        <div className="calendar-day other-month"><span className="calendar-day-number">26</span></div>
                        <div className="calendar-day other-month"><span className="calendar-day-number">27</span></div>
                        <div className="calendar-day other-month"><span className="calendar-day-number">28</span></div>
                        <div className="calendar-day other-month"><span className="calendar-day-number">29</span></div>
                        <div className="calendar-day other-month"><span className="calendar-day-number">30</span></div>
                        <div className="calendar-day other-month"><span className="calendar-day-number">31</span></div>
                        <div className="calendar-day"><span className="calendar-day-number">1</span></div>

                        <div className="calendar-day"><span className="calendar-day-number">2</span></div>
                        <div className="calendar-day"><span className="calendar-day-number">3</span></div>
                        <div className="calendar-day"><span className="calendar-day-number">4</span></div>
                        <div className="calendar-day"><span className="calendar-day-number">5</span></div>
                        <div className="calendar-day"><span className="calendar-day-number">6</span></div>
                        <div className="calendar-day"><span className="calendar-day-number">7</span></div>
                        <div className="calendar-day"><span className="calendar-day-number">8</span></div>

                        <div className="calendar-day"><span className="calendar-day-number">9</span></div>
                        <div className="calendar-day today"><span className="calendar-day-number">10</span></div>
                        <div className="calendar-day"><span className="calendar-day-number">11</span></div>
                        <div className="calendar-day"><span className="calendar-day-number">12</span></div>
                        <div className="calendar-day"><span className="calendar-day-number">13</span></div>
                        <div className="calendar-day"><span className="calendar-day-number">14</span></div>
                        <div className="calendar-day"><span className="calendar-day-number">15</span></div>

                        <div className="calendar-day"><span className="calendar-day-number">16</span></div>
                        <div className="calendar-day"><span className="calendar-day-number">17</span></div>
                        <div className="calendar-day"><span className="calendar-day-number">18</span></div>
                        <div className="calendar-day"><span className="calendar-day-number">19</span></div>
                        <div className="calendar-day booked"><span className="calendar-day-number">20</span><span className="calendar-day-indicator confirmed"></span></div>
                        <div className="calendar-day booked"><span className="calendar-day-number">21</span><span className="calendar-day-indicator confirmed"></span></div>
                        <div className="calendar-day booked"><span className="calendar-day-number">22</span><span className="calendar-day-indicator confirmed"></span></div>

                        <div className="calendar-day booked"><span className="calendar-day-number">23</span><span className="calendar-day-indicator confirmed"></span></div>
                        <div className="calendar-day"><span className="calendar-day-number">24</span></div>
                        <div className="calendar-day"><span className="calendar-day-number">25</span></div>
                        <div className="calendar-day"><span className="calendar-day-number">26</span></div>
                        <div className="calendar-day enquiry"><span className="calendar-day-number">27</span><span className="calendar-day-indicator pending"></span></div>
                        <div className="calendar-day enquiry"><span className="calendar-day-number">28</span><span className="calendar-day-indicator pending"></span></div>
                        <div className="calendar-day other-month"><span className="calendar-day-number">1</span></div>
                    </div>
                </div>
                <div className="calendar-legend">
                    <div className="legend-item">
                        <span className="legend-dot confirmed"></span>
                        Confirmed Booking
                    </div>
                    <div className="legend-item">
                        <span className="legend-dot pending"></span>
                        Pending / Enquiry
                    </div>
                    <div className="legend-item">
                        <span className="legend-dot blocked"></span>
                        Blocked Dates
                    </div>
                </div>
            </div>

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
                    {/* Booking Tabs */}
                    <div className="booking-tabs">
                        {['All(4)', 'Upcoming(2)', 'Enquiries(1)', 'Completed(1)', 'Cancelled(0)'].map(tab => {
                            const name = tab.split('(')[0];
                            const count = `(${tab.split('(')[1]}`;
                            return (
                                <button
                                    key={name}
                                    className={`booking-tab ${activeSubTab === name ? 'active' : ''}`}
                                    onClick={() => setActiveSubTab(name)}
                                >
                                    {name}<span className="booking-tab-count">{count}</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Booking List */}
                    <div className="booking-list">

                        {/* Upcoming Confirmed */}
                        <div className="booking-card">
                            <div className="booking-date-strip">
                                <span className="booking-date-month">Feb</span>
                                <span className="booking-date-day">20</span>
                                <span className="booking-date-year">2026</span>
                            </div>
                            <div className="booking-content">
                                <div className="booking-info">
                                    <div className="booking-title">Women's Wellness Retreat</div>
                                    <div className="booking-subtitle">Hosted by Emma Davis • Stillness Project</div>
                                    <div className="booking-details">
                                        <span className="booking-detail">
                                            <Calendar className="icon icon-small" />
                                            Feb 20 - 23, 2026 (4 nights)
                                        </span>
                                        <span className="booking-detail">
                                            <svg className="icon icon-small" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                                                <circle cx="9" cy="7" r="4" />
                                            </svg>
                                            10 guests
                                        </span>
                                    </div>
                                </div>
                                <div className="booking-meta">
                                    <span className="booking-status confirmed">
                                        <Check width="12" height="12" strokeWidth="2" />
                                        Confirmed
                                    </span>
                                    <div className="booking-amount">$18,000</div>
                                    <div className="booking-actions">
                                        <button className="btn btn-secondary btn-small">View Details</button>
                                        <button className="btn btn-secondary btn-small">Message</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Pending Enquiry */}
                        <div className="booking-card">
                            <div className="booking-date-strip" style={{ backgroundColor: 'var(--warning)' }}>
                                <span className="booking-date-month">Feb</span>
                                <span className="booking-date-day">27</span>
                                <span className="booking-date-year">2026</span>
                            </div>
                            <div className="booking-content">
                                <div className="booking-info">
                                    <div className="booking-title">Corporate Mindfulness Workshop</div>
                                    <div className="booking-subtitle">Enquiry from James Chen • Zenith Consulting</div>
                                    <div className="booking-details">
                                        <span className="booking-detail">
                                            <Calendar className="icon icon-small" />
                                            Feb 27 - Mar 1, 2026 (2 nights)
                                        </span>
                                        <span className="booking-detail">
                                            <svg className="icon icon-small" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                                                <circle cx="9" cy="7" r="4" />
                                            </svg>
                                            8 guests
                                        </span>
                                        <span className="booking-detail" style={{ color: 'var(--warning)' }}>
                                            <svg className="icon icon-small" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                                <circle cx="12" cy="12" r="10" />
                                                <polyline points="12,6 12,12 16,14" />
                                            </svg>
                                            Expires in 36 hours
                                        </span>
                                    </div>
                                </div>
                                <div className="booking-meta">
                                    <span className="booking-status pending">
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <circle cx="12" cy="12" r="10" />
                                            <polyline points="12,6 12,12 16,14" />
                                        </svg>
                                        Pending Enquiry
                                    </span>
                                    <div className="booking-amount">$9,000</div>
                                    <div className="booking-actions">
                                        <button className="btn btn-primary btn-small">Accept</button>
                                        <button className="btn btn-secondary btn-small">Decline</button>
                                        <button className="btn btn-secondary btn-small">Message</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Upcoming Confirmed */}
                        <div className="booking-card">
                            <div className="booking-date-strip">
                                <span className="booking-date-month">Mar</span>
                                <span className="booking-date-day">15</span>
                                <span className="booking-date-year">2026</span>
                            </div>
                            <div className="booking-content">
                                <div className="booking-info">
                                    <div className="booking-title">Yoga Teacher Training Intensive</div>
                                    <div className="booking-subtitle">Hosted by Anna Richardson • Soul Yoga</div>
                                    <div className="booking-details">
                                        <span className="booking-detail">
                                            <Calendar className="icon icon-small" />
                                            Mar 15 - 22, 2026 (7 nights)
                                        </span>
                                        <span className="booking-detail">
                                            <svg className="icon icon-small" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                                                <circle cx="9" cy="7" r="4" />
                                            </svg>
                                            12 guests
                                        </span>
                                    </div>
                                </div>
                                <div className="booking-meta">
                                    <span className="booking-status confirmed">
                                        <Check width="12" height="12" strokeWidth="2" />
                                        Confirmed
                                    </span>
                                    <div className="booking-amount">$28,000</div>
                                    <div className="booking-actions">
                                        <button className="btn btn-secondary btn-small">View Details</button>
                                        <button className="btn btn-secondary btn-small">Message</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Completed */}
                        <div className="booking-card" style={{ opacity: 0.7 }}>
                            <div className="booking-date-strip" style={{ backgroundColor: 'var(--accent)' }}>
                                <span className="booking-date-month">Jan</span>
                                <span className="booking-date-day">25</span>
                                <span className="booking-date-year">2026</span>
                            </div>
                            <div className="booking-content">
                                <div className="booking-info">
                                    <div className="booking-title">Silent Meditation Retreat</div>
                                    <div className="booking-subtitle">Hosted by Tom Cronin • The Stillness Project</div>
                                    <div className="booking-details">
                                        <span className="booking-detail">
                                            <Calendar className="icon icon-small" />
                                            Jan 25 - 28, 2026 (3 nights)
                                        </span>
                                        <span className="booking-detail">
                                            <svg className="icon icon-small" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                                                <circle cx="9" cy="7" r="4" />
                                            </svg>
                                            8 guests
                                        </span>
                                    </div>
                                </div>
                                <div className="booking-meta">
                                    <span className="booking-status completed">
                                        <Check width="12" height="12" strokeWidth="2" />
                                        Completed
                                    </span>
                                    <div className="booking-amount">$13,500</div>
                                    <div className="booking-actions">
                                        <button className="btn btn-secondary btn-small">View Details</button>
                                        <button className="btn btn-secondary btn-small">Leave Review</button>
                                    </div>
                                </div>
                            </div>
                        </div>

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
                                <span className="revenue-value">$68,500</span>
                            </div>
                            <div className="revenue-row">
                                <span className="revenue-label">Confirmed Revenue</span>
                                <span className="revenue-value">$59,500</span>
                            </div>
                            <div className="revenue-row">
                                <span className="revenue-label">Pending Revenue</span>
                                <span className="revenue-value" style={{ color: 'var(--warning)' }}>$9,000</span>
                            </div>
                        </div>
                        <div>
                            <div className="revenue-row">
                                <span className="revenue-label">TGS Commission (5%)</span>
                                <span className="revenue-value">$2,975</span>
                            </div>
                            <div className="revenue-row">
                                <span className="revenue-label">Stripe Fees (3%)</span>
                                <span className="revenue-value">$1,785</span>
                            </div>
                            <div className="revenue-row">
                                <span className="revenue-label">Venue Net Revenue</span>
                                <span className="revenue-value total">$54,740</span>
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
                                <Download width="20" height="20" strokeWidth="1.5" />
                                Export Calendar (iCal)
                            </div>
                            <p style={{ fontSize: 12, color: 'var(--accent)', marginBottom: 12 }}>Share this link with other platforms to export TGS bookings</p>
                            <div style={{ display: 'flex', gap: 8 }}>
                                <input type="text" className="form-input" value="https://theglobalsanctum.com/ical/moraea-farm-abc123" style={{ flex: 1, fontSize: 12 }} readOnly />
                                <button className="btn btn-secondary btn-small">Copy</button>
                            </div>
                        </div>
                        <div style={{ padding: 20, background: 'var(--secondary-bg)', borderRadius: 10 }}>
                            <div style={{ fontWeight: 600, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                                <RefreshCw width="20" height="20" strokeWidth="1.5" />
                                Import Calendar
                            </div>
                            <p style={{ fontSize: 12, color: 'var(--accent)', marginBottom: 12 }}>Import availability from Airbnb, VRBO, or other platforms</p>
                            <div style={{ display: 'flex', gap: 8 }}>
                                <input type="text" className="form-input" placeholder="Paste iCal URL here..." style={{ flex: 1, fontSize: 12 }} />
                                <button className="btn btn-primary btn-small">Import</button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
}
