import { useState, useEffect, useRef } from 'react';
import { Mail, Phone, MapPin, Calendar, Check, Plus, Upload, FileText, Trash2, ChevronDown } from 'lucide-react';
import type { Venue } from '../context/VenueContext';
import { supabase } from '../lib/supabase';
import { uploadFile, deleteFile } from '../lib/storage';

interface Props {
    venue: Venue;
    onUpdate?: (updates: Partial<Venue>) => void;
}

const VENUE_TYPE = 'retreat';

interface TeamMember {
    id: string;
    name: string;
    role: string;
    avatar_url: string | null;
    status: string;
}

interface VenueDocument {
    id: string;
    file_url: string;
    file_name: string;
    file_size_bytes: number | null;
    file_type: string | null;
    created_at: string;
}

export default function OwnerManagerTab({ venue }: Props) {
    // Contact Details
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [role, setRole] = useState('Owner');
    const [email, setEmail] = useState('');
    const [phonePrimary, setPhonePrimary] = useState('');
    const [phoneSecondary, setPhoneSecondary] = useState('');
    const [mailingAddress, setMailingAddress] = useState('');
    const [timezone, setTimezone] = useState('Australia/Sydney (AEDT)');
    const [preferredLanguage, setPreferredLanguage] = useState('English');

    // Business Details
    const [businessName, setBusinessName] = useState('');
    const [abnTaxId, setAbnTaxId] = useState('');
    const [businessType, setBusinessType] = useState('Company (Pty Ltd)');
    const [registeredAddress, setRegisteredAddress] = useState('');
    const [gstRegistered, setGstRegistered] = useState(false);

    // Host Public Profile
    const [hostDisplayName, setHostDisplayName] = useState('');
    const [hostImageUrl, setHostImageUrl] = useState('');
    const [hostQuote, setHostQuote] = useState('');
    const [hostBio, setHostBio] = useState('');
    const [showHostProfile, setShowHostProfile] = useState(true);

    // Communication Preferences
    const [preferredContactMethod, setPreferredContactMethod] = useState('Email');
    const [bestTimeToCall, setBestTimeToCall] = useState('Afternoon (12pm-5pm)');
    const [responseTime, setResponseTime] = useState('Within 24 hours');
    const [bookingNotifications, setBookingNotifications] = useState(true);
    const [marketingEmails, setMarketingEmails] = useState(false);
    const [platformUpdates, setPlatformUpdates] = useState(true);

    // Relationship Notes
    const [relationshipNotes, setRelationshipNotes] = useState('');

    // Team Members
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
    const [newMemberName, setNewMemberName] = useState('');
    const [newMemberRole, setNewMemberRole] = useState('');
    const [newMemberStatus, setNewMemberStatus] = useState('Active');
    const [showAddMember, setShowAddMember] = useState(false);

    // Documents
    const [documents, setDocuments] = useState<VenueDocument[]>([]);

    // UI State
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saved' | 'error'>('idle');

    const hostImageInputRef = useRef<HTMLInputElement>(null);
    const docInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [venue.id]);

    async function loadData() {
        setLoading(true);
        const [ownerRes, teamRes, docsRes] = await Promise.all([
            supabase.from('venue_owner_manager').select('*').eq('venue_id', venue.id).eq('venue_type', VENUE_TYPE).maybeSingle(),
            supabase.from('venue_team_members').select('*').eq('venue_id', venue.id).eq('venue_type', VENUE_TYPE).order('created_at'),
            supabase.from('venue_documents').select('*').eq('venue_id', venue.id).eq('venue_type', VENUE_TYPE).eq('doc_category', 'legal').order('created_at'),
        ]);

        if (ownerRes.error) console.error(ownerRes.error);
        if (teamRes.error) console.error(teamRes.error);
        if (docsRes.error) console.error(docsRes.error);

        const o = ownerRes.data;
        if (o) {
            setFirstName(o.first_name || '');
            setLastName(o.last_name || '');
            setRole(o.role || 'Owner');
            setEmail(o.email || '');
            setPhonePrimary(o.phone_primary || '');
            setPhoneSecondary(o.phone_secondary || '');
            setMailingAddress(o.mailing_address || '');
            setTimezone(o.timezone || 'Australia/Sydney (AEDT)');
            setPreferredLanguage(o.preferred_language || 'English');
            setBusinessName(o.business_name || '');
            setAbnTaxId(o.abn_tax_id || '');
            setBusinessType(o.business_type || 'Company (Pty Ltd)');
            setRegisteredAddress(o.registered_business_address || '');
            setGstRegistered(o.gst_registered ?? false);
            setHostDisplayName(o.host_display_name || '');
            setHostImageUrl(o.host_image_url || '');
            setHostQuote(o.host_quote || '');
            setHostBio(o.host_bio || '');
            setShowHostProfile(o.show_host_profile ?? true);
            setPreferredContactMethod(o.preferred_contact_method || 'Email');
            setBestTimeToCall(o.best_time_to_call || 'Afternoon (12pm-5pm)');
            setResponseTime(o.response_time || 'Within 24 hours');
            setBookingNotifications(o.booking_notifications ?? true);
            setMarketingEmails(o.marketing_emails ?? false);
            setPlatformUpdates(o.platform_updates ?? true);
            setRelationshipNotes(o.relationship_notes || '');
        }

        setTeamMembers(teamRes.data || []);
        setDocuments(docsRes.data || []);
        setLoading(false);
    }

    async function handleSave() {
        setSaving(true);
        setSaveStatus('idle');
        try {
            const payload = {
                venue_id: venue.id,
                venue_type: VENUE_TYPE,
                first_name: firstName,
                last_name: lastName,
                role,
                email,
                phone_primary: phonePrimary,
                phone_secondary: phoneSecondary,
                mailing_address: mailingAddress,
                timezone,
                preferred_language: preferredLanguage,
                business_name: businessName,
                abn_tax_id: abnTaxId,
                business_type: businessType,
                registered_business_address: registeredAddress,
                gst_registered: gstRegistered,
                host_display_name: hostDisplayName,
                host_image_url: hostImageUrl,
                host_quote: hostQuote,
                host_bio: hostBio,
                show_host_profile: showHostProfile,
                preferred_contact_method: preferredContactMethod,
                best_time_to_call: bestTimeToCall,
                response_time: responseTime,
                booking_notifications: bookingNotifications,
                marketing_emails: marketingEmails,
                platform_updates: platformUpdates,
                relationship_notes: relationshipNotes,
            };

            const { data: existing, error: fetchErr } = await supabase
                .from('venue_owner_manager')
                .select('id')
                .eq('venue_id', venue.id)
                .eq('venue_type', VENUE_TYPE)
                .maybeSingle();
            if (fetchErr) throw fetchErr;

            if (existing) {
                const { error } = await supabase.from('venue_owner_manager').update(payload).eq('id', existing.id);
                if (error) throw error;
            } else {
                const { error } = await supabase.from('venue_owner_manager').insert(payload);
                if (error) throw error;
            }

            setSaveStatus('saved');
        } catch (err) {
            console.error('Failed to save owner/manager:', err);
            setSaveStatus('error');
        } finally {
            setSaving(false);
        }
    }

    async function handleHostImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            const url = await uploadFile(file, 'photo');
            if (hostImageUrl) await deleteFile(hostImageUrl, 'photo');
            setHostImageUrl(url);
        } catch (err) {
            console.error('Failed to upload host image:', err);
        }
        e.target.value = '';
    }

    async function handleAddTeamMember() {
        if (!newMemberName.trim()) return;
        try {
            const { data, error } = await supabase.from('venue_team_members').insert({
                venue_id: venue.id,
                venue_type: VENUE_TYPE,
                name: newMemberName.trim(),
                role: newMemberRole.trim(),
                status: newMemberStatus,
                avatar_url: null,
            }).select().single();
            if (error) throw error;
            setTeamMembers(prev => [...prev, data]);
            setNewMemberName('');
            setNewMemberRole('');
            setNewMemberStatus('Active');
            setShowAddMember(false);
        } catch (err) {
            console.error('Failed to add team member:', err);
        }
    }

    async function handleDeleteTeamMember(id: string) {
        try {
            const { error } = await supabase.from('venue_team_members').delete().eq('id', id);
            if (error) throw error;
            setTeamMembers(prev => prev.filter(m => m.id !== id));
        } catch (err) {
            console.error('Failed to delete team member:', err);
        }
    }

    async function handleDocUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const files = e.target.files;
        if (!files || files.length === 0) return;
        for (const file of Array.from(files)) {
            try {
                const url = await uploadFile(file, 'photo');
                const { data, error } = await supabase.from('venue_documents').insert({
                    venue_id: venue.id,
                    venue_type: VENUE_TYPE,
                    file_url: url,
                    file_name: file.name,
                    file_size_bytes: file.size,
                    file_type: file.type,
                    doc_category: 'legal',
                }).select().single();
                if (error) throw error;
                setDocuments(prev => [...prev, data]);
            } catch (err) {
                console.error('Failed to upload document:', err);
            }
        }
        e.target.value = '';
    }

    async function handleDeleteDocument(doc: VenueDocument) {
        try {
            const { error } = await supabase.from('venue_documents').delete().eq('id', doc.id);
            if (error) throw error;
            await deleteFile(doc.file_url, 'photo');
            setDocuments(prev => prev.filter(d => d.id !== doc.id));
        } catch (err) {
            console.error('Failed to delete document:', err);
        }
    }

    function formatFileSize(bytes: number | null) {
        if (!bytes) return '';
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }

    const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || '?';

    if (loading) return <div style={{ padding: 40, textAlign: 'center', color: '#B8B8B8' }}>Loading...</div>;

    return (
        <div>
            {/* Floating Save Bar */}
            <div className="floating-save-bar">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    {saveStatus === 'saved' && <span style={{ color: '#4CAF50', fontSize: 13 }}>Saved successfully</span>}
                    {saveStatus === 'error' && <span style={{ color: '#f44336', fontSize: 13 }}>Failed to save</span>}
                </div>
                <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                    {saving ? 'Saving...' : 'Save Owner'}
                </button>
            </div>

            {/* Primary Contact Card */}
            <div className="contact-card">
                <div className="contact-avatar">{initials}</div>
                <div className="contact-details">
                    <div className="contact-name">{`${firstName} ${lastName}`.trim() || 'No name set'}</div>
                    <div className="contact-role">{role}</div>
                    <div className="contact-info-grid">
                        <div className="contact-info-item">
                            <div className="contact-info-icon"><Mail width={18} height={18} strokeWidth={1.5} /></div>
                            <div className="contact-info-text">
                                <span className="contact-info-label">Email</span>
                                <span className="contact-info-value">{email || '—'}</span>
                            </div>
                        </div>
                        <div className="contact-info-item">
                            <div className="contact-info-icon"><Phone width={18} height={18} strokeWidth={1.5} /></div>
                            <div className="contact-info-text">
                                <span className="contact-info-label">Phone</span>
                                <span className="contact-info-value">{phonePrimary || '—'}</span>
                            </div>
                        </div>
                        <div className="contact-info-item">
                            <div className="contact-info-icon"><MapPin width={18} height={18} strokeWidth={1.5} /></div>
                            <div className="contact-info-text">
                                <span className="contact-info-label">Address</span>
                                <span className="contact-info-value">{mailingAddress || '—'}</span>
                            </div>
                        </div>
                        <div className="contact-info-item">
                            <div className="contact-info-icon"><Calendar width={18} height={18} strokeWidth={1.5} /></div>
                            <div className="contact-info-text">
                                <span className="contact-info-label">Venue Added</span>
                                <span className="contact-info-value">{venue.date || '—'}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="contact-actions">
                    <span className="status-badge verified">
                        <Check width={12} height={12} strokeWidth={2} /> Verified
                    </span>
                    <span className="status-badge primary">Primary Contact</span>
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
                            <input type="text" className="form-input" value={firstName} onChange={e => setFirstName(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Last Name</label>
                            <input type="text" className="form-input" value={lastName} onChange={e => setLastName(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Role</label>
                            <div style={{ position: 'relative' }}>
                                <select className="form-input form-select" value={role} onChange={e => setRole(e.target.value)} style={{ width: '100%' }}>
                                    <option>Owner</option>
                                    <option>Manager</option>
                                    <option>Co-owner</option>
                                    <option>Property Manager</option>
                                    <option>Administrator</option>
                                </select>
                                <ChevronDown style={{ position: 'absolute', right: 12, top: 12, pointerEvents: 'none', color: 'var(--accent)' }} size={16} />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Email Address</label>
                            <input type="email" className="form-input" value={email} onChange={e => setEmail(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Phone (Primary)</label>
                            <input type="tel" className="form-input" value={phonePrimary} onChange={e => setPhonePrimary(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Phone (Secondary)</label>
                            <input type="tel" className="form-input" value={phoneSecondary} onChange={e => setPhoneSecondary(e.target.value)} />
                        </div>
                        <div className="form-group full-width">
                            <label className="form-label">Mailing Address</label>
                            <input type="text" className="form-input" value={mailingAddress} onChange={e => setMailingAddress(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Timezone</label>
                            <div style={{ position: 'relative' }}>
                                <select className="form-input form-select" value={timezone} onChange={e => setTimezone(e.target.value)} style={{ width: '100%' }}>
                                    <option>Australia/Sydney (AEDT)</option>
                                    <option>Australia/Brisbane (AEST)</option>
                                    <option>Australia/Melbourne (AEDT)</option>
                                    <option>Australia/Perth (AWST)</option>
                                </select>
                                <ChevronDown style={{ position: 'absolute', right: 12, top: 12, pointerEvents: 'none', color: 'var(--accent)' }} size={16} />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Preferred Language</label>
                            <div style={{ position: 'relative' }}>
                                <select className="form-input form-select" value={preferredLanguage} onChange={e => setPreferredLanguage(e.target.value)} style={{ width: '100%' }}>
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
                                <ChevronDown style={{ position: 'absolute', right: 12, top: 12, pointerEvents: 'none', color: 'var(--accent)' }} size={16} />
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
                            <input type="text" className="form-input" value={businessName} onChange={e => setBusinessName(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">ABN / Tax ID</label>
                            <input type="text" className="form-input" value={abnTaxId} onChange={e => setAbnTaxId(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Business Type</label>
                            <div style={{ position: 'relative' }}>
                                <select className="form-input form-select" value={businessType} onChange={e => setBusinessType(e.target.value)} style={{ width: '100%' }}>
                                    <option>Sole Trader</option>
                                    <option>Company (Pty Ltd)</option>
                                    <option>Partnership</option>
                                    <option>Trust</option>
                                </select>
                                <ChevronDown style={{ position: 'absolute', right: 12, top: 12, pointerEvents: 'none', color: 'var(--accent)' }} size={16} />
                            </div>
                        </div>
                        <div className="form-group full-width">
                            <label className="form-label">Registered Business Address</label>
                            <input type="text" className="form-input" value={registeredAddress} onChange={e => setRegisteredAddress(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">GST Registered</label>
                            <div className="toggle-container">
                                <div className={`toggle ${gstRegistered ? 'active' : ''}`} onClick={() => setGstRegistered(!gstRegistered)}>
                                    <div className="toggle-knob"></div>
                                </div>
                                <span className="toggle-label">{gstRegistered ? 'Yes' : 'No'}</span>
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
                    <button className="btn btn-secondary btn-small" onClick={() => setShowAddMember(true)}>
                        <Plus size={14} style={{ marginRight: 6 }} /> Add Team Member
                    </button>
                </div>
                <div className="form-section-body">
                    {showAddMember && (
                        <div className="form-grid three-col" style={{ marginBottom: 16, padding: 16, background: 'var(--secondary-bg)', borderRadius: 8 }}>
                            <div className="form-group">
                                <label className="form-label">Name</label>
                                <input type="text" className="form-input" value={newMemberName} onChange={e => setNewMemberName(e.target.value)} placeholder="Full name" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Role</label>
                                <input type="text" className="form-input" value={newMemberRole} onChange={e => setNewMemberRole(e.target.value)} placeholder="e.g. Property Manager" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Status</label>
                                <div style={{ position: 'relative' }}>
                                    <select className="form-input form-select" value={newMemberStatus} onChange={e => setNewMemberStatus(e.target.value)} style={{ width: '100%' }}>
                                        <option>Active</option>
                                        <option>Inactive</option>
                                    </select>
                                    <ChevronDown style={{ position: 'absolute', right: 12, top: 12, pointerEvents: 'none', color: 'var(--accent)' }} size={16} />
                                </div>
                            </div>
                            <div className="form-group full-width" style={{ display: 'flex', gap: 8 }}>
                                <button className="btn btn-primary" onClick={handleAddTeamMember}>Add Member</button>
                                <button className="btn btn-secondary" onClick={() => { setShowAddMember(false); setNewMemberName(''); setNewMemberRole(''); }}>Cancel</button>
                            </div>
                        </div>
                    )}
                    <div className="team-grid">
                        {teamMembers.length === 0 && !showAddMember && (
                            <p style={{ color: '#B8B8B8', fontSize: 13 }}>No team members added yet.</p>
                        )}
                        {teamMembers.map(member => {
                            const parts = member.name?.split(' ') || ['?'];
                            const av = `${parts[0]?.charAt(0) || ''}${parts[1]?.charAt(0) || ''}`.toUpperCase();
                            return (
                                <div key={member.id} className="team-card">
                                    <div className="team-avatar">{av}</div>
                                    <div className="team-info">
                                        <div className="team-name">{member.name}</div>
                                        <div className="team-role">{member.role} • {member.status}</div>
                                    </div>
                                    <div className="team-actions">
                                        <button className="btn btn-secondary btn-small" onClick={() => handleDeleteTeamMember(member.id)}>
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Host Public Profile */}
            <section className="form-section">
                <div className="form-section-header">
                    <div>
                        <h3 className="form-section-title">Host Public Profile</h3>
                        <p className="form-section-subtitle">Information displayed on the venue's public listing</p>
                    </div>
                </div>
                <div className="form-section-body">
                    <div className="form-grid">
                        <div className="form-group">
                            <label className="form-label">Host Display Name</label>
                            <input type="text" className="form-input" value={hostDisplayName} onChange={e => setHostDisplayName(e.target.value)} placeholder="e.g. Sarah & James, The Mitchell Family" />
                            <p className="form-hint" style={{ fontSize: 11, fontStyle: 'italic', color: 'var(--accent)', marginTop: 6 }}>How hosts are displayed on the public listing</p>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Host Image</label>
                            <div
                                style={{ width: 120, height: 120, border: '2px dashed rgba(184,184,184,0.4)', borderRadius: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--secondary-bg)', cursor: 'pointer', overflow: 'hidden', backgroundImage: hostImageUrl ? `url(${hostImageUrl})` : 'none', backgroundSize: 'cover', backgroundPosition: 'center' }}
                                onClick={() => hostImageInputRef.current?.click()}
                            >
                                {!hostImageUrl && (
                                    <>
                                        <Upload width={32} height={32} stroke="#B8B8B8" strokeWidth={1.5} />
                                        <span style={{ fontSize: 10, color: 'var(--accent)', marginTop: 4 }}>Upload</span>
                                    </>
                                )}
                            </div>
                            <input ref={hostImageInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleHostImageUpload} />
                            <p className="form-hint" style={{ fontSize: 11, fontStyle: 'italic', color: 'var(--accent)', marginTop: 6 }}>Square image, min 400×400px</p>
                        </div>
                        <div className="form-group full-width">
                            <label className="form-label">Host Quote</label>
                            <input type="text" className="form-input" value={hostQuote} onChange={e => setHostQuote(e.target.value)} placeholder="A short quote that captures your hosting philosophy..." />
                            <p className="form-hint" style={{ fontSize: 11, fontStyle: 'italic', color: 'var(--accent)', marginTop: 6 }}>Displayed in the Host Introduction section on the Overview tab</p>
                        </div>
                        <div className="form-group full-width">
                            <label className="form-label">Host Bio</label>
                            <textarea className="form-input form-textarea" rows={4} value={hostBio} onChange={e => setHostBio(e.target.value)} placeholder="Tell potential guests about yourselves..." />
                            <p className="form-hint" style={{ fontSize: 11, fontStyle: 'italic', color: 'var(--accent)', marginTop: 6 }}>2-3 paragraphs about the hosts. Displayed on the public listing.</p>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Show Host Profile on Listing</label>
                            <div className="toggle-container">
                                <div className={`toggle ${showHostProfile ? 'active' : ''}`} onClick={() => setShowHostProfile(!showHostProfile)}>
                                    <div className="toggle-knob"></div>
                                </div>
                                <span className="toggle-label">{showHostProfile ? 'Display host introduction on venue page' : 'Hidden'}</span>
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
                                <select className="form-input form-select" value={preferredContactMethod} onChange={e => setPreferredContactMethod(e.target.value)} style={{ width: '100%' }}>
                                    <option>Email</option>
                                    <option>Phone Call</option>
                                    <option>SMS / Text</option>
                                    <option>WhatsApp</option>
                                </select>
                                <ChevronDown style={{ position: 'absolute', right: 12, top: 12, pointerEvents: 'none', color: 'var(--accent)' }} size={16} />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Best Time to Call</label>
                            <div style={{ position: 'relative' }}>
                                <select className="form-input form-select" value={bestTimeToCall} onChange={e => setBestTimeToCall(e.target.value)} style={{ width: '100%' }}>
                                    <option>Morning (9am-12pm)</option>
                                    <option>Afternoon (12pm-5pm)</option>
                                    <option>Evening (5pm-8pm)</option>
                                    <option>Any time</option>
                                </select>
                                <ChevronDown style={{ position: 'absolute', right: 12, top: 12, pointerEvents: 'none', color: 'var(--accent)' }} size={16} />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Response Time</label>
                            <div style={{ position: 'relative' }}>
                                <select className="form-input form-select" value={responseTime} onChange={e => setResponseTime(e.target.value)} style={{ width: '100%' }}>
                                    <option>Within 1 hour</option>
                                    <option>Within 24 hours</option>
                                    <option>Within 48 hours</option>
                                </select>
                                <ChevronDown style={{ position: 'absolute', right: 12, top: 12, pointerEvents: 'none', color: 'var(--accent)' }} size={16} />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Booking Notifications</label>
                            <div className="toggle-container">
                                <div className={`toggle ${bookingNotifications ? 'active' : ''}`} onClick={() => setBookingNotifications(!bookingNotifications)}>
                                    <div className="toggle-knob"></div>
                                </div>
                                <span className="toggle-label">{bookingNotifications ? 'Email + SMS' : 'Email Only'}</span>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Marketing Emails</label>
                            <div className="toggle-container">
                                <div className={`toggle ${marketingEmails ? 'active' : ''}`} onClick={() => setMarketingEmails(!marketingEmails)}>
                                    <div className="toggle-knob"></div>
                                </div>
                                <span className="toggle-label">{marketingEmails ? 'Subscribed' : 'Unsubscribed'}</span>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Platform Updates</label>
                            <div className="toggle-container">
                                <div className={`toggle ${platformUpdates ? 'active' : ''}`} onClick={() => setPlatformUpdates(!platformUpdates)}>
                                    <div className="toggle-knob"></div>
                                </div>
                                <span className="toggle-label">{platformUpdates ? 'Subscribed' : 'Unsubscribed'}</span>
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
                    <button className="btn btn-secondary btn-small" onClick={() => docInputRef.current?.click()}>
                        <Upload size={14} style={{ marginRight: 6 }} /> Upload Document
                    </button>
                    <input ref={docInputRef} type="file" multiple style={{ display: 'none' }} onChange={handleDocUpload} />
                </div>
                <div className="form-section-body">
                    {documents.length === 0 ? (
                        <p style={{ color: '#B8B8B8', fontSize: 13 }}>No documents uploaded yet.</p>
                    ) : (
                        <div className="document-list">
                            {documents.map(doc => (
                                <div key={doc.id} className="document-item">
                                    <div className="document-icon">
                                        <FileText width={24} height={24} stroke="#313131" strokeWidth={1.5} />
                                    </div>
                                    <div className="document-info">
                                        <div className="document-name">{doc.file_name}</div>
                                        <div className="document-meta">
                                            {new Date(doc.created_at).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            {doc.file_type ? ` • ${doc.file_type.split('/')[1]?.toUpperCase() || doc.file_type}` : ''}
                                            {doc.file_size_bytes ? ` • ${formatFileSize(doc.file_size_bytes)}` : ''}
                                        </div>
                                    </div>
                                    <div className="document-actions">
                                        <a href={doc.file_url} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-small">View</a>
                                        <a href={doc.file_url} download={doc.file_name} className="btn btn-secondary btn-small">Download</a>
                                        <button className="btn btn-secondary btn-small" onClick={() => handleDeleteDocument(doc)}>
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Communication History — static display */}
            <section className="form-section">
                <div className="form-section-header">
                    <div>
                        <h3 className="form-section-title">Communication History</h3>
                        <p className="form-section-subtitle">Recent interactions with this venue owner</p>
                    </div>
                </div>
                <div className="form-section-body">
                    <p style={{ color: '#B8B8B8', fontSize: 13 }}>Communication history will be shown here once available.</p>
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
                            rows={6}
                            placeholder="Add notes about this relationship..."
                            value={relationshipNotes}
                            onChange={e => setRelationshipNotes(e.target.value)}
                        />
                    </div>
                </div>
            </section>
        </div>
    );
}
