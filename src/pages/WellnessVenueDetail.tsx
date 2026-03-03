import { useParams, useNavigate, Link } from 'react-router-dom';
import { useState, useRef } from 'react';
import { Trash2, MapPin, Clock, Calendar, Eye, Save } from 'lucide-react';
import { useVenues } from '../context/VenueContext';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import WellnessAccommodationTab from '../components/wellness/WellnessAccommodationTab';
import MediaTab from '../components/MediaTab';
import BookingsTab from '../components/BookingsTab';
import OwnerManagerTab from '../components/OwnerManagerTab';
import WellnessInternalTab from '../components/wellness/WellnessInternalTab';
import WellnessFacilitiesTab from '../components/wellness/WellnessFacilitiesTab';
import WellnessServicesTab from '../components/wellness/WellnessServicesTab';
import WellnessAmenitiesTab from '../components/wellness/WellnessAmenitiesTab';
import WellnessOwnerManagerTab from '../components/wellness/WellnessOwnerManagerTab';
import WellnessMediaTab from '../components/wellness/WellnessMediaTab';
import WellnessBookingsTab from '../components/wellness/WellnessBookingsTab';
import WellnessPricingTab from '../components/wellness/WellnessPricingTab';
import WellnessOverviewTab from '../components/wellness/WellnessOverviewTab';
import type { Venue } from '../context/VenueContext';

const WELLNESS_TABS = [
    { id: 'overview', label: 'Overview' },
    { id: 'accommodation', label: 'Accommodation' },
    { id: 'amenities', label: 'Amenities' },
    { id: 'wellness-services', label: 'Wellness Services' },
    { id: 'wellness-facilities', label: 'Wellness Facilities' },
    { id: 'pricing', label: 'Pricing & Booking' },
    { id: 'media', label: 'Media' },
    { id: 'internal', label: 'Internal' },
    { id: 'owner', label: 'Owner/Manager' },
    { id: 'bookings', label: 'Bookings' },
];

