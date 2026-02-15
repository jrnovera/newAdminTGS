import { AlertTriangle, X } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  venueName: string;
}

export default function DeleteConfirmModal({ isOpen, onClose, onConfirm, venueName }: DeleteConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container modal-small" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Delete Venue</h2>
          <button className="modal-close" onClick={onClose}><X size={20} /></button>
        </div>
        <div className="modal-body" style={{ textAlign: 'center', padding: '32px 24px' }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%', backgroundColor: '#FCE8E8',
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px',
          }}>
            <AlertTriangle size={32} color="#C45C5C" />
          </div>
          <h3 style={{ fontSize: 18, marginBottom: 8 }}>Are you sure?</h3>
          <p style={{ fontSize: 13, color: '#B8B8B8', marginBottom: 4 }}>
            You are about to permanently delete
          </p>
          <p style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>"{venueName}"</p>
          <p style={{ fontSize: 12, color: '#C45C5C', backgroundColor: '#FCE8E8', padding: '10px 16px', borderRadius: 8 }}>
            This action cannot be undone. All venue data, bookings, and associated records will be permanently removed.
          </p>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-danger" onClick={() => { onConfirm(); onClose(); }}>
            Delete Venue
          </button>
        </div>
      </div>
    </div>
  );
}
