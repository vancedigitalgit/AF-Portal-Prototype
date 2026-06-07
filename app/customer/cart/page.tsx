"use client";
import { useState, useMemo } from "react";
import { useCart } from "@/lib/CartContext";
import { productImages } from "@/lib/productImages";
import Link from "next/link";

// Preferred delivery days for the demo customer (Tue, Thu from account settings)
const PREFERRED_DAYS = [2, 4]; // 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri

function getDeliveryOptions(): { date: Date; label: string; dayName: string; preferred: boolean }[] {
  const options = [];
  const today = new Date();
  today.setHours(14, 0, 0, 0); // 2pm cutoff
  const now = new Date();
  // Start from tomorrow, or day-after if past cutoff
  const start = new Date(now);
  start.setDate(start.getDate() + (now >= today ? 2 : 1));

  let d = new Date(start);
  while (options.length < 5) {
    const dow = d.getDay();
    if (dow !== 0 && dow !== 6) { // skip weekends
      options.push({
        date: new Date(d),
        label: d.toLocaleDateString("en-AU", { day: "numeric", month: "short" }),
        dayName: d.toLocaleDateString("en-AU", { weekday: "short" }),
        preferred: PREFERRED_DAYS.includes(dow),
      });
    }
    d.setDate(d.getDate() + 1);
  }
  return options;
}

