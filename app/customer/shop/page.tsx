"use client";
import { useState, useMemo } from "react";
import { useCart } from "@/lib/CartContext";
import { useProducts } from "@/lib/ProductContext";
import { productImages } from "@/lib/productImages";
import { customProductImages } from "@/app/admin/products/page";
import type { Product } from "@/lib/data";
import Link from "next/link";

const FRESH_CATEGORIES = ["All", "Vegetables", "Fruit", "Herbs", "Chinese Veg", "Other"];
const PROCESSED_CATEGORIES = ["All", "Potato Products", "Sweet Potato Products", "Pumpkin Products", "Onion Products", "Carrot Products", "Others"];

function categoryEmoji(category: string) {
  const map: Record<string, string> = {
    "Vegetables": "🥦", "Fruit": "🍊", "Herbs": "🌿", "Chinese Veg": "🥬",
    "Other": "🥚", "Potato Products": "🥔", "Sweet Potato Products": "🍠",
    "Pumpkin Products": "🎃", "Onion Products": "🧅", "Carrot Products": "🥕", "Others": "🔪",
  };
  return map[category] ?? "🌱";
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
          {added ? "Added ✓" : "Add to order"}
        </button>
      </div>

      {/* Note toggle — always available */}
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
            "{itemNotes[product.id]}"
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
      <div className="relative -mx-6 -mt-8 mb-8 overflow-hidden" style={{ height: "480px", marginLeft: "calc(-50vw + 50%)", marginRight: "calc(-50vw + 50%)", width: "100vw" }}>
        <img
          src="/images/farm_landscape_hero.webp"
          alt="Adlees Fresh farm"
          className="w-full h-full object-cover object-top"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(10,30,20,0.35) 0%, rgba(10,30,20,0.72) 100%)" }} />

        {/* Hero content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <p className="text-sm font-bold uppercase tracking-widest mb-3" style={{ color: "rgba(255,255,255,0.65)" }}>Wholesale Ordering Portal</p>
          <h1 className="text-5xl font-bold mb-3" style={{ letterSpacing: "-0.03em", color: "#d15111", textShadow: "0 2px 20px rgba(0,0,0,0.5)" }}>Place Your Order</h1>
          <p className="text-base mb-8" style={{ color: "rgba(255,255,255,0.85)" }}>
            Browse our range and add items to your order. Cut-off: <strong style={{ color: "white" }}>2:00 PM</strong> for next-day delivery.
          </p>

          {/* Search bar */}
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

        {/* Cart CTA floating top-right */}
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

      {/* Type tabs */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <button
          onClick={() => handleTabChange("fresh")}
          className="flex items-center justify-center gap-3 py-5 rounded-2xl font-bold text-base uppercase tracking-widest transition-all"
          style={tab === "fresh"
            ? { background: "#d15111", color: "white", boxShadow: "0 4px 20px rgba(209,81,17,0.35)" }
            : { background: "white", color: "#d15111", border: "2px solid #d15111" }}
        >
          {/* Carrot */}
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2c0 0-1 3-1 6s1 6 1 6" />
            <path d="M10 4c-1-1-3-1-4 0" />
            <path d="M14 4c1-1 3-1 4 0" />
            <path d="M12 14c-3 0-7 3-8 8h16c-1-5-5-8-8-8z" />
          </svg>
          Fresh Produce
        </button>
        <button
          onClick={() => handleTabChange("processed")}
          className="flex items-center justify-center gap-3 py-5 rounded-2xl font-bold text-base uppercase tracking-widest transition-all"
          style={tab === "processed"
            ? { background: "#d15111", color: "white", boxShadow: "0 4px 20px rgba(209,81,17,0.35)" }
            : { background: "white", color: "#d15111", border: "2px solid #d15111" }}
        >
          {/* Chef's knife */}
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 21l9-9" />
            <path d="M12.5 3.5l8 8-9 9L3 12l7-8.5z" />
            <path d="M15 6l3 3" />
          </svg>
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
              ? { background: "#1a4231", color: "white" }
              : { background: "white", color: "#6B7280", border: "1px solid #E5E7EB" }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg font-medium">No products available</p>
          <p className="text-sm mt-1">Try a different category or search term.</p>
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
