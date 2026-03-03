import { useState } from 'react';
import { Image as ImageIcon, Film, Box, Upload, Edit, Crop, X, Check, FileText, Plus } from 'lucide-react';
import type { Venue } from '../../context/VenueContext';

interface Props {
    venue: Venue;
    onUpdate: (updates: Partial<Venue>) => void;
}

export default function WellnessMediaTab({ venue: _venue, onUpdate: _onUpdate }: Props) {
    const [activeCategory, setActiveCategory] = useState('All Photos');

    // Form States
    const [heroAltText, setHeroAltText] = useState('Aerial view of Moraea Farm luxury retreat venue in Berry, NSW');
    const [heroCaption, setHeroCaption] = useState('45 acres of rolling hills in the South Coast hinterland');

    // Video States
    const [featuredVideoUrl, setFeaturedVideoUrl] = useState('');
    const [videoTitle, setVideoTitle] = useState('');
    const [videoType, setVideoType] = useState('Property Tour');
    const [isFeaturedVideo, setIsFeaturedVideo] = useState(true);
    const [videoDescription, setVideoDescription] = useState('');

    // Virtual Tour State
    const [virtualTourUrl, setVirtualTourUrl] = useState('https://my.matterport.com/show/?m=abc123xyz');

    return (
        <div className="wvd-content">
            {/* Media Stats */}
            <div className="wm-media-stats">
                <div className="wm-media-stat">
                    <div className="wm-media-stat-value">24</div>
                    <div className="wm-media-stat-label">Total Photos</div>
                </div>
                <div className="wm-media-stat">
                    <div className="wm-media-stat-value">2</div>
                    <div className="wm-media-stat-label">Videos</div>
                </div>
                <div className="wm-media-stat">
                    <div className="wm-media-stat-value">1</div>
                    <div className="wm-media-stat-label">Virtual Tour</div>
                </div>
                <div className="wm-media-stat">
                    <div className="wm-media-stat-value">148 MB</div>
                    <div className="wm-media-stat-label">Total Size</div>
                </div>
            </div>

            {/* Hero Image */}
            <section className="wvd-form-section">
                <div className="wvd-form-section-header">
                    <div>
                        <h3 className="wvd-form-section-title">Hero Image</h3>
                        <p className="wvd-form-hint">Primary image displayed on listing cards and page headers</p>
                    </div>
                    <button className="wvd-btn-secondary wvd-btn-small">
                        <Upload size={14} />
                        Replace Image
                    </button>
                </div>
                <div className="wvd-form-section-body">
                    <div className="wm-hero-container">
                        <div className="wm-hero-image">
                            <div className="wm-hero-placeholder">
                                <ImageIcon size={64} strokeWidth={1} />
                                <div style={{ fontSize: '14px', marginTop: '12px' }}>moraea-farm-hero.jpg</div>
                                <div style={{ fontSize: '12px', marginTop: '4px' }}>2400 × 1600 • 2.4 MB</div>
                            </div>
                        </div>
                        <span className="wm-hero-badge">Hero Image</span>
                        <div className="wm-hero-actions">
                            <button className="wm-hero-action-btn">
                                <Edit size={14} />
                                Edit
                            </button>
                            <button className="wm-hero-action-btn">
                                <Crop size={14} />
                                Crop
                            </button>
                        </div>
                    </div>
                    <div className="wvd-form-grid" style={{ marginTop: '16px' }}>
                        <div className="wvd-form-group">
                            <label className="wvd-form-label">Alt Text</label>
                            <input type="text" className="wvd-form-input" value={heroAltText} onChange={e => setHeroAltText(e.target.value)} />
                        </div>
                        <div className="wvd-form-group">
                            <label className="wvd-form-label">Caption (Optional)</label>
                            <input type="text" className="wvd-form-input" value={heroCaption} onChange={e => setHeroCaption(e.target.value)} />
                        </div>
                    </div>
                </div>
            </section>

            {/* Photo Gallery */}
            <section className="wvd-form-section">
                <div className="wvd-form-section-header">
                    <div>
                        <h3 className="wvd-form-section-title">Photo Gallery</h3>
                        <p className="wvd-form-hint">Drag to reorder • First 5 images appear in listing preview</p>
                    </div>
                    <button className="wvd-btn-primary wvd-btn-small">
                        <Upload size={14} />
                        Upload Photos
                    </button>
                </div>
                <div className="wvd-form-section-body">
                    {/* Category Filters */}
                    <div className="wm-gallery-categories">
                        {['All Photos', 'Exterior', 'Bedrooms', 'Living Areas', 'Kitchen & Dining', 'Retreat Spaces', 'Wellness', 'Grounds'].map((cat, idx) => (
                            <button
                                key={idx}
                                className={`wm-gallery-category ${activeCategory === cat ? 'active' : ''}`}
                                onClick={() => setActiveCategory(cat)}
                            >
                                {cat} <span className="wm-category-count">{cat === 'All Photos' ? 24 : Math.floor(Math.random() * 8) + 1}</span>
                            </button>
                        ))}
                    </div>

                    {/* Gallery Grid */}
                    <div className="wm-gallery-grid">
                        {[
                            { tag: 'Exterior', num: 1 },
                            { tag: 'Bedroom', num: 2 },
                            { tag: 'Living', num: 3 },
                            { tag: 'Wellness', num: 4 },
                            { tag: 'Kitchen', num: 5 },
                            { tag: 'Grounds', num: 6 },
                            { tag: 'Bedroom', num: 7 },
                            { tag: 'Wellness', num: 8 },
                        ].map((item, idx) => (
                            <div key={idx} className="wm-gallery-item">
                                <div className="wm-gallery-image"></div>
                                <span className="wm-gallery-item-tag">{item.tag}</span>
                                <div className="wm-gallery-item-overlay"></div>
                                <div className="wm-gallery-item-actions">
                                    <span className="wm-gallery-item-number">{item.num}</span>
                                    <div className="wm-gallery-buttons">
                                        <button className="wm-gallery-btn"><Edit size={14} /></button>
                                        <button className="wm-gallery-btn delete"><X size={14} /></button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Upload Zone */}
                    <div className="wm-upload-zone" style={{ marginTop: '20px' }}>
                        <Upload className="wm-upload-icon" size={48} strokeWidth={1.5} />
                        <div className="wm-upload-title">Drag & drop photos here</div>
                        <div className="wm-upload-text">or click to browse your files</div>
                        <div className="wm-upload-formats">JPG, PNG, WebP • Max 10MB per image • Recommended 2400×1600px</div>
                    </div>
                </div>
            </section>

            {/* Videos */}
            <section className="wvd-form-section">
                <div className="wvd-form-section-header">
                    <div>
                        <h3 className="wvd-form-section-title">Videos</h3>
                        <p className="wvd-form-hint">Property tours and promotional videos</p>
                    </div>
                    <button className="wvd-btn-secondary wvd-btn-small">
                        <Plus size={14} />
                        Add Video
                    </button>
                </div>
                <div className="wvd-form-section-body">
                    <div className="wm-video-grid">
                        <div className="wm-video-card">
                            <div className="wm-video-preview">
                                <div className="wm-video-play-btn">
                                    <Film size={24} fill="#313131" color="#313131" />
                                </div>
                                <span className="wm-video-duration">2:34</span>
                            </div>
                            <div className="wm-video-info">
                                <div className="wm-video-title">Moraea Farm - Property Tour</div>
                                <div className="wm-video-meta">
                                    <span>YouTube</span> • <span>Uploaded Jan 15, 2026</span>
                                </div>
                            </div>
                        </div>

                        <div className="wm-video-card">
                            <div className="wm-video-preview">
                                <div className="wm-video-play-btn">
                                    <Film size={24} fill="#313131" color="#313131" />
                                </div>
                                <span className="wm-video-duration">1:15</span>
                            </div>
                            <div className="wm-video-info">
                                <div className="wm-video-title">Yoga Shala & Wellness Facilities</div>
                                <div className="wm-video-meta">
                                    <span>Vimeo</span> • <span>Uploaded Jan 20, 2026</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="wvd-form-grid" style={{ marginTop: '20px' }}>
                        <div className="wvd-form-group">
                            <label className="wvd-form-label">Add Video URL</label>
                            <input type="text" className="wvd-form-input" placeholder="https://youtube.com/watch?v= or https://vimeo.com/..." value={featuredVideoUrl} onChange={e => setFeaturedVideoUrl(e.target.value)} />
                        </div>
                        <div className="wvd-form-group">
                            <label className="wvd-form-label">Video Title</label>
                            <input type="text" className="wvd-form-input" placeholder="Enter video title" value={videoTitle} onChange={e => setVideoTitle(e.target.value)} />
                        </div>
                        <div className="wvd-form-group">
                            <label className="wvd-form-label">Video Type</label>
                            <select className="wvd-form-input wvd-form-select" value={videoType} onChange={e => setVideoType(e.target.value)}>
                                <option>Property Tour</option>
                                <option>Drone Footage</option>
                                <option>Promotional</option>
                                <option>Testimonial</option>
                                <option>Behind the Scenes</option>
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
                            <textarea className="wvd-form-input wvd-form-textarea" rows={2} placeholder="Brief description of video content..." value={videoDescription} onChange={e => setVideoDescription(e.target.value)}></textarea>
                        </div>
                    </div>
                </div>
            </section>

            {/* Virtual Tour */}
            <section className="wvd-form-section">
                <div className="wvd-form-section-header">
                    <div>
                        <h3 className="wvd-form-section-title">Virtual Tour</h3>
                        <p className="wvd-form-hint">360° interactive property tour</p>
                    </div>
                </div>
                <div className="wvd-form-section-body">
                    <div className="wm-tour-card">
                        <div className="wm-tour-icon"><Box size={32} /></div>
                        <div className="wm-tour-info">
                            <div className="wm-tour-title">Matterport 3D Tour</div>
                            <div className="wm-tour-url">https://my.matterport.com/show/?m=abc123xyz</div>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button className="wvd-btn-secondary wvd-btn-small">Preview</button>
                            <button className="wvd-btn-secondary wvd-btn-small">Edit</button>
                        </div>
                    </div>

                    <div className="wvd-form-grid" style={{ marginTop: '20px' }}>
                        <div className="wvd-form-group wvd-full-width">
                            <label className="wvd-form-label">Virtual Tour Embed URL</label>
                            <input type="text" className="wvd-form-input" value={virtualTourUrl} onChange={e => setVirtualTourUrl(e.target.value)} />
                        </div>
                    </div>
                </div>
            </section>

            {/* Media Guidelines */}
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

            {/* Tab Hero Images Reference */}
            <section className="wvd-form-section">
                <div className="wvd-form-section-header">
                    <div>
                        <h3 className="wvd-form-section-title">Tab Hero Images</h3>
                        <p className="wvd-form-hint">Hero images for each website tab are managed in their respective portal tabs</p>
                    </div>
                </div>
                <div className="wvd-form-section-body">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                        {['Overview', 'Services', 'About / Space', 'Location'].map((tab, i) => (
                            <div key={i} className="wm-tab-hero-card">
                                <div className="wm-tab-hero-preview set">
                                    <ImageIcon size={24} color="#7A644F" strokeWidth={1.5} />
                                </div>
                                <div className="wm-tab-hero-name">{tab}</div>
                                <div className="wm-tab-hero-status set"><Check size={10} style={{ marginRight: 2 }} /> Set</div>
                            </div>
                        ))}
                    </div>
                    <p className="wm-tab-section-subtitle">CONDITIONAL TABS</p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                        {['Packages', 'Practitioners', 'Accommodation'].map((tab, i) => (
                            <div key={i} className="wm-tab-hero-card">
                                <div className="wm-tab-hero-preview unset">
                                    <ImageIcon size={24} color="#B8B8B8" strokeWidth={1.5} />
                                </div>
                                <div className="wm-tab-hero-name">{tab}</div>
                                <div className="wm-tab-hero-status unset">Not set</div>
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
                    <button className="wvd-btn-secondary wvd-btn-small">
                        <Plus size={14} />
                        Add Document
                    </button>
                </div>
                <div className="wvd-form-section-body">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                        <div className="wm-asset-card">
                            <div className="wm-asset-icon document"><FileText size={24} color="white" /></div>
                            <div className="wm-asset-info">
                                <div className="wm-asset-title">Treatment Menu</div>
                                <div className="wm-asset-meta">PDF • 2.4 MB • Updated Jan 2026</div>
                            </div>
                            <button className="wvd-btn-secondary wvd-btn-small" style={{ padding: '6px 12px' }}>Replace</button>
                        </div>
                        <div className="wm-asset-card">
                            <div className="wm-asset-icon voucher"><FileText size={24} color="white" /></div>
                            <div className="wm-asset-info">
                                <div className="wm-asset-title">Gift Voucher Info</div>
                                <div className="wm-asset-meta">PDF • 0.8 MB • Updated Jan 2026</div>
                            </div>
                            <button className="wvd-btn-secondary wvd-btn-small" style={{ padding: '6px 12px' }}>Replace</button>
                        </div>
                        <div className="wm-asset-card dashed">
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
                            <div className="wm-seo-upload">
                                <ImageIcon size={32} color="#B8B8B8" strokeWidth={1.5} />
                                <span className="wm-seo-upload-title">Click to upload</span>
                                <span className="wm-seo-upload-hint">1200 x 630px recommended</span>
                            </div>
                            <p className="wvd-form-hint" style={{ marginTop: '6px' }}>Used when sharing on Facebook, LinkedIn, etc. Falls back to Hero Image if not set.</p>
                        </div>
                        <div className="wvd-form-group">
                            <label className="wvd-form-label">Twitter Card Image</label>
                            <div className="wm-seo-upload">
                                <ImageIcon size={32} color="#B8B8B8" strokeWidth={1.5} />
                                <span className="wm-seo-upload-title">Click to upload</span>
                                <span className="wm-seo-upload-hint">1200 x 600px recommended</span>
                            </div>
                            <p className="wvd-form-hint" style={{ marginTop: '6px' }}>Used for Twitter/X shares. Falls back to Open Graph image if not set.</p>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
}
