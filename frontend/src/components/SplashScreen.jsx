import { useEffect } from "react";
import { motion } from "framer-motion";

const SplashScreen = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish(); // Switch to home page after 2.5 seconds
    }, 2500);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        background: "#0a0a0b",
        overflow: "hidden",
        position: "relative",
        fontFamily: "'DM Sans', 'Sora', sans-serif",
      }}
    >
      {/* Ambient glow top-left */}
      <div
        style={{
          position: "absolute",
          top: "-120px",
          left: "-120px",
          width: "480px",
          height: "480px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(245,158,11,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      {/* Ambient glow bottom-right */}
      <div
        style={{
          position: "absolute",
          bottom: "-120px",
          right: "-80px",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Grid texture */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          pointerEvents: "none",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        style={{ textAlign: "center", position: "relative", zIndex: 10 }}
      >
        {/* Logo mark */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: "64px",
            height: "64px",
            borderRadius: "18px",
            background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
            boxShadow: "0 0 40px rgba(245,158,11,0.35), 0 8px 32px rgba(0,0,0,0.4)",
            marginBottom: "28px",
            margin: "0 auto 28px",
          }}
        >
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <path d="M6 10h20M6 16h14M6 22h10" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="26" cy="22" r="4" fill="white" fillOpacity="0.9" />
            <path d="M24.5 22l1 1 2-2" stroke="#d97706" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontSize: "clamp(28px, 5vw, 42px)",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            color: "#fafafa",
            margin: "0 0 12px",
            lineHeight: 1.1,
          }}
        >
          Smart Invoice
          <span
            style={{
              display: "block",
              background: "linear-gradient(90deg, #f59e0b, #fbbf24)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Extractor
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45, duration: 0.6 }}
          style={{
            color: "rgba(255,255,255,0.45)",
            fontSize: "15px",
            fontWeight: 400,
            letterSpacing: "0.01em",
            margin: 0,
          }}
        >
          Convert your invoices to JSON effortlessly
        </motion.p>

        {/* Loading bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          style={{ marginTop: "40px", display: "flex", justifyContent: "center" }}
        >
          <div
            style={{
              width: "160px",
              height: "2px",
              background: "rgba(255,255,255,0.08)",
              borderRadius: "2px",
              overflow: "hidden",
            }}
          >
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{ duration: 2, ease: "easeInOut", repeat: Infinity }}
              style={{
                height: "100%",
                width: "60%",
                background: "linear-gradient(90deg, transparent, #f59e0b, transparent)",
                borderRadius: "2px",
              }}
            />
          </div>
        </motion.div>
      </motion.div>

      {/* Optional subtle background animation */}
      <motion.div
        className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-green-500 to-blue-500 opacity-10 blur-3xl"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 120, ease: "linear" }}
        style={{ display: "none" }} // hidden — preserving original element per requirements
      />
    </div>
  );
};

export default SplashScreen;
