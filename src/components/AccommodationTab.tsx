import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit3, Image, Check } from 'lucide-react';
import type { Venue, IndividualRoom, BedConfiguration } from '../context/VenueContext';

interface AccommodationTabProps {
    venue: Venue;
    onUpdate: (updates: Partial<Venue>) => void;
}

const ACCOMMODATION_STYLES = ['Private Rooms', 'Shared Rooms', 'Suites', 'Mixed'];
const PROPERTY_TYPES = ['Whole Property', 'Individual Rooms', 'Mixed'];
const ROOM_TYPES = ['Suite', 'Standard', 'Deluxe', 'Dormitory', 'Cabin', 'Villa', 'Studio'];
const BATHROOM_OPTIONS = ['Private Ensuite', 'Shared', 'Jack and Jill', 'None'];

const defaultBedConfig: BedConfiguration = {
    kingBeds: 0, queenBeds: 0, doubleBeds: 0, singleBeds: 0,
    twinBeds: 0, bunkBeds: 0, sofaBeds: 0, rollawayBeds: 0,
};

function createEmptyRoom(): IndividualRoom {
    return {
        id: crypto.randomUUID(),
        roomName: '',
        roomImage: '',
        websiteDescription: '',
        roomType: 'Standard',
        bedConfiguration: { ...defaultBedConfig },
        maxOccupancy: 2,
        bathroom: 'Private Ensuite',
        roomSize: '',
        floor: '',
        pricePerNight: '',
        roomAmenities: [],
    };
}

