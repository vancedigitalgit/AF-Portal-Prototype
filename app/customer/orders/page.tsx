"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { orders, products } from "@/lib/data";
import { useCart } from "@/lib/CartContext";
import { useProducts } from "@/lib/ProductContext";

const statusStyles: Record<string, { bg: string; color: string; label: string }> = {
  pending: { bg: "#FEF3C7", color: "#D97706", label: "Pending" },
  confirmed: { bg: "#DBEAFE", color: "#2563EB", label: "Confirmed" },
  processing: { bg: "#EDE9FE", color: "#7C3AED", label: "In preparation" },
  fulfilled: { bg: "#d4e8dc", color: "#059669", label: "Delivered" },
  cancelled: { bg: "#FEE2E2", color: "#DC2626", label: "Cancelled" },
};

const myOrders = orders.filter((o) => o.customerId === "c1");
const otherOrders = orders.filter((o) => o.customerId !== "c1").slice(0, 2);
const displayOrders = [...myOrders, ...otherOrders];

function ReorderButton({ orderId, items }: { orderId: string; items: typeof displayOrders[0]["items"] }) {
  const { addItem } = useCart();
  const { isAvailable } = useProducts();
  const router = useRouter();
  const [skipped, setSkipped] = useState<string[]>([]);
  const [showNotice, setShowNotice] = useState(false);

  function handleReorder() {
    const unavailable: string[] = [];

    for (const item of items) {
      const product = products.find((p) => p.id === item.productId);
      if (!product) continue;
      if (!isAvailable(product.id)) {
        unavailable.push(item.productName);
        continue;
      }
      addItem(product, item.quantity);
    }

    if (unavailable.length > 0) {
      setSkipped(unavailable);
      setShowNotice(true);
      setTimeout(() => {
        setShowNotice(false);
        router.push("/customer/cart");
      }, 2800);
    } else {
      router.push("/customer/cart");
    }
  }

  return (
    <div className="relative">
      <button
        onClick={handleReorder}
        className="text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors"
        style={{ background: "#edf3f0", color: "#1a4231", borderColor: "#a8ccb8" }}
      >
        Reorder
      </button>
      {showNotice && (
        <div
          className="absolute right-0 top-9 z-10 w-64 rounded-xl shadow-lg border border-orange-100 p-3 text-xs"
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

      <div className="space-y-3">
        {displayOrders.map((order) => {
          const s = statusStyles[order.status];
          return (
            <div key={order.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2">
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
                <ReorderButton orderId={order.id} items={order.items} />
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
            </div>
          );
        })}
      </div>
    </div>
  );
}
