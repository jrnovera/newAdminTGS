import { useState, useEffect, useCallback, useRef } from 'react';
import { Check, UploadCloud, ChevronDown, Save, Loader } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { uploadFile } from '../lib/storage';
import type { Venue } from '../context/VenueContext';

interface AmenitiesTabProps {
    venue: Venue;
    onUpdate?: (updates: Partial<Venue>) => void;
}

// ─── All amenity items grouped by category ────────────────────────────────────
const AMENITY_CATEGORIES: { title: string; subtitle: string; items: string[] }[] = [
    {
        title: 'Kitchen & Dining',
        subtitle: 'Food preparation and dining facilities',
        items: [
            'Commercial Kitchen', 'Domestic Kitchen', 'Full-size Refrigerator', 'Walk-in Pantry',
            'Dishwasher', 'Oven / Stove', 'Microwave', 'Coffee Machine', 'Blender / Vitamix',
            'Formal Dining Room', 'Outdoor Dining Area', 'BBQ / Grill', 'Pizza Oven',
            'Breakfast Bar', 'Cookware & Utensils',
        ],
    },
    {
        title: 'Living & Entertainment',
        subtitle: 'Common areas and entertainment options',
        items: [
            'Living Room', 'Fireplace', 'Smart TV', 'Streaming Services', 'Sound System',
            'Library / Reading Area', 'Games Room', 'Board Games', 'Piano / Musical Instruments',
            'Projector / Screen', 'Home Cinema', 'Gym Equipment',
        ],
    },
    {
        title: 'Technology & Connectivity',
        subtitle: 'Internet, power, and tech amenities',
        items: [
            'WiFi', 'High-Speed Internet', 'Starlink / Satellite', 'Mobile Signal',
            'EV Charging', 'Printer / Scanner', 'Dedicated Office Space',
        ],
    },
    {
        title: 'Outdoor & Grounds',
        subtitle: 'Outdoor spaces and property features',
        items: [
            'Swimming Pool', 'Heated Pool', 'Indoor Pool', 'Garden / Grounds', 'Outdoor Seating',
            'Covered Verandah / Patio', 'Fire Pit', 'Tennis Court', 'Golf Course Access',
            'Farm Animals', 'Orchard / Produce Garden', 'Walking Trails', 'Beach Access',
            'Lake / River Access',
        ],
    },
    {
        title: 'Parking & Transport',
        subtitle: 'Vehicle access and parking facilities',
        items: [
            'Free Parking', 'On-site Parking', 'Covered / Garage Parking', 'Bus / Coach Access',
            'Airport Transfers Available', 'Helipad',
        ],
    },
    {
        title: 'Laundry & Housekeeping',
        subtitle: 'Cleaning and laundry facilities',
        items: [
            'Washing Machine', 'Dryer', 'Iron & Ironing Board', 'Linens Provided',
            'Towels Provided', 'Daily Housekeeping', 'Laundry Service',
        ],
    },
    {
        title: 'Climate & Comfort',
        subtitle: 'Heating, cooling, and comfort features',
        items: [
            'Air Conditioning', 'Central Heating', 'Fireplace / Wood Heater',
            'Ceiling Fans', 'Underfloor Heating', 'Heated Bathroom Floors',
        ],
    },
    {
        title: 'Safety & Security',
        subtitle: 'Safety features and security measures',
        items: [
            'Smoke Detectors', 'Carbon Monoxide Detector', 'Fire Extinguisher', 'First Aid Kit',
            'Security System', 'Gated Property', 'CCTV', 'On-site Security',
        ],
    },
];

// ─── Extra fields stored alongside amenities ──────────────────────────────────
interface AmenityExtras {
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
    amenities_hero_image: string;
    section_break_image: string;
}

const defaultExtras: AmenityExtras = {
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
    amenities_hero_image: '',
    section_break_image: '',
};

