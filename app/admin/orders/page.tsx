"use client";
import { useState } from "react";
import Link from "next/link";
import { useAdminOrders } from "@/lib/AdminOrdersContext";

const statusStyles: Record<string, { bg: string; color: string; label: string }> = {
  new:       { bg: "#FEF3C7", color: "#D97706", label: "New" },
  printed:   { bg: "#DBEAFE", color: "#2563EB", label: "Printed" },
  done:      { bg: "#d4e8dc", color: "#059669", label: "Done" },
  cancelled: { bg: "#FEE2E2", color: "#DC2626", label: "Cancelled" },
};

type FilterKey = "all" | "new" | "printed" | "done";

export default function OrdersPage() {
  const { orders } = useAdminOrders();
  const [filter, setFilter] = useState<FilterKey>("all");

  const counts = {
    all: orders.length,
    new: orders.filter((o) => o.status === "new").length,
    printed: orders.filter((o) => o.status === "printed").length,
    done: orders.filter((o) => o.status === "done").length,
  };

  const displayed = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  const tabs: { key: FilterKey; label: string }[] = [
    { key: "all",     label: `All (${counts.all})` },
    { key: "new",     label: `New (${counts.new})` },
    { key: "printed", label: `Printed (${counts.printed})` },
    { key: "done",    label: `Done (${counts.done})` },
  ];

  return (
    <div className="p-4 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Orders</h1>
          <p className="text-gray-500 mt-0.5 text-sm">{orders.length} total orders</p>
        </div>
      </div>

      {/* Status filter tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            style={filter === tab.key
              ? { background: "#1a4231", color: "white" }
              : { background: "white", color: "#6B7280", border: "1px solid #E5E7EB" }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Orders table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full min-w-[640px]">
          <thead>
            <tr className="bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wide">
              <th className="px-6 py-3 text-left">Order ID</th>
              <th className="px-6 py-3 text-left">Customer</th>
              <th className="px-6 py-3 text-left">Items</th>
              <th className="px-6 py-3 text-left">Date &amp; Time</th>
              <th className="px-6 py-3 text-left">PO Number</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left"></th>
            </tr>
          </thead>
          <tbody>
            {displayed.map((order) => {
              const s = statusStyles[order.status] ?? statusStyles.new;
              return (
                <tr key={order.id} className="border-t border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <Link href={`/admin/orders/${order.id}`} className="text-sm font-semibold text-gray-900 hover:underline">
                      {order.id}
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-800">{order.customerName}</div>
                    <div className="text-xs text-gray-400">{order.customerType}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{order.items.length} items</td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-700">
                      {new Date(order.createdAt).toLocaleDateString("en-AU", { day: "numeric", month: "short" })}
                    </div>
                    <div className="text-xs text-gray-400">
                      {new Date(order.createdAt).toLocaleTimeString("en-AU", { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {order.poNumber ?? <span className="text-gray-300">—</span>}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-medium px-2.5 py-1 rounded-full" style={{ background: s.bg, color: s.color }}>
                      {s.label}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Link href={`/admin/orders/${order.id}`} className="text-sm font-medium hover:underline" style={{ color: "#1a4231" }}>
                      View
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
}
