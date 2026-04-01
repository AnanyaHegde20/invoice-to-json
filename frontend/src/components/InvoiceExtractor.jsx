import { useState } from "react";
import { useNavigate } from "react-router-dom";

// =======================
// Syntax Highlight Helper (UNCHANGED)
// =======================
function SyntaxHighlight({ json }) {
  if (!json) return null;

  const formatted = JSON.stringify(json, null, 2)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|\b-?\d+(\.\d+)?\b)/g,
      (match) => {
        let cls = "text-white";
        if (/^"/.test(match)) {
          if (/:$/.test(match)) cls = "text-green-400";
          else cls = "text-yellow-300";
        } else if (/true|false/.test(match)) cls = "text-blue-400";
        else if (/null/.test(match)) cls = "text-gray-400";
        else cls = "text-purple-400";
        return `<span class="${cls}">${match}</span>`;
      }
    );

  return (
    <pre
      className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 p-5 rounded-2xl overflow-auto max-h-72 font-mono text-sm shadow-lg"
      dangerouslySetInnerHTML={{ __html: formatted }}
    />
  );
}

// =======================
// 🔥 NEW: Table View Component
// =======================
function TableView({ data }) {
  if (!data) return null;

  return (
    <div className="overflow-auto mt-6">
      {/* Invoice Summary */}
      <table className="w-full text-sm text-left border border-gray-600 rounded-xl overflow-hidden">
        <thead className="bg-gradient-to-r from-green-500 to-blue-500 text-white">
          <tr>
            <th className="p-3">Vendor</th>
            <th className="p-3">Invoice No</th>
            <th className="p-3">Date</th>
            <th className="p-3">Buyer</th>
            <th className="p-3">GST</th>
            <th className="p-3">Total</th>
            <th className="p-3">Tax</th>
          </tr>
        </thead>
        <tbody className="bg-white/10 text-white">
          <tr className="border-t border-gray-700 hover:bg-white/20 transition">
            <td className="p-3">{data.vendor_name}</td>
            <td className="p-3">{data.invoice_number}</td>
            <td className="p-3">{data.invoice_date}</td>
            <td className="p-3">{data.buyer_name}</td>
            <td className="p-3">{data.gst_number}</td>
            <td className="p-3 font-semibold text-green-300">{data.total_amount}</td>
            <td className="p-3 text-blue-300">{data.tax_amount}</td>
          </tr>
        </tbody>
      </table>

      {/* Items Table */}
      {data.items?.length > 0 && (
        <table className="w-full text-sm text-left border border-gray-600 mt-6 rounded-xl overflow-hidden">
          <thead className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white">
            <tr>
              <th className="p-3">Description</th>
              <th className="p-3">Qty</th>
              <th className="p-3">Unit Price</th>
              <th className="p-3">Total</th>
            </tr>
          </thead>
          <tbody className="bg-white/10 text-white">
            {data.items.map((item, i) => (
              <tr key={i} className="border-t border-gray-700 hover:bg-white/20 transition">
                <td className="p-3">{item.description}</td>
                <td className="p-3">{item.quantity}</td>
                <td className="p-3">{item.unit_price}</td>
                <td className="p-3 text-green-300 font-semibold">{item.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

// =======================
// Main Component
// =======================

export default function InvoiceExtractor() {
  const navigate = useNavigate(); // ✅ MUST be here (inside component)
  
  const [file, setFile] = useState(null);
  const [jsonResult, setJsonResult] = useState(null);
  const [extracting, setExtracting] = useState(false);

  const backendURL =
    import.meta.env.VITE_API_URL || "http://localhost:5000/extract";

  const upload = async () => {
    if (!file) return alert("Please select a file first");
    if (extracting) return;

    setExtracting(true);
    setJsonResult("⏳ Extracting invoice data...");

    const reader = new FileReader();

    reader.onload = async () => {
      try {
        const base64 = reader.result.split(",")[1];

        // ✅ small delay to avoid server overload
          await new Promise((r) => setTimeout(r, 3000));
          const res = await fetch(backendURL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: base64 }),
        });

        const data = await res.json();

        if (!res.ok) {
          console.error("❌ Backend error:", data);
          setJsonResult(data?.error || data?.details || JSON.stringify(data));
          return;
        }

        setJsonResult(data);
      } catch (err) {
        console.error("❌ Frontend error:", err);
        setJsonResult("❌ Extraction failed. Check console/logs.");
      } finally {
        setExtracting(false);
      }
    };

    reader.readAsDataURL(file);
  };

  // =======================
  // 🔥 IMPROVED CSV DOWNLOAD
  // =======================
  const downloadCSV = () => {
    if (!jsonResult || typeof jsonResult !== "object") return;

    const headers = [
      "Vendor Name","Invoice Number","Invoice Date","Buyer Name",
      "GST Number","Total Amount","Tax Amount","Item Description",
      "Quantity","Unit Price","Item Total"
    ];

    const rows = [];

    if (jsonResult.items?.length > 0) {
      jsonResult.items.forEach((item) => {
        rows.push([
          jsonResult.vendor_name || "",
          jsonResult.invoice_number || "",
          jsonResult.invoice_date || "",
          jsonResult.buyer_name || "",
          jsonResult.gst_number || "",
          jsonResult.total_amount || "",
          jsonResult.tax_amount || "",
          item.description || "",
          item.quantity || "",
          item.unit_price || "",
          item.total || "",
        ]);
      });
    } else {
      rows.push([
        jsonResult.vendor_name || "",
        jsonResult.invoice_number || "",
        jsonResult.invoice_date || "",
        jsonResult.buyer_name || "",
        jsonResult.gst_number || "",
        jsonResult.total_amount || "",
        jsonResult.tax_amount || "",
        "","","","",""
      ]);
    }

    const csvContent = [headers, ...rows]
      .map((row) => row.map((field) => `"${field}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `invoice_${Date.now()}.csv`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-gray-900 p-6 flex flex-col items-center">
      {/* ✅ TOP LEFT DASHBOARD BUTTON */}
      <div className="w-full max-w-4xl flex justify-start mb-4">
        <button
          onClick={() => navigate("/dashboard")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md"
        >
          📊 Dashboard
        </button>
      </div>
      <h1 className="text-5xl md:text-6xl font-extrabold mb-12 text-center text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400 drop-shadow-xl">
        Smart Invoice Extractor
      </h1>

      <div className="bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl p-8 w-full max-w-4xl flex flex-col md:flex-row gap-6 items-center transition-all hover:scale-105">
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="block w-full md:w-2/3 text-gray-900 bg-white/30 backdrop-blur-sm rounded-lg border border-gray-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-400 p-3 text-sm"
        />

        <button
          onClick={upload}
          className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-semibold px-6 py-3 rounded-xl shadow-lg transform transition-all hover:scale-105 w-full md:w-1/3"
        >
          {extracting ? "Extracting..." : "Extract Invoice"}
        </button>
      </div>

      {/* RESULT */}
      {jsonResult && (
        <div className="bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl p-6 w-full max-w-4xl mt-8 transition-all">
          
          {/* ✅ CSV BUTTON */}
          {typeof jsonResult === "object" && (
            <button
              onClick={downloadCSV}
              className="mb-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-5 py-2 rounded-xl shadow-md"
            >
              ⬇ Download CSV
            </button>
          )}

          {/* ✅ TABLE VIEW */}
          {typeof jsonResult === "object" && <TableView data={jsonResult} />}

          {/* ✅ JSON VIEW (existing) */}
          <h2 className="text-2xl font-bold mt-6 mb-3 text-green-300">JSON Result</h2>
          {typeof jsonResult === "object" ? (
            <SyntaxHighlight json={jsonResult} />
          ) : (
            <pre className="bg-gray-900 text-yellow-300 p-4 rounded-xl overflow-auto max-h-72 font-mono text-sm">
              {jsonResult}
            </pre>
          )}
        </div>
      )}
    </div>
  );
}