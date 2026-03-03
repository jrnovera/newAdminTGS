import { useState } from 'react';
import { Check, Upload } from 'lucide-react';
import type { Venue } from '../../context/VenueContext';

interface Props {
    venue: Venue;
    onUpdate: (updates: Partial<Venue>) => void;
}

/* ── Website Amenities options ── */
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

/* ── Operational amenity categories ── */
const KITCHEN_DINING = [
    'Commercial Kitchen', 'Domestic Kitchen', 'Full-size Refrigerator', 'Walk-in Pantry',
    'Dishwasher', 'Oven / Stove', 'Microwave', 'Coffee Machine',
    'Blender / Vitamix', 'Formal Dining Room', 'Outdoor Dining Area', 'BBQ / Grill',
    'Pizza Oven', 'Breakfast Bar', 'Cookware & Utensils',
];

const LIVING_ENTERTAINMENT = [
    'Living Room', 'Fireplace', 'Smart TV', 'Streaming Services',
    'Sound System', 'Library / Reading Area', 'Games Room', 'Board Games',
    'Piano / Musical Instruments', 'Projector / Screen', 'Home Cinema', 'Gym Equipment',
];

const TECHNOLOGY = [
    'WiFi', 'High-Speed Internet', 'Starlink / Satellite', 'Mobile Signal',
    'EV Charging', 'Printer / Scanner', 'Dedicated Office Space',
];

const OUTDOOR_GROUNDS = [
    'Swimming Pool', 'Heated Pool', 'Indoor Pool', 'Garden / Grounds',
    'Outdoor Seating', 'Covered Verandah / Patio', 'Fire Pit', 'Tennis Court',
    'Golf Course Access', 'Farm Animals', 'Orchard / Produce Garden', 'Walking Trails',
    'Beach Access', 'Lake / River Access',
];

const PARKING_TRANSPORT = [
    'Free Parking', 'On-site Parking', 'Covered / Garage Parking',
    'Bus / Coach Access', 'Airport Transfers Available', 'Helipad',
];

const LAUNDRY_HOUSEKEEPING = [
    'Washing Machine', 'Dryer', 'Iron & Ironing Board',
    'Linens Provided', 'Towels Provided', 'Daily Housekeeping', 'Laundry Service',
];

const CLIMATE_COMFORT = [
    'Air Conditioning', 'Central Heating', 'Fireplace / Wood Heater',
    'Ceiling Fans', 'Underfloor Heating', 'Heated Bathroom Floors',
];

const SAFETY_SECURITY = [
    'Smoke Detectors', 'Carbon Monoxide Detector', 'Fire Extinguisher',
    'First Aid Kit', 'Security System', 'Gated Property', 'CCTV', 'On-site Security',
];

const FACILITY_OPTIONS = ['Thermal Suite', 'Float Pods', 'Relaxation Lounge', 'Treatment Rooms'];

