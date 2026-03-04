import { useState, useRef, useEffect } from 'react';
import { Check, Upload, Plus } from 'lucide-react';
import type { Venue } from '../../context/VenueContext';

interface Props {
    venue: Venue;
    onUpdate: (updates: Partial<Venue>) => void;
}

interface FacilityItem {
    id: string;
    name: string;
    description: string;
    accessNote: string;
    showOnWebsite: boolean;
    image?: string;
}

export default function WellnessFacilitiesTab({ venue, onUpdate }: Props) {
    // Featured Facilities State
    const [featuredFacilities, setFeaturedFacilities] = useState<FacilityItem[]>([
        {
            id: '1',
            name: 'Thermal Suite',
            description: 'Finnish sauna, steam room, ice fountain, and heated relaxation pool.',
            accessNote: 'Included with Thermal Circuit booking',
            showOnWebsite: true
        },
        {
            id: '2',
            name: 'Float Pods',
            description: 'Two private sensory deprivation pods with shower facilities.',
            accessNote: 'By booking only',
            showOnWebsite: true
        },
        {
            id: '3',
            name: 'Relaxation Lounge',
            description: 'Quiet space with heated loungers, herbal tea station, and ambient music.',
            accessNote: 'Included with all treatments',
            showOnWebsite: true
        },
        {
            id: '4',
            name: 'Treatment Rooms',
            description: 'Six private treatment rooms including one couples suite.',
            accessNote: 'By booking only',
            showOnWebsite: true
        }
    ]);

    // Operational Data States
    const [facilitySpace, setFacilitySpace] = useState(venue.propertySizeValue ? Number(String(venue.propertySizeValue)) || 280 : 280);
    const [philosophy, setPhilosophy] = useState(venue.facilityPhilosophy || 'Urban sanctuary combining modern wellness with traditional techniques');
    const [highlights, setHighlights] = useState(venue.facilityHighlights || 'Five private treatment rooms including one couples suite, infrared sauna, relaxation lounge with herbal tea service, and premium changing facilities with lockers and showers.');

    // Treatment Rooms
    const [totalTreatmentRooms, setTotalTreatmentRooms] = useState(venue.totalTreatmentRooms ?? 5);
    const [privateSuites, setPrivateSuites] = useState(venue.privateSuites ?? 4);
    const [couplesRooms, setCouplesRooms] = useState(venue.couplesRooms ?? 1);
    const [groupSpaces, setGroupSpaces] = useState(venue.groupSpaces ?? 0);
    const [roomSizes, setRoomSizes] = useState('12-18 sqm per room');
    const [tablesAvailable, setTablesAvailable] = useState(true);
    const [specializedEquip, setSpecializedEquip] = useState('Electric height-adjustable massage tables, hot stone warmers, aromatherapy diffusers, facial steamers, LED light therapy devices, microcurrent facial equipment.');
    const [roomFeatures, setRoomFeatures] = useState('Each room features dimmable lighting, integrated sound systems, temperature control, premium linens, and ensuite amenities. Couples suite includes dual massage tables and private shower.');

    // Supporting Facilities
    const SUPPORTING_OPTIONS = [
        'Relaxation Lounges', 'Meditation Rooms', 'Steam Rooms', 'Cold Plunge Pools',
        'Ice / Snow Rooms', 'Herbal Prep Rooms', 'Consultation Rooms', 'Integration / Rest Spaces'
    ];
    const [selectedSupporting, setSelectedSupporting] = useState(['Relaxation Lounges', 'Meditation Rooms', 'Steam Rooms', 'Consultation Rooms', 'Integration / Rest Spaces']);
    const [steamRoomCount, setSteamRoomCount] = useState(1);
    const [supportDetails, setSupportDetails] = useState('Relaxation lounge with 6 recliners, herbal tea station, and reading materials. Small meditation alcove with cushions for pre/post treatment quiet time. Single-person steam room adjacent to infrared sauna.');

    // Thermal & Sauna
    const THERMAL_OPTIONS = [
        'Infrared Sauna', 'Traditional Dry Sauna', 'Steam Room', 'Indoor Thermal Pools',
        'Outdoor Thermal Pools', 'Mineral Spring Pools', 'Natural Hot Spring Pools', 'Geothermal Pools'
    ];
    const [selectedThermal, setSelectedThermal] = useState(['Infrared Sauna', 'Steam Room']);
    const [indoorPoolCount, setIndoorPoolCount] = useState(venue.indoorPoolCount ?? 0);
    const [outdoorPoolCount, setOutdoorPoolCount] = useState(venue.outdoorPoolCount ?? 0);
    const [thermalFeatures, setThermalFeatures] = useState(venue.thermalFeatures || 'Full-spectrum infrared sauna (2-person capacity) with chromotherapy lighting. Eucalyptus-infused steam room. Complimentary for all treatment bookings over 60 minutes.');

    // Traditional Bathing (Collapsible)
    const [bathingSections, setBathingSections] = useState<Record<string, any>>(
        (venue.bathingSections && Object.keys(venue.bathingSections).length > 0)
            ? venue.bathingSections as Record<string, any>
            : {
                japanese: { active: false, title: 'Japanese Facilities (Onsen / Sento)' },
                korean: { active: false, title: 'Korean Facilities (Jjimjilbang)' },
                turkish: { active: false, title: 'Turkish / Moroccan Facilities (Hammam)' },
                russian: { active: false, title: 'Russian Facilities (Banya)' }
            }
    );

    // Medical Spa
    const [medSpaSuites, setMedSpaSuites] = useState(false);
    const [medSuiteCount, setMedSuiteCount] = useState(0);

    // Changing & Locker
    const [changingDetails, setChangingDetails] = useState('Separate male and female changing areas with 20 secure lockers each. Private changing cubicles available. Vanity stations with hairdryers, straighteners, and complimentary amenities.');
    const [showerDetails, setShowerDetails] = useState('4 private shower suites with rain showers and premium body products. Heated floors throughout wet areas.');
    const [towelsProvided, setTowelsProvided] = useState(venue.towelsProvided ?? true);
    const [slippersProvided, setSlippersProvided] = useState(venue.slippersProvided ?? true);
    const [changingAmenities, setChangingAmenities] = useState('Complimentary toiletries including shampoo, conditioner, body wash, moisturizer, and deodorant. Hair styling tools available. Secure valuables storage.');

    // Certifications
    const fc = (venue.facilityCertifications || {}) as Record<string, any>;
    const [medCerts, setMedCerts] = useState(fc.medCerts || 'N/A - Day spa (non-medical)');
    const [tradCerts, setTradCerts] = useState(fc.tradCerts || 'All massage therapists hold Diploma of Remedial Massage (HLT52015) or equivalent. Senior therapists certified in aromatherapy and reflexology.');
    const [waterTesting, setWaterTesting] = useState(fc.waterTesting || 'N/A - No pool facilities. Steam room maintained to NSW Health guidelines.');
    const [safetyStandards, setSafetyStandards] = useState(fc.safetyStandards || 'Fully compliant with NSW Work Health and Safety regulations. Regular equipment maintenance and hygiene audits. All staff hold current First Aid certification.');
    const [sustainability, setSustainability] = useState(fc.sustainability || 'Organic and cruelty-free products. Biodegradable consumables. Energy-efficient LED lighting. Recycling program. Local Australian-made product partnerships.');

    // Accessibility
    const ACCESS_OPTIONS = [
        'Wheelchair Accessible', 'Mobility Assistance', 'Accessible Pools',
        'Support Rails', 'Ground Level Access', 'Lift Available'
    ];
    const [selectedAccess, setSelectedAccess] = useState(['Wheelchair Accessible', 'Support Rails', 'Ground Level Access', 'Lift Available']);

    // Other
    const [otherAvailable, setOtherAvailable] = useState(false);
    const [otherTypes, setOtherTypes] = useState('');

    // Batch-save all facility fields whenever any state changes
    const isMount = useRef(true);
    useEffect(() => {
        if (isMount.current) { isMount.current = false; return; }
        onUpdate({
            facilityPhilosophy: philosophy,
            facilityHighlights: highlights,
            totalTreatmentRooms,
            privateSuites,
            couplesRooms,
            groupSpaces,
            indoorPoolCount,
            outdoorPoolCount,
            thermalFeatures,
            towelsProvided,
            slippersProvided,
            bathingSections,
            facilityCertifications: { medCerts, tradCerts, waterTesting, safetyStandards, sustainability },
            propertySizeValue: facilitySpace,
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [philosophy, highlights, totalTreatmentRooms, privateSuites, couplesRooms, groupSpaces,
        indoorPoolCount, outdoorPoolCount, thermalFeatures, towelsProvided, slippersProvided,
        bathingSections, medCerts, tradCerts, waterTesting, safetyStandards, sustainability, facilitySpace]);

    const toggleOption = (list: string[], setList: (val: string[]) => void, option: string) => {
        if (list.includes(option)) {
            setList(list.filter(i => i !== option));
        } else {
            setList([...list, option]);
        }
    };

    const toggleFeatured = (id: string) => {
        setFeaturedFacilities(prev => prev.map(f => f.id === id ? { ...f, showOnWebsite: !f.showOnWebsite } : f));
    };

    const updateFeatured = (id: string, field: keyof FacilityItem, value: string | boolean) => {
        setFeaturedFacilities(prev => prev.map(f => f.id === id ? { ...f, [field]: value } : f));
    };

    const addFacility = () => {
        const newId = (featuredFacilities.length + 1).toString();
        setFeaturedFacilities([...featuredFacilities, {
            id: newId,
            name: 'New Facility',
            description: '',
            accessNote: '',
            showOnWebsite: false
        }]);
    };

    return (
        <div className="wvd-content">
            {/* Featured Facilities for Website */}
            <section className="wvd-form-section">
                <div className="wvd-form-section-header">
                    <div>
                        <h3 className="wvd-form-section-title">Featured Facilities for Website</h3>
                        <p className="wvd-form-hint">These facilities appear as cards on your public listing (About / Space tab). Enable "Show on Website" and add images to feature them.</p>
                    </div>
                    <span style={{ fontSize: 12, color: 'var(--success)', fontWeight: 500 }}>
                        {featuredFacilities.filter(f => f.showOnWebsite).length} facilities shown
                    </span>
                </div>
                <div className="wvd-form-section-body">
                    {featuredFacilities.map(facility => (
                        <div key={facility.id} className="wf-facility-box">
                            <div className="wf-facility-box-header">
                                <h4 className="wf-facility-name-title">{facility.name}</h4>
                                <div className="wvd-toggle-container">
                                    <div
                                        className={`wvd-toggle ${facility.showOnWebsite ? 'active' : ''}`}
                                        onClick={() => toggleFeatured(facility.id)}
                                    >
                                        <div className="wvd-toggle-knob"></div>
                                    </div>
                                    <span className="wvd-toggle-label">Show on Website</span>
                                </div>
                            </div>
                            <div className="wf-facility-box-content">
                                <div className="wf-facility-upload-box">
                                    <Upload size={32} strokeWidth={1.5} color="#B8B8B8" />
                                    <span className="wf-upload-text">Upload Image</span>
                                </div>
                                <div className="wf-facility-box-fields">
                                    <div className="wvd-form-group">
                                        <label className="wvd-form-label">Facility Name</label>
                                        <input
                                            type="text"
                                            className="wvd-form-input"
                                            value={facility.name}
                                            onChange={e => updateFeatured(facility.id, 'name', e.target.value)}
                                        />
                                    </div>
                                    <div className="wvd-form-group">
                                        <label className="wvd-form-label">Description</label>
                                        <textarea
                                            className="wvd-form-input wvd-form-textarea"
                                            style={{ minHeight: '50px', resize: 'none' }}
                                            value={facility.description}
                                            onChange={e => updateFeatured(facility.id, 'description', e.target.value)}
                                        />
                                    </div>
                                    <div className="wvd-form-group">
                                        <label className="wvd-form-label">Access Note</label>
                                        <input
                                            type="text"
                                            className="wvd-form-input"
                                            value={facility.accessNote}
                                            onChange={e => updateFeatured(facility.id, 'accessNote', e.target.value)}
                                            placeholder="e.g. Included with all treatments, By booking only"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    <button className="wf-add-facility-btn" onClick={addFacility}>
                        <Plus size={18} />
                        Add Another Facility
                    </button>
                </div>
            </section>

            {/* Facility Summary */}
            <section className="wvd-form-section">
                <div className="wvd-form-section-header">
                    <h3 className="wvd-form-section-title">Facility Summary</h3>
                </div>
                <div className="wvd-form-section-body">
                    <div className="wvd-form-grid">
                        <div className="wvd-form-group">
                            <label className="wvd-form-label">Total Facility Space (sqm)</label>
                            <input
                                type="number"
                                className="wvd-form-input"
                                value={facilitySpace}
                                onChange={e => setFacilitySpace(parseInt(e.target.value) || 0)}
                            />
                        </div>
                        <div className="wvd-form-group">
                            <label className="wvd-form-label">Facility Philosophy</label>
                            <input
                                type="text"
                                className="wvd-form-input"
                                value={philosophy}
                                onChange={e => setPhilosophy(e.target.value)}
                            />
                        </div>
                        <div className="wvd-form-group wvd-full-width">
                            <label className="wvd-form-label">Facility Highlights</label>
                            <textarea
                                className="wvd-form-input wvd-form-textarea"
                                style={{ minHeight: '80px' }}
                                value={highlights}
                                onChange={e => setHighlights(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Treatment Rooms */}
            <section className="wvd-form-section">
                <div className="wvd-form-section-header">
                    <h3 className="wvd-form-section-title">Treatment Rooms</h3>
                </div>
                <div className="wvd-form-section-body">
                    <div className="wvd-form-grid wa-four-col">
                        <div className="wvd-form-group">
                            <label className="wvd-form-label">Total Treatment Rooms</label>
                            <input
                                type="number"
                                className="wvd-form-input"
                                value={totalTreatmentRooms}
                                onChange={e => setTotalTreatmentRooms(parseInt(e.target.value) || 0)}
                            />
                        </div>
                        <div className="wvd-form-group">
                            <label className="wvd-form-label">Private Treatment Suites</label>
                            <input
                                type="number"
                                className="wvd-form-input"
                                value={privateSuites}
                                onChange={e => setPrivateSuites(parseInt(e.target.value) || 0)}
                            />
                        </div>
                        <div className="wvd-form-group">
                            <label className="wvd-form-label">Couples Rooms</label>
                            <input
                                type="number"
                                className="wvd-form-input"
                                value={couplesRooms}
                                onChange={e => setCouplesRooms(parseInt(e.target.value) || 0)}
                            />
                        </div>
                        <div className="wvd-form-group">
                            <label className="wvd-form-label">Group Treatment Spaces</label>
                            <input
                                type="number"
                                className="wvd-form-input"
                                value={groupSpaces}
                                onChange={e => setGroupSpaces(parseInt(e.target.value) || 0)}
                            />
                        </div>
                        <div className="wvd-form-group">
                            <label className="wvd-form-label">Room Sizes</label>
                            <input
                                type="text"
                                className="wvd-form-input"
                                value={roomSizes}
                                onChange={e => setRoomSizes(e.target.value)}
                            />
                        </div>
                        <div className="wvd-form-group">
                            <label className="wvd-form-label">Treatment Tables Available</label>
                            <div className="wvd-toggle-container">
                                <div
                                    className={`wvd-toggle ${tablesAvailable ? 'active' : ''}`}
                                    onClick={() => setTablesAvailable(!tablesAvailable)}
                                >
                                    <div className="wvd-toggle-knob"></div>
                                </div>
                                <span className="wvd-toggle-label">Yes</span>
                            </div>
                        </div>
                        <div className="wvd-form-group wvd-full-width">
                            <label className="wvd-form-label">Specialized Equipment</label>
                            <textarea
                                className="wvd-form-input wvd-form-textarea"
                                style={{ minHeight: '60px' }}
                                value={specializedEquip}
                                onChange={e => setSpecializedEquip(e.target.value)}
                            />
                        </div>
                        <div className="wvd-form-group wvd-full-width">
                            <label className="wvd-form-label">Treatment Room Features</label>
                            <textarea
                                className="wvd-form-input wvd-form-textarea"
                                style={{ minHeight: '60px' }}
                                value={roomFeatures}
                                onChange={e => setRoomFeatures(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Supporting Facilities */}
            <section className="wvd-form-section">
                <div className="wvd-form-section-header">
                    <h3 className="wvd-form-section-title">Supporting Facilities</h3>
                </div>
                <div className="wvd-form-section-body">
                    <div className="wa-inclusions-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                        {SUPPORTING_OPTIONS.map(opt => (
                            <div
                                key={opt}
                                className="wa-inclusion-item"
                                onClick={() => toggleOption(selectedSupporting, setSelectedSupporting, opt)}
                            >
                                <div className={`wa-inclusion-check ${selectedSupporting.includes(opt) ? 'active' : ''}`}>
                                    {selectedSupporting.includes(opt) && <Check size={10} color="#fff" strokeWidth={3} />}
                                </div>
                                <span>{opt}</span>
                            </div>
                        ))}
                    </div>
                    <div className="wvd-form-grid" style={{ marginTop: '20px' }}>
                        <div className="wvd-form-group">
                            <label className="wvd-form-label">Steam Room Count</label>
                            <input
                                type="number"
                                className="wvd-form-input"
                                value={steamRoomCount}
                                onChange={e => setSteamRoomCount(parseInt(e.target.value) || 0)}
                            />
                        </div>
                        <div className="wvd-form-group wvd-full-width">
                            <label className="wvd-form-label">Support Facilities Details</label>
                            <textarea
                                className="wvd-form-input wvd-form-textarea"
                                style={{ minHeight: '60px' }}
                                value={supportDetails}
                                onChange={e => setSupportDetails(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Thermal & Sauna Facilities */}
            <section className="wvd-form-section">
                <div className="wvd-form-section-header">
                    <h3 className="wvd-form-section-title">Thermal & Sauna Facilities</h3>
                </div>
                <div className="wvd-form-section-body">
                    <div className="wa-inclusions-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                        {THERMAL_OPTIONS.map(opt => (
                            <div
                                key={opt}
                                className="wa-inclusion-item"
                                onClick={() => toggleOption(selectedThermal, setSelectedThermal, opt)}
                            >
                                <div className={`wa-inclusion-check ${selectedThermal.includes(opt) ? 'active' : ''}`}>
                                    {selectedThermal.includes(opt) && <Check size={10} color="#fff" strokeWidth={3} />}
                                </div>
                                <span>{opt}</span>
                            </div>
                        ))}
                    </div>
                    <div className="wvd-form-grid" style={{ marginTop: '20px' }}>
                        <div className="wvd-form-group">
                            <label className="wvd-form-label">Indoor Pool Count</label>
                            <input
                                type="number"
                                className="wvd-form-input"
                                value={indoorPoolCount}
                                onChange={e => setIndoorPoolCount(parseInt(e.target.value) || 0)}
                            />
                        </div>
                        <div className="wvd-form-group">
                            <label className="wvd-form-label">Outdoor Pool Count</label>
                            <input
                                type="number"
                                className="wvd-form-input"
                                value={outdoorPoolCount}
                                onChange={e => setOutdoorPoolCount(parseInt(e.target.value) || 0)}
                            />
                        </div>
                        <div className="wvd-form-group wvd-full-width">
                            <label className="wvd-form-label">Pool / Thermal Features</label>
                            <textarea
                                className="wvd-form-input wvd-form-textarea"
                                style={{ minHeight: '60px' }}
                                value={thermalFeatures}
                                onChange={e => setThermalFeatures(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Traditional Bathing Facilities */}
            <section className="wvd-form-section">
                <div className="wvd-form-section-header">
                    <h3 className="wvd-form-section-title">Traditional Bathing Facilities</h3>
                    <span style={{ fontSize: 12, color: 'var(--accent)' }}>For venues with traditional bathing culture</span>
                </div>
                <div className="wvd-form-section-body">
                    {Object.entries(bathingSections).map(([key, section]) => (
                        <div key={key} className="wf-collapsible-section">
                            <div
                                className="wf-collapsible-header"
                                onClick={() => setBathingSections(prev => ({
                                    ...prev,
                                    [key]: { ...prev[key as keyof typeof bathingSections], active: !prev[key as keyof typeof bathingSections].active }
                                }))}
                            >
                                <h4 className="wf-collapsible-title">{section.title}</h4>
                                <div className="wvd-toggle-container" onClick={e => e.stopPropagation()}>
                                    <div
                                        className={`wvd-toggle ${section.active ? 'active' : ''}`}
                                        onClick={() => setBathingSections(prev => ({
                                            ...prev,
                                            [key]: { ...prev[key as keyof typeof bathingSections], active: !prev[key as keyof typeof bathingSections].active }
                                        }))}
                                    >
                                        <div className="wvd-toggle-knob"></div>
                                    </div>
                                    <span className="wvd-toggle-label">{section.active ? 'Available' : 'Not Available'}</span>
                                </div>
                            </div>
                            {section.active ? (
                                <div className="wf-collapsible-body">
                                    {/* Placeholder for expanded content */}
                                    <p className="wvd-form-hint">Details for {section.title} would go here.</p>
                                </div>
                            ) : (
                                <div className="wf-collapsible-body inactive">
                                    <p className="wf-inactive-note">Enable toggle to add {section.title} details.</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            {/* Medical Spa Facilities */}
            <section className="wvd-form-section">
                <div className="wvd-form-section-header">
                    <h3 className="wvd-form-section-title">Medical Spa Facilities</h3>
                </div>
                <div className="wvd-form-section-body">
                    <div className="wvd-form-grid">
                        <div className="wvd-form-group">
                            <label className="wvd-form-label">Medical Spa Suites</label>
                            <div className="wvd-toggle-container">
                                <div
                                    className={`wvd-toggle ${medSpaSuites ? 'active' : ''}`}
                                    onClick={() => setMedSpaSuites(!medSpaSuites)}
                                >
                                    <div className="wvd-toggle-knob"></div>
                                </div>
                                <span className="wvd-toggle-label">{medSpaSuites ? 'Yes' : 'No'}</span>
                            </div>
                        </div>
                        <div className="wvd-form-group">
                            <label className="wvd-form-label">Medical Suite Count</label>
                            <input
                                type="number"
                                className="wvd-form-input"
                                value={medSuiteCount}
                                onChange={e => setMedSuiteCount(parseInt(e.target.value) || 0)}
                                disabled={!medSpaSuites}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Changing & Locker Facilities */}
            <section className="wvd-form-section">
                <div className="wvd-form-section-header">
                    <h3 className="wvd-form-section-title">Changing & Locker Facilities</h3>
                </div>
                <div className="wvd-form-section-body">
                    <div className="wvd-form-grid">
                        <div className="wvd-form-group wvd-full-width">
                            <label className="wvd-form-label">Changing / Locker Facilities</label>
                            <textarea
                                className="wvd-form-input wvd-form-textarea"
                                style={{ minHeight: '60px' }}
                                value={changingDetails}
                                onChange={e => setChangingDetails(e.target.value)}
                            />
                        </div>
                        <div className="wvd-form-group wvd-full-width">
                            <label className="wvd-form-label">Shower Facilities</label>
                            <textarea
                                className="wvd-form-input wvd-form-textarea"
                                style={{ minHeight: '60px' }}
                                value={showerDetails}
                                onChange={e => setShowerDetails(e.target.value)}
                            />
                        </div>
                        <div className="wvd-form-group">
                            <label className="wvd-form-label">Towels & Robes Provided</label>
                            <div className="wvd-toggle-container">
                                <div
                                    className={`wvd-toggle ${towelsProvided ? 'active' : ''}`}
                                    onClick={() => setTowelsProvided(!towelsProvided)}
                                >
                                    <div className="wvd-toggle-knob"></div>
                                </div>
                                <span className="wvd-toggle-label">Yes</span>
                            </div>
                        </div>
                        <div className="wvd-form-group">
                            <label className="wvd-form-label">Slippers & Amenities Provided</label>
                            <div className="wvd-toggle-container">
                                <div
                                    className={`wvd-toggle ${slippersProvided ? 'active' : ''}`}
                                    onClick={() => setSlippersProvided(!slippersProvided)}
                                >
                                    <div className="wvd-toggle-knob"></div>
                                </div>
                                <span className="wvd-toggle-label">Yes</span>
                            </div>
                        </div>
                        <div className="wvd-form-group wvd-full-width">
                            <label className="wvd-form-label">Additional Amenities</label>
                            <textarea
                                className="wvd-form-input wvd-form-textarea"
                                style={{ minHeight: '60px' }}
                                value={changingAmenities}
                                onChange={e => setChangingAmenities(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Certifications & Standards */}
            <section className="wvd-form-section">
                <div className="wvd-form-section-header">
                    <h3 className="wvd-form-section-title">Certifications & Standards</h3>
                </div>
                <div className="wvd-form-section-body">
                    <div className="wvd-form-grid">
                        <div className="wvd-form-group wvd-full-width">
                            <label className="wvd-form-label">Medical Certifications</label>
                            <textarea
                                className="wvd-form-input wvd-form-textarea"
                                style={{ minHeight: '60px' }}
                                value={medCerts}
                                onChange={e => setMedCerts(e.target.value)}
                            />
                        </div>
                        <div className="wvd-form-group wvd-full-width">
                            <label className="wvd-form-label">Traditional Practice Certifications</label>
                            <textarea
                                className="wvd-form-input wvd-form-textarea"
                                style={{ minHeight: '60px' }}
                                value={tradCerts}
                                onChange={e => setTradCerts(e.target.value)}
                            />
                        </div>
                        <div className="wvd-form-group wvd-full-width">
                            <label className="wvd-form-label">Water Quality Testing</label>
                            <textarea
                                className="wvd-form-input wvd-form-textarea"
                                style={{ minHeight: '60px' }}
                                value={waterTesting}
                                onChange={e => setWaterTesting(e.target.value)}
                            />
                        </div>
                        <div className="wvd-form-group wvd-full-width">
                            <label className="wvd-form-label">Safety Standards</label>
                            <textarea
                                className="wvd-form-input wvd-form-textarea"
                                style={{ minHeight: '60px' }}
                                value={safetyStandards}
                                onChange={e => setSafetyStandards(e.target.value)}
                            />
                        </div>
                        <div className="wvd-form-group wvd-full-width">
                            <label className="wvd-form-label">Sustainability Practices</label>
                            <textarea
                                className="wvd-form-input wvd-form-textarea"
                                style={{ minHeight: '60px' }}
                                value={sustainability}
                                onChange={e => setSustainability(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Accessibility */}
            <section className="wvd-form-section">
                <div className="wvd-form-section-header">
                    <h3 className="wvd-form-section-title">Accessibility</h3>
                </div>
                <div className="wvd-form-section-body">
                    <div className="wa-inclusions-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                        {ACCESS_OPTIONS.map(opt => (
                            <div
                                key={opt}
                                className="wa-inclusion-item"
                                onClick={() => toggleOption(selectedAccess, setSelectedAccess, opt)}
                            >
                                <div className={`wa-inclusion-check ${selectedAccess.includes(opt) ? 'active' : ''}`}>
                                    {selectedAccess.includes(opt) && <Check size={10} color="#fff" strokeWidth={3} />}
                                </div>
                                <span>{opt}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Other Wellness Facilities */}
            <section className="wvd-form-section">
                <div className="wvd-form-section-header">
                    <h3 className="wvd-form-section-title">Other Wellness Facilities</h3>
                </div>
                <div className="wvd-form-section-body">
                    <div className="wvd-form-grid">
                        <div className="wvd-form-group">
                            <label className="wvd-form-label">Other Wellness Facilities</label>
                            <div className="wvd-toggle-container">
                                <div
                                    className={`wvd-toggle ${otherAvailable ? 'active' : ''}`}
                                    onClick={() => setOtherAvailable(!otherAvailable)}
                                >
                                    <div className="wvd-toggle-knob"></div>
                                </div>
                                <span className="wvd-toggle-label">{otherAvailable ? 'Yes' : 'No'}</span>
                            </div>
                        </div>
                        <div className="wvd-form-group wvd-full-width">
                            <label className="wvd-form-label">Other Facility Types</label>
                            <textarea
                                className="wvd-form-input wvd-form-textarea"
                                style={{ minHeight: '60px' }}
                                placeholder="Describe any other wellness facilities not covered above..."
                                value={otherTypes}
                                onChange={e => setOtherTypes(e.target.value)}
                                disabled={!otherAvailable}
                            />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
