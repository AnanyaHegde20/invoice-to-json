import { useEffect, useState } from "react";
import axios from "axios";
import { Search } from "lucide-react";

export default function Dashboard() {
  const [invoices, setInvoices] = useState([]);
  const [search, setSearch] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  // ---------- FETCH ALL ----------
  const fetchInvoices = async () => {
    const res = await axios.get("http://localhost:5000/invoices");
    setInvoices(res.data);
  };

  // ---------- SEARCH + FILTER ----------
  const searchInvoices = async () => {
    try {
      let url = `http://localhost:5000/invoices/search?`;

      if (search) {
        url += `vendor=${search}&`;
      }

      if (from && to) {
        url += `fromDate=${from}&toDate=${to}`;
      }

      const res = await axios.get(url);
      setInvoices(res.data);
    } catch (err) {
      console.error("Search failed");
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-6">
      {/* Header */}
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        📊 Invoice Dashboard
      </h1>

      {/* Filters Card */}
      <div className="bg-white shadow-lg rounded-2xl p-5 mb-6">
        {/* Search */}
        <div className="flex items-center gap-3 mb-4">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search vendor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border rounded-xl px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
          </div>

          <button
            onClick={searchInvoices}
            className="bg-blue-600 text-white px-5 py-2 rounded-xl hover:bg-blue-700 transition"
          >
            Search
          </button>
        </div>

        {/* Date Filters */}
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <label className="text-sm text-gray-600">From</label>
            <input
              type="date"
              onChange={(e) => setFrom(e.target.value)}
              className="border rounded-xl px-3 py-2 ml-2"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">To</label>
            <input
              type="date"
              onChange={(e) => setTo(e.target.value)}
              className="border rounded-xl px-3 py-2 ml-2"
            />
          </div>

          <button
            onClick={searchInvoices}
            className="bg-purple-600 text-white px-4 py-2 rounded-xl hover:bg-purple-700 transition"
          >
            Apply Filter
          </button>

          <button
            onClick={fetchInvoices}
            className="bg-gray-500 text-white px-4 py-2 rounded-xl hover:bg-gray-600 transition"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white shadow-lg rounded-2xl p-5">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-blue-100 text-gray-700">
              <th className="p-3">ID</th>
              <th className="p-3">Vendor</th>
              <th className="p-3">Invoice No</th>
              <th className="p-3">Date</th>
              <th className="p-3">Buyer Name</th>
              <th className="p-3">Gst Number</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Tax Amount</th>
            </tr>
          </thead>

          <tbody>
            {invoices.length > 0 ? (
              invoices.map((inv) => (
                <tr
                  key={inv.id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="p-3 font-medium">{inv.id}</td>
                  <td className="p-3 font-medium">{inv.vendor_name}</td>
                  <td className="p-3">{inv.invoice_number}</td>
                  <td className="p-3">{inv.invoice_date}</td>
                  <td className="p-3">{inv.buyer_name}</td>
                  <td className="p-3">{inv.gst_number}</td>
                  <td className="p-3">{inv.total_amount}</td>
                  
                  <td className="p-3 text-green-600 font-semibold">
                    ₹ {inv.tax_amount}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center p-4 text-gray-500">
                  No invoices found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}