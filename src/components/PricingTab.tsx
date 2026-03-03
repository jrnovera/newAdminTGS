import { Plus, Check, Image as ImageIcon } from 'lucide-react';
import type { Venue } from '../context/VenueContext';

interface PricingTabProps {
    venue: Venue;
    onUpdate: (updates: Partial<Venue>) => void;
}

export default function PricingTab(_props: PricingTabProps) {
    return (
        <div>
            {/* Tab Images */}
            <section className="form-section">
                <div className="form-section-header">
                    <div>
                        <h3 className="form-section-title">Tab Images</h3>
                        <p className="form-section-subtitle">Hero image displayed on the Booking tab of your public listing</p>
                    </div>
                </div>
                <div className="form-section-body">
                    <div className="form-grid">
                        <div className="form-group">
                            <label className="form-label">Booking Tab Hero Image</label>
                            <div
                                className="image-upload-area"
                                style={{
                                    border: '2px dashed rgba(184, 184, 184, 0.4)',
                                    borderRadius: 12,
                                    padding: 40,
                                    textAlign: 'center',
                                    backgroundColor: 'var(--secondary-bg)',
                                    cursor: 'pointer'
                                }}
                            >
                                <ImageIcon color="#B8B8B8" size={48} style={{ marginBottom: 16 }} />
                                <p style={{ color: 'var(--text)', fontWeight: 500, marginBottom: 4 }}>Click to upload or drag and drop</p>
                                <p style={{ color: 'var(--accent)', fontSize: 12 }}>Recommended: 1920×600px, JPG or PNG</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Booking Tab Content */}
            <section className="form-section">
                <div className="form-section-header">
                    <div>
                        <h3 className="form-section-title">Booking Tab Content</h3>
                        <p className="form-section-subtitle">Intro text displayed on the Booking tab of your public listing</p>
                    </div>
                </div>
                <div className="form-section-body">
                    <div className="form-grid">
                        <div className="form-group">
                            <label className="form-label">Section Label</label>
                            <input type="text" className="form-input" defaultValue="Booking & Terms" placeholder="e.g. Booking & Terms, Rates & Availability" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Section Title</label>
                            <input type="text" className="form-input" defaultValue="Plan Your Retreat" placeholder="e.g. Plan Your Retreat, Reserve Your Experience" />
                        </div>
                        <div className="form-group full-width">
                            <label className="form-label">Section Subtitle</label>
                            <input type="text" className="form-input" defaultValue="Everything you need to know about rates, availability, and the booking process." placeholder="Brief intro text for the booking section..." />
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing Overview Cards */}
            <div className="pricing-cards">
                <div className="pricing-card">
                    <div className="pricing-card-label">Starting From</div>
                    <div className="pricing-card-value">$4,000</div>
                    <div className="pricing-card-period">per night (low season)</div>
                </div>
                <div className="pricing-card featured">
                    <div className="pricing-card-label">Standard Rate</div>
                    <div className="pricing-card-value">$4,500</div>
                    <div className="pricing-card-period">per night</div>
                </div>
                <div className="pricing-card">
                    <div className="pricing-card-label">Peak Season</div>
                    <div className="pricing-card-value">$5,500</div>
                    <div className="pricing-card-period">per night</div>
                </div>
            </div>

            {/* Base Pricing */}
            <section className="form-section">
                <div className="form-section-header">
                    <div>
                        <h3 className="form-section-title">Base Pricing</h3>
                        <p className="form-section-subtitle">Primary venue hire rates</p>
                    </div>
                </div>
                <div className="form-section-body">
                    <div className="form-grid three-col">
                        <div className="form-group">
                            <label className="form-label">Currency <span className="required">*</span></label>
                            <select className="form-input form-select" defaultValue="AUD - Australian Dollar">
                                <option>AUD - Australian Dollar</option>
                                <option>USD - US Dollar</option>
                                <option>EUR - Euro</option>
                                <option>GBP - British Pound</option>
                                <option>NZD - New Zealand Dollar</option>
                                <option>JPY - Japanese Yen</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Pricing Model <span className="required">*</span></label>
                            <select className="form-input form-select" defaultValue="Per Night (Whole Property)">
                                <option>Per Night (Whole Property)</option>
                                <option>Per Person Per Night</option>
                                <option>Per Room Per Night</option>
                                <option>Flat Rate (Multi-day Package)</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Price Range Category</label>
                            <select className="form-input form-select" defaultValue="Upscale">
                                <option>Budget</option>
                                <option>Mid-Range</option>
                                <option>Upscale</option>
                                <option>Luxury</option>
                                <option>Ultra-Luxury</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Base Nightly Rate <span className="required">*</span></label>
                            <div className="price-input-wrapper">
                                <span className="price-currency">$</span>
                                <input type="text" className="form-input price-input" defaultValue="4,500" />
                                <span className="price-suffix">/ night</span>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Weekend Rate</label>
                            <div className="price-input-wrapper">
                                <span className="price-currency">$</span>
                                <input type="text" className="form-input price-input" defaultValue="5,000" />
                                <span className="price-suffix">/ night</span>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Weekly Rate (7+ nights)</label>
                            <div className="price-input-wrapper">
                                <span className="price-currency">$</span>
                                <input type="text" className="form-input price-input" defaultValue="28,000" />
                                <span className="price-suffix">/ week</span>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Cleaning Fee</label>
                            <div className="price-input-wrapper">
                                <span className="price-currency">$</span>
                                <input type="text" className="form-input price-input" defaultValue="500" />
                                <span className="price-suffix">one-time</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Group Discounts */}
            <section className="form-section">
                <div className="form-section-header">
                    <div>
                        <h3 className="form-section-title">Group Discounts</h3>
                        <p className="form-section-subtitle">Volume discounts for larger or longer bookings</p>
                    </div>
                </div>
                <div className="form-section-body">
                    <div className="form-grid three-col">
                        <div className="form-group">
                            <label className="form-label">Group Discounts Available</label>
                            <div className="toggle-container">
                                <div className="toggle active">
                                    <div className="toggle-knob"></div>
                                </div>
                                <span className="toggle-label">Yes</span>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Discount Percentage</label>
                            <div className="price-input-wrapper">
                                <input type="text" className="form-input price-input" defaultValue="10" style={{ textAlign: 'right' }} />
                                <span className="price-suffix">%</span>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Minimum Nights for Discount</label>
                            <select className="form-input form-select" defaultValue="7 nights">
                                <option>3 nights</option>
                                <option>5 nights</option>
                                <option>7 nights</option>
                                <option>10 nights</option>
                                <option>14 nights</option>
                            </select>
                        </div>
                        <div className="form-group full-width">
                            <label className="form-label">Group Discount Details (Optional)</label>
                            <textarea className="form-input form-textarea" rows={2} defaultValue="10% discount for bookings of 7+ nights. 15% discount for bookings of 14+ nights. Contact us for extended stay pricing." placeholder="Describe any additional discount structures..."></textarea>
                        </div>
                    </div>
                </div>
            </section>

            {/* Seasonal Pricing */}
            <section className="form-section">
                <div className="form-section-header">
                    <div>
                        <h3 className="form-section-title">Seasonal Pricing</h3>
                        <p className="form-section-subtitle">Rate variations by season</p>
                    </div>
                    <button className="btn btn-secondary btn-small">
                        <Plus className="icon icon-small" /> Add Season
                    </button>
                </div>
                <div className="form-section-body">
                    <table className="season-table">
                        <thead>
                            <tr>
                                <th>Season</th>
                                <th>Date Range</th>
                                <th>Type</th>
                                <th>Nightly Rate</th>
                                <th>Min. Stay</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <div className="season-name">Peak Season</div>
                                    <div className="season-dates">Christmas / New Year</div>
                                </td>
                                <td>Dec 20 - Jan 10</td>
                                <td><span className="season-badge peak">Peak</span></td>
                                <td><span className="season-price">$5,500</span></td>
                                <td>3 nights</td>
                                <td className="season-actions">
                                    <button className="btn btn-secondary btn-small">Edit</button>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div className="season-name">High Season</div>
                                    <div className="season-dates">School Holidays</div>
                                </td>
                                <td>Apr 5 - Apr 25, Jul 1 - Jul 21, Sep 20 - Oct 10</td>
                                <td><span className="season-badge high">High</span></td>
                                <td><span className="season-price">$5,000</span></td>
                                <td>2 nights</td>
                                <td className="season-actions">
                                    <button className="btn btn-secondary btn-small">Edit</button>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div className="season-name">Standard Season</div>
                                    <div className="season-dates">Default Rate</div>
                                </td>
                                <td>All other dates</td>
                                <td><span className="season-badge standard">Standard</span></td>
                                <td><span className="season-price">$4,500</span></td>
                                <td>2 nights</td>
                                <td className="season-actions">
                                    <button className="btn btn-secondary btn-small">Edit</button>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div className="season-name">Low Season</div>
                                    <div className="season-dates">Winter Midweek</div>
                                </td>
                                <td>Jun 1 - Aug 31 (Mon-Thu only)</td>
                                <td><span className="season-badge low">Low</span></td>
                                <td><span className="season-price">$4,000</span></td>
                                <td>2 nights</td>
                                <td className="season-actions">
                                    <button className="btn btn-secondary btn-small">Edit</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <div className="form-grid three-col" style={{ marginTop: 24 }}>
                        <div className="form-group">
                            <label className="form-label">Holiday Surcharge</label>
                            <div className="price-input-wrapper">
                                <input type="text" className="form-input price-input" defaultValue="20" style={{ textAlign: 'right' }} />
                                <span className="price-suffix">%</span>
                            </div>
                            <p className="form-hint" style={{ fontSize: 11, fontStyle: 'italic', color: 'var(--accent)', marginTop: 6 }}>Additional charge for public holidays (Easter, Christmas Day, etc.)</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Booking Rules */}
            <section className="form-section">
                <div className="form-section-header">
                    <div>
                        <h3 className="form-section-title">Booking Rules</h3>
                        <p className="form-section-subtitle">Minimum stays, lead times, and booking windows</p>
                    </div>
                </div>
                <div className="form-section-body">
                    <div className="form-grid four-col">
                        <div className="form-group">
                            <label className="form-label">Minimum Stay (Default)</label>
                            <select className="form-input form-select" defaultValue="2 nights">
                                <option>1 night</option>
                                <option>2 nights</option>
                                <option>3 nights</option>
                                <option>4 nights</option>
                                <option>5 nights</option>
                                <option>7 nights</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Minimum Stay (Weekends)</label>
                            <select className="form-input form-select" defaultValue="2 nights">
                                <option>1 night</option>
                                <option>2 nights</option>
                                <option>3 nights</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Maximum Stay</label>
                            <select className="form-input form-select" defaultValue="28 nights">
                                <option>7 nights</option>
                                <option>14 nights</option>
                                <option>21 nights</option>
                                <option>28 nights</option>
                                <option>No limit</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Advance Booking Required</label>
                            <select className="form-input form-select" defaultValue="7 days">
                                <option>None</option>
                                <option>24 hours</option>
                                <option>48 hours</option>
                                <option>7 days</option>
                                <option>14 days</option>
                                <option>30 days</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Booking Window Opens</label>
                            <select className="form-input form-select" defaultValue="12 months ahead">
                                <option>3 months ahead</option>
                                <option>6 months ahead</option>
                                <option>12 months ahead</option>
                                <option>18 months ahead</option>
                                <option>24 months ahead</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Check-in Day Restrictions</label>
                            <select className="form-input form-select" defaultValue="Any day">
                                <option>Any day</option>
                                <option>Friday/Saturday only</option>
                                <option>Weekdays only</option>
                                <option>Monday only</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Check-in Time</label>
                            <input type="text" className="form-input" defaultValue="3:00 PM" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Check-out Time</label>
                            <input type="text" className="form-input" defaultValue="10:00 AM" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Deposit & Payment */}
            <section className="form-section">
                <div className="form-section-header">
                    <div>
                        <h3 className="form-section-title">Deposit & Payment</h3>
                        <p className="form-section-subtitle">Payment terms and security deposits</p>
                    </div>
                </div>
                <div className="form-section-body">
                    <div className="form-grid three-col">
                        <div className="form-group">
                            <label className="form-label">Booking Deposit</label>
                            <select className="form-input form-select" defaultValue="50% of total">
                                <option>No deposit required</option>
                                <option>25% of total</option>
                                <option>50% of total</option>
                                <option>Full payment</option>
                                <option>Fixed amount</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Deposit Due</label>
                            <select className="form-input form-select" defaultValue="At time of booking">
                                <option>At time of booking</option>
                                <option>Within 48 hours</option>
                                <option>Within 7 days</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Balance Due</label>
                            <select className="form-input form-select" defaultValue="14 days before arrival">
                                <option>At check-in</option>
                                <option>7 days before arrival</option>
                                <option>14 days before arrival</option>
                                <option>30 days before arrival</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Security Bond</label>
                            <div className="price-input-wrapper">
                                <span className="price-currency">$</span>
                                <input type="text" className="form-input price-input" defaultValue="2,000" />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Bond Collection Method</label>
                            <select className="form-input form-select" defaultValue="Held & refunded post-stay">
                                <option>Pre-authorisation only</option>
                                <option>Held & refunded post-stay</option>
                                <option>Insurance-backed (no charge)</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Accepted Payment Methods</label>
                            <select className="form-input form-select" defaultValue="Credit Card, Bank Transfer">
                                <option>Credit Card, Bank Transfer</option>
                                <option>Credit Card only</option>
                                <option>Bank Transfer only</option>
                            </select>
                        </div>
                    </div>
                </div>
            </section>

            {/* Cancellation Policy */}
            <section className="form-section">
                <div className="form-section-header">
                    <div>
                        <h3 className="form-section-title">Cancellation Policy</h3>
                        <p className="form-section-subtitle">Refund terms for cancelled bookings</p>
                    </div>
                </div>
                <div className="form-section-body">
                    <div className="form-grid">
                        <div className="form-group">
                            <label className="form-label">Cancellation Policy Type</label>
                            <select className="form-input form-select" defaultValue="Firm (Full refund 30 days before)">
                                <option>Flexible (Full refund 24hrs before)</option>
                                <option>Moderate (Full refund 7 days before)</option>
                                <option>Firm (Full refund 30 days before)</option>
                                <option>Strict (50% refund 30 days before)</option>
                                <option>Super Strict (No refunds)</option>
                                <option>Custom</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Grace Period</label>
                            <select className="form-input form-select" defaultValue="48 hours after booking">
                                <option>None</option>
                                <option>48 hours after booking</option>
                                <option>7 days after booking</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group full-width" style={{ marginTop: 16, marginBottom: 24 }}>
                        <label className="form-label">Refund Policy Details</label>
                        <textarea className="form-input form-textarea" rows={3} defaultValue="Cancellations must be submitted in writing via email. Refunds are processed within 14 business days. Service fees are non-refundable. For cancellations due to extenuating circumstances, please contact us directly to discuss options." placeholder="Provide full refund policy details..."></textarea>
                        <p className="form-hint" style={{ fontSize: 11, fontStyle: 'italic', color: 'var(--accent)', marginTop: 6 }}>Detailed refund terms displayed on your booking page</p>
                    </div>

                    <div className="policy-grid" style={{ marginTop: 24 }}>
                        <div className="policy-card">
                            <div className="policy-card-header">
                                <div className="policy-icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4A7C59" strokeWidth="1.5">
                                        <polyline points="20,6 9,17 4,12" />
                                    </svg>
                                </div>
                                <div className="policy-title">Full Refund</div>
                            </div>
                            <div className="policy-content">
                                Cancel more than <strong>30 days</strong> before check-in for a full refund minus service fees.
                                <div className="policy-highlight">100% refund</div>
                            </div>
                        </div>

                        <div className="policy-card">
                            <div className="policy-card-header">
                                <div className="policy-icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D4A853" strokeWidth="1.5">
                                        <circle cx="12" cy="12" r="10" />
                                        <line x1="12" y1="8" x2="12" y2="12" />
                                        <line x1="12" y1="16" x2="12.01" y2="16" />
                                    </svg>
                                </div>
                                <div className="policy-title">Partial Refund</div>
                            </div>
                            <div className="policy-content">
                                Cancel <strong>14-30 days</strong> before check-in to receive 50% of the booking total.
                                <div className="policy-highlight">50% refund</div>
                            </div>
                        </div>

                        <div className="policy-card">
                            <div className="policy-card-header">
                                <div className="policy-icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C45C5C" strokeWidth="1.5">
                                        <circle cx="12" cy="12" r="10" />
                                        <line x1="15" y1="9" x2="9" y2="15" />
                                        <line x1="9" y1="9" x2="15" y2="15" />
                                    </svg>
                                </div>
                                <div className="policy-title">No Refund</div>
                            </div>
                            <div className="policy-content">
                                Cancellations within <strong>14 days</strong> of check-in are non-refundable.
                                <div className="policy-highlight">0% refund</div>
                            </div>
                        </div>

                        <div className="policy-card">
                            <div className="policy-card-header">
                                <div className="policy-icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6B8EC9" strokeWidth="1.5">
                                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                    </svg>
                                </div>
                                <div className="policy-title">Extenuating Circumstances</div>
                            </div>
                            <div className="policy-content">
                                Refunds may be available for documented emergencies, natural disasters, or government restrictions.
                                <div className="policy-highlight">Case by case</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* What's Included */}
            <section className="form-section">
                <div className="form-section-header">
                    <div>
                        <h3 className="form-section-title">What's Included in Venue Hire</h3>
                        <p className="form-section-subtitle">Items and services included in the base rate</p>
                    </div>
                </div>
                <div className="form-section-body">
                    <div className="included-list">
                        {[
                            'Exclusive use of property',
                            'All bedrooms & suites',
                            'Yoga shala & meditation room',
                            'Swimming pool & spa',
                            'Sauna & cold plunge',
                            'Treatment rooms',
                            'Commercial kitchen',
                            'Yoga equipment (mats, props)',
                            'Linens & towels',
                            'WiFi & AV equipment',
                            'Fire pit & outdoor areas',
                            'Parking for 15 vehicles'
                        ].map((feature, i) => (
                            <div className="included-item" key={i}>
                                <div className="included-check">
                                    <Check color="white" size={12} strokeWidth={3} />
                                </div>
                                <span className="included-label">{feature}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Additional Fees / Add-ons */}
            <section className="form-section">
                <div className="form-section-header">
                    <div>
                        <h3 className="form-section-title">Additional Fees & Add-ons</h3>
                        <p className="form-section-subtitle">Optional extras and services at additional cost</p>
                    </div>
                    <button className="btn btn-secondary btn-small">
                        <Plus className="icon icon-small" /> Add Fee
                    </button>
                </div>
                <div className="form-section-body">
                    <table className="season-table">
                        <thead>
                            <tr>
                                <th>Item / Service</th>
                                <th>Description</th>
                                <th>Price</th>
                                <th>Per</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                { name: 'Catering - Chef Service', desc: 'Private chef for retreat meals', price: '$800', per: 'per day' },
                                { name: 'Catering - Meal Packages', desc: 'Pre-prepared organic meals delivered', price: '$120', per: 'per person/day' },
                                { name: 'Airport Transfers', desc: 'Sydney Airport pickup/dropoff (up to 6 pax)', price: '$400', per: 'per trip' },
                                { name: 'Early Check-in', desc: 'Check-in from 12pm (subject to availability)', price: '$500', per: 'one-time' },
                                { name: 'Late Check-out', desc: 'Check-out by 2pm (subject to availability)', price: '$500', per: 'one-time' },
                                { name: 'Mid-stay Housekeeping', desc: 'Full property clean for stays 5+ nights', price: '$350', per: 'per clean' }
                            ].map((item, i) => (
                                <tr key={i}>
                                    <td><strong>{item.name}</strong></td>
                                    <td>{item.desc}</td>
                                    <td><span className="season-price">{item.price}</span></td>
                                    <td>{item.per}</td>
                                    <td className="season-actions">
                                        <button className="btn btn-secondary btn-small">Edit</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <button className="add-row-btn">
                        <Plus className="icon" /> Add Another Fee or Add-on
                    </button>
                </div>
            </section>

            {/* Booking Settings */}
            <section className="form-section">
                <div className="form-section-header">
                    <div>
                        <h3 className="form-section-title">Booking Settings</h3>
                        <p className="form-section-subtitle">Instant booking and enquiry preferences</p>
                    </div>
                </div>
                <div className="form-section-body">
                    <div className="form-grid three-col">
                        <div className="form-group">
                            <label className="form-label">Instant Book Enabled</label>
                            <div className="toggle-container">
                                <div className="toggle">
                                    <div className="toggle-knob"></div>
                                </div>
                                <span className="toggle-label">No - Enquiry required</span>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Requires Owner Approval</label>
                            <div className="toggle-container">
                                <div className="toggle active">
                                    <div className="toggle-knob"></div>
                                </div>
                                <span className="toggle-label">Yes - Review each enquiry</span>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Require Retreat Details</label>
                            <div className="toggle-container">
                                <div className="toggle active">
                                    <div className="toggle-knob"></div>
                                </div>
                                <span className="toggle-label">Yes</span>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Auto-confirm Repeat Guests</label>
                            <div className="toggle-container">
                                <div className="toggle active">
                                    <div className="toggle-knob"></div>
                                </div>
                                <span className="toggle-label">Yes</span>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Response Time Target</label>
                            <select className="form-input form-select" defaultValue="Within 24 hours">
                                <option>Within 1 hour</option>
                                <option>Within 24 hours</option>
                                <option>Within 48 hours</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Enquiry Expiry</label>
                            <select className="form-input form-select" defaultValue="48 hours">
                                <option>24 hours</option>
                                <option>48 hours</option>
                                <option>72 hours</option>
                                <option>7 days</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Calendar Sync</label>
                            <div className="toggle-container">
                                <div className="toggle active">
                                    <div className="toggle-knob"></div>
                                </div>
                                <span className="toggle-label">Enabled - iCal</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Booking FAQ */}
            <section className="form-section">
                <div className="form-section-header">
                    <div>
                        <h3 className="form-section-title">Booking FAQ</h3>
                        <p className="form-section-subtitle">Common questions displayed on the Booking tab of your public listing</p>
                    </div>
                    <button className="btn btn-secondary btn-small">
                        <Plus className="icon icon-small" /> Add FAQ
                    </button>
                </div>
                <div className="form-section-body">
                    <div className="faq-list" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {[
                            {
                                q: "Can I book for fewer than 24 people?",
                                a: "Yes, absolutely. Our pricing is based on exclusive use of the property rather than per-person rates. Whether you bring 10 or 24 guests, the nightly rate remains the same."
                            },
                            {
                                q: "What if my guest numbers change?",
                                a: "We understand retreat numbers can fluctuate. Final guest counts are confirmed 14 days before arrival."
                            },
                            {
                                q: "Do you provide catering?",
                                a: "Catering is not included but can be arranged through our preferred caterers or you're welcome to bring your own chef."
                            }
                        ].map((faq, i) => (
                            <div key={i} className="faq-item" style={{ backgroundColor: 'var(--secondary-bg)', borderRadius: 8, padding: 16 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
                                    <div style={{ flex: 1 }}>
                                        <label className="form-label" style={{ marginBottom: 8 }}>Question</label>
                                        <input type="text" className="form-input" defaultValue={faq.q} />
                                    </div>
                                    <button className="btn btn-secondary btn-small" style={{ marginTop: 24 }}>Remove</button>
                                </div>
                                <div style={{ marginTop: 12 }}>
                                    <label className="form-label" style={{ marginBottom: 8 }}>Answer</label>
                                    <textarea className="form-input form-textarea" rows={2} defaultValue={faq.a}></textarea>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="add-row-btn" style={{ marginTop: 16 }}>
                        <Plus className="icon" /> Add Another FAQ
                    </button>
                </div>
            </section>

            {/* Pricing Notes */}
            <section className="form-section">
                <div className="form-section-header">
                    <h3 className="form-section-title">Pricing Notes</h3>
                </div>
                <div className="form-section-body">
                    <div className="form-group">
                        <label className="form-label">Internal Notes (Not visible to guests)</label>
                        <textarea className="form-input form-textarea" defaultValue="Owner prefers minimum 2-night bookings but will consider single nights midweek in low season at $5,000. Negotiable for repeat bookers or longer stays (10+ nights). Wedding/event pricing is different - refer to owner directly." placeholder="Any additional pricing notes..."></textarea>
                    </div>
                </div>
            </section>

        </div>
    );
}
