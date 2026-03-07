import { useState, useEffect, useRef } from 'react';
import { Check, Loader, UploadCloud, X, Plus, Trash2 } from 'lucide-react';
import type { Venue } from '../../context/VenueContext';
import { supabase } from '../../lib/supabase';
import { uploadFile } from '../../lib/storage';

interface Props {
    venue: Venue;
    onUpdate?: (updates: Partial<Venue>) => void;
}

interface Config {
    facilities_hero_image: string;
    section_label: string;
    section_title: string;
    section_subtitle: string;
    intro_paragraph: string;
    // Facility Summary
    facility_space_sqm: number;
    facility_philosophy: string;
    facility_highlights: string;
    // Treatment Rooms
    total_treatment_rooms: number;
    private_suites: number;
    couples_rooms: number;
    group_spaces: number;
    room_sizes: string;
    tables_available: boolean;
    specialized_equipment: string;
    room_features: string;
    // Supporting Facilities
    supporting_facilities: string[];
    steam_room_count: number;
    support_details: string;
    // Thermal & Sauna
    thermal_types: string[];
    indoor_pool_count: number;
    outdoor_pool_count: number;
    thermal_features: string;
    // Traditional Bathing
    bathing_sections: Record<string, any>;
    // Medical Spa
    med_spa_suites: boolean;
    med_suite_count: number;
    // Changing & Locker
    changing_details: string;
    shower_details: string;
    towels_provided: boolean;
    slippers_provided: boolean;
    changing_amenities: string;
    // Certifications
    med_certs: string;
    trad_certs: string;
    water_testing: string;
    safety_standards: string;
    sustainability: string;
    // Accessibility
    accessibility_features: string[];
    // Other
    other_facilities_available: boolean;
    other_facility_types: string;
}

interface FacilityItem {
    id?: string;
    facility_name: string;
    facility_image: string;
    show_on_website: boolean;
    is_available: boolean;
    website_display_title: string;
    website_description: string;
    facility_type: string;
    setting: string;
    capacity: number;
    temperature_range: string;
    is_private: boolean;
    operating_hours: string;
    pool_type: string;
    is_heated: boolean;
    pool_size: string;
    pool_depth: string;
    lap_swimming: boolean;
    plunge_type: string;
    hot_tub_type: string;
    features: string[];
    sort_order: number;
}

const DEFAULT_CONFIG: Config = {
    facilities_hero_image: '',
    section_label: 'Water & Healing',
    section_title: '',
    section_subtitle: '',
    intro_paragraph: '',
    facility_space_sqm: 0,
    facility_philosophy: '',
    facility_highlights: '',
    total_treatment_rooms: 0,
    private_suites: 0,
    couples_rooms: 0,
    group_spaces: 0,
    room_sizes: '',
    tables_available: true,
    specialized_equipment: '',
    room_features: '',
    supporting_facilities: [],
    steam_room_count: 0,
    support_details: '',
    thermal_types: [],
    indoor_pool_count: 0,
    outdoor_pool_count: 0,
    thermal_features: '',
    bathing_sections: {
        japanese: { active: false, title: 'Japanese Facilities (Onsen / Sento)', details: '' },
        korean: { active: false, title: 'Korean Facilities (Jjimjilbang)', details: '' },
        turkish: { active: false, title: 'Turkish / Moroccan Facilities (Hammam)', details: '' },
        russian: { active: false, title: 'Russian Facilities (Banya)', details: '' },
    },
    med_spa_suites: false,
    med_suite_count: 0,
    changing_details: '',
    shower_details: '',
    towels_provided: true,
    slippers_provided: true,
    changing_amenities: '',
    med_certs: '',
    trad_certs: '',
    water_testing: '',
    safety_standards: '',
    sustainability: '',
    accessibility_features: [],
    other_facilities_available: false,
    other_facility_types: '',
};

const SUPPORTING_OPTIONS = [
    'Relaxation Lounges', 'Meditation Rooms', 'Steam Rooms', 'Cold Plunge Pools',
    'Ice / Snow Rooms', 'Herbal Prep Rooms', 'Consultation Rooms', 'Integration / Rest Spaces',
];

const THERMAL_OPTIONS = [
    'Infrared Sauna', 'Traditional Dry Sauna', 'Steam Room', 'Indoor Thermal Pools',
    'Outdoor Thermal Pools', 'Mineral Spring Pools', 'Natural Hot Spring Pools', 'Geothermal Pools',
];

const ACCESS_OPTIONS = [
    'Wheelchair Accessible', 'Mobility Assistance', 'Accessible Pools',
    'Support Rails', 'Ground Level Access', 'Lift Available',
];

const FACILITY_TYPES = ['Sauna', 'Pool', 'Cold Plunge', 'Hot Tub / Spa', 'Treatment Room', 'Steam Room', 'Red Light Therapy', 'Float Pod', 'Relaxation Lounge', 'Other'];
const SETTINGS = ['Indoor', 'Outdoor', 'Semi-Outdoor'];

function blankFacility(order: number): FacilityItem {
    return {
        facility_name: '',
        facility_image: '',
        show_on_website: true,
        is_available: true,
        website_display_title: '',
        website_description: '',
        facility_type: '',
        setting: 'Indoor',
        capacity: 0,
        temperature_range: '',
        is_private: false,
        operating_hours: '',
        pool_type: '',
        is_heated: false,
        pool_size: '',
        pool_depth: '',
        lap_swimming: false,
        plunge_type: '',
        hot_tub_type: '',
        features: [],
        sort_order: order,
    };
}

