import { useState, useRef, useEffect } from 'react';
import { Plus } from 'lucide-react';
import type { Venue } from '../../context/VenueContext';

interface Props {
    venue: Venue;
    onUpdate: (updates: Partial<Venue>) => void;
}

export default function WellnessPricingTab({ venue, onUpdate }: Props) {
    // Packages Tab Form State
    const [showPackages, setShowPackages] = useState(true);
    const [packageSectionLabel, setPackageSectionLabel] = useState('Curated Packages');
    const [packageSectionSubtitle, setPackageSectionSubtitle] = useState('Complete wellness experiences designed for transformation');
    const [packageIntro, setPackageIntro] = useState('Our packages combine accommodation, treatments, and experiences into seamless wellness journeys. Each has been thoughtfully curated to provide deep restoration and lasting benefits.');

    // Packages State
    const [packages, setPackages] = useState([
        {
            id: 1,
            type: 'Day Package',
            name: 'Restore & Renew',
            active: true,
            description: 'A half-day escape featuring thermal circuit access, signature massage, and organic lunch.',
            includes: '2hr thermal, 60min massage, lunch, tea',
            price: '$299',
            per: 'person'
        },
        {
            id: 2,
            type: 'Overnight Package',
            name: 'Weekend Wellness',
            active: true,
            description: 'Two nights of complete immersion including accommodation, daily treatments, and all meals.',
            includes: '2 nights, breakfast/dinner, 90min massage, facial, thermal',
            price: '$1,250',
            per: 'person'
        }
    ]);

    // Operational Data State
    const [dayPassAvailable, setDayPassAvailable] = useState(venue.dayPassAvailable ?? true);
    const [dayPassPrice, setDayPassPrice] = useState(venue.dayPassPrice || '$89');
    const [dayPassDuration, setDayPassDuration] = useState(venue.dayPassDuration || '2 hours');
    const [dayPassIncludes, setDayPassIncludes] = useState(venue.dayPassIncludes || 'Thermal circuit access, robes & slippers, herbal tea, locker');

    const [membershipsAvailable, setMembershipsAvailable] = useState(venue.membershipsAvailable ?? true);
    const [membershipDetails, setMembershipDetails] = useState(venue.membershipDetails || 'Monthly membership options include: Essential ($150/month - 1x 60min massage), Premium ($280/month - 2x 60min treatments), and VIP ($450/month - 4x treatments + 10% retail discount). All memberships include priority booking and complimentary day pass access.');

    const [vouchersAvailable, setVouchersAvailable] = useState(venue.vouchersAvailable ?? true);
    const [voucherValidity, setVoucherValidity] = useState(venue.voucherValidity || '12 months');

    const [advanceBooking, setAdvanceBooking] = useState(venue.advanceBooking || 'Recommended');
    const [minNotice, setMinNotice] = useState(venue.minNotice || '24 hours');
    const [maxAdvance, setMaxAdvance] = useState(venue.maxAdvance || '3 months');
    const [groupBookings, setGroupBookings] = useState(venue.groupBookings ?? true);
    const [maxGroupSize, setMaxGroupSize] = useState(venue.maxGroupSize || '6');
    const [couplesBookings, setCouplesBookings] = useState(venue.couplesBookings ?? true);

    const [depositRequired, setDepositRequired] = useState(venue.depositRequired ?? false);
    const [depositAmount, setDepositAmount] = useState(venue.depositAmount || 'N/A');
    const [paymentDue, setPaymentDue] = useState(venue.paymentDue || 'At time of service');

    const [freeCancellation, setFreeCancellation] = useState(venue.freeCancellationPeriod || '24 hours notice');
    const [lateFee, setLateFee] = useState(venue.lateFee || '50% of service');
    const [noShowFee, setNoShowFee] = useState(venue.noShowFee || '100% of service');
    const [cancellationText, setCancellationText] = useState(venue.cancellationText || 'Cancellations made more than 24 hours before your appointment are free of charge. Late cancellations (less than 24 hours) incur a 50% fee. No-shows are charged at 100%. We appreciate your understanding as this allows us to offer the space to other guests.');

    const [onlineBooking, setOnlineBooking] = useState(venue.instantBooking ?? true);
    const [bookingPlatform, setBookingPlatform] = useState(venue.bookingPlatform || 'External (link out)');
    const [bookingUrl, setBookingUrl] = useState(venue.bookingUrl || '');
    const [calendarSync, setCalendarSync] = useState(venue.calendarSync ?? false);
    const [autoConfirm, setAutoConfirm] = useState(venue.autoConfirm ?? true);
    const [reminders, setReminders] = useState(venue.reminders || '24hr before');

    const [pricingNotes, setPricingNotes] = useState(venue.pricingNotes || 'Happy hour pricing available Mon-Thu 10am-2pm (15% off all services). Corporate rates available for group bookings of 4+. Loyalty program: 10th treatment free.');

    // Batch-save all pricing/booking fields whenever any state changes
    const isMount = useRef(true);
    useEffect(() => {
        if (isMount.current) { isMount.current = false; return; }
        onUpdate({
            dayPassAvailable,
            dayPassPrice,
            dayPassDuration,
            dayPassIncludes,
            membershipsAvailable,
            membershipDetails,
            vouchersAvailable,
            voucherValidity,
            advanceBooking,
            minNotice,
            maxAdvance,
            groupBookings,
            maxGroupSize,
            couplesBookings,
            depositRequired,
            depositAmount,
            paymentDue,
            freeCancellationPeriod: freeCancellation,
            lateFee,
            noShowFee,
            cancellationText,
            instantBooking: onlineBooking,
            bookingPlatform,
            bookingUrl,
            calendarSync,
            autoConfirm,
            reminders,
            pricingNotes,
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dayPassAvailable, dayPassPrice, dayPassDuration, dayPassIncludes,
        membershipsAvailable, membershipDetails, vouchersAvailable, voucherValidity,
        advanceBooking, minNotice, maxAdvance, groupBookings, maxGroupSize, couplesBookings,
        depositRequired, depositAmount, paymentDue, freeCancellation, lateFee, noShowFee,
        cancellationText, onlineBooking, bookingPlatform, bookingUrl, calendarSync,
        autoConfirm, reminders, pricingNotes]);

    const togglePackageActive = (id: number) => {
        setPackages(packages.map(pkg => pkg.id === id ? { ...pkg, active: !pkg.active } : pkg));
    };

    return (
        <div className="wpt-container">
            {/* Packages Tab Toggle */}
            <section className="form-section">
                <div className="form-section-header">
                    <div>
                        <h3 className="form-section-title">Packages Tab</h3>
                        <p className="form-section-subtitle">Enable to show a dedicated Packages tab on your public listing</p>
                    </div>
                </div>
                <div className="form-section-body">
                    <div className="form-grid">
                        <div className="form-group">
                            <label className="form-label">Show Packages Tab</label>
                            <div className="toggle-container" onClick={() => setShowPackages(!showPackages)}>
                                <div className={`toggle ${showPackages ? 'active' : ''}`}>
                                    <div className="toggle-knob"></div>
                                </div>
                                <span className="toggle-label">{showPackages ? 'Yes - Display Packages tab' : 'No - Hidden'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Packages Tab Header */}
            <section className="form-section">
                <div className="form-section-header">
                    <div>
                        <h3 className="form-section-title">Packages Tab Content</h3>
                        <p className="form-section-subtitle">Header content for the Packages tab on your public listing</p>
                    </div>
                </div>
                <div className="form-section-body">
                    <div className="form-grid">
                        <div className="form-group">
                            <label className="form-label">Section Label</label>
                            <input
                                type="text"
                                className="form-input"
                                value={packageSectionLabel}
                                onChange={e => setPackageSectionLabel(e.target.value)}
                                placeholder="e.g. Curated Packages, Wellness Journeys"
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Section Subtitle</label>
                            <input
                                type="text"
                                className="form-input"
                                value={packageSectionSubtitle}
                                onChange={e => setPackageSectionSubtitle(e.target.value)}
                                placeholder="Brief tagline..."
                            />
                        </div>
                        <div className="form-group full-width">
                            <label className="form-label">Intro Paragraph</label>
                            <textarea
                                className="form-input form-textarea"
                                rows={2}
                                value={packageIntro}
                                onChange={e => setPackageIntro(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Wellness Packages */}
            <section className="form-section">
                <div className="form-section-header">
                    <div>
                        <h3 className="form-section-title">Wellness Packages</h3>
                        <p className="form-section-subtitle">Curated experiences combining multiple services</p>
                    </div>
                    <button className="btn btn-secondary btn-small">
                        <Plus className="icon icon-small" />
                        Add Package
                    </button>
                </div>
                <div className="form-section-body">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                        {packages.map((pkg) => (
                            <div key={pkg.id} style={{ background: 'var(--secondary-bg)', borderRadius: '8px', padding: '16px', border: '1px solid rgba(184,184,184,0.2)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                                    <div>
                                        <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--accent)', display: 'block', marginBottom: '4px' }}>{pkg.type}</span>
                                        <input
                                            type="text"
                                            className="form-input"
                                            style={{ fontSize: '14px', fontWeight: 500, padding: '4px 8px', border: 'none', background: 'transparent' }}
                                            value={pkg.name}
                                            onChange={(e) => {
                                                const newName = e.target.value;
                                                setPackages(packages.map(p => p.id === pkg.id ? { ...p, name: newName } : p));
                                            }}
                                        />
                                    </div>
                                    <div className="toggle-container" onClick={() => togglePackageActive(pkg.id)}>
                                        <div className={`toggle toggle-small ${pkg.active ? 'active' : ''}`} style={{ width: '32px', height: '18px' }}>
                                            <div className="toggle-knob" style={{ width: '14px', height: '14px' }}></div>
                                        </div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <div style={{ width: '64px', height: '64px', borderRadius: '6px', background: 'var(--white)', border: '1px dashed rgba(184,184,184,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#B8B8B8" strokeWidth="1.5">
                                            <rect x="3" y="3" width="18" height="18" rx="2" />
                                            <circle cx="8.5" cy="8.5" r="1.5" />
                                            <path d="M21 15l-5-5L5 21" />
                                        </svg>
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <textarea
                                            className="form-input form-textarea"
                                            style={{ fontSize: '11px', padding: '6px 8px', minHeight: '40px', resize: 'none', marginBottom: '8px' }}
                                            value={pkg.description}
                                            onChange={(e) => {
                                                const newDesc = e.target.value;
                                                setPackages(packages.map(p => p.id === pkg.id ? { ...p, description: newDesc } : p));
                                            }}
                                        />
                                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                            <span style={{ fontSize: '10px', color: 'var(--accent)' }}>Includes:</span>
                                            <input
                                                type="text"
                                                className="form-input"
                                                style={{ flex: 1, fontSize: '10px', padding: '4px 6px' }}
                                                value={pkg.includes}
                                                onChange={(e) => {
                                                    const newInc = e.target.value;
                                                    setPackages(packages.map(p => p.id === pkg.id ? { ...p, includes: newInc } : p));
                                                }}
                                            />
                                        </div>
                                        <div style={{ display: 'flex', gap: '12px', marginTop: '8px', alignItems: 'center' }}>
                                            <div>
                                                <span style={{ fontSize: '10px', color: 'var(--accent)' }}>Price</span>
                                                <input
                                                    type="text"
                                                    className="form-input"
                                                    style={{ width: '80px', fontSize: '12px', padding: '4px 6px' }}
                                                    value={pkg.price}
                                                    onChange={(e) => {
                                                        const newPrice = e.target.value;
                                                        setPackages(packages.map(p => p.id === pkg.id ? { ...p, price: newPrice } : p));
                                                    }}
                                                />
                                            </div>
                                            <div>
                                                <span style={{ fontSize: '10px', color: 'var(--accent)' }}>Per</span>
                                                <select
                                                    className="form-input form-select"
                                                    style={{ fontSize: '11px', padding: '4px 6px' }}
                                                    value={pkg.per}
                                                    onChange={(e) => {
                                                        const newPer = e.target.value;
                                                        setPackages(packages.map(p => p.id === pkg.id ? { ...p, per: newPer } : p));
                                                    }}
                                                >
                                                    <option value="person">person</option>
                                                    <option value="couple">couple</option>
                                                    <option value="package">package</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button style={{ width: '100%', padding: '12px', border: '1px dashed rgba(184,184,184,0.4)', borderRadius: '8px', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'var(--accent)', fontSize: '12px', marginTop: '12px' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                        Add Package
                    </button>
                </div>
            </section>

            {/* Day Pass & Facility Access */}
            <section className="form-section">
                <div className="form-section-header">
                    <div>
                        <h3 className="form-section-title">Day Pass & Facility Access</h3>
                        <p className="form-section-subtitle">Standalone facility access pricing (not treatment-based)</p>
                    </div>
                </div>
                <div className="form-section-body">
                    <div className="form-grid">
                        <div className="form-group">
                            <label className="form-label">Day Pass Available</label>
                            <div className="toggle-container" onClick={() => setDayPassAvailable(!dayPassAvailable)}>
                                <div className={`toggle ${dayPassAvailable ? 'active' : ''}`}>
                                    <div className="toggle-knob"></div>
                                </div>
                                <span className="toggle-label">{dayPassAvailable ? 'Yes' : 'No'}</span>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Day Pass Price</label>
                            <input
                                type="text"
                                className="form-input"
                                value={dayPassPrice}
                                onChange={e => setDayPassPrice(e.target.value)}
                                placeholder="e.g. $89"
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Day Pass Duration</label>
                            <input
                                type="text"
                                className="form-input"
                                value={dayPassDuration}
                                onChange={e => setDayPassDuration(e.target.value)}
                                placeholder="e.g. 2 hours, Full day"
                            />
                        </div>
                        <div className="form-group full-width">
                            <label className="form-label">Day Pass Includes</label>
                            <input
                                type="text"
                                className="form-input"
                                value={dayPassIncludes}
                                onChange={e => setDayPassIncludes(e.target.value)}
                                placeholder="What's included in day pass..."
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Memberships */}
            <section className="form-section">
                <div className="form-section-header">
                    <div>
                        <h3 className="form-section-title">Memberships</h3>
                        <p className="form-section-subtitle">Recurring membership options</p>
                    </div>
                </div>
                <div className="form-section-body">
                    <div className="form-grid">
                        <div className="form-group">
                            <label className="form-label">Memberships Available</label>
                            <div className="toggle-container" onClick={() => setMembershipsAvailable(!membershipsAvailable)}>
                                <div className={`toggle ${membershipsAvailable ? 'active' : ''}`}>
                                    <div className="toggle-knob"></div>
                                </div>
                                <span className="toggle-label">{membershipsAvailable ? 'Yes' : 'No'}</span>
                            </div>
                        </div>
                        <div className="form-group full-width">
                            <label className="form-label">Membership Details</label>
                            <textarea
                                className="form-input form-textarea"
                                rows={3}
                                value={membershipDetails}
                                onChange={e => setMembershipDetails(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Gift Vouchers */}
            <section className="form-section">
                <div className="form-section-header">
                    <div>
                        <h3 className="form-section-title">Gift Vouchers</h3>
                        <p className="form-section-subtitle">Gift card and voucher options</p>
                    </div>
                </div>
                <div className="form-section-body">
                    <div className="form-grid">
                        <div className="form-group">
                            <label className="form-label">Gift Vouchers Available</label>
                            <div className="toggle-container" onClick={() => setVouchersAvailable(!vouchersAvailable)}>
                                <div className={`toggle ${vouchersAvailable ? 'active' : ''}`}>
                                    <div className="toggle-knob"></div>
                                </div>
                                <span className="toggle-label">{vouchersAvailable ? 'Yes' : 'No'}</span>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Voucher Types</label>
                            <div className="wpt-chip-group">
                                <span className="wpt-chip">Monetary value</span>
                                <span className="wpt-chip">Specific service</span>
                                <span className="wpt-chip">Package</span>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Voucher Validity</label>
                            <select className="form-input form-select" value={voucherValidity} onChange={e => setVoucherValidity(e.target.value)}>
                                <option value="6 months">6 months</option>
                                <option value="12 months">12 months</option>
                                <option value="24 months">24 months</option>
                                <option value="No expiry">No expiry</option>
                            </select>
                        </div>
                    </div>
                </div>
            </section>

            {/* Booking Rules */}
            <section className="form-section">
                <div className="form-section-header">
                    <div>
                        <h3 className="form-section-title">Booking Rules</h3>
                        <p className="form-section-subtitle">Service booking requirements</p>
                    </div>
                </div>
                <div className="form-section-body">
                    <div className="form-grid three-col">
                        <div className="form-group">
                            <label className="form-label">Advance Booking Required</label>
                            <select className="form-input form-select" value={advanceBooking} onChange={e => setAdvanceBooking(e.target.value)}>
                                <option value="No - Walk-ins welcome">No - Walk-ins welcome</option>
                                <option value="Recommended">Recommended</option>
                                <option value="Required">Required</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Minimum Notice</label>
                            <select className="form-input form-select" value={minNotice} onChange={e => setMinNotice(e.target.value)}>
                                <option value="None">None</option>
                                <option value="2 hours">2 hours</option>
                                <option value="24 hours">24 hours</option>
                                <option value="48 hours">48 hours</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Maximum Advance Booking</label>
                            <select className="form-input form-select" value={maxAdvance} onChange={e => setMaxAdvance(e.target.value)}>
                                <option value="1 month">1 month</option>
                                <option value="3 months">3 months</option>
                                <option value="6 months">6 months</option>
                                <option value="12 months">12 months</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Group Bookings</label>
                            <div className="toggle-container" onClick={() => setGroupBookings(!groupBookings)}>
                                <div className={`toggle ${groupBookings ? 'active' : ''}`}>
                                    <div className="toggle-knob"></div>
                                </div>
                                <span className="toggle-label">{groupBookings ? 'Accepted' : 'Not Accepted'}</span>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Max Group Size</label>
                            <input
                                type="number"
                                className="form-input"
                                value={maxGroupSize}
                                onChange={e => setMaxGroupSize(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Couples Bookings</label>
                            <div className="toggle-container" onClick={() => setCouplesBookings(!couplesBookings)}>
                                <div className={`toggle ${couplesBookings ? 'active' : ''}`}>
                                    <div className="toggle-knob"></div>
                                </div>
                                <span className="toggle-label">{couplesBookings ? 'Available' : 'Not Available'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Deposit & Payment */}
            <section className="form-section">
                <div className="form-section-header">
                    <div>
                        <h3 className="form-section-title">Deposit & Payment</h3>
                        <p className="form-section-subtitle">Payment requirements for bookings</p>
                    </div>
                </div>
                <div className="form-section-body">
                    <div className="form-grid three-col">
                        <div className="form-group">
                            <label className="form-label">Deposit Required</label>
                            <div className="toggle-container" onClick={() => setDepositRequired(!depositRequired)}>
                                <div className={`toggle ${depositRequired ? 'active' : ''}`}>
                                    <div className="toggle-knob"></div>
                                </div>
                                <span className="toggle-label">{depositRequired ? 'Yes' : 'No'}</span>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Deposit Amount</label>
                            <input
                                type="text"
                                className="form-input"
                                value={depositAmount}
                                onChange={e => setDepositAmount(e.target.value)}
                                disabled={!depositRequired}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Payment Due</label>
                            <select className="form-input form-select" value={paymentDue} onChange={e => setPaymentDue(e.target.value)}>
                                <option value="At time of service">At time of service</option>
                                <option value="At booking">At booking</option>
                                <option value="24 hours before">24 hours before</option>
                            </select>
                        </div>
                        <div className="form-group full-width">
                            <label className="form-label">Accepted Payment Methods</label>
                            <div className="wpt-chip-group">
                                <span className="wpt-chip">Credit Card</span>
                                <span className="wpt-chip">Debit Card</span>
                                <span className="wpt-chip">EFTPOS</span>
                                <span className="wpt-chip">Cash</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Cancellation Policy */}
            <section className="form-section">
                <div className="form-section-header">
                    <div>
                        <h3 className="form-section-title">Cancellation Policy</h3>
                        <p className="form-section-subtitle">Service cancellation terms</p>
                    </div>
                </div>
                <div className="form-section-body">
                    <div className="form-grid">
                        <div className="form-group">
                            <label className="form-label">Free Cancellation Window</label>
                            <select className="form-input form-select" value={freeCancellation} onChange={e => setFreeCancellation(e.target.value)}>
                                <option value="No free cancellation">No free cancellation</option>
                                <option value="2 hours notice">2 hours notice</option>
                                <option value="24 hours notice">24 hours notice</option>
                                <option value="48 hours notice">48 hours notice</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Late Cancellation Fee</label>
                            <select className="form-input form-select" value={lateFee} onChange={e => setLateFee(e.target.value)}>
                                <option value="No fee">No fee</option>
                                <option value="50% of service">50% of service</option>
                                <option value="100% of service">100% of service</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">No-Show Fee</label>
                            <select className="form-input form-select" value={noShowFee} onChange={e => setNoShowFee(e.target.value)}>
                                <option value="No fee">No fee</option>
                                <option value="50% of service">50% of service</option>
                                <option value="100% of service">100% of service</option>
                            </select>
                        </div>
                        <div className="form-group full-width">
                            <label className="form-label">Cancellation Policy Text (displayed to guests)</label>
                            <textarea
                                className="form-input form-textarea"
                                rows={2}
                                value={cancellationText}
                                onChange={e => setCancellationText(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Booking Settings */}
            <section className="form-section">
                <div className="form-section-header">
                    <div>
                        <h3 className="form-section-title">Booking Settings</h3>
                        <p className="form-section-subtitle">Online booking configuration</p>
                    </div>
                </div>
                <div className="form-section-body">
                    <div className="form-grid three-col">
                        <div className="form-group">
                            <label className="form-label">Online Booking Enabled</label>
                            <div className="toggle-container" onClick={() => setOnlineBooking(!onlineBooking)}>
                                <div className={`toggle ${onlineBooking ? 'active' : ''}`}>
                                    <div className="toggle-knob"></div>
                                </div>
                                <span className="toggle-label">{onlineBooking ? 'Yes' : 'No'}</span>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Booking Platform</label>
                            <select className="form-input form-select" value={bookingPlatform} onChange={e => setBookingPlatform(e.target.value)}>
                                <option value="TGS Booking">TGS Booking</option>
                                <option value="External (link out)">External (link out)</option>
                                <option value="Phone only">Phone only</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">External Booking URL</label>
                            <input
                                type="url"
                                className="form-input"
                                value={bookingUrl}
                                onChange={e => setBookingUrl(e.target.value)}
                                placeholder="https://..."
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Calendar Sync</label>
                            <div className="toggle-container" onClick={() => setCalendarSync(!calendarSync)}>
                                <div className={`toggle ${calendarSync ? 'active' : ''}`}>
                                    <div className="toggle-knob"></div>
                                </div>
                                <span className="toggle-label">{calendarSync ? 'Connected' : 'Not connected'}</span>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Auto-confirm Bookings</label>
                            <div className="toggle-container" onClick={() => setAutoConfirm(!autoConfirm)}>
                                <div className={`toggle ${autoConfirm ? 'active' : ''}`}>
                                    <div className="toggle-knob"></div>
                                </div>
                                <span className="toggle-label">{autoConfirm ? 'Yes' : 'No'}</span>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Send Reminders</label>
                            <div className="toggle-container" onClick={() => setReminders(reminders === '24hr before' ? 'None' : '24hr before')}>
                                <div className={`toggle ${reminders === '24hr before' ? 'active' : ''}`}>
                                    <div className="toggle-knob"></div>
                                </div>
                                <span className="toggle-label">{reminders}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing Notes */}
            <section className="form-section">
                <div className="form-section-header">
                    <h3 className="form-section-title">Pricing Notes</h3>
                </div>
                <div className="form-section-body">
                    <div className="form-group">
                        <label className="form-label">Internal Notes (Not visible to guests)</label>
                        <textarea
                            className="form-input form-textarea"
                            placeholder="Any additional pricing notes..."
                            value={pricingNotes}
                            onChange={e => setPricingNotes(e.target.value)}
                        />
                    </div>
                </div>
            </section>

        </div>
    );
}
