import { useState, useRef } from 'react';
import { X, ChevronDown, ChevronUp, Upload, Plus, Trash2 } from 'lucide-react';

interface CreateRetreatModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => Promise<void>;
}

const RETREAT_VENUE_TYPES = [
    'Dedicated Retreat Centre', 'Eco Lodge', 'Private Estate',
    'Boutique Hotel', 'Mountain Lodge', 'Beach Property',
    'Wellness Resort', 'Monastery / Ashram', 'Farm / Ranch',
    'Villa', 'Castle / Historic', 'Glamping / Tented',
];

const PRIMARY_VENUE_TYPES = [
    'Retreat Venue', 'Wellness Centre', 'Day Spa', 'Bathhouse',
    'Resort', 'Hotel', 'Eco Lodge', 'Private Estate',
];

const HIRE_TYPES = ['Exclusive Use', 'Shared Use', 'Room Only'];

const CLIMATE_OPTIONS = ['Temperate', 'Tropical', 'Arid', 'Alpine', 'Mediterranean'];

const LOCATION_TYPES = [
    'Rural', 'Countryside', 'Coastal', 'Mountainous',
    'Urban Fringe', 'Tropical', 'Island', 'Lakeside',
];

const ARCHITECTURE_STYLES = [
    'Contemporary Rural', 'Traditional', 'Minimalist', 'Balinese',
    'Japanese', 'Mediterranean', 'Colonial', 'Eco / Sustainable',
];

const SUBSCRIPTION_LEVELS = ['Essentials', 'Standard', 'Featured', 'Premium'];

const IDEAL_RETREAT_TYPES = [
    'Yoga Retreats', 'Meditation Retreats', 'Wellness Retreats',
    'Corporate Retreats', 'Nutrition Retreats', 'Detox Retreats',
    'Silent Retreats', 'Creative Retreats', 'Fitness Retreats',
    'Small Group Gatherings',
];

const MODALITIES_OPTIONS = [
    'Yoga', 'Meditation', 'Breathwork', 'Sound Healing',
    'Nutrition', 'Wellness', 'Cooking', 'Pilates',
    'Mindfulness', 'Ayurveda', 'Naturopathy',
];

const TRANSPORT_OPTIONS = [
    'Car Recommended', 'Airport Transfers Available',
    'Public Transport Nearby', 'Shuttle Service', 'Helicopter Access',
];

interface SectionProps {
    title: string;
    subtitle?: string;
    children: React.ReactNode;
    defaultOpen?: boolean;
}

