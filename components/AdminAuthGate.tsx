"use client";
import { useState, useEffect, ReactNode } from "react";

const SESSION_KEY = "adlees_admin_auth";
const ADMIN_PASSWORD = "12345";

export default function AdminAuthGate({ children }: { children: ReactNode }) {
  const [authed, setAuthed] = useState(false);
  const [ready, setReady] = useState(false);
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    setAuthed(sessionStorage.getItem(SESSION_KEY) === "1");
    setReady(true);
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (input === ADMIN_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, "1");
      setAuthed(true);
      setError(false);
    } else {
      setError(true);
      setInput("");
    }
  }

  if (!ready) return null;

  if (authed) return <>{children}</>;

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#1a4231" }}>
      <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-sm text-center">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{ background: "#edf3f0" }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1a4231" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0110 0v4" />
          </svg>
        </div>
        <h1 className="text-xl font-semibold text-gray-900 mb-1">Admin access</h1>
        <p className="text-sm text-gray-400 mb-8">Enter the admin password to continue.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="Password"
            value={input}
            onChange={(e) => { setInput(e.target.value); setError(false); }}
            autoFocus
            className="w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all"
            style={{
              borderColor: error ? "#ef4444" : "#E5E7EB",
              ["--tw-ring-color" as string]: error ? "#ef4444" : "#1a4231",
            }}
          />
          {error && (
            <p className="text-xs text-red-500 -mt-1">Incorrect password. Try again.</p>
          )}
          <button
            type="submit"
            className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ background: "#1a4231" }}
          >
            Sign in
          </button>
        </form>

        <p className="text-xs text-gray-300 mt-8">Adlees Fresh — Admin Portal</p>
      </div>
    </div>
  );
}
