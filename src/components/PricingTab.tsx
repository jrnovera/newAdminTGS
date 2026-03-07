import { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, UploadCloud, Save, Loader } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { uploadFile } from '../lib/storage';
import type { Venue } from '../context/VenueContext';

interface PricingTabProps {
    venue: Venue;
}

interface SeasonRow {
    id?: string;
    season_name: string;
    date_range: string;
    season_type: string;
    nightly_rate: number;
    minimum_stay: string;
}

interface PricingData {
    pricing_hero_image: string;
    section_label: string;
    section_title: string;
    section_subtitle: string;
    currency: string;
    pricing_model: string;
    price_range_category: string;
    base_nightly_rate: number;
    weekend_rate: number;
    weekly_rate: number;
    cleaning_fee: number;
    group_discounts_available: boolean;
    group_discount_percentage: number;
    min_nights_for_discount: number;
    group_discount_details: string;
    holiday_surcharge_percentage: number;
    min_stay_default: number;
    min_stay_weekends: number;
    max_stay: number;
    advance_booking_required: string;
    booking_window_opens: string;
    checkin_day_restrictions: string;
    checkin_time: string;
    checkout_time: string;
    booking_deposit: string;
    deposit_due: string;
    balance_due: string;
    security_bond: number;
    bond_collection_method: string;
    accepted_payment_methods: string[];
    cancellation_policy_type: string;
    cancellation_grace_period: string;
    refund_policy_details: string;
    pricing_notes: string;
}

const DEFAULT_DATA: PricingData = {
    pricing_hero_image: '',
    section_label: 'Booking & Terms',
    section_title: 'Plan Your Retreat',
    section_subtitle: '',
    currency: 'AUD',
    pricing_model: '',
    price_range_category: '',
    base_nightly_rate: 0,
    weekend_rate: 0,
    weekly_rate: 0,
    cleaning_fee: 0,
    group_discounts_available: false,
    group_discount_percentage: 0,
    min_nights_for_discount: 3,
    group_discount_details: '',
    holiday_surcharge_percentage: 0,
    min_stay_default: 1,
    min_stay_weekends: 1,
    max_stay: 0,
    advance_booking_required: '',
    booking_window_opens: '',
    checkin_day_restrictions: '',
    checkin_time: '',
    checkout_time: '',
    booking_deposit: '',
    deposit_due: '',
    balance_due: '',
    security_bond: 0,
    bond_collection_method: '',
    accepted_payment_methods: [],
    cancellation_policy_type: '',
    cancellation_grace_period: '',
    refund_policy_details: '',
    pricing_notes: '',
};

const PAYMENT_METHODS = ['Credit Card', 'Debit Card', 'Bank Transfer', 'Cash', 'EFTPOS'];

