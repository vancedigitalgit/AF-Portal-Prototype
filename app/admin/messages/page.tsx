"use client";
import { useState } from "react";
import { useMessages } from "@/lib/MessagesContext";
import type { MessageType } from "@/lib/MessagesContext";

const typeConfig: Record<MessageType, { label: string; bg: string; border: string; color: string }> = {
  info:    { label: "Notice",        bg: "#EFF6FF", border: "#93C5FD", color: "#2563EB" },
  warning: { label: "Supply Update", bg: "#FFFBEB", border: "#FCD34D", color: "#D97706" },
  alert:   { label: "Important",     bg: "#FEF2F2", border: "#FCA5A5", color: "#DC2626" },
};

const emptyForm = { title: "", body: "", type: "info" as MessageType, pinned: false };

export default function MessagesPage() {
  const { notices, addNotice, deleteNotice, togglePin } = useMessages();
  const [form, setForm] = useState(emptyForm);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  function handleSend() {
    if (!form.title.trim() || !form.body.trim()) return;
    addNotice(form.title.trim(), form.body.trim(), form.type, form.pinned);
    setForm(emptyForm);
    setSent(true);
    setTimeout(() => setSent(false), 2000);
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Customer Notices</h1>
        <p className="text-gray-500 mt-0.5 text-sm">Post updates visible to all customers in their portal — supply alerts, closures, new products.</p>
      </div>

      {/* Compose */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-8">
        <p className="text-sm font-semibold text-gray-800 mb-4">Post a notice</p>

        <div className="space-y-4">
          {/* Type + Pin */}
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="text-xs font-medium text-gray-500 block mb-1.5">Type</label>
              <div className="flex gap-2">
                {(["info", "warning", "alert"] as MessageType[]).map((t) => {
                  const cfg = typeConfig[t];
                  const active = form.type === t;
                  return (
                    <button
                      key={t}
                      onClick={() => setForm((f) => ({ ...f, type: t }))}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all"
                      style={active
                        ? { background: cfg.bg, color: cfg.color, borderColor: cfg.border }
                        : { background: "white", color: "#9CA3AF", borderColor: "#E5E7EB" }}
                    >
                      {cfg.label}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="flex items-center gap-2 mt-4">
              <button
                onClick={() => setForm((f) => ({ ...f, pinned: !f.pinned }))}
                className="relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors focus:outline-none"
                style={{ background: form.pinned ? "#1a4231" : "#D1D5DB" }}
              >
                <span className="inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform" style={{ transform: form.pinned ? "translateX(18px)" : "translateX(2px)" }} />
              </button>
              <span className="text-xs font-medium text-gray-600">Pin to top</span>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="text-xs font-medium text-gray-500 block mb-1.5">Title</label>
            <input
              type="text"
              placeholder="e.g. Tomato supply short this week"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-900/20 text-gray-900"
            />
          </div>

          {/* Body */}
          <div>
            <label className="text-xs font-medium text-gray-500 block mb-1.5">Message</label>
            <textarea
              rows={3}
              placeholder="Write your message to customers..."
              value={form.body}
              onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-900/20 text-gray-900 resize-none"
            />
          </div>

          {/* Preview */}
          {(form.title || form.body) && (
            <div className="rounded-xl border p-4" style={{ background: typeConfig[form.type].bg, borderColor: typeConfig[form.type].border }}>
              <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: typeConfig[form.type].color }}>{typeConfig[form.type].label} preview</p>
              <p className="text-sm font-semibold text-gray-900">{form.title || "—"}</p>
              {form.body && <p className="text-sm text-gray-600 mt-0.5 leading-relaxed">{form.body}</p>}
            </div>
          )}

          <button
            onClick={handleSend}
            disabled={!form.title.trim() || !form.body.trim()}
            className="text-sm font-semibold text-white px-5 py-2.5 rounded-lg disabled:opacity-40 transition-all"
            style={{ background: sent ? "#059669" : "#1a4231" }}
          >
            {sent ? "Posted ✓" : "Post notice"}
          </button>
        </div>
      </div>

      {/* Existing notices */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-800">Active notices <span className="text-gray-400 font-normal ml-1">({notices.length})</span></h2>
        </div>

        {notices.length === 0 ? (
          <div className="text-center py-12 text-gray-400 bg-white rounded-xl border border-gray-100">
            <p className="text-sm">No notices posted yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notices.map((notice) => {
              const cfg = typeConfig[notice.type];
              return (
                <div key={notice.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="flex items-start gap-4 p-5">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full border" style={{ background: cfg.bg, color: cfg.color, borderColor: cfg.border }}>{cfg.label}</span>
                        {notice.pinned && <span className="text-xs text-gray-400 font-medium">📌 Pinned</span>}
                      </div>
                      <p className="text-sm font-semibold text-gray-900">{notice.title}</p>
                      <p className="text-sm text-gray-500 mt-0.5 leading-relaxed">{notice.body}</p>
                      <p className="text-xs text-gray-400 mt-2">
                        {new Date(notice.createdAt).toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => togglePin(notice.id)}
                        className="text-xs font-medium px-2.5 py-1.5 rounded-lg border transition-colors"
                        style={notice.pinned
                          ? { background: "#F3F4F6", color: "#6B7280", borderColor: "#E5E7EB" }
                          : { background: "#edf3f0", color: "#1a4231", borderColor: "#a8ccb8" }}
                      >
                        {notice.pinned ? "Unpin" : "Pin"}
                      </button>
                      {confirmDelete === notice.id ? (
                        <div className="flex items-center gap-1.5">
                          <button onClick={() => { deleteNotice(notice.id); setConfirmDelete(null); }} className="text-xs font-semibold text-red-600 hover:text-red-800 px-2 py-1.5 rounded-lg hover:bg-red-50">Delete</button>
                          <button onClick={() => setConfirmDelete(null)} className="text-xs text-gray-400 hover:text-gray-600 px-2 py-1.5 rounded-lg hover:bg-gray-50">Cancel</button>
                        </div>
                      ) : (
                        <button onClick={() => setConfirmDelete(notice.id)} className="text-xs text-gray-400 hover:text-red-500 px-2.5 py-1.5 rounded-lg border border-gray-200 hover:border-red-200 hover:bg-red-50 transition-colors">Remove</button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
