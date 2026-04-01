import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import SplashScreen from "./components/SplashScreen";
import InvoiceExtractor from "./components/InvoiceExtractor";
import Dashboard from "./pages/Dashboard";

function App() {
  const [loading, setLoading] = useState(true);

  // 🔹 Show splash first
  if (loading) {
    return <SplashScreen onFinish={() => setLoading(false)} />;
  }

  // 🔹 After splash → enable routing
  return (
    <Router>
      <Routes>
        <Route path="/" element={<InvoiceExtractor />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;