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
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-purple-700 via-indigo-900 to-blue-800">
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5 }}
        className="text-center"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400 drop-shadow-lg animate-pulse">
          SMART INVOICE EXTRACTOR
        </h1>
        <p className="mt-4 text-white/80 text-lg md:text-xl">
          Convert your invoices to JSON effortlessly
        </p>
      </motion.div>

      {/* Optional subtle background animation */}
      <motion.div
        className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-green-500 to-blue-500 opacity-10 blur-3xl"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 120, ease: "linear" }}
      />
    </div>
  );
};

export default SplashScreen;