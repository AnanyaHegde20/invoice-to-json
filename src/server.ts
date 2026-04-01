console.log("💡 server.ts loaded");

import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import sharp from "sharp";
import { execSync } from "child_process";
import { processInvoiceAgent } from "./services/agentService";
import { saveInvoiceData } from "./services/dbService";
import { db } from "./db"; 

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json({ limit: "20mb" }));

// ✅ GLOBAL LOCK
let isProcessing = false;

// ---------- HEALTHCHECK ----------
app.get("/", (req: Request, res: Response) => res.send("OK"));

// Temp folder
const tempDir = path.join(__dirname, "temp");
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

// ---------- CLEAN OLD FILES ----------
function cleanOldTempFiles(ageMs = 1000 * 60 * 60) {
  fs.readdirSync(tempDir).forEach((file) => {
    const filePath = path.join(tempDir, file);
    const stats = fs.statSync(filePath);
    if (Date.now() - stats.mtimeMs > ageMs) {
      fs.unlinkSync(filePath);
      console.log(`🗑️ Deleted old temp file: ${file}`);
    }
  });
}

// ---------- OCR TEXT CLEAN ----------
function cleanOCRText(text: string) {
  return text
    .replace(/\s+/g, " ")
    .replace(/[^\x00-\x7F]/g, "")
    .trim();
}

// ---------- REMOVE OCR NOISE ----------
function removeOCRNoise(text: string) {
  return text
    .split("\n")
    .filter(
      (line) =>
        !line.includes("Checking file") &&
        !line.includes("download") &&
        !line.includes("Exists:")
    )
    .join(" ");
}

// ---------- MAIN API ----------
app.post("/extract", async (req: Request, res: Response) => {
  if (isProcessing) {
    return res.status(429).json({ error: "Server busy, try again" });
  }

  isProcessing = true;

  let uploadedPath = "";
  let processedImagePath = "";
  let pdfImagePath = "";

  try {
    cleanOldTempFiles();

    const base64 = req.body.image;
    if (!base64) {
      isProcessing = false;
      return res.status(400).json({ error: "No file uploaded" });
    }

    const fileBuffer = Buffer.from(base64, "base64");

    const isPDF = fileBuffer.slice(0, 4).toString() === "%PDF";
    const isJPEG = fileBuffer[0] === 0xff && fileBuffer[1] === 0xd8;
    const isPNG = fileBuffer[0] === 0x89 && fileBuffer[1] === 0x50;

    if (!isPDF && !isJPEG && !isPNG) {
      isProcessing = false;
      return res.status(400).json({ error: "Only PDF, PNG, JPG allowed" });
    }

    uploadedPath = path.join(
      tempDir,
      `upload_${Date.now()}${isPDF ? ".pdf" : isJPEG ? ".jpg" : ".png"}`
    );

    fs.writeFileSync(uploadedPath, fileBuffer);
    console.log("✅ Uploaded file saved:", uploadedPath);

    let imagePath = uploadedPath;

    // ---------- PDF → IMAGE ----------
    if (isPDF) {
      const outputBase = path.join(tempDir, `pdf_${Date.now()}`);
      const command = `pdftoppm -png -f 1 -singlefile "${uploadedPath}" "${outputBase}"`;

      console.log("📄 Converting PDF:", command);
      execSync(command);

      pdfImagePath = `${outputBase}.png`;
      imagePath = pdfImagePath;

      console.log("✅ PDF converted:", pdfImagePath);
    }

    // ---------- IMAGE PROCESS ----------
    const processedBuffer = await sharp(imagePath)
      .resize({ width: 2000, withoutEnlargement: true })
      .grayscale()
      .normalize()
      .sharpen()
      .png({ quality: 100 })
      .toBuffer();

    processedImagePath = path.join(tempDir, `processed_${Date.now()}.png`);
    fs.writeFileSync(processedImagePath, processedBuffer);

    console.log("✅ Processed image:", processedImagePath);

    // ---------- OCR ----------
    let extractedText = "";

    try {
      const pythonPath = path.resolve(__dirname, "../ocr_env/bin/python");
      const ocrScript = path.resolve(__dirname, "../ocr.py");

      const ocrCommand = `"${pythonPath}" "${ocrScript}" "${processedImagePath}"`;

      console.log("🐍 Running OCR:", ocrCommand);

      const output = execSync(ocrCommand, {
        encoding: "utf-8",
        maxBuffer: 1024 * 1024 * 10,
      });

      const cleanedOutput = removeOCRNoise(output);
      extractedText = cleanOCRText(cleanedOutput);

      console.log("📝 OCR Text:", extractedText.slice(0, 300));
    } catch (e: any) {
      console.error("❌ PaddleOCR error:", e.message);
      isProcessing = false;
      return res.status(500).json({ error: "OCR failed" });
    }

    // ---------- AGENT ----------
    const agentResponse = await processInvoiceAgent(
      extractedText,
      async () => {
        console.log("🔁 Re-running OCR...");

        const pythonPath = path.resolve(__dirname, "../ocr_env/bin/python");
        const ocrScript = path.resolve(__dirname, "../ocr.py");

        const retryCommand = `"${pythonPath}" "${ocrScript}" "${processedImagePath}"`;

        const output = execSync(retryCommand, {
          encoding: "utf-8",
          maxBuffer: 1024 * 1024 * 10,
        });

        const cleanedRetryOutput = removeOCRNoise(output);
        return cleanOCRText(cleanedRetryOutput);
      }
    );

    const result = agentResponse.result;

    await saveInvoiceData(result, extractedText, agentResponse.cleanedText);

    res.json(result);

  } catch (err: any) {
    console.error("❌ Extraction error:", err.message);
    res.status(500).json({ error: "Extraction failed" });
  } finally {
    isProcessing = false;

    [uploadedPath, processedImagePath, pdfImagePath].forEach((f) => {
      if (f && fs.existsSync(f)) {
        fs.unlinkSync(f);
      }
    });
  }
});


// ==========================================================
// ✅ NEW APIs (ADD HERE ONLY - AFTER /extract)
// ==========================================================

// ---------- GET ALL INVOICES ----------
app.get("/invoices", async (req: Request, res: Response) => {
  try {
    const [rows]: any = await db.execute(
      "SELECT * FROM invoices ORDER BY created_at DESC"
    );
    res.json(rows);
  } catch (err) {
    console.error("❌ Fetch invoices failed");
    res.status(500).json({ error: "DB error" });
  }
});

// ---------- SEARCH / FILTER ----------
app.get("/invoices/search", async (req: Request, res: Response) => {
  const { vendor, fromDate, toDate } = req.query;

  let query = "SELECT * FROM invoices WHERE 1=1";
  const params: any[] = [];

  if (vendor) {
    query += " AND vendor_name LIKE ?";
    params.push(`%${vendor}%`);
  }

  if (fromDate && toDate) {
    query += " AND invoice_date BETWEEN ? AND ?";
    params.push(fromDate, toDate);
  }

  query += " ORDER BY created_at DESC";

  try {
    const [rows]: any = await db.execute(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Search failed" });
  }
});


// ---------- START ----------
const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`🚀 Server running at http://localhost:${PORT}`)
);