import { useState } from 'react';
import { Shield, Check, Plus } from 'lucide-react';
import type { Venue } from '../../context/VenueContext';

interface Props {
    venue: Venue;
    onUpdate: (updates: Partial<Venue>) => void;
}

export default function WellnessInternalTab(_props: Props) {
    // Pipeline & Sales
    const [leadSource, setLeadSource] = useState('Outbound - Cold Email');
    const [leadOwner, setLeadOwner] = useState('Kate');
    const [acquisitionDate, setAcquisitionDate] = useState('2026-01-28');
    const [pipelineStage, setPipelineStage] = useState('Signed Up');
    const [firstContactDate, setFirstContactDate] = useState('2026-01-28');

    // Subscription & Financials
    const [subscriptionTier, setSubscriptionTier] = useState('Featured ($399/mo)');
    const [founderDiscount, setFounderDiscount] = useState('Super Founder (60% off)');
    const [billingCycle, setBillingCycle] = useState('Annual (paid upfront)');
    const [subscriptionStartDate, setSubscriptionStartDate] = useState('2026-02-08');
    const [nextBillingDate, setNextBillingDate] = useState('2027-02-08');
    const [bookingCommission, setBookingCommission] = useState('5%');
    const [experienceCommission, setExperienceCommission] = useState('15%');
    const [stripeConnected, setStripeConnected] = useState(true);

    // Tags
    const [marketSegment, setMarketSegment] = useState('Premium');
    const [venueTier, setVenueTier] = useState('Gold');

    // Notes
    const [newNote, setNewNote] = useState('');

    return (
        <div>
            {/* Admin Banner */}
            <div className="admin-banner">
                <Shield className="admin-banner-icon" size={20} />
                <div className="admin-banner-text">
                    <strong>Internal Data</strong> — This information is only visible to TGS administrators and is not displayed to venue owners or public users.
                </div>
            </div>

            {/* Quality Scores */}
            <div className="score-cards">
                <div className="score-card">
                    <div className="score-card-label">Listing Quality</div>
                    <div className="score-card-value excellent">92</div>
                    <div className="score-bar">
                        <div className="score-bar-fill excellent" style={{ width: '92%' }}></div>
                    </div>
                </div>
                <div className="score-card">
                    <div className="score-card-label">Photo Quality</div>
                    <div className="score-card-value good">85</div>
                    <div className="score-bar">
                        <div className="score-bar-fill good" style={{ width: '85%' }}></div>
                    </div>
                </div>
                <div className="score-card">
                    <div className="score-card-label">Response Rate</div>
                    <div className="score-card-value excellent">98%</div>
                    <div className="score-bar">
                        <div className="score-bar-fill excellent" style={{ width: '98%' }}></div>
                    </div>
                </div>
                <div className="score-card">
                    <div className="score-card-label">Completeness</div>
                    <div className="score-card-value good">88%</div>
                    <div className="score-bar">
                        <div className="score-bar-fill good" style={{ width: '88%' }}></div>
                    </div>
                </div>
            </div>

            {/* Verification Status */}
            <section className="form-section">
                <div className="form-section-header">
                    <div>
                        <h3 className="form-section-title">Verification Status</h3>
                        <p className="form-section-subtitle">Identity, ownership, and compliance verification</p>
                    </div>
                </div>
                <div className="form-section-body">
                    <div className="checklist">
                        <div className="checklist-item">
                            <div className="checklist-icon complete">
                                <Check size={14} />
                            </div>
                            <span className="checklist-label complete">Identity Verified — Owner ID confirmed Feb 5, 2026</span>
                            <span className="status-badge verified">Verified</span>
                        </div>
                        <div className="checklist-item">
                            <div className="checklist-icon complete">
                                <Check size={14} />
                            </div>
                            <span className="checklist-label complete">Property Ownership — Title documents verified</span>
                            <span className="status-badge verified">Verified</span>
                        </div>
                        <div className="checklist-item">
                            <div className="checklist-icon complete">
                                <Check size={14} />
                            </div>
                            <span className="checklist-label complete">Public Liability Insurance — $20M coverage confirmed</span>
                            <span className="status-badge verified">Verified</span>
                        </div>
                        <div className="checklist-item">
                            <div className="checklist-icon complete">
                                <Check size={14} />
                            </div>
                            <span className="checklist-label complete">Business Registration — ABN verified</span>
                            <span className="status-badge verified">Verified</span>
                        </div>
                        <div className="checklist-item">
                            <div className="checklist-icon incomplete"></div>
                            <span className="checklist-label">Site Visit — Pending scheduling</span>
                            <span className="status-badge pending">Pending</span>
                        </div>
                        <div className="checklist-item">
                            <div className="checklist-icon incomplete"></div>
                            <span className="checklist-label">Photo Verification — Professional shoot not yet completed</span>
                            <span className="status-badge pending">Pending</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pipeline & Sales */}
            <section className="form-section">
                <div className="form-section-header">
                    <div>
                        <h3 className="form-section-title">Pipeline & Sales</h3>
                        <p className="form-section-subtitle">Lead source and acquisition details</p>
                    </div>
                </div>
                <div className="form-section-body">
                    <div className="form-grid three-col">
                        <div className="form-group">
                            <label className="form-label">Lead Source</label>
                            <select className="form-input form-select" value={leadSource} onChange={e => setLeadSource(e.target.value)}>
                                <option>Direct Enquiry</option>
                                <option>Referral</option>
                                <option>Outbound - Cold Email</option>
                                <option>Inbound - Website Form</option>
                                <option>Social Media</option>
                                <option>Industry Event</option>
                                <option>Partner Network</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Lead Owner</label>
                            <select className="form-input form-select" value={leadOwner} onChange={e => setLeadOwner(e.target.value)}>
                                <option>Kate</option>
                                <option>Tom (Partner)</option>
                                <option>VA - Sarah</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Acquisition Date</label>
                            <input type="date" className="form-input" value={acquisitionDate} onChange={e => setAcquisitionDate(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Pipeline Stage</label>
                            <select className="form-input form-select" value={pipelineStage} onChange={e => setPipelineStage(e.target.value)}>
                                <option>New Lead</option>
                                <option>Contacted</option>
                                <option>Call Scheduled</option>
                                <option>Call Completed</option>
                                <option>Proposal Sent</option>
                                <option>Signed Up</option>
                                <option>Onboarding</option>
                                <option>Live</option>
                                <option>Churned</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">First Contact Date</label>
                            <input type="date" className="form-input" value={firstContactDate} onChange={e => setFirstContactDate(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Days to Close</label>
                            <input type="text" className="form-input" value="11 days" readOnly style={{ backgroundColor: 'var(--secondary-bg)' }} />
                        </div>
                    </div>
                </div>
            </section>

            {/* Subscription & Financials */}
            <section className="form-section">
                <div className="form-section-header">
                    <div>
                        <h3 className="form-section-title">Subscription & Financials</h3>
                        <p className="form-section-subtitle">Billing, commission, and revenue tracking</p>
                    </div>
                </div>
                <div className="form-section-body">
                    <div className="form-grid three-col">
                        <div className="form-group">
                            <label className="form-label">Subscription Tier</label>
                            <select className="form-input form-select" value={subscriptionTier} onChange={e => setSubscriptionTier(e.target.value)}>
                                <option>Essentials ($79/mo)</option>
                                <option>Professional ($199/mo)</option>
                                <option>Featured ($399/mo)</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Founder Discount</label>
                            <select className="form-input form-select" value={founderDiscount} onChange={e => setFounderDiscount(e.target.value)}>
                                <option>None</option>
                                <option>Super Founder (60% off)</option>
                                <option>Founder (40% off)</option>
                                <option>Early Bird (25% off)</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Effective Monthly Rate</label>
                            <input type="text" className="form-input" value="$159.60/mo" readOnly style={{ backgroundColor: 'var(--secondary-bg)', color: 'var(--success)', fontWeight: 600 }} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Billing Cycle</label>
                            <select className="form-input form-select" value={billingCycle} onChange={e => setBillingCycle(e.target.value)}>
                                <option>Annual (paid upfront)</option>
                                <option>Annual (paid monthly)</option>
                                <option>Monthly</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Subscription Start Date</label>
                            <input type="date" className="form-input" value={subscriptionStartDate} onChange={e => setSubscriptionStartDate(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Next Billing Date</label>
                            <input type="date" className="form-input" value={nextBillingDate} onChange={e => setNextBillingDate(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Booking Commission Rate</label>
                            <select className="form-input form-select" value={bookingCommission} onChange={e => setBookingCommission(e.target.value)}>
                                <option>3%</option>
                                <option>5%</option>
                                <option>7%</option>
                                <option>10%</option>
                                <option>Custom</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Experience Commission Rate</label>
                            <select className="form-input form-select" value={experienceCommission} onChange={e => setExperienceCommission(e.target.value)}>
                                <option>10%</option>
                                <option>15%</option>
                                <option>20%</option>
                                <option>Custom</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Stripe Connect Status</label>
                            <div className="toggle-container" onClick={() => setStripeConnected(!stripeConnected)}>
                                <div className={`toggle ${stripeConnected ? 'active' : ''}`}>
                                    <div className="toggle-knob"></div>
                                </div>
                                <span className="toggle-label">{stripeConnected ? 'Connected' : 'Not Connected'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Revenue Summary */}
                    <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid rgba(184, 184, 184, 0.15)' }}>
                        <label className="form-label" style={{ marginBottom: '12px', display: 'block' }}>Revenue Summary (Lifetime)</label>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                            <div style={{ flexDirection: 'column', alignItems: 'flex-start', background: 'var(--secondary-bg)', padding: '16px', borderRadius: '8px' }}>
                                <span className="data-label">Subscription Revenue</span>
                                <span className="data-value" style={{ fontSize: '20px', fontFamily: "'Cormorant Garamond', serif", display: 'block', marginTop: '4px' }}>$1,915.20</span>
                            </div>
                            <div style={{ flexDirection: 'column', alignItems: 'flex-start', background: 'var(--secondary-bg)', padding: '16px', borderRadius: '8px' }}>
                                <span className="data-label">Booking Commissions</span>
                                <span className="data-value" style={{ fontSize: '20px', fontFamily: "'Cormorant Garamond', serif", display: 'block', marginTop: '4px' }}>$0.00</span>
                            </div>
                            <div style={{ flexDirection: 'column', alignItems: 'flex-start', background: 'var(--secondary-bg)', padding: '16px', borderRadius: '8px' }}>
                                <span className="data-label">Experience Commissions</span>
                                <span className="data-value" style={{ fontSize: '20px', fontFamily: "'Cormorant Garamond', serif", display: 'block', marginTop: '4px' }}>$0.00</span>
                            </div>
                            <div style={{ flexDirection: 'column', alignItems: 'flex-start', background: 'rgba(75, 124, 89, 0.1)', padding: '16px', borderRadius: '8px' }}>
                                <span className="data-label">Total Lifetime Value</span>
                                <span className="data-value" style={{ fontSize: '20px', fontFamily: "'Cormorant Garamond', serif", color: 'var(--success)', display: 'block', marginTop: '4px' }}>$1,915.20</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Internal Tags & Categories */}
            <section className="form-section">
                <div className="form-section-header">
                    <div>
                        <h3 className="form-section-title">Internal Tags & Categories</h3>
                        <p className="form-section-subtitle">Classification for filtering and marketing</p>
                    </div>
                </div>
                <div className="form-section-body">
                    <div className="form-grid">
                        <div className="form-group">
                            <label className="form-label">Internal Tags</label>
                            <div className="tag-list">
                                <span className="tag feature">Featured Homepage</span>
                                <span className="tag feature">Staff Pick</span>
                                <span className="tag">High Converting</span>
                                <span className="tag">Photo Ready</span>
                                <span className="tag">Quick Responder</span>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Priority Flags</label>
                            <div className="tag-list">
                                <span className="tag priority">Needs Site Visit</span>
                                <span className="tag priority">Follow Up Required</span>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Market Segment</label>
                            <select className="form-input form-select" value={marketSegment} onChange={e => setMarketSegment(e.target.value)}>
                                <option>Budget</option>
                                <option>Mid-range</option>
                                <option>Premium</option>
                                <option>Ultra Luxury</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Venue Tier (Internal)</label>
                            <select className="form-input form-select" value={venueTier} onChange={e => setVenueTier(e.target.value)}>
                                <option>Bronze</option>
                                <option>Silver</option>
                                <option>Gold</option>
                                <option>Platinum</option>
                            </select>
                        </div>
                    </div>
                </div>
            </section>

            {/* Activity Timeline */}
            <section className="form-section">
                <div className="form-section-header">
                    <div>
                        <h3 className="form-section-title">Activity Timeline</h3>
                        <p className="form-section-subtitle">Key milestones and status changes</p>
                    </div>
                </div>
                <div className="form-section-body">
                    <div className="timeline">
                        {[
                            { title: 'Listing Published', desc: 'Venue went live on TGS platform', date: 'Jan 15, 2026' },
                            { title: 'Subscription Activated', desc: 'Featured Plan with Super Founder discount', date: 'Jan 15, 2026' },
                            { title: 'Onboarding Call Completed', desc: '30 min call with Kate — owner very engaged', date: 'Jan 14, 2026' },
                            { title: 'Contract Signed', desc: 'Venue agreement executed via DocuSign', date: 'Jan 13, 2026' },
                            { title: 'Discovery Call', desc: 'Initial 20 min call to discuss TGS partnership', date: 'Jan 12, 2026' },
                            { title: 'Initial Outreach', desc: 'Inbound enquiry via List Your Venue form', date: 'Jan 10, 2026' },
                        ].map((item, i) => (
                            <div key={i} className="timeline-item">
                                <div className="timeline-dot active"></div>
                                <div className="timeline-content">
                                    <div>
                                        <div className="timeline-title">{item.title}</div>
                                        <div className="timeline-desc">{item.desc}</div>
                                    </div>
                                    <div className="timeline-date">{item.date}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Recent Activity Log */}
            <section className="form-section">
                <div className="form-section-header">
                    <div>
                        <h3 className="form-section-title">Recent Activity Log</h3>
                        <p className="form-section-subtitle">System and user activity</p>
                    </div>
                    <button className="btn btn-secondary btn-small">View All</button>
                </div>
                <div className="form-section-body">
                    <div className="activity-log">
                        {[
                            { avatar: 'K', user: 'Kate', text: 'updated services — Added 3 new treatment options', time: '2 hours ago' },
                            { avatar: 'S', user: 'System', text: 'marked identity verification as complete', time: 'Yesterday at 3:42 PM' },
                            { avatar: 'K', user: 'Kate', text: 'added 12 new photos to gallery', time: 'Yesterday at 11:15 AM' },
                            { avatar: 'K', user: 'Kate', text: 'completed venue overview and wellness services sections', time: 'Jan 15, 2026' },
                            { avatar: 'S', user: 'System', text: 'created venue record from onboarding form submission', time: 'Jan 15, 2026' },
                        ].map((item, i) => (
                            <div key={i} className="activity-item">
                                <div className="activity-avatar">{item.avatar}</div>
                                <div className="activity-content">
                                    <div className="activity-text"><strong>{item.user}</strong> {item.text}</div>
                                    <div className="activity-time">{item.time}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Internal Notes */}
            <section className="form-section">
                <div className="form-section-header">
                    <div>
                        <h3 className="form-section-title">Internal Notes</h3>
                        <p className="form-section-subtitle">Private notes visible only to TGS team</p>
                    </div>
                    <button className="btn btn-secondary btn-small">
                        <Plus className="icon icon-small" />
                        Add Note
                    </button>
                </div>
                <div className="form-section-body">
                    <div style={{ background: 'var(--secondary-bg)', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                            <strong style={{ fontSize: '13px' }}>Kate</strong>
                            <span style={{ fontSize: '11px', color: 'var(--accent)' }}>Jan 20, 2026</span>
                        </div>
                        <p style={{ fontSize: '13px', color: 'var(--text)', margin: 0 }}>
                            Excellent boutique day spa — owner is Maya Chen, highly experienced massage therapist who built this business from scratch 5 years ago. Very particular about quality and brand alignment. Has a loyal local clientele but wants to attract wellness tourists. Interested in being featured in Wellness Edit content. Mentioned she knows other spa owners in Sydney who might be interested in TGS.
                        </p>
                    </div>
                    <div style={{ background: 'var(--secondary-bg)', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                            <strong style={{ fontSize: '13px' }}>Kate</strong>
                            <span style={{ fontSize: '11px', color: 'var(--accent)' }}>Jan 12, 2026</span>
                        </div>
                        <p style={{ fontSize: '13px', color: 'var(--text)', margin: 0 }}>
                            Discovery call went really well. Facility is beautiful — they've invested heavily in thermal circuit and treatment rooms. Currently using Mindbody for bookings but open to TGS integration. Pricing is mid-premium for Sydney market. Main value prop for them is exposure to wellness travelers, especially international visitors planning Sydney trips.
                        </p>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Add New Note</label>
                        <textarea
                            className="form-input form-textarea"
                            placeholder="Add internal notes about this venue..."
                            value={newNote}
                            onChange={e => setNewNote(e.target.value)}
                        />
                    </div>
                </div>
            </section>
        </div>
    );
}
