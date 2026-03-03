import { Check, Plus, UploadCloud, ChevronDown } from 'lucide-react';
import type { Venue } from '../context/VenueContext';

interface WellnessServicesTabProps {
    venue: Venue;
    onUpdate?: (updates: Partial<Venue>) => void;
}

export default function WellnessServicesTab({ venue: _venue, onUpdate: _onUpdate }: WellnessServicesTabProps) {
    return (
        <div className="content-area">
            {/* Info Banner */}
            <div className="info-banner">
                <svg className="info-banner-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="16" x2="12" y2="12" />
                    <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
                <div className="info-banner-text">
                    <strong>Wellness Services</strong> are treatments, classes, and therapies that can be provided at this venue — either by on-site practitioners, visiting practitioners, or facilitated by retreat hosts. This is different from <strong>Wellness Facilities</strong> (physical spaces/equipment like saunas, pools, treatment rooms).
                </div>
            </div>

            {/* Tab Images */}
            <section className="form-section">
                <div className="form-section-header">
                    <div>
                        <h3 className="form-section-title">Tab Images</h3>
                        <p className="form-section-subtitle">Hero image displayed on the "Experiences & Add-Ons" tab of your public listing</p>
                    </div>
                </div>
                <div className="form-section-body">
                    <div className="form-grid">
                        <div className="form-group">
                            <label className="form-label">Experiences Tab Hero Image</label>
                            <div className="image-upload-area" style={{ border: '2px dashed rgba(184, 184, 184, 0.4)', borderRadius: '12px', padding: '40px', textAlign: 'center', backgroundColor: 'var(--secondary-bg)' }}>
                                <UploadCloud size={48} color="#B8B8B8" strokeWidth={1.5} style={{ marginBottom: '16px' }} />
                                <p style={{ color: 'var(--text)', fontWeight: 500, marginBottom: '4px' }}>Click to upload or drag and drop</p>
                                <p style={{ color: 'var(--accent)', fontSize: '12px' }}>Recommended: 1920×600px, JPG or PNG</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Tab Content */}
            <section className="form-section">
                <div className="form-section-header">
                    <div>
                        <h3 className="form-section-title">Tab Content</h3>
                        <p className="form-section-subtitle">Intro text displayed on the "Experiences & Add-Ons" tab of your public listing</p>
                    </div>
                </div>
                <div className="form-section-body">
                    <div className="form-grid">
                        <div className="form-group">
                            <label className="form-label">Tab Label</label>
                            <input type="text" className="form-input" defaultValue="Experiences & Add-Ons" placeholder="e.g. Experiences & Add-Ons, Services" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Tab Title</label>
                            <input type="text" className="form-input" defaultValue="Enhance Your Retreat" placeholder="e.g. Enhance Your Retreat, Additional Services" />
                        </div>
                        <div className="form-group full-width">
                            <label className="form-label">Tab Subtitle</label>
                            <input type="text" className="form-input" defaultValue="Optional services to complement your programming" placeholder="Brief subtitle..." />
                        </div>
                        <div className="form-group full-width">
                            <label className="form-label">Intro Paragraph</label>
                            <textarea className="form-input form-textarea" rows={3} placeholder="A paragraph introducing available services and practitioners..." defaultValue="Most facilitators bring their own programming—and we're here to support that fully. But if you'd like to weave in local practitioners, treatments, or excursions, we have a trusted network ready to enhance your offering." />
                        </div>
                    </div>
                </div>
            </section>

            {/* Practitioners Section Content */}
            <section className="form-section">
                <div className="form-section-header">
                    <div>
                        <h3 className="form-section-title">Practitioners Section</h3>
                        <p className="form-section-subtitle">How the practitioners section appears on your public listing</p>
                    </div>
                </div>
                <div className="form-section-body">
                    <div className="form-grid">
                        <div className="form-group">
                            <label className="form-label">Section Label</label>
                            <input type="text" className="form-input" defaultValue="Resident Practitioners" placeholder="e.g. Resident Practitioners, Our Healers" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Section Subtitle</label>
                            <input type="text" className="form-input" defaultValue="Local experts available for your retreat" placeholder="e.g. Available to book for your retreat" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Service Availability Overview */}
            <section className="form-section">
                <div className="form-section-header">
                    <div>
                        <h3 className="form-section-title">Service Availability</h3>
                        <p className="form-section-subtitle">How wellness services are provided at this venue</p>
                    </div>
                </div>
                <div className="form-section-body">
                    <div className="form-grid three-col">
                        <div className="form-group">
                            <label className="form-label">On-site Practitioners Available</label>
                            <div className="toggle-container">
                                <div className="toggle active">
                                    <div className="toggle-knob"></div>
                                </div>
                                <span className="toggle-label">Yes</span>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">External Practitioners Welcome</label>
                            <div className="toggle-container">
                                <div className="toggle active">
                                    <div className="toggle-knob"></div>
                                </div>
                                <span className="toggle-label">Yes</span>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">BYO Facilitator Friendly</label>
                            <div className="toggle-container">
                                <div className="toggle active">
                                    <div className="toggle-knob"></div>
                                </div>
                                <span className="toggle-label">Yes</span>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Can Arrange Services</label>
                            <div className="toggle-container">
                                <div className="toggle active">
                                    <div className="toggle-knob"></div>
                                </div>
                                <span className="toggle-label">Yes - venue can coordinate</span>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Advance Booking Required</label>
                            <div style={{ position: 'relative' }}>
                                <select className="form-input" style={{ width: '100%', appearance: 'none' }} defaultValue="Yes - 48 hours notice">
                                    <option>No - available on request</option>
                                    <option value="Yes - 48 hours notice">Yes - 48 hours notice</option>
                                    <option>Yes - 1 week notice</option>
                                    <option>Yes - 2 weeks notice</option>
                                </select>
                                <ChevronDown size={16} color="#B8B8B8" style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Service Pricing</label>
                            <div style={{ position: 'relative' }}>
                                <select className="form-input" style={{ width: '100%', appearance: 'none' }} defaultValue="Additional cost">
                                    <option>Included in venue hire</option>
                                    <option value="Additional cost">Additional cost</option>
                                    <option>Some included, some additional</option>
                                </select>
                                <ChevronDown size={16} color="#B8B8B8" style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Massage & Bodywork */}
            <section className="form-section">
                <div className="form-section-header">
                    <div>
                        <h3 className="form-section-title">Massage & Bodywork</h3>
                        <p className="form-section-subtitle">Therapeutic touch and manual therapies</p>
                    </div>
                    <span style={{ fontSize: '12px', color: 'var(--success)', fontWeight: 500 }}>6 available</span>
                </div>
                <div className="form-section-body">
                    <div className="service-category-grid">
                        <div className="service-item checked">
                            <div className="service-checkbox">
                                <Check size={14} color="white" strokeWidth={3} />
                            </div>
                            <span className="service-label">Swedish Massage</span>
                        </div>
                        <div className="service-item checked">
                            <div className="service-checkbox">
                                <Check size={14} color="white" strokeWidth={3} />
                            </div>
                            <span className="service-label">Deep Tissue Massage</span>
                        </div>
                        <div className="service-item checked">
                            <div className="service-checkbox">
                                <Check size={14} color="white" strokeWidth={3} />
                            </div>
                            <span className="service-label">Remedial Massage</span>
                        </div>
                        <div className="service-item checked">
                            <div className="service-checkbox">
                                <Check size={14} color="white" strokeWidth={3} />
                            </div>
                            <span className="service-label">Aromatherapy Massage</span>
                        </div>
                        <div className="service-item">
                            <div className="service-checkbox"></div>
                            <span className="service-label">Hot Stone Massage</span>
                        </div>
                        <div className="service-item checked">
                            <div className="service-checkbox">
                                <Check size={14} color="white" strokeWidth={3} />
                            </div>
                            <span className="service-label">Lymphatic Drainage</span>
                        </div>
                        <div className="service-item">
                            <div className="service-checkbox"></div>
                            <span className="service-label">Thai Massage</span>
                        </div>
                        <div className="service-item checked">
                            <div className="service-checkbox">
                                <Check size={14} color="white" strokeWidth={3} />
                            </div>
                            <span className="service-label">Reflexology</span>
                        </div>
                        <div className="service-item">
                            <div className="service-checkbox"></div>
                            <span className="service-label">Shiatsu</span>
                        </div>
                        <div className="service-item">
                            <div className="service-checkbox"></div>
                            <span className="service-label">Craniosacral Therapy</span>
                        </div>
                        <div className="service-item">
                            <div className="service-checkbox"></div>
                            <span className="service-label">Myofascial Release</span>
                        </div>
                        <div className="service-item">
                            <div className="service-checkbox"></div>
                            <span className="service-label">Pregnancy Massage</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Movement & Fitness */}
            <section className="form-section">
                <div className="form-section-header">
                    <div>
                        <h3 className="form-section-title">Movement & Fitness</h3>
                        <p className="form-section-subtitle">Classes and physical practices</p>
                    </div>
                    <span style={{ fontSize: '12px', color: 'var(--success)', fontWeight: 500 }}>8 available</span>
                </div>
                <div className="form-section-body">
                    <div className="service-category-grid">
                        <div className="service-item checked">
                            <div className="service-checkbox">
                                <Check size={14} color="white" strokeWidth={3} />
                            </div>
                            <span className="service-label">Yoga Classes</span>
                        </div>
                        <div className="service-item checked">
                            <div className="service-checkbox">
                                <Check size={14} color="white" strokeWidth={3} />
                            </div>
                            <span className="service-label">Pilates</span>
                        </div>
                        <div className="service-item checked">
                            <div className="service-checkbox">
                                <Check size={14} color="white" strokeWidth={3} />
                            </div>
                            <span className="service-label">Meditation Sessions</span>
                        </div>
                        <div className="service-item checked">
                            <div className="service-checkbox">
                                <Check size={14} color="white" strokeWidth={3} />
                            </div>
                            <span className="service-label">Breathwork Sessions</span>
                        </div>
                        <div className="service-item checked">
                            <div className="service-checkbox">
                                <Check size={14} color="white" strokeWidth={3} />
                            </div>
                            <span className="service-label">Tai Chi / Qigong</span>
                        </div>
                        <div className="service-item">
                            <div className="service-checkbox"></div>
                            <span className="service-label">Personal Training</span>
                        </div>
                        <div className="service-item checked">
                            <div className="service-checkbox">
                                <Check size={14} color="white" strokeWidth={3} />
                            </div>
                            <span className="service-label">Nature Walks / Hiking</span>
                        </div>
                        <div className="service-item checked">
                            <div className="service-checkbox">
                                <Check size={14} color="white" strokeWidth={3} />
                            </div>
                            <span className="service-label">Sound Healing</span>
                        </div>
                        <div className="service-item">
                            <div className="service-checkbox"></div>
                            <span className="service-label">Dance / Movement Therapy</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Holistic & Energy Therapies */}
            <section className="form-section">
                <div className="form-section-header">
                    <div>
                        <h3 className="form-section-title">Holistic & Energy Therapies</h3>
                        <p className="form-section-subtitle">Energy work and alternative therapies</p>
                    </div>
                    <span style={{ fontSize: '12px', color: 'var(--success)', fontWeight: 500 }}>4 available</span>
                </div>
                <div className="form-section-body">
                    <div className="service-category-grid">
                        <div className="service-item checked">
                            <div className="service-checkbox">
                                <Check size={14} color="white" strokeWidth={3} />
                            </div>
                            <span className="service-label">Reiki</span>
                        </div>
                        <div className="service-item checked">
                            <div className="service-checkbox">
                                <Check size={14} color="white" strokeWidth={3} />
                            </div>
                            <span className="service-label">Energy Healing</span>
                        </div>
                        <div className="service-item">
                            <div className="service-checkbox"></div>
                            <span className="service-label">Acupuncture</span>
                        </div>
                        <div className="service-item">
                            <div className="service-checkbox"></div>
                            <span className="service-label">Acupressure</span>
                        </div>
                        <div className="service-item checked">
                            <div className="service-checkbox">
                                <Check size={14} color="white" strokeWidth={3} />
                            </div>
                            <span className="service-label">Kinesiology</span>
                        </div>
                        <div className="service-item">
                            <div className="service-checkbox"></div>
                            <span className="service-label">Hypnotherapy</span>
                        </div>
                        <div className="service-item checked">
                            <div className="service-checkbox">
                                <Check size={14} color="white" strokeWidth={3} />
                            </div>
                            <span className="service-label">Crystal Healing</span>
                        </div>
                        <div className="service-item">
                            <div className="service-checkbox"></div>
                            <span className="service-label">Shamanic Healing</span>
                        </div>
                        <div className="service-item">
                            <div className="service-checkbox"></div>
                            <span className="service-label">Ayurvedic Treatments</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Nutrition & Detox */}
            <section className="form-section">
                <div className="form-section-header">
                    <div>
                        <h3 className="form-section-title">Nutrition & Detox</h3>
                        <p className="form-section-subtitle">Food, fasting, and cleansing programs</p>
                    </div>
                    <span style={{ fontSize: '12px', color: 'var(--success)', fontWeight: 500 }}>5 available</span>
                </div>
                <div className="form-section-body">
                    <div className="service-category-grid">
                        <div className="service-item checked">
                            <div className="service-checkbox">
                                <Check size={14} color="white" strokeWidth={3} />
                            </div>
                            <span className="service-label">Nutritional Consultation</span>
                        </div>
                        <div className="service-item checked">
                            <div className="service-checkbox">
                                <Check size={14} color="white" strokeWidth={3} />
                            </div>
                            <span className="service-label">Cooking Classes</span>
                        </div>
                        <div className="service-item checked">
                            <div className="service-checkbox">
                                <Check size={14} color="white" strokeWidth={3} />
                            </div>
                            <span className="service-label">Juice Cleanse Programs</span>
                        </div>
                        <div className="service-item checked">
                            <div className="service-checkbox">
                                <Check size={14} color="white" strokeWidth={3} />
                            </div>
                            <span className="service-label">Detox Programs</span>
                        </div>
                        <div className="service-item checked">
                            <div className="service-checkbox">
                                <Check size={14} color="white" strokeWidth={3} />
                            </div>
                            <span className="service-label">Plant-based Menu Options</span>
                        </div>
                        <div className="service-item">
                            <div className="service-checkbox"></div>
                            <span className="service-label">Fasting Programs</span>
                        </div>
                        <div className="service-item">
                            <div className="service-checkbox"></div>
                            <span className="service-label">IV Therapy</span>
                        </div>
                        <div className="service-item">
                            <div className="service-checkbox"></div>
                            <span className="service-label">Colonic Hydrotherapy</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Mind & Spirit */}
            <section className="form-section">
                <div className="form-section-header">
                    <div>
                        <h3 className="form-section-title">Mind & Spirit</h3>
                        <p className="form-section-subtitle">Coaching, counselling, and spiritual practices</p>
                    </div>
                    <span style={{ fontSize: '12px', color: 'var(--success)', fontWeight: 500 }}>6 available</span>
                </div>
                <div className="form-section-body">
                    <div className="service-category-grid">
                        <div className="service-item checked">
                            <div className="service-checkbox">
                                <Check size={14} color="white" strokeWidth={3} />
                            </div>
                            <span className="service-label">Life Coaching</span>
                        </div>
                        <div className="service-item checked">
                            <div className="service-checkbox">
                                <Check size={14} color="white" strokeWidth={3} />
                            </div>
                            <span className="service-label">Counselling / Therapy</span>
                        </div>
                        <div className="service-item checked">
                            <div className="service-checkbox">
                                <Check size={14} color="white" strokeWidth={3} />
                            </div>
                            <span className="service-label">Mindfulness Training</span>
                        </div>
                        <div className="service-item">
                            <div className="service-checkbox"></div>
                            <span className="service-label">Psychotherapy</span>
                        </div>
                        <div className="service-item checked">
                            <div className="service-checkbox">
                                <Check size={14} color="white" strokeWidth={3} />
                            </div>
                            <span className="service-label">Cacao Ceremony</span>
                        </div>
                        <div className="service-item checked">
                            <div className="service-checkbox">
                                <Check size={14} color="white" strokeWidth={3} />
                            </div>
                            <span className="service-label">Women's / Men's Circles</span>
                        </div>
                        <div className="service-item checked">
                            <div className="service-checkbox">
                                <Check size={14} color="white" strokeWidth={3} />
                            </div>
                            <span className="service-label">Journaling / Writing Workshops</span>
                        </div>
                        <div className="service-item">
                            <div className="service-checkbox"></div>
                            <span className="service-label">Tarot / Oracle Reading</span>
                        </div>
                        <div className="service-item">
                            <div className="service-checkbox"></div>
                            <span className="service-label">Astrology Consultation</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Beauty & Spa */}
            <section className="form-section">
                <div className="form-section-header">
                    <div>
                        <h3 className="form-section-title">Beauty & Spa</h3>
                        <p className="form-section-subtitle">Aesthetic and pampering treatments</p>
                    </div>
                    <span style={{ fontSize: '12px', color: 'var(--success)', fontWeight: 500 }}>3 available</span>
                </div>
                <div className="form-section-body">
                    <div className="service-category-grid">
                        <div className="service-item checked">
                            <div className="service-checkbox">
                                <Check size={14} color="white" strokeWidth={3} />
                            </div>
                            <span className="service-label">Facials</span>
                        </div>
                        <div className="service-item checked">
                            <div className="service-checkbox">
                                <Check size={14} color="white" strokeWidth={3} />
                            </div>
                            <span className="service-label">Body Scrubs / Wraps</span>
                        </div>
                        <div className="service-item checked">
                            <div className="service-checkbox">
                                <Check size={14} color="white" strokeWidth={3} />
                            </div>
                            <span className="service-label">Manicure / Pedicure</span>
                        </div>
                        <div className="service-item">
                            <div className="service-checkbox"></div>
                            <span className="service-label">Hair Treatments</span>
                        </div>
                        <div className="service-item">
                            <div className="service-checkbox"></div>
                            <span className="service-label">Waxing</span>
                        </div>
                        <div className="service-item">
                            <div className="service-checkbox"></div>
                            <span className="service-label">Makeup Services</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* On-site Practitioners */}
            <section className="form-section">
                <div className="form-section-header">
                    <div>
                        <h3 className="form-section-title">On-site Practitioners</h3>
                        <p className="form-section-subtitle">Wellness professionals available through this venue — displayed on your public listing</p>
                    </div>
                    <button className="btn btn-secondary btn-small">
                        <Plus size={14} strokeWidth={2} style={{ marginRight: '6px' }} />
                        Add Practitioner
                    </button>
                </div>
                <div className="form-section-body">
                    <div className="practitioner-cards">

                        {/* Practitioner 1 */}
                        <div className="practitioner-card">
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '16px' }}>
                                <div className="practitioner-avatar-placeholder">
                                    <UploadCloud size={32} color="#B8B8B8" strokeWidth={1.5} />
                                </div>
                                <div className="practitioner-info">
                                    <div className="practitioner-name">Sarah Johnson</div>
                                    <div className="practitioner-title">Remedial Massage Therapist • 12 years experience</div>
                                    <div className="practitioner-services">
                                        <span className="practitioner-service-tag">Swedish</span>
                                        <span className="practitioner-service-tag">Deep Tissue</span>
                                        <span className="practitioner-service-tag">Remedial</span>
                                        <span className="practitioner-service-tag">Lymphatic</span>
                                    </div>
                                </div>
                                <div className="practitioner-actions">
                                    <div className="toggle-container" style={{ justifyContent: 'flex-end', marginBottom: '8px' }}>
                                        <div className="toggle active">
                                            <div className="toggle-knob"></div>
                                        </div>
                                        <span className="toggle-label" style={{ fontSize: '11px' }}>Show on website</span>
                                    </div>
                                    <button className="btn btn-secondary btn-small" style={{ width: '100%' }}>Edit</button>
                                </div>
                            </div>
                            <div style={{ borderTop: '1px solid rgba(184, 184, 184, 0.2)', paddingTop: '16px' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '16px' }}>
                                    <div>
                                        <label className="form-label" style={{ fontSize: '11px', marginBottom: '4px' }}>Website Display Title</label>
                                        <input type="text" className="form-input" defaultValue="Bodywork & Massage" style={{ fontSize: '12px', padding: '8px', width: '100%' }} />
                                    </div>
                                    <div>
                                        <label className="form-label" style={{ fontSize: '11px', marginBottom: '4px' }}>Website Description</label>
                                        <input type="text" className="form-input" defaultValue="15 years experience in remedial massage, deep tissue, and lymphatic drainage." style={{ fontSize: '12px', padding: '8px', width: '100%' }} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Practitioner 2 */}
                        <div className="practitioner-card">
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '16px' }}>
                                <div className="practitioner-avatar-placeholder">
                                    <UploadCloud size={32} color="#B8B8B8" strokeWidth={1.5} />
                                </div>
                                <div className="practitioner-info">
                                    <div className="practitioner-name">Maya Kumar</div>
                                    <div className="practitioner-title">Yoga Teacher & Energy Healer • RYT-500</div>
                                    <div className="practitioner-services">
                                        <span className="practitioner-service-tag">Yoga</span>
                                        <span className="practitioner-service-tag">Meditation</span>
                                        <span className="practitioner-service-tag">Reiki</span>
                                        <span className="practitioner-service-tag">Sound Healing</span>
                                    </div>
                                </div>
                                <div className="practitioner-actions">
                                    <div className="toggle-container" style={{ justifyContent: 'flex-end', marginBottom: '8px' }}>
                                        <div className="toggle active">
                                            <div className="toggle-knob"></div>
                                        </div>
                                        <span className="toggle-label" style={{ fontSize: '11px' }}>Show on website</span>
                                    </div>
                                    <button className="btn btn-secondary btn-small" style={{ width: '100%' }}>Edit</button>
                                </div>
                            </div>
                            <div style={{ borderTop: '1px solid rgba(184, 184, 184, 0.2)', paddingTop: '16px' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '16px' }}>
                                    <div>
                                        <label className="form-label" style={{ fontSize: '11px', marginBottom: '4px' }}>Website Display Title</label>
                                        <input type="text" className="form-input" defaultValue="Yoga & Energy Healing" style={{ fontSize: '12px', padding: '8px', width: '100%' }} />
                                    </div>
                                    <div>
                                        <label className="form-label" style={{ fontSize: '11px', marginBottom: '4px' }}>Website Description</label>
                                        <input type="text" className="form-input" defaultValue="RYT-500 teacher offering yoga, meditation guidance, Reiki, and sound healing sessions." style={{ fontSize: '12px', padding: '8px', width: '100%' }} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Practitioner 3 */}
                        <div className="practitioner-card">
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '16px' }}>
                                <div className="practitioner-avatar-placeholder">
                                    <UploadCloud size={32} color="#B8B8B8" strokeWidth={1.5} />
                                </div>
                                <div className="practitioner-info">
                                    <div className="practitioner-name">Dr. Rebecca Liu</div>
                                    <div className="practitioner-title">Naturopath & Nutritionist • BHSc</div>
                                    <div className="practitioner-services">
                                        <span className="practitioner-service-tag">Nutrition</span>
                                        <span className="practitioner-service-tag">Detox</span>
                                        <span className="practitioner-service-tag">Kinesiology</span>
                                    </div>
                                </div>
                                <div className="practitioner-actions">
                                    <div className="toggle-container" style={{ justifyContent: 'flex-end', marginBottom: '8px' }}>
                                        <div className="toggle active">
                                            <div className="toggle-knob"></div>
                                        </div>
                                        <span className="toggle-label" style={{ fontSize: '11px' }}>Show on website</span>
                                    </div>
                                    <button className="btn btn-secondary btn-small" style={{ width: '100%' }}>Edit</button>
                                </div>
                            </div>
                            <div style={{ borderTop: '1px solid rgba(184, 184, 184, 0.2)', paddingTop: '16px' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '16px' }}>
                                    <div>
                                        <label className="form-label" style={{ fontSize: '11px', marginBottom: '4px' }}>Website Display Title</label>
                                        <input type="text" className="form-input" defaultValue="Naturopathy & Nutrition" style={{ fontSize: '12px', padding: '8px', width: '100%' }} />
                                    </div>
                                    <div>
                                        <label className="form-label" style={{ fontSize: '11px', marginBottom: '4px' }}>Website Description</label>
                                        <input type="text" className="form-input" defaultValue="Naturopathic doctor offering consultations, detox guidance, and nutritional workshops." style={{ fontSize: '12px', padding: '8px', width: '100%' }} />
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    <button className="add-service-btn" style={{ marginTop: '16px' }}>
                        <Plus size={18} strokeWidth={1.5} />
                        Add Another Practitioner
                    </button>
                </div>
            </section>

            {/* Service Notes */}
            <section className="form-section">
                <div className="form-section-header">
                    <h3 className="form-section-title">Additional Service Notes</h3>
                </div>
                <div className="form-section-body">
                    <div className="form-group">
                        <label className="form-label">Notes for Retreat Hosts & Guests</label>
                        <textarea className="form-input form-textarea" rows={4} placeholder="Any additional information about wellness services..." defaultValue="All massage and bodywork services require 48 hours advance booking. Practitioners are based locally in Berry and travel to the property. Equipment provided includes massage tables, bolsters, towels, and premium organic oils. For larger groups (8+), we recommend booking multiple practitioners. Retreat hosts are welcome to bring their own practitioners - we have two dedicated treatment rooms available." />
                    </div>
                </div>
            </section>

        </div>
    );
}
