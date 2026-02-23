import { useState, useEffect } from 'react';
import { X, Plus, Trash2, ChevronDown, ChevronUp, Globe, Sparkles, Upload, Loader2 } from 'lucide-react';
import type { Venue, AddOn, IndividualRoom, VenuePackage, VenueService } from '../context/VenueContext';
import { uploadFile, deleteFile } from '../lib/storage';

interface VenueFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Venue, 'id' | 'date'>) => void;
  initialData?: Venue | null;
  mode: 'create' | 'edit';
}

type VenueFormData = Omit<Venue, 'id' | 'date'>;

const defaultBedConfig = {
  kingBeds: 0, queenBeds: 0, doubleBeds: 0, singleBeds: 0,
  twinBeds: 0, bunkBeds: 0, sofaBeds: 0, rollawayBeds: 0,
};

const emptyWellnessForm: VenueFormData = {
  name: '', location: '', shortLoc: '', type: 'Wellness',
  capacity: 10, status: 'Draft', subscription: 'Essentials',
  owner: '', email: '', phone: '', description: '', website: '',
  amenities: [], facilities: [], pricingTiers: [],
  hasAccommodation: false,
  wellnessType: 'Wellness Center', offersTherapeuticServices: false,
  services: [], openingTime: '07:00', closingTime: '22:00',
  packages: [], venueTypeCategory: 'Day Spa', established: '',
  bestFor: [], availabilityTime: '', wheelchairAccessible: false,
  languages: [], policies: '', isAvailable: true, heroImage: '',
  quote: '', introParagraph1: '', introParagraph2: '', ownerAddress: '',
  showAccommodationSection: false, showOnWebsite: true, whatsIncluded: [],
  accommodationAmenities: [], addOns: [],
  bedConfiguration: { ...defaultBedConfig }, individualRooms: [],
  galleryPhotos: [], practitioners: [],
  houseRules: '', healthSafety: '', ageRequirements: '',
  cancellationPolicy: '', bookingPolicy: '', directions: '',
  modalities: [], locationSetting: '',
};

const emptyRetreatForm: VenueFormData = {
  name: '', location: '', shortLoc: '', type: 'Retreat',
  capacity: 10, status: 'Draft', subscription: 'Essentials',
  owner: '', email: '', phone: '', description: '', website: '',
  amenities: [], facilities: [], pricingTiers: [],
  hasAccommodation: true,
  retreatVenueType: [], hireType: 'Exclusive Use',
  experienceFeatureImage: '', introText: '',
  retreatStyles: [], idealRetreatTypes: [],
  experienceTitle: '', experienceSubtitle: '', experienceDescription: '',
  propertySizeValue: 0, propertySizeUnit: 'Acres',
  established: '', architectureStyle: '',
  streetAddress: '', suburb: '', postcode: '', stateProvince: '',
  country: 'Australia', climate: 'Temperate', locationType: [],
  gpsCoordinates: '', nearestAirport: '', transportAccess: [],
  maxGuests: 0, minGuests: 1, totalBedrooms: 0, totalBathrooms: 0,
  sharedBathrooms: 0, privateEnsuites: 0,
  accommodationStyle: '', propertyType: '', accommodationDescription: '',
  bedConfigKing: 0, bedConfigQueen: 0, bedConfigDouble: 0, bedConfigSingle: 0,
  bedConfigTwin: 0, bedConfigBunk: 0, bedConfigSofa: 0, bedConfigRollaway: 0,
  checkInTime: '', checkOutTime: '',
  earlyCheckInAvailable: false, lateCheckOutAvailable: false,
  childrenAllowed: true, minimumChildAge: 0,
  petsAllowed: false, smokingAllowed: false,
  propertyStatus: 'Operational', sanctumVetted: false,
  featuredListing: false, instantBooking: false,
  internalNotes: '',

  houseRules: '', healthSafety: '', ageRequirements: '',
  cancellationPolicy: '', bookingPolicy: '', directions: '',
  modalities: [], locationSetting: '',
  heroImage: '', galleryPhotos: [], practitioners: [],
  services: [], packages: [], addOns: [], individualRooms: [],
  bedConfiguration: { ...defaultBedConfig },
};

const VENUE_TYPE_OPTIONS = [
  'Day Spa',
  'Destination Spa',
  'Thermal Sanctuary',
  'Traditional Onsen',
  'Nordic Spa',
  'Hammam',
  'Wellness Hotel',
  'Wellness Resort',
  'Ayurvedic Centre',
  'Float Centre',
  'Healing Centre',
  'Medical Spa',
  'Bathhouse',
  'Treatment Centre',
  'Wellness Center',
  'Retreat Center'
];
const BEST_FOR_OPTIONS = ['Couples', 'Solo', 'Groups', 'Families', 'Corporate', 'Friends'];
const WELLNESS_AMENITIES = [
  '🅿️ Free Parking', '🚿 Showers', '🧖 Robes Provided', '🍵 Tea Lounge',
  '🔒 Lockers', '♿ Accessible', '📶 WiFi', '❄️ Air Conditioning',
];

const MODALITY_OPTIONS = [
  'Thermal Bathing', 'Massage', 'Ayurveda', 'TCM / Acupuncture',
  'Hydrotherapy', 'Sauna & Steam', 'Cold Therapy', 'Float Therapy',
  'Yoga', 'Meditation', 'Breathwork', 'Sound Healing',
  'Detox Programs', 'Facials & Skin', 'Energy Healing'
];

const SETTING_OPTIONS = [
  'Coastal & Beach', 'Mountain & Alpine', 'Forest & Jungle', 'Urban',
  'Desert', 'Island & Tropical', 'Countryside', 'Lakeside', 'Volcanic / Geothermal'
];

const LANGUAGE_OPTIONS = [
  'English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese',
  'Korean', 'Italian', 'Portuguese', 'Russian', 'Arabic', 'Hindi',
  'Thai', 'Vietnamese', 'Indonesian', 'Malay', 'Turkish', 'Dutch',
  'Greek', 'Swedish', 'Polish', 'Greek', 'Danish', 'Finnish'
];

const RETREAT_VENUE_TYPE_OPTIONS = [
  'Dedicated Retreat Centre', 'Eco Lodge', 'Private Estate', 'Boutique Hotel',
  'Mountain Lodge', 'Beach Property', 'Wellness Resort', 'Monastery / Ashram',
  'Farm / Ranch', 'Villa', 'Castle / Historic', 'Glamping / Tented'
];

const HIRE_TYPE_OPTIONS = ['Exclusive Use', 'Shared Use', 'Room Only'];

const ARCHITECTURE_STYLE_OPTIONS = [
  'Contemporary Rural', 'Traditional', 'Minimalist', 'Balinese',
  'Japanese', 'Mediterranean', 'Colonial', 'Eco/Sustainable'
];

const CLIMATE_OPTIONS = ['Temperate', 'Tropical', 'Arid', 'Alpine', 'Mediterranean'];
const PROPERTY_STATUS_OPTIONS = ['Operational', 'Under Construction', 'Seasonal', 'Temporarily Closed'];