export default function CartPage() {
  const { items, updateQty, removeItem, clearCart, totalItems, itemNotes, setItemNote } = useCart();
  const [notes, setNotes] = useState("");
  const [expandedNotes, setExpandedNotes] = useState<Set<string>>(new Set());
  const [deliveryDate, setDeliveryDate] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submittedDate, setSubmittedDate] = useState("");

  function toggleItemNote(id: string) {
    setExpandedNotes((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const deliveryOptions = useMemo(() => getDeliveryOptions(), []);

  function handleSubmit() {
    if (!deliveryDate) return;
    setSubmittedDate(deliveryDate);
    setSubmitted(true);
    clearCart();
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mb-5" style={{ background: "#edf3f0" }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1a4231" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Order placed!</h1>
        <p className="text-gray-500 mb-2">Your order has been received by the Adlees Fresh team.</p>
        <p className="text-sm text-gray-400 mb-8">
          Delivery requested for <strong className="text-gray-600">{submittedDate}</strong>. You&apos;ll get a confirmation from the team shortly.
        </p>
        <div className="flex gap-3">
          <Link href="/customer/orders" className="text-sm font-medium px-5 py-2.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-gray-700">
            View my orders
          </Link>
          <Link href="/customer/shop" className="text-sm font-semibold text-white px-5 py-2.5 rounded-lg transition-opacity hover:opacity-90" style={{ background: "#1a4231" }}>
            Place another order
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mb-5 bg-gray-100">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-6 text-sm">Add products from the order page to get started.</p>
        <Link href="/customer/shop" className="text-sm font-semibold text-white px-5 py-2.5 rounded-lg" style={{ background: "#1a4231" }}>
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Your Order</h1>
        <Link href="/customer/shop" className="text-sm font-medium" style={{ color: "#1a4231" }}>
          + Add more items
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Items list */}
        <div className="col-span-2 space-y-3">
          {items.map(({ product, quantity }) => {
            const noteOpen = expandedNotes.has(product.id);
            const hasNote = !!itemNotes[product.id]?.trim();
            return (
              <div key={product.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden transition-all" style={{ borderColor: noteOpen ? "#d15111" : undefined }}>
                <div className="p-4 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0" style={{ background: "#edf3f0" }}>
                    {productImages[product.id] ? (
                      <img src={productImages[product.id]} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xl">🥦</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900">{product.name}</p>
                    <p className="text-xs text-gray-400">per {product.unit}</p>
                    <button
                      onClick={() => toggleItemNote(product.id)}
                      className="flex items-center gap-1 mt-1 text-xs font-medium transition-colors"
                      style={{ color: hasNote || noteOpen ? "#d15111" : "#9CA3AF" }}
                    >
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                      </svg>
                      {hasNote ? "Edit note" : noteOpen ? "Cancel" : "Add note"}
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                      <button onClick={() => updateQty(product.id, quantity - 1)} className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors">−</button>
                      <span className="w-8 text-center text-sm font-medium text-gray-900">{quantity}</span>
                      <button onClick={() => updateQty(product.id, quantity + 1)} className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors">+</button>
                    </div>
                    <button
                      onClick={() => removeItem(product.id)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-300 hover:text-red-400 hover:bg-red-50 transition-colors"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4h6v2" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Inline note */}
                {noteOpen && (
                  <div className="px-4 pb-4 pt-0">
                    <textarea
                      autoFocus
                      placeholder={`Note for ${product.name} — e.g. "no red ones", "cut in half", "call if unavailable"…`}
                      value={itemNotes[product.id] ?? ""}
                      onChange={(e) => setItemNote(product.id, e.target.value)}
                      rows={2}
                      className="w-full text-xs border rounded-lg p-2.5 resize-none focus:outline-none transition-colors"
                      style={{ borderColor: "#d15111", background: "#fdf0ea", color: "#374151" }}
                    />
                  </div>
                )}

                {/* Saved note preview (when collapsed but note exists) */}
                {!noteOpen && hasNote && (
                  <div className="px-4 pb-3 flex items-start gap-1.5">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#d15111" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0">
                      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                    </svg>
                    <p className="text-xs text-gray-500 italic">"{itemNotes[product.id]}"</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h2 className="font-semibold text-gray-900 mb-3">Order summary</h2>
            <div className="space-y-2.5 mb-4">
              {items.map(({ product, quantity }) => (
                <div key={product.id}>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 truncate mr-2">{product.name}</span>
                    <span className="text-gray-900 font-medium shrink-0">{quantity} {product.unit}</span>
                  </div>
                  {itemNotes[product.id]?.trim() && (
                    <p className="text-[10px] italic mt-0.5 truncate" style={{ color: "#d15111" }}>
                      ↳ {itemNotes[product.id]}
                    </p>
                  )}
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 pt-3 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total items</span>
                <span className="font-semibold text-gray-900">{totalItems}</span>
              </div>
            </div>

            {/* Delivery day picker */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-medium text-gray-600">Delivery date</label>
                <span className="text-xs text-gray-400">Cut-off 2:00 PM</span>
              </div>
              <div className="grid grid-cols-5 gap-1.5">
                {deliveryOptions.map((opt) => {
                  const key = opt.label;
                  const active = deliveryDate === key;
                  return (
                    <button
                      key={key}
                      onClick={() => setDeliveryDate(key)}
                      className="flex flex-col items-center py-2.5 px-1 rounded-xl border text-center transition-all"
                      style={active
                        ? { background: "#1a4231", borderColor: "#1a4231", color: "white" }
                        : opt.preferred
                          ? { background: "#edf3f0", borderColor: "#86EFAC", color: "#1a4231" }
                          : { background: "white", borderColor: "#E5E7EB", color: "#6B7280" }}
                    >
                      <span className="text-[10px] font-semibold uppercase tracking-wide leading-none mb-1">{opt.dayName}</span>
                      <span className="text-xs font-bold leading-none">{opt.date.getDate()}</span>
                      <span className="text-[9px] leading-none mt-0.5 opacity-75">{opt.date.toLocaleDateString("en-AU", { month: "short" })}</span>
                      {opt.preferred && !active && (
                        <span className="mt-1 w-1 h-1 rounded-full" style={{ background: "#1a4231" }} />
                      )}
                    </button>
                  );
                })}
              </div>
              {!deliveryDate && (
                <p className="text-xs text-orange-500 mt-1.5">Please select a delivery date.</p>
              )}
              {deliveryDate && (
                <p className="text-xs mt-1.5" style={{ color: "#1a4231" }}>
                  Delivering {deliveryDate} — order by 2:00 PM the day before.
                </p>
              )}
            </div>

            <div className="mb-4">
              <label className="text-xs font-medium text-gray-600 block mb-1.5">Delivery notes (optional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any special instructions..."
                className="w-full text-sm border border-gray-200 rounded-lg p-2.5 resize-none focus:outline-none focus:ring-2 focus:ring-green-900/20"
                rows={2}
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={!deliveryDate}
              className="w-full text-sm font-semibold text-white py-3 rounded-xl transition-all disabled:opacity-40"
              style={{ background: "#1a4231" }}
            >
              Place order
            </button>
            <p className="text-xs text-gray-400 text-center mt-2">No payment required — invoice sent separately.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
