import { useState, useRef } from 'react';
import { X, Upload, Plus, Trash2, Check } from 'lucide-react';
import { uploadFile } from '../lib/storage';

interface CreateWellnessModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => Promise<void>;
}

/* ── Constants ── */
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
const SUBSCRIPTION_LEVELS = ['Essentials', 'Standard', 'Featured', 'Premium'];
const AUSTRALIAN_STATES = ['New South Wales', 'Queensland', 'Victoria', 'Western Australia', 'South Australia', 'Tasmania', 'Northern Territory', 'ACT'];

const WEBSITE_AMENITIES = [
    { emoji: '🅿️', label: 'Free Parking' }, { emoji: '🚿', label: 'Showers' },
    { emoji: '🧖', label: 'Robes & Slippers' }, { emoji: '🔒', label: 'Lockers' },
    { emoji: '🍵', label: 'Herbal Tea' }, { emoji: '📶', label: 'WiFi' },
    { emoji: '♿', label: 'Wheelchair Access' }, { emoji: '🏊', label: 'Pool' },
];
const SUPPORTING_OPTIONS = [
    'Relaxation Lounges', 'Meditation Rooms', 'Steam Rooms', 'Cold Plunge Pools',
    'Ice / Snow Rooms', 'Herbal Prep Rooms', 'Consultation Rooms', 'Integration / Rest Spaces',
];
const THERMAL_OPTIONS = [
    'Infrared Sauna', 'Traditional Dry Sauna', 'Steam Room', 'Indoor Thermal Pools',
    'Outdoor Thermal Pools', 'Mineral Spring Pools', 'Natural Hot Spring Pools', 'Geothermal Pools',
];
const ACCESS_OPTIONS = [
    'Wheelchair Accessible', 'Mobility Assistance', 'Accessible Pools',
    'Support Rails', 'Ground Level Access', 'Lift Available',
];

/* ── Tabs ── */
const MODAL_TABS = [
    { id: 'overview', label: 'Overview' },
    { id: 'amenities', label: 'Amenities' },
    { id: 'services', label: 'Wellness Services' },
    { id: 'facilities', label: 'Wellness Facilities' },
    { id: 'pricing', label: 'Pricing & Booking' },
    { id: 'media', label: 'Media' },
    { id: 'owner', label: 'Owner/Manager' },
];

