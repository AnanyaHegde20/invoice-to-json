console.log("💡 server.ts loaded");

import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import sharp from "sharp";
import axios from "axios";
import { execSync } from "child_process";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "20mb" }));

// Temp folder
const tempDir = path.join(__dirname, "temp");
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

// ---------- AUTO CLEAN OLD FILES ----------
function cleanOldTempFiles(ageMs = 1000 * 60 * 60) { // default: 1 hour
  fs.readdirSync(tempDir).forEach((file) => {
    const filePath = path.join(tempDir, file);
    const stats = fs.statSync(filePath);
    if (Date.now() - stats.mtimeMs > ageMs) {
      fs.unlinkSync(filePath);
      console.log(`🗑️ Deleted old temp file: ${file}`);
    }
  });
}

// ---------- OCR TEXT CLEANER ----------
function cleanOCRText(text: string) {
  return text
    .replace(/\s+/g, " ")
    .replace(/[^\x00-\x7F]/g, "")
    .replace(/ppocr DEBUG.*?/g, "")
    .trim();
}

app.post("/extract", async (req: Request, res: Response) => {
  let uploadedPath = "";
  let processedImagePath = "";
  let pdfImagePath = "";

  try {
    cleanOldTempFiles();

    const base64 = req.body.image;
    if (!base64) return res.status(400).json({ error: "No file uploaded" });

    const fileBuffer = Buffer.from(base64, "base64");

    // Detect file type
    const isPDF = fileBuffer.slice(0, 4).toString() === "%PDF";
    const isJPEG = fileBuffer[0] === 0xff && fileBuffer[1] === 0xd8;
    const isPNG = fileBuffer[0] === 0x89 && fileBuffer[1] === 0x50;

    if (!isPDF && !isJPEG && !isPNG)
      return res.status(400).json({ error: "Only PDF, PNG, JPG allowed" });

    uploadedPath = path.join(
      tempDir,
      `upload_${Date.now()}${isPDF ? ".pdf" : isJPEG ? ".jpg" : ".png"}`
    );
    fs.writeFileSync(uploadedPath, fileBuffer);
    console.log("✅ Uploaded file saved at:", uploadedPath);

    let imagePath = uploadedPath;

    if (isPDF) {
      const outputBase = path.join(tempDir, `pdf_${Date.now()}`);
      const poppler = `"C:/poppler-25.12.0/Library/bin/pdftoppm.exe"`;
      const command = `${poppler} -png -f 1 -singlefile "${uploadedPath}" "${outputBase}"`;
      console.log("📄 Converting PDF:", command);
      execSync(command);

      pdfImagePath = `${outputBase}.png`;
      imagePath = pdfImagePath;
      console.log("✅ PDF converted to image:", pdfImagePath);
    }

    const processedBuffer = await sharp(imagePath)
      .resize({ width: 1200, withoutEnlargement: true })
      .grayscale()
      .normalize()
      .sharpen()
      .png({ quality: 80 })
      .toBuffer();

    processedImagePath = path.join(tempDir, `processed_${Date.now()}.png`);
    fs.writeFileSync(processedImagePath, processedBuffer);
    console.log("✅ Processed image saved at:", processedImagePath);

    // ---------- OCR ----------
    let extractedText = "";
    try {
      const pythonPath = path.join(__dirname, "../ocr_env/Scripts/python.exe");
      const command = `"${pythonPath}" "${path.join(__dirname, "../ocr.py")}" "${processedImagePath}"`;
      extractedText = execSync(command, {
        encoding: "utf-8",
        maxBuffer: 1024 * 1024 * 10,
      }).trim();
      extractedText = cleanOCRText(extractedText);
      console.log("📝 Clean OCR text:", extractedText.slice(0, 500));
    } catch (e: any) {
      console.error("❌ PaddleOCR error:", e.message);
      return res.status(500).json({ error: "OCR failed" });
    }

    // ---------- AI EXTRACTION ----------
    const modelName = process.env.AI_MODEL;
    if (!modelName)
      return res.status(500).json({ error: "AI_MODEL not set in .env" });

    const aiResponse = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: process.env.AI_MODEL,
        max_tokens: 1500,
        temperature: 0,
        messages: [
          {
            role: "user",
            content: `
You are an AI invoice parser.
Extract structured data from the invoice text.
Return ONLY valid JSON.
Format:
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
${extractedText}
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

    const raw = aiResponse.data?.choices?.[0]?.message?.content || "";
    const clean = raw.replace(/```json/g, "").replace(/```/g, "").trim();

    let result: any;
    try {
      result = JSON.parse(clean);
    } catch {
      return res.json({ raw_output: raw });
    }

    res.json(result);
  } catch (err: any) {
    console.error("❌ Extraction error:", err.response?.data || err.message);
    res.status(500).json({
      error: "Extraction failed",
      details: err.response?.data || err.message,
    });
  } finally {
    [uploadedPath, processedImagePath, pdfImagePath].forEach((f) => {
      if (f && fs.existsSync(f)) fs.unlinkSync(f);
    });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running at http://localhost:${PORT} using model: ${process.env.AI_MODEL}`)
);