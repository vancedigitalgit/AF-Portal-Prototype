"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import { orders as staticOrders } from "./data";
import type { Order, OrderItem, OrderStatus } from "./data";

type ModifyPayload = {
  items?: OrderItem[];
  notes?: string;
  poNumber?: string;
};

type SharedOrdersContextType = {
  orders: Order[];
  addOrder: (order: Order) => void;
  updateStatus: (id: string, status: OrderStatus) => void;
  modifyOrder: (id: string, changes: ModifyPayload) => void;
  cancelOrder: (id: string) => void;
  getOrder: (id: string) => Order | undefined;
};

const SharedOrdersContext = createContext<SharedOrdersContextType | null>(null);

export function SharedOrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>(staticOrders);

  function addOrder(order: Order) {
    setOrders((prev) => [order, ...prev]);
  }

  function updateStatus(id: string, status: OrderStatus) {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  }

  function modifyOrder(id: string, changes: ModifyPayload) {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, ...changes } : o)));
  }

  function cancelOrder(id: string) {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: "cancelled" } : o)));
  }

  function getOrder(id: string) {
    return orders.find((o) => o.id === id);
  }

  return (
    <SharedOrdersContext.Provider value={{ orders, addOrder, updateStatus, modifyOrder, cancelOrder, getOrder }}>
      {children}
    </SharedOrdersContext.Provider>
  );
}

export function useSharedOrders() {
  const ctx = useContext(SharedOrdersContext);
  if (!ctx) throw new Error("useSharedOrders must be used within SharedOrdersProvider");
  return ctx;
}
