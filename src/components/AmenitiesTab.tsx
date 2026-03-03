import { Check, UploadCloud, ChevronDown } from 'lucide-react';
import type { Venue } from '../context/VenueContext';

interface AmenitiesTabProps {
    venue: Venue;
    onUpdate?: (updates: Partial<Venue>) => void;
}

export default function AmenitiesTab({ venue: _venue, onUpdate: _onUpdate }: AmenitiesTabProps) {
    return (
        <div className="content-area">

            {/* Tab Images */}
            <section className="form-section">
                <div className="form-section-header">
                    <div>
                        <h3 className="form-section-title">Tab Images</h3>
                        <p className="form-section-subtitle">Hero and decorative images for the Amenities tab on the public listing</p>
                    </div>
                </div>
                <div className="form-section-body">
                    <div className="form-grid">
                        <div className="form-group">
                            <label className="form-label">Amenities Hero Image</label>
                            <div style={{ width: '100%', height: '160px', border: '2px dashed rgba(184, 184, 184, 0.4)', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--secondary-bg)', cursor: 'pointer' }}>
                                <UploadCloud size={32} color="#B8B8B8" strokeWidth={1.5} />
                                <span style={{ fontSize: '12px', color: 'var(--accent)', marginTop: '8px' }}>Click to upload hero image</span>
                                <span style={{ fontSize: '11px', color: 'var(--accent)' }}>Recommended: 1920 x 600px</span>
                            </div>
                            <p className="form-hint" style={{ fontSize: '11px', fontStyle: 'italic', color: 'var(--accent)', marginTop: '6px' }}>This image appears as the large hero banner at the top of the Amenities tab.</p>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Section Break Image</label>
                            <div style={{ width: '100%', height: '160px', border: '2px dashed rgba(184, 184, 184, 0.4)', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--secondary-bg)', cursor: 'pointer' }}>
                                <UploadCloud size={32} color="#B8B8B8" strokeWidth={1.5} />
                                <span style={{ fontSize: '12px', color: 'var(--accent)', marginTop: '8px' }}>Click to upload break image</span>
                                <span style={{ fontSize: '11px', color: 'var(--accent)' }}>Recommended: 1920 x 400px</span>
                            </div>
                            <p className="form-hint" style={{ fontSize: '11px', fontStyle: 'italic', color: 'var(--accent)', marginTop: '6px' }}>Decorative image displayed between amenity sections on the public listing.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Kitchen & Dining */}
            <section className="form-section">
                <div className="form-section-header">
                    <div>
                        <h3 className="form-section-title">Kitchen & Dining</h3>
                        <p className="form-section-subtitle">Food preparation and dining facilities</p>
                    </div>
                    <span style={{ fontSize: '12px', color: 'var(--success)', fontWeight: 500 }}>12 of 15 selected</span>
                </div>
                <div className="form-section-body">
                    <div className="amenity-grid">
                        <div className="amenity-item checked">
                            <div className="amenity-checkbox">
                                <Check size={14} color="white" strokeWidth={3} />
                            </div>
                            <span className="amenity-label">Commercial Kitchen</span>
                        </div>
                        <div className="amenity-item checked">
                            <div className="amenity-checkbox">
                                <Check size={14} color="white" strokeWidth={3} />
                            </div>
                            <span className="amenity-label">Domestic Kitchen</span>
                        </div>
                        <div className="amenity-item checked">
                            <div className="amenity-checkbox">
                                <Check size={14} color="white" strokeWidth={3} />
                            </div>
                            <span className="amenity-label">Full-size Refrigerator</span>
                        </div>
                        <div className="amenity-item checked">
                            <div className="amenity-checkbox">
                                <Check size={14} color="white" strokeWidth={3} />
                            </div>
                            <span className="amenity-label">Walk-in Pantry</span>
                        </div>
                        <div className="amenity-item checked">
                            <div className="amenity-checkbox">
                                <Check size={14} color="white" strokeWidth={3} />
                            </div>
                            <span className="amenity-label">Dishwasher</span>
                        </div>
                        <div className="amenity-item checked">
                            <div className="amenity-checkbox">
                                <Check size={14} color="white" strokeWidth={3} />
                            </div>
                            <span className="amenity-label">Oven / Stove</span>
                        </div>
                        <div className="amenity-item checked">
                            <div className="amenity-checkbox">
                                <Check size={14} color="white" strokeWidth={3} />
                            </div>
                            <span className="amenity-label">Microwave</span>
                        </div>
                        <div className="amenity-item checked">
                            <div className="amenity-checkbox">
                                <Check size={14} color="white" strokeWidth={3} />
                            </div>
                            <span className="amenity-label">Coffee Machine</span>
                        </div>
                        <div className="amenity-item checked">
                            <div className="amenity-checkbox">
                                <Check size={14} color="white" strokeWidth={3} />
                            </div>
                            <span className="amenity-label">Blender / Vitamix</span>
                        </div>
                        <div className="amenity-item checked">
                            <div className="amenity-checkbox">
                                <Check size={14} color="white" strokeWidth={3} />
                            </div>
                            <span className="amenity-label">Formal Dining Room</span>
                        </div>
                        <div className="amenity-item checked">
                            <div className="amenity-checkbox">
                                <Check size={14} color="white" strokeWidth={3} />
                            </div>
                            <span className="amenity-label">Outdoor Dining Area</span>
                        </div>
                        <div className="amenity-item">
                            <div className="amenity-checkbox"></div>
                            <span className="amenity-label">BBQ / Grill</span>
                        </div>
                        <div className="amenity-item">
                            <div className="amenity-checkbox"></div>
                            <span className="amenity-label">Pizza Oven</span>
                        </div>
                        <div className="amenity-item">
                            <div className="amenity-checkbox"></div>
                            <span className="amenity-label">Breakfast Bar</span>
                        </div>
                        <div className="amenity-item checked">
                            <div className="amenity-checkbox">
                                <Check size={14} color="white" strokeWidth={3} />
                            </div>
                            <span className="amenity-label">Cookware & Utensils</span>
                        </div>
                    </div>
                    <div className="form-grid" style={{ marginTop: '24px' }}>
                        <div className="form-group">
                            <label className="form-label">Dining Capacity (Indoor)</label>
                            <input type="number" className="form-input" defaultValue="14" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Dining Capacity (Outdoor)</label>
                            <input type="number" className="form-input" defaultValue="20" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Living & Entertainment */}
            <section className="form-section">
                <div className="form-section-header">
                    <div>
                        <h3 className="form-section-title">Living & Entertainment</h3>
                        <p className="form-section-subtitle">Common areas and entertainment options</p>
                    </div>
                    <span style={{ fontSize: '12px', color: 'var(--success)', fontWeight: 500 }}>8 of 12 selected</span>
                </div>
                <div className="form-section-body">
                    <div className="amenity-grid">
                        <div className="amenity-item checked">
                            <div className="amenity-checkbox">
                                <Check size={14} color="white" strokeWidth={3} />
                            </div>
                            <span className="amenity-label">Living Room</span>
                        </div>
                        <div className="amenity-item checked">
                            <div className="amenity-checkbox">
                                <Check size={14} color="white" strokeWidth={3} />
                            </div>
                            <span className="amenity-label">Fireplace</span>
                        </div>
                        <div className="amenity-item checked">
                            <div className="amenity-checkbox">
                                <Check size={14} color="white" strokeWidth={3} />
                            </div>
                            <span className="amenity-label">Smart TV</span>
                        </div>
                        <div className="amenity-item">
                            <div className="amenity-checkbox"></div>
                            <span className="amenity-label">Streaming Services</span>
                        </div>
                        <div className="amenity-item checked">
                            <div className="amenity-checkbox">
                                <Check size={14} color="white" strokeWidth={3} />
                            </div>
                            <span className="amenity-label">Sound System</span>
                        </div>
                        <div className="amenity-item checked">
                            <div className="amenity-checkbox">
                                <Check size={14} color="white" strokeWidth={3} />
                            </div>
                            <span className="amenity-label">Library / Reading Area</span>
                        </div>
                        <div className="amenity-item">
                            <div className="amenity-checkbox"></div>
                            <span className="amenity-label">Games Room</span>
                        </div>
                        <div className="amenity-item">
                            <div className="amenity-checkbox"></div>
                            <span className="amenity-label">Board Games</span>
                        </div>
                        <div className="amenity-item checked">
                            <div className="amenity-checkbox">
                                <Check size={14} color="white" strokeWidth={3} />
                            </div>
                            <span className="amenity-label">Piano / Musical Instruments</span>
                        </div>
                        <div className="amenity-item checked">
                            <div className="amenity-checkbox">
                                <Check size={14} color="white" strokeWidth={3} />
                            </div>
                            <span className="amenity-label">Projector / Screen</span>
                        </div>
                        <div className="amenity-item">
                            <div className="amenity-checkbox"></div>
                            <span className="amenity-label">Home Cinema</span>
                        </div>
                        <div className="amenity-item">
                            <div className="amenity-checkbox"></div>
                            <span className="amenity-label">Gym Equipment</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Technology & Connectivity */}
            <section className="form-section">
                <div className="form-section-header">
                    <div>
                        <h3 className="form-section-title">Technology & Connectivity</h3>
                        <p className="form-section-subtitle">Internet, power, and tech amenities</p>
                    </div>
                    <span style={{ fontSize: '12px', color: 'var(--success)', fontWeight: 500 }}>5 of 7 selected</span>
                </div>
                <div className="form-section-body">
                    <div className="amenity-grid">
                        <div className="amenity-item checked">
                            <div className="amenity-checkbox">
                                <Check size={14} color="white" strokeWidth={3} />
                            </div>
                            <span className="amenity-label">WiFi</span>
                        </div>
                        <div className="amenity-item checked">
                            <div className="amenity-checkbox">
                                <Check size={14} color="white" strokeWidth={3} />
                            </div>
                            <span className="amenity-label">High-Speed Internet</span>
                        </div>
                        <div className="amenity-item">
                            <div className="amenity-checkbox"></div>
                            <span className="amenity-label">Starlink / Satellite</span>
                        </div>
                        <div className="amenity-item checked">
                            <div className="amenity-checkbox">
                                <Check size={14} color="white" strokeWidth={3} />
                            </div>
                            <span className="amenity-label">Mobile Signal</span>
                        </div>
                        <div className="amenity-item checked">
                            <div className="amenity-checkbox">
                                <Check size={14} color="white" strokeWidth={3} />
                            </div>
                            <span className="amenity-label">EV Charging</span>
                        </div>
                        <div className="amenity-item checked">
                            <div className="amenity-checkbox">
                                <Check size={14} color="white" strokeWidth={3} />
                            </div>
                            <span className="amenity-label">Printer / Scanner</span>
                        </div>
                        <div className="amenity-item">
                            <div className="amenity-checkbox"></div>
                            <span className="amenity-label">Dedicated Office Space</span>
                        </div>
                    </div>
                    <div className="form-grid" style={{ marginTop: '24px' }}>
                        <div className="form-group">
                            <label className="form-label">WiFi Speed (Mbps)</label>
                            <input type="text" className="form-input" defaultValue="100+ Mbps" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">WiFi Coverage</label>
                            <div style={{ position: 'relative' }}>
                                <select className="form-input" style={{ width: '100%', appearance: 'none' }} defaultValue="Whole Property">
                                    <option value="Whole Property">Whole Property</option>
                                    <option>Main Building Only</option>
                                    <option>Common Areas Only</option>
                                </select>
                                <ChevronDown size={16} color="#B8B8B8" style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Outdoor & Grounds */}
            <section className="form-section">
                <div className="form-section-header">
                    <div>
                        <h3 className="form-section-title">Outdoor & Grounds</h3>
                        <p className="form-section-subtitle">Outdoor spaces and property features</p>
                    </div>
                    <span style={{ fontSize: '12px', color: 'var(--success)', fontWeight: 500 }}>10 of 14 selected</span>
                </div>
                <div className="form-section-body">
                    <div className="amenity-grid">
                        <div className="amenity-item checked">
                            <div className="amenity-checkbox">
                                <Check size={14} color="white" strokeWidth={3} />
                            </div>
                            <span className="amenity-label">Swimming Pool</span>
                        </div>
                        <div className="amenity-item checked">
                            <div className="amenity-checkbox">
                                <Check size={14} color="white" strokeWidth={3} />
                            </div>
                            <span className="amenity-label">Heated Pool</span>
                        </div>
                        <div className="amenity-item">
                            <div className="amenity-checkbox"></div>
                            <span className="amenity-label">Indoor Pool</span>
                        </div>
                        <div className="amenity-item checked">
                            <div className="amenity-checkbox">
                                <Check size={14} color="white" strokeWidth={3} />
                            </div>
                            <span className="amenity-label">Garden / Grounds</span>
                        </div>
                        <div className="amenity-item checked">
                            <div className="amenity-checkbox">
                                <Check size={14} color="white" strokeWidth={3} />
                            </div>
                            <span className="amenity-label">Outdoor Seating</span>
                        </div>
                        <div className="amenity-item checked">
                            <div className="amenity-checkbox">
                                <Check size={14} color="white" strokeWidth={3} />
                            </div>
                            <span className="amenity-label">Covered Verandah / Patio</span>
                        </div>
                        <div className="amenity-item checked">
                            <div className="amenity-checkbox">
                                <Check size={14} color="white" strokeWidth={3} />
                            </div>
                            <span className="amenity-label">Fire Pit</span>
                        </div>
                        <div className="amenity-item">
                            <div className="amenity-checkbox"></div>
                            <span className="amenity-label">Tennis Court</span>
                        </div>
                        <div className="amenity-item">
                            <div className="amenity-checkbox"></div>
                            <span className="amenity-label">Golf Course Access</span>
                        </div>
                        <div className="amenity-item checked">
                            <div className="amenity-checkbox">
                                <Check size={14} color="white" strokeWidth={3} />
                            </div>
                            <span className="amenity-label">Farm Animals</span>
                        </div>
                        <div className="amenity-item checked">
                            <div className="amenity-checkbox">
                                <Check size={14} color="white" strokeWidth={3} />
                            </div>
                            <span className="amenity-label">Orchard / Produce Garden</span>
                        </div>
                        <div className="amenity-item checked">
                            <div className="amenity-checkbox">
                                <Check size={14} color="white" strokeWidth={3} />
                            </div>
                            <span className="amenity-label">Walking Trails</span>
                        </div>
                        <div className="amenity-item">
                            <div className="amenity-checkbox"></div>
                            <span className="amenity-label">Beach Access</span>
                        </div>
                        <div className="amenity-item">
                            <div className="amenity-checkbox"></div>
                            <span className="amenity-label">Lake / River Access</span>
                        </div>
                    </div>
                    <div className="form-grid" style={{ marginTop: '24px' }}>
                        <div className="form-group">
                            <label className="form-label">Property Size (acres/hectares)</label>
                            <input type="text" className="form-input" defaultValue="45 acres" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Pool Type</label>
                            <div style={{ position: 'relative' }}>
                                <select className="form-input" style={{ width: '100%', appearance: 'none' }} defaultValue="Heated Outdoor">
                                    <option value="Heated Outdoor">Heated Outdoor</option>
                                    <option>Unheated Outdoor</option>
                                    <option>Indoor</option>
                                    <option>Natural / Dam</option>
                                </select>
                                <ChevronDown size={16} color="#B8B8B8" style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Parking & Transport */}
            <section className="form-section">
                <div className="form-section-header">
                    <div>
                        <h3 className="form-section-title">Parking & Transport</h3>
                        <p className="form-section-subtitle">Vehicle access and parking facilities</p>
                    </div>
                    <span style={{ fontSize: '12px', color: 'var(--success)', fontWeight: 500 }}>4 of 6 selected</span>
                </div>
                <div className="form-section-body">
                    <div className="amenity-grid">
                        <div className="amenity-item checked">
                            <div className="amenity-checkbox">
                                <Check size={14} color="white" strokeWidth={3} />
                            </div>
                            <span className="amenity-label">Free Parking</span>
                        </div>
                        <div className="amenity-item checked">
                            <div className="amenity-checkbox">
                                <Check size={14} color="white" strokeWidth={3} />
                            </div>
                            <span className="amenity-label">On-site Parking</span>
                        </div>
                        <div className="amenity-item">
                            <div className="amenity-checkbox"></div>
                            <span className="amenity-label">Covered / Garage Parking</span>
                        </div>
                        <div className="amenity-item checked">
                            <div className="amenity-checkbox">
                                <Check size={14} color="white" strokeWidth={3} />
                            </div>
                            <span className="amenity-label">Bus / Coach Access</span>
                        </div>
                        <div className="amenity-item checked">
                            <div className="amenity-checkbox">
                                <Check size={14} color="white" strokeWidth={3} />
                            </div>
                            <span className="amenity-label">Airport Transfers Available</span>
                        </div>
                        <div className="amenity-item">
                            <div className="amenity-checkbox"></div>
                            <span className="amenity-label">Helipad</span>
                        </div>
                    </div>
                    <div className="form-grid" style={{ marginTop: '24px' }}>
                        <div className="form-group">
                            <label className="form-label">Parking Spaces</label>
                            <input type="number" className="form-input" defaultValue="15" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Distance to Nearest Town</label>
                            <input type="text" className="form-input" defaultValue="5 min to Berry village" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Laundry & Housekeeping */}
            <section className="form-section">
                <div className="form-section-header">
                    <div>
                        <h3 className="form-section-title">Laundry & Housekeeping</h3>
                        <p className="form-section-subtitle">Cleaning and laundry facilities</p>
                    </div>
                    <span style={{ fontSize: '12px', color: 'var(--success)', fontWeight: 500 }}>5 of 7 selected</span>
                </div>
                <div className="form-section-body">
                    <div className="amenity-grid">
                        <div className="amenity-item checked">
                            <div className="amenity-checkbox">
                                <Check size={14} color="white" strokeWidth={3} />
                            </div>
                            <span className="amenity-label">Washing Machine</span>
                        </div>
                        <div className="amenity-item checked">
                            <div className="amenity-checkbox">
                                <Check size={14} color="white" strokeWidth={3} />
                            </div>
                            <span className="amenity-label">Dryer</span>
                        </div>
                        <div className="amenity-item checked">
                            <div className="amenity-checkbox">
                                <Check size={14} color="white" strokeWidth={3} />
                            </div>
                            <span className="amenity-label">Iron & Ironing Board</span>
                        </div>
                        <div className="amenity-item checked">
                            <div className="amenity-checkbox">
                                <Check size={14} color="white" strokeWidth={3} />
                            </div>
                            <span className="amenity-label">Linens Provided</span>
                        </div>
                        <div className="amenity-item checked">
                            <div className="amenity-checkbox">
                                <Check size={14} color="white" strokeWidth={3} />
                            </div>
                            <span className="amenity-label">Towels Provided</span>
                        </div>
                        <div className="amenity-item">
                            <div className="amenity-checkbox"></div>
                            <span className="amenity-label">Daily Housekeeping</span>
                        </div>
                        <div className="amenity-item">
                            <div className="amenity-checkbox"></div>
                            <span className="amenity-label">Laundry Service</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Climate & Comfort */}
            <section className="form-section">
                <div className="form-section-header">
                    <div>
                        <h3 className="form-section-title">Climate & Comfort</h3>
                        <p className="form-section-subtitle">Heating, cooling, and comfort features</p>
                    </div>
                    <span style={{ fontSize: '12px', color: 'var(--success)', fontWeight: 500 }}>5 of 6 selected</span>
                </div>
                <div className="form-section-body">
                    <div className="amenity-grid">
                        <div className="amenity-item checked">
                            <div className="amenity-checkbox">
                                <Check size={14} color="white" strokeWidth={3} />
                            </div>
                            <span className="amenity-label">Air Conditioning</span>
                        </div>
                        <div className="amenity-item checked">
                            <div className="amenity-checkbox">
                                <Check size={14} color="white" strokeWidth={3} />
                            </div>
                            <span className="amenity-label">Central Heating</span>
                        </div>
                        <div className="amenity-item checked">
                            <div className="amenity-checkbox">
                                <Check size={14} color="white" strokeWidth={3} />
                            </div>
                            <span className="amenity-label">Fireplace / Wood Heater</span>
                        </div>
                        <div className="amenity-item checked">
                            <div className="amenity-checkbox">
                                <Check size={14} color="white" strokeWidth={3} />
                            </div>
                            <span className="amenity-label">Ceiling Fans</span>
                        </div>
                        <div className="amenity-item checked">
                            <div className="amenity-checkbox">
                                <Check size={14} color="white" strokeWidth={3} />
                            </div>
                            <span className="amenity-label">Underfloor Heating</span>
                        </div>
                        <div className="amenity-item">
                            <div className="amenity-checkbox"></div>
                            <span className="amenity-label">Heated Bathroom Floors</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Safety & Security */}
            <section className="form-section">
                <div className="form-section-header">
                    <div>
                        <h3 className="form-section-title">Safety & Security</h3>
                        <p className="form-section-subtitle">Safety features and security measures</p>
                    </div>
                    <span style={{ fontSize: '12px', color: 'var(--success)', fontWeight: 500 }}>6 of 8 selected</span>
                </div>
                <div className="form-section-body">
                    <div className="amenity-grid">
                        <div className="amenity-item checked">
                            <div className="amenity-checkbox">
                                <Check size={14} color="white" strokeWidth={3} />
                            </div>
                            <span className="amenity-label">Smoke Detectors</span>
                        </div>
                        <div className="amenity-item checked">
                            <div className="amenity-checkbox">
                                <Check size={14} color="white" strokeWidth={3} />
                            </div>
                            <span className="amenity-label">Carbon Monoxide Detector</span>
                        </div>
                        <div className="amenity-item checked">
                            <div className="amenity-checkbox">
                                <Check size={14} color="white" strokeWidth={3} />
                            </div>
                            <span className="amenity-label">Fire Extinguisher</span>
                        </div>
                        <div className="amenity-item checked">
                            <div className="amenity-checkbox">
                                <Check size={14} color="white" strokeWidth={3} />
                            </div>
                            <span className="amenity-label">First Aid Kit</span>
                        </div>
                        <div className="amenity-item checked">
                            <div className="amenity-checkbox">
                                <Check size={14} color="white" strokeWidth={3} />
                            </div>
                            <span className="amenity-label">Security System</span>
                        </div>
                        <div className="amenity-item checked">
                            <div className="amenity-checkbox">
                                <Check size={14} color="white" strokeWidth={3} />
                            </div>
                            <span className="amenity-label">Gated Property</span>
                        </div>
                        <div className="amenity-item">
                            <div className="amenity-checkbox"></div>
                            <span className="amenity-label">CCTV</span>
                        </div>
                        <div className="amenity-item">
                            <div className="amenity-checkbox"></div>
                            <span className="amenity-label">On-site Security</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Good to Know */}
            <section className="form-section">
                <div className="form-section-header">
                    <div>
                        <h3 className="form-section-title">Good to Know</h3>
                        <p className="form-section-subtitle">Policies and practical information displayed on the Amenities tab</p>
                    </div>
                </div>
                <div className="form-section-body">
                    <h4 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '16px', fontWeight: 600, marginBottom: '16px', color: 'var(--text)' }}>Connectivity</h4>
                    <div className="form-grid">
                        <div className="form-group">
                            <label className="form-label">WiFi Details</label>
                            <textarea className="form-input form-textarea" rows={2} placeholder="Describe WiFi availability and any recommendations..." defaultValue="Available throughout. Consider phone-free policy for retreats." />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Mobile Coverage</label>
                            <textarea className="form-input form-textarea" rows={2} placeholder="Describe mobile reception at the venue..." defaultValue="Limited. Vodafone has best reception." />
                        </div>
                    </div>

                    <h4 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '16px', fontWeight: 600, margin: '24px 0 16px 0', color: 'var(--text)' }}>Accessibility</h4>
                    <div className="form-grid">
                        <div className="form-group">
                            <label className="form-label">Wheelchair Access</label>
                            <textarea className="form-input form-textarea" rows={2} placeholder="Describe wheelchair accessibility..." defaultValue="Main shala and 2 ground-floor rooms are accessible." />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Dietary Capability</label>
                            <textarea className="form-input form-textarea" rows={2} placeholder="Describe kitchen dietary capabilities..." defaultValue="Kitchen equipped for all dietary requirements." />
                            <p className="form-hint" style={{ fontSize: '11px', fontStyle: 'italic', color: 'var(--accent)', marginTop: '6px' }}>This may also pull from Dining & Catering if more detail is provided there.</p>
                        </div>
                    </div>

                    <h4 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '16px', fontWeight: 600, margin: '24px 0 16px 0', color: 'var(--text)' }}>Environment</h4>
                    <div className="form-grid">
                        <div className="form-group">
                            <label className="form-label">Smoking Policy</label>
                            <textarea className="form-input form-textarea" rows={2} placeholder="Describe smoking policy..." defaultValue="Designated outdoor area only." />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Pets Policy</label>
                            <textarea className="form-input form-textarea" rows={2} placeholder="Describe pets policy..." defaultValue="Service animals only." />
                        </div>
                    </div>
                </div>
            </section>

            {/* Additional Amenities Notes */}
            <section className="form-section">
                <div className="form-section-header">
                    <h3 className="form-section-title">Additional Amenities Notes</h3>
                </div>
                <div className="form-section-body">
                    <div className="form-group">
                        <label className="form-label">Notes</label>
                        <textarea className="form-input form-textarea" placeholder="Any additional amenities or special features..." defaultValue="Premium Smeg appliances throughout the commercial kitchen. The property features a working olive grove and guests are welcome to harvest seasonal produce from the kitchen garden. Multiple outdoor seating areas including a covered pergola with outdoor heaters for cooler evenings. Pool is solar heated and maintained at 28°C year-round." />
                    </div>
                </div>
            </section>

        </div>
    );
}
