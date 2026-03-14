import { useState, useEffect, useCallback, useRef } from 'react';
import { Check, UploadCloud, ChevronDown, Save, Loader } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { uploadFile } from '../../lib/storage';
import type { Venue } from '../../context/VenueContext';

interface Props {
    venue: Venue;
    onUpdate: (updates: Partial<Venue>) => void;
}

const WEBSITE_AMENITIES = [
    { emoji: '🅿️', label: 'Free Parking' },
    { emoji: '🚿', label: 'Showers' },
    { emoji: '🧖', label: 'Robes & Slippers' },
    { emoji: '🔒', label: 'Lockers' },
    { emoji: '🧴', label: 'Toiletries' },
    { emoji: '💨', label: 'Hair Dryers' },
    { emoji: '🍵', label: 'Tea Station' },
    { emoji: '💧', label: 'Water Station' },
    { emoji: '📶', label: 'WiFi' },
    { emoji: '❄️', label: 'Air Conditioning' },
    { emoji: '♿', label: 'Accessible Entry' },
    { emoji: '🌿', label: 'Outdoor Terrace' },
    { emoji: '☕', label: 'Café' },
    { emoji: '🛍️', label: 'Retail Shop' },
    { emoji: '👶', label: 'Child Friendly' },
    { emoji: '🐕', label: 'Pet Friendly' },
];

const AMENITY_CATEGORIES = [
    {
        key: 'kitchen',
        title: 'Kitchen & Dining',
        subtitle: 'Food preparation and dining facilities',
        items: ['Commercial Kitchen', 'Domestic Kitchen', 'Full-size Refrigerator', 'Walk-in Pantry', 'Dishwasher', 'Oven / Stove', 'Microwave', 'Coffee Machine', 'Blender / Vitamix', 'Formal Dining Room', 'Outdoor Dining Area', 'BBQ / Grill', 'Pizza Oven', 'Breakfast Bar', 'Cookware & Utensils'],
    },
    {
        key: 'living',
        title: 'Living & Entertainment',
        subtitle: 'Common areas and entertainment options',
        items: ['Living Room', 'Fireplace', 'Smart TV', 'Streaming Services', 'Sound System', 'Library / Reading Area', 'Games Room', 'Board Games', 'Piano / Musical Instruments', 'Projector / Screen', 'Home Cinema', 'Gym Equipment'],
    },
    {
        key: 'tech',
        title: 'Technology & Connectivity',
        subtitle: 'Internet, power, and tech amenities',
        items: ['WiFi', 'High-Speed Internet', 'Starlink / Satellite', 'Mobile Signal', 'EV Charging', 'Printer / Scanner', 'Dedicated Office Space'],
    },
    {
        key: 'outdoor',
        title: 'Outdoor & Grounds',
        subtitle: 'Outdoor spaces and property features',
        items: ['Swimming Pool', 'Heated Pool', 'Indoor Pool', 'Garden / Grounds', 'Outdoor Seating', 'Covered Verandah / Patio', 'Fire Pit', 'Tennis Court', 'Golf Course Access', 'Farm Animals', 'Orchard / Produce Garden', 'Walking Trails', 'Beach Access', 'Lake / River Access'],
    },
    {
        key: 'parking',
        title: 'Parking & Transport',
        subtitle: 'Vehicle access and parking facilities',
        items: ['Free Parking', 'On-site Parking', 'Covered / Garage Parking', 'Bus / Coach Access', 'Airport Transfers Available', 'Helipad'],
    },
    {
        key: 'laundry',
        title: 'Laundry & Housekeeping',
        subtitle: 'Cleaning and laundry facilities',
        items: ['Washing Machine', 'Dryer', 'Iron & Ironing Board', 'Linens Provided', 'Towels Provided', 'Daily Housekeeping', 'Laundry Service'],
    },
    {
        key: 'climate',
        title: 'Climate & Comfort',
        subtitle: 'Heating, cooling, and comfort features',
        items: ['Air Conditioning', 'Central Heating', 'Fireplace / Wood Heater', 'Ceiling Fans', 'Underfloor Heating', 'Heated Bathroom Floors'],
    },
    {
        key: 'safety',
        title: 'Safety & Security',
        subtitle: 'Safety features and security measures',
        items: ['Smoke Detectors', 'Carbon Monoxide Detector', 'Fire Extinguisher', 'First Aid Kit', 'Security System', 'Gated Property', 'CCTV', 'On-site Security'],
    },
];

