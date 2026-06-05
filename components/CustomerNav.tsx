"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/lib/CartContext";
import { useMessages } from "@/lib/MessagesContext";

export default function CustomerNav() {
  const pathname = usePathname();
  const { totalItems } = useCart();
  const { unreadCount } = useMessages();

  const links = [
    { href: "/customer/shop", label: "Order" },
    { href: "/customer/orders", label: "My Orders" },
    { href: "/customer/favourites", label: "Favourites" },
    { href: "/customer/notices", label: "Updates", badge: unreadCount },
  ];

  return (
    <nav className="sticky top-0 z-20 w-full border-b" style={{ background: "#1a4231", borderColor: "rgba(255,255,255,0.1)" }}>
      <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">

        {/* Logo */}
        <Link href="/customer/shop" className="shrink-0">
          <img src="/images/brand_logo_2.webp" alt="Adlees Fresh" className="h-16 w-auto object-contain" />
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-1">
          {links.map((link) => {
            const active = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className="relative px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors"
                style={active
                  ? { color: "#d15111", borderBottom: "2px solid #d15111", borderRadius: 0, paddingBottom: "calc(0.375rem - 2px)" }
                  : { color: "rgba(255,255,255,0.75)" }}
              >
                {link.label}
                {!!link.badge && link.badge > 0 && (
                  <span
                    className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-white text-[9px] flex items-center justify-center font-bold"
                    style={{ background: "#d15111" }}
                  >
                    {link.badge > 9 ? "9+" : link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Cart */}
          <Link
            href="/customer/cart"
            className="relative flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full border-2 transition-all hover:bg-white hover:text-brand-orange"
            style={{ color: "#d15111", borderColor: "#d15111" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" />
            </svg>
            Cart
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-white text-[10px] flex items-center justify-center font-bold" style={{ background: "#d15111" }}>
                {totalItems}
              </span>
            )}
          </Link>

          {/* Account */}
          <Link
            href="/customer/account"
            className="text-xs font-bold uppercase tracking-widest px-3 py-2 rounded-lg transition-colors"
            style={pathname.startsWith("/customer/account")
              ? { color: "#d15111" }
              : { color: "rgba(255,255,255,0.6)" }}
          >
            Account
          </Link>

          <span style={{ color: "rgba(255,255,255,0.2)" }}>|</span>

          <Link href="/login" className="text-xs font-medium transition-colors" style={{ color: "rgba(255,255,255,0.45)" }}>
            Switch view
          </Link>
        </div>
      </div>
    </nav>
  );
}
