import { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, Check, Loader, UploadCloud, X, Save } from 'lucide-react';
import type { Venue } from '../context/VenueContext';
import { supabase } from '../lib/supabase';
import { uploadFile } from '../lib/storage';

interface RetreatFacilitiesTabProps {
    venue: Venue;
    onUpdate?: (updates: Partial<Venue>) => void;
}

interface Config {
    facilities_hero_image: string;
    section_label: string;
    section_title: string;
    section_subtitle: string;
    intro_paragraph: string;
    supports_yoga_retreats: boolean;
    supports_meditation_retreats: boolean;
    supports_nutrition_detox: boolean;
    supports_womens_retreats: boolean;
    supports_corporate_wellness: boolean;
    supports_mindfulness: boolean;
    supports_sound_healing: boolean;
    supports_silent_retreats: boolean;
    supports_breathwork: boolean;
    supports_plant_medicine: boolean;
    supports_creative_art: boolean;
    supports_leadership_coaching: boolean;
    facility_notes: string;
    [key: string]: string | boolean;
}

interface Space {
    id?: string;
    space_name: string;
    space_image: string;
    is_featured: boolean;
    is_available: boolean;
    space_description: string;
    space_type: string;
    setting: string;
    view_type: string;
    capacity: number;
    size_sqm: number;
    flooring: string;
    equipment_provided: string[];
    sort_order: number;
}

const DEFAULT_CONFIG: Config = {
    facilities_hero_image: '',
    section_label: 'Retreat Spaces',
    section_title: '',
    section_subtitle: '',
    intro_paragraph: '',
    supports_yoga_retreats: false,
    supports_meditation_retreats: false,
    supports_nutrition_detox: false,
    supports_womens_retreats: false,
    supports_corporate_wellness: false,
    supports_mindfulness: false,
    supports_sound_healing: false,
    supports_silent_retreats: false,
    supports_breathwork: false,
    supports_plant_medicine: false,
    supports_creative_art: false,
    supports_leadership_coaching: false,
    facility_notes: '',
};

const RETREAT_TYPES = [
    { label: 'Yoga Retreats', col: 'supports_yoga_retreats' },
    { label: 'Meditation Retreats', col: 'supports_meditation_retreats' },
    { label: 'Nutrition / Detox', col: 'supports_nutrition_detox' },
    { label: "Women's Retreats", col: 'supports_womens_retreats' },
    { label: 'Corporate Wellness', col: 'supports_corporate_wellness' },
    { label: 'Mindfulness', col: 'supports_mindfulness' },
    { label: 'Sound Healing', col: 'supports_sound_healing' },
    { label: 'Silent Retreats', col: 'supports_silent_retreats' },
    { label: 'Breathwork', col: 'supports_breathwork' },
    { label: 'Plant Medicine', col: 'supports_plant_medicine' },
    { label: 'Creative / Art Retreats', col: 'supports_creative_art' },
    { label: 'Leadership Coaching', col: 'supports_leadership_coaching' },
] as const;

const SPACE_TYPES = [
    'Dedicated Yoga Studio', 'Multipurpose Space', 'Outdoor Platform',
    'Dedicated Meditation Room', 'Garden Sanctuary', 'Conference Room',
    'Multipurpose Hall', 'Boardroom', 'Sacred Circle', 'Dedicated Temple',
    'Outdoor Practice Area', 'Shared Space', 'Other',
];

const SETTING_OPTIONS = ['Indoor', 'Outdoor', 'Indoor/Outdoor'];

const VIEW_OPTIONS = [
    'No Specific View', 'Ocean View', 'Mountain View', 'Garden View',
    'Forest View', 'Lake View', 'Valley View', 'Countryside View',
];

const FLOORING_OPTIONS = ['Timber', 'Sprung Floor', 'Bamboo', 'Concrete', 'Carpet', 'Grass', 'Stone', 'Other'];

function blankSpace(order: number): Space {
    return {
        space_name: '',
        space_image: '',
        is_featured: false,
        is_available: true,
        space_description: '',
        space_type: 'Multipurpose Space',
        setting: 'Indoor',
        view_type: 'No Specific View',
        capacity: 0,
        size_sqm: 0,
        flooring: 'Timber',
        equipment_provided: [],
        sort_order: order,
    };
}