interface FacilityCard {
    id: string;
    name: string;
    note: string;
    image: string;
}

interface AmenitiesData {
    facilities_list: string[];
    amenities_hero_image: string;
    section_break_image: string;
    about_p1: string;
    about_p2: string;
    show_about: boolean;
    web_amenities: string[];
    featured_facilities: FacilityCard[];
    we_provide: string;
    please_bring: string;
    optional_items: string;
    show_bring: boolean;
    dining_capacity_indoor: number | null;
    dining_capacity_outdoor: number | null;
    wifi_speed: string;
    wifi_coverage: string;
    property_size: string;
    pool_type: string;
    parking_spaces: number | null;
    distance_nearest_town: string;
    wifi_details: string;
    mobile_coverage: string;
    wheelchair_access: string;
    dietary_capability: string;
    smoking_policy: string;
    pets_policy: string;
    additional_notes: string;
}

const DEFAULT_FACILITIES: FacilityCard[] = [
    { id: '1', name: 'Thermal Suite', note: 'Included with Thermal Circuit booking', image: '' },
    { id: '2', name: 'Float Pods', note: 'By booking only', image: '' },
    { id: '3', name: 'Relaxation Lounge', note: 'Included with all treatments', image: '' },
    { id: '4', name: 'Treatment Rooms', note: 'By booking only', image: '' },
];

const DEFAULT_DATA: AmenitiesData = {
    facilities_list: [],
    amenities_hero_image: '',
    section_break_image: '',
    about_p1: '',
    about_p2: '',
    show_about: true,
    web_amenities: WEBSITE_AMENITIES.slice(0, 12).map(a => a.label),
    featured_facilities: DEFAULT_FACILITIES,
    we_provide: 'Robes, slippers, towels, lockers, toiletries, hair dryers',
    please_bring: 'Swimwear for thermal facilities, personal items, a calm mindset',
    optional_items: 'Your own products if you have specific preferences',
    show_bring: true,
    dining_capacity_indoor: null,
    dining_capacity_outdoor: null,
    wifi_speed: '',
    wifi_coverage: 'Whole Property',
    property_size: '',
    pool_type: '',
    parking_spaces: null,
    distance_nearest_town: '',
    wifi_details: '',
    mobile_coverage: '',
    wheelchair_access: '',
    dietary_capability: '',
    smoking_policy: '',
    pets_policy: '',
    additional_notes: '',
};

