"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFavourites } from "@/lib/FavouritesContext";
import { useCart } from "@/lib/CartContext";
import { useProducts } from "@/lib/ProductContext";
import { products } from "@/lib/data";
import type { Product } from "@/lib/data";

function AddListToCartButton({ listId }: { listId: string }) {
  const { getListProducts } = useFavourites();
  const { addItem } = useCart();
  const { isAvailable } = useProducts();
  const router = useRouter();
  const [done, setDone] = useState(false);

  function handle() {
    const items = getListProducts(listId);
    let skipped = 0;
    for (const item of items) {
      if (!isAvailable(item.id)) { skipped++; continue; }
      addItem(item, item.savedQty);
    }
    setDone(true);
    setTimeout(() => {
      router.push("/customer/cart");
    }, 800);
  }

  return (
    <button
      onClick={handle}
      className="flex items-center gap-1.5 text-sm font-semibold text-white px-4 py-2 rounded-lg transition-all"
      style={{ background: done ? "#059669" : "#1a4231" }}
    >
      {done ? "Added ✓" : (
        <>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" />
          </svg>
          Add to cart
        </>
      )}
    </button>
  );
}

function ProductSearch({ listId, onClose }: { listId: string; onClose: () => void }) {
  const [search, setSearch] = useState("");
  const [qty, setQty] = useState<Record<string, number>>({});
  const { addItemToList, lists } = useFavourites();
  const list = lists.find((l) => l.id === listId);

  const existingIds = new Set(list?.items.map((i) => i.productId) ?? []);

  const filtered = search.length > 1
    ? products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()) && !existingIds.has(p.id)).slice(0, 8)
    : [];

  function add(product: Product) {
    addItemToList(listId, product, qty[product.id] ?? 1);
    setSearch("");
  }

  return (
    <div className="mt-4 pt-4 border-t border-gray-100">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Add a product</p>
        <button onClick={onClose} className="text-xs text-gray-400 hover:text-gray-600">Done</button>
      </div>
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
          {filtered.map((product) => (
            <div key={product.id} className="flex items-center justify-between px-3 py-2">
              <div>
                <span className="text-sm text-gray-800">{product.name}</span>
                <span className="text-xs text-gray-400 ml-2">{product.unit}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                  <button onClick={() => setQty((q) => ({ ...q, [product.id]: Math.max(1, (q[product.id] ?? 1) - 1) }))} className="w-6 h-6 flex items-center justify-center text-gray-500 hover:bg-gray-50 text-xs">−</button>
                  <span className="w-6 text-center text-xs font-medium">{qty[product.id] ?? 1}</span>
                  <button onClick={() => setQty((q) => ({ ...q, [product.id]: (q[product.id] ?? 1) + 1 }))} className="w-6 h-6 flex items-center justify-center text-gray-500 hover:bg-gray-50 text-xs">+</button>
                </div>
                <button onClick={() => add(product)} className="text-xs font-semibold px-2.5 py-1 rounded-lg text-white" style={{ background: "#1a4231" }}>Add</button>
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

export default function FavouritesPage() {
  const { lists, createList, deleteList, renameList, removeItemFromList, updateItemQty } = useFavourites();
  const [newListName, setNewListName] = useState("");
  const [addingToList, setAddingToList] = useState<string | null>(null);
  const [renamingList, setRenamingList] = useState<string | null>(null);
  const [renameVal, setRenameVal] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  function handleCreate() {
    const name = newListName.trim();
    if (!name) return;
    createList(name);
    setNewListName("");
  }

  function handleRenameStart(list: typeof lists[0]) {
    setRenamingList(list.id);
    setRenameVal(list.name);
  }

  function handleRenameConfirm(id: string) {
    if (renameVal.trim()) renameList(id, renameVal.trim());
    setRenamingList(null);
  }

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Favourite Orders</h1>
          <p className="text-gray-500 mt-1 text-sm">Save your regular order as a list and add it to your cart in one click.</p>
        </div>
      </div>

      {/* Create new list */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-6">
        <p className="text-sm font-semibold text-gray-700 mb-3">Create a new list</p>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="e.g. Weekly café order, Monday delivery..."
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-900/20"
          />
          <button
            onClick={handleCreate}
            disabled={!newListName.trim()}
            className="text-sm font-semibold text-white px-4 py-2 rounded-lg disabled:opacity-40 transition-opacity"
            style={{ background: "#1a4231" }}
          >
            Create
          </button>
        </div>
      </div>

      {/* Lists */}
      {lists.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg font-medium">No saved lists yet</p>
          <p className="text-sm mt-1">Create one above to get started.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {lists.map((list) => (
            <div key={list.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              {/* List header */}
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  {renamingList === list.id ? (
                    <div className="flex items-center gap-2">
                      <input
                        autoFocus
                        value={renameVal}
                        onChange={(e) => setRenameVal(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter") handleRenameConfirm(list.id); if (e.key === "Escape") setRenamingList(null); }}
                        className="px-2 py-1 rounded-lg border border-gray-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-green-900/20"
                      />
                      <button onClick={() => handleRenameConfirm(list.id)} className="text-xs font-semibold text-green-700 hover:text-green-900">Save</button>
                      <button onClick={() => setRenamingList(null)} className="text-xs text-gray-400 hover:text-gray-600">Cancel</button>
                    </div>
                  ) : (
                    <>
                      <h3 className="text-sm font-semibold text-gray-900 truncate">{list.name}</h3>
                      <span className="text-xs text-gray-400 shrink-0">{list.items.length} item{list.items.length !== 1 ? "s" : ""}</span>
                    </>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-4">
                  {renamingList !== list.id && (
                    <button onClick={() => handleRenameStart(list)} className="text-xs text-gray-400 hover:text-gray-600 px-2 py-1 rounded-lg hover:bg-gray-50 transition-colors">Rename</button>
                  )}
                  {confirmDelete === list.id ? (
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-gray-500">Delete this list?</span>
                      <button onClick={() => { deleteList(list.id); setConfirmDelete(null); }} className="text-xs font-semibold text-red-600 hover:text-red-800">Yes</button>
                      <button onClick={() => setConfirmDelete(null)} className="text-xs text-gray-400 hover:text-gray-600">No</button>
                    </div>
                  ) : (
                    <button onClick={() => setConfirmDelete(list.id)} className="text-xs text-gray-400 hover:text-red-500 px-2 py-1 rounded-lg hover:bg-red-50 transition-colors">Delete</button>
                  )}
                  <AddListToCartButton listId={list.id} />
                </div>
              </div>

              {/* Items */}
              <div className="divide-y divide-gray-50">
                {list.items.length === 0 ? (
                  <p className="px-5 py-4 text-sm text-gray-400 italic">No items yet — add products below.</p>
                ) : (
                  list.items.map((item) => (
                    <div key={item.productId} className="flex items-center justify-between px-5 py-3">
                      <div>
                        <span className="text-sm text-gray-800">{item.productName}</span>
                        <span className="text-xs text-gray-400 ml-2">{item.unit}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                          <button onClick={() => updateItemQty(list.id, item.productId, item.quantity - 1)} className="w-7 h-7 flex items-center justify-center text-gray-500 hover:bg-gray-50 text-sm">−</button>
                          <span className="w-7 text-center text-sm font-medium text-gray-900">{item.quantity}</span>
                          <button onClick={() => updateItemQty(list.id, item.productId, item.quantity + 1)} className="w-7 h-7 flex items-center justify-center text-gray-500 hover:bg-gray-50 text-sm">+</button>
                        </div>
                        <button onClick={() => removeItemFromList(list.id, item.productId)} className="text-gray-300 hover:text-red-400 transition-colors">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Add product toggle */}
              {addingToList === list.id ? (
                <div className="px-5 pb-5">
                  <ProductSearch listId={list.id} onClose={() => setAddingToList(null)} />
                </div>
              ) : (
                <div className="px-5 py-3 border-t border-gray-50">
                  <button
                    onClick={() => setAddingToList(list.id)}
                    className="text-xs font-medium flex items-center gap-1.5 transition-colors"
                    style={{ color: "#1a4231" }}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                    Add product
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
