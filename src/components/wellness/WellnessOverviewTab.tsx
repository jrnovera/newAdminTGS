import { useState, useRef } from 'react';
import { Plus, X, Image as ImageIcon } from 'lucide-react';
import { uploadFile } from '../../lib/storage';
import type { Venue } from '../../context/VenueContext';

interface Props {
    venue: Venue;
    onUpdate: (updates: Partial<Venue>) => void;
}

const WELLNESS_VENUE_TYPES = [
    'Day Spa', 'Bathhouse', 'Treatment Centre', 'Urban Sanctuary',
    'Wellness Resort', 'Hotel Spa', 'Medical Spa', 'Thermal Springs',
];

const WELLNESS_CATEGORIES = [
    'Massage', 'Facials', 'Body Treatments', 'Thermal Circuit',
    'Hydrotherapy', 'Infrared Sauna', 'Sound Healing', 'Meditation',
    'Yoga', 'Breathwork', 'Naturopathy', 'Ayurveda',
];

const BEST_FOR_OPTIONS = [
    'Couples', 'Solo Relaxation', "Girls' Day Out", 'Gift Experiences',
    'Corporate Groups', 'Prenatal', 'Bridal Parties', 'Recovery',
];

const LOCATION_TYPES = ['Urban', 'City Center', 'Suburban', 'Coastal', 'Rural', 'Resort'];
const TRANSPORT_OPTIONS = ['Street Parking', 'Public Transport', 'Wheelchair Accessible', 'Valet Parking', 'Bicycle Parking'];

interface TagInputProps {
    tags: string[];
    options: string[];
    onChange: (tags: string[]) => void;
}

