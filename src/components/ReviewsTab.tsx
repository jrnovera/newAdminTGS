import { useState, useEffect, useCallback } from 'react';
import { Star, Plus, Pencil, Trash2, X, User, Image } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Venue } from '../context/VenueContext';

interface ReviewsTabProps {
    venue: Venue;
    onUpdate?: (updates: Partial<Venue>) => void;
}

interface Review {
    id: string;
    venue_id: string;
    venue_type: string;
    user_name: string;
    user_image_url: string | null;
    rating: number;
    review_text: string;
    created_at: string;
}

const emptyForm = {
    user_name: '',
    user_image_url: '',
    rating: 5,
    review_text: '',
};

function StarRating({ value, size = 16, interactive = false, onChange }: {
    value: number;
    size?: number;
    interactive?: boolean;
    onChange?: (v: number) => void;
}) {
    const [hover, setHover] = useState(0);
    return (
        <div className="star-rating-row" style={{ display: 'flex', gap: 2 }}>
            {[1, 2, 3, 4, 5].map(i => (
                <button
                    key={i}
                    type="button"
                    className={`star-btn${i <= (hover || value) ? ' filled' : ''}`}
                    style={{
                        background: 'none', border: 'none', padding: 0,
                        cursor: interactive ? 'pointer' : 'default',
                        color: i <= (hover || value) ? '#F59E0B' : '#555',
                        transition: 'color .15s, transform .15s',
                        transform: interactive && i <= hover ? 'scale(1.2)' : 'scale(1)',
                    }}
                    onMouseEnter={() => interactive && setHover(i)}
                    onMouseLeave={() => interactive && setHover(0)}
                    onClick={() => interactive && onChange?.(i)}
                    tabIndex={interactive ? 0 : -1}
                >
                    <Star size={size} fill={i <= (hover || value) ? '#F59E0B' : 'none'} />
                </button>
            ))}
        </div>
    );
}

