import { NavLink, Outlet, useLocation } from 'react-router-dom';
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
  LogOut,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
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
  const { user, signOut } = useAuth();
  const { venues } = useVenues();
  const { pathname, search } = useLocation();
  const currentPath = pathname + search;

  const userEmail = user?.email ?? 'Admin';
  const userInitial = userEmail.charAt(0).toUpperCase();

  // Dynamic counts
  const retreatCount = venues.filter(v => v.type === 'Retreat').length;
  const wellnessCount = venues.filter(v => v.type === 'Wellness').length;
  const totalVenuesCount = venues.length;

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo">The Global Sanctum</div>
          <div className="sidebar-subtitle">Internal Portal</div>
        </div>

        <nav className="sidebar-nav">
          {navSections.map((section, sIdx) => (
            <div className="nav-section" key={sIdx}>
              {section.title && (
                <div className="nav-section-title">{section.title}</div>
              )}
              {section.items.map((item) => {
                const isVenues = item.to === '/venues';
                const isParentActive =
                  (pathname.startsWith(item.to) && (item.to !== '/' || pathname === '/')) ||
                  (isVenues && (pathname === '/retreat-venues' || pathname === '/wellness-venues'));
                const badge = isVenues ? totalVenuesCount : item.badge;

                return (
                  <div key={item.to}>
                    <NavLink
                      to={item.to}
                      end={item.to === '/' || item.to === '/venues'}
                      className={`nav-item${isParentActive ? ' active' : ''}`}
                    >
                      <item.icon size={18} className="nav-icon" />
                      {item.label}
                      {badge !== undefined && <span className="nav-badge">{badge}</span>}
                    </NavLink>

                    {item.subItems && (
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

        <div className="user-menu">
          <div className="user-avatar">{userInitial}</div>
          <div className="user-menu-info">
            <div className="user-name">{userEmail}</div>
            <div className="user-role">Administrator</div>
          </div>
          <button className="user-logout-btn" onClick={signOut} title="Sign out">
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
