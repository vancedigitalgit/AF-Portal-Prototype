"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { products } from "@/lib/data";
import type { Product, OrderItem } from "@/lib/data";
import { useCustomerOrders } from "@/lib/CustomerOrdersContext";
import { useCart } from "@/lib/CartContext";
import { useProducts } from "@/lib/ProductContext";

const statusStyles: Record<string, { bg: string; color: string; label: string }> = {
  new:       { bg: "#FEF3C7", color: "#D97706", label: "Received" },
  printed:   { bg: "#EDE9FE", color: "#7C3AED", label: "Being prepared" },
  done:      { bg: "#d4e8dc", color: "#059669", label: "Delivered" },
  cancelled: { bg: "#FEE2E2", color: "#DC2626", label: "Cancelled" },
};

function ProductSearch({ onAdd, existingIds }: { onAdd: (p: Product, qty: number) => void; existingIds: Set<string> }) {
  const [search, setSearch] = useState("");
  const [qty, setQty] = useState<Record<string, number>>({});

  const filtered = search.length > 1
    ? products.filter((p) => p.active && p.name.toLowerCase().includes(search.toLowerCase()) && !existingIds.has(p.id)).slice(0, 8)
    : [];

  function handleAdd(p: Product) {
    onAdd(p, qty[p.id] ?? 1);
    setSearch("");
  }

  return (
    <div className="mt-4 pt-4 border-t border-gray-100">
      <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">Add a product</p>
      <div className="relative">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
        </svg>
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-8 pr-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-900/20"
        />
      </div>
      {filtered.length > 0 && (
        <div className="mt-2 border border-gray-100 rounded-lg divide-y divide-gray-50 overflow-hidden">
          {filtered.map((p) => (
            <div key={p.id} className="flex items-center justify-between px-3 py-2">
              <div>
                <span className="text-sm text-gray-800">{p.name}</span>
                <span className="text-xs text-gray-400 ml-2">{p.unit}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                  <button onClick={() => setQty((q) => ({ ...q, [p.id]: Math.max(1, (q[p.id] ?? 1) - 1) }))} className="w-6 h-6 flex items-center justify-center text-gray-500 hover:bg-gray-50 text-xs">−</button>
                  <span className="w-6 text-center text-xs font-medium">{qty[p.id] ?? 1}</span>
                  <button onClick={() => setQty((q) => ({ ...q, [p.id]: (q[p.id] ?? 1) + 1 }))} className="w-6 h-6 flex items-center justify-center text-gray-500 hover:bg-gray-50 text-xs">+</button>
                </div>
                <button onClick={() => handleAdd(p)} className="text-xs font-semibold px-2.5 py-1 rounded-lg text-white" style={{ background: "#1a4231" }}>Add</button>
              </div>
            </div>
          ))}
        </div>
      )}
      {search.length > 1 && filtered.length === 0 && (
        <p className="text-xs text-gray-400 mt-2 px-1">No products found.</p>
      )}
    </div>
  );
}