function CollapsibleSection({ title, subtitle, children, defaultOpen = true }: SectionProps) {
    const [open, setOpen] = useState(defaultOpen);
    return (
        <div className="crm-section">
            <div className="crm-section-header" onClick={() => setOpen(!open)}>
                <div>
                    <div className="crm-section-title">{title}</div>
                    {subtitle && <div className="crm-section-subtitle">{subtitle}</div>}
                </div>
                {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </div>
            {open && <div className="crm-section-body">{children}</div>}
        </div>
    );
}

export default function CreateRetreatModal({ isOpen, onClose, onSubmit }: CreateRetreatModalProps) {
    const [saving, setSaving] = useState(false);
    const heroInputRef = useRef<HTMLInputElement>(null);
    const expInputRef = useRef<HTMLInputElement>(null);
    const galleryInputRef = useRef<HTMLInputElement>(null);

    // Form state
    const [form, setForm] = useState({
        // Basic Information
        venueName: '',
        primaryVenueType: '',
        retreatVenueType: [] as string[],
        maxGuests: 0,
        startingPrice: 0,
        totalBookings: 0,
        hireType: 'Exclusive Use',

        // Images
        heroImage: '',
        experienceImage: '',
        venueImages: [] as string[],

        // Content
        propertyDescription: '',
        shortDescription: '',
        heroQuote: '',
        introductionText: '',

        // Property Details
        propertySize: 0,
        yearsEstablished: '',
        architecturalStyle: '',

        // Experience
        experienceTitle: '',
        experienceSubtitle: '',
        experienceDescription: '',
        modalities: [] as string[],
        idealRetreatType: [] as string[],

        // Location
        location: '',
        city: '',
        postalCode: '',
        stateProvince: '',
        climate: '',
        country: 'Australia',
        locationType: [] as string[],
        gpsLat: '',
        gpsLng: '',
        nearestAirport: '',
        transportAccess: [] as string[],

        // Status & Listing
        listingStatus: true,
        subscriptionLevel: 'Essentials',
        featuredListing: false,
        sanctumVetted: false,
        propertyStatus: true,
        instantBooking: false,
    });

    const updateField = (field: string, value: any) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const toggleArrayItem = (field: string, item: string) => {
        setForm(prev => {
            const arr = (prev as any)[field] as string[];
            return {
                ...prev,
                [field]: arr.includes(item) ? arr.filter(i => i !== item) : [...arr, item],
            };
        });
    };

    const handleImageUpload = (field: string, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            updateField(field, url);
        }
    };

    const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            const urls = Array.from(files).map(f => URL.createObjectURL(f));
            setForm(prev => ({ ...prev, venueImages: [...prev.venueImages, ...urls] }));
        }
    };

    const removeGalleryImage = (index: number) => {
        setForm(prev => ({
            ...prev,
            venueImages: prev.venueImages.filter((_, i) => i !== index),
        }));
    };

    const handleSubmit = async () => {
        if (!form.venueName.trim()) {
            alert('Venue Name is required.');
            return;
        }
        setSaving(true);
        try {
            const gps = form.gpsLat && form.gpsLng ? `${form.gpsLat}, ${form.gpsLng}` : '';
            await onSubmit({
                name: form.venueName,
                type: 'Retreat',
                location: form.location,
                shortLoc: form.city ? `${form.city}, ${form.stateProvince}` : form.location,
                capacity: form.maxGuests,
                status: form.listingStatus ? 'Active' : 'Draft',
                subscription: form.subscriptionLevel,
                owner: '',
                email: '',
                phone: '',
                description: form.propertyDescription,
                website: '',
                amenities: form.modalities,
                facilities: form.retreatVenueType,
                hasAccommodation: true,
                heroImage: form.heroImage,
                galleryPhotos: form.venueImages,
                quote: form.heroQuote,
                shortDescription: form.shortDescription,
                retreatVenueType: form.retreatVenueType,
                hireType: form.hireType,
                experienceFeatureImage: form.experienceImage,
                introText: form.introductionText,
                idealRetreatTypes: form.idealRetreatType,
                experienceTitle: form.experienceTitle,
                experienceSubtitle: form.experienceSubtitle,
                experienceDescription: form.experienceDescription,
                propertySizeValue: form.propertySize,
                propertySizeUnit: 'Acres',
                architectureStyle: form.architecturalStyle,
                established: form.yearsEstablished,
                streetAddress: '',
                suburb: form.city,
                postcode: form.postalCode,
                stateProvince: form.stateProvince,
                country: form.country,
                climate: form.climate,
                locationType: form.locationType,
                gpsCoordinates: gps,
                nearestAirport: form.nearestAirport,
                transportAccess: form.transportAccess,
                maxGuests: form.maxGuests,
                propertyStatus: form.propertyStatus ? 'Operational' : 'Temporarily Closed',
                sanctumVetted: form.sanctumVetted,
                featuredListing: form.featuredListing,
                instantBooking: form.instantBooking,
                modalities: form.modalities,
                pricingTiers: [],
                startingPrice: form.startingPrice,
                totalBookings: form.totalBookings,
                primaryVenueType: form.primaryVenueType,
            });
            onClose();
            // Reset form
            setForm({
                venueName: '', primaryVenueType: '', retreatVenueType: [], maxGuests: 0,
                startingPrice: 0, totalBookings: 0, hireType: 'Exclusive Use',
                heroImage: '', experienceImage: '', venueImages: [],
                propertyDescription: '', shortDescription: '', heroQuote: '', introductionText: '',
                propertySize: 0, yearsEstablished: '', architecturalStyle: '',
                experienceTitle: '', experienceSubtitle: '', experienceDescription: '',
                modalities: [], idealRetreatType: [],
                location: '', city: '', postalCode: '', stateProvince: '', climate: '',
                country: 'Australia', locationType: [], gpsLat: '', gpsLng: '',
                nearestAirport: '', transportAccess: [],
                listingStatus: true, subscriptionLevel: 'Essentials', featuredListing: false,
                sanctumVetted: false, propertyStatus: true, instantBooking: false,
            });
        } catch (err) {
            console.error('Failed to create retreat venue:', err);
        } finally {
            setSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="crm-overlay" onClick={onClose}>
            <div className="crm-modal" onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className="crm-header">
                    <div>
                        <h2 className="crm-title">Create Retreat Venue</h2>
                        <p className="crm-subtitle">Add a new retreat venue to the platform</p>
                    </div>
                    <button className="crm-close" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="crm-body">

                    {/* ─── Basic Information ─── */}
                    <CollapsibleSection title="Basic Information" subtitle="Name, type, and core details">
                        <div className="crm-grid-2">
                            <div className="crm-field">
                                <label>Venue Name *</label>
                                <input type="text" value={form.venueName} onChange={e => updateField('venueName', e.target.value)} placeholder="e.g. Moraea Farm" />
                            </div>
                            <div className="crm-field">
                                <label>Primary Venue Type</label>
                                <select value={form.primaryVenueType} onChange={e => updateField('primaryVenueType', e.target.value)}>
                                    <option value="">Select type...</option>
                                    {PRIMARY_VENUE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="crm-field">
                            <label>Retreat Venue Type</label>
                            <div className="crm-chip-grid">
                                {RETREAT_VENUE_TYPES.map(t => (
                                    <button key={t} type="button" className={`crm-chip ${form.retreatVenueType.includes(t) ? 'active' : ''}`} onClick={() => toggleArrayItem('retreatVenueType', t)}>
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="crm-grid-3">
                            <div className="crm-field">
                                <label>Max Guests</label>
                                <input type="number" value={form.maxGuests || ''} onChange={e => updateField('maxGuests', parseInt(e.target.value) || 0)} placeholder="0" />
                            </div>
                            <div className="crm-field">
                                <label>Starting Price ($)</label>
                                <input type="number" value={form.startingPrice || ''} onChange={e => updateField('startingPrice', parseFloat(e.target.value) || 0)} placeholder="0.00" />
                            </div>
                            <div className="crm-field">
                                <label>Total Bookings</label>
                                <input type="number" value={form.totalBookings || ''} onChange={e => updateField('totalBookings', parseInt(e.target.value) || 0)} placeholder="0" />
                            </div>
                        </div>

                        <div className="crm-field">
                            <label>Hire Use</label>
                            <select value={form.hireType} onChange={e => updateField('hireType', e.target.value)}>
                                {HIRE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                    </CollapsibleSection>

                    {/* ─── Images ─── */}
                    <CollapsibleSection title="Images" subtitle="Hero, experience, and gallery images" defaultOpen={false}>
                        <div className="crm-grid-2">
                            <div className="crm-field">
                                <label>Hero Image</label>
                                <div className="crm-image-upload" onClick={() => heroInputRef.current?.click()}>
                                    {form.heroImage ? (
                                        <img src={form.heroImage} alt="Hero" className="crm-image-preview" />
                                    ) : (
                                        <div className="crm-upload-placeholder">
                                            <Upload size={24} />
                                            <span>Click to upload</span>
                                        </div>
                                    )}
                                </div>
                                <input ref={heroInputRef} type="file" accept="image/*" hidden onChange={e => handleImageUpload('heroImage', e)} />
                            </div>
                            <div className="crm-field">
                                <label>Experience Image</label>
                                <div className="crm-image-upload" onClick={() => expInputRef.current?.click()}>
                                    {form.experienceImage ? (
                                        <img src={form.experienceImage} alt="Experience" className="crm-image-preview" />
                                    ) : (
                                        <div className="crm-upload-placeholder">
                                            <Upload size={24} />
                                            <span>Click to upload</span>
                                        </div>
                                    )}
                                </div>
                                <input ref={expInputRef} type="file" accept="image/*" hidden onChange={e => handleImageUpload('experienceImage', e)} />
                            </div>
                        </div>

                        <div className="crm-field">
                            <label>Venue Images (Gallery)</label>
                            <div className="crm-gallery-grid">
                                {form.venueImages.map((img, i) => (
                                    <div key={i} className="crm-gallery-item">
                                        <img src={img} alt={`Gallery ${i + 1}`} />
                                        <button className="crm-gallery-remove" onClick={() => removeGalleryImage(i)}><Trash2 size={14} /></button>
                                    </div>
                                ))}
                                <div className="crm-gallery-add" onClick={() => galleryInputRef.current?.click()}>
                                    <Plus size={24} />
                                    <span>Add Images</span>
                                </div>
                            </div>
                            <input ref={galleryInputRef} type="file" accept="image/*" multiple hidden onChange={handleGalleryUpload} />
                        </div>
                    </CollapsibleSection>

                    {/* ─── Content & Descriptions ─── */}
                    <CollapsibleSection title="Content & Descriptions" subtitle="Editorial content, descriptions, and quotes" defaultOpen={false}>
                        <div className="crm-field">
                            <label>Property Description</label>
                            <textarea rows={4} value={form.propertyDescription} onChange={e => updateField('propertyDescription', e.target.value)} placeholder="Detailed property description..." />
                        </div>
                        <div className="crm-field">
                            <label>Short Description</label>
                            <textarea rows={2} value={form.shortDescription} onChange={e => updateField('shortDescription', e.target.value)} placeholder="One-liner for cards..." />
                        </div>
                        <div className="crm-field">
                            <label>Hero Quote</label>
                            <input type="text" value={form.heroQuote} onChange={e => updateField('heroQuote', e.target.value)} placeholder="Quote for hero overlay..." />
                        </div>
                        <div className="crm-field">
                            <label>Introduction Text</label>
                            <textarea rows={3} value={form.introductionText} onChange={e => updateField('introductionText', e.target.value)} placeholder="Introduction paragraph..." />
                        </div>
                    </CollapsibleSection>

                    {/* ─── Property Details ─── */}
                    <CollapsibleSection title="Property Details" subtitle="Size, age, and architectural style" defaultOpen={false}>
                        <div className="crm-grid-3">
                            <div className="crm-field">
                                <label>Property Size (Acres)</label>
                                <input type="number" value={form.propertySize || ''} onChange={e => updateField('propertySize', parseInt(e.target.value) || 0)} placeholder="0" />
                            </div>
                            <div className="crm-field">
                                <label>Years Established</label>
                                <input type="text" value={form.yearsEstablished} onChange={e => updateField('yearsEstablished', e.target.value)} placeholder="e.g. 2018" />
                            </div>
                            <div className="crm-field">
                                <label>Architectural Style</label>
                                <select value={form.architecturalStyle} onChange={e => updateField('architecturalStyle', e.target.value)}>
                                    <option value="">Select style...</option>
                                    {ARCHITECTURE_STYLES.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                        </div>
                    </CollapsibleSection>

                    {/* ─── The Experience ─── */}
                    <CollapsibleSection title="The Experience" subtitle="Titles, descriptions, modalities, and retreat types" defaultOpen={false}>
                        <div className="crm-grid-2">
                            <div className="crm-field">
                                <label>Experience Title</label>
                                <input type="text" value={form.experienceTitle} onChange={e => updateField('experienceTitle', e.target.value)} placeholder="e.g. The Moraea Experience" />
                            </div>
                            <div className="crm-field">
                                <label>Experience Subtitle</label>
                                <input type="text" value={form.experienceSubtitle} onChange={e => updateField('experienceSubtitle', e.target.value)} placeholder="Subtitle..." />
                            </div>
                        </div>
                        <div className="crm-field">
                            <label>Experience Description</label>
                            <textarea rows={3} value={form.experienceDescription} onChange={e => updateField('experienceDescription', e.target.value)} placeholder="Describe the retreat experience..." />
                        </div>

                        <div className="crm-field">
                            <label>Modalities</label>
                            <div className="crm-chip-grid">
                                {MODALITIES_OPTIONS.map(m => (
                                    <button key={m} type="button" className={`crm-chip ${form.modalities.includes(m) ? 'active' : ''}`} onClick={() => toggleArrayItem('modalities', m)}>
                                        {m}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="crm-field">
                            <label>Ideal Retreat Type</label>
                            <div className="crm-chip-grid">
                                {IDEAL_RETREAT_TYPES.map(t => (
                                    <button key={t} type="button" className={`crm-chip ${form.idealRetreatType.includes(t) ? 'active' : ''}`} onClick={() => toggleArrayItem('idealRetreatType', t)}>
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </CollapsibleSection>

                    {/* ─── Location Details ─── */}
                    <CollapsibleSection title="Location Details" subtitle="Address, GPS, and transportation" defaultOpen={false}>
                        <div className="crm-field">
                            <label>Location</label>
                            <input type="text" value={form.location} onChange={e => updateField('location', e.target.value)} placeholder="e.g. Berry, NSW, Australia" />
                        </div>
                        <div className="crm-grid-2">
                            <div className="crm-field">
                                <label>City</label>
                                <input type="text" value={form.city} onChange={e => updateField('city', e.target.value)} placeholder="e.g. Berry" />
                            </div>
                            <div className="crm-field">
                                <label>Postal Code</label>
                                <input type="text" value={form.postalCode} onChange={e => updateField('postalCode', e.target.value)} placeholder="e.g. 2535" />
                            </div>
                        </div>
                        <div className="crm-grid-2">
                            <div className="crm-field">
                                <label>State / Province</label>
                                <input type="text" value={form.stateProvince} onChange={e => updateField('stateProvince', e.target.value)} placeholder="e.g. NSW" />
                            </div>
                            <div className="crm-field">
                                <label>Country</label>
                                <input type="text" value={form.country} onChange={e => updateField('country', e.target.value)} placeholder="e.g. Australia" />
                            </div>
                        </div>
                        <div className="crm-grid-2">
                            <div className="crm-field">
                                <label>Climate</label>
                                <select value={form.climate} onChange={e => updateField('climate', e.target.value)}>
                                    <option value="">Select climate...</option>
                                    {CLIMATE_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div className="crm-field">
                                <label>Location Type</label>
                                <div className="crm-chip-grid">
                                    {LOCATION_TYPES.map(lt => (
                                        <button key={lt} type="button" className={`crm-chip small ${form.locationType.includes(lt) ? 'active' : ''}`} onClick={() => toggleArrayItem('locationType', lt)}>
                                            {lt}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="crm-grid-2">
                            <div className="crm-field">
                                <label>GPS Latitude</label>
                                <input type="text" value={form.gpsLat} onChange={e => updateField('gpsLat', e.target.value)} placeholder="e.g. -34.7754" />
                            </div>
                            <div className="crm-field">
                                <label>GPS Longitude</label>
                                <input type="text" value={form.gpsLng} onChange={e => updateField('gpsLng', e.target.value)} placeholder="e.g. 150.6989" />
                            </div>
                        </div>
                        <div className="crm-field">
                            <label>Nearest Airport</label>
                            <input type="text" value={form.nearestAirport} onChange={e => updateField('nearestAirport', e.target.value)} placeholder="e.g. Sydney (SYD) - 130km" />
                        </div>
                        <div className="crm-field">
                            <label>Transportation Access</label>
                            <div className="crm-chip-grid">
                                {TRANSPORT_OPTIONS.map(t => (
                                    <button key={t} type="button" className={`crm-chip small ${form.transportAccess.includes(t) ? 'active' : ''}`} onClick={() => toggleArrayItem('transportAccess', t)}>
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </CollapsibleSection>

                    {/* ─── Status & Listing ─── */}
                    <CollapsibleSection title="Status & Listing" subtitle="Visibility, subscription, and admin flags" defaultOpen={false}>
                        <div className="crm-grid-2">
                            <div className="crm-field">
                                <label>Subscription Level</label>
                                <select value={form.subscriptionLevel} onChange={e => updateField('subscriptionLevel', e.target.value)}>
                                    {SUBSCRIPTION_LEVELS.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                            <div className="crm-field">
                                <label>&nbsp;</label>
                                <div className="crm-toggle-group">
                                    <label className="crm-toggle">
                                        <input type="checkbox" checked={form.listingStatus} onChange={e => updateField('listingStatus', e.target.checked)} />
                                        <span>Listing Status (Active)</span>
                                    </label>
                                    <label className="crm-toggle">
                                        <input type="checkbox" checked={form.propertyStatus} onChange={e => updateField('propertyStatus', e.target.checked)} />
                                        <span>Property Status (Operational)</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className="crm-toggle-group" style={{ marginTop: 12 }}>
                            <label className="crm-toggle">
                                <input type="checkbox" checked={form.featuredListing} onChange={e => updateField('featuredListing', e.target.checked)} />
                                <span>Featured Listing</span>
                            </label>
                            <label className="crm-toggle">
                                <input type="checkbox" checked={form.sanctumVetted} onChange={e => updateField('sanctumVetted', e.target.checked)} />
                                <span>Sanctum Vetted</span>
                            </label>
                            <label className="crm-toggle">
                                <input type="checkbox" checked={form.instantBooking} onChange={e => updateField('instantBooking', e.target.checked)} />
                                <span>Instant Booking</span>
                            </label>
                        </div>
                    </CollapsibleSection>

                </div>

                {/* Footer */}
                <div className="crm-footer">
                    <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
                    <button className="btn btn-primary" onClick={handleSubmit} disabled={saving}>
                        {saving ? 'Creating...' : 'Create Retreat Venue'}
                    </button>
                </div>
            </div>
        </div>
    );
}
