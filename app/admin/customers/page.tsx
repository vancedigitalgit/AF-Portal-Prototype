import { customers } from "@/lib/data";

export default function CustomersPage() {
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Customers</h1>
          <p className="text-gray-500 mt-0.5 text-sm">{customers.length} active accounts</p>
        </div>
        <button
          className="flex items-center gap-2 text-sm font-medium text-white px-4 py-2.5 rounded-lg transition-colors hover:opacity-90"
          style={{ background: "#1a4231" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Customer
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wide">
              <th className="px-6 py-3 text-left">Business</th>
              <th className="px-6 py-3 text-left">Contact</th>
              <th className="px-6 py-3 text-left">Type</th>
              <th className="px-6 py-3 text-left">Since</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left"></th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id} className="border-t border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="text-sm font-semibold text-gray-900">{customer.name}</div>
                  <div className="text-xs text-gray-400">{customer.address}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-700">{customer.contact}</div>
                  <div className="text-xs text-gray-400">{customer.email}</div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                    {customer.type}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{customer.since}</td>
                <td className="px-6 py-4">
                  <span className="text-xs font-medium px-2 py-1 rounded-full" style={{ background: "#d4e8dc", color: "#059669" }}>
                    Active
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button className="text-sm text-gray-400 hover:text-gray-700 font-medium transition-colors">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
