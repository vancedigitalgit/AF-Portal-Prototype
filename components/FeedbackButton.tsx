"use client";
import { useState, useRef } from "react";

type FeedbackType = "Bug" | "Feature Request" | "Not Working";

const TYPES: FeedbackType[] = ["Bug", "Feature Request", "Not Working"];

export default function FeedbackButton() {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<FeedbackType>("Bug");
  const [description, setDescription] = useState("");
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  function handleClose() {
    setOpen(false);
    setTimeout(() => {
      setSubmitted(false);
      setDescription("");
      setScreenshot(null);
      setType("Bug");
    }, 300);
  }

  return (
    <>
      {/* Floating trigger */}
      <button
        onClick={() => setOpen(true)}
        title="Send feedback"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold shadow-lg transition-all hover:scale-105 active:scale-95"
        style={{ background: "#1a4231", color: "white" }}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
        </svg>
        Feedback
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-end p-6"
          style={{ background: "rgba(0,0,0,0.35)" }}
          onClick={handleClose}
        >
          {/* Modal */}
          <div
            className="w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden"
            style={{ background: "white" }}
            onClick={(e) => e.stopPropagation()}
          >
            {submitted ? (
              /* Success state */
              <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
                <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4" style={{ background: "#edfaf0" }}>
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#1a8a4a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <p className="text-base font-semibold text-gray-800 mb-1">Thanks for the feedback</p>
                <p className="text-sm text-gray-500 mb-6">We'll look into it and get back to you.</p>
                <button
                  onClick={handleClose}
                  className="px-5 py-2 rounded-lg text-sm font-semibold text-white"
                  style={{ background: "#1a4231" }}
                >
                  Close
                </button>
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                  <span className="text-sm font-semibold text-gray-800">Send Feedback</span>
                  <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="px-5 py-4 space-y-4">
                  {/* Type */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Type</label>
                    <div className="flex gap-2">
                      {TYPES.map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setType(t)}
                          className="flex-1 py-1.5 rounded-lg text-xs font-semibold border transition-all"
                          style={type === t
                            ? { background: "#1a4231", color: "white", borderColor: "#1a4231" }
                            : { background: "white", color: "#555", borderColor: "#e5e7eb" }}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Description</label>
                    <textarea
                      required
                      rows={4}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="What happened? What were you trying to do?"
                      className="w-full px-3 py-2.5 rounded-lg text-sm border border-gray-200 resize-none focus:outline-none focus:border-gray-400 text-gray-700"
                      style={{ lineHeight: "1.5" }}
                    />
                  </div>

                  {/* Screenshot */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Screenshot <span className="font-normal normal-case">(optional)</span></label>
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => setScreenshot(e.target.files?.[0] ?? null)}
                    />
                    {screenshot ? (
                      <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-600">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
                        </svg>
                        <span className="flex-1 truncate text-xs">{screenshot.name}</span>
                        <button type="button" onClick={() => setScreenshot(null)} className="text-gray-400 hover:text-gray-600">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => fileRef.current?.click()}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed border-gray-300 text-xs text-gray-400 hover:border-gray-400 hover:text-gray-500 transition-colors w-full"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
                        </svg>
                        Attach a screenshot
                      </button>
                    )}
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90"
                    style={{ background: "#1a4231" }}
                  >
                    Send Feedback
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
