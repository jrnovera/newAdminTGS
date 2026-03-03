import { ShieldAlert, Check, Plus, ChevronDown } from 'lucide-react';
import type { Venue } from '../context/VenueContext';

interface InternalTabProps {
    venue: Venue;
    onUpdate?: (updates: Partial<Venue>) => void;
}

export default function InternalTab({ venue: _venue }: InternalTabProps) {
    return (
        <div>
            {/* Admin Banner */}
            <div className="admin-banner">
                <ShieldAlert className="admin-banner-icon" />
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
                                <Check width={14} height={14} strokeWidth={3} />
                            </div>
                            <span className="checklist-label complete">Identity Verified — Owner ID confirmed Feb 5, 2026</span>
                            <span className="status-badge verified">Verified</span>
                        </div>
                        <div className="checklist-item">
                            <div className="checklist-icon complete">
                                <Check width={14} height={14} strokeWidth={3} />
                            </div>
                            <span className="checklist-label complete">Property Ownership — Title documents verified</span>
                            <span className="status-badge verified">Verified</span>
                        </div>
                        <div className="checklist-item">
                            <div className="checklist-icon complete">
                                <Check width={14} height={14} strokeWidth={3} />
                            </div>
                            <span className="checklist-label complete">Public Liability Insurance — $20M coverage confirmed</span>
                            <span className="status-badge verified">Verified</span>
                        </div>
                        <div className="checklist-item">
                            <div className="checklist-icon complete">
                                <Check width={14} height={14} strokeWidth={3} />
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
                            <div style={{ position: 'relative' }}>
                                <select className="form-input form-select" defaultValue="Outbound - Cold Email" style={{ width: '100%' }}>
                                    <option>Direct Enquiry</option>
                                    <option>Referral</option>
                                    <option>Outbound - Cold Email</option>
                                    <option>Inbound - Website Form</option>
                                    <option>Social Media</option>
                                    <option>Industry Event</option>
                                    <option>Partner Network</option>
                                </select>
                                <ChevronDown className="select-icon" style={{ position: 'absolute', right: 12, top: 12, pointerEvents: 'none', color: 'var(--accent)' }} size={16} />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Lead Owner</label>
                            <div style={{ position: 'relative' }}>
                                <select className="form-input form-select" defaultValue="Kate" style={{ width: '100%' }}>
                                    <option>Kate</option>
                                    <option>Tom (Partner)</option>
                                    <option>VA - Sarah</option>
                                </select>
                                <ChevronDown className="select-icon" style={{ position: 'absolute', right: 12, top: 12, pointerEvents: 'none', color: 'var(--accent)' }} size={16} />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Acquisition Date</label>
                            <input type="date" className="form-input" defaultValue="2026-01-28" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Pipeline Stage</label>
                            <div style={{ position: 'relative' }}>
                                <select className="form-input form-select" defaultValue="Signed Up" style={{ width: '100%' }}>
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
                                <ChevronDown className="select-icon" style={{ position: 'absolute', right: 12, top: 12, pointerEvents: 'none', color: 'var(--accent)' }} size={16} />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">First Contact Date</label>
                            <input type="date" className="form-input" defaultValue="2026-01-28" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Days to Close</label>
                            <input type="text" className="form-input" defaultValue="11 days" readOnly style={{ backgroundColor: 'var(--secondary-bg)' }} />
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
                            <div style={{ position: 'relative' }}>
                                <select className="form-input form-select" defaultValue="Featured ($399/mo)" style={{ width: '100%' }}>
                                    <option>Essentials ($79/mo)</option>
                                    <option>Professional ($199/mo)</option>
                                    <option>Featured ($399/mo)</option>
                                </select>
                                <ChevronDown className="select-icon" style={{ position: 'absolute', right: 12, top: 12, pointerEvents: 'none', color: 'var(--accent)' }} size={16} />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Founder Discount</label>
                            <div style={{ position: 'relative' }}>
                                <select className="form-input form-select" defaultValue="Super Founder (60% off)" style={{ width: '100%' }}>
                                    <option>None</option>
                                    <option>Super Founder (60% off)</option>
                                    <option>Founder (40% off)</option>
                                    <option>Early Bird (25% off)</option>
                                </select>
                                <ChevronDown className="select-icon" style={{ position: 'absolute', right: 12, top: 12, pointerEvents: 'none', color: 'var(--accent)' }} size={16} />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Effective Monthly Rate</label>
                            <input type="text" className="form-input" defaultValue="$159.60/mo" readOnly style={{ backgroundColor: 'var(--secondary-bg)', color: 'var(--success)', fontWeight: 600 }} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Billing Cycle</label>
                            <div style={{ position: 'relative' }}>
                                <select className="form-input form-select" defaultValue="Annual (paid upfront)" style={{ width: '100%' }}>
                                    <option>Annual (paid upfront)</option>
                                    <option>Annual (paid monthly)</option>
                                    <option>Monthly</option>
                                </select>
                                <ChevronDown className="select-icon" style={{ position: 'absolute', right: 12, top: 12, pointerEvents: 'none', color: 'var(--accent)' }} size={16} />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Subscription Start Date</label>
                            <input type="date" className="form-input" defaultValue="2026-02-08" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Next Billing Date</label>
                            <input type="date" className="form-input" defaultValue="2027-02-08" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Booking Commission Rate</label>
                            <div style={{ position: 'relative' }}>
                                <select className="form-input form-select" defaultValue="5%" style={{ width: '100%' }}>
                                    <option>3%</option>
                                    <option>5%</option>
                                    <option>7%</option>
                                    <option>10%</option>
                                    <option>Custom</option>
                                </select>
                                <ChevronDown className="select-icon" style={{ position: 'absolute', right: 12, top: 12, pointerEvents: 'none', color: 'var(--accent)' }} size={16} />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Experience Commission Rate</label>
                            <div style={{ position: 'relative' }}>
                                <select className="form-input form-select" defaultValue="15%" style={{ width: '100%' }}>
                                    <option>10%</option>
                                    <option>15%</option>
                                    <option>20%</option>
                                    <option>Custom</option>
                                </select>
                                <ChevronDown className="select-icon" style={{ position: 'absolute', right: 12, top: 12, pointerEvents: 'none', color: 'var(--accent)' }} size={16} />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Stripe Connect Status</label>
                            <div className="toggle-container">
                                <div className="toggle active">
                                    <div className="toggle-knob"></div>
                                </div>
                                <span className="toggle-label">Connected</span>
                            </div>
                        </div>
                    </div>

                    <div style={{ marginTop: 24, paddingTop: 24, borderTop: '1px solid rgba(184, 184, 184, 0.15)' }}>
                        <label className="form-label" style={{ marginBottom: 12, display: 'block' }}>Revenue Summary (Lifetime)</label>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
                            <div className="data-row" style={{ flexDirection: 'column', alignItems: 'flex-start', background: 'var(--secondary-bg)', padding: 16, borderRadius: 8, border: 'none' }}>
                                <span className="data-label">Subscription Revenue</span>
                                <span className="data-value" style={{ fontSize: 20, fontFamily: "'Cormorant Garamond', serif" }}>$1,915.20</span>
                            </div>
                            <div className="data-row" style={{ flexDirection: 'column', alignItems: 'flex-start', background: 'var(--secondary-bg)', padding: 16, borderRadius: 8, border: 'none' }}>
                                <span className="data-label">Booking Commissions</span>
                                <span className="data-value" style={{ fontSize: 20, fontFamily: "'Cormorant Garamond', serif" }}>$0.00</span>
                            </div>
                            <div className="data-row" style={{ flexDirection: 'column', alignItems: 'flex-start', background: 'var(--secondary-bg)', padding: 16, borderRadius: 8, border: 'none' }}>
                                <span className="data-label">Experience Commissions</span>
                                <span className="data-value" style={{ fontSize: 20, fontFamily: "'Cormorant Garamond', serif" }}>$0.00</span>
                            </div>
                            <div className="data-row" style={{ flexDirection: 'column', alignItems: 'flex-start', background: 'rgba(75, 124, 89, 0.1)', padding: 16, borderRadius: 8, border: 'none' }}>
                                <span className="data-label">Total Lifetime Value</span>
                                <span className="data-value" style={{ fontSize: 20, fontFamily: "'Cormorant Garamond', serif", color: 'var(--success)' }}>$1,915.20</span>
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
                            <div style={{ position: 'relative' }}>
                                <select className="form-input form-select" defaultValue="Premium" style={{ width: '100%' }}>
                                    <option>Budget</option>
                                    <option>Mid-range</option>
                                    <option>Premium</option>
                                    <option>Ultra Luxury</option>
                                </select>
                                <ChevronDown className="select-icon" style={{ position: 'absolute', right: 12, top: 12, pointerEvents: 'none', color: 'var(--accent)' }} size={16} />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Venue Tier (Internal)</label>
                            <div style={{ position: 'relative' }}>
                                <select className="form-input form-select" defaultValue="Gold" style={{ width: '100%' }}>
                                    <option>Bronze</option>
                                    <option>Silver</option>
                                    <option>Gold</option>
                                    <option>Platinum</option>
                                </select>
                                <ChevronDown className="select-icon" style={{ position: 'absolute', right: 12, top: 12, pointerEvents: 'none', color: 'var(--accent)' }} size={16} />
                            </div>
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
                        <div className="timeline-item">
                            <div className="timeline-dot active"></div>
                            <div className="timeline-content">
                                <div>
                                    <div className="timeline-title">Listing Published</div>
                                    <div className="timeline-desc">Venue went live on TGS platform</div>
                                </div>
                                <div className="timeline-date">Feb 8, 2026</div>
                            </div>
                        </div>
                        <div className="timeline-item">
                            <div className="timeline-dot active"></div>
                            <div className="timeline-content">
                                <div>
                                    <div className="timeline-title">Subscription Activated</div>
                                    <div className="timeline-desc">Featured Plan with Super Founder discount</div>
                                </div>
                                <div className="timeline-date">Feb 8, 2026</div>
                            </div>
                        </div>
                        <div className="timeline-item">
                            <div className="timeline-dot active"></div>
                            <div className="timeline-content">
                                <div>
                                    <div className="timeline-title">Onboarding Call Completed</div>
                                    <div className="timeline-desc">45 min call with Kate — owner very engaged</div>
                                </div>
                                <div className="timeline-date">Feb 6, 2026</div>
                            </div>
                        </div>
                        <div className="timeline-item">
                            <div className="timeline-dot active"></div>
                            <div className="timeline-content">
                                <div>
                                    <div className="timeline-title">Contract Signed</div>
                                    <div className="timeline-desc">Venue agreement executed via DocuSign</div>
                                </div>
                                <div className="timeline-date">Feb 5, 2026</div>
                            </div>
                        </div>
                        <div className="timeline-item">
                            <div className="timeline-dot active"></div>
                            <div className="timeline-content">
                                <div>
                                    <div className="timeline-title">Discovery Call</div>
                                    <div className="timeline-desc">Initial 20 min call to discuss TGS partnership</div>
                                </div>
                                <div className="timeline-date">Feb 1, 2026</div>
                            </div>
                        </div>
                        <div className="timeline-item">
                            <div className="timeline-dot active"></div>
                            <div className="timeline-content">
                                <div>
                                    <div className="timeline-title">Initial Outreach</div>
                                    <div className="timeline-desc">Cold email sent via Founder Campaign</div>
                                </div>
                                <div className="timeline-date">Jan 28, 2026</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Activity Log */}
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
                        <div className="activity-item">
                            <div className="activity-avatar">K</div>
                            <div className="activity-content">
                                <div className="activity-text"><strong>Kate</strong> updated pricing information — Weekend rate changed to $5,000</div>
                                <div className="activity-time">2 hours ago</div>
                            </div>
                        </div>
                        <div className="activity-item">
                            <div className="activity-avatar" style={{ backgroundColor: 'rgba(107, 142, 201, 0.1)', color: 'var(--info)' }}>S</div>
                            <div className="activity-content">
                                <div className="activity-text"><strong>System</strong> marked identity verification as complete</div>
                                <div className="activity-time">Yesterday at 3:42 PM</div>
                            </div>
                        </div>
                        <div className="activity-item">
                            <div className="activity-avatar">K</div>
                            <div className="activity-content">
                                <div className="activity-text"><strong>Kate</strong> added 8 new photos to gallery</div>
                                <div className="activity-time">Yesterday at 11:15 AM</div>
                            </div>
                        </div>
                        <div className="activity-item">
                            <div className="activity-avatar">K</div>
                            <div className="activity-content">
                                <div className="activity-text"><strong>Kate</strong> completed venue overview and wellness facilities sections</div>
                                <div className="activity-time">Feb 8, 2026</div>
                            </div>
                        </div>
                        <div className="activity-item">
                            <div className="activity-avatar" style={{ backgroundColor: 'rgba(107, 142, 201, 0.1)', color: 'var(--info)' }}>S</div>
                            <div className="activity-content">
                                <div className="activity-text"><strong>System</strong> created venue record from onboarding form submission</div>
                                <div className="activity-time">Feb 8, 2026</div>
                            </div>
                        </div>
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
                        <Plus className="icon icon-small" style={{ marginRight: 6 }} />
                        Add Note
                    </button>
                </div>
                <div className="form-section-body">
                    <div style={{ background: 'var(--secondary-bg)', padding: 16, borderRadius: 8, marginBottom: 16 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                            <strong style={{ fontSize: 13 }}>Kate</strong>
                            <span style={{ fontSize: 11, color: 'var(--accent)' }}>Feb 8, 2026</span>
                        </div>
                        <p style={{ fontSize: 13, color: 'var(--text)', margin: 0 }}>
                            Excellent venue — owner is Sarah Mitchell, very professional and clearly invested in the wellness space. She's been running retreats for 3 years independently and is excited about TGS exposure. Mentioned she knows several other venue owners in the South Coast area who might be interested. Worth following up for referrals after her first booking.
                        </p>
                    </div>
                    <div style={{ background: 'var(--secondary-bg)', padding: 16, borderRadius: 8, marginBottom: 16 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                            <strong style={{ fontSize: 13 }}>Kate</strong>
                            <span style={{ fontSize: 11, color: 'var(--accent)' }}>Feb 1, 2026</span>
                        </div>
                        <p style={{ fontSize: 13, color: 'var(--text)', margin: 0 }}>
                            Discovery call went really well. Property is stunning — working farm with modern wellness infrastructure. She's built out a dedicated yoga shala and treatment rooms in the past 2 years. Pricing is competitive for the area. Main concern was about quality of facilitators using the platform — assured her about our vetting process.
                        </p>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Add New Note</label>
                        <textarea className="form-input form-textarea" placeholder="Add internal notes about this venue..."></textarea>
                    </div>
                </div>
            </section>

        </div>
    );
}