export default function WellnessAmenitiesTab({ venue, onUpdate }: Props) {
    const [selected, setSelected] = useState<Set<string>>(new Set());
    const [data, setData] = useState<AmenitiesData>(DEFAULT_DATA);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);
    const [uploadingHero, setUploadingHero] = useState(false);
    const [uploadingBreak, setUploadingBreak] = useState(false);
    const [uploadingFacility, setUploadingFacility] = useState<string | null>(null);
    const heroInputRef = useRef<HTMLInputElement>(null);
    const breakInputRef = useRef<HTMLInputElement>(null);
    const facilityInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

    // ─── Load from venue_amenities ─────────────────────────────────────────
    const fetchData = useCallback(async () => {
        if (!venue.id) return;
        setLoading(true);
        const { data: row } = await supabase
            .from('venue_amenities')
            .select('*')
            .eq('venue_id', venue.id)
            .eq('venue_type', 'wellness')
            .single();

        if (row) {
            if (row.facilities_list?.length) setSelected(new Set(row.facilities_list));
            setData({
                facilities_list: row.facilities_list || [],
                amenities_hero_image: row.amenities_hero_image || '',
                section_break_image: row.section_break_image || '',
                about_p1: row.about_p1 || '',
                about_p2: row.about_p2 || '',
                show_about: row.show_about ?? true,
                web_amenities: row.web_amenities?.length ? row.web_amenities : DEFAULT_DATA.web_amenities,
                featured_facilities: row.featured_facilities?.length ? row.featured_facilities : DEFAULT_FACILITIES,
                we_provide: row.we_provide || DEFAULT_DATA.we_provide,
                please_bring: row.please_bring || DEFAULT_DATA.please_bring,
                optional_items: row.optional_items || DEFAULT_DATA.optional_items,
                show_bring: row.show_bring ?? true,
                dining_capacity_indoor: row.dining_capacity_indoor ?? null,
                dining_capacity_outdoor: row.dining_capacity_outdoor ?? null,
                wifi_speed: row.wifi_speed || '',
                wifi_coverage: row.wifi_coverage || 'Whole Property',
                property_size: row.property_size || '',
                pool_type: row.pool_type || '',
                parking_spaces: row.parking_spaces ?? null,
                distance_nearest_town: row.distance_nearest_town || '',
                wifi_details: row.wifi_details || '',
                mobile_coverage: row.mobile_coverage || '',
                wheelchair_access: row.wheelchair_access || '',
                dietary_capability: row.dietary_capability || '',
                smoking_policy: row.smoking_policy || '',
                pets_policy: row.pets_policy || '',
                additional_notes: row.additional_notes || '',
            });
        }
        setLoading(false);
    }, [venue.id]);

    useEffect(() => { fetchData(); }, [fetchData]);

    // ─── Helpers ───────────────────────────────────────────────────────────
    function toggleAmenity(name: string) {
        setSelected(prev => {
            const next = new Set(prev);
            if (next.has(name)) next.delete(name); else next.add(name);
            onUpdate?.({ amenities: Array.from(next), facilities: Array.from(next) });
            setHasChanges(true);
            return next;
        });
    }

    function update<K extends keyof AmenitiesData>(key: K, value: AmenitiesData[K]) {
        setData(prev => ({ ...prev, [key]: value }));
        setHasChanges(true);
    }

    function toggleWebAmenity(label: string) {
        setData(prev => {
            const next = prev.web_amenities.includes(label)
                ? prev.web_amenities.filter(a => a !== label)
                : [...prev.web_amenities, label];
            setHasChanges(true);
            return { ...prev, web_amenities: next };
        });
    }

    function updateFacility(id: string, field: keyof FacilityCard, value: string) {
        setData(prev => ({
            ...prev,
            featured_facilities: prev.featured_facilities.map(f => f.id === id ? { ...f, [field]: value } : f),
        }));
        setHasChanges(true);
    }

    // ─── Image uploads ─────────────────────────────────────────────────────
    async function handleTabImageUpload(file: File, field: 'amenities_hero_image' | 'section_break_image') {
        const setUploading = field === 'amenities_hero_image' ? setUploadingHero : setUploadingBreak;
        setUploading(true);
        try {
            const url = await uploadFile(file, 'photo');
            update(field, url);
        } catch (err) {
            console.error('Upload failed:', err);
        }
        setUploading(false);
    }

    async function handleFacilityImageUpload(file: File, facilityId: string) {
        setUploadingFacility(facilityId);
        try {
            const url = await uploadFile(file, 'photo');
            updateFacility(facilityId, 'image', url);
        } catch (err) {
            console.error('Facility image upload failed:', err);
        }
        setUploadingFacility(null);
    }

    // ─── Save to Supabase ──────────────────────────────────────────────────
    async function handleSave() {
        setSaving(true);
        const amenitiesArr = Array.from(selected);
        const { facilities_list: _ignored, ...rest } = data;
        const { error } = await supabase.from('venue_amenities').upsert({
            ...rest,
            venue_id: venue.id,
            venue_type: 'wellness',
            facilities_list: amenitiesArr,
        }, { onConflict: 'venue_id,venue_type' });

        if (error) {
            console.error('[WellnessAmenitiesTab] save error:', error);
            alert('Failed to save amenities. Please try again.');
        } else {
            onUpdate?.({ amenities: amenitiesArr, facilities: amenitiesArr, webAmenities: data.web_amenities });
            setHasChanges(false);
            alert('Amenities saved successfully!');
        }
        setSaving(false);
    }

    if (loading) {
        return <div style={{ padding: 40, textAlign: 'center', color: 'var(--accent)', fontSize: 14 }}>Loading amenities…</div>;
    }

    return (
        <div className="wvd-content">

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
                    {saving ? 'Saving…' : 'Save Amenities'}
                </button>
            )}

            {/* ── Tab Images ── */}
            <section className="wvd-form-section">
                <div className="wvd-form-section-header">
                    <div>
                        <h3 className="wvd-form-section-title">Tab Images</h3>
                        <p className="wvd-form-hint">Hero and decorative images for the Amenities tab on the public listing</p>
                    </div>
                </div>
                <div className="wvd-form-section-body">
                    <div className="wvd-form-grid">
                        {/* Hero Image */}
                        <div className="wvd-form-group">
                            <label className="wvd-form-label">Amenities Hero Image</label>
                            <input ref={heroInputRef} type="file" accept="image/*" style={{ display: 'none' }}
                                onChange={e => { const f = e.target.files?.[0]; if (f) handleTabImageUpload(f, 'amenities_hero_image'); e.target.value = ''; }} />
                            {data.amenities_hero_image ? (
                                <div style={{ position: 'relative' }}>
                                    <img src={data.amenities_hero_image} alt="Hero" style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 8 }} />
                                    <button onClick={() => update('amenities_hero_image', '')} style={{ position: 'absolute', top: 8, right: 76, background: 'rgba(0,0,0,0.6)', border: 'none', borderRadius: 4, color: '#fff', cursor: 'pointer', padding: '4px 8px', fontSize: 11 }}>Remove</button>
                                    <button onClick={() => heroInputRef.current?.click()} style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.6)', border: 'none', borderRadius: 4, color: '#fff', cursor: 'pointer', padding: '4px 8px', fontSize: 11 }}>Replace</button>
                                </div>
                            ) : uploadingHero ? (
                                <div style={{ width: '100%', height: 160, border: '2px dashed rgba(184,184,184,0.4)', borderRadius: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--secondary-bg)' }}>
                                    <Loader size={28} color="var(--accent)" strokeWidth={1.5} />
                                    <span style={{ fontSize: 12, color: 'var(--accent)', marginTop: 8 }}>Uploading…</span>
                                </div>
                            ) : (
                                <div onClick={() => heroInputRef.current?.click()} style={{ width: '100%', height: 160, border: '2px dashed rgba(184,184,184,0.4)', borderRadius: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--secondary-bg)', cursor: 'pointer' }}>
                                    <UploadCloud size={32} color="#B8B8B8" strokeWidth={1.5} />
                                    <span style={{ fontSize: 12, color: 'var(--accent)', marginTop: 8 }}>Click to upload hero image</span>
                                    <span style={{ fontSize: 11, color: 'var(--accent)' }}>Recommended: 1920 × 600px</span>
                                </div>
                            )}
                            <p className="wvd-form-hint" style={{ fontSize: 11, fontStyle: 'italic', marginTop: 6 }}>Large hero banner at the top of the Amenities tab.</p>
                        </div>

                        {/* Section Break Image */}
                        <div className="wvd-form-group">
                            <label className="wvd-form-label">Section Break Image</label>
                            <input ref={breakInputRef} type="file" accept="image/*" style={{ display: 'none' }}
                                onChange={e => { const f = e.target.files?.[0]; if (f) handleTabImageUpload(f, 'section_break_image'); e.target.value = ''; }} />
                            {data.section_break_image ? (
                                <div style={{ position: 'relative' }}>
                                    <img src={data.section_break_image} alt="Break" style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 8 }} />
                                    <button onClick={() => update('section_break_image', '')} style={{ position: 'absolute', top: 8, right: 76, background: 'rgba(0,0,0,0.6)', border: 'none', borderRadius: 4, color: '#fff', cursor: 'pointer', padding: '4px 8px', fontSize: 11 }}>Remove</button>
                                    <button onClick={() => breakInputRef.current?.click()} style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.6)', border: 'none', borderRadius: 4, color: '#fff', cursor: 'pointer', padding: '4px 8px', fontSize: 11 }}>Replace</button>
                                </div>
                            ) : uploadingBreak ? (
                                <div style={{ width: '100%', height: 160, border: '2px dashed rgba(184,184,184,0.4)', borderRadius: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--secondary-bg)' }}>
                                    <Loader size={28} color="var(--accent)" strokeWidth={1.5} />
                                    <span style={{ fontSize: 12, color: 'var(--accent)', marginTop: 8 }}>Uploading…</span>
                                </div>
                            ) : (
                                <div onClick={() => breakInputRef.current?.click()} style={{ width: '100%', height: 160, border: '2px dashed rgba(184,184,184,0.4)', borderRadius: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--secondary-bg)', cursor: 'pointer' }}>
                                    <UploadCloud size={32} color="#B8B8B8" strokeWidth={1.5} />
                                    <span style={{ fontSize: 12, color: 'var(--accent)', marginTop: 8 }}>Click to upload break image</span>
                                    <span style={{ fontSize: 11, color: 'var(--accent)' }}>Recommended: 1920 × 400px</span>
                                </div>
                            )}
                            <p className="wvd-form-hint" style={{ fontSize: 11, fontStyle: 'italic', marginTop: 6 }}>Decorative image between amenity sections.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── About Section ── */}
            <section className="wvd-form-section">
                <div className="wvd-form-section-header">
                    <div>
                        <h3 className="wvd-form-section-title">About Section</h3>
                        <p className="wvd-form-hint">Introduction content for the About / Space tab on your public listing</p>
                    </div>
                    <div className="wvd-toggle-container">
                        <div className={`wvd-toggle ${data.show_about ? 'active' : ''}`} onClick={() => update('show_about', !data.show_about)}>
                            <div className="wvd-toggle-knob"></div>
                        </div>
                        <span className="wvd-toggle-label">Display on website</span>
                    </div>
                </div>
                <div className="wvd-form-section-body">
                    <div className="wvd-form-grid">
                        <div className="wvd-form-group wvd-full-width">
                            <label className="wvd-form-label">About Paragraph 1</label>
                            <textarea className="wvd-form-input wvd-form-textarea" rows={3} value={data.about_p1} onChange={e => update('about_p1', e.target.value)} placeholder="First introductory paragraph about your venue..." />
                        </div>
                        <div className="wvd-form-group wvd-full-width">
                            <label className="wvd-form-label">About Paragraph 2</label>
                            <textarea className="wvd-form-input wvd-form-textarea" rows={3} value={data.about_p2} onChange={e => update('about_p2', e.target.value)} placeholder="Second paragraph (optional)..." />
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Featured Facilities ── */}
            <section className="wvd-form-section">
                <div className="wvd-form-section-header">
                    <div>
                        <h3 className="wvd-form-section-title">Featured Facilities</h3>
                        <p className="wvd-form-hint">Highlight up to 4 key facilities with images on your public listing</p>
                    </div>
                </div>
                <div className="wvd-form-section-body">
                    <div className="wam-facility-cards">
                        {data.featured_facilities.map(facility => (
                            <div key={facility.id} className="wam-facility-card">
                                {/* Facility Image Upload */}
                                <div
                                    className="wam-facility-image"
                                    style={{ position: 'relative', cursor: 'pointer', overflow: 'hidden' }}
                                    onClick={() => !uploadingFacility && facilityInputRefs.current[facility.id]?.click()}
                                >
                                    {facility.image ? (
                                        <>
                                            <img src={facility.image} alt={facility.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 6 }} />
                                            <button
                                                type="button"
                                                onClick={e => { e.stopPropagation(); updateFacility(facility.id, 'image', ''); }}
                                                style={{ position: 'absolute', top: 3, right: 3, background: 'rgba(0,0,0,0.55)', border: 'none', borderRadius: '50%', width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff', fontSize: 12, lineHeight: 1 }}
                                            >×</button>
                                        </>
                                    ) : uploadingFacility === facility.id ? (
                                        <Loader size={18} color="var(--accent)" strokeWidth={1.5} />
                                    ) : (
                                        <UploadCloud size={20} strokeWidth={1.5} color="#B8B8B8" />
                                    )}
                                </div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    ref={el => { facilityInputRefs.current[facility.id] = el; }}
                                    onChange={e => { const f = e.target.files?.[0]; if (f) handleFacilityImageUpload(f, facility.id); e.target.value = ''; }}
                                />
                                <div style={{ flex: 1 }}>
                                    <input
                                        type="text"
                                        className="wvd-form-input"
                                        style={{ fontSize: 12, padding: '6px 10px', marginBottom: 6 }}
                                        value={facility.name}
                                        onChange={e => updateFacility(facility.id, 'name', e.target.value)}
                                        placeholder="Facility name…"
                                    />
                                    <input
                                        type="text"
                                        className="wvd-form-input"
                                        style={{ fontSize: 11, padding: '4px 8px' }}
                                        value={facility.note}
                                        onChange={e => updateFacility(facility.id, 'note', e.target.value)}
                                        placeholder="Access note…"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Website Amenities Display ── */}
            <section className="wvd-form-section">
                <div className="wvd-form-section-header">
                    <div>
                        <h3 className="wvd-form-section-title">Website Amenities Display</h3>
                        <p className="wvd-form-hint">Select amenities to display as icon grid on your public listing</p>
                    </div>
                    <span style={{ fontSize: 12, color: 'var(--success)', fontWeight: 500 }}>{data.web_amenities.length} selected</span>
                </div>
                <div className="wvd-form-section-body">
                    <div className="wa-inclusions-grid">
                        {WEBSITE_AMENITIES.map(a => {
                            const isSelected = data.web_amenities.includes(a.label);
                            return (
                                <div key={a.label} className="wa-inclusion-item" onClick={() => toggleWebAmenity(a.label)}>
                                    <div className={`wa-inclusion-check ${isSelected ? 'active' : ''}`}>
                                        {isSelected && <Check size={10} color="#fff" strokeWidth={3} />}
                                    </div>
                                    <span>{a.emoji} {a.label}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ── What to Bring ── */}
            <section className="wvd-form-section">
                <div className="wvd-form-section-header">
                    <div>
                        <h3 className="wvd-form-section-title">What to Bring</h3>
                        <p className="wvd-form-hint">Guest information displayed on the About / Space tab</p>
                    </div>
                    <div className="wvd-toggle-container">
                        <div className={`wvd-toggle ${data.show_bring ? 'active' : ''}`} onClick={() => update('show_bring', !data.show_bring)}>
                            <div className="wvd-toggle-knob"></div>
                        </div>
                        <span className="wvd-toggle-label">Display on website</span>
                    </div>
                </div>
                <div className="wvd-form-section-body">
                    <div className="wvd-form-grid">
                        <div className="wvd-form-group wvd-full-width">
                            <label className="wvd-form-label">We Provide</label>
                            <input type="text" className="wvd-form-input" value={data.we_provide} onChange={e => update('we_provide', e.target.value)} placeholder="What you provide to guests…" />
                        </div>
                        <div className="wvd-form-group wvd-full-width">
                            <label className="wvd-form-label">Please Bring</label>
                            <input type="text" className="wvd-form-input" value={data.please_bring} onChange={e => update('please_bring', e.target.value)} placeholder="What guests should bring…" />
                        </div>
                        <div className="wvd-form-group wvd-full-width">
                            <label className="wvd-form-label">Optional</label>
                            <input type="text" className="wvd-form-input" value={data.optional_items} onChange={e => update('optional_items', e.target.value)} placeholder="Optional items…" />
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══ OPERATIONAL AMENITY CATEGORIES ═══ */}
            {AMENITY_CATEGORIES.map(cat => {
                const checkedCount = cat.items.filter(i => selected.has(i)).length;
                return (
                    <section className="wvd-form-section" key={cat.key}>
                        <div className="wvd-form-section-header">
                            <div>
                                <h3 className="wvd-form-section-title">{cat.title}</h3>
                                <p className="wvd-form-hint">{cat.subtitle}</p>
                            </div>
                            <span style={{ fontSize: 12, color: checkedCount > 0 ? 'var(--success)' : 'var(--accent)', fontWeight: 500 }}>
                                {checkedCount} of {cat.items.length} selected
                            </span>
                        </div>
                        <div className="wvd-form-section-body">
                            <div className="wam-amenity-grid">
                                {cat.items.map(item => {
                                    const isChecked = selected.has(item);
                                    return (
                                        <div
                                            key={item}
                                            className={`wam-amenity-item${isChecked ? ' checked' : ''}`}
                                            onClick={() => toggleAmenity(item)}
                                        >
                                            <div className={`wam-amenity-checkbox${isChecked ? ' checked' : ''}`}>
                                                {isChecked && <Check size={12} color="#fff" strokeWidth={3} />}
                                            </div>
                                            <span className="wam-amenity-label">{item}</span>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Category-specific extras */}
                            {cat.key === 'kitchen' && (
                                <div className="wvd-form-grid" style={{ marginTop: 24 }}>
                                    <div className="wvd-form-group">
                                        <label className="wvd-form-label">Dining Capacity (Indoor)</label>
                                        <input type="number" className="wvd-form-input" value={data.dining_capacity_indoor ?? ''} onChange={e => update('dining_capacity_indoor', e.target.value ? parseInt(e.target.value) : null)} />
                                    </div>
                                    <div className="wvd-form-group">
                                        <label className="wvd-form-label">Dining Capacity (Outdoor)</label>
                                        <input type="number" className="wvd-form-input" value={data.dining_capacity_outdoor ?? ''} onChange={e => update('dining_capacity_outdoor', e.target.value ? parseInt(e.target.value) : null)} />
                                    </div>
                                </div>
                            )}
                            {cat.key === 'tech' && (
                                <div className="wvd-form-grid" style={{ marginTop: 24 }}>
                                    <div className="wvd-form-group">
                                        <label className="wvd-form-label">WiFi Speed (Mbps)</label>
                                        <input type="text" className="wvd-form-input" value={data.wifi_speed} placeholder="e.g. 100+ Mbps" onChange={e => update('wifi_speed', e.target.value)} />
                                    </div>
                                    <div className="wvd-form-group">
                                        <label className="wvd-form-label">WiFi Coverage</label>
                                        <div style={{ position: 'relative' }}>
                                            <select className="wvd-form-input wvd-form-select" style={{ width: '100%', appearance: 'none' }} value={data.wifi_coverage} onChange={e => update('wifi_coverage', e.target.value)}>
                                                <option>Whole Property</option>
                                                <option>Main Building Only</option>
                                                <option>Common Areas Only</option>
                                            </select>
                                            <ChevronDown size={16} color="#B8B8B8" style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                                        </div>
                                    </div>
                                </div>
                            )}
                            {cat.key === 'outdoor' && (
                                <div className="wvd-form-grid" style={{ marginTop: 24 }}>
                                    <div className="wvd-form-group">
                                        <label className="wvd-form-label">Property Size</label>
                                        <input type="text" className="wvd-form-input" value={data.property_size} placeholder="e.g. 45 acres" onChange={e => update('property_size', e.target.value)} />
                                    </div>
                                    <div className="wvd-form-group">
                                        <label className="wvd-form-label">Pool Type</label>
                                        <div style={{ position: 'relative' }}>
                                            <select className="wvd-form-input wvd-form-select" style={{ width: '100%', appearance: 'none' }} value={data.pool_type} onChange={e => update('pool_type', e.target.value)}>
                                                <option value="">Select…</option>
                                                <option>Heated Outdoor</option>
                                                <option>Unheated Outdoor</option>
                                                <option>Indoor</option>
                                                <option>Natural / Dam</option>
                                            </select>
                                            <ChevronDown size={16} color="#B8B8B8" style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                                        </div>
                                    </div>
                                </div>
                            )}
                            {cat.key === 'parking' && (
                                <div className="wvd-form-grid" style={{ marginTop: 24 }}>
                                    <div className="wvd-form-group">
                                        <label className="wvd-form-label">Parking Spaces</label>
                                        <input type="number" className="wvd-form-input" value={data.parking_spaces ?? ''} onChange={e => update('parking_spaces', e.target.value ? parseInt(e.target.value) : null)} />
                                    </div>
                                    <div className="wvd-form-group">
                                        <label className="wvd-form-label">Distance to Nearest Town</label>
                                        <input type="text" className="wvd-form-input" value={data.distance_nearest_town} placeholder="e.g. 5 min to town" onChange={e => update('distance_nearest_town', e.target.value)} />
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>
                );
            })}

            {/* ── Good to Know ── */}
            <section className="wvd-form-section">
                <div className="wvd-form-section-header">
                    <div>
                        <h3 className="wvd-form-section-title">Good to Know</h3>
                        <p className="wvd-form-hint">Policies and practical information displayed on the Amenities tab</p>
                    </div>
                </div>
                <div className="wvd-form-section-body">
                    <h4 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16, fontWeight: 600, marginBottom: 16, color: 'var(--text)' }}>Connectivity</h4>
                    <div className="wvd-form-grid">
                        <div className="wvd-form-group">
                            <label className="wvd-form-label">WiFi Details</label>
                            <textarea className="wvd-form-input wvd-form-textarea" rows={2} placeholder="Describe WiFi availability…" value={data.wifi_details} onChange={e => update('wifi_details', e.target.value)} />
                        </div>
                        <div className="wvd-form-group">
                            <label className="wvd-form-label">Mobile Coverage</label>
                            <textarea className="wvd-form-input wvd-form-textarea" rows={2} placeholder="Describe mobile reception…" value={data.mobile_coverage} onChange={e => update('mobile_coverage', e.target.value)} />
                        </div>
                    </div>
                    <h4 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16, fontWeight: 600, margin: '24px 0 16px', color: 'var(--text)' }}>Accessibility</h4>
                    <div className="wvd-form-grid">
                        <div className="wvd-form-group">
                            <label className="wvd-form-label">Wheelchair Access</label>
                            <textarea className="wvd-form-input wvd-form-textarea" rows={2} placeholder="Describe wheelchair accessibility…" value={data.wheelchair_access} onChange={e => update('wheelchair_access', e.target.value)} />
                        </div>
                        <div className="wvd-form-group">
                            <label className="wvd-form-label">Dietary Capability</label>
                            <textarea className="wvd-form-input wvd-form-textarea" rows={2} placeholder="Describe kitchen dietary capabilities…" value={data.dietary_capability} onChange={e => update('dietary_capability', e.target.value)} />
                        </div>
                    </div>
                    <h4 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16, fontWeight: 600, margin: '24px 0 16px', color: 'var(--text)' }}>Environment</h4>
                    <div className="wvd-form-grid">
                        <div className="wvd-form-group">
                            <label className="wvd-form-label">Smoking Policy</label>
                            <textarea className="wvd-form-input wvd-form-textarea" rows={2} placeholder="Describe smoking policy…" value={data.smoking_policy} onChange={e => update('smoking_policy', e.target.value)} />
                        </div>
                        <div className="wvd-form-group">
                            <label className="wvd-form-label">Pets Policy</label>
                            <textarea className="wvd-form-input wvd-form-textarea" rows={2} placeholder="Describe pets policy…" value={data.pets_policy} onChange={e => update('pets_policy', e.target.value)} />
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Additional Notes ── */}
            <section className="wvd-form-section">
                <div className="wvd-form-section-header">
                    <h3 className="wvd-form-section-title">Additional Amenities Notes</h3>
                </div>
                <div className="wvd-form-section-body">
                    <div className="wvd-form-group">
                        <label className="wvd-form-label">Notes</label>
                        <textarea className="wvd-form-input wvd-form-textarea" rows={4} value={data.additional_notes} onChange={e => update('additional_notes', e.target.value)} placeholder="Any additional amenities or special features…" />
                    </div>
                </div>
            </section>

        </div>
    );
}
