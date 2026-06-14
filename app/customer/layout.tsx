import { CartProvider } from "@/lib/CartContext";
import { CustomerOrdersProvider } from "@/lib/CustomerOrdersContext";
import CustomerNav from "@/components/CustomerNav";
import FeedbackButton from "@/components/FeedbackButton";

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return (
    <CustomerOrdersProvider>
    <CartProvider>
      <div className="min-h-screen" style={{ background: "#fdfdf9" }}>
        <CustomerNav />
        <main className="max-w-6xl mx-auto px-6 py-8">{children}</main>
        <FeedbackButton />
      </div>
    </CartProvider>
    </CustomerOrdersProvider>
  );
}
