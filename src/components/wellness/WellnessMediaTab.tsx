import { useState, useEffect, useRef } from 'react';
import { Image as ImageIcon, Film, Box, Upload, X, Check, FileText, Plus, Trash2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { uploadFile, deleteFile } from '../../lib/storage';
import type { Venue } from '../../context/VenueContext';

interface GalleryPhoto {
    id: string;
    image_url: string;
    category: string;
    sort_order: number;
}

interface VideoRecord {
    id: string;
    video_url: string;
    video_title: string;
    video_type: string;
    is_featured: boolean;
    video_description: string;
}

interface DocumentRecord {
    id: string;
    file_url: string;
    file_name: string;
    file_size_bytes: number;
    file_type: string;
}

interface Props {
    venue: Venue;
    onUpdate: (updates: Partial<Venue>) => void;
}

const GALLERY_CATEGORIES = ['All Photos', 'Exterior', 'Treatment Rooms', 'Relaxation Areas', 'Reception', 'Pool & Spa', 'Wellness Spaces', 'Grounds'];
const VIDEO_TYPES = ['Property Tour', 'Treatment Showcase', 'Promotional', 'Testimonial', 'Behind the Scenes'];

function formatBytes(bytes: number): string {
    if (!bytes) return '0 B';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

export default function WellnessMediaTab({ venue }: Props) {
    const [activeCategory, setActiveCategory] = useState('All Photos');
    const [saving, setSaving] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    // venue_media fields
    const [heroImageUrl, setHeroImageUrl] = useState('');
    const [heroAltText, setHeroAltText] = useState('');
    const [heroCaption, setHeroCaption] = useState('');
    const [virtualTourUrl, setVirtualTourUrl] = useState('');
    const [socialShareImage, setSocialShareImage] = useState('');
    const [twitterCardImage, setTwitterCardImage] = useState('');
    const [mediaRecordId, setMediaRecordId] = useState<string | null>(null);
    const [heroUploading, setHeroUploading] = useState(false);
    const [socialUploading, setSocialUploading] = useState(false);
    const [twitterUploading, setTwitterUploading] = useState(false);

    // Gallery
    const [gallery, setGallery] = useState<GalleryPhoto[]>([]);
    const [galleryUploading, setGalleryUploading] = useState(false);

    // Videos
    const [videos, setVideos] = useState<VideoRecord[]>([]);
    const [videoUrl, setVideoUrl] = useState('');
    const [videoTitle, setVideoTitle] = useState('');
    const [videoType, setVideoType] = useState('Property Tour');
    const [isFeaturedVideo, setIsFeaturedVideo] = useState(false);
    const [videoDescription, setVideoDescription] = useState('');
    const [addingVideo, setAddingVideo] = useState(false);

    // Documents
    const [documents, setDocuments] = useState<DocumentRecord[]>([]);
    const [docUploading, setDocUploading] = useState(false);

    const heroInputRef = useRef<HTMLInputElement>(null);
    const galleryInputRef = useRef<HTMLInputElement>(null);
    const socialInputRef = useRef<HTMLInputElement>(null);
    const twitterInputRef = useRef<HTMLInputElement>(null);
    const docInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        loadData();
    }, [venue.id]);

    async function loadData() {
        const [{ data: media }, { data: galleryData }, { data: videoData }, { data: docData }] = await Promise.all([
            supabase.from('venue_media').select('*').eq('venue_id', venue.id).eq('venue_type', 'wellness').maybeSingle(),
            supabase.from('venue_gallery').select('*').eq('venue_id', venue.id).eq('venue_type', 'wellness').order('sort_order', { ascending: true }),
            supabase.from('venue_videos').select('*').eq('venue_id', venue.id).eq('venue_type', 'wellness').order('created_at', { ascending: true }),
            supabase.from('venue_documents').select('*').eq('venue_id', venue.id).eq('venue_type', 'wellness').eq('doc_category', 'asset').order('created_at', { ascending: true }),
        ]);

        if (media) {
            setMediaRecordId(media.id);
            setHeroImageUrl(media.hero_image_url || '');
            setHeroAltText(media.hero_image_alt || '');
            setHeroCaption(media.hero_image_caption || '');
            setVirtualTourUrl(media.virtual_tour_url || '');
            setSocialShareImage(media.social_share_image || '');
            setTwitterCardImage(media.twitter_card_image || '');
        }
        setGallery(galleryData || []);
        setVideos(videoData || []);
        setDocuments(docData || []);
    }

    async function handleSave() {
        setSaving(true);
        setStatus(null);
        try {
            const payload = {
                venue_id: venue.id,
                venue_type: 'wellness',
                hero_image_url: heroImageUrl || null,
                hero_image_alt: heroAltText || null,
                hero_image_caption: heroCaption || null,
                virtual_tour_url: virtualTourUrl || null,
                social_share_image: socialShareImage || null,
                twitter_card_image: twitterCardImage || null,
            };

            if (mediaRecordId) {
                const { error } = await supabase.from('venue_media').update(payload).eq('id', mediaRecordId);
                if (error) throw error;
            } else {
                const { data, error } = await supabase.from('venue_media').insert(payload).select('id').single();
                if (error) throw error;
                setMediaRecordId(data.id);
            }

            setStatus({ type: 'success', message: 'Media saved successfully!' });
            setTimeout(() => setStatus(null), 4000);
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : String(err);
            setStatus({ type: 'error', message: 'Error saving: ' + msg });
        } finally {
            setSaving(false);
        }
    }

    async function handleHeroUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        setHeroUploading(true);
        try {
            if (heroImageUrl) await deleteFile(heroImageUrl, 'photo');
            const url = await uploadFile(file, 'photo');
            setHeroImageUrl(url);
        } catch (err) {
            console.error('Hero upload error:', err);
        } finally {
            setHeroUploading(false);
            e.target.value = '';
        }
    }

    async function handleGalleryUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const files = Array.from(e.target.files || []);
        if (!files.length) return;
        setGalleryUploading(true);
        try {
            for (const file of files) {
                const url = await uploadFile(file, 'photo');
                const cat = activeCategory !== 'All Photos' ? activeCategory : 'Exterior';
                const { data, error } = await supabase.from('venue_gallery').insert({
                    venue_id: venue.id,
                    venue_type: 'wellness',
                    image_url: url,
                    category: cat,
                    sort_order: gallery.length + 1,
                }).select('*').single();
                if (error) throw error;
                setGallery(prev => [...prev, data]);
            }
        } catch (err) {
            console.error('Gallery upload error:', err);
        } finally {
            setGalleryUploading(false);
            e.target.value = '';
        }
    }

    async function handleDeletePhoto(photo: GalleryPhoto) {
        try {
            const { error } = await supabase.from('venue_gallery').delete().eq('id', photo.id);
            if (error) throw error;
            if (photo.image_url) await deleteFile(photo.image_url, 'photo');
            setGallery(prev => prev.filter(p => p.id !== photo.id));
        } catch (err) {
            console.error('Delete photo error:', err);
        }
    }

    async function handleAddVideo() {
        if (!videoUrl.trim()) return;
        setAddingVideo(true);
        try {
            const { data, error } = await supabase.from('venue_videos').insert({
                venue_id: venue.id,
                venue_type: 'wellness',
                video_url: videoUrl.trim(),
                video_title: videoTitle.trim(),
                video_type: videoType,
                is_featured: isFeaturedVideo,
                video_description: videoDescription.trim(),
            }).select('*').single();
            if (error) throw error;
            setVideos(prev => [...prev, data]);
            setVideoUrl('');
            setVideoTitle('');
            setVideoType('Property Tour');
            setIsFeaturedVideo(false);
            setVideoDescription('');
        } catch (err) {
            console.error('Add video error:', err);
        } finally {
            setAddingVideo(false);
        }
    }

    async function handleDeleteVideo(video: VideoRecord) {
        try {
            const { error } = await supabase.from('venue_videos').delete().eq('id', video.id);
            if (error) throw error;
            setVideos(prev => prev.filter(v => v.id !== video.id));
        } catch (err) {
            console.error('Delete video error:', err);
        }
    }

    async function handleSocialUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        setSocialUploading(true);
        try {
            if (socialShareImage) await deleteFile(socialShareImage, 'photo');
            const url = await uploadFile(file, 'photo');
            setSocialShareImage(url);
        } catch (err) {
            console.error('Social upload error:', err);
        } finally {
            setSocialUploading(false);
            e.target.value = '';
        }
    }

    async function handleTwitterUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        setTwitterUploading(true);
        try {
            if (twitterCardImage) await deleteFile(twitterCardImage, 'photo');
            const url = await uploadFile(file, 'photo');
            setTwitterCardImage(url);
        } catch (err) {
            console.error('Twitter upload error:', err);
        } finally {
            setTwitterUploading(false);
            e.target.value = '';
        }
    }

    async function handleDocUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        setDocUploading(true);
        try {
            const url = await uploadFile(file, 'photo');
            const { data, error } = await supabase.from('venue_documents').insert({
                venue_id: venue.id,
                venue_type: 'wellness',
                file_url: url,
                file_name: file.name,
                file_size_bytes: file.size,
                file_type: file.type,
                doc_category: 'asset',
            }).select('*').single();
            if (error) throw error;
            setDocuments(prev => [...prev, data]);
        } catch (err) {
            console.error('Doc upload error:', err);
        } finally {
            setDocUploading(false);
            e.target.value = '';
        }
    }

    async function handleDeleteDoc(doc: DocumentRecord) {
        try {
            const { error } = await supabase.from('venue_documents').delete().eq('id', doc.id);
            if (error) throw error;
            if (doc.file_url) await deleteFile(doc.file_url, 'photo');
            setDocuments(prev => prev.filter(d => d.id !== doc.id));
        } catch (err) {
            console.error('Delete doc error:', err);
        }
    }

    const filteredGallery = activeCategory === 'All Photos'
        ? gallery
        : gallery.filter(p => p.category === activeCategory);

    const categoryCounts: Record<string, number> = { 'All Photos': gallery.length };
    gallery.forEach(p => {
        categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
    });

    return (
        <div className="wvd-content">
            {/* Hidden file inputs */}
            <input ref={heroInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleHeroUpload} />
            <input ref={galleryInputRef} type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={handleGalleryUpload} />
            <input ref={socialInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleSocialUpload} />
            <input ref={twitterInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleTwitterUpload} />
            <input ref={docInputRef} type="file" accept=".pdf,.doc,.docx" style={{ display: 'none' }} onChange={handleDocUpload} />

            {/* Floating Save Bar */}
            <div className="floating-save-bar">
                {status && (
                    <span style={{
                        marginRight: 12, fontSize: 13,
                        color: status.type === 'success' ? 'var(--success)' : 'var(--error)'
                    }}>
                        {status.message}
                    </span>
                )}
                <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                    {saving ? 'Saving...' : 'Save Media'}
                </button>
            </div>

            {/* Media Stats */}
            <div className="wm-media-stats">
                <div className="wm-media-stat">
                    <div className="wm-media-stat-value">{gallery.length}</div>
                    <div className="wm-media-stat-label">Total Photos</div>
                </div>
                <div className="wm-media-stat">
                    <div className="wm-media-stat-value">{videos.length}</div>
                    <div className="wm-media-stat-label">Videos</div>
                </div>
                <div className="wm-media-stat">
                    <div className="wm-media-stat-value">{virtualTourUrl ? 1 : 0}</div>
                    <div className="wm-media-stat-label">Virtual Tour</div>
                </div>
                <div className="wm-media-stat">
                    <div className="wm-media-stat-value">{documents.length}</div>
                    <div className="wm-media-stat-label">Documents</div>
                </div>
            </div>

            {/* Hero Image */}
            <section className="wvd-form-section">
                <div className="wvd-form-section-header">
                    <div>
                        <h3 className="wvd-form-section-title">Hero Image</h3>
                        <p className="wvd-form-hint">Primary image displayed on listing cards and page headers</p>
                    </div>
                    <button className="wvd-btn-secondary wvd-btn-small" onClick={() => heroInputRef.current?.click()} disabled={heroUploading}>
                        <Upload size={14} /> {heroUploading ? 'Uploading...' : 'Replace Image'}
                    </button>
                </div>
                <div className="wvd-form-section-body">
                    <div className="wm-hero-container">
                        <div className="wm-hero-image">
                            {heroImageUrl ? (
                                <img src={heroImageUrl} alt={heroAltText} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }} />
                            ) : (
                                <div className="wm-hero-placeholder" style={{ cursor: 'pointer' }} onClick={() => heroInputRef.current?.click()}>
                                    <ImageIcon size={64} strokeWidth={1} />
                                    <div style={{ fontSize: '14px', marginTop: '12px' }}>Click to upload hero image</div>
                                    <div style={{ fontSize: '12px', marginTop: '4px' }}>Recommended: 2400 × 1600px</div>
                                </div>
                            )}
                        </div>
                        {heroImageUrl && <span className="wm-hero-badge">Hero Image</span>}
                    </div>
                    <div className="wvd-form-grid" style={{ marginTop: '16px' }}>
                        <div className="wvd-form-group">
                            <label className="wvd-form-label">Alt Text</label>
                            <input type="text" className="wvd-form-input" value={heroAltText} onChange={e => setHeroAltText(e.target.value)} placeholder="Describe the image for accessibility" />
                        </div>
                        <div className="wvd-form-group">
                            <label className="wvd-form-label">Caption (Optional)</label>
                            <input type="text" className="wvd-form-input" value={heroCaption} onChange={e => setHeroCaption(e.target.value)} placeholder="Short caption shown below the image" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Photo Gallery */}
            <section className="wvd-form-section">
                <div className="wvd-form-section-header">
                    <div>
                        <h3 className="wvd-form-section-title">Photo Gallery</h3>
                        <p className="wvd-form-hint">First 5 images appear in listing preview</p>
                    </div>
                    <button className="wvd-btn-primary wvd-btn-small" onClick={() => galleryInputRef.current?.click()} disabled={galleryUploading}>
                        <Upload size={14} /> {galleryUploading ? 'Uploading...' : 'Upload Photos'}
                    </button>
                </div>
                <div className="wvd-form-section-body">
                    <div className="wm-gallery-categories">
                        {GALLERY_CATEGORIES.map(cat => (
                            <button
                                key={cat}
                                className={`wm-gallery-category ${activeCategory === cat ? 'active' : ''}`}
                                onClick={() => setActiveCategory(cat)}
                            >
                                {cat} <span className="wm-category-count">{categoryCounts[cat] || 0}</span>
                            </button>
                        ))}
                    </div>

                    {filteredGallery.length > 0 ? (
                        <div className="wm-gallery-grid">
                            {filteredGallery.map((photo, i) => (
                                <div key={photo.id} className="wm-gallery-item">
                                    <img src={photo.image_url} alt={photo.category} className="wm-gallery-image" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    <span className="wm-gallery-item-tag">{photo.category}</span>
                                    <div className="wm-gallery-item-overlay"></div>
                                    <div className="wm-gallery-item-actions">
                                        <span className="wm-gallery-item-number">{i + 1}</span>
                                        <div className="wm-gallery-buttons">
                                            <button className="wm-gallery-btn delete" onClick={() => handleDeletePhoto(photo)}>
                                                <X size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="wm-upload-zone" style={{ marginTop: '8px' }} onClick={() => galleryInputRef.current?.click()}>
                            <Upload className="wm-upload-icon" size={48} strokeWidth={1.5} />
                            <div className="wm-upload-title">Drag & drop photos here</div>
                            <div className="wm-upload-text">or click to browse your files</div>
                            <div className="wm-upload-formats">JPG, PNG, WebP • Max 10MB per image • Recommended 2400×1600px</div>
                        </div>
                    )}

                    {filteredGallery.length > 0 && (
                        <div className="wm-upload-zone" style={{ marginTop: '20px' }} onClick={() => galleryInputRef.current?.click()}>
                            <Upload className="wm-upload-icon" size={48} strokeWidth={1.5} />
                            <div className="wm-upload-title">Add more photos</div>
                            <div className="wm-upload-formats">JPG, PNG, WebP • Max 10MB per image</div>
                        </div>
                    )}
                </div>
            </section>

            {/* Videos */}
            <section className="wvd-form-section">
                <div className="wvd-form-section-header">
                    <div>
                        <h3 className="wvd-form-section-title">Videos</h3>
                        <p className="wvd-form-hint">Property tours and promotional videos</p>
                    </div>
                </div>
                <div className="wvd-form-section-body">
                    {videos.length > 0 && (
                        <div className="wm-video-grid" style={{ marginBottom: '20px' }}>
                            {videos.map(video => (
                                <div key={video.id} className="wm-video-card" style={{ position: 'relative' }}>
                                    <div className="wm-video-preview">
                                        <div className="wm-video-play-btn">
                                            <Film size={24} fill="#313131" color="#313131" />
                                        </div>
                                        {video.is_featured && (
                                            <span style={{ position: 'absolute', top: 8, left: 8, background: 'var(--primary)', color: '#fff', fontSize: 10, padding: '2px 6px', borderRadius: 4 }}>
                                                Featured
                                            </span>
                                        )}
                                    </div>
                                    <div className="wm-video-info">
                                        <div className="wm-video-title">{video.video_title || 'Untitled Video'}</div>
                                        <div className="wm-video-meta">
                                            <span>{video.video_type}</span>
                                            {video.video_url && (
                                                <> • <a href={video.video_url} target="_blank" rel="noreferrer" style={{ color: 'var(--primary)', fontSize: 11 }}>View</a></>
                                            )}
                                        </div>
                                    </div>
                                    <button
                                        style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.5)', border: 'none', borderRadius: 4, padding: '4px 6px', cursor: 'pointer', color: '#fff' }}
                                        onClick={() => handleDeleteVideo(video)}
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    <div style={{ background: 'var(--secondary-bg)', borderRadius: 10, padding: 20 }}>
                        <div style={{ fontWeight: 600, marginBottom: 16, color: 'var(--text)', fontSize: 14 }}>Add Video</div>
                        <div className="wvd-form-grid">
                            <div className="wvd-form-group">
                                <label className="wvd-form-label">Video URL</label>
                                <input type="text" className="wvd-form-input" value={videoUrl} onChange={e => setVideoUrl(e.target.value)} placeholder="https://youtube.com/watch?v= or https://vimeo.com/..." />
                            </div>
                            <div className="wvd-form-group">
                                <label className="wvd-form-label">Video Title</label>
                                <input type="text" className="wvd-form-input" value={videoTitle} onChange={e => setVideoTitle(e.target.value)} placeholder="Enter video title" />
                            </div>
                            <div className="wvd-form-group">
                                <label className="wvd-form-label">Video Type</label>
                                <select className="wvd-form-input wvd-form-select" value={videoType} onChange={e => setVideoType(e.target.value)}>
                                    {VIDEO_TYPES.map(t => <option key={t}>{t}</option>)}
                                </select>
                            </div>
                            <div className="wvd-form-group">
                                <label className="wvd-form-label">Featured Video</label>
                                <div className="wvd-toggle-container">
                                    <div className={`wvd-toggle ${isFeaturedVideo ? 'active' : ''}`} onClick={() => setIsFeaturedVideo(!isFeaturedVideo)}>
                                        <div className="wvd-toggle-knob"></div>
                                    </div>
                                    <span className="wvd-toggle-label">Show as primary video</span>
                                </div>
                            </div>
                            <div className="wvd-form-group wvd-full-width">
                                <label className="wvd-form-label">Video Description</label>
                                <textarea className="wvd-form-input wvd-form-textarea" rows={2} value={videoDescription} onChange={e => setVideoDescription(e.target.value)} placeholder="Brief description of video content..."></textarea>
                            </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
                            <button className="btn btn-primary btn-small" onClick={handleAddVideo} disabled={addingVideo || !videoUrl.trim()}>
                                <Plus size={14} /> {addingVideo ? 'Adding...' : 'Add Video'}
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Virtual Tour */}
            <section className="wvd-form-section">
                <div className="wvd-form-section-header">
                    <div>
                        <h3 className="wvd-form-section-title">Virtual Tour</h3>
                        <p className="wvd-form-hint">360° interactive property tour embed URL</p>
                    </div>
                </div>
                <div className="wvd-form-section-body">
                    {virtualTourUrl && (
                        <div className="wm-tour-card" style={{ marginBottom: '16px' }}>
                            <div className="wm-tour-icon"><Box size={32} /></div>
                            <div className="wm-tour-info">
                                <div className="wm-tour-title">Virtual Tour Active</div>
                                <div className="wm-tour-url">{virtualTourUrl}</div>
                            </div>
                            <a href={virtualTourUrl} target="_blank" rel="noreferrer" className="wvd-btn-secondary wvd-btn-small">Preview</a>
                        </div>
                    )}
                    <div className="wvd-form-grid">
                        <div className="wvd-form-group wvd-full-width">
                            <label className="wvd-form-label">Virtual Tour Embed URL</label>
                            <input type="text" className="wvd-form-input" value={virtualTourUrl} onChange={e => setVirtualTourUrl(e.target.value)} placeholder="https://my.matterport.com/show/?m=..." />
                        </div>
                    </div>
                    <p className="wvd-form-hint" style={{ marginTop: '8px' }}>Supported: Matterport, Zillow 3D, Kuula, Google Street View embeds. Click Save Media to persist.</p>
                </div>
            </section>

            {/* Media Guidelines — static informational */}
            <section className="wvd-form-section">
                <div className="wvd-form-section-header">
                    <h3 className="wvd-form-section-title">Media Guidelines</h3>
                </div>
                <div className="wvd-form-section-body">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                        <div className="wm-guide-card">
                            <div className="wm-guide-title">📷 Photos</div>
                            <ul className="wm-guide-list">
                                <li>Minimum 15 photos recommended</li>
                                <li>High resolution (2400×1600px+)</li>
                                <li>Natural lighting preferred</li>
                                <li>Include all rooms & facilities</li>
                            </ul>
                        </div>
                        <div className="wm-guide-card">
                            <div className="wm-guide-title">🎬 Videos</div>
                            <ul className="wm-guide-list">
                                <li>1-3 minute property tour ideal</li>
                                <li>YouTube or Vimeo hosted</li>
                                <li>HD quality (1080p minimum)</li>
                                <li>Professional editing preferred</li>
                            </ul>
                        </div>
                        <div className="wm-guide-card">
                            <div className="wm-guide-title">🌐 Virtual Tours</div>
                            <ul className="wm-guide-list">
                                <li>Matterport, Zillow 3D, etc.</li>
                                <li>Full property coverage</li>
                                <li>Increases engagement 300%+</li>
                                <li>Featured Plan benefit</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Tab Hero Images Reference — static informational */}
            <section className="wvd-form-section">
                <div className="wvd-form-section-header">
                    <div>
                        <h3 className="wvd-form-section-title">Tab Hero Images</h3>
                        <p className="wvd-form-hint">Hero images for each website tab are managed in their respective portal tabs</p>
                    </div>
                </div>
                <div className="wvd-form-section-body">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                        {['Overview', 'Services', 'About / Space', 'Location', 'Packages', 'Practitioners', 'Accommodation'].map((tab, i) => (
                            <div key={i} className="wm-tab-hero-card">
                                <div className="wm-tab-hero-preview unset">
                                    <ImageIcon size={24} color="#B8B8B8" strokeWidth={1.5} />
                                </div>
                                <div className="wm-tab-hero-name">{tab}</div>
                                <div className="wm-tab-hero-status unset">Managed in tab</div>
                            </div>
                        ))}
                    </div>
                    <p className="wvd-form-hint" style={{ marginTop: '12px' }}>Navigate to each tab to upload or change its hero image. Recommended size: 1920×800px.</p>
                </div>
            </section>

            {/* Downloadable Assets */}
            <section className="wvd-form-section">
                <div className="wvd-form-section-header">
                    <div>
                        <h3 className="wvd-form-section-title">Downloadable Assets</h3>
                        <p className="wvd-form-hint">Documents and files available for guests to download</p>
                    </div>
                    <button className="wvd-btn-secondary wvd-btn-small" onClick={() => docInputRef.current?.click()} disabled={docUploading}>
                        <Plus size={14} /> {docUploading ? 'Uploading...' : 'Add Document'}
                    </button>
                </div>
                <div className="wvd-form-section-body">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                        {documents.map(doc => (
                            <div key={doc.id} className="wm-asset-card">
                                <div className="wm-asset-icon document"><FileText size={24} color="white" /></div>
                                <div className="wm-asset-info">
                                    <div className="wm-asset-title" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{doc.file_name}</div>
                                    <div className="wm-asset-meta">{formatBytes(doc.file_size_bytes)}</div>
                                </div>
                                <button
                                    className="wvd-btn-secondary wvd-btn-small"
                                    style={{ padding: '6px 8px', color: 'var(--error)', borderColor: 'var(--error)', flexShrink: 0 }}
                                    onClick={() => handleDeleteDoc(doc)}
                                >
                                    <Trash2 size={12} />
                                </button>
                            </div>
                        ))}
                        <div className="wm-asset-card dashed" onClick={() => docInputRef.current?.click()} style={{ cursor: 'pointer' }}>
                            <div className="wm-asset-icon empty"><Plus size={24} color="#B8B8B8" /></div>
                            <div className="wm-asset-info">
                                <div className="wm-asset-title empty">Add Document</div>
                                <div className="wm-asset-meta">PDF, DOCX • Max 20MB</div>
                            </div>
                        </div>
                    </div>
                    <p className="wvd-form-hint" style={{ marginTop: '12px' }}>These documents appear on the "Download Menu PDF" button throughout the listing.</p>
                </div>
            </section>

            {/* Social & SEO Images */}
            <section className="wvd-form-section">
                <div className="wvd-form-section-header">
                    <div>
                        <h3 className="wvd-form-section-title">Social & SEO Images</h3>
                        <p className="wvd-form-hint">Images used when sharing the venue on social media and search results</p>
                    </div>
                </div>
                <div className="wvd-form-section-body">
                    <div className="wvd-form-grid">
                        <div className="wvd-form-group">
                            <label className="wvd-form-label">Social Share Image (Open Graph)</label>
                            <div
                                className="wm-seo-upload"
                                style={{ cursor: 'pointer', overflow: 'hidden', position: 'relative' }}
                                onClick={() => socialInputRef.current?.click()}
                            >
                                {socialShareImage ? (
                                    <>
                                        <img src={socialShareImage} alt="Social share" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                                        <span className="wm-seo-upload-title" style={{ position: 'relative', zIndex: 1, background: 'rgba(0,0,0,0.5)', color: '#fff', padding: '2px 8px', borderRadius: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                                            <Check size={12} /> Set
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <ImageIcon size={32} color="#B8B8B8" strokeWidth={1.5} />
                                        <span className="wm-seo-upload-title">{socialUploading ? 'Uploading...' : 'Click to upload'}</span>
                                        <span className="wm-seo-upload-hint">1200 x 630px recommended</span>
                                    </>
                                )}
                            </div>
                            <p className="wvd-form-hint" style={{ marginTop: '6px' }}>Used when sharing on Facebook, LinkedIn, etc. Falls back to Hero Image if not set.</p>
                        </div>
                        <div className="wvd-form-group">
                            <label className="wvd-form-label">Twitter Card Image</label>
                            <div
                                className="wm-seo-upload"
                                style={{ cursor: 'pointer', overflow: 'hidden', position: 'relative' }}
                                onClick={() => twitterInputRef.current?.click()}
                            >
                                {twitterCardImage ? (
                                    <>
                                        <img src={twitterCardImage} alt="Twitter card" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                                        <span className="wm-seo-upload-title" style={{ position: 'relative', zIndex: 1, background: 'rgba(0,0,0,0.5)', color: '#fff', padding: '2px 8px', borderRadius: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                                            <Check size={12} /> Set
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <ImageIcon size={32} color="#B8B8B8" strokeWidth={1.5} />
                                        <span className="wm-seo-upload-title">{twitterUploading ? 'Uploading...' : 'Click to upload'}</span>
                                        <span className="wm-seo-upload-hint">1200 x 600px recommended</span>
                                    </>
                                )}
                            </div>
                            <p className="wvd-form-hint" style={{ marginTop: '6px' }}>Used for Twitter/X shares. Falls back to Open Graph image if not set.</p>
                        </div>
                    </div>
                    <p className="wvd-form-hint" style={{ marginTop: '4px' }}>Click Save Media above to persist social image URLs after upload.</p>
                </div>
            </section>
        </div>
    );
}
