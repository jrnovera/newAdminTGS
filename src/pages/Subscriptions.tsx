import { useState, useEffect, useMemo } from 'react';
import { Upload, Search, Filter, MoreHorizontal, ChevronLeft, ChevronRight, TrendingUp } from 'lucide-react';
import { supabase } from '../lib/supabase';

// ── Types ──────────────────────────────────────────────────────────────────────
interface Subscription {
  id: string;
  user_id: string | null;
  customer_email: string;
  customer_name: string | null;
  tier_key: string | null;
  tier_name: string | null;
  billing_interval: string | null;
  amount: number | null;          // cents
  currency: string | null;
  status: string;
  current_period_end: string | null;
  cancel_at_period_end: boolean | null;
  canceled_at: string | null;
  created_at: string;
}

// ── Helpers ────────────────────────────────────────────────────────────────────
function formatAmount(cents: number | null, interval: string | null): string {
  if (!cents) return '—';
  const dollars = (cents / 100).toFixed(0);
  const suffix = interval === 'year' ? '/yr' : '/mo';
  return `$${dollars}${suffix}`;
}

function formatDate(iso: string | null): string {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleDateString('en-AU', {
      day: 'numeric', month: 'short', year: 'numeric',
    });
  } catch {
    return iso;
  }
}

function normaliseStatus(raw: string): string {
  switch (raw?.toLowerCase()) {
    case 'active':    return 'Active';
    case 'trialing':  return 'Trial';
    case 'past_due':  return 'Past Due';
    case 'canceled':
    case 'cancelled': return 'Cancelled';
    default:          return raw ?? '—';
  }
}

function planLabel(tierName: string | null, tierKey: string | null): string {
  if (tierName) return tierName;
  if (!tierKey) return '—';
  // fallback: capitalise tier key
  return tierKey.charAt(0).toUpperCase() + tierKey.slice(1);
}

const PAGE_SIZE = 8;

