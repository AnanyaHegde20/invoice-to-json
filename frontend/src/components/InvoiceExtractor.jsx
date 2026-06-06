import { useState } from "react";
import { useNavigate } from "react-router-dom";

// ─────────────────────────────────────────────
// Design tokens (inline, no extra deps)
// ─────────────────────────────────────────────
const T = {
  bg: "#0a0a0b",
  surface: "#111113",
  surfaceHover: "#18181b",
  border: "rgba(255,255,255,0.07)",
  borderStrong: "rgba(255,255,255,0.12)",
  text: "#fafafa",
  textMuted: "rgba(255,255,255,0.45)",
  textSubtle: "rgba(255,255,255,0.25)",
  gold: "#f59e0b",
  goldLight: "#fbbf24",
  goldDim: "rgba(245,158,11,0.15)",
  green: "#10b981",
  greenDim: "rgba(16,185,129,0.15)",
  blue: "#6366f1",
  blueDim: "rgba(99,102,241,0.15)",
  red: "#ef4444",
  redDim: "rgba(239,68,68,0.1)",
  radius: "14px",
  radiusSm: "8px",
  font: "'DM Sans', 'Sora', system-ui, sans-serif",
  fontMono: "'JetBrains Mono', 'Fira Code', monospace",
};

// ─────────────────────────────────────────────
// Syntax Highlight Helper (UNCHANGED logic)
// ─────────────────────────────────────────────
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
      style={{
        background: "#0d0d0f",
        border: `1px solid ${T.border}`,
        borderRadius: T.radius,
        padding: "20px",
        overflowX: "auto",
        maxHeight: "320px",
        fontFamily: T.fontMono,
        fontSize: "12.5px",
        lineHeight: 1.7,
        color: "#e2e8f0",
        margin: 0,
      }}
      dangerouslySetInnerHTML={{ __html: formatted }}
    />
  );
}

