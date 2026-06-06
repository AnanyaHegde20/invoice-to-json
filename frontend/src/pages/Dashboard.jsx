import { useEffect, useState } from "react";
import axios from "axios";
import { Search } from "lucide-react";

// ─────────────────────────────────────────────
// Design tokens
// ─────────────────────────────────────────────
const T = {
  bg: "#0a0a0b",
  surface: "#111113",
  surfaceHover: "#18181b",
  border: "rgba(255,255,255,0.07)",
  borderStrong: "rgba(255,255,255,0.12)",
  text: "#fafafa",
  textMuted: "rgba(255,255,255,0.45)",
  textSubtle: "rgba(255,255,255,0.22)",
  gold: "#f59e0b",
  goldDim: "rgba(245,158,11,0.12)",
  green: "#10b981",
  greenDim: "rgba(16,185,129,0.12)",
  blue: "#6366f1",
  blueDim: "rgba(99,102,241,0.12)",
  violet: "#8b5cf6",
  radius: "14px",
  radiusSm: "8px",
  font: "'DM Sans', 'Sora', system-ui, sans-serif",
  fontMono: "'JetBrains Mono', 'Fira Code', monospace",
};

// ─────────────────────────────────────────────
// Metric card
// ─────────────────────────────────────────────
function MetricCard({ label, value, icon, accent = T.gold, bg = T.goldDim }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? T.surfaceHover : T.surface,
        border: `1px solid ${hovered ? T.borderStrong : T.border}`,
        borderRadius: "16px",
        padding: "20px 22px",
        display: "flex",
        flexDirection: "column",
        gap: "14px",
        transition: "all 0.18s",
        cursor: "default",
        flex: "1 1 160px",
        minWidth: "0",
      }}
    >
      <div
        style={{
          width: "36px",
          height: "36px",
          borderRadius: "10px",
          background: bg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "17px",
        }}
      >
        {icon}
      </div>
      <div>
        <p style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: T.textMuted, margin: "0 0 6px" }}>{label}</p>
        <p style={{ fontSize: "24px", fontWeight: 800, letterSpacing: "-0.03em", color: T.text, margin: 0 }}>{value}</p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Input component
// ─────────────────────────────────────────────
function StyledInput({ type = "text", placeholder, value, onChange, icon, style: extraStyle = {} }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ position: "relative", ...extraStyle }}>
      {icon && (
        <div
          style={{
            position: "absolute",
            left: "12px",
            top: "50%",
            transform: "translateY(-50%)",
            color: focused ? T.gold : T.textSubtle,
            display: "flex",
            transition: "color 0.15s",
            pointerEvents: "none",
          }}
        >
          {icon}
        </div>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: "100%",
          background: "rgba(255,255,255,0.04)",
          border: `1px solid ${focused ? T.gold : T.border}`,
          borderRadius: T.radiusSm,
          padding: icon ? "9px 14px 9px 36px" : "9px 14px",
          color: T.text,
          fontSize: "13.5px",
          fontFamily: T.font,
          outline: "none",
          transition: "border-color 0.15s, box-shadow 0.15s",
          boxShadow: focused ? `0 0 0 3px ${T.goldDim}` : "none",
          boxSizing: "border-box",
        }}
      />
    </div>
  );
}

// ─────────────────────────────────────────────
// Button component
// ─────────────────────────────────────────────
function Button({ children, onClick, variant = "primary", style: extraStyle = {} }) {
  const [hovered, setHovered] = useState(false);

  const styles = {
    primary: {
      background: hovered
        ? "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)"
        : "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
      color: "#0a0a0b",
      border: "none",
      boxShadow: hovered ? "0 6px 24px rgba(245,158,11,0.4)" : "0 3px 14px rgba(245,158,11,0.25)",
      transform: hovered ? "translateY(-1px)" : "none",
    },
    secondary: {
      background: hovered ? T.surfaceHover : "transparent",
      color: hovered ? T.text : T.textMuted,
      border: `1px solid ${hovered ? T.borderStrong : T.border}`,
      boxShadow: "none",
    },
    ghost: {
      background: hovered ? "rgba(239,68,68,0.08)" : "transparent",
      color: hovered ? "#ef4444" : T.textMuted,
      border: `1px solid ${hovered ? "rgba(239,68,68,0.2)" : T.border}`,
      boxShadow: "none",
    },
  };

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: "9px 18px",
        borderRadius: T.radiusSm,
        fontSize: "13px",
        fontWeight: 600,
        fontFamily: T.font,
        cursor: "pointer",
        letterSpacing: "-0.01em",
        transition: "all 0.15s",
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        whiteSpace: "nowrap",
        ...styles[variant],
        ...extraStyle,
      }}
    >
      {children}
    </button>
  );
}

