import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  LayoutGrid,
  Home,
  MessageSquare,
  CalendarCheck,
  User,
  Globe,
  Users,
  CreditCard,
  DollarSign,
  Compass,
  BookOpen,
  BarChart3,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import { useVenues } from '../context/VenueContext';

interface NavSubItem {
  to: string;
  label: string;
  badge?: string | number;
  badgeStyle?: string;
}

interface NavItem {
  to: string;
  icon: LucideIcon;
  label: string;
  badge?: string | number;
  subItems?: NavSubItem[];
}

interface NavSection {
  title?: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    items: [
      { to: '/', icon: LayoutGrid, label: 'Dashboard' },
    ],
  },
  {
    title: 'Manage',
    items: [
      {
        to: '/venues',
        icon: Home,
        label: 'Venues',
        subItems: [
          { to: '/retreat-venues', label: 'Retreat Venues', badge: 0 },
          { to: '/wellness-venues', label: 'Wellness Venues', badge: 0, badgeStyle: 'wellness' },
        ]
      },
      { to: '/enquiries', icon: MessageSquare, label: 'Enquiries', badge: '5' },
      { to: '/bookings', icon: CalendarCheck, label: 'Bookings' },
    ],
  },
  {
    title: 'Contacts',
    items: [
      { to: '/venue-owners', icon: User, label: 'Venue Owners' },
      { to: '/retreat-hosts', icon: Globe, label: 'Retreat Hosts' },
      { to: '/wellness-guests', icon: Users, label: 'Wellness Guests' },
    ],
  },
  {
    title: 'Finance',
    items: [
      { to: '/subscriptions', icon: CreditCard, label: 'Subscriptions' },
      { to: '/payments', icon: DollarSign, label: 'Payments' },
    ],
  },
  {
    title: 'Content',
    items: [
      { to: '/wellness-edit', icon: Compass, label: 'Wellness Edit' },
      { to: '/sanctum-journal', icon: BookOpen, label: 'Sanctum Journal' },
    ],
  },
  {
    title: 'Insights',
    items: [
      { to: '/analytics', icon: BarChart3, label: 'Analytics' },
    ],
  },
  {
    title: 'Team',
    items: [
      { to: '/users', icon: Users, label: 'Users' },
    ],
  },
  {
    items: [
      { to: '/settings', icon: Settings, label: 'Settings' },
    ],
  },
];

export default function Layout() {
  const { venues } = useVenues();
  const { pathname, search } = useLocation();
  const currentPath = pathname + search;
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [venuesExpanded, setVenuesExpanded] = useState(false);

  // Dynamic counts
  const retreatCount = venues.filter(v => v.type === 'Retreat').length;
  const wellnessCount = venues.filter(v => v.type === 'Wellness').length;
  const totalVenuesCount = venues.length;

  return (
    <div className={`app-container${sidebarCollapsed ? ' sidebar-collapsed' : ''}`}>
      <aside className={`sidebar${sidebarCollapsed ? ' collapsed' : ''}`}>
        <div className="sidebar-header">
          {!sidebarCollapsed && (
            <>
              <div className="sidebar-logo">The Global Sanctum</div>
              <div className="sidebar-subtitle">Internal Portal</div>
            </>
          )}
          <button
            className="sidebar-toggle-btn"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {sidebarCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
          </button>
        </div>

        <nav className="sidebar-nav">
          {navSections.map((section, sIdx) => (
            <div className="nav-section" key={sIdx}>
              {section.title && (
                <div className="nav-section-title">{section.title}</div>
              )}
              {section.items.map((item) => {
                const isVenues = item.to === '/venues';
                const hasSubItems = Boolean(item.subItems && item.subItems.length > 0);
                const isParentActive =
                  (pathname.startsWith(item.to) && (item.to !== '/' || pathname === '/')) ||
                  (isVenues && (pathname === '/retreat-venues' || pathname === '/wellness-venues'));
                const badge = isVenues ? totalVenuesCount : item.badge;

                const handleParentClick = (e: React.MouseEvent) => {
                  if (hasSubItems) {
                    e.preventDefault(); // Stop navigation, just toggle expand
                    if (isVenues) setVenuesExpanded(!venuesExpanded);
                  }
                };

                return (
                  <div key={item.to}>
                    <NavLink
                      to={item.to}
                      end={item.to === '/' || item.to === '/venues'}
                      className={`nav-item${isParentActive ? ' active' : ''}`}
                      title={sidebarCollapsed ? item.label : undefined}
                      onClick={handleParentClick}
                    >
                      <item.icon size={18} className="nav-icon" />
                      {!sidebarCollapsed && item.label}

                      {!sidebarCollapsed && (
                        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {badge !== undefined && <span className="nav-badge">{badge}</span>}
                          {hasSubItems && (
                            <span style={{ color: '#B8B8B8', display: 'flex' }}>
                              {isVenues && venuesExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                            </span>
                          )}
                        </div>
                      )}
                    </NavLink>

                    {item.subItems && !sidebarCollapsed && (isVenues ? venuesExpanded : true) && (
                      <div className="nav-subitems">
                        {item.subItems.map((sub) => {
                          const subBadge = sub.label.includes('Retreat') ? retreatCount :
                            sub.label.includes('Wellness') ? wellnessCount : sub.badge;
                          const isActive = currentPath === sub.to;

                          return (
                            <NavLink
                              key={sub.to}
                              to={sub.to}
                              className={`nav-subitem${isActive ? ' active' : ''}`}
                            >
                              <span className="nav-subitem-dot"></span>
                              {sub.label}
                              {subBadge !== undefined && (
                                <span className={`nav-badge ${sub.badgeStyle || ''}`} style={{ marginLeft: 'auto', fontSize: '10px', padding: '2px 6px' }}>
                                  {subBadge}
                                </span>
                              )}
                            </NavLink>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </nav>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
