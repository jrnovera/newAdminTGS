import { useState, useRef, useEffect } from 'react';
import { Plus, Edit3, Upload, Trash2 } from 'lucide-react';
import type { Venue, IndividualRoom } from '../../context/VenueContext';
import { uploadFile } from '../../lib/storage';

interface Props {
    venue: Venue;
    onUpdate: (updates: Partial<Venue>) => void;
}

const WHATS_INCLUDED_OPTIONS = [
    { emoji: '🍳', label: 'Wellness Breakfast' },
    { emoji: '🧖', label: 'Robes & Slippers' },
    { emoji: '🌡️', label: 'Thermal Access' },
    { emoji: '🧴', label: 'Organic Amenities' },
    { emoji: '🍵', label: 'In-Room Tea' },
    { emoji: '📶', label: 'WiFi' },
    { emoji: '🏊', label: 'Pool Access' },
    { emoji: '🧘', label: 'Morning Yoga' },
];


interface RoomData {
    id: string;
    name: string;
    roomType: string;
    bedConfig: string;
    maxOccupancy: number;
    bathroom: string;
    roomSize: number;
    floor: string;
    pricePerNight: number;
    view: string;
    amenities: string[];
    description: string;
    showOnWebsite: boolean;
}

export default function WellnessAccommodationTab({ venue, onUpdate }: Props) {
    const [hasAccommodation, setHasAccommodation] = useState(venue.hasAccommodation ?? false);

    // Accommodation tab hero image
    const [accommodationHeroImage, setAccommodationHeroImage] = useState(venue.accommodationHeroImage || '');
    const [heroUploading, setHeroUploading] = useState(false);
    const heroInputRef = useRef<HTMLInputElement>(null);

    const handleHeroUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setHeroUploading(true);
        try {
            const url = await uploadFile(file);
            setAccommodationHeroImage(url);
            onUpdate({ accommodationHeroImage: url });
        } catch (err) {
            console.error('Accommodation hero upload failed:', err);
        } finally {
            setHeroUploading(false);
            if (heroInputRef.current) heroInputRef.current.value = '';
        }
    };

    // Website display fields
    const [stayLabel, setStayLabel] = useState('Stay With Us');
    const [showStaySection, setShowStaySection] = useState(true);
    const [introParagraph1, setIntroParagraph1] = useState(venue.introParagraph1 || '');
    const [introParagraph2, setIntroParagraph2] = useState(venue.introParagraph2 || '');
    const [roomTypesLabel, setRoomTypesLabel] = useState('Room Types');
    const [roomTypesSubtitle, setRoomTypesSubtitle] = useState('Choose your sanctuary');
    const [whatsIncludedLabel, setWhatsIncludedLabel] = useState("What's Included");
    const [selectedInclusions, setSelectedInclusions] = useState<string[]>(
        venue.whatsIncluded?.length
            ? venue.whatsIncluded
            : ['Wellness Breakfast', 'Robes & Slippers', 'Thermal Access', 'Organic Amenities', 'In-Room Tea', 'WiFi']
    );

    // Day service capacity (maps to wellness_venues columns)
    const [maxDayGuests, setMaxDayGuests] = useState(venue.capacity || 0);
    const [treatmentRooms, setTreatmentRooms] = useState(venue.totalTreatmentRooms || 0);
    const [maxConcurrent, setMaxConcurrent] = useState(venue.maxGuests || 0);
    const [practitionerCapacity, setPractitionerCapacity] = useState(0);

    // Accommodation capacity
    const [maxGuests, setMaxGuests] = useState(venue.maxGuests || 0);
    const [minGuests, setMinGuests] = useState(venue.minGuests || 1);
    const [totalBedrooms, setTotalBedrooms] = useState(venue.totalBedrooms || 0);
    const [totalBathrooms, setTotalBathrooms] = useState(venue.totalBathrooms || 0);
    const [sharedBathrooms, setSharedBathrooms] = useState(venue.sharedBathrooms || 0);
    const [privateEnsuites, setPrivateEnsuites] = useState(venue.privateEnsuites || 0);
    const [accommodationStyle, setAccommodationStyle] = useState(venue.accommodationStyle || 'Boutique Rooms');

    // Bed config
    const [beds, setBeds] = useState({
        king: venue.bedConfigKing || 0,
        queen: venue.bedConfigQueen || 0,
        double: venue.bedConfigDouble || 0,
        single: venue.bedConfigSingle || 0,
        twin: venue.bedConfigTwin || 0,
        bunk: venue.bedConfigBunk || 0,
        sofa: venue.bedConfigSofa || 0,
        rollaway: venue.bedConfigRollaway || 0,
    });

    // Rooms — loaded from DB via VenueContext; stored as RoomData for local display
    const [rooms, setRooms] = useState<RoomData[]>(
        (venue.individualRooms || []).map((r, i) => ({
            id: r.id || `room-${i}`,
            name: r.roomName || `Room ${i + 1}`,
            roomType: r.roomType || 'Standard Room',
            bedConfig: r.bedConfiguration
                ? `${Object.entries(r.bedConfiguration).filter(([, v]) => (v as number) > 0).map(([k, v]) => `${v} x ${k.replace('Beds', '')}`).join(', ') || '1 x Queen'}`
                : '1 x Queen',
            maxOccupancy: r.maxOccupancy || 2,
            bathroom: r.bathroom || 'Private Ensuite',
            roomSize: Number(r.roomSize) || 0,
            floor: r.floor || '',
            pricePerNight: Number(r.pricePerNight) || 0,
            view: '',
            amenities: r.roomAmenities || [],
            description: r.websiteDescription || '',
            showOnWebsite: true,
        }))
    );

    // Check-in/out
    const [checkInTime, setCheckInTime] = useState(venue.checkInTime || '3:00 PM');
    const [checkOutTime, setCheckOutTime] = useState(venue.checkOutTime || '10:00 AM');
    const [earlyCheckIn, setEarlyCheckIn] = useState(venue.earlyCheckInAvailable ?? true);
    const [lateCheckOut, setLateCheckOut] = useState(venue.lateCheckOutAvailable ?? true);
    const [childrenAllowed, setChildrenAllowed] = useState(venue.childrenAllowed ?? true);
    const [minChildAge, setMinChildAge] = useState(venue.minimumChildAge || 0);
    const [petsAllowed, setPetsAllowed] = useState(venue.petsAllowed ?? false);
    const [smokingAllowed, setSmokingAllowed] = useState(venue.smokingAllowed ?? false);

    /** Convert local RoomData to the IndividualRoom shape VenueContext expects */
    const toIndividualRooms = (localRooms: RoomData[]): IndividualRoom[] =>
        localRooms.map(r => ({
            id: r.id,
            roomName: r.name,
            roomImage: '',
            websiteDescription: r.description,
            roomType: r.roomType,
            bedConfiguration: {
                kingBeds: 0, queenBeds: r.maxOccupancy > 1 ? 1 : 0,
                doubleBeds: 0, singleBeds: 0,
                twinBeds: 0, bunkBeds: 0, sofaBeds: 0, rollawayBeds: 0,
            },
            maxOccupancy: r.maxOccupancy,
            bathroom: r.bathroom,
            roomSize: String(r.roomSize),
            floor: r.floor,
            pricePerNight: String(r.pricePerNight),
            roomAmenities: r.amenities,
        }));

    // Batch-save all accommodation fields whenever any state changes
    const isMount = useRef(true);
    useEffect(() => {
        if (isMount.current) { isMount.current = false; return; }
        onUpdate({
            hasAccommodation,
            accommodationHeroImage,
            introParagraph1,
            introParagraph2,
            whatsIncluded: selectedInclusions,
            // Day service capacity → wellness_venues columns
            capacity: maxDayGuests,
            totalTreatmentRooms: treatmentRooms,
            maxGuests: maxConcurrent,
            // Overnight capacity (only relevant when hasAccommodation)
            minGuests,
            totalBedrooms,
            totalBathrooms,
            sharedBathrooms,
            privateEnsuites,
            accommodationStyle,
            bedConfigKing: beds.king,
            bedConfigQueen: beds.queen,
            bedConfigDouble: beds.double,
            bedConfigSingle: beds.single,
            bedConfigTwin: beds.twin,
            bedConfigBunk: beds.bunk,
            bedConfigSofa: beds.sofa,
            bedConfigRollaway: beds.rollaway,
            checkInTime,
            checkOutTime,
            earlyCheckInAvailable: earlyCheckIn,
            lateCheckOutAvailable: lateCheckOut,
            childrenAllowed,
            minimumChildAge: minChildAge,
            petsAllowed,
            smokingAllowed,
            individualRooms: toIndividualRooms(rooms),
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hasAccommodation, accommodationHeroImage, introParagraph1, introParagraph2,
        selectedInclusions, maxDayGuests, treatmentRooms, maxConcurrent, maxGuests, minGuests,
        totalBedrooms, totalBathrooms, sharedBathrooms, privateEnsuites, accommodationStyle,
        beds, checkInTime, checkOutTime, earlyCheckIn, lateCheckOut, childrenAllowed,
        minChildAge, petsAllowed, smokingAllowed, rooms]);

    const toggleInclusion = (label: string) => {
        setSelectedInclusions(prev =>
            prev.includes(label) ? prev.filter(i => i !== label) : [...prev, label]
        );
    };

    const updateBed = (type: string, val: number) => {
        setBeds(prev => ({ ...prev, [type]: val }));
    };

    const addRoom = () => {
        setRooms(prev => [...prev, {
            id: `room-${Date.now()}`,
            name: `Room ${prev.length + 1}`,
            roomType: 'Standard Room',
            bedConfig: '1 x Queen',
            maxOccupancy: 2,
            bathroom: 'Private Ensuite',
            roomSize: 0,
            floor: '',
            pricePerNight: 0,
            view: '',
            amenities: [],
            description: '',
            showOnWebsite: true,
        }]);
    };

    const removeRoom = (id: string) => setRooms(prev => prev.filter(r => r.id !== id));

    return (
        <div className="wvd-content">

            {/* Accommodation Toggle */}
            <section className="wvd-form-section">
                <div className="wvd-form-section-body" style={{ padding: '20px 24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h3 className="wvd-form-section-title">Accommodation Available</h3>
                            <p className="wvd-form-hint" style={{ marginTop: 4 }}>Does this wellness venue offer on-site accommodation?</p>
                        </div>
                        <div className="wvd-toggle-container">
                            <div className={`wvd-toggle ${hasAccommodation ? 'active' : ''}`} onClick={() => { setHasAccommodation(!hasAccommodation); onUpdate({ hasAccommodation: !hasAccommodation }); }}>
                                <div className="wvd-toggle-knob"></div>
                            </div>
                            <span className="wvd-toggle-label">{hasAccommodation ? 'Yes - Overnight stays available' : 'No'}</span>
                        </div>
                    </div>
                </div>
            </section>

            {hasAccommodation && (
                <>
                    {/* Accommodation Tab Hero */}
                    <section className="wvd-form-section">
                        <div className="wvd-form-section-header">
                            <div>
                                <h3 className="wvd-form-section-title">Accommodation Tab Hero</h3>
                                <p className="wvd-form-hint">Hero image displayed at the top of the Accommodation tab on your public listing</p>
                            </div>
                        </div>
                        <div className="wvd-form-section-body">
                            <div className="wvd-form-group">
                                <label className="wvd-form-label">Hero Image</label>
                                <div
                                    className="wa-image-upload"
                                    onClick={() => !heroUploading && heroInputRef.current?.click()}
                                    style={{
                                        cursor: heroUploading ? 'wait' : 'pointer',
                                        backgroundImage: accommodationHeroImage ? `url(${accommodationHeroImage})` : 'none',
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                    }}
                                >
                                    {!accommodationHeroImage && !heroUploading && (
                                        <>
                                            <Upload size={40} strokeWidth={1} color="#B8B8B8" />
                                            <p style={{ fontWeight: 500, marginBottom: 4 }}>Click to upload or drag and drop</p>
                                            <p style={{ color: 'var(--accent)', fontSize: 12 }}>Recommended: 1920×600px, JPG or PNG</p>
                                        </>
                                    )}
                                    {heroUploading && <p style={{ color: 'var(--accent)', fontSize: 13 }}>Uploading…</p>}
                                    {accommodationHeroImage && !heroUploading && (
                                        <button
                                            type="button"
                                            onClick={e => { e.stopPropagation(); setAccommodationHeroImage(''); onUpdate({ accommodationHeroImage: '' }); }}
                                            style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.55)', border: 'none', borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff', fontSize: 16 }}
                                        >
                                            ×
                                        </button>
                                    )}
                                </div>
                                <input ref={heroInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleHeroUpload} />
                            </div>
                        </div>
                    </section>

                    {/* Stay With Us Section */}
                    <section className="wvd-form-section">
                        <div className="wvd-form-section-header">
                            <div>
                                <h3 className="wvd-form-section-title">Stay With Us Section</h3>
                                <p className="wvd-form-hint">Introductory content for the Accommodation tab on your public listing</p>
                            </div>
                        </div>
                        <div className="wvd-form-section-body">
                            <div className="wvd-form-grid">
                                <div className="wvd-form-group">
                                    <label className="wvd-form-label">Section Label</label>
                                    <input type="text" className="wvd-form-input" value={stayLabel} onChange={e => setStayLabel(e.target.value)} placeholder="e.g. Stay With Us" />
                                </div>
                                <div className="wvd-form-group">
                                    <label className="wvd-form-label">Show Section</label>
                                    <div className="wvd-toggle-container">
                                        <div className={`wvd-toggle ${showStaySection ? 'active' : ''}`} onClick={() => setShowStaySection(!showStaySection)}>
                                            <div className="wvd-toggle-knob"></div>
                                        </div>
                                        <span className="wvd-toggle-label">Display on website</span>
                                    </div>
                                </div>
                                <div className="wvd-form-group wvd-full-width">
                                    <label className="wvd-form-label">Introduction Paragraph 1</label>
                                    <textarea className="wvd-form-input wvd-form-textarea" rows={3} value={introParagraph1} onChange={e => setIntroParagraph1(e.target.value)} placeholder="First introductory paragraph..." />
                                </div>
                                <div className="wvd-form-group wvd-full-width">
                                    <label className="wvd-form-label">Introduction Paragraph 2</label>
                                    <textarea className="wvd-form-input wvd-form-textarea" rows={3} value={introParagraph2} onChange={e => setIntroParagraph2(e.target.value)} placeholder="Second introductory paragraph (optional)..." />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Room Types Section */}
                    <section className="wvd-form-section">
                        <div className="wvd-form-section-header">
                            <div>
                                <h3 className="wvd-form-section-title">Room Types Section</h3>
                                <p className="wvd-form-hint">Header content for the room listings on your public listing</p>
                            </div>
                        </div>
                        <div className="wvd-form-section-body">
                            <div className="wvd-form-grid">
                                <div className="wvd-form-group">
                                    <label className="wvd-form-label">Section Label</label>
                                    <input type="text" className="wvd-form-input" value={roomTypesLabel} onChange={e => setRoomTypesLabel(e.target.value)} />
                                </div>
                                <div className="wvd-form-group">
                                    <label className="wvd-form-label">Section Subtitle</label>
                                    <input type="text" className="wvd-form-input" value={roomTypesSubtitle} onChange={e => setRoomTypesSubtitle(e.target.value)} />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* What's Included */}
                    <section className="wvd-form-section">
                        <div className="wvd-form-section-header">
                            <div>
                                <h3 className="wvd-form-section-title">What's Included</h3>
                                <p className="wvd-form-hint">Amenities included with overnight stays — displayed on the Accommodation tab</p>
                            </div>
                        </div>
                        <div className="wvd-form-section-body">
                            <div className="wvd-form-group" style={{ marginBottom: 16 }}>
                                <label className="wvd-form-label">Section Label</label>
                                <input type="text" className="wvd-form-input" value={whatsIncludedLabel} onChange={e => setWhatsIncludedLabel(e.target.value)} style={{ maxWidth: 300 }} />
                            </div>
                            <label className="wvd-form-label" style={{ marginBottom: 12, display: 'block' }}>Select Inclusions to Display (up to 6)</label>
                            <div className="wa-inclusions-grid">
                                {WHATS_INCLUDED_OPTIONS.map(opt => (
                                    <div key={opt.label} className={`wa-inclusion-item ${selectedInclusions.includes(opt.label) ? 'checked' : ''}`} onClick={() => toggleInclusion(opt.label)}>
                                        <div className={`wa-inclusion-check ${selectedInclusions.includes(opt.label) ? 'active' : ''}`}>
                                            {selectedInclusions.includes(opt.label) && <span>✓</span>}
                                        </div>
                                        <span>{opt.emoji} {opt.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                </>
            )}

            {/* Day Guest Capacity */}
            <section className="wvd-form-section">
                <div className="wvd-form-section-header">
                    <h3 className="wvd-form-section-title">Day Guest Capacity</h3>
                </div>
                <div className="wvd-form-section-body">
                    <div className="wvd-form-grid wa-four-col">
                        <div className="wvd-form-group">
                            <label className="wvd-form-label">Maximum Day Guests</label>
                            <input type="number" className="wvd-form-input" value={maxDayGuests || ''} onChange={e => setMaxDayGuests(parseInt(e.target.value) || 0)} />
                        </div>
                        <div className="wvd-form-group">
                            <label className="wvd-form-label">Treatment Rooms</label>
                            <input type="number" className="wvd-form-input" value={treatmentRooms || ''} onChange={e => setTreatmentRooms(parseInt(e.target.value) || 0)} />
                        </div>
                        <div className="wvd-form-group">
                            <label className="wvd-form-label">Max Concurrent Clients</label>
                            <input type="number" className="wvd-form-input" value={maxConcurrent || ''} onChange={e => setMaxConcurrent(parseInt(e.target.value) || 0)} />
                        </div>
                        <div className="wvd-form-group">
                            <label className="wvd-form-label">Practitioner Capacity</label>
                            <input type="number" className="wvd-form-input" value={practitionerCapacity || ''} onChange={e => setPractitionerCapacity(parseInt(e.target.value) || 0)} />
                        </div>
                    </div>
                </div>
            </section>

            {hasAccommodation && (
                <>
                    {/* Note */}
                    <div className="wa-note">
                        <p><strong>Note:</strong> The accommodation sections below are shown for venues with on-site stays. Toggle "Accommodation Available" to show/hide these sections.</p>
                    </div>

                    {/* Summary Stats */}
                    <div className="wa-summary-stats">
                        <div className="wa-summary-stat">
                            <div className="wa-summary-stat-value">{maxGuests}</div>
                            <div className="wa-summary-stat-label">Max Guests</div>
                        </div>
                        <div className="wa-summary-stat">
                            <div className="wa-summary-stat-value">{totalBedrooms}</div>
                            <div className="wa-summary-stat-label">Rooms</div>
                        </div>
                        <div className="wa-summary-stat">
                            <div className="wa-summary-stat-value">{totalBathrooms}</div>
                            <div className="wa-summary-stat-label">Bathrooms</div>
                        </div>
                        <div className="wa-summary-stat">
                            <div className="wa-summary-stat-value">{beds.queen}</div>
                            <div className="wa-summary-stat-label">Queen Beds</div>
                        </div>
                        <div className="wa-summary-stat">
                            <div className="wa-summary-stat-value">{beds.king}</div>
                            <div className="wa-summary-stat-label">King Beds</div>
                        </div>
                    </div>

                    {/* Capacity Overview */}
                    <section className="wvd-form-section">
                        <div className="wvd-form-section-header">
                            <h3 className="wvd-form-section-title">Capacity Overview</h3>
                        </div>
                        <div className="wvd-form-section-body">
                            <div className="wvd-form-grid wa-four-col">
                                <div className="wvd-form-group">
                                    <label className="wvd-form-label">Maximum Guests <span className="wvd-required">*</span></label>
                                    <input type="number" className="wvd-form-input" value={maxGuests || ''} onChange={e => setMaxGuests(parseInt(e.target.value) || 0)} />
                                </div>
                                <div className="wvd-form-group">
                                    <label className="wvd-form-label">Minimum Guests</label>
                                    <input type="number" className="wvd-form-input" value={minGuests || ''} onChange={e => setMinGuests(parseInt(e.target.value) || 0)} />
                                </div>
                                <div className="wvd-form-group">
                                    <label className="wvd-form-label">Total Rooms <span className="wvd-required">*</span></label>
                                    <input type="number" className="wvd-form-input" value={totalBedrooms || ''} onChange={e => setTotalBedrooms(parseInt(e.target.value) || 0)} />
                                </div>
                                <div className="wvd-form-group">
                                    <label className="wvd-form-label">Total Bathrooms <span className="wvd-required">*</span></label>
                                    <input type="number" className="wvd-form-input" value={totalBathrooms || ''} onChange={e => setTotalBathrooms(parseInt(e.target.value) || 0)} />
                                </div>
                                <div className="wvd-form-group">
                                    <label className="wvd-form-label">Shared Bathrooms</label>
                                    <input type="number" className="wvd-form-input" value={sharedBathrooms || ''} onChange={e => setSharedBathrooms(parseInt(e.target.value) || 0)} />
                                </div>
                                <div className="wvd-form-group">
                                    <label className="wvd-form-label">Private Ensuite</label>
                                    <input type="number" className="wvd-form-input" value={privateEnsuites || ''} onChange={e => setPrivateEnsuites(parseInt(e.target.value) || 0)} />
                                </div>
                                <div className="wvd-form-group">
                                    <label className="wvd-form-label">Accommodation Style</label>
                                    <select className="wvd-form-input wvd-form-select" value={accommodationStyle} onChange={e => setAccommodationStyle(e.target.value)}>
                                        <option>Boutique Rooms</option>
                                        <option>Suites</option>
                                        <option>Mixed</option>
                                        <option>Villa-Style</option>
                                    </select>
                                </div>
                                <div className="wvd-form-group">
                                    <label className="wvd-form-label">Booking Type</label>
                                    <select className="wvd-form-input wvd-form-select">
                                        <option>Individual Rooms</option>
                                        <option>Whole Property</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Bed Configuration */}
                    <section className="wvd-form-section">
                        <div className="wvd-form-section-header">
                            <h3 className="wvd-form-section-title">Bed Configuration</h3>
                        </div>
                        <div className="wvd-form-section-body">
                            <div className="wvd-form-grid wa-four-col">
                                {[
                                    ['king', 'King Beds'], ['queen', 'Queen Beds'], ['double', 'Double Beds'], ['single', 'Single Beds'],
                                    ['twin', 'Twin Beds'], ['bunk', 'Bunk Beds'], ['sofa', 'Sofa Beds'], ['rollaway', 'Rollaway/Extra Beds'],
                                ].map(([key, label]) => (
                                    <div key={key} className="wvd-form-group">
                                        <label className="wvd-form-label">{label}</label>
                                        <input type="number" className="wvd-form-input" value={(beds as any)[key] || ''} onChange={e => updateBed(key, parseInt(e.target.value) || 0)} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Individual Room Details */}
                    <section className="wvd-form-section">
                        <div className="wvd-form-section-header">
                            <div>
                                <h3 className="wvd-form-section-title">Individual Room Details</h3>
                                <p className="wvd-form-hint">Room information for internal records and public listing</p>
                            </div>
                            <span style={{ fontSize: 13, color: 'var(--accent)' }}>{rooms.length} rooms configured</span>
                        </div>
                        <div className="wvd-form-section-body">
                            <div className="wa-room-cards">
                                {rooms.map((room, idx) => (
                                    <div key={room.id} className="wa-room-card">
                                        <div className="wa-room-card-header">
                                            <div className="wa-room-card-title">
                                                <span className="wa-room-number">{idx + 1}</span>
                                                {room.name}
                                            </div>
                                            <div className="wa-room-card-actions">
                                                <div className="wvd-toggle-container" style={{ marginRight: 16 }}>
                                                    <div className={`wvd-toggle ${room.showOnWebsite ? 'active' : ''}`} style={{ width: 36, height: 20 }}
                                                        onClick={() => {
                                                            const updated = [...rooms];
                                                            updated[idx].showOnWebsite = !updated[idx].showOnWebsite;
                                                            setRooms(updated);
                                                        }}>
                                                        <div className="wvd-toggle-knob" style={{ width: 16, height: 16 }}></div>
                                                    </div>
                                                    <span className="wvd-toggle-label" style={{ fontSize: 11 }}>Show on Website</span>
                                                </div>
                                                <button className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: 12, borderRadius: 16 }}>
                                                    <Edit3 size={14} /> Edit
                                                </button>
                                                <button
                                                    className="btn btn-secondary"
                                                    style={{ padding: '8px 12px', fontSize: 12, borderRadius: 16, color: 'var(--error)', borderColor: 'var(--error)' }}
                                                    onClick={() => removeRoom(room.id)}
                                                    title="Remove room"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="wa-room-card-body">
                                            {/* Website Display Fields */}
                                            <div className="wa-room-website-row">
                                                <div className="wa-room-image-placeholder">
                                                    <Upload size={24} strokeWidth={1.5} color="#B8B8B8" />
                                                </div>
                                                <div style={{ flex: 1 }}>
                                                    <label className="wvd-form-label" style={{ fontSize: 10 }}>Website Description</label>
                                                    <textarea className="wvd-form-input" style={{ height: 56, resize: 'none', fontSize: 12, marginTop: 4 }}
                                                        value={room.description}
                                                        onChange={e => {
                                                            const updated = [...rooms];
                                                            updated[idx].description = e.target.value;
                                                            setRooms(updated);
                                                        }}
                                                        placeholder="Public description for this room..." />
                                                </div>
                                            </div>

                                            {/* Internal Fields */}
                                            <div className="wa-room-grid">
                                                <div className="wa-room-field"><div className="wa-room-field-label">Room Type</div><div className="wa-room-field-value">{room.roomType}</div></div>
                                                <div className="wa-room-field"><div className="wa-room-field-label">Bed Configuration</div><div className="wa-room-field-value">{room.bedConfig}</div></div>
                                                <div className="wa-room-field"><div className="wa-room-field-label">Max Occupancy</div><div className="wa-room-field-value">{room.maxOccupancy} guests</div></div>
                                                <div className="wa-room-field"><div className="wa-room-field-label">Bathroom</div><div className="wa-room-field-value">{room.bathroom}</div></div>
                                                <div className="wa-room-field"><div className="wa-room-field-label">Room Size</div><div className="wa-room-field-value">{room.roomSize} sqm</div></div>
                                                <div className="wa-room-field"><div className="wa-room-field-label">Floor</div><div className="wa-room-field-value">{room.floor || '—'}</div></div>
                                                <div className="wa-room-field"><div className="wa-room-field-label">Price per Night</div><div className="wa-room-field-value">${room.pricePerNight}</div></div>
                                                <div className="wa-room-field"><div className="wa-room-field-label">View</div><div className="wa-room-field-value">{room.view || '—'}</div></div>
                                                <div className="wa-room-field" style={{ gridColumn: 'span 4' }}>
                                                    <div className="wa-room-field-label">Room Amenities</div>
                                                    <div className="wa-room-amenities">
                                                        {room.amenities.map(a => <span key={a} className="wa-room-amenity">{a}</span>)}
                                                        {room.amenities.length === 0 && <span style={{ fontSize: 12, color: 'var(--accent)' }}>No amenities added</span>}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {/* Add Room */}
                                <button className="wa-add-room-btn" onClick={addRoom}>
                                    <Plus size={18} /> Add Another Room
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* Accessibility */}
                    <section className="wvd-form-section">
                        <div className="wvd-form-section-header">
                            <h3 className="wvd-form-section-title">Accessibility</h3>
                        </div>
                        <div className="wvd-form-section-body">
                            <div className="wvd-form-grid">
                                <div className="wvd-form-group">
                                    <label className="wvd-form-label">Wheelchair Accessible Rooms</label>
                                    <input type="number" className="wvd-form-input" defaultValue={1} />
                                </div>
                                <div className="wvd-form-group">
                                    <label className="wvd-form-label">Accessible Bathrooms</label>
                                    <input type="number" className="wvd-form-input" defaultValue={1} />
                                </div>
                                <div className="wvd-form-group">
                                    <label className="wvd-form-label">Ground Floor Rooms</label>
                                    <input type="number" className="wvd-form-input" defaultValue={0} />
                                </div>
                                <div className="wvd-form-group">
                                    <label className="wvd-form-label">Elevator Access</label>
                                    <div className="wvd-toggle-container">
                                        <div className="wvd-toggle"><div className="wvd-toggle-knob"></div></div>
                                        <span className="wvd-toggle-label">No</span>
                                    </div>
                                </div>
                                <div className="wvd-form-group wvd-full-width">
                                    <label className="wvd-form-label">Accessibility Notes</label>
                                    <textarea className="wvd-form-input wvd-form-textarea" placeholder="Add any additional accessibility information..." />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Additional Information */}
                    <section className="wvd-form-section">
                        <div className="wvd-form-section-header">
                            <h3 className="wvd-form-section-title">Additional Information</h3>
                        </div>
                        <div className="wvd-form-section-body">
                            <div className="wvd-form-grid">
                                <div className="wvd-form-group">
                                    <label className="wvd-form-label">Check-in Time</label>
                                    <input type="text" className="wvd-form-input" value={checkInTime} onChange={e => setCheckInTime(e.target.value)} />
                                </div>
                                <div className="wvd-form-group">
                                    <label className="wvd-form-label">Check-out Time</label>
                                    <input type="text" className="wvd-form-input" value={checkOutTime} onChange={e => setCheckOutTime(e.target.value)} />
                                </div>
                                <div className="wvd-form-group">
                                    <label className="wvd-form-label">Early Check-in Available</label>
                                    <div className="wvd-toggle-container">
                                        <div className={`wvd-toggle ${earlyCheckIn ? 'active' : ''}`} onClick={() => setEarlyCheckIn(!earlyCheckIn)}>
                                            <div className="wvd-toggle-knob"></div>
                                        </div>
                                        <span className="wvd-toggle-label">{earlyCheckIn ? 'Yes - by arrangement' : 'No'}</span>
                                    </div>
                                </div>
                                <div className="wvd-form-group">
                                    <label className="wvd-form-label">Late Check-out Available</label>
                                    <div className="wvd-toggle-container">
                                        <div className={`wvd-toggle ${lateCheckOut ? 'active' : ''}`} onClick={() => setLateCheckOut(!lateCheckOut)}>
                                            <div className="wvd-toggle-knob"></div>
                                        </div>
                                        <span className="wvd-toggle-label">{lateCheckOut ? 'Yes - by arrangement' : 'No'}</span>
                                    </div>
                                </div>
                                <div className="wvd-form-group">
                                    <label className="wvd-form-label">Children Allowed</label>
                                    <div className="wvd-toggle-container">
                                        <div className={`wvd-toggle ${childrenAllowed ? 'active' : ''}`} onClick={() => setChildrenAllowed(!childrenAllowed)}>
                                            <div className="wvd-toggle-knob"></div>
                                        </div>
                                        <span className="wvd-toggle-label">{childrenAllowed ? 'Yes' : 'No'}</span>
                                    </div>
                                </div>
                                <div className="wvd-form-group">
                                    <label className="wvd-form-label">Minimum Child Age</label>
                                    <input type="number" className="wvd-form-input" value={minChildAge || ''} onChange={e => setMinChildAge(parseInt(e.target.value) || 0)} placeholder="No minimum" />
                                </div>
                                <div className="wvd-form-group">
                                    <label className="wvd-form-label">Pets Allowed</label>
                                    <div className="wvd-toggle-container">
                                        <div className={`wvd-toggle ${petsAllowed ? 'active' : ''}`} onClick={() => setPetsAllowed(!petsAllowed)}>
                                            <div className="wvd-toggle-knob"></div>
                                        </div>
                                        <span className="wvd-toggle-label">{petsAllowed ? 'Yes' : 'No'}</span>
                                    </div>
                                </div>
                                <div className="wvd-form-group">
                                    <label className="wvd-form-label">Smoking Allowed</label>
                                    <div className="wvd-toggle-container">
                                        <div className={`wvd-toggle ${smokingAllowed ? 'active' : ''}`} onClick={() => setSmokingAllowed(!smokingAllowed)}>
                                            <div className="wvd-toggle-knob"></div>
                                        </div>
                                        <span className="wvd-toggle-label">{smokingAllowed ? 'Yes' : 'No - outdoor areas only'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </>
            )}
        </div>
    );
}
