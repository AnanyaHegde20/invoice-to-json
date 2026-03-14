import { useState } from "react";

// =======================
// Syntax Highlight Helper
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
// Main Component
// =======================
export default function InvoiceExtractor() {
  const [file, setFile] = useState(null);
  const [jsonResult, setJsonResult] = useState(null);
  const [extracting, setExtracting] = useState(false);

  const upload = async () => {
    if (!file) return alert("Please select a file first");
    if (extracting) return;

    setExtracting(true);
    setJsonResult("⏳ Extracting invoice data...");

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64 = reader.result.split(",")[1];
        const res = await fetch("http://localhost:5000/extract", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: base64 }),
        });

        if (!res.ok) throw new Error("Server error");

        const data = await res.json();
        setJsonResult(data);
      } catch (err) {
        setJsonResult("❌ Extraction failed. Please try again.");
        console.error(err);
      } finally {
        setExtracting(false);
      }
    };

    reader.readAsDataURL(file);
  };

  const downloadCSV = () => {
    if (!jsonResult || typeof jsonResult !== "object") return;

    const headers = [
      "Vendor Name","Invoice Number","Invoice Date","Buyer Name",
      "GST Number","Total Amount","Tax Amount",
      "Item Description","Quantity","Unit Price","Item Total"
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

    const csvContent = [headers, ...rows].map((row) =>
      row.map((field) => `"${field}"`).join(",")
    ).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `invoice_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-gray-900 p-6 flex flex-col items-center">
      
      {/* Hero / Header */}
      <h1 className="text-5xl md:text-6xl font-extrabold mb-12 text-center text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400 drop-shadow-xl">
        Smart Invoice Extractor
      </h1>

      {/* Upload Card */}
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

      {/* JSON Result Card */}
      {jsonResult && (
        <div className="bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl p-6 w-full max-w-4xl mt-8 transition-all">
          <h2 className="text-2xl font-bold mb-3 text-green-300">JSON Result</h2>

          {typeof jsonResult === "object" ? (
            <SyntaxHighlight json={jsonResult} />
          ) : (
            <pre className="bg-gray-900 text-yellow-300 p-4 rounded-xl overflow-auto max-h-72 font-mono text-sm">
              {jsonResult}
            </pre>
          )}
        </div>
      )}

      {/* Invoice Table Card */}
      {jsonResult && typeof jsonResult === "object" && (
        <div className="bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl p-6 w-full max-w-5xl mt-8 mb-8 transition-all">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-2xl font-bold text-blue-300">Invoice Details</h2>
            <button
              onClick={downloadCSV}
              className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:scale-105 transition-transform"
            >
              Download CSV
            </button>
          </div>

          <div className="overflow-x-auto rounded-lg">
            <table className="min-w-full divide-y divide-gray-300 border border-gray-300">
              <thead className="bg-gradient-to-r from-green-400 to-blue-500 text-white text-left">
                <tr>
                  <th className="px-4 py-2">Field</th>
                  <th className="px-4 py-2">Value</th>
                </tr>
              </thead>

              <tbody className="bg-white/20 divide-y divide-gray-300">
                {Object.entries(jsonResult).map(([key, value], idx) => {
                  if (key === "items") return null; // skip items, handled separately
                  return (
                    <tr key={idx} className={idx % 2 === 0 ? "bg-white/10" : "bg-white/20"}>
                      <td className="px-4 py-2 border font-semibold capitalize">{key.replace(/_/g, " ")}</td>
                      <td className="px-4 py-2 border">{value}</td>
                    </tr>
                  );
                })}

                {jsonResult.items?.length > 0 && (
                  <>
                    <tr className="bg-gradient-to-r from-green-400 to-blue-400 text-center font-bold text-white">
                      <td className="px-4 py-2" colSpan={2}>Items</td>
                    </tr>

                    {jsonResult.items.map((item, idx) => (
                      <tr key={idx} className={idx % 2 === 0 ? "bg-white/10" : "bg-white/20"}>
                        <td className="px-4 py-2 border">{item.description}</td>
                        <td className="px-4 py-2 border">
                          Qty: {item.quantity}, Unit: {item.unit_price}, Total: {item.total}
                        </td>
                      </tr>
                    ))}
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}