export default function AmenitiesTab({ venue, onUpdate }: AmenitiesTabProps) {
    // Selected amenities — initialized from venue data
    const [selected, setSelected] = useState<Set<string>>(new Set(venue.amenities || []));
    const [extras, setExtras] = useState<AmenityExtras>(defaultExtras);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);
    const [uploadingHero, setUploadingHero] = useState(false);
    const [uploadingBreak, setUploadingBreak] = useState(false);
    const heroInputRef = useRef<HTMLInputElement>(null);
    const breakInputRef = useRef<HTMLInputElement>(null);

    // ─── Fetch extra fields from venue_amenities table ──────────────────
    const fetchExtras = useCallback(async () => {
        if (!venue.id) return;
        setLoading(true);
        const { data } = await supabase
            .from('venue_amenities')
            .select('*')
            .eq('venue_id', venue.id)
            .eq('venue_type', 'retreat')
            .single();

        if (data) {
            // Load facilities_list into selected set
            if (data.facilities_list && Array.isArray(data.facilities_list)) {
                setSelected(new Set(data.facilities_list));
            }
            setExtras({
                dining_capacity_indoor: data.dining_capacity_indoor ?? null,
                dining_capacity_outdoor: data.dining_capacity_outdoor ?? null,
                wifi_speed: data.wifi_speed || '',
                wifi_coverage: data.wifi_coverage || 'Whole Property',
                property_size: data.property_size || '',
                pool_type: data.pool_type || '',
                parking_spaces: data.parking_spaces ?? null,
                distance_nearest_town: data.distance_nearest_town || '',
                wifi_details: data.wifi_details || '',
                mobile_coverage: data.mobile_coverage || '',
                wheelchair_access: data.wheelchair_access || '',
                dietary_capability: data.dietary_capability || '',
                smoking_policy: data.smoking_policy || '',
                pets_policy: data.pets_policy || '',
                additional_notes: data.additional_notes || '',
                amenities_hero_image: data.amenities_hero_image || '',
                section_break_image: data.section_break_image || '',
            });
        }
        setLoading(false);
    }, [venue.id]);

    useEffect(() => { fetchExtras(); }, [fetchExtras]);

    // ─── Toggle an amenity ──────────────────────────────────────────────
    function toggleAmenity(name: string) {
        setSelected(prev => {
            const next = new Set(prev);
            if (next.has(name)) next.delete(name);
            else next.add(name);

            // Propagate update via onUpdate for the "Save Changes" button
            const arr = Array.from(next);
            onUpdate?.({ amenities: arr, facilities: arr });
            setHasChanges(true);
            return next;
        });
    }

    // ─── Update an extra field ──────────────────────────────────────────
    function updateExtra<K extends keyof AmenityExtras>(key: K, value: AmenityExtras[K]) {
        setExtras(prev => ({ ...prev, [key]: value }));
        setHasChanges(true);
    }

    // ─── Handle image upload ────────────────────────────────────────────
    async function handleImageUpload(file: File, field: 'amenities_hero_image' | 'section_break_image') {
        const setUploading = field === 'amenities_hero_image' ? setUploadingHero : setUploadingBreak;
        setUploading(true);
        try {
            const publicUrl = await uploadFile(file, 'photo');
            updateExtra(field, publicUrl);
        } catch (err) {
            console.error('Image upload failed:', err);
            alert('Failed to upload image. Please try again.');
        }
        setUploading(false);
    }

    // ─── Save all to Supabase ───────────────────────────────────────────
    async function handleSave() {
        setSaving(true);
        const amenitiesArr = Array.from(selected);
        const payload: Record<string, any> = {
            venue_id: venue.id,
            venue_type: 'retreat',
            facilities_list: amenitiesArr,
            ...extras,
        };

        const { error } = await supabase.from('venue_amenities').upsert(payload, { onConflict: 'venue_id,venue_type' });
        setSaving(false);
        if (error) {
            alert('Error saving amenities: ' + error.message);
            return;
        }
        onUpdate?.({ amenities: amenitiesArr, facilities: amenitiesArr });
        setHasChanges(false);
        alert('Amenities saved successfully!');
    }

    // ─── Render ─────────────────────────────────────────────────────────
    if (loading) {
        return <div style={{ padding: 40, textAlign: 'center', color: 'var(--accent)', fontSize: 14 }}>Loading amenities…</div>;
    }

    return (
        <div className="content-area">

            {/* Floating Save Button */}
            {hasChanges && (
                <div style={{
                    position: 'sticky', top: 12, zIndex: 100, display: 'flex', justifyContent: 'flex-end',
                    marginBottom: 16
                }}>
                    <button
                        className="btn btn-primary"
                        onClick={handleSave}
                        disabled={saving}
                        style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}
                    >
                        <Save size={16} style={{ marginRight: 6 }} />
                        {saving ? 'Saving…' : 'Save Amenities'}
                    </button>
                </div>
            )}

            {/* Tab Images */}
            <section className="form-section">
                <div className="form-section-header">
                    <div>
                        <h3 className="form-section-title">Tab Images</h3>
                        <p className="form-section-subtitle">Hero and decorative images for the Amenities tab on the public listing</p>
                    </div>
                </div>
                <div className="form-section-body">
                    <div className="form-grid">
                        {/* Hero Image */}
                        <div className="form-group">
                            <label className="form-label">Amenities Hero Image</label>
                            <input
                                ref={heroInputRef}
                                type="file"
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={e => {
                                    const file = e.target.files?.[0];
                                    if (file) handleImageUpload(file, 'amenities_hero_image');
                                    e.target.value = '';
                                }}
                            />
                            {extras.amenities_hero_image ? (
                                <div style={{ position: 'relative' }}>
                                    <img src={extras.amenities_hero_image} alt="Hero" style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 8 }} />
                                    <button
                                        onClick={() => updateExtra('amenities_hero_image', '')}
                                        style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.6)', border: 'none', borderRadius: 4, color: '#fff', cursor: 'pointer', padding: '4px 8px', fontSize: 11 }}
                                    >
                                        Remove
                                    </button>
                                    <button
                                        onClick={() => heroInputRef.current?.click()}
                                        style={{ position: 'absolute', bottom: 8, right: 8, background: 'rgba(0,0,0,0.6)', border: 'none', borderRadius: 4, color: '#fff', cursor: 'pointer', padding: '4px 8px', fontSize: 11 }}
                                    >
                                        Replace
                                    </button>
                                </div>
                            ) : uploadingHero ? (
                                <div style={{ width: '100%', height: '160px', border: '2px dashed rgba(184, 184, 184, 0.4)', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--secondary-bg)' }}>
                                    <Loader size={28} color="var(--accent)" strokeWidth={1.5} className="spin" />
                                    <span style={{ fontSize: '12px', color: 'var(--accent)', marginTop: '8px' }}>Uploading…</span>
                                </div>
                            ) : (
                                <div
                                    onClick={() => heroInputRef.current?.click()}
                                    style={{ width: '100%', height: '160px', border: '2px dashed rgba(184, 184, 184, 0.4)', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--secondary-bg)', cursor: 'pointer', transition: 'border-color 0.2s' }}
                                    onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--success)')}
                                    onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(184, 184, 184, 0.4)')}
                                >
                                    <UploadCloud size={32} color="#B8B8B8" strokeWidth={1.5} />
                                    <span style={{ fontSize: '12px', color: 'var(--accent)', marginTop: '8px' }}>Click to upload hero image</span>
                                    <span style={{ fontSize: '11px', color: 'var(--accent)' }}>Recommended: 1920 x 600px</span>
                                </div>
                            )}
                            <p className="form-hint" style={{ fontSize: '11px', fontStyle: 'italic', color: 'var(--accent)', marginTop: '6px' }}>This image appears as the large hero banner at the top of the Amenities tab.</p>
                        </div>

                        {/* Section Break Image */}
                        <div className="form-group">
                            <label className="form-label">Section Break Image</label>
                            <input
                                ref={breakInputRef}
                                type="file"
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={e => {
                                    const file = e.target.files?.[0];
                                    if (file) handleImageUpload(file, 'section_break_image');
                                    e.target.value = '';
                                }}
                            />
                            {extras.section_break_image ? (
                                <div style={{ position: 'relative' }}>
                                    <img src={extras.section_break_image} alt="Break" style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 8 }} />
                                    <button
                                        onClick={() => updateExtra('section_break_image', '')}
                                        style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.6)', border: 'none', borderRadius: 4, color: '#fff', cursor: 'pointer', padding: '4px 8px', fontSize: 11 }}
                                    >
                                        Remove
                                    </button>
                                    <button
                                        onClick={() => breakInputRef.current?.click()}
                                        style={{ position: 'absolute', bottom: 8, right: 8, background: 'rgba(0,0,0,0.6)', border: 'none', borderRadius: 4, color: '#fff', cursor: 'pointer', padding: '4px 8px', fontSize: 11 }}
                                    >
                                        Replace
                                    </button>
                                </div>
                            ) : uploadingBreak ? (
                                <div style={{ width: '100%', height: '160px', border: '2px dashed rgba(184, 184, 184, 0.4)', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--secondary-bg)' }}>
                                    <Loader size={28} color="var(--accent)" strokeWidth={1.5} className="spin" />
                                    <span style={{ fontSize: '12px', color: 'var(--accent)', marginTop: '8px' }}>Uploading…</span>
                                </div>
                            ) : (
                                <div
                                    onClick={() => breakInputRef.current?.click()}
                                    style={{ width: '100%', height: '160px', border: '2px dashed rgba(184, 184, 184, 0.4)', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--secondary-bg)', cursor: 'pointer', transition: 'border-color 0.2s' }}
                                    onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--success)')}
                                    onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(184, 184, 184, 0.4)')}
                                >
                                    <UploadCloud size={32} color="#B8B8B8" strokeWidth={1.5} />
                                    <span style={{ fontSize: '12px', color: 'var(--accent)', marginTop: '8px' }}>Click to upload break image</span>
                                    <span style={{ fontSize: '11px', color: 'var(--accent)' }}>Recommended: 1920 x 400px</span>
                                </div>
                            )}
                            <p className="form-hint" style={{ fontSize: '11px', fontStyle: 'italic', color: 'var(--accent)', marginTop: '6px' }}>Decorative image displayed between amenity sections on the public listing.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Dynamic Amenity Category Sections */}
            {AMENITY_CATEGORIES.map((cat, catIdx) => {
                const checkedCount = cat.items.filter(i => selected.has(i)).length;
                return (
                    <section className="form-section" key={catIdx}>
                        <div className="form-section-header">
                            <div>
                                <h3 className="form-section-title">{cat.title}</h3>
                                <p className="form-section-subtitle">{cat.subtitle}</p>
                            </div>
                            <span style={{ fontSize: '12px', color: checkedCount > 0 ? 'var(--success)' : 'var(--accent)', fontWeight: 500 }}>
                                {checkedCount} of {cat.items.length} selected
                            </span>
                        </div>
                        <div className="form-section-body">
                            <div className="amenity-grid">
                                {cat.items.map(item => {
                                    const isChecked = selected.has(item);
                                    return (
                                        <div
                                            key={item}
                                            className={`amenity-item${isChecked ? ' checked' : ''}`}
                                            onClick={() => toggleAmenity(item)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <div className="amenity-checkbox">
                                                {isChecked && <Check size={14} color="white" strokeWidth={3} />}
                                            </div>
                                            <span className="amenity-label">{item}</span>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Category-specific extra fields */}
                            {cat.title === 'Kitchen & Dining' && (
                                <div className="form-grid" style={{ marginTop: '24px' }}>
                                    <div className="form-group">
                                        <label className="form-label">Dining Capacity (Indoor)</label>
                                        <input
                                            type="number"
                                            className="form-input"
                                            value={extras.dining_capacity_indoor ?? ''}
                                            onChange={e => updateExtra('dining_capacity_indoor', e.target.value ? parseInt(e.target.value) : null)}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Dining Capacity (Outdoor)</label>
                                        <input
                                            type="number"
                                            className="form-input"
                                            value={extras.dining_capacity_outdoor ?? ''}
                                            onChange={e => updateExtra('dining_capacity_outdoor', e.target.value ? parseInt(e.target.value) : null)}
                                        />
                                    </div>
                                </div>
                            )}

                            {cat.title === 'Technology & Connectivity' && (
                                <div className="form-grid" style={{ marginTop: '24px' }}>
                                    <div className="form-group">
                                        <label className="form-label">WiFi Speed (Mbps)</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            value={extras.wifi_speed}
                                            placeholder="e.g. 100+ Mbps"
                                            onChange={e => updateExtra('wifi_speed', e.target.value)}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">WiFi Coverage</label>
                                        <div style={{ position: 'relative' }}>
                                            <select
                                                className="form-input"
                                                style={{ width: '100%', appearance: 'none' }}
                                                value={extras.wifi_coverage}
                                                onChange={e => updateExtra('wifi_coverage', e.target.value)}
                                            >
                                                <option value="Whole Property">Whole Property</option>
                                                <option value="Main Building Only">Main Building Only</option>
                                                <option value="Common Areas Only">Common Areas Only</option>
                                            </select>
                                            <ChevronDown size={16} color="#B8B8B8" style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {cat.title === 'Outdoor & Grounds' && (
                                <div className="form-grid" style={{ marginTop: '24px' }}>
                                    <div className="form-group">
                                        <label className="form-label">Property Size (acres/hectares)</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            value={extras.property_size}
                                            placeholder="e.g. 45 acres"
                                            onChange={e => updateExtra('property_size', e.target.value)}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Pool Type</label>
                                        <div style={{ position: 'relative' }}>
                                            <select
                                                className="form-input"
                                                style={{ width: '100%', appearance: 'none' }}
                                                value={extras.pool_type}
                                                onChange={e => updateExtra('pool_type', e.target.value)}
                                            >
                                                <option value="">Select…</option>
                                                <option value="Heated Outdoor">Heated Outdoor</option>
                                                <option value="Unheated Outdoor">Unheated Outdoor</option>
                                                <option value="Indoor">Indoor</option>
                                                <option value="Natural / Dam">Natural / Dam</option>
                                            </select>
                                            <ChevronDown size={16} color="#B8B8B8" style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {cat.title === 'Parking & Transport' && (
                                <div className="form-grid" style={{ marginTop: '24px' }}>
                                    <div className="form-group">
                                        <label className="form-label">Parking Spaces</label>
                                        <input
                                            type="number"
                                            className="form-input"
                                            value={extras.parking_spaces ?? ''}
                                            onChange={e => updateExtra('parking_spaces', e.target.value ? parseInt(e.target.value) : null)}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Distance to Nearest Town</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            value={extras.distance_nearest_town}
                                            placeholder="e.g. 5 min to Berry village"
                                            onChange={e => updateExtra('distance_nearest_town', e.target.value)}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>
                );
            })}

            {/* Good to Know */}
            <section className="form-section">
                <div className="form-section-header">
                    <div>
                        <h3 className="form-section-title">Good to Know</h3>
                        <p className="form-section-subtitle">Policies and practical information displayed on the Amenities tab</p>
                    </div>
                </div>
                <div className="form-section-body">
                    <h4 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '16px', fontWeight: 600, marginBottom: '16px', color: 'var(--text)' }}>Connectivity</h4>
                    <div className="form-grid">
                        <div className="form-group">
                            <label className="form-label">WiFi Details</label>
                            <textarea
                                className="form-input form-textarea"
                                rows={2}
                                placeholder="Describe WiFi availability and any recommendations..."
                                value={extras.wifi_details}
                                onChange={e => updateExtra('wifi_details', e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Mobile Coverage</label>
                            <textarea
                                className="form-input form-textarea"
                                rows={2}
                                placeholder="Describe mobile reception at the venue..."
                                value={extras.mobile_coverage}
                                onChange={e => updateExtra('mobile_coverage', e.target.value)}
                            />
                        </div>
                    </div>

                    <h4 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '16px', fontWeight: 600, margin: '24px 0 16px 0', color: 'var(--text)' }}>Accessibility</h4>
                    <div className="form-grid">
                        <div className="form-group">
                            <label className="form-label">Wheelchair Access</label>
                            <textarea
                                className="form-input form-textarea"
                                rows={2}
                                placeholder="Describe wheelchair accessibility..."
                                value={extras.wheelchair_access}
                                onChange={e => updateExtra('wheelchair_access', e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Dietary Capability</label>
                            <textarea
                                className="form-input form-textarea"
                                rows={2}
                                placeholder="Describe kitchen dietary capabilities..."
                                value={extras.dietary_capability}
                                onChange={e => updateExtra('dietary_capability', e.target.value)}
                            />
                            <p className="form-hint" style={{ fontSize: '11px', fontStyle: 'italic', color: 'var(--accent)', marginTop: '6px' }}>This may also pull from Dining & Catering if more detail is provided there.</p>
                        </div>
                    </div>

                    <h4 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '16px', fontWeight: 600, margin: '24px 0 16px 0', color: 'var(--text)' }}>Environment</h4>
                    <div className="form-grid">
                        <div className="form-group">
                            <label className="form-label">Smoking Policy</label>
                            <textarea
                                className="form-input form-textarea"
                                rows={2}
                                placeholder="Describe smoking policy..."
                                value={extras.smoking_policy}
                                onChange={e => updateExtra('smoking_policy', e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Pets Policy</label>
                            <textarea
                                className="form-input form-textarea"
                                rows={2}
                                placeholder="Describe pets policy..."
                                value={extras.pets_policy}
                                onChange={e => updateExtra('pets_policy', e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Additional Amenities Notes */}
            <section className="form-section">
                <div className="form-section-header">
                    <h3 className="form-section-title">Additional Amenities Notes</h3>
                </div>
                <div className="form-section-body">
                    <div className="form-group">
                        <label className="form-label">Notes</label>
                        <textarea
                            className="form-input form-textarea"
                            placeholder="Any additional amenities or special features..."
                            value={extras.additional_notes}
                            onChange={e => updateExtra('additional_notes', e.target.value)}
                        />
                    </div>
                </div>
            </section>

        </div>
    );
}
