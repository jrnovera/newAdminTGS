import { useState, useEffect } from 'react';
import { Plus, Trash2, Image, Check } from 'lucide-react';
import type { Venue, RetreatFacility } from '../context/VenueContext';

interface RetreatFacilitiesTabProps {
    venue: Venue;
    onUpdate: (updates: Partial<Venue>) => void;
}

const RETREAT_TYPES = [
    'Yoga Retreats', 'Meditation Retreats', 'Nutrition / Detox', "Women's Retreats",
    'Corporate Wellness', 'Mindfulness', 'Sound Healing', 'Silent Retreats',
    'Breathwork', 'Ayahuasca / Plant Medicine', 'Creative / Art', 'Leadership / Coaching',
];

const SPACE_TYPE_OPTIONS = [
    'Dedicated Yoga Studio', 'Multipurpose Space', 'Outdoor Platform',
    'Dedicated Meditation Room', 'Garden Sanctuary', 'Conference Room',
    'Multipurpose Hall', 'Boardroom', 'Sacred Circle', 'Dedicated Temple',
    'Outdoor Practice Area', 'Shared Space',
];

const SETTING_OPTIONS = ['Indoor', 'Outdoor', 'Indoor/Outdoor'];

const VIEW_OPTIONS = [
    'No Specific View', 'Ocean View', 'Mountain View', 'Garden View',
    'Forest View', 'Lake View', 'Valley View', 'Countryside View',
];

function createEmptyFacility(): RetreatFacility {
    return {
        id: crypto.randomUUID(),
        name: '',
        type: 'Multipurpose Space',
        setting: 'Indoor',
        viewType: 'No Specific View',
        capacity: 0,
        sizeSqm: 0,
        description: '',
        isFeatured: false,
        isAvailable: true,
        equipment: [],
    };
}

