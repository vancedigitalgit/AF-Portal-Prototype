import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        {/* Logo area */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: "#1a4231" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="text-xl font-700 text-gray-900" style={{ fontWeight: 700 }}>Adlees Fresh</span>
          </div>
          <h1 className="text-2xl font-semibold text-gray-900">Business Portal</h1>
          <p className="text-gray-500 mt-1 text-sm">Select how you'd like to log in</p>
        </div>

        {/* Role cards */}
        <div className="space-y-4">
          <Link href="/admin/dashboard" className="block group">
            <div className="bg-white rounded-2xl border-2 border-transparent p-6 shadow-sm hover:shadow-md transition-all cursor-pointer group-hover:border-[#1a4231]">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: "#edf3f0" }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1a4231" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-gray-900">Admin Portal</h2>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:stroke-[#1a4231] transition-colors">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Manage orders, products and customers. See your full business dashboard.</p>
                  <div className="mt-3">
                    <span className="text-xs font-medium px-2 py-1 rounded-full" style={{ background: "#edf3f0", color: "#1a4231" }}>Adam &amp; Team</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/customer/shop" className="block group">
            <div className="bg-white rounded-2xl border-2 border-transparent p-6 shadow-sm hover:shadow-md transition-all cursor-pointer group-hover:border-[#d15111]">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: "#FEF0EC" }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d15111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-gray-900">Customer Portal</h2>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:stroke-[#d15111] transition-colors">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Browse the product catalogue and place your fresh produce order.</p>
                  <div className="mt-3">
                    <span className="text-xs font-medium px-2 py-1 rounded-full" style={{ background: "#FEF0EC", color: "#d15111" }}>Adlees Clients</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>

        <p className="text-center text-xs text-gray-400 mt-8">
          This is a demo portal — click any option to explore
        </p>
      </div>
    </div>
  );
}
