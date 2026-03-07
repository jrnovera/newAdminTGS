import { useState, useEffect, useCallback, useRef } from 'react';
import { Plus, GripVertical, X, UploadCloud, Save, Loader, Trash2, Edit2, Check } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { uploadFile } from '../../lib/storage';
import type { Venue } from '../../context/VenueContext';

interface Props {
    venue: Venue;
    onUpdate: (updates: Partial<Venue>) => void;
}

// ─── Config stored in venue_wellness_services ─────────────────────────────────
interface Config {
    services_hero_image: string;
    services_tab_label: string;
    services_tab_subtitle: string;
    service_description: string;
    practitioner_specialties: string;
    membership_details: string;
    price_range: string;
    package_pricing: boolean;
    membership_options: boolean;
    drop_in_welcome: boolean;
    appointment_required: boolean;
    online_booking_available: boolean;
    onsite_nutritionist: boolean;
    offering_tags: string[];
    massage_types: string[];
    program_tags: string[];
    dietary_tags: string[];
    meal_plan_tags: string[];
    duration_tags: string[];
    staff_languages: string[];
    service_categories: ServiceCategory[];
    featured_service_ids: string[];
}

interface ServiceCategory { id: string; name: string; show: boolean; }

// ─── Individual service items ─────────────────────────────────────────────────
interface ServiceItem {
    id: string;
    name: string;
    display_name: string;
    category: string;
    service_type: string;
    primary_category: string;
    duration: string;
    price: string;
    description: string;
    tags: string[];
    is_featured: boolean;
    is_popular: boolean;
    is_new: boolean;
    show_on_website: boolean;
    image_url: string;
    sort_order: number;
    isNew?: boolean;
    expanded?: boolean;
}

// ─── Practitioners ─────────────────────────────────────────────────────────────
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
    services_tab_label: 'Experiences & Treatments',
    services_tab_subtitle: 'Restore, rejuvenate, reconnect',
    service_description: '',
    practitioner_specialties: '',
    membership_details: '',
    price_range: '',
    package_pricing: true,
    membership_options: true,
    drop_in_welcome: false,
    appointment_required: true,
    online_booking_available: true,
    onsite_nutritionist: false,
    offering_tags: ['Massage', 'Facials', 'Aromatherapy', 'Body Treatments', 'Reflexology', 'Infrared Sauna'],
    massage_types: ['Swedish', 'Deep Tissue', 'Hot Stone', 'Aromatherapy', 'Pregnancy', 'Reflexology'],
    program_tags: ['Stress Management', 'Detox Program', 'Anti-Aging'],
    dietary_tags: ['Vegan', 'Gluten-Free', 'Dairy-Free'],
    meal_plan_tags: ['Light Refreshments', 'Herbal Teas'],
    duration_tags: ['30min', '45min', '60min', '90min', '2hr', 'Half Day'],
    staff_languages: ['English'],
    service_categories: [
        { id: '1', name: 'Massage', show: true },
        { id: '2', name: 'Thermal & Water', show: true },
        { id: '3', name: 'Facials', show: true },
        { id: '4', name: 'Body Treatments', show: true },
    ],
    featured_service_ids: [],
};

function blankService(order: number): ServiceItem {
    return {
        id: `new-${Date.now()}`,
        name: '', display_name: '', category: '', service_type: 'Single Treatment',
        primary_category: 'Massage Bodywork', duration: '', price: '', description: '',
        tags: [], is_featured: false, is_popular: false, is_new: true,
        show_on_website: true, image_url: '', sort_order: order, isNew: true, expanded: true,
    };
}

function blankPractitioner(): Practitioner {
    return {
        id: `new-${Date.now()}`, avatar_url: '', practitioner_name: '', practitioner_title: '',
        services: [], website_display_title: '', website_description: '',
        show_on_website: true, sort_order: 0, isNew: true,
    };
}