export default function VenueFormModal({ isOpen, onClose, onSubmit, initialData, mode }: VenueFormModalProps) {


  const [step, setStep] = useState<'category' | 'wellness' | 'retreat'>(
    mode === 'edit' ? (initialData?.type === 'Wellness' ? 'wellness' : 'retreat') : 'category'
  );
  const [form, setForm] = useState<VenueFormData>(emptyWellnessForm);

  // Collapsible sections
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    basic: true, services: true, details: true, owner: true,
    content: false, accommodation: false, addons: false, beds: false, rooms: false,
    location_ext: false, status_listing: false, accommodation_retreat: false,
    policies_retreat: false, experience: false, property: false, practitioners: false,
    policies_detail: false
  });

  // Tag input states
  const [serviceInput, setServiceInput] = useState('');
  const [servicePriceInput, setServicePriceInput] = useState('');
  const [serviceDurationInput, setServiceDurationInput] = useState('');
  const [packageInput, setPackageInput] = useState('');
  const [packagePriceInput, setPackagePriceInput] = useState('');
  const [packageThumbnailInput, setPackageThumbnailInput] = useState('');
  const [languageInput, setLanguageInput] = useState('');
  const [whatsIncludedInput, setWhatsIncludedInput] = useState('');
  const [practitionerNameInput, setPractitionerNameInput] = useState('');
  const [practitionerPhotoInput, setPractitionerPhotoInput] = useState('');

  // Add-on inputs
  const [addOnName, setAddOnName] = useState('');
  const [addOnPrice, setAddOnPrice] = useState('');

  // Room form
  const [showRoomForm, setShowRoomForm] = useState(false);
  const [roomForm, setRoomForm] = useState({
    roomName: '', roomImage: '', websiteDescription: '', roomType: '',
    bedConfiguration: { ...defaultBedConfig }, maxOccupancy: 1, bathroom: '', roomSize: '',
    floor: '', pricePerNight: '', roomAmenities: [] as string[],
  });
  type RoomFormData = typeof roomForm;
  const [roomAmenityInput, setRoomAmenityInput] = useState('');

  // Upload states
  const [isUploadingHero, setIsUploadingHero] = useState(false);
  const [isUploadingGlobal, setIsUploadingGlobal] = useState(false); // Global gallery upload state
  const [isUploadingRoomImage, setIsUploadingRoomImage] = useState(false);
  const [isUploadingPractitioner, setIsUploadingPractitioner] = useState(false);
  const [isUploadingPackageThumbnail, setIsUploadingPackageThumbnail] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    if (initialData && mode === 'edit') {
      setForm({
        ...emptyWellnessForm,
        ...initialData,
        amenities: [...(initialData.amenities || [])],
        facilities: [...(initialData.facilities || [])],
        pricingTiers: [...(initialData.pricingTiers || [])],
        services: [...(initialData.services || [])],
        packages: [...(initialData.packages || [])],
        bestFor: [...(initialData.bestFor || [])],
        languages: [...(initialData.languages || [])],
        whatsIncluded: [...(initialData.whatsIncluded || [])],
        accommodationAmenities: [...(initialData.accommodationAmenities || [])],
        addOns: [...(initialData.addOns || [])],
        bedConfiguration: { ...defaultBedConfig, ...(initialData.bedConfiguration || {}) },
        individualRooms: [...(initialData.individualRooms || [])],
        galleryPhotos: [...(initialData.galleryPhotos || [])],
        practitioners: [...(initialData.practitioners || [])],
        // Retreat fields
        retreatVenueType: [...(initialData.retreatVenueType || [])],
        retreatStyles: [...(initialData.retreatStyles || [])],
        idealRetreatTypes: [...(initialData.idealRetreatTypes || [])],
        locationType: [...(initialData.locationType || [])],
        transportAccess: [...(initialData.transportAccess || [])],
        streetAddress: initialData.streetAddress || '',
        suburb: initialData.suburb || '',
        postcode: initialData.postcode || '',
        stateProvince: initialData.stateProvince || '',
        country: initialData.country || '',
        climate: initialData.climate || '',
        nearestAirport: initialData.nearestAirport || '',
        propertyStatus: initialData.propertyStatus || 'Operational',
        sanctumVetted: initialData.sanctumVetted || false,
        featuredListing: initialData.featuredListing || false,
        instantBooking: initialData.instantBooking || false,
        internalNotes: initialData.internalNotes || '',
        propertyType: initialData.propertyType || '',
        accommodationStyle: initialData.accommodationStyle || '',
        minGuests: initialData.minGuests || 1,
        maxGuests: initialData.maxGuests || 0,
        totalBedrooms: initialData.totalBedrooms || 0,
        totalBathrooms: initialData.totalBathrooms || 0,
        sharedBathrooms: initialData.sharedBathrooms || 0,
        privateEnsuites: initialData.privateEnsuites || 0,
        bedConfigKing: initialData.bedConfigKing || 0,
        bedConfigQueen: initialData.bedConfigQueen || 0,
        bedConfigDouble: initialData.bedConfigDouble || 0,
        bedConfigSingle: initialData.bedConfigSingle || 0,
        bedConfigTwin: initialData.bedConfigTwin || 0,
        bedConfigBunk: initialData.bedConfigBunk || 0,
        checkInTime: initialData.checkInTime || '',
        checkOutTime: initialData.checkOutTime || '',
        earlyCheckInAvailable: initialData.earlyCheckInAvailable || false,
        lateCheckOutAvailable: initialData.lateCheckOutAvailable || false,
        childrenAllowed: initialData.childrenAllowed || false,
        petsAllowed: initialData.petsAllowed || false,
        venuePolicies: initialData.venuePolicies || '',
      });
      setStep(initialData.type === 'Wellness' ? 'wellness' : 'retreat');
    } else {
      setForm(emptyWellnessForm);
      setStep('category');
    }
    resetInputs();
  }, [initialData, mode, isOpen]);

  const resetInputs = () => {
    setServiceInput(''); setServicePriceInput(''); setServiceDurationInput(''); setPackageInput(''); setPackagePriceInput('');
    setPackageThumbnailInput(''); setLanguageInput('');
    setWhatsIncludedInput(''); setAddOnName(''); setAddOnPrice('');
    setShowRoomForm(false);
    setRoomForm({
      roomName: '', roomImage: '', websiteDescription: '', roomType: '',
      bedConfiguration: { ...defaultBedConfig }, maxOccupancy: 1, bathroom: '', roomSize: '',
      floor: '', pricePerNight: '', roomAmenities: [],
    });
    setRoomAmenityInput('');
    setPractitionerNameInput('');
    setPractitionerPhotoInput('');
  };

  if (!isOpen) return null;

  const toggleSection = (key: string) => {
    setExpandedSections((prev: Record<string, boolean>) => ({ ...prev, [key]: !prev[key] }));
  };

  const SectionHeader = ({ id, title, subtitle, expandedSections: exp = expandedSections, toggleSection: tgl = toggleSection }: any) => (
    <div className="venue-form-section-header" onClick={() => tgl(id)}>
      <div>
        <h3 className="venue-form-section-title">{title}</h3>
        {subtitle && <p className="venue-form-section-subtitle">{subtitle}</p>}
      </div>
      {exp[id] ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
    </div>
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const type = (e.target as HTMLInputElement).type;
    const checked = (e.target as HTMLInputElement).checked;
    const finalValue = type === 'checkbox' ? checked : (
      ['capacity', 'maxGuests', 'minGuests', 'totalBedrooms', 'totalBathrooms',
        'sharedBathrooms', 'privateEnsuites', 'propertySizeValue', 'minimumChildAge',
        'bedConfigKing', 'bedConfigQueen', 'bedConfigDouble', 'bedConfigSingle',
        'bedConfigTwin', 'bedConfigBunk', 'bedConfigSofa', 'bedConfigRollaway'
      ].includes(name) ? Number(value) : value
    );
    setForm((prev: VenueFormData) => ({ ...prev, [name]: finalValue }));
  };

  // Generic tag handlers
  const addTag = (field: 'amenities' | 'languages' | 'whatsIncluded', value: string) => {
    const trimmed = value.trim();
    const arr = (form[field] as string[]) || [];
    if (trimmed && !arr.includes(trimmed)) {
      setForm((prev: VenueFormData) => ({ ...prev, [field]: [...((prev[field] as string[]) || []), trimmed] }));
    }
  };
  const removeTag = (field: 'amenities' | 'languages' | 'whatsIncluded' | 'retreatStyles' | 'idealRetreatTypes' | 'locationType' | 'transportAccess', value: string) => {
    setForm((prev: VenueFormData) => ({ ...prev, [field]: ((prev[field] as string[]) || []).filter(v => v !== value) }));
  };

  const toggleRetreatVenueType = (opt: string) => {
    const arr = form.retreatVenueType || [];
    const newArr = arr.includes(opt) ? arr.filter(v => v !== opt) : [...arr, opt];
    setForm(prev => ({ ...prev, retreatVenueType: newArr }));
  };

  const handleSingleUpload = async (file: File, field: keyof VenueFormData) => {
    try {
      const url = await uploadFile(file, 'venue-images');
      setForm(prev => ({ ...prev, [field]: url }));
    } catch (err) {
      console.error('Single Upload Error:', err);
      alert('Failed to upload image. Please try again.');
    }
  };

  // Service handlers
  const handleAddService = () => {
    if (!serviceInput.trim() || !servicePriceInput.trim()) return;
    const name = serviceInput.trim();
    const isModalityOption = MODALITY_OPTIONS.includes(name);

    const newService: VenueService = {
      name,
      price: servicePriceInput.trim(),
      duration: serviceDurationInput.trim()
    };

    setForm((prev: VenueFormData) => {
      const nextModalities = (prev.modalities || []);
      if (isModalityOption && !nextModalities.includes(name)) {
        nextModalities.push(name);
      }
      return {
        ...prev,
        services: [...(prev.services || []), newService],
        modalities: [...nextModalities]
      };
    });

    setServiceInput('');
    setServicePriceInput('');
    setServiceDurationInput('');
  };

  const handleRemoveService = (index: number) => {
    setForm((prev: VenueFormData) => ({ ...prev, services: (prev.services || []).filter((_, i) => i !== index) }));
  };

  // Best For toggle
  const toggleBestFor = (opt: string) => {
    const arr = form.bestFor || [];
    if (arr.includes(opt)) {
      setForm((prev: VenueFormData) => ({ ...prev, bestFor: (prev.bestFor || []).filter(v => v !== opt) }));
    } else {
      setForm((prev: VenueFormData) => ({ ...prev, bestFor: [...(prev.bestFor || []), opt] }));
    }
  };

  // Package handlers
  const handleAddPackage = () => {
    if (!packageInput.trim() || !packagePriceInput.trim()) return;
    const newPackage: VenuePackage = {
      name: packageInput.trim(),
      price: packagePriceInput.trim(),
      thumbnail: packageThumbnailInput
    };
    setForm((prev: VenueFormData) => ({ ...prev, packages: [...(prev.packages || []), newPackage] }));
    setPackageInput('');
    setPackagePriceInput('');
    setPackageThumbnailInput('');
  };

  const handleRemovePackage = (index: number) => {
    setForm((prev: VenueFormData) => ({ ...prev, packages: (prev.packages || []).filter((_, i) => i !== index) }));
  };

  // Accommodation amenities toggle
  const toggleAccAmenity = (amenity: string) => {
    const arr = form.accommodationAmenities || [];
    if (arr.includes(amenity)) {
      setForm((prev: VenueFormData) => ({ ...prev, accommodationAmenities: (prev.accommodationAmenities || []).filter(v => v !== amenity) }));
    } else {
      setForm((prev: VenueFormData) => ({ ...prev, accommodationAmenities: [...(prev.accommodationAmenities || []), amenity] }));
    }
  };

  // Add-on handlers
  const handleAddAddOn = () => {
    if (!addOnName.trim() || !addOnPrice.trim()) return;
    const newAddOn: AddOn = { name: addOnName.trim(), price: addOnPrice.trim() };
    setForm((prev: VenueFormData) => ({ ...prev, addOns: [...(prev.addOns || []), newAddOn] }));
    setAddOnName(''); setAddOnPrice('');
  };
  const removeAddOn = (index: number) => {
    setForm((prev: VenueFormData) => ({ ...prev, addOns: (prev.addOns || []).filter((_, i) => i !== index) }));
  };

  // Bed config handler
  const handleRoomBedChange = (field: string, value: number) => {
    setRoomForm((prev: RoomFormData) => ({
      ...prev,
      bedConfiguration: { ...prev.bedConfiguration, [field]: Math.max(0, value) },
    }));
  };

  // Room handlers
  const handleAddRoom = () => {
    const newRoom: IndividualRoom = {
      id: `room_${Date.now()}`,
      ...roomForm,
    };
    setForm((prev: VenueFormData) => ({ ...prev, individualRooms: [...(prev.individualRooms || []), newRoom] }));
    setRoomForm({
      roomName: '', roomImage: '', websiteDescription: '', roomType: '',
      bedConfiguration: { ...defaultBedConfig }, maxOccupancy: 1, bathroom: '', roomSize: '',
      floor: '', pricePerNight: '', roomAmenities: [],
    });
    setShowRoomForm(false);
  };
  const removeRoom = (id: string) => {
    setForm((prev: VenueFormData) => ({ ...prev, individualRooms: (prev.individualRooms || []).filter(r => r.id !== id) }));
  };

  const handleRemoveGalleryPhoto = (url: string) => {
    setForm((prev: VenueFormData) => ({ ...prev, galleryPhotos: (prev.galleryPhotos || []).filter(p => p !== url) }));
    deleteFile(url);
  };

  const handleRoomImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingRoomImage(true);
      const url = await uploadFile(file);
      setRoomForm((prev: RoomFormData) => ({ ...prev, roomImage: url }));
    } catch (err: any) {
      console.error('Room image upload failed:', err);
      alert(`Failed to upload room image: ${err.message || 'Unknown error'}`);
    } finally {
      setIsUploadingRoomImage(false);
    }
  };

  const handleHeroUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingHero(true);
      const url = await uploadFile(file);
      setForm((prev: VenueFormData) => ({ ...prev, heroImage: url }));
    } catch (err: any) {
      console.error('Hero upload failed:', err);
      alert(`Failed to upload hero image: ${err.message || 'Unknown error'}`);
    } finally {
      setIsUploadingHero(false);
    }
  };

  const handlePackageThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingPackageThumbnail(true);
      const url = await uploadFile(file);
      setPackageThumbnailInput(url);
    } catch (err: any) {
      console.error('Package thumbnail upload failed:', err);
      alert(`Failed to upload package thumbnail: ${err.message || 'Unknown error'}`);
    } finally {
      setIsUploadingPackageThumbnail(false);
    }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const remainingSlots = 8 - (form.galleryPhotos || []).length;
    if (remainingSlots <= 0) {
      alert('Maximum 8 photos allowed');
      return;
    }

    const filesToUpload = Array.from(files).slice(0, remainingSlots);

    try {
      setIsUploadingGlobal(true);
      for (const file of filesToUpload) {
        const url = await uploadFile(file);
        setForm((prev: VenueFormData) => ({
          ...prev,
          galleryPhotos: [...(prev.galleryPhotos || []), url]
        }));
      }
    } catch (err: any) {
      console.error('Gallery upload failed:', err);
      alert(`Failed to upload some photos: ${err.message || 'Unknown error'}`);
    } finally {
      setIsUploadingGlobal(false);
    }
  };

  const handlePractitionerPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingPractitioner(true);
    try {
      const url = await uploadFile(file);
      setPractitionerPhotoInput(url);
    } catch (err: any) {
      alert(`Upload failed: ${err.message}`);
    } finally {
      setIsUploadingPractitioner(false);
    }
  };

  const handleAddPractitioner = () => {
    if (!practitionerNameInput || !practitionerPhotoInput) {
      alert('Please provide both name and photo for the practitioner');
      return;
    }
    const newPractitioner = {
      id: Date.now().toString(),
      name: practitionerNameInput,
      photo: practitionerPhotoInput,
    };
    setForm(prev => ({
      ...prev,
      practitioners: [...(prev.practitioners || []), newPractitioner]
    }));
    setPractitionerNameInput('');
    setPractitionerPhotoInput('');
  };

  const handleRemovePractitioner = (id: string) => {
    setForm(prev => ({
      ...prev,
      practitioners: (prev.practitioners || []).filter(p => p.id !== id)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
    onClose();
  };

  // Category selection screen
  if (step === 'category') {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-container venue-category-picker" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <h2 className="modal-title">Add New Venue</h2>
            <button className="modal-close" onClick={onClose}><X size={20} /></button>
          </div>
          <div className="category-picker-body">
            <p className="category-picker-subtitle">Select a venue category to get started</p>
            <div className="category-cards">
              <button
                className="category-card wellness"
                onClick={() => { setForm({ ...emptyWellnessForm }); setStep('wellness'); }}
              >
                <div className="category-card-icon">
                  <Sparkles size={32} />
                </div>
                <h3>Wellness Venue</h3>
                <p>Day spas, bathhouses, treatment centres, wellness centres & hotel spas</p>
                <span className="category-card-cta">Select →</span>
              </button>
              <button
                className="category-card retreat"
                onClick={() => { setForm({ ...emptyRetreatForm }); setStep('retreat'); }}
              >
                <div className="category-card-icon">
                  <Globe size={32} />
                </div>
                <h3>Retreat Venue</h3>
                <p>Group retreats, private hire, yoga, meditation & permaculture</p>
                <span className="category-card-cta">Select →</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============= RETREAT FORM =============
  if (step === 'retreat') {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-container venue-form-wide" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <div>
              <h2 className="modal-title">{mode === 'edit' ? 'Edit Retreat Venue' : 'Add Retreat Venue'}</h2>
              <p style={{ fontSize: 12, color: '#B8B8B8', marginTop: 2 }}>
                <Sparkles size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
                Retreat Venue
              </p>
            </div>
            <button className="modal-close" onClick={onClose}><X size={20} /></button>
          </div>

          <form onSubmit={handleSubmit} className="modal-body venue-form-scroll">

            {/* ====== RETREAT BASIC INFORMATION ====== */}
            <SectionHeader id="basic" title="Basic Information" subtitle="Vitals, venue types, and hire type" expandedSections={expandedSections} toggleSection={toggleSection} />
            {expandedSections.basic && (
              <div className="venue-form-section-content">
                <div className="form-group">
                  <label className="form-label">Venue Name *</label>
                  <input className="form-input" name="name" value={form.name} onChange={handleChange} required placeholder="e.g. Moraea Farm" />
                </div>

                <div className="form-group">
                  <label className="form-label">Short Description</label>
                  <input className="form-input" name="shortDescription" value={form.shortDescription || ''} onChange={handleChange} placeholder="e.g. A luxury farm stay in the heart of the valley" />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Hire Type</label>
                    <select className="form-select" name="hireType" value={form.hireType || ''} onChange={handleChange}>
                      {HIRE_TYPE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Status</label>
                    <select className="form-select" name="status" value={form.status} onChange={handleChange}>
                      <option value="Active">Active</option>
                      <option value="Draft">Draft</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Retreat Venue Type (Select all that apply)</label>
                  <div className="checkbox-grid">
                    {RETREAT_VENUE_TYPE_OPTIONS.map(opt => (
                      <label key={opt} className={`checkbox-chip${(form.retreatVenueType || []).includes(opt) ? ' active' : ''}`}>
                        <input type="checkbox" checked={(form.retreatVenueType || []).includes(opt)} onChange={() => toggleRetreatVenueType(opt)} />
                        {opt}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Full Location *</label>
                    <input className="form-input" name="location" value={form.location} onChange={handleChange} required placeholder="e.g. Berry, NSW, Australia" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Short Location *</label>
                    <input className="form-input" name="shortLoc" value={form.shortLoc} onChange={handleChange} required placeholder="e.g. Berry, NSW" />
                  </div>
                </div>
              </div>
            )}

            {/* ====== RETREAT EDITORIAL CONTENT ====== */}
            <SectionHeader id="content" title="Editorial Content" subtitle="Hero quote and intro text" expandedSections={expandedSections} toggleSection={toggleSection} />
            {expandedSections.content && (
              <div className="venue-form-section-content">
                <div className="form-group">
                  <label className="form-label">Hero Quote</label>
                  <textarea className="form-input" name="quote" value={form.quote || ''} onChange={handleChange} rows={2} placeholder="Hero overlay text..." />
                </div>
                <div className="form-group">
                  <label className="form-label">Introduction Text</label>
                  <textarea className="form-input" name="introText" value={form.introText || ''} onChange={handleChange} rows={6} placeholder="The editorial voice of the listing..." />
                </div>

                <div className="form-group">
                  <label className="form-label">Hero Image</label>
                  <div className="upload-container">
                    <label className="upload-box">
                      <input type="file" accept="image/*" onChange={handleHeroUpload} hidden disabled={isUploadingHero} />
                      {isUploadingHero ? (
                        <Loader2 className="animate-spin" size={24} color="#4A7C59" />
                      ) : (
                        <>
                          {form.heroImage ? (
                            <img src={form.heroImage} alt="Hero" className="preview-image" />
                          ) : (
                            <>
                              <Upload size={24} color="#B8B8B8" />
                              <span style={{ marginTop: 8, fontSize: 13, color: '#666' }}>Upload Hero Image</span>
                            </>
                          )}
                        </>
                      )}
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* ====== PROPERTY DETAILS ====== */}
            <SectionHeader id="property" title="Property Details" subtitle="Size, year, and architecture" expandedSections={expandedSections} toggleSection={toggleSection} />
            {expandedSections.property && (
              <div className="venue-form-section-content">
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Property Size</label>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <input type="number" className="form-input" name="propertySizeValue" value={form.propertySizeValue || 0} onChange={handleChange} placeholder="25" />
                      <select className="form-select" name="propertySizeUnit" value={form.propertySizeUnit || 'Acres'} onChange={handleChange} style={{ width: 120 }}>
                        <option value="Acres">Acres</option>
                        <option value="Hectares">Hectares</option>
                        <option value="sqm">sqm</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Year Established</label>
                    <input className="form-input" name="established" value={form.established || ''} onChange={handleChange} placeholder="e.g. 2018" />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Architecture Style</label>
                  <select className="form-select" name="architectureStyle" value={form.architectureStyle || ''} onChange={handleChange}>
                    <option value="">Select style...</option>
                    {ARCHITECTURE_STYLE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Factual Property Description</label>
                  <textarea className="form-input" name="description" value={form.description} onChange={handleChange} rows={4} placeholder="General property info..." />
                </div>
              </div>
            )}

            {/* ====== THE EXPERIENCE ====== */}
            <SectionHeader id="experience" title="The Experience" subtitle="Featured block on the Overview tab" expandedSections={expandedSections} toggleSection={toggleSection} />
            {expandedSections.experience && (
              <div className="venue-form-section-content">
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Experience Title</label>
                    <input className="form-input" name="experienceTitle" value={form.experienceTitle || ''} onChange={handleChange} placeholder="e.g. A Space for Transformation" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Experience Subtitle</label>
                    <input className="form-input" name="experienceSubtitle" value={form.experienceSubtitle || ''} onChange={handleChange} placeholder="e.g. The Experience" />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Experience Description</label>
                  <textarea className="form-input" name="experienceDescription" value={form.experienceDescription || ''} onChange={handleChange} rows={5} placeholder="Describe the transformative experience guests will enjoy at this venue..." style={{ resize: 'vertical' }} />
                </div>
                <div className="form-group">
                  <label className="form-label">Experience Feature Image</label>
                  <label className="experience-image-upload">
                    <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleSingleUpload(e.target.files[0], 'experienceFeatureImage')} hidden />
                    {form.experienceFeatureImage ? (
                      <img src={form.experienceFeatureImage} alt="Feature" />
                    ) : (
                      <>
                        <Upload size={28} color="#B8B8B8" />
                        <span style={{ fontSize: 13, color: '#888', fontWeight: 500 }}>Click to upload a feature image</span>
                        <span style={{ fontSize: 11, color: '#aaa' }}>JPG, PNG • recommended 1200×800</span>
                      </>
                    )}
                  </label>
                </div>

                {/* ====== RETREAT LOCATION EXTENDED ====== */}
                <SectionHeader id="location_ext" title="Location Details" subtitle="Full address, climate, and transport" expandedSections={expandedSections} toggleSection={toggleSection} />
                {expandedSections.location_ext && (
                  <div className="venue-form-section-content">
                    <div className="form-group">
                      <label className="form-label">Street Address</label>
                      <input className="form-input" name="streetAddress" value={form.streetAddress || ''} onChange={handleChange} placeholder="123 Farm Rd" />
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">Suburb</label>
                        <input className="form-input" name="suburb" value={form.suburb || ''} onChange={handleChange} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Postcode</label>
                        <input className="form-input" name="postcode" value={form.postcode || ''} onChange={handleChange} />
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">State/Province</label>
                        <input className="form-input" name="stateProvince" value={form.stateProvince || ''} onChange={handleChange} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Country</label>
                        <input className="form-input" name="country" value={form.country || ''} onChange={handleChange} />
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">Climate</label>
                        <select className="form-select" name="climate" value={form.climate || ''} onChange={handleChange}>
                          <option value="">Select climate...</option>
                          {CLIMATE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Nearest Airport</label>
                        <input className="form-input" name="nearestAirport" value={form.nearestAirport || ''} onChange={handleChange} placeholder="e.g. Brisbane (BNE)" />
                      </div>
                    </div>
                  </div>
                )}

                {/* ====== STATUS & LISTING ====== */}
                <SectionHeader id="status_listing" title="Status & Listing" subtitle="Vetting, listing flags, and internal notes" expandedSections={expandedSections} toggleSection={toggleSection} />
                {expandedSections.status_listing && (
                  <div className="venue-form-section-content">
                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">Property Status</label>
                        <select className="form-select" name="propertyStatus" value={form.propertyStatus || ''} onChange={handleChange}>
                          {PROPERTY_STATUS_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                      </div>
                    </div>
                    <div className="checkbox-grid" style={{ marginTop: 16 }}>
                      <label className={`checkbox-chip${form.sanctumVetted ? ' active' : ''}`}>
                        <input type="checkbox" name="sanctumVetted" checked={form.sanctumVetted || false} onChange={handleChange} />
                        Sanctum Vetted
                      </label>
                      <label className={`checkbox-chip${form.featuredListing ? ' active' : ''}`}>
                        <input type="checkbox" name="featuredListing" checked={form.featuredListing || false} onChange={handleChange} />
                        Featured Listing
                      </label>
                      <label className={`checkbox-chip${form.instantBooking ? ' active' : ''}`}>
                        <input type="checkbox" name="instantBooking" checked={form.instantBooking || false} onChange={handleChange} />
                        Instant Booking
                      </label>
                    </div>
                    <div className="form-group" style={{ marginTop: 16 }}>
                      <label className="form-label">Internal Notes</label>
                      <textarea className="form-input" name="internalNotes" value={form.internalNotes || ''} onChange={handleChange} rows={3} placeholder="Private notes for staff..." />
                    </div>
                  </div>
                )}

                {/* ====== ACCOMMODATION DETAILS ====== */}
                <SectionHeader id="accommodation_retreat" title="Accommodation Details" subtitle="Guest capacity, bedrooms, and property type" expandedSections={expandedSections} toggleSection={toggleSection} />
                {expandedSections.accommodation_retreat && (
                  <div className="venue-form-section-content">
                    {/* Property Info */}
                    <div className="form-subsection">
                      <div className="form-subsection-label"><span className="subsection-icon">🏠</span> Property Info</div>
                      <div className="form-row">
                        <div className="form-group">
                          <label className="form-label">Property Type</label>
                          <input className="form-input" name="propertyType" value={form.propertyType || ''} onChange={handleChange} placeholder="e.g. Homestead, Villa" />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Accommodation Style</label>
                          <input className="form-input" name="accommodationStyle" value={form.accommodationStyle || ''} onChange={handleChange} placeholder="e.g. Luxury Farmhouse" />
                        </div>
                      </div>
                    </div>

                    {/* Guest Capacity */}
                    <div className="form-subsection">
                      <div className="form-subsection-label"><span className="subsection-icon">👥</span> Guest Capacity</div>
                      <div className="capacity-cards">
                        <div className="capacity-card">
                          <span className="capacity-label">Minimum Guests</span>
                          <div className="capacity-value">
                            <input type="number" name="minGuests" value={form.minGuests || 1} onChange={handleChange} min={1} />
                          </div>
                        </div>
                        <div className="capacity-card">
                          <span className="capacity-label">Maximum Guests</span>
                          <div className="capacity-value">
                            <input type="number" name="maxGuests" value={form.maxGuests || 0} onChange={handleChange} min={0} />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Rooms & Bathrooms */}
                    <div className="form-subsection">
                      <div className="form-subsection-label"><span className="subsection-icon">🚿</span> Rooms & Bathrooms</div>
                      <div className="capacity-cards">
                        <div className="capacity-card">
                          <span className="capacity-label">Total Bedrooms</span>
                          <div className="capacity-value">
                            <input type="number" name="totalBedrooms" value={form.totalBedrooms || 0} onChange={handleChange} min={0} />
                          </div>
                        </div>
                        <div className="capacity-card">
                          <span className="capacity-label">Total Bathrooms</span>
                          <div className="capacity-value">
                            <input type="number" name="totalBathrooms" value={form.totalBathrooms || 0} onChange={handleChange} min={0} />
                          </div>
                        </div>
                        <div className="capacity-card">
                          <span className="capacity-label">Shared Bathrooms</span>
                          <div className="capacity-value">
                            <input type="number" name="sharedBathrooms" value={form.sharedBathrooms || 0} onChange={handleChange} min={0} />
                          </div>
                        </div>
                        <div className="capacity-card">
                          <span className="capacity-label">Private Ensuites</span>
                          <div className="capacity-value">
                            <input type="number" name="privateEnsuites" value={form.privateEnsuites || 0} onChange={handleChange} min={0} />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bed Configuration */}
                    <div className="form-subsection">
                      <div className="form-subsection-label"><span className="subsection-icon">🛏️</span> Bed Configuration</div>
                      <div className="bed-config-grid">
                        {([
                          ['bedConfigKing', '👑', 'King'],
                          ['bedConfigQueen', '🛏️', 'Queen'],
                          ['bedConfigDouble', '🛌', 'Double'],
                          ['bedConfigSingle', '🛏️', 'Single'],
                          ['bedConfigTwin', '🛏️', 'Twin'],
                          ['bedConfigBunk', '🪜', 'Bunk'],
                        ] as [string, string, string][]).map(([field, icon, label]) => {
                          const val = (form as any)[field] || 0;
                          return (
                            <div key={field} className={`bed-config-card${val > 0 ? ' has-value' : ''}`}>
                              <div className="bed-config-label">
                                <span className="bed-icon">{icon}</span>
                                <span>{label}</span>
                              </div>
                              <div className="bed-config-stepper">
                                <button type="button" onClick={() => setForm(prev => ({ ...prev, [field]: Math.max(0, val - 1) }))}>−</button>
                                <span className="bed-count">{val}</span>
                                <button type="button" onClick={() => setForm(prev => ({ ...prev, [field]: val + 1 }))}>+</button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* ====== POLICIES ====== */}
                <SectionHeader id="policies_retreat" title="Policies & House Rules" subtitle="Check-in/out times, rules, and venue policy" expandedSections={expandedSections} toggleSection={toggleSection} />
                {expandedSections.policies_retreat && (
                  <div className="venue-form-section-content">
                    {/* Check-in / Check-out Card */}
                    <div className="policies-card">
                      <div className="policies-card-header">
                        <span className="policy-icon">🕐</span>
                        <h4>Check-in & Check-out</h4>
                      </div>
                      <div className="policies-card-body">
                        <div className="form-row">
                          <div className="form-group" style={{ marginBottom: 8 }}>
                            <label className="form-label">Check-in Time</label>
                            <input type="time" className="form-input" name="checkInTime" value={form.checkInTime || ''} onChange={handleChange} />
                          </div>
                          <div className="form-group" style={{ marginBottom: 8 }}>
                            <label className="form-label">Check-out Time</label>
                            <input type="time" className="form-input" name="checkOutTime" value={form.checkOutTime || ''} onChange={handleChange} />
                          </div>
                        </div>
                        <div className="toggle-grid" style={{ marginTop: 8 }}>
                          <div className="toggle-row">
                            <label className="toggle-switch">
                              <input type="checkbox" name="earlyCheckInAvailable" checked={form.earlyCheckInAvailable || false} onChange={handleChange} />
                              <span className="toggle-slider"></span>
                            </label>
                            <span>Early Check-in Available</span>
                          </div>
                          <div className="toggle-row">
                            <label className="toggle-switch">
                              <input type="checkbox" name="lateCheckOutAvailable" checked={form.lateCheckOutAvailable || false} onChange={handleChange} />
                              <span className="toggle-slider"></span>
                            </label>
                            <span>Late Check-out Available</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* House Rules Card */}
                    <div className="policies-card">
                      <div className="policies-card-header">
                        <span className="policy-icon">📋</span>
                        <h4>House Rules</h4>
                      </div>
                      <div className="policies-card-body">
                        <div className="toggle-grid">
                          <div className="toggle-row">
                            <label className="toggle-switch">
                              <input type="checkbox" name="childrenAllowed" checked={form.childrenAllowed || false} onChange={handleChange} />
                              <span className="toggle-slider"></span>
                            </label>
                            <span>Children Allowed</span>
                          </div>
                          <div className="toggle-row">
                            <label className="toggle-switch">
                              <input type="checkbox" name="petsAllowed" checked={form.petsAllowed || false} onChange={handleChange} />
                              <span className="toggle-slider"></span>
                            </label>
                            <span>Pets Allowed</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Venue Policies Text Card */}
                    <div className="policies-card">
                      <div className="policies-card-header">
                        <span className="policy-icon">📝</span>
                        <h4>Venue Policies</h4>
                      </div>
                      <div className="policies-card-body">
                        <div className="form-group" style={{ marginBottom: 0 }}>
                          <label className="form-label">Write your venue's policies, cancellation terms, and any rules guests should know</label>
                          <textarea className="form-input" name="venuePolicies" value={form.venuePolicies || ''} onChange={handleChange} rows={6} placeholder="e.g. Cancellation policy: Full refund if cancelled 30 days before check-in. No smoking on the property. Quiet hours from 10pm to 7am..." style={{ resize: 'vertical' }} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={isUploadingHero}>
                {mode === 'edit' ? 'Save Changes' : 'Create Retreat'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Tag chip renderer
  const TagChips = ({ field, color = '#313131', bg = '#F7F5F1' }: { field: 'amenities' | 'languages' | 'whatsIncluded' | 'modalities'; color?: string; bg?: string }) => {
    const arr = (form[field] as string[]) || [];
    if (!arr.length) return null;
    return (
      <div className="tag-chips">
        {arr.map(tag => (
          <span key={tag} className="tag-chip" style={{ backgroundColor: bg, color }}>
            {tag}
            <button type="button" onClick={() => removeTag(field as any, tag)} className="tag-chip-remove">×</button>
          </span>
        ))}
      </div>
    );
  };

  // ============= WELLNESS FORM =============
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container venue-form-wide" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2 className="modal-title">{mode === 'edit' ? 'Edit Wellness Venue' : 'Add Wellness Venue'}</h2>
            <p style={{ fontSize: 12, color: '#B8B8B8', marginTop: 2 }}>
              <Sparkles size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
              Wellness Venue
            </p>
          </div>
          <button className="modal-close" onClick={onClose}><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body venue-form-scroll">

          {/* ====== BASIC INFORMATION ====== */}
          <SectionHeader id="basic" title="Basic Information" subtitle="Name, description, and location" expandedSections={expandedSections} toggleSection={toggleSection} />
          {expandedSections.basic && (
            <div className="venue-form-section-content">
              <div className="form-group">
                <label className="form-label">Venue Name *</label>
                <input className="form-input" name="name" value={form.name} onChange={handleChange} required placeholder="e.g. Soak Wellness Brisbane" />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-input" name="description" value={form.description} onChange={handleChange} rows={3} placeholder="Brief description of the venue..." style={{ resize: 'vertical' }} />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Full Location *</label>
                  <input className="form-input" name="location" value={form.location} onChange={handleChange} required placeholder="e.g. West End, QLD, Australia" />
                </div>
                <div className="form-group">
                  <label className="form-label">Short Location *</label>
                  <input className="form-input" name="shortLoc" value={form.shortLoc} onChange={handleChange} required placeholder="e.g. West End, QLD" />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Venue Type</label>
                  <select className="form-select" name="venueTypeCategory" value={form.venueTypeCategory} onChange={handleChange}>
                    {VENUE_TYPE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Established</label>
                  <input className="form-input" type="date" name="established" value={form.established} onChange={handleChange} />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Capacity *</label>
                  <input className="form-input" type="number" name="capacity" value={form.capacity} onChange={handleChange} min={1} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Location Setting</label>
                  <select className="form-select" name="locationSetting" value={form.locationSetting} onChange={handleChange}>
                    <option value="">Select Setting...</option>
                    {SETTING_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Website</label>
                  <input className="form-input" name="website" value={form.website} onChange={handleChange} placeholder="https://" />
                </div>
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select className="form-select" name="status" value={form.status} onChange={handleChange}>
                    <option value="Active">Active</option>
                    <option value="Draft">Draft</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Available</label>
                <div className="toggle-row">
                  <label className="toggle-switch">
                    <input type="checkbox" name="isAvailable" checked={form.isAvailable} onChange={handleChange} />
                    <span className="toggle-slider"></span>
                  </label>
                  <span style={{ fontSize: 13 }}>{form.isAvailable ? 'Yes — Open' : 'No — Closed'}</span>
                </div>
              </div>
            </div>
          )}

          {/* ====== SERVICES & HOURS ====== */}
          <SectionHeader id="services" title="Services & Hours" subtitle="Services offered, operating hours, and packages" />
          {
            expandedSections.services && (
              <div className="venue-form-section-content">
                <div className="form-group">
                  <label className="form-label">Key Services & Pricing</label>
                  <datalist id="modality-suggestions">
                    {MODALITY_OPTIONS.map(opt => <option key={opt} value={opt} />)}
                  </datalist>
                  <div className="tag-input-row">
                    <input
                      className="form-input"
                      list="modality-suggestions"
                      value={serviceInput}
                      onChange={e => setServiceInput(e.target.value)}
                      placeholder="Select or type a service name"
                      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddService(); } }}
                    />
                    <input
                      className="form-input"
                      style={{ width: '100px' }}
                      value={serviceDurationInput}
                      onChange={e => setServiceDurationInput(e.target.value)}
                      placeholder="Duration"
                      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddService(); } }}
                    />
                    <input
                      className="form-input"
                      style={{ width: '90px' }}
                      value={servicePriceInput}
                      onChange={e => setServicePriceInput(e.target.value)}
                      placeholder="Price"
                      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddService(); } }}
                    />
                    <button type="button" className="btn btn-secondary btn-small" onClick={handleAddService}>Add</button>
                  </div>

                  {(form.services || []).length > 0 && (
                    <div className="package-list" style={{ marginTop: '12px' }}>
                      {form.services!.map((svc: VenueService, i: number) => (
                        <div key={i} className="package-item">
                          <div className="package-info">
                            <span className="package-name">{svc.name}</span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              {svc.duration && <span style={{ fontSize: 11, color: '#B8B8B8', backgroundColor: '#F0F0F0', padding: '2px 6px', borderRadius: 4 }}>{svc.duration}</span>}
                              <span className="package-price">{svc.price}</span>
                            </div>
                          </div>
                          <button type="button" className="btn-icon btn-small text-danger" onClick={() => handleRemoveService(i)}>
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Opening Time</label>
                    <input className="form-input" type="time" name="openingTime" value={form.openingTime} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Closing Time</label>
                    <input className="form-input" type="time" name="closingTime" value={form.closingTime} onChange={handleChange} />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Availability Time</label>
                  <input className="form-input" name="availabilityTime" value={form.availabilityTime} onChange={handleChange} placeholder="e.g. Open Daily 7am – 10pm" />
                </div>

                <div className="form-group">
                  <label className="form-label">Packages</label>
                  <div style={{
                    backgroundColor: '#F9FBF9',
                    padding: 16,
                    borderRadius: 12,
                    border: '1px solid #E5E9E5',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 12
                  }}>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 140px',
                      gap: 12
                    }}>
                      <input
                        className="form-input"
                        value={packageInput}
                        onChange={e => setPackageInput(e.target.value)}
                        placeholder="e.g. Couples Retreat Package"
                        style={{ backgroundColor: '#FFF' }}
                      />
                      <input
                        className="form-input"
                        value={packagePriceInput}
                        onChange={e => setPackagePriceInput(e.target.value)}
                        placeholder="+ $150"
                        style={{ backgroundColor: '#FFF' }}
                      />
                    </div>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      flexWrap: 'wrap'
                    }}>
                      <div style={{ flex: 1, minWidth: 200 }}>
                        <div className="upload-container" style={{ minHeight: 46, backgroundColor: '#FFF' }}>
                          {packageThumbnailInput ? (
                            <div className="hero-preview" style={{ height: 46, borderRadius: 8 }}>
                              <img src={packageThumbnailInput} alt="Package" style={{ height: '100%', objectFit: 'cover' }} />
                              <button type="button" className="remove-hero" onClick={() => setPackageThumbnailInput('')}>
                                <Trash2 size={12} />
                              </button>
                            </div>
                          ) : (
                            <label className="upload-placeholder" style={{ padding: '8px 12px', border: '1px dashed #DDD', cursor: 'pointer' }}>
                              <input type="file" accept="image/*" onChange={handlePackageThumbnailUpload} style={{ display: 'none' }} />
                              {isUploadingPackageThumbnail ? (
                                <Loader2 className="animate-spin" size={16} />
                              ) : (
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#666' }}>
                                  <Upload size={16} />
                                  <span>Package Thumbnail</span>
                                </div>
                              )}
                            </label>
                          )}
                        </div>
                      </div>
                      <button
                        type="button"
                        className="btn btn-primary"
                        style={{ height: 46, padding: '0 24px', whiteSpace: 'nowrap' }}
                        onClick={handleAddPackage}
                      >
                        Add Package
                      </button>
                    </div>
                  </div>

                  {(form.packages || []).length > 0 ? (
                    <div className="addon-list" style={{ marginTop: 16 }}>
                      {form.packages!.map((pkg: VenuePackage, i: number) => (
                        <div key={i} className="addon-item" style={{
                          backgroundColor: '#FEF9E7',
                          borderColor: '#9A7B3C20',
                          padding: '10px 14px',
                          display: 'flex',
                          alignItems: 'center',
                          borderRadius: 10
                        }}>
                          {pkg.thumbnail && (
                            <img src={pkg.thumbnail} alt="" style={{ width: 36, height: 36, borderRadius: 6, objectFit: 'cover', marginRight: 12 }} />
                          )}
                          <div style={{ flex: 1 }}>
                            <div className="addon-name" style={{ color: '#9A7B3C', fontWeight: 600 }}>{pkg.name}</div>
                            <div className="addon-price" style={{ color: '#9A7B3C', opacity: 0.8, fontSize: 12 }}>{pkg.price}</div>
                          </div>
                          <button type="button" className="addon-remove" onClick={() => handleRemovePackage(i)}>×</button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="form-helper" style={{ textAlign: 'center', marginTop: 12 }}>No packages added yet</p>
                  )}
                </div>

                {/* ====== PRACTITIONERS ====== */}
                <div className="form-group" style={{ marginTop: 24 }}>
                  <SectionHeader id="practitioners" title="Practitioners" subtitle="Add experts and practitioners for this venue" />
                  {expandedSections.practitioners && (
                    <div className="venue-form-section-content">
                      <div className="form-row">
                        <div className="form-group" style={{ flex: 1 }}>
                          <label className="form-label">Practitioner Name</label>
                          <input
                            className="form-input"
                            value={practitionerNameInput}
                            onChange={e => setPractitionerNameInput(e.target.value)}
                            placeholder="e.g. Dr. Sarah Chen"
                          />
                        </div>
                        <div className="form-group" style={{ flex: 1 }}>
                          <label className="form-label">Practitioner Photo</label>
                          <div className="upload-container" style={{ minHeight: 46 }}>
                            {practitionerPhotoInput ? (
                              <div className="hero-preview" style={{ height: 46, borderRadius: 8 }}>
                                <img src={practitionerPhotoInput} alt="Practitioner" style={{ height: '100%', objectFit: 'cover' }} />
                                <button type="button" className="remove-hero" onClick={() => setPractitionerPhotoInput('')}>
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            ) : (
                              <label className="upload-placeholder" style={{ padding: '8px 12px' }}>
                                <input type="file" accept="image/*" onChange={handlePractitionerPhotoUpload} style={{ display: 'none' }} />
                                {isUploadingPractitioner ? (
                                  <Loader2 className="animate-spin" size={16} />
                                ) : (
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                                    <Upload size={16} />
                                    <span>Upload Photo</span>
                                  </div>
                                )}
                              </label>
                            )}
                          </div>
                        </div>
                        <button
                          type="button"
                          className="btn btn-secondary"
                          style={{ alignSelf: 'flex-end', height: 46 }}
                          onClick={handleAddPractitioner}
                        >
                          Add Staff
                        </button>
                      </div>

                      {(form.practitioners || []).length > 0 && (
                        <div className="practitioner-grid" style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                          gap: 12,
                          marginTop: 16
                        }}>
                          {form.practitioners!.map(p => (
                            <div key={p.id} className="practitioner-card" style={{
                              padding: 10,
                              borderRadius: 12,
                              border: '1px solid #F1F1F1',
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              position: 'relative'
                            }}>
                              <img
                                src={p.photo}
                                alt={p.name}
                                style={{ width: 60, height: 60, borderRadius: '50%', objectFit: 'cover', marginBottom: 8 }}
                              />
                              <span style={{ fontSize: 13, fontWeight: 600, textAlign: 'center' }}>{p.name}</span>
                              <button
                                type="button"
                                onClick={() => handleRemovePractitioner(p.id)}
                                style={{
                                  position: 'absolute',
                                  top: 4,
                                  right: 4,
                                  border: 'none',
                                  background: '#FFF0F0',
                                  color: '#FF5C5C',
                                  width: 22,
                                  height: 22,
                                  borderRadius: '50%',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                }}
                              >
                                <X size={12} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )
          }

          {/* ====== DETAILS & ACCESSIBILITY ====== */}
          <SectionHeader id="details" title="Details & Accessibility" subtitle="Best for, accessibility, languages, and policies" />
          {
            expandedSections.details && (
              <div className="venue-form-section-content">
                <div className="form-group">
                  <label className="form-label">Best For</label>
                  <div className="checkbox-grid">
                    {BEST_FOR_OPTIONS.map(opt => (
                      <label key={opt} className={`checkbox-chip${(form.bestFor || []).includes(opt) ? ' active' : ''}`}>
                        <input type="checkbox" checked={(form.bestFor || []).includes(opt)} onChange={() => toggleBestFor(opt)} />
                        {opt}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Wheelchair Accessible</label>
                    <div className="toggle-row">
                      <label className="toggle-switch">
                        <input type="checkbox" name="wheelchairAccessible" checked={form.wheelchairAccessible} onChange={handleChange} />
                        <span className="toggle-slider"></span>
                      </label>
                      <span style={{ fontSize: 13 }}>{form.wheelchairAccessible ? '♿ Yes' : 'No'}</span>
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Languages</label>
                  <datalist id="language-suggestions">
                    {LANGUAGE_OPTIONS.map(lang => <option key={lang} value={lang} />)}
                  </datalist>
                  <div className="tag-input-row">
                    <input
                      className="form-input"
                      list="language-suggestions"
                      value={languageInput}
                      onChange={e => setLanguageInput(e.target.value)}
                      placeholder="Select or type a language"
                      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag('languages', languageInput); setLanguageInput(''); } }}
                    />
                    <button type="button" className="btn btn-secondary btn-small" onClick={() => { addTag('languages', languageInput); setLanguageInput(''); }}>Add</button>
                  </div>
                  <TagChips field="languages" bg="#E8EFF9" color="#6B8EC9" />
                </div>


                {/* ====== DETAILED POLICIES & PRACTICAL INFO ====== */}
                <div style={{ marginTop: 24 }}>
                  <SectionHeader id="policies_detail" title="Detailed Policies & Practical Info" subtitle="House rules, booking, cancellation, and directions" />
                  {expandedSections.policies_detail && (
                    <div className="venue-form-section-content">
                      <div className="form-group">
                        <label className="form-label">House Rules</label>
                        <textarea className="form-input" name="houseRules" value={form.houseRules} onChange={handleChange} rows={3} placeholder="e.g. Please keep noise levels low in common areas. No smoking." style={{ resize: 'vertical' }} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Health & Safety</label>
                        <textarea className="form-input" name="healthSafety" value={form.healthSafety} onChange={handleChange} rows={3} placeholder="e.g. First aid kits available at reception. Qualified lifeguards on duty." style={{ resize: 'vertical' }} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Age Requirements</label>
                        <textarea className="form-input" name="ageRequirements" value={form.ageRequirements} onChange={handleChange} rows={2} placeholder="e.g. Minimum age is 18. Children 12-17 must be accompanied by an adult." style={{ resize: 'vertical' }} />
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label className="form-label">Booking Policy</label>
                          <textarea className="form-input" name="bookingPolicy" value={form.bookingPolicy} onChange={handleChange} rows={3} placeholder="e.g. 50% deposit required at booking." style={{ resize: 'vertical' }} />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Cancellation Policy</label>
                          <textarea className="form-input" name="cancellationPolicy" value={form.cancellationPolicy} onChange={handleChange} rows={3} placeholder="e.g. Free cancellation up to 48 hours before." style={{ resize: 'vertical' }} />
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Directions</label>
                        <textarea className="form-input" name="directions" value={form.directions} onChange={handleChange} rows={3} placeholder="Detailed instructions on how to find the venue..." style={{ resize: 'vertical' }} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
          }

          {/* ====== PROPERTY OWNER ====== */}
          <SectionHeader id="owner" title="Property Owner" subtitle="Contact information for the property owner" />
          {
            expandedSections.owner && (
              <div className="venue-form-section-content">
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Owner Name *</label>
                    <input className="form-input" name="owner" value={form.owner} onChange={handleChange} required placeholder="Full name" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email *</label>
                    <input className="form-input" type="email" name="email" value={form.email} onChange={handleChange} required placeholder="email@example.com" />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Phone</label>
                    <input className="form-input" name="phone" value={form.phone} onChange={handleChange} placeholder="+61 400 000 000" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Address</label>
                    <input className="form-input" name="ownerAddress" value={form.ownerAddress} onChange={handleChange} placeholder="Street address, city, postcode" />
                  </div>
                </div>
              </div>
            )
          }

          {/* ====== CONTENT & MEDIA ====== */}
          <SectionHeader id="content" title="Content & Media" subtitle="Hero image, quote, and introduction paragraphs" />
          {
            expandedSections.content && (
              <div className="venue-form-section-content">
                <div className="form-group">
                  <label className="form-label">Hero Image</label>
                  <div className="upload-container">
                    <label className="upload-box" style={{
                      border: '2px dashed rgba(184, 184, 184, 0.3)',
                      borderRadius: '12px',
                      padding: '24px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      cursor: 'pointer',
                      backgroundColor: '#FAFAFA',
                      transition: 'all 0.2s ease'
                    }}>
                      <input type="file" accept="image/*" onChange={handleHeroUpload} hidden disabled={isUploadingHero} />
                      {isUploadingHero ? (
                        <>
                          <Loader2 className="animate-spin" size={24} color="#4A7C59" />
                          <span style={{ marginTop: '8px', fontSize: '13px', color: '#666' }}>Uploading...</span>
                        </>
                      ) : (
                        <>
                          <Upload size={24} color="#B8B8B8" />
                          <span style={{ marginTop: '8px', fontSize: '13px', color: '#666' }}>Click to upload hero image</span>
                        </>
                      )}
                    </label>
                  </div>
                  {form.heroImage && (
                    <div className="hero-image-preview" style={{ position: 'relative', marginTop: '12px' }}>
                      <img src={form.heroImage} alt="Hero preview" style={{ width: '100%', borderRadius: '10px' }} />
                      <button
                        type="button"
                        className="photo-remove-btn"
                        style={{
                          position: 'absolute',
                          top: '8px',
                          right: '8px',
                          background: 'rgba(196, 92, 92, 0.9)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '50%',
                          width: '24px',
                          height: '24px',
                          cursor: 'pointer'
                        }}
                        onClick={() => setForm((prev: VenueFormData) => { deleteFile(prev.heroImage!); return { ...prev, heroImage: '' }; })}
                      >
                        ×
                      </button>
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Sample Gallery Photos (Max 8)</label>
                  <div className="gallery-preview-grid">
                    {(form.galleryPhotos || []).map((url, i) => (
                      <div key={i} className="gallery-preview-item" style={{ position: 'relative' }}>
                        <img src={url} alt={`Gallery ${i}`} style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', borderRadius: '8px' }} />
                        <button type="button" className="gallery-item-remove" onClick={() => handleRemoveGalleryPhoto(url)}>×</button>
                      </div>
                    ))}
                    {(form.galleryPhotos || []).length < 8 && (
                      <label className="gallery-upload-placeholder" style={{
                        aspectRatio: '1',
                        border: '2px dashed rgba(184, 184, 184, 0.3)',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        backgroundColor: '#FAFAFA'
                      }}>
                        <input type="file" accept="image/*" multiple onChange={handleGalleryUpload} hidden disabled={isUploadingGlobal} />
                        {isUploadingGlobal ? (
                          <Loader2 className="animate-spin" size={20} color="#4A7C59" />
                        ) : (
                          <Plus size={20} color="#B8B8B8" />
                        )}
                      </label>
                    )}
                  </div>
                  <p className="form-helper">{(form.galleryPhotos || []).length}/8 photos added</p>
                </div>

                <div className="form-group">
                  <label className="form-label">Quote</label>
                  <input className="form-input" name="quote" value={form.quote} onChange={handleChange} placeholder="e.g. A sanctuary for the senses..." />
                </div>

                <div className="form-group">
                  <label className="form-label">Introduction Paragraph 1</label>
                  <textarea className="form-input" name="introParagraph1" value={form.introParagraph1} onChange={handleChange} rows={3} placeholder="First introduction paragraph" style={{ resize: 'vertical' }} />
                </div>

                <div className="form-group">
                  <label className="form-label">Introduction Paragraph 2</label>
                  <textarea className="form-input" name="introParagraph2" value={form.introParagraph2} onChange={handleChange} rows={3} placeholder="Second introduction paragraph" style={{ resize: 'vertical' }} />
                </div>

                <div className="form-group">
                  <label className="form-label">What's Included</label>
                  <div className="tag-input-row">
                    <input className="form-input" value={whatsIncludedInput} onChange={e => setWhatsIncludedInput(e.target.value)} placeholder="e.g. Towel, Robe, Locker" onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag('whatsIncluded', whatsIncludedInput); setWhatsIncludedInput(''); } }} />
                    <button type="button" className="btn btn-secondary btn-small" onClick={() => { addTag('whatsIncluded', whatsIncludedInput); setWhatsIncludedInput(''); }}>Add</button>
                  </div>
                  <TagChips field="whatsIncluded" />
                </div>
              </div>
            )
          }

          {/* ====== ADD-ONS ====== */}
          <SectionHeader id="addons" title="Add-Ons" subtitle="Optional extras available for guests" />
          {
            expandedSections.addons && (
              <div className="venue-form-section-content">
                <div className="addon-input-row">
                  <div style={{ flex: 3 }}>
                    <label className="form-label" style={{ fontSize: 11 }}>Add-On Name</label>
                    <input className="form-input" value={addOnName} onChange={e => setAddOnName(e.target.value)} placeholder="e.g. Aromatherapy Upgrade" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label className="form-label" style={{ fontSize: 11 }}>Price</label>
                    <input className="form-input" value={addOnPrice} onChange={e => setAddOnPrice(e.target.value)} placeholder="+ $25" />
                  </div>
                  <button type="button" className="btn btn-secondary btn-small" style={{ alignSelf: 'flex-end', marginBottom: 1 }} onClick={handleAddAddOn}>Add</button>
                </div>

                {(form.addOns || []).length > 0 ? (
                  <div className="addon-list">
                    {form.addOns!.map((addon, i) => (
                      <div key={i} className="addon-item">
                        <span className="addon-name">{addon.name}</span>
                        <span className="addon-price">{addon.price}</span>
                        <button type="button" className="addon-remove" onClick={() => removeAddOn(i)}>×</button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="form-helper">No add-ons added yet</p>
                )}
              </div>
            )
          }

          {/* ====== ACCOMMODATION ====== */}
          <div className="venue-form-section-header accommodation-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1 }} onClick={() => toggleSection('accommodation')}>
              <div>
                <h3 className="venue-form-section-title">Accommodation</h3>
                <p className="venue-form-section-subtitle">Toggle if this venue offers accommodation</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <label className="toggle-switch">
                <input type="checkbox" name="showAccommodationSection" checked={form.showAccommodationSection} onChange={e => { handleChange(e); if (!form.showAccommodationSection) setExpandedSections(prev => ({ ...prev, accommodation: true })); }} />
                <span className="toggle-slider"></span>
              </label>
              <label className="show-website-check">
                <input type="checkbox" name="showOnWebsite" checked={form.showOnWebsite} onChange={handleChange} />
                Show on Website
              </label>
              {expandedSections.accommodation ? <ChevronUp size={18} onClick={() => toggleSection('accommodation')} style={{ cursor: 'pointer' }} /> : <ChevronDown size={18} onClick={() => toggleSection('accommodation')} style={{ cursor: 'pointer' }} />}
            </div>
          </div>
          {
            expandedSections.accommodation && form.showAccommodationSection && (
              <div className="venue-form-section-content">
                {/* Amenities toggles */}
                <div className="form-group">
                  <label className="form-label">Amenities</label>
                  <div className="amenity-grid">
                    {WELLNESS_AMENITIES.map(amenity => (
                      <label key={amenity} className={`amenity-chip${(form.accommodationAmenities || []).includes(amenity) ? ' active' : ''}`}>
                        <input type="checkbox" checked={(form.accommodationAmenities || []).includes(amenity)} onChange={() => toggleAccAmenity(amenity)} />
                        {amenity}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )
          }

          {/* ====== INDIVIDUAL ROOMS ====== */}
          {
            form.showAccommodationSection && (
              <>
                <SectionHeader id="rooms" title="Individual Room Details" subtitle="Add detailed room information" />
                {expandedSections.rooms && (
                  <div className="venue-form-section-content">
                    {/* Existing rooms list */}
                    {(form.individualRooms || []).length > 0 && (
                      <div className="rooms-list">
                        {form.individualRooms!.map(room => (
                          <div key={room.id} className="room-card">
                            <div className="room-card-header">
                              <h4>{room.roomName || 'Unnamed Room'}</h4>
                              <button type="button" className="room-card-remove" onClick={() => removeRoom(room.id)}>
                                <Trash2 size={14} />
                              </button>
                            </div>
                            <div className="room-card-details">
                              <span>{room.roomType}</span>
                              <span>Max {room.maxOccupancy} guests</span>
                              <span>{room.pricePerNight}/night</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add room form */}
                    {showRoomForm ? (
                      <div className="room-form-card">
                        <div className="form-row">
                          <div className="form-group">
                            <label className="form-label">Room Name *</label>
                            <input className="form-input" value={roomForm.roomName} onChange={e => setRoomForm((prev: RoomFormData) => ({ ...prev, roomName: e.target.value }))} placeholder="e.g. Deluxe King Suite" />
                          </div>
                          <div className="form-group">
                            <label className="form-label">Room Type</label>
                            <input className="form-input" value={roomForm.roomType} onChange={e => setRoomForm((prev: RoomFormData) => ({ ...prev, roomType: e.target.value }))} placeholder="e.g. Suite, Standard, Deluxe" />
                          </div>
                        </div>

                        <div className="form-group">
                          <label className="form-label">Room Image</label>
                          <div className="upload-container">
                            {roomForm.roomImage ? (
                              <div className="hero-preview">
                                <img src={roomForm.roomImage} alt="Room preview" />
                                <button type="button" className="remove-hero" onClick={() => setRoomForm((prev: RoomFormData) => ({ ...prev, roomImage: '' }))}>
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            ) : (
                              <label className="upload-placeholder">
                                <input type="file" accept="image/*" onChange={handleRoomImageUpload} style={{ display: 'none' }} />
                                {isUploadingRoomImage ? (
                                  <Loader2 className="animate-spin" size={24} />
                                ) : (
                                  <>
                                    <Upload size={24} />
                                    <span>Upload Room Image</span>
                                  </>
                                )}
                              </label>
                            )}
                          </div>
                        </div>

                        <div className="form-group">
                          <label className="form-label">Website Description</label>
                          <textarea className="form-input" value={roomForm.websiteDescription} onChange={e => setRoomForm((prev: RoomFormData) => ({ ...prev, websiteDescription: e.target.value }))} rows={2} placeholder="Description for the website..." style={{ resize: 'vertical' }} />
                        </div>

                        <div className="form-group">
                          <label className="form-label" style={{ marginBottom: 12 }}>Detailed Bed Configuration</label>
                          <div className="bed-config-grid" style={{ padding: '12px', background: '#F9F9F9', borderRadius: '8px' }}>
                            {([
                              ['kingBeds', '🛏️ King Beds'],
                              ['queenBeds', '🛏️ Queen Beds'],
                              ['doubleBeds', '🛏️ Double Beds'],
                              ['singleBeds', '🛏️ Single Beds'],
                              ['twinBeds', '🛏️ Twin Beds'],
                              ['bunkBeds', '🛏️ Bunk Beds'],
                              ['sofaBeds', '🛋️ Sofa Beds'],
                              ['rollawayBeds', '🛏️ Rollaway/Extra Beds'],
                            ] as [string, string][]).map(([key, label]) => (
                              <div key={key} className="bed-config-row">
                                <span className="bed-label">{label}</span>
                                <div className="bed-counter">
                                  <button type="button" onClick={() => handleRoomBedChange(key, ((roomForm.bedConfiguration as unknown as Record<string, number>)?.[key] ?? 0) - 1)}>−</button>
                                  <span>{(roomForm.bedConfiguration as unknown as Record<string, number>)?.[key] || 0}</span>
                                  <button type="button" onClick={() => handleRoomBedChange(key, ((roomForm.bedConfiguration as unknown as Record<string, number>)?.[key] || 0) + 1)}>+</button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="form-row">
                          <div className="form-group">
                            <label className="form-label">Max Occupancy</label>
                            <input className="form-input" type="number" value={roomForm.maxOccupancy} onChange={e => setRoomForm((prev: RoomFormData) => ({ ...prev, maxOccupancy: Number(e.target.value) }))} min={1} />
                          </div>
                          <div className="form-group">
                            <label className="form-label">Price per Night</label>
                            <input className="form-input" value={roomForm.pricePerNight} onChange={e => setRoomForm((prev: RoomFormData) => ({ ...prev, pricePerNight: e.target.value }))} placeholder="e.g. $250" />
                          </div>
                        </div>

                        <div className="form-row">
                          <div className="form-group">
                            <label className="form-label">Bathroom</label>
                            <input className="form-input" value={roomForm.bathroom} onChange={e => setRoomForm((prev: RoomFormData) => ({ ...prev, bathroom: e.target.value }))} placeholder="e.g. Ensuite, Shared" />
                          </div>
                          <div className="form-group">
                            <label className="form-label">Room Size</label>
                            <input className="form-input" value={roomForm.roomSize} onChange={e => setRoomForm((prev: RoomFormData) => ({ ...prev, roomSize: e.target.value }))} placeholder="e.g. 35 sqm" />
                          </div>
                        </div>

                        <div className="form-row">
                          <div className="form-group">
                            <label className="form-label">Floor</label>
                            <input className="form-input" value={roomForm.floor} onChange={e => setRoomForm((prev: RoomFormData) => ({ ...prev, floor: e.target.value }))} placeholder="e.g. Ground Floor" />
                          </div>
                        </div>

                        <div className="form-group">
                          <label className="form-label">Room Amenities</label>
                          <div className="tag-input-row">
                            <input className="form-input" value={roomAmenityInput} onChange={e => setRoomAmenityInput(e.target.value)} placeholder="e.g. Mini Bar, Balcony" onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); if (roomAmenityInput.trim()) { setRoomForm((prev: RoomFormData) => ({ ...prev, roomAmenities: [...(prev.roomAmenities || []), roomAmenityInput.trim()] })); setRoomAmenityInput(''); } } }} />
                            <button type="button" className="btn btn-secondary btn-small" onClick={() => { if (roomAmenityInput.trim()) { setRoomForm((prev: RoomFormData) => ({ ...prev, roomAmenities: [...(prev.roomAmenities || []), roomAmenityInput.trim()] })); setRoomAmenityInput(''); } }}>Add</button>
                          </div>
                          {(roomForm.roomAmenities || []).length > 0 && (
                            <div className="tag-chips">
                              {roomForm.roomAmenities!.map(a => (
                                <span key={a} className="tag-chip" style={{ backgroundColor: '#F7F5F1' }}>
                                  {a}
                                  <button type="button" onClick={() => setRoomForm((prev: RoomFormData) => ({ ...prev, roomAmenities: prev.roomAmenities?.filter(x => x !== a) || [] }))} className="tag-chip-remove">×</button>
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 8 }}>
                          <button type="button" className="btn btn-secondary btn-small" onClick={() => setShowRoomForm(false)}>Cancel</button>
                          <button type="button" className="btn btn-primary btn-small" onClick={handleAddRoom} disabled={!roomForm.roomName.trim()}>Add Room</button>
                        </div>
                      </div>
                    ) : (
                      <button type="button" className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setShowRoomForm(true)}>
                        <Plus size={16} /> Add Room
                      </button>
                    )}
                  </div>
                )}
              </>
            )
          }

          {/* ====== FOOTER ACTIONS ====== */}
          <div className="modal-footer">
            {mode === 'create' && (
              <button type="button" className="btn btn-secondary" onClick={() => setStep('category')}>← Back</button>
            )}
            <div style={{ display: 'flex', gap: 8, marginLeft: 'auto' }}>
              <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-primary">
                {mode === 'create' ? 'Create Venue' : 'Save Changes'}
              </button>
            </div>
          </div>
        </form >
      </div >
    </div >
  );
}
