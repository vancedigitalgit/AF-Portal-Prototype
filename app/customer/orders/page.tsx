"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { products } from "@/lib/data";
import { useCart } from "@/lib/CartContext";
import { useProducts } from "@/lib/ProductContext";
import { useCustomerOrders } from "@/lib/CustomerOrdersContext";

const statusStyles: Record<string, { bg: string; color: string; label: string }> = {
  new:       { bg: "#FEF3C7", color: "#D97706", label: "Received" },
  printed:   { bg: "#EDE9FE", color: "#7C3AED", label: "Being prepared" },
  done:      { bg: "#d4e8dc", color: "#059669", label: "Delivered" },
  cancelled: { bg: "#FEE2E2", color: "#DC2626", label: "Cancelled" },
};

const TWO_WEEKS_AGO = new Date();
TWO_WEEKS_AGO.setDate(TWO_WEEKS_AGO.getDate() - 14);

function OrderActions({
  orderId,
  items,
  isOwn,
  canEdit,
  canCancel,
  onCancel,
}: {
  orderId: string;
  items: { productId: string; productName: string; quantity: number; unit: string }[];
  isOwn: boolean;
  canEdit: boolean;
  canCancel: boolean;
  onCancel: () => void;
}) {
  const { addItem } = useCart();
  const { isAvailable } = useProducts();
  const router = useRouter();
  const [skipped, setSkipped] = useState<string[]>([]);
  const [showNotice, setShowNotice] = useState(false);
  const [confirmingCancel, setConfirmingCancel] = useState(false);

  function handleReorder(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const unavailable: string[] = [];
    for (const item of items) {
      const product = products.find((p) => p.id === item.productId);
      if (!product) continue;
      if (!isAvailable(product.id)) { unavailable.push(item.productName); continue; }
      addItem(product, item.quantity);
    }
    if (unavailable.length > 0) {
      setSkipped(unavailable);
      setShowNotice(true);
      setTimeout(() => { setShowNotice(false); router.push("/customer/cart"); }, 2800);
    } else {
      router.push("/customer/cart");
    }
  }

  function handleCancelClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setConfirmingCancel(true);
  }

  function handleConfirmCancel(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    onCancel();
    setConfirmingCancel(false);
  }

  function handleDismissCancel(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setConfirmingCancel(false);
  }

  return (
    <div className="relative flex items-center gap-2 shrink-0 ml-4" onClick={(e) => e.stopPropagation()}>
      {confirmingCancel ? (
        <div className="flex items-center gap-2 text-xs">
          <span className="text-gray-500">Cancel this order?</span>
          <button onClick={handleConfirmCancel} className="font-semibold text-red-600 hover:text-red-800">Yes</button>
          <button onClick={handleDismissCancel} className="text-gray-400 hover:text-gray-600">No</button>
        </div>
      ) : (
        <>
          <button
            onClick={handleReorder}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors"
            style={{ background: "#edf3f0", color: "#1a4231", borderColor: "#a8ccb8" }}
          >
            Reorder
          </button>
          {isOwn && canEdit && (
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); router.push(`/customer/orders/${orderId}`); }}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg border-2 transition-colors hover:bg-orange-50"
              style={{ borderColor: "#d15111", color: "#d15111" }}
            >
              Edit
            </button>
          )}
          {isOwn && canCancel && (
            <button
              onClick={handleCancelClick}
              className="text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors hover:bg-red-50 hover:border-red-200"
              style={{ color: "#DC2626", borderColor: "#E5E7EB" }}
            >
              Cancel
            </button>
          )}
        </>
      )}
      {showNotice && (
        <div
          className="absolute right-0 top-10 z-10 w-64 rounded-xl shadow-lg border border-orange-100 p-3 text-xs"
          style={{ background: "#FFFBEB" }}
        >
          <p className="font-semibold text-orange-700 mb-1">Some items unavailable</p>
          <p className="text-orange-600 leading-snug">
            {skipped.join(", ")} {skipped.length === 1 ? "is" : "are"} not currently available and{" "}
            {skipped.length === 1 ? "was" : "were"} skipped. Taking you to the cart…
          </p>
        </div>
      )}
    </div>
  );
}

export default function CustomerOrdersPage() {
  const { orders, cancelOrder } = useCustomerOrders();
  const now = new Date();
  const cutoffPassed = now.getHours() >= 22;
  const orderCutoffPassed = now.getHours() >= 16;

  const myOrders = orders.filter((o) => o.customerId === "c1" && new Date(o.createdAt) >= TWO_WEEKS_AGO);
  const otherOrders = orders.filter((o) => o.customerId !== "c1" && new Date(o.createdAt) >= TWO_WEEKS_AGO).slice(0, 2);
  const displayOrders = [...myOrders, ...otherOrders];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">My Orders</h1>
          <p className="text-gray-500 mt-1 text-sm">The Collective Café — order history</p>
        </div>
        <Link href="/customer/shop" className="text-sm font-semibold text-white px-4 py-2.5 rounded-lg" style={{ background: "#1a4231" }}>
          Place new order
        </Link>
      </div>

      {displayOrders.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <p className="text-base font-medium">No orders in the last 2 weeks</p>
          <p className="text-sm mt-1">Older orders are archived. Place a new order below.</p>
        </div>
      )}

      <div className="space-y-3">
        {displayOrders.map((order) => {
          const s = statusStyles[order.status];
          const isOwn = order.customerId === "c1";
          const canEdit = isOwn && order.status === "new" && !cutoffPassed;
          const canCancel = isOwn && order.status === "new" && !orderCutoffPassed;
          return (
            <Link
              key={order.id}
              href={isOwn ? `/customer/orders/${order.id}` : "#"}
              className="block bg-white rounded-xl border border-gray-100 shadow-sm p-5 transition-colors hover:border-gray-200"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-gray-900">{order.id}</p>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: s.bg, color: s.color }}>
                      {s.label}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(order.createdAt).toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" })}
                    {" · "}
                    {new Date(order.createdAt).toLocaleTimeString("en-AU", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
                <OrderActions
                  orderId={order.id}
                  items={order.items}
                  isOwn={isOwn}
                  canEdit={canEdit}
                  canCancel={canCancel}
                  onCancel={() => cancelOrder(order.id)}
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {order.items.map((item, i) => (
                  <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">
                    {item.quantity} × {item.productName}
                  </span>
                ))}
              </div>
              {order.notes && (
                <p className="text-xs text-gray-400 mt-2 italic">&ldquo;{order.notes}&rdquo;</p>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