export default function CustomerOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { getOrder, modifyOrder, cancelOrder } = useCustomerOrders();
  const { addItem } = useCart();
  const { isAvailable } = useProducts();
  const router = useRouter();
  const orderData = getOrder(id);

  const [editing, setEditing] = useState(false);
  const [editItems, setEditItems] = useState<OrderItem[]>([]);
  const [editNotes, setEditNotes] = useState("");
  const [editPo, setEditPo] = useState("");
  const [expandedNotes, setExpandedNotes] = useState<Set<string>>(new Set());
  const [saved, setSaved] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [reorderSkipped, setReorderSkipped] = useState<string[]>([]);
  const [showReorderNotice, setShowReorderNotice] = useState(false);

  if (!orderData) {
    return (
      <div className="text-center py-16 text-gray-400">
        <p className="text-base font-medium">Order not found.</p>
        <Link href="/customer/orders" className="text-sm mt-3 inline-block font-medium" style={{ color: "#1a4231" }}>
          ← Back to orders
        </Link>
      </div>
    );
  }

  const order = orderData;
  const now = new Date();
  const cutoffPassed = now.getHours() >= 22;
  const orderCutoffPassed = now.getHours() >= 16;
  const canEdit = order.status === "new" && !cutoffPassed;
  const canCancel = order.status === "new" && !orderCutoffPassed;
  const s = statusStyles[order.status];

  function startEdit() {
    setEditItems(order.items.map((i) => ({ ...i })));
    setEditNotes(order.notes ?? "");
    setEditPo(order.poNumber ?? "");
    setExpandedNotes(new Set());
    setSaved(false);
    setEditing(true);
  }

  function handleSave() {
    modifyOrder(order.id, {
      items: editItems,
      notes: editNotes,
      poNumber: editPo || undefined,
    });
    setSaved(true);
    setEditing(false);
  }

  function handleDiscard() {
    setEditing(false);
  }

  function updateQty(productId: string, qty: number) {
    if (qty < 1) return;
    setEditItems((prev) => prev.map((i) => i.productId === productId ? { ...i, quantity: qty } : i));
  }

  function removeItem(productId: string) {
    setEditItems((prev) => prev.filter((i) => i.productId !== productId));
    setExpandedNotes((prev) => { const n = new Set(prev); n.delete(productId); return n; });
  }

  function addProduct(p: Product, qty: number) {
    setEditItems((prev) => {
      const existing = prev.find((i) => i.productId === p.id);
      if (existing) return prev.map((i) => i.productId === p.id ? { ...i, quantity: i.quantity + qty } : i);
      return [...prev, { productId: p.id, productName: p.name, quantity: qty, unit: p.unit }];
    });
  }

  function setItemNote(productId: string, note: string) {
    setEditItems((prev) => prev.map((i) => i.productId === productId ? { ...i, note } : i));
  }

  function toggleNote(productId: string) {
    setExpandedNotes((prev) => {
      const n = new Set(prev);
      if (n.has(productId)) n.delete(productId); else n.add(productId);
      return n;
    });
  }

  function handleReorder() {
    const unavailable: string[] = [];
    for (const item of order.items) {
      const product = products.find((p) => p.id === item.productId);
      if (!product) continue;
      if (!isAvailable(product.id)) { unavailable.push(item.productName); continue; }
      addItem(product, item.quantity);
    }
    if (unavailable.length > 0) {
      setReorderSkipped(unavailable);
      setShowReorderNotice(true);
      setTimeout(() => { setShowReorderNotice(false); router.push("/customer/cart"); }, 2800);
    } else {
      router.push("/customer/cart");
    }
  }

  function handleCancelConfirm() {
    cancelOrder(order.id);
    setConfirmCancel(false);
  }

  const displayItems = editing ? editItems : order.items;

  return (
    <div className="max-w-2xl">
      {/* Back */}
      <Link
        href="/customer/orders"
        className="inline-flex items-center gap-1.5 text-sm mb-6 font-medium hover:opacity-80 transition-opacity"
        style={{ color: "#1a4231" }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Back to orders
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between mb-6 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h1 className="text-2xl font-semibold text-gray-900">{order.id}</h1>
            <span className="text-xs font-medium px-2.5 py-1 rounded-full" style={{ background: s.bg, color: s.color }}>
              {s.label}
            </span>
          </div>
          <p className="text-sm text-gray-400">
            Placed {new Date(order.createdAt).toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" })}
            {" · "}
            {new Date(order.createdAt).toLocaleTimeString("en-AU", { hour: "2-digit", minute: "2-digit" })}
          </p>
        </div>

        {/* Action buttons */}
        {!editing && (
          <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end relative">
            <div className="relative">
              <button
                onClick={handleReorder}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors"
                style={{ background: "#edf3f0", color: "#1a4231", borderColor: "#a8ccb8" }}
              >
                Reorder
              </button>
              {showReorderNotice && (
                <div className="absolute right-0 top-9 z-10 w-64 rounded-xl shadow-lg border border-orange-100 p-3 text-xs" style={{ background: "#FFFBEB" }}>
                  <p className="font-semibold text-orange-700 mb-1">Some items unavailable</p>
                  <p className="text-orange-600 leading-snug">
                    {reorderSkipped.join(", ")} {reorderSkipped.length === 1 ? "was" : "were"} skipped. Taking you to the cart…
                  </p>
                </div>
              )}
            </div>
            {canEdit && (
              <button
                onClick={startEdit}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg border-2 transition-colors hover:bg-orange-50"
                style={{ borderColor: "#d15111", color: "#d15111" }}
              >
                Edit order
              </button>
            )}
            {canCancel && (
              confirmCancel ? (
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-gray-500">Cancel this order?</span>
                  <button onClick={handleCancelConfirm} className="font-semibold text-red-600 hover:text-red-800">Yes</button>
                  <button onClick={() => setConfirmCancel(false)} className="text-gray-400 hover:text-gray-600">No</button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmCancel(true)}
                  className="text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors hover:bg-red-50 hover:border-red-200"
                  style={{ color: "#DC2626", borderColor: "#E5E7EB" }}
                >
                  Cancel order
                </button>
              )
            )}
          </div>
        )}
      </div>

      {/* Save confirmation */}
      {saved && (
        <div className="mb-4 rounded-xl px-4 py-3 text-sm font-medium flex items-center gap-2" style={{ background: "#edf3f0", color: "#1a4231" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Changes saved.
        </div>
      )}

      {/* Lock banners */}
      {!canEdit && order.status === "new" && cutoffPassed && (
        <div className="mb-4 rounded-xl px-4 py-3 text-sm border border-orange-100" style={{ background: "#FFFBEB", color: "#92400E" }}>
          The 10:00 PM modification cut-off has passed. Call us if you need to make an urgent change.
        </div>
      )}
      {!canEdit && (order.status === "printed" || order.status === "done") && (
        <div className="mb-4 rounded-xl px-4 py-3 text-sm border border-blue-100" style={{ background: "#EFF6FF", color: "#1E40AF" }}>
          This order is already being prepared and can no longer be modified.
        </div>
      )}

      {/* Items */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden mb-4">
        <div className="px-5 py-4 border-b border-gray-100">
          <p className="text-sm font-semibold text-gray-700">Items ({displayItems.length})</p>
        </div>
        <div className="divide-y divide-gray-50">
          {displayItems.length === 0 ? (
            <p className="px-5 py-4 text-sm text-gray-400 italic">No items — add at least one product before saving.</p>
          ) : (
            displayItems.map((item) => {
              const noteOpen = expandedNotes.has(item.productId);
              const hasNote = !!item.note?.trim();
              return (
                <div key={item.productId} className="px-5 py-3">
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <div>
                        <span className="text-sm text-gray-800">{item.productName}</span>
                        <span className="text-xs text-gray-400 ml-2">{item.unit}</span>
                      </div>
                      {editing && (
                        <button
                          onClick={() => toggleNote(item.productId)}
                          className="flex items-center gap-1 mt-0.5 text-xs font-medium transition-colors"
                          style={{ color: hasNote || noteOpen ? "#d15111" : "#9CA3AF" }}
                        >
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                          </svg>
                          {hasNote ? "Edit note" : noteOpen ? "Cancel" : "Add note"}
                        </button>
                      )}
                      {!editing && hasNote && (
                        <p className="text-xs italic mt-0.5" style={{ color: "#d15111" }}>"{item.note}"</p>
                      )}
                    </div>
                    {editing ? (
                      <div className="flex items-center gap-3 shrink-0 ml-4">
                        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                          <button onClick={() => updateQty(item.productId, item.quantity - 1)} className="w-7 h-7 flex items-center justify-center text-gray-500 hover:bg-gray-50 text-sm">−</button>
                          <span className="w-7 text-center text-sm font-medium text-gray-900">{item.quantity}</span>
                          <button onClick={() => updateQty(item.productId, item.quantity + 1)} className="w-7 h-7 flex items-center justify-center text-gray-500 hover:bg-gray-50 text-sm">+</button>
                        </div>
                        <button onClick={() => removeItem(item.productId)} className="text-gray-300 hover:text-red-400 transition-colors">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <span className="text-sm font-medium text-gray-600 tabular-nums shrink-0 ml-4">{item.quantity} × {item.unit}</span>
                    )}
                  </div>
                  {editing && noteOpen && (
                    <textarea
                      autoFocus
                      placeholder={`Note for ${item.productName} — e.g. "extra ripe", "firm only", "half bags"…`}
                      value={item.note ?? ""}
                      onChange={(e) => setItemNote(item.productId, e.target.value)}
                      rows={2}
                      className="w-full mt-2 text-xs border rounded-lg p-2 resize-none focus:outline-none"
                      style={{ borderColor: "#d15111", background: "#fdf0ea", color: "#374151" }}
                    />
                  )}
                  {editing && !noteOpen && hasNote && (
                    <p className="text-xs italic mt-1" style={{ color: "#d15111" }}>"{item.note}"</p>
                  )}
                </div>
              );
            })
          )}
        </div>
        {editing && (
          <div className="px-5 pb-5">
            <ProductSearch
              onAdd={addProduct}
              existingIds={new Set(editItems.map((i) => i.productId))}
            />
          </div>
        )}
      </div>

      {/* Notes & PO */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-6">
        <p className="text-sm font-semibold text-gray-700 mb-3">Notes & reference</p>
        {editing ? (
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-gray-600 block mb-1">Delivery notes</label>
              <textarea
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
                placeholder="Any special instructions..."
                rows={2}
                className="w-full text-sm border border-gray-200 rounded-lg p-2.5 resize-none focus:outline-none focus:ring-2 focus:ring-green-900/20"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 block mb-1">
                PO Number <span className="text-[10px] font-normal text-gray-400">(optional)</span>
              </label>
              <input
                type="text"
                value={editPo}
                onChange={(e) => setEditPo(e.target.value)}
                placeholder="e.g. PO-8821"
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-900/20"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {order.notes ? (
              <p className="text-sm text-gray-600 italic">&ldquo;{order.notes}&rdquo;</p>
            ) : (
              <p className="text-sm text-gray-400 italic">No delivery notes.</p>
            )}
            {order.poNumber && (
              <p className="text-xs text-gray-500 mt-1">
                PO: <span className="font-semibold text-gray-700">{order.poNumber}</span>
              </p>
            )}
          </div>
        )}
      </div>

      {/* Edit save/discard */}
      {editing && (
        <div className="flex gap-3">
          <button
            onClick={handleSave}
            disabled={editItems.length === 0}
            className="flex-1 text-sm font-semibold text-white py-3 rounded-xl disabled:opacity-40 transition-all"
            style={{ background: "#1a4231" }}
          >
            Save changes
          </button>
          <button
            onClick={handleDiscard}
            className="px-6 text-sm font-medium py-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors text-gray-600"
          >
            Discard
          </button>
        </div>
      )}
    </div>
  );
}
