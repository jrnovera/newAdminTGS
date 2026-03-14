import { useState, useEffect, useCallback, useRef } from 'react';
import { Check, Plus, UploadCloud, ChevronDown, Save, Loader, Trash2, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { uploadFile } from '../lib/storage';
import type { Venue } from '../context/VenueContext';

interface WellnessServicesTabProps {
    venue: Venue;
    onUpdate?: (updates: Partial<Venue>) => void;
}

// ─── Service category checkboxes with DB column mapping ───────────────────────
const SERVICE_CATEGORIES = [
    {
        key: 'massage', title: 'Massage & Bodywork', subtitle: 'Therapeutic touch and manual therapies',
        items: [
            { label: 'Swedish Massage', col: 'has_swedish_massage' },
            { label: 'Deep Tissue Massage', col: 'has_deep_tissue' },
            { label: 'Remedial Massage', col: 'has_remedial_massage' },
            { label: 'Aromatherapy Massage', col: 'has_aromatherapy_massage' },
            { label: 'Hot Stone Massage', col: 'has_hot_stone' },
            { label: 'Lymphatic Drainage', col: 'has_lymphatic_drainage' },
            { label: 'Thai Massage', col: 'has_thai_massage' },
            { label: 'Reflexology', col: 'has_reflexology' },
            { label: 'Shiatsu', col: 'has_shiatsu' },
            { label: 'Craniosacral Therapy', col: 'has_craniosacral' },
            { label: 'Myofascial Release', col: 'has_myofascial' },
            { label: 'Pregnancy Massage', col: 'has_pregnancy_massage' },
        ],
    },
    {
        key: 'movement', title: 'Movement & Fitness', subtitle: 'Classes and physical practices',
        items: [
            { label: 'Yoga Classes', col: 'has_yoga' },
            { label: 'Pilates', col: 'has_pilates' },
            { label: 'Meditation Sessions', col: 'has_meditation' },
            { label: 'Breathwork Sessions', col: 'has_breathwork' },
            { label: 'Tai Chi / Qigong', col: 'has_tai_chi' },
            { label: 'Personal Training', col: 'has_personal_training' },
            { label: 'Nature Walks / Hiking', col: 'has_nature_walks' },
            { label: 'Sound Healing', col: 'has_sound_healing' },
            { label: 'Dance / Movement Therapy', col: 'has_dance_therapy' },
        ],
    },
    {
        key: 'holistic', title: 'Holistic & Energy Therapies', subtitle: 'Energy work and alternative therapies',
        items: [
            { label: 'Reiki', col: 'has_reiki' },
            { label: 'Energy Healing', col: 'has_energy_healing' },
            { label: 'Acupuncture', col: 'has_acupuncture' },
            { label: 'Acupressure', col: 'has_acupressure' },
            { label: 'Kinesiology', col: 'has_kinesiology' },
            { label: 'Hypnotherapy', col: 'has_hypnotherapy' },
            { label: 'Crystal Healing', col: 'has_crystal_healing' },
            { label: 'Shamanic Healing', col: 'has_shamanic_healing' },
            { label: 'Ayurvedic Treatments', col: 'has_ayurvedic' },
        ],
    },
    {
        key: 'nutrition', title: 'Nutrition & Detox', subtitle: 'Food, fasting, and cleansing programs',
        items: [
            { label: 'Nutritional Consultation', col: 'has_nutritional_consultation' },
            { label: 'Cooking Classes', col: 'has_cooking_classes' },
            { label: 'Juice Cleanse Programs', col: 'has_juice_cleanse' },
            { label: 'Detox Programs', col: 'has_detox_programs' },
            { label: 'Plant-based Menu Options', col: 'has_plant_based_menu' },
            { label: 'Fasting Programs', col: 'has_fasting_programs' },
            { label: 'IV Therapy', col: 'has_iv_therapy' },
            { label: 'Colonic Hydrotherapy', col: 'has_colonic_hydrotherapy' },
        ],
    },
    {
        key: 'mind', title: 'Mind & Spirit', subtitle: 'Coaching, counselling, and spiritual practices',
        items: [
            { label: 'Life Coaching', col: 'has_life_coaching' },
            { label: 'Counselling / Therapy', col: 'has_counselling' },
            { label: 'Mindfulness Training', col: 'has_mindfulness_training' },
            { label: 'Psychotherapy', col: 'has_psychotherapy' },
            { label: 'Cacao Ceremony', col: 'has_cacao_ceremony' },
            { label: "Women's / Men's Circles", col: 'has_mens_womens_circles' },
            { label: 'Journaling / Writing Workshops', col: 'has_journaling_workshops' },
            { label: 'Tarot / Oracle Reading', col: 'has_tarot_reading' },
            { label: 'Astrology Consultation', col: 'has_astrology' },
        ],
    },
    {
        key: 'beauty', title: 'Beauty & Spa', subtitle: 'Aesthetic and pampering treatments',
        items: [
            { label: 'Facials', col: 'has_facials' },
            { label: 'Body Scrubs / Wraps', col: 'has_body_scrubs' },
            { label: 'Manicure / Pedicure', col: 'has_manicure_pedicure' },
            { label: 'Hair Treatments', col: 'has_hair_treatments' },
            { label: 'Waxing', col: 'has_waxing' },
            { label: 'Makeup Services', col: 'has_makeup_services' },
        ],
    },
];

interface Config {
    services_hero_image: string;
    tab_label: string;
    tab_title: string;
    tab_subtitle: string;
    intro_paragraph: string;
    practitioners_section_label: string;
    practitioners_section_subtitle: string;
    onsite_practitioners: boolean;
    external_practitioners_welcome: boolean;
    byo_facilitator: boolean;
    can_arrange_services: boolean;
    advance_booking_required: string;
    service_pricing_model: string;
    service_notes: string;
    [key: string]: string | boolean; // for has_* boolean columns
}

interface Practitioner {
    id: string;
    avatar_url: string;
    practitioner_name: string;
    practitioner_title: string;
    services: string[];
    website_display_title: string;
    website_description: string;
    show_on_website: boolean;
    sort_order: number;
    isNew?: boolean;
}

const DEFAULT_CONFIG: Config = {
    services_hero_image: '',
    tab_label: 'Experiences & Add-Ons',
    tab_title: 'Enhance Your Retreat',
    tab_subtitle: '',
    intro_paragraph: '',
    practitioners_section_label: 'Resident Practitioners',
    practitioners_section_subtitle: 'Local experts available for your retreat',
    onsite_practitioners: false,
    external_practitioners_welcome: false,
    byo_facilitator: false,
    can_arrange_services: false,
    advance_booking_required: 'Yes - 48 hours notice',
    service_pricing_model: 'Additional cost',
    service_notes: '',
};

function blankPractitioner(): Practitioner {
    return {
        id: `new-${Date.now()}`,
        avatar_url: '',
        practitioner_name: '',
        practitioner_title: '',
        services: [],
        website_display_title: '',
        website_description: '',
        show_on_website: true,
        sort_order: 0,
        isNew: true,
    };
}

export default function WellnessServicesTab({ venue, onUpdate: _onUpdate }: WellnessServicesTabProps) {
    const [config, setConfig] = useState<Config>(DEFAULT_CONFIG);
    const [practitioners, setPractitioners] = useState<Practitioner[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);
    const [uploadingHero, setUploadingHero] = useState(false);
    const [uploadingAvatar, setUploadingAvatar] = useState<string | null>(null);
    const heroInputRef = useRef<HTMLInputElement>(null);
    const avatarInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

    // ─── Load ──────────────────────────────────────────────────────────────
    const fetchData = useCallback(async () => {
        if (!venue.id) return;
        setLoading(true);
        const [{ data: cfgRow }, { data: practRows }] = await Promise.all([
            supabase.from('venue_wellness_services').select('*').eq('venue_id', venue.id).eq('venue_type', 'retreat').single(),
            supabase.from('venue_practitioners').select('*').eq('venue_id', venue.id).eq('venue_type', 'retreat').order('sort_order'),
        ]);

        if (cfgRow) {
            const loaded: Config = { ...DEFAULT_CONFIG };
            for (const key of Object.keys(DEFAULT_CONFIG)) {
                if (cfgRow[key] !== undefined && cfgRow[key] !== null) {
                    (loaded as any)[key] = cfgRow[key];
                }
            }
            // load all has_* booleans
            for (const cat of SERVICE_CATEGORIES) {
                for (const item of cat.items) {
                    if (cfgRow[item.col] !== undefined) loaded[item.col] = cfgRow[item.col] ?? false;
                    else loaded[item.col] = false;
                }
            }
            setConfig(loaded);
        }

        if (practRows) {
            setPractitioners(practRows.map(r => ({
                id: r.id,
                avatar_url: r.avatar_url || '',
                practitioner_name: r.practitioner_name || '',
                practitioner_title: r.practitioner_title || '',
                services: r.services || [],
                website_display_title: r.website_display_title || '',
                website_description: r.website_description || '',
                show_on_website: r.show_on_website ?? true,
                sort_order: r.sort_order || 0,
            })));
        }
        setLoading(false);
    }, [venue.id]);

    useEffect(() => { fetchData(); }, [fetchData]);

    // ─── Helpers ───────────────────────────────────────────────────────────
    function updateConfig<K extends keyof Config>(key: K, value: Config[K]) {
        setConfig(prev => ({ ...prev, [key]: value }));
        setHasChanges(true);
    }

    function toggleServiceCheck(col: string) {
        setConfig(prev => ({ ...prev, [col]: !prev[col] }));
        setHasChanges(true);
    }

    function updatePractitioner(id: string, field: keyof Practitioner, value: string | boolean | string[]) {
        setPractitioners(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
        setHasChanges(true);
    }

    function addServiceTag(id: string, tag: string) {
        setPractitioners(prev => prev.map(p =>
            p.id === id ? { ...p, services: [...(p.services || []), tag] } : p
        ));
        setHasChanges(true);
    }

    function removeServiceTag(id: string, tag: string) {
        setPractitioners(prev => prev.map(p =>
            p.id === id ? { ...p, services: p.services.filter(s => s !== tag) } : p
        ));
        setHasChanges(true);
    }

    // ─── Image uploads ─────────────────────────────────────────────────────
    async function handleHeroUpload(file: File) {
        setUploadingHero(true);
        try {
            const url = await uploadFile(file, 'photo');
            updateConfig('services_hero_image', url);
        } catch (err) { console.error(err); }
        setUploadingHero(false);
    }

    async function handleAvatarUpload(file: File, practId: string) {
        setUploadingAvatar(practId);
        try {
            const url = await uploadFile(file, 'photo');
            updatePractitioner(practId, 'avatar_url', url);
        } catch (err) { console.error(err); }
        setUploadingAvatar(null);
    }

    // ─── Save ──────────────────────────────────────────────────────────────
    async function handleSave() {
        setSaving(true);

        // Build config payload
        const cfgPayload: Record<string, any> = { venue_id: venue.id, venue_type: 'retreat' };
        for (const key of Object.keys(DEFAULT_CONFIG)) cfgPayload[key] = config[key];
        for (const cat of SERVICE_CATEGORIES) {
            for (const item of cat.items) cfgPayload[item.col] = config[item.col] ?? false;
        }

        const { error: cfgErr } = await supabase
            .from('venue_wellness_services')
            .upsert(cfgPayload, { onConflict: 'venue_id,venue_type' });
        if (cfgErr) console.error('[WellnessServicesTab Retreat] config save:', cfgErr);

        // Sync practitioners — delete + reinsert
        const { error: delPractErr } = await supabase.from('venue_practitioners').delete().eq('venue_id', venue.id).eq('venue_type', 'retreat');
        if (delPractErr) console.error('[WellnessServicesTab Retreat] delete practitioners:', delPractErr);
        if (practitioners.length > 0) {
            const rows = practitioners.map((p, i) => ({
                venue_id: venue.id,
                venue_type: 'retreat',
                avatar_url: p.avatar_url || null,
                practitioner_name: p.practitioner_name,
                practitioner_title: p.practitioner_title,
                services: p.services,
                website_display_title: p.website_display_title,
                website_description: p.website_description,
                show_on_website: p.show_on_website,
                sort_order: i,
            }));
            const { error: practErr } = await supabase.from('venue_practitioners').insert(rows);
            if (practErr) console.error('[WellnessServicesTab Retreat] practitioners save:', practErr);
        }

        if (cfgErr) {
            alert('Failed to save. Please try again.');
        } else {
            setHasChanges(false);
            alert('Services saved successfully!');
            fetchData(); // re-fetch to get DB-generated IDs for practitioners
        }
        setSaving(false);
    }

    if (loading) {
        return <div style={{ padding: 40, textAlign: 'center', color: 'var(--accent)', fontSize: 14 }}>Loading services…</div>;
    }

    return (
        <div className="content-area">

            {/* Floating Save Button */}
            {hasChanges && (
                <button
                    onClick={handleSave}
                    disabled={saving}
                    style={{
                        position: 'fixed', bottom: 32, right: 32, zIndex: 500,
                        display: 'flex', alignItems: 'center', gap: 10,
                        padding: '14px 24px',
                        background: '#111111', color: '#fff',
                        border: 'none', borderRadius: 50, fontSize: 14, fontWeight: 600,
                        fontFamily: "'Montserrat', sans-serif",
                        cursor: saving ? 'not-allowed' : 'pointer',
                        boxShadow: '0 6px 24px rgba(0,0,0,0.25)',
                        opacity: saving ? 0.8 : 1,
                        transition: 'opacity 0.2s',
                        letterSpacing: '0.02em',
                    }}
                >
                    {saving ? <Loader size={18} className="spin" /> : <Save size={18} />}
                    {saving ? 'Saving…' : 'Save Services'}
                </button>
            )}

            {/* Info Banner */}
            <div className="info-banner">
                <svg className="info-banner-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
                <div className="info-banner-text">
                    <strong>Wellness Services</strong> are treatments, classes, and therapies available at this venue — by on-site practitioners, visiting practitioners, or facilitated by retreat hosts.
                </div>
            </div>

            {/* ── Tab Images ── */}
            <section className="form-section">
                <div className="form-section-header">
                    <div><h3 className="form-section-title">Tab Images</h3>
                        <p className="form-section-subtitle">Hero image for the Experiences & Add-Ons tab on your public listing</p></div>
                </div>
                <div className="form-section-body">
                    <div className="form-grid">
                        <div className="form-group">
                            <label className="form-label">Experiences Tab Hero Image</label>
                            <input ref={heroInputRef} type="file" accept="image/*" style={{ display: 'none' }}
                                onChange={e => { const f = e.target.files?.[0]; if (f) handleHeroUpload(f); e.target.value = ''; }} />
                            {config.services_hero_image ? (
                                <div style={{ position: 'relative' }}>
                                    <img src={config.services_hero_image} alt="Hero" style={{ width: '100%', height: 200, objectFit: 'cover', borderRadius: 8 }} />
                                    <button onClick={() => updateConfig('services_hero_image', '')} style={{ position: 'absolute', top: 8, right: 76, background: 'rgba(0,0,0,0.6)', border: 'none', borderRadius: 4, color: '#fff', cursor: 'pointer', padding: '4px 8px', fontSize: 11 }}>Remove</button>
                                    <button onClick={() => heroInputRef.current?.click()} style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.6)', border: 'none', borderRadius: 4, color: '#fff', cursor: 'pointer', padding: '4px 8px', fontSize: 11 }}>Replace</button>
                                </div>
                            ) : uploadingHero ? (
                                <div style={{ height: 200, border: '2px dashed rgba(184,184,184,0.4)', borderRadius: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--secondary-bg)' }}>
                                    <Loader size={28} color="var(--accent)" strokeWidth={1.5} /><span style={{ fontSize: 12, color: 'var(--accent)', marginTop: 8 }}>Uploading…</span>
                                </div>
                            ) : (
                                <div onClick={() => heroInputRef.current?.click()} style={{ height: 200, border: '2px dashed rgba(184,184,184,0.4)', borderRadius: 12, padding: 40, textAlign: 'center', background: 'var(--secondary-bg)', cursor: 'pointer' }}>
                                    <UploadCloud size={48} color="#B8B8B8" strokeWidth={1.5} style={{ marginBottom: 16 }} />
                                    <p style={{ color: 'var(--text)', fontWeight: 500, marginBottom: 4 }}>Click to upload or drag and drop</p>
                                    <p style={{ color: 'var(--accent)', fontSize: 12 }}>Recommended: 1920×600px, JPG or PNG</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Tab Content ── */}
            <section className="form-section">
                <div className="form-section-header">
                    <div><h3 className="form-section-title">Tab Content</h3>
                        <p className="form-section-subtitle">Intro text for the Experiences & Add-Ons tab on your public listing</p></div>
                </div>
                <div className="form-section-body">
                    <div className="form-grid">
                        <div className="form-group">
                            <label className="form-label">Tab Label</label>
                            <input type="text" className="form-input" value={config.tab_label} onChange={e => updateConfig('tab_label', e.target.value)} placeholder="e.g. Experiences & Add-Ons" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Tab Title</label>
                            <input type="text" className="form-input" value={config.tab_title} onChange={e => updateConfig('tab_title', e.target.value)} placeholder="e.g. Enhance Your Retreat" />
                        </div>
                        <div className="form-group full-width">
                            <label className="form-label">Tab Subtitle</label>
                            <input type="text" className="form-input" value={config.tab_subtitle} onChange={e => updateConfig('tab_subtitle', e.target.value)} placeholder="Brief subtitle…" />
                        </div>
                        <div className="form-group full-width">
                            <label className="form-label">Intro Paragraph</label>
                            <textarea className="form-input form-textarea" rows={3} value={config.intro_paragraph} onChange={e => updateConfig('intro_paragraph', e.target.value)} placeholder="A paragraph introducing available services and practitioners…" />
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Practitioners Section Content ── */}
            <section className="form-section">
                <div className="form-section-header">
                    <div><h3 className="form-section-title">Practitioners Section</h3>
                        <p className="form-section-subtitle">How the practitioners section appears on your public listing</p></div>
                </div>
                <div className="form-section-body">
                    <div className="form-grid">
                        <div className="form-group">
                            <label className="form-label">Section Label</label>
                            <input type="text" className="form-input" value={config.practitioners_section_label} onChange={e => updateConfig('practitioners_section_label', e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Section Subtitle</label>
                            <input type="text" className="form-input" value={config.practitioners_section_subtitle} onChange={e => updateConfig('practitioners_section_subtitle', e.target.value)} />
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Service Availability ── */}
            <section className="form-section">
                <div className="form-section-header">
                    <div><h3 className="form-section-title">Service Availability</h3>
                        <p className="form-section-subtitle">How wellness services are provided at this venue</p></div>
                </div>
                <div className="form-section-body">
                    <div className="form-grid three-col">
                        {[
                            { key: 'onsite_practitioners', label: 'On-site Practitioners Available' },
                            { key: 'external_practitioners_welcome', label: 'External Practitioners Welcome' },
                            { key: 'byo_facilitator', label: 'BYO Facilitator Friendly' },
                            { key: 'can_arrange_services', label: 'Can Arrange Services' },
                        ].map(({ key, label }) => (
                            <div className="form-group" key={key}>
                                <label className="form-label">{label}</label>
                                <div className="toggle-container">
                                    <div className={`toggle${config[key] ? ' active' : ''}`} onClick={() => updateConfig(key as keyof Config, !config[key])}>
                                        <div className="toggle-knob"></div>
                                    </div>
                                    <span className="toggle-label">{config[key] ? 'Yes' : 'No'}</span>
                                </div>
                            </div>
                        ))}
                        <div className="form-group">
                            <label className="form-label">Advance Booking Required</label>
                            <div style={{ position: 'relative' }}>
                                <select className="form-input" style={{ width: '100%', appearance: 'none' }} value={config.advance_booking_required} onChange={e => updateConfig('advance_booking_required', e.target.value)}>
                                    <option>No - available on request</option>
                                    <option>Yes - 48 hours notice</option>
                                    <option>Yes - 1 week notice</option>
                                    <option>Yes - 2 weeks notice</option>
                                </select>
                                <ChevronDown size={16} color="#B8B8B8" style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Service Pricing</label>
                            <div style={{ position: 'relative' }}>
                                <select className="form-input" style={{ width: '100%', appearance: 'none' }} value={config.service_pricing_model} onChange={e => updateConfig('service_pricing_model', e.target.value)}>
                                    <option>Included in venue hire</option>
                                    <option>Additional cost</option>
                                    <option>Some included, some additional</option>
                                </select>
                                <ChevronDown size={16} color="#B8B8B8" style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══ SERVICE CATEGORY CHECKBOXES ═══ */}
            {SERVICE_CATEGORIES.map(cat => {
                const checkedCount = cat.items.filter(i => !!config[i.col]).length;
                return (
                    <section className="form-section" key={cat.key}>
                        <div className="form-section-header">
                            <div><h3 className="form-section-title">{cat.title}</h3>
                                <p className="form-section-subtitle">{cat.subtitle}</p></div>
                            <span style={{ fontSize: 12, color: checkedCount > 0 ? 'var(--success)' : 'var(--accent)', fontWeight: 500 }}>
                                {checkedCount} available
                            </span>
                        </div>
                        <div className="form-section-body">
                            <div className="service-category-grid">
                                {cat.items.map(item => {
                                    const checked = !!config[item.col];
                                    return (
                                        <div key={item.col} className={`service-item${checked ? ' checked' : ''}`} onClick={() => toggleServiceCheck(item.col)} style={{ cursor: 'pointer' }}>
                                            <div className="service-checkbox">
                                                {checked && <Check size={14} color="white" strokeWidth={3} />}
                                            </div>
                                            <span className="service-label">{item.label}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </section>
                );
            })}

            {/* ── On-site Practitioners ── */}
            <section className="form-section">
                <div className="form-section-header">
                    <div><h3 className="form-section-title">On-site Practitioners</h3>
                        <p className="form-section-subtitle">Wellness professionals available through this venue — displayed on your public listing</p></div>
                    <button className="btn btn-secondary btn-small" onClick={() => { setPractitioners(prev => [...prev, blankPractitioner()]); setHasChanges(true); }}>
                        <Plus size={14} strokeWidth={2} style={{ marginRight: 6 }} />Add Practitioner
                    </button>
                </div>
                <div className="form-section-body">
                    <div className="practitioner-cards">
                        {practitioners.length === 0 && (
                            <p style={{ color: 'var(--accent)', fontSize: 13, textAlign: 'center', padding: '24px 0' }}>No practitioners added yet. Click "Add Practitioner" to get started.</p>
                        )}
                        {practitioners.map(p => (
                            <div key={p.id} className="practitioner-card" style={{ position: 'relative' }}>
                                <button onClick={() => { setPractitioners(prev => prev.filter(x => x.id !== p.id)); setHasChanges(true); }}
                                    style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(220,53,69,0.1)', border: '1px solid rgba(220,53,69,0.3)', borderRadius: 4, color: '#dc3545', cursor: 'pointer', padding: '4px 8px', fontSize: 11 }}>
                                    <Trash2 size={12} />
                                </button>
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 16 }}>
                                    {/* Avatar */}
                                    <div>
                                        <input type="file" accept="image/*" style={{ display: 'none' }} ref={el => { avatarInputRefs.current[p.id] = el; }}
                                            onChange={e => { const f = e.target.files?.[0]; if (f) handleAvatarUpload(f, p.id); e.target.value = ''; }} />
                                        <div className="practitioner-avatar-placeholder" onClick={() => avatarInputRefs.current[p.id]?.click()} style={{ cursor: 'pointer', position: 'relative', overflow: 'hidden' }}>
                                            {p.avatar_url ? (
                                                <img src={p.avatar_url} alt={p.practitioner_name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                                            ) : uploadingAvatar === p.id ? (
                                                <Loader size={24} color="var(--accent)" strokeWidth={1.5} />
                                            ) : (
                                                <UploadCloud size={32} color="#B8B8B8" strokeWidth={1.5} />
                                            )}
                                        </div>
                                        {p.avatar_url && (
                                            <button onClick={() => updatePractitioner(p.id, 'avatar_url', '')} style={{ display: 'block', width: '100%', marginTop: 4, background: 'none', border: 'none', color: 'var(--accent)', fontSize: 10, cursor: 'pointer', textAlign: 'center' }}>Remove</button>
                                        )}
                                    </div>
                                    <div style={{ flex: 1, marginRight: 36 }}>
                                        <input type="text" className="form-input" style={{ marginBottom: 8, fontWeight: 500 }} value={p.practitioner_name} onChange={e => updatePractitioner(p.id, 'practitioner_name', e.target.value)} placeholder="Full name…" />
                                        <input type="text" className="form-input" style={{ marginBottom: 8, fontSize: 13 }} value={p.practitioner_title} onChange={e => updatePractitioner(p.id, 'practitioner_title', e.target.value)} placeholder="Title & experience (e.g. Remedial Massage Therapist • 12 years)" />
                                        {/* Service tags */}
                                        <div className="practitioner-services">
                                            {(p.services || []).map(tag => (
                                                <span key={tag} className="practitioner-service-tag" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                                                    {tag}
                                                    <X size={10} style={{ cursor: 'pointer' }} onClick={() => removeServiceTag(p.id, tag)} />
                                                </span>
                                            ))}
                                            <button className="wa-tag-add" style={{ fontSize: 11 }} onClick={() => {
                                                const tag = prompt('Add service tag:');
                                                if (tag?.trim()) addServiceTag(p.id, tag.trim());
                                            }}><Plus size={10} /> Add</button>
                                        </div>
                                    </div>
                                </div>
                                <div style={{ borderTop: '1px solid rgba(184,184,184,0.2)', paddingTop: 16 }}>
                                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
                                        <div className="toggle-container">
                                            <div className={`toggle${p.show_on_website ? ' active' : ''}`} onClick={() => updatePractitioner(p.id, 'show_on_website', !p.show_on_website)}>
                                                <div className="toggle-knob"></div>
                                            </div>
                                            <span className="toggle-label" style={{ fontSize: 11 }}>Show on website</span>
                                        </div>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 16 }}>
                                        <div>
                                            <label className="form-label" style={{ fontSize: 11, marginBottom: 4 }}>Website Display Title</label>
                                            <input type="text" className="form-input" style={{ fontSize: 12, padding: 8 }} value={p.website_display_title} onChange={e => updatePractitioner(p.id, 'website_display_title', e.target.value)} placeholder="e.g. Bodywork & Massage" />
                                        </div>
                                        <div>
                                            <label className="form-label" style={{ fontSize: 11, marginBottom: 4 }}>Website Description</label>
                                            <input type="text" className="form-input" style={{ fontSize: 12, padding: 8 }} value={p.website_description} onChange={e => updatePractitioner(p.id, 'website_description', e.target.value)} placeholder="Brief description for public listing…" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {practitioners.length > 0 && (
                            <button className="add-service-btn" style={{ marginTop: 16 }} onClick={() => { setPractitioners(prev => [...prev, blankPractitioner()]); setHasChanges(true); }}>
                                <Plus size={18} strokeWidth={1.5} />Add Another Practitioner
                            </button>
                        )}
                    </div>
                </div>
            </section>

            {/* ── Service Notes ── */}
            <section className="form-section">
                <div className="form-section-header">
                    <h3 className="form-section-title">Additional Service Notes</h3>
                </div>
                <div className="form-section-body">
                    <div className="form-group">
                        <label className="form-label">Notes for Retreat Hosts & Guests</label>
                        <textarea className="form-input form-textarea" rows={4} value={config.service_notes} onChange={e => updateConfig('service_notes', e.target.value)} placeholder="Any additional information about wellness services…" />
                    </div>
                </div>
            </section>

        </div>
    );
}
