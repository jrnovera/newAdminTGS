import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { VenueOwner } from '../context/VenueOwnerContext';

interface OwnerFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<VenueOwner, 'id' | 'joined'>) => void;
  initialData?: VenueOwner | null;
  mode: 'create' | 'edit';
}

type OwnerFormData = Omit<VenueOwner, 'id' | 'joined'>;

const emptyForm: OwnerFormData = {
  name: '',
  email: '',
  phone: '',
  location: '',
  venues: 0,
  status: 'Pending',
  revenue: '$0',
  bio: '',
  company: '',
  website: '',
  venueNames: [],
};

export default function OwnerFormModal({ isOpen, onClose, onSubmit, initialData, mode }: OwnerFormModalProps) {
  const [form, setForm] = useState<OwnerFormData>(emptyForm);
  const [venueInput, setVenueInput] = useState('');

  useEffect(() => {
    if (initialData && mode === 'edit') {
      setForm({
        name: initialData.name,
        email: initialData.email,
        phone: initialData.phone,
        location: initialData.location,
        venues: initialData.venues,
        status: initialData.status,
        revenue: initialData.revenue,
        bio: initialData.bio,
        company: initialData.company,
        website: initialData.website,
        venueNames: [...initialData.venueNames],
      });
    } else {
      setForm({ ...emptyForm, venueNames: [] });
    }
    setVenueInput('');
  }, [initialData, mode, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: name === 'venues' ? Number(value) : value }));
  };

  const handleAddVenue = () => {
    const trimmed = venueInput.trim();
    if (trimmed && !form.venueNames.includes(trimmed)) {
      setForm((prev) => ({ ...prev, venueNames: [...prev.venueNames, trimmed], venues: prev.venueNames.length + 1 }));
      setVenueInput('');
    }
  };

  const handleRemoveVenue = (venue: string) => {
    setForm((prev) => ({
      ...prev,
      venueNames: prev.venueNames.filter((v) => v !== venue),
      venues: prev.venueNames.filter((v) => v !== venue).length,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{mode === 'create' ? 'Add New Owner' : 'Edit Owner'}</h2>
          <button className="modal-close" onClick={onClose}><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-section-title">Personal Information</div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input className="form-input" name="name" value={form.name} onChange={handleChange} required placeholder="e.g. John Smith" />
            </div>
            <div className="form-group">
              <label className="form-label">Company / Business Name</label>
              <input className="form-input" name="company" value={form.company} onChange={handleChange} placeholder="e.g. Smith Retreats Pty Ltd" />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Email *</label>
              <input className="form-input" type="email" name="email" value={form.email} onChange={handleChange} required placeholder="email@example.com" />
            </div>
            <div className="form-group">
              <label className="form-label">Phone</label>
              <input className="form-input" name="phone" value={form.phone} onChange={handleChange} placeholder="+61 400 000 000" />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Location *</label>
              <input className="form-input" name="location" value={form.location} onChange={handleChange} required placeholder="e.g. Sydney, NSW" />
            </div>
            <div className="form-group">
              <label className="form-label">Website</label>
              <input className="form-input" name="website" value={form.website} onChange={handleChange} placeholder="https://" />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Bio</label>
            <textarea className="form-input" name="bio" value={form.bio} onChange={handleChange} rows={3} placeholder="Brief bio or description..." style={{ resize: 'vertical' }} />
          </div>

          <div className="form-section-title" style={{ marginTop: 8 }}>Account & Status</div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Status</label>
              <select className="form-select" name="status" value={form.status} onChange={handleChange}>
                <option value="Active">Active</option>
                <option value="Pending">Pending</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Revenue MTD</label>
              <input className="form-input" name="revenue" value={form.revenue} onChange={handleChange} placeholder="$0" />
            </div>
          </div>

          <div className="form-section-title" style={{ marginTop: 8 }}>Managed Venues</div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            <input
              className="form-input"
              value={venueInput}
              onChange={(e) => setVenueInput(e.target.value)}
              placeholder="Add venue name..."
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddVenue(); } }}
              style={{ flex: 1 }}
            />
            <button type="button" className="btn btn-secondary btn-small" onClick={handleAddVenue}>Add</button>
          </div>
          {form.venueNames.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {form.venueNames.map((v) => (
                <span key={v} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 10px', backgroundColor: '#F7F5F1', borderRadius: 20, fontSize: 12 }}>
                  {v}
                  <button type="button" onClick={() => handleRemoveVenue(v)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: 14, color: '#B8B8B8', lineHeight: 1 }}>×</button>
                </span>
              ))}
            </div>
          )}
          <div style={{ fontSize: 12, color: '#B8B8B8', marginTop: 6 }}>
            {form.venueNames.length} venue{form.venueNames.length !== 1 ? 's' : ''} assigned
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">
              {mode === 'create' ? 'Create Owner' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
