import { NavLink, Outlet } from 'react-router-dom';
import {
  LayoutGrid,
  Home,
  CalendarDays,
  MessageSquare,
  User,
  Globe,
  Users,
  CreditCard,
  DollarSign,
  Compass,
  BookOpen,
  BarChart3,
  Settings,
} from 'lucide-react';

const navSections = [
  {
    items: [
      { to: '/', icon: LayoutGrid, label: 'Dashboard' },
    ],
  },
  {
    title: 'Manage',
    items: [
      { to: '/venues', icon: Home, label: 'Venues', badge: '47' },
      { to: '/enquiries', icon: MessageSquare, label: 'Enquiries', badge: '5' },
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
              {section.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    `nav-item${isActive ? ' active' : ''}`
                  }
                >
                  <item.icon size={18} className="nav-icon" />
                  {item.label}
                  {item.badge && <span className="nav-badge">{item.badge}</span>}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        <div className="user-menu">
          <div className="user-avatar">K</div>
          <div>
            <div className="user-name">Kate</div>
            <div className="user-role">Administrator</div>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
