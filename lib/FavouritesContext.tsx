"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import { products } from "./data";
import type { Product } from "./data";

export type FavouriteItem = {
  productId: string;
  productName: string;
  quantity: number;
  unit: string;
};

export type FavouriteList = {
  id: string;
  name: string;
  items: FavouriteItem[];
  createdAt: string;
};

type FavouritesContextType = {
  lists: FavouriteList[];
  createList: (name: string) => string;
  deleteList: (id: string) => void;
  renameList: (id: string, name: string) => void;
  addItemToList: (listId: string, product: Product, quantity: number) => void;
  removeItemFromList: (listId: string, productId: string) => void;
  updateItemQty: (listId: string, productId: string, quantity: number) => void;
  getListProducts: (listId: string) => (Product & { savedQty: number })[];
};

const MessagesContext = createContext<FavouritesContextType | null>(null);

const seedItems: FavouriteItem[] = [
  { productId: "f4",   productName: "Broccoli",                   quantity: 2, unit: "8kg case" },
  { productId: "f31",  productName: "Onions - Brown",             quantity: 1, unit: "20kg bag" },
  { productId: "f26",  productName: "Lettuce - Iceberg",          quantity: 2, unit: "12pk" },
  { productId: "f52",  productName: "Tomato - Roma",              quantity: 2, unit: "10kg case" },
  { productId: "f9",   productName: "Capsicum Red",               quantity: 1, unit: "8kg case" },
  { productId: "f105", productName: "Baby Spinach",               quantity: 3, unit: "1.5kg case" },
  { productId: "f61",  productName: "Bananas - Cavs + Lady Fingers", quantity: 1, unit: "case" },
  { productId: "f77",  productName: "Oranges - Navel",            quantity: 1, unit: "case" },
];

const seed: FavouriteList[] = [
  {
    id: "fav1",
    name: "Weekly Standard Order",
    items: seedItems,
    createdAt: "2026-05-01T08:00:00",
  },
];

export function FavouritesProvider({ children }: { children: ReactNode }) {
  const [lists, setLists] = useState<FavouriteList[]>(seed);

  function createList(name: string): string {
    const id = `fav${Date.now()}`;
    setLists((prev) => [
      ...prev,
      { id, name, items: [], createdAt: new Date().toISOString() },
    ]);
    return id;
  }

  function deleteList(id: string) {
    setLists((prev) => prev.filter((l) => l.id !== id));
  }

  function renameList(id: string, name: string) {
    setLists((prev) => prev.map((l) => (l.id === id ? { ...l, name } : l)));
  }

  function addItemToList(listId: string, product: Product, quantity: number) {
    setLists((prev) =>
      prev.map((l) => {
        if (l.id !== listId) return l;
        const existing = l.items.find((i) => i.productId === product.id);
        if (existing) {
          return { ...l, items: l.items.map((i) => i.productId === product.id ? { ...i, quantity: i.quantity + quantity } : i) };
        }
        return { ...l, items: [...l.items, { productId: product.id, productName: product.name, quantity, unit: product.unit }] };
      })
    );
  }

  function removeItemFromList(listId: string, productId: string) {
    setLists((prev) =>
      prev.map((l) =>
        l.id === listId ? { ...l, items: l.items.filter((i) => i.productId !== productId) } : l
      )
    );
  }

  function updateItemQty(listId: string, productId: string, quantity: number) {
    if (quantity <= 0) {
      removeItemFromList(listId, productId);
      return;
    }
    setLists((prev) =>
      prev.map((l) =>
        l.id === listId
          ? { ...l, items: l.items.map((i) => i.productId === productId ? { ...i, quantity } : i) }
          : l
      )
    );
  }

  function getListProducts(listId: string): (Product & { savedQty: number })[] {
    const list = lists.find((l) => l.id === listId);
    if (!list) return [];
    return list.items
      .map((item) => {
        const product = products.find((p) => p.id === item.productId);
        if (!product) return null;
        return { ...product, savedQty: item.quantity };
      })
      .filter(Boolean) as (Product & { savedQty: number })[];
  }

  return (
    <MessagesContext.Provider value={{ lists, createList, deleteList, renameList, addItemToList, removeItemFromList, updateItemQty, getListProducts }}>
      {children}
    </MessagesContext.Provider>
  );
}

export function useFavourites() {
  const ctx = useContext(MessagesContext);
  if (!ctx) throw new Error("useFavourites must be used within FavouritesProvider");
  return ctx;
}
