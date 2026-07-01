"use client";
import { useState, useMemo } from "react";
import { useCart } from "@/lib/CartContext";
import { useProducts } from "@/lib/ProductContext";
import { useMessages } from "@/lib/MessagesContext";
import { productImages } from "@/lib/productImages";
import { customProductImages } from "@/app/admin/products/page";
import type { Product } from "@/lib/data";
import Link from "next/link";

const FRESH_CATEGORIES = ["All", "Vegetables", "Fruit", "Herbs", "Chinese Veg", "Other", "Not Listed"];
const PROCESSED_CATEGORIES = ["All", "Potato Products", "Sweet Potato Products", "Pumpkin Products", "Onion Products", "Carrot Products", "Others", "Not Listed"];

function categoryEmoji(category: string) {
  const map: Record<string, string> = {
    "Vegetables": "🥦", "Fruit": "🍊", "Herbs": "🌿", "Chinese Veg": "🥬",
    "Other": "🥚", "Potato Products": "🥔", "Sweet Potato Products": "🍠",
    "Pumpkin Products": "🎃", "Onion Products": "🧅", "Carrot Products": "🥕", "Others": "🔪",
  };
  return map[category] ?? "🌱";
}

function NoticeTypeIcon({ type }: { type: string }) {
  if (type === "alert") return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
  if (type === "warning") return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  );
}

