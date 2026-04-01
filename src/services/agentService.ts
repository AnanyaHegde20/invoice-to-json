import axios from "axios";

export const processInvoiceAgent = async (
  extractedText: string,
  runOCRAgain: () => Promise<string>
) => {
  console.log("🤖 Agent started...");

  let finalText = extractedText;

  // 🔹 Step 1: Retry if OCR is weak
  if (!finalText || finalText.length < 30) {
    console.log("⚠️ Weak OCR detected, retrying...");
    finalText = await runOCRAgain();
  }

  // 🔹 Step 2: Clean OCR text
  const cleanedText = finalText
    .replace(/\s+/g, " ")
    .replace(/[^\x00-\x7F]/g, "")
    .trim();

  // 🔹 Step 3: AI Call
  let aiResponse;
  try {
    aiResponse = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: process.env.AI_MODEL,
        max_tokens: 1500,
        temperature: 0,
        messages: [
          {
            role: "user",
            content: `
Extract structured invoice data and return ONLY valid JSON.
{
 vendor_name:"",
 invoice_number:"",
 invoice_date:"",
 buyer_name:"",
 gst_number:"",
 total_amount:"",
 tax_amount:"",
 items:[
  { description:"", quantity:"", unit_price:"", total:"" }
 ]
}
Invoice text:
${cleanedText}
`,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 60000,
      }
    );
  } catch (err: any) {
    console.error("❌ AI ERROR:", err.message);
    throw new Error("AI failed");
  }

  const raw = aiResponse.data?.choices?.[0]?.message?.content || "";

  // 🔹 Step 4: Parse JSON
  let result: any = {};
  try {
    const cleaned = raw.replace(/```json|```/g, "").trim();
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("No JSON found");

    result = JSON.parse(match[0]);

    // =========================================================
    // 🔥 ULTRA STRONG INVOICE EXTRACTION (FINAL FIX)
    // =========================================================

    // 🔹 Pattern 1: Proper invoice label
    const regex1 = /(inv[o0]ice\s*(?:number|no|#)?[:\s]*)([A-Z0-9\-]{6,30})/i;

    // 🔹 Pattern 2: after "#" symbol
    const regex2 = /#\s*([A-Z0-9\-]{6,30})/;

    // 🔹 Pattern 3: long alphanumeric codes
    const regex3 = /\b[A-Z0-9]{8,30}\b/g;

    let match1 = cleanedText.match(regex1);
    let match2 = cleanedText.match(regex2);

    if (match1 && match1[2]) {
      result.invoice_number = match1[2].toUpperCase();
    } else if (match2 && match2[1]) {
      result.invoice_number = match2[1].toUpperCase();
    } else {
      const candidates = cleanedText.match(regex3);

      if (candidates) {
        const filtered = candidates.filter(
          (val) =>
            ![
              "INVOICE",
              "NUMBER",
              "TOTAL",
              "AMOUNT",
              "GST",
              "TAX",
              "DATE",
              "ORDER",
              "SOLD",
            ].includes(val) &&
            !/^\d{4,}$/.test(val)
        );

        if (filtered.length > 0) {
          result.invoice_number = filtered[0];
        }
      }
    }

  } catch (err) {
    console.error("❌ JSON parse failed");
    result = { raw_output: raw };
  }

  // =========================================================
  // 🔥 VALIDATION
  // =========================================================

  const issues: string[] = [];

  if (!result.vendor_name || result.vendor_name.length < 3) {
    issues.push("vendor_name");
  }

  if (
    !result.invoice_number ||
    result.invoice_number.length < 6 ||
    ["SOLD", "TOTAL", "AMOUNT", "NUMBER"].includes(result.invoice_number)
  ) {
    issues.push("invoice_number");
  }

  if (!result.invoice_date) {
    issues.push("invoice_date");
  }

  if (!result.total_amount || isNaN(Number(result.total_amount))) {
    issues.push("total_amount");
  }

  if (!result.items || result.items.length === 0) {
    issues.push("items");
  }

  // =========================================================
  // 🔁 RETRY LOGIC
  // =========================================================

  if (issues.length > 0) {
    console.log("⚠️ Issues detected:", issues);
    console.log("🔁 Agent retrying OCR + AI...");

    try {
      const retryText = await runOCRAgain();

      const cleanedRetryText = retryText
        .replace(/\s+/g, " ")
        .replace(/[^\x00-\x7F]/g, "")
        .trim();

      const retryAI = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model: process.env.AI_MODEL,
          temperature: 0,
          messages: [
            {
              role: "user",
              content: `
Previous extraction failed for: ${issues.join(",")}

Fix ONLY those fields and return JSON.

Invoice text:
${cleanedRetryText}
`,
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          },
        }
      );

      const retryRaw = retryAI.data?.choices?.[0]?.message?.content || "";

      const retryCleaned = retryRaw.replace(/```json|```/g, "").trim();
      const retryMatch = retryCleaned.match(/\{[\s\S]*\}/);

      if (retryMatch) {
        const retryResult = JSON.parse(retryMatch[0]);

        issues.forEach((field) => {
          if (retryResult[field]) {
            result[field] = retryResult[field];
          }
        });
      }

    } catch {
      console.log("⚠️ Retry failed");
    }
  }

  console.log("✅ Final Result:", result);

  return {
    cleanedText,
    result,
  };
};