export default function PricingTab({ venue }: PricingTabProps) {
    const [data, setData] = useState<PricingData>(DEFAULT_DATA);
    const [seasons, setSeasons] = useState<SeasonRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saveMsg, setSaveMsg] = useState('');
    const [uploadingHero, setUploadingHero] = useState(false);
    const heroInputRef = useRef<HTMLInputElement>(null);
    const saveMsgTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    // ─── Fetch ───────────────────────────────────────────────────────────
    useEffect(() => {
        async function fetchData() {
            if (!venue.id) return;
            setLoading(true);

            const [pricingRes, seasonRes] = await Promise.all([
                supabase
                    .from('venue_pricing')
                    .select('*')
                    .eq('venue_id', venue.id)
                    .eq('venue_type', 'retreat')
                    .maybeSingle(),
                supabase
                    .from('venue_seasonal_pricing')
                    .select('*')
                    .eq('venue_id', venue.id)
                    .eq('venue_type', 'retreat')
                    .order('created_at', { ascending: true }),
            ]);

            if (pricingRes.data) {
                const d = pricingRes.data;
                setData({
                    pricing_hero_image: d.pricing_hero_image || '',
                    section_label: d.section_label || 'Booking & Terms',
                    section_title: d.section_title || 'Plan Your Retreat',
                    section_subtitle: d.section_subtitle || '',
                    currency: d.currency || 'AUD',
                    pricing_model: d.pricing_model || '',
                    price_range_category: d.price_range_category || '',
                    base_nightly_rate: parseFloat(d.base_nightly_rate) || 0,
                    weekend_rate: parseFloat(d.weekend_rate) || 0,
                    weekly_rate: parseFloat(d.weekly_rate) || 0,
                    cleaning_fee: parseFloat(d.cleaning_fee) || 0,
                    group_discounts_available: d.group_discounts_available ?? false,
                    group_discount_percentage: parseFloat(d.group_discount_percentage) || 0,
                    min_nights_for_discount: d.min_nights_for_discount || 3,
                    group_discount_details: d.group_discount_details || '',
                    holiday_surcharge_percentage: parseFloat(d.holiday_surcharge_percentage) || 0,
                    min_stay_default: d.min_stay_default || 1,
                    min_stay_weekends: d.min_stay_weekends || 1,
                    max_stay: d.max_stay || 0,
                    advance_booking_required: d.advance_booking_required || '',
                    booking_window_opens: d.booking_window_opens || '',
                    checkin_day_restrictions: d.checkin_day_restrictions || '',
                    checkin_time: d.checkin_time || '',
                    checkout_time: d.checkout_time || '',
                    booking_deposit: d.booking_deposit || '',
                    deposit_due: d.deposit_due || '',
                    balance_due: d.balance_due || '',
                    security_bond: parseFloat(d.security_bond) || 0,
                    bond_collection_method: d.bond_collection_method || '',
                    accepted_payment_methods: d.accepted_payment_methods || [],
                    cancellation_policy_type: d.cancellation_policy_type || '',
                    cancellation_grace_period: d.cancellation_grace_period || '',
                    refund_policy_details: d.refund_policy_details || '',
                    pricing_notes: d.pricing_notes || '',
                });
            }

            if (seasonRes.data) {
                setSeasons(seasonRes.data.map((s: Record<string, unknown>) => ({
                    id: s.id as string,
                    season_name: (s.season_name as string) || '',
                    date_range: (s.date_range as string) || '',
                    season_type: (s.season_type as string) || 'Standard',
                    nightly_rate: parseFloat(s.nightly_rate as string) || 0,
                    minimum_stay: (s.minimum_stay as string) || '',
                })));
            }

            setLoading(false);
        }
        fetchData();
    }, [venue.id]);

    // ─── Field update helper ──────────────────────────────────────────────
    function set<K extends keyof PricingData>(key: K, value: PricingData[K]) {
        setData(prev => ({ ...prev, [key]: value }));
    }

    // ─── Hero image upload ────────────────────────────────────────────────
    async function handleHeroUpload(file: File) {
        setUploadingHero(true);
        try {
            const url = await uploadFile(file, 'photo');
            set('pricing_hero_image', url);
        } catch {
            alert('Failed to upload image. Please try again.');
        }
        setUploadingHero(false);
    }

    // ─── Payment method toggle ────────────────────────────────────────────
    function togglePaymentMethod(method: string) {
        const current = data.accepted_payment_methods;
        if (current.includes(method)) {
            set('accepted_payment_methods', current.filter(m => m !== method));
        } else {
            set('accepted_payment_methods', [...current, method]);
        }
    }

    // ─── Season row helpers ───────────────────────────────────────────────
    function addSeason() {
        setSeasons(prev => [
            ...prev,
            { season_name: '', date_range: '', season_type: 'Standard', nightly_rate: 0, minimum_stay: '' },
        ]);
    }

    function updateSeason(idx: number, field: keyof SeasonRow, value: string | number) {
        setSeasons(prev => prev.map((row, i) => i === idx ? { ...row, [field]: value } : row));
    }

    function removeSeason(idx: number) {
        setSeasons(prev => prev.filter((_, i) => i !== idx));
    }

    // ─── Computed pricing overview ────────────────────────────────────────
    const allRates = seasons.map(s => s.nightly_rate).filter(r => r > 0);
    const lowestRate = allRates.length > 0 ? Math.min(...allRates) : data.base_nightly_rate;
    const peakRate = allRates.length > 0 ? Math.max(...allRates) : 0;

    // ─── Save ─────────────────────────────────────────────────────────────
    async function handleSave() {
        setSaving(true);
        if (saveMsgTimer.current) clearTimeout(saveMsgTimer.current);
        try {
            const payload = {
                venue_id: venue.id,
                venue_type: 'retreat' as const,
                ...data,
            };

            const { data: existing, error: selErr } = await supabase
                .from('venue_pricing')
                .select('id')
                .eq('venue_id', venue.id)
                .eq('venue_type', 'retreat')
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

            // Seasonal: delete all then bulk insert
            const { error: delErr } = await supabase
                .from('venue_seasonal_pricing')
                .delete()
                .eq('venue_id', venue.id)
                .eq('venue_type', 'retreat');
            if (delErr) throw delErr;

            if (seasons.length > 0) {
                const { error: seaErr } = await supabase.from('venue_seasonal_pricing').insert(
                    seasons.map(s => ({
                        venue_id: venue.id,
                        venue_type: 'retreat',
                        season_name: s.season_name,
                        date_range: s.date_range,
                        season_type: s.season_type,
                        nightly_rate: s.nightly_rate,
                        minimum_stay: s.minimum_stay,
                    }))
                );
                if (seaErr) throw seaErr;
            }

            setSaveMsg('Pricing saved successfully');
            saveMsgTimer.current = setTimeout(() => setSaveMsg(''), 5000);
        } catch (err: any) {
            console.error('Save error:', err);
            setSaveMsg('Error: ' + (err.message || 'Failed to save'));
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

            {/* ── Tab Images ──────────────────────────────────────────── */}
            <section className="form-section">
                <div className="form-section-header">
                    <div>
                        <h3 className="form-section-title">Tab Images</h3>
                        <p className="form-section-subtitle">Hero image displayed on the Booking tab of your public listing</p>
                    </div>
                </div>
                <div className="form-section-body">
                    <div className="form-group">
                        <label className="form-label">Booking Tab Hero Image</label>
                        <input
                            ref={heroInputRef}
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={e => {
                                const file = e.target.files?.[0];
                                if (file) handleHeroUpload(file);
                                e.target.value = '';
                            }}
                        />
                        {data.pricing_hero_image ? (
                            <div style={{ position: 'relative' }}>
                                <img src={data.pricing_hero_image} alt="Hero" style={{ width: '100%', height: 180, objectFit: 'cover', borderRadius: 8 }} />
                                <button
                                    onClick={() => set('pricing_hero_image', '')}
                                    style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.6)', border: 'none', borderRadius: 4, color: '#fff', cursor: 'pointer', padding: '4px 10px', fontSize: 11 }}
                                >
                                    Remove
                                </button>
                                <button
                                    onClick={() => heroInputRef.current?.click()}
                                    style={{ position: 'absolute', bottom: 8, right: 8, background: 'rgba(0,0,0,0.6)', border: 'none', borderRadius: 4, color: '#fff', cursor: 'pointer', padding: '4px 10px', fontSize: 11 }}
                                >
                                    Replace
                                </button>
                            </div>
                        ) : uploadingHero ? (
                            <div style={{ width: '100%', height: 180, border: '2px dashed rgba(184,184,184,0.4)', borderRadius: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--secondary-bg)' }}>
                                <Loader size={28} color="var(--accent)" strokeWidth={1.5} className="spin" />
                                <span style={{ fontSize: 12, color: 'var(--accent)', marginTop: 8 }}>Uploading…</span>
                            </div>
                        ) : (
                            <div
                                onClick={() => heroInputRef.current?.click()}
                                style={{ width: '100%', height: 180, border: '2px dashed rgba(184,184,184,0.4)', borderRadius: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--secondary-bg)', cursor: 'pointer', transition: 'border-color 0.2s' }}
                                onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--success)')}
                                onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(184,184,184,0.4)')}
                            >
                                <UploadCloud size={32} color="#B8B8B8" strokeWidth={1.5} />
                                <span style={{ fontSize: 12, color: 'var(--accent)', marginTop: 8 }}>Click to upload hero image</span>
                                <span style={{ fontSize: 11, color: 'var(--accent)' }}>Recommended: 1920 × 600px</span>
                            </div>
                        )}
                        <p className="form-hint">This image appears as the large hero banner at the top of the Booking tab on your public listing.</p>
                    </div>
                </div>
            </section>

            {/* ── Booking Tab Content ──────────────────────────────────── */}
            <section className="form-section">
                <div className="form-section-header">
                    <div>
                        <h3 className="form-section-title">Booking Tab Content</h3>
                        <p className="form-section-subtitle">Header text shown at the top of the Booking tab</p>
                    </div>
                </div>
                <div className="form-section-body">
                    <div className="form-grid">
                        <div className="form-group">
                            <label className="form-label">Section Label</label>
                            <input
                                type="text"
                                className="form-input"
                                value={data.section_label}
                                onChange={e => set('section_label', e.target.value)}
                                placeholder="e.g. Booking & Terms"
                            />
                            <p className="form-hint">Small overline label displayed above the title.</p>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Section Title</label>
                            <input
                                type="text"
                                className="form-input"
                                value={data.section_title}
                                onChange={e => set('section_title', e.target.value)}
                                placeholder="e.g. Plan Your Retreat"
                            />
                        </div>
                        <div className="form-group full-width">
                            <label className="form-label">Section Subtitle</label>
                            <input
                                type="text"
                                className="form-input"
                                value={data.section_subtitle}
                                onChange={e => set('section_subtitle', e.target.value)}
                                placeholder="Brief supporting text shown below the title…"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Pricing Overview Cards (computed, display only) ──────── */}
            <section className="form-section">
                <div className="form-section-header">
                    <div>
                        <h3 className="form-section-title">Pricing Overview</h3>
                        <p className="form-section-subtitle">Auto-computed from your rates below — displayed as summary cards on the public listing</p>
                    </div>
                </div>
                <div className="form-section-body">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                        {[
                            { label: 'Starting From', value: lowestRate > 0 ? `${data.currency} $${lowestRate.toLocaleString()}` : '—', sub: 'Lowest seasonal or base rate' },
                            { label: 'Standard Rate', value: data.base_nightly_rate > 0 ? `${data.currency} $${data.base_nightly_rate.toLocaleString()}` : '—', sub: 'Base nightly rate' },
                            { label: 'Peak Rate', value: peakRate > 0 ? `${data.currency} $${peakRate.toLocaleString()}` : '—', sub: 'Highest seasonal rate' },
                        ].map(card => (
                            <div key={card.label} style={{ background: 'var(--secondary-bg)', border: '1px solid rgba(184,184,184,0.2)', borderRadius: 8, padding: '20px 24px', textAlign: 'center' }}>
                                <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--accent)', marginBottom: 8 }}>{card.label}</div>
                                <div style={{ fontSize: 22, fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>{card.value}</div>
                                <div style={{ fontSize: 11, color: 'var(--accent)' }}>{card.sub}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Base Pricing ─────────────────────────────────────────── */}
            <section className="form-section">
                <div className="form-section-header">
                    <div>
                        <h3 className="form-section-title">Base Pricing</h3>
                        <p className="form-section-subtitle">Standard nightly rates and pricing model</p>
                    </div>
                </div>
                <div className="form-section-body">
                    <div className="form-grid">
                        <div className="form-group">
                            <label className="form-label">Currency</label>
                            <select className="form-select form-input" value={data.currency} onChange={e => set('currency', e.target.value)}>
                                <option value="AUD">AUD — Australian Dollar</option>
                                <option value="USD">USD — US Dollar</option>
                                <option value="EUR">EUR — Euro</option>
                                <option value="GBP">GBP — British Pound</option>
                                <option value="NZD">NZD — New Zealand Dollar</option>
                                <option value="JPY">JPY — Japanese Yen</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Pricing Model</label>
                            <select className="form-select form-input" value={data.pricing_model} onChange={e => set('pricing_model', e.target.value)}>
                                <option value="">Select model…</option>
                                <option value="Per Night (Whole Property)">Per Night (Whole Property)</option>
                                <option value="Per Person Per Night">Per Person Per Night</option>
                                <option value="Per Room Per Night">Per Room Per Night</option>
                                <option value="Flat Rate (Multi-day Package)">Flat Rate (Multi-day Package)</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Price Range Category</label>
                            <select className="form-select form-input" value={data.price_range_category} onChange={e => set('price_range_category', e.target.value)}>
                                <option value="">Select category…</option>
                                <option value="Budget">Budget</option>
                                <option value="Mid-Range">Mid-Range</option>
                                <option value="Upscale">Upscale</option>
                                <option value="Luxury">Luxury</option>
                                <option value="Ultra-Luxury">Ultra-Luxury</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Base Nightly Rate ({data.currency})</label>
                            <input
                                type="number"
                                className="form-input"
                                min={0}
                                value={data.base_nightly_rate || ''}
                                onChange={e => set('base_nightly_rate', parseFloat(e.target.value) || 0)}
                                placeholder="0"
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Weekend Rate ({data.currency})</label>
                            <input
                                type="number"
                                className="form-input"
                                min={0}
                                value={data.weekend_rate || ''}
                                onChange={e => set('weekend_rate', parseFloat(e.target.value) || 0)}
                                placeholder="0"
                            />
                            <p className="form-hint">Leave at 0 if same as base rate.</p>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Weekly Rate ({data.currency})</label>
                            <input
                                type="number"
                                className="form-input"
                                min={0}
                                value={data.weekly_rate || ''}
                                onChange={e => set('weekly_rate', parseFloat(e.target.value) || 0)}
                                placeholder="0"
                            />
                            <p className="form-hint">Flat rate for 7-night stays.</p>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Cleaning Fee ({data.currency})</label>
                            <input
                                type="number"
                                className="form-input"
                                min={0}
                                value={data.cleaning_fee || ''}
                                onChange={e => set('cleaning_fee', parseFloat(e.target.value) || 0)}
                                placeholder="0"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Group Discounts ──────────────────────────────────────── */}
            <section className="form-section">
                <div className="form-section-header">
                    <div>
                        <h3 className="form-section-title">Group Discounts</h3>
                        <p className="form-section-subtitle">Discount applied for longer or group stays</p>
                    </div>
                </div>
                <div className="form-section-body">
                    <div className="form-grid">
                        <div className="form-group">
                            <label className="form-label">Group Discounts Available</label>
                            <div className="toggle-container" onClick={() => set('group_discounts_available', !data.group_discounts_available)}>
                                <div className={`toggle ${data.group_discounts_available ? 'active' : ''}`}>
                                    <div className="toggle-knob" />
                                </div>
                                <span className="toggle-label">{data.group_discounts_available ? 'Yes' : 'No'}</span>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Discount Percentage (%)</label>
                            <input
                                type="number"
                                className="form-input"
                                min={0}
                                max={100}
                                value={data.group_discount_percentage || ''}
                                onChange={e => set('group_discount_percentage', parseFloat(e.target.value) || 0)}
                                placeholder="e.g. 10"
                                disabled={!data.group_discounts_available}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Minimum Nights for Discount</label>
                            <select
                                className="form-select form-input"
                                value={data.min_nights_for_discount}
                                onChange={e => set('min_nights_for_discount', parseInt(e.target.value))}
                                disabled={!data.group_discounts_available}
                            >
                                <option value={3}>3 nights</option>
                                <option value={5}>5 nights</option>
                                <option value={7}>7 nights</option>
                                <option value={10}>10 nights</option>
                                <option value={14}>14 nights</option>
                            </select>
                        </div>
                        <div className="form-group full-width">
                            <label className="form-label">Group Discount Details</label>
                            <textarea
                                className="form-input form-textarea"
                                rows={2}
                                value={data.group_discount_details}
                                onChange={e => set('group_discount_details', e.target.value)}
                                placeholder="Describe the group discount terms…"
                                disabled={!data.group_discounts_available}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Seasonal Pricing ─────────────────────────────────────── */}
            <section className="form-section">
                <div className="form-section-header">
                    <div>
                        <h3 className="form-section-title">Seasonal Pricing</h3>
                        <p className="form-section-subtitle">Define rate variations for different seasons or periods</p>
                    </div>
                    <button className="btn btn-secondary btn-small" onClick={addSeason}>
                        <Plus size={14} style={{ marginRight: 4 }} />
                        Add Season
                    </button>
                </div>
                <div className="form-section-body">
                    {seasons.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--accent)', fontSize: 13, border: '1px dashed rgba(184,184,184,0.3)', borderRadius: 8 }}>
                            No seasons added yet. Click <strong>Add Season</strong> to define seasonal rate variations.
                        </div>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid rgba(184,184,184,0.2)' }}>
                                        {['Season Name', 'Date Range', 'Season Type', `Nightly Rate (${data.currency})`, 'Min Stay', ''].map(h => (
                                            <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 500, color: 'var(--accent)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {seasons.map((row, idx) => (
                                        <tr key={idx} style={{ borderBottom: '1px solid rgba(184,184,184,0.1)' }}>
                                            <td style={{ padding: '8px 12px' }}>
                                                <input
                                                    type="text"
                                                    className="form-input"
                                                    style={{ minWidth: 120 }}
                                                    value={row.season_name}
                                                    onChange={e => updateSeason(idx, 'season_name', e.target.value)}
                                                    placeholder="e.g. Summer Peak"
                                                />
                                            </td>
                                            <td style={{ padding: '8px 12px' }}>
                                                <input
                                                    type="text"
                                                    className="form-input"
                                                    style={{ minWidth: 160 }}
                                                    value={row.date_range}
                                                    onChange={e => updateSeason(idx, 'date_range', e.target.value)}
                                                    placeholder="e.g. Dec 15 – Jan 31"
                                                />
                                            </td>
                                            <td style={{ padding: '8px 12px' }}>
                                                <select
                                                    className="form-select form-input"
                                                    value={row.season_type}
                                                    onChange={e => updateSeason(idx, 'season_type', e.target.value)}
                                                >
                                                    <option value="Peak">Peak</option>
                                                    <option value="High">High</option>
                                                    <option value="Standard">Standard</option>
                                                    <option value="Low">Low</option>
                                                </select>
                                            </td>
                                            <td style={{ padding: '8px 12px' }}>
                                                <input
                                                    type="number"
                                                    className="form-input"
                                                    style={{ minWidth: 100 }}
                                                    min={0}
                                                    value={row.nightly_rate || ''}
                                                    onChange={e => updateSeason(idx, 'nightly_rate', parseFloat(e.target.value) || 0)}
                                                    placeholder="0"
                                                />
                                            </td>
                                            <td style={{ padding: '8px 12px' }}>
                                                <input
                                                    type="text"
                                                    className="form-input"
                                                    style={{ minWidth: 100 }}
                                                    value={row.minimum_stay}
                                                    onChange={e => updateSeason(idx, 'minimum_stay', e.target.value)}
                                                    placeholder="e.g. 3 nights"
                                                />
                                            </td>
                                            <td style={{ padding: '8px 12px' }}>
                                                <button
                                                    onClick={() => removeSeason(idx)}
                                                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent)', padding: 4, display: 'flex', alignItems: 'center' }}
                                                    title="Remove season"
                                                >
                                                    <Trash2 size={15} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </section>

            {/* ── Holiday Surcharge ────────────────────────────────────── */}
            <section className="form-section">
                <div className="form-section-header">
                    <div>
                        <h3 className="form-section-title">Holiday Surcharge</h3>
                        <p className="form-section-subtitle">Additional percentage applied during public holidays</p>
                    </div>
                </div>
                <div className="form-section-body">
                    <div className="form-grid">
                        <div className="form-group">
                            <label className="form-label">Holiday Surcharge (%)</label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type="number"
                                    className="form-input"
                                    min={0}
                                    max={100}
                                    value={data.holiday_surcharge_percentage || ''}
                                    onChange={e => set('holiday_surcharge_percentage', parseFloat(e.target.value) || 0)}
                                    placeholder="0"
                                    style={{ paddingRight: 36 }}
                                />
                                <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--accent)', fontSize: 13, pointerEvents: 'none' }}>%</span>
                            </div>
                            <p className="form-hint">Set to 0 to disable the holiday surcharge.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Booking Rules ────────────────────────────────────────── */}
            <section className="form-section">
                <div className="form-section-header">
                    <div>
                        <h3 className="form-section-title">Booking Rules</h3>
                        <p className="form-section-subtitle">Minimum/maximum stay requirements and check-in constraints</p>
                    </div>
                </div>
                <div className="form-section-body">
                    <div className="form-grid">
                        <div className="form-group">
                            <label className="form-label">Minimum Stay (default)</label>
                            <select className="form-select form-input" value={data.min_stay_default} onChange={e => set('min_stay_default', parseInt(e.target.value))}>
                                <option value={1}>1 night</option>
                                <option value={2}>2 nights</option>
                                <option value={3}>3 nights</option>
                                <option value={4}>4 nights</option>
                                <option value={5}>5 nights</option>
                                <option value={6}>6 nights</option>
                                <option value={7}>7+ nights</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Minimum Stay (weekends)</label>
                            <select className="form-select form-input" value={data.min_stay_weekends} onChange={e => set('min_stay_weekends', parseInt(e.target.value))}>
                                <option value={1}>1 night</option>
                                <option value={2}>2 nights</option>
                                <option value={3}>3 nights</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Maximum Stay</label>
                            <select className="form-select form-input" value={data.max_stay} onChange={e => set('max_stay', parseInt(e.target.value))}>
                                <option value={0}>No limit</option>
                                <option value={7}>7 nights</option>
                                <option value={14}>14 nights</option>
                                <option value={21}>21 nights</option>
                                <option value={28}>28 nights</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Advance Booking Required</label>
                            <select className="form-select form-input" value={data.advance_booking_required} onChange={e => set('advance_booking_required', e.target.value)}>
                                <option value="">Select…</option>
                                <option value="None">None</option>
                                <option value="24h">24 hours</option>
                                <option value="48h">48 hours</option>
                                <option value="7d">7 days</option>
                                <option value="14d">14 days</option>
                                <option value="30d">30 days</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Booking Window Opens</label>
                            <select className="form-select form-input" value={data.booking_window_opens} onChange={e => set('booking_window_opens', e.target.value)}>
                                <option value="">Select…</option>
                                <option value="3 months">3 months in advance</option>
                                <option value="6 months">6 months in advance</option>
                                <option value="12 months">12 months in advance</option>
                                <option value="18 months">18 months in advance</option>
                                <option value="24 months">24 months in advance</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Check-in Day Restrictions</label>
                            <select className="form-select form-input" value={data.checkin_day_restrictions} onChange={e => set('checkin_day_restrictions', e.target.value)}>
                                <option value="">No restrictions</option>
                                <option value="Weekdays only">Weekdays only</option>
                                <option value="Weekends only">Weekends only</option>
                                <option value="Friday only">Friday only</option>
                                <option value="Saturday only">Saturday only</option>
                                <option value="Monday only">Monday only</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Check-in Time</label>
                            <input
                                type="text"
                                className="form-input"
                                value={data.checkin_time}
                                onChange={e => set('checkin_time', e.target.value)}
                                placeholder="e.g. 2:00 PM"
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Check-out Time</label>
                            <input
                                type="text"
                                className="form-input"
                                value={data.checkout_time}
                                onChange={e => set('checkout_time', e.target.value)}
                                placeholder="e.g. 10:00 AM"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Deposit & Payment ────────────────────────────────────── */}
            <section className="form-section">
                <div className="form-section-header">
                    <div>
                        <h3 className="form-section-title">Deposit & Payment</h3>
                        <p className="form-section-subtitle">Payment requirements and accepted methods</p>
                    </div>
                </div>
                <div className="form-section-body">
                    <div className="form-grid">
                        <div className="form-group">
                            <label className="form-label">Booking Deposit</label>
                            <select className="form-select form-input" value={data.booking_deposit} onChange={e => set('booking_deposit', e.target.value)}>
                                <option value="">Select…</option>
                                <option value="No deposit">No deposit required</option>
                                <option value="25%">25% deposit</option>
                                <option value="50%">50% deposit</option>
                                <option value="Full">Full payment at booking</option>
                                <option value="Fixed">Fixed amount deposit</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Deposit Due</label>
                            <select className="form-select form-input" value={data.deposit_due} onChange={e => set('deposit_due', e.target.value)}>
                                <option value="">Select…</option>
                                <option value="At booking">At booking</option>
                                <option value="Within 48h">Within 48 hours</option>
                                <option value="Within 7 days">Within 7 days</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Balance Due</label>
                            <select className="form-select form-input" value={data.balance_due} onChange={e => set('balance_due', e.target.value)}>
                                <option value="">Select…</option>
                                <option value="At check-in">At check-in</option>
                                <option value="7 days before">7 days before</option>
                                <option value="14 days before">14 days before</option>
                                <option value="30 days before">30 days before</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Security Bond ({data.currency})</label>
                            <input
                                type="number"
                                className="form-input"
                                min={0}
                                value={data.security_bond || ''}
                                onChange={e => set('security_bond', parseFloat(e.target.value) || 0)}
                                placeholder="0"
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Bond Collection Method</label>
                            <select className="form-select form-input" value={data.bond_collection_method} onChange={e => set('bond_collection_method', e.target.value)}>
                                <option value="">Select…</option>
                                <option value="Credit card pre-authorisation">Credit card pre-authorisation</option>
                                <option value="Bank transfer">Bank transfer</option>
                                <option value="Cash on arrival">Cash on arrival</option>
                                <option value="No bond required">No bond required</option>
                            </select>
                        </div>
                        <div className="form-group full-width">
                            <label className="form-label">Accepted Payment Methods</label>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 4 }}>
                                {PAYMENT_METHODS.map(method => {
                                    const checked = data.accepted_payment_methods.includes(method);
                                    return (
                                        <label
                                            key={method}
                                            style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: 13, padding: '6px 12px', borderRadius: 6, border: `1px solid ${checked ? 'var(--success)' : 'rgba(184,184,184,0.3)'}`, background: checked ? 'rgba(var(--success-rgb, 72, 187, 120), 0.08)' : 'transparent', userSelect: 'none' }}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={checked}
                                                onChange={() => togglePaymentMethod(method)}
                                                style={{ accentColor: 'var(--success)' }}
                                            />
                                            {method}
                                        </label>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Cancellation Policy ──────────────────────────────────── */}
            <section className="form-section">
                <div className="form-section-header">
                    <div>
                        <h3 className="form-section-title">Cancellation Policy</h3>
                        <p className="form-section-subtitle">Cancellation terms displayed to guests on the booking page</p>
                    </div>
                </div>
                <div className="form-section-body">
                    <div className="form-grid">
                        <div className="form-group">
                            <label className="form-label">Cancellation Policy Type</label>
                            <select className="form-select form-input" value={data.cancellation_policy_type} onChange={e => set('cancellation_policy_type', e.target.value)}>
                                <option value="">Select…</option>
                                <option value="Flexible">Flexible</option>
                                <option value="Moderate">Moderate</option>
                                <option value="Firm">Firm</option>
                                <option value="Strict">Strict</option>
                                <option value="Super Strict">Super Strict</option>
                                <option value="Custom">Custom</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Cancellation Grace Period</label>
                            <select className="form-select form-input" value={data.cancellation_grace_period} onChange={e => set('cancellation_grace_period', e.target.value)}>
                                <option value="">None</option>
                                <option value="48h">48 hours</option>
                                <option value="7d">7 days</option>
                            </select>
                        </div>
                        <div className="form-group full-width">
                            <label className="form-label">Refund Policy Details</label>
                            <textarea
                                className="form-input form-textarea"
                                rows={3}
                                value={data.refund_policy_details}
                                onChange={e => set('refund_policy_details', e.target.value)}
                                placeholder="Describe the full cancellation and refund policy shown to guests…"
                            />
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