export default function WellnessVenueDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { getVenue, updateVenue, deleteVenue } = useVenues();
    const [showDelete, setShowDelete] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');
    const pendingUpdatesRef = useRef<Partial<Venue>>({});

    const venue = getVenue(id || '');

    if (!venue) {
        return (
            <div style={{ textAlign: 'center', padding: '80px 0' }}>
                <h2 style={{ fontSize: 28, marginBottom: 12 }}>Venue Not Found</h2>
                <p style={{ color: '#B8B8B8', marginBottom: 24 }}>The wellness venue you're looking for doesn't exist or has been deleted.</p>
                <button className="btn btn-primary" onClick={() => navigate('/wellness-venues')}>
                    Back to Wellness Venues
                </button>
            </div>
        );
    }

    const handleDelete = async () => {
        try {
            await deleteVenue(venue.id);
            navigate('/wellness-venues');
        } catch (err) {
            console.error('Failed to delete venue:', err);
        }
    };

    const handleSaveChanges = async () => {
        if (Object.keys(pendingUpdatesRef.current).length > 0) {
            try {
                await updateVenue(venue.id, pendingUpdatesRef.current);
                pendingUpdatesRef.current = {};
                alert('Changes saved successfully!');
            } catch (err) {
                console.error('Failed to save changes:', err);
            }
        }
    };

    const handleTabUpdate = (updates: Partial<Venue>) => {
        pendingUpdatesRef.current = { ...pendingUpdatesRef.current, ...updates };
    };

    return (
        <>
            {/* Breadcrumb */}
            <nav className="wvd-breadcrumb">
                <Link to="/">Dashboard</Link>
                <span>/</span>
                <Link to="/wellness-venues">Wellness Venues</Link>
                <span>/</span>
                <span className="wvd-bc-current">{venue.name}</span>
            </nav>

            {/* Venue Header */}
            <header className="wvd-header">
                <div className="wvd-header-left">
                    <div
                        className="wvd-thumbnail"
                        style={venue.heroImage ? { backgroundImage: `url(${venue.heroImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
                    >
                        {!venue.heroImage && <MapPin size={32} strokeWidth={1} color="#B8B8B8" />}
                    </div>
                    <div className="wvd-header-info">
                        <div className="wvd-title-row">
                            <h1 className="wvd-title">{venue.name}</h1>
                            <span className="wvd-type-badge">{venue.wellnessType || 'Day Spa'}</span>
                        </div>
                        <div className="wvd-meta">
                            <div className="wvd-meta-item">
                                <MapPin size={16} />
                                {venue.location}
                            </div>
                            {venue.openingTime && (
                                <div className="wvd-meta-item">
                                    <Clock size={16} />
                                    Open {venue.openingTime} - {venue.closingTime}
                                </div>
                            )}
                            <div className="wvd-meta-item">
                                <Calendar size={16} />
                                Added {venue.date}
                            </div>
                        </div>
                        <div className="wvd-status-row">
                            <span className={`wvd-status-indicator ${venue.status === 'Active' ? 'active' : ''}`}>
                                <span className="wvd-status-dot"></span>
                                {venue.status}
                            </span>
                            <span style={{ color: '#B8B8B8', fontSize: 12 }}>• {venue.subscription} Plan</span>
                        </div>
                    </div>
                </div>
                <div className="wvd-header-actions">
                    <button className="wvd-btn-icon" title="Preview">
                        <Eye size={18} />
                    </button>
                    <button className="btn btn-secondary" onClick={() => setShowDelete(true)}>
                        <Trash2 size={16} /> Delete
                    </button>
                    <button className="btn btn-primary" onClick={handleSaveChanges}>
                        <Save size={16} /> Save Changes
                    </button>
                </div>
            </header>

            {/* Tab Navigation */}
            <nav className="wvd-tabs">
                {WELLNESS_TABS.map(tab => (
                    <button
                        key={tab.id}
                        className={`wvd-tab${activeTab === tab.id ? ' active' : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.label}
                    </button>
                ))}
            </nav>

            {/* Tab Content */}
            {activeTab === 'overview' && (
                <WellnessOverviewTab venue={venue} onUpdate={handleTabUpdate} />
            )}
            {activeTab === 'accommodation' && (
                <WellnessAccommodationTab venue={venue} onUpdate={handleTabUpdate} />
            )}
            {activeTab === 'amenities' && (
                <WellnessAmenitiesTab venue={venue} onUpdate={handleTabUpdate} />
            )}
            {activeTab === 'wellness-services' && venue && (
                <WellnessServicesTab venue={venue} onUpdate={handleTabUpdate} />
            )}
            {activeTab === 'wellness-facilities' && (
                <WellnessFacilitiesTab venue={venue} onUpdate={handleTabUpdate} />
            )}
            {activeTab === 'owner-manager' && venue && (
                <WellnessOwnerManagerTab venue={venue} onUpdate={handleTabUpdate} />
            )}
            {activeTab === 'media' && venue && (
                <WellnessMediaTab venue={venue} onUpdate={handleTabUpdate} />
            )}
            {activeTab === 'bookings' && venue && (
                <WellnessBookingsTab venue={venue} onUpdate={handleTabUpdate} />
            )}
            {activeTab === 'pricing' && venue && (
                <WellnessPricingTab venue={venue} onUpdate={handleTabUpdate} />
            )}
            {activeTab === 'media' && (
                <MediaTab venue={venue} onUpdate={handleTabUpdate} />
            )}
            {activeTab === 'internal' && venue && (
                <WellnessInternalTab venue={venue} onUpdate={handleTabUpdate} />
            )}
            {activeTab === 'owner' && (
                <OwnerManagerTab venue={venue} onUpdate={handleTabUpdate} />
            )}
            {activeTab === 'bookings' && (
                <BookingsTab venue={venue} onUpdate={handleTabUpdate} />
            )}

            {/* Delete Modal */}
            <DeleteConfirmModal
                isOpen={showDelete}
                onClose={() => setShowDelete(false)}
                onConfirm={handleDelete}
                venueName={venue.name}
            />
        </>
    );
}
