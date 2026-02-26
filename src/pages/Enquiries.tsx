import { useState, useEffect, useMemo } from 'react';
import { Upload, Search, Filter, MoreHorizontal, ChevronLeft, ChevronRight, MessageSquare, Clock, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

// ── Types ──────────────────────────────────────────────────────────────────────
interface Enquiry {
  id: string;
  venue_id: string | null;
  venue_name: string;
  venue_type: string | null;
  enquiry_type: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  preferred_date_from: string | null;
  preferred_date_to: string | null;
  guest_count: number;
  message: string | null;
  status: string;
  priority: string;
  user_id: string | null;
  created_at: string;
}

// ── Helpers ────────────────────────────────────────────────────────────────────
function formatDate(iso: string | null): string {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch { return iso; }
}

function normalisePriority(p: string): string {
  switch (p?.toLowerCase()) {
    case 'high':   return 'High';
    case 'medium': return 'Medium';
    case 'low':    return 'Low';
    default:       return p ?? 'Medium';
  }
}

function normaliseStatus(s: string): string {
  switch (s?.toLowerCase()) {
    case 'new':         return 'New';
    case 'in_progress': return 'In Progress';
    case 'resolved':    return 'Resolved';
    case 'closed':      return 'Closed';
    default:            return s ?? 'New';
  }
}

function referenceId(id: string): string {
  return `ENQ-${id.slice(0, 6).toUpperCase()}`;
}

const PAGE_SIZE = 8;

// ── Component ──────────────────────────────────────────────────────────────────
export default function Enquiries() {
  const [activeTab, setActiveTab] = useState(0);
  const [search, setSearch]       = useState('');
  const [page, setPage]           = useState(1);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');

  // ── Fetch ────────────────────────────────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      const { data, error: err } = await supabase
        .from('enquiries')
        .select('*')
        .order('created_at', { ascending: false });
      if (err) { setError(err.message); }
      else { setEnquiries(data ?? []); }
      setLoading(false);
    };
    load();
  }, []);

  // ── Derived stats ────────────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const newCount      = enquiries.filter(e => e.status === 'new').length;
    const inProgCount   = enquiries.filter(e => e.status === 'in_progress').length;
    const resolvedCount = enquiries.filter(e => e.status === 'resolved').length;
    const closedCount   = enquiries.filter(e => e.status === 'closed').length;
    const resolutionRate = enquiries.length > 0
      ? Math.round(((resolvedCount + closedCount) / enquiries.length) * 100)
      : 0;
    return { newCount, inProgCount, resolvedCount, closedCount, resolutionRate };
  }, [enquiries]);

  const tabDefs = [
    { label: 'All Enquiries', count: enquiries.length },
    { label: 'New',           count: stats.newCount },
    { label: 'In Progress',   count: stats.inProgCount },
    { label: 'Resolved',      count: stats.resolvedCount },
    { label: 'Closed',        count: stats.closedCount },
  ];

  // ── Tab filter ───────────────────────────────────────────────────────────────
  const tabFiltered = useMemo(() => {
    const statusMap: Record<number, string> = {
      1: 'new', 2: 'in_progress', 3: 'resolved', 4: 'closed',
    };
    if (activeTab === 0) return enquiries;
    return enquiries.filter(e => e.status === statusMap[activeTab]);
  }, [enquiries, activeTab]);

  // ── Search filter ────────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    if (!search.trim()) return tabFiltered;
    const q = search.toLowerCase();
    return tabFiltered.filter(e =>
      (e.customer_name  ?? '').toLowerCase().includes(q) ||
      (e.customer_email ?? '').toLowerCase().includes(q) ||
      (e.venue_name     ?? '').toLowerCase().includes(q) ||
      (e.enquiry_type   ?? '').toLowerCase().includes(q)
    );
  }, [tabFiltered, search]);

  // ── Pagination ───────────────────────────────────────────────────────────────
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage   = Math.min(page, totalPages);
  const pageItems  = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const goToPage   = (p: number) => setPage(Math.max(1, Math.min(p, totalPages)));
  useEffect(() => { setPage(1); }, [activeTab, search]);

  // ── Badge helpers ────────────────────────────────────────────────────────────
  const statusIcon = (s: string) => {
    switch (normaliseStatus(s)) {
      case 'New':         return <MessageSquare size={14} />;
      case 'In Progress': return <Clock size={14} />;
      case 'Resolved':    return <CheckCircle size={14} />;
      case 'Closed':      return <XCircle size={14} />;
      default:            return null;
    }
  };

  const statusStyle = (s: string): string => {
    switch (normaliseStatus(s)) {
      case 'New':         return 'active';
      case 'In Progress': return 'pending';
      case 'Resolved':    return 'active';
      case 'Closed':      return 'inactive';
      default:            return '';
    }
  };

  const priorityStyle = (p: string): React.CSSProperties => {
    switch (normalisePriority(p)) {
      case 'High':   return { color: '#C45C5C', backgroundColor: '#FCE8E8', padding: '2px 8px', borderRadius: 10, fontSize: 11, fontWeight: 500 };
      case 'Medium': return { color: '#D4A853', backgroundColor: '#FEF9E7', padding: '2px 8px', borderRadius: 10, fontSize: 11, fontWeight: 500 };
      case 'Low':    return { color: '#B8B8B8', backgroundColor: '#F7F5F1', padding: '2px 8px', borderRadius: 10, fontSize: 11, fontWeight: 500 };
      default:       return {};
    }
  };

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <>
      <header className="page-header">
        <div>
          <h1 className="page-title">Enquiries</h1>
          <p className="page-subtitle">Manage guest enquiries and communications</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-secondary"><Upload size={16} /> Export</button>
        </div>
      </header>

      {/* ── Stat Cards ──────────────────────────────────────────────────────── */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <div className="stat-card">
          <div className="stat-label">Total Enquiries</div>
          <div className="stat-value">{loading ? '…' : enquiries.length}</div>
          <div className="stat-change positive">
            {loading ? '' : `${stats.newCount} awaiting response`}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">New (Unread)</div>
          <div className="stat-value" style={{ color: stats.newCount > 0 ? '#C45C5C' : undefined }}>
            {loading ? '…' : stats.newCount}
          </div>
          <div className="stat-breakdown">Awaiting first response</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">In Progress</div>
          <div className="stat-value" style={{ color: '#D4A853' }}>
            {loading ? '…' : stats.inProgCount}
          </div>
          <div className="stat-breakdown">Active conversations</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Resolution Rate</div>
          <div className="stat-value" style={{ color: '#4A7C59' }}>
            {loading ? '…' : `${stats.resolutionRate}%`}
          </div>
          <div className="stat-breakdown">
            {loading ? '' : `${stats.resolvedCount + stats.closedCount} resolved or closed`}
          </div>
        </div>
      </div>

      {/* ── Tabs ────────────────────────────────────────────────────────────── */}
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

      {/* ── Toolbar ─────────────────────────────────────────────────────────── */}
      <div className="toolbar">
        <div className="search-box">
          <Search size={18} color="#B8B8B8" />
          <input
            type="text"
            placeholder="Search by name, email, venue, or type…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="toolbar-actions">
          <button className="filter-btn"><Filter size={16} /> Filters</button>
        </div>
      </div>

      {/* ── Table ───────────────────────────────────────────────────────────── */}
      <div className="data-table-container">
        {error ? (
          <div style={{ padding: '40px 24px', textAlign: 'center', color: '#C45C5C', fontSize: 13 }}>
            Failed to load enquiries: {error}
          </div>
        ) : loading ? (
          <div style={{ padding: '60px 24px', textAlign: 'center', color: '#B8B8B8', fontSize: 13 }}>
            Loading enquiries…
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: '60px 24px', textAlign: 'center', color: '#B8B8B8', fontSize: 13 }}>
            {search ? 'No enquiries match your search.' : 'No enquiries found.'}
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Guest</th>
                <th>Venue</th>
                <th>Type</th>
                <th>Guests</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Date</th>
                <th style={{ width: 50 }}></th>
              </tr>
            </thead>
            <tbody>
              {pageItems.map(e => (
                <tr key={e.id}>
                  <td style={{ fontWeight: 500, fontSize: 11, fontFamily: 'monospace', letterSpacing: 1 }}>
                    {referenceId(e.id)}
                  </td>
                  <td>
                    <div style={{ fontWeight: 500 }}>{e.customer_name}</div>
                    <div style={{ fontSize: 12, color: '#B8B8B8' }}>{e.customer_email}</div>
                  </td>
                  <td>
                    <div>{e.venue_name}</div>
                    {e.venue_type && (
                      <div style={{ fontSize: 11, color: '#B8B8B8' }}>{e.venue_type}</div>
                    )}
                  </td>
                  <td style={{ fontSize: 13 }}>{e.enquiry_type}</td>
                  <td style={{ fontSize: 13 }}>
                    {e.guest_count} {e.guest_count === 1 ? 'guest' : 'guests'}
                  </td>
                  <td>
                    <span style={priorityStyle(e.priority)}>{normalisePriority(e.priority)}</span>
                  </td>
                  <td>
                    <span className={`status-badge ${statusStyle(e.status)}`}>
                      {statusIcon(e.status)} {normaliseStatus(e.status)}
                    </span>
                  </td>
                  <td style={{ fontSize: 12, color: '#B8B8B8' }}>{formatDate(e.created_at)}</td>
                  <td>
                    <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8, color: '#B8B8B8' }}>
                      <MoreHorizontal size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* ── Pagination ────────────────────────────────────────────────────── */}
        {!loading && !error && filtered.length > 0 && (
          <div className="pagination">
            <div className="pagination-info">
              Showing {Math.min((safePage - 1) * PAGE_SIZE + 1, filtered.length)}–{Math.min(safePage * PAGE_SIZE, filtered.length)} of {filtered.length} enquir{filtered.length !== 1 ? 'ies' : 'y'}
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
