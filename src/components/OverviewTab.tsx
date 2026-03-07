import { useState, useEffect, useRef } from 'react';
import { Image, X } from 'lucide-react';
import type { Venue } from '../context/VenueContext';
import { uploadFile } from '../lib/storage';

interface OverviewTabProps {
    venue: Venue;
    onUpdate: (updates: Partial<Venue>) => void;
}

const HIRE_TYPES = ['Exclusive Use', 'Shared Use', 'Room Only'];
const PROPERTY_SIZE_UNITS = ['Acres', 'Hectares', 'Square Metres'];
const ARCHITECTURE_STYLES = [
    'Select style...', 'Contemporary Rural', 'Traditional', 'Minimalist',
    'Balinese', 'Japanese', 'Mediterranean', 'Colonial', 'Eco/Sustainable'
];
const STATES = ['New South Wales', 'Queensland', 'Victoria', 'South Australia', 'Western Australia', 'Tasmania', 'Northern Territory', 'ACT'];
const COUNTRIES = ['Australia', 'New Zealand', 'Japan', 'Indonesia', 'Thailand', 'Costa Rica'];
const CLIMATES = ['Temperate', 'Tropical', 'Arid', 'Alpine', 'Mediterranean'];
const STATUS_OPTIONS = ['Active', 'Draft', 'Inactive'];
const PROPERTY_STATUS_OPTIONS = ['Operational', 'Under Construction', 'Seasonal'];
const SUBSCRIPTIONS = ['Essentials', 'Standard', 'Featured', 'Premium'];

