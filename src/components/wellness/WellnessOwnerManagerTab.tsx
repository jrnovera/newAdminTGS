import { useState, useRef, useEffect } from 'react';
import { Mail, Phone, MapPin, Calendar, Check, Edit2, Plus, Upload, User, UserPlus, FileText, Download, Eye, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import type { Venue } from '../../context/VenueContext';

interface Props {
    venue: Venue;
    onUpdate: (updates: Partial<Venue>) => void;
}

export default function WellnessOwnerManagerTab({ venue, onUpdate }: Props) {
    // Contact Details State
    const [firstName, setFirstName] = useState(venue.firstName || venue.owner?.split(' ')[0] || '');
    const [lastName, setLastName] = useState(venue.lastName || venue.owner?.split(' ').slice(1).join(' ') || '');
    const [role, setRole] = useState(venue.ownerRole || 'Owner');
    const [email, setEmail] = useState(venue.email || '');
    const [phonePrimary, setPhonePrimary] = useState(venue.phone || '');
    const [phoneSecondary, setPhoneSecondary] = useState(venue.phoneSecondary || '');
    const [mailingAddress, setMailingAddress] = useState(venue.ownerAddress || '');
    const [timezone, setTimezone] = useState('Australia/Sydney (AEDT)');
    const [preferredLanguage, setPreferredLanguage] = useState('English');

    // Business Details State
    const [businessName, setBusinessName] = useState(venue.businessName || '');
    const [taxId, setTaxId] = useState(venue.taxId || '');
    const [businessType, setBusinessType] = useState(venue.businessType || 'Company (Pty Ltd)');
    const [registeredAddress, setRegisteredAddress] = useState(venue.ownerAddress || '');
    const [gstRegistered, setGstRegistered] = useState(venue.gstRegistered ?? false);

    // Host Public Profile State
    const [hostDisplayNames, setHostDisplayNames] = useState(venue.owner || '');
    const [hostQuote, setHostQuote] = useState(venue.quote || '');
    const [hostBio, setHostBio] = useState(venue.hostBio || '');
    const [showHostProfile, setShowHostProfile] = useState(venue.showHostProfile ?? true);

    // Communication Preferences State
    const [preferredContact, setPreferredContact] = useState('Email');
    const [bestTimeToCall, setBestTimeToCall] = useState('Afternoon (12pm-5pm)');
    const [responseTime, setResponseTime] = useState('Within 24 hours');
    const [bookingNotifications, setBookingNotifications] = useState(true);
    const [marketingEmails, setMarketingEmails] = useState(true);
    const [platformUpdates, setPlatformUpdates] = useState(true);

    // Relationship Notes State
    const [relationshipNotes, setRelationshipNotes] = useState(venue.relationshipNotes || '');

    // Batch-save all owner/business fields whenever any state changes
    const isMount = useRef(true);
    useEffect(() => {
        if (isMount.current) { isMount.current = false; return; }
        onUpdate({
            owner: `${firstName} ${lastName}`.trim(),
            firstName,
            lastName,
            ownerRole: role,
            email,
            phone: phonePrimary,
            phoneSecondary,
            ownerAddress: mailingAddress,
            businessName,
            taxId,
            businessType,
            gstRegistered,
            hostBio,
            showHostProfile,
            relationshipNotes,
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [firstName, lastName, role, email, phonePrimary, phoneSecondary, mailingAddress,
        businessName, taxId, businessType, gstRegistered, hostBio, showHostProfile, relationshipNotes]);

    return (
        <div className="wvd-content">
            {/* Primary Contact Card */}
            <div className="wom-contact-card">
                <div className="wom-contact-avatar">SM</div>
                <div className="wom-contact-details">
                    <div className="wom-contact-name">Sarah Mitchell</div>
                    <div className="wom-contact-role">Owner & Primary Contact</div>
                    <div className="wom-contact-info-grid">
                        <div className="wom-contact-info-item">
                            <div className="wom-contact-info-icon"><Mail size={16} color="#313131" /></div>
                            <div className="wom-contact-info-text">
                                <span className="wom-contact-info-label">Email</span>
                                <span className="wom-contact-info-value"><a href="mailto:sarah@bodhidayspa.com.au">sarah@bodhidayspa.com.au</a></span>
                            </div>
                        </div>
                        <div className="wom-contact-info-item">
                            <div className="wom-contact-info-icon"><Phone size={16} color="#313131" /></div>
                            <div className="wom-contact-info-text">
                                <span className="wom-contact-info-label">Phone</span>
                                <span className="wom-contact-info-value">+61 412 345 678</span>
                            </div>
                        </div>
                        <div className="wom-contact-info-item">
                            <div className="wom-contact-info-icon"><MapPin size={16} color="#313131" /></div>
                            <div className="wom-contact-info-text">
                                <span className="wom-contact-info-label">Location</span>
                                <span className="wom-contact-info-value">Berry, NSW 2535</span>
                            </div>
                        </div>
                        <div className="wom-contact-info-item">
                            <div className="wom-contact-info-icon"><Calendar size={16} color="#313131" /></div>
                            <div className="wom-contact-info-text">
                                <span className="wom-contact-info-label">Member Since</span>
                                <span className="wom-contact-info-value">February 2026</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="wom-contact-actions">
                    <span className="wom-status-badge verified">
                        <Check size={12} strokeWidth={3} />
                        Verified
                    </span>
                    <span className="wom-status-badge primary">Primary Contact</span>
                    <button className="wvd-btn-secondary wvd-btn-small" style={{ marginTop: '8px' }}>
                        <Edit2 size={12} />
                        Edit Contact
                    </button>
                </div>
            </div>

            {/* Contact Details */}
            <section className="wvd-form-section">
                <div className="wvd-form-section-header">
                    <div>
                        <h3 className="wvd-form-section-title">Contact Details</h3>
                        <p className="wvd-form-hint">Primary contact information and addresses</p>
                    </div>
                </div>
                <div className="wvd-form-section-body">
                    <div className="wvd-form-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                        <div className="wvd-form-group">
                            <label className="wvd-form-label">First Name</label>
                            <input type="text" className="wvd-form-input" value={firstName} onChange={e => setFirstName(e.target.value)} />
                        </div>
                        <div className="wvd-form-group">
                            <label className="wvd-form-label">Last Name</label>
                            <input type="text" className="wvd-form-input" value={lastName} onChange={e => setLastName(e.target.value)} />
                        </div>
                        <div className="wvd-form-group">
                            <label className="wvd-form-label">Role</label>
                            <select className="wvd-form-input wvd-form-select" value={role} onChange={e => setRole(e.target.value)}>
                                <option value="Owner">Owner</option>
                                <option value="Manager">Manager</option>
                                <option value="Co-owner">Co-owner</option>
                                <option value="Spa Director">Spa Director</option>
                                <option value="Administrator">Administrator</option>
                            </select>
                        </div>
                        <div className="wvd-form-group">
                            <label className="wvd-form-label">Email Address</label>
                            <input type="email" className="wvd-form-input" value={email} onChange={e => setEmail(e.target.value)} />
                        </div>
                        <div className="wvd-form-group">
                            <label className="wvd-form-label">Phone (Primary)</label>
                            <input type="tel" className="wvd-form-input" value={phonePrimary} onChange={e => setPhonePrimary(e.target.value)} />
                        </div>
                        <div className="wvd-form-group">
                            <label className="wvd-form-label">Phone (Secondary)</label>
                            <input type="tel" className="wvd-form-input" value={phoneSecondary} onChange={e => setPhoneSecondary(e.target.value)} />
                        </div>
                        <div className="wvd-form-group wvd-full-width">
                            <label className="wvd-form-label">Mailing Address</label>
                            <input type="text" className="wvd-form-input" value={mailingAddress} onChange={e => setMailingAddress(e.target.value)} />
                        </div>
                        <div className="wvd-form-group">
                            <label className="wvd-form-label">Timezone</label>
                            <select className="wvd-form-input wvd-form-select" value={timezone} onChange={e => setTimezone(e.target.value)}>
                                <option>Australia/Sydney (AEDT)</option>
                                <option>Australia/Brisbane (AEST)</option>
                                <option>Australia/Melbourne (AEDT)</option>
                                <option>Australia/Perth (AWST)</option>
                            </select>
                        </div>
                        <div className="wvd-form-group">
                            <label className="wvd-form-label">Preferred Language</label>
                            <select className="wvd-form-input wvd-form-select" value={preferredLanguage} onChange={e => setPreferredLanguage(e.target.value)}>
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
                        </div>
                    </div>
                </div>
            </section>

            {/* Business Details */}
            <section className="wvd-form-section">
                <div className="wvd-form-section-header">
                    <div>
                        <h3 className="wvd-form-section-title">Business Details</h3>
                        <p className="wvd-form-hint">Legal entity and tax information</p>
                    </div>
                </div>
                <div className="wvd-form-section-body">
                    <div className="wvd-form-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                        <div className="wvd-form-group">
                            <label className="wvd-form-label">Business Name</label>
                            <input type="text" className="wvd-form-input" value={businessName} onChange={e => setBusinessName(e.target.value)} />
                        </div>
                        <div className="wvd-form-group">
                            <label className="wvd-form-label">ABN / Tax ID</label>
                            <input type="text" className="wvd-form-input" value={taxId} onChange={e => setTaxId(e.target.value)} />
                        </div>
                        <div className="wvd-form-group">
                            <label className="wvd-form-label">Business Type</label>
                            <select className="wvd-form-input wvd-form-select" value={businessType} onChange={e => setBusinessType(e.target.value)}>
                                <option>Sole Trader</option>
                                <option>Company (Pty Ltd)</option>
                                <option>Partnership</option>
                                <option>Trust</option>
                            </select>
                        </div>
                        <div className="wvd-form-group wvd-full-width">
                            <label className="wvd-form-label">Registered Business Address</label>
                            <input type="text" className="wvd-form-input" value={registeredAddress} onChange={e => setRegisteredAddress(e.target.value)} />
                        </div>
                        <div className="wvd-form-group">
                            <label className="wvd-form-label">GST Registered</label>
                            <div className="wvd-toggle-container">
                                <div className={`wvd-toggle ${gstRegistered ? 'active' : ''}`} onClick={() => setGstRegistered(!gstRegistered)}>
                                    <div className="wvd-toggle-knob"></div>
                                </div>
                                <span className="wvd-toggle-label">{gstRegistered ? 'Yes' : 'No'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Team Members */}
            <section className="wvd-form-section">
                <div className="wvd-form-section-header">
                    <div>
                        <h3 className="wvd-form-section-title">Team Members</h3>
                        <p className="wvd-form-hint">Additional contacts with portal access</p>
                    </div>
                    <button className="wvd-btn-secondary wvd-btn-small">
                        <UserPlus size={14} />
                        Add Team Member
                    </button>
                </div>
                <div className="wvd-form-section-body">
                    <div className="wom-team-grid">
                        <div className="wom-team-card">
                            <div className="wom-team-avatar">MC</div>
                            <div className="wom-team-info">
                                <div className="wom-team-name">Maya Chen</div>
                                <div className="wom-team-role">Owner • Full Access</div>
                            </div>
                            <div className="wom-team-actions">
                                <span className="wom-status-badge primary">Primary</span>
                            </div>
                        </div>
                        <div className="wom-team-card">
                            <div className="wom-team-avatar">LT</div>
                            <div className="wom-team-info">
                                <div className="wom-team-name">Lily Tanaka</div>
                                <div className="wom-team-role">Spa Manager • Full Access</div>
                            </div>
                            <div className="wom-team-actions">
                                <button className="wvd-btn-secondary wvd-btn-small" style={{ padding: '6px 12px' }}>Edit</button>
                            </div>
                        </div>
                        <div className="wom-team-card">
                            <div className="wom-team-avatar">AR</div>
                            <div className="wom-team-info">
                                <div className="wom-team-name">Amy Roberts</div>
                                <div className="wom-team-role">Reception • Booking Access</div>
                            </div>
                            <div className="wom-team-actions">
                                <button className="wvd-btn-secondary wvd-btn-small" style={{ padding: '6px 12px' }}>Edit</button>
                            </div>
                        </div>
                    </div>
                    <button className="wom-add-btn" style={{ marginTop: '16px' }}>
                        <UserPlus size={16} />
                        Add Another Team Member
                    </button>
                </div>
            </section>

            {/* Host Public Profile */}
            <section className="wvd-form-section">
                <div className="wvd-form-section-header">
                    <div>
                        <h3 className="wvd-form-section-title">Host Public Profile</h3>
                        <p className="wvd-form-hint">Information displayed on the venue's public listing (Overview tab)</p>
                    </div>
                </div>
                <div className="wvd-form-section-body">
                    <div className="wvd-form-grid">
                        <div className="wvd-form-group">
                            <label className="wvd-form-label">Host Display Names</label>
                            <input type="text" className="wvd-form-input" value={hostDisplayNames} onChange={e => setHostDisplayNames(e.target.value)} placeholder="e.g. Maya Chen, The Bodhi Team" />
                            <p className="wvd-form-hint" style={{ fontSize: '11px', fontStyle: 'italic', marginTop: '6px' }}>How hosts are displayed on the public listing</p>
                        </div>
                        <div className="wvd-form-group">
                            <label className="wvd-form-label">Host Image</label>
                            <div className="wom-image-upload-placeholder" style={{ width: '120px', height: '120px', border: '2px dashed rgba(184, 184, 184, 0.4)', borderRadius: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--secondary-bg)', cursor: 'pointer' }}>
                                <User size={32} color="#B8B8B8" strokeWidth={1.5} />
                                <span style={{ fontSize: '10px', color: 'var(--accent)', marginTop: '4px' }}>Upload</span>
                            </div>
                            <p className="wvd-form-hint" style={{ fontSize: '11px', fontStyle: 'italic', marginTop: '6px' }}>Square image, min 400×400px</p>
                        </div>
                        <div className="wvd-form-group wvd-full-width">
                            <label className="wvd-form-label">Host Quote</label>
                            <input type="text" className="wvd-form-input" value={hostQuote} onChange={e => setHostQuote(e.target.value)} placeholder="A short quote that captures your wellness philosophy..." />
                            <p className="wvd-form-hint" style={{ fontSize: '11px', fontStyle: 'italic', marginTop: '6px' }}>Displayed in the Host Introduction section on the Overview tab</p>
                        </div>
                        <div className="wvd-form-group wvd-full-width">
                            <label className="wvd-form-label">Host Bio</label>
                            <textarea className="wvd-form-input wvd-form-textarea" rows={4} value={hostBio} onChange={e => setHostBio(e.target.value)} placeholder="Tell potential guests about yourselves..."></textarea>
                            <p className="wvd-form-hint" style={{ fontSize: '11px', fontStyle: 'italic', marginTop: '6px' }}>2-3 paragraphs about the hosts. Displayed on the public listing.</p>
                        </div>
                        <div className="wvd-form-group">
                            <label className="wvd-form-label">Show Host Profile on Listing</label>
                            <div className="wvd-toggle-container">
                                <div className={`wvd-toggle ${showHostProfile ? 'active' : ''}`} onClick={() => setShowHostProfile(!showHostProfile)}>
                                    <div className="wvd-toggle-knob"></div>
                                </div>
                                <span className="wvd-toggle-label">{showHostProfile ? 'Display host introduction on venue page' : 'Hidden'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Communication Preferences */}
            <section className="wvd-form-section">
                <div className="wvd-form-section-header">
                    <div>
                        <h3 className="wvd-form-section-title">Communication Preferences</h3>
                        <p className="wvd-form-hint">How and when to contact this venue owner</p>
                    </div>
                </div>
                <div className="wvd-form-section-body">
                    <div className="wvd-form-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                        <div className="wvd-form-group">
                            <label className="wvd-form-label">Preferred Contact Method</label>
                            <select className="wvd-form-input wvd-form-select" value={preferredContact} onChange={e => setPreferredContact(e.target.value)}>
                                <option>Email</option>
                                <option>Phone Call</option>
                                <option>SMS / Text</option>
                                <option>WhatsApp</option>
                            </select>
                        </div>
                        <div className="wvd-form-group">
                            <label className="wvd-form-label">Best Time to Call</label>
                            <select className="wvd-form-input wvd-form-select" value={bestTimeToCall} onChange={e => setBestTimeToCall(e.target.value)}>
                                <option>Morning (9am-12pm)</option>
                                <option>Afternoon (12pm-5pm)</option>
                                <option>Evening (5pm-8pm)</option>
                                <option>Any time</option>
                            </select>
                        </div>
                        <div className="wvd-form-group">
                            <label className="wvd-form-label">Response Time</label>
                            <select className="wvd-form-input wvd-form-select" value={responseTime} onChange={e => setResponseTime(e.target.value)}>
                                <option>Within 1 hour</option>
                                <option>Within 24 hours</option>
                                <option>Within 48 hours</option>
                            </select>
                        </div>
                        <div className="wvd-form-group">
                            <label className="wvd-form-label">Booking Notifications</label>
                            <div className="wvd-toggle-container">
                                <div className={`wvd-toggle ${bookingNotifications ? 'active' : ''}`} onClick={() => setBookingNotifications(!bookingNotifications)}>
                                    <div className="wvd-toggle-knob"></div>
                                </div>
                                <span className="wvd-toggle-label">{bookingNotifications ? 'Email + SMS' : 'Email Only'}</span>
                            </div>
                        </div>
                        <div className="wvd-form-group">
                            <label className="wvd-form-label">Marketing Emails</label>
                            <div className="wvd-toggle-container">
                                <div className={`wvd-toggle ${marketingEmails ? 'active' : ''}`} onClick={() => setMarketingEmails(!marketingEmails)}>
                                    <div className="wvd-toggle-knob"></div>
                                </div>
                                <span className="wvd-toggle-label">{marketingEmails ? 'Subscribed' : 'Unsubscribed'}</span>
                            </div>
                        </div>
                        <div className="wvd-form-group">
                            <label className="wvd-form-label">Platform Updates</label>
                            <div className="wvd-toggle-container">
                                <div className={`wvd-toggle ${platformUpdates ? 'active' : ''}`} onClick={() => setPlatformUpdates(!platformUpdates)}>
                                    <div className="wvd-toggle-knob"></div>
                                </div>
                                <span className="wvd-toggle-label">{platformUpdates ? 'Subscribed' : 'Unsubscribed'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Documents & Contracts */}
            <section className="wvd-form-section">
                <div className="wvd-form-section-header">
                    <div>
                        <h3 className="wvd-form-section-title">Documents & Contracts</h3>
                        <p className="wvd-form-hint">Legal agreements and uploaded documents</p>
                    </div>
                    <button className="wvd-btn-secondary wvd-btn-small">
                        <Upload size={14} />
                        Upload Document
                    </button>
                </div>
                <div className="wvd-form-section-body">
                    <div className="wom-document-list">
                        <div className="wom-document-item">
                            <div className="wom-document-icon"><FileText size={20} color="#313131" /></div>
                            <div className="wom-document-info">
                                <div className="wom-document-name">Venue Partnership Agreement</div>
                                <div className="wom-document-meta">Signed Jan 13, 2026 • PDF • 245 KB</div>
                            </div>
                            <div className="wom-document-actions">
                                <span className="wom-status-badge verified">Signed</span>
                                <button className="wvd-btn-secondary wvd-btn-small" style={{ padding: '4px 8px' }}><Eye size={12} /></button>
                                <button className="wvd-btn-secondary wvd-btn-small" style={{ padding: '4px 8px' }}><Download size={12} /></button>
                            </div>
                        </div>
                        <div className="wom-document-item">
                            <div className="wom-document-icon"><FileText size={20} color="#313131" /></div>
                            <div className="wom-document-info">
                                <div className="wom-document-name">Public Liability Insurance Certificate</div>
                                <div className="wom-document-meta">Expires Dec 31, 2026 • PDF • 1.2 MB</div>
                            </div>
                            <div className="wom-document-actions">
                                <span className="wom-status-badge verified">Verified</span>
                                <button className="wvd-btn-secondary wvd-btn-small" style={{ padding: '4px 8px' }}><Eye size={12} /></button>
                                <button className="wvd-btn-secondary wvd-btn-small" style={{ padding: '4px 8px' }}><Download size={12} /></button>
                            </div>
                        </div>
                        <div className="wom-document-item">
                            <div className="wom-document-icon"><FileText size={20} color="#313131" /></div>
                            <div className="wom-document-info">
                                <div className="wom-document-name">ABN Registration</div>
                                <div className="wom-document-meta">Uploaded Jan 13, 2026 • PDF • 89 KB</div>
                            </div>
                            <div className="wom-document-actions">
                                <span className="wom-status-badge verified">Verified</span>
                                <button className="wvd-btn-secondary wvd-btn-small" style={{ padding: '4px 8px' }}><Eye size={12} /></button>
                                <button className="wvd-btn-secondary wvd-btn-small" style={{ padding: '4px 8px' }}><Download size={12} /></button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Communication History */}
            <section className="wvd-form-section">
                <div className="wvd-form-section-header">
                    <div>
                        <h3 className="wvd-form-section-title">Communication History</h3>
                        <p className="wvd-form-hint">Recent interactions with this venue owner</p>
                    </div>
                    <button className="wvd-btn-secondary wvd-btn-small">
                        <Plus size={14} />
                        Log Communication
                    </button>
                </div>
                <div className="wvd-form-section-body">
                    <div className="wom-comm-log">
                        <div className="wom-comm-item">
                            <div className="wom-comm-icon email"><Mail size={16} /></div>
                            <div className="wom-comm-content">
                                <div className="wom-comm-header">
                                    <div className="wom-comm-title">Welcome to TGS! <span className="wom-comm-type outbound"><ArrowUpRight size={10} style={{ marginRight: 4 }} />Outbound</span></div>
                                    <div className="wom-comm-date">Jan 15, 2026</div>
                                </div>
                                <div className="wom-comm-summary">Sent welcome email with portal login credentials and onboarding guide. Included links to help center and service listing optimization tips.</div>
                            </div>
                        </div>
                        <div className="wom-comm-item">
                            <div className="wom-comm-icon call"><Phone size={16} /></div>
                            <div className="wom-comm-content">
                                <div className="wom-comm-header">
                                    <div className="wom-comm-title">Onboarding Call (30 mins) <span className="wom-comm-type outbound"><ArrowUpRight size={10} style={{ marginRight: 4 }} />Outbound</span></div>
                                    <div className="wom-comm-date">Jan 14, 2026</div>
                                </div>
                                <div className="wom-comm-summary">Walked through portal setup, service menu configuration, and photo upload process. Maya asked about featuring in Wellness Edit content — discussed editorial opportunities. Very detail-oriented and enthusiastic.</div>
                            </div>
                        </div>
                        <div className="wom-comm-item">
                            <div className="wom-comm-icon email"><Mail size={16} /></div>
                            <div className="wom-comm-content">
                                <div className="wom-comm-header">
                                    <div className="wom-comm-title">Inbound Enquiry Response <span className="wom-comm-type inbound"><ArrowDownLeft size={10} style={{ marginRight: 4 }} />Inbound</span></div>
                                    <div className="wom-comm-date">Jan 10, 2026</div>
                                </div>
                                <div className="wom-comm-summary">Maya submitted List Your Venue form expressing interest in TGS platform. Currently using Mindbody for bookings but wants exposure to wellness travelers.</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Relationship Notes */}
            <section className="wvd-form-section">
                <div className="wvd-form-section-header">
                    <h3 className="wvd-form-section-title">Relationship Notes</h3>
                </div>
                <div className="wvd-form-section-body">
                    <div className="wvd-form-group">
                        <label className="wvd-form-label">Notes (Internal)</label>
                        <textarea
                            className="wvd-form-input wvd-form-textarea"
                            placeholder="Add notes about this relationship..."
                            style={{ minHeight: '150px' }}
                            value={relationshipNotes}
                            onChange={e => setRelationshipNotes(e.target.value)}
                        />
                    </div>
                </div>
            </section>

        </div>
    );
}
