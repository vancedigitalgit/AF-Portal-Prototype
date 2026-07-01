"use client";
import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import type { Product } from "./data";

export type CartItem = {
  product: Product;
  quantity: number;
};

export type CustomCartItem = {
  id: string;
  name: string;
  description: string;
  unit: string;
};

type CartContextType = {
  items: CartItem[];
  addItem: (product: Product, quantity: number) => void;
  updateQty: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  totalItems: number;
  itemNotes: Record<string, string>;
  setItemNote: (productId: string, note: string) => void;
  customItems: CustomCartItem[];
  addCustomItem: (name: string, description: string, unit: string) => void;
  removeCustomItem: (id: string) => void;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [itemNotes, setItemNotes] = useState<Record<string, string>>({});
  const [customItems, setCustomItems] = useState<CustomCartItem[]>([]);

  const addItem = useCallback((product: Product, quantity: number) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) => i.product.id === product.id ? { ...i, quantity: i.quantity + quantity } : i);
      }
      return [...prev, { product, quantity }];
    });
  }, []);

  const updateQty = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => i.product.id !== productId));
    } else {
      setItems((prev) => prev.map((i) => i.product.id === productId ? { ...i, quantity } : i));
    }
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => i.product.id !== productId));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    setItemNotes({});
    setCustomItems([]);
  }, []);

  const setItemNote = useCallback((productId: string, note: string) => {
    setItemNotes((prev) => ({ ...prev, [productId]: note }));
  }, []);

  const addCustomItem = useCallback((name: string, description: string, unit: string) => {
    setCustomItems((prev) => [...prev, { id: `ci-${Date.now()}`, name, description, unit }]);
  }, []);

  const removeCustomItem = useCallback((id: string) => {
    setCustomItems((prev) => prev.filter((ci) => ci.id !== id));
  }, []);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0) + customItems.length;

  return (
    <CartContext.Provider value={{
      items, addItem, updateQty, removeItem, clearCart, totalItems,
      itemNotes, setItemNote,
      customItems, addCustomItem, removeCustomItem,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
