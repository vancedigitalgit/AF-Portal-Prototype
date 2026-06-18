import AdminSidebar from "@/components/AdminSidebar";
import FeedbackButton from "@/components/FeedbackButton";
import AdminAuthGate from "@/components/AdminAuthGate";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthGate>
      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar />
        <main className="flex-1 min-w-0 lg:ml-[260px]">
          {children}
        </main>
        <FeedbackButton />
      </div>
    </AdminAuthGate>
  );
}