function TagInput({ tags, options, onChange }: TagInputProps) {
    const addTag = (tag: string) => {
        if (!tags.includes(tag)) onChange([...tags, tag]);
    };
    const removeTag = (tag: string) => onChange(tags.filter(t => t !== tag));

    return (
        <div>
            <div className="tag-container">
                {tags.map(tag => (
                    <span key={tag} className="tag">
                        {tag}
                        <X className="tag-remove" size={14} onClick={() => removeTag(tag)} />
                    </span>
                ))}
            </div>
            {options.filter(o => !tags.includes(o)).length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
                    {options.filter(o => !tags.includes(o)).map(o => (
                        <button
                            key={o}
                            type="button"
                            onClick={() => addTag(o)}
                            style={{
                                padding: '4px 10px',
                                fontSize: '11px',
                                border: '1px dashed var(--accent)',
                                borderRadius: '12px',
                                background: 'transparent',
                                color: 'var(--accent)',
                                cursor: 'pointer',
                                fontFamily: "'Montserrat', sans-serif",
                            }}
                        >
                            + {o}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

interface HoursState {
    [day: string]: { open: string; close: string; isOpen: boolean };
}

export default function WellnessOverviewTab({ venue, onUpdate }: Props) {
    const [form, setForm] = useState({
        name: venue.name || '',
        venueTypeCategory: venue.venueTypeCategory || 'Wellness',
        wellnessVenueTypes: venue.wellnessVenueTypes?.length ? venue.wellnessVenueTypes : ['Day Spa', 'Urban Sanctuary'],
        wellnessCategories: venue.wellnessCategories?.length ? venue.wellnessCategories : ['Massage', 'Facials', 'Body Treatments', 'Thermal Circuit'],
        description: venue.description || '',
        shortDescription: venue.shortDescription || venue.description?.substring(0, 120) || '',

        // Editorial
        quote: venue.quote || '',
        introText: venue.introText || venue.introParagraph1 || '',

        // Venue Details
        treatmentRooms: venue.totalTreatmentRooms ?? 5,
        couplesSuites: venue.couplesRooms ?? 1,
        totalPractitioners: 8,
        floorArea: venue.propertySizeValue || 280,
        yearEstablished: venue.established || '2018',
        maxConcurrentClients: venue.capacity || 12,

        // Experience
        experienceTitle: venue.experienceTitle || '',
        experienceSubtitle: venue.experienceSubtitle || 'The Experience',
        experienceDescription: venue.experienceDescription || '',

        // Service Specialties
        signatureTreatments: venue.modalities || ['Deep Tissue Massage', 'Thermal Circuit', 'Organic Facials', 'Couples Rituals'],
        bestFor: venue.bestFor || ['Couples', 'Solo Relaxation', "Girls' Day Out", 'Gift Experiences'],

        // Location
        streetAddress: venue.streetAddress || '',
        suiteLevel: '',
        suburb: venue.suburb || '',
        postcode: venue.postcode || '',
        stateProvince: venue.stateProvince || '',
        country: venue.country || 'Australia',
        locationType: venue.locationType || ['Urban', 'City Center'],
        gpsCoordinates: venue.gpsCoordinates || '',
        nearestTransport: venue.nearestAirport || '',
        parkingAccess: venue.transportAccess || ['Street Parking', 'Public Transport', 'Wheelchair Accessible'],

        // Status
        status: venue.status || 'Active',
        propertyStatus: venue.propertyStatus || 'Operational',
        subscription: venue.subscription || 'Featured',
        sanctumVetted: venue.sanctumVetted || true,
        featuredListing: venue.featuredListing || true,
        onlineBooking: venue.instantBooking || true,

        // Hours extra
        holidayNote: venue.holidayNote || 'Closed public holidays. Extended hours available by appointment.',
        afterHoursAvailable: venue.afterHoursAvailable ?? true,
    });

    const [hours, setHours] = useState<HoursState>(
        (venue.operatingHours && Object.keys(venue.operatingHours).length > 0)
            ? venue.operatingHours
            : {
                Monday: { open: '9:00 AM', close: '8:00 PM', isOpen: true },
                Tuesday: { open: '9:00 AM', close: '8:00 PM', isOpen: true },
                Wednesday: { open: '9:00 AM', close: '8:00 PM', isOpen: true },
                Thursday: { open: '9:00 AM', close: '9:00 PM', isOpen: true },
                Friday: { open: '9:00 AM', close: '9:00 PM', isOpen: true },
                Saturday: { open: '9:00 AM', close: '6:00 PM', isOpen: true },
                Sunday: { open: '10:00 AM', close: '5:00 PM', isOpen: true },
            }
    );

    const [galleryPhotos, setGalleryPhotos] = useState<string[]>(venue.galleryPhotos || []);
    const [galleryUploading, setGalleryUploading] = useState(false);
    const galleryInputRef = useRef<HTMLInputElement>(null);

    const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (!files.length) return;
        setGalleryUploading(true);
        try {
            const urls = await Promise.all(files.map(f => uploadFile(f)));
            const updated = [...galleryPhotos, ...urls];
            setGalleryPhotos(updated);
            onUpdate({ galleryPhotos: updated });
        } catch (err) {
            console.error('Gallery upload failed:', err);
        } finally {
            setGalleryUploading(false);
            if (galleryInputRef.current) galleryInputRef.current.value = '';
        }
    };

    const removeGalleryPhoto = (index: number) => {
        const updated = galleryPhotos.filter((_, i) => i !== index);
        setGalleryPhotos(updated);
        onUpdate({ galleryPhotos: updated });
    };

    const update = (field: string, value: any) => {
        setForm(prev => ({ ...prev, [field]: value }));
        onUpdate({ [field]: value });
    };

    const updateHours = (day: string, field: 'open' | 'close' | 'isOpen', value: any) => {
        const newHours = {
            ...hours,
            [day]: { ...hours[day], [field]: value },
        };
        setHours(newHours);
        onUpdate({
            operatingHours: newHours,
            holidayNote: form.holidayNote,
            afterHoursAvailable: form.afterHoursAvailable,
        });
    };

    return (
        <div>
            {/* Basic Information */}
            <section className="form-section">
                <div className="form-section-header">
                    <h3 className="form-section-title">Basic Information</h3>
                </div>
                <div className="form-section-body">
                    <div className="form-grid">
                        <div className="form-group">
                            <label className="form-label">Venue Name <span className="required" style={{ color: 'var(--error)' }}>*</span></label>
                            <input type="text" className="form-input" value={form.name} onChange={e => update('name', e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Primary Venue Type <span className="required" style={{ color: 'var(--error)' }}>*</span></label>
                            <select className="form-input form-select" value={form.venueTypeCategory} onChange={e => update('venueTypeCategory', e.target.value)}>
                                <option value="Retreat">Retreat Venue</option>
                                <option value="Wellness">Wellness Venue</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Wellness Venue Type</label>
                            <TagInput tags={form.wellnessVenueTypes} options={WELLNESS_VENUE_TYPES} onChange={vals => update('wellnessVenueTypes', vals)} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Wellness Categories</label>
                            <TagInput tags={form.wellnessCategories} options={WELLNESS_CATEGORIES} onChange={vals => update('wellnessCategories', vals)} />
                        </div>
                        <div className="form-group full-width">
                            <label className="form-label">Venue Description <span className="required" style={{ color: 'var(--error)' }}>*</span></label>
                            <textarea className="form-input form-textarea" value={form.description} onChange={e => update('description', e.target.value)} />
                        </div>
                        <div className="form-group full-width">
                            <label className="form-label">Short Description</label>
                            <input type="text" className="form-input" value={form.shortDescription} onChange={e => update('shortDescription', e.target.value)} />
                        </div>
                    </div>
                </div>
            </section>

            {/* Editorial Content */}
            <section className="form-section">
                <div className="form-section-header">
                    <div>
                        <h3 className="form-section-title">Editorial Content</h3>
                        <p className="form-section-subtitle">Storytelling content for the Overview tab - this is the editorial voice of the listing</p>
                    </div>
                </div>
                <div className="form-section-body">
                    <div className="form-grid">
                        <div className="form-group full-width">
                            <label className="form-label">Hero Quote</label>
                            <input
                                type="text"
                                className="form-input"
                                value={form.quote}
                                onChange={e => update('quote', e.target.value)}
                                placeholder="A compelling one-line quote that captures the essence of this venue..."
                            />
                            <p style={{ fontSize: '11px', fontStyle: 'italic', color: 'var(--accent)', marginTop: '6px' }}>
                                Displayed as an overlay on the Overview hero image. Keep it evocative and concise.
                            </p>
                        </div>
                        <div className="form-group full-width">
                            <label className="form-label">Introduction Text</label>
                            <textarea
                                className="form-input form-textarea"
                                rows={5}
                                value={form.introText}
                                onChange={e => update('introText', e.target.value)}
                                placeholder="Editorial storytelling introduction (2-3 paragraphs)..."
                            />
                            <p style={{ fontSize: '11px', fontStyle: 'italic', color: 'var(--accent)', marginTop: '6px' }}>
                                This is the editorial introduction on the Overview tab. Write in an evocative, magazine-style voice.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Venue Details */}
            <section className="form-section">
                <div className="form-section-header">
                    <h3 className="form-section-title">Venue Details</h3>
                </div>
                <div className="form-section-body">
                    <div className="form-grid three-col">
                        <div className="form-group">
                            <label className="form-label">Treatment Rooms</label>
                            <input type="number" className="form-input" value={form.treatmentRooms} onChange={e => { const val = parseInt(e.target.value) || 0; setForm(p => ({ ...p, treatmentRooms: val })); onUpdate({ totalTreatmentRooms: val }); }} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Couples Suites</label>
                            <input type="number" className="form-input" value={form.couplesSuites} onChange={e => { const val = parseInt(e.target.value) || 0; setForm(p => ({ ...p, couplesSuites: val })); onUpdate({ couplesRooms: val }); }} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Total Practitioners</label>
                            <input type="number" className="form-input" value={form.totalPractitioners} onChange={e => setForm(p => ({ ...p, totalPractitioners: parseInt(e.target.value) || 0 }))} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Floor Area (sqm)</label>
                            <input type="number" className="form-input" value={form.floorArea} onChange={e => { const val = parseInt(e.target.value) || 0; setForm(p => ({ ...p, floorArea: val })); onUpdate({ propertySizeValue: val }); }} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Year Established</label>
                            <input type="number" className="form-input" value={form.yearEstablished} onChange={e => { setForm(p => ({ ...p, yearEstablished: e.target.value })); onUpdate({ established: e.target.value }); }} placeholder="e.g. 2018" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Max Concurrent Clients</label>
                            <input type="number" className="form-input" value={form.maxConcurrentClients} onChange={e => { const val = parseInt(e.target.value) || 0; setForm(p => ({ ...p, maxConcurrentClients: val })); onUpdate({ maxGuests: val }); }} />
                        </div>
                    </div>
                </div>
            </section>

            {/* The Experience */}
            <section className="form-section">
                <div className="form-section-header">
                    <div>
                        <h3 className="form-section-title">The Experience</h3>
                        <p className="form-section-subtitle">Featured content block on the Overview tab</p>
                    </div>
                </div>
                <div className="form-section-body">
                    <div className="form-grid">
                        <div className="form-group">
                            <label className="form-label">Experience Title</label>
                            <input type="text" className="form-input" value={form.experienceTitle} onChange={e => update('experienceTitle', e.target.value)} placeholder="e.g. A Ritual of Restoration" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Experience Subtitle</label>
                            <input type="text" className="form-input" value={form.experienceSubtitle} onChange={e => update('experienceSubtitle', e.target.value)} placeholder="e.g. The Experience" />
                        </div>
                        <div className="form-group full-width">
                            <label className="form-label">Experience Description</label>
                            <textarea
                                className="form-input form-textarea"
                                rows={4}
                                value={form.experienceDescription}
                                onChange={e => update('experienceDescription', e.target.value)}
                                placeholder="Describe what makes this venue's experience unique..."
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Service Specialties */}
            <section className="form-section">
                <div className="form-section-header">
                    <div>
                        <h3 className="form-section-title">Service Specialties</h3>
                        <p className="form-section-subtitle">What types of experiences is this venue best known for?</p>
                    </div>
                </div>
                <div className="form-section-body">
                    <div className="form-grid">
                        <div className="form-group full-width">
                            <label className="form-label">Signature Treatments</label>
                            <TagInput tags={form.signatureTreatments} options={WELLNESS_CATEGORIES} onChange={vals => { setForm(p => ({ ...p, signatureTreatments: vals })); onUpdate({ modalities: vals }); }} />
                            <p style={{ fontSize: '11px', fontStyle: 'italic', color: 'var(--accent)', marginTop: '6px' }}>
                                These tags appear on the Overview tab and are used for search filtering.
                            </p>
                        </div>
                        <div className="form-group full-width">
                            <label className="form-label">Best For</label>
                            <TagInput tags={form.bestFor} options={BEST_FOR_OPTIONS} onChange={vals => update('bestFor', vals)} />
                        </div>
                    </div>
                </div>
            </section>

            {/* Location */}
            <section className="form-section">
                <div className="form-section-header">
                    <h3 className="form-section-title">Location</h3>
                </div>
                <div className="form-section-body">
                    <div className="form-grid three-col">
                        <div className="form-group">
                            <label className="form-label">Street Address <span style={{ color: 'var(--error)' }}>*</span></label>
                            <input type="text" className="form-input" value={form.streetAddress} onChange={e => update('streetAddress', e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Suite/Level</label>
                            <input type="text" className="form-input" value={form.suiteLevel} onChange={e => setForm(p => ({ ...p, suiteLevel: e.target.value }))} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">City/Suburb <span style={{ color: 'var(--error)' }}>*</span></label>
                            <input type="text" className="form-input" value={form.suburb} onChange={e => update('suburb', e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Postcode <span style={{ color: 'var(--error)' }}>*</span></label>
                            <input type="text" className="form-input" value={form.postcode} onChange={e => update('postcode', e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">State <span style={{ color: 'var(--error)' }}>*</span></label>
                            <select className="form-input form-select" value={form.stateProvince} onChange={e => update('stateProvince', e.target.value)}>
                                <option value="">Select...</option>
                                <option>New South Wales</option>
                                <option>Queensland</option>
                                <option>Victoria</option>
                                <option>Western Australia</option>
                                <option>South Australia</option>
                                <option>Tasmania</option>
                                <option>Northern Territory</option>
                                <option>ACT</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Country <span style={{ color: 'var(--error)' }}>*</span></label>
                            <select className="form-input form-select" value={form.country} onChange={e => update('country', e.target.value)}>
                                <option>Australia</option>
                                <option>New Zealand</option>
                                <option>Japan</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Location Type</label>
                            <TagInput tags={form.locationType} options={LOCATION_TYPES} onChange={vals => update('locationType', vals)} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">GPS Coordinates</label>
                            <input type="text" className="form-input" value={form.gpsCoordinates} onChange={e => update('gpsCoordinates', e.target.value)} placeholder="-33.8830, 151.2115" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Nearest Transport</label>
                            <input type="text" className="form-input" value={form.nearestTransport} onChange={e => { setForm(p => ({ ...p, nearestTransport: e.target.value })); onUpdate({ nearestAirport: e.target.value }); }} />
                        </div>
                        <div className="form-group" style={{ gridColumn: 'span 3' }}>
                            <label className="form-label">Parking & Access</label>
                            <TagInput tags={form.parkingAccess} options={TRANSPORT_OPTIONS} onChange={vals => { setForm(p => ({ ...p, parkingAccess: vals })); onUpdate({ transportAccess: vals }); }} />
                        </div>
                    </div>
                </div>
            </section>

            {/* Operating Hours */}
            <section className="form-section">
                <div className="form-section-header">
                    <h3 className="form-section-title">Operating Hours</h3>
                </div>
                <div className="form-section-body">
                    <div className="hours-grid">
                        {Object.entries(hours).map(([day, h]) => (
                            <div key={day} className="hours-row">
                                <span className="hours-day">{day}</span>
                                <input
                                    type="text"
                                    className="hours-input"
                                    value={h.open}
                                    onChange={e => updateHours(day, 'open', e.target.value)}
                                    disabled={!h.isOpen}
                                />
                                <input
                                    type="text"
                                    className="hours-input"
                                    value={h.close}
                                    onChange={e => updateHours(day, 'close', e.target.value)}
                                    disabled={!h.isOpen}
                                />
                                <div
                                    className={`hours-toggle ${h.isOpen ? 'open' : ''}`}
                                    onClick={() => updateHours(day, 'isOpen', !h.isOpen)}
                                >
                                    <div className="hours-toggle-knob"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="form-grid" style={{ marginTop: '24px' }}>
                        <div className="form-group">
                            <label className="form-label">Holiday Hours Note</label>
                            <input
                                type="text"
                                className="form-input"
                                value={form.holidayNote}
                                onChange={e => { setForm(p => ({ ...p, holidayNote: e.target.value })); onUpdate({ holidayNote: e.target.value }); }}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">After Hours Available</label>
                            <div className="toggle-container" onClick={() => { const val = !form.afterHoursAvailable; setForm(p => ({ ...p, afterHoursAvailable: val })); onUpdate({ afterHoursAvailable: val }); }}>
                                <div className={`toggle ${form.afterHoursAvailable ? 'active' : ''}`}>
                                    <div className="toggle-knob"></div>
                                </div>
                                <span className="toggle-label">{form.afterHoursAvailable ? 'Yes - By appointment' : 'No'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Status & Listing */}
            <section className="form-section">
                <div className="form-section-header">
                    <h3 className="form-section-title">Status & Listing</h3>
                </div>
                <div className="form-section-body">
                    <div className="form-grid">
                        <div className="form-group">
                            <label className="form-label">Listing Status <span style={{ color: 'var(--error)' }}>*</span></label>
                            <select className="form-input form-select" value={form.status} onChange={e => update('status', e.target.value)}>
                                <option>Active</option>
                                <option>Draft</option>
                                <option>Inactive</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Business Status</label>
                            <select className="form-input form-select" value={form.propertyStatus} onChange={e => update('propertyStatus', e.target.value)}>
                                <option>Operational</option>
                                <option>Temporarily Closed</option>
                                <option>Under Renovation</option>
                                <option>Seasonal</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Subscription Level</label>
                            <select className="form-input form-select" value={form.subscription} onChange={e => update('subscription', e.target.value)}>
                                <option>Essentials</option>
                                <option>Professional</option>
                                <option>Featured</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Sanctum Vetted</label>
                            <div className="toggle-container" onClick={() => update('sanctumVetted', !form.sanctumVetted)}>
                                <div className={`toggle ${form.sanctumVetted ? 'active' : ''}`}>
                                    <div className="toggle-knob"></div>
                                </div>
                                <span className="toggle-label">{form.sanctumVetted ? 'Yes - Verified by TGS' : 'No'}</span>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Featured Listing</label>
                            <div className="toggle-container" onClick={() => update('featuredListing', !form.featuredListing)}>
                                <div className={`toggle ${form.featuredListing ? 'active' : ''}`}>
                                    <div className="toggle-knob"></div>
                                </div>
                                <span className="toggle-label">{form.featuredListing ? 'Show in featured section' : 'Off'}</span>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Online Booking Enabled</label>
                            <div className="toggle-container" onClick={() => update('instantBooking', !form.onlineBooking)}>
                                <div className={`toggle ${form.onlineBooking ? 'active' : ''}`}>
                                    <div className="toggle-knob"></div>
                                </div>
                                <span className="toggle-label">{form.onlineBooking ? 'Yes - Book via TGS' : 'Off'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Venue Images */}
            <section className="form-section">
                <div className="form-section-header">
                    <h3 className="form-section-title">Venue Images</h3>
                    <span style={{ fontSize: '13px', color: 'var(--accent)' }}>Go to Media tab to manage all images</span>
                </div>
                <div className="form-section-body">
                    <div className="image-gallery">
                        {galleryPhotos.map((url, i) => (
                            <div key={i} className="image-item" style={{ position: 'relative', backgroundImage: `url(${url})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                                <button
                                    type="button"
                                    onClick={() => removeGalleryPhoto(i)}
                                    style={{ position: 'absolute', top: 4, right: 4, background: 'rgba(0,0,0,0.55)', border: 'none', borderRadius: '50%', width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                                >
                                    <X size={13} color="#fff" />
                                </button>
                            </div>
                        ))}
                        {galleryPhotos.length === 0 && [0, 1, 2].map(i => (
                            <div key={i} className="image-item">
                                <ImageIcon size={40} strokeWidth={1} color="var(--accent)" />
                            </div>
                        ))}
                        <div
                            className="image-item add-new"
                            onClick={() => !galleryUploading && galleryInputRef.current?.click()}
                            style={{ cursor: galleryUploading ? 'wait' : 'pointer' }}
                        >
                            {galleryUploading
                                ? <span style={{ fontSize: 12, color: 'var(--accent)' }}>Uploading…</span>
                                : <Plus size={40} strokeWidth={1.5} color="var(--accent)" />
                            }
                        </div>
                    </div>
                    <input
                        ref={galleryInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        style={{ display: 'none' }}
                        onChange={handleGalleryUpload}
                    />
                </div>
            </section>
        </div>
    );
}
