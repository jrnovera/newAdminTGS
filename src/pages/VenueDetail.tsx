import { useParams, useNavigate, Link } from 'react-router-dom';
import { useState, useRef } from 'react';
import { ArrowLeft, Trash2, Globe, MapPin, Users, Calendar, Eye, Save, Loader2 } from 'lucide-react';
import { useVenues } from '../context/VenueContext';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import RetreatFacilitiesTab from '../components/RetreatFacilitiesTab';
import AccommodationTab from '../components/AccommodationTab';
import OverviewTab from '../components/OverviewTab';
import MediaTab from '../components/MediaTab';
import PricingTab from '../components/PricingTab';
import BookingsTab from '../components/BookingsTab';
import OwnerManagerTab from '../components/OwnerManagerTab';
import InternalTab from '../components/InternalTab';
import AmenitiesTab from '../components/AmenitiesTab';
import ReviewsTab from '../components/ReviewsTab';
import type { Venue } from '../context/VenueContext';

// Tabs with their own save button — global "Save Changes" is hidden on these
const SELF_SAVE_TABS = new Set(['retreat-facilities', 'pricing', 'media', 'internal', 'owner']);

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'accommodation', label: 'Accommodation' },
  { id: 'amenities', label: 'Amenities' },
  { id: 'retreat-facilities', label: 'Retreat Facilities' },
  { id: 'pricing', label: 'Pricing & Booking' },
  { id: 'media', label: 'Media' },
  { id: 'internal', label: 'Internal' },
  { id: 'owner', label: 'Owner/Manager' },
  { id: 'bookings', label: 'Bookings' },
  { id: 'reviews', label: 'Reviews' },
];