export default function OverviewTab({ venue, onUpdate }: OverviewTabProps) {
    // Basic Info
    const [heroImage, setHeroImage] = useState(venue.heroImage || '');
    const [experienceFeatureImage, setExperienceFeatureImage] = useState(venue.experienceFeatureImage || '');
    const [galleryPhotos, setGalleryPhotos] = useState<string[]>(venue.galleryPhotos || []);
    const [heroUploading, setHeroUploading] = useState(false);
    const [expUploading, setExpUploading] = useState(false);
    const [galleryUploading, setGalleryUploading] = useState(false);
    const heroInputRef = useRef<HTMLInputElement>(null);
    const expInputRef = useRef<HTMLInputElement>(null);
    const galleryInputRef = useRef<HTMLInputElement>(null);

    const handleHeroUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setHeroUploading(true);
        try {
            const url = await uploadFile(file);
            setHeroImage(url);
        } catch (err) { console.error('Hero image upload failed:', err); }
        finally { setHeroUploading(false); if (heroInputRef.current) heroInputRef.current.value = ''; }
    };

    const handleExpUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setExpUploading(true);
        try {
            const url = await uploadFile(file);
            setExperienceFeatureImage(url);
        } catch (err) { console.error('Experience image upload failed:', err); }
        finally { setExpUploading(false); if (expInputRef.current) expInputRef.current.value = ''; }
    };

    const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (!files.length) return;
        setGalleryUploading(true);
        try {
            const urls = await Promise.all(files.map(f => uploadFile(f)));
            setGalleryPhotos(prev => [...prev, ...urls]);
        } catch (err) { console.error('Gallery upload failed:', err); }
        finally { setGalleryUploading(false); if (galleryInputRef.current) galleryInputRef.current.value = ''; }
    };

    const removeGalleryPhoto = (i: number) => setGalleryPhotos(prev => prev.filter((_, idx) => idx !== i));
    const [name, setName] = useState(venue.name || '');
    const [type, setType] = useState<any>(venue.type || 'Retreat');
    const [retreatVenueType, setRetreatVenueType] = useState<string[]>(venue.retreatVenueType || []);
    const [hireType, setHireType] = useState(venue.hireType || 'Exclusive Use');
    const [description, setDescription] = useState(venue.description || '');
    const [shortDescription, setShortDescription] = useState(venue.shortDescription || '');

    // Editorial Content
    const [quote, setQuote] = useState(venue.quote || '');
    const [introText, setIntroText] = useState(venue.introText || venue.introParagraph1 || '');

    // Property Details
    const [propertySizeValue, setPropertySizeValue] = useState(venue.propertySizeValue || 0);
    const [propertySizeUnit, setPropertySizeUnit] = useState(venue.propertySizeUnit || 'Acres');
    const [established, setEstablished] = useState(venue.established || '');
    const [architectureStyle, setArchitectureStyle] = useState(venue.architectureStyle || 'Select style...');

    // The Experience
    const [experienceTitle, setExperienceTitle] = useState(venue.experienceTitle || '');
    const [experienceSubtitle, setExperienceSubtitle] = useState(venue.experienceSubtitle || '');
    const [experienceDescription, setExperienceDescription] = useState(venue.experienceDescription || '');

    // Retreat Specialties
    const [modalities, setModalities] = useState<string[]>(venue.modalities || []);
    const [idealRetreatTypes, setIdealRetreatTypes] = useState<string[]>(venue.idealRetreatTypes || []);

    // Location
    const [streetAddress, setStreetAddress] = useState(venue.streetAddress || '');
    const [suburb, setSuburb] = useState(venue.suburb || '');
    const [postcode, setPostcode] = useState(venue.postcode || '');
    const [stateProvince, setStateProvince] = useState(venue.stateProvince || 'New South Wales');
    const [country, setCountry] = useState(venue.country || 'Australia');
    const [climate, setClimate] = useState(venue.climate || 'Temperate');
    const [locationType, setLocationType] = useState<string[]>(venue.locationType || []);
    const [gpsCoordinates, setGpsCoordinates] = useState(venue.gpsCoordinates || '');
    const [nearestAirport, setNearestAirport] = useState(venue.nearestAirport || '');
    const [transportAccess, setTransportAccess] = useState<string[]>(venue.transportAccess || []);

    // Status & Listing
    const [status, setStatus] = useState<any>(venue.status || 'Active');
    const [propertyStatus, setPropertyStatus] = useState(venue.propertyStatus || 'Operational');
    const [subscription, setSubscription] = useState<any>(venue.subscription || 'Featured');
    const [sanctumVetted, setSanctumVetted] = useState(venue.sanctumVetted ?? true);
    const [featuredListing, setFeaturedListing] = useState(venue.featuredListing ?? true);
    const [instantBooking, setInstantBooking] = useState(venue.instantBooking ?? false);

    // Computed location for Venue interface mapping
    const computedLocation = `${suburb}${stateProvince ? `, ${stateProvince}` : ''}${country ? `, ${country}` : ''}`;

    // Local input state for tags
    const [newRetreatVenueType, setNewRetreatVenueType] = useState('');
    const [newModality, setNewModality] = useState('');
    const [newIdealType, setNewIdealType] = useState('');
    const [newLocationType, setNewLocationType] = useState('');
    const [newTransportAccess, setNewTransportAccess] = useState('');

    useEffect(() => {
        onUpdate({
            heroImage, experienceFeatureImage, galleryPhotos,
            name, type, retreatVenueType, hireType, description, shortDescription,
            quote, introText, introParagraph1: introText,
            propertySizeValue, propertySizeUnit, established, architectureStyle,
            experienceTitle, experienceSubtitle, experienceDescription,
            modalities, idealRetreatTypes,
            streetAddress, suburb, postcode, stateProvince, country, climate, locationType, gpsCoordinates, nearestAirport, transportAccess,
            location: computedLocation,
            status, propertyStatus, subscription, sanctumVetted, featuredListing, instantBooking
        });
    }, [
        heroImage, experienceFeatureImage, galleryPhotos,
        name, type, retreatVenueType, hireType, description, shortDescription,
        quote, introText, propertySizeValue, propertySizeUnit, established, architectureStyle,
        experienceTitle, experienceSubtitle, experienceDescription, modalities, idealRetreatTypes,
        streetAddress, suburb, postcode, stateProvince, country, climate, locationType, gpsCoordinates, nearestAirport, transportAccess,
        status, propertyStatus, subscription, sanctumVetted, featuredListing, instantBooking
    ]);

    // Array helpers
    const handleAddTag = (val: string, setVal: (v: string) => void, list: string[], setList: (l: string[]) => void) => {
        const trimmed = val.trim();
        if (trimmed && !list.includes(trimmed)) {
            setList([...list, trimmed]);
        }
        setVal('');
    };
    const handleRemoveTag = (tag: string, list: string[], setList: (l: string[]) => void) => {
        setList(list.filter(t => t !== tag));
    };

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
            {/* Quick Stats */}
            <div className="acc-summary-stats" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
                <div className="rf-summary-stat">
                    <div className="rf-summary-stat-value">{venue.capacity || venue.maxGuests || 0}</div>
                    <div className="rf-summary-stat-label">Max Capacity</div>
                </div>
                <div className="rf-summary-stat">
                    <div className="rf-summary-stat-value">{venue.totalBedrooms || venue.individualRooms?.length || 0}</div>
                    <div className="rf-summary-stat-label">Bedrooms</div>
                </div>
                <div className="rf-summary-stat">
                    <div className="rf-summary-stat-value">
                        {venue.pricingTiers && venue.pricingTiers.length > 0 ? venue.pricingTiers[0].price : 'N/A'}
                    </div>
                    <div className="rf-summary-stat-label">Starting Price</div>
                </div>
                <div className="rf-summary-stat">
                    <div className="rf-summary-stat-value">0</div>
                    <div className="rf-summary-stat-label">Total Bookings</div>
                </div>
            </div>

            {/* Tab Images */}
            <section className="rf-section">
                <div className="rf-section-header">
                    <div>
                        <h3 className="rf-section-title">Tab Images</h3>
                        <p className="rf-section-subtitle">Hero and feature images for the Overview tab on the public listing</p>
                    </div>
                </div>
                <div className="rf-section-body">
                    <div className="rf-form-grid">
                        <div className="rf-form-group">
                            <label className="rf-form-label">Overview Hero Image</label>
                            <div
                                className="rf-image-upload-area"
                                onClick={() => !heroUploading && heroInputRef.current?.click()}
                                style={{ height: 160, backgroundImage: heroImage ? `url(${heroImage})` : 'none', backgroundSize: 'cover', backgroundPosition: 'center', borderColor: 'rgba(184, 184, 184, 0.4)', cursor: heroUploading ? 'wait' : 'pointer' }}
                            >
                                {!heroImage && !heroUploading && (
                                    <>
                                        <Image size={32} strokeWidth={1.5} color="#B8B8B8" style={{ marginBottom: 8 }} />
                                        <span style={{ fontSize: 12, color: '#B8B8B8' }}>Click to upload hero image</span>
                                        <span style={{ fontSize: 11, color: '#B8B8B8' }}>Recommended: 1920 x 800px</span>
                                    </>
                                )}
                                {heroUploading && <span style={{ fontSize: 12, color: '#B8B8B8' }}>Uploading…</span>}
                            </div>
                            <input ref={heroInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleHeroUpload} />
                            <p style={{ fontSize: 11, fontStyle: 'italic', color: '#B8B8B8', marginTop: 6 }}>Large hero banner at the top of the Overview tab with the venue quote overlay.</p>
                        </div>
                        <div className="rf-form-group">
                            <label className="rf-form-label">Experience Feature Image</label>
                            <div
                                className="rf-image-upload-area"
                                onClick={() => !expUploading && expInputRef.current?.click()}
                                style={{ height: 160, backgroundImage: experienceFeatureImage ? `url(${experienceFeatureImage})` : 'none', backgroundSize: 'cover', backgroundPosition: 'center', borderColor: 'rgba(184, 184, 184, 0.4)', cursor: expUploading ? 'wait' : 'pointer' }}
                            >
                                {!experienceFeatureImage && !expUploading && (
                                    <>
                                        <Image size={32} strokeWidth={1.5} color="#B8B8B8" style={{ marginBottom: 8 }} />
                                        <span style={{ fontSize: 12, color: '#B8B8B8' }}>Click to upload feature image</span>
                                        <span style={{ fontSize: 11, color: '#B8B8B8' }}>Recommended: 800 x 600px</span>
                                    </>
                                )}
                                {expUploading && <span style={{ fontSize: 12, color: '#B8B8B8' }}>Uploading…</span>}
                            </div>
                            <input ref={expInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleExpUpload} />
                            <p style={{ fontSize: 11, fontStyle: 'italic', color: '#B8B8B8', marginTop: 6 }}>Image displayed alongside "The Experience" content block.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Basic Information Section */}
            <section className="rf-section">
                <div className="rf-section-header">
                    <h3 className="rf-section-title">Basic Information</h3>
                </div>
                <div className="rf-section-body">
                    <div className="rf-form-grid">
                        <div className="rf-form-group">
                            <label className="rf-form-label">Venue Name <span style={{ color: '#C45C5C' }}>*</span></label>
                            <input type="text" className="rf-form-input" value={name} onChange={e => setName(e.target.value)} />
                        </div>
                        <div className="rf-form-group">
                            <label className="rf-form-label">Primary Venue Type <span style={{ color: '#C45C5C' }}>*</span></label>
                            <select className="rf-form-input rf-form-select" value={type} onChange={e => setType(e.target.value)}>
                                <option value="Retreat">Retreat Venue</option>
                                <option value="Wellness">Wellness Venue</option>
                            </select>
                        </div>
                        <div className="rf-form-group">
                            <label className="rf-form-label">Retreat Venue Type</label>
                            <div className="tag-container" style={{ display: 'flex', flexWrap: 'wrap', gap: 8, padding: 12, border: '1px solid rgba(184, 184, 184, 0.3)', borderRadius: 8, minHeight: 48 }}>
                                {retreatVenueType.map(t => (
                                    <span key={t} className="rf-facility-feature" style={{ cursor: 'pointer' }} onClick={() => handleRemoveTag(t, retreatVenueType, setRetreatVenueType)}>
                                        {t} &times;
                                    </span>
                                ))}
                                <input
                                    type="text"
                                    placeholder="Add type..."
                                    value={newRetreatVenueType}
                                    onChange={e => setNewRetreatVenueType(e.target.value)}
                                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag(newRetreatVenueType, setNewRetreatVenueType, retreatVenueType, setRetreatVenueType); } }}
                                    style={{ border: 'none', outline: 'none', background: 'transparent', flex: 1, minWidth: 100, fontSize: 13 }}
                                />
                            </div>
                        </div>
                        <div className="rf-form-group">
                            <label className="rf-form-label">Hire Type</label>
                            <select className="rf-form-input rf-form-select" value={hireType} onChange={e => setHireType(e.target.value)}>
                                {HIRE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                        <div className="rf-form-group full-width">
                            <label className="rf-form-label">Property Description <span style={{ color: '#C45C5C' }}>*</span></label>
                            <textarea className="rf-form-input rf-form-textarea" rows={6} value={description} onChange={e => setDescription(e.target.value)} />
                        </div>
                        <div className="rf-form-group full-width">
                            <label className="rf-form-label">Short Description</label>
                            <input type="text" className="rf-form-input" value={shortDescription} onChange={e => setShortDescription(e.target.value)} />
                        </div>
                    </div>
                </div>
            </section>

            {/* Editorial Content */}
            <section className="rf-section">
                <div className="rf-section-header">
                    <div>
                        <h3 className="rf-section-title">Editorial Content</h3>
                        <p className="rf-section-subtitle">Storytelling content for the Overview tab - this is the editorial voice of the listing</p>
                    </div>
                </div>
                <div className="rf-section-body">
                    <div className="rf-form-grid">
                        <div className="rf-form-group full-width">
                            <label className="rf-form-label">Hero Quote</label>
                            <input type="text" className="rf-form-input" value={quote} onChange={e => setQuote(e.target.value)} placeholder="A compelling one-line quote..." />
                            <p style={{ fontSize: 11, fontStyle: 'italic', color: '#B8B8B8', marginTop: 6 }}>Displayed as an overlay on the Overview hero image. Keep it evocative and concise.</p>
                        </div>
                        <div className="rf-form-group full-width">
                            <label className="rf-form-label">Introduction Text</label>
                            <textarea className="rf-form-input rf-form-textarea" rows={5} value={introText} onChange={e => setIntroText(e.target.value)} placeholder="Editorial storytelling introduction..." />
                            <p style={{ fontSize: 11, fontStyle: 'italic', color: '#B8B8B8', marginTop: 6 }}>This is the editorial introduction on the Overview tab. Write in an evocative, magazine-style voice.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Property Details */}
            <section className="rf-section">
                <div className="rf-section-header">
                    <h3 className="rf-section-title">Property Details</h3>
                </div>
                <div className="rf-section-body">
                    <div className="acc-form-grid-4" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                        <div className="rf-form-group">
                            <label className="rf-form-label">Property Size</label>
                            <div style={{ display: 'flex', gap: 8 }}>
                                <input type="number" className="rf-form-input" value={propertySizeValue} onChange={e => setPropertySizeValue(+e.target.value || 0)} style={{ width: 80 }} />
                                <select className="rf-form-input rf-form-select" value={propertySizeUnit} onChange={e => setPropertySizeUnit(e.target.value)} style={{ flex: 1 }}>
                                    {PROPERTY_SIZE_UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="rf-form-group">
                            <label className="rf-form-label">Year Established</label>
                            <input type="text" className="rf-form-input" value={established} onChange={e => setEstablished(e.target.value)} placeholder="e.g. 2018" />
                        </div>
                        <div className="rf-form-group">
                            <label className="rf-form-label">Architecture Style</label>
                            <select className="rf-form-input rf-form-select" value={architectureStyle} onChange={e => setArchitectureStyle(e.target.value)}>
                                {ARCHITECTURE_STYLES.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                    </div>
                </div>
            </section>

            {/* The Experience */}
            <section className="rf-section">
                <div className="rf-section-header">
                    <div>
                        <h3 className="rf-section-title">The Experience</h3>
                        <p className="rf-section-subtitle">Featured content block on the Overview tab</p>
                    </div>
                </div>
                <div className="rf-section-body">
                    <div className="rf-form-grid">
                        <div className="rf-form-group">
                            <label className="rf-form-label">Experience Title</label>
                            <input type="text" className="rf-form-input" value={experienceTitle} onChange={e => setExperienceTitle(e.target.value)} placeholder="e.g. A Space for Transformation" />
                        </div>
                        <div className="rf-form-group">
                            <label className="rf-form-label">Experience Subtitle</label>
                            <input type="text" className="rf-form-input" value={experienceSubtitle} onChange={e => setExperienceSubtitle(e.target.value)} placeholder="e.g. The Experience" />
                        </div>
                        <div className="rf-form-group full-width">
                            <label className="rf-form-label">Experience Description</label>
                            <textarea className="rf-form-input rf-form-textarea" rows={4} value={experienceDescription} onChange={e => setExperienceDescription(e.target.value)} placeholder="Describe what makes this venue's experience unique..." />
                        </div>
                    </div>
                </div>
            </section>

            {/* Retreat Specialties */}
            <section className="rf-section">
                <div className="rf-section-header">
                    <div>
                        <h3 className="rf-section-title">Retreat Specialties</h3>
                        <p className="rf-section-subtitle">What types of retreats is this venue best suited for?</p>
                    </div>
                </div>
                <div className="rf-section-body">
                    <div className="rf-form-grid">
                        <div className="rf-form-group full-width">
                            <label className="rf-form-label">Modalities & Practices</label>
                            <div className="tag-container" style={{ display: 'flex', flexWrap: 'wrap', gap: 8, padding: 12, border: '1px solid rgba(184, 184, 184, 0.3)', borderRadius: 8, minHeight: 48 }}>
                                {modalities.map(t => (
                                    <span key={t} className="rf-facility-feature" style={{ cursor: 'pointer' }} onClick={() => handleRemoveTag(t, modalities, setModalities)}>
                                        {t} &times;
                                    </span>
                                ))}
                                <input
                                    type="text"
                                    placeholder="Add modality..."
                                    value={newModality}
                                    onChange={e => setNewModality(e.target.value)}
                                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag(newModality, setNewModality, modalities, setModalities); } }}
                                    style={{ border: 'none', outline: 'none', background: 'transparent', flex: 1, minWidth: 100, fontSize: 13 }}
                                />
                            </div>
                            <p style={{ fontSize: 11, fontStyle: 'italic', color: '#B8B8B8', marginTop: 6 }}>These tags appear on the Overview tab and are used for search filtering.</p>
                        </div>
                        <div className="rf-form-group full-width">
                            <label className="rf-form-label">Ideal Retreat Types</label>
                            <div className="tag-container" style={{ display: 'flex', flexWrap: 'wrap', gap: 8, padding: 12, border: '1px solid rgba(184, 184, 184, 0.3)', borderRadius: 8, minHeight: 48 }}>
                                {idealRetreatTypes.map(t => (
                                    <span key={t} className="rf-facility-feature" style={{ cursor: 'pointer' }} onClick={() => handleRemoveTag(t, idealRetreatTypes, setIdealRetreatTypes)}>
                                        {t} &times;
                                    </span>
                                ))}
                                <input
                                    type="text"
                                    placeholder="Add type..."
                                    value={newIdealType}
                                    onChange={e => setNewIdealType(e.target.value)}
                                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag(newIdealType, setNewIdealType, idealRetreatTypes, setIdealRetreatTypes); } }}
                                    style={{ border: 'none', outline: 'none', background: 'transparent', flex: 1, minWidth: 100, fontSize: 13 }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Location Section */}
            <section className="rf-section">
                <div className="rf-section-header">
                    <h3 className="rf-section-title">Location</h3>
                </div>
                <div className="rf-section-body">
                    <div className="acc-form-grid-4" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                        <div className="rf-form-group">
                            <label className="rf-form-label">Street Address <span style={{ color: '#C45C5C' }}>*</span></label>
                            <input type="text" className="rf-form-input" value={streetAddress} onChange={e => setStreetAddress(e.target.value)} />
                        </div>
                        <div className="rf-form-group">
                            <label className="rf-form-label">City/Suburb <span style={{ color: '#C45C5C' }}>*</span></label>
                            <input type="text" className="rf-form-input" value={suburb} onChange={e => setSuburb(e.target.value)} />
                        </div>
                        <div className="rf-form-group">
                            <label className="rf-form-label">Postcode/ZIP <span style={{ color: '#C45C5C' }}>*</span></label>
                            <input type="text" className="rf-form-input" value={postcode} onChange={e => setPostcode(e.target.value)} />
                        </div>
                        <div className="rf-form-group">
                            <label className="rf-form-label">State/Province <span style={{ color: '#C45C5C' }}>*</span></label>
                            <select className="rf-form-input rf-form-select" value={stateProvince} onChange={e => setStateProvince(e.target.value)}>
                                {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                        <div className="rf-form-group">
                            <label className="rf-form-label">Country <span style={{ color: '#C45C5C' }}>*</span></label>
                            <select className="rf-form-input rf-form-select" value={country} onChange={e => setCountry(e.target.value)}>
                                {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div className="rf-form-group">
                            <label className="rf-form-label">Climate</label>
                            <select className="rf-form-input rf-form-select" value={climate} onChange={e => setClimate(e.target.value)}>
                                {CLIMATES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div className="rf-form-group" style={{ gridColumn: 'span 1' }}>
                            <label className="rf-form-label">Location Type</label>
                            <div className="tag-container" style={{ display: 'flex', flexWrap: 'wrap', gap: 8, padding: '8px 12px', border: '1px solid rgba(184, 184, 184, 0.3)', borderRadius: 8, minHeight: 46 }}>
                                {locationType.map(t => (
                                    <span key={t} className="rf-facility-feature" style={{ padding: '4px 8px', fontSize: 11, cursor: 'pointer' }} onClick={() => handleRemoveTag(t, locationType, setLocationType)}>
                                        {t} &times;
                                    </span>
                                ))}
                                <input
                                    type="text"
                                    placeholder="Add..."
                                    value={newLocationType}
                                    onChange={e => setNewLocationType(e.target.value)}
                                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag(newLocationType, setNewLocationType, locationType, setLocationType); } }}
                                    style={{ border: 'none', outline: 'none', background: 'transparent', flex: 1, minWidth: 60, fontSize: 12 }}
                                />
                            </div>
                        </div>
                        <div className="rf-form-group">
                            <label className="rf-form-label">GPS Coordinates</label>
                            <input type="text" className="rf-form-input" value={gpsCoordinates} onChange={e => setGpsCoordinates(e.target.value)} placeholder="-34.7754, 150.6989" />
                        </div>
                        <div className="rf-form-group">
                            <label className="rf-form-label">Nearest Airport</label>
                            <input type="text" className="rf-form-input" value={nearestAirport} onChange={e => setNearestAirport(e.target.value)} placeholder="Sydney (SYD) - 130km" />
                        </div>
                        <div className="rf-form-group" style={{ gridColumn: 'span 3' }}>
                            <label className="rf-form-label">Transport Access</label>
                            <div className="tag-container" style={{ display: 'flex', flexWrap: 'wrap', gap: 8, padding: 12, border: '1px solid rgba(184, 184, 184, 0.3)', borderRadius: 8, minHeight: 48 }}>
                                {transportAccess.map(t => (
                                    <span key={t} className="rf-facility-feature" style={{ cursor: 'pointer' }} onClick={() => handleRemoveTag(t, transportAccess, setTransportAccess)}>
                                        {t} &times;
                                    </span>
                                ))}
                                <input
                                    type="text"
                                    placeholder="Add transport option..."
                                    value={newTransportAccess}
                                    onChange={e => setNewTransportAccess(e.target.value)}
                                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag(newTransportAccess, setNewTransportAccess, transportAccess, setTransportAccess); } }}
                                    style={{ border: 'none', outline: 'none', background: 'transparent', flex: 1, minWidth: 100, fontSize: 13 }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Status & Listing Section */}
            <section className="rf-section">
                <div className="rf-section-header">
                    <h3 className="rf-section-title">Status & Listing</h3>
                </div>
                <div className="rf-section-body">
                    <div className="rf-form-grid">
                        <div className="rf-form-group">
                            <label className="rf-form-label">Listing Status <span style={{ color: '#C45C5C' }}>*</span></label>
                            <select className="rf-form-input rf-form-select" value={status} onChange={e => setStatus(e.target.value)}>
                                {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                        <div className="rf-form-group">
                            <label className="rf-form-label">Property Status</label>
                            <select className="rf-form-input rf-form-select" value={propertyStatus} onChange={e => setPropertyStatus(e.target.value)}>
                                {PROPERTY_STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                        <div className="rf-form-group">
                            <label className="rf-form-label">Subscription Level</label>
                            <select className="rf-form-input rf-form-select" value={subscription} onChange={e => setSubscription(e.target.value)}>
                                {SUBSCRIPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                        <div className="rf-form-group">
                            <label className="rf-form-label">Sanctum Vetted</label>
                            <Toggle active={sanctumVetted} onToggle={() => setSanctumVetted(!sanctumVetted)} label={sanctumVetted ? 'Yes - Verified by TGS' : 'No'} />
                        </div>
                        <div className="rf-form-group">
                            <label className="rf-form-label">Featured Listing</label>
                            <Toggle active={featuredListing} onToggle={() => setFeaturedListing(!featuredListing)} label={featuredListing ? 'Show in featured section' : 'Hide from featured'} />
                        </div>
                        <div className="rf-form-group">
                            <label className="rf-form-label">Instant Booking Available</label>
                            <Toggle active={instantBooking} onToggle={() => setInstantBooking(!instantBooking)} label={instantBooking ? 'Yes - Book instantly' : 'No - Enquiry required'} />
                        </div>
                    </div>
                </div>
            </section>

            {/* Venue Images Preview */}
            <section className="rf-section" style={{ marginBottom: 48 }}>
                <div className="rf-section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 className="rf-section-title">Venue Images</h3>
                    <span style={{ fontSize: 13, color: '#B8B8B8' }}>Go to Media tab to manage all images</span>
                </div>
                <div className="rf-section-body">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
                        {galleryPhotos.map((url, i) => (
                            <div key={i} style={{ aspectRatio: '4/3', backgroundColor: '#F7F5F1', borderRadius: 8, backgroundImage: `url(${url})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
                                <button
                                    type="button"
                                    onClick={() => removeGalleryPhoto(i)}
                                    style={{ position: 'absolute', top: 4, right: 4, background: 'rgba(0,0,0,0.55)', border: 'none', borderRadius: '50%', width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                                >
                                    <X size={12} color="#fff" />
                                </button>
                            </div>
                        ))}
                        {galleryPhotos.length < 3 && Array.from({ length: 3 - galleryPhotos.length }).map((_, i) => (
                            <div key={`empty-${i}`} style={{ aspectRatio: '4/3', backgroundColor: '#F7F5F1', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Image size={32} color="#B8B8B8" strokeWidth={1} />
                            </div>
                        ))}
                        <div
                            onClick={() => !galleryUploading && galleryInputRef.current?.click()}
                            style={{ aspectRatio: '4/3', border: '2px dashed #B8B8B8', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: galleryUploading ? 'wait' : 'pointer' }}
                        >
                            {galleryUploading
                                ? <span style={{ fontSize: 12, color: '#B8B8B8' }}>…</span>
                                : <X style={{ transform: 'rotate(45deg)' }} size={24} color="#B8B8B8" />
                            }
                        </div>
                    </div>
                    <input ref={galleryInputRef} type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={handleGalleryUpload} />
                </div>
            </section>
        </div>
    );
}
