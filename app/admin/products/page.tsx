"use client";
import { useState, useRef } from "react";
import { useProducts } from "@/lib/ProductContext";
import type { Product } from "@/lib/data";

const FRESH_CATEGORIES = ["Vegetables", "Fruit", "Herbs", "Chinese Veg", "Other"];
const PROCESSED_CATEGORIES = ["Potato Products", "Sweet Potato Products", "Pumpkin Products", "Onion Products", "Carrot Products", "Others"];

// Maps new product image blobs so the shop page can show them
export const customProductImages: Record<string, string> = {};

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className="relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors focus:outline-none"
      style={{ background: on ? "#1a4231" : "#D1D5DB" }}
    >
      <span
        className="inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform"
        style={{ transform: on ? "translateX(18px)" : "translateX(2px)" }}
      />
    </button>
  );
}

const BLANK = { name: "", unit: "", type: "fresh" as "fresh" | "processed", category: "", newCategory: "" };

function AddProductDrawer({ open, onClose, onAdd }: {
  open: boolean;
  onClose: () => void;
  onAdd: (p: Product, imageUrl?: string) => void;
}) {
  const [form, setForm] = useState(BLANK);
  const [useNewCategory, setUseNewCategory] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileRef = useRef<HTMLInputElement>(null);

  const categoryOptions = form.type === "fresh" ? FRESH_CATEGORIES : PROCESSED_CATEGORIES;

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImagePreview(url);
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Product name is required";
    if (!form.unit.trim()) e.unit = "Unit is required";
    const cat = useNewCategory ? form.newCategory.trim() : form.category;
    if (!cat) e.category = "Category is required";
    return e;
  }

  function handleSubmit() {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }

    const category = useNewCategory ? form.newCategory.trim() : form.category;
    const id = `custom-${Date.now()}`;
    onAdd(
      { id, name: form.name.trim(), unit: form.unit.trim(), type: form.type, category, active: true },
      imagePreview ?? undefined
    );
    setForm(BLANK);
    setUseNewCategory(false);
    setImagePreview(null);
    setErrors({});
    onClose();
  }

  function handleClose() {
    setForm(BLANK);
    setUseNewCategory(false);
    setImagePreview(null);
    setErrors({});
    onClose();
  }

  return (
    <>
      {/* Backdrop */}
      {open && <div className="fixed inset-0 z-40 bg-black/30" onClick={handleClose} />}

      {/* Drawer */}
      <div
        className="fixed top-0 right-0 h-full z-50 flex flex-col overflow-hidden transition-transform duration-300"
        style={{
          width: "420px",
          background: "#fdfdf9",
          boxShadow: "-8px 0 40px rgba(0,0,0,0.12)",
          transform: open ? "translateX(0)" : "translateX(100%)",
        }}
      >
        {/* Drawer header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Add New Product</h2>
            <p className="text-xs text-gray-400 mt-0.5">New products are visible to customers immediately</p>
          </div>
          <button onClick={handleClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form body */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">

          {/* Product name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1.5">Product Name *</label>
            <input
              type="text"
              placeholder="e.g. Heirloom Tomatoes"
              value={form.name}
              onChange={(e) => { setForm((f) => ({ ...f, name: e.target.value })); setErrors((er) => ({ ...er, name: "" })); }}
              className="w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none transition-colors"
              style={{ borderColor: errors.name ? "#DC2626" : "#E5E7EB", background: "white" }}
            />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
          </div>

          {/* Unit */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1.5">Unit *</label>
            <input
              type="text"
              placeholder="e.g. kg, bunch, 10kg case"
              value={form.unit}
              onChange={(e) => { setForm((f) => ({ ...f, unit: e.target.value })); setErrors((er) => ({ ...er, unit: "" })); }}
              className="w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none transition-colors"
              style={{ borderColor: errors.unit ? "#DC2626" : "#E5E7EB", background: "white" }}
            />
            {errors.unit && <p className="text-xs text-red-500 mt-1">{errors.unit}</p>}
          </div>

          {/* Type */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Product Type *</label>
            <div className="grid grid-cols-2 gap-2">
              {(["fresh", "processed"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => { setForm((f) => ({ ...f, type: t, category: "" })); setUseNewCategory(false); }}
                  className="py-3 rounded-xl text-sm font-bold uppercase tracking-widest transition-all border-2"
                  style={form.type === t
                    ? { background: "#d15111", color: "white", borderColor: "#d15111", boxShadow: "0 2px 12px rgba(209,81,17,0.3)" }
                    : { background: "white", color: "#d15111", borderColor: "#d15111" }}
                >
                  {t === "fresh" ? "Fresh" : "Processed"}
                </button>
              ))}
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Category *</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {categoryOptions.map((cat) => (
                <button
                  key={cat}
                  onClick={() => { setForm((f) => ({ ...f, category: cat })); setUseNewCategory(false); setErrors((er) => ({ ...er, category: "" })); }}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border"
                  style={!useNewCategory && form.category === cat
                    ? { background: "#1a4231", color: "white", borderColor: "#1a4231" }
                    : { background: "white", color: "#374151", borderColor: "#E5E7EB" }}
                >
                  {cat}
                </button>
              ))}
              <button
                onClick={() => { setUseNewCategory(true); setForm((f) => ({ ...f, category: "" })); setErrors((er) => ({ ...er, category: "" })); }}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border"
                style={useNewCategory
                  ? { background: "#1a4231", color: "white", borderColor: "#1a4231" }
                  : { background: "white", color: "#374151", borderColor: "#E5E7EB", borderStyle: "dashed" }}
              >
                + New category
              </button>
            </div>
            {useNewCategory && (
              <input
                type="text"
                placeholder="Category name"
                value={form.newCategory}
                onChange={(e) => { setForm((f) => ({ ...f, newCategory: e.target.value })); setErrors((er) => ({ ...er, category: "" })); }}
                className="w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none"
                style={{ borderColor: errors.category ? "#DC2626" : "#E5E7EB", background: "white" }}
                autoFocus
              />
            )}
            {errors.category && <p className="text-xs text-red-500 mt-1">{errors.category}</p>}
          </div>

          {/* Image upload */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Product Image <span className="normal-case font-normal text-gray-400">(optional)</span></label>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
            {imagePreview ? (
              <div className="relative w-full h-40 rounded-xl overflow-hidden border border-gray-100">
                <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
                <button
                  onClick={() => { setImagePreview(null); if (fileRef.current) fileRef.current.value = ""; }}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/50 flex items-center justify-center text-white"
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ) : (
              <button
                onClick={() => fileRef.current?.click()}
                className="w-full h-32 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-colors hover:border-gray-300"
                style={{ borderColor: "#E5E7EB" }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" />
                </svg>
                <span className="text-xs text-gray-400 font-medium">Click to upload image</span>
                <span className="text-[10px] text-gray-300">PNG, JPG, WEBP</span>
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex gap-3 shrink-0">
          <button
            onClick={handleClose}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white transition-all"
            style={{ background: "#1a4231", boxShadow: "0 2px 8px rgba(26,66,49,0.25)" }}
          >
            Add Product
          </button>
        </div>
      </div>
    </>
  );
}

export default function ProductsPage() {
  const [tab, setTab] = useState<"fresh" | "processed">("fresh");
  const [search, setSearch] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [addedToast, setAddedToast] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<{ id: string; name: string } | null>(null);
  const { allProducts, toggle, toggleCategory, isAvailable, availableCount, addProduct, deleteProduct } = useProducts();

  const categories = tab === "fresh" ? FRESH_CATEGORIES : PROCESSED_CATEGORIES;

  const filtered = allProducts.filter((p) => {
    const matchType = p.type === tab;
    const matchSearch = search === "" || p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  // Collect all categories including any custom ones
  const allCategories = Array.from(new Set([...categories, ...allProducts.filter((p) => p.type === tab).map((p) => p.category)]));

  const byCategory: Record<string, typeof allProducts> = {};
  for (const cat of allCategories) byCategory[cat] = [];
  for (const p of filtered) {
    if (!byCategory[p.category]) byCategory[p.category] = [];
    byCategory[p.category].push(p);
  }

  const freshCount = allProducts.filter((p) => p.type === "fresh" && isAvailable(p.id)).length;
  const freshTotal = allProducts.filter((p) => p.type === "fresh").length;
  const processedCount = allProducts.filter((p) => p.type === "processed" && isAvailable(p.id)).length;
  const processedTotal = allProducts.filter((p) => p.type === "processed").length;

  function handleAdd(p: Product, imageUrl?: string) {
    addProduct(p);
    if (imageUrl) customProductImages[p.id] = imageUrl;
    setAddedToast(p.name);
    setTimeout(() => setAddedToast(""), 3000);
    setTab(p.type);
  }

  function handleDeleteConfirmed() {
    if (!confirmDelete) return;
    deleteProduct(confirmDelete.id);
    delete customProductImages[confirmDelete.id];
    setConfirmDelete(null);
  }

  return (
    <div className="p-8">
      {/* Delete confirmation modal */}
      {confirmDelete && (
        <>
          <div className="fixed inset-0 z-50 bg-black/40" onClick={() => setConfirmDelete(null)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm">
              <div className="w-10 h-10 rounded-full flex items-center justify-center mb-4" style={{ background: "#FEE2E2" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4h6v2" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-1">Delete product?</h3>
              <p className="text-sm text-gray-500 mb-5">
                <strong className="text-gray-700">{confirmDelete.name}</strong> will be permanently removed from the catalogue and will no longer be visible to customers.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirmed}
                  className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white transition-colors"
                  style={{ background: "#DC2626" }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Toast */}
      {addedToast && (
        <div
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl text-sm font-semibold text-white shadow-xl"
          style={{ background: "#1a4231" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6L9 17l-5-5" />
          </svg>
          <span>"{addedToast}" added and live</span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Products</h1>
          <p className="text-gray-500 mt-0.5 text-sm">
            {availableCount} of {allProducts.length} products available to customers
          </p>
        </div>
        <button
          onClick={() => setDrawerOpen(true)}
          className="flex items-center gap-2 text-sm font-bold text-white px-5 py-2.5 rounded-xl transition-all"
          style={{ background: "#d15111", boxShadow: "0 2px 12px rgba(209,81,17,0.3)" }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
          New Product
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-5">
        <button
          onClick={() => setTab("fresh")}
          className="px-5 py-2 rounded-lg text-sm font-semibold transition-colors"
          style={tab === "fresh" ? { background: "#1a4231", color: "white" } : { background: "white", color: "#6B7280", border: "1px solid #E5E7EB" }}
        >
          Fresh Produce
          <span className="ml-2 text-xs font-medium opacity-75">{freshCount}/{freshTotal}</span>
        </button>
        <button
          onClick={() => setTab("processed")}
          className="px-5 py-2 rounded-lg text-sm font-semibold transition-colors"
          style={tab === "processed" ? { background: "#1a4231", color: "white" } : { background: "white", color: "#6B7280", border: "1px solid #E5E7EB" }}
        >
          Processed Products
          <span className="ml-2 text-xs font-medium opacity-75">{processedCount}/{processedTotal}</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
        </svg>
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-green-900/20"
        />
      </div>

      {/* Category sections */}
      <div className="space-y-4">
        {allCategories.map((cat) => {
          const catProducts = byCategory[cat] ?? [];
          if (catProducts.length === 0 && search !== "") return null;

          const allProductsInCat = allProducts.filter((p) => p.category === cat);
          const activeInCat = allProductsInCat.filter((p) => isAvailable(p.id)).length;
          const allOn = allProductsInCat.length > 0 && activeInCat === allProductsInCat.length;

          return (
            <div key={cat} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-5 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <span className="text-sm font-semibold text-gray-800">{cat}</span>
                  <span className="ml-2 text-xs text-gray-400">{activeInCat} / {allProductsInCat.length} available</span>
                </div>
                <button
                  onClick={() => toggleCategory(cat)}
                  className="text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors"
                  style={allOn
                    ? { background: "#FEE2E2", color: "#DC2626", borderColor: "#FECACA" }
                    : { background: "#edf3f0", color: "#1a4231", borderColor: "#a8ccb8" }}
                >
                  {allOn ? "Disable all" : "Enable all"}
                </button>
              </div>

              {catProducts.length === 0 ? (
                <p className="px-5 py-4 text-sm text-gray-400 italic">No products match your search in this category.</p>
              ) : (
                <div className="divide-y divide-gray-50">
                  {catProducts.map((product) => {
                    const on = isAvailable(product.id);
                    const isNew = product.id.startsWith("custom-");
                    return (
                      <div key={product.id} className={`flex items-center justify-between px-5 py-3 transition-colors ${on ? "" : "opacity-50"}`}>
                        <div className="flex items-center gap-3 min-w-0">
                          <Toggle on={on} onToggle={() => toggle(product.id)} />
                          <div className="min-w-0">
                            <span className="text-sm font-medium text-gray-900">{product.name}</span>
                            <span className="ml-2 text-xs text-gray-400">{product.unit}</span>
                            {isNew && (
                              <span className="ml-2 text-[10px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded" style={{ background: "#fdf0ea", color: "#d15111" }}>New</span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-3 shrink-0 ml-4">
                          <span
                            className="text-xs font-medium px-2 py-0.5 rounded-full"
                            style={on
                              ? { background: "#d4e8dc", color: "#059669" }
                              : { background: "#F3F4F6", color: "#9CA3AF" }}
                          >
                            {on ? "Available" : "Hidden"}
                          </span>
                          <button
                            onClick={() => setConfirmDelete({ id: product.id, name: product.name })}
                            className="w-7 h-7 flex items-center justify-center rounded-lg transition-colors text-gray-300 hover:text-red-400 hover:bg-red-50"
                            title="Delete product"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4h6v2" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <AddProductDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} onAdd={handleAdd} />
    </div>
  );
}
