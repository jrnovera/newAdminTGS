import { useState } from 'react';
import { Save, Globe, Bell, Shield, CreditCard, Palette, Mail } from 'lucide-react';

const settingsSections = [
  { id: 'general', label: 'General', icon: Globe },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'billing', label: 'Billing', icon: CreditCard },
  { id: 'branding', label: 'Branding', icon: Palette },
  { id: 'email', label: 'Email Templates', icon: Mail },
];

export default function Settings() {
  const [activeSection, setActiveSection] = useState('general');

  return (
    <>
      <header className="page-header">
        <div>
          <h1 className="page-title">Settings</h1>
          <p className="page-subtitle">Manage platform configuration and preferences</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-primary"><Save size={16} /> Save Changes</button>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 24 }}>
        {/* Settings Nav */}
        <div className="content-card" style={{ padding: '16px 0', height: 'fit-content' }}>
          {settingsSections.map((s) => (
            <div
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '12px 24px',
                cursor: 'pointer', fontSize: 13, fontWeight: activeSection === s.id ? 500 : 400,
                color: activeSection === s.id ? '#313131' : '#B8B8B8',
                backgroundColor: activeSection === s.id ? '#F7F5F1' : 'transparent',
                borderLeft: activeSection === s.id ? '3px solid #313131' : '3px solid transparent',
                transition: 'all 0.2s',
              }}
            >
              <s.icon size={16} />
              {s.label}
            </div>
          ))}
        </div>

        {/* Settings Content */}
        <div>
          {activeSection === 'general' && (
            <div className="content-card" style={{ padding: 0 }}>
              <div className="card-header">
                <h3 className="card-title">General Settings</h3>
              </div>
              <div style={{ padding: 24 }}>
                <div className="form-group">
                  <label className="form-label">Platform Name</label>
                  <input className="form-input" defaultValue="The Global Sanctum" />
                </div>
                <div className="form-group">
                  <label className="form-label">Tagline</label>
                  <input className="form-input" defaultValue="Curated Wellness & Retreat Venues" />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Primary Contact Email</label>
                    <input className="form-input" defaultValue="hello@theglobalsanctum.com" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Support Email</label>
                    <input className="form-input" defaultValue="support@theglobalsanctum.com" />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Default Currency</label>
                    <select className="form-select">
                      <option>USD ($)</option>
                      <option>AUD (A$)</option>
                      <option>EUR (€)</option>
                      <option>GBP (£)</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Timezone</label>
                    <select className="form-select">
                      <option>Australia/Brisbane (UTC+10)</option>
                      <option>America/New_York (UTC-5)</option>
                      <option>Europe/London (UTC+0)</option>
                      <option>Asia/Tokyo (UTC+9)</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Website URL</label>
                  <input className="form-input" defaultValue="https://theglobalsanctum.com" />
                </div>
                <div className="form-group" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderTop: '1px solid rgba(184,184,184,0.2)' }}>
                  <div>
                    <div style={{ fontWeight: 500, marginBottom: 4 }}>Maintenance Mode</div>
                    <div style={{ fontSize: 12, color: '#B8B8B8' }}>Temporarily disable public access to the platform</div>
                  </div>
                  <div style={{ width: 44, height: 24, borderRadius: 12, backgroundColor: '#B8B8B8', cursor: 'pointer', position: 'relative' }}>
                    <div style={{ width: 20, height: 20, borderRadius: '50%', backgroundColor: '#fff', position: 'absolute', top: 2, left: 2, transition: 'left 0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'notifications' && (
            <div className="content-card" style={{ padding: 0 }}>
              <div className="card-header">
                <h3 className="card-title">Notification Preferences</h3>
              </div>
              <div style={{ padding: 24 }}>
                {[
                  { title: 'New Enquiries', desc: 'Get notified when a new enquiry is received', enabled: true },
                  { title: 'New Bookings', desc: 'Notifications for new booking confirmations', enabled: true },
                  { title: 'Payment Alerts', desc: 'Failed payment and payout notifications', enabled: true },
                  { title: 'New Venue Signups', desc: 'When a new venue owner registers', enabled: true },
                  { title: 'Content Reviews', desc: 'Articles and posts submitted for review', enabled: false },
                  { title: 'Weekly Summary', desc: 'Weekly performance digest via email', enabled: true },
                  { title: 'Monthly Reports', desc: 'Automated monthly analytics report', enabled: false },
                ].map((n, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: i < 6 ? '1px solid rgba(184,184,184,0.1)' : 'none' }}>
                    <div>
                      <div style={{ fontWeight: 500, marginBottom: 2 }}>{n.title}</div>
                      <div style={{ fontSize: 12, color: '#B8B8B8' }}>{n.desc}</div>
                    </div>
                    <div style={{
                      width: 44, height: 24, borderRadius: 12,
                      backgroundColor: n.enabled ? '#4A7C59' : '#B8B8B8',
                      cursor: 'pointer', position: 'relative',
                    }}>
                      <div style={{
                        width: 20, height: 20, borderRadius: '50%', backgroundColor: '#fff',
                        position: 'absolute', top: 2, left: n.enabled ? 22 : 2, transition: 'left 0.2s',
                      }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'security' && (
            <div className="content-card" style={{ padding: 0 }}>
              <div className="card-header">
                <h3 className="card-title">Security Settings</h3>
              </div>
              <div style={{ padding: 24 }}>
                <div style={{ padding: '16px 20px', borderRadius: 8, backgroundColor: '#E8F4EA', border: '1px solid #4A7C59', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12, fontSize: 13, color: '#4A7C59' }}>
                  <Shield size={18} />
                  All security features are enabled. Your portal is secure.
                </div>
                {[
                  { title: 'Two-Factor Authentication', desc: 'Require 2FA for all team members', enabled: true },
                  { title: 'Session Timeout', desc: 'Auto-logout after 30 minutes of inactivity', enabled: true },
                  { title: 'IP Whitelisting', desc: 'Restrict access to approved IP addresses', enabled: false },
                  { title: 'Audit Logging', desc: 'Track all user actions and changes', enabled: true },
                ].map((s, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: i < 3 ? '1px solid rgba(184,184,184,0.1)' : 'none' }}>
                    <div>
                      <div style={{ fontWeight: 500, marginBottom: 2 }}>{s.title}</div>
                      <div style={{ fontSize: 12, color: '#B8B8B8' }}>{s.desc}</div>
                    </div>
                    <div style={{
                      width: 44, height: 24, borderRadius: 12,
                      backgroundColor: s.enabled ? '#4A7C59' : '#B8B8B8',
                      cursor: 'pointer', position: 'relative',
                    }}>
                      <div style={{
                        width: 20, height: 20, borderRadius: '50%', backgroundColor: '#fff',
                        position: 'absolute', top: 2, left: s.enabled ? 22 : 2, transition: 'left 0.2s',
                      }}></div>
                    </div>
                  </div>
                ))}
                <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid rgba(184,184,184,0.2)' }}>
                  <div className="form-group">
                    <label className="form-label">Session Timeout (minutes)</label>
                    <input className="form-input" type="number" defaultValue={30} style={{ maxWidth: 200 }} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'billing' && (
            <div className="content-card" style={{ padding: 0 }}>
              <div className="card-header">
                <h3 className="card-title">Billing & Plans</h3>
              </div>
              <div style={{ padding: 24 }}>
                <h4 style={{ fontSize: 16, marginBottom: 16 }}>Subscription Plans</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
                  {[
                    { name: 'Essentials', price: '$79', features: '3 photos, Basic listing' },
                    { name: 'Standard', price: '$149', features: '10 photos, Featured badge' },
                    { name: 'Featured', price: '$249', features: '20 photos, Priority placement' },
                    { name: 'Premium', price: '$449', features: 'Unlimited, Top placement' },
                  ].map((plan, i) => (
                    <div key={i} style={{ padding: 20, borderRadius: 12, border: '1px solid rgba(184,184,184,0.2)', textAlign: 'center' }}>
                      <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 8 }}>{plan.name}</div>
                      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 600, marginBottom: 4 }}>{plan.price}</div>
                      <div style={{ fontSize: 11, color: '#B8B8B8' }}>per month</div>
                      <div style={{ fontSize: 11, color: '#B8B8B8', marginTop: 12, paddingTop: 12, borderTop: '1px solid rgba(184,184,184,0.1)' }}>{plan.features}</div>
                    </div>
                  ))}
                </div>
                <h4 style={{ fontSize: 16, marginBottom: 16 }}>Commission Settings</h4>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Booking Commission Rate (%)</label>
                    <input className="form-input" type="number" defaultValue={10} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Payment Gateway</label>
                    <select className="form-select">
                      <option>Stripe</option>
                      <option>PayPal</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'branding' && (
            <div className="content-card" style={{ padding: 0 }}>
              <div className="card-header">
                <h3 className="card-title">Branding & Appearance</h3>
              </div>
              <div style={{ padding: 24 }}>
                <h4 style={{ fontSize: 16, marginBottom: 16 }}>Color Palette</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
                  {[
                    { name: 'Primary BG', color: '#FDFCF9' },
                    { name: 'Secondary BG', color: '#F7F5F1' },
                    { name: 'Text', color: '#313131' },
                    { name: 'Accent', color: '#B8B8B8' },
                    { name: 'Success', color: '#4A7C59' },
                    { name: 'Warning', color: '#D4A853' },
                    { name: 'Error', color: '#C45C5C' },
                    { name: 'Info', color: '#6B8EC9' },
                  ].map((c, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 40, height: 40, borderRadius: 8, backgroundColor: c.color, border: '1px solid rgba(184,184,184,0.2)' }}></div>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 500 }}>{c.name}</div>
                        <div style={{ fontSize: 11, color: '#B8B8B8' }}>{c.color}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <h4 style={{ fontSize: 16, marginBottom: 16 }}>Typography</h4>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Heading Font</label>
                    <input className="form-input" defaultValue="Cormorant Garamond" readOnly style={{ backgroundColor: '#F7F5F1' }} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Body Font</label>
                    <input className="form-input" defaultValue="Montserrat" readOnly style={{ backgroundColor: '#F7F5F1' }} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'email' && (
            <div className="content-card" style={{ padding: 0 }}>
              <div className="card-header">
                <h3 className="card-title">Email Templates</h3>
              </div>
              <div style={{ padding: 24 }}>
                {[
                  { name: 'Welcome Email', desc: 'Sent to new venue owners upon registration', lastEdited: 'Feb 5, 2026' },
                  { name: 'Booking Confirmation', desc: 'Sent to guests after booking is confirmed', lastEdited: 'Jan 28, 2026' },
                  { name: 'Enquiry Notification', desc: 'Sent to venue owners for new enquiries', lastEdited: 'Jan 20, 2026' },
                  { name: 'Payment Receipt', desc: 'Sent after successful payment', lastEdited: 'Jan 15, 2026' },
                  { name: 'Subscription Renewal', desc: 'Reminder before subscription renewal', lastEdited: 'Jan 10, 2026' },
                  { name: 'Password Reset', desc: 'Password reset link for users', lastEdited: 'Dec 15, 2025' },
                ].map((t, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: i < 5 ? '1px solid rgba(184,184,184,0.1)' : 'none' }}>
                    <div>
                      <div style={{ fontWeight: 500, marginBottom: 2 }}>{t.name}</div>
                      <div style={{ fontSize: 12, color: '#B8B8B8' }}>{t.desc}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                      <span style={{ fontSize: 11, color: '#B8B8B8' }}>Edited {t.lastEdited}</span>
                      <button className="btn btn-small btn-secondary">Edit</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
