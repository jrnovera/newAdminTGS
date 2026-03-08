import { useState, useEffect } from 'react';
import { Shield, Check, Plus, Trash2, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { Venue } from '../../context/VenueContext';

interface Props {
    venue: Venue;
    onUpdate?: (updates: Partial<Venue>) => void;
}

interface InternalNote {
    id: string;
    note_text: string;
    author: string;
    created_at: string;
}

const VENUE_TYPE = 'wellness';

function computeEffectiveRate(tier: string, discount: string): string {
    const tierRates: Record<string, number> = {
        'Essentials ($79/mo)': 79,
        'Professional ($199/mo)': 199,
        'Featured ($399/mo)': 399,
        'Premium ($599/mo)': 599,
    };
    const discountPct: Record<string, number> = {
        'None': 0,
        'Super Founder (60% off)': 60,
        'Founder (40% off)': 40,
        'Early Bird (25% off)': 25,
    };
    const base = tierRates[tier] || 0;
    const pct = discountPct[discount] || 0;
    const effective = base * (1 - pct / 100);
    return effective > 0 ? `$${effective.toFixed(2)}/mo` : '—';
}

function computeDaysToClose(firstContact: string, acquisitionDate: string): string {
    if (!firstContact || !acquisitionDate) return '—';
    const diff = Math.round(
        (new Date(acquisitionDate).getTime() - new Date(firstContact).getTime()) / (1000 * 60 * 60 * 24)
    );
    if (isNaN(diff)) return '—';
    return `${diff} day${diff !== 1 ? 's' : ''}`;
}

export default function WellnessInternalTab({ venue }: Props) {
    const [saving, setSaving] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const [recordId, setRecordId] = useState<string | null>(null);

    // Verification
    const [identityVerified, setIdentityVerified] = useState(false);
    const [identityVerifiedDate, setIdentityVerifiedDate] = useState('');
    const [ownershipVerified, setOwnershipVerified] = useState(false);
    const [insuranceVerified, setInsuranceVerified] = useState(false);
    const [insuranceDetails, setInsuranceDetails] = useState('');
    const [businessRegVerified, setBusinessRegVerified] = useState(false);
    const [siteVisitCompleted, setSiteVisitCompleted] = useState(false);
    const [photoVerificationDone, setPhotoVerificationDone] = useState(false);

    // Pipeline & Sales
    const [leadSource, setLeadSource] = useState('');
    const [leadOwner, setLeadOwner] = useState('');
    const [acquisitionDate, setAcquisitionDate] = useState('');
    const [pipelineStage, setPipelineStage] = useState('');
    const [firstContactDate, setFirstContactDate] = useState('');

    // Subscription & Financials
    const [subscriptionTier, setSubscriptionTier] = useState('');
    const [founderDiscount, setFounderDiscount] = useState('None');
    const [billingCycle, setBillingCycle] = useState('');
    const [subscriptionStartDate, setSubscriptionStartDate] = useState('');
    const [nextBillingDate, setNextBillingDate] = useState('');
    const [bookingCommission, setBookingCommission] = useState('5%');
    const [experienceCommission, setExperienceCommission] = useState('15%');
    const [stripeConnected, setStripeConnected] = useState(false);

    // Tags
    const [internalTags, setInternalTags] = useState<string[]>([]);
    const [priorityFlags, setPriorityFlags] = useState<string[]>([]);
    const [marketSegment, setMarketSegment] = useState('');
    const [venueTier, setVenueTier] = useState('');
    const [newTag, setNewTag] = useState('');
    const [newFlag, setNewFlag] = useState('');

    // Notes
    const [notes, setNotes] = useState<InternalNote[]>([]);
    const [newNoteText, setNewNoteText] = useState('');
    const [newNoteAuthor, setNewNoteAuthor] = useState('Admin');
    const [addingNote, setAddingNote] = useState(false);

    useEffect(() => {
        loadData();
    }, [venue.id]);

    async function loadData() {
        const [{ data: rec }, { data: notesData }] = await Promise.all([
            supabase.from('venue_internal').select('*').eq('venue_id', venue.id).eq('venue_type', VENUE_TYPE).maybeSingle(),
            supabase.from('venue_internal_notes').select('*').eq('venue_id', venue.id).eq('venue_type', VENUE_TYPE).order('created_at', { ascending: false }),
        ]);

        if (rec) {
            setRecordId(rec.id);
            setIdentityVerified(rec.identity_verified ?? false);
            setIdentityVerifiedDate(rec.identity_verified_date || '');
            setOwnershipVerified(rec.property_ownership_verified ?? false);
            setInsuranceVerified(rec.insurance_verified ?? false);
            setInsuranceDetails(rec.insurance_details || '');
            setBusinessRegVerified(rec.business_registration_verified ?? false);
            setSiteVisitCompleted(rec.site_visit_completed ?? false);
            setPhotoVerificationDone(rec.photo_verification_done ?? false);
            setLeadSource(rec.lead_source || '');
            setLeadOwner(rec.lead_owner || '');
            setAcquisitionDate(rec.acquisition_date || '');
            setPipelineStage(rec.pipeline_stage || '');
            setFirstContactDate(rec.first_contact_date || '');
            setSubscriptionTier(rec.subscription_tier || '');
            setFounderDiscount(rec.founder_discount || 'None');
            setBillingCycle(rec.billing_cycle || '');
            setSubscriptionStartDate(rec.subscription_start_date || '');
            setNextBillingDate(rec.next_billing_date || '');
            setBookingCommission(rec.booking_commission_rate || '5%');
            setExperienceCommission(rec.experience_commission_rate || '15%');
            setStripeConnected(rec.stripe_connect_status ?? false);
            setInternalTags(rec.internal_tags || []);
            setPriorityFlags(rec.priority_flags || []);
            setMarketSegment(rec.market_segment || '');
            setVenueTier(rec.venue_tier || '');
        }
        setNotes(notesData || []);
    }

    async function handleSave() {
        setSaving(true);
        setStatus(null);
        try {
            const payload = {
                venue_id: venue.id,
                venue_type: VENUE_TYPE,
                identity_verified: identityVerified,
                identity_verified_date: identityVerifiedDate || null,
                property_ownership_verified: ownershipVerified,
                insurance_verified: insuranceVerified,
                insurance_details: insuranceDetails || null,
                business_registration_verified: businessRegVerified,
                site_visit_completed: siteVisitCompleted,
                photo_verification_done: photoVerificationDone,
                lead_source: leadSource || null,
                lead_owner: leadOwner || null,
                acquisition_date: acquisitionDate || null,
                pipeline_stage: pipelineStage || null,
                first_contact_date: firstContactDate || null,
                subscription_tier: subscriptionTier || null,
                founder_discount: founderDiscount || null,
                billing_cycle: billingCycle || null,
                subscription_start_date: subscriptionStartDate || null,
                next_billing_date: nextBillingDate || null,
                booking_commission_rate: bookingCommission || null,
                experience_commission_rate: experienceCommission || null,
                stripe_connect_status: stripeConnected,
                internal_tags: internalTags,
                priority_flags: priorityFlags,
                market_segment: marketSegment || null,
                venue_tier: venueTier || null,
            };

            if (recordId) {
                const { error } = await supabase.from('venue_internal').update(payload).eq('id', recordId);
                if (error) throw error;
            } else {
                const { data, error } = await supabase.from('venue_internal').insert(payload).select('id').single();
                if (error) throw error;
                setRecordId(data.id);
            }

            setStatus({ type: 'success', message: 'Internal data saved successfully!' });
            setTimeout(() => setStatus(null), 4000);
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : String(err);
            setStatus({ type: 'error', message: 'Error saving: ' + msg });
        } finally {
            setSaving(false);
        }
    }

    async function handleAddNote() {
        if (!newNoteText.trim()) return;
        setAddingNote(true);
        try {
            const { data, error } = await supabase.from('venue_internal_notes').insert({
                venue_id: venue.id,
                venue_type: VENUE_TYPE,
                note_text: newNoteText.trim(),
                author: newNoteAuthor.trim() || 'Admin',
            }).select('*').single();
            if (error) throw error;
            setNotes(prev => [data, ...prev]);
            setNewNoteText('');
        } catch (err) {
            console.error('Add note error:', err);
        } finally {
            setAddingNote(false);
        }
    }

    async function handleDeleteNote(id: string) {
        try {
            const { error } = await supabase.from('venue_internal_notes').delete().eq('id', id);
            if (error) throw error;
            setNotes(prev => prev.filter(n => n.id !== id));
        } catch (err) {
            console.error('Delete note error:', err);
        }
    }

    function addTag() {
        const t = newTag.trim();
        if (t && !internalTags.includes(t)) setInternalTags(prev => [...prev, t]);
        setNewTag('');
    }

    function addFlag() {
        const f = newFlag.trim();
        if (f && !priorityFlags.includes(f)) setPriorityFlags(prev => [...prev, f]);
        setNewFlag('');
    }

    const verificationItems = [
        {
            label: 'Identity Verified',
            value: identityVerified,
            toggle: () => setIdentityVerified(v => !v),
            date: identityVerifiedDate,
            setDate: setIdentityVerifiedDate,
            hasDate: true,
        },
        {
            label: 'Property Ownership Verified',
            value: ownershipVerified,
            toggle: () => setOwnershipVerified(v => !v),
            hasDate: false,
        },
        {
            label: 'Insurance Verified',
            value: insuranceVerified,
            toggle: () => setInsuranceVerified(v => !v),
            extra: insuranceDetails,
            setExtra: setInsuranceDetails,
            extraPlaceholder: 'Insurance details (e.g. $20M coverage)',
            hasDate: false,
        },
        {
            label: 'Business Registration Verified',
            value: businessRegVerified,
            toggle: () => setBusinessRegVerified(v => !v),
            hasDate: false,
        },
        {
            label: 'Site Visit Completed',
            value: siteVisitCompleted,
            toggle: () => setSiteVisitCompleted(v => !v),
            hasDate: false,
        },
        {
            label: 'Photo Verification Done',
            value: photoVerificationDone,
            toggle: () => setPhotoVerificationDone(v => !v),
            hasDate: false,
        },
    ];

    return (
        <div>
            {/* Admin Banner */}
            <div className="admin-banner">
                <Shield className="admin-banner-icon" size={20} />
                <div className="admin-banner-text">
                    <strong>Internal Data</strong> — This information is only visible to TGS administrators and is not displayed to venue owners or public users.
                </div>
            </div>

            {/* Floating Save Bar */}
            <div className="floating-save-bar">
                {status && (
                    <span style={{ marginRight: 12, fontSize: 13, color: status.type === 'success' ? 'var(--success)' : 'var(--error)' }}>
                        {status.message}
                    </span>
                )}
                <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                    {saving ? 'Saving...' : 'Save Internal'}
                </button>
            </div>

            {/* Quality Scores — static computed indicators */}
            <div className="score-cards">
                {[
                    { label: 'Listing Quality', value: 92, cls: 'excellent' },
                    { label: 'Photo Quality', value: 85, cls: 'good' },
                    { label: 'Response Rate', value: 98, cls: 'excellent' },
                    { label: 'Completeness', value: 88, cls: 'good' },
                ].map(s => (
                    <div key={s.label} className="score-card">
                        <div className="score-card-label">{s.label}</div>
                        <div className={`score-card-value ${s.cls}`}>{s.value}{s.label.includes('Rate') || s.label.includes('Completeness') ? '%' : ''}</div>
                        <div className="score-bar">
                            <div className={`score-bar-fill ${s.cls}`} style={{ width: `${s.value}%` }}></div>
                        </div>
                    </div>
                ))}
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
                        {verificationItems.map((item, i) => (
                            <div key={i} className="checklist-item" style={{ alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
                                <div
                                    className={`checklist-icon ${item.value ? 'complete' : 'incomplete'}`}
                                    onClick={item.toggle}
                                    style={{ cursor: 'pointer', marginTop: 2, flexShrink: 0 }}
                                >
                                    {item.value && <Check size={14} />}
                                </div>
                                <span
                                    className={`checklist-label ${item.value ? 'complete' : ''}`}
                                    style={{ flex: 1, cursor: 'pointer' }}
                                    onClick={item.toggle}
                                >
                                    {item.label}
                                </span>
                                {(item as { extra?: string; setExtra?: (v: string) => void; extraPlaceholder?: string }).extra !== undefined && (
                                    <input
                                        type="text"
                                        className="form-input"
                                        style={{ flex: 2, minWidth: 200, fontSize: 12 }}
                                        placeholder={(item as { extraPlaceholder?: string }).extraPlaceholder || ''}
                                        value={(item as { extra?: string }).extra || ''}
                                        onChange={e => (item as { setExtra?: (v: string) => void }).setExtra?.(e.target.value)}
                                    />
                                )}
                                {item.hasDate && (
                                    <input
                                        type="date"
                                        className="form-input"
                                        style={{ width: 150, fontSize: 12 }}
                                        value={item.date || ''}
                                        onChange={e => item.setDate?.(e.target.value)}
                                    />
                                )}
                                <span className={`status-badge ${item.value ? 'verified' : 'pending'}`}>
                                    {item.value ? 'Verified' : 'Pending'}
                                </span>
                            </div>
                        ))}
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
                                <option value="">— Select —</option>
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
                                <option value="">— Select —</option>
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
                                <option value="">— Select —</option>
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
                            <input
                                type="text"
                                className="form-input"
                                value={computeDaysToClose(firstContactDate, acquisitionDate)}
                                readOnly
                                style={{ backgroundColor: 'var(--secondary-bg)' }}
                            />
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
                                <option value="">— Select —</option>
                                <option>Essentials ($79/mo)</option>
                                <option>Professional ($199/mo)</option>
                                <option>Featured ($399/mo)</option>
                                <option>Premium ($599/mo)</option>
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
                            <input
                                type="text"
                                className="form-input"
                                value={computeEffectiveRate(subscriptionTier, founderDiscount)}
                                readOnly
                                style={{ backgroundColor: 'var(--secondary-bg)', color: 'var(--success)', fontWeight: 600 }}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Billing Cycle</label>
                            <select className="form-input form-select" value={billingCycle} onChange={e => setBillingCycle(e.target.value)}>
                                <option value="">— Select —</option>
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
                            <div className="toggle-container" onClick={() => setStripeConnected(v => !v)} style={{ cursor: 'pointer' }}>
                                <div className={`toggle ${stripeConnected ? 'active' : ''}`}>
                                    <div className="toggle-knob"></div>
                                </div>
                                <span className="toggle-label">{stripeConnected ? 'Connected' : 'Not Connected'}</span>
                            </div>
                        </div>
                    </div>

                    <div style={{ marginTop: 24, paddingTop: 24, borderTop: '1px solid rgba(184, 184, 184, 0.15)' }}>
                        <label className="form-label" style={{ marginBottom: 12, display: 'block' }}>Revenue Summary (Lifetime)</label>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
                            {[
                                { label: 'Subscription Revenue', value: '$0.00' },
                                { label: 'Booking Commissions', value: '$0.00' },
                                { label: 'Experience Commissions', value: '$0.00' },
                            ].map(r => (
                                <div key={r.label} style={{ background: 'var(--secondary-bg)', padding: 16, borderRadius: 8 }}>
                                    <span className="data-label">{r.label}</span>
                                    <span className="data-value" style={{ fontSize: 20, fontFamily: "'Cormorant Garamond', serif", display: 'block', marginTop: 4 }}>{r.value}</span>
                                </div>
                            ))}
                            <div style={{ background: 'rgba(75, 124, 89, 0.1)', padding: 16, borderRadius: 8 }}>
                                <span className="data-label">Total Lifetime Value</span>
                                <span className="data-value" style={{ fontSize: 20, fontFamily: "'Cormorant Garamond', serif", color: 'var(--success)', display: 'block', marginTop: 4 }}>$0.00</span>
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
                            <div className="tag-list" style={{ flexWrap: 'wrap', marginBottom: 8 }}>
                                {internalTags.map(tag => (
                                    <span key={tag} className="tag feature" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                                        {tag}
                                        <X size={12} style={{ cursor: 'pointer' }} onClick={() => setInternalTags(prev => prev.filter(t => t !== tag))} />
                                    </span>
                                ))}
                            </div>
                            <div style={{ display: 'flex', gap: 8 }}>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="Add tag..."
                                    value={newTag}
                                    onChange={e => setNewTag(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
                                    style={{ flex: 1 }}
                                />
                                <button className="btn btn-secondary btn-small" onClick={addTag}>
                                    <Plus size={14} />
                                </button>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Priority Flags</label>
                            <div className="tag-list" style={{ flexWrap: 'wrap', marginBottom: 8 }}>
                                {priorityFlags.map(flag => (
                                    <span key={flag} className="tag priority" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                                        {flag}
                                        <X size={12} style={{ cursor: 'pointer' }} onClick={() => setPriorityFlags(prev => prev.filter(f => f !== flag))} />
                                    </span>
                                ))}
                            </div>
                            <div style={{ display: 'flex', gap: 8 }}>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="Add flag..."
                                    value={newFlag}
                                    onChange={e => setNewFlag(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addFlag())}
                                    style={{ flex: 1 }}
                                />
                                <button className="btn btn-secondary btn-small" onClick={addFlag}>
                                    <Plus size={14} />
                                </button>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Market Segment</label>
                            <select className="form-input form-select" value={marketSegment} onChange={e => setMarketSegment(e.target.value)}>
                                <option value="">— Select —</option>
                                <option>Budget</option>
                                <option>Mid-range</option>
                                <option>Premium</option>
                                <option>Ultra Luxury</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Venue Tier (Internal)</label>
                            <select className="form-input form-select" value={venueTier} onChange={e => setVenueTier(e.target.value)}>
                                <option value="">— Select —</option>
                                <option>Bronze</option>
                                <option>Silver</option>
                                <option>Gold</option>
                                <option>Platinum</option>
                            </select>
                        </div>
                    </div>
                </div>
            </section>

            {/* Activity Timeline — driven by saved dates */}
            <section className="form-section">
                <div className="form-section-header">
                    <div>
                        <h3 className="form-section-title">Activity Timeline</h3>
                        <p className="form-section-subtitle">Key milestones derived from saved dates</p>
                    </div>
                </div>
                <div className="form-section-body">
                    <div className="timeline">
                        {[
                            subscriptionStartDate && { title: 'Listing Published / Subscription Activated', desc: `Pipeline: ${pipelineStage || '—'}`, date: subscriptionStartDate },
                            acquisitionDate && { title: 'Acquisition / Sign-Up', desc: `Source: ${leadSource || '—'}`, date: acquisitionDate },
                            firstContactDate && { title: 'First Contact', desc: `Lead owner: ${leadOwner || '—'}`, date: firstContactDate },
                        ].filter(Boolean).map((item, i) => (
                            <div key={i} className="timeline-item">
                                <div className="timeline-dot active"></div>
                                <div className="timeline-content">
                                    <div>
                                        <div className="timeline-title">{(item as { title: string }).title}</div>
                                        <div className="timeline-desc">{(item as { desc: string }).desc}</div>
                                    </div>
                                    <div className="timeline-date">{(item as { date: string }).date}</div>
                                </div>
                            </div>
                        ))}
                        {!subscriptionStartDate && !acquisitionDate && !firstContactDate && (
                            <p style={{ fontSize: 13, color: 'var(--accent)', margin: 0 }}>Save pipeline dates above to populate the timeline.</p>
                        )}
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
                </div>
                <div className="form-section-body">
                    {notes.map(note => (
                        <div key={note.id} style={{ background: 'var(--secondary-bg)', padding: 16, borderRadius: 8, marginBottom: 12, position: 'relative' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                                <strong style={{ fontSize: 13 }}>{note.author}</strong>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <span style={{ fontSize: 11, color: 'var(--accent)' }}>
                                        {new Date(note.created_at).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </span>
                                    <button
                                        onClick={() => handleDeleteNote(note.id)}
                                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent)', padding: 0 }}
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                            <p style={{ fontSize: 13, color: 'var(--text)', margin: 0, whiteSpace: 'pre-wrap' }}>{note.note_text}</p>
                        </div>
                    ))}

                    <div style={{ background: 'var(--secondary-bg)', padding: 16, borderRadius: 8 }}>
                        <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 12, color: 'var(--text)' }}>Add New Note</div>
                        <div className="form-grid">
                            <div className="form-group">
                                <label className="form-label">Author</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={newNoteAuthor}
                                    onChange={e => setNewNoteAuthor(e.target.value)}
                                    placeholder="Your name"
                                />
                            </div>
                        </div>
                        <div className="form-group" style={{ marginTop: 8 }}>
                            <label className="form-label">Note</label>
                            <textarea
                                className="form-input form-textarea"
                                rows={4}
                                placeholder="Add internal notes about this venue..."
                                value={newNoteText}
                                onChange={e => setNewNoteText(e.target.value)}
                            />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
                            <button className="btn btn-primary btn-small" onClick={handleAddNote} disabled={addingNote || !newNoteText.trim()}>
                                <Plus size={14} /> {addingNote ? 'Adding...' : 'Add Note'}
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