// ─────────────────────────────────────────────
// Empty state
// ─────────────────────────────────────────────
function EmptyState() {
  return (
    <tr>
      <td colSpan="9">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "64px 24px",
            gap: "16px",
          }}
        >
          <div
            style={{
              width: "52px",
              height: "52px",
              borderRadius: "14px",
              background: T.goldDim,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px",
            }}
          >
            📄
          </div>
          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: "14px", fontWeight: 600, color: T.text, margin: "0 0 6px" }}>No invoices found</p>
            <p style={{ fontSize: "13px", color: T.textMuted, margin: 0 }}>Try adjusting your search or date filters</p>
          </div>
        </div>
      </td>
    </tr>
  );
}

// ─────────────────────────────────────────────
// Main Dashboard Component (ALL backend logic preserved)
// ─────────────────────────────────────────────
export default function Dashboard() {
  const [invoices, setInvoices] = useState([]);
  const [search, setSearch] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({});

  // ── ALL backend logic below is UNCHANGED ──

  // ---------- FETCH ALL ----------
  const fetchInvoices = async () => {
    setLoading(true);
    const res = await axios.get("http://localhost:5000/invoices");
    const sorted = [...res.data].sort((a, b) => a.id - b.id);
    setInvoices(sorted);
    setLoading(false);
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
      const sorted = [...res.data].sort((a, b) => a.id - b.id); 
      setInvoices(sorted);
    } catch (err) {
      console.error("Search failed");
    }
  };

  // ---------- EXPORT CSV ----------
  const exportCSV = () => {
    const headers = ["ID", "Vendor", "Invoice No", "Date", "Buyer Name", "GST Number", "Amount", "Tax Amount"];
    const rows = invoices.map((inv) => [
      inv.id,
      inv.vendor_name,
      inv.invoice_number,
      inv.invoice_date,
      inv.buyer_name,
      inv.gst_number,
      inv.total_amount,
      inv.tax_amount,
    ]);
    const escape = (val) => {
      const s = val == null ? "" : String(val);
      return s.includes(",") || s.includes('"') || s.includes("\n") ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const csv = [headers, ...rows].map((row) => row.map(escape).join(",")).join("\r\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const today = new Date();
    const pad = (n) => String(n).padStart(2, "0");
    const filename = `invoices_export_${today.getFullYear()}_${pad(today.getMonth() + 1)}_${pad(today.getDate())}.csv`;
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ---------- EDIT HANDLERS ----------
  const handleEditStart = (inv) => {
    setEditingId(inv.id);
    setEditValues({
      vendor_name: inv.vendor_name,
      invoice_number: inv.invoice_number,
      invoice_date: inv.invoice_date,
      buyer_name: inv.buyer_name,
      gst_number: inv.gst_number,
      total_amount: inv.total_amount,
      tax_amount: inv.tax_amount,
    });
  };

  const handleEditChange = (field, value) => {
    setEditValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleEditSave = (id) => {
    setInvoices((prev) =>
      prev.map((inv) => (inv.id === id ? { ...inv, ...editValues } : inv))
    );
    setEditingId(null);
    setEditValues({});
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditValues({});
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  // ── Derived metrics (UI only) ──
  const totalAmount = invoices.reduce((sum, inv) => sum + (parseFloat(inv.total_amount) || 0), 0);
  const totalTax = invoices.reduce((sum, inv) => sum + (parseFloat(inv.tax_amount) || 0), 0);
  const uniqueVendors = new Set(invoices.map((inv) => inv.vendor_name)).size;

  const thStyle = {
    padding: "11px 16px",
    textAlign: "left",
    fontSize: "11px",
    fontWeight: 600,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: T.textMuted,
    borderBottom: `1px solid ${T.border}`,
    whiteSpace: "nowrap",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: T.bg,
        fontFamily: T.font,
        color: T.text,
        position: "relative",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(0.4); cursor: pointer; }
        @keyframes fadeIn { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
        .row-fade { animation: fadeIn 0.22s ease forwards; }
        @keyframes shimmer { 0%{background-position:-400px 0} 100%{background-position:400px 0} }
        .skeleton { background: linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 75%); background-size: 400px 100%; animation: shimmer 1.4s infinite; border-radius: 4px; }
      `}</style>

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

      {/* ── NAVBAR ── */}
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          borderBottom: `1px solid ${T.border}`,
          background: "rgba(10,10,11,0.9)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
        }}
      >
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "0 24px",
            height: "60px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
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
            <span style={{ fontWeight: 700, fontSize: "14.5px", letterSpacing: "-0.02em" }}>InvoiceAI</span>
            <span style={{ color: T.textSubtle, fontSize: "14px" }}>/</span>
            <span style={{ fontSize: "13.5px", color: T.textMuted, fontWeight: 500 }}>Dashboard</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "4px 10px",
                borderRadius: "99px",
                fontSize: "11.5px",
                fontWeight: 600,
                color: T.green,
                background: T.greenDim,
              }}
            >
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: T.green, display: "inline-block" }} />
              Live
            </span>
          </div>
        </div>
      </nav>

      {/* ── PAGE CONTENT ── */}
      <main
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "36px 24px 80px",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Page title */}
        <div style={{ marginBottom: "28px" }}>
          {/* Back button */}
          <button
            onClick={() => window.history.back()}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "5px",
              marginBottom: "14px",
              background: "transparent",
              border: `1px solid ${T.border}`,
              borderRadius: T.radiusSm,
              color: T.textMuted,
              fontSize: "13px",
              fontWeight: 600,
              fontFamily: T.font,
              padding: "6px 12px",
              cursor: "pointer",
              transition: "all 0.15s",
              letterSpacing: "-0.01em",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = T.text;
              e.currentTarget.style.borderColor = T.borderStrong;
              e.currentTarget.style.background = T.surfaceHover;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = T.textMuted;
              e.currentTarget.style.borderColor = T.border;
              e.currentTarget.style.background = "transparent";
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
              <path d="M8.5 2.5L4 7l4.5 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back
          </button>

          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "10px" }}>
            <div>
              <h1 style={{ fontSize: "26px", fontWeight: 800, letterSpacing: "-0.03em", margin: "0 0 4px", color: T.text }}>
                Invoice Dashboard
              </h1>
              <p style={{ fontSize: "13.5px", color: T.textMuted, margin: 0 }}>
                {invoices.length} invoice{invoices.length !== 1 ? "s" : ""} total
              </p>
            </div>

            {/* Export CSV button */}
            <Button onClick={exportCSV} variant="secondary" style={{ height: "38px" }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
                <path d="M7 1v7M4.5 5.5L7 8l2.5-2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M2 10v1.5A1.5 1.5 0 003.5 13h7a1.5 1.5 0 001.5-1.5V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              Export CSV
            </Button>
          </div>
        </div>

        {/* ── METRIC CARDS ── */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "12px",
            marginBottom: "24px",
          }}
        >
          <MetricCard
            label="Total Invoices"
            value={loading ? "—" : invoices.length}
            icon="📄"
            accent={T.gold}
            bg={T.goldDim}
          />
          <MetricCard
            label="Total Amount"
            value={loading ? "—" : `₹${totalAmount.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`}
            icon="₹"
            accent={T.green}
            bg={T.greenDim}
          />
          <MetricCard
            label="Total Tax"
            value={loading ? "—" : `₹${totalTax.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`}
            icon="🧾"
            accent={T.blue}
            bg={T.blueDim}
          />
          <MetricCard
            label="Unique Vendors"
            value={loading ? "—" : uniqueVendors}
            icon="🏢"
            accent={T.violet}
            bg="rgba(139,92,246,0.12)"
          />
        </div>

        {/* ── FILTERS CARD ── */}
        <div
          style={{
            background: T.surface,
            border: `1px solid ${T.border}`,
            borderRadius: "16px",
            padding: "18px 20px",
            marginBottom: "16px",
            display: "flex",
            flexWrap: "wrap",
            gap: "10px",
            alignItems: "flex-end",
          }}
        >
          {/* Search */}
          <div style={{ flex: "1 1 200px", minWidth: "160px" }}>
            <label style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase", color: T.textMuted, display: "block", marginBottom: "6px" }}>
              Vendor
            </label>
            <StyledInput
              type="text"
              placeholder="Search vendor…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              icon={<Search size={14} />}
            />
          </div>

          {/* From date */}
          <div style={{ flex: "0 1 160px", minWidth: "130px" }}>
            <label style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase", color: T.textMuted, display: "block", marginBottom: "6px" }}>
              From
            </label>
            <StyledInput
              type="date"
              onChange={(e) => setFrom(e.target.value)}
            />
          </div>

          {/* To date */}
          <div style={{ flex: "0 1 160px", minWidth: "130px" }}>
            <label style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase", color: T.textMuted, display: "block", marginBottom: "6px" }}>
              To
            </label>
            <StyledInput
              type="date"
              onChange={(e) => setTo(e.target.value)}
            />
          </div>

          {/* Action buttons */}
          <div style={{ display: "flex", gap: "8px", alignItems: "center", paddingBottom: "1px" }}>
            <Button onClick={searchInvoices} variant="primary">
              <Search size={13} />
              Search
            </Button>
            <Button onClick={fetchInvoices} variant="secondary">
              Reset
            </Button>
          </div>
        </div>

        {/* ── TABLE CARD ── */}
        <div
          style={{
            background: T.surface,
            border: `1px solid ${T.border}`,
            borderRadius: "16px",
            overflow: "hidden",
          }}
        >
          {/* Table header bar */}
          <div
            style={{
              padding: "14px 20px",
              borderBottom: `1px solid ${T.border}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <p style={{ fontSize: "13px", fontWeight: 600, color: T.text, margin: 0 }}>
              All Invoices
            </p>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "3px 10px",
                borderRadius: "99px",
                fontSize: "11.5px",
                fontWeight: 600,
                color: T.textMuted,
                background: "rgba(255,255,255,0.05)",
              }}
            >
              {invoices.length} rows
            </span>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "760px" }}>
              <thead>
                <tr style={{ background: "#0d0d0f" }}>
                  {["ID", "Vendor", "Invoice No", "Date", "Buyer Name", "GST Number", "Amount", "Tax Amount", "Actions"].map((h) => (
                    <th key={h} style={thStyle}>{h}</th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  // Skeleton rows
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      {Array.from({ length: 8 }).map((_, j) => (
                        <td key={j} style={{ padding: "14px 16px" }}>
                          <div className="skeleton" style={{ height: "12px", width: `${60 + Math.random() * 30}%` }} />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : invoices.length > 0 ? (
                  invoices.map((inv, idx) => (
                    <InvoiceRow
                      key={inv.id}
                      inv={inv}
                      idx={idx}
                      isEditing={editingId === inv.id}
                      editValues={editValues}
                      onEditStart={handleEditStart}
                      onEditChange={handleEditChange}
                      onEditSave={handleEditSave}
                      onEditCancel={handleEditCancel}
                    />
                  ))
                ) : (
                  <EmptyState />
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

// ─────────────────────────────────────────────
// Invoice Row (separated for hover state)
// ─────────────────────────────────────────────
function InvoiceRow({ inv, idx, isEditing, editValues, onEditStart, onEditChange, onEditSave, onEditCancel }) {
  const [hovered, setHovered] = useState(false);

  const tdBase = {
    padding: "13px 16px",
    fontSize: "13.5px",
    borderBottom: `1px solid ${T.border}`,
    transition: "background 0.1s",
  };

  const editInputStyle = {
    width: "100%",
    minWidth: "80px",
    background: "rgba(255,255,255,0.06)",
    border: `1px solid ${T.gold}`,
    borderRadius: "6px",
    padding: "5px 8px",
    color: T.text,
    fontSize: "13px",
    fontFamily: T.font,
    outline: "none",
    boxShadow: `0 0 0 2px ${T.goldDim}`,
    boxSizing: "border-box",
  };

  return (
    <tr
      className="row-fade"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: isEditing ? "rgba(245,158,11,0.04)" : hovered ? T.surfaceHover : "transparent",
        animationDelay: `${idx * 0.03}s`,
      }}
    >
      {/* ID — never editable */}
      <td style={{ ...tdBase, color: T.textMuted, fontFamily: T.fontMono, fontSize: "12px" }}>
        #{inv.id}
      </td>

      {/* Vendor */}
      <td style={{ ...tdBase, color: T.text, fontWeight: 600 }}>
        {isEditing ? (
          <input style={editInputStyle} value={editValues.vendor_name ?? ""} onChange={(e) => onEditChange("vendor_name", e.target.value)} />
        ) : inv.vendor_name}
      </td>

      {/* Invoice No */}
      <td style={{ ...tdBase, color: T.textMuted, fontFamily: T.fontMono, fontSize: "12.5px" }}>
        {isEditing ? (
          <input style={{ ...editInputStyle, fontFamily: T.fontMono }} value={editValues.invoice_number ?? ""} onChange={(e) => onEditChange("invoice_number", e.target.value)} />
        ) : inv.invoice_number}
      </td>

      {/* Date */}
      <td style={{ ...tdBase, color: T.textMuted, fontSize: "12.5px" }}>
        {isEditing ? (
          <input type="date" style={editInputStyle} value={editValues.invoice_date ?? ""} onChange={(e) => onEditChange("invoice_date", e.target.value)} />
        ) : inv.invoice_date}
      </td>

      {/* Buyer Name */}
      <td style={{ ...tdBase, color: T.text }}>
        {isEditing ? (
          <input style={editInputStyle} value={editValues.buyer_name ?? ""} onChange={(e) => onEditChange("buyer_name", e.target.value)} />
        ) : inv.buyer_name}
      </td>

      {/* GST Number */}
      <td style={{ ...tdBase, color: T.textMuted, fontFamily: T.fontMono, fontSize: "12px" }}>
        {isEditing ? (
          <input style={{ ...editInputStyle, fontFamily: T.fontMono }} value={editValues.gst_number ?? ""} onChange={(e) => onEditChange("gst_number", e.target.value)} />
        ) : inv.gst_number}
      </td>

      {/* Amount */}
      <td style={{ ...tdBase, color: T.text, fontFamily: T.fontMono, fontWeight: 600 }}>
        {isEditing ? (
          <input style={{ ...editInputStyle, fontFamily: T.fontMono }} value={editValues.total_amount ?? ""} onChange={(e) => onEditChange("total_amount", e.target.value)} />
        ) : inv.total_amount}
      </td>

      {/* Tax Amount */}
      <td style={{ ...tdBase }}>
        {isEditing ? (
          <input style={{ ...editInputStyle, fontFamily: T.fontMono }} value={editValues.tax_amount ?? ""} onChange={(e) => onEditChange("tax_amount", e.target.value)} />
        ) : (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "3px 10px",
              borderRadius: "99px",
              fontSize: "12px",
              fontWeight: 700,
              color: T.gold,
              background: T.goldDim,
              fontFamily: T.fontMono,
            }}
          >
            ₹{inv.tax_amount}
          </span>
        )}
      </td>

      {/* Actions */}
      <td style={{ ...tdBase, whiteSpace: "nowrap" }}>
        {isEditing ? (
          <div style={{ display: "flex", gap: "6px" }}>
            <button
              onClick={() => onEditSave(inv.id)}
              style={{
                padding: "5px 12px",
                borderRadius: "6px",
                fontSize: "12px",
                fontWeight: 600,
                fontFamily: T.font,
                cursor: "pointer",
                border: "none",
                background: "linear-gradient(135deg, #10b981, #059669)",
                color: "#fff",
                boxShadow: "0 2px 8px rgba(16,185,129,0.3)",
                transition: "all 0.15s",
              }}
            >
              Save
            </button>
            <button
              onClick={onEditCancel}
              style={{
                padding: "5px 12px",
                borderRadius: "6px",
                fontSize: "12px",
                fontWeight: 600,
                fontFamily: T.font,
                cursor: "pointer",
                background: "transparent",
                border: `1px solid ${T.border}`,
                color: T.textMuted,
                transition: "all 0.15s",
              }}
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => onEditStart(inv)}
            style={{
              padding: "5px 12px",
              borderRadius: "6px",
              fontSize: "12px",
              fontWeight: 600,
              fontFamily: T.font,
              cursor: "pointer",
              background: "transparent",
              border: `1px solid ${T.border}`,
              color: T.textMuted,
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = T.gold;
              e.currentTarget.style.color = T.gold;
              e.currentTarget.style.background = T.goldDim;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = T.border;
              e.currentTarget.style.color = T.textMuted;
              e.currentTarget.style.background = "transparent";
            }}
          >
            Edit
          </button>
        )}
      </td>
    </tr>
  );
}