export default function AccommodationTab({ venue, onUpdate }: AccommodationTabProps) {
    // Capacity
    const [maxGuests, setMaxGuests] = useState(venue.maxGuests || venue.capacity || 0);
    const [minGuests, setMinGuests] = useState(venue.minGuests || 0);
    const [totalBedrooms, setTotalBedrooms] = useState(venue.totalBedrooms || 0);
    const [totalBathrooms, setTotalBathrooms] = useState(venue.totalBathrooms || 0);
    const [sharedBathrooms, setSharedBathrooms] = useState(venue.sharedBathrooms || 0);
    const [privateEnsuites, setPrivateEnsuites] = useState(venue.privateEnsuites || 0);
    const [accStyle, setAccStyle] = useState(venue.accommodationStyle || 'Private Rooms');
    const [propType, setPropType] = useState(venue.propertyType || 'Whole Property');
    const [accDesc, setAccDesc] = useState(venue.accommodationDescription || '');

    // Bed config
    const [bedKing, setBedKing] = useState(venue.bedConfigKing || 0);
    const [bedQueen, setBedQueen] = useState(venue.bedConfigQueen || 0);
    const [bedDouble, setBedDouble] = useState(venue.bedConfigDouble || 0);
    const [bedSingle, setBedSingle] = useState(venue.bedConfigSingle || 0);
    const [bedTwin, setBedTwin] = useState(venue.bedConfigTwin || 0);
    const [bedBunk, setBedBunk] = useState(venue.bedConfigBunk || 0);
    const [bedSofa, setBedSofa] = useState(venue.bedConfigSofa || 0);
    const [bedRollaway, setBedRollaway] = useState(venue.bedConfigRollaway || 0);

    // Rooms
    const [rooms, setRooms] = useState<IndividualRoom[]>(venue.individualRooms || []);
    const [editingRoom, setEditingRoom] = useState<string | null>(null);
    const [newAmenity, setNewAmenity] = useState<Record<string, string>>({});

    // Additional
    const [checkIn, setCheckIn] = useState(venue.checkInTime || '3:00 PM');
    const [checkOut, setCheckOut] = useState(venue.checkOutTime || '10:00 AM');
    const [earlyCheckIn, setEarlyCheckIn] = useState(venue.earlyCheckInAvailable || false);
    const [lateCheckOut, setLateCheckOut] = useState(venue.lateCheckOutAvailable || false);
    const [childrenAllowed, setChildrenAllowed] = useState(venue.childrenAllowed ?? true);
    const [minChildAge, setMinChildAge] = useState(venue.minimumChildAge || 0);
    const [petsAllowed, setPetsAllowed] = useState(venue.petsAllowed || false);
    const [smokingAllowed, setSmokingAllowed] = useState(venue.smokingAllowed || false);

    // Sync on change
    useEffect(() => {
        onUpdate({
            maxGuests, minGuests, totalBedrooms, totalBathrooms,
            sharedBathrooms, privateEnsuites, accommodationStyle: accStyle,
            propertyType: propType, accommodationDescription: accDesc,
            bedConfigKing: bedKing, bedConfigQueen: bedQueen,
            bedConfigDouble: bedDouble, bedConfigSingle: bedSingle,
            bedConfigTwin: bedTwin, bedConfigBunk: bedBunk,
            bedConfigSofa: bedSofa, bedConfigRollaway: bedRollaway,
            individualRooms: rooms,
            checkInTime: checkIn, checkOutTime: checkOut,
            earlyCheckInAvailable: earlyCheckIn,
            lateCheckOutAvailable: lateCheckOut,
            childrenAllowed, minimumChildAge: minChildAge,
            petsAllowed, smokingAllowed,
        });
    }, [maxGuests, minGuests, totalBedrooms, totalBathrooms, sharedBathrooms, privateEnsuites,
        accStyle, propType, accDesc, bedKing, bedQueen, bedDouble, bedSingle, bedTwin,
        bedBunk, bedSofa, bedRollaway, rooms, checkIn, checkOut, earlyCheckIn, lateCheckOut,
        childrenAllowed, minChildAge, petsAllowed, smokingAllowed]);

    const addRoom = () => setRooms(prev => [...prev, createEmptyRoom()]);
    const removeRoom = (id: string) => setRooms(prev => prev.filter(r => r.id !== id));
    const updateRoom = (id: string, updates: Partial<IndividualRoom>) => {
        setRooms(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
    };

    const addAmenityToRoom = (roomId: string) => {
        const val = (newAmenity[roomId] || '').trim();
        if (!val) return;
        const room = rooms.find(r => r.id === roomId);
        if (room && !(room.roomAmenities || []).includes(val)) {
            updateRoom(roomId, { roomAmenities: [...(room.roomAmenities || []), val] });
        }
        setNewAmenity(prev => ({ ...prev, [roomId]: '' }));
    };

    const removeAmenityFromRoom = (roomId: string, amenity: string) => {
        const room = rooms.find(r => r.id === roomId);
        if (room) {
            updateRoom(roomId, { roomAmenities: (room.roomAmenities || []).filter(a => a !== amenity) });
        }
    };

    // Bed description for a room
    const bedSummary = (config: BedConfiguration) => {
        const parts: string[] = [];
        if (config.kingBeds) parts.push(`${config.kingBeds} x King`);
        if (config.queenBeds) parts.push(`${config.queenBeds} x Queen`);
        if (config.doubleBeds) parts.push(`${config.doubleBeds} x Double`);
        if (config.singleBeds) parts.push(`${config.singleBeds} x Single`);
        if (config.twinBeds) parts.push(`${config.twinBeds} x Twin`);
        if (config.bunkBeds) parts.push(`${config.bunkBeds} x Bunk`);
        if (config.sofaBeds) parts.push(`${config.sofaBeds} x Sofa`);
        if (config.rollawayBeds) parts.push(`${config.rollawayBeds} x Rollaway`);
        return parts.join(', ') || 'Not configured';
    };

    // Toggle helper
    const Toggle = ({ active, onToggle, label }: { active: boolean; onToggle: () => void; label: string }) => (
        <div className="rf-toggle-container">
            <div className={`rf-toggle${active ? ' active' : ''}`} onClick={onToggle}>
                <div className="rf-toggle-knob" />
            </div>
            <span className="rf-toggle-label">{label}</span>
        </div>
    );

    return (
        <div>
            {/* Summary Stats */}
            <div className="acc-summary-stats">
                <div className="rf-summary-stat">
                    <div className="rf-summary-stat-value">{maxGuests}</div>
                    <div className="rf-summary-stat-label">Max Guests</div>
                </div>
                <div className="rf-summary-stat">
                    <div className="rf-summary-stat-value">{totalBedrooms}</div>
                    <div className="rf-summary-stat-label">Bedrooms</div>
                </div>
                <div className="rf-summary-stat">
                    <div className="rf-summary-stat-value">{totalBathrooms}</div>
                    <div className="rf-summary-stat-label">Bathrooms</div>
                </div>
                <div className="rf-summary-stat">
                    <div className="rf-summary-stat-value">{bedKing}</div>
                    <div className="rf-summary-stat-label">King Beds</div>
                </div>
                <div className="rf-summary-stat">
                    <div className="rf-summary-stat-value">{bedRollaway}</div>
                    <div className="rf-summary-stat-label">Rollaway Beds</div>
                </div>
            </div>

            {/* Capacity Overview */}
            <section className="rf-section">
                <div className="rf-section-header">
                    <h3 className="rf-section-title">Capacity Overview</h3>
                </div>
                <div className="rf-section-body">
                    <div className="acc-form-grid-4">
                        <div className="rf-form-group">
                            <label className="rf-form-label">Maximum Guests <span style={{ color: '#C45C5C' }}>*</span></label>
                            <input type="number" className="rf-form-input" value={maxGuests} onChange={e => setMaxGuests(+e.target.value || 0)} />
                        </div>
                        <div className="rf-form-group">
                            <label className="rf-form-label">Minimum Guests</label>
                            <input type="number" className="rf-form-input" value={minGuests} onChange={e => setMinGuests(+e.target.value || 0)} />
                        </div>
                        <div className="rf-form-group">
                            <label className="rf-form-label">Total Bedrooms <span style={{ color: '#C45C5C' }}>*</span></label>
                            <input type="number" className="rf-form-input" value={totalBedrooms} onChange={e => setTotalBedrooms(+e.target.value || 0)} />
                        </div>
                        <div className="rf-form-group">
                            <label className="rf-form-label">Total Bathrooms <span style={{ color: '#C45C5C' }}>*</span></label>
                            <input type="number" className="rf-form-input" value={totalBathrooms} onChange={e => setTotalBathrooms(+e.target.value || 0)} />
                        </div>
                        <div className="rf-form-group">
                            <label className="rf-form-label">Shared Bathrooms</label>
                            <input type="number" className="rf-form-input" value={sharedBathrooms} onChange={e => setSharedBathrooms(+e.target.value || 0)} />
                        </div>
                        <div className="rf-form-group">
                            <label className="rf-form-label">Private Ensuite</label>
                            <input type="number" className="rf-form-input" value={privateEnsuites} onChange={e => setPrivateEnsuites(+e.target.value || 0)} />
                        </div>
                        <div className="rf-form-group">
                            <label className="rf-form-label">Accommodation Style</label>
                            <select className="rf-form-input rf-form-select" value={accStyle} onChange={e => setAccStyle(e.target.value)}>
                                {ACCOMMODATION_STYLES.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                        <div className="rf-form-group">
                            <label className="rf-form-label">Property Type</label>
                            <select className="rf-form-input rf-form-select" value={propType} onChange={e => setPropType(e.target.value)}>
                                {PROPERTY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                        <div className="rf-form-group" style={{ gridColumn: 'span 4' }}>
                            <label className="rf-form-label">Accommodation Description</label>
                            <textarea
                                className="rf-form-input rf-form-textarea"
                                rows={4}
                                value={accDesc}
                                onChange={e => setAccDesc(e.target.value)}
                                placeholder="Describe the overall accommodation experience for retreat guests..."
                            />
                            <span style={{ display: 'block', marginTop: 6, fontSize: 11, color: '#B8B8B8', fontStyle: 'italic' }}>
                                This description appears at the top of the Accommodation tab on your public listing.
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Bed Configuration */}
            <section className="rf-section">
                <div className="rf-section-header">
                    <h3 className="rf-section-title">Bed Configuration</h3>
                </div>
                <div className="rf-section-body">
                    <div className="acc-form-grid-4">
                        <div className="rf-form-group">
                            <label className="rf-form-label">King Beds</label>
                            <input type="number" className="rf-form-input" value={bedKing} onChange={e => setBedKing(+e.target.value || 0)} />
                        </div>
                        <div className="rf-form-group">
                            <label className="rf-form-label">Queen Beds</label>
                            <input type="number" className="rf-form-input" value={bedQueen} onChange={e => setBedQueen(+e.target.value || 0)} />
                        </div>
                        <div className="rf-form-group">
                            <label className="rf-form-label">Double Beds</label>
                            <input type="number" className="rf-form-input" value={bedDouble} onChange={e => setBedDouble(+e.target.value || 0)} />
                        </div>
                        <div className="rf-form-group">
                            <label className="rf-form-label">Single Beds</label>
                            <input type="number" className="rf-form-input" value={bedSingle} onChange={e => setBedSingle(+e.target.value || 0)} />
                        </div>
                        <div className="rf-form-group">
                            <label className="rf-form-label">Twin Beds</label>
                            <input type="number" className="rf-form-input" value={bedTwin} onChange={e => setBedTwin(+e.target.value || 0)} />
                        </div>
                        <div className="rf-form-group">
                            <label className="rf-form-label">Bunk Beds</label>
                            <input type="number" className="rf-form-input" value={bedBunk} onChange={e => setBedBunk(+e.target.value || 0)} />
                        </div>
                        <div className="rf-form-group">
                            <label className="rf-form-label">Sofa Beds</label>
                            <input type="number" className="rf-form-input" value={bedSofa} onChange={e => setBedSofa(+e.target.value || 0)} />
                        </div>
                        <div className="rf-form-group">
                            <label className="rf-form-label">Rollaway/Extra Beds</label>
                            <input type="number" className="rf-form-input" value={bedRollaway} onChange={e => setBedRollaway(+e.target.value || 0)} />
                        </div>
                    </div>
                </div>
            </section>

            {/* Individual Room Details */}
            <section className="rf-section">
                <div className="rf-section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 className="rf-section-title">Individual Room Details</h3>
                    <span style={{ fontSize: 13, color: '#B8B8B8' }}>{rooms.length} rooms configured</span>
                </div>
                <div className="rf-section-body">
                    <div className="acc-room-cards">
                        {rooms.map((room, idx) => {
                            const isEditing = editingRoom === room.id;
                            return (
                                <div key={room.id} className="acc-room-card">
                                    <div className="acc-room-card-header">
                                        <div className="acc-room-card-title">
                                            <span className="acc-room-number">{idx + 1}</span>
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    value={room.roomName}
                                                    onChange={e => updateRoom(room.id, { roomName: e.target.value })}
                                                    style={{ border: 'none', background: 'transparent', fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 600, color: '#313131', outline: 'none', width: '100%' }}
                                                    placeholder="Room Name"
                                                />
                                            ) : (
                                                <span>{room.roomName || 'Unnamed Room'}</span>
                                            )}
                                        </div>
                                        <div style={{ display: 'flex', gap: 8 }}>
                                            <button className="btn btn-secondary btn-small" onClick={() => setEditingRoom(isEditing ? null : room.id)}>
                                                {isEditing ? <><Check size={14} /> Done</> : <><Edit3 size={14} /> Edit</>}
                                            </button>
                                            <button className="rf-delete-facility-btn" onClick={() => removeRoom(room.id)} title="Remove room">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="acc-room-card-body">
                                        {/* Room Image */}
                                        <div style={{ marginBottom: 20 }}>
                                            <div className="rf-facility-field-label" style={{ marginBottom: 8 }}>Room Image</div>
                                            <div className="rf-facility-image-box">
                                                <Image size={32} strokeWidth={1} />
                                            </div>
                                        </div>

                                        {/* Room Description */}
                                        <div style={{ marginBottom: 20 }}>
                                            <div className="rf-facility-field-label" style={{ marginBottom: 6 }}>Room Description</div>
                                            <textarea
                                                className="rf-form-input rf-form-textarea"
                                                rows={2}
                                                value={room.websiteDescription}
                                                onChange={e => updateRoom(room.id, { websiteDescription: e.target.value })}
                                                placeholder="Describe this room for website display..."
                                                disabled={!isEditing}
                                            />
                                        </div>

                                        {/* Room Details Grid */}
                                        <div className="acc-room-grid">
                                            <div className="acc-room-field">
                                                <div className="rf-facility-field-label">Room Type</div>
                                                {isEditing ? (
                                                    <select className="rf-form-input rf-form-select" value={room.roomType} onChange={e => updateRoom(room.id, { roomType: e.target.value })}>
                                                        {ROOM_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                                    </select>
                                                ) : (
                                                    <div className="acc-room-field-value">{room.roomType}</div>
                                                )}
                                            </div>
                                            <div className="acc-room-field">
                                                <div className="rf-facility-field-label">Bed Configuration</div>
                                                {isEditing ? (
                                                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                                            <input type="number" className="rf-form-input" style={{ width: 60 }} min={0} value={room.bedConfiguration.kingBeds} onChange={e => updateRoom(room.id, { bedConfiguration: { ...room.bedConfiguration, kingBeds: +e.target.value || 0 } })} />
                                                            <span style={{ fontSize: 11, color: '#B8B8B8' }}>King</span>
                                                        </div>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                                            <input type="number" className="rf-form-input" style={{ width: 60 }} min={0} value={room.bedConfiguration.queenBeds} onChange={e => updateRoom(room.id, { bedConfiguration: { ...room.bedConfiguration, queenBeds: +e.target.value || 0 } })} />
                                                            <span style={{ fontSize: 11, color: '#B8B8B8' }}>Queen</span>
                                                        </div>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                                            <input type="number" className="rf-form-input" style={{ width: 60 }} min={0} value={room.bedConfiguration.singleBeds} onChange={e => updateRoom(room.id, { bedConfiguration: { ...room.bedConfiguration, singleBeds: +e.target.value || 0 } })} />
                                                            <span style={{ fontSize: 11, color: '#B8B8B8' }}>Single</span>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="acc-room-field-value">{bedSummary(room.bedConfiguration)}</div>
                                                )}
                                            </div>
                                            <div className="acc-room-field">
                                                <div className="rf-facility-field-label">Max Occupancy</div>
                                                {isEditing ? (
                                                    <input type="number" className="rf-form-input" value={room.maxOccupancy} onChange={e => updateRoom(room.id, { maxOccupancy: +e.target.value || 0 })} />
                                                ) : (
                                                    <div className="acc-room-field-value">{room.maxOccupancy} guests</div>
                                                )}
                                            </div>
                                            <div className="acc-room-field">
                                                <div className="rf-facility-field-label">Bathroom</div>
                                                {isEditing ? (
                                                    <select className="rf-form-input rf-form-select" value={room.bathroom} onChange={e => updateRoom(room.id, { bathroom: e.target.value })}>
                                                        {BATHROOM_OPTIONS.map(b => <option key={b} value={b}>{b}</option>)}
                                                    </select>
                                                ) : (
                                                    <div className="acc-room-field-value">{room.bathroom}</div>
                                                )}
                                            </div>

                                            {/* Room Amenities */}
                                            <div className="acc-room-field" style={{ gridColumn: 'span 4' }}>
                                                <div className="rf-facility-field-label">Room Amenities</div>
                                                <div className="rf-facility-features">
                                                    {(room.roomAmenities || []).map(a => (
                                                        <span key={a} className="rf-facility-feature" style={{ cursor: isEditing ? 'pointer' : 'default' }} onClick={() => isEditing && removeAmenityFromRoom(room.id, a)}>
                                                            {a} {isEditing && '×'}
                                                        </span>
                                                    ))}
                                                </div>
                                                {isEditing && (
                                                    <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                                                        <input
                                                            type="text"
                                                            className="rf-form-input"
                                                            value={newAmenity[room.id] || ''}
                                                            onChange={e => setNewAmenity(prev => ({ ...prev, [room.id]: e.target.value }))}
                                                            placeholder="Add amenity (e.g. Air Conditioning)"
                                                            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addAmenityToRoom(room.id); } }}
                                                            style={{ flex: 1 }}
                                                        />
                                                        <button className="btn btn-secondary btn-small" onClick={() => addAmenityToRoom(room.id)}>
                                                            <Plus size={14} /> Add
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        {/* Add Room */}
                        <button className="acc-add-room-btn" onClick={addRoom}>
                            <Plus size={18} />
                            Add Another Room
                        </button>
                    </div>
                </div>
            </section>

            {/* Additional Information */}
            <section className="rf-section">
                <div className="rf-section-header">
                    <h3 className="rf-section-title">Additional Information</h3>
                </div>
                <div className="rf-section-body">
                    <div className="rf-form-grid">
                        <div className="rf-form-group">
                            <label className="rf-form-label">Check-in Time</label>
                            <input type="text" className="rf-form-input" value={checkIn} onChange={e => setCheckIn(e.target.value)} />
                        </div>
                        <div className="rf-form-group">
                            <label className="rf-form-label">Check-out Time</label>
                            <input type="text" className="rf-form-input" value={checkOut} onChange={e => setCheckOut(e.target.value)} />
                        </div>
                        <div className="rf-form-group">
                            <label className="rf-form-label">Early Check-in Available</label>
                            <Toggle active={earlyCheckIn} onToggle={() => setEarlyCheckIn(!earlyCheckIn)} label={earlyCheckIn ? 'Yes - by arrangement' : 'No'} />
                        </div>
                        <div className="rf-form-group">
                            <label className="rf-form-label">Late Check-out Available</label>
                            <Toggle active={lateCheckOut} onToggle={() => setLateCheckOut(!lateCheckOut)} label={lateCheckOut ? 'Yes - by arrangement' : 'No'} />
                        </div>
                        <div className="rf-form-group">
                            <label className="rf-form-label">Children Allowed</label>
                            <Toggle active={childrenAllowed} onToggle={() => setChildrenAllowed(!childrenAllowed)} label={childrenAllowed ? 'Yes' : 'No'} />
                        </div>
                        <div className="rf-form-group">
                            <label className="rf-form-label">Minimum Child Age</label>
                            <input type="number" className="rf-form-input" value={minChildAge} onChange={e => setMinChildAge(+e.target.value || 0)} placeholder="No minimum" />
                        </div>
                        <div className="rf-form-group">
                            <label className="rf-form-label">Pets Allowed</label>
                            <Toggle active={petsAllowed} onToggle={() => setPetsAllowed(!petsAllowed)} label={petsAllowed ? 'Yes' : 'No'} />
                        </div>
                        <div className="rf-form-group">
                            <label className="rf-form-label">Smoking Allowed</label>
                            <Toggle active={smokingAllowed} onToggle={() => setSmokingAllowed(!smokingAllowed)} label={smokingAllowed ? 'Yes' : 'No - outdoor areas only'} />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
