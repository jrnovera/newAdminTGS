import { Mail, Phone, MapPin, Calendar, Edit2, Plus, Upload, Check, ChevronDown, FileText, PhoneCall } from 'lucide-react';
import type { Venue } from '../context/VenueContext';

interface OwnerManagerTabProps {
    venue: Venue;
    onUpdate?: (updates: Partial<Venue>) => void;
}

export default function OwnerManagerTab({ venue: _venue }: OwnerManagerTabProps) {
    return (
        <div>
            {/* Primary Contact Card */}
            <div className="contact-card">
                <div className="contact-avatar">SM</div>
                <div className="contact-details">
                    <div className="contact-name">Sarah Mitchell</div>
                    <div className="contact-role">Owner & Primary Contact</div>
                    <div className="contact-info-grid">
                        <div className="contact-info-item">
                            <div className="contact-info-icon">
                                <Mail width={18} height={18} strokeWidth={1.5} />
                            </div>
                            <div className="contact-info-text">
                                <span className="contact-info-label">Email</span>
                                <span className="contact-info-value"><a href="mailto:sarah@moraeafarm.com.au">sarah@moraeafarm.com.au</a></span>
                            </div>
                        </div>
                        <div className="contact-info-item">
                            <div className="contact-info-icon">
                                <Phone width={18} height={18} strokeWidth={1.5} />
                            </div>
                            <div className="contact-info-text">
                                <span className="contact-info-label">Phone</span>
                                <span className="contact-info-value">+61 412 345 678</span>
                            </div>
                        </div>
                        <div className="contact-info-item">
                            <div className="contact-info-icon">
                                <MapPin width={18} height={18} strokeWidth={1.5} />
                            </div>
                            <div className="contact-info-text">
                                <span className="contact-info-label">Location</span>
                                <span className="contact-info-value">Berry, NSW 2535</span>
                            </div>
                        </div>
                        <div className="contact-info-item">
                            <div className="contact-info-icon">
                                <Calendar width={18} height={18} strokeWidth={1.5} />
                            </div>
                            <div className="contact-info-text">
                                <span className="contact-info-label">Member Since</span>
                                <span className="contact-info-value">February 2026</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="contact-actions">
                    <span className="status-badge verified">
                        <Check width={12} height={12} strokeWidth={2} />
                        Verified
                    </span>
                    <span className="status-badge primary">Primary Contact</span>
                    <button className="btn btn-secondary btn-small" style={{ marginTop: 8 }}>
                        <Edit2 className="icon icon-small" style={{ marginRight: 6 }} />
                        Edit Contact
                    </button>
                </div>
            </div>

            {/* Contact Details */}
            <section className="form-section">
                <div className="form-section-header">
                    <div>
                        <h3 className="form-section-title">Contact Details</h3>
                        <p className="form-section-subtitle">Primary contact information and addresses</p>
                    </div>
                </div>
                <div className="form-section-body">
                    <div className="form-grid three-col">
                        <div className="form-group">
                            <label className="form-label">First Name</label>
                            <input type="text" className="form-input" defaultValue="Sarah" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Last Name</label>
                            <input type="text" className="form-input" defaultValue="Mitchell" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Role</label>
                            <div style={{ position: 'relative' }}>
                                <select className="form-input form-select" defaultValue="Owner" style={{ width: '100%' }}>
                                    <option>Owner</option>
                                    <option>Manager</option>
                                    <option>Co-owner</option>
                                    <option>Property Manager</option>
                                    <option>Administrator</option>
                                </select>
                                <ChevronDown className="select-icon" style={{ position: 'absolute', right: 12, top: 12, pointerEvents: 'none', color: 'var(--accent)' }} size={16} />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Email Address</label>
                            <input type="email" className="form-input" defaultValue="sarah@moraeafarm.com.au" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Phone (Primary)</label>
                            <input type="tel" className="form-input" defaultValue="+61 412 345 678" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Phone (Secondary)</label>
                            <input type="tel" className="form-input" defaultValue="+61 2 4464 1234" />
                        </div>
                        <div className="form-group full-width">
                            <label className="form-label">Mailing Address</label>
                            <input type="text" className="form-input" defaultValue="123 Farm Road, Berry NSW 2535, Australia" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Timezone</label>
                            <div style={{ position: 'relative' }}>
                                <select className="form-input form-select" defaultValue="Australia/Sydney (AEDT)" style={{ width: '100%' }}>
                                    <option>Australia/Sydney (AEDT)</option>
                                    <option>Australia/Brisbane (AEST)</option>
                                    <option>Australia/Melbourne (AEDT)</option>
                                    <option>Australia/Perth (AWST)</option>
                                </select>
                                <ChevronDown className="select-icon" style={{ position: 'absolute', right: 12, top: 12, pointerEvents: 'none', color: 'var(--accent)' }} size={16} />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Preferred Language</label>
                            <div style={{ position: 'relative' }}>
                                <select className="form-input form-select" defaultValue="English" style={{ width: '100%' }}>
                                    <option>English</option>
                                    <option>Spanish</option>
                                    <option>French</option>
                                    <option>German</option>
                                    <option>Italian</option>
                                    <option>Portuguese</option>
                                    <option>Japanese</option>
                                    <option>Mandarin</option>
                                    <option>Indonesian</option>
                                    <option>Thai</option>
                                </select>
                                <ChevronDown className="select-icon" style={{ position: 'absolute', right: 12, top: 12, pointerEvents: 'none', color: 'var(--accent)' }} size={16} />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Business Details */}
            <section className="form-section">
                <div className="form-section-header">
                    <div>
                        <h3 className="form-section-title">Business Details</h3>
                        <p className="form-section-subtitle">Legal entity and tax information</p>
                    </div>
                </div>
                <div className="form-section-body">
                    <div className="form-grid three-col">
                        <div className="form-group">
                            <label className="form-label">Business Name</label>
                            <input type="text" className="form-input" defaultValue="Moraea Farm Retreats Pty Ltd" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">ABN / Tax ID</label>
                            <input type="text" className="form-input" defaultValue="12 345 678 901" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Business Type</label>
                            <div style={{ position: 'relative' }}>
                                <select className="form-input form-select" defaultValue="Company (Pty Ltd)" style={{ width: '100%' }}>
                                    <option>Sole Trader</option>
                                    <option>Company (Pty Ltd)</option>
                                    <option>Partnership</option>
                                    <option>Trust</option>
                                </select>
                                <ChevronDown className="select-icon" style={{ position: 'absolute', right: 12, top: 12, pointerEvents: 'none', color: 'var(--accent)' }} size={16} />
                            </div>
                        </div>
                        <div className="form-group full-width">
                            <label className="form-label">Registered Business Address</label>
                            <input type="text" className="form-input" defaultValue="123 Farm Road, Berry NSW 2535, Australia" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">GST Registered</label>
                            <div className="toggle-container">
                                <div className="toggle active">
                                    <div className="toggle-knob"></div>
                                </div>
                                <span className="toggle-label">Yes</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Team Members */}
            <section className="form-section">
                <div className="form-section-header">
                    <div>
                        <h3 className="form-section-title">Team Members</h3>
                        <p className="form-section-subtitle">Additional contacts with portal access</p>
                    </div>
                    <button className="btn btn-secondary btn-small">
                        <Plus className="icon icon-small" style={{ marginRight: 6 }} />
                        Add Team Member
                    </button>
                </div>
                <div className="form-section-body">
                    <div className="team-grid">
                        <div className="team-card">
                            <div className="team-avatar">SM</div>
                            <div className="team-info">
                                <div className="team-name">Sarah Mitchell</div>
                                <div className="team-role">Owner • Full Access</div>
                            </div>
                            <div className="team-actions">
                                <span className="status-badge primary">Primary</span>
                            </div>
                        </div>
                        <div className="team-card">
                            <div className="team-avatar">JM</div>
                            <div className="team-info">
                                <div className="team-name">James Mitchell</div>
                                <div className="team-role">Co-owner • Full Access</div>
                            </div>
                            <div className="team-actions">
                                <button className="btn btn-secondary btn-small">Edit</button>
                            </div>
                        </div>
                        <div className="team-card">
                            <div className="team-avatar">EB</div>
                            <div className="team-info">
                                <div className="team-name">Emma Brooks</div>
                                <div className="team-role">Property Manager • Booking Access</div>
                            </div>
                            <div className="team-actions">
                                <button className="btn btn-secondary btn-small">Edit</button>
                            </div>
                        </div>
                    </div>
                    <button className="add-btn" style={{ marginTop: 16 }}>
                        <Plus className="icon" style={{ marginRight: 6 }} />
                        Add Another Team Member
                    </button>
                </div>
            </section>

            {/* Host Public Profile */}
            <section className="form-section">
                <div className="form-section-header">
                    <div>
                        <h3 className="form-section-title">Host Public Profile</h3>
                        <p className="form-section-subtitle">Information displayed on the venue's public listing (Overview tab)</p>
                    </div>
                </div>
                <div className="form-section-body">
                    <div className="form-grid">
                        <div className="form-group">
                            <label className="form-label">Host Display Names</label>
                            <input type="text" className="form-input" defaultValue="Sarah & James" placeholder="e.g. Sarah & James, The Mitchell Family" />
                            <p className="form-hint" style={{ fontSize: 11, fontStyle: 'italic', color: 'var(--accent)', marginTop: 6 }}>How hosts are displayed on the public listing</p>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Host Image</label>
                            <div className="image-upload-placeholder" style={{ width: 120, height: 120, border: '2px dashed rgba(184, 184, 184, 0.4)', borderRadius: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--secondary-bg)', cursor: 'pointer' }}>
                                <Upload width={32} height={32} stroke="#B8B8B8" strokeWidth={1.5} />
                                <span style={{ fontSize: 10, color: 'var(--accent)', marginTop: 4 }}>Upload</span>
                            </div>
                            <p className="form-hint" style={{ fontSize: 11, fontStyle: 'italic', color: 'var(--accent)', marginTop: 6 }}>Square image, min 400×400px</p>
                        </div>
                        <div className="form-group full-width">
                            <label className="form-label">Host Quote</label>
                            <input type="text" className="form-input" defaultValue="We believe the best retreats happen when facilitators can focus entirely on their participants—not logistics." placeholder="A short quote that captures your hosting philosophy..." />
                            <p className="form-hint" style={{ fontSize: 11, fontStyle: 'italic', color: 'var(--accent)', marginTop: 6 }}>Displayed in the Host Introduction section on the Overview tab</p>
                        </div>
                        <div className="form-group full-width">
                            <label className="form-label">Host Bio</label>
                            <textarea className="form-input form-textarea" rows={4} placeholder="Tell potential guests about yourselves..." defaultValue="Sarah and James Mitchell have been hosting retreats at Moraea Farm since 2018. With backgrounds in hospitality and wellness, they understand what facilitators need to create transformational experiences. They live on the property with their two children and are hands-on hosts who take pride in anticipating every detail."></textarea>
                            <p className="form-hint" style={{ fontSize: 11, fontStyle: 'italic', color: 'var(--accent)', marginTop: 6 }}>2-3 paragraphs about the hosts. Displayed on the public listing.</p>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Show Host Profile on Listing</label>
                            <div className="toggle-container">
                                <div className="toggle active">
                                    <div className="toggle-knob"></div>
                                </div>
                                <span className="toggle-label">Display host introduction on venue page</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Communication Preferences */}
            <section className="form-section">
                <div className="form-section-header">
                    <div>
                        <h3 className="form-section-title">Communication Preferences</h3>
                        <p className="form-section-subtitle">How and when to contact this venue owner</p>
                    </div>
                </div>
                <div className="form-section-body">
                    <div className="form-grid three-col">
                        <div className="form-group">
                            <label className="form-label">Preferred Contact Method</label>
                            <div style={{ position: 'relative' }}>
                                <select className="form-input form-select" defaultValue="Email" style={{ width: '100%' }}>
                                    <option>Email</option>
                                    <option>Phone Call</option>
                                    <option>SMS / Text</option>
                                    <option>WhatsApp</option>
                                </select>
                                <ChevronDown className="select-icon" style={{ position: 'absolute', right: 12, top: 12, pointerEvents: 'none', color: 'var(--accent)' }} size={16} />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Best Time to Call</label>
                            <div style={{ position: 'relative' }}>
                                <select className="form-input form-select" defaultValue="Afternoon (12pm-5pm)" style={{ width: '100%' }}>
                                    <option>Morning (9am-12pm)</option>
                                    <option>Afternoon (12pm-5pm)</option>
                                    <option>Evening (5pm-8pm)</option>
                                    <option>Any time</option>
                                </select>
                                <ChevronDown className="select-icon" style={{ position: 'absolute', right: 12, top: 12, pointerEvents: 'none', color: 'var(--accent)' }} size={16} />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Response Time</label>
                            <div style={{ position: 'relative' }}>
                                <select className="form-input form-select" defaultValue="Within 24 hours" style={{ width: '100%' }}>
                                    <option>Within 1 hour</option>
                                    <option>Within 24 hours</option>
                                    <option>Within 48 hours</option>
                                </select>
                                <ChevronDown className="select-icon" style={{ position: 'absolute', right: 12, top: 12, pointerEvents: 'none', color: 'var(--accent)' }} size={16} />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Booking Notifications</label>
                            <div className="toggle-container">
                                <div className="toggle active">
                                    <div className="toggle-knob"></div>
                                </div>
                                <span className="toggle-label">Email + SMS</span>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Marketing Emails</label>
                            <div className="toggle-container">
                                <div className="toggle active">
                                    <div className="toggle-knob"></div>
                                </div>
                                <span className="toggle-label">Subscribed</span>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Platform Updates</label>
                            <div className="toggle-container">
                                <div className="toggle active">
                                    <div className="toggle-knob"></div>
                                </div>
                                <span className="toggle-label">Subscribed</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Documents & Contracts */}
            <section className="form-section">
                <div className="form-section-header">
                    <div>
                        <h3 className="form-section-title">Documents & Contracts</h3>
                        <p className="form-section-subtitle">Legal agreements and uploaded documents</p>
                    </div>
                    <button className="btn btn-secondary btn-small">
                        <Upload className="icon icon-small" style={{ marginRight: 6 }} />
                        Upload Document
                    </button>
                </div>
                <div className="form-section-body">
                    <div className="document-list">
                        <div className="document-item">
                            <div className="document-icon">
                                <FileText width={24} height={24} stroke="#313131" strokeWidth={1.5} />
                            </div>
                            <div className="document-info">
                                <div className="document-name">Venue Partnership Agreement</div>
                                <div className="document-meta">Signed Feb 5, 2026 • PDF • 245 KB</div>
                            </div>
                            <div className="document-actions">
                                <span className="status-badge verified">Signed</span>
                                <button className="btn btn-secondary btn-small">View</button>
                                <button className="btn btn-secondary btn-small">Download</button>
                            </div>
                        </div>
                        <div className="document-item">
                            <div className="document-icon">
                                <FileText width={24} height={24} stroke="#313131" strokeWidth={1.5} />
                            </div>
                            <div className="document-info">
                                <div className="document-name">Public Liability Insurance Certificate</div>
                                <div className="document-meta">Expires Dec 31, 2026 • PDF • 1.2 MB</div>
                            </div>
                            <div className="document-actions">
                                <span className="status-badge verified">Verified</span>
                                <button className="btn btn-secondary btn-small">View</button>
                                <button className="btn btn-secondary btn-small">Download</button>
                            </div>
                        </div>
                        <div className="document-item">
                            <div className="document-icon">
                                <FileText width={24} height={24} stroke="#313131" strokeWidth={1.5} />
                            </div>
                            <div className="document-info">
                                <div className="document-name">Property Title Document</div>
                                <div className="document-meta">Uploaded Feb 5, 2026 • PDF • 3.8 MB</div>
                            </div>
                            <div className="document-actions">
                                <span className="status-badge verified">Verified</span>
                                <button className="btn btn-secondary btn-small">View</button>
                                <button className="btn btn-secondary btn-small">Download</button>
                            </div>
                        </div>
                        <div className="document-item">
                            <div className="document-icon">
                                <FileText width={24} height={24} stroke="#313131" strokeWidth={1.5} />
                            </div>
                            <div className="document-info">
                                <div className="document-name">ABN Registration</div>
                                <div className="document-meta">Uploaded Feb 5, 2026 • PDF • 89 KB</div>
                            </div>
                            <div className="document-actions">
                                <span className="status-badge verified">Verified</span>
                                <button className="btn btn-secondary btn-small">View</button>
                                <button className="btn btn-secondary btn-small">Download</button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Communication History */}
            <section className="form-section">
                <div className="form-section-header">
                    <div>
                        <h3 className="form-section-title">Communication History</h3>
                        <p className="form-section-subtitle">Recent interactions with this venue owner</p>
                    </div>
                    <button className="btn btn-secondary btn-small">
                        <Plus className="icon icon-small" style={{ marginRight: 6 }} />
                        Log Communication
                    </button>
                </div>
                <div className="form-section-body">
                    <div className="comm-log">
                        <div className="comm-item">
                            <div className="comm-icon email">
                                <Mail width={18} height={18} stroke="currentColor" strokeWidth={1.5} />
                            </div>
                            <div className="comm-content">
                                <div className="comm-header">
                                    <div className="comm-title">Welcome to TGS! <span className="comm-type outbound">Outbound</span></div>
                                    <div className="comm-date">Feb 8, 2026</div>
                                </div>
                                <div className="comm-summary">Sent welcome email with portal login credentials and onboarding guide. Included links to help center and calendar sync instructions.</div>
                            </div>
                        </div>
                        <div className="comm-item">
                            <div className="comm-icon call">
                                <PhoneCall width={18} height={18} stroke="currentColor" strokeWidth={1.5} />
                            </div>
                            <div className="comm-content">
                                <div className="comm-header">
                                    <div className="comm-title">Onboarding Call (45 mins) <span className="comm-type outbound">Outbound</span></div>
                                    <div className="comm-date">Feb 6, 2026</div>
                                </div>
                                <div className="comm-summary">Walked through portal setup, pricing configuration, and photo upload process. Sarah asked about marketing support — mentioned upcoming featured venue spotlights. Very engaged and positive.</div>
                            </div>
                        </div>
                        <div className="comm-item">
                            <div className="comm-icon email">
                                <Mail width={18} height={18} stroke="currentColor" strokeWidth={1.5} />
                            </div>
                            <div className="comm-content">
                                <div className="comm-header">
                                    <div className="comm-title">Contract & Onboarding Details <span className="comm-type outbound">Outbound</span></div>
                                    <div className="comm-date">Feb 4, 2026</div>
                                </div>
                                <div className="comm-summary">Sent contract via DocuSign with Super Founder pricing breakdown. Included checklist of documents required for verification.</div>
                            </div>
                        </div>
                        <div className="comm-item">
                            <div className="comm-icon call">
                                <PhoneCall width={18} height={18} stroke="currentColor" strokeWidth={1.5} />
                            </div>
                            <div className="comm-content">
                                <div className="comm-header">
                                    <div className="comm-title">Discovery Call (20 mins) <span className="comm-type outbound">Outbound</span></div>
                                    <div className="comm-date">Feb 1, 2026</div>
                                </div>
                                <div className="comm-summary">Initial discovery call to discuss TGS platform and partnership opportunities. Sarah expressed interest in Super Founder pricing. Discussed her current booking challenges and desire for quality facilitator connections.</div>
                            </div>
                        </div>
                        <div className="comm-item">
                            <div className="comm-icon email">
                                <Mail width={18} height={18} stroke="currentColor" strokeWidth={1.5} />
                            </div>
                            <div className="comm-content">
                                <div className="comm-header">
                                    <div className="comm-title">Initial Outreach <span className="comm-type outbound">Outbound</span></div>
                                    <div className="comm-date">Jan 28, 2026</div>
                                </div>
                                <div className="comm-summary">Sent Retreat Venue Super Founder campaign email introducing TGS platform and exclusive founder pricing opportunity.</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Relationship Notes */}
            <section className="form-section">
                <div className="form-section-header">
                    <h3 className="form-section-title">Relationship Notes</h3>
                </div>
                <div className="form-section-body">
                    <div className="form-group">
                        <label className="form-label">Notes (Internal)</label>
                        <textarea
                            className="form-input form-textarea"
                            placeholder="Add notes about this relationship..."
                            defaultValue="Sarah is a fantastic venue partner — very responsive and engaged. She has strong connections in the South Coast wellness community and mentioned knowing 3-4 other venue owners who might be interested in TGS. Follows up quickly on all communications.&#10;&#10;Key interests: Quality facilitator vetting, marketing exposure, connecting with corporate wellness market.&#10;&#10;Potential referral source — follow up after first successful booking."
                        />
                    </div>
                </div>
            </section>
        </div>
    );
}
