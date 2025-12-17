"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ClipboardList,
  LogOut,
  Car,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

const NAV_ITEMS = [
  {
    href: "/staff",
    label: "Dashboard",
    icon: LayoutDashboard,
    description: "Panoramica",
  },
  {
    href: "/staff/pratiche",
    label: "Pratiche",
    icon: ClipboardList,
    description: "Gestione",
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("staff_logged_in");
    window.location.href = "/staff/login";
  };

  const NavContent = () => (
    <>
      {/* Logo */}
      <div className="p-5 border-b border-sidebar-border">
        <Link href="/staff" className="flex items-center gap-3">
          <div className="w-11 h-11 bg-gradient-to-br from-primary to-orange-500 rounded-xl flex items-center justify-center shadow-brand">
            <Car className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-sidebar-foreground">
              Fagioli
            </h1>
            <p className="text-xs text-sidebar-foreground/60">Staff Dashboard</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        <p className="px-3 py-2 text-xs font-semibold text-sidebar-foreground/40 uppercase tracking-wider">
          Menu
        </p>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== "/staff" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all group ${
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              }`}
            >
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                  isActive
                    ? "bg-white/20"
                    : "bg-sidebar-accent group-hover:bg-sidebar-primary/10"
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <span className="font-medium block">{item.label}</span>
                <span
                  className={`text-xs ${
                    isActive ? "text-white/70" : "text-sidebar-foreground/50"
                  }`}
                >
                  {item.description}
                </span>
              </div>
              {isActive && (
                <ChevronRight className="w-4 h-4 text-white/70" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="p-3 rounded-xl bg-sidebar-accent/50 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-sidebar-primary rounded-full flex items-center justify-center">
              <span className="text-sm font-bold text-sidebar-primary-foreground">
                SF
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sidebar-foreground text-sm truncate">
                Staff Fagioli
              </p>
              <p className="text-xs text-sidebar-foreground/50">Operatore</p>
            </div>
          </div>
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start text-sidebar-foreground/70 hover:text-red-400 hover:bg-red-500/10"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5 mr-3" />
          Esci
        </Button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 glass border-b border-border/50 px-4 py-3 flex items-center justify-between">
        <Link href="/staff" className="flex items-center gap-2">
          <div className="w-9 h-9 bg-gradient-to-br from-primary to-orange-500 rounded-lg flex items-center justify-center shadow-brand">
            <Car className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-foreground">Fagioli Staff</span>
        </Link>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="text-muted-foreground"
        >
          {mobileOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </Button>
      </div>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={`lg:hidden fixed top-0 left-0 z-50 h-full w-72 bg-sidebar transform transition-transform duration-300 ease-out ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <NavContent />
        </div>
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-72 lg:fixed lg:inset-y-0 bg-sidebar border-r border-sidebar-border">
        <NavContent />
      </aside>
    </>
  );
}
