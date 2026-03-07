import { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, Save, Loader } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { Venue } from '../../context/VenueContext';

interface Props {
    venue: Venue;
}

interface WellnessPackage {
    id: number;
    type: string;
    name: string;
    active: boolean;
    description: string;
    includes: string;
    price: string;
    per: string;
}

interface PricingData {
    // Packages tab
    show_packages_tab: boolean;
    package_section_label: string;
    package_section_subtitle: string;
    package_intro: string;
    packages: WellnessPackage[];
    // Day pass
    day_pass_available: boolean;
    day_pass_price: string;
    day_pass_duration: string;
    day_pass_includes: string;
    // Memberships
    memberships_available: boolean;
    membership_details: string;
    // Vouchers
    vouchers_available: boolean;
    voucher_validity: string;
    // Booking rules
    advance_booking: string;
    min_notice: string;
    max_advance: string;
    group_bookings: boolean;
    max_group_size: string;
    couples_bookings: boolean;
    // Deposit & payment
    deposit_required: boolean;
    deposit_amount: string;
    payment_due: string;
    // Cancellation
    free_cancellation_period: string;
    late_fee: string;
    no_show_fee: string;
    cancellation_text: string;
    // Booking settings
    online_booking: boolean;
    booking_platform: string;
    booking_url: string;
    calendar_sync: boolean;
    auto_confirm: boolean;
    reminders: string;
    // Notes
    pricing_notes: string;
}

const DEFAULT_DATA: PricingData = {
    show_packages_tab: false,
    package_section_label: 'Curated Packages',
    package_section_subtitle: 'Complete wellness experiences designed for transformation',
    package_intro: '',
    packages: [],
    day_pass_available: false,
    day_pass_price: '',
    day_pass_duration: '',
    day_pass_includes: '',
    memberships_available: false,
    membership_details: '',
    vouchers_available: false,
    voucher_validity: '12 months',
    advance_booking: 'Recommended',
    min_notice: '24 hours',
    max_advance: '3 months',
    group_bookings: false,
    max_group_size: '',
    couples_bookings: false,
    deposit_required: false,
    deposit_amount: '',
    payment_due: 'At time of service',
    free_cancellation_period: '24 hours notice',
    late_fee: '50% of service',
    no_show_fee: '100% of service',
    cancellation_text: '',
    online_booking: false,
    booking_platform: 'TGS Booking',
    booking_url: '',
    calendar_sync: false,
    auto_confirm: false,
    reminders: 'None',
    pricing_notes: '',
};

let nextPkgId = 100;