export default function RetreatFacilitiesTab({ venue, onUpdate }: RetreatFacilitiesTabProps) {
    const [facilities, setFacilities] = useState<RetreatFacility[]>(venue.retreatFacilities || []);
    const [tabImage, setTabImage] = useState(venue.retreatFacilitiesTabImage || '');
    const [label, setLabel] = useState(venue.retreatFacilitiesLabel || 'Retreat Spaces');
    const [title, setTitle] = useState(venue.retreatFacilitiesTitle || '');
    const [subtitle, setSubtitle] = useState(venue.retreatFacilitiesSubtitle || '');
    const [intro, setIntro] = useState(venue.retreatFacilitiesIntro || '');
    const [notes, setNotes] = useState(venue.retreatFacilitiesNotes || '');
    const [supportedTypes, setSupportedTypes] = useState<string[]>(venue.supportedRetreatTypes || []);
    const [newEquipment, setNewEquipment] = useState<Record<string, string>>({});

    // Sync changes back up whenever local state changes
    useEffect(() => {
        onUpdate({
            retreatFacilities: facilities,
            retreatFacilitiesTabImage: tabImage,
            retreatFacilitiesLabel: label,
            retreatFacilitiesTitle: title,
            retreatFacilitiesSubtitle: subtitle,
            retreatFacilitiesIntro: intro,
            retreatFacilitiesNotes: notes,
            supportedRetreatTypes: supportedTypes,
        });
    }, [facilities, tabImage, label, title, subtitle, intro, notes, supportedTypes]);

    const updateFacility = (id: string, updates: Partial<RetreatFacility>) => {
        setFacilities(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f));
    };

    const removeFacility = (id: string) => {
        setFacilities(prev => prev.filter(f => f.id !== id));
    };

    const addFacility = () => {
        setFacilities(prev => [...prev, createEmptyFacility()]);
    };

    const toggleRetreatType = (type: string) => {
        setSupportedTypes(prev =>
            prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
        );
    };

    const addEquipmentToFacility = (facilityId: string) => {
        const value = (newEquipment[facilityId] || '').trim();
        if (!value) return;
        const facility = facilities.find(f => f.id === facilityId);
        if (facility && !facility.equipment.includes(value)) {
            updateFacility(facilityId, { equipment: [...facility.equipment, value] });
        }
        setNewEquipment(prev => ({ ...prev, [facilityId]: '' }));
    };

    const removeEquipmentFromFacility = (facilityId: string, item: string) => {
        const facility = facilities.find(f => f.id === facilityId);
        if (facility) {
            updateFacility(facilityId, { equipment: facility.equipment.filter(e => e !== item) });
        }
    };

    // Compute summary stats
    const practiceSpaces = facilities.filter(f => f.isAvailable).length;
    const meetingRooms = facilities.filter(f =>
        f.type.toLowerCase().includes('conference') ||
        f.type.toLowerCase().includes('boardroom') ||
        f.type.toLowerCase().includes('multipurpose hall')
    ).length;
    const maxCapacity = facilities.reduce((max, f) => Math.max(max, f.capacity), 0);
    const outdoorAreas = facilities.filter(f =>
        f.setting === 'Outdoor' || f.setting === 'Indoor/Outdoor'
    ).length;

    return (
        <div>
            {/* Tab Images */}
            <section className="rf-section">
                <div className="rf-section-header">
                    <h3 className="rf-section-title">Tab Images</h3>
                    <p className="rf-section-subtitle">Hero image displayed on the Retreat Spaces tab of your public listing</p>
                </div>
                <div className="rf-section-body">
                    <div className="rf-form-group">
                        <label className="rf-form-label">Retreat Spaces Tab Hero Image</label>
                        <div className="rf-image-upload-area">
                            <Image size={48} strokeWidth={1} style={{ marginBottom: 16, color: '#B8B8B8' }} />
                            <p className="rf-image-upload-label">Click to upload or drag and drop</p>
                            <p className="rf-image-upload-hint">Recommended: 1920×600px, JPG or PNG</p>
                        </div>
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
                            <input
                                type="text"
                                className="rf-form-input"
                                value={label}
                                onChange={e => setLabel(e.target.value)}
                                placeholder="e.g. Retreat Spaces, Practice Spaces"
                            />
                        </div>
                        <div className="rf-form-group">
                            <label className="rf-form-label">Section Title</label>
                            <input
                                type="text"
                                className="rf-form-input"
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                placeholder="e.g. Spaces for Practice and Transformation"
                            />
                        </div>
                        <div className="rf-form-group full-width">
                            <label className="rf-form-label">Section Subtitle</label>
                            <input
                                type="text"
                                className="rf-form-input"
                                value={subtitle}
                                onChange={e => setSubtitle(e.target.value)}
                                placeholder="Brief subtitle..."
                            />
                        </div>
                        <div className="rf-form-group full-width">
                            <label className="rf-form-label">Intro Paragraph</label>
                            <textarea
                                className="rf-form-input rf-form-textarea"
                                value={intro}
                                onChange={e => setIntro(e.target.value)}
                                placeholder="A paragraph introducing your retreat spaces..."
                                rows={3}
                            />
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

            {/* Facility Cards */}
            <div className="rf-facility-cards">
                {facilities.map((facility) => (
                    <div key={facility.id} className="rf-facility-card">
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
                                    value={facility.name}
                                    onChange={e => updateFacility(facility.id, { name: e.target.value })}
                                    placeholder="Space Name"
                                    style={{
                                        border: 'none', background: 'transparent', fontFamily: "'Cormorant Garamond', serif",
                                        fontSize: 18, fontWeight: 600, color: '#313131', width: '100%', outline: 'none',
                                    }}
                                />
                            </div>
                            <div className="rf-facility-card-toggle">
                                {facility.isFeatured && <span className="rf-featured-badge">Featured</span>}
                                <span className={`rf-facility-status${facility.isAvailable ? '' : ' inactive'}`}>
                                    {facility.isAvailable ? 'Available' : 'Unavailable'}
                                </span>
                                <div
                                    className={`rf-toggle${facility.isAvailable ? ' active' : ''}`}
                                    onClick={() => updateFacility(facility.id, { isAvailable: !facility.isAvailable })}
                                >
                                    <div className="rf-toggle-knob" />
                                </div>
                                <button
                                    className="rf-delete-facility-btn"
                                    onClick={() => removeFacility(facility.id)}
                                    title="Remove facility"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>

                        <div className="rf-facility-card-body">
                            {/* Image & Featured */}
                            <div className="rf-facility-grid" style={{ marginBottom: 20 }}>
                                <div className="rf-facility-field span-2">
                                    <div className="rf-facility-field-label">Space Image</div>
                                    <div style={{ display: 'flex', gap: 16, alignItems: 'start' }}>
                                        <div className="rf-facility-image-box">
                                            <Image size={40} strokeWidth={1} />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <button className="btn btn-secondary btn-small" style={{ marginBottom: 8 }}>Upload Image</button>
                                            <p style={{ fontSize: 11, color: '#B8B8B8' }}>Recommended: 800×600px, JPG or PNG</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="rf-facility-field">
                                    <div className="rf-facility-field-label">Featured Space</div>
                                    <div className="rf-toggle-container">
                                        <div
                                            className={`rf-toggle${facility.isFeatured ? ' active' : ''}`}
                                            onClick={() => updateFacility(facility.id, { isFeatured: !facility.isFeatured })}
                                        >
                                            <div className="rf-toggle-knob" />
                                        </div>
                                        <span className="rf-toggle-label">{facility.isFeatured ? 'Yes - Highlight on listing' : 'No'}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="rf-facility-grid" style={{ marginBottom: 20 }}>
                                <div className="rf-facility-field span-3">
                                    <div className="rf-facility-field-label">Space Description</div>
                                    <textarea
                                        className="rf-form-input rf-form-textarea"
                                        value={facility.description}
                                        onChange={e => updateFacility(facility.id, { description: e.target.value })}
                                        placeholder="Describe this space for your public listing..."
                                        rows={3}
                                    />
                                </div>
                            </div>

                            {/* Details Grid */}
                            <div className="rf-facility-grid">
                                <div className="rf-facility-field">
                                    <div className="rf-facility-field-label">Space Type</div>
                                    <select
                                        className="rf-form-input rf-form-select"
                                        value={facility.type}
                                        onChange={e => updateFacility(facility.id, { type: e.target.value })}
                                    >
                                        {SPACE_TYPE_OPTIONS.map(opt => (
                                            <option key={opt} value={opt}>{opt}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="rf-facility-field">
                                    <div className="rf-facility-field-label">Setting</div>
                                    <select
                                        className="rf-form-input rf-form-select"
                                        value={facility.setting}
                                        onChange={e => updateFacility(facility.id, { setting: e.target.value })}
                                    >
                                        {SETTING_OPTIONS.map(opt => (
                                            <option key={opt} value={opt}>{opt}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="rf-facility-field">
                                    <div className="rf-facility-field-label">View Type</div>
                                    <select
                                        className="rf-form-input rf-form-select"
                                        value={facility.viewType}
                                        onChange={e => updateFacility(facility.id, { viewType: e.target.value })}
                                    >
                                        {VIEW_OPTIONS.map(opt => (
                                            <option key={opt} value={opt}>{opt}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="rf-facility-field">
                                    <div className="rf-facility-field-label">Capacity</div>
                                    <input
                                        type="number"
                                        className="rf-form-input"
                                        value={facility.capacity}
                                        onChange={e => updateFacility(facility.id, { capacity: parseInt(e.target.value) || 0 })}
                                    />
                                </div>
                                <div className="rf-facility-field">
                                    <div className="rf-facility-field-label">Size (sqm)</div>
                                    <input
                                        type="number"
                                        className="rf-form-input"
                                        value={facility.sizeSqm}
                                        onChange={e => updateFacility(facility.id, { sizeSqm: parseInt(e.target.value) || 0 })}
                                    />
                                </div>
                                <div className="rf-facility-field">
                                    <div className="rf-facility-field-label">Flooring</div>
                                    <select
                                        className="rf-form-input rf-form-select"
                                        value={facility.flooring || 'Timber'}
                                        onChange={e => updateFacility(facility.id, { flooring: e.target.value })}
                                    >
                                        <option value="Timber">Timber</option>
                                        <option value="Concrete">Concrete</option>
                                        <option value="Carpet">Carpet</option>
                                        <option value="Sprung Floor">Sprung Floor</option>
                                        <option value="Grass">Grass</option>
                                    </select>
                                </div>

                                {/* Equipment */}
                                <div className="rf-facility-field span-3">
                                    <div className="rf-facility-field-label">Equipment Provided</div>
                                    <div className="rf-facility-features">
                                        {facility.equipment.map(item => (
                                            <span key={item} className="rf-facility-feature" style={{ cursor: 'pointer' }} onClick={() => removeEquipmentFromFacility(facility.id, item)}>
                                                {item} ×
                                            </span>
                                        ))}
                                    </div>
                                    <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                                        <input
                                            type="text"
                                            className="rf-form-input"
                                            value={newEquipment[facility.id] || ''}
                                            onChange={e => setNewEquipment(prev => ({ ...prev, [facility.id]: e.target.value }))}
                                            placeholder="Add equipment (e.g. Yoga Mats)"
                                            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addEquipmentToFacility(facility.id); } }}
                                            style={{ flex: 1 }}
                                        />
                                        <button className="btn btn-secondary btn-small" onClick={() => addEquipmentToFacility(facility.id)}>
                                            <Plus size={14} /> Add
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Add Facility Button */}
                <button className="rf-add-facility-btn" onClick={addFacility}>
                    <Plus size={18} />
                    Add Another Facility
                </button>
            </div>

            {/* Retreat Types */}
            <section className="rf-section">
                <div className="rf-section-header">
                    <h3 className="rf-section-title">Retreat Types This Venue Supports</h3>
                </div>
                <div className="rf-section-body">
                    <div className="rf-checkbox-grid">
                        {RETREAT_TYPES.map(type => {
                            const isChecked = supportedTypes.includes(type);
                            return (
                                <div
                                    key={type}
                                    className={`rf-checkbox-item${isChecked ? ' checked' : ''}`}
                                    onClick={() => toggleRetreatType(type)}
                                >
                                    <div className="rf-checkbox-box">
                                        {isChecked && <Check size={12} color="white" strokeWidth={3} />}
                                    </div>
                                    <span className="rf-checkbox-label">{type}</span>
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
                        <textarea
                            className="rf-form-input rf-form-textarea"
                            value={notes}
                            onChange={e => setNotes(e.target.value)}
                            placeholder="Any additional information about facilities that retreat hosts should know..."
                            rows={4}
                        />
                    </div>
                </div>
            </section>
        </div>
    );
}
