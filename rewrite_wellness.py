import re

content = """import { useState, useRef } from 'react';
import { X, ChevronDown, ChevronUp, Upload, Plus, Trash2 } from 'lucide-react';
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
    'Free Parking', 'Showers', 'Robes & Slippers', 'Lockers',
    'Herbal Tea', 'WiFi', 'Wheelchair Access', 'Pool'
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

export default function CreateWellnessModal({ isOpen, onClose, onSubmit }: CreateWellnessModalProps) {
    const [saving, setSaving] = useState(false);
    const heroInputRef = useRef<HTMLInputElement>(null);
    const expInputRef = useRef<HTMLInputElement>(null);
    const galleryInputRef = useRef<HTMLInputElement>(null);

    const [heroFile, setHeroFile] = useState<File | null>(null);
    const [expFile, setExpFile] = useState<File | null>(null);
    const [galleryFiles, setGalleryFiles] = useState<File[]>([]);

    const [form, setForm] = useState({
        // Overview — Basic
        venueName: '', wellnessVenueTypes: [] as string[], wellnessCategories: [] as string[],
        description: '', shortDescription: '',
        
        // Editorial
        heroQuote: '', introductionText: '',
        
        // Details
        treatmentRooms: 0, couplesSuites: 0, totalPractitioners: 0,
        floorArea: 0, yearEstablished: '', maxConcurrentClients: 0,
        
        // Experience
        experienceTitle: '', experienceSubtitle: '', experienceDescription: '',
        signatureTreatments: [] as string[], bestFor: [] as string[],
        
        // Amenities & Facilities
        websiteAmenities: [] as string[],
        facilitySpace: 0, facilityPhilosophy: '', facilityHighlights: '',
        selectedSupporting: [] as string[], selectedThermal: [] as string[],
        selectedAccess: [] as string[],

        // Services & Pricing
        serviceDescription: '', priceRange: '',
        startingPrice: 0, currency: 'AUD',
        packagePricing: false, membershipOptions: false, 
        appointmentRequired: true, onlineBookingAvailable: false,

        // Location
        streetAddress: '', suiteLevel: '', suburb: '', postcode: '',
        stateProvince: '', country: 'Australia', locationType: [] as string[],
        gpsLat: '', gpsLng: '', nearestTransport: '', parkingAccess: [] as string[],
        holidayNote: '', afterHoursAvailable: false,
        
        // Images
        heroImage: '', experienceImage: '', venueImages: [] as string[],

        // Admin & Status
        listingStatus: true, propertyStatus: 'Operational',
        subscriptionLevel: 'Essentials', sanctumVetted: false,
        featuredListing: false, onlineBooking: false,

        // Owner/Manager
        ownerName: '', ownerEmail: '', ownerPhone: '', managerName: '',
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

    const handleImageUpload = (field: 'heroImage' | 'experienceImage', e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (field === 'heroImage') setHeroFile(file);
        else setExpFile(file);
        updateField(field, URL.createObjectURL(file));
    };

    const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;
        const newFiles = Array.from(files);
        const urls = newFiles.map(f => URL.createObjectURL(f));
        setGalleryFiles(prev => [...prev, ...newFiles]);
        updateField('venueImages', [...form.venueImages, ...urls]);
    };

    const removeGalleryImage = (index: number) => {
        setGalleryFiles(prev => prev.filter((_, i) => i !== index));
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
            // Reset
            setHeroFile(null);
            setExpFile(null);
            setGalleryFiles([]);
        } catch (err) {
            console.error('Failed to create wellness venue:', err);
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
                        <h2 className="crm-title">Create Wellness Venue</h2>
                        <p className="crm-subtitle">Add a new wellness venue to the platform</p>
                    </div>
                    <button className="crm-close" onClick={onClose}><X size={20} /></button>
                </div>

                {/* Body */}
                <div className="crm-body">
                    
                    {/* Basic Information */}
                    <CollapsibleSection title="Basic Information" subtitle="Name, types, and core details">
                        <div className="crm-grid-2">
                            <div className="crm-field">
                                <label>Venue Name *</label>
                                <input type="text" value={form.venueName} onChange={e => updateField('venueName', e.target.value)} placeholder="e.g. Bodhi Urban Spa" />
                            </div>
                            <div className="crm-field">
                                <label>Primary Venue Type</label>
                                <select value="Wellness" disabled>
                                    <option value="Wellness">Wellness Venue</option>
                                </select>
                            </div>
                        </div>

                        <div className="crm-field">
                            <label>Wellness Venue Type</label>
                            <div className="crm-chip-grid">
                                {WELLNESS_VENUE_TYPES.map(t => (
                                    <button key={t} type="button" className={`crm-chip ${form.wellnessVenueTypes.includes(t) ? 'active' : ''}`} onClick={() => toggleArrayItem('wellnessVenueTypes', t)}>
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="crm-field">
                            <label>Wellness Categories</label>
                            <div className="crm-chip-grid">
                                {WELLNESS_CATEGORIES.map(t => (
                                    <button key={t} type="button" className={`crm-chip ${form.wellnessCategories.includes(t) ? 'active' : ''}`} onClick={() => toggleArrayItem('wellnessCategories', t)}>
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="crm-field">
                            <label>Starting Price ($)</label>
                            <input type="number" value={form.startingPrice || ''} onChange={e => updateField('startingPrice', parseFloat(e.target.value) || 0)} placeholder="0.00" />
                        </div>
                    </CollapsibleSection>

                    {/* Images */}
                    <CollapsibleSection title="Images" subtitle="Hero, experience, and gallery images" defaultOpen={false}>
                        <div className="crm-grid-2">
                            <div className="crm-field">
                                <label>Hero Image</label>
                                <div className="crm-image-upload" onClick={() => heroInputRef.current?.click()}>
                                    {form.heroImage ? (
                                        <img src={form.heroImage} alt="Hero" className="crm-image-preview" />
                                    ) : (
                                        <div className="crm-upload-placeholder"><Upload size={24} /><span>Click to upload</span></div>
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
                                        <div className="crm-upload-placeholder"><Upload size={24} /><span>Click to upload</span></div>
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
                                    <Plus size={24} /><span>Add Images</span>
                                </div>
                            </div>
                            <input ref={galleryInputRef} type="file" accept="image/*" multiple hidden onChange={handleGalleryUpload} />
                        </div>
                    </CollapsibleSection>

                    {/* Content & Descriptions */}
                    <CollapsibleSection title="Content & Descriptions" subtitle="Editorial content and descriptions" defaultOpen={false}>
                        <div className="crm-field">
                            <label>Venue Description</label>
                            <textarea rows={4} value={form.description} onChange={e => updateField('description', e.target.value)} placeholder="Detailed venue description..." />
                        </div>
                        <div className="crm-field">
                            <label>Short Description</label>
                            <textarea rows={2} value={form.shortDescription} onChange={e => updateField('shortDescription', e.target.value)} placeholder="One-liner for cards..." />
                        </div>
                        <div className="crm-field">
                            <label>Hero Quote</label>
                            <input type="text" value={form.heroQuote} onChange={e => updateField('heroQuote', e.target.value)} placeholder="Compelling quote..." />
                        </div>
                        <div className="crm-field">
                            <label>Introduction Text</label>
                            <textarea rows={3} value={form.introductionText} onChange={e => updateField('introductionText', e.target.value)} placeholder="Introduction layout..." />
                        </div>
                    </CollapsibleSection>

                    {/* Venue Details */}
                    <CollapsibleSection title="Venue Details" subtitle="Size, rooms, and practitioners" defaultOpen={false}>
                        <div className="crm-grid-3">
                            <div className="crm-field">
                                <label>Treatment Rooms</label>
                                <input type="number" value={form.treatmentRooms || ''} onChange={e => updateField('treatmentRooms', parseInt(e.target.value) || 0)} />
                            </div>
                            <div className="crm-field">
                                <label>Couples Suites</label>
                                <input type="number" value={form.couplesSuites || ''} onChange={e => updateField('couplesSuites', parseInt(e.target.value) || 0)} />
                            </div>
                            <div className="crm-field">
                                <label>Total Practitioners</label>
                                <input type="number" value={form.totalPractitioners || ''} onChange={e => updateField('totalPractitioners', parseInt(e.target.value) || 0)} />
                            </div>
                            <div className="crm-field">
                                <label>Floor Area (sqm)</label>
                                <input type="number" value={form.floorArea || ''} onChange={e => updateField('floorArea', parseInt(e.target.value) || 0)} />
                            </div>
                            <div className="crm-field">
                                <label>Year Established</label>
                                <input type="text" value={form.yearEstablished} onChange={e => updateField('yearEstablished', e.target.value)} placeholder="e.g. 2018" />
                            </div>
                            <div className="crm-field">
                                <label>Max Clients</label>
                                <input type="number" value={form.maxConcurrentClients || ''} onChange={e => updateField('maxConcurrentClients', parseInt(e.target.value) || 0)} />
                            </div>
                        </div>
                    </CollapsibleSection>

                    {/* The Experience & Services */}
                    <CollapsibleSection title="The Experience & Services" subtitle="Titles, specialties, and service info" defaultOpen={false}>
                        <div className="crm-grid-2">
                            <div className="crm-field">
                                <label>Experience Title</label>
                                <input type="text" value={form.experienceTitle} onChange={e => updateField('experienceTitle', e.target.value)} />
                            </div>
                            <div className="crm-field">
                                <label>Experience Subtitle</label>
                                <input type="text" value={form.experienceSubtitle} onChange={e => updateField('experienceSubtitle', e.target.value)} />
                            </div>
                        </div>
                        <div className="crm-field">
                            <label>Experience Description</label>
                            <textarea rows={3} value={form.experienceDescription} onChange={e => updateField('experienceDescription', e.target.value)} />
                        </div>
                        <div className="crm-field">
                            <label>Services Overview Description</label>
                            <textarea rows={3} value={form.serviceDescription} onChange={e => updateField('serviceDescription', e.target.value)} />
                        </div>
                        <div className="crm-field">
                            <label>Signature Treatments</label>
                            <div className="crm-chip-grid">
                                {WELLNESS_CATEGORIES.map(t => (
                                    <button key={t} type="button" className={`crm-chip ${form.signatureTreatments.includes(t) ? 'active' : ''}`} onClick={() => toggleArrayItem('signatureTreatments', t)}>{t}</button>
                                ))}
                            </div>
                        </div>
                        <div className="crm-field">
                            <label>Best For</label>
                            <div className="crm-chip-grid">
                                {BEST_FOR_OPTIONS.map(t => (
                                    <button key={t} type="button" className={`crm-chip ${form.bestFor.includes(t) ? 'active' : ''}`} onClick={() => toggleArrayItem('bestFor', t)}>{t}</button>
                                ))}
                            </div>
                        </div>

                        <div className="crm-field" style={{ marginTop: 12 }}>
                            <label>&nbsp;</label>
                            <div className="crm-toggle-group">
                                <label className="crm-toggle">
                                    <input type="checkbox" checked={form.packagePricing} onChange={e => updateField('packagePricing', e.target.checked)} />
                                    <span>Package Pricing Available</span>
                                </label>
                                <label className="crm-toggle">
                                    <input type="checkbox" checked={form.membershipOptions} onChange={e => updateField('membershipOptions', e.target.checked)} />
                                    <span>Membership Options</span>
                                </label>
                                <label className="crm-toggle">
                                    <input type="checkbox" checked={form.appointmentRequired} onChange={e => updateField('appointmentRequired', e.target.checked)} />
                                    <span>Appointment Required</span>
                                </label>
                            </div>
                        </div>
                    </CollapsibleSection>

                    {/* Facilities & Amenities */}
                    <CollapsibleSection title="Facilities & Amenities" subtitle="Supporting and thermal facilities" defaultOpen={false}>
                        <div className="crm-field">
                            <label>Facility Highlights</label>
                            <textarea rows={2} value={form.facilityHighlights} onChange={e => updateField('facilityHighlights', e.target.value)} />
                        </div>
                        <div className="crm-field">
                            <label>Supporting Facilities</label>
                            <div className="crm-chip-grid">
                                {SUPPORTING_OPTIONS.map(t => (
                                    <button key={t} type="button" className={`crm-chip ${form.selectedSupporting.includes(t) ? 'active' : ''}`} onClick={() => toggleArrayItem('selectedSupporting', t)}>{t}</button>
                                ))}
                            </div>
                        </div>
                        <div className="crm-field">
                            <label>Thermal & Sauna Facilities</label>
                            <div className="crm-chip-grid">
                                {THERMAL_OPTIONS.map(t => (
                                    <button key={t} type="button" className={`crm-chip ${form.selectedThermal.includes(t) ? 'active' : ''}`} onClick={() => toggleArrayItem('selectedThermal', t)}>{t}</button>
                                ))}
                            </div>
                        </div>
                        <div className="crm-field">
                            <label>Accessibility</label>
                            <div className="crm-chip-grid">
                                {ACCESS_OPTIONS.map(t => (
                                    <button key={t} type="button" className={`crm-chip ${form.selectedAccess.includes(t) ? 'active' : ''}`} onClick={() => toggleArrayItem('selectedAccess', t)}>{t}</button>
                                ))}
                            </div>
                        </div>
                        <div className="crm-field">
                            <label>Website Amenities</label>
                            <div className="crm-chip-grid">
                                {WEBSITE_AMENITIES.map(t => (
                                    <button key={t} type="button" className={`crm-chip ${form.websiteAmenities.includes(t) ? 'active' : ''}`} onClick={() => toggleArrayItem('websiteAmenities', t)}>{t}</button>
                                ))}
                            </div>
                        </div>
                    </CollapsibleSection>

                    {/* Location Details */}
                    <CollapsibleSection title="Location Details" subtitle="Address, GPS, and transport" defaultOpen={false}>
                        <div className="crm-field">
                            <label>Street Address</label>
                            <input type="text" value={form.streetAddress} onChange={e => updateField('streetAddress', e.target.value)} />
                        </div>
                        <div className="crm-grid-2">
                            <div className="crm-field">
                                <label>City / Suburb</label>
                                <input type="text" value={form.suburb} onChange={e => updateField('suburb', e.target.value)} />
                            </div>
                            <div className="crm-field">
                                <label>Postal Code</label>
                                <input type="text" value={form.postcode} onChange={e => updateField('postcode', e.target.value)} />
                            </div>
                        </div>
                        <div className="crm-grid-2">
                            <div className="crm-field">
                                <label>State / Province</label>
                                <select value={form.stateProvince} onChange={e => updateField('stateProvince', e.target.value)}>
                                    <option value="">Select...</option>
                                    {AUSTRALIAN_STATES.map(s => <option key={s}>{s}</option>)}
                                </select>
                            </div>
                            <div className="crm-field">
                                <label>Country</label>
                                <select value={form.country} onChange={e => updateField('country', e.target.value)}>
                                    <option>Australia</option><option>New Zealand</option><option>Japan</option>
                                </select>
                            </div>
                        </div>
                        <div className="crm-grid-2">
                            <div className="crm-field">
                                <label>GPS Latitude</label>
                                <input type="text" value={form.gpsLat} onChange={e => updateField('gpsLat', e.target.value)} />
                            </div>
                            <div className="crm-field">
                                <label>GPS Longitude</label>
                                <input type="text" value={form.gpsLng} onChange={e => updateField('gpsLng', e.target.value)} />
                            </div>
                        </div>
                        <div className="crm-field">
                            <label>Location Type</label>
                            <div className="crm-chip-grid">
                                {LOCATION_TYPES.map(t => (
                                    <button key={t} type="button" className={`crm-chip small ${form.locationType.includes(t) ? 'active' : ''}`} onClick={() => toggleArrayItem('locationType', t)}>{t}</button>
                                ))}
                            </div>
                        </div>
                        <div className="crm-field">
                            <label>Parking & Access</label>
                            <div className="crm-chip-grid">
                                {TRANSPORT_OPTIONS.map(t => (
                                    <button key={t} type="button" className={`crm-chip small ${form.parkingAccess.includes(t) ? 'active' : ''}`} onClick={() => toggleArrayItem('parkingAccess', t)}>{t}</button>
                                ))}
                            </div>
                        </div>
                    </CollapsibleSection>

                    {/* Status & Owner Details */}
                    <CollapsibleSection title="Status & Listing" subtitle="Visibility, admin flags, and owner" defaultOpen={false}>
                        <div className="crm-grid-2">
                            <div className="crm-field">
                                <label>Subscription Level</label>
                                <select value={form.subscriptionLevel} onChange={e => updateField('subscriptionLevel', e.target.value)}>
                                    {SUBSCRIPTION_LEVELS.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                            <div className="crm-field">
                                <label>Business Status</label>
                                <select value={form.propertyStatus} onChange={e => updateField('propertyStatus', e.target.value)}>
                                    <option>Operational</option><option>Temporarily Closed</option><option>Under Renovation</option><option>Seasonal</option>
                                </select>
                            </div>
                        </div>
                        
                        <div className="crm-toggle-group" style={{ marginTop: 12, marginBottom: 20 }}>
                            <label className="crm-toggle">
                                <input type="checkbox" checked={form.listingStatus} onChange={e => updateField('listingStatus', e.target.checked)} />
                                <span>Active Listing</span>
                            </label>
                            <label className="crm-toggle">
                                <input type="checkbox" checked={form.featuredListing} onChange={e => updateField('featuredListing', e.target.checked)} />
                                <span>Featured Listing</span>
                            </label>
                            <label className="crm-toggle">
                                <input type="checkbox" checked={form.sanctumVetted} onChange={e => updateField('sanctumVetted', e.target.checked)} />
                                <span>Sanctum Vetted</span>
                            </label>
                            <label className="crm-toggle">
                                <input type="checkbox" checked={form.onlineBooking} onChange={e => updateField('onlineBooking', e.target.checked)} />
                                <span>Online Booking Activated</span>
                            </label>
                        </div>

                        <div className="crm-field">
                            <label>Owner Details</label>
                            <div className="crm-grid-2">
                                <input type="text" value={form.ownerName} onChange={e => updateField('ownerName', e.target.value)} placeholder="Owner Name" />
                                <input type="email" value={form.ownerEmail} onChange={e => updateField('ownerEmail', e.target.value)} placeholder="Owner Email" />
                                <input type="tel" value={form.ownerPhone} onChange={e => updateField('ownerPhone', e.target.value)} placeholder="Owner Phone" />
                                <input type="text" value={form.managerName} onChange={e => updateField('managerName', e.target.value)} placeholder="Manager Name" />
                            </div>
                        </div>
                    </CollapsibleSection>

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
"""

with open('/Users/macbookpro/newAdminTGS/src/components/CreateWellnessModal.tsx', 'w') as f:
    f.write(content)