export default function WellnessPricingTab({ venue }: Props) {
    const [data, setData] = useState<PricingData>(DEFAULT_DATA);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saveMsg, setSaveMsg] = useState('');
    const saveMsgTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    // ─── Fetch ───────────────────────────────────────────────────────────
    useEffect(() => {
        async function fetchData() {
            if (!venue.id) return;
            setLoading(true);

            const { data: row } = await supabase
                .from('venue_pricing')
                .select('*')
                .eq('venue_id', venue.id)
                .eq('venue_type', 'wellness')
                .maybeSingle();

            if (row) {
                let pkgs: WellnessPackage[] = [];
                if (Array.isArray(row.packages)) {
                    pkgs = row.packages as WellnessPackage[];
                }
                setData({
                    show_packages_tab: row.show_packages_tab ?? false,
                    package_section_label: row.package_section_label || 'Curated Packages',
                    package_section_subtitle: row.package_section_subtitle || 'Complete wellness experiences designed for transformation',
                    package_intro: row.package_intro || '',
                    packages: pkgs,
                    day_pass_available: row.day_pass_available ?? false,
                    day_pass_price: row.day_pass_price || '',
                    day_pass_duration: row.day_pass_duration || '',
                    day_pass_includes: row.day_pass_includes || '',
                    memberships_available: row.memberships_available ?? false,
                    membership_details: row.membership_details || '',
                    vouchers_available: row.vouchers_available ?? false,
                    voucher_validity: row.voucher_validity || '12 months',
                    advance_booking: row.advance_booking || 'Recommended',
                    min_notice: row.min_notice || '24 hours',
                    max_advance: row.max_advance || '3 months',
                    group_bookings: row.group_bookings ?? false,
                    max_group_size: row.max_group_size || '',
                    couples_bookings: row.couples_bookings ?? false,
                    deposit_required: row.deposit_required ?? false,
                    deposit_amount: row.deposit_amount || '',
                    payment_due: row.payment_due || 'At time of service',
                    free_cancellation_period: row.free_cancellation_period || '24 hours notice',
                    late_fee: row.late_fee || '50% of service',
                    no_show_fee: row.no_show_fee || '100% of service',
                    cancellation_text: row.cancellation_text || '',
                    online_booking: row.online_booking ?? false,
                    booking_platform: row.booking_platform || 'TGS Booking',
                    booking_url: row.booking_url || '',
                    calendar_sync: row.calendar_sync ?? false,
                    auto_confirm: row.auto_confirm ?? false,
                    reminders: row.reminders || 'None',
                    pricing_notes: row.pricing_notes || '',
                });
            }

            setLoading(false);
        }
        fetchData();
    }, [venue.id]);

    // ─── Field update helper ──────────────────────────────────────────────
    function set<K extends keyof PricingData>(key: K, value: PricingData[K]) {
        setData(prev => ({ ...prev, [key]: value }));
    }

    // ─── Package helpers ──────────────────────────────────────────────────
    function addPackage() {
        const newPkg: WellnessPackage = {
            id: nextPkgId++,
            type: 'Day Package',
            name: 'New Package',
            active: true,
            description: '',
            includes: '',
            price: '',
            per: 'person',
        };
        set('packages', [...data.packages, newPkg]);
    }

    function updatePackage(id: number, field: keyof WellnessPackage, value: string | boolean) {
        set('packages', data.packages.map(p => p.id === id ? { ...p, [field]: value } : p));
    }

    function removePackage(id: number) {
        set('packages', data.packages.filter(p => p.id !== id));
    }

    // ─── Save ─────────────────────────────────────────────────────────────
    async function handleSave() {
        setSaving(true);
        try {
            const payload: Record<string, unknown> = {
                venue_id: venue.id,
                venue_type: 'wellness',
                show_packages_tab: data.show_packages_tab,
                package_section_label: data.package_section_label,
                package_section_subtitle: data.package_section_subtitle,
                package_intro: data.package_intro,
                packages: data.packages,
                day_pass_available: data.day_pass_available,
                day_pass_price: data.day_pass_price,
                day_pass_duration: data.day_pass_duration,
                day_pass_includes: data.day_pass_includes,
                memberships_available: data.memberships_available,
                membership_details: data.membership_details,
                vouchers_available: data.vouchers_available,
                voucher_validity: data.voucher_validity,
                advance_booking: data.advance_booking,
                min_notice: data.min_notice,
                max_advance: data.max_advance,
                group_bookings: data.group_bookings,
                max_group_size: data.max_group_size,
                couples_bookings: data.couples_bookings,
                deposit_required: data.deposit_required,
                deposit_amount: data.deposit_amount,
                payment_due: data.payment_due,
                free_cancellation_period: data.free_cancellation_period,
                late_fee: data.late_fee,
                no_show_fee: data.no_show_fee,
                cancellation_text: data.cancellation_text,
                online_booking: data.online_booking,
                booking_platform: data.booking_platform,
                booking_url: data.booking_url,
                calendar_sync: data.calendar_sync,
                auto_confirm: data.auto_confirm,
                reminders: data.reminders,
                pricing_notes: data.pricing_notes,
            };

            const { data: existing, error: selErr } = await supabase
                .from('venue_pricing')
                .select('id')
                .eq('venue_id', venue.id)
                .eq('venue_type', 'wellness')
                .maybeSingle();
            if (selErr) throw selErr;

            if (existing?.id) {
                const { error: updErr } = await supabase
                    .from('venue_pricing').update(payload).eq('id', existing.id);
                if (updErr) throw updErr;
            } else {
                const { error: insErr } = await supabase
                    .from('venue_pricing').insert(payload);
                if (insErr) throw insErr;
            }

            if (saveMsgTimer.current) clearTimeout(saveMsgTimer.current);
            setSaveMsg('Pricing saved successfully');
            saveMsgTimer.current = setTimeout(() => setSaveMsg(''), 5000);
        } catch (err: any) {
            console.error('Save error:', err);
            setSaveMsg('Error: ' + (err.message || 'Failed to save'));
            if (saveMsgTimer.current) clearTimeout(saveMsgTimer.current);
            saveMsgTimer.current = setTimeout(() => setSaveMsg(''), 8000);
        } finally {
            setSaving(false);
        }
    }

    // ─── Render ───────────────────────────────────────────────────────────
    if (loading) {
        return (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--accent)', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                <Loader size={18} className="spin" />
                Loading pricing…
            </div>
        );
    }

    return (
        <div className="content-area">

            {/* Sticky Save */}
            <div style={{ position: 'sticky', top: 12, zIndex: 100, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                {saveMsg && (
                    <span style={{ fontSize: 13, color: saveMsg.startsWith('Error') ? 'var(--danger, #e53e3e)' : 'var(--success)', fontWeight: 500 }}>
                        {saveMsg}
                    </span>
                )}
                <button
                    className="btn btn-primary"
                    onClick={handleSave}
                    disabled={saving}
                    style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}
                >
                    {saving ? <Loader size={15} className="spin" style={{ marginRight: 6 }} /> : <Save size={15} style={{ marginRight: 6 }} />}
                    {saving ? 'Saving…' : 'Save Pricing'}
                </button>
            </div>

            {/* ── Packages Tab ─────────────────────────────────────────── */}
            <section className="form-section">
                <div className="form-section-header">
                    <div>
                        <h3 className="form-section-title">Packages Tab</h3>
                        <p className="form-section-subtitle">Enable to show a dedicated Packages tab on your public listing</p>
                    </div>
                </div>
                <div className="form-section-body">
                    <div className="form-grid">
                        <div className="form-group">
                            <label className="form-label">Show Packages Tab</label>
                            <div className="toggle-container" onClick={() => set('show_packages_tab', !data.show_packages_tab)}>
                                <div className={`toggle ${data.show_packages_tab ? 'active' : ''}`}>
                                    <div className="toggle-knob" />
                                </div>
                                <span className="toggle-label">{data.show_packages_tab ? 'Yes — display Packages tab' : 'No — hidden'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Packages Tab Content ─────────────────────────────────── */}
            <section className="form-section">
                <div className="form-section-header">
                    <div>
                        <h3 className="form-section-title">Packages Tab Content</h3>
                        <p className="form-section-subtitle">Header content for the Packages tab on your public listing</p>
                    </div>
                </div>
                <div className="form-section-body">
                    <div className="form-grid">
                        <div className="form-group">
                            <label className="form-label">Section Label</label>
                            <input
                                type="text"
                                className="form-input"
                                value={data.package_section_label}
                                onChange={e => set('package_section_label', e.target.value)}
                                placeholder="e.g. Curated Packages"
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Section Subtitle</label>
                            <input
                                type="text"
                                className="form-input"
                                value={data.package_section_subtitle}
                                onChange={e => set('package_section_subtitle', e.target.value)}
                                placeholder="Brief tagline…"
                            />
                        </div>
                        <div className="form-group full-width">
                            <label className="form-label">Intro Paragraph</label>
                            <textarea
                                className="form-input form-textarea"
                                rows={2}
                                value={data.package_intro}
                                onChange={e => set('package_intro', e.target.value)}
                                placeholder="Describe your packages offering…"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Wellness Packages ────────────────────────────────────── */}
            <section className="form-section">
                <div className="form-section-header">
                    <div>
                        <h3 className="form-section-title">Wellness Packages</h3>
                        <p className="form-section-subtitle">Curated experiences combining multiple services</p>
                    </div>
                    <button className="btn btn-secondary btn-small" onClick={addPackage}>
                        <Plus size={14} style={{ marginRight: 4 }} />
                        Add Package
                    </button>
                </div>
                <div className="form-section-body">
                    {data.packages.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--accent)', fontSize: 13, border: '1px dashed rgba(184,184,184,0.3)', borderRadius: 8 }}>
                            No packages yet. Click <strong>Add Package</strong> to create your first wellness package.
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
                            {data.packages.map(pkg => (
                                <div key={pkg.id} style={{ background: 'var(--secondary-bg)', borderRadius: 8, padding: 16, border: '1px solid rgba(184,184,184,0.2)', position: 'relative' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                                        <div style={{ flex: 1, marginRight: 8 }}>
                                            <select
                                                className="form-select form-input"
                                                style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.5px', padding: '2px 6px', marginBottom: 4, color: 'var(--accent)' }}
                                                value={pkg.type}
                                                onChange={e => updatePackage(pkg.id, 'type', e.target.value)}
                                            >
                                                <option value="Day Package">Day Package</option>
                                                <option value="Overnight Package">Overnight Package</option>
                                                <option value="Weekend Package">Weekend Package</option>
                                                <option value="Retreat Package">Retreat Package</option>
                                                <option value="Membership Package">Membership Package</option>
                                            </select>
                                            <input
                                                type="text"
                                                className="form-input"
                                                style={{ fontSize: 14, fontWeight: 500, padding: '4px 8px' }}
                                                value={pkg.name}
                                                onChange={e => updatePackage(pkg.id, 'name', e.target.value)}
                                                placeholder="Package name"
                                            />
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <div className="toggle-container" onClick={() => updatePackage(pkg.id, 'active', !pkg.active)}>
                                                <div className={`toggle ${pkg.active ? 'active' : ''}`} style={{ width: 32, height: 18 }}>
                                                    <div className="toggle-knob" style={{ width: 14, height: 14 }} />
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => removePackage(pkg.id)}
                                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent)', padding: 2, display: 'flex', alignItems: 'center' }}
                                                title="Remove package"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                    <textarea
                                        className="form-input form-textarea"
                                        style={{ fontSize: 11, padding: '6px 8px', minHeight: 44, resize: 'none', marginBottom: 8 }}
                                        value={pkg.description}
                                        onChange={e => updatePackage(pkg.id, 'description', e.target.value)}
                                        placeholder="Package description…"
                                    />
                                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
                                        <span style={{ fontSize: 10, color: 'var(--accent)', whiteSpace: 'nowrap' }}>Includes:</span>
                                        <input
                                            type="text"
                                            className="form-input"
                                            style={{ flex: 1, fontSize: 10, padding: '4px 6px' }}
                                            value={pkg.includes}
                                            onChange={e => updatePackage(pkg.id, 'includes', e.target.value)}
                                            placeholder="e.g. 60min massage, thermal circuit, lunch"
                                        />
                                    </div>
                                    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}>
                                        <div>
                                            <span style={{ fontSize: 10, color: 'var(--accent)', display: 'block', marginBottom: 2 }}>Price</span>
                                            <input
                                                type="text"
                                                className="form-input"
                                                style={{ width: 90, fontSize: 12, padding: '4px 6px' }}
                                                value={pkg.price}
                                                onChange={e => updatePackage(pkg.id, 'price', e.target.value)}
                                                placeholder="$299"
                                            />
                                        </div>
                                        <div>
                                            <span style={{ fontSize: 10, color: 'var(--accent)', display: 'block', marginBottom: 2 }}>Per</span>
                                            <select
                                                className="form-select form-input"
                                                style={{ fontSize: 11, padding: '4px 6px' }}
                                                value={pkg.per}
                                                onChange={e => updatePackage(pkg.id, 'per', e.target.value)}
                                            >
                                                <option value="person">person</option>
                                                <option value="couple">couple</option>
                                                <option value="package">package</option>
                                                <option value="group">group</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    <button
                        onClick={addPackage}
                        style={{ width: '100%', padding: '12px', border: '1px dashed rgba(184,184,184,0.4)', borderRadius: 8, background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, color: 'var(--accent)', fontSize: 12, marginTop: 12 }}
                    >
                        <Plus size={14} />
                        Add Package
                    </button>
                </div>
            </section>

            {/* ── Day Pass & Facility Access ───────────────────────────── */}
            <section className="form-section">
                <div className="form-section-header">
                    <div>
                        <h3 className="form-section-title">Day Pass & Facility Access</h3>
                        <p className="form-section-subtitle">Standalone facility access pricing (not treatment-based)</p>
                    </div>
                </div>
                <div className="form-section-body">
                    <div className="form-grid">
                        <div className="form-group">
                            <label className="form-label">Day Pass Available</label>
                            <div className="toggle-container" onClick={() => set('day_pass_available', !data.day_pass_available)}>
                                <div className={`toggle ${data.day_pass_available ? 'active' : ''}`}>
                                    <div className="toggle-knob" />
                                </div>
                                <span className="toggle-label">{data.day_pass_available ? 'Yes' : 'No'}</span>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Day Pass Price</label>
                            <input
                                type="text"
                                className="form-input"
                                value={data.day_pass_price}
                                onChange={e => set('day_pass_price', e.target.value)}
                                placeholder="e.g. $89"
                                disabled={!data.day_pass_available}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Day Pass Duration</label>
                            <input
                                type="text"
                                className="form-input"
                                value={data.day_pass_duration}
                                onChange={e => set('day_pass_duration', e.target.value)}
                                placeholder="e.g. 2 hours, Full day"
                                disabled={!data.day_pass_available}
                            />
                        </div>
                        <div className="form-group full-width">
                            <label className="form-label">Day Pass Includes</label>
                            <input
                                type="text"
                                className="form-input"
                                value={data.day_pass_includes}
                                onChange={e => set('day_pass_includes', e.target.value)}
                                placeholder="What's included in the day pass…"
                                disabled={!data.day_pass_available}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Memberships ──────────────────────────────────────────── */}
            <section className="form-section">
                <div className="form-section-header">
                    <div>
                        <h3 className="form-section-title">Memberships</h3>
                        <p className="form-section-subtitle">Recurring membership options for regular guests</p>
                    </div>
                </div>
                <div className="form-section-body">
                    <div className="form-grid">
                        <div className="form-group">
                            <label className="form-label">Memberships Available</label>
                            <div className="toggle-container" onClick={() => set('memberships_available', !data.memberships_available)}>
                                <div className={`toggle ${data.memberships_available ? 'active' : ''}`}>
                                    <div className="toggle-knob" />
                                </div>
                                <span className="toggle-label">{data.memberships_available ? 'Yes' : 'No'}</span>
                            </div>
                        </div>
                        <div className="form-group full-width">
                            <label className="form-label">Membership Details</label>
                            <textarea
                                className="form-input form-textarea"
                                rows={3}
                                value={data.membership_details}
                                onChange={e => set('membership_details', e.target.value)}
                                placeholder="Describe membership tiers, pricing and benefits…"
                                disabled={!data.memberships_available}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Gift Vouchers ────────────────────────────────────────── */}
            <section className="form-section">
                <div className="form-section-header">
                    <div>
                        <h3 className="form-section-title">Gift Vouchers</h3>
                        <p className="form-section-subtitle">Gift card and voucher options</p>
                    </div>
                </div>
                <div className="form-section-body">
                    <div className="form-grid">
                        <div className="form-group">
                            <label className="form-label">Gift Vouchers Available</label>
                            <div className="toggle-container" onClick={() => set('vouchers_available', !data.vouchers_available)}>
                                <div className={`toggle ${data.vouchers_available ? 'active' : ''}`}>
                                    <div className="toggle-knob" />
                                </div>
                                <span className="toggle-label">{data.vouchers_available ? 'Yes' : 'No'}</span>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Voucher Validity</label>
                            <select
                                className="form-select form-input"
                                value={data.voucher_validity}
                                onChange={e => set('voucher_validity', e.target.value)}
                                disabled={!data.vouchers_available}
                            >
                                <option value="6 months">6 months</option>
                                <option value="12 months">12 months</option>
                                <option value="24 months">24 months</option>
                                <option value="No expiry">No expiry</option>
                            </select>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Booking Rules ────────────────────────────────────────── */}
            <section className="form-section">
                <div className="form-section-header">
                    <div>
                        <h3 className="form-section-title">Booking Rules</h3>
                        <p className="form-section-subtitle">Service booking requirements and group policies</p>
                    </div>
                </div>
                <div className="form-section-body">
                    <div className="form-grid three-col">
                        <div className="form-group">
                            <label className="form-label">Advance Booking Required</label>
                            <select className="form-select form-input" value={data.advance_booking} onChange={e => set('advance_booking', e.target.value)}>
                                <option value="No - Walk-ins welcome">No — Walk-ins welcome</option>
                                <option value="Recommended">Recommended</option>
                                <option value="Required">Required</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Minimum Notice</label>
                            <select className="form-select form-input" value={data.min_notice} onChange={e => set('min_notice', e.target.value)}>
                                <option value="None">None</option>
                                <option value="2 hours">2 hours</option>
                                <option value="24 hours">24 hours</option>
                                <option value="48 hours">48 hours</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Maximum Advance Booking</label>
                            <select className="form-select form-input" value={data.max_advance} onChange={e => set('max_advance', e.target.value)}>
                                <option value="1 month">1 month</option>
                                <option value="3 months">3 months</option>
                                <option value="6 months">6 months</option>
                                <option value="12 months">12 months</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Group Bookings</label>
                            <div className="toggle-container" onClick={() => set('group_bookings', !data.group_bookings)}>
                                <div className={`toggle ${data.group_bookings ? 'active' : ''}`}>
                                    <div className="toggle-knob" />
                                </div>
                                <span className="toggle-label">{data.group_bookings ? 'Accepted' : 'Not accepted'}</span>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Max Group Size</label>
                            <input
                                type="text"
                                className="form-input"
                                value={data.max_group_size}
                                onChange={e => set('max_group_size', e.target.value)}
                                placeholder="e.g. 8"
                                disabled={!data.group_bookings}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Couples Bookings</label>
                            <div className="toggle-container" onClick={() => set('couples_bookings', !data.couples_bookings)}>
                                <div className={`toggle ${data.couples_bookings ? 'active' : ''}`}>
                                    <div className="toggle-knob" />
                                </div>
                                <span className="toggle-label">{data.couples_bookings ? 'Available' : 'Not available'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Deposit & Payment ────────────────────────────────────── */}
            <section className="form-section">
                <div className="form-section-header">
                    <div>
                        <h3 className="form-section-title">Deposit & Payment</h3>
                        <p className="form-section-subtitle">Payment requirements for bookings</p>
                    </div>
                </div>
                <div className="form-section-body">
                    <div className="form-grid three-col">
                        <div className="form-group">
                            <label className="form-label">Deposit Required</label>
                            <div className="toggle-container" onClick={() => set('deposit_required', !data.deposit_required)}>
                                <div className={`toggle ${data.deposit_required ? 'active' : ''}`}>
                                    <div className="toggle-knob" />
                                </div>
                                <span className="toggle-label">{data.deposit_required ? 'Yes' : 'No'}</span>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Deposit Amount</label>
                            <input
                                type="text"
                                className="form-input"
                                value={data.deposit_amount}
                                onChange={e => set('deposit_amount', e.target.value)}
                                placeholder="e.g. $50 or 25%"
                                disabled={!data.deposit_required}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Payment Due</label>
                            <select className="form-select form-input" value={data.payment_due} onChange={e => set('payment_due', e.target.value)}>
                                <option value="At time of service">At time of service</option>
                                <option value="At booking">At booking</option>
                                <option value="24 hours before">24 hours before</option>
                            </select>
                        </div>
                        <div className="form-group full-width">
                            <label className="form-label">Accepted Payment Methods</label>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 4 }}>
                                {['Credit Card', 'Debit Card', 'EFTPOS', 'Cash', 'Bank Transfer'].map(m => (
                                    <span key={m} style={{ display: 'inline-flex', alignItems: 'center', padding: '4px 10px', borderRadius: 20, fontSize: 12, background: 'var(--secondary-bg)', border: '1px solid rgba(184,184,184,0.3)', color: 'var(--text)' }}>{m}</span>
                                ))}
                            </div>
                            <p className="form-hint">Payment methods are managed at the business level. Contact support to update.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Cancellation Policy ──────────────────────────────────── */}
            <section className="form-section">
                <div className="form-section-header">
                    <div>
                        <h3 className="form-section-title">Cancellation Policy</h3>
                        <p className="form-section-subtitle">Service cancellation terms displayed to guests</p>
                    </div>
                </div>
                <div className="form-section-body">
                    <div className="form-grid">
                        <div className="form-group">
                            <label className="form-label">Free Cancellation Window</label>
                            <select className="form-select form-input" value={data.free_cancellation_period} onChange={e => set('free_cancellation_period', e.target.value)}>
                                <option value="No free cancellation">No free cancellation</option>
                                <option value="2 hours notice">2 hours notice</option>
                                <option value="24 hours notice">24 hours notice</option>
                                <option value="48 hours notice">48 hours notice</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Late Cancellation Fee</label>
                            <select className="form-select form-input" value={data.late_fee} onChange={e => set('late_fee', e.target.value)}>
                                <option value="No fee">No fee</option>
                                <option value="50% of service">50% of service</option>
                                <option value="100% of service">100% of service</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">No-Show Fee</label>
                            <select className="form-select form-input" value={data.no_show_fee} onChange={e => set('no_show_fee', e.target.value)}>
                                <option value="No fee">No fee</option>
                                <option value="50% of service">50% of service</option>
                                <option value="100% of service">100% of service</option>
                            </select>
                        </div>
                        <div className="form-group full-width">
                            <label className="form-label">Cancellation Policy Text (displayed to guests)</label>
                            <textarea
                                className="form-input form-textarea"
                                rows={2}
                                value={data.cancellation_text}
                                onChange={e => set('cancellation_text', e.target.value)}
                                placeholder="Describe your cancellation policy in plain language…"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Booking Settings ─────────────────────────────────────── */}
            <section className="form-section">
                <div className="form-section-header">
                    <div>
                        <h3 className="form-section-title">Booking Settings</h3>
                        <p className="form-section-subtitle">Online booking configuration and automation</p>
                    </div>
                </div>
                <div className="form-section-body">
                    <div className="form-grid three-col">
                        <div className="form-group">
                            <label className="form-label">Online Booking Enabled</label>
                            <div className="toggle-container" onClick={() => set('online_booking', !data.online_booking)}>
                                <div className={`toggle ${data.online_booking ? 'active' : ''}`}>
                                    <div className="toggle-knob" />
                                </div>
                                <span className="toggle-label">{data.online_booking ? 'Yes' : 'No'}</span>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Booking Platform</label>
                            <select className="form-select form-input" value={data.booking_platform} onChange={e => set('booking_platform', e.target.value)}>
                                <option value="TGS Booking">TGS Booking</option>
                                <option value="External">External (link out)</option>
                                <option value="Phone only">Phone only</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">External Booking URL</label>
                            <input
                                type="url"
                                className="form-input"
                                value={data.booking_url}
                                onChange={e => set('booking_url', e.target.value)}
                                placeholder="https://…"
                                disabled={data.booking_platform !== 'External'}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Calendar Sync</label>
                            <div className="toggle-container" onClick={() => set('calendar_sync', !data.calendar_sync)}>
                                <div className={`toggle ${data.calendar_sync ? 'active' : ''}`}>
                                    <div className="toggle-knob" />
                                </div>
                                <span className="toggle-label">{data.calendar_sync ? 'Connected' : 'Not connected'}</span>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Auto-confirm Bookings</label>
                            <div className="toggle-container" onClick={() => set('auto_confirm', !data.auto_confirm)}>
                                <div className={`toggle ${data.auto_confirm ? 'active' : ''}`}>
                                    <div className="toggle-knob" />
                                </div>
                                <span className="toggle-label">{data.auto_confirm ? 'Yes' : 'No'}</span>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Send Reminders</label>
                            <div className="toggle-container" onClick={() => set('reminders', data.reminders === '24hr before' ? 'None' : '24hr before')}>
                                <div className={`toggle ${data.reminders === '24hr before' ? 'active' : ''}`}>
                                    <div className="toggle-knob" />
                                </div>
                                <span className="toggle-label">{data.reminders === '24hr before' ? '24hr before' : 'None'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Pricing Notes ────────────────────────────────────────── */}
            <section className="form-section">
                <div className="form-section-header">
                    <h3 className="form-section-title">Pricing Notes</h3>
                </div>
                <div className="form-section-body">
                    <div className="form-group">
                        <label className="form-label">Internal Notes (not visible to guests)</label>
                        <textarea
                            className="form-input form-textarea"
                            rows={3}
                            value={data.pricing_notes}
                            onChange={e => set('pricing_notes', e.target.value)}
                            placeholder="Any additional pricing notes for internal reference…"
                        />
                    </div>
                </div>
            </section>

        </div>
    );
}
