export const classifyDocument = (text: string): string => {
  const lower = text.toLowerCase();

  // 🔹 Invoice detection
  if (
    lower.includes("invoice") ||
    lower.includes("gst") ||
    lower.includes("total amount")
  ) {
    return "invoice";
  }

  // 🔹 Medical / drug detection
  if (
    lower.includes("dosage") ||
    lower.includes("expiry") ||
    lower.includes("tablet") ||
    lower.includes("composition")
  ) {
    return "medical";
  }

  return "generic";
};