import { useState } from "react";
import SplashScreen from "./components/SplashScreen";
import InvoiceExtractor from "./components/InvoiceExtractor";

function App() {
  const [loading, setLoading] = useState(true);

  return (
    <>
      {loading ? (
        <SplashScreen onFinish={() => setLoading(false)} />
      ) : (
        <InvoiceExtractor />
      )}
    </>
  );
}

export default App;