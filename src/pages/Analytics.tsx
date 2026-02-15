import { useState } from 'react';
import { Download } from 'lucide-react';

const dateRanges = ['Today', '7D', '30D', '90D', 'YTD', 'Custom'];

export default function Analytics() {
  const [activeRange, setActiveRange] = useState(2);
  const [activeTab, setActiveTab] = useState(0);
  const analyticsTabs = ['Overview', 'Revenue', 'Venues', 'Bookings', 'Users', 'Content', 'Geographic'];

  return (
    <>
      <div className="page-header">
        <div className="page-title-group">
          <h1 className="page-title">Analytics</h1>
          <div className="live-indicator">
            <div className="live-dot"></div>
            Live Data
          </div>
        </div>
        <div className="header-actions">
          <div className="date-range-selector">
            {dateRanges.map((r, i) => (
              <button key={i} className={`date-range-option${activeRange === i ? ' active' : ''}`} onClick={() => setActiveRange(i)}>
                {r}
              </button>
            ))}
          </div>
          <button className="btn btn-secondary">
            <Download size={16} /> Export
          </button>
        </div>
      </div>

      {/* Real-time Ticker */}
      <div className="realtime-ticker">
        <div className="ticker-label">Live Activity</div>
        <div className="ticker-items">
          <div className="ticker-item">
            <div className="ticker-icon green"></div>
            <span className="ticker-text">New booking: Moraea Farm</span>
            <span className="ticker-time">2m ago</span>
          </div>
          <div className="ticker-item">
            <div className="ticker-icon blue"></div>
            <span className="ticker-text">Venue signup: Zen Gardens</span>
            <span className="ticker-time">8m ago</span>
          </div>
          <div className="ticker-item">
            <div className="ticker-icon yellow"></div>
            <span className="ticker-text">Enquiry: Mountain Sanctuary</span>
            <span className="ticker-time">15m ago</span>
          </div>
          <div className="ticker-item">
            <div className="ticker-icon purple"></div>
            <span className="ticker-text">Journal subscriber: +1</span>
            <span className="ticker-time">22m ago</span>
          </div>
        </div>
      </div>

      {/* KPI Hero Cards */}
      <div className="kpi-hero">
        <div className="kpi-card primary">
          <div className="kpi-icon">💰</div>
          <div className="kpi-label">Total GMV (Feb)</div>
          <div className="kpi-value">$342,500</div>
          <div className="kpi-change positive">↑ 28% vs Jan</div>
          <div className="kpi-sublabel">Gross Merchandise Value</div>
        </div>
        <div className="kpi-card success">
          <div className="kpi-icon">📈</div>
          <div className="kpi-label">TGS Revenue (Feb)</div>
          <div className="kpi-value">$89,450</div>
          <div className="kpi-change positive">↑ 23% vs Jan</div>
          <div className="kpi-sublabel">Subscriptions + Commission</div>
        </div>
        <div className="kpi-card info-gradient">
          <div className="kpi-icon">🏠</div>
          <div className="kpi-label">Active Venues</div>
          <div className="kpi-value">118</div>
          <div className="kpi-change positive">↑ 14 this month</div>
          <div className="kpi-sublabel">Paying subscribers</div>
        </div>
        <div className="kpi-card warning-gradient">
          <div className="kpi-icon">📅</div>
          <div className="kpi-label">Bookings (Feb)</div>
          <div className="kpi-value">89</div>
          <div className="kpi-change positive">↑ 34% vs Jan</div>
          <div className="kpi-sublabel">Confirmed retreats</div>
        </div>
      </div>

      {/* Year 1 Goals Progress */}
      <h3 className="section-title" style={{ marginBottom: 16 }}>Year 1 Goals Progress</h3>
      <div className="goals-grid">
        <div className="goal-card">
          <div className="goal-header">
            <div className="goal-label">Venues</div>
            <div className="goal-target">Target: 1,500</div>
          </div>
          <div className="progress-bar">
            <div className="progress-fill info" style={{ width: '7.9%' }}></div>
          </div>
          <div className="goal-values">
            <span className="goal-current">118 (7.9%)</span>
            <span className="goal-remaining">1,382 to go</span>
          </div>
        </div>
        <div className="goal-card">
          <div className="goal-header">
            <div className="goal-label">Annual Revenue</div>
            <div className="goal-target">Target: $5.74M</div>
          </div>
          <div className="progress-bar">
            <div className="progress-fill success" style={{ width: '18.7%' }}></div>
          </div>
          <div className="goal-values">
            <span className="goal-current">$1.07M (18.7%)</span>
            <span className="goal-remaining">$4.67M to go</span>
          </div>
        </div>
        <div className="goal-card">
          <div className="goal-header">
            <div className="goal-label">Retreat Hosts</div>
            <div className="goal-target">Target: 500</div>
          </div>
          <div className="progress-bar">
            <div className="progress-fill warning" style={{ width: '31.2%' }}></div>
          </div>
          <div className="goal-values">
            <span className="goal-current">156 (31.2%)</span>
            <span className="goal-remaining">344 to go</span>
          </div>
        </div>
        <div className="goal-card">
          <div className="goal-header">
            <div className="goal-label">Journal Subscribers</div>
            <div className="goal-target">Target: 10,000</div>
          </div>
          <div className="progress-bar">
            <div className="progress-fill info" style={{ width: '28.5%' }}></div>
          </div>
          <div className="goal-values">
            <span className="goal-current">2,847 (28.5%)</span>
            <span className="goal-remaining">7,153 to go</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs-container">
        {analyticsTabs.map((tab, i) => (
          <div key={i} className={`tab${activeTab === i ? ' active' : ''}`} onClick={() => setActiveTab(i)}>
            {tab}
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="chart-grid">
        <div className="chart-card full-width">
          <div className="chart-header">
            <div className="chart-title">Revenue Trend</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-small btn-secondary">Subscriptions</button>
              <button className="btn btn-small btn-secondary">Commission</button>
              <button className="btn btn-small btn-primary">Total</button>
            </div>
          </div>
          <div className="chart-body">
            <div className="chart-placeholder tall">
              📈 Revenue Chart (Aug 2025 - Feb 2026)<br />
              Subscriptions: $18,450/mo | Commission: $6,240/mo
            </div>
          </div>
        </div>
        <div className="chart-card">
          <div className="chart-header">
            <div className="chart-title">Booking Funnel</div>
          </div>
          <div className="chart-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { label: 'Website Visits', value: '12,450', width: '100%' },
                { label: 'Venue Views', value: '8,964', width: '72%' },
                { label: 'Enquiries', value: '247', width: '18%' },
                { label: 'Bookings', value: '89', width: '7%' },
              ].map((step, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 100, textAlign: 'right', fontSize: 13, flexShrink: 0 }}>{step.label}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      width: step.width,
                      height: 40,
                      background: `linear-gradient(90deg, #6B8EC9, #4A7C59)`,
                      borderRadius: 8,
                      display: 'flex',
                      alignItems: 'center',
                      paddingLeft: 16,
                      color: '#fff',
                      fontWeight: 500,
                      fontSize: 13,
                      minWidth: 60,
                    }}>
                      {step.value}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="chart-card">
          <div className="chart-header">
            <div className="chart-title">Venue Categories</div>
          </div>
          <div className="chart-body">
            <div className="chart-placeholder">
              🥧 Venue Category Distribution<br />
              Retreat: 68% | Wellness: 32%
            </div>
          </div>
        </div>
        <div className="chart-card">
          <div className="chart-header">
            <div className="chart-title">Top Venues by Revenue</div>
          </div>
          <div className="chart-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { name: 'Soak Wellness', revenue: '$8,920', rank: 1 },
                { name: 'Moraea Farm', revenue: '$6,450', rank: 2 },
                { name: 'Sedona Spirit Lodge', revenue: '$5,340', rank: 3 },
                { name: 'Hakone Onsen Ryokan', revenue: '$4,280', rank: 4 },
                { name: 'Ubud Healing Centre', revenue: '$3,120', rank: 5 },
              ].map((v) => (
                <div key={v.rank} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0', borderBottom: '1px solid rgba(184,184,184,0.1)' }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 12, fontWeight: 600,
                    backgroundColor: v.rank === 1 ? '#FEF9E7' : v.rank === 2 ? '#F7F5F1' : v.rank === 3 ? '#FCE8E8' : '#F7F5F1',
                    color: v.rank === 1 ? '#D4A853' : v.rank === 2 ? '#B8B8B8' : v.rank === 3 ? '#C45C5C' : '#313131',
                  }}>
                    {v.rank}
                  </div>
                  <div style={{ flex: 1, fontWeight: 500, fontSize: 13 }}>{v.name}</div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{v.revenue}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="chart-card">
          <div className="chart-header">
            <div className="chart-title">User Growth</div>
          </div>
          <div className="chart-body">
            <div className="chart-placeholder">
              📊 User Growth Chart<br />
              Guests: +18 | Hosts: +8 | Owners: +6
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
