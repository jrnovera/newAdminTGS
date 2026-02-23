import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ArrowLeft, Edit3, Trash2, Globe, Mail, Phone, MapPin, Users, Calendar, AlertCircle, PlusCircle, Info } from 'lucide-react';
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

  const handleUpdate = async (data: Omit<Venue, 'id' | 'date'>) => {
    try {
      await updateVenue(venue.id, data);
      setShowEdit(false);
    } catch (err) {
      console.error('Failed to update venue:', err);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteVenue(venue.id);
      navigate('/venues');
    } catch (err) {
      console.error('Failed to delete venue:', err);
    }
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <button
          className="btn btn-secondary"
          onClick={() => navigate('/venues')}
          style={{ gap: 8 }}
        >
          <ArrowLeft size={16} /> Back to Venues
        </button>
        <div className="header-actions" style={{ display: 'flex', gap: 12 }}>
          <button className="btn btn-secondary" onClick={() => setShowEdit(true)}>
            <Edit3 size={16} /> Edit Venue
          </button>
          <button className="btn btn-danger" onClick={() => setShowDelete(true)}>
            <Trash2 size={16} /> Delete
          </button>
        </div>
      </div>

      {/* Hero Image Section */}
      <div className="content-card" style={{ marginBottom: 24, overflow: 'hidden' }}>
        <div style={{
          height: 350,
          width: '100%',
          position: 'relative',
          backgroundColor: '#F1F1F1',
          backgroundImage: venue.heroImage ? `url(${venue.heroImage})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'flex-end'
        }}>
          {!venue.heroImage && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#B8B8B8', flexDirection: 'column', gap: 12 }}>
              <Globe size={48} strokeWidth={1} />
              <span>No Hero Image Uploaded</span>
            </div>
          )}
          <div style={{
            padding: '40px 32px',
            background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
            width: '100%',
            color: '#fff'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <h1 style={{ margin: 0, fontSize: 36, fontWeight: 700 }}>{venue.name}</h1>
              <span className={`badge ${venue.type === 'Retreat' ? 'badge-retreat' : 'badge-wellness'}`} style={{ backgroundColor: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff' }}>
                {venue.type}
              </span>
            </div>
            <p style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 16, opacity: 0.9 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <MapPin size={16} /> {venue.location}
              </span>
              {venue.locationSetting && (
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Globe size={16} /> {venue.locationSetting}
                </span>
              )}
            </p>
          </div>
        </div>

        <div style={{ padding: 32 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 40 }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
                <span className={`status-badge ${statusClass(venue.status)}`}>
                  <span className="status-dot"></span> {venue.status}
                </span>
                {venue.type === 'Retreat' && (
                  <span className={`subscription-badge ${subClass(venue.subscription)}`}>
                    {venue.subscription}
                  </span>
                )}
                <span style={{ fontSize: 13, color: '#B8B8B8' }}>
                  <Calendar size={14} style={{ verticalAlign: -2, marginRight: 6 }} />
                  Added {venue.date}
                </span>
              </div>

              {venue.quote && (
                <div style={{ marginBottom: 24, paddingLeft: 20, borderLeft: '4px solid #8B4513' }}>
                  <p style={{ fontSize: 20, fontStyle: 'italic', color: '#8B4513', lineHeight: 1.5, margin: 0 }}>
                    "{venue.quote}"
                  </p>
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {venue.introParagraph1 && (
                  <p style={{ fontSize: 15, lineHeight: 1.7, color: '#313131', margin: 0 }}>{venue.introParagraph1}</p>
                )}
                {venue.introParagraph2 && (
                  <p style={{ fontSize: 15, lineHeight: 1.7, color: '#313131', margin: 0 }}>{venue.introParagraph2}</p>
                )}
                {!venue.introParagraph1 && !venue.introParagraph2 && venue.description && (
                  <p style={{ fontSize: 15, lineHeight: 1.7, color: '#313131', margin: 0 }}>{venue.description}</p>
                )}
              </div>

              {venue.modalities && venue.modalities.length > 0 && (
                <div style={{ marginTop: 24 }}>
                  <h4 style={{ margin: '0 0 12px 0', fontSize: 14, color: '#B8B8B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Focus & Modalities</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {venue.modalities.map(m => (
                      <span key={m} style={{
                        padding: '6px 14px',
                        backgroundColor: '#F0F7F0',
                        color: '#4A7C59',
                        borderRadius: 20,
                        fontSize: 13,
                        fontWeight: 500,
                        border: '1px solid #E2EFE2'
                      }}>
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div style={{ width: 300, display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div className="content-card" style={{ padding: 20, borderRadius: 12, backgroundColor: '#FAF9F6' }}>
                <h4 style={{ margin: '0 0 16px 0', fontSize: 14, color: '#B8B8B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Contact Info</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14 }}>
                    <Users size={16} color="#8B4513" />
                    <strong>{venue.owner}</strong>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14 }}>
                    <Mail size={16} color="#B8B8B8" />
                    <a href={`mailto:${venue.email}`} style={{ color: '#6B8EC9', textDecoration: 'none' }}>{venue.email}</a>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14 }}>
                    <Phone size={16} color="#B8B8B8" />
                    {venue.phone}
                  </div>
                  {venue.website && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14 }}>
                      <Globe size={16} color="#B8B8B8" />
                      <a href={venue.website} target="_blank" rel="noopener noreferrer" style={{ color: '#6B8EC9', textDecoration: 'none' }}>Website</a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Section */}
      {venue.galleryPhotos && venue.galleryPhotos.length > 0 && (
        <div className="content-card" style={{ marginBottom: 24, padding: 32 }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: 20, fontWeight: 600 }}>Gallery Preview</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            {venue.galleryPhotos.map((url, i) => (
              <div key={i} style={{
                aspectRatio: '4/3',
                borderRadius: 12,
                backgroundImage: `url(${url})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundColor: '#F1F1F1'
              }} />
            ))}
          </div>
        </div>
      )}

      {/* Practitioners Section */}
      {venue.practitioners && venue.practitioners.length > 0 && (
        <div className="content-card" style={{ marginBottom: 24, padding: 32 }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: 20, fontWeight: 600 }}>Meet Our Team</h3>
          <div style={{ display: 'flex', gap: 24, overflowX: 'auto', paddingBottom: 8 }}>
            {venue.practitioners.map((p) => (
              <div key={p.id} style={{
                flexShrink: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: 120
              }}>
                <div style={{
                  width: 100,
                  height: 100,
                  borderRadius: '50%',
                  backgroundImage: `url(${p.photo})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundColor: '#F1F1F1',
                  marginBottom: 12,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                }} />
                <span style={{ fontSize: 14, fontWeight: 600, textAlign: 'center', color: '#313131' }}>{p.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Services & Offerings (For Wellness) */}
      {(venue.services?.length || venue.packages?.length) && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
          {venue.services && venue.services.length > 0 && (
            <div className="content-card">
              <div className="card-header">
                <h3 className="card-title">Services & Treatments</h3>
              </div>
              <div style={{ padding: 24 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {venue.services.map((s, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', backgroundColor: '#FAF9F6', borderRadius: 10 }}>
                      <div>
                        <div style={{ fontWeight: 600 }}>{s.name}</div>
                        {s.duration && <div style={{ fontSize: 12, color: '#B8B8B8', marginTop: 2 }}>{s.duration}</div>}
                      </div>
                      <div style={{ color: '#4A7C59', fontWeight: 700 }}>{s.price}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          {venue.packages && venue.packages.length > 0 && (
            <div className="content-card">
              <div className="card-header">
                <h3 className="card-title">Packages</h3>
              </div>
              <div style={{ padding: 24 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {venue.packages.map((p, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', border: '1px solid #E5E5E5', borderRadius: 10 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        {p.thumbnail && (
                          <img src={p.thumbnail} alt="" style={{ width: 40, height: 40, borderRadius: 6, objectFit: 'cover' }} />
                        )}
                        <div style={{ fontWeight: 600 }}>{p.name}</div>
                      </div>
                      <div style={{ color: '#4A7C59', fontWeight: 700 }}>{p.price}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Accommodation & Rooms Detail */}
      {venue.showAccommodationSection && (
        <div className="content-card" style={{ marginBottom: 24 }}>
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 className="card-title">Accommodation & Rooms</h3>
              <p style={{ margin: '4px 0 0 0', fontSize: 13, color: '#B8B8B8' }}>{venue.individualRooms?.length || 0} Individual rooms available</p>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {venue.accommodationAmenities?.slice(0, 3).map(a => (
                <span key={a} style={{ fontSize: 11, padding: '4px 10px', backgroundColor: '#F1F1F1', borderRadius: 12, color: '#666' }}>{a}</span>
              ))}
            </div>
          </div>
          <div style={{ padding: 32 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
              {(venue.individualRooms || []).map(room => (
                <div key={room.id} style={{ display: 'flex', gap: 20, padding: 16, border: '1px solid #F1F1F1', borderRadius: 16 }}>
                  <div style={{
                    width: 140,
                    height: 140,
                    borderRadius: 12,
                    backgroundImage: `url(${room.roomImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundColor: '#F1F1F1',
                    flexShrink: 0
                  }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <h4 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>{room.roomName}</h4>
                      <span style={{ fontSize: 14, fontWeight: 700, color: '#4A7C59' }}>{room.pricePerNight}</span>
                    </div>
                    <div style={{ fontSize: 12, color: '#B8B8B8', marginBottom: 10 }}>{room.roomType} • Max {room.maxOccupancy} Guests</div>
                    <p style={{ margin: '0 0 12px 0', fontSize: 13, color: '#666', lineHeight: 1.4, height: 36, overflow: 'hidden' }}>{room.websiteDescription}</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {Object.entries(room.bedConfiguration || {}).map(([key, count]) => {
                        if (count > 0) {
                          return (
                            <span key={key} style={{ fontSize: 11, padding: '2px 8px', backgroundColor: '#FAF9F6', borderRadius: 4, color: '#8B4513' }}>
                              {count}x {key.replace('Beds', '')}
                            </span>
                          );
                        }
                        return null;
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {venue.addOns && venue.addOns.length > 0 && (
              <div style={{ marginTop: 24, paddingTop: 24, borderTop: '1px solid #F1F1F1' }}>
                <h4 style={{ margin: '0 0 16px 0', fontSize: 15, fontWeight: 600 }}>Available Add-ons</h4>
                <div style={{ display: 'flex', gap: 16 }}>
                  {venue.addOns.map((addon, i) => (
                    <div key={i} style={{ padding: '10px 16px', backgroundColor: '#FAF9F6', borderRadius: 8, display: 'flex', gap: 12, fontSize: 14 }}>
                      <span>{addon.name}</span>
                      <strong style={{ color: '#4A7C59' }}>{addon.price}</strong>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Detailed Policies & Practical Info */}
      <div style={{ marginBottom: 48 }}>
        <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 20 }}>Getting There & Policies</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
          {venue.directions && (
            <div className="content-card" style={{ padding: 24 }}>
              <div style={{ fontWeight: 600, color: '#4A7C59', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                <MapPin size={20} />
                Directions
              </div>
              <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: '#666', whiteSpace: 'pre-line' }}>{venue.directions}</p>
            </div>
          )}
          {venue.houseRules && (
            <div className="content-card" style={{ padding: 24 }}>
              <div style={{ fontWeight: 600, color: '#4A7C59', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                <AlertCircle size={20} />
                House Rules
              </div>
              <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: '#666', whiteSpace: 'pre-line' }}>{venue.houseRules}</p>
            </div>
          )}
          {venue.healthSafety && (
            <div className="content-card" style={{ padding: 24 }}>
              <div style={{ fontWeight: 600, color: '#4A7C59', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                <PlusCircle size={20} />
                Health & Safety
              </div>
              <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: '#666', whiteSpace: 'pre-line' }}>{venue.healthSafety}</p>
            </div>
          )}
          {venue.ageRequirements && (
            <div className="content-card" style={{ padding: 24 }}>
              <div style={{ fontWeight: 600, color: '#4A7C59', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Users size={20} />
                Age Requirements
              </div>
              <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: '#666', whiteSpace: 'pre-line' }}>{venue.ageRequirements}</p>
            </div>
          )}
          {venue.bookingPolicy && (
            <div className="content-card" style={{ padding: 24 }}>
              <div style={{ fontWeight: 600, color: '#4A7C59', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Calendar size={20} />
                Booking Policy
              </div>
              <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: '#666', whiteSpace: 'pre-line' }}>{venue.bookingPolicy}</p>
            </div>
          )}
          {venue.cancellationPolicy && (
            <div className="content-card" style={{ padding: 24 }}>
              <div style={{ fontWeight: 600, color: '#4A7C59', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Info size={20} />
                Cancellation Policy
              </div>
              <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: '#666', whiteSpace: 'pre-line' }}>{venue.cancellationPolicy}</p>
            </div>
          )}
          <div className="content-card" style={{ padding: 24 }}>
            <div style={{ fontWeight: 600, color: '#4A7C59', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Globe size={20} />
              Languages
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {(venue.languages || ['English']).map(lang => (
                <span key={lang} style={{ padding: '6px 12px', border: '1px solid #F1F1F1', borderRadius: 6, fontSize: 13 }}>{lang}</span>
              ))}
            </div>
          </div>
          <div className="content-card" style={{ padding: 24 }}>
            <div style={{ fontWeight: 600, color: '#4A7C59', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: venue.wheelchairAccessible ? '#4A7C59' : '#E5E5E5' }} />
              Accessibility
            </div>
            <span style={{ fontSize: 14, fontWeight: 500, color: venue.wheelchairAccessible ? '#4A7C59' : '#B8B8B8' }}>{venue.wheelchairAccessible ? 'Wheelchair Accessible' : 'Not Accessible'}</span>
          </div>
        </div>
      </div>

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
