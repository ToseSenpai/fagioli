import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Wrench,
  Users,
  Settings,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import clsx from 'clsx';

/**
 * Sidebar Component
 *
 * Navigation sidebar for staff dashboard
 *
 * Features:
 * - Logo and branding at top
 * - Main navigation links
 * - Logout button at bottom
 * - Collapsible on mobile (hamburger menu)
 * - Active state highlighting
 *
 * Accessibility:
 * - Keyboard navigation
 * - ARIA labels for buttons
 * - Focus management
 */

interface NavItem {
  label: string;
  path: string;
  icon: typeof LayoutDashboard;
  disabled?: boolean;
}

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    path: '/staff',
    icon: LayoutDashboard,
  },
  {
    label: 'Riparazioni',
    path: '/staff/repairs',
    icon: Wrench,
  },
  {
    label: 'Clienti',
    path: '/staff/customers',
    icon: Users,
    disabled: true, // Coming soon
  },
  {
    label: 'Impostazioni',
    path: '/staff/settings',
    icon: Settings,
    disabled: true, // Coming soon
  },
];

export function Sidebar() {
  const { logout, user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-slate-800 rounded-lg shadow-lg hover:bg-slate-700 transition text-gold-500 animate-fade-in"
        aria-label={isOpen ? 'Chiudi menu' : 'Apri menu'}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-70 z-30 animate-fade-in"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          'fixed lg:static inset-y-0 left-0 z-40',
          'w-64 bg-slate-900 border-r border-slate-700',
          'transform transition-transform duration-200 ease-in-out',
          'lg:transform-none',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="h-full flex flex-col">
          {/* Logo section */}
          <div className="p-6 border-b border-slate-700 animate-fade-in">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-gold-500 to-gold-600 rounded-lg flex items-center justify-center shadow-lg animate-glow-pulse">
                <Wrench className="w-6 h-6 text-slate-900" />
              </div>
              <div>
                <h2 className="font-bold text-white">Fagioli</h2>
                <p className="text-xs text-gold-500">Carrozzeria</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item, index) => {
              const Icon = item.icon;

              if (item.disabled) {
                return (
                  <div
                    key={item.path}
                    className="flex items-center gap-3 px-4 py-3 text-slate-500 cursor-not-allowed animate-fade-in-up"
                    style={{ animationDelay: `${index * 50}ms` }}
                    title="Prossimamente"
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                    <span className="ml-auto text-xs bg-slate-800 text-slate-400 px-2 py-1 rounded">
                      Presto
                    </span>
                  </div>
                );
              }

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/staff'}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    clsx(
                      'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
                      'border-l-4 animate-fade-in-up',
                      isActive
                        ? 'bg-slate-800 text-gold-500 font-medium border-gold-500 shadow-lg'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white border-transparent hover:border-slate-700'
                    )
                  }
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* User info and logout */}
          <div className="p-4 border-t border-slate-700 animate-fade-in">
            {user && (
              <div className="px-4 py-2 mb-2 bg-slate-800 rounded-lg border border-slate-700">
                <p className="text-sm font-medium text-white">{user.name}</p>
                <p className="text-xs text-slate-400">{user.email}</p>
              </div>
            )}
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-950 hover:text-red-300 rounded-lg transition-colors border border-transparent hover:border-red-800"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Esci</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
