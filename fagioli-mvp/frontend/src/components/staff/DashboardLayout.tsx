import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';

/**
 * DashboardLayout Component
 *
 * Main layout wrapper for staff dashboard pages
 * Includes sidebar navigation and content area
 *
 * Usage:
 * <DashboardLayout>
 *   <YourPageContent />
 * </DashboardLayout>
 */

export function DashboardLayout() {
  return (
    <div className="min-h-screen bg-slate-900 flex">
      <Sidebar />

      <main className="flex-1 overflow-x-hidden">
        {/* Page content */}
        <div className="p-6 lg:p-8 animate-fade-in">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
