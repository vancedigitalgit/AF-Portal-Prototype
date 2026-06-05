"use client";
import { useState } from "react";

const initialData = {
  businessName: "The Collective Café",
  contactName: "Sarah Thompson",
  email: "sarah@collectivecafe.com.au",
  phone: "07 5512 3344",
  businessType: "Café / Restaurant",
  address: "12 Burleigh Heads Rd, Gold Coast QLD",
  deliveryDays: ["Tuesday", "Thursday"],
  defaultNotes: "Leave at back dock — call if gate is locked.",
};

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden mb-5">
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="text-sm font-semibold text-gray-900">{title}</h2>
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-3 gap-4 items-start py-3 border-b border-gray-50 last:border-0">
      <label className="text-sm font-medium text-gray-600 pt-2">{label}</label>
      <div className="col-span-2">{children}</div>
    </div>
  );
}

function Input({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-900/20 text-gray-900"
    />
  );
}


export default function AccountPage() {
  const [data, setData] = useState(initialData);
  const [saved, setSaved] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [pwForm, setPwForm] = useState({ current: "", next: "", confirm: "" });
  const [pwSaved, setPwSaved] = useState(false);

  function set<K extends keyof typeof initialData>(key: K, value: typeof initialData[K]) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  function toggleDay(day: string) {
    const days = data.deliveryDays.includes(day)
      ? data.deliveryDays.filter((d) => d !== day)
      : [...data.deliveryDays, day];
    set("deliveryDays", days);
  }

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  function handlePasswordSave() {
    setPwSaved(true);
    setPwForm({ current: "", next: "", confirm: "" });
    setTimeout(() => {
      setPwSaved(false);
      setChangingPassword(false);
    }, 2000);
  }

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">My Account</h1>
          <p className="text-gray-500 mt-1 text-sm">Manage your business details and preferences.</p>
        </div>
        <button
          onClick={handleSave}
          className="text-sm font-semibold text-white px-4 py-2.5 rounded-lg transition-all"
          style={{ background: saved ? "#059669" : "#1a4231" }}
        >
          {saved ? "Saved ✓" : "Save changes"}
        </button>
      </div>

      <Section title="Business Details">
        <Field label="Business name"><Input value={data.businessName} onChange={(v) => set("businessName", v)} /></Field>
        <Field label="Contact name"><Input value={data.contactName} onChange={(v) => set("contactName", v)} /></Field>
        <Field label="Email address"><Input value={data.email} onChange={(v) => set("email", v)} /></Field>
        <Field label="Phone"><Input value={data.phone} onChange={(v) => set("phone", v)} /></Field>
        <Field label="Business type">
          <select
            value={data.businessType}
            onChange={(e) => set("businessType", e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-900/20 text-gray-900"
          >
            {["Café / Restaurant", "Aged Care", "School", "Pub & Club", "Resort / Hotel", "Charity", "Child Care", "Food Manufacturer", "Sporting Club", "Event Venue", "Wholesale Supplier", "Other"].map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </Field>
        <Field label="Delivery address">
          <Input value={data.address} onChange={(v) => set("address", v)} />
        </Field>
      </Section>

      <Section title="Delivery Preferences">
        <Field label="Preferred delivery days">
          <div className="flex gap-2 flex-wrap">
            {DAYS.map((day) => {
              const on = data.deliveryDays.includes(day);
              return (
                <button
                  key={day}
                  onClick={() => toggleDay(day)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border"
                  style={on
                    ? { background: "#1a4231", color: "white", borderColor: "#1a4231" }
                    : { background: "white", color: "#6B7280", borderColor: "#E5E7EB" }}
                >
                  {day}
                </button>
              );
            })}
          </div>
          <p className="text-xs text-gray-400 mt-2">Let Adam&apos;s team know your preferred delivery days.</p>
        </Field>
        <Field label="Default order note">
          <textarea
            value={data.defaultNotes}
            onChange={(e) => set("defaultNotes", e.target.value)}
            rows={2}
            placeholder="e.g. Leave at back dock, ring doorbell on arrival..."
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-900/20 text-gray-900 resize-none"
          />
          <p className="text-xs text-gray-400 mt-1">Pre-filled on every new order — you can still edit it per order.</p>
        </Field>
      </Section>

      <Section title="Password & Security">
        {!changingPassword ? (
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-700 font-medium">Password</p>
              <p className="text-xs text-gray-400 mt-0.5">Last changed — never (demo account)</p>
            </div>
            <button
              onClick={() => setChangingPassword(true)}
              className="text-sm font-medium px-3 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Change password
            </button>
          </div>
        ) : (
          <div className="space-y-3 max-w-sm">
            {pwSaved ? (
              <p className="text-sm font-medium text-green-700">Password updated ✓</p>
            ) : (
              <>
                <div>
                  <label className="text-xs font-medium text-gray-500 block mb-1">Current password</label>
                  <input type="password" value={pwForm.current} onChange={(e) => setPwForm((p) => ({ ...p, current: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-900/20" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 block mb-1">New password</label>
                  <input type="password" value={pwForm.next} onChange={(e) => setPwForm((p) => ({ ...p, next: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-900/20" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 block mb-1">Confirm new password</label>
                  <input type="password" value={pwForm.confirm} onChange={(e) => setPwForm((p) => ({ ...p, confirm: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-900/20" />
                </div>
                <div className="flex gap-2 pt-1">
                  <button onClick={handlePasswordSave} className="text-sm font-semibold text-white px-4 py-2 rounded-lg" style={{ background: "#1a4231" }}>Update password</button>
                  <button onClick={() => setChangingPassword(false)} className="text-sm text-gray-500 px-4 py-2 rounded-lg hover:bg-gray-100">Cancel</button>
                </div>
              </>
            )}
          </div>
        )}
      </Section>

      <div className="rounded-xl p-4 border text-center" style={{ background: "#F9FAFB", borderColor: "#E5E7EB" }}>
        <p className="text-xs text-gray-400">Customer since 2019 · Account managed by Adlees Fresh · <span className="text-gray-500">orders@adleesfresh.com.au</span></p>
      </div>
    </div>
  );
}
