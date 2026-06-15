import AdminSidebar from "@/components/AdminSidebar";
import FeedbackButton from "@/components/FeedbackButton";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 min-w-0" style={{ marginLeft: "260px" }}>
        {children}
      </main>
      <FeedbackButton />
    </div>
  );
}
