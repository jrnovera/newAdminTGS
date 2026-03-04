import { useState, useRef, useEffect } from 'react';
import { Plus, Edit2, GripVertical, X, Upload } from 'lucide-react';
import type { Venue } from '../../context/VenueContext';

interface Props {
    venue: Venue;
    onUpdate: (updates: Partial<Venue>) => void;
}

interface Service {
    id: string;
    name: string;
    displayName: string;
    category: string;
    type: string;
    primaryCategory: string;
    duration: string;
    price: string;
    description: string;
    tags: string[];
    isFeatured: boolean;
    isPopular: boolean;
    isNew: boolean;
    showOnWebsite: boolean;
}

interface Category {
    id: string;
    name: string;
    serviceCount: number;
    show: boolean;
}

export default function WellnessServicesTab({ venue, onUpdate }: Props) {
    // Summary Stats
    const [stats, _setStats] = useState({
        totalServices: 24,
        practitioners: 8,
        categories: 6,
        fromPrice: 85,
        onlineBooking: true
    });

    // Featured Selection
    const [featuredSelection, setFeaturedSelection] = useState([
        { id: '1', name: 'Signature Massage', duration: '60 min', price: '$129' },
        { id: '2', name: 'Thermal Circuit', duration: '2 hours', price: '$89' },
        { id: '3', name: 'Hydrating Facial', duration: '75 min', price: '$159' }
    ]);

    // Tab Header
    const [headerLabel, setHeaderLabel] = useState('Experiences & Treatments');
    const [headerSubtitle, setHeaderSubtitle] = useState('Restore, rejuvenate, reconnect');

    // Categories
    const [categories, setCategories] = useState<Category[]>([
        { id: '1', name: 'Massage', serviceCount: 4, show: true },
        { id: '2', name: 'Thermal & Water', serviceCount: 3, show: true },
        { id: '3', name: 'Facials', serviceCount: 2, show: true },
        { id: '4', name: 'Body Treatments', serviceCount: 1, show: true }
    ]);

    // Tags
    const [offeringTags, setOfferingTags] = useState<string[]>(venue.offeringTags?.length ? venue.offeringTags : ['Massage', 'Facials', 'Aromatherapy', 'Body Treatments', 'Reflexology', 'Infrared Sauna']);
    const [massageTags, setMassageTags] = useState(['Swedish', 'Deep Tissue', 'Hot Stone', 'Aromatherapy', 'Pregnancy', 'Reflexology']);
    const [programTags, setProgramTags] = useState(['Stress Management', 'Detox Program', 'Anti-Aging']);
    const [staffLanguages, setStaffLanguages] = useState<string[]>(venue.languages?.length ? venue.languages : ['English', 'Mandarin', 'Japanese']);
    const [dietaryTags, setDietaryTags] = useState<string[]>(venue.dietaryTags?.length ? venue.dietaryTags : ['Vegan', 'Gluten-Free', 'Dairy-Free']);
    const [mealPlanTags, setMealPlanTags] = useState(['Light Refreshments', 'Herbal Teas']);
    const [durationTags, setDurationTags] = useState(['30min', '45min', '60min', '90min', '2hr', 'Half Day']);

    // Descriptions
    const [serviceDescription, setServiceDescription] = useState(venue.serviceDescription || 'Bodhi Day Spa offers a comprehensive menu of therapeutic treatments designed to restore balance and wellbeing. Our expert therapists combine traditional techniques with modern wellness practices, using premium organic Australian-made products. From signature massages and rejuvenating facials to indulgent body rituals, each experience is tailored to your individual needs. Our infrared sauna and relaxation lounge complement treatments for a complete wellness journey.');
    const [practitionerSpecialties, setPractitionerSpecialties] = useState(venue.practitionerSpecialties || 'Our team includes certified massage therapists specializing in remedial and relaxation techniques, qualified beauty therapists with advanced facial training, and experienced body treatment specialists. Senior therapists hold diplomas in remedial massage and aromatherapy. All staff maintain current first aid certification and ongoing professional development.');
    const [membershipDetails, setMembershipDetails] = useState(venue.membershipDetails || 'Monthly membership options include: Essential ($150/month - 1x 60min massage), Premium ($280/month - 2x 60min treatments), and VIP ($450/month - 4x treatments + 10% retail discount). All memberships include priority booking and complimentary infrared sauna access.');

    // Booking Config
    const [priceRange, setPriceRange] = useState('$85 - $350');
    const [packagePricing, setPackagePricing] = useState(venue.packagePricing ?? true);
    const [membershipOptions, setMembershipOptions] = useState(venue.membershipOptions ?? true);
    const [dropInWelcome, setDropInWelcome] = useState(venue.dropInWelcome ?? false);
    const [appointmentRequired, setAppointmentRequired] = useState(venue.appointmentRequired ?? true);
    const [onlineBookingAvailable, setOnlineBookingAvailable] = useState(venue.instantBooking ?? true);
    const [onsiteNutritionist, setOnsiteNutritionist] = useState(venue.onsiteNutritionist ?? false);

    // Individual Services
    const [services, setServices] = useState<Service[]>([
        {
            id: '1',
            name: 'Signature Bodhi Massage',
            displayName: 'Signature Relaxation Massage',
            category: 'Massage',
            type: 'Single Treatment',
            primaryCategory: 'Massage Bodywork',
            duration: '60 / 90 min',
            price: '$140 / $195',
            description: 'Our signature full-body massage combining Swedish and deep tissue techniques with native Australian essential oils. Customized pressure and focus areas.',
            tags: ['Relaxation', 'Stress Relief', 'Muscle Tension'],
            isFeatured: true,
            isPopular: false,
            isNew: false,
            showOnWebsite: true
        },
        {
            id: '2',
            name: 'Hot Stone Therapy',
            displayName: 'Hot Stone Therapy',
            category: 'Massage',
            type: 'Single Treatment',
            primaryCategory: 'Massage Bodywork',
            duration: '75 min',
            price: '$175',
            description: 'Heated basalt stones glide across tension points, melting away stress while penetrating warmth relaxes deep muscle layers.',
            tags: ['Relaxation', 'Circulation', 'Pain Relief'],
            isFeatured: false,
            isPopular: true,
            isNew: false,
            showOnWebsite: true
        },
        {
            id: '3',
            name: 'Hydrating Facial',
            displayName: 'Hydrating Facial',
            category: 'Facials',
            type: 'Single Treatment',
            primaryCategory: 'Beauty Wellness',
            duration: '60 min',
            price: '$145',
            description: 'Deep hydration facial using organic Australian botanicals. Includes cleanse, exfoliation, mask, and facial massage.',
            tags: ['Skin Health', 'Anti-Aging', 'Relaxation'],
            isFeatured: false,
            isPopular: false,
            isNew: false,
            showOnWebsite: true
        },
        {
            id: '4',
            name: 'Half-Day Retreat Package',
            displayName: 'Half-Day Retreat Package',
            category: 'Wellness Programs',
            type: 'Half-Day Experience',
            primaryCategory: 'Wellness Programs',
            duration: '4 hours',
            price: '$350',
            description: 'Complete wellness escape including 60min massage, facial, infrared sauna session, and relaxation lounge access with herbal tea service.',
            tags: ['Relaxation', 'Detoxification', 'Stress Relief', 'Skin Health'],
            isFeatured: false,
            isPopular: false,
            isNew: true,
            showOnWebsite: true
        }
    ]);

    // Batch-save all service fields whenever any state changes
    const isMount = useRef(true);
    useEffect(() => {
        if (isMount.current) { isMount.current = false; return; }
        onUpdate({
            serviceDescription,
            practitionerSpecialties,
            membershipDetails,
            packagePricing,
            membershipOptions,
            dropInWelcome,
            appointmentRequired,
            instantBooking: onlineBookingAvailable,
            onsiteNutritionist,
            offeringTags,
            dietaryTags,
            languages: staffLanguages,
            services: services.map(s => ({ name: s.name, price: s.price, duration: s.duration })),
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [serviceDescription, practitionerSpecialties, membershipDetails, packagePricing,
        membershipOptions, dropInWelcome, appointmentRequired, onlineBookingAvailable,
        onsiteNutritionist, offeringTags, dietaryTags, staffLanguages, services]);

    const toggleTag = (tags: string[], setTags: (t: string[]) => void, tag: string) => {
        if (tags.includes(tag)) {
            setTags(tags.filter(t => t !== tag));
        } else {
            setTags([...tags, tag]);
        }
    };

    const removeTag = (tags: string[], setTags: (t: string[]) => void, tag: string) => {
        setTags(tags.filter(t => t !== tag));
    };

    const toggleCategory = (id: string) => {
        setCategories(prev => prev.map(c => c.id === id ? { ...c, show: !c.show } : c));
    };

    const toggleServiceWebsite = (id: string) => {
        setServices(prev => prev.map(s => s.id === id ? { ...s, showOnWebsite: !s.showOnWebsite } : s));
    };

    return (
        <div className="wvd-content">
            {/* Services Summary Stats */}
            <div className="wa-summary-stats">
                <div className="wa-summary-stat">
                    <div className="wa-summary-value">{stats.totalServices}</div>
                    <div className="wa-summary-label">Total Services</div>
                </div>
                <div className="wa-summary-stat">
                    <div className="wa-summary-value">{stats.practitioners}</div>
                    <div className="wa-summary-label">Practitioners</div>
                </div>
                <div className="wa-summary-stat">
                    <div className="wa-summary-value">{stats.categories}</div>
                    <div className="wa-summary-label">Service Categories</div>
                </div>
                <div className="wa-summary-stat">
                    <div className="wa-summary-value">${stats.fromPrice}</div>
                    <div className="wa-summary-label">From Price</div>
                </div>
                <div className="wa-summary-stat">
                    <div className="wa-summary-value">{stats.onlineBooking ? 'Yes' : 'No'}</div>
                    <div className="wa-summary-label">Online Booking</div>
                </div>
            </div>

            {/* Featured Experiences */}
            <section className="wvd-form-section">
                <div className="wvd-form-section-header">
                    <div>
                        <h3 className="wvd-form-section-title">Featured Experiences</h3>
                        <p className="wvd-form-hint">Select up to 3 services to feature on your Overview tab with images</p>
                    </div>
                    <span style={{ fontSize: 12, color: 'var(--success)', fontWeight: 500 }}>
                        {featuredSelection.length} featured
                    </span>
                </div>
                <div className="wvd-form-section-body">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                        {featuredSelection.map((item, idx) => (
                            <div key={idx} className="ws-featured-card">
                                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                    <div className="ws-featured-upload-box">
                                        <Upload size={16} strokeWidth={1.5} color="#B8B8B8" />
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <select
                                            className="wvd-form-input wvd-form-select"
                                            style={{ fontSize: '11px', padding: '6px 8px', marginBottom: '4px' }}
                                            value={item.id}
                                            onChange={e => {
                                                const s = services.find(sv => sv.id === e.target.value);
                                                if (s) {
                                                    const newSelection = [...featuredSelection];
                                                    newSelection[idx] = { id: s.id, name: s.name, duration: s.duration, price: s.price.split(' ')[0] };
                                                    setFeaturedSelection(newSelection);
                                                }
                                            }}
                                        >
                                            {services.map(s => (
                                                <option key={s.id} value={s.id}>{s.name}</option>
                                            ))}
                                        </select>
                                        <div style={{ fontSize: '10px', color: 'var(--accent)' }}>{item.duration} — {item.price}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <p className="wvd-form-hint" style={{ fontSize: '11px', fontStyle: 'italic', marginTop: '12px' }}>
                        Featured experiences appear as cards on your Overview tab. Add services in the Individual Services section below first.
                    </p>
                </div>
            </section>

            {/* Services Tab Header */}
            <section className="wvd-form-section">
                <div className="wvd-form-section-header">
                    <div>
                        <h3 className="wvd-form-section-title">Services Tab Header</h3>
                        <p className="wvd-form-hint">Header content for the Services tab on your public listing</p>
                    </div>
                </div>
                <div className="wvd-form-section-body">
                    <div className="wvd-form-grid">
                        <div className="wvd-form-group">
                            <label className="wvd-form-label">Section Label</label>
                            <input
                                type="text"
                                className="wvd-form-input"
                                value={headerLabel}
                                onChange={e => setHeaderLabel(e.target.value)}
                                placeholder="e.g. Experiences & Treatments, Our Services"
                            />
                        </div>
                        <div className="wvd-form-group">
                            <label className="wvd-form-label">Section Subtitle</label>
                            <input
                                type="text"
                                className="wvd-form-input"
                                value={headerSubtitle}
                                onChange={e => setHeaderSubtitle(e.target.value)}
                                placeholder="e.g. Restore, rejuvenate, reconnect"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Service Categories */}
            <section className="wvd-form-section">
                <div className="wvd-form-section-header">
                    <div>
                        <h3 className="wvd-form-section-title">Service Categories</h3>
                        <p className="wvd-form-hint">Organize services into categories for your public listing. Drag to reorder.</p>
                    </div>
                    <button className="wvd-btn-secondary wvd-btn-small">
                        <Plus size={14} />
                        Add Category
                    </button>
                </div>
                <div className="wvd-form-section-body">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {categories.map((cat, idx) => (
                            <div key={cat.id} className="ws-category-item">
                                <div style={{ cursor: 'grab', color: 'var(--accent)' }}>
                                    <GripVertical size={16} />
                                </div>
                                <span className="ws-category-number">{idx + 1}</span>
                                <input
                                    type="text"
                                    className="wvd-form-input"
                                    style={{ flex: 1, padding: '8px 12px' }}
                                    value={cat.name}
                                    onChange={e => {
                                        const newCats = [...categories];
                                        newCats[idx].name = e.target.value;
                                        setCategories(newCats);
                                    }}
                                />
                                <span style={{ fontSize: '12px', color: 'var(--accent)' }}>{cat.serviceCount} services</span>
                                <div className="wvd-toggle-container">
                                    <div
                                        className={`wvd-toggle ${cat.show ? 'active' : ''}`}
                                        onClick={() => toggleCategory(cat.id)}
                                        style={{ width: '36px', height: '20px' }}
                                    >
                                        <div className="wvd-toggle-knob" style={{ width: '16px', height: '16px' }}></div>
                                    </div>
                                    <span className="wvd-toggle-label" style={{ fontSize: '11px' }}>Show</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Treatment & Technology Tags */}
            <section className="wvd-form-section">
                <div className="wvd-form-section-header">
                    <h3 className="wvd-form-section-title">Treatment & Technology Tags</h3>
                </div>
                <div className="wvd-form-section-body">
                    <div className="wvd-form-group">
                        <label className="wvd-form-label">Service Offerings</label>
                        <div className="wa-tag-container">
                            {offeringTags.map(tag => (
                                <span key={tag} className="wa-tag">
                                    {tag}
                                    <X size={12} className="wa-tag-remove" onClick={() => removeTag(offeringTags, setOfferingTags, tag)} />
                                </span>
                            ))}
                            <button
                                className="wa-tag-add"
                                onClick={() => {
                                    const tag = prompt('Enter new tag:');
                                    if (tag) toggleTag(offeringTags, setOfferingTags, tag);
                                }}
                            >
                                <Plus size={10} /> Add
                            </button>
                        </div>
                    </div>
                    <div className="wvd-form-grid" style={{ marginTop: '20px' }}>
                        <div className="wvd-form-group">
                            <label className="wvd-form-label">Massage Types</label>
                            <div className="wa-tag-container">
                                {massageTags.map(tag => (
                                    <span key={tag} className="wa-tag">
                                        {tag}
                                        <X size={12} className="wa-tag-remove" onClick={() => removeTag(massageTags, setMassageTags, tag)} />
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className="wvd-form-group">
                            <label className="wvd-form-label">Wellness Programs Offered</label>
                            <div className="wa-tag-container">
                                {programTags.map(tag => (
                                    <span key={tag} className="wa-tag">
                                        {tag}
                                        <X size={12} className="wa-tag-remove" onClick={() => removeTag(programTags, setProgramTags, tag)} />
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="wvd-form-group wvd-full-width" style={{ marginTop: '20px' }}>
                        <label className="wvd-form-label">Wellness Services Detailed Description</label>
                        <textarea
                            className="wvd-form-input wvd-form-textarea"
                            value={serviceDescription}
                            onChange={e => setServiceDescription(e.target.value)}
                        />
                    </div>
                </div>
            </section>

            {/* Practitioners Section */}
            <section className="wvd-form-section">
                <div className="wvd-form-section-header">
                    <h3 className="wvd-form-section-title">Practitioners</h3>
                </div>
                <div className="wvd-form-section-body">
                    <div className="wvd-form-grid">
                        <div className="wvd-form-group">
                            <label className="wvd-form-label">Number of Practitioners</label>
                            <input
                                type="number"
                                className="wvd-form-input"
                                value={stats.practitioners}
                                readOnly
                            />
                        </div>
                        <div className="wvd-form-group">
                            <label className="wvd-form-label">Languages Spoken by Staff</label>
                            <div className="wa-tag-container">
                                {staffLanguages.map(tag => (
                                    <span key={tag} className="wa-tag">
                                        {tag}
                                        <X size={12} className="wa-tag-remove" onClick={() => removeTag(staffLanguages, setStaffLanguages, tag)} />
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className="wvd-form-group wvd-full-width">
                            <label className="wvd-form-label">Practitioner Specialties</label>
                            <textarea
                                className="wvd-form-input wvd-form-textarea"
                                style={{ minHeight: '80px' }}
                                value={practitionerSpecialties}
                                onChange={e => setPractitionerSpecialties(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Booking & Availability Section */}
            <section className="wvd-form-section">
                <div className="wvd-form-section-header">
                    <h3 className="wvd-form-section-title">Booking & Availability</h3>
                </div>
                <div className="wvd-form-section-body">
                    <div className="wvd-form-grid">
                        <div className="wvd-form-group">
                            <label className="wvd-form-label">Service Duration Options</label>
                            <div className="wa-tag-container">
                                {durationTags.map(tag => (
                                    <span key={tag} className="wa-tag">
                                        {tag}
                                        <X size={12} className="wa-tag-remove" onClick={() => removeTag(durationTags, setDurationTags, tag)} />
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className="wvd-form-group">
                            <label className="wvd-form-label">Price Range Per Session</label>
                            <input
                                type="text"
                                className="wvd-form-input"
                                value={priceRange}
                                onChange={e => setPriceRange(e.target.value)}
                            />
                        </div>
                        <div className="wvd-form-group">
                            <label className="wvd-form-label">Package Pricing Available</label>
                            <div className="wvd-toggle-container">
                                <div
                                    className={`wvd-toggle ${packagePricing ? 'active' : ''}`}
                                    onClick={() => setPackagePricing(!packagePricing)}
                                >
                                    <div className="wvd-toggle-knob"></div>
                                </div>
                                <span className="wvd-toggle-label">{packagePricing ? 'Yes' : 'No'}</span>
                            </div>
                        </div>
                        <div className="wvd-form-group">
                            <label className="wvd-form-label">Membership Options Available</label>
                            <div className="wvd-toggle-container">
                                <div
                                    className={`wvd-toggle ${membershipOptions ? 'active' : ''}`}
                                    onClick={() => setMembershipOptions(!membershipOptions)}
                                >
                                    <div className="wvd-toggle-knob"></div>
                                </div>
                                <span className="wvd-toggle-label">{membershipOptions ? 'Yes' : 'No'}</span>
                            </div>
                        </div>
                        <div className="wvd-form-group">
                            <label className="wvd-form-label">Drop-in Welcome</label>
                            <div className="wvd-toggle-container">
                                <div
                                    className={`wvd-toggle ${dropInWelcome ? 'active' : ''}`}
                                    onClick={() => setDropInWelcome(!dropInWelcome)}
                                >
                                    <div className="wvd-toggle-knob"></div>
                                </div>
                                <span className="wvd-toggle-label">{dropInWelcome ? 'Yes' : 'No - Appointment required'}</span>
                            </div>
                        </div>
                        <div className="wvd-form-group">
                            <label className="wvd-form-label">Appointment Required</label>
                            <div className="wvd-toggle-container">
                                <div
                                    className={`wvd-toggle ${appointmentRequired ? 'active' : ''}`}
                                    onClick={() => setAppointmentRequired(!appointmentRequired)}
                                >
                                    <div className="wvd-toggle-knob"></div>
                                </div>
                                <span className="wvd-toggle-label">{appointmentRequired ? 'Yes' : 'No'}</span>
                            </div>
                        </div>
                        <div className="wvd-form-group">
                            <label className="wvd-form-label">Online Booking Available</label>
                            <div className="wvd-toggle-container">
                                <div
                                    className={`wvd-toggle ${onlineBookingAvailable ? 'active' : ''}`}
                                    onClick={() => setOnlineBookingAvailable(!onlineBookingAvailable)}
                                >
                                    <div className="wvd-toggle-knob"></div>
                                </div>
                                <span className="wvd-toggle-label">{onlineBookingAvailable ? 'Yes - Via TGS & website' : 'No'}</span>
                            </div>
                        </div>
                        <div className="wvd-form-group">
                            <label className="wvd-form-label">On-site Nutritionist</label>
                            <div className="wvd-toggle-container">
                                <div
                                    className={`wvd-toggle ${onsiteNutritionist ? 'active' : ''}`}
                                    onClick={() => setOnsiteNutritionist(!onsiteNutritionist)}
                                >
                                    <div className="wvd-toggle-knob"></div>
                                </div>
                                <span className="wvd-toggle-label">{onsiteNutritionist ? 'Yes' : 'No'}</span>
                            </div>
                        </div>
                        <div className="wvd-form-group wvd-full-width">
                            <label className="wvd-form-label">Membership Details</label>
                            <textarea
                                className="wvd-form-input wvd-form-textarea"
                                style={{ minHeight: '80px' }}
                                value={membershipDetails}
                                onChange={e => setMembershipDetails(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Dietary & Nutrition */}
            <section className="wvd-form-section">
                <div className="wvd-form-section-header">
                    <h3 className="wvd-form-section-title">Dietary & Nutrition</h3>
                    <span style={{ fontSize: 12, color: 'var(--accent)' }}>For venues with food service</span>
                </div>
                <div className="wvd-form-section-body">
                    <div className="wvd-form-grid">
                        <div className="wvd-form-group">
                            <label className="wvd-form-label">Dietary Accommodations</label>
                            <div className="wa-tag-container">
                                {dietaryTags.map(tag => (
                                    <span key={tag} className="wa-tag">
                                        {tag}
                                        <X size={12} className="wa-tag-remove" onClick={() => removeTag(dietaryTags, setDietaryTags, tag)} />
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className="wvd-form-group">
                            <label className="wvd-form-label">Meal Plans Available</label>
                            <div className="wa-tag-container">
                                {mealPlanTags.map(tag => (
                                    <span key={tag} className="wa-tag">
                                        {tag}
                                        <X size={12} className="wa-tag-remove" onClick={() => removeTag(mealPlanTags, setMealPlanTags, tag)} />
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Individual Services List */}
            <section className="wvd-form-section">
                <div className="wvd-form-section-header">
                    <div>
                        <h3 className="wvd-form-section-title">Individual Services</h3>
                        <p className="wvd-form-hint">Service inventory with website display options</p>
                    </div>
                    <button className="wvd-btn-secondary wvd-btn-small">
                        <Plus size={14} />
                        Add Service
                    </button>
                </div>
                <div className="wvd-form-section-body">
                    <div className="ws-services-list">
                        {services.map(service => (
                            <div key={service.id} className="ws-service-card">
                                <div className="ws-service-card-header">
                                    <div className="ws-service-card-title">
                                        {service.isFeatured && <span className="ws-service-badge featured">Featured</span>}
                                        {service.isPopular && <span className="ws-service-badge popular">Popular</span>}
                                        {service.isNew && <span className="ws-service-badge new">New</span>}
                                        {service.name}
                                    </div>
                                    <div className="ws-service-card-actions">
                                        <div className="wvd-toggle-container" style={{ marginRight: '16px' }}>
                                            <div
                                                className={`wvd-toggle ${service.showOnWebsite ? 'active' : ''}`}
                                                onClick={() => toggleServiceWebsite(service.id)}
                                                style={{ width: '36px', height: '20px' }}
                                            >
                                                <div className="wvd-toggle-knob" style={{ width: '16px', height: '16px' }}></div>
                                            </div>
                                            <span className="wvd-toggle-label" style={{ fontSize: '11px' }}>Show on Website</span>
                                        </div>
                                        <button className="wvd-btn-secondary wvd-btn-small">
                                            <Edit2 size={12} /> Edit
                                        </button>
                                    </div>
                                </div>
                                <div className="ws-service-card-body">
                                    <div className="ws-service-website-fields">
                                        <div className="wvd-form-group" style={{ marginBottom: 0 }}>
                                            <label className="wvd-form-label" style={{ fontSize: '10px' }}>Website Display Name</label>
                                            <input
                                                type="text"
                                                className="wvd-form-input"
                                                style={{ padding: '6px 10px', fontSize: '12px' }}
                                                value={service.displayName}
                                                onChange={e => {
                                                    setServices(services.map(s => s.id === service.id ? { ...s, displayName: e.target.value } : s));
                                                }}
                                            />
                                        </div>
                                        <div className="wvd-form-group" style={{ marginBottom: 0 }}>
                                            <label className="wvd-form-label" style={{ fontSize: '10px' }}>Service Category</label>
                                            <select
                                                className="wvd-form-input wvd-form-select"
                                                style={{ padding: '6px 10px', fontSize: '12px' }}
                                                value={service.category}
                                                onChange={e => {
                                                    setServices(services.map(s => s.id === service.id ? { ...s, category: e.target.value } : s));
                                                }}
                                            >
                                                {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                                                <option value="Wellness Programs">Wellness Programs</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="ws-service-grid">
                                        <div className="ws-service-field">
                                            <div className="ws-service-label">Service Type</div>
                                            <div className="ws-service-value">{service.type}</div>
                                        </div>
                                        <div className="ws-service-field">
                                            <div className="ws-service-label">Primary Category</div>
                                            <div className="ws-service-value">{service.primaryCategory}</div>
                                        </div>
                                        <div className="ws-service-field">
                                            <div className="ws-service-label">Duration</div>
                                            <div className="ws-service-value">{service.duration}</div>
                                        </div>
                                        <div className="ws-service-field">
                                            <div className="ws-service-label">Price</div>
                                            <div className="ws-service-value">{service.price}</div>
                                        </div>
                                        <div className="ws-service-field" style={{ gridColumn: 'span 4' }}>
                                            <div className="ws-service-label">Description</div>
                                            <div className="ws-service-value">{service.description}</div>
                                        </div>
                                        <div className="ws-service-field" style={{ gridColumn: 'span 4' }}>
                                            <div className="ws-service-label">Treatment Tags</div>
                                            <div className="wa-tag-container" style={{ padding: 0, background: 'transparent' }}>
                                                {service.tags.map(tag => (
                                                    <span key={tag} className="wa-tag" style={{ border: 'none', background: '#fff' }}>{tag}</span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        <button className="ws-add-service-btn">
                            <Plus size={18} />
                            Add Another Service
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}
