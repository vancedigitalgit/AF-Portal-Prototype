"use client";
import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getOrderById, getCustomerById } from "@/lib/data";
import type { OrderStatus } from "@/lib/data";
import { notFound } from "next/navigation";

const statusStyles: Record<string, { bg: string; color: string; label: string }> = {
  pending:    { bg: "#FEF3C7", color: "#D97706", label: "Pending" },
  confirmed:  { bg: "#DBEAFE", color: "#2563EB", label: "Confirmed" },
  processing: { bg: "#EDE9FE", color: "#7C3AED", label: "Processing" },
  fulfilled:  { bg: "#d4e8dc", color: "#059669", label: "Fulfilled" },
  cancelled:  { bg: "#FEE2E2", color: "#DC2626", label: "Cancelled" },
};

const STATUS_ORDER: OrderStatus[] = ["pending", "confirmed", "processing", "fulfilled", "cancelled"];

export default function OrderDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const order = getOrderById(id);
  if (!order) notFound();

  const customer = getCustomerById(order.customerId);

  const [status, setStatus] = useState<OrderStatus>(order.status);
  const [saved, setSaved] = useState(false);

  function handleStatusChange(st: OrderStatus) {
    if (st === status) return;
    setStatus(st);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  const s = statusStyles[status];

  return (
    <div className="p-8">
      {/* Toast */}
      {saved && (
        <div
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl text-sm font-semibold text-white shadow-xl"
          style={{ background: "#1a4231" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6L9 17l-5-5" />
          </svg>
          Status updated to {statusStyles[status].label}
        </div>
      )}

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/admin/orders" className="hover:text-gray-700">Orders</Link>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18l6-6-6-6" />
        </svg>
        <span className="text-gray-900 font-medium">{order.id}</span>
      </div>

      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">{order.id}</h1>
          <p className="text-gray-500 mt-1 text-sm">
            Placed {new Date(order.createdAt).toLocaleDateString("en-AU", { weekday: "long", day: "numeric", month: "long", year: "numeric" })} at{" "}
            {new Date(order.createdAt).toLocaleTimeString("en-AU", { hour: "2-digit", minute: "2-digit" })}
          </p>
        </div>
        <span className="text-sm font-semibold px-3 py-1.5 rounded-full" style={{ background: s.bg, color: s.color }}>
          {s.label}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Order items */}
        <div className="col-span-2 space-y-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">Order Items</h2>
            </div>
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wide">
                  <th className="px-6 py-3 text-left">Product</th>
                  <th className="px-6 py-3 text-right">Qty</th>
                  <th className="px-6 py-3 text-right">Unit</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, i) => (
                  <tr key={i} className="border-t border-gray-50">
                    <td className="px-6 py-3.5 text-sm font-medium text-gray-800">{item.productName}</td>
                    <td className="px-6 py-3.5 text-sm text-gray-700 text-right font-semibold">{item.quantity}</td>
                    <td className="px-6 py-3.5 text-sm text-gray-500 text-right">{item.unit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {order.notes && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="font-semibold text-gray-900 mb-2">Customer Notes</h2>
              <p className="text-sm text-gray-600 italic">&ldquo;{order.notes}&rdquo;</p>
            </div>
          )}

          {/* Status update */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Update Status</h2>
            <div className="flex gap-2 flex-wrap">
              {STATUS_ORDER.map((st) => {
                const ss = statusStyles[st];
                const isCurrent = status === st;
                return (
                  <button
                    key={st}
                    onClick={() => handleStatusChange(st)}
                    className="text-xs font-semibold px-4 py-2 rounded-full border transition-all"
                    style={isCurrent
                      ? { background: ss.bg, color: ss.color, borderColor: ss.color, boxShadow: `0 0 0 2px ${ss.color}33` }
                      : { background: "white", color: "#6B7280", borderColor: "#E5E7EB" }}
                  >
                    {ss.label}
                    {isCurrent && (
                      <svg className="inline ml-1.5 mb-0.5" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-gray-400 mt-3">Click any status to update. Changes persist for this session.</p>
          </div>
        </div>

        {/* Customer details */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h2 className="font-semibold text-gray-900 mb-4">Customer</h2>
            {customer ? (
              <div className="space-y-3">
                <div>
                  <div className="text-sm font-semibold text-gray-900">{customer.name}</div>
                  <div className="text-xs text-gray-400">{customer.type}</div>
                </div>
                <div className="text-sm text-gray-600 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" />
                    </svg>
                    {customer.contact}
                  </div>
                  <div className="flex items-center gap-2">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.5 7.87 19.79 19.79 0 01.42 4.24 2 2 0 012.4 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 9.91a16 16 0 006.29 6.29l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                    </svg>
                    {customer.phone}
                  </div>
                  <div className="flex items-center gap-2">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
                    </svg>
                    {customer.email}
                  </div>
                </div>
                <div className="pt-2 border-t border-gray-100">
                  <p className="text-xs text-gray-400">Customer since {customer.since}</p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500">Customer not found</p>
            )}
          </div>

          <Link href="/admin/orders" className="flex items-center gap-2 text-sm font-medium px-4 py-2.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors justify-center" style={{ color: "#374151" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            Back to orders
          </Link>
        </div>
      </div>
    </div>
  );
}