export default function CreateWellnessModal({ isOpen, onClose, onSubmit }: CreateWellnessModalProps) {
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');
    const heroInputRef = useRef<HTMLInputElement>(null);
    const expInputRef = useRef<HTMLInputElement>(null);
    const galleryInputRef = useRef<HTMLInputElement>(null);

    // Track actual File objects alongside blob preview URLs
    const [heroFile, setHeroFile] = useState<File | null>(null);
    const [expFile, setExpFile] = useState<File | null>(null);
    const [galleryFiles, setGalleryFiles] = useState<File[]>([]);

    /* ── Form State ── */
    const [form, setForm] = useState({
        // Overview — Basic
        venueName: '', wellnessVenueTypes: [] as string[], wellnessCategories: [] as string[],
        description: '', shortDescription: '',
        // Overview — Editorial
        heroQuote: '', introductionText: '',
        // Overview — Venue Details
        treatmentRooms: 0, couplesSuites: 0, totalPractitioners: 0,
        floorArea: 0, yearEstablished: '', maxConcurrentClients: 0,
        // Overview — Experience
        experienceTitle: '', experienceSubtitle: '', experienceDescription: '',
        // Overview — Service Specialties
        signatureTreatments: [] as string[], bestFor: [] as string[],
        // Overview — Location
        streetAddress: '', suiteLevel: '', suburb: '', postcode: '',
        stateProvince: '', country: 'Australia', locationType: [] as string[],
        gpsLat: '', gpsLng: '', nearestTransport: '', parkingAccess: [] as string[],
        // Overview — Hours
        holidayNote: '', afterHoursAvailable: false,
        // Overview — Status
        listingStatus: true, propertyStatus: 'Operational',
        subscriptionLevel: 'Essentials', sanctumVetted: false,
        featuredListing: false, onlineBooking: false,

        // Amenities
        websiteAmenities: [] as string[],

        // Services
        serviceDescription: '', priceRange: '', packagePricing: false,
        membershipOptions: false, appointmentRequired: true, onlineBookingAvailable: false,

        // Facilities
        facilitySpace: 0, facilityPhilosophy: '', facilityHighlights: '',
        selectedSupporting: [] as string[], selectedThermal: [] as string[],
        selectedAccess: [] as string[],

        // Pricing
        startingPrice: 0, currency: 'AUD',

        // Media
        heroImage: '', experienceImage: '', venueImages: [] as string[],

        // Owner/Manager
        ownerName: '', ownerEmail: '', ownerPhone: '', managerName: '',
    });

    const u = (field: string, value: any) => setForm(prev => ({ ...prev, [field]: value }));
    const toggle = (field: string, item: string) => {
        setForm(prev => {
            const arr = (prev as any)[field] as string[];
            return { ...prev, [field]: arr.includes(item) ? arr.filter(i => i !== item) : [...arr, item] };
        });
    };

    const handleImageUpload = (field: 'heroImage' | 'experienceImage', e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (field === 'heroImage') setHeroFile(file);
        else setExpFile(file);
        u(field, URL.createObjectURL(file));
    };
    const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;
        const newFiles = Array.from(files);
        const urls = newFiles.map(f => URL.createObjectURL(f));
        setGalleryFiles(prev => [...prev, ...newFiles]);
        setForm(prev => ({ ...prev, venueImages: [...prev.venueImages, ...urls] }));
    };
    const removeGalleryImage = (idx: number) => {
        setGalleryFiles(prev => prev.filter((_, i) => i !== idx));
        setForm(prev => ({ ...prev, venueImages: prev.venueImages.filter((_, i) => i !== idx) }));
    };

    const handleSubmit = async () => {
        if (!form.venueName.trim()) { alert('Venue Name is required.'); return; }
        setSaving(true);
        try {
            // Upload images to Supabase storage before creating the venue
            const [heroUrl, expUrl, ...galleryUrls] = await Promise.all([
                heroFile ? uploadFile(heroFile) : Promise.resolve(form.heroImage),
                expFile ? uploadFile(expFile) : Promise.resolve(form.experienceImage),
                ...galleryFiles.map(f => uploadFile(f)),
            ]);

            const gps = form.gpsLat && form.gpsLng ? `${form.gpsLat}, ${form.gpsLng}` : '';
            await onSubmit({
                name: form.venueName, type: 'Wellness',
                location: form.streetAddress || form.suburb,
                shortLoc: form.suburb ? `${form.suburb}, ${form.stateProvince}` : '',
                capacity: form.maxConcurrentClients,
                status: form.listingStatus ? 'Active' : 'Draft',
                subscription: form.subscriptionLevel,
                owner: form.ownerName, email: form.ownerEmail, phone: form.ownerPhone,
                description: form.description, website: '',
                amenities: form.wellnessCategories, facilities: form.wellnessVenueTypes,
                hasAccommodation: false,
                heroImage: heroUrl, galleryPhotos: galleryUrls,
                quote: form.heroQuote, shortDescription: form.shortDescription,
                venueTypeCategory: 'Wellness',
                experienceFeatureImage: expUrl,
                introParagraph1: form.introductionText,
                experienceTitle: form.experienceTitle, experienceSubtitle: form.experienceSubtitle,
                experienceDescription: form.experienceDescription,
                wellnessVenueTypes: form.wellnessVenueTypes,
                wellnessCategories: form.wellnessCategories,
                totalTreatmentRooms: form.treatmentRooms,
                couplesRooms: form.couplesSuites,
                propertySizeValue: form.floorArea, propertySizeUnit: 'sqm',
                established: form.yearEstablished,
                maxGuests: form.maxConcurrentClients,
                streetAddress: form.streetAddress, suburb: form.suburb,
                postcode: form.postcode, stateProvince: form.stateProvince,
                country: form.country, locationType: form.locationType,
                gpsCoordinates: gps, nearestAirport: form.nearestTransport,
                transportAccess: form.parkingAccess,
                propertyStatus: form.propertyStatus,
                sanctumVetted: form.sanctumVetted, featuredListing: form.featuredListing,
                instantBooking: form.onlineBooking,
                modalities: form.signatureTreatments, bestFor: form.bestFor,
                pricingTiers: [], startingPrice: form.startingPrice, totalBookings: 0,
            });
            onClose();
            // Reset form and file tracking
            setHeroFile(null);
            setExpFile(null);
            setGalleryFiles([]);
            setActiveTab('overview');
            setForm({
                venueName: '', wellnessVenueTypes: [], wellnessCategories: [],
                description: '', shortDescription: '', heroQuote: '', introductionText: '',
                treatmentRooms: 0, couplesSuites: 0, totalPractitioners: 0,
                floorArea: 0, yearEstablished: '', maxConcurrentClients: 0,
                experienceTitle: '', experienceSubtitle: '', experienceDescription: '',
                signatureTreatments: [], bestFor: [],
                streetAddress: '', suiteLevel: '', suburb: '', postcode: '',
                stateProvince: '', country: 'Australia', locationType: [],
                gpsLat: '', gpsLng: '', nearestTransport: '', parkingAccess: [],
                holidayNote: '', afterHoursAvailable: false,
                listingStatus: true, propertyStatus: 'Operational',
                subscriptionLevel: 'Essentials', sanctumVetted: false,
                featuredListing: false, onlineBooking: false,
                websiteAmenities: [],
                serviceDescription: '', priceRange: '', packagePricing: false,
                membershipOptions: false, appointmentRequired: true, onlineBookingAvailable: false,
                facilitySpace: 0, facilityPhilosophy: '', facilityHighlights: '',
                selectedSupporting: [], selectedThermal: [], selectedAccess: [],
                startingPrice: 0, currency: 'AUD',
                heroImage: '', experienceImage: '', venueImages: [],
                ownerName: '', ownerEmail: '', ownerPhone: '', managerName: '',
            });
        } catch (err) {
            console.error('Failed to create wellness venue:', err);
        } finally {
            setSaving(false);
        }
    };

    if (!isOpen) return null;

    /* ─────────── Tab Content Renderers ─────────── */

    const renderOverview = () => (
        <>
            {/* Basic Information */}
            <section className="form-section">
                <div className="form-section-header"><h3 className="form-section-title">Basic Information</h3></div>
                <div className="form-section-body">
                    <div className="form-grid">
                        <div className="form-group">
                            <label className="form-label">Venue Name <span style={{ color: 'var(--error)' }}>*</span></label>
                            <input type="text" className="form-input" value={form.venueName} onChange={e => u('venueName', e.target.value)} placeholder="e.g. Bodhi Urban Spa" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Primary Venue Type</label>
                            <select className="form-input form-select" value="Wellness" disabled>
                                <option value="Wellness">Wellness Venue</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Wellness Venue Type</label>
                            <div className="tag-container">
                                {form.wellnessVenueTypes.map(t => (
                                    <span key={t} className="tag">{t}<X className="tag-remove" size={14} onClick={() => toggle('wellnessVenueTypes', t)} /></span>
                                ))}
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
                                {WELLNESS_VENUE_TYPES.filter(o => !form.wellnessVenueTypes.includes(o)).map(o => (
                                    <button key={o} type="button" onClick={() => toggle('wellnessVenueTypes', o)} style={{ padding: '4px 10px', fontSize: '11px', border: '1px dashed var(--accent)', borderRadius: '12px', background: 'transparent', color: 'var(--accent)', cursor: 'pointer', fontFamily: "'Montserrat', sans-serif" }}>+ {o}</button>
                                ))}
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Wellness Categories</label>
                            <div className="tag-container">
                                {form.wellnessCategories.map(t => (
                                    <span key={t} className="tag">{t}<X className="tag-remove" size={14} onClick={() => toggle('wellnessCategories', t)} /></span>
                                ))}
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
                                {WELLNESS_CATEGORIES.filter(o => !form.wellnessCategories.includes(o)).map(o => (
                                    <button key={o} type="button" onClick={() => toggle('wellnessCategories', o)} style={{ padding: '4px 10px', fontSize: '11px', border: '1px dashed var(--accent)', borderRadius: '12px', background: 'transparent', color: 'var(--accent)', cursor: 'pointer', fontFamily: "'Montserrat', sans-serif" }}>+ {o}</button>
                                ))}
                            </div>
                        </div>
                        <div className="form-group full-width">
                            <label className="form-label">Venue Description <span style={{ color: 'var(--error)' }}>*</span></label>
                            <textarea className="form-input form-textarea" value={form.description} onChange={e => u('description', e.target.value)} placeholder="Detailed venue description..." />
                        </div>
                        <div className="form-group full-width">
                            <label className="form-label">Short Description</label>
                            <input type="text" className="form-input" value={form.shortDescription} onChange={e => u('shortDescription', e.target.value)} placeholder="One-liner for cards..." />
                        </div>
                    </div>
                </div>
            </section>

            {/* Editorial Content */}
            <section className="form-section">
                <div className="form-section-header">
                    <div>
                        <h3 className="form-section-title">Editorial Content</h3>
                        <p className="form-section-subtitle">Storytelling content for the Overview tab</p>
                    </div>
                </div>
                <div className="form-section-body">
                    <div className="form-grid">
                        <div className="form-group full-width">
                            <label className="form-label">Hero Quote</label>
                            <input type="text" className="form-input" value={form.heroQuote} onChange={e => u('heroQuote', e.target.value)} placeholder="A compelling one-line quote..." />
                        </div>
                        <div className="form-group full-width">
                            <label className="form-label">Introduction Text</label>
                            <textarea className="form-input form-textarea" rows={4} value={form.introductionText} onChange={e => u('introductionText', e.target.value)} placeholder="Editorial storytelling introduction..." />
                        </div>
                    </div>
                </div>
            </section>

            {/* Venue Details */}
            <section className="form-section">
                <div className="form-section-header"><h3 className="form-section-title">Venue Details</h3></div>
                <div className="form-section-body">
                    <div className="form-grid three-col">
                        <div className="form-group">
                            <label className="form-label">Treatment Rooms</label>
                            <input type="number" className="form-input" value={form.treatmentRooms || ''} onChange={e => u('treatmentRooms', parseInt(e.target.value) || 0)} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Couples Suites</label>
                            <input type="number" className="form-input" value={form.couplesSuites || ''} onChange={e => u('couplesSuites', parseInt(e.target.value) || 0)} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Total Practitioners</label>
                            <input type="number" className="form-input" value={form.totalPractitioners || ''} onChange={e => u('totalPractitioners', parseInt(e.target.value) || 0)} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Floor Area (sqm)</label>
                            <input type="number" className="form-input" value={form.floorArea || ''} onChange={e => u('floorArea', parseInt(e.target.value) || 0)} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Year Established</label>
                            <input type="text" className="form-input" value={form.yearEstablished} onChange={e => u('yearEstablished', e.target.value)} placeholder="e.g. 2018" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Max Concurrent Clients</label>
                            <input type="number" className="form-input" value={form.maxConcurrentClients || ''} onChange={e => u('maxConcurrentClients', parseInt(e.target.value) || 0)} />
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
                            <input type="text" className="form-input" value={form.experienceTitle} onChange={e => u('experienceTitle', e.target.value)} placeholder="e.g. A Ritual of Restoration" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Experience Subtitle</label>
                            <input type="text" className="form-input" value={form.experienceSubtitle} onChange={e => u('experienceSubtitle', e.target.value)} placeholder="e.g. The Experience" />
                        </div>
                        <div className="form-group full-width">
                            <label className="form-label">Experience Description</label>
                            <textarea className="form-input form-textarea" rows={3} value={form.experienceDescription} onChange={e => u('experienceDescription', e.target.value)} placeholder="Describe what makes this venue's experience unique..." />
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
                            <div className="tag-container">
                                {form.signatureTreatments.map(t => (
                                    <span key={t} className="tag">{t}<X className="tag-remove" size={14} onClick={() => toggle('signatureTreatments', t)} /></span>
                                ))}
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
                                {WELLNESS_CATEGORIES.filter(o => !form.signatureTreatments.includes(o)).map(o => (
                                    <button key={o} type="button" onClick={() => toggle('signatureTreatments', o)} style={{ padding: '4px 10px', fontSize: '11px', border: '1px dashed var(--accent)', borderRadius: '12px', background: 'transparent', color: 'var(--accent)', cursor: 'pointer', fontFamily: "'Montserrat', sans-serif" }}>+ {o}</button>
                                ))}
                            </div>
                        </div>
                        <div className="form-group full-width">
                            <label className="form-label">Best For</label>
                            <div className="tag-container">
                                {form.bestFor.map(t => (
                                    <span key={t} className="tag">{t}<X className="tag-remove" size={14} onClick={() => toggle('bestFor', t)} /></span>
                                ))}
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
                                {BEST_FOR_OPTIONS.filter(o => !form.bestFor.includes(o)).map(o => (
                                    <button key={o} type="button" onClick={() => toggle('bestFor', o)} style={{ padding: '4px 10px', fontSize: '11px', border: '1px dashed var(--accent)', borderRadius: '12px', background: 'transparent', color: 'var(--accent)', cursor: 'pointer', fontFamily: "'Montserrat', sans-serif" }}>+ {o}</button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Location */}
            <section className="form-section">
                <div className="form-section-header"><h3 className="form-section-title">Location</h3></div>
                <div className="form-section-body">
                    <div className="form-grid three-col">
                        <div className="form-group">
                            <label className="form-label">Street Address <span style={{ color: 'var(--error)' }}>*</span></label>
                            <input type="text" className="form-input" value={form.streetAddress} onChange={e => u('streetAddress', e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Suite/Level</label>
                            <input type="text" className="form-input" value={form.suiteLevel} onChange={e => u('suiteLevel', e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">City/Suburb <span style={{ color: 'var(--error)' }}>*</span></label>
                            <input type="text" className="form-input" value={form.suburb} onChange={e => u('suburb', e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Postcode <span style={{ color: 'var(--error)' }}>*</span></label>
                            <input type="text" className="form-input" value={form.postcode} onChange={e => u('postcode', e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">State <span style={{ color: 'var(--error)' }}>*</span></label>
                            <select className="form-input form-select" value={form.stateProvince} onChange={e => u('stateProvince', e.target.value)}>
                                <option value="">Select...</option>
                                {AUSTRALIAN_STATES.map(s => <option key={s}>{s}</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Country <span style={{ color: 'var(--error)' }}>*</span></label>
                            <select className="form-input form-select" value={form.country} onChange={e => u('country', e.target.value)}>
                                <option>Australia</option><option>New Zealand</option><option>Japan</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Location Type</label>
                            <div className="tag-container">
                                {form.locationType.map(t => (
                                    <span key={t} className="tag">{t}<X className="tag-remove" size={14} onClick={() => toggle('locationType', t)} /></span>
                                ))}
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
                                {LOCATION_TYPES.filter(o => !form.locationType.includes(o)).map(o => (
                                    <button key={o} type="button" onClick={() => toggle('locationType', o)} style={{ padding: '4px 10px', fontSize: '11px', border: '1px dashed var(--accent)', borderRadius: '12px', background: 'transparent', color: 'var(--accent)', cursor: 'pointer', fontFamily: "'Montserrat', sans-serif" }}>+ {o}</button>
                                ))}
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">GPS Coordinates</label>
                            <input type="text" className="form-input" value={form.gpsLat} onChange={e => u('gpsLat', e.target.value)} placeholder="-33.8830, 151.2115" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Nearest Transport</label>
                            <input type="text" className="form-input" value={form.nearestTransport} onChange={e => u('nearestTransport', e.target.value)} />
                        </div>
                        <div className="form-group" style={{ gridColumn: 'span 3' }}>
                            <label className="form-label">Parking & Access</label>
                            <div className="tag-container">
                                {form.parkingAccess.map(t => (
                                    <span key={t} className="tag">{t}<X className="tag-remove" size={14} onClick={() => toggle('parkingAccess', t)} /></span>
                                ))}
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
                                {TRANSPORT_OPTIONS.filter(o => !form.parkingAccess.includes(o)).map(o => (
                                    <button key={o} type="button" onClick={() => toggle('parkingAccess', o)} style={{ padding: '4px 10px', fontSize: '11px', border: '1px dashed var(--accent)', borderRadius: '12px', background: 'transparent', color: 'var(--accent)', cursor: 'pointer', fontFamily: "'Montserrat', sans-serif" }}>+ {o}</button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Status & Listing */}
            <section className="form-section">
                <div className="form-section-header"><h3 className="form-section-title">Status & Listing</h3></div>
                <div className="form-section-body">
                    <div className="form-grid">
                        <div className="form-group">
                            <label className="form-label">Listing Status <span style={{ color: 'var(--error)' }}>*</span></label>
                            <select className="form-input form-select" value={form.listingStatus ? 'Active' : 'Draft'} onChange={e => u('listingStatus', e.target.value === 'Active')}>
                                <option>Active</option><option>Draft</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Business Status</label>
                            <select className="form-input form-select" value={form.propertyStatus} onChange={e => u('propertyStatus', e.target.value)}>
                                <option>Operational</option><option>Temporarily Closed</option><option>Under Renovation</option><option>Seasonal</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Subscription Level</label>
                            <select className="form-input form-select" value={form.subscriptionLevel} onChange={e => u('subscriptionLevel', e.target.value)}>
                                {SUBSCRIPTION_LEVELS.map(s => <option key={s}>{s}</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Sanctum Vetted</label>
                            <div className="toggle-container" onClick={() => u('sanctumVetted', !form.sanctumVetted)}>
                                <div className={`toggle ${form.sanctumVetted ? 'active' : ''}`}><div className="toggle-knob"></div></div>
                                <span className="toggle-label">{form.sanctumVetted ? 'Yes' : 'No'}</span>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Featured Listing</label>
                            <div className="toggle-container" onClick={() => u('featuredListing', !form.featuredListing)}>
                                <div className={`toggle ${form.featuredListing ? 'active' : ''}`}><div className="toggle-knob"></div></div>
                                <span className="toggle-label">{form.featuredListing ? 'Yes' : 'No'}</span>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Online Booking</label>
                            <div className="toggle-container" onClick={() => u('onlineBooking', !form.onlineBooking)}>
                                <div className={`toggle ${form.onlineBooking ? 'active' : ''}`}><div className="toggle-knob"></div></div>
                                <span className="toggle-label">{form.onlineBooking ? 'Yes' : 'No'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );

    const renderAmenities = () => (
        <>
            <section className="form-section">
                <div className="form-section-header">
                    <div>
                        <h3 className="form-section-title">Website Amenities</h3>
                        <p className="form-section-subtitle">Select amenities to display on the public listing</p>
                    </div>
                </div>
                <div className="form-section-body">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                        {WEBSITE_AMENITIES.map(a => (
                            <div
                                key={a.label}
                                onClick={() => toggle('websiteAmenities', a.label)}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px',
                                    borderRadius: '10px', cursor: 'pointer',
                                    border: form.websiteAmenities.includes(a.label) ? '1.5px solid var(--accent)' : '1px solid rgba(184,184,184,.2)',
                                    background: form.websiteAmenities.includes(a.label) ? 'rgba(139,69,19,.04)' : 'transparent',
                                }}
                            >
                                <div style={{
                                    width: 18, height: 18, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    border: form.websiteAmenities.includes(a.label) ? 'none' : '1.5px solid #ccc',
                                    background: form.websiteAmenities.includes(a.label) ? 'var(--accent)' : 'transparent',
                                }}>
                                    {form.websiteAmenities.includes(a.label) && <Check size={10} color="#fff" strokeWidth={3} />}
                                </div>
                                <span>{a.emoji} {a.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );

    const renderServices = () => (
        <>
            <section className="form-section">
                <div className="form-section-header"><h3 className="form-section-title">Services Overview</h3></div>
                <div className="form-section-body">
                    <div className="form-grid">
                        <div className="form-group full-width">
                            <label className="form-label">Wellness Services Description</label>
                            <textarea className="form-input form-textarea" rows={4} value={form.serviceDescription} onChange={e => u('serviceDescription', e.target.value)} placeholder="Describe the services this venue offers..." />
                        </div>
                    </div>
                </div>
            </section>
            <section className="form-section">
                <div className="form-section-header"><h3 className="form-section-title">Booking & Availability</h3></div>
                <div className="form-section-body">
                    <div className="form-grid">
                        <div className="form-group">
                            <label className="form-label">Price Range Per Session</label>
                            <input type="text" className="form-input" value={form.priceRange} onChange={e => u('priceRange', e.target.value)} placeholder="e.g. $85 - $350" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Package Pricing Available</label>
                            <div className="toggle-container" onClick={() => u('packagePricing', !form.packagePricing)}>
                                <div className={`toggle ${form.packagePricing ? 'active' : ''}`}><div className="toggle-knob"></div></div>
                                <span className="toggle-label">{form.packagePricing ? 'Yes' : 'No'}</span>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Membership Options</label>
                            <div className="toggle-container" onClick={() => u('membershipOptions', !form.membershipOptions)}>
                                <div className={`toggle ${form.membershipOptions ? 'active' : ''}`}><div className="toggle-knob"></div></div>
                                <span className="toggle-label">{form.membershipOptions ? 'Yes' : 'No'}</span>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Appointment Required</label>
                            <div className="toggle-container" onClick={() => u('appointmentRequired', !form.appointmentRequired)}>
                                <div className={`toggle ${form.appointmentRequired ? 'active' : ''}`}><div className="toggle-knob"></div></div>
                                <span className="toggle-label">{form.appointmentRequired ? 'Yes' : 'No'}</span>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Online Booking Available</label>
                            <div className="toggle-container" onClick={() => u('onlineBookingAvailable', !form.onlineBookingAvailable)}>
                                <div className={`toggle ${form.onlineBookingAvailable ? 'active' : ''}`}><div className="toggle-knob"></div></div>
                                <span className="toggle-label">{form.onlineBookingAvailable ? 'Yes' : 'No'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );

    const renderFacilities = () => (
        <>
            <section className="form-section">
                <div className="form-section-header"><h3 className="form-section-title">Facility Summary</h3></div>
                <div className="form-section-body">
                    <div className="form-grid">
                        <div className="form-group">
                            <label className="form-label">Total Facility Space (sqm)</label>
                            <input type="number" className="form-input" value={form.facilitySpace || ''} onChange={e => u('facilitySpace', parseInt(e.target.value) || 0)} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Facility Philosophy</label>
                            <input type="text" className="form-input" value={form.facilityPhilosophy} onChange={e => u('facilityPhilosophy', e.target.value)} placeholder="e.g. Urban sanctuary combining modern wellness with traditional techniques" />
                        </div>
                        <div className="form-group full-width">
                            <label className="form-label">Facility Highlights</label>
                            <textarea className="form-input form-textarea" rows={3} value={form.facilityHighlights} onChange={e => u('facilityHighlights', e.target.value)} placeholder="Key facility features..." />
                        </div>
                    </div>
                </div>
            </section>
            <section className="form-section">
                <div className="form-section-header"><h3 className="form-section-title">Supporting Facilities</h3></div>
                <div className="form-section-body">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                        {SUPPORTING_OPTIONS.map(opt => (
                            <div key={opt} onClick={() => toggle('selectedSupporting', opt)} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', borderRadius: '10px', cursor: 'pointer', border: form.selectedSupporting.includes(opt) ? '1.5px solid var(--accent)' : '1px solid rgba(184,184,184,.2)', background: form.selectedSupporting.includes(opt) ? 'rgba(139,69,19,.04)' : 'transparent' }}>
                                <div style={{ width: 18, height: 18, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', border: form.selectedSupporting.includes(opt) ? 'none' : '1.5px solid #ccc', background: form.selectedSupporting.includes(opt) ? 'var(--accent)' : 'transparent' }}>
                                    {form.selectedSupporting.includes(opt) && <Check size={10} color="#fff" strokeWidth={3} />}
                                </div>
                                <span style={{ fontSize: 13 }}>{opt}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            <section className="form-section">
                <div className="form-section-header"><h3 className="form-section-title">Thermal & Sauna Facilities</h3></div>
                <div className="form-section-body">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                        {THERMAL_OPTIONS.map(opt => (
                            <div key={opt} onClick={() => toggle('selectedThermal', opt)} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', borderRadius: '10px', cursor: 'pointer', border: form.selectedThermal.includes(opt) ? '1.5px solid var(--accent)' : '1px solid rgba(184,184,184,.2)', background: form.selectedThermal.includes(opt) ? 'rgba(139,69,19,.04)' : 'transparent' }}>
                                <div style={{ width: 18, height: 18, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', border: form.selectedThermal.includes(opt) ? 'none' : '1.5px solid #ccc', background: form.selectedThermal.includes(opt) ? 'var(--accent)' : 'transparent' }}>
                                    {form.selectedThermal.includes(opt) && <Check size={10} color="#fff" strokeWidth={3} />}
                                </div>
                                <span style={{ fontSize: 13 }}>{opt}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            <section className="form-section">
                <div className="form-section-header"><h3 className="form-section-title">Accessibility</h3></div>
                <div className="form-section-body">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                        {ACCESS_OPTIONS.map(opt => (
                            <div key={opt} onClick={() => toggle('selectedAccess', opt)} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', borderRadius: '10px', cursor: 'pointer', border: form.selectedAccess.includes(opt) ? '1.5px solid var(--accent)' : '1px solid rgba(184,184,184,.2)', background: form.selectedAccess.includes(opt) ? 'rgba(139,69,19,.04)' : 'transparent' }}>
                                <div style={{ width: 18, height: 18, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', border: form.selectedAccess.includes(opt) ? 'none' : '1.5px solid #ccc', background: form.selectedAccess.includes(opt) ? 'var(--accent)' : 'transparent' }}>
                                    {form.selectedAccess.includes(opt) && <Check size={10} color="#fff" strokeWidth={3} />}
                                </div>
                                <span style={{ fontSize: 13 }}>{opt}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );

    const renderPricing = () => (
        <>
            <section className="form-section">
                <div className="form-section-header"><h3 className="form-section-title">Pricing Configuration</h3></div>
                <div className="form-section-body">
                    <div className="form-grid">
                        <div className="form-group">
                            <label className="form-label">Starting Price ($)</label>
                            <input type="number" className="form-input" value={form.startingPrice || ''} onChange={e => u('startingPrice', parseFloat(e.target.value) || 0)} placeholder="0.00" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Currency</label>
                            <select className="form-input form-select" value={form.currency} onChange={e => u('currency', e.target.value)}>
                                <option>AUD</option><option>NZD</option><option>USD</option>
                            </select>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );

    const renderMedia = () => (
        <>
            <section className="form-section">
                <div className="form-section-header"><h3 className="form-section-title">Hero & Experience Images</h3></div>
                <div className="form-section-body">
                    <div className="form-grid">
                        <div className="form-group">
                            <label className="form-label">Hero Image</label>
                            <div className="crm-image-upload" onClick={() => heroInputRef.current?.click()}>
                                {form.heroImage ? (
                                    <img src={form.heroImage} alt="Hero" className="crm-image-preview" />
                                ) : (
                                    <div className="crm-upload-placeholder"><Upload size={24} /><span>Click to upload</span></div>
                                )}
                            </div>
                            <input ref={heroInputRef} type="file" accept="image/*" hidden onChange={e => handleImageUpload('heroImage', e)} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Experience Image</label>
                            <div className="crm-image-upload" onClick={() => expInputRef.current?.click()}>
                                {form.experienceImage ? (
                                    <img src={form.experienceImage} alt="Experience" className="crm-image-preview" />
                                ) : (
                                    <div className="crm-upload-placeholder"><Upload size={24} /><span>Click to upload</span></div>
                                )}
                            </div>
                            <input ref={expInputRef} type="file" accept="image/*" hidden onChange={e => handleImageUpload('experienceImage', e)} />
                        </div>
                    </div>
                </div>
            </section>
            <section className="form-section">
                <div className="form-section-header"><h3 className="form-section-title">Venue Gallery</h3></div>
                <div className="form-section-body">
                    <div className="crm-gallery-grid">
                        {form.venueImages.map((img, i) => (
                            <div key={i} className="crm-gallery-item">
                                <img src={img} alt={`Gallery ${i + 1}`} />
                                <button className="crm-gallery-remove" onClick={() => removeGalleryImage(i)}><Trash2 size={14} /></button>
                            </div>
                        ))}
                        <div className="crm-gallery-add" onClick={() => galleryInputRef.current?.click()}>
                            <Plus size={24} /><span>Add Images</span>
                        </div>
                    </div>
                    <input ref={galleryInputRef} type="file" accept="image/*" multiple hidden onChange={handleGalleryUpload} />
                </div>
            </section>
        </>
    );

    const renderOwner = () => (
        <>
            <section className="form-section">
                <div className="form-section-header"><h3 className="form-section-title">Owner / Manager Details</h3></div>
                <div className="form-section-body">
                    <div className="form-grid">
                        <div className="form-group">
                            <label className="form-label">Owner Name</label>
                            <input type="text" className="form-input" value={form.ownerName} onChange={e => u('ownerName', e.target.value)} placeholder="Full name" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Email</label>
                            <input type="email" className="form-input" value={form.ownerEmail} onChange={e => u('ownerEmail', e.target.value)} placeholder="owner@example.com" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Phone</label>
                            <input type="tel" className="form-input" value={form.ownerPhone} onChange={e => u('ownerPhone', e.target.value)} placeholder="+61 ..." />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Manager Name</label>
                            <input type="text" className="form-input" value={form.managerName} onChange={e => u('managerName', e.target.value)} placeholder="Full name" />
                        </div>
                    </div>
                </div>
            </section>
        </>
    );

    const renderTabContent = () => {
        switch (activeTab) {
            case 'overview': return renderOverview();
            case 'amenities': return renderAmenities();
            case 'services': return renderServices();
            case 'facilities': return renderFacilities();
            case 'pricing': return renderPricing();
            case 'media': return renderMedia();
            case 'owner': return renderOwner();
            default: return renderOverview();
        }
    };

    return (
        <div className="crm-overlay" onClick={onClose}>
            <div className="crm-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '980px' }}>
                {/* Header */}
                <div className="crm-header">
                    <div>
                        <h2 className="crm-title">Create Wellness Venue</h2>
                        <p className="crm-subtitle">Add a new wellness venue to the platform</p>
                    </div>
                    <button className="crm-close" onClick={onClose}><X size={20} /></button>
                </div>

                {/* Tab Navigation */}
                <nav className="wvd-tabs" style={{ padding: '0 28px', borderBottom: '1px solid rgba(184,184,184,.15)' }}>
                    {MODAL_TABS.map(tab => (
                        <button
                            key={tab.id}
                            className={`wvd-tab${activeTab === tab.id ? ' active' : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>

                {/* Body */}
                <div className="crm-body">
                    {renderTabContent()}
                </div>

                {/* Footer */}
                <div className="crm-footer">
                    <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
                    <button className="btn btn-primary" onClick={handleSubmit} disabled={saving}>
                        {saving ? 'Creating...' : 'Create Wellness Venue'}
                    </button>
                </div>
            </div>
        </div>
    );
}
