"use client";
import { useEffect } from "react";
import { useMessages } from "@/lib/MessagesContext";
import type { MessageType } from "@/lib/MessagesContext";

const typeConfig: Record<MessageType, { bg: string; border: string; iconColor: string; label: string; icon: React.ReactNode }> = {
  warning: {
    bg: "#FFFBEB", border: "#FCD34D", iconColor: "#D97706", label: "Supply Update",
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>,
  },
  alert: {
    bg: "#FEF2F2", border: "#FCA5A5", iconColor: "#DC2626", label: "Important",
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>,
  },
  info: {
    bg: "#EFF6FF", border: "#93C5FD", iconColor: "#2563EB", label: "Notice",
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>,
  },
};

export default function NoticesPage() {
  const { notices, isRead, markRead, markAllRead, unreadCount } = useMessages();

  const pinned = notices.filter((n) => n.pinned);
  const regular = notices.filter((n) => !n.pinned);

  useEffect(() => {
    markAllRead();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function NoticeCard({ notice }: { notice: typeof notices[0] }) {
    const cfg = typeConfig[notice.type];
    const read = isRead(notice.id);

    return (
      <div
        className="rounded-xl border p-5 transition-all"
        style={{ background: cfg.bg, borderColor: cfg.border, opacity: read ? 0.75 : 1 }}
        onClick={() => markRead(notice.id)}
      >
        <div className="flex items-start gap-3">
          <div className="mt-0.5 shrink-0" style={{ color: cfg.iconColor }}>{cfg.icon}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: cfg.iconColor }}>{cfg.label}</span>
              {notice.pinned && (
                <span className="text-xs font-medium px-1.5 py-0.5 rounded-full bg-white text-gray-500 border border-gray-200">Pinned</span>
              )}
              {!read && (
                <span className="w-2 h-2 rounded-full shrink-0" style={{ background: cfg.iconColor }} />
              )}
            </div>
            <h3 className="text-sm font-semibold text-gray-900 mb-1">{notice.title}</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{notice.body}</p>
            <p className="text-xs text-gray-400 mt-2">
              {new Date(notice.createdAt).toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Notices</h1>
          <p className="text-gray-500 mt-1 text-sm">Updates from Adlees Fresh — supply changes, closures, and new stock.</p>
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="text-sm font-medium text-gray-500 hover:text-gray-700">Mark all read</button>
        )}
      </div>

      {notices.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg font-medium">No notices right now</p>
          <p className="text-sm mt-1">Check back here for updates from Adam&apos;s team.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {pinned.length > 0 && (
            <>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-1 mb-2">Pinned</p>
              {pinned.map((n) => <NoticeCard key={n.id} notice={n} />)}
              {regular.length > 0 && <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-1 pt-2 mb-2">Earlier</p>}
            </>
          )}
          {regular.map((n) => <NoticeCard key={n.id} notice={n} />)}
        </div>
      )}
    </div>
  );
}
