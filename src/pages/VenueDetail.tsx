import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ArrowLeft, Edit3, Trash2, Globe, Mail, Phone, MapPin, Users, Calendar, CreditCard, DollarSign } from 'lucide-react';
import { useVenues } from '../context/VenueContext';
import VenueFormModal from '../components/VenueFormModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import type { Venue } from '../context/VenueContext';

export default function VenueDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getVenue, updateVenue, deleteVenue } = useVenues();
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

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

  const handleUpdate = (data: Omit<Venue, 'id' | 'date'>) => {
    updateVenue(venue.id, data);
  };

  const handleDelete = () => {
    deleteVenue(venue.id);
    navigate('/venues');
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
      {/* Back Button & Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <button
          className="btn btn-secondary"
          onClick={() => navigate('/venues')}
          style={{ gap: 8 }}
        >
          <ArrowLeft size={16} /> Back to Venues
        </button>
        <div className="header-actions">
          <button className="btn btn-secondary" onClick={() => setShowEdit(true)}>
            <Edit3 size={16} /> Edit Venue
          </button>
          <button className="btn btn-danger" onClick={() => setShowDelete(true)}>
            <Trash2 size={16} /> Delete
          </button>
        </div>
      </div>

      {/* Venue Header Card */}
      <div className="content-card" style={{ marginBottom: 24 }}>
        <div style={{ padding: 32 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                <h1 className="page-title" style={{ marginBottom: 0 }}>{venue.name}</h1>
                <span className={`badge ${venue.type === 'Retreat' ? 'badge-retreat' : 'badge-wellness'}`}>
                  {venue.type}
                </span>
                <span className={`status-badge ${statusClass(venue.status)}`}>{venue.status}</span>
              </div>
              <p style={{ fontSize: 14, color: '#B8B8B8', display: 'flex', alignItems: 'center', gap: 6 }}>
                <MapPin size={14} /> {venue.location}
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              {venue.type === 'Retreat' && (
                <span className={`subscription-badge ${subClass(venue.subscription)}`} style={{ fontSize: 13, padding: '6px 14px' }}>
                  {venue.subscription}
                </span>
              )}
              <div style={{ fontSize: 12, color: '#B8B8B8', marginTop: 8 }}>
                <Calendar size={12} style={{ verticalAlign: -1, marginRight: 4 }} />
                Added {venue.date}
              </div>
            </div>
          </div>

          {venue.description && (
            <p style={{ fontSize: 14, lineHeight: 1.7, color: '#313131', maxWidth: 800 }}>
              {venue.description}
            </p>
          )}
        </div>
      </div>

      {/* Info Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
        {/* Owner & Contact */}
        <div className="content-card">
          <div className="card-header">
            <h3 className="card-title">Owner & Contact</h3>
          </div>
          <div style={{ padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
              <div style={{
                width: 56, height: 56, borderRadius: '50%',
                background: 'linear-gradient(135deg, #B8B8B8, #888)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontWeight: 600, fontSize: 20
              }}>
                {venue.owner.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 16 }}>{venue.owner}</div>
                <div style={{ fontSize: 12, color: '#B8B8B8' }}>Venue Owner</div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 13 }}>
                <Mail size={16} color="#B8B8B8" />
                <a href={`mailto:${venue.email}`} style={{ color: '#6B8EC9' }}>{venue.email}</a>
              </div>
              {venue.phone && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 13 }}>
                  <Phone size={16} color="#B8B8B8" />
                  <span>{venue.phone}</span>
                </div>
              )}
              {venue.website && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 13 }}>
                  <Globe size={16} color="#B8B8B8" />
                  <a href={venue.website} target="_blank" rel="noopener noreferrer" style={{ color: '#6B8EC9' }}>{venue.website}</a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Venue Details */}
        <div className="content-card">
          <div className="card-header">
            <h3 className="card-title">Venue Details</h3>
          </div>
          <div style={{ padding: 24 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <div>
                <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#B8B8B8', marginBottom: 4 }}>Type</div>
                <div style={{ fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span className={`badge ${venue.type === 'Retreat' ? 'badge-retreat' : 'badge-wellness'}`}>{venue.type}</span>
                </div>
              </div>
              <div>
                <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#B8B8B8', marginBottom: 4 }}>Capacity</div>
                <div style={{ fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Users size={16} color="#B8B8B8" />
                  {venue.capacity} guests
                </div>
              </div>
              {venue.type === 'Retreat' && (
                <div>
                  <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#B8B8B8', marginBottom: 4 }}>Subscription</div>
                  <div style={{ fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <CreditCard size={16} color="#B8B8B8" />
                    <span className={`subscription-badge ${subClass(venue.subscription)}`}>{venue.subscription}</span>
                  </div>
                </div>
              )}
              <div>
                <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#B8B8B8', marginBottom: 4 }}>Status</div>
                <div style={{ fontWeight: 500 }}>
                  <span className={`status-badge ${statusClass(venue.status)}`}>{venue.status}</span>
                </div>
              </div>
              <div>
                <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#B8B8B8', marginBottom: 4 }}>Location</div>
                <div style={{ fontWeight: 500, fontSize: 13 }}>{venue.shortLoc}</div>
              </div>
              <div>
                <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#B8B8B8', marginBottom: 4 }}>Date Added</div>
                <div style={{ fontWeight: 500, fontSize: 13 }}>{venue.date}</div>
              </div>

              <div style={{ gridColumn: 'span 2', marginTop: 12, paddingTop: 16, borderTop: '1px solid #F1F1F1' }}>
                <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#B8B8B8', marginBottom: 12 }}>Configuration & Service Features</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px 24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 500, color: venue.hasAccommodation ? '#4A7C59' : '#B8B8B8' }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: venue.hasAccommodation ? '#4A7C59' : '#E5E5E5' }} />
                    Accommodation Available
                  </div>

                  {venue.type === 'Retreat' && (
                    <>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>
                        <span style={{ color: '#B8B8B8', fontWeight: 400 }}>Model:</span> {venue.retreatType}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 500, color: venue.hasKitchen ? '#4A7C59' : '#B8B8B8' }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: venue.hasKitchen ? '#4A7C59' : '#E5E5E5' }} />
                        Commercial Kitchen
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 500, color: venue.hasGarden ? '#4A7C59' : '#B8B8B8' }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: venue.hasGarden ? '#4A7C59' : '#E5E5E5' }} />
                        Vegetable Garden
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 500, color: venue.hasMeditationHall ? '#4A7C59' : '#B8B8B8' }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: venue.hasMeditationHall ? '#4A7C59' : '#E5E5E5' }} />
                        Meditation Hall
                      </div>
                    </>
                  )}

                  {venue.type === 'Wellness' && (
                    <>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>
                        <span style={{ color: '#B8B8B8', fontWeight: 400 }}>Type:</span> {venue.wellnessType}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 500, color: venue.offersTherapeuticServices ? '#4A7C59' : '#B8B8B8' }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: venue.offersTherapeuticServices ? '#4A7C59' : '#E5E5E5' }} />
                        Healing Services
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RETREAT: Amenities */}
      {venue.type === 'Retreat' && venue.amenities.length > 0 && (
        <div className="content-card" style={{ marginBottom: 24 }}>
          <div className="card-header">
            <h3 className="card-title">Amenities</h3>
          </div>
          <div style={{ padding: 24, display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {venue.amenities.map((a) => (
              <span key={a} style={{
                padding: '8px 16px', backgroundColor: '#F7F5F1', borderRadius: 20,
                fontSize: 13, fontWeight: 500, color: '#313131',
              }}>
                {a}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* WELLNESS: Facilities */}
      {venue.type === 'Wellness' && venue.facilities && venue.facilities.length > 0 && (
        <div className="content-card" style={{ marginBottom: 24 }}>
          <div className="card-header">
            <h3 className="card-title">Facilities</h3>
          </div>
          <div style={{ padding: 24, display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {venue.facilities.map((f) => (
              <span key={f} style={{
                padding: '8px 16px', backgroundColor: '#E8F4EA', borderRadius: 20,
                fontSize: 13, fontWeight: 500, color: '#4A7C59',
              }}>
                {f}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* WELLNESS: Pricing Tiers */}
      {venue.type === 'Wellness' && venue.pricingTiers && venue.pricingTiers.length > 0 && (
        <div className="content-card" style={{ marginBottom: 24 }}>
          <div className="card-header">
            <h3 className="card-title">Pricing</h3>
          </div>
          <div style={{ padding: 24, display: 'grid', gridTemplateColumns: `repeat(${Math.min(venue.pricingTiers.length, 4)}, 1fr)`, gap: 16 }}>
            {venue.pricingTiers.map((tier, i) => (
              <div key={i} style={{
                padding: 20, borderRadius: 12, border: '1px solid #E5E5E5',
                textAlign: 'center', backgroundColor: i === 0 ? '#FEF9E7' : '#fff',
              }}>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>{tier.label}</div>
                <div style={{ fontSize: 12, color: '#B8B8B8', marginBottom: 12 }}>
                  {tier.days} {tier.days === 1 ? 'day' : 'days'}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                  <DollarSign size={16} color="#4A7C59" />
                  <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 600, color: '#4A7C59' }}>
                    {tier.price.replace('$', '')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Edit Modal */}
      <VenueFormModal
        isOpen={showEdit}
        onClose={() => setShowEdit(false)}
        onSubmit={handleUpdate}
        initialData={venue}
        mode="edit"
      />

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
