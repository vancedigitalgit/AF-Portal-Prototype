"use client";
import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getCustomerById } from "@/lib/data";
import type { OrderStatus } from "@/lib/data";
import { notFound } from "next/navigation";
import { useAdminOrders } from "@/lib/AdminOrdersContext";
import type { Order, Customer } from "@/lib/data";

const statusStyles: Record<string, { bg: string; color: string; label: string }> = {
  new:       { bg: "#FEF3C7", color: "#D97706", label: "New" },
  printed:   { bg: "#DBEAFE", color: "#2563EB", label: "Printed" },
  done:      { bg: "#d4e8dc", color: "#059669", label: "Done" },
  cancelled: { bg: "#FEE2E2", color: "#DC2626", label: "Cancelled" },
};

const STATUS_ORDER: OrderStatus[] = ["new", "printed", "done", "cancelled"];

function PickingSlipModal({ order, customer, onClose }: {
  order: Order;
  customer: Customer | undefined;
  onClose: () => void;
}) {
  const printDate = new Date().toLocaleDateString("en-AU", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  const printTime = new Date().toLocaleTimeString("en-AU", { hour: "2-digit", minute: "2-digit" });

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/40 print:hidden" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        <div
          className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal toolbar — hidden when printing */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 print:hidden shrink-0">
            <div>
              <h2 className="text-base font-bold text-gray-900">Picking Slip — {order.id}</h2>
              <p className="text-xs text-gray-400 mt-0.5">Review before printing. Opening this slip marks the order as Printed.</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  const content = document.getElementById("picking-slip-content");
                  if (!content) return;
                  const win = window.open("", "_blank", "width=800,height=900");
                  if (!win) return;
                  win.document.write(`<!DOCTYPE html><html><head><title>Picking Slip — ${order.id}</title><style>
                    *{box-sizing:border-box;margin:0;padding:0}
                    body{font-family:'Poppins',Arial,sans-serif;color:#1a1a1a;padding:2rem;font-size:14px;line-height:1.5}
                    @media print{body{padding:1.5rem}}
                  </style></head><body>${content.innerHTML}</body></html>`);
                  win.document.close();
                  win.focus();
                  setTimeout(() => { win.print(); win.close(); }, 400);
                }}
                className="flex items-center gap-2 text-sm font-bold text-white px-4 py-2 rounded-xl"
                style={{ background: "#1a4231" }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 6 2 18 2 18 9" /><path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2" /><rect x="6" y="14" width="12" height="8" />
                </svg>
                Print / Save PDF
              </button>
              <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Picking slip content */}
          <div className="overflow-y-auto p-8 print:p-0" id="picking-slip-content">
            {/* Header */}
            <div className="flex items-start justify-between mb-6 pb-5 border-b-2 border-gray-200">
              <div>
                <p className="text-xl font-black tracking-tight" style={{ color: "#1a4231" }}>ADLEES FRESH</p>
                <p className="text-xs text-gray-500 mt-0.5">Tweed Shire NSW — orders@adleesfresh.com.au</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-black text-gray-900">PICKING SLIP</p>
                <p className="text-sm font-bold text-gray-700">{order.id}</p>
                <p className="text-xs text-gray-400 mt-0.5">Printed {printDate} at {printTime}</p>
              </div>
            </div>

            {/* Customer info */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Deliver To</p>
                <p className="text-sm font-bold text-gray-900">{customer?.name ?? "Unknown customer"}</p>
                <p className="text-sm text-gray-600">{customer?.type}</p>
                {customer?.contact && <p className="text-xs text-gray-500 mt-0.5">{customer.contact}</p>}
                {customer?.address && <p className="text-xs text-gray-500">{customer.address}</p>}
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Order Details</p>
                <p className="text-sm text-gray-700"><span className="font-semibold">Date placed:</span> {new Date(order.createdAt).toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" })}</p>
                <p className="text-sm text-gray-700"><span className="font-semibold">Time:</span> {new Date(order.createdAt).toLocaleTimeString("en-AU", { hour: "2-digit", minute: "2-digit" })}</p>
                {order.poNumber && <p className="text-sm text-gray-700 mt-1"><span className="font-semibold">PO Number:</span> {order.poNumber}</p>}
              </div>
            </div>

            {/* Items table */}
            <table className="w-full mb-6" style={{ borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #e5e7eb" }}>
                  <th className="text-left py-2 text-xs font-bold uppercase tracking-widest text-gray-500 w-8">#</th>
                  <th className="text-left py-2 text-xs font-bold uppercase tracking-widest text-gray-500">Product</th>
                  <th className="text-right py-2 text-xs font-bold uppercase tracking-widest text-gray-500">Qty</th>
                  <th className="text-right py-2 text-xs font-bold uppercase tracking-widest text-gray-500">Unit</th>
                  <th className="text-right py-2 text-xs font-bold uppercase tracking-widest text-gray-500 w-16">✓ Packed</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid #f3f4f6" }}>
                    <td className="py-2.5 text-xs text-gray-400">{i + 1}</td>
                    <td className="py-2.5 text-sm font-medium text-gray-900">{item.productName}</td>
                    <td className="py-2.5 text-sm font-bold text-gray-900 text-right">{item.quantity}</td>
                    <td className="py-2.5 text-sm text-gray-500 text-right">{item.unit}</td>
                    <td className="py-2.5 text-right">
                      <span className="inline-block w-6 h-6 rounded border-2 border-gray-300 print:border-gray-400" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Notes */}
            {order.notes && (
              <div className="mb-6 p-3 rounded-lg bg-amber-50 border border-amber-200">
                <p className="text-[10px] font-bold uppercase tracking-widest text-amber-700 mb-1">Customer Note</p>
                <p className="text-sm text-amber-900 italic">&ldquo;{order.notes}&rdquo;</p>
              </div>
            )}

            {/* Footer */}
            <div className="pt-4 border-t border-gray-200">
              <p className="text-[10px] text-gray-400 text-center">Prices not shown — invoice will be emailed to customer separately. This slip is for packing purposes only.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function OrderDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { getOrder, updateStatus } = useAdminOrders();
  const orderData = getOrder(id);
  if (!orderData) notFound();
  const order = orderData!;

  const customer = getCustomerById(order.customerId);

  const [showSlip, setShowSlip] = useState(false);
  const [saved, setSaved] = useState(false);

  function handleStatusChange(st: OrderStatus) {
    if (st === order.status) return;
    updateStatus(order.id, st);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  function handlePrintSlip() {
    if (order.status === "new") {
      updateStatus(order.id, "printed");
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }
    setShowSlip(true);
  }

  const s = statusStyles[order.status] ?? statusStyles.new;

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
          Status updated to {statusStyles[order.status]?.label ?? order.status}
        </div>
      )}

      {/* Picking slip modal */}
      {showSlip && <PickingSlipModal order={order} customer={customer} onClose={() => setShowSlip(false)} />}

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
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrintSlip}
            className="flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-xl border-2 transition-all"
            style={{ borderColor: "#1a4231", color: "#1a4231", background: "white" }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 6 2 18 2 18 9" /><path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2" /><rect x="6" y="14" width="12" height="8" />
            </svg>
            Print Picking Slip
          </button>
          <span className="text-sm font-semibold px-3 py-1.5 rounded-full" style={{ background: s.bg, color: s.color }}>
            {s.label}
          </span>
        </div>
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
                const isCurrent = order.status === st;
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
            <p className="text-xs text-gray-400 mt-3">
              Printing a picking slip automatically marks the order as <strong>Printed</strong>. Click <strong>Done</strong> once the order has left.
            </p>
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
                {order.poNumber && (
                  <div className="pt-2 border-t border-gray-100">
                    <p className="text-xs text-gray-400 mb-0.5">PO Number</p>
                    <p className="text-sm font-semibold text-gray-800">{order.poNumber}</p>
                  </div>
                )}
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
