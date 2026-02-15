import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ArrowLeft, Edit3, Trash2, Globe, Mail, Phone, MapPin, Building, Calendar, DollarSign } from 'lucide-react';
import { useVenueOwners } from '../context/VenueOwnerContext';
import OwnerFormModal from '../components/OwnerFormModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import type { VenueOwner } from '../context/VenueOwnerContext';

export default function VenueOwnerDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getOwner, updateOwner, deleteOwner } = useVenueOwners();
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const owner = getOwner(id || '');

  if (!owner) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 0' }}>
        <h2 style={{ fontSize: 28, marginBottom: 12 }}>Owner Not Found</h2>
        <p style={{ color: '#B8B8B8', marginBottom: 24 }}>The venue owner you're looking for doesn't exist or has been removed.</p>
        <button className="btn btn-primary" onClick={() => navigate('/venue-owners')}>
          <ArrowLeft size={16} /> Back to Venue Owners
        </button>
      </div>
    );
  }

  const handleUpdate = (data: Omit<VenueOwner, 'id' | 'joined'>) => {
    updateOwner(owner.id, data);
  };

  const handleDelete = () => {
    deleteOwner(owner.id);
    navigate('/venue-owners');
  };

  const statusClass = (s: string) => {
    switch (s) {
      case 'Active': return 'active';
      case 'Pending': return 'pending';
      case 'Inactive': return 'inactive';
      default: return '';
    }
  };

  return (
    <>
      {/* Back Button & Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <button className="btn btn-secondary" onClick={() => navigate('/venue-owners')} style={{ gap: 8 }}>
          <ArrowLeft size={16} /> Back to Venue Owners
        </button>
        <div className="header-actions">
          <button className="btn btn-secondary" onClick={() => setShowEdit(true)}>
            <Edit3 size={16} /> Edit Owner
          </button>
          <button className="btn btn-danger" onClick={() => setShowDelete(true)}>
            <Trash2 size={16} /> Delete
          </button>
        </div>
      </div>

      {/* Owner Header Card */}
      <div className="content-card" style={{ marginBottom: 24 }}>
        <div style={{ padding: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 20 }}>
            <div style={{
              width: 72, height: 72, borderRadius: '50%',
              background: 'linear-gradient(135deg, #B8B8B8, #888)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontWeight: 600, fontSize: 26, flexShrink: 0,
            }}>
              {owner.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
                <h1 className="page-title" style={{ marginBottom: 0 }}>{owner.name}</h1>
                <span className={`status-badge ${statusClass(owner.status)}`}>{owner.status}</span>
              </div>
              {owner.company && (
                <p style={{ fontSize: 14, color: '#B8B8B8', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <Building size={14} /> {owner.company}
                </p>
              )}
              <p style={{ fontSize: 14, color: '#B8B8B8', display: 'flex', alignItems: 'center', gap: 6 }}>
                <MapPin size={14} /> {owner.location}
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, fontWeight: 600 }}>{owner.revenue}</div>
              <div style={{ fontSize: 12, color: '#B8B8B8' }}>Revenue MTD</div>
            </div>
          </div>

          {owner.bio && (
            <p style={{ fontSize: 14, lineHeight: 1.7, color: '#313131', maxWidth: 800 }}>
              {owner.bio}
            </p>
          )}
        </div>
      </div>

      {/* Info Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
        {/* Contact Info */}
        <div className="content-card">
          <div className="card-header">
            <h3 className="card-title">Contact Information</h3>
          </div>
          <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 13 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: '#E8EFF9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Mail size={16} color="#6B8EC9" />
              </div>
              <div>
                <div style={{ fontSize: 11, color: '#B8B8B8', marginBottom: 2 }}>Email</div>
                <a href={`mailto:${owner.email}`} style={{ color: '#6B8EC9', fontWeight: 500 }}>{owner.email}</a>
              </div>
            </div>
            {owner.phone && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 13 }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: '#E8F4EA', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Phone size={16} color="#4A7C59" />
                </div>
                <div>
                  <div style={{ fontSize: 11, color: '#B8B8B8', marginBottom: 2 }}>Phone</div>
                  <span style={{ fontWeight: 500 }}>{owner.phone}</span>
                </div>
              </div>
            )}
            {owner.website && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 13 }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: '#FEF9E7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Globe size={16} color="#D4A853" />
                </div>
                <div>
                  <div style={{ fontSize: 11, color: '#B8B8B8', marginBottom: 2 }}>Website</div>
                  <a href={owner.website} target="_blank" rel="noopener noreferrer" style={{ color: '#6B8EC9', fontWeight: 500 }}>{owner.website}</a>
                </div>
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 13 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: '#F3E8F9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Calendar size={16} color="#8B5A8B" />
              </div>
              <div>
                <div style={{ fontSize: 11, color: '#B8B8B8', marginBottom: 2 }}>Member Since</div>
                <span style={{ fontWeight: 500 }}>{owner.joined}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Account Details */}
        <div className="content-card">
          <div className="card-header">
            <h3 className="card-title">Account Details</h3>
          </div>
          <div style={{ padding: 24 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <div>
                <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#B8B8B8', marginBottom: 4 }}>Status</div>
                <span className={`status-badge ${statusClass(owner.status)}`}>{owner.status}</span>
              </div>
              <div>
                <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#B8B8B8', marginBottom: 4 }}>Total Venues</div>
                <div style={{ fontWeight: 600, fontSize: 20, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Building size={16} color="#B8B8B8" /> {owner.venues}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#B8B8B8', marginBottom: 4 }}>Revenue MTD</div>
                <div style={{ fontWeight: 600, fontSize: 20, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <DollarSign size={16} color="#4A7C59" /> {owner.revenue}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#B8B8B8', marginBottom: 4 }}>Location</div>
                <div style={{ fontWeight: 500, fontSize: 13 }}>{owner.location}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Managed Venues */}
      {owner.venueNames.length > 0 && (
        <div className="content-card" style={{ marginBottom: 24 }}>
          <div className="card-header">
            <h3 className="card-title">Managed Venues ({owner.venueNames.length})</h3>
          </div>
          <div style={{ padding: 24, display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            {owner.venueNames.map((v) => (
              <div key={v} style={{
                padding: '12px 20px', backgroundColor: '#F7F5F1', borderRadius: 12,
                fontSize: 14, fontWeight: 500, color: '#313131',
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <Building size={14} color="#B8B8B8" />
                {v}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Edit Modal */}
      <OwnerFormModal
        isOpen={showEdit}
        onClose={() => setShowEdit(false)}
        onSubmit={handleUpdate}
        initialData={owner}
        mode="edit"
      />

      {/* Delete Modal */}
      <DeleteConfirmModal
        isOpen={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={handleDelete}
        venueName={owner.name}
      />
    </>
  );
}