export default function WellnessFacilitiesTab({ venue }: Props) {
    const [config, setConfig] = useState<Config>(DEFAULT_CONFIG);
    const [items, setItems] = useState<FacilityItem[]>([]);
    const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>({});
    const [saving, setSaving] = useState(false);
    const [saveMsg, setSaveMsg] = useState('');
    const [heroUploading, setHeroUploading] = useState(false);
    const [itemImageUploading, setItemImageUploading] = useState<Record<number, boolean>>({});
    const heroRef = useRef<HTMLInputElement>(null);
    const itemImageRefs = useRef<Record<number, HTMLInputElement | null>>({});

    async function fetchData() {
        const [cfgRes, itemsRes] = await Promise.all([
            supabase.from('venue_wellness_facilities').select('*').eq('venue_id', venue.id).eq('venue_type', 'wellness').maybeSingle(),
            supabase.from('wellness_facility_items').select('*').eq('venue_id', venue.id).eq('venue_type', 'wellness').order('sort_order'),
        ]);
        if (cfgRes.data) {
            const d = cfgRes.data;
            setConfig({
                facilities_hero_image: d.facilities_hero_image || '',
                section_label: d.section_label || 'Water & Healing',
                section_title: d.section_title || '',
                section_subtitle: d.section_subtitle || '',
                intro_paragraph: d.intro_paragraph || '',
                facility_space_sqm: d.facility_space_sqm ?? 0,
                facility_philosophy: d.facility_philosophy || '',
                facility_highlights: d.facility_highlights || '',
                total_treatment_rooms: d.total_treatment_rooms ?? 0,
                private_suites: d.private_suites ?? 0,
                couples_rooms: d.couples_rooms ?? 0,
                group_spaces: d.group_spaces ?? 0,
                room_sizes: d.room_sizes || '',
                tables_available: d.tables_available ?? true,
                specialized_equipment: d.specialized_equipment || '',
                room_features: d.room_features || '',
                supporting_facilities: d.supporting_facilities || [],
                steam_room_count: d.steam_room_count ?? 0,
                support_details: d.support_details || '',
                thermal_types: d.thermal_types || [],
                indoor_pool_count: d.indoor_pool_count ?? 0,
                outdoor_pool_count: d.outdoor_pool_count ?? 0,
                thermal_features: d.thermal_features || '',
                bathing_sections: d.bathing_sections || DEFAULT_CONFIG.bathing_sections,
                med_spa_suites: d.med_spa_suites ?? false,
                med_suite_count: d.med_suite_count ?? 0,
                changing_details: d.changing_details || '',
                shower_details: d.shower_details || '',
                towels_provided: d.towels_provided ?? true,
                slippers_provided: d.slippers_provided ?? true,
                changing_amenities: d.changing_amenities || '',
                med_certs: d.med_certs || '',
                trad_certs: d.trad_certs || '',
                water_testing: d.water_testing || '',
                safety_standards: d.safety_standards || '',
                sustainability: d.sustainability || '',
                accessibility_features: d.accessibility_features || [],
                other_facilities_available: d.other_facilities_available ?? false,
                other_facility_types: d.other_facility_types || '',
            });
        }
        if (itemsRes.data) {
            setItems(itemsRes.data.map((f: any) => ({
                id: f.id,
                facility_name: f.facility_name || '',
                facility_image: f.facility_image || '',
                show_on_website: f.show_on_website ?? true,
                is_available: f.is_available ?? true,
                website_display_title: f.website_display_title || '',
                website_description: f.website_description || '',
                facility_type: f.facility_type || '',
                setting: f.setting || 'Indoor',
                capacity: f.capacity ?? 0,
                temperature_range: f.temperature_range || '',
                is_private: f.is_private ?? false,
                operating_hours: f.operating_hours || '',
                pool_type: f.pool_type || '',
                is_heated: f.is_heated ?? false,
                pool_size: f.pool_size || '',
                pool_depth: f.pool_depth || '',
                lap_swimming: f.lap_swimming ?? false,
                plunge_type: f.plunge_type || '',
                hot_tub_type: f.hot_tub_type || '',
                features: f.features || [],
                sort_order: f.sort_order ?? 0,
            })));
        }
    }

    useEffect(() => { fetchData(); }, [venue.id]);

    function setConfigField<K extends keyof Config>(key: K, value: Config[K]) {
        setConfig(c => ({ ...c, [key]: value }));
    }

    function toggleArrayItem(field: 'supporting_facilities' | 'thermal_types' | 'accessibility_features', item: string) {
        setConfig(c => {
            const arr = c[field] as string[];
            return { ...c, [field]: arr.includes(item) ? arr.filter(i => i !== item) : [...arr, item] };
        });
    }

    function updateItem(idx: number, field: keyof FacilityItem, value: any) {
        setItems(prev => prev.map((f, i) => i === idx ? { ...f, [field]: value } : f));
    }

    function addItem() {
        const idx = items.length;
        setItems(prev => [...prev, blankFacility(idx)]);
        setExpandedItems(p => ({ ...p, [idx]: true }));
    }

    function deleteItem(idx: number) {
        setItems(prev => prev.filter((_, i) => i !== idx));
    }

    function addFeature(itemIdx: number, value: string) {
        if (!value.trim()) return;
        setItems(prev => prev.map((f, i) => i === itemIdx ? { ...f, features: [...f.features, value.trim()] } : f));
    }

    function removeFeature(itemIdx: number, featIdx: number) {
        setItems(prev => prev.map((f, i) => i === itemIdx ? { ...f, features: f.features.filter((_, j) => j !== featIdx) } : f));
    }

    async function handleHeroUpload(file: File) {
        setHeroUploading(true);
        try {
            const url = await uploadFile(file, 'photo');
            setConfigField('facilities_hero_image', url);
        } finally { setHeroUploading(false); }
    }

    async function handleItemImageUpload(idx: number, file: File) {
        setItemImageUploading(p => ({ ...p, [idx]: true }));
        try {
            const url = await uploadFile(file, 'photo');
            updateItem(idx, 'facility_image', url);
        } finally { setItemImageUploading(p => ({ ...p, [idx]: false })); }
    }

    async function handleSave() {
        setSaving(true);
        setSaveMsg('');
        try {
            const { error: cfgErr } = await supabase.from('venue_wellness_facilities').upsert({
                venue_id: venue.id,
                venue_type: 'wellness',
                ...config,
            }, { onConflict: 'venue_id,venue_type' });
            if (cfgErr) throw cfgErr;

            const { error: delErr } = await supabase.from('wellness_facility_items').delete().eq('venue_id', venue.id).eq('venue_type', 'wellness');
            if (delErr) throw delErr;
            if (items.length > 0) {
                const rows = items.map((f, i) => ({
                    venue_id: venue.id,
                    venue_type: 'wellness',
                    facility_name: f.facility_name,
                    facility_image: f.facility_image,
                    show_on_website: f.show_on_website,
                    is_available: f.is_available,
                    website_display_title: f.website_display_title,
                    website_description: f.website_description,
                    facility_type: f.facility_type,
                    setting: f.setting,
                    capacity: f.capacity,
                    temperature_range: f.temperature_range,
                    is_private: f.is_private,
                    operating_hours: f.operating_hours,
                    pool_type: f.pool_type,
                    is_heated: f.is_heated,
                    pool_size: f.pool_size,
                    pool_depth: f.pool_depth,
                    lap_swimming: f.lap_swimming,
                    plunge_type: f.plunge_type,
                    hot_tub_type: f.hot_tub_type,
                    features: f.features,
                    sort_order: i,
                }));
                const { error: itemsErr } = await supabase.from('wellness_facility_items').insert(rows);
                if (itemsErr) throw itemsErr;
            }
            setSaveMsg('Saved successfully!');
            await fetchData();
        } catch (err: any) {
            setSaveMsg('Error: ' + (err.message || 'Failed to save'));
        } finally {
            setSaving(false);
            setTimeout(() => setSaveMsg(''), 8000);
        }
    }

    return (
        <div className="wvd-content" style={{ position: 'relative', paddingBottom: 80 }}>
            {/* Floating Save Button */}
            <div className="floating-save-bar">
                {saveMsg && (
                    <span style={{ color: saveMsg.startsWith('Error') ? 'var(--danger)' : 'var(--success)', fontSize: 13, marginRight: 12 }}>
                        {saveMsg}
                    </span>
                )}
                <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                    {saving && <Loader size={15} className="spin" />}
                    {saving ? 'Saving...' : 'Save Facilities'}
                </button>
            </div>

            {/* Tab Header */}
            <section className="wvd-form-section">
                <div className="wvd-form-section-header">
                    <div>
                        <h3 className="wvd-form-section-title">Tab Header</h3>
                        <p className="wvd-form-hint">Hero image and intro content for the Facilities tab on your public listing</p>
                    </div>
                </div>
                <div className="wvd-form-section-body">
                    <div className="wvd-form-group">
                        <label className="wvd-form-label">Hero Image</label>
                        <input ref={heroRef} type="file" accept="image/*" style={{ display: 'none' }}
                            onChange={e => { if (e.target.files?.[0]) handleHeroUpload(e.target.files[0]); }} />
                        {config.facilities_hero_image ? (
                            <div style={{ position: 'relative', borderRadius: 8, overflow: 'hidden', maxWidth: 420 }}>
                                <img src={config.facilities_hero_image} alt="hero"
                                    style={{ width: '100%', height: 180, objectFit: 'cover', display: 'block' }} />
                                <div style={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: 6 }}>
                                    <button onClick={() => heroRef.current?.click()} className="btn-secondary" style={{ padding: '4px 10px', fontSize: 12 }}>Replace</button>
                                    <button onClick={() => setConfigField('facilities_hero_image', '')} className="btn-danger-sm"><X size={14} /></button>
                                </div>
                            </div>
                        ) : (
                            <div onClick={() => heroRef.current?.click()}
                                style={{ border: '2px dashed rgba(184,184,184,0.4)', borderRadius: 8, padding: 32, textAlign: 'center', cursor: 'pointer', background: 'var(--secondary-bg)', maxWidth: 420 }}>
                                {heroUploading ? <Loader size={28} className="spin" /> : <UploadCloud size={28} color="#B8B8B8" />}
                                <p style={{ color: 'var(--text)', fontSize: 13, marginTop: 8 }}>Click to upload hero image</p>
                                <p style={{ color: 'var(--accent)', fontSize: 11, marginTop: 4 }}>Recommended: 1920×600px</p>
                            </div>
                        )}
                    </div>
                    <div className="wvd-form-grid" style={{ marginTop: 20 }}>
                        <div className="wvd-form-group">
                            <label className="wvd-form-label">Section Label</label>
                            <input type="text" className="wvd-form-input" value={config.section_label}
                                onChange={e => setConfigField('section_label', e.target.value)}
                                placeholder="e.g. Water & Healing" />
                        </div>
                        <div className="wvd-form-group">
                            <label className="wvd-form-label">Section Title</label>
                            <input type="text" className="wvd-form-input" value={config.section_title}
                                onChange={e => setConfigField('section_title', e.target.value)}
                                placeholder="e.g. Restore Through Stillness" />
                        </div>
                        <div className="wvd-form-group wvd-full-width">
                            <label className="wvd-form-label">Section Subtitle</label>
                            <input type="text" className="wvd-form-input" value={config.section_subtitle}
                                onChange={e => setConfigField('section_subtitle', e.target.value)}
                                placeholder="Brief subtitle..." />
                        </div>
                        <div className="wvd-form-group wvd-full-width">
                            <label className="wvd-form-label">Intro Paragraph</label>
                            <textarea className="wvd-form-input wvd-form-textarea" style={{ minHeight: 80 }}
                                value={config.intro_paragraph}
                                onChange={e => setConfigField('intro_paragraph', e.target.value)}
                                placeholder="Introduce your wellness facilities..." />
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Facilities for Website */}
            <section className="wvd-form-section">
                <div className="wvd-form-section-header">
                    <div>
                        <h3 className="wvd-form-section-title">Featured Facilities for Website</h3>
                        <p className="wvd-form-hint">These appear as cards on your public listing. Enable "Show on Website" to feature them.</p>
                    </div>
                    <span style={{ fontSize: 12, color: 'var(--success)', fontWeight: 500 }}>
                        {items.filter(f => f.show_on_website).length} shown
                    </span>
                </div>
                <div className="wvd-form-section-body">
                    {items.map((item, idx) => (
                        <div key={idx} style={{ border: '1px solid var(--border)', borderRadius: 8, marginBottom: 12, overflow: 'hidden' }}>
                            {/* Item Header */}
                            <div style={{ padding: '12px 16px', background: 'var(--secondary-bg)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
                                onClick={() => setExpandedItems(p => ({ ...p, [idx]: !p[idx] }))}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                    {item.facility_image && (
                                        <img src={item.facility_image} alt="" style={{ width: 48, height: 34, objectFit: 'cover', borderRadius: 4 }} />
                                    )}
                                    <div>
                                        <span style={{ fontWeight: 600, fontSize: 14 }}>{item.facility_name || 'New Facility'}</span>
                                        {item.facility_type && <span style={{ fontSize: 12, color: 'var(--accent)', marginLeft: 8 }}>{item.facility_type}</span>}
                                        {item.setting && <span style={{ fontSize: 12, color: 'var(--accent)', marginLeft: 8 }}>· {item.setting}</span>}
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }} onClick={e => e.stopPropagation()}>
                                    <div className="wvd-toggle-container">
                                        <div className={`wvd-toggle ${item.show_on_website ? 'active' : ''}`}
                                            onClick={() => updateItem(idx, 'show_on_website', !item.show_on_website)}>
                                            <div className="wvd-toggle-knob"></div>
                                        </div>
                                        <span className="wvd-toggle-label" style={{ fontSize: 12 }}>Show on Website</span>
                                    </div>
                                    <button onClick={() => deleteItem(idx)} className="btn-danger-sm" title="Delete">
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>

                            {/* Item Body */}
                            {expandedItems[idx] && (
                                <div style={{ padding: 16 }}>
                                    <div className="wvd-form-grid">
                                        {/* Image */}
                                        <div className="wvd-form-group wvd-full-width">
                                            <label className="wvd-form-label">Facility Image</label>
                                            <input ref={el => itemImageRefs.current[idx] = el} type="file" accept="image/*"
                                                style={{ display: 'none' }}
                                                onChange={e => { if (e.target.files?.[0]) handleItemImageUpload(idx, e.target.files[0]); }} />
                                            {item.facility_image ? (
                                                <div style={{ position: 'relative', borderRadius: 8, overflow: 'hidden', maxWidth: 300 }}>
                                                    <img src={item.facility_image} alt="" style={{ width: '100%', height: 130, objectFit: 'cover', display: 'block' }} />
                                                    <div style={{ position: 'absolute', top: 6, right: 6, display: 'flex', gap: 6 }}>
                                                        <button onClick={() => itemImageRefs.current[idx]?.click()} className="btn-secondary" style={{ padding: '3px 8px', fontSize: 11 }}>Replace</button>
                                                        <button onClick={() => updateItem(idx, 'facility_image', '')} className="btn-danger-sm"><X size={13} /></button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div onClick={() => itemImageRefs.current[idx]?.click()}
                                                    style={{ border: '2px dashed rgba(184,184,184,0.4)', borderRadius: 8, padding: 24, textAlign: 'center', cursor: 'pointer', background: 'var(--secondary-bg)', maxWidth: 300 }}>
                                                    {itemImageUploading[idx] ? <Loader size={22} className="spin" /> : <UploadCloud size={22} color="#B8B8B8" />}
                                                    <p style={{ fontSize: 12, color: 'var(--accent)', marginTop: 6 }}>Upload facility image</p>
                                                </div>
                                            )}
                                        </div>

                                        <div className="wvd-form-group">
                                            <label className="wvd-form-label">Facility Name *</label>
                                            <input type="text" className="wvd-form-input" value={item.facility_name}
                                                onChange={e => updateItem(idx, 'facility_name', e.target.value)}
                                                placeholder="e.g. Infrared Sauna" />
                                        </div>
                                        <div className="wvd-form-group">
                                            <label className="wvd-form-label">Facility Type</label>
                                            <select className="wvd-form-input" value={item.facility_type}
                                                onChange={e => updateItem(idx, 'facility_type', e.target.value)}>
                                                <option value="">Select type</option>
                                                {FACILITY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                            </select>
                                        </div>
                                        <div className="wvd-form-group">
                                            <label className="wvd-form-label">Setting</label>
                                            <select className="wvd-form-input" value={item.setting}
                                                onChange={e => updateItem(idx, 'setting', e.target.value)}>
                                                {SETTINGS.map(s => <option key={s} value={s}>{s}</option>)}
                                            </select>
                                        </div>
                                        <div className="wvd-form-group">
                                            <label className="wvd-form-label">Capacity</label>
                                            <input type="number" className="wvd-form-input" value={item.capacity}
                                                onChange={e => updateItem(idx, 'capacity', parseInt(e.target.value) || 0)} />
                                        </div>
                                        <div className="wvd-form-group">
                                            <label className="wvd-form-label">Temperature Range</label>
                                            <input type="text" className="wvd-form-input" value={item.temperature_range}
                                                onChange={e => updateItem(idx, 'temperature_range', e.target.value)}
                                                placeholder="e.g. 60–75°C" />
                                        </div>
                                        <div className="wvd-form-group">
                                            <label className="wvd-form-label">Operating Hours</label>
                                            <input type="text" className="wvd-form-input" value={item.operating_hours}
                                                onChange={e => updateItem(idx, 'operating_hours', e.target.value)}
                                                placeholder="e.g. Included with all treatments" />
                                        </div>
                                        <div className="wvd-form-group">
                                            <label className="wvd-form-label">Private</label>
                                            <div className="wvd-toggle-container">
                                                <div className={`wvd-toggle ${item.is_private ? 'active' : ''}`}
                                                    onClick={() => updateItem(idx, 'is_private', !item.is_private)}>
                                                    <div className="wvd-toggle-knob"></div>
                                                </div>
                                                <span className="wvd-toggle-label">{item.is_private ? 'Private' : 'Shared'}</span>
                                            </div>
                                        </div>
                                        <div className="wvd-form-group">
                                            <label className="wvd-form-label">Available</label>
                                            <div className="wvd-toggle-container">
                                                <div className={`wvd-toggle ${item.is_available ? 'active' : ''}`}
                                                    onClick={() => updateItem(idx, 'is_available', !item.is_available)}>
                                                    <div className="wvd-toggle-knob"></div>
                                                </div>
                                                <span className="wvd-toggle-label">{item.is_available ? 'Yes' : 'No'}</span>
                                            </div>
                                        </div>

                                        {/* Pool-specific fields */}
                                        {(item.facility_type === 'Pool' || item.facility_type === 'Cold Plunge') && (
                                            <>
                                                <div className="wvd-form-group">
                                                    <label className="wvd-form-label">Pool Type</label>
                                                    <input type="text" className="wvd-form-input" value={item.pool_type}
                                                        onChange={e => updateItem(idx, 'pool_type', e.target.value)}
                                                        placeholder="e.g. Plunge, Lap, Mineral" />
                                                </div>
                                                <div className="wvd-form-group">
                                                    <label className="wvd-form-label">Pool Size</label>
                                                    <input type="text" className="wvd-form-input" value={item.pool_size}
                                                        onChange={e => updateItem(idx, 'pool_size', e.target.value)}
                                                        placeholder="e.g. 4m × 2m" />
                                                </div>
                                                <div className="wvd-form-group">
                                                    <label className="wvd-form-label">Pool Depth</label>
                                                    <input type="text" className="wvd-form-input" value={item.pool_depth}
                                                        onChange={e => updateItem(idx, 'pool_depth', e.target.value)}
                                                        placeholder="e.g. 1.2m" />
                                                </div>
                                                <div className="wvd-form-group">
                                                    <label className="wvd-form-label">Heated</label>
                                                    <div className="wvd-toggle-container">
                                                        <div className={`wvd-toggle ${item.is_heated ? 'active' : ''}`}
                                                            onClick={() => updateItem(idx, 'is_heated', !item.is_heated)}>
                                                            <div className="wvd-toggle-knob"></div>
                                                        </div>
                                                        <span className="wvd-toggle-label">{item.is_heated ? 'Yes' : 'No'}</span>
                                                    </div>
                                                </div>
                                                <div className="wvd-form-group">
                                                    <label className="wvd-form-label">Lap Swimming</label>
                                                    <div className="wvd-toggle-container">
                                                        <div className={`wvd-toggle ${item.lap_swimming ? 'active' : ''}`}
                                                            onClick={() => updateItem(idx, 'lap_swimming', !item.lap_swimming)}>
                                                            <div className="wvd-toggle-knob"></div>
                                                        </div>
                                                        <span className="wvd-toggle-label">{item.lap_swimming ? 'Yes' : 'No'}</span>
                                                    </div>
                                                </div>
                                            </>
                                        )}

                                        <div className="wvd-form-group wvd-full-width">
                                            <label className="wvd-form-label">Website Display Title</label>
                                            <input type="text" className="wvd-form-input" value={item.website_display_title}
                                                onChange={e => updateItem(idx, 'website_display_title', e.target.value)}
                                                placeholder="Title shown on website (if different from name)" />
                                        </div>
                                        <div className="wvd-form-group wvd-full-width">
                                            <label className="wvd-form-label">Website Description</label>
                                            <textarea className="wvd-form-input wvd-form-textarea" style={{ minHeight: 60 }}
                                                value={item.website_description}
                                                onChange={e => updateItem(idx, 'website_description', e.target.value)}
                                                placeholder="Description shown on website..." />
                                        </div>

                                        {/* Features / Tags */}
                                        <div className="wvd-form-group wvd-full-width">
                                            <label className="wvd-form-label">Features / Tags</label>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
                                                {item.features.map((feat, fi) => (
                                                    <span key={fi} style={{ background: 'var(--secondary-bg)', border: '1px solid var(--border)', padding: '3px 10px', borderRadius: 12, fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                                                        {feat}
                                                        <button onClick={() => removeFeature(idx, fi)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: 'var(--accent)' }}>
                                                            <X size={12} />
                                                        </button>
                                                    </span>
                                                ))}
                                            </div>
                                            <div style={{ display: 'flex', gap: 8 }}>
                                                <input type="text" className="wvd-form-input" style={{ flex: 1 }}
                                                    id={`feat-input-${idx}`}
                                                    placeholder="e.g. Chromotherapy, Full spectrum — press Enter"
                                                    onKeyDown={e => {
                                                        if (e.key === 'Enter') {
                                                            e.preventDefault();
                                                            const val = (e.target as HTMLInputElement).value;
                                                            addFeature(idx, val);
                                                            (e.target as HTMLInputElement).value = '';
                                                        }
                                                    }} />
                                                <button className="btn-secondary" style={{ padding: '0 14px', fontSize: 13 }}
                                                    onClick={() => {
                                                        const input = document.getElementById(`feat-input-${idx}`) as HTMLInputElement;
                                                        if (input) { addFeature(idx, input.value); input.value = ''; }
                                                    }}>Add</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                    <button className="btn-secondary" onClick={addItem} style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
                        <Plus size={16} /> Add Facility
                    </button>
                </div>
            </section>

            {/* Facility Summary */}
            <section className="wvd-form-section">
                <div className="wvd-form-section-header">
                    <h3 className="wvd-form-section-title">Facility Summary</h3>
                </div>
                <div className="wvd-form-section-body">
                    <div className="wvd-form-grid">
                        <div className="wvd-form-group">
                            <label className="wvd-form-label">Total Facility Space (sqm)</label>
                            <input type="number" className="wvd-form-input" value={config.facility_space_sqm}
                                onChange={e => setConfigField('facility_space_sqm', parseInt(e.target.value) || 0)} />
                        </div>
                        <div className="wvd-form-group">
                            <label className="wvd-form-label">Facility Philosophy</label>
                            <input type="text" className="wvd-form-input" value={config.facility_philosophy}
                                onChange={e => setConfigField('facility_philosophy', e.target.value)}
                                placeholder="e.g. Urban sanctuary combining modern wellness" />
                        </div>
                        <div className="wvd-form-group wvd-full-width">
                            <label className="wvd-form-label">Facility Highlights</label>
                            <textarea className="wvd-form-input wvd-form-textarea" style={{ minHeight: 70 }}
                                value={config.facility_highlights}
                                onChange={e => setConfigField('facility_highlights', e.target.value)}
                                placeholder="Brief overview of key facilities..." />
                        </div>
                    </div>
                </div>
            </section>

            {/* Treatment Rooms */}
            <section className="wvd-form-section">
                <div className="wvd-form-section-header">
                    <h3 className="wvd-form-section-title">Treatment Rooms</h3>
                </div>
                <div className="wvd-form-section-body">
                    <div className="wvd-form-grid wa-four-col">
                        <div className="wvd-form-group">
                            <label className="wvd-form-label">Total Treatment Rooms</label>
                            <input type="number" className="wvd-form-input" value={config.total_treatment_rooms}
                                onChange={e => setConfigField('total_treatment_rooms', parseInt(e.target.value) || 0)} />
                        </div>
                        <div className="wvd-form-group">
                            <label className="wvd-form-label">Private Treatment Suites</label>
                            <input type="number" className="wvd-form-input" value={config.private_suites}
                                onChange={e => setConfigField('private_suites', parseInt(e.target.value) || 0)} />
                        </div>
                        <div className="wvd-form-group">
                            <label className="wvd-form-label">Couples Rooms</label>
                            <input type="number" className="wvd-form-input" value={config.couples_rooms}
                                onChange={e => setConfigField('couples_rooms', parseInt(e.target.value) || 0)} />
                        </div>
                        <div className="wvd-form-group">
                            <label className="wvd-form-label">Group Treatment Spaces</label>
                            <input type="number" className="wvd-form-input" value={config.group_spaces}
                                onChange={e => setConfigField('group_spaces', parseInt(e.target.value) || 0)} />
                        </div>
                        <div className="wvd-form-group">
                            <label className="wvd-form-label">Room Sizes</label>
                            <input type="text" className="wvd-form-input" value={config.room_sizes}
                                onChange={e => setConfigField('room_sizes', e.target.value)}
                                placeholder="e.g. 12–18 sqm per room" />
                        </div>
                        <div className="wvd-form-group">
                            <label className="wvd-form-label">Treatment Tables Available</label>
                            <div className="wvd-toggle-container">
                                <div className={`wvd-toggle ${config.tables_available ? 'active' : ''}`}
                                    onClick={() => setConfigField('tables_available', !config.tables_available)}>
                                    <div className="wvd-toggle-knob"></div>
                                </div>
                                <span className="wvd-toggle-label">{config.tables_available ? 'Yes' : 'No'}</span>
                            </div>
                        </div>
                        <div className="wvd-form-group wvd-full-width">
                            <label className="wvd-form-label">Specialized Equipment</label>
                            <textarea className="wvd-form-input wvd-form-textarea" style={{ minHeight: 60 }}
                                value={config.specialized_equipment}
                                onChange={e => setConfigField('specialized_equipment', e.target.value)}
                                placeholder="e.g. Electric height-adjustable tables, hot stone warmers..." />
                        </div>
                        <div className="wvd-form-group wvd-full-width">
                            <label className="wvd-form-label">Treatment Room Features</label>
                            <textarea className="wvd-form-input wvd-form-textarea" style={{ minHeight: 60 }}
                                value={config.room_features}
                                onChange={e => setConfigField('room_features', e.target.value)}
                                placeholder="e.g. Dimmable lighting, integrated sound systems..." />
                        </div>
                    </div>
                </div>
            </section>

            {/* Supporting Facilities */}
            <section className="wvd-form-section">
                <div className="wvd-form-section-header">
                    <h3 className="wvd-form-section-title">Supporting Facilities</h3>
                </div>
                <div className="wvd-form-section-body">
                    <div className="wa-inclusions-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                        {SUPPORTING_OPTIONS.map(opt => (
                            <div key={opt} className="wa-inclusion-item"
                                onClick={() => toggleArrayItem('supporting_facilities', opt)}>
                                <div className={`wa-inclusion-check ${config.supporting_facilities.includes(opt) ? 'active' : ''}`}>
                                    {config.supporting_facilities.includes(opt) && <Check size={10} color="#fff" strokeWidth={3} />}
                                </div>
                                <span>{opt}</span>
                            </div>
                        ))}
                    </div>
                    <div className="wvd-form-grid" style={{ marginTop: 20 }}>
                        <div className="wvd-form-group">
                            <label className="wvd-form-label">Steam Room Count</label>
                            <input type="number" className="wvd-form-input" value={config.steam_room_count}
                                onChange={e => setConfigField('steam_room_count', parseInt(e.target.value) || 0)} />
                        </div>
                        <div className="wvd-form-group wvd-full-width">
                            <label className="wvd-form-label">Support Facilities Details</label>
                            <textarea className="wvd-form-input wvd-form-textarea" style={{ minHeight: 60 }}
                                value={config.support_details}
                                onChange={e => setConfigField('support_details', e.target.value)}
                                placeholder="Describe your supporting facilities..." />
                        </div>
                    </div>
                </div>
            </section>

            {/* Thermal & Sauna Facilities */}
            <section className="wvd-form-section">
                <div className="wvd-form-section-header">
                    <h3 className="wvd-form-section-title">Thermal & Sauna Facilities</h3>
                </div>
                <div className="wvd-form-section-body">
                    <div className="wa-inclusions-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                        {THERMAL_OPTIONS.map(opt => (
                            <div key={opt} className="wa-inclusion-item"
                                onClick={() => toggleArrayItem('thermal_types', opt)}>
                                <div className={`wa-inclusion-check ${config.thermal_types.includes(opt) ? 'active' : ''}`}>
                                    {config.thermal_types.includes(opt) && <Check size={10} color="#fff" strokeWidth={3} />}
                                </div>
                                <span>{opt}</span>
                            </div>
                        ))}
                    </div>
                    <div className="wvd-form-grid" style={{ marginTop: 20 }}>
                        <div className="wvd-form-group">
                            <label className="wvd-form-label">Indoor Pool Count</label>
                            <input type="number" className="wvd-form-input" value={config.indoor_pool_count}
                                onChange={e => setConfigField('indoor_pool_count', parseInt(e.target.value) || 0)} />
                        </div>
                        <div className="wvd-form-group">
                            <label className="wvd-form-label">Outdoor Pool Count</label>
                            <input type="number" className="wvd-form-input" value={config.outdoor_pool_count}
                                onChange={e => setConfigField('outdoor_pool_count', parseInt(e.target.value) || 0)} />
                        </div>
                        <div className="wvd-form-group wvd-full-width">
                            <label className="wvd-form-label">Pool / Thermal Features</label>
                            <textarea className="wvd-form-input wvd-form-textarea" style={{ minHeight: 60 }}
                                value={config.thermal_features}
                                onChange={e => setConfigField('thermal_features', e.target.value)}
                                placeholder="Describe your thermal and sauna facilities..." />
                        </div>
                    </div>
                </div>
            </section>

            {/* Traditional Bathing Facilities */}
            <section className="wvd-form-section">
                <div className="wvd-form-section-header">
                    <h3 className="wvd-form-section-title">Traditional Bathing Facilities</h3>
                    <span style={{ fontSize: 12, color: 'var(--accent)' }}>For venues with traditional bathing culture</span>
                </div>
                <div className="wvd-form-section-body">
                    {Object.entries(config.bathing_sections).map(([key, section]) => (
                        <div key={key} className="wf-collapsible-section">
                            <div className="wf-collapsible-header"
                                onClick={() => setConfig(c => ({
                                    ...c,
                                    bathing_sections: {
                                        ...c.bathing_sections,
                                        [key]: { ...c.bathing_sections[key], active: !c.bathing_sections[key].active }
                                    }
                                }))}>
                                <h4 className="wf-collapsible-title">{section.title}</h4>
                                <div className="wvd-toggle-container" onClick={e => e.stopPropagation()}>
                                    <div className={`wvd-toggle ${section.active ? 'active' : ''}`}
                                        onClick={() => setConfig(c => ({
                                            ...c,
                                            bathing_sections: {
                                                ...c.bathing_sections,
                                                [key]: { ...c.bathing_sections[key], active: !c.bathing_sections[key].active }
                                            }
                                        }))}>
                                        <div className="wvd-toggle-knob"></div>
                                    </div>
                                    <span className="wvd-toggle-label">{section.active ? 'Available' : 'Not Available'}</span>
                                </div>
                            </div>
                            {section.active && (
                                <div className="wf-collapsible-body">
                                    <div className="wvd-form-group">
                                        <label className="wvd-form-label">Details</label>
                                        <textarea className="wvd-form-input wvd-form-textarea" style={{ minHeight: 60 }}
                                            value={section.details || ''}
                                            onChange={e => setConfig(c => ({
                                                ...c,
                                                bathing_sections: {
                                                    ...c.bathing_sections,
                                                    [key]: { ...c.bathing_sections[key], details: e.target.value }
                                                }
                                            }))}
                                            placeholder={`Details about ${section.title}...`} />
                                    </div>
                                </div>
                            )}
                            {!section.active && (
                                <div className="wf-collapsible-body inactive">
                                    <p className="wf-inactive-note">Enable toggle to add {section.title} details.</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            {/* Medical Spa Facilities */}
            <section className="wvd-form-section">
                <div className="wvd-form-section-header">
                    <h3 className="wvd-form-section-title">Medical Spa Facilities</h3>
                </div>
                <div className="wvd-form-section-body">
                    <div className="wvd-form-grid">
                        <div className="wvd-form-group">
                            <label className="wvd-form-label">Medical Spa Suites</label>
                            <div className="wvd-toggle-container">
                                <div className={`wvd-toggle ${config.med_spa_suites ? 'active' : ''}`}
                                    onClick={() => setConfigField('med_spa_suites', !config.med_spa_suites)}>
                                    <div className="wvd-toggle-knob"></div>
                                </div>
                                <span className="wvd-toggle-label">{config.med_spa_suites ? 'Yes' : 'No'}</span>
                            </div>
                        </div>
                        {config.med_spa_suites && (
                            <div className="wvd-form-group">
                                <label className="wvd-form-label">Medical Suite Count</label>
                                <input type="number" className="wvd-form-input" value={config.med_suite_count}
                                    onChange={e => setConfigField('med_suite_count', parseInt(e.target.value) || 0)} />
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Changing & Locker Facilities */}
            <section className="wvd-form-section">
                <div className="wvd-form-section-header">
                    <h3 className="wvd-form-section-title">Changing & Locker Facilities</h3>
                </div>
                <div className="wvd-form-section-body">
                    <div className="wvd-form-grid">
                        <div className="wvd-form-group wvd-full-width">
                            <label className="wvd-form-label">Changing / Locker Facilities</label>
                            <textarea className="wvd-form-input wvd-form-textarea" style={{ minHeight: 60 }}
                                value={config.changing_details}
                                onChange={e => setConfigField('changing_details', e.target.value)}
                                placeholder="Describe changing rooms and locker facilities..." />
                        </div>
                        <div className="wvd-form-group wvd-full-width">
                            <label className="wvd-form-label">Shower Facilities</label>
                            <textarea className="wvd-form-input wvd-form-textarea" style={{ minHeight: 60 }}
                                value={config.shower_details}
                                onChange={e => setConfigField('shower_details', e.target.value)}
                                placeholder="Describe shower facilities..." />
                        </div>
                        <div className="wvd-form-group">
                            <label className="wvd-form-label">Towels & Robes Provided</label>
                            <div className="wvd-toggle-container">
                                <div className={`wvd-toggle ${config.towels_provided ? 'active' : ''}`}
                                    onClick={() => setConfigField('towels_provided', !config.towels_provided)}>
                                    <div className="wvd-toggle-knob"></div>
                                </div>
                                <span className="wvd-toggle-label">{config.towels_provided ? 'Yes' : 'No'}</span>
                            </div>
                        </div>
                        <div className="wvd-form-group">
                            <label className="wvd-form-label">Slippers & Amenities Provided</label>
                            <div className="wvd-toggle-container">
                                <div className={`wvd-toggle ${config.slippers_provided ? 'active' : ''}`}
                                    onClick={() => setConfigField('slippers_provided', !config.slippers_provided)}>
                                    <div className="wvd-toggle-knob"></div>
                                </div>
                                <span className="wvd-toggle-label">{config.slippers_provided ? 'Yes' : 'No'}</span>
                            </div>
                        </div>
                        <div className="wvd-form-group wvd-full-width">
                            <label className="wvd-form-label">Additional Amenities</label>
                            <textarea className="wvd-form-input wvd-form-textarea" style={{ minHeight: 60 }}
                                value={config.changing_amenities}
                                onChange={e => setConfigField('changing_amenities', e.target.value)}
                                placeholder="e.g. Hairdryers, complimentary toiletries..." />
                        </div>
                    </div>
                </div>
            </section>

            {/* Certifications & Standards */}
            <section className="wvd-form-section">
                <div className="wvd-form-section-header">
                    <h3 className="wvd-form-section-title">Certifications & Standards</h3>
                </div>
                <div className="wvd-form-section-body">
                    <div className="wvd-form-grid">
                        <div className="wvd-form-group wvd-full-width">
                            <label className="wvd-form-label">Medical Certifications</label>
                            <textarea className="wvd-form-input wvd-form-textarea" style={{ minHeight: 60 }}
                                value={config.med_certs}
                                onChange={e => setConfigField('med_certs', e.target.value)}
                                placeholder="e.g. N/A - Day spa (non-medical)" />
                        </div>
                        <div className="wvd-form-group wvd-full-width">
                            <label className="wvd-form-label">Traditional Practice Certifications</label>
                            <textarea className="wvd-form-input wvd-form-textarea" style={{ minHeight: 60 }}
                                value={config.trad_certs}
                                onChange={e => setConfigField('trad_certs', e.target.value)}
                                placeholder="e.g. All therapists hold Diploma of Remedial Massage..." />
                        </div>
                        <div className="wvd-form-group wvd-full-width">
                            <label className="wvd-form-label">Water Quality Testing</label>
                            <textarea className="wvd-form-input wvd-form-textarea" style={{ minHeight: 60 }}
                                value={config.water_testing}
                                onChange={e => setConfigField('water_testing', e.target.value)}
                                placeholder="Water testing and maintenance schedule..." />
                        </div>
                        <div className="wvd-form-group wvd-full-width">
                            <label className="wvd-form-label">Safety Standards</label>
                            <textarea className="wvd-form-input wvd-form-textarea" style={{ minHeight: 60 }}
                                value={config.safety_standards}
                                onChange={e => setConfigField('safety_standards', e.target.value)}
                                placeholder="Health and safety compliance details..." />
                        </div>
                        <div className="wvd-form-group wvd-full-width">
                            <label className="wvd-form-label">Sustainability Practices</label>
                            <textarea className="wvd-form-input wvd-form-textarea" style={{ minHeight: 60 }}
                                value={config.sustainability}
                                onChange={e => setConfigField('sustainability', e.target.value)}
                                placeholder="Sustainability and eco-friendly practices..." />
                        </div>
                    </div>
                </div>
            </section>

            {/* Accessibility */}
            <section className="wvd-form-section">
                <div className="wvd-form-section-header">
                    <h3 className="wvd-form-section-title">Accessibility</h3>
                </div>
                <div className="wvd-form-section-body">
                    <div className="wa-inclusions-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                        {ACCESS_OPTIONS.map(opt => (
                            <div key={opt} className="wa-inclusion-item"
                                onClick={() => toggleArrayItem('accessibility_features', opt)}>
                                <div className={`wa-inclusion-check ${config.accessibility_features.includes(opt) ? 'active' : ''}`}>
                                    {config.accessibility_features.includes(opt) && <Check size={10} color="#fff" strokeWidth={3} />}
                                </div>
                                <span>{opt}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Other Wellness Facilities */}
            <section className="wvd-form-section">
                <div className="wvd-form-section-header">
                    <h3 className="wvd-form-section-title">Other Wellness Facilities</h3>
                </div>
                <div className="wvd-form-section-body">
                    <div className="wvd-form-grid">
                        <div className="wvd-form-group">
                            <label className="wvd-form-label">Other Wellness Facilities</label>
                            <div className="wvd-toggle-container">
                                <div className={`wvd-toggle ${config.other_facilities_available ? 'active' : ''}`}
                                    onClick={() => setConfigField('other_facilities_available', !config.other_facilities_available)}>
                                    <div className="wvd-toggle-knob"></div>
                                </div>
                                <span className="wvd-toggle-label">{config.other_facilities_available ? 'Yes' : 'No'}</span>
                            </div>
                        </div>
                        <div className="wvd-form-group wvd-full-width">
                            <label className="wvd-form-label">Other Facility Types</label>
                            <textarea className="wvd-form-input wvd-form-textarea" style={{ minHeight: 60 }}
                                value={config.other_facility_types}
                                onChange={e => setConfigField('other_facility_types', e.target.value)}
                                placeholder="Describe any other wellness facilities not covered above..."
                                disabled={!config.other_facilities_available} />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