export default function VenueDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getVenue, updateVenue, deleteVenue } = useVenues();
  const [showDelete, setShowDelete] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveToast, setSaveToast] = useState<'success' | 'error' | null>(null);
  const pendingUpdatesRef = useRef<Partial<Venue>>({});

  const venue = getVenue(id || '');

  if (!venue) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 0' }}>
        <h2 style={{ fontSize: 28, marginBottom: 12 }}>Venue Not Found</h2>
        <p style={{ color: '#B8B8B8', marginBottom: 24 }}>The venue you're looking for doesn't exist or has been deleted.</p>
        <button className="btn btn-primary" onClick={() => navigate('/venues')}>
          <ArrowLeft size={16} /> Back to Venues
        </button>
      </div>
    );
  }

  const handleDelete = async () => {
    try {
      await deleteVenue(venue.id);
      navigate('/venues');
    } catch (err) {
      console.error('Failed to delete venue:', err);
    }
  };

  const handleSaveChanges = async () => {
    if (!hasChanges || Object.keys(pendingUpdatesRef.current).length === 0) return;
    setSaving(true);
    try {
      await updateVenue(venue.id, pendingUpdatesRef.current);
      pendingUpdatesRef.current = {};
      setHasChanges(false);
      setSaveToast('success');
      setTimeout(() => setSaveToast(null), 3000);
    } catch (err) {
      console.error('Failed to save changes:', err);
      setSaveToast('error');
      setTimeout(() => setSaveToast(null), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handleTabUpdate = (updates: Partial<Venue>) => {
    pendingUpdatesRef.current = { ...pendingUpdatesRef.current, ...updates };
    setHasChanges(true);
  };

  const subClass = (sub: string) => {
    switch (sub) {
      case 'Essentials': return 'sub-essentials';
      case 'Standard': return 'sub-standard';
      case 'Featured': return 'sub-featured';
      case 'Premium': return 'sub-premium';
      default: return '';
    }
  };

  const statusClass = (s: string) => {
    switch (s) {
      case 'Active': return 'active';
      case 'Draft': return 'pending';
      case 'Inactive': return 'inactive';
      default: return '';
    }
  };

  return (
    <>
      {/* Breadcrumb */}
      <nav className="vd-breadcrumb">
        <Link to="/">Dashboard</Link>
        <span>/</span>
        <Link to="/venues">Venues</Link>
        <span>/</span>
        <span className="vd-bc-current">{venue.name}</span>
      </nav>

      {/* Venue Header */}
      <header className="vd-header">
        <div className="vd-header-left">
          <div
            className="vd-thumbnail"
            style={venue.heroImage ? { backgroundImage: `url(${venue.heroImage})` } : {}}
          >
            {!venue.heroImage && <Globe size={32} strokeWidth={1} />}
          </div>
          <div className="vd-header-info">
            <div className="vd-title-row">
              <h1 className="vd-title">{venue.name}</h1>
              <span className="vd-type-badge">{venue.type === 'Retreat' ? 'Retreat Venue' : 'Wellness Venue'}</span>
            </div>
            <div className="vd-meta">
              <div className="vd-meta-item">
                <MapPin size={16} />
                {venue.location}
              </div>
              <div className="vd-meta-item">
                <Users size={16} />
                Max {venue.capacity} guests
              </div>
              <div className="vd-meta-item">
                <Calendar size={16} />
                Added {venue.date}
              </div>
            </div>
            <div className="vd-status-row">
              <span className={`status-badge ${statusClass(venue.status)}`}>
                <span className="status-dot"></span> {venue.status}
              </span>
              {venue.type === 'Retreat' && (
                <span style={{ color: '#B8B8B8', fontSize: 12 }}>
                  • <span className={`subscription-badge ${subClass(venue.subscription)}`}>{venue.subscription} Plan</span>
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="vd-header-actions">
          <button className="vd-btn-icon" title="Preview">
            <Eye size={18} />
          </button>
          <button className="btn btn-secondary" onClick={() => setShowDelete(true)}>
            <Trash2 size={16} /> Delete
          </button>
        </div>
      </header>

      {/* Tab Navigation */}
      <nav className="vd-tabs">
        {TABS.map(tab => (
          <button
            key={tab.id}
            className={`vd-tab${activeTab === tab.id ? ' active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <OverviewTab venue={venue} onUpdate={handleTabUpdate} />
      )}

      {activeTab === 'retreat-facilities' && (
        <RetreatFacilitiesTab venue={venue} onUpdate={handleTabUpdate} />
      )}

      {activeTab === 'accommodation' && (
        <AccommodationTab venue={venue} onUpdate={handleTabUpdate} />
      )}
      {activeTab === 'amenities' && (
        <AmenitiesTab venue={venue} onUpdate={handleTabUpdate} />
      )}
      {activeTab === 'pricing' && (
        <PricingTab venue={venue} />
      )}
      {activeTab === 'media' && (
        <MediaTab venue={venue} onUpdate={handleTabUpdate} />
      )}
      {activeTab === 'internal' && (
        <InternalTab venue={venue} onUpdate={handleTabUpdate} />
      )}
      {activeTab === 'owner' && (
        <OwnerManagerTab venue={venue} onUpdate={handleTabUpdate} />
      )}
      {activeTab === 'bookings' && (
        <BookingsTab venue={venue} onUpdate={handleTabUpdate} />
      )}
      {activeTab === 'reviews' && (
        <ReviewsTab venue={venue} onUpdate={handleTabUpdate} />
      )}

      {/* Delete Modal */}
      <DeleteConfirmModal
        isOpen={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={handleDelete}
        venueName={venue.name}
      />

      {/* Floating Save Button */}
      {hasChanges && !SELF_SAVE_TABS.has(activeTab) && (
        <button
          onClick={handleSaveChanges}
          disabled={saving}
          style={{
            position: 'fixed',
            bottom: 32,
            right: 32,
            zIndex: 500,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '14px 24px',
            background: '#111111',
            color: '#fff',
            border: 'none',
            borderRadius: 50,
            fontSize: 14,
            fontWeight: 600,
            fontFamily: "'Montserrat', sans-serif",
            cursor: saving ? 'not-allowed' : 'pointer',
            boxShadow: '0 6px 24px rgba(0,0,0,0.25)',
            opacity: saving ? 0.8 : 1,
            transition: 'opacity 0.2s, transform 0.2s',
            transform: 'translateY(0)',
            letterSpacing: '0.02em',
          }}
        >
          {saving ? <Loader2 size={18} className="spin" /> : <Save size={18} />}
          {saving ? 'Saving…' : 'Save Changes'}
        </button>
      )}

      {/* Save Toast */}
      {saveToast && (
        <div style={{
          position: 'fixed',
          bottom: 100,
          right: 32,
          zIndex: 600,
          padding: '12px 20px',
          borderRadius: 10,
          fontSize: 13,
          fontWeight: 500,
          fontFamily: "'Montserrat', sans-serif",
          background: saveToast === 'success' ? '#4A7C59' : '#C45C5C',
          color: '#fff',
          boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
        }}>
          {saveToast === 'success' ? 'Changes saved successfully' : 'Failed to save changes'}
        </div>
      )}
    </>
  );
}
