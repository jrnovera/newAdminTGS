import { Info, Image as ImageIcon, Plus } from 'lucide-react';
import type { Venue } from '../context/VenueContext';

interface WellnessFacilitiesTabProps {
    venue: Venue;
    onUpdate?: (updates: Partial<Venue>) => void;
}

export default function WellnessFacilitiesTab({ venue: _venue }: WellnessFacilitiesTabProps) {
    return (
        <div>
            {/* Info Banner */}
            <div className="info-banner">
                <Info className="info-banner-icon" />
                <div className="info-banner-text">
                    <strong>Wellness Facilities</strong> are physical spaces and equipment dedicated to wellness — saunas, pools, treatment rooms, etc. This is different from <strong>Wellness Services</strong> (treatments and classes provided by practitioners).
                </div>
            </div>

            {/* Tab Images */}
            <section className="form-section">
                <div className="form-section-header">
                    <div>
                        <h3 className="form-section-title">Tab Images</h3>
                        <p className="form-section-subtitle">Hero image displayed in the "Water & Healing" section on your public listing (Amenities tab)</p>
                    </div>
                </div>
                <div className="form-section-body">
                    <div className="form-grid">
                        <div className="form-group">
                            <label className="form-label">Wellness Facilities Hero Image</label>
                            <div
                                className="image-upload-area"
                                style={{
                                    border: '2px dashed rgba(184, 184, 184, 0.4)',
                                    borderRadius: 12,
                                    padding: 40,
                                    textAlign: 'center',
                                    backgroundColor: 'var(--secondary-bg)',
                                    cursor: 'pointer'
                                }}
                            >
                                <ImageIcon width={48} height={48} color="#B8B8B8" strokeWidth={1.5} style={{ marginBottom: 16 }} />
                                <p style={{ color: 'var(--text)', fontWeight: 500, marginBottom: 4 }}>Click to upload or drag and drop</p>
                                <p style={{ color: 'var(--accent)', fontSize: 12 }}>Recommended: 1920×600px, JPG or PNG</p>
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
                        <p className="form-section-subtitle">Intro text displayed in the "Water & Healing" section on your public listing</p>
                    </div>
                </div>
                <div className="form-section-body">
                    <div className="form-grid">
                        <div className="form-group">
                            <label className="form-label">Section Label</label>
                            <input type="text" className="form-input" defaultValue="Water & Healing" placeholder="e.g. Water & Healing, Thermal Facilities" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Section Title</label>
                            <input type="text" className="form-input" defaultValue="Restore Through Stillness and Contrast" placeholder="e.g. Rest, Restore, Renew" />
                        </div>
                        <div className="form-group full-width">
                            <label className="form-label">Section Subtitle</label>
                            <input type="text" className="form-input" defaultValue="Complete contrast therapy circuit included with every stay" placeholder="Brief subtitle..." />
                        </div>
                        <div className="form-group full-width">
                            <label className="form-label">Intro Paragraph</label>
                            <textarea className="form-input form-textarea" rows={3} placeholder="A paragraph introducing your wellness facilities..." defaultValue="The property features a complete thermal wellness circuit designed for contrast therapy. Move from the heat of the infrared sauna to the cold plunge, then warm up in the outdoor spa. All facilities are included in your stay—no additional fees."></textarea>
                        </div>
                    </div>
                </div>
            </section>

            {/* Wellness Facilities Summary */}
            <div className="summary-stats">
                <div className="summary-stat">
                    <div className="summary-stat-value">1</div>
                    <div className="summary-stat-label">Sauna</div>
                </div>
                <div className="summary-stat">
                    <div className="summary-stat-value">1</div>
                    <div className="summary-stat-label">Pool</div>
                </div>
                <div className="summary-stat">
                    <div className="summary-stat-value">2</div>
                    <div className="summary-stat-label">Plunge Pools</div>
                </div>
                <div className="summary-stat">
                    <div className="summary-stat-value">2</div>
                    <div className="summary-stat-label">Treatment Rooms</div>
                </div>
                <div className="summary-stat">
                    <div className="summary-stat-value">1</div>
                    <div className="summary-stat-label">Red Light</div>
                </div>
            </div>

            {/* Individual Facility Cards */}
            <div className="facility-cards">

                {/* Sauna */}
                <div className="facility-card">
                    <div className="facility-card-header">
                        <div className="facility-card-title">
                            <div className="facility-icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#313131" strokeWidth="1.5">
                                    <path d="M12 2v2m0 16v2M4 12H2m20 0h-2m-2.93-7.07l-1.41 1.41m-9.32 9.32l-1.41 1.41m0-12.14l1.41 1.41m9.32 9.32l1.41 1.41" />
                                    <circle cx="12" cy="12" r="5" />
                                </svg>
                            </div>
                            Sauna
                        </div>
                        <div className="facility-card-toggle">
                            <span className="facility-status available">Available</span>
                            <div className="toggle active">
                                <div className="toggle-knob"></div>
                            </div>
                        </div>
                    </div>
                    <div className="facility-card-body">
                        {/* Facility Image & Description for Website */}
                        <div className="facility-grid" style={{ marginBottom: 20 }}>
                            <div className="facility-field span-2">
                                <div className="facility-field-label">Facility Image (for website)</div>
                                <div style={{ display: 'flex', gap: 16, alignItems: 'start' }}>
                                    <div style={{ width: 200, height: 140, borderRadius: 8, background: 'var(--secondary-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed rgba(184, 184, 184, 0.4)' }}>
                                        <ImageIcon width={40} height={40} color="#B8B8B8" strokeWidth={1.5} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <button className="btn btn-secondary btn-small" style={{ marginBottom: 8 }}>Upload Image</button>
                                        <p style={{ fontSize: 11, color: 'var(--accent)' }}>Recommended: 800×600px, JPG or PNG</p>
                                    </div>
                                </div>
                            </div>
                            <div className="facility-field">
                                <div className="facility-field-label">Show on Website</div>
                                <div className="toggle-container">
                                    <div className="toggle active">
                                        <div className="toggle-knob"></div>
                                    </div>
                                    <span className="toggle-label">Yes - Display in listing</span>
                                </div>
                            </div>
                        </div>

                        <div className="facility-grid" style={{ marginBottom: 20 }}>
                            <div className="facility-field span-2">
                                <div className="facility-field-label">Website Display Title</div>
                                <input type="text" className="form-input" defaultValue="Infrared Sauna" placeholder="e.g. Finnish Sauna, Barrel Sauna" />
                            </div>
                            <div className="facility-field span-3">
                                <div className="facility-field-label">Website Description</div>
                                <textarea className="form-input form-textarea" rows={2} placeholder="Description for public listing..." defaultValue="Outdoor infrared sauna for 6 people. The perfect way to warm up before a cold plunge or wind down after an evening session."></textarea>
                            </div>
                        </div>

                        <div className="facility-grid">
                            <div className="facility-field">
                                <div className="facility-field-label">Sauna Type</div>
                                <select className="form-input form-select" defaultValue="Infrared">
                                    <option>Traditional Finnish</option>
                                    <option>Infrared</option>
                                    <option>Steam Sauna</option>
                                    <option>Barrel Sauna</option>
                                </select>
                            </div>
                            <div className="facility-field">
                                <div className="facility-field-label">Setting</div>
                                <select className="form-input form-select" defaultValue="Outdoor">
                                    <option>Indoor</option>
                                    <option>Outdoor</option>
                                    <option>Pool House</option>
                                </select>
                            </div>
                            <div className="facility-field">
                                <div className="facility-field-label">Capacity</div>
                                <input type="number" className="form-input" defaultValue="6" />
                            </div>
                            <div className="facility-field">
                                <div className="facility-field-label">Temperature Range</div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <span className="temp-badge hot">60-80°C</span>
                                </div>
                            </div>
                            <div className="facility-field">
                                <div className="facility-field-label">Private / Shared</div>
                                <select className="form-input form-select" defaultValue="Shared (all guests)">
                                    <option>Shared (all guests)</option>
                                    <option>Private (bookable)</option>
                                </select>
                            </div>
                            <div className="facility-field">
                                <div className="facility-field-label">Operating Hours</div>
                                <input type="text" className="form-input" defaultValue="6am - 10pm" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Swimming Pool */}
                <div className="facility-card">
                    <div className="facility-card-header">
                        <div className="facility-card-title">
                            <div className="facility-icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#313131" strokeWidth="1.5">
                                    <path d="M2 12h20M2 12c2 2 4 3 6 3s4-1 6-3c2 2 4 3 6 3" />
                                    <path d="M2 17h20M2 17c2 2 4 3 6 3s4-1 6-3c2 2 4 3 6 3" />
                                </svg>
                            </div>
                            Swimming Pool
                        </div>
                        <div className="facility-card-toggle">
                            <span className="facility-status available">Available</span>
                            <div className="toggle active">
                                <div className="toggle-knob"></div>
                            </div>
                        </div>
                    </div>
                    <div className="facility-card-body">
                        <div className="facility-grid" style={{ marginBottom: 20 }}>
                            <div className="facility-field span-2">
                                <div className="facility-field-label">Facility Image (for website)</div>
                                <div style={{ display: 'flex', gap: 16, alignItems: 'start' }}>
                                    <div style={{ width: 200, height: 140, borderRadius: 8, background: 'var(--secondary-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed rgba(184, 184, 184, 0.4)' }}>
                                        <ImageIcon width={40} height={40} color="#B8B8B8" strokeWidth={1.5} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <button className="btn btn-secondary btn-small" style={{ marginBottom: 8 }}>Upload Image</button>
                                        <p style={{ fontSize: 11, color: 'var(--accent)' }}>Recommended: 800×600px, JPG or PNG</p>
                                    </div>
                                </div>
                            </div>
                            <div className="facility-field">
                                <div className="facility-field-label">Show on Website</div>
                                <div className="toggle-container">
                                    <div className="toggle active">
                                        <div className="toggle-knob"></div>
                                    </div>
                                    <span className="toggle-label">Yes - Display in listing</span>
                                </div>
                            </div>
                        </div>

                        <div className="facility-grid" style={{ marginBottom: 20 }}>
                            <div className="facility-field span-2">
                                <div className="facility-field-label">Website Display Title</div>
                                <input type="text" className="form-input" defaultValue="Solar Heated Pool" placeholder="e.g. Infinity Pool, Lap Pool" />
                            </div>
                            <div className="facility-field span-3">
                                <div className="facility-field-label">Website Description</div>
                                <textarea className="form-input form-textarea" rows={2} placeholder="Description for public listing..." defaultValue="12-meter heated pool overlooking the valley. Solar heated year-round to a comfortable 28°C. Perfect for morning laps or afternoon relaxation."></textarea>
                            </div>
                        </div>

                        <div className="facility-grid">
                            <div className="facility-field">
                                <div className="facility-field-label">Pool Type</div>
                                <select className="form-input form-select" defaultValue="Outdoor">
                                    <option>Indoor</option>
                                    <option>Outdoor</option>
                                    <option>Indoor/Outdoor</option>
                                    <option>Natural / Dam</option>
                                </select>
                            </div>
                            <div className="facility-field">
                                <div className="facility-field-label">Heated</div>
                                <div className="toggle-container">
                                    <div className="toggle active">
                                        <div className="toggle-knob"></div>
                                    </div>
                                    <span className="toggle-label">Yes - Solar heated</span>
                                </div>
                            </div>
                            <div className="facility-field">
                                <div className="facility-field-label">Temperature</div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <span className="temp-badge neutral">28°C year-round</span>
                                </div>
                            </div>
                            <div className="facility-field">
                                <div className="facility-field-label">Pool Size</div>
                                <input type="text" className="form-input" defaultValue="12m x 5m" />
                            </div>
                            <div className="facility-field">
                                <div className="facility-field-label">Depth</div>
                                <input type="text" className="form-input" defaultValue="1.2m - 1.8m" />
                            </div>
                            <div className="facility-field">
                                <div className="facility-field-label">Lap Swimming</div>
                                <div className="toggle-container">
                                    <div className="toggle active">
                                        <div className="toggle-knob"></div>
                                    </div>
                                    <span className="toggle-label">Yes</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Cold Plunge */}
                <div className="facility-card">
                    <div className="facility-card-header">
                        <div className="facility-card-title">
                            <div className="facility-icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#313131" strokeWidth="1.5">
                                    <path d="M12 2v8m0 0l-3-3m3 3l3-3" />
                                    <path d="M20 16.58A5 5 0 0018 7h-1.26A8 8 0 104 15.25" />
                                </svg>
                            </div>
                            Cold Plunge Pool
                        </div>
                        <div className="facility-card-toggle">
                            <span className="facility-status available">Available</span>
                            <div className="toggle active">
                                <div className="toggle-knob"></div>
                            </div>
                        </div>
                    </div>
                    <div className="facility-card-body">
                        <div className="facility-grid" style={{ marginBottom: 20 }}>
                            <div className="facility-field span-2">
                                <div className="facility-field-label">Facility Image (for website)</div>
                                <div style={{ display: 'flex', gap: 16, alignItems: 'start' }}>
                                    <div style={{ width: 200, height: 140, borderRadius: 8, background: 'var(--secondary-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed rgba(184, 184, 184, 0.4)' }}>
                                        <ImageIcon width={40} height={40} color="#B8B8B8" strokeWidth={1.5} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <button className="btn btn-secondary btn-small" style={{ marginBottom: 8 }}>Upload Image</button>
                                        <p style={{ fontSize: 11, color: 'var(--accent)' }}>Recommended: 800×600px, JPG or PNG</p>
                                    </div>
                                </div>
                            </div>
                            <div className="facility-field">
                                <div className="facility-field-label">Show on Website</div>
                                <div className="toggle-container">
                                    <div className="toggle active">
                                        <div className="toggle-knob"></div>
                                    </div>
                                    <span className="toggle-label">Yes - Display in listing</span>
                                </div>
                            </div>
                        </div>

                        <div className="facility-grid" style={{ marginBottom: 20 }}>
                            <div className="facility-field span-2">
                                <div className="facility-field-label">Website Display Title</div>
                                <input type="text" className="form-input" defaultValue="Cold Plunge" placeholder="e.g. Ice Bath, Cold Pool" />
                            </div>
                            <div className="facility-field span-3">
                                <div className="facility-field-label">Website Description</div>
                                <textarea className="form-input form-textarea" rows={2} placeholder="Description for public listing..." defaultValue="Dedicated cold immersion pool maintained at 8-12°C. Located adjacent to the sauna for easy contrast therapy circuits."></textarea>
                            </div>
                        </div>

                        <div className="facility-grid">
                            <div className="facility-field">
                                <div className="facility-field-label">Plunge Type</div>
                                <select className="form-input form-select" defaultValue="Dedicated Cold Plunge">
                                    <option>Dedicated Cold Plunge</option>
                                    <option>Ice Bath</option>
                                    <option>Cold Shower</option>
                                    <option>Natural Cold Water</option>
                                </select>
                            </div>
                            <div className="facility-field">
                                <div className="facility-field-label">Temperature</div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <span className="temp-badge cold">8-12°C</span>
                                </div>
                            </div>
                            <div className="facility-field">
                                <div className="facility-field-label">Capacity</div>
                                <input type="number" className="form-input" defaultValue="2" />
                            </div>
                            <div className="facility-field span-3">
                                <div className="facility-field-label">Features</div>
                                <div className="facility-features">
                                    <span className="facility-feature">Chiller System</span>
                                    <span className="facility-feature">Temperature Display</span>
                                    <span className="facility-feature">Adjacent to Sauna</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Hot Plunge / Spa */}
                <div className="facility-card">
                    <div className="facility-card-header">
                        <div className="facility-card-title">
                            <div className="facility-icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#313131" strokeWidth="1.5">
                                    <path d="M12 6c0-2-1-3-3-3s-3 1-3 3c0 1 .5 2 1 3" />
                                    <path d="M18 6c0-2-1-3-3-3s-3 1-3 3c0 1 .5 2 1 3" />
                                    <ellipse cx="12" cy="17" rx="8" ry="5" />
                                </svg>
                            </div>
                            Hot Plunge / Spa
                        </div>
                        <div className="facility-card-toggle">
                            <span className="facility-status available">Available</span>
                            <div className="toggle active">
                                <div className="toggle-knob"></div>
                            </div>
                        </div>
                    </div>
                    <div className="facility-card-body">
                        <div className="facility-grid" style={{ marginBottom: 20 }}>
                            <div className="facility-field span-2">
                                <div className="facility-field-label">Facility Image (for website)</div>
                                <div style={{ display: 'flex', gap: 16, alignItems: 'start' }}>
                                    <div style={{ width: 200, height: 140, borderRadius: 8, background: 'var(--secondary-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed rgba(184, 184, 184, 0.4)' }}>
                                        <ImageIcon width={40} height={40} color="#B8B8B8" strokeWidth={1.5} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <button className="btn btn-secondary btn-small" style={{ marginBottom: 8 }}>Upload Image</button>
                                        <p style={{ fontSize: 11, color: 'var(--accent)' }}>Recommended: 800×600px, JPG or PNG</p>
                                    </div>
                                </div>
                            </div>
                            <div className="facility-field">
                                <div className="facility-field-label">Show on Website</div>
                                <div className="toggle-container">
                                    <div className="toggle active">
                                        <div className="toggle-knob"></div>
                                    </div>
                                    <span className="toggle-label">Yes - Display in listing</span>
                                </div>
                            </div>
                        </div>

                        <div className="facility-grid" style={{ marginBottom: 20 }}>
                            <div className="facility-field span-2">
                                <div className="facility-field-label">Website Display Title</div>
                                <input type="text" className="form-input" defaultValue="Outdoor Hot Spa" placeholder="e.g. Japanese Onsen, Hot Tub" />
                            </div>
                            <div className="facility-field span-3">
                                <div className="facility-field-label">Website Description</div>
                                <textarea className="form-input form-textarea" rows={2} placeholder="Description for public listing..." defaultValue="6-person outdoor spa with hydrotherapy jets, nestled in the garden with views of the surrounding farmland. The perfect finale to your contrast therapy circuit."></textarea>
                            </div>
                        </div>

                        <div className="facility-grid">
                            <div className="facility-field">
                                <div className="facility-field-label">Type</div>
                                <select className="form-input form-select" defaultValue="Hot Tub / Spa">
                                    <option>Hot Tub / Spa</option>
                                    <option>Japanese Ofuro</option>
                                    <option>Outdoor Bath</option>
                                    <option>Magnesium Pool</option>
                                </select>
                            </div>
                            <div className="facility-field">
                                <div className="facility-field-label">Temperature</div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <span className="temp-badge hot">38-40°C</span>
                                </div>
                            </div>
                            <div className="facility-field">
                                <div className="facility-field-label">Capacity</div>
                                <input type="number" className="form-input" defaultValue="6" />
                            </div>
                            <div className="facility-field span-3">
                                <div className="facility-field-label">Features</div>
                                <div className="facility-features">
                                    <span className="facility-feature">Hydrotherapy Jets</span>
                                    <span className="facility-feature">Outdoor Setting</span>
                                    <span className="facility-feature">Garden Views</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Treatment Rooms */}
                <div className="facility-card">
                    <div className="facility-card-header">
                        <div className="facility-card-title">
                            <div className="facility-icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#313131" strokeWidth="1.5">
                                    <rect x="3" y="3" width="18" height="18" rx="2" />
                                    <line x1="3" y1="12" x2="21" y2="12" />
                                </svg>
                            </div>
                            Treatment Rooms
                        </div>
                        <div className="facility-card-toggle">
                            <span className="facility-status available">Available</span>
                            <div className="toggle active">
                                <div className="toggle-knob"></div>
                            </div>
                        </div>
                    </div>
                    <div className="facility-card-body">
                        <div className="facility-grid" style={{ marginBottom: 20 }}>
                            <div className="facility-field span-2">
                                <div className="facility-field-label">Facility Image (for website)</div>
                                <div style={{ display: 'flex', gap: 16, alignItems: 'start' }}>
                                    <div style={{ width: 200, height: 140, borderRadius: 8, background: 'var(--secondary-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed rgba(184, 184, 184, 0.4)' }}>
                                        <ImageIcon width={40} height={40} color="#B8B8B8" strokeWidth={1.5} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <button className="btn btn-secondary btn-small" style={{ marginBottom: 8 }}>Upload Image</button>
                                        <p style={{ fontSize: 11, color: 'var(--accent)' }}>Recommended: 800×600px, JPG or PNG</p>
                                    </div>
                                </div>
                            </div>
                            <div className="facility-field">
                                <div className="facility-field-label">Show on Website</div>
                                <div className="toggle-container">
                                    <div className="toggle">
                                        <div className="toggle-knob"></div>
                                    </div>
                                    <span className="toggle-label">No - Internal use only</span>
                                </div>
                            </div>
                        </div>

                        <div className="facility-grid" style={{ marginBottom: 20 }}>
                            <div className="facility-field span-2">
                                <div className="facility-field-label">Website Display Title</div>
                                <input type="text" className="form-input" defaultValue="Treatment Rooms" placeholder="e.g. Spa Suites, Healing Rooms" />
                            </div>
                            <div className="facility-field span-3">
                                <div className="facility-field-label">Website Description</div>
                                <textarea className="form-input form-textarea" rows={2} placeholder="Description for public listing..." defaultValue="Two dedicated treatment rooms equipped with heated massage tables, ambient lighting, and professional-grade equipment for visiting practitioners."></textarea>
                            </div>
                        </div>

                        <div className="facility-grid">
                            <div className="facility-field">
                                <div className="facility-field-label">Number of Rooms</div>
                                <input type="number" className="form-input" defaultValue="2" />
                            </div>
                            <div className="facility-field">
                                <div className="facility-field-label">Room Type</div>
                                <select className="form-input form-select" defaultValue="Dedicated Treatment Room">
                                    <option>Dedicated Treatment Room</option>
                                    <option>Multipurpose Space</option>
                                    <option>Outdoor Treatment Area</option>
                                </select>
                            </div>
                            <div className="facility-field">
                                <div className="facility-field-label">Couples Treatment</div>
                                <div className="toggle-container">
                                    <div className="toggle active">
                                        <div className="toggle-knob"></div>
                                    </div>
                                    <span className="toggle-label">Yes - 1 room</span>
                                </div>
                            </div>
                            <div className="facility-field span-3">
                                <div className="facility-field-label">Equipment Provided</div>
                                <div className="facility-features">
                                    <span className="facility-feature">Massage Tables (2)</span>
                                    <span className="facility-feature">Heated Tables</span>
                                    <span className="facility-feature">Towels & Linens</span>
                                    <span className="facility-feature">Oils & Lotions</span>
                                    <span className="facility-feature">Ambient Sound System</span>
                                    <span className="facility-feature">Dimmable Lighting</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Red Light Therapy */}
                <div className="facility-card">
                    <div className="facility-card-header">
                        <div className="facility-card-title">
                            <div className="facility-icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#313131" strokeWidth="1.5">
                                    <rect x="4" y="2" width="16" height="20" rx="2" />
                                    <line x1="8" y1="6" x2="16" y2="6" />
                                    <line x1="8" y1="10" x2="16" y2="10" />
                                    <line x1="8" y1="14" x2="16" y2="14" />
                                    <line x1="8" y1="18" x2="16" y2="18" />
                                </svg>
                            </div>
                            Red Light Therapy
                        </div>
                        <div className="facility-card-toggle">
                            <span className="facility-status available">Available</span>
                            <div className="toggle active">
                                <div className="toggle-knob"></div>
                            </div>
                        </div>
                    </div>
                    <div className="facility-card-body">
                        <div className="facility-grid" style={{ marginBottom: 20 }}>
                            <div className="facility-field span-2">
                                <div className="facility-field-label">Facility Image (for website)</div>
                                <div style={{ display: 'flex', gap: 16, alignItems: 'start' }}>
                                    <div style={{ width: 200, height: 140, borderRadius: 8, background: 'var(--secondary-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed rgba(184, 184, 184, 0.4)' }}>
                                        <ImageIcon width={40} height={40} color="#B8B8B8" strokeWidth={1.5} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <button className="btn btn-secondary btn-small" style={{ marginBottom: 8 }}>Upload Image</button>
                                        <p style={{ fontSize: 11, color: 'var(--accent)' }}>Recommended: 800×600px, JPG or PNG</p>
                                    </div>
                                </div>
                            </div>
                            <div className="facility-field">
                                <div className="facility-field-label">Show on Website</div>
                                <div className="toggle-container">
                                    <div className="toggle">
                                        <div className="toggle-knob"></div>
                                    </div>
                                    <span className="toggle-label">No - Internal use only</span>
                                </div>
                            </div>
                        </div>

                        <div className="facility-grid" style={{ marginBottom: 20 }}>
                            <div className="facility-field span-2">
                                <div className="facility-field-label">Website Display Title</div>
                                <input type="text" className="form-input" defaultValue="Red Light Therapy" placeholder="e.g. Photobiomodulation, Light Therapy" />
                            </div>
                            <div className="facility-field span-3">
                                <div className="facility-field-label">Website Description</div>
                                <textarea className="form-input form-textarea" rows={2} placeholder="Description for public listing..." defaultValue="Joovv Elite full-body red light panel available in the treatment room. 10-20 minute sessions recommended before or after massage."></textarea>
                            </div>
                        </div>

                        <div className="facility-grid">
                            <div className="facility-field">
                                <div className="facility-field-label">Device Type</div>
                                <select className="form-input form-select" defaultValue="Full Body Panel">
                                    <option>Handheld Panel</option>
                                    <option>Full Body Panel</option>
                                    <option>Red Light Bed</option>
                                    <option>Red Light Sauna</option>
                                </select>
                            </div>
                            <div className="facility-field">
                                <div className="facility-field-label">Brand / Model</div>
                                <input type="text" className="form-input" defaultValue="Joovv Elite" />
                            </div>
                            <div className="facility-field">
                                <div className="facility-field-label">Session Duration</div>
                                <input type="text" className="form-input" defaultValue="10-20 mins" />
                            </div>
                            <div className="facility-field span-3">
                                <div className="facility-field-label">Wavelengths</div>
                                <div className="facility-features">
                                    <span className="facility-feature">Red (660nm)</span>
                                    <span className="facility-feature">Near-Infrared (850nm)</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Steam Room (Not Available) */}
                <div className="facility-card">
                    <div className="facility-card-header">
                        <div className="facility-card-title">
                            <div className="facility-icon" style={{ opacity: 0.5 }}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#313131" strokeWidth="1.5">
                                    <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                                    <path d="M9 9h.01M15 9h.01" />
                                    <path d="M12 2a10 10 0 1 0 0 20 10 10 0 1 0 0-20z" />
                                </svg>
                            </div>
                            <span style={{ opacity: 0.5 }}>Steam Room</span>
                        </div>
                        <div className="facility-card-toggle">
                            <span className="facility-status unavailable">Not Available</span>
                            <div className="toggle">
                                <div className="toggle-knob"></div>
                            </div>
                        </div>
                    </div>
                    <div className="facility-card-body" style={{ opacity: 0.5 }}>
                        <p style={{ fontSize: 13, color: 'var(--accent)' }}>This facility is not available at this venue. Toggle on to add details.</p>
                    </div>
                </div>

                {/* Float Tank (Not Available) */}
                <div className="facility-card">
                    <div className="facility-card-header">
                        <div className="facility-card-title">
                            <div className="facility-icon" style={{ opacity: 0.5 }}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#313131" strokeWidth="1.5">
                                    <ellipse cx="12" cy="12" rx="10" ry="6" />
                                    <path d="M12 6v12" />
                                </svg>
                            </div>
                            <span style={{ opacity: 0.5 }}>Float Tank / Sensory Deprivation</span>
                        </div>
                        <div className="facility-card-toggle">
                            <span className="facility-status unavailable">Not Available</span>
                            <div className="toggle">
                                <div className="toggle-knob"></div>
                            </div>
                        </div>
                    </div>
                    <div className="facility-card-body" style={{ opacity: 0.5 }}>
                        <p style={{ fontSize: 13, color: 'var(--accent)' }}>This facility is not available at this venue. Toggle on to add details.</p>
                    </div>
                </div>

                {/* Add Facility Button */}
                <button className="add-facility-btn">
                    <Plus className="icon" />
                    Add Another Facility
                </button>

            </div>

            {/* Additional Wellness Facilities Checklist */}
            <section className="form-section" style={{ marginTop: 24 }}>
                <div className="form-section-header">
                    <div>
                        <h3 className="form-section-title">Other Wellness Facilities</h3>
                        <p className="form-section-subtitle">Quick checklist for additional facilities</p>
                    </div>
                </div>
                <div className="form-section-body">
                    <div className="form-grid four-col">
                        <div className="form-group">
                            <label className="form-label">Gym / Fitness Room</label>
                            <div className="toggle-container">
                                <div className="toggle">
                                    <div className="toggle-knob"></div>
                                </div>
                                <span className="toggle-label">No</span>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Yoga Studio</label>
                            <div className="toggle-container">
                                <div className="toggle active">
                                    <div className="toggle-knob"></div>
                                </div>
                                <span className="toggle-label">Yes</span>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Meditation Room</label>
                            <div className="toggle-container">
                                <div className="toggle active">
                                    <div className="toggle-knob"></div>
                                </div>
                                <span className="toggle-label">Yes</span>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Salt Room / Halotherapy</label>
                            <div className="toggle-container">
                                <div className="toggle">
                                    <div className="toggle-knob"></div>
                                </div>
                                <span className="toggle-label">No</span>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Cryotherapy Chamber</label>
                            <div className="toggle-container">
                                <div className="toggle">
                                    <div className="toggle-knob"></div>
                                </div>
                                <span className="toggle-label">No</span>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Hyperbaric Chamber</label>
                            <div className="toggle-container">
                                <div className="toggle">
                                    <div className="toggle-knob"></div>
                                </div>
                                <span className="toggle-label">No</span>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Oxygen Bar</label>
                            <div className="toggle-container">
                                <div className="toggle">
                                    <div className="toggle-knob"></div>
                                </div>
                                <span className="toggle-label">No</span>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Contrast Therapy Setup</label>
                            <div className="toggle-container">
                                <div className="toggle active">
                                    <div className="toggle-knob"></div>
                                </div>
                                <span className="toggle-label">Yes</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Facility Notes */}
            <section className="form-section">
                <div className="form-section-header">
                    <h3 className="form-section-title">Additional Facility Notes</h3>
                </div>
                <div className="form-section-body">
                    <div className="form-group">
                        <label className="form-label">Notes for Guests & Retreat Hosts</label>
                        <textarea className="form-input form-textarea" rows={4} placeholder="Any additional information about wellness facilities..." defaultValue="The property features a complete contrast therapy circuit: infrared sauna → cold plunge → hot spa. Recommended protocol is 3 rounds of 15 min sauna / 2 min cold plunge / 5 min hot spa. Red light therapy panel is located in the treatment room and can be used before or after massage. All facilities are included in venue hire - no additional fees. Towels and robes provided poolside."></textarea>
                    </div>
                </div>
            </section>

        </div>
    );
}