export default function WellnessServicesTab({ venue, onUpdate: _onUpdate }: Props) {
    const [config, setConfig] = useState<Config>(DEFAULT_CONFIG);
    const [services, setServices] = useState<ServiceItem[]>([]);
    const [practitioners, setPractitioners] = useState<Practitioner[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);
    const [uploadingHero, setUploadingHero] = useState(false);
    const [uploadingServiceImg, setUploadingServiceImg] = useState<string | null>(null);
    const [uploadingAvatar, setUploadingAvatar] = useState<string | null>(null);
    const heroInputRef = useRef<HTMLInputElement>(null);
    const serviceImgRefs = useRef<Record<string, HTMLInputElement | null>>({});
    const avatarInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

    // ─── Load ──────────────────────────────────────────────────────────────
    const fetchData = useCallback(async () => {
        if (!venue.id) return;
        setLoading(true);
        const [{ data: cfgRow }, { data: svcRows }, { data: practRows }] = await Promise.all([
            supabase.from('venue_wellness_services').select('*').eq('venue_id', venue.id).eq('venue_type', 'wellness').single(),
            supabase.from('wellness_service_items').select('*').eq('venue_id', venue.id).order('sort_order'),
            supabase.from('venue_practitioners').select('*').eq('venue_id', venue.id).eq('venue_type', 'wellness').order('sort_order'),
        ]);

        if (cfgRow) {
            setConfig({
                services_hero_image: cfgRow.services_hero_image || '',
                services_tab_label: cfgRow.services_tab_label || 'Experiences & Treatments',
                services_tab_subtitle: cfgRow.services_tab_subtitle || 'Restore, rejuvenate, reconnect',
                service_description: cfgRow.service_description || '',
                practitioner_specialties: cfgRow.practitioner_specialties || '',
                membership_details: cfgRow.membership_details || '',
                price_range: cfgRow.price_range || '',
                package_pricing: cfgRow.package_pricing ?? true,
                membership_options: cfgRow.membership_options ?? true,
                drop_in_welcome: cfgRow.drop_in_welcome ?? false,
                appointment_required: cfgRow.appointment_required ?? true,
                online_booking_available: cfgRow.online_booking_available ?? true,
                onsite_nutritionist: cfgRow.onsite_nutritionist ?? false,
                offering_tags: cfgRow.offering_tags || DEFAULT_CONFIG.offering_tags,
                massage_types: cfgRow.massage_types || DEFAULT_CONFIG.massage_types,
                program_tags: cfgRow.program_tags || DEFAULT_CONFIG.program_tags,
                dietary_tags: cfgRow.dietary_tags || DEFAULT_CONFIG.dietary_tags,
                meal_plan_tags: cfgRow.meal_plan_tags || DEFAULT_CONFIG.meal_plan_tags,
                duration_tags: cfgRow.duration_tags || DEFAULT_CONFIG.duration_tags,
                staff_languages: cfgRow.staff_languages || DEFAULT_CONFIG.staff_languages,
                service_categories: cfgRow.service_categories || DEFAULT_CONFIG.service_categories,
                featured_service_ids: cfgRow.featured_service_ids || [],
            });
        }

        if (svcRows) {
            setServices(svcRows.map(r => ({
                id: r.id, name: r.name || '', display_name: r.display_name || '',
                category: r.category || '', service_type: r.service_type || 'Single Treatment',
                primary_category: r.primary_category || '', duration: r.duration || '',
                price: r.price || '', description: r.description || '', tags: r.tags || [],
                is_featured: r.is_featured ?? false, is_popular: r.is_popular ?? false,
                is_new: r.is_new ?? false, show_on_website: r.show_on_website ?? true,
                image_url: r.image_url || '', sort_order: r.sort_order || 0, expanded: false,
            })));
        }

        if (practRows) {
            setPractitioners(practRows.map(r => ({
                id: r.id, avatar_url: r.avatar_url || '',
                practitioner_name: r.practitioner_name || '', practitioner_title: r.practitioner_title || '',
                services: r.services || [], website_display_title: r.website_display_title || '',
                website_description: r.website_description || '', show_on_website: r.show_on_website ?? true,
                sort_order: r.sort_order || 0,
            })));
        }
        setLoading(false);
    }, [venue.id]);

    useEffect(() => { fetchData(); }, [fetchData]);

    // ─── Config helpers ────────────────────────────────────────────────────
    function updateConfig<K extends keyof Config>(key: K, value: Config[K]) {
        setConfig(prev => ({ ...prev, [key]: value }));
        setHasChanges(true);
    }

    function updateTagList(key: keyof Config, tag: string, remove = false) {
        setConfig(prev => {
            const arr = (prev[key] as string[]) || [];
            const next = remove ? arr.filter(t => t !== tag) : arr.includes(tag) ? arr : [...arr, tag];
            return { ...prev, [key]: next };
        });
        setHasChanges(true);
    }

    function addTag(key: keyof Config) {
        const tag = prompt('Enter new tag:');
        if (tag?.trim()) updateTagList(key, tag.trim());
    }

    // ─── Service helpers ───────────────────────────────────────────────────
    function updateService(id: string, field: keyof ServiceItem, value: any) {
        setServices(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
        setHasChanges(true);
    }

    function toggleServiceExpand(id: string) {
        setServices(prev => prev.map(s => s.id === id ? { ...s, expanded: !s.expanded } : s));
    }

    function removeService(id: string) {
        setServices(prev => prev.filter(s => s.id !== id));
        setHasChanges(true);
    }

    // ─── Practitioner helpers ──────────────────────────────────────────────
    function updatePractitioner(id: string, field: keyof Practitioner, value: any) {
        setPractitioners(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
        setHasChanges(true);
    }

    function addPractTag(id: string) {
        const tag = prompt('Add service tag:');
        if (tag?.trim()) {
            setPractitioners(prev => prev.map(p => p.id === id ? { ...p, services: [...p.services, tag.trim()] } : p));
            setHasChanges(true);
        }
    }

    function removePractTag(id: string, tag: string) {
        setPractitioners(prev => prev.map(p => p.id === id ? { ...p, services: p.services.filter(s => s !== tag) } : p));
        setHasChanges(true);
    }

    // ─── Image uploads ─────────────────────────────────────────────────────
    async function handleHeroUpload(file: File) {
        setUploadingHero(true);
        try { const url = await uploadFile(file, 'photo'); updateConfig('services_hero_image', url); }
        catch (err) { console.error(err); }
        setUploadingHero(false);
    }

    async function handleServiceImgUpload(file: File, svcId: string) {
        setUploadingServiceImg(svcId);
        try { const url = await uploadFile(file, 'photo'); updateService(svcId, 'image_url', url); }
        catch (err) { console.error(err); }
        setUploadingServiceImg(null);
    }

    async function handleAvatarUpload(file: File, practId: string) {
        setUploadingAvatar(practId);
        try { const url = await uploadFile(file, 'photo'); updatePractitioner(practId, 'avatar_url', url); }
        catch (err) { console.error(err); }
        setUploadingAvatar(null);
    }

    // ─── Save ──────────────────────────────────────────────────────────────
    async function handleSave() {
        setSaving(true);

        // 1. Upsert venue_wellness_services config
        const cfgPayload = {
            venue_id: venue.id, venue_type: 'wellness',
            services_hero_image: config.services_hero_image || null,
            services_tab_label: config.services_tab_label,
            services_tab_subtitle: config.services_tab_subtitle,
            service_description: config.service_description || null,
            practitioner_specialties: config.practitioner_specialties || null,
            membership_details: config.membership_details || null,
            price_range: config.price_range || null,
            package_pricing: config.package_pricing,
            membership_options: config.membership_options,
            drop_in_welcome: config.drop_in_welcome,
            appointment_required: config.appointment_required,
            online_booking_available: config.online_booking_available,
            onsite_nutritionist: config.onsite_nutritionist,
            offering_tags: config.offering_tags,
            massage_types: config.massage_types,
            program_tags: config.program_tags,
            dietary_tags: config.dietary_tags,
            meal_plan_tags: config.meal_plan_tags,
            duration_tags: config.duration_tags,
            staff_languages: config.staff_languages,
            service_categories: config.service_categories,
            featured_service_ids: config.featured_service_ids,
        };
        const { error: cfgErr } = await supabase.from('venue_wellness_services').upsert(cfgPayload, { onConflict: 'venue_id,venue_type' });
        if (cfgErr) console.error('[WellnessServicesTab] config save:', cfgErr);

        // 2. Sync wellness_service_items — delete existing + reinsert
        await supabase.from('wellness_service_items').delete().eq('venue_id', venue.id);
        if (services.length > 0) {
            const rows = services.map((s, i) => ({
                venue_id: venue.id,
                name: s.name, display_name: s.display_name, category: s.category,
                service_type: s.service_type, primary_category: s.primary_category,
                duration: s.duration, price: s.price, description: s.description,
                tags: s.tags, is_featured: s.is_featured, is_popular: s.is_popular,
                is_new: s.is_new, show_on_website: s.show_on_website,
                image_url: s.image_url || null, sort_order: i,
            }));
            const { error: svcErr } = await supabase.from('wellness_service_items').insert(rows);
            if (svcErr) console.error('[WellnessServicesTab] services save:', svcErr);
        }

        // 3. Sync venue_practitioners — delete + reinsert
        await supabase.from('venue_practitioners').delete().eq('venue_id', venue.id).eq('venue_type', 'wellness');
        if (practitioners.length > 0) {
            const rows = practitioners.map((p, i) => ({
                venue_id: venue.id, venue_type: 'wellness',
                avatar_url: p.avatar_url || null, practitioner_name: p.practitioner_name,
                practitioner_title: p.practitioner_title, services: p.services,
                website_display_title: p.website_display_title, website_description: p.website_description,
                show_on_website: p.show_on_website, sort_order: i,
            }));
            const { error: practErr } = await supabase.from('venue_practitioners').insert(rows);
            if (practErr) console.error('[WellnessServicesTab] practitioners save:', practErr);
        }

        if (cfgErr) {
            alert('Failed to save services. Please try again.');
        } else {
            setHasChanges(false);
            alert('Services saved successfully!');
            fetchData();
        }
        setSaving(false);
    }

    // ─── Computed stats ────────────────────────────────────────────────────
    const stats = {
        totalServices: services.filter(s => s.show_on_website).length,
        practitioners: practitioners.filter(p => p.show_on_website).length,
        categories: config.service_categories.filter(c => c.show).length,
        fromPrice: services.reduce((min, s) => {
            const p = parseFloat(s.price.replace(/[^0-9.]/g, ''));
            return !isNaN(p) && p < min ? p : min;
        }, Infinity),
        onlineBooking: config.online_booking_available,
    };

    if (loading) {
        return <div style={{ padding: 40, textAlign: 'center', color: 'var(--accent)', fontSize: 14 }}>Loading services…</div>;
    }

    return (
        <div className="wvd-content">

            {/* Floating Save */}
            {hasChanges && (
                <div style={{ position: 'sticky', top: 12, zIndex: 100, display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
                    <button className="btn btn-primary" onClick={handleSave} disabled={saving} style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}>
                        <Save size={16} style={{ marginRight: 6 }} />
                        {saving ? 'Saving…' : 'Save Services'}
                    </button>
                </div>
            )}

            {/* ── Stats Bar ── */}
            <div className="wa-summary-stats">
                <div className="wa-summary-stat"><div className="wa-summary-value">{stats.totalServices}</div><div className="wa-summary-label">Active Services</div></div>
                <div className="wa-summary-stat"><div className="wa-summary-value">{stats.practitioners}</div><div className="wa-summary-label">Practitioners</div></div>
                <div className="wa-summary-stat"><div className="wa-summary-value">{stats.categories}</div><div className="wa-summary-label">Categories</div></div>
                <div className="wa-summary-stat"><div className="wa-summary-value">{isFinite(stats.fromPrice) ? `$${stats.fromPrice}` : '—'}</div><div className="wa-summary-label">From Price</div></div>
                <div className="wa-summary-stat"><div className="wa-summary-value">{stats.onlineBooking ? 'Yes' : 'No'}</div><div className="wa-summary-label">Online Booking</div></div>
            </div>

            {/* ── Tab Hero Image ── */}
            <section className="wvd-form-section">
                <div className="wvd-form-section-header">
                    <div><h3 className="wvd-form-section-title">Services Tab Hero Image</h3>
                        <p className="wvd-form-hint">Hero image displayed at the top of your Services tab on the public listing</p></div>
                </div>
                <div className="wvd-form-section-body">
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
                        <div onClick={() => heroInputRef.current?.click()} style={{ height: 200, border: '2px dashed rgba(184,184,184,0.4)', borderRadius: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--secondary-bg)', cursor: 'pointer' }}>
                            <UploadCloud size={40} color="#B8B8B8" strokeWidth={1.5} />
                            <span style={{ fontSize: 12, color: 'var(--accent)', marginTop: 8 }}>Click to upload hero image</span>
                            <span style={{ fontSize: 11, color: 'var(--accent)' }}>Recommended: 1920 × 600px</span>
                        </div>
                    )}
                </div>
            </section>

            {/* ── Services Tab Header ── */}
            <section className="wvd-form-section">
                <div className="wvd-form-section-header">
                    <div><h3 className="wvd-form-section-title">Services Tab Header</h3>
                        <p className="wvd-form-hint">Header content for the Services tab on your public listing</p></div>
                </div>
                <div className="wvd-form-section-body">
                    <div className="wvd-form-grid">
                        <div className="wvd-form-group">
                            <label className="wvd-form-label">Section Label</label>
                            <input type="text" className="wvd-form-input" value={config.services_tab_label} onChange={e => updateConfig('services_tab_label', e.target.value)} placeholder="e.g. Experiences & Treatments" />
                        </div>
                        <div className="wvd-form-group">
                            <label className="wvd-form-label">Section Subtitle</label>
                            <input type="text" className="wvd-form-input" value={config.services_tab_subtitle} onChange={e => updateConfig('services_tab_subtitle', e.target.value)} placeholder="e.g. Restore, rejuvenate, reconnect" />
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Featured Experiences ── */}
            <section className="wvd-form-section">
                <div className="wvd-form-section-header">
                    <div><h3 className="wvd-form-section-title">Featured Experiences</h3>
                        <p className="wvd-form-hint">Select up to 3 services to feature on your Overview tab</p></div>
                    <span style={{ fontSize: 12, color: 'var(--success)', fontWeight: 500 }}>{config.featured_service_ids.length} featured</span>
                </div>
                <div className="wvd-form-section-body">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                        {[0, 1, 2].map(idx => {
                            const svcId = config.featured_service_ids[idx] || '';
                            const svc = services.find(s => s.id === svcId);
                            return (
                                <div key={idx} className="ws-featured-card">
                                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                                        <div className="ws-featured-upload-box">
                                            {svc?.image_url ? <img src={svc.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 6 }} /> : <UploadCloud size={16} strokeWidth={1.5} color="#B8B8B8" />}
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <select className="wvd-form-input wvd-form-select" style={{ fontSize: 11, padding: '6px 8px', marginBottom: 4 }} value={svcId}
                                                onChange={e => {
                                                    const ids = [...config.featured_service_ids];
                                                    ids[idx] = e.target.value;
                                                    updateConfig('featured_service_ids', ids.filter(Boolean));
                                                }}>
                                                <option value="">— Select service —</option>
                                                {services.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                            </select>
                                            {svc && <div style={{ fontSize: 10, color: 'var(--accent)' }}>{svc.duration} — {svc.price}</div>}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <p className="wvd-form-hint" style={{ fontSize: 11, fontStyle: 'italic', marginTop: 12 }}>Add services in the Individual Services section below first.</p>
                </div>
            </section>

            {/* ── Service Categories ── */}
            <section className="wvd-form-section">
                <div className="wvd-form-section-header">
                    <div><h3 className="wvd-form-section-title">Service Categories</h3>
                        <p className="wvd-form-hint">Organize services into categories for your public listing</p></div>
                    <button className="wvd-btn-secondary wvd-btn-small" onClick={() => {
                        updateConfig('service_categories', [...config.service_categories, { id: `cat-${Date.now()}`, name: 'New Category', show: true }]);
                    }}><Plus size={14} /> Add Category</button>
                </div>
                <div className="wvd-form-section-body">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {config.service_categories.map((cat, idx) => (
                            <div key={cat.id} className="ws-category-item">
                                <div style={{ cursor: 'grab', color: 'var(--accent)' }}><GripVertical size={16} /></div>
                                <span className="ws-category-number">{idx + 1}</span>
                                <input type="text" className="wvd-form-input" style={{ flex: 1, padding: '8px 12px' }} value={cat.name}
                                    onChange={e => {
                                        const cats = config.service_categories.map(c => c.id === cat.id ? { ...c, name: e.target.value } : c);
                                        updateConfig('service_categories', cats);
                                    }} />
                                <span style={{ fontSize: 12, color: 'var(--accent)' }}>{services.filter(s => s.category === cat.name).length} services</span>
                                <div className="wvd-toggle-container">
                                    <div className={`wvd-toggle${cat.show ? ' active' : ''}`} style={{ width: 36, height: 20 }}
                                        onClick={() => updateConfig('service_categories', config.service_categories.map(c => c.id === cat.id ? { ...c, show: !c.show } : c))}>
                                        <div className="wvd-toggle-knob" style={{ width: 16, height: 16 }}></div>
                                    </div>
                                    <span className="wvd-toggle-label" style={{ fontSize: 11 }}>Show</span>
                                </div>
                                <button onClick={() => updateConfig('service_categories', config.service_categories.filter(c => c.id !== cat.id))}
                                    style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', padding: 4 }}>
                                    <X size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Treatment & Technology Tags ── */}
            <section className="wvd-form-section">
                <div className="wvd-form-section-header">
                    <h3 className="wvd-form-section-title">Treatment & Technology Tags</h3>
                </div>
                <div className="wvd-form-section-body">
                    {[
                        { key: 'offering_tags' as keyof Config, label: 'Service Offerings' },
                        { key: 'massage_types' as keyof Config, label: 'Massage Types' },
                        { key: 'program_tags' as keyof Config, label: 'Wellness Programs Offered' },
                    ].map(({ key, label }) => (
                        <div className="wvd-form-group" key={key} style={{ marginBottom: 20 }}>
                            <label className="wvd-form-label">{label}</label>
                            <div className="wa-tag-container">
                                {((config[key] as string[]) || []).map(tag => (
                                    <span key={tag} className="wa-tag">{tag}<X size={12} className="wa-tag-remove" onClick={() => updateTagList(key, tag, true)} /></span>
                                ))}
                                <button className="wa-tag-add" onClick={() => addTag(key)}><Plus size={10} /> Add</button>
                            </div>
                        </div>
                    ))}
                    <div className="wvd-form-group wvd-full-width">
                        <label className="wvd-form-label">Wellness Services Detailed Description</label>
                        <textarea className="wvd-form-input wvd-form-textarea" rows={4} value={config.service_description} onChange={e => updateConfig('service_description', e.target.value)} placeholder="Describe your services in detail…" />
                    </div>
                </div>
            </section>

            {/* ── Practitioners ── */}
            <section className="wvd-form-section">
                <div className="wvd-form-section-header">
                    <h3 className="wvd-form-section-title">Practitioners</h3>
                </div>
                <div className="wvd-form-section-body">
                    <div className="wvd-form-grid">
                        <div className="wvd-form-group">
                            <label className="wvd-form-label">Languages Spoken by Staff</label>
                            <div className="wa-tag-container">
                                {(config.staff_languages || []).map(tag => (
                                    <span key={tag} className="wa-tag">{tag}<X size={12} className="wa-tag-remove" onClick={() => updateTagList('staff_languages', tag, true)} /></span>
                                ))}
                                <button className="wa-tag-add" onClick={() => addTag('staff_languages')}><Plus size={10} /> Add</button>
                            </div>
                        </div>
                        <div className="wvd-form-group wvd-full-width">
                            <label className="wvd-form-label">Practitioner Specialties</label>
                            <textarea className="wvd-form-input wvd-form-textarea" rows={3} value={config.practitioner_specialties} onChange={e => updateConfig('practitioner_specialties', e.target.value)} placeholder="Describe your practitioners' qualifications and specialties…" />
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Booking & Availability ── */}
            <section className="wvd-form-section">
                <div className="wvd-form-section-header">
                    <h3 className="wvd-form-section-title">Booking & Availability</h3>
                </div>
                <div className="wvd-form-section-body">
                    <div className="wvd-form-grid">
                        <div className="wvd-form-group">
                            <label className="wvd-form-label">Service Duration Options</label>
                            <div className="wa-tag-container">
                                {(config.duration_tags || []).map(tag => (
                                    <span key={tag} className="wa-tag">{tag}<X size={12} className="wa-tag-remove" onClick={() => updateTagList('duration_tags', tag, true)} /></span>
                                ))}
                                <button className="wa-tag-add" onClick={() => addTag('duration_tags')}><Plus size={10} /> Add</button>
                            </div>
                        </div>
                        <div className="wvd-form-group">
                            <label className="wvd-form-label">Price Range Per Session</label>
                            <input type="text" className="wvd-form-input" value={config.price_range} onChange={e => updateConfig('price_range', e.target.value)} placeholder="e.g. $85 – $350" />
                        </div>
                        {[
                            { key: 'package_pricing' as keyof Config, label: 'Package Pricing Available' },
                            { key: 'membership_options' as keyof Config, label: 'Membership Options Available' },
                            { key: 'drop_in_welcome' as keyof Config, label: 'Drop-in Welcome' },
                            { key: 'appointment_required' as keyof Config, label: 'Appointment Required' },
                            { key: 'online_booking_available' as keyof Config, label: 'Online Booking Available' },
                            { key: 'onsite_nutritionist' as keyof Config, label: 'On-site Nutritionist' },
                        ].map(({ key, label }) => (
                            <div className="wvd-form-group" key={key}>
                                <label className="wvd-form-label">{label}</label>
                                <div className="wvd-toggle-container">
                                    <div className={`wvd-toggle${config[key] ? ' active' : ''}`} onClick={() => updateConfig(key, !config[key])}>
                                        <div className="wvd-toggle-knob"></div>
                                    </div>
                                    <span className="wvd-toggle-label">{config[key] ? 'Yes' : 'No'}</span>
                                </div>
                            </div>
                        ))}
                        <div className="wvd-form-group wvd-full-width">
                            <label className="wvd-form-label">Membership Details</label>
                            <textarea className="wvd-form-input wvd-form-textarea" rows={3} value={config.membership_details} onChange={e => updateConfig('membership_details', e.target.value)} placeholder="Describe membership tiers and inclusions…" />
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Dietary & Nutrition ── */}
            <section className="wvd-form-section">
                <div className="wvd-form-section-header">
                    <div><h3 className="wvd-form-section-title">Dietary & Nutrition</h3>
                        <p className="wvd-form-hint">For venues with food service</p></div>
                </div>
                <div className="wvd-form-section-body">
                    <div className="wvd-form-grid">
                        {[
                            { key: 'dietary_tags' as keyof Config, label: 'Dietary Accommodations' },
                            { key: 'meal_plan_tags' as keyof Config, label: 'Meal Plans Available' },
                        ].map(({ key, label }) => (
                            <div className="wvd-form-group" key={key}>
                                <label className="wvd-form-label">{label}</label>
                                <div className="wa-tag-container">
                                    {((config[key] as string[]) || []).map(tag => (
                                        <span key={tag} className="wa-tag">{tag}<X size={12} className="wa-tag-remove" onClick={() => updateTagList(key, tag, true)} /></span>
                                    ))}
                                    <button className="wa-tag-add" onClick={() => addTag(key)}><Plus size={10} /> Add</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Individual Services ── */}
            <section className="wvd-form-section">
                <div className="wvd-form-section-header">
                    <div><h3 className="wvd-form-section-title">Individual Services</h3>
                        <p className="wvd-form-hint">Service inventory with website display options</p></div>
                    <button className="wvd-btn-secondary wvd-btn-small" onClick={() => { setServices(prev => [...prev, blankService(prev.length)]); setHasChanges(true); }}>
                        <Plus size={14} /> Add Service
                    </button>
                </div>
                <div className="wvd-form-section-body">
                    <div className="ws-services-list">
                        {services.length === 0 && (
                            <p style={{ color: 'var(--accent)', fontSize: 13, textAlign: 'center', padding: '24px 0' }}>No services added yet.</p>
                        )}
                        {services.map(svc => (
                            <div key={svc.id} className="ws-service-card">
                                {/* Card Header */}
                                <div className="ws-service-card-header">
                                    <div className="ws-service-card-title">
                                        {svc.is_featured && <span className="ws-service-badge featured">Featured</span>}
                                        {svc.is_popular && <span className="ws-service-badge popular">Popular</span>}
                                        {svc.is_new && <span className="ws-service-badge new">New</span>}
                                        {svc.name || <span style={{ color: 'var(--accent)', fontStyle: 'italic' }}>Untitled service</span>}
                                    </div>
                                    <div className="ws-service-card-actions">
                                        <div className="wvd-toggle-container" style={{ marginRight: 16 }}>
                                            <div className={`wvd-toggle${svc.show_on_website ? ' active' : ''}`} style={{ width: 36, height: 20 }}
                                                onClick={() => updateService(svc.id, 'show_on_website', !svc.show_on_website)}>
                                                <div className="wvd-toggle-knob" style={{ width: 16, height: 16 }}></div>
                                            </div>
                                            <span className="wvd-toggle-label" style={{ fontSize: 11 }}>Show on Website</span>
                                        </div>
                                        <button className="wvd-btn-secondary wvd-btn-small" onClick={() => toggleServiceExpand(svc.id)}><Edit2 size={12} /> {svc.expanded ? 'Collapse' : 'Edit'}</button>
                                        <button onClick={() => removeService(svc.id)} style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', padding: '4px 6px', marginLeft: 4 }}><Trash2 size={14} /></button>
                                    </div>
                                </div>

                                {/* Collapsed preview */}
                                {!svc.expanded && (
                                    <div className="ws-service-card-body">
                                        <div className="ws-service-grid">
                                            <div className="ws-service-field"><div className="ws-service-label">Category</div><div className="ws-service-value">{svc.category || '—'}</div></div>
                                            <div className="ws-service-field"><div className="ws-service-label">Duration</div><div className="ws-service-value">{svc.duration || '—'}</div></div>
                                            <div className="ws-service-field"><div className="ws-service-label">Price</div><div className="ws-service-value">{svc.price || '—'}</div></div>
                                            <div className="ws-service-field"><div className="ws-service-label">Type</div><div className="ws-service-value">{svc.service_type}</div></div>
                                        </div>
                                    </div>
                                )}

                                {/* Expanded edit form */}
                                {svc.expanded && (
                                    <div className="ws-service-card-body">
                                        <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: 16, marginBottom: 16 }}>
                                            {/* Service Image */}
                                            <div>
                                                <input type="file" accept="image/*" style={{ display: 'none' }} ref={el => { serviceImgRefs.current[svc.id] = el; }}
                                                    onChange={e => { const f = e.target.files?.[0]; if (f) handleServiceImgUpload(f, svc.id); e.target.value = ''; }} />
                                                <div onClick={() => serviceImgRefs.current[svc.id]?.click()} style={{ width: 80, height: 60, border: '2px dashed rgba(184,184,184,0.4)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: 'var(--secondary-bg)', position: 'relative', overflow: 'hidden' }}>
                                                    {svc.image_url ? <img src={svc.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> :
                                                        uploadingServiceImg === svc.id ? <Loader size={16} color="var(--accent)" strokeWidth={1.5} /> :
                                                            <UploadCloud size={18} color="#B8B8B8" strokeWidth={1.5} />}
                                                </div>
                                                {svc.image_url && <button onClick={() => updateService(svc.id, 'image_url', '')} style={{ display: 'block', width: '100%', marginTop: 2, background: 'none', border: 'none', color: 'var(--accent)', fontSize: 9, cursor: 'pointer' }}>Remove</button>}
                                            </div>
                                            <div>
                                                <div className="ws-service-website-fields">
                                                    <div className="wvd-form-group" style={{ marginBottom: 0 }}>
                                                        <label className="wvd-form-label" style={{ fontSize: 10 }}>Internal Name</label>
                                                        <input type="text" className="wvd-form-input" style={{ padding: '6px 10px', fontSize: 12 }} value={svc.name} onChange={e => updateService(svc.id, 'name', e.target.value)} placeholder="Internal service name…" />
                                                    </div>
                                                    <div className="wvd-form-group" style={{ marginBottom: 0 }}>
                                                        <label className="wvd-form-label" style={{ fontSize: 10 }}>Website Display Name</label>
                                                        <input type="text" className="wvd-form-input" style={{ padding: '6px 10px', fontSize: 12 }} value={svc.display_name} onChange={e => updateService(svc.id, 'display_name', e.target.value)} placeholder="Name shown on public listing…" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="ws-service-grid">
                                            <div className="wvd-form-group" style={{ marginBottom: 0 }}>
                                                <label className="wvd-form-label" style={{ fontSize: 10 }}>Category</label>
                                                <select className="wvd-form-input wvd-form-select" style={{ padding: '6px 10px', fontSize: 12 }} value={svc.category} onChange={e => updateService(svc.id, 'category', e.target.value)}>
                                                    <option value="">— Select —</option>
                                                    {config.service_categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                                                </select>
                                            </div>
                                            <div className="wvd-form-group" style={{ marginBottom: 0 }}>
                                                <label className="wvd-form-label" style={{ fontSize: 10 }}>Service Type</label>
                                                <select className="wvd-form-input wvd-form-select" style={{ padding: '6px 10px', fontSize: 12 }} value={svc.service_type} onChange={e => updateService(svc.id, 'service_type', e.target.value)}>
                                                    <option>Single Treatment</option>
                                                    <option>Half-Day Experience</option>
                                                    <option>Full-Day Experience</option>
                                                    <option>Package</option>
                                                    <option>Membership</option>
                                                </select>
                                            </div>
                                            <div className="wvd-form-group" style={{ marginBottom: 0 }}>
                                                <label className="wvd-form-label" style={{ fontSize: 10 }}>Duration</label>
                                                <input type="text" className="wvd-form-input" style={{ padding: '6px 10px', fontSize: 12 }} value={svc.duration} onChange={e => updateService(svc.id, 'duration', e.target.value)} placeholder="e.g. 60 min" />
                                            </div>
                                            <div className="wvd-form-group" style={{ marginBottom: 0 }}>
                                                <label className="wvd-form-label" style={{ fontSize: 10 }}>Price</label>
                                                <input type="text" className="wvd-form-input" style={{ padding: '6px 10px', fontSize: 12 }} value={svc.price} onChange={e => updateService(svc.id, 'price', e.target.value)} placeholder="e.g. $140" />
                                            </div>
                                            <div className="wvd-form-group" style={{ gridColumn: 'span 4', marginBottom: 0 }}>
                                                <label className="wvd-form-label" style={{ fontSize: 10 }}>Description</label>
                                                <textarea className="wvd-form-input wvd-form-textarea" rows={2} style={{ padding: '6px 10px', fontSize: 12 }} value={svc.description} onChange={e => updateService(svc.id, 'description', e.target.value)} placeholder="Service description…" />
                                            </div>
                                            <div className="wvd-form-group" style={{ gridColumn: 'span 4', marginBottom: 0 }}>
                                                <label className="wvd-form-label" style={{ fontSize: 10 }}>Treatment Tags</label>
                                                <div className="wa-tag-container" style={{ padding: '4px 8px' }}>
                                                    {(svc.tags || []).map(tag => (
                                                        <span key={tag} className="wa-tag">{tag}<X size={10} className="wa-tag-remove" onClick={() => updateService(svc.id, 'tags', svc.tags.filter(t => t !== tag))} /></span>
                                                    ))}
                                                    <button className="wa-tag-add" onClick={() => { const t = prompt('Add tag:'); if (t?.trim()) updateService(svc.id, 'tags', [...svc.tags, t.trim()]); }}><Plus size={10} /> Add</button>
                                                </div>
                                            </div>
                                        </div>
                                        {/* Badges */}
                                        <div style={{ display: 'flex', gap: 16, marginTop: 12 }}>
                                            {[
                                                { key: 'is_featured', label: 'Featured' },
                                                { key: 'is_popular', label: 'Popular' },
                                                { key: 'is_new', label: 'New' },
                                            ].map(({ key, label }) => (
                                                <label key={key} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, cursor: 'pointer' }}>
                                                    <div onClick={() => updateService(svc.id, key as keyof ServiceItem, !(svc as any)[key])}
                                                        style={{ width: 16, height: 16, border: '2px solid', borderColor: (svc as any)[key] ? 'var(--success)' : 'rgba(184,184,184,0.5)', borderRadius: 3, background: (svc as any)[key] ? 'var(--success)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                                                        {(svc as any)[key] && <Check size={10} color="#fff" strokeWidth={3} />}
                                                    </div>
                                                    {label}
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}

                        <button className="ws-add-service-btn" onClick={() => { setServices(prev => [...prev, blankService(prev.length)]); setHasChanges(true); }}>
                            <Plus size={18} /> Add Another Service
                        </button>
                    </div>
                </div>
            </section>

            {/* ── On-site Practitioners ── */}
            <section className="wvd-form-section">
                <div className="wvd-form-section-header">
                    <div><h3 className="wvd-form-section-title">On-site Practitioners</h3>
                        <p className="wvd-form-hint">Wellness professionals displayed on your public listing</p></div>
                    <button className="wvd-btn-secondary wvd-btn-small" onClick={() => { setPractitioners(prev => [...prev, blankPractitioner()]); setHasChanges(true); }}>
                        <Plus size={14} /> Add Practitioner
                    </button>
                </div>
                <div className="wvd-form-section-body">
                    <div className="practitioner-cards" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {practitioners.length === 0 && (
                            <p style={{ color: 'var(--accent)', fontSize: 13, textAlign: 'center', padding: '24px 0' }}>No practitioners added yet.</p>
                        )}
                        {practitioners.map(p => (
                            <div key={p.id} className="practitioner-card" style={{ position: 'relative' }}>
                                <button onClick={() => { setPractitioners(prev => prev.filter(x => x.id !== p.id)); setHasChanges(true); }}
                                    style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(220,53,69,0.1)', border: '1px solid rgba(220,53,69,0.3)', borderRadius: 4, color: '#dc3545', cursor: 'pointer', padding: '4px 8px', fontSize: 11 }}>
                                    <Trash2 size={12} />
                                </button>
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 16 }}>
                                    <div>
                                        <input type="file" accept="image/*" style={{ display: 'none' }} ref={el => { avatarInputRefs.current[p.id] = el; }}
                                            onChange={e => { const f = e.target.files?.[0]; if (f) handleAvatarUpload(f, p.id); e.target.value = ''; }} />
                                        <div className="practitioner-avatar-placeholder" onClick={() => avatarInputRefs.current[p.id]?.click()} style={{ cursor: 'pointer', overflow: 'hidden', position: 'relative' }}>
                                            {p.avatar_url ? <img src={p.avatar_url} alt={p.practitioner_name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} /> :
                                                uploadingAvatar === p.id ? <Loader size={24} color="var(--accent)" strokeWidth={1.5} /> :
                                                    <UploadCloud size={32} color="#B8B8B8" strokeWidth={1.5} />}
                                        </div>
                                        {p.avatar_url && <button onClick={() => updatePractitioner(p.id, 'avatar_url', '')} style={{ display: 'block', width: '100%', marginTop: 4, background: 'none', border: 'none', color: 'var(--accent)', fontSize: 10, cursor: 'pointer', textAlign: 'center' }}>Remove</button>}
                                    </div>
                                    <div style={{ flex: 1, marginRight: 36 }}>
                                        <input type="text" className="wvd-form-input" style={{ marginBottom: 8, fontWeight: 500 }} value={p.practitioner_name} onChange={e => updatePractitioner(p.id, 'practitioner_name', e.target.value)} placeholder="Full name…" />
                                        <input type="text" className="wvd-form-input" style={{ marginBottom: 8, fontSize: 13 }} value={p.practitioner_title} onChange={e => updatePractitioner(p.id, 'practitioner_title', e.target.value)} placeholder="Title & experience…" />
                                        <div className="practitioner-services">
                                            {(p.services || []).map(tag => (
                                                <span key={tag} className="practitioner-service-tag" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                                                    {tag}<X size={10} style={{ cursor: 'pointer' }} onClick={() => removePractTag(p.id, tag)} />
                                                </span>
                                            ))}
                                            <button className="wa-tag-add" style={{ fontSize: 11 }} onClick={() => addPractTag(p.id)}><Plus size={10} /> Add</button>
                                        </div>
                                    </div>
                                </div>
                                <div style={{ borderTop: '1px solid rgba(184,184,184,0.2)', paddingTop: 16 }}>
                                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
                                        <div className="wvd-toggle-container">
                                            <div className={`wvd-toggle${p.show_on_website ? ' active' : ''}`} onClick={() => updatePractitioner(p.id, 'show_on_website', !p.show_on_website)}>
                                                <div className="wvd-toggle-knob"></div>
                                            </div>
                                            <span className="wvd-toggle-label" style={{ fontSize: 11 }}>Show on website</span>
                                        </div>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 16 }}>
                                        <div>
                                            <label className="wvd-form-label" style={{ fontSize: 11, marginBottom: 4 }}>Website Display Title</label>
                                            <input type="text" className="wvd-form-input" style={{ fontSize: 12, padding: 8 }} value={p.website_display_title} onChange={e => updatePractitioner(p.id, 'website_display_title', e.target.value)} placeholder="e.g. Massage & Bodywork" />
                                        </div>
                                        <div>
                                            <label className="wvd-form-label" style={{ fontSize: 11, marginBottom: 4 }}>Website Description</label>
                                            <input type="text" className="wvd-form-input" style={{ fontSize: 12, padding: 8 }} value={p.website_description} onChange={e => updatePractitioner(p.id, 'website_description', e.target.value)} placeholder="Brief description for public listing…" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {practitioners.length > 0 && (
                            <button className="ws-add-service-btn" onClick={() => { setPractitioners(prev => [...prev, blankPractitioner()]); setHasChanges(true); }}>
                                <Plus size={18} strokeWidth={1.5} /> Add Another Practitioner
                            </button>
                        )}
                    </div>
                </div>
            </section>

        </div>
    );
}
