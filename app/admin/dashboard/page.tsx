"use client";
import Link from "next/link";
import { useAdminOrders } from "@/lib/AdminOrdersContext";
import { customers, products } from "@/lib/data";

function todayDateString() {
  return new Date().toISOString().slice(0, 10);
}

const STATUS_STYLES: Record<string, { bg: string; color: string; label: string }> = {
  new:       { bg: "#FEF3C7", color: "#D97706", label: "New" },
  printed:   { bg: "#DBEAFE", color: "#2563EB", label: "Printed" },
  done:      { bg: "#d4e8dc", color: "#059669", label: "Done" },
  cancelled: { bg: "#FEE2E2", color: "#DC2626", label: "Cancelled" },
};

export default function DashboardPage() {
  const { orders } = useAdminOrders();
  const today = todayDateString();

  const todayOrders = orders.filter((o) => o.createdAt.startsWith(today));
  const newCount = todayOrders.filter((o) => o.status === "new").length;
  const printedCount = todayOrders.filter((o) => o.status === "printed" || o.status === "done").length;
  const doneCount = todayOrders.filter((o) => o.status === "done").length;
  const totalToday = todayOrders.length;

  const todayLabel = new Date().toLocaleDateString("en-AU", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Good morning, Adam</h1>
        <p className="text-gray-500 mt-1">{todayLabel} — here&apos;s what&apos;s on today.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 font-medium">Today&apos;s Orders</p>
          <p className="text-3xl font-semibold text-gray-900 mt-1">{totalToday}</p>
          <p className="text-xs text-gray-400 mt-1">orders received today</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 font-medium">Unprinted</p>
          <p className="text-3xl font-semibold mt-1" style={{ color: "#D97706" }}>{newCount}</p>
          <p className="text-xs text-gray-400 mt-1">picking slips to print</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-1">
            <p className="text-sm text-gray-500 font-medium">Printed</p>
            {totalToday > 0 && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: "#DBEAFE", color: "#2563EB" }}>
                {printedCount} of {totalToday}
              </span>
            )}
          </div>
          <p className="text-3xl font-semibold mt-1" style={{ color: "#2563EB" }}>{printedCount}</p>
          <p className="text-xs text-gray-400 mt-1">slips printed today</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 font-medium">Done</p>
          <p className="text-3xl font-semibold text-gray-900 mt-1">{doneCount}</p>
          <p className="text-xs text-gray-400 mt-1">orders completed today</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Today's orders table */}
        <div className="col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Today&apos;s Orders</h2>
            <Link href="/admin/orders" className="text-sm font-medium" style={{ color: "#1a4231" }}>View all</Link>
          </div>
          {todayOrders.length === 0 ? (
            <p className="px-6 py-8 text-sm text-gray-400 text-center">No orders received yet today.</p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wide">
                  <th className="px-6 py-3 text-left">Order</th>
                  <th className="px-6 py-3 text-left">Customer</th>
                  <th className="px-6 py-3 text-left">Time</th>
                  <th className="px-6 py-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {todayOrders.map((order) => {
                  const s = STATUS_STYLES[order.status] ?? STATUS_STYLES.new;
                  return (
                    <tr key={order.id} className="border-t border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-3.5">
                        <Link href={`/admin/orders/${order.id}`} className="text-sm font-medium text-gray-900 hover:underline">{order.id}</Link>
                      </td>
                      <td className="px-6 py-3.5">
                        <div className="text-sm text-gray-700">{order.customerName}</div>
                        <div className="text-xs text-gray-400">{order.customerType}</div>
                      </td>
                      <td className="px-6 py-3.5 text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleTimeString("en-AU", { hour: "2-digit", minute: "2-digit" })}
                      </td>
                      <td className="px-6 py-3.5">
                        <span className="text-xs font-medium px-2 py-1 rounded-full" style={{ background: s.bg, color: s.color }}>
                          {s.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Quick links */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h2 className="font-semibold text-gray-900 mb-4">Quick Links</h2>
            <div className="space-y-2">
              <Link href="/admin/orders" className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group">
                <span className="text-sm text-gray-700 font-medium">View all orders</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:stroke-gray-600">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
              <Link href="/admin/products" className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group">
                <span className="text-sm text-gray-700 font-medium">Manage products</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:stroke-gray-600">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
              <Link href="/admin/customers" className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group">
                <span className="text-sm text-gray-700 font-medium">Customer accounts</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:stroke-gray-600">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>

          <div className="rounded-xl p-5 border" style={{ background: "#edf3f0", borderColor: "#a8ccb8" }}>
            <div className="flex items-center gap-2 mb-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1a4231" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" />
              </svg>
              <span className="text-sm font-semibold" style={{ color: "#1a4231" }}>Today&apos;s cutoff</span>
            </div>
            <p className="text-sm" style={{ color: "#1a4231" }}>Orders close at <strong>4:00 PM</strong> for next-day delivery.</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">Active customers</p>
            <div className="text-2xl font-semibold text-gray-900">{customers.filter((c) => c.active).length}</div>
            <p className="text-sm text-gray-500 mt-1">{products.filter((p) => p.active).length} active products</p>
          </div>
        </div>
      </div>
    </div>
  );
}