export default function WellnessAmenitiesTab({ venue, onUpdate: _onUpdate }: Props) {
    // About section
    const [aboutLabel, setAboutLabel] = useState(`About ${venue.name || 'Venue'}`);
    const [showAbout, setShowAbout] = useState(true);
    const [aboutP1, setAboutP1] = useState(venue.description || '');
    const [aboutP2, setAboutP2] = useState('');

    // Featured Facilities
    const [facilitiesLabel, setFacilitiesLabel] = useState('Facilities');
    const [facilitiesSubtitle, setFacilitiesSubtitle] = useState('Spaces designed for restoration');
    const [facilities, setFacilities] = useState([
        { name: 'Thermal Suite', note: 'Included with Thermal Circuit booking' },
        { name: 'Float Pods', note: 'By booking only' },
        { name: 'Relaxation Lounge', note: 'Included with all treatments' },
        { name: 'Treatment Rooms', note: 'By booking only' },
    ]);

    // Website Amenities
    const [amenitiesLabel, setAmenitiesLabel] = useState('Amenities');
    const [selectedWebAmenities, setSelectedWebAmenities] = useState<string[]>(
        WEBSITE_AMENITIES.slice(0, 12).map(a => a.label)
    );

    // What to Bring
    const [bringLabel, setBringLabel] = useState('What to Bring');
    const [showBring, setShowBring] = useState(true);
    const [weProvide, setWeProvide] = useState('Robes, slippers, towels, lockers, toiletries, hair dryers');
    const [pleaseBring, setPleaseBring] = useState('Swimwear for thermal facilities, personal items, a calm mindset');
    const [optionalItems, setOptionalItems] = useState('Your own products if you have specific preferences');

    // Operational amenity states
    const [kitchenAmenities, setKitchenAmenities] = useState<string[]>(
        KITCHEN_DINING.filter((_, i) => i < 11 || i === 14)
    );
    const [diningIndoor, setDiningIndoor] = useState(14);
    const [diningOutdoor, setDiningOutdoor] = useState(20);

    const [livingAmenities, setLivingAmenities] = useState<string[]>(
        ['Living Room', 'Fireplace', 'Smart TV', 'Sound System', 'Library / Reading Area', 'Piano / Musical Instruments', 'Projector / Screen', 'Gym Equipment']
    );

    const [techAmenities, setTechAmenities] = useState<string[]>(
        ['WiFi', 'High-Speed Internet', 'Mobile Signal', 'EV Charging', 'Printer / Scanner']
    );
    const [wifiSpeed, setWifiSpeed] = useState('100+ Mbps');
    const [wifiCoverage, setWifiCoverage] = useState('Whole Property');

    const [outdoorAmenities, setOutdoorAmenities] = useState<string[]>(
        ['Swimming Pool', 'Heated Pool', 'Garden / Grounds', 'Outdoor Seating', 'Covered Verandah / Patio', 'Fire Pit', 'Farm Animals', 'Orchard / Produce Garden', 'Walking Trails']
    );
    const [propertySize, setPropertySize] = useState('45 acres');
    const [poolType, setPoolType] = useState('Heated Outdoor');

    const [parkingAmenities, setParkingAmenities] = useState<string[]>(
        ['Free Parking', 'On-site Parking', 'Bus / Coach Access', 'Airport Transfers Available']
    );
    const [parkingSpaces, setParkingSpaces] = useState(15);
    const [distanceToTown, setDistanceToTown] = useState('5 min to Berry village');

    const [laundryAmenities, setLaundryAmenities] = useState<string[]>(
        ['Washing Machine', 'Dryer', 'Iron & Ironing Board', 'Linens Provided', 'Towels Provided']
    );

    const [climateAmenities, setClimateAmenities] = useState<string[]>(
        ['Air Conditioning', 'Central Heating', 'Fireplace / Wood Heater', 'Ceiling Fans', 'Underfloor Heating']
    );

    const [safetyAmenities, setSafetyAmenities] = useState<string[]>(
        ['Smoke Detectors', 'Carbon Monoxide Detector', 'Fire Extinguisher', 'First Aid Kit', 'Security System', 'Gated Property']
    );

    const [additionalNotes, setAdditionalNotes] = useState('');

    const toggleAmenity = (
        _list: string[],
        setList: React.Dispatch<React.SetStateAction<string[]>>,
        item: string
    ) => {
        setList(prev => prev.includes(item) ? prev.filter(a => a !== item) : [...prev, item]);
    };

    const toggleWebAmenity = (label: string) => {
        setSelectedWebAmenities(prev =>
            prev.includes(label) ? prev.filter(a => a !== label) : [...prev, label]
        );
    };

    const updateFacility = (idx: number, field: 'name' | 'note', value: string) => {
        setFacilities(prev => {
            const updated = [...prev];
            updated[idx] = { ...updated[idx], [field]: value };
            return updated;
        });
    };

    /* ── Reusable amenity section renderer ── */
    function renderAmenitySection(
        title: string,
        subtitle: string,
        items: string[],
        selected: string[],
        setSelected: React.Dispatch<React.SetStateAction<string[]>>,
        extras?: React.ReactNode,
    ) {
        const count = selected.length;
        return (
            <section className="wvd-form-section">
                <div className="wvd-form-section-header">
                    <div>
                        <h3 className="wvd-form-section-title">{title}</h3>
                        <p className="wvd-form-hint">{subtitle}</p>
                    </div>
                    <span style={{ fontSize: 12, color: 'var(--success)', fontWeight: 500 }}>
                        {count} of {items.length} selected
                    </span>
                </div>
                <div className="wvd-form-section-body">
                    <div className="wam-amenity-grid">
                        {items.map(item => {
                            const isChecked = selected.includes(item);
                            return (
                                <div
                                    key={item}
                                    className={`wam-amenity-item${isChecked ? ' checked' : ''}`}
                                    onClick={() => toggleAmenity(selected, setSelected, item)}
                                >
                                    <div className={`wam-amenity-checkbox${isChecked ? ' checked' : ''}`}>
                                        {isChecked && <Check size={12} color="#fff" strokeWidth={3} />}
                                    </div>
                                    <span className="wam-amenity-label">{item}</span>
                                </div>
                            );
                        })}
                    </div>
                    {extras}
                </div>
            </section>
        );
    }

    return (
        <div className="wvd-content">

            {/* ═══ WEBSITE DISPLAY SECTIONS ═══ */}

            {/* About Section */}
            <section className="wvd-form-section">
                <div className="wvd-form-section-header">
                    <div>
                        <h3 className="wvd-form-section-title">About Section</h3>
                        <p className="wvd-form-hint">Introduction content for the "About / Space" tab on your public listing</p>
                    </div>
                </div>
                <div className="wvd-form-section-body">
                    <div className="wvd-form-grid">
                        <div className="wvd-form-group">
                            <label className="wvd-form-label">Section Label</label>
                            <input type="text" className="wvd-form-input" value={aboutLabel} onChange={e => setAboutLabel(e.target.value)} />
                        </div>
                        <div className="wvd-form-group">
                            <label className="wvd-form-label">Show Section</label>
                            <div className="wvd-toggle-container">
                                <div className={`wvd-toggle ${showAbout ? 'active' : ''}`} onClick={() => setShowAbout(!showAbout)}>
                                    <div className="wvd-toggle-knob"></div>
                                </div>
                                <span className="wvd-toggle-label">Display on website</span>
                            </div>
                        </div>
                        <div className="wvd-form-group wvd-full-width">
                            <label className="wvd-form-label">About Paragraph 1</label>
                            <textarea className="wvd-form-input wvd-form-textarea" rows={3} value={aboutP1} onChange={e => setAboutP1(e.target.value)} placeholder="First introductory paragraph about your venue..." />
                        </div>
                        <div className="wvd-form-group wvd-full-width">
                            <label className="wvd-form-label">About Paragraph 2</label>
                            <textarea className="wvd-form-input wvd-form-textarea" rows={3} value={aboutP2} onChange={e => setAboutP2(e.target.value)} placeholder="Second paragraph (optional)..." />
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Facilities */}
            <section className="wvd-form-section">
                <div className="wvd-form-section-header">
                    <div>
                        <h3 className="wvd-form-section-title">Featured Facilities</h3>
                        <p className="wvd-form-hint">Highlight up to 4 key facilities with images on your public listing</p>
                    </div>
                    <span style={{ fontSize: 12, color: 'var(--accent)' }}>Select from Wellness Facilities tab</span>
                </div>
                <div className="wvd-form-section-body">
                    <div className="wvd-form-grid">
                        <div className="wvd-form-group">
                            <label className="wvd-form-label">Section Label</label>
                            <input type="text" className="wvd-form-input" value={facilitiesLabel} onChange={e => setFacilitiesLabel(e.target.value)} />
                        </div>
                        <div className="wvd-form-group">
                            <label className="wvd-form-label">Section Subtitle</label>
                            <input type="text" className="wvd-form-input" value={facilitiesSubtitle} onChange={e => setFacilitiesSubtitle(e.target.value)} />
                        </div>
                    </div>

                    {/* Facility Cards */}
                    <div className="wam-facility-cards">
                        {facilities.map((facility, idx) => (
                            <div key={idx} className="wam-facility-card">
                                <div className="wam-facility-image">
                                    <Upload size={20} strokeWidth={1.5} color="#B8B8B8" />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <select
                                        className="wvd-form-input wvd-form-select"
                                        style={{ fontSize: 12, padding: '6px 10px', marginBottom: 6 }}
                                        value={facility.name}
                                        onChange={e => updateFacility(idx, 'name', e.target.value)}
                                    >
                                        {FACILITY_OPTIONS.map(opt => (
                                            <option key={opt}>{opt}</option>
                                        ))}
                                    </select>
                                    <input
                                        type="text"
                                        className="wvd-form-input"
                                        style={{ fontSize: 11, padding: '4px 8px' }}
                                        value={facility.note}
                                        onChange={e => updateFacility(idx, 'note', e.target.value)}
                                        placeholder="Access note..."
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                    <p className="wvd-form-hint" style={{ marginTop: 12, fontStyle: 'italic' }}>
                        Facility images and descriptions are pulled from the Wellness Facilities tab. Add or edit facilities there first.
                    </p>
                </div>
            </section>

            {/* Website Amenities Display */}
            <section className="wvd-form-section">
                <div className="wvd-form-section-header">
                    <div>
                        <h3 className="wvd-form-section-title">Website Amenities Display</h3>
                        <p className="wvd-form-hint">Select up to 12 amenities to display on your public listing (icon grid format)</p>
                    </div>
                    <span style={{ fontSize: 12, color: 'var(--success)', fontWeight: 500 }}>
                        {selectedWebAmenities.length} selected
                    </span>
                </div>
                <div className="wvd-form-section-body">
                    <div className="wvd-form-group" style={{ marginBottom: 16 }}>
                        <label className="wvd-form-label">Section Label</label>
                        <input type="text" className="wvd-form-input" value={amenitiesLabel} onChange={e => setAmenitiesLabel(e.target.value)} style={{ maxWidth: 300 }} />
                    </div>
                    <div className="wa-inclusions-grid">
                        {WEBSITE_AMENITIES.map(a => {
                            const isSelected = selectedWebAmenities.includes(a.label);
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

            {/* What to Bring */}
            <section className="wvd-form-section">
                <div className="wvd-form-section-header">
                    <div>
                        <h3 className="wvd-form-section-title">What to Bring</h3>
                        <p className="wvd-form-hint">Guest information displayed on the "About / Space" tab</p>
                    </div>
                </div>
                <div className="wvd-form-section-body">
                    <div className="wvd-form-grid">
                        <div className="wvd-form-group">
                            <label className="wvd-form-label">Section Label</label>
                            <input type="text" className="wvd-form-input" value={bringLabel} onChange={e => setBringLabel(e.target.value)} />
                        </div>
                        <div className="wvd-form-group">
                            <label className="wvd-form-label">Show Section</label>
                            <div className="wvd-toggle-container">
                                <div className={`wvd-toggle ${showBring ? 'active' : ''}`} onClick={() => setShowBring(!showBring)}>
                                    <div className="wvd-toggle-knob"></div>
                                </div>
                                <span className="wvd-toggle-label">Display on website</span>
                            </div>
                        </div>
                        <div className="wvd-form-group wvd-full-width">
                            <label className="wvd-form-label">We Provide</label>
                            <input type="text" className="wvd-form-input" value={weProvide} onChange={e => setWeProvide(e.target.value)} placeholder="What you provide to guests..." />
                        </div>
                        <div className="wvd-form-group wvd-full-width">
                            <label className="wvd-form-label">Please Bring</label>
                            <input type="text" className="wvd-form-input" value={pleaseBring} onChange={e => setPleaseBring(e.target.value)} placeholder="What guests should bring..." />
                        </div>
                        <div className="wvd-form-group wvd-full-width">
                            <label className="wvd-form-label">Optional</label>
                            <input type="text" className="wvd-form-input" value={optionalItems} onChange={e => setOptionalItems(e.target.value)} placeholder="Optional items..." />
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══ OPERATIONAL DATA SECTIONS ═══ */}

            {/* Kitchen & Dining */}
            {renderAmenitySection(
                'Kitchen & Dining',
                'Food preparation and dining facilities',
                KITCHEN_DINING,
                kitchenAmenities,
                setKitchenAmenities,
                <div className="wvd-form-grid" style={{ marginTop: 24 }}>
                    <div className="wvd-form-group">
                        <label className="wvd-form-label">Dining Capacity (Indoor)</label>
                        <input type="number" className="wvd-form-input" value={diningIndoor || ''} onChange={e => setDiningIndoor(parseInt(e.target.value) || 0)} />
                    </div>
                    <div className="wvd-form-group">
                        <label className="wvd-form-label">Dining Capacity (Outdoor)</label>
                        <input type="number" className="wvd-form-input" value={diningOutdoor || ''} onChange={e => setDiningOutdoor(parseInt(e.target.value) || 0)} />
                    </div>
                </div>
            )}

            {/* Living & Entertainment */}
            {renderAmenitySection(
                'Living & Entertainment',
                'Common areas and entertainment options',
                LIVING_ENTERTAINMENT,
                livingAmenities,
                setLivingAmenities,
            )}

            {/* Technology & Connectivity */}
            {renderAmenitySection(
                'Technology & Connectivity',
                'Internet, power, and tech amenities',
                TECHNOLOGY,
                techAmenities,
                setTechAmenities,
                <div className="wvd-form-grid" style={{ marginTop: 24 }}>
                    <div className="wvd-form-group">
                        <label className="wvd-form-label">WiFi Speed (Mbps)</label>
                        <input type="text" className="wvd-form-input" value={wifiSpeed} onChange={e => setWifiSpeed(e.target.value)} />
                    </div>
                    <div className="wvd-form-group">
                        <label className="wvd-form-label">WiFi Coverage</label>
                        <select className="wvd-form-input wvd-form-select" value={wifiCoverage} onChange={e => setWifiCoverage(e.target.value)}>
                            <option>Whole Property</option>
                            <option>Main Building Only</option>
                            <option>Common Areas Only</option>
                        </select>
                    </div>
                </div>
            )}

            {/* Outdoor & Grounds */}
            {renderAmenitySection(
                'Outdoor & Grounds',
                'Outdoor spaces and property features',
                OUTDOOR_GROUNDS,
                outdoorAmenities,
                setOutdoorAmenities,
                <div className="wvd-form-grid" style={{ marginTop: 24 }}>
                    <div className="wvd-form-group">
                        <label className="wvd-form-label">Property Size (acres/hectares)</label>
                        <input type="text" className="wvd-form-input" value={propertySize} onChange={e => setPropertySize(e.target.value)} />
                    </div>
                    <div className="wvd-form-group">
                        <label className="wvd-form-label">Pool Type</label>
                        <select className="wvd-form-input wvd-form-select" value={poolType} onChange={e => setPoolType(e.target.value)}>
                            <option>Heated Outdoor</option>
                            <option>Unheated Outdoor</option>
                            <option>Indoor</option>
                            <option>Natural / Dam</option>
                        </select>
                    </div>
                </div>
            )}

            {/* Parking & Transport */}
            {renderAmenitySection(
                'Parking & Transport',
                'Vehicle access and parking facilities',
                PARKING_TRANSPORT,
                parkingAmenities,
                setParkingAmenities,
                <div className="wvd-form-grid" style={{ marginTop: 24 }}>
                    <div className="wvd-form-group">
                        <label className="wvd-form-label">Parking Spaces</label>
                        <input type="number" className="wvd-form-input" value={parkingSpaces || ''} onChange={e => setParkingSpaces(parseInt(e.target.value) || 0)} />
                    </div>
                    <div className="wvd-form-group">
                        <label className="wvd-form-label">Distance to Nearest Town</label>
                        <input type="text" className="wvd-form-input" value={distanceToTown} onChange={e => setDistanceToTown(e.target.value)} />
                    </div>
                </div>
            )}

            {/* Laundry & Housekeeping */}
            {renderAmenitySection(
                'Laundry & Housekeeping',
                'Cleaning and laundry facilities',
                LAUNDRY_HOUSEKEEPING,
                laundryAmenities,
                setLaundryAmenities,
            )}

            {/* Climate & Comfort */}
            {renderAmenitySection(
                'Climate & Comfort',
                'Heating, cooling, and comfort features',
                CLIMATE_COMFORT,
                climateAmenities,
                setClimateAmenities,
            )}

            {/* Safety & Security */}
            {renderAmenitySection(
                'Safety & Security',
                'Safety features and security measures',
                SAFETY_SECURITY,
                safetyAmenities,
                setSafetyAmenities,
            )}

            {/* Additional Amenities Notes */}
            <section className="wvd-form-section">
                <div className="wvd-form-section-header">
                    <h3 className="wvd-form-section-title">Additional Amenities Notes</h3>
                </div>
                <div className="wvd-form-section-body">
                    <div className="wvd-form-group">
                        <label className="wvd-form-label">Notes</label>
                        <textarea
                            className="wvd-form-input wvd-form-textarea"
                            rows={4}
                            value={additionalNotes}
                            onChange={e => setAdditionalNotes(e.target.value)}
                            placeholder="Any additional amenities or special features..."
                        />
                    </div>
                </div>
            </section>

        </div>
    );
}
