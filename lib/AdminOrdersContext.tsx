"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import { orders as staticOrders } from "./data";
import type { Order, OrderStatus } from "./data";

type AdminOrdersContextType = {
  orders: Order[];
  updateStatus: (id: string, status: OrderStatus) => void;
  getOrder: (id: string) => Order | undefined;
};

const AdminOrdersContext = createContext<AdminOrdersContextType | null>(null);

export function AdminOrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>(staticOrders);

  function updateStatus(id: string, status: OrderStatus) {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  }

  function getOrder(id: string) {
    return orders.find((o) => o.id === id);
  }

  return (
    <AdminOrdersContext.Provider value={{ orders, updateStatus, getOrder }}>
      {children}
    </AdminOrdersContext.Provider>
  );
}

export function useAdminOrders() {
  const ctx = useContext(AdminOrdersContext);
  if (!ctx) throw new Error("useAdminOrders must be used within AdminOrdersProvider");
  return ctx;
}
