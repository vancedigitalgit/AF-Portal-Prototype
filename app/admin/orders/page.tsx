import Link from "next/link";
import { orders } from "@/lib/data";

const statusStyles: Record<string, { bg: string; color: string; label: string }> = {
  pending: { bg: "#FEF3C7", color: "#D97706", label: "Pending" },
  confirmed: { bg: "#DBEAFE", color: "#2563EB", label: "Confirmed" },
  processing: { bg: "#EDE9FE", color: "#7C3AED", label: "Processing" },
  fulfilled: { bg: "#d4e8dc", color: "#059669", label: "Fulfilled" },
  cancelled: { bg: "#FEE2E2", color: "#DC2626", label: "Cancelled" },
};

export default function OrdersPage() {
  const counts = {
    all: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    confirmed: orders.filter((o) => o.status === "confirmed").length,
    processing: orders.filter((o) => o.status === "processing").length,
    fulfilled: orders.filter((o) => o.status === "fulfilled").length,
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Orders</h1>
          <p className="text-gray-500 mt-0.5 text-sm">{orders.length} total orders</p>
        </div>
      </div>

      {/* Status filter tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {[
          { key: "all", label: `All (${counts.all})` },
          { key: "pending", label: `Pending (${counts.pending})` },
          { key: "confirmed", label: `Confirmed (${counts.confirmed})` },
          { key: "processing", label: `Processing (${counts.processing})` },
          { key: "fulfilled", label: `Fulfilled (${counts.fulfilled})` },
        ].map((tab) => (
          <button
            key={tab.key}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab.key === "all"
                ? "text-white"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            }`}
            style={tab.key === "all" ? { background: "#1a4231" } : {}}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Orders table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wide">
              <th className="px-6 py-3 text-left">Order ID</th>
              <th className="px-6 py-3 text-left">Customer</th>
              <th className="px-6 py-3 text-left">Items</th>
              <th className="px-6 py-3 text-left">Date &amp; Time</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left"></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              const s = statusStyles[order.status];
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
  );
}