export default function RetreatFacilitiesTab({ venue }: RetreatFacilitiesTabProps) {
    const [config, setConfig] = useState<Config>(DEFAULT_CONFIG);
    const [spaces, setSpaces] = useState<Space[]>([]);
    const [saving, setSaving] = useState(false);
    const [saveMsg, setSaveMsg] = useState('');
    const [heroUploading, setHeroUploading] = useState(false);
    const [spaceImageUploading, setSpaceImageUploading] = useState<Record<number, boolean>>({});
    const heroRef = useRef<HTMLInputElement>(null);
    const spaceImageRefs = useRef<Record<number, HTMLInputElement | null>>({});

    // Summary stats
    const practiceSpaces = spaces.filter(s => s.is_available).length;
    const meetingRooms = spaces.filter(s =>
        s.space_type.toLowerCase().includes('conference') ||
        s.space_type.toLowerCase().includes('boardroom') ||
        s.space_type.toLowerCase().includes('multipurpose hall')
    ).length;
    const maxCapacity = spaces.reduce((max, s) => Math.max(max, s.capacity), 0);
    const outdoorAreas = spaces.filter(s => s.setting === 'Outdoor' || s.setting === 'Indoor/Outdoor').length;

    async function fetchData() {
        const [facRes, spacesRes] = await Promise.all([
            supabase.from('retreat_facilities').select('*').eq('venue_id', venue.id).maybeSingle(),
            supabase.from('retreat_spaces').select('*').eq('venue_id', venue.id).order('sort_order'),
        ]);
        if (facRes.data) {
            const d = facRes.data;
            const next: Config = { ...DEFAULT_CONFIG };
            Object.keys(DEFAULT_CONFIG).forEach(k => {
                if (d[k] !== undefined && d[k] !== null) (next as any)[k] = d[k];
            });
            setConfig(next);
        }
        if (spacesRes.data) {
            setSpaces(spacesRes.data.map((s: any) => ({
                id: s.id,
                space_name: s.space_name || '',
                space_image: s.space_image || '',
                is_featured: s.is_featured ?? false,
                is_available: s.is_available ?? true,
                space_description: s.space_description || '',
                space_type: s.space_type || 'Multipurpose Space',
                setting: s.setting || 'Indoor',
                view_type: s.view_type || 'No Specific View',
                capacity: s.capacity ?? 0,
                size_sqm: s.size_sqm ?? 0,
                flooring: s.flooring || 'Timber',
                equipment_provided: s.equipment_provided || [],
                sort_order: s.sort_order ?? 0,
            })));
        }
    }

    useEffect(() => { fetchData(); }, [venue.id]);

    function setConfigField<K extends keyof Config>(key: K, value: Config[K]) {
        setConfig(c => ({ ...c, [key]: value }));
    }

    function updateSpace(idx: number, field: keyof Space, value: any) {
        setSpaces(prev => prev.map((s, i) => i === idx ? { ...s, [field]: value } : s));
    }

    function addSpace() {
        const idx = spaces.length;
        setSpaces(prev => [...prev, blankSpace(idx)]);
    }

    function deleteSpace(idx: number) {
        setSpaces(prev => prev.filter((_, i) => i !== idx));
    }

    function addEquipment(idx: number, value: string) {
        if (!value.trim()) return;
        setSpaces(prev => prev.map((s, i) => i === idx ? { ...s, equipment_provided: [...s.equipment_provided, value.trim()] } : s));
    }

    function removeEquipment(spaceIdx: number, eqIdx: number) {
        setSpaces(prev => prev.map((s, i) => i === spaceIdx ? { ...s, equipment_provided: s.equipment_provided.filter((_, j) => j !== eqIdx) } : s));
    }

    async function handleHeroUpload(file: File) {
        setHeroUploading(true);
        try {
            const url = await uploadFile(file, 'photo');
            setConfigField('facilities_hero_image', url);
        } finally { setHeroUploading(false); }
    }

    async function handleSpaceImageUpload(idx: number, file: File) {
        setSpaceImageUploading(p => ({ ...p, [idx]: true }));
        try {
            const url = await uploadFile(file, 'photo');
            updateSpace(idx, 'space_image', url);
        } finally { setSpaceImageUploading(p => ({ ...p, [idx]: false })); }
    }

    async function handleSave() {
        setSaving(true);
        setSaveMsg('');
        try {
            // Use select-then-update/insert to avoid onConflict issues with UNIQUE INDEX
            const { data: existing, error: selErr } = await supabase
                .from('retreat_facilities').select('id').eq('venue_id', venue.id).maybeSingle();
            if (selErr) throw selErr;

            if (existing?.id) {
                const { error: updErr } = await supabase
                    .from('retreat_facilities').update({ ...config }).eq('id', existing.id);
                if (updErr) throw updErr;
            } else {
                const { error: insErr } = await supabase
                    .from('retreat_facilities').insert({ venue_id: venue.id, ...config });
                if (insErr) throw insErr;
            }

            const { error: delErr } = await supabase.from('retreat_spaces').delete().eq('venue_id', venue.id);
            if (delErr) throw delErr;
            if (spaces.length > 0) {
                const rows = spaces.map((s, i) => ({
                    venue_id: venue.id,
                    space_name: s.space_name,
                    space_image: s.space_image,
                    is_featured: s.is_featured,
                    is_available: s.is_available,
                    space_description: s.space_description,
                    space_type: s.space_type,
                    setting: s.setting,
                    view_type: s.view_type,
                    capacity: s.capacity,
                    size_sqm: s.size_sqm,
                    flooring: s.flooring,
                    equipment_provided: s.equipment_provided,
                    sort_order: i,
                }));
                const { error: spacesErr } = await supabase.from('retreat_spaces').insert(rows);
                if (spacesErr) throw spacesErr;
            }
            setSaveMsg('Saved successfully!');
            await fetchData();
        } catch (err: any) {
            setSaveMsg('Error: ' + (err.message || 'Failed to save'));
        } finally {
            setSaving(false);
            setTimeout(() => setSaveMsg(''), 5000);
        }
    }

    return (
        <div style={{ position: 'relative', paddingBottom: 80 }}>
            {/* Floating Save Button */}
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
                {saving ? 'Saving…' : 'Save Retreat Spaces'}
            </button>

            {/* Toast */}
            {saveMsg && (
                <div style={{
                    position: 'fixed', bottom: 100, right: 32, zIndex: 600,
                    padding: '12px 20px', borderRadius: 10, fontSize: 13, fontWeight: 500,
                    fontFamily: "'Montserrat', sans-serif",
                    background: saveMsg.startsWith('Error') ? '#ef4444' : '#22c55e', color: '#fff',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
                }}>
                    {saveMsg}
                </div>
            )}

            {/* Tab Images */}
            <section className="rf-section">
                <div className="rf-section-header">
                    <h3 className="rf-section-title">Tab Images</h3>
                    <p className="rf-section-subtitle">Hero image displayed on the Retreat Spaces tab of your public listing</p>
                </div>
                <div className="rf-section-body">
                    <div className="rf-form-group">
                        <label className="rf-form-label">Retreat Spaces Tab Hero Image</label>
                        <input ref={heroRef} type="file" accept="image/*" hidden
                            onChange={e => { if (e.target.files?.[0]) handleHeroUpload(e.target.files[0]); }} />
                        {config.facilities_hero_image ? (
                            <div style={{ position: 'relative', borderRadius: 8, overflow: 'hidden', maxWidth: 420 }}>
                                <img src={config.facilities_hero_image as string} alt="hero"
                                    style={{ width: '100%', height: 180, objectFit: 'cover', display: 'block' }} />
                                <div style={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: 6 }}>
                                    <button onClick={() => heroRef.current?.click()} className="btn-secondary" style={{ padding: '4px 10px', fontSize: 12 }}>Replace</button>
                                    <button onClick={() => setConfigField('facilities_hero_image', '')} className="btn-danger-sm"><X size={14} /></button>
                                </div>
                            </div>
                        ) : (
                            <div className="rf-image-upload-area" onClick={() => heroRef.current?.click()} style={{ cursor: 'pointer' }}>
                                {heroUploading ? <Loader size={36} className="spin" /> : <UploadCloud size={36} color="#B8B8B8" strokeWidth={1.5} />}
                                <p className="rf-image-upload-label" style={{ marginTop: 12 }}>Click to upload or drag and drop</p>
                                <p className="rf-image-upload-hint">Recommended: 1920×600px, JPG or PNG</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Tab Content */}
            <section className="rf-section">
                <div className="rf-section-header">
                    <h3 className="rf-section-title">Tab Content</h3>
                    <p className="rf-section-subtitle">Intro text displayed on the Retreat Spaces tab of your public listing</p>
                </div>
                <div className="rf-section-body">
                    <div className="rf-form-grid">
                        <div className="rf-form-group">
                            <label className="rf-form-label">Section Label</label>
                            <input type="text" className="rf-form-input"
                                value={config.section_label as string}
                                onChange={e => setConfigField('section_label', e.target.value)}
                                placeholder="e.g. Retreat Spaces, Practice Spaces" />
                        </div>
                        <div className="rf-form-group">
                            <label className="rf-form-label">Section Title</label>
                            <input type="text" className="rf-form-input"
                                value={config.section_title as string}
                                onChange={e => setConfigField('section_title', e.target.value)}
                                placeholder="e.g. Spaces for Practice and Transformation" />
                        </div>
                        <div className="rf-form-group full-width">
                            <label className="rf-form-label">Section Subtitle</label>
                            <input type="text" className="rf-form-input"
                                value={config.section_subtitle as string}
                                onChange={e => setConfigField('section_subtitle', e.target.value)}
                                placeholder="Brief subtitle..." />
                        </div>
                        <div className="rf-form-group full-width">
                            <label className="rf-form-label">Intro Paragraph</label>
                            <textarea className="rf-form-input rf-form-textarea"
                                value={config.intro_paragraph as string}
                                onChange={e => setConfigField('intro_paragraph', e.target.value)}
                                placeholder="A paragraph introducing your retreat spaces..."
                                rows={3} />
                        </div>
                    </div>
                </div>
            </section>

            {/* Summary Stats */}
            <div className="rf-summary-stats">
                <div className="rf-summary-stat">
                    <div className="rf-summary-stat-value">{practiceSpaces}</div>
                    <div className="rf-summary-stat-label">Practice Spaces</div>
                </div>
                <div className="rf-summary-stat">
                    <div className="rf-summary-stat-value">{meetingRooms}</div>
                    <div className="rf-summary-stat-label">Meeting Rooms</div>
                </div>
                <div className="rf-summary-stat">
                    <div className="rf-summary-stat-value">{maxCapacity}</div>
                    <div className="rf-summary-stat-label">Largest Capacity</div>
                </div>
                <div className="rf-summary-stat">
                    <div className="rf-summary-stat-value">{outdoorAreas}</div>
                    <div className="rf-summary-stat-label">Outdoor Areas</div>
                </div>
            </div>

            {/* Space Cards */}
            <div className="rf-facility-cards">
                {spaces.map((space, idx) => (
                    <div key={idx} className="rf-facility-card">
                        {/* Card Header */}
                        <div className="rf-facility-card-header">
                            <div className="rf-facility-card-title">
                                <div className="rf-facility-icon">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#313131" strokeWidth="1.5">
                                        <circle cx="12" cy="5" r="2" />
                                        <path d="M12 7v5m0 0l-3 4m3-4l3 4m-6-4h6" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    value={space.space_name}
                                    onChange={e => updateSpace(idx, 'space_name', e.target.value)}
                                    placeholder="Space Name"
                                    style={{ border: 'none', background: 'transparent', fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 600, color: '#313131', width: '100%', outline: 'none' }}
                                />
                            </div>
                            <div className="rf-facility-card-toggle">
                                {space.is_featured && <span className="rf-featured-badge">Featured</span>}
                                <span className={`rf-facility-status${space.is_available ? '' : ' inactive'}`}>
                                    {space.is_available ? 'Available' : 'Unavailable'}
                                </span>
                                <div className={`rf-toggle${space.is_available ? ' active' : ''}`}
                                    onClick={() => updateSpace(idx, 'is_available', !space.is_available)}>
                                    <div className="rf-toggle-knob" />
                                </div>
                                <button className="rf-delete-facility-btn" onClick={() => deleteSpace(idx)} title="Remove space">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>

                        <div className="rf-facility-card-body">
                            {/* Image & Featured */}
                            <div className="rf-facility-grid" style={{ marginBottom: 20 }}>
                                <div className="rf-facility-field span-2">
                                    <div className="rf-facility-field-label">Space Image</div>
                                    <input ref={el => { spaceImageRefs.current[idx] = el; }} type="file" accept="image/*" hidden
                                        onChange={e => { if (e.target.files?.[0]) handleSpaceImageUpload(idx, e.target.files[0]); }} />
                                    {space.space_image ? (
                                        <div style={{ position: 'relative', borderRadius: 8, overflow: 'hidden', maxWidth: 300 }}>
                                            <img src={space.space_image} alt="" style={{ width: '100%', height: 140, objectFit: 'cover', display: 'block' }} />
                                            <div style={{ position: 'absolute', top: 6, right: 6, display: 'flex', gap: 6 }}>
                                                <button onClick={() => spaceImageRefs.current[idx]?.click()} className="btn-secondary" style={{ padding: '3px 8px', fontSize: 11 }}>Replace</button>
                                                <button onClick={() => updateSpace(idx, 'space_image', '')} className="btn-danger-sm"><X size={13} /></button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                                            <div className="rf-facility-image-box" onClick={() => spaceImageRefs.current[idx]?.click()} style={{ cursor: 'pointer' }}>
                                                {spaceImageUploading[idx] ? <Loader size={24} className="spin" /> : <UploadCloud size={28} color="#B8B8B8" strokeWidth={1.5} />}
                                            </div>
                                            <div>
                                                <button className="btn btn-secondary btn-small" style={{ marginBottom: 8 }}
                                                    onClick={() => spaceImageRefs.current[idx]?.click()}>Upload Image</button>
                                                <p style={{ fontSize: 11, color: '#B8B8B8' }}>Recommended: 800×600px, JPG or PNG</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="rf-facility-field">
                                    <div className="rf-facility-field-label">Featured Space</div>
                                    <div className="rf-toggle-container">
                                        <div className={`rf-toggle${space.is_featured ? ' active' : ''}`}
                                            onClick={() => updateSpace(idx, 'is_featured', !space.is_featured)}>
                                            <div className="rf-toggle-knob" />
                                        </div>
                                        <span className="rf-toggle-label">{space.is_featured ? 'Yes - Highlight on listing' : 'No'}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="rf-facility-grid" style={{ marginBottom: 20 }}>
                                <div className="rf-facility-field span-3">
                                    <div className="rf-facility-field-label">Space Description</div>
                                    <textarea className="rf-form-input rf-form-textarea"
                                        value={space.space_description}
                                        onChange={e => updateSpace(idx, 'space_description', e.target.value)}
                                        placeholder="Describe this space for your public listing..."
                                        rows={3} />
                                </div>
                            </div>

                            {/* Details Grid */}
                            <div className="rf-facility-grid">
                                <div className="rf-facility-field">
                                    <div className="rf-facility-field-label">Space Type</div>
                                    <select className="rf-form-input rf-form-select" value={space.space_type}
                                        onChange={e => updateSpace(idx, 'space_type', e.target.value)}>
                                        {SPACE_TYPES.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                    </select>
                                </div>
                                <div className="rf-facility-field">
                                    <div className="rf-facility-field-label">Setting</div>
                                    <select className="rf-form-input rf-form-select" value={space.setting}
                                        onChange={e => updateSpace(idx, 'setting', e.target.value)}>
                                        {SETTING_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                    </select>
                                </div>
                                <div className="rf-facility-field">
                                    <div className="rf-facility-field-label">View Type</div>
                                    <select className="rf-form-input rf-form-select" value={space.view_type}
                                        onChange={e => updateSpace(idx, 'view_type', e.target.value)}>
                                        {VIEW_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                    </select>
                                </div>
                                <div className="rf-facility-field">
                                    <div className="rf-facility-field-label">Capacity</div>
                                    <input type="number" className="rf-form-input" value={space.capacity}
                                        onChange={e => updateSpace(idx, 'capacity', parseInt(e.target.value) || 0)} />
                                </div>
                                <div className="rf-facility-field">
                                    <div className="rf-facility-field-label">Size (sqm)</div>
                                    <input type="number" className="rf-form-input" value={space.size_sqm}
                                        onChange={e => updateSpace(idx, 'size_sqm', parseInt(e.target.value) || 0)} />
                                </div>
                                <div className="rf-facility-field">
                                    <div className="rf-facility-field-label">Flooring</div>
                                    <select className="rf-form-input rf-form-select" value={space.flooring}
                                        onChange={e => updateSpace(idx, 'flooring', e.target.value)}>
                                        {FLOORING_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                    </select>
                                </div>

                                {/* Equipment */}
                                <div className="rf-facility-field span-3">
                                    <div className="rf-facility-field-label">Equipment Provided</div>
                                    <div className="rf-facility-features">
                                        {space.equipment_provided.map((item, eqIdx) => (
                                            <span key={eqIdx} className="rf-facility-feature" style={{ cursor: 'pointer' }}
                                                onClick={() => removeEquipment(idx, eqIdx)}>
                                                {item} ×
                                            </span>
                                        ))}
                                    </div>
                                    <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                                        <input type="text" className="rf-form-input" style={{ flex: 1 }}
                                            id={`equip-rf-${idx}`}
                                            placeholder="Add equipment (e.g. Yoga Mats)"
                                            onKeyDown={e => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    const val = (e.target as HTMLInputElement).value;
                                                    addEquipment(idx, val);
                                                    (e.target as HTMLInputElement).value = '';
                                                }
                                            }} />
                                        <button className="btn btn-secondary btn-small"
                                            onClick={() => {
                                                const input = document.getElementById(`equip-rf-${idx}`) as HTMLInputElement;
                                                if (input) { addEquipment(idx, input.value); input.value = ''; }
                                            }}>
                                            <Plus size={14} /> Add
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                <button className="rf-add-facility-btn" onClick={addSpace}>
                    <Plus size={18} />
                    Add Another Space
                </button>
            </div>

            {/* Retreat Types Supported */}
            <section className="rf-section">
                <div className="rf-section-header">
                    <h3 className="rf-section-title">Retreat Types This Venue Supports</h3>
                    <span style={{ fontSize: 12, color: 'var(--success)', fontWeight: 500 }}>
                        {RETREAT_TYPES.filter(t => config[t.col]).length} selected
                    </span>
                </div>
                <div className="rf-section-body">
                    <div className="rf-checkbox-grid">
                        {RETREAT_TYPES.map(t => {
                            const isChecked = config[t.col] as boolean;
                            return (
                                <div key={t.col} className={`rf-checkbox-item${isChecked ? ' checked' : ''}`}
                                    onClick={() => setConfigField(t.col, !config[t.col])}>
                                    <div className="rf-checkbox-box">
                                        {isChecked && <Check size={12} color="white" strokeWidth={3} />}
                                    </div>
                                    <span className="rf-checkbox-label">{t.label}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Additional Notes */}
            <section className="rf-section">
                <div className="rf-section-header">
                    <h3 className="rf-section-title">Additional Facility Notes</h3>
                </div>
                <div className="rf-section-body">
                    <div className="rf-form-group">
                        <label className="rf-form-label">Notes for Retreat Hosts</label>
                        <textarea className="rf-form-input rf-form-textarea"
                            value={config.facility_notes as string}
                            onChange={e => setConfigField('facility_notes', e.target.value)}
                            placeholder="Any additional information about facilities that retreat hosts should know..."
                            rows={4} />
                    </div>
                </div>
            </section>
        </div>
    );
}
