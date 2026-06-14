"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import { products as staticProducts } from "./data";
import type { Product } from "./data";

type ProductContextType = {
  allProducts: Product[];
  available: Set<string>;
  toggle: (id: string) => void;
  toggleCategory: (category: string) => void;
  isAvailable: (id: string) => boolean;
  availableCount: number;
  addProduct: (p: Product) => void;
  deleteProduct: (id: string) => void;
  prices: Record<string, string>;
  setPrice: (id: string, price: string) => void;
};

const ProductContext = createContext<ProductContextType>({
  allProducts: staticProducts,
  available: new Set(),
  toggle: () => {},
  toggleCategory: () => {},
  isAvailable: () => true,
  availableCount: 0,
  addProduct: () => {},
  deleteProduct: () => {},
  prices: {},
  setPrice: () => {},
});

export function ProductProvider({ children }: { children: ReactNode }) {
  const [customProducts, setCustomProducts] = useState<Product[]>([]);
  const allProducts = [...staticProducts, ...customProducts];

  const [available, setAvailable] = useState<Set<string>>(
    () => new Set(staticProducts.filter((p) => p.active).map((p) => p.id))
  );

  const [prices, setPricesMap] = useState<Record<string, string>>({});

  function setPrice(id: string, price: string) {
    setPricesMap((prev) => ({ ...prev, [id]: price }));
  }

  function toggle(id: string) {
    setAvailable((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleCategory(category: string) {
    const catProducts = allProducts.filter((p) => p.category === category);
    const allOn = catProducts.every((p) => available.has(p.id));
    setAvailable((prev) => {
      const next = new Set(prev);
      for (const p of catProducts) {
        if (allOn) next.delete(p.id);
        else next.add(p.id);
      }
      return next;
    });
  }

  function isAvailable(id: string) {
    return available.has(id);
  }

  function addProduct(p: Product) {
    setCustomProducts((prev) => [...prev, p]);
    setAvailable((prev) => new Set([...prev, p.id]));
  }

  function deleteProduct(id: string) {
    setCustomProducts((prev) => prev.filter((p) => p.id !== id));
    setAvailable((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }

  return (
    <ProductContext.Provider value={{ allProducts, available, toggle, toggleCategory, isAvailable, availableCount: available.size, addProduct, deleteProduct, prices, setPrice }}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  return useContext(ProductContext);
}