// ─────────────────────────────────────────────
// Table View Component (UNCHANGED data logic)
// ─────────────────────────────────────────────
function TableView({ data }) {
  if (!data) return null;

  const thStyle = {
    padding: "10px 16px",
    textAlign: "left",
    fontSize: "11px",
    fontWeight: 600,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: T.textMuted,
    borderBottom: `1px solid ${T.border}`,
    whiteSpace: "nowrap",
  };

  const tdStyle = {
    padding: "12px 16px",
    fontSize: "13.5px",
    color: T.text,
    borderBottom: `1px solid ${T.border}`,
    whiteSpace: "nowrap",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* Invoice Summary Table */}
      <div>
        <p style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: T.textMuted, margin: "0 0 10px", paddingLeft: "4px" }}>
          Invoice Summary
        </p>
        <div style={{ overflowX: "auto", borderRadius: T.radius, border: `1px solid ${T.border}` }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "600px" }}>
            <thead style={{ background: "#0d0d0f" }}>
              <tr>
                {["Vendor", "Invoice No", "Date", "Buyer", "GST", "Total", "Tax"].map((h) => (
                  <th key={h} style={thStyle}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr style={{ background: "transparent" }}>
                <td style={tdStyle}>{data.vendor_name}</td>
                <td style={{ ...tdStyle, color: T.textMuted }}>{data.invoice_number}</td>
                <td style={{ ...tdStyle, color: T.textMuted }}>{data.invoice_date}</td>
                <td style={tdStyle}>{data.buyer_name}</td>
                <td style={{ ...tdStyle, color: T.textMuted, fontFamily: T.fontMono, fontSize: "12px" }}>{data.gst_number}</td>
                <td style={{ ...tdStyle, color: T.green, fontWeight: 700, fontFamily: T.fontMono }}>{data.total_amount}</td>
                <td style={{ ...tdStyle, color: T.gold, fontWeight: 600, fontFamily: T.fontMono }}>{data.tax_amount}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Items Table */}
      {data.items?.length > 0 && (
        <div>
          <p style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: T.textMuted, margin: "0 0 10px", paddingLeft: "4px" }}>
            Line Items
          </p>
          <div style={{ overflowX: "auto", borderRadius: T.radius, border: `1px solid ${T.border}` }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead style={{ background: "#0d0d0f" }}>
                <tr>
                  {["Description", "Qty", "Unit Price", "Total"].map((h) => (
                    <th key={h} style={thStyle}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.items.map((item, i) => (
                  <tr
                    key={i}
                    style={{ background: i % 2 === 1 ? "rgba(255,255,255,0.015)" : "transparent" }}
                  >
                    <td style={tdStyle}>{item.description}</td>
                    <td style={{ ...tdStyle, color: T.textMuted, fontFamily: T.fontMono }}>{item.quantity}</td>
                    <td style={{ ...tdStyle, color: T.textMuted, fontFamily: T.fontMono }}>{item.unit_price}</td>
                    <td style={{ ...tdStyle, color: T.green, fontWeight: 600, fontFamily: T.fontMono }}>{item.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// Badge component
// ─────────────────────────────────────────────
function Badge({ children, color = T.gold, bg = T.goldDim }) {
  return (
    <span style={{
      display: "inline-flex",
      alignItems: "center",
      gap: "5px",
      padding: "3px 10px",
      borderRadius: "99px",
      fontSize: "11.5px",
      fontWeight: 600,
      color,
      background: bg,
      letterSpacing: "0.02em",
    }}>
      {children}
    </span>
  );
}

// ─────────────────────────────────────────────
// Main Component (ALL backend logic preserved)
// ─────────────────────────────────────────────
export default function InvoiceExtractor() {
  const navigate = useNavigate(); // ✅ MUST be here (inside component)

  const [file, setFile] = useState(null);
  const [jsonResult, setJsonResult] = useState(null);
  const [extracting, setExtracting] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const backendURL =
    import.meta.env.VITE_API_URL || "http://localhost:5000/extract";

  // ── ALL backend logic below is UNCHANGED ──
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

  // ✅ IMPROVED CSV DOWNLOAD (logic UNCHANGED)
  const downloadCSV = () => {
    if (!jsonResult || typeof jsonResult !== "object") return;

    const headers = [
      "Vendor Name", "Invoice Number", "Invoice Date", "Buyer Name",
      "GST Number", "Total Amount", "Tax Amount", "Item Description",
      "Quantity", "Unit Price", "Item Total",
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
        "", "", "", "", "",
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

  // Drag-and-drop handlers (UI only — sets file state)
  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) setFile(dropped);
  };

  const isError = typeof jsonResult === "string" && jsonResult.includes("❌");
  const isLoading = typeof jsonResult === "string" && jsonResult.includes("⏳");

  return (
    <div
      style={{
        minHeight: "100vh",
        background: T.bg,
        fontFamily: T.font,
        color: T.text,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background grid */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Top ambient glow */}
      <div
        style={{
          position: "fixed",
          top: "-200px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "700px",
          height: "400px",
          borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(245,158,11,0.07) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* ── NAVBAR ── */}
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          borderBottom: `1px solid ${T.border}`,
          background: "rgba(10,10,11,0.85)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
        }}
      >
        <div
          style={{
            maxWidth: "1080px",
            margin: "0 auto",
            padding: "0 24px",
            height: "60px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "30px",
                height: "30px",
                borderRadius: "8px",
                background: "linear-gradient(135deg, #f59e0b, #d97706)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 0 16px rgba(245,158,11,0.3)",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 5h10M3 8h7M3 11h5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="13" cy="11" r="2" fill="white" fillOpacity="0.9" />
                <path d="M12.3 11l.5.5 1-1" stroke="#d97706" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span style={{ fontWeight: 700, fontSize: "14.5px", letterSpacing: "-0.02em", color: T.text }}>
              InvoiceAI
            </span>
          </div>

          {/* Nav actions */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <button
              onClick={() => navigate("/dashboard")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "7px 14px",
                borderRadius: T.radiusSm,
                background: "transparent",
                border: `1px solid ${T.border}`,
                color: T.textMuted,
                fontSize: "13px",
                fontWeight: 500,
                cursor: "pointer",
                transition: "all 0.15s",
                fontFamily: T.font,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = T.surfaceHover;
                e.currentTarget.style.color = T.text;
                e.currentTarget.style.borderColor = T.borderStrong;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = T.textMuted;
                e.currentTarget.style.borderColor = T.border;
              }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <rect x="1" y="1" width="5" height="5" rx="1.5" fill="currentColor" opacity="0.7" />
                <rect x="8" y="1" width="5" height="5" rx="1.5" fill="currentColor" opacity="0.7" />
                <rect x="1" y="8" width="5" height="5" rx="1.5" fill="currentColor" opacity="0.7" />
                <rect x="8" y="8" width="5" height="5" rx="1.5" fill="currentColor" opacity="0.7" />
              </svg>
              Dashboard
            </button>
          </div>
        </div>
      </nav>

      {/* ── MAIN CONTENT ── */}
      <main
        style={{
          maxWidth: "740px",
          margin: "0 auto",
          padding: "48px 24px 80px",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Page header */}
        <div style={{ marginBottom: "36px" }}>
          <Badge>
            <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
              <circle cx="4" cy="4" r="4" fill={T.gold} />
            </svg>
            AI-Powered
          </Badge>
          <h1
            style={{
              fontSize: "clamp(28px, 5vw, 38px)",
              fontWeight: 800,
              letterSpacing: "-0.035em",
              color: T.text,
              margin: "14px 0 10px",
              lineHeight: 1.15,
            }}
          >
            Extract Invoice Data
          </h1>
          <p style={{ color: T.textMuted, fontSize: "15px", margin: 0, lineHeight: 1.6 }}>
            Upload any invoice image or PDF and get structured JSON data instantly.
          </p>
        </div>

        {/* ── UPLOAD CARD ── */}
        <div
          style={{
            background: T.surface,
            border: `1px solid ${dragOver ? T.gold : T.border}`,
            borderRadius: "20px",
            padding: "32px",
            marginBottom: "20px",
            transition: "border-color 0.2s, box-shadow 0.2s",
            boxShadow: dragOver ? `0 0 0 3px ${T.goldDim}` : "none",
          }}
        >
          {/* Drop zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => document.getElementById("file-input").click()}
            style={{
              border: `2px dashed ${dragOver ? T.gold : T.borderStrong}`,
              borderRadius: T.radius,
              padding: "40px 24px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "12px",
              cursor: "pointer",
              transition: "all 0.2s",
              background: dragOver ? T.goldDim : "rgba(255,255,255,0.015)",
              marginBottom: "24px",
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                background: dragOver ? T.goldDim : "rgba(255,255,255,0.05)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "background 0.2s",
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={dragOver ? T.gold : T.textMuted} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </div>
            {file ? (
              <div style={{ textAlign: "center" }}>
                <p style={{ fontSize: "13.5px", fontWeight: 600, color: T.green, margin: "0 0 4px" }}>
                  ✓ {file.name}
                </p>
                <p style={{ fontSize: "12px", color: T.textMuted, margin: 0 }}>
                  {(file.size / 1024).toFixed(1)} KB · Click to change
                </p>
              </div>
            ) : (
              <div style={{ textAlign: "center" }}>
                <p style={{ fontSize: "13.5px", fontWeight: 600, color: T.text, margin: "0 0 4px" }}>
                  Drop your invoice here
                </p>
                <p style={{ fontSize: "12px", color: T.textMuted, margin: 0 }}>
                  PNG, JPG, PDF supported · or click to browse
                </p>
              </div>
            )}
          </div>

          {/* Hidden file input — preserves original onChange logic */}
          <input
            id="file-input"
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            style={{ display: "none" }}
          />

          {/* Action row */}
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={() => document.getElementById("file-input").click()}
              style={{
                flex: 1,
                padding: "11px 20px",
                borderRadius: T.radiusSm,
                background: "transparent",
                border: `1px solid ${T.border}`,
                color: T.textMuted,
                fontSize: "13.5px",
                fontWeight: 500,
                cursor: "pointer",
                fontFamily: T.font,
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = T.borderStrong; e.currentTarget.style.color = T.text; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.textMuted; }}
            >
              Browse Files
            </button>

            <button
              onClick={upload}
              disabled={extracting || !file}
              style={{
                flex: 2,
                padding: "11px 24px",
                borderRadius: T.radiusSm,
                background: extracting || !file
                  ? "rgba(255,255,255,0.05)"
                  : "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                border: "none",
                color: extracting || !file ? T.textMuted : "#0a0a0b",
                fontSize: "13.5px",
                fontWeight: 700,
                cursor: extracting || !file ? "not-allowed" : "pointer",
                fontFamily: T.font,
                letterSpacing: "-0.01em",
                transition: "all 0.15s",
                boxShadow: extracting || !file ? "none" : "0 4px 20px rgba(245,158,11,0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
              onMouseEnter={(e) => {
                if (!extracting && file) {
                  e.currentTarget.style.boxShadow = "0 6px 28px rgba(245,158,11,0.45)";
                  e.currentTarget.style.transform = "translateY(-1px)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = extracting || !file ? "none" : "0 4px 20px rgba(245,158,11,0.3)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              {extracting ? (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ animation: "spin 1s linear infinite" }}>
                    <path d="M21 12a9 9 0 11-6.219-8.56" />
                  </svg>
                  Extracting…
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                  </svg>
                  Extract Invoice
                </>
              )}
            </button>
          </div>
        </div>

        {/* ── LOADING STATE ── */}
        {isLoading && (
          <div
            style={{
              background: T.surface,
              border: `1px solid ${T.border}`,
              borderRadius: "20px",
              padding: "32px",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "10px",
                  background: T.goldDim,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={T.gold} strokeWidth="2" strokeLinecap="round" style={{ animation: "spin 1s linear infinite" }}>
                  <path d="M21 12a9 9 0 11-6.219-8.56" />
                </svg>
              </div>
              <div>
                <p style={{ fontSize: "13.5px", fontWeight: 600, color: T.text, margin: "0 0 2px" }}>Processing invoice…</p>
                <p style={{ fontSize: "12px", color: T.textMuted, margin: 0 }}>This may take a few seconds</p>
              </div>
            </div>
            {/* Skeleton rows */}
            {[100, 80, 90, 65].map((w, i) => (
              <div
                key={i}
                style={{
                  height: "12px",
                  width: `${w}%`,
                  borderRadius: "6px",
                  background: "rgba(255,255,255,0.05)",
                  animation: "pulse 1.5s ease-in-out infinite",
                  animationDelay: `${i * 0.1}s`,
                }}
              />
            ))}
            <style>{`
              @keyframes spin { to { transform: rotate(360deg); } }
              @keyframes pulse { 0%,100%{opacity:0.4} 50%{opacity:0.8} }
            `}</style>
          </div>
        )}

        {/* ── ERROR STATE ── */}
        {isError && (
          <div
            style={{
              background: T.redDim,
              border: `1px solid rgba(239,68,68,0.2)`,
              borderRadius: "20px",
              padding: "20px 24px",
              display: "flex",
              alignItems: "flex-start",
              gap: "12px",
            }}
          >
            <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: T.red, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "1px" }}>
              <span style={{ color: "white", fontSize: "11px", fontWeight: 700 }}>!</span>
            </div>
            <div>
              <p style={{ fontSize: "13.5px", fontWeight: 600, color: T.red, margin: "0 0 4px" }}>Extraction Failed</p>
              <p style={{ fontSize: "12.5px", color: "rgba(239,68,68,0.7)", margin: 0, fontFamily: T.fontMono }}>{jsonResult}</p>
            </div>
          </div>
        )}

        {/* ── RESULT CARD ── */}
        {jsonResult && typeof jsonResult === "object" && (
          <div
            style={{
              background: T.surface,
              border: `1px solid ${T.border}`,
              borderRadius: "20px",
              overflow: "hidden",
            }}
          >
            {/* Result header */}
            <div
              style={{
                padding: "18px 24px",
                borderBottom: `1px solid ${T.border}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "12px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: T.green, boxShadow: `0 0 8px ${T.green}` }} />
                <span style={{ fontSize: "13.5px", fontWeight: 600, color: T.text }}>Extraction Complete</span>
                <Badge color={T.green} bg={T.greenDim}>
                  {jsonResult.items?.length ?? 0} items
                </Badge>
              </div>
              <button
                onClick={downloadCSV}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "7px",
                  padding: "8px 16px",
                  borderRadius: T.radiusSm,
                  background: T.greenDim,
                  border: `1px solid rgba(16,185,129,0.2)`,
                  color: T.green,
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: T.font,
                  transition: "all 0.15s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(16,185,129,0.2)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = T.greenDim; }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Download CSV
              </button>
            </div>

            {/* Table view */}
            <div style={{ padding: "24px" }}>
              <TableView data={jsonResult} />
            </div>

            {/* JSON section */}
            <div
              style={{
                padding: "0 24px 24px",
                borderTop: `1px solid ${T.border}`,
                paddingTop: "20px",
                marginTop: "4px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
                <p style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: T.textMuted, margin: 0 }}>
                  Raw JSON
                </p>
                <Badge color={T.blue} bg={T.blueDim}>application/json</Badge>
              </div>
              <SyntaxHighlight json={jsonResult} />
            </div>
          </div>
        )}
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100%{opacity:0.4} 50%{opacity:0.8} }
        * { box-sizing: border-box; }
      `}</style>
    </div>
  );
}
