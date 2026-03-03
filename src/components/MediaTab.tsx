import { useState } from 'react';
import { UploadCloud, Image as ImageIcon, Crop, Trash2, Maximize2, FileText, Play, Globe } from 'lucide-react';
import type { Venue } from '../context/VenueContext';

// Stub static data mimicking the mockup
const MOCK_GALLERY = [
    { id: 1, type: 'Exterior', image: '' },
    { id: 2, type: 'Bedroom', image: '' },
    { id: 3, type: 'Living', image: '' },
    { id: 4, type: 'Wellness', image: '' },
    { id: 5, type: 'Kitchen', image: '' },
    { id: 6, type: 'Grounds', image: '' },
    { id: 7, type: 'Bedroom', image: '' },
    { id: 8, type: 'Wellness', image: '' },
];

const CATEGORIES = [
    { label: 'All Photos', count: 24, active: true },
    { label: 'Exterior', count: 6, active: false },
    { label: 'Bedrooms', count: 5, active: false },
    { label: 'Living Areas', count: 4, active: false },
    { label: 'Kitchen & Dining', count: 3, active: false },
    { label: 'Retreat Spaces', count: 4, active: false },
    { label: 'Wellness', count: 4, active: false },
    { label: 'Grounds', count: 2, active: false }
];

interface MediaTabProps {
    venue: Venue;
    onUpdate: (updates: Partial<Venue>) => void;
}

