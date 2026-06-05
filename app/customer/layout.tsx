import { CartProvider } from "@/lib/CartContext";
import CustomerNav from "@/components/CustomerNav";

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <div className="carrot-cursor min-h-screen" style={{ background: "#fdfdf9" }}>
        <CustomerNav />
        <main className="max-w-6xl mx-auto px-6 py-8">{children}</main>
      </div>
    </CartProvider>
  );
}
