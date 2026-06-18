"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
      </svg>
    ),
  },
  {
    label: "Orders",
    href: "/admin/orders",
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" /><rect x="9" y="3" width="6" height="4" rx="1" /><path d="M9 12h6M9 16h4" />
      </svg>
    ),
  },
  {
    label: "Products",
    href: "/admin/products",
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
      </svg>
    ),
  },
  {
    label: "Customers",
    href: "/admin/customers",
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
  },
  {
    label: "Messages",
    href: "/admin/messages",
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
      </svg>
    ),
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="px-5 py-4 border-b" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
        <img src="/images/brand_logo_2.webp" alt="Adlees Fresh" className="h-16 w-auto object-contain" />
        <div className="text-[10px] uppercase tracking-widest font-semibold mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>Business Portal</div>
      </div>

      {/* Main nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <p className="text-[10px] font-bold uppercase tracking-widest px-3 mb-3" style={{ color: "rgba(255,255,255,0.35)" }}>Management</p>
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold mb-0.5 transition-all"
              style={isActive
                ? { background: "rgba(255,255,255,0.12)", color: "white", borderLeft: "3px solid #d15111", paddingLeft: "calc(0.75rem - 3px)" }
                : { color: "rgba(255,255,255,0.6)" }}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
        <Link href="/login" className="flex items-center gap-2 text-xs font-medium transition-colors" style={{ color: "rgba(255,255,255,0.4)" }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
          </svg>
          Switch view
        </Link>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 flex items-center justify-center rounded-lg shadow-lg"
        style={{ background: "#1a4231" }}
        onClick={() => setMobileOpen(true)}
        aria-label="Open menu"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
          <path d="M3 6h18M3 12h18M3 18h18" />
        </svg>
      </button>

      {/* Mobile overlay backdrop */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40"
          style={{ background: "rgba(0,0,0,0.5)" }}
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full flex flex-col z-50 transition-transform duration-300 ease-in-out ${mobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
        style={{ width: "260px", background: "#1a4231" }}
      >
        {/* Mobile close button */}
        <button
          className="lg:hidden absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg transition-colors"
          style={{ color: "rgba(255,255,255,0.5)" }}
          onClick={() => setMobileOpen(false)}
          aria-label="Close menu"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        {sidebarContent}
      </aside>
    </>
  );
}
