import { useState, useEffect } from 'react';
import { X, UserPlus } from 'lucide-react';
import type { Venue, PricingTier } from '../context/VenueContext';
import { useVenueOwners } from '../context/VenueOwnerContext';

interface VenueFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Venue, 'id' | 'date'>) => void;
  initialData?: Venue | null;
  mode: 'create' | 'edit';
}

type VenueFormData = Omit<Venue, 'id' | 'date'>;

const emptyForm: VenueFormData = {
  name: '',
  location: '',
  shortLoc: '',
  type: 'Retreat',
  capacity: 10,
  status: 'Draft',
  subscription: 'Essentials',
  owner: '',
  email: '',
  phone: '',
  description: '',
  website: '',
  amenities: [],
  facilities: [],
  pricingTiers: [],
  hasAccommodation: false,
  retreatType: 'Group Hosting',
  hasKitchen: false,
  hasGarden: false,
  hasMeditationHall: false,
  wellnessType: 'Wellness Center',
  offersTherapeuticServices: false,
};

export default function VenueFormModal({ isOpen, onClose, onSubmit, initialData, mode }: VenueFormModalProps) {
  const { owners, addOwner, updateOwner } = useVenueOwners();
  const [form, setForm] = useState(emptyForm);
  const [amenityInput, setAmenityInput] = useState('');
  const [facilityInput, setFacilityInput] = useState('');
  const [tierLabel, setTierLabel] = useState('');
  const [tierDays, setTierDays] = useState('1');
  const [tierPrice, setTierPrice] = useState('');
  const [alsoCreateOwner, setAlsoCreateOwner] = useState(true);
  const [selectedOwnerId, setSelectedOwnerId] = useState<string>('');

  useEffect(() => {
    if (initialData && mode === 'edit') {
      setForm({
        name: initialData.name,
        location: initialData.location,
        shortLoc: initialData.shortLoc,
        type: initialData.type as 'Retreat' | 'Wellness',
        capacity: initialData.capacity,
        status: initialData.status as 'Active' | 'Draft' | 'Inactive',
        subscription: initialData.subscription as 'Essentials' | 'Standard' | 'Featured' | 'Premium',
        owner: initialData.owner,
        email: initialData.email,
        phone: initialData.phone,
        description: initialData.description,
        website: initialData.website,
        amenities: [...initialData.amenities],
        facilities: [...(initialData.facilities || [])],
        pricingTiers: [...(initialData.pricingTiers || [])],
        hasAccommodation: initialData.hasAccommodation || false,
        retreatType: initialData.retreatType || 'Group Hosting',
        hasKitchen: initialData.hasKitchen || false,
        hasGarden: initialData.hasGarden || false,
        hasMeditationHall: initialData.hasMeditationHall || false,
        wellnessType: initialData.wellnessType || 'Wellness Center',
        offersTherapeuticServices: initialData.offersTherapeuticServices || false,
      });
      setSelectedOwnerId('');
    } else {
      setForm({ ...emptyForm, amenities: [], facilities: [], pricingTiers: [] });
      setSelectedOwnerId('');
    }
    setAmenityInput('');
    setFacilityInput('');
    setTierLabel('');
    setTierDays('1');
    setTierPrice('');
  }, [initialData, mode, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const type = (e.target as HTMLInputElement).type;
    const checked = (e.target as HTMLInputElement).checked;

    if (name === 'owner' || name === 'email') {
      setSelectedOwnerId('');
    }

    const finalValue = type === 'checkbox' ? checked : (name === 'capacity' ? Number(value) : value);
    setForm((prev) => ({ ...prev, [name]: finalValue }));
  };

  const handleAddAmenity = () => {
    const trimmed = amenityInput.trim();
    if (trimmed && !form.amenities.includes(trimmed)) {
      setForm((prev) => ({ ...prev, amenities: [...prev.amenities, trimmed] }));
      setAmenityInput('');
    }
  };

  const handleRemoveAmenity = (amenity: string) => {
    setForm((prev) => ({ ...prev, amenities: prev.amenities.filter((a) => a !== amenity) }));
  };

  const handleAddFacility = () => {
    const trimmed = facilityInput.trim();
    if (trimmed && !form.facilities.includes(trimmed)) {
      setForm((prev) => ({ ...prev, facilities: [...prev.facilities, trimmed] }));
      setFacilityInput('');
    }
  };

  const handleRemoveFacility = (facility: string) => {
    setForm((prev) => ({ ...prev, facilities: prev.facilities.filter((f) => f !== facility) }));
  };

  const handleAddTier = () => {
    if (!tierLabel.trim() || !tierPrice.trim()) return;
    const newTier: PricingTier = { label: tierLabel.trim(), days: Number(tierDays), price: tierPrice.trim() };
    setForm((prev) => ({ ...prev, pricingTiers: [...prev.pricingTiers, newTier] }));
    setTierLabel('');
    setTierDays('1');
    setTierPrice('');
  };

  const handleRemoveTier = (index: number) => {
    setForm((prev) => ({ ...prev, pricingTiers: prev.pricingTiers.filter((_, i) => i !== index) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);

    // Auto-create venue owner if creating a new venue and checkbox is checked
    if (mode === 'create' && alsoCreateOwner && form.owner.trim()) {
      const existingOwner = owners.find(
        (o) => o.email.toLowerCase() === form.email.toLowerCase()
      );
      if (existingOwner) {
        // Owner exists — add this venue name to their list if not already there
        if (!existingOwner.venueNames.includes(form.name)) {
          updateOwner(existingOwner.id, {
            venueNames: [...existingOwner.venueNames, form.name],
            venues: existingOwner.venues + 1,
          });
        }
      } else {
        // Create new owner
        addOwner({
          name: form.owner,
          email: form.email,
          phone: form.phone,
          location: form.shortLoc,
          venues: 1,
          status: 'Active',
          revenue: '$0',
          bio: '',
          company: '',
          website: form.website,
          venueNames: [form.name],
        });
      }
    }

    onClose();
  };

  const handleSelectOwner = (ownerId: string) => {
    setSelectedOwnerId(ownerId);
    if (!ownerId) return;
    const owner = owners.find((o) => o.id === ownerId);
    if (owner) {
      setForm((prev) => ({
        ...prev,
        owner: owner.name,
        email: owner.email,
        phone: owner.phone,
        shortLoc: owner.location,
      }));
      setAlsoCreateOwner(true);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{mode === 'create' ? 'Add New Venue' : 'Edit Venue'}</h2>
          <button className="modal-close" onClick={onClose}><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-section-title">Basic Information</div>
          <div className="form-group">
            <label className="form-label">Venue Name *</label>
            <input className="form-input" name="name" value={form.name} onChange={handleChange} required placeholder="e.g. Mountain Wellness Retreat" />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Venue Type *</label>
              <select className="form-select" name="type" value={form.type} onChange={handleChange}>
                <option value="Retreat">Retreat</option>
                <option value="Wellness">Wellness</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Capacity *</label>
              <input className="form-input" type="number" name="capacity" value={form.capacity} onChange={handleChange} min={1} required />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Full Location *</label>
            <input className="form-input" name="location" value={form.location} onChange={handleChange} required placeholder="e.g. Byron Bay, NSW, Australia" />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Short Location *</label>
              <input className="form-input" name="shortLoc" value={form.shortLoc} onChange={handleChange} required placeholder="e.g. Byron Bay, NSW" />
            </div>
            <div className="form-group">
              <label className="form-label">Website</label>
              <input className="form-input" name="website" value={form.website} onChange={handleChange} placeholder="https://" />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="form-input" name="description" value={form.description} onChange={handleChange} rows={3} placeholder="Brief description of the venue..." style={{ resize: 'vertical' }} />
          </div>

          <div className="form-section-title" style={{ marginTop: 8 }}>Venue Configuration</div>

          <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 15, padding: '8px 12px', backgroundColor: '#F9FAFB', borderRadius: 8 }}>
            <input
              type="checkbox"
              name="hasAccommodation"
              id="hasAccommodation"
              checked={form.hasAccommodation}
              onChange={handleChange}
              style={{ width: 16, height: 16, cursor: 'pointer' }}
            />
            <label htmlFor="hasAccommodation" className="form-label" style={{ marginBottom: 0, cursor: 'pointer', fontWeight: 500 }}>
              This venue offers Accommodation
            </label>
          </div>

          {form.type === 'Retreat' && (
            <div style={{ padding: '4px 12px 12px', border: '1px solid #F1F1F1', borderRadius: 10, marginBottom: 16 }}>
              <div className="form-group">
                <label className="form-label">Retreat Service Model</label>
                <select className="form-select" name="retreatType" value={form.retreatType} onChange={handleChange}>
                  <option value="Separate Building">Separate Building (Private Hire)</option>
                  <option value="Group Hosting">Group Hosting (Meditation, Yoga, Permaculture)</option>
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 20px', marginTop: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input type="checkbox" name="hasKitchen" id="hasKitchen" checked={form.hasKitchen} onChange={handleChange} style={{ cursor: 'pointer' }} />
                  <label htmlFor="hasKitchen" style={{ fontSize: 13, cursor: 'pointer' }}>Commercial Kitchen</label>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input type="checkbox" name="hasGarden" id="hasGarden" checked={form.hasGarden} onChange={handleChange} style={{ cursor: 'pointer' }} />
                  <label htmlFor="hasGarden" style={{ fontSize: 13, cursor: 'pointer' }}>Vegetable Garden</label>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input type="checkbox" name="hasMeditationHall" id="hasMeditationHall" checked={form.hasMeditationHall} onChange={handleChange} style={{ cursor: 'pointer' }} />
                  <label htmlFor="hasMeditationHall" style={{ fontSize: 13, cursor: 'pointer' }}>Meditation Hall</label>
                </div>
              </div>
            </div>
          )}

          {form.type === 'Wellness' && (
            <div style={{ padding: '4px 12px 12px', border: '1px solid #F1F1F1', borderRadius: 10, marginBottom: 16 }}>
              <div className="form-group">
                <label className="form-label">Wellness Facility Type</label>
                <select className="form-select" name="wellnessType" value={form.wellnessType} onChange={handleChange}>
                  <option value="Bathhouse">Bathhouse</option>
                  <option value="Treatment Centre">Treatment Centre</option>
                  <option value="Hotel">Hotel / Resort Spa</option>
                  <option value="Wellness Center">Wellness Center</option>
                </select>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
                <input
                  type="checkbox"
                  name="offersTherapeuticServices"
                  id="offersTherapeuticServices"
                  checked={form.offersTherapeuticServices}
                  onChange={handleChange}
                  style={{ cursor: 'pointer' }}
                />
                <label htmlFor="offersTherapeuticServices" style={{ fontSize: 13, cursor: 'pointer' }}>Offers Therapeutic or Healing Services</label>
              </div>
            </div>
          )}

          <div className="form-section-title" style={{ marginTop: 8 }}>Owner & Contact</div>

          <div className="form-group">
            <label className="form-label">Select Existing Owner (optional)</label>
            <select
              className="form-select"
              value={selectedOwnerId}
              onChange={(e) => handleSelectOwner(e.target.value)}
            >
              <option value="">-- Select owner to auto-fill --</option>
              {owners.map((o) => (
                <option key={o.id} value={o.id}>{o.name} — {o.email}</option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Owner Name *</label>
              <input className="form-input" name="owner" value={form.owner} onChange={handleChange} required placeholder="Full name" />
            </div>
            <div className="form-group">
              <label className="form-label">Owner Email *</label>
              <input className="form-input" type="email" name="email" value={form.email} onChange={handleChange} required placeholder="email@example.com" />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Phone</label>
            <input className="form-input" name="phone" value={form.phone} onChange={handleChange} placeholder="+61 400 000 000" />
          </div>

          {mode === 'create' && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '12px 16px', backgroundColor: '#E8EFF9', borderRadius: 10,
              marginTop: 8, marginBottom: 8, fontSize: 13, color: '#313131',
            }}>
              <input
                type="checkbox"
                id="alsoCreateOwner"
                checked={alsoCreateOwner}
                onChange={(e) => setAlsoCreateOwner(e.target.checked)}
                style={{ width: 16, height: 16, accentColor: '#6B8EC9' }}
              />
              <label htmlFor="alsoCreateOwner" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                <UserPlus size={14} />
                Also add as a new Venue Owner
              </label>
              <span style={{ fontSize: 11, color: '#6B8EC9', marginLeft: 'auto' }}>
                {owners.find((o) => o.email.toLowerCase() === form.email.toLowerCase())
                  ? '(owner already exists — will link venue)'
                  : '(will create new owner profile)'}
              </span>
            </div>
          )}

          {/* Status — always shown */}
          <div className="form-section-title" style={{ marginTop: 8 }}>
            {form.type === 'Wellness' ? 'Status' : 'Status & Subscription'}
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Status</label>
              <select className="form-select" name="status" value={form.status} onChange={handleChange}>
                <option value="Active">Active</option>
                <option value="Draft">Draft</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            {form.type === 'Retreat' && (
              <div className="form-group">
                <label className="form-label">Subscription Plan</label>
                <select className="form-select" name="subscription" value={form.subscription} onChange={handleChange}>
                  <option value="Essentials">Essentials — $79/mo</option>
                  <option value="Standard">Standard — $149/mo</option>
                  <option value="Featured">Featured — $249/mo</option>
                  <option value="Premium">Premium — $449/mo</option>
                </select>
              </div>
            )}
          </div>

          {/* RETREAT: Amenities */}
          {form.type === 'Retreat' && (
            <>
              <div className="form-section-title" style={{ marginTop: 8 }}>Amenities</div>
              <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                <input
                  className="form-input"
                  value={amenityInput}
                  onChange={(e) => setAmenityInput(e.target.value)}
                  placeholder="Add amenity..."
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddAmenity(); } }}
                  style={{ flex: 1 }}
                />
                <button type="button" className="btn btn-secondary btn-small" onClick={handleAddAmenity}>Add</button>
              </div>
              {form.amenities.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {form.amenities.map((a) => (
                    <span key={a} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 10px', backgroundColor: '#F7F5F1', borderRadius: 20, fontSize: 12 }}>
                      {a}
                      <button type="button" onClick={() => handleRemoveAmenity(a)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: 14, color: '#B8B8B8', lineHeight: 1 }}>×</button>
                    </span>
                  ))}
                </div>
              )}
            </>
          )}

          {/* WELLNESS: Facilities */}
          {form.type === 'Wellness' && (
            <>
              <div className="form-section-title" style={{ marginTop: 8 }}>Facilities</div>
              <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                <input
                  className="form-input"
                  value={facilityInput}
                  onChange={(e) => setFacilityInput(e.target.value)}
                  placeholder="e.g. Thermal Pools, Sauna, Steam Room..."
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddFacility(); } }}
                  style={{ flex: 1 }}
                />
                <button type="button" className="btn btn-secondary btn-small" onClick={handleAddFacility}>Add</button>
              </div>
              {form.facilities.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
                  {form.facilities.map((f) => (
                    <span key={f} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 10px', backgroundColor: '#E8F4EA', borderRadius: 20, fontSize: 12, color: '#4A7C59' }}>
                      {f}
                      <button type="button" onClick={() => handleRemoveFacility(f)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: 14, color: '#4A7C59', lineHeight: 1 }}>×</button>
                    </span>
                  ))}
                </div>
              )}

              <div className="form-section-title" style={{ marginTop: 8 }}>Pricing</div>
              <div style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'flex-end' }}>
                <div style={{ flex: 2 }}>
                  <label className="form-label" style={{ fontSize: 11 }}>Label</label>
                  <input
                    className="form-input"
                    value={tierLabel}
                    onChange={(e) => setTierLabel(e.target.value)}
                    placeholder="e.g. Single Session"
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label className="form-label" style={{ fontSize: 11 }}>Days</label>
                  <select className="form-select" value={tierDays} onChange={(e) => setTierDays(e.target.value)}>
                    <option value="1">1 day</option>
                    <option value="2">2 days</option>
                    <option value="3">3 days</option>
                    <option value="5">5 days</option>
                    <option value="7">7 days</option>
                    <option value="10">10 days</option>
                    <option value="14">14 days</option>
                    <option value="30">30 days</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label className="form-label" style={{ fontSize: 11 }}>Price</label>
                  <input
                    className="form-input"
                    value={tierPrice}
                    onChange={(e) => setTierPrice(e.target.value)}
                    placeholder="$89"
                  />
                </div>
                <button type="button" className="btn btn-secondary btn-small" onClick={handleAddTier} style={{ whiteSpace: 'nowrap' }}>Add Tier</button>
              </div>
              {form.pricingTiers.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {form.pricingTiers.map((tier, i) => (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '10px 14px', backgroundColor: '#FEF9E7', borderRadius: 10, fontSize: 13,
                    }}>
                      <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                        <span style={{ fontWeight: 600 }}>{tier.label}</span>
                        <span style={{ color: '#B8B8B8' }}>{tier.days} {tier.days === 1 ? 'day' : 'days'}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span style={{ fontWeight: 600, color: '#4A7C59' }}>{tier.price}</span>
                        <button type="button" onClick={() => handleRemoveTier(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: 16, color: '#B8B8B8', lineHeight: 1 }}>×</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {form.pricingTiers.length === 0 && (
                <div style={{ fontSize: 12, color: '#B8B8B8', fontStyle: 'italic' }}>No pricing tiers added yet. Add at least one tier above.</div>
              )}
            </>
          )}

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">
              {mode === 'create' ? 'Create Venue' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