export default function MediaTab(_props: MediaTabProps) {
    const [activeCategory, setActiveCategory] = useState('All Photos');

    return (
        <div>
            {/* Media Stats */}
            <div className="media-stats">
                <div className="media-stat">
                    <div className="media-stat-value">24</div>
                    <div className="media-stat-label">Total Photos</div>
                </div>
                <div className="media-stat">
                    <div className="media-stat-value">2</div>
                    <div className="media-stat-label">Videos</div>
                </div>
                <div className="media-stat">
                    <div className="media-stat-value">1</div>
                    <div className="media-stat-label">Virtual Tour</div>
                </div>
                <div className="media-stat">
                    <div className="media-stat-value">148 MB</div>
                    <div className="media-stat-label">Total Size</div>
                </div>
            </div>

            {/* Hero Image Section */}
            <section className="form-section">
                <div className="form-section-header">
                    <div>
                        <h3 className="form-section-title">Hero Image</h3>
                        <p className="form-section-subtitle">Primary image displayed on listing cards and page headers</p>
                    </div>
                    <button className="btn btn-secondary btn-small">
                        <UploadCloud className="icon icon-small" /> Replace Image
                    </button>
                </div>
                <div className="form-section-body">
                    <div className="hero-image-container">
                        <div className="hero-image">
                            <div className="hero-image-placeholder">
                                <ImageIcon width={64} height={64} style={{ opacity: 0.5, marginBottom: 12, margin: '0 auto' }} />
                                <div style={{ fontSize: 14 }}>moraea-farm-hero.jpg</div>
                                <div style={{ fontSize: 12, marginTop: 4 }}>2400 × 1600 • 2.4 MB</div>
                            </div>
                        </div>
                        <span className="hero-badge">Hero Image</span>
                        <div className="hero-actions">
                            <button className="hero-action-btn">
                                <ImageIcon className="icon icon-small" /> Edit
                            </button>
                            <button className="hero-action-btn">
                                <Crop className="icon icon-small" /> Crop
                            </button>
                        </div>
                    </div>
                    <div className="form-grid" style={{ marginTop: 16 }}>
                        <div className="form-group">
                            <label className="form-label">Alt Text</label>
                            <input type="text" className="form-input" defaultValue="Aerial view of Moraea Farm luxury retreat venue in Berry, NSW" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Caption (Optional)</label>
                            <input type="text" className="form-input" defaultValue="45 acres of rolling hills in the South Coast hinterland" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Photo Gallery */}
            <section className="form-section">
                <div className="form-section-header">
                    <div>
                        <h3 className="form-section-title">Photo Gallery</h3>
                        <p className="form-section-subtitle">Drag to reorder • First 5 images appear in listing preview</p>
                    </div>
                    <button className="btn btn-primary btn-small">
                        <UploadCloud className="icon icon-small" /> Upload Photos
                    </button>
                </div>
                <div className="form-section-body">
                    {/* Category Filters */}
                    <div className="gallery-categories">
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat.label}
                                className={`gallery-category ${activeCategory === cat.label ? 'active' : ''}`}
                                onClick={() => setActiveCategory(cat.label)}
                            >
                                {cat.label} <span className="gallery-category-count">{cat.count}</span>
                            </button>
                        ))}
                    </div>

                    {/* Gallery Grid */}
                    <div className="gallery-grid">
                        {MOCK_GALLERY.map((item, i) => (
                            <div key={item.id} className="gallery-item">
                                <div className="gallery-image"></div>
                                <span className="gallery-item-tag">{item.type}</span>
                                <div className="gallery-item-overlay"></div>
                                <div className="gallery-item-actions">
                                    <span className="gallery-item-number">{i + 1}</span>
                                    <div className="gallery-item-buttons">
                                        <button className="gallery-btn">
                                            <ImageIcon className="icon icon-small" />
                                        </button>
                                        <button className="gallery-btn delete">
                                            <Trash2 className="icon icon-small" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Upload Zone */}
                    <div className="upload-zone" style={{ marginTop: 20 }}>
                        <UploadCloud className="upload-zone-icon" />
                        <div className="upload-zone-title">Drag & drop photos here</div>
                        <div className="upload-zone-text">or click to browse your files</div>
                        <div className="upload-zone-formats">JPG, PNG, WebP • Max 10MB per image • Recommended 2400×1600px</div>
                    </div>
                </div>
            </section>

            {/* Videos */}
            <section className="form-section">
                <div className="form-section-header">
                    <div>
                        <h3 className="form-section-title">Videos</h3>
                        <p className="form-section-subtitle">Property tours and promotional videos</p>
                    </div>
                    <button className="btn btn-secondary btn-small">
                        <Maximize2 className="icon icon-small" /> Add Video
                    </button>
                </div>
                <div className="form-section-body">
                    <div className="video-grid">
                        <div className="video-card">
                            <div className="video-preview">
                                <div className="video-play-btn">
                                    <Play width={24} height={24} fill="#313131" stroke="none" />
                                </div>
                                <span className="video-duration">2:34</span>
                            </div>
                            <div className="video-info">
                                <div className="video-title">Moraea Farm - Property Tour</div>
                                <div className="video-meta">
                                    <span>YouTube</span>
                                    <span>•</span>
                                    <span>Uploaded Jan 15, 2026</span>
                                </div>
                            </div>
                        </div>

                        <div className="video-card">
                            <div className="video-preview">
                                <div className="video-play-btn">
                                    <Play width={24} height={24} fill="#313131" stroke="none" />
                                </div>
                                <span className="video-duration">1:15</span>
                            </div>
                            <div className="video-info">
                                <div className="video-title">Yoga Shala & Wellness Facilities</div>
                                <div className="video-meta">
                                    <span>Vimeo</span>
                                    <span>•</span>
                                    <span>Uploaded Jan 20, 2026</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="form-grid" style={{ marginTop: 20 }}>
                        <div className="form-group">
                            <label className="form-label">Add Video URL</label>
                            <input type="text" className="form-input" placeholder="https://youtube.com/watch?v= or https://vimeo.com/..." />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Video Title</label>
                            <input type="text" className="form-input" placeholder="Enter video title" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Video Type</label>
                            <select className="form-input form-select">
                                <option>Property Tour</option>
                                <option>Drone Footage</option>
                                <option>Promotional</option>
                                <option>Testimonial</option>
                                <option>Behind the Scenes</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Featured Video</label>
                            <div className="toggle-container">
                                <div className="toggle active">
                                    <div className="toggle-knob"></div>
                                </div>
                                <span className="toggle-label">Show as primary video</span>
                            </div>
                        </div>
                        <div className="form-group full-width">
                            <label className="form-label">Video Description</label>
                            <textarea className="form-input form-textarea" rows={2} placeholder="Brief description of video content..."></textarea>
                        </div>
                    </div>
                </div>
            </section>

            {/* Virtual Tour */}
            <section className="form-section">
                <div className="form-section-header">
                    <div>
                        <h3 className="form-section-title">Virtual Tour</h3>
                        <p className="form-section-subtitle">360° interactive property tour</p>
                    </div>
                </div>
                <div className="form-section-body">
                    <div className="virtual-tour-card">
                        <div className="virtual-tour-icon">
                            <Globe className="icon" size={32} />
                            {/* We don't have the exact globe icon used in HTML easily accessible, let's use lucide-react equivalent */}
                        </div>
                        <div className="virtual-tour-info">
                            <div className="virtual-tour-title">Matterport 3D Tour</div>
                            <div className="virtual-tour-url">https://my.matterport.com/show/?m=abc123xyz</div>
                        </div>
                        <div style={{ display: 'flex', gap: 8 }}>
                            <button className="btn btn-secondary btn-small">Preview</button>
                            <button className="btn btn-secondary btn-small">Edit</button>
                        </div>
                    </div>

                    <div className="form-grid" style={{ marginTop: 20 }}>
                        <div className="form-group full-width">
                            <label className="form-label">Virtual Tour Embed URL</label>
                            <input type="text" className="form-input" defaultValue="https://my.matterport.com/show/?m=abc123xyz" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Media Guidelines */}
            <section className="form-section">
                <div className="form-section-header">
                    <h3 className="form-section-title">Media Guidelines</h3>
                </div>
                <div className="form-section-body">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
                        <div style={{ padding: 16, background: 'var(--secondary-bg)', borderRadius: 10 }}>
                            <div style={{ fontWeight: 600, marginBottom: 8, color: 'var(--text)' }}>📷 Photos</div>
                            <ul style={{ fontSize: 12, color: 'var(--accent)', paddingLeft: 16, margin: 0 }}>
                                <li>Minimum 15 photos recommended</li>
                                <li>High resolution (2400×1600px+)</li>
                                <li>Natural lighting preferred</li>
                                <li>Include all rooms & facilities</li>
                            </ul>
                        </div>
                        <div style={{ padding: 16, background: 'var(--secondary-bg)', borderRadius: 10 }}>
                            <div style={{ fontWeight: 600, marginBottom: 8, color: 'var(--text)' }}>🎬 Videos</div>
                            <ul style={{ fontSize: 12, color: 'var(--accent)', paddingLeft: 16, margin: 0 }}>
                                <li>1-3 minute property tour ideal</li>
                                <li>YouTube or Vimeo hosted</li>
                                <li>HD quality (1080p minimum)</li>
                                <li>Professional editing preferred</li>
                            </ul>
                        </div>
                        <div style={{ padding: 16, background: 'var(--secondary-bg)', borderRadius: 10 }}>
                            <div style={{ fontWeight: 600, marginBottom: 8, color: 'var(--text)' }}>🌐 Virtual Tours</div>
                            <ul style={{ fontSize: 12, color: 'var(--accent)', paddingLeft: 16, margin: 0 }}>
                                <li>Matterport, Zillow 3D, etc.</li>
                                <li>Full property coverage</li>
                                <li>Increases engagement 300%+</li>
                                <li>Featured Plan benefit</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Tab Hero Images Reference */}
            <section className="form-section">
                <div className="form-section-header">
                    <div>
                        <h3 className="form-section-title">Tab Hero Images</h3>
                        <p className="form-section-subtitle">Hero images for each website tab are managed in their respective portal tabs</p>
                    </div>
                </div>
                <div className="form-section-body">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
                        {/* Set Example */}
                        <div style={{ padding: 16, background: 'var(--secondary-bg)', borderRadius: 10, textAlign: 'center' }}>
                            <div style={{ width: '100%', height: 60, background: 'linear-gradient(135deg, #e8e4dc 0%, #d4cfc5 100%)', borderRadius: 6, marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <ImageIcon size={24} color="#7A644F" />
                            </div>
                            <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text)' }}>Overview</div>
                            <div style={{ fontSize: 11, color: 'var(--success)' }}>✓ Set</div>
                        </div>
                        <div style={{ padding: 16, background: 'var(--secondary-bg)', borderRadius: 10, textAlign: 'center' }}>
                            <div style={{ width: '100%', height: 60, background: 'linear-gradient(135deg, #e8e4dc 0%, #d4cfc5 100%)', borderRadius: 6, marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <ImageIcon size={24} color="#7A644F" />
                            </div>
                            <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text)' }}>Spaces</div>
                            <div style={{ fontSize: 11, color: 'var(--success)' }}>✓ Set</div>
                        </div>
                        <div style={{ padding: 16, background: 'var(--secondary-bg)', borderRadius: 10, textAlign: 'center' }}>
                            <div style={{ width: '100%', height: 60, background: 'linear-gradient(135deg, #e8e4dc 0%, #d4cfc5 100%)', borderRadius: 6, marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <ImageIcon size={24} color="#7A644F" />
                            </div>
                            <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text)' }}>Accommodation</div>
                            <div style={{ fontSize: 11, color: 'var(--success)' }}>✓ Set</div>
                        </div>
                        {/* Not Set Example */}
                        <div style={{ padding: 16, background: 'var(--secondary-bg)', borderRadius: 10, textAlign: 'center' }}>
                            <div style={{ width: '100%', height: 60, background: 'var(--secondary-bg)', border: '2px dashed rgba(184, 184, 184, 0.4)', borderRadius: 6, marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Maximize2 size={24} color="#B8B8B8" />
                            </div>
                            <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text)' }}>Amenities</div>
                            <div style={{ fontSize: 11, color: 'var(--warning)' }}>Not set</div>
                        </div>
                        <div style={{ padding: 16, background: 'var(--secondary-bg)', borderRadius: 10, textAlign: 'center' }}>
                            <div style={{ width: '100%', height: 60, background: 'linear-gradient(135deg, #e8e4dc 0%, #d4cfc5 100%)', borderRadius: 6, marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <ImageIcon size={24} color="#7A644F" />
                            </div>
                            <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text)' }}>Experiences</div>
                            <div style={{ fontSize: 11, color: 'var(--success)' }}>✓ Set</div>
                        </div>
                        <div style={{ padding: 16, background: 'var(--secondary-bg)', borderRadius: 10, textAlign: 'center' }}>
                            <div style={{ width: '100%', height: 60, background: 'linear-gradient(135deg, #e8e4dc 0%, #d4cfc5 100%)', borderRadius: 6, marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <ImageIcon size={24} color="#7A644F" />
                            </div>
                            <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text)' }}>Location</div>
                            <div style={{ fontSize: 11, color: 'var(--success)' }}>✓ Set</div>
                        </div>
                        <div style={{ padding: 16, background: 'var(--secondary-bg)', borderRadius: 10, textAlign: 'center' }}>
                            <div style={{ width: '100%', height: 60, background: 'var(--secondary-bg)', border: '2px dashed rgba(184, 184, 184, 0.4)', borderRadius: 6, marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Maximize2 size={24} color="#B8B8B8" />
                            </div>
                            <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text)' }}>Reviews</div>
                            <div style={{ fontSize: 11, color: 'var(--warning)' }}>Not set</div>
                        </div>
                        <div style={{ padding: 16, background: 'var(--secondary-bg)', borderRadius: 10, textAlign: 'center' }}>
                            <div style={{ width: '100%', height: 60, background: 'var(--secondary-bg)', border: '2px dashed rgba(184, 184, 184, 0.4)', borderRadius: 6, marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Maximize2 size={24} color="#B8B8B8" />
                            </div>
                            <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text)' }}>Booking</div>
                            <div style={{ fontSize: 11, color: 'var(--warning)' }}>Not set</div>
                        </div>
                    </div>
                    <p className="form-hint" style={{ fontSize: 11, fontStyle: 'italic', color: 'var(--accent)', marginTop: 12 }}>Navigate to each tab to upload or change its hero image. Recommended size: 1920×800px.</p>
                </div>
            </section>

            {/* Downloadable Assets */}
            <section className="form-section">
                <div className="form-section-header">
                    <div>
                        <h3 className="form-section-title">Downloadable Assets</h3>
                        <p className="form-section-subtitle">Documents and files available for retreat hosts to download</p>
                    </div>
                    <button className="btn btn-secondary btn-small">
                        <Maximize2 className="icon icon-small" /> Add Document
                    </button>
                </div>
                <div className="form-section-body">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                        <div style={{ padding: 20, background: 'var(--secondary-bg)', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 16 }}>
                            <div style={{ width: 48, height: 48, background: '#C45C5C', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <FileText color="#fff" />
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 500, color: 'var(--text)', marginBottom: 2 }}>Venue Brochure</div>
                                <div style={{ fontSize: 11, color: 'var(--accent)' }}>PDF • 4.2 MB • Updated Jan 2026</div>
                            </div>
                            <button className="btn btn-secondary btn-small">Replace</button>
                        </div>
                        <div style={{ padding: 20, background: 'var(--secondary-bg)', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 16 }}>
                            <div style={{ width: 48, height: 48, background: '#6B8EC9', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <FileText color="#fff" />
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 500, color: 'var(--text)', marginBottom: 2 }}>Floor Plans</div>
                                <div style={{ fontSize: 11, color: 'var(--accent)' }}>PDF • 1.8 MB • Updated Jan 2026</div>
                            </div>
                            <button className="btn btn-secondary btn-small">Replace</button>
                        </div>
                        <div style={{ padding: 20, background: 'var(--secondary-bg)', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 16, border: '2px dashed rgba(184, 184, 184, 0.4)' }}>
                            <div style={{ width: 48, height: 48, background: 'var(--white)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Maximize2 color="#B8B8B8" />
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 500, color: 'var(--accent)', marginBottom: 2 }}>Add Document</div>
                                <div style={{ fontSize: 11, color: 'var(--accent)' }}>PDF, DOCX • Max 20MB</div>
                            </div>
                        </div>
                    </div>
                    <p className="form-hint" style={{ fontSize: 11, fontStyle: 'italic', color: 'var(--accent)', marginTop: 12 }}>These documents appear on the "Download Venue PDF" button throughout the listing.</p>
                </div>
            </section>

            {/* Social & SEO Images */}
            <section className="form-section">
                <div className="form-section-header">
                    <div>
                        <h3 className="form-section-title">Social & SEO Images</h3>
                        <p className="form-section-subtitle">Images used when sharing the venue on social media and search results</p>
                    </div>
                </div>
                <div className="form-section-body">
                    <div className="form-grid">
                        <div className="form-group">
                            <label className="form-label">Social Share Image (Open Graph)</label>
                            <div className="image-upload-placeholder" style={{ width: '100%', height: 140, border: '2px dashed rgba(184, 184, 184, 0.4)', borderRadius: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--secondary-bg)', cursor: 'pointer' }}>
                                <ImageIcon color="#B8B8B8" size={32} />
                                <span style={{ fontSize: 12, color: 'var(--accent)', marginTop: 8 }}>Click to upload</span>
                                <span style={{ fontSize: 11, color: 'var(--accent)' }}>1200 x 630px recommended</span>
                            </div>
                            <p className="form-hint" style={{ fontSize: 11, fontStyle: 'italic', color: 'var(--accent)', marginTop: 6 }}>Used when sharing on Facebook, LinkedIn, etc. Falls back to Hero Image if not set.</p>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Twitter Card Image</label>
                            <div className="image-upload-placeholder" style={{ width: '100%', height: 140, border: '2px dashed rgba(184, 184, 184, 0.4)', borderRadius: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--secondary-bg)', cursor: 'pointer' }}>
                                <ImageIcon color="#B8B8B8" size={32} />
                                <span style={{ fontSize: 12, color: 'var(--accent)', marginTop: 8 }}>Click to upload</span>
                                <span style={{ fontSize: 11, color: 'var(--accent)' }}>1200 x 600px recommended</span>
                            </div>
                            <p className="form-hint" style={{ fontSize: 11, fontStyle: 'italic', color: 'var(--accent)', marginTop: 6 }}>Used for Twitter/X shares. Falls back to Open Graph image if not set.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