function NoticesBanner() {
  const { notices, unreadCount } = useMessages();
  const [dismissed, setDismissed] = useState(false);

  const pinned = notices.filter((n) => n.pinned);
  const visible = pinned.length > 0 ? pinned : notices.slice(0, 2);

  if (dismissed || visible.length === 0) return null;

  return (
    <div className="mb-6 rounded-2xl border overflow-hidden" style={{ borderColor: "#FCD34D", background: "#FFFBEB" }}>
      <div className="flex items-center justify-between px-5 py-3" style={{ borderBottom: "1px solid #FDE68A" }}>
        <div className="flex items-center gap-2">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />
          </svg>
          <span className="text-sm font-bold" style={{ color: "#92400E" }}>Notices</span>
          {unreadCount > 0 && (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full text-white" style={{ background: "#D97706" }}>{unreadCount}</span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <Link href="/customer/notices" className="text-xs font-semibold hover:underline" style={{ color: "#B45309" }}>
            See all →
          </Link>
          <button
            onClick={() => setDismissed(true)}
            className="w-6 h-6 flex items-center justify-center rounded-full text-amber-400 hover:text-amber-600 hover:bg-amber-100 transition-colors"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
      <div>
        {visible.map((notice, i) => (
          <div
            key={notice.id}
            className="px-5 py-3.5 flex items-start gap-3"
            style={i > 0 ? { borderTop: "1px solid #FEF3C7" } : undefined}
          >
            <div className="mt-0.5 shrink-0"><NoticeTypeIcon type={notice.type} /></div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 leading-tight">{notice.title}</p>
              <p className="text-xs text-gray-600 mt-0.5 leading-relaxed line-clamp-2">{notice.body}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CustomItemForm() {
  const { addCustomItem } = useCart();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [unit, setUnit] = useState("");
  const [added, setAdded] = useState(false);

  function handleAdd() {
    if (!name.trim() || !unit.trim()) return;
    addCustomItem(name.trim(), description.trim(), unit.trim());
    setAdded(true);
    setName("");
    setDescription("");
    setUnit("");
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="max-w-lg mx-auto">
      <div className="rounded-2xl border-2 border-dashed p-6" style={{ borderColor: "#d15111", background: "#fdf8f6" }}>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(209,81,17,0.1)" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d15111" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900">Item not listed?</p>
            <p className="text-xs text-gray-500 mt-0.5">Tell us what you need and we&apos;ll confirm availability.</p>
          </div>
        </div>

        {added ? (
          <div className="text-center py-4">
            <div className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3" style={{ background: "#d4e8dc" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-gray-900">Added to your order</p>
            <p className="text-xs text-gray-500 mt-1">Need something else? The form will reset shortly…</p>
          </div>
        ) : (
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">
                Item name <span style={{ color: "#d15111" }}>*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Silverbeet"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-sm border rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2"
                style={{ borderColor: "#E5E7EB", ["--tw-ring-color" as string]: "#d15111" }}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">
                Description <span className="font-normal text-gray-400">(optional)</span>
              </label>
              <textarea
                placeholder='e.g. "3 bunches — not too big, ready to cook"'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                className="w-full text-sm border rounded-lg px-3 py-2.5 resize-none focus:outline-none focus:ring-2"
                style={{ borderColor: "#E5E7EB", ["--tw-ring-color" as string]: "#d15111" }}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">
                Unit <span style={{ color: "#d15111" }}>*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. bunch, kg, case"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full text-sm border rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2"
                style={{ borderColor: "#E5E7EB", ["--tw-ring-color" as string]: "#d15111" }}
              />
            </div>
            <button
              onClick={handleAdd}
              disabled={!name.trim() || !unit.trim()}
              className="w-full text-sm font-semibold py-2.5 rounded-xl text-white transition-all disabled:opacity-40"
              style={{ background: "#1a4231" }}
            >
              Add to order
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  const { addItem, items, itemNotes, setItemNote } = useCart();
  const { prices } = useProducts();
  const price = prices[product.id];
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [noteOpen, setNoteOpen] = useState(false);

  const inCart = items.some((i) => i.product.id === product.id);
  const hasNote = !!itemNotes[product.id]?.trim();

  function handleAdd() {
    addItem(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <div>
      {price && (
        <p className="text-sm font-semibold mt-1.5" style={{ color: "#1a4231" }}>${price}</p>
      )}
      <div className="flex items-center gap-2 mt-3">
        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
          <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors">−</button>
          <span className="w-8 text-center text-sm font-medium text-gray-900">{qty}</span>
          <button onClick={() => setQty((q) => q + 1)} className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors">+</button>
        </div>
        <button
          onClick={handleAdd}
          className="flex-1 text-sm font-semibold py-2 px-3 rounded-lg transition-all text-white"
          style={{ background: added ? "#059669" : "#1a4231" }}
        >
          {added ? "Added ✓" : <><span className="sm:hidden">Add</span><span className="hidden sm:inline">Add to order</span></>}
        </button>
      </div>

      <div className="mt-2">
        <button
          onClick={() => setNoteOpen((o) => !o)}
          className="flex items-center gap-1 text-xs font-medium transition-colors"
          style={{ color: hasNote || noteOpen ? "#d15111" : "#9CA3AF" }}
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
          </svg>
          {hasNote ? "Edit note" : noteOpen ? "Cancel" : "Add note"}
          {!inCart && !hasNote && !noteOpen && <span className="ml-0.5 opacity-60">(saved with order)</span>}
        </button>

        {noteOpen && (
          <textarea
            autoFocus
            placeholder={`Note for ${product.name} — e.g. "extra ripe", "no red ones"…`}
            value={itemNotes[product.id] ?? ""}
            onChange={(e) => setItemNote(product.id, e.target.value)}
            rows={2}
            className="w-full mt-1.5 text-xs border rounded-lg p-2 resize-none focus:outline-none transition-colors"
            style={{ borderColor: "#d15111", background: "#fdf0ea", color: "#374151" }}
          />
        )}

        {!noteOpen && hasNote && (
          <p className="text-xs italic mt-1" style={{ color: "#d15111" }}>
            &ldquo;{itemNotes[product.id]}&rdquo;
          </p>
        )}
      </div>
    </div>
  );
}

export default function ShopPage() {
  const [tab, setTab] = useState<"fresh" | "processed">("fresh");
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const { totalItems } = useCart();
  const { allProducts, isAvailable } = useProducts();

  const categories = tab === "fresh" ? FRESH_CATEGORIES : PROCESSED_CATEGORIES;

  const filtered = useMemo(() => {
    if (activeCategory === "Not Listed") return [];
    return allProducts.filter((p) => {
      if (!isAvailable(p.id)) return false;
      if (p.type !== tab) return false;
      if (activeCategory !== "All" && p.category !== activeCategory) return false;
      if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [tab, activeCategory, search, isAvailable]);

  function handleTabChange(newTab: "fresh" | "processed") {
    setTab(newTab);
    setActiveCategory("All");
  }

  return (
    <div>
      {/* Hero — full viewport width */}
      <div className="relative -mx-6 -mt-8 mb-8 overflow-hidden" style={{ height: "clamp(280px, 50vw, 480px)", marginLeft: "calc(-50vw + 50%)", marginRight: "calc(-50vw + 50%)", width: "100vw" }}>
        <img
          src="/images/farm_landscape_hero.webp"
          alt="Adlees Fresh farm"
          className="w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(10,30,20,0.35) 0%, rgba(10,30,20,0.72) 100%)" }} />

        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <p className="text-sm font-bold uppercase tracking-widest mb-3" style={{ color: "rgba(255,255,255,0.65)" }}>Wholesale Ordering Portal</p>
          <h1 className="text-3xl md:text-5xl font-bold mb-3" style={{ letterSpacing: "-0.03em", color: "#d15111", textShadow: "0 2px 20px rgba(0,0,0,0.5)" }}>Place Your Order</h1>
          <p className="text-base mb-8" style={{ color: "rgba(255,255,255,0.85)" }}>
            Browse our range and add items to your order. Cut-off: <strong style={{ color: "white" }}>4:00 PM</strong> for next-day delivery.
          </p>

          <div className="w-full max-w-2xl">
            <div
              className="flex items-center gap-3 px-5 py-4 rounded-2xl transition-all"
              style={{
                background: "rgba(10,30,20,0.55)",
                border: "2px solid #d15111",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                boxShadow: "0 0 0 1px rgba(209,81,17,0.25), 0 12px 40px rgba(0,0,0,0.35)",
              }}
            >
              <svg className="shrink-0" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d15111" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
              </svg>
              <input
                type="text"
                placeholder="Search products — tomatoes, carrots, diced pumpkin…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="hero-search flex-1 bg-transparent text-sm outline-none"
                style={{ color: "white" }}
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-colors"
                  style={{ background: "rgba(209,81,17,0.3)", color: "#d15111" }}
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>

        {totalItems > 0 && (
          <Link
            href="/customer/cart"
            className="absolute top-4 right-6 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white px-4 py-2 rounded-full transition-all"
            style={{ background: "#d15111", boxShadow: "0 2px 12px rgba(209,81,17,0.5)" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" />
            </svg>
            Cart ({totalItems})
          </Link>
        )}
      </div>

      {/* Notices banner */}
      <NoticesBanner />

      {/* Type tabs */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <button
          onClick={() => handleTabChange("fresh")}
          className="flex items-center justify-center gap-3 py-5 rounded-2xl font-bold text-base uppercase tracking-widest transition-all"
          style={tab === "fresh"
            ? { background: "#d15111", color: "white", boxShadow: "0 4px 20px rgba(209,81,17,0.35)" }
            : { background: "white", color: "#d15111", border: "2px solid #d15111" }}
        >
          Fresh Produce
        </button>
        <button
          onClick={() => handleTabChange("processed")}
          className="flex items-center justify-center gap-3 py-5 rounded-2xl font-bold text-base uppercase tracking-widest transition-all"
          style={tab === "processed"
            ? { background: "#d15111", color: "white", boxShadow: "0 4px 20px rgba(209,81,17,0.35)" }
            : { background: "white", color: "#d15111", border: "2px solid #d15111" }}
        >
          Processed Products
        </button>
      </div>

      {/* Category filters */}
      <div className="flex gap-2 mb-6 flex-wrap justify-center">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            style={activeCategory === cat
              ? { background: cat === "Not Listed" ? "#d15111" : "#1a4231", color: "white" }
              : cat === "Not Listed"
                ? { background: "white", color: "#d15111", border: "1px dashed #d15111" }
                : { background: "white", color: "#6B7280", border: "1px solid #E5E7EB" }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Content area */}
      {activeCategory === "Not Listed" ? (
        <CustomItemForm />
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <p className="text-lg font-medium">
            {search ? `No products found for "${search}"` : "No products available"}
          </p>
          {!search && <p className="text-sm mt-1">Try a different category or search term.</p>}
          {search && (
            <div className="mt-8">
              <p className="text-sm text-gray-500 mb-6">Can&apos;t find what you need? Request it below:</p>
              <CustomItemForm />
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((product) => (
            <div key={product.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-shadow">
              <div className="w-full h-28 rounded-lg mb-3 overflow-hidden" style={{ background: "#edf3f0" }}>
                {(productImages[product.id] || customProductImages[product.id]) ? (
                  <img src={customProductImages[product.id] ?? productImages[product.id]} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-3xl">{categoryEmoji(product.category)}</span>
                  </div>
                )}
              </div>
              <div>
                <div className="text-xs font-medium mb-0.5" style={{ color: "#1a4231" }}>{product.category}</div>
                <h3 className="text-sm font-semibold text-gray-900 leading-tight">{product.name}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{product.unit}</p>
              </div>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