export default function Subscriptions() {
  const [activeTab, setActiveTab]     = useState(0);
  const [search, setSearch]           = useState('');
  const [page, setPage]               = useState(1);
  const [subs, setSubs]               = useState<Subscription[]>([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState('');

  // ── Fetch ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      const { data, error: err } = await supabase
        .from('venue_subscriptions')
        .select('*')
        .order('created_at', { ascending: false });
      if (err) {
        setError(err.message);
      } else {
        setSubs(data ?? []);
      }
      setLoading(false);
    };
    load();
  }, []);

  // ── Derived stats ──────────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const active    = subs.filter(s => s.status === 'active');
    const trialing  = subs.filter(s => s.status === 'trialing');
    const pastDue   = subs.filter(s => s.status === 'past_due');
    const cancelled = subs.filter(s => s.status === 'canceled' || s.status === 'cancelled');

    const mrr = active.reduce((sum, s) => {
      const monthly = s.billing_interval === 'year'
        ? (s.amount ?? 0) / 12
        : (s.amount ?? 0);
      return sum + monthly;
    }, 0);

    const avgRevenue = active.length > 0
      ? mrr / active.length
      : 0;

    const churnRate = subs.length > 0
      ? ((cancelled.length / subs.length) * 100).toFixed(1)
      : '0.0';

    return {
      mrr,
      activeCount: active.length,
      trialCount: trialing.length,
      pastDueCount: pastDue.length,
      cancelledCount: cancelled.length,
      avgRevenue,
      churnRate,
    };
  }, [subs]);

  const tabDefs = [
    { label: 'All Subscriptions', count: subs.length },
    { label: 'Active',            count: stats.activeCount },
    { label: 'Trial',             count: stats.trialCount },
    { label: 'Past Due',          count: stats.pastDueCount },
    { label: 'Cancelled',         count: stats.cancelledCount },
  ];

  // ── Filter by tab ──────────────────────────────────────────────────────────
  const tabFiltered = useMemo(() => {
    if (activeTab === 0) return subs;
    const statusMap: Record<number, string[]> = {
      1: ['active'],
      2: ['trialing'],
      3: ['past_due'],
      4: ['canceled', 'cancelled'],
    };
    const allowed = statusMap[activeTab] ?? [];
    return subs.filter(s => allowed.includes(s.status?.toLowerCase()));
  }, [subs, activeTab]);

  // ── Search filter ──────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    if (!search.trim()) return tabFiltered;
    const q = search.toLowerCase();
    return tabFiltered.filter(s =>
      (s.customer_name ?? '').toLowerCase().includes(q) ||
      (s.customer_email ?? '').toLowerCase().includes(q) ||
      (s.tier_name ?? '').toLowerCase().includes(q) ||
      (s.tier_key ?? '').toLowerCase().includes(q)
    );
  }, [tabFiltered, search]);

  // ── Pagination ─────────────────────────────────────────────────────────────
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage   = Math.min(page, totalPages);
  const pageItems  = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const goToPage = (p: number) => setPage(Math.max(1, Math.min(p, totalPages)));

  // Reset page on tab/search change
  useEffect(() => { setPage(1); }, [activeTab, search]);

  // ── Badge helpers ──────────────────────────────────────────────────────────
  const planClass = (name: string | null) => {
    switch ((name ?? '').toLowerCase()) {
      case 'essentials': return 'sub-essentials';
      case 'standard':   return 'sub-standard';
      case 'featured':   return 'sub-featured';
      case 'premium':    return 'sub-premium';
      default:           return 'sub-standard';
    }
  };

  const statusClass = (raw: string) => {
    switch (normaliseStatus(raw)) {
      case 'Active':    return 'active';
      case 'Trial':     return 'pending';
      case 'Past Due':  return 'error';
      case 'Cancelled': return 'inactive';
      default:          return '';
    }
  };

  const nextBillingDisplay = (s: Subscription) => {
    if (s.status === 'past_due') return { text: 'Overdue', overdue: true };
    if (s.cancel_at_period_end) return { text: `Ends ${formatDate(s.current_period_end)}`, overdue: false };
    return { text: formatDate(s.current_period_end), overdue: false };
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <>
      <header className="page-header">
        <div>
          <h1 className="page-title">Subscriptions</h1>
          <p className="page-subtitle">Manage venue subscription plans and billing</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-secondary"><Upload size={16} /> Export</button>
        </div>
      </header>

      {/* ── Stat Cards ────────────────────────────────────────────────────── */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <div className="stat-card">
          <div className="stat-label">Monthly Recurring Revenue</div>
          <div className="stat-value">
            {loading ? '…' : `$${(stats.mrr / 100).toLocaleString('en-AU', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
          </div>
          <div className="stat-change positive"><TrendingUp size={14} /> Live from Stripe data</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Active Subscriptions</div>
          <div className="stat-value success">{loading ? '…' : stats.activeCount}</div>
          <div className="stat-breakdown">
            {loading ? '' : `${stats.trialCount} trial${stats.trialCount !== 1 ? 's' : ''} active`}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Avg Revenue / Subscriber</div>
          <div className="stat-value">
            {loading ? '…' : `$${(stats.avgRevenue / 100).toLocaleString('en-AU', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
          </div>
          <div className="stat-change positive"><TrendingUp size={14} /> Monthly average</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Cancelled</div>
          <div className="stat-value" style={{ color: stats.cancelledCount > 0 ? '#C45C5C' : '#4A7C59' }}>
            {loading ? '…' : stats.cancelledCount}
          </div>
          <div className="stat-breakdown">
            {loading ? '' : `${stats.churnRate}% churn rate`}
          </div>
        </div>
      </div>

      {/* ── Tabs ──────────────────────────────────────────────────────────── */}
      <div className="tabs-container">
        {tabDefs.map((tab, i) => (
          <div
            key={i}
            className={`tab${activeTab === i ? ' active' : ''}`}
            onClick={() => setActiveTab(i)}
          >
            {tab.label} <span className="tab-count">{loading ? '–' : tab.count}</span>
          </div>
        ))}
      </div>

      {/* ── Toolbar ───────────────────────────────────────────────────────── */}
      <div className="toolbar">
        <div className="search-box">
          <Search size={18} color="#B8B8B8" />
          <input
            type="text"
            placeholder="Search by name, email, or plan…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="toolbar-actions">
          <button className="filter-btn"><Filter size={16} /> Filters</button>
        </div>
      </div>

      {/* ── Table ─────────────────────────────────────────────────────────── */}
      <div className="data-table-container">
        {error ? (
          <div style={{ padding: '40px 24px', textAlign: 'center', color: '#C45C5C', fontSize: 13 }}>
            Failed to load subscriptions: {error}
          </div>
        ) : loading ? (
          <div style={{ padding: '60px 24px', textAlign: 'center', color: '#B8B8B8', fontSize: 13 }}>
            Loading subscriptions…
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: '60px 24px', textAlign: 'center', color: '#B8B8B8', fontSize: 13 }}>
            {search ? 'No subscriptions match your search.' : 'No subscriptions found.'}
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Subscriber</th>
                <th>Email</th>
                <th>Plan</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Next Billing</th>
                <th>Started</th>
                <th style={{ width: 50 }}></th>
              </tr>
            </thead>
            <tbody>
              {pageItems.map(s => {
                const { text: billingText, overdue } = nextBillingDisplay(s);
                const label = planLabel(s.tier_name, s.tier_key);
                return (
                  <tr key={s.id}>
                    <td style={{ fontWeight: 500 }}>
                      {s.customer_name || <span style={{ color: '#B8B8B8', fontStyle: 'italic' }}>—</span>}
                    </td>
                    <td style={{ color: '#B8B8B8', fontSize: 12 }}>{s.customer_email}</td>
                    <td>
                      <span className={`subscription-badge ${planClass(s.tier_name)}`}>{label}</span>
                    </td>
                    <td style={{ fontWeight: 500 }}>
                      {formatAmount(s.amount, s.billing_interval)}
                    </td>
                    <td>
                      <span className={`status-badge ${statusClass(s.status)}`}>
                        {normaliseStatus(s.status)}
                      </span>
                    </td>
                    <td style={{ fontSize: 12, color: overdue ? '#C45C5C' : '#B8B8B8', fontWeight: overdue ? 600 : 400 }}>
                      {billingText}
                    </td>
                    <td style={{ fontSize: 12, color: '#B8B8B8' }}>
                      {formatDate(s.created_at)}
                    </td>
                    <td>
                      <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8, color: '#B8B8B8' }}>
                        <MoreHorizontal size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        {/* ── Pagination ──────────────────────────────────────────────────── */}
        {!loading && !error && filtered.length > 0 && (
          <div className="pagination">
            <div className="pagination-info">
              Showing {Math.min((safePage - 1) * PAGE_SIZE + 1, filtered.length)}–{Math.min(safePage * PAGE_SIZE, filtered.length)} of {filtered.length} subscription{filtered.length !== 1 ? 's' : ''}
            </div>
            <div className="pagination-controls">
              <button className="page-btn" onClick={() => goToPage(safePage - 1)} disabled={safePage === 1}>
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                const start = Math.max(1, Math.min(safePage - 2, totalPages - 4));
                const p = start + i;
                return p <= totalPages ? (
                  <button
                    key={p}
                    className={`page-btn${safePage === p ? ' active' : ''}`}
                    onClick={() => goToPage(p)}
                  >
                    {p}
                  </button>
                ) : null;
              })}
              <button className="page-btn" onClick={() => goToPage(safePage + 1)} disabled={safePage === totalPages}>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
