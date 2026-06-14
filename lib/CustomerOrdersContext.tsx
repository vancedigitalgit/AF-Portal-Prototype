"use client";
import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import { orders as staticOrders } from "@/lib/data";
import type { Order, OrderItem } from "@/lib/data";

type ModifyPayload = {
  items?: OrderItem[];
  notes?: string;
  poNumber?: string;
};

type CustomerOrdersContextType = {
  orders: Order[];
  modifyOrder: (id: string, changes: ModifyPayload) => void;
  cancelOrder: (id: string) => void;
  getOrder: (id: string) => Order | undefined;
};

const CustomerOrdersContext = createContext<CustomerOrdersContextType | null>(null);

export function useCustomerOrders() {
  const ctx = useContext(CustomerOrdersContext);
  if (!ctx) throw new Error("useCustomerOrders must be inside CustomerOrdersProvider");
  return ctx;
}

export function CustomerOrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>(staticOrders);

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
    <CustomerOrdersContext.Provider value={{ orders, modifyOrder, cancelOrder, getOrder }}>
      {children}
    </CustomerOrdersContext.Provider>
  );
}