function formatDate(dateStr: string): string {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function ReviewsTab({ venue }: ReviewsTabProps) {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [editingReview, setEditingReview] = useState<Review | null>(null);
    const [form, setForm] = useState(emptyForm);
    const [saving, setSaving] = useState(false);

    // Delete confirmation
    const [deleteId, setDeleteId] = useState<string | null>(null);

    // ─── Fetch ──────────────────────────────────────────────────────────
    const fetchReviews = useCallback(async () => {
        if (!venue.id) return;
        setLoading(true);
        const { data } = await supabase
            .from('venue_reviews')
            .select('*')
            .eq('venue_id', venue.id)
            .order('created_at', { ascending: false });
        setReviews(data || []);
        setLoading(false);
    }, [venue.id]);

    useEffect(() => { fetchReviews(); }, [fetchReviews]);

    // ─── Create / Update ────────────────────────────────────────────────
    function openAdd() {
        setEditingReview(null);
        setForm(emptyForm);
        setShowModal(true);
    }

    function openEdit(review: Review) {
        setEditingReview(review);
        setForm({
            user_name: review.user_name,
            user_image_url: review.user_image_url || '',
            rating: review.rating,
            review_text: review.review_text,
        });
        setShowModal(true);
    }

    async function handleSave() {
        if (!form.user_name || !form.review_text) return;
        setSaving(true);

        try {
            if (editingReview) {
                // Update
                const { error } = await supabase.from('venue_reviews').update({
                    venue_type: venue.type.toLowerCase(),
                    user_name: form.user_name,
                    user_image_url: form.user_image_url || null,
                    rating: form.rating,
                    review_text: form.review_text,
                }).eq('id', editingReview.id);
                if (error) throw error;
            } else {
                // Create
                const { error } = await supabase.from('venue_reviews').insert({
                    venue_id: venue.id,
                    venue_type: venue.type.toLowerCase(),
                    user_name: form.user_name,
                    user_image_url: form.user_image_url || null,
                    rating: form.rating,
                    review_text: form.review_text,
                });
                if (error) throw error;
            }

            await fetchReviews();
            setShowModal(false);
            setForm(emptyForm);
            setEditingReview(null);
        } catch (err: any) {
            console.error('Failed to save review:', err);
            alert(`Failed to save review: ${err.message || 'Unknown error'}`);
        } finally {
            setSaving(false);
        }
    }

    // ─── Delete ─────────────────────────────────────────────────────────
    async function handleDelete() {
        if (!deleteId) return;
        await supabase.from('venue_reviews').delete().eq('id', deleteId);
        setDeleteId(null);
        await fetchReviews();
    }

    // ─── Stats ──────────────────────────────────────────────────────────
    const total = reviews.length;
    const avg = total > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / total : 0;
    const ratingCounts = [5, 4, 3, 2, 1].map(star => ({
        star,
        count: reviews.filter(r => r.rating === star).length,
    }));

    // ─── Render ─────────────────────────────────────────────────────────
    return (
        <div>
            {/* Stats */}
            <div className="reviews-stats">
                <div className="reviews-stat reviews-stat-highlight">
                    <div className="reviews-stat-value">{total}</div>
                    <div className="reviews-stat-label">Total Reviews</div>
                </div>
                <div className="reviews-stat reviews-stat-highlight">
                    <div className="reviews-stat-value" style={{ color: '#F59E0B' }}>
                        {avg > 0 ? avg.toFixed(1) : '—'}
                    </div>
                    <div className="reviews-stat-label">Avg Rating</div>
                </div>
                {ratingCounts.map(rc => (
                    <div key={rc.star} className="reviews-stat">
                        <div className="reviews-stat-value">{rc.count}</div>
                        <div className="reviews-stat-label">
                            {rc.star}
                            <Star size={12} fill="#F59E0B" color="#F59E0B" style={{ marginLeft: 2, verticalAlign: -1 }} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Rating Distribution Bar */}
            {total > 0 && (
                <section className="form-section">
                    <div className="form-section-header">
                        <div>
                            <h3 className="form-section-title">Rating Distribution</h3>
                        </div>
                    </div>
                    <div className="form-section-body">
                        <div className="reviews-distribution">
                            {ratingCounts.map(rc => (
                                <div key={rc.star} className="reviews-dist-row">
                                    <span className="reviews-dist-label">{rc.star} ★</span>
                                    <div className="reviews-dist-bar-bg">
                                        <div
                                            className="reviews-dist-bar-fill"
                                            style={{ width: `${total > 0 ? (rc.count / total) * 100 : 0}%` }}
                                        />
                                    </div>
                                    <span className="reviews-dist-count">{rc.count}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Reviews List */}
            <section className="form-section">
                <div className="form-section-header">
                    <div>
                        <h3 className="form-section-title">All Reviews</h3>
                        <p className="form-section-subtitle">Manage user reviews for {venue.name}</p>
                    </div>
                    <button className="btn btn-primary btn-small" onClick={openAdd}>
                        <Plus size={14} style={{ marginRight: 6 }} /> Add Review
                    </button>
                </div>
                <div className="form-section-body">
                    {loading && (
                        <p style={{ color: 'var(--accent)', fontSize: 13 }}>Loading reviews…</p>
                    )}

                    {!loading && reviews.length === 0 && (
                        <div className="reviews-empty">
                            <Star size={48} strokeWidth={1} color="#555" />
                            <p>No reviews yet</p>
                            <span>Click "Add Review" to create the first one.</span>
                        </div>
                    )}

                    <div className="reviews-list">
                        {reviews.map(review => (
                            <div key={review.id} className="review-card">
                                <div className="review-card-left">
                                    <div className="review-avatar">
                                        {review.user_image_url ? (
                                            <img src={review.user_image_url} alt={review.user_name} />
                                        ) : (
                                            <User size={22} strokeWidth={1.5} />
                                        )}
                                    </div>
                                </div>
                                <div className="review-card-body">
                                    <div className="review-card-top">
                                        <div>
                                            <span className="review-user-name">{review.user_name}</span>
                                            <span className="review-date">{formatDate(review.created_at)}</span>
                                        </div>
                                        <StarRating value={review.rating} size={14} />
                                    </div>
                                    <p className="review-text">{review.review_text}</p>
                                </div>
                                <div className="review-card-actions">
                                    <button
                                        className="review-action-btn"
                                        title="Edit"
                                        onClick={() => openEdit(review)}
                                    >
                                        <Pencil size={14} />
                                    </button>
                                    <button
                                        className="review-action-btn danger"
                                        title="Delete"
                                        onClick={() => setDeleteId(review.id)}
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── Add / Edit Modal ──────────────────────────────────────────── */}
            {showModal && (
                <div className="wvd-modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="wvd-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 520 }}>
                        <div className="wvd-modal-header">
                            <h3 className="wvd-modal-title">
                                {editingReview ? 'Edit Review' : 'Add Review'}
                            </h3>
                            <button className="wvd-modal-close" onClick={() => setShowModal(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="wvd-modal-body">
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                <div className="wvd-form-group" style={{ gridColumn: '1 / -1' }}>
                                    <label className="wvd-form-label">
                                        <User size={14} style={{ marginRight: 6, verticalAlign: -2 }} />
                                        User Name *
                                    </label>
                                    <input
                                        type="text"
                                        className="wvd-form-input"
                                        placeholder="e.g. Jane Doe"
                                        value={form.user_name}
                                        onChange={e => setForm(p => ({ ...p, user_name: e.target.value }))}
                                    />
                                </div>
                                <div className="wvd-form-group" style={{ gridColumn: '1 / -1' }}>
                                    <label className="wvd-form-label">
                                        <Image size={14} style={{ marginRight: 6, verticalAlign: -2 }} />
                                        User Image URL
                                    </label>
                                    <input
                                        type="text"
                                        className="wvd-form-input"
                                        placeholder="https://example.com/avatar.jpg"
                                        value={form.user_image_url}
                                        onChange={e => setForm(p => ({ ...p, user_image_url: e.target.value }))}
                                    />
                                    {form.user_image_url && (
                                        <div style={{ marginTop: 8 }}>
                                            <img
                                                src={form.user_image_url}
                                                alt="Preview"
                                                style={{
                                                    width: 48, height: 48, borderRadius: '50%',
                                                    objectFit: 'cover', border: '2px solid #333',
                                                }}
                                                onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                            />
                                        </div>
                                    )}
                                </div>
                                <div className="wvd-form-group" style={{ gridColumn: '1 / -1' }}>
                                    <label className="wvd-form-label">Rating *</label>
                                    <StarRating value={form.rating} size={24} interactive onChange={v => setForm(p => ({ ...p, rating: v }))} />
                                </div>
                                <div className="wvd-form-group" style={{ gridColumn: '1 / -1' }}>
                                    <label className="wvd-form-label">Review Text *</label>
                                    <textarea
                                        className="wvd-form-textarea"
                                        rows={4}
                                        placeholder="Write the review here…"
                                        value={form.review_text}
                                        onChange={e => setForm(p => ({ ...p, review_text: e.target.value }))}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="wvd-modal-footer">
                            <button className="wvd-btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                            <button
                                className="wvd-btn-primary"
                                onClick={handleSave}
                                disabled={saving || !form.user_name || !form.review_text}
                            >
                                {saving ? 'Saving…' : editingReview ? 'Update Review' : 'Add Review'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ─── Delete Confirmation Modal ─────────────────────────────────── */}
            {deleteId && (
                <div className="wvd-modal-overlay" onClick={() => setDeleteId(null)}>
                    <div className="wvd-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 420 }}>
                        <div className="wvd-modal-header">
                            <h3 className="wvd-modal-title">Delete Review</h3>
                            <button className="wvd-modal-close" onClick={() => setDeleteId(null)}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="wvd-modal-body">
                            <p style={{ fontSize: 14, color: '#ccc' }}>
                                Are you sure you want to delete this review? This action cannot be undone.
                            </p>
                        </div>
                        <div className="wvd-modal-footer">
                            <button className="wvd-btn-secondary" onClick={() => setDeleteId(null)}>Cancel</button>
                            <button
                                className="wvd-btn-primary"
                                style={{ background: '#EF4444' }}
                                onClick={handleDelete}
                            >
                                Delete Review
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
