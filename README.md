# 📄 Smart Invoice Extractor (Image + PDF → JSON + CSV)

A **full-stack AI powered invoice extraction system** that converts **PNG, JPEG, and PDF invoices into structured JSON and downloadable CSV files**.

The system performs:

Image / PDF → OCR → AI Structuring → JSON → CSV Export

---

# 🚀 Features

### 📥 File Upload
- Upload **PNG**
- Upload **JPEG**
- Upload **PDF**

### 🔍 OCR Processing
- Uses **PaddleOCR (Python)** for text extraction
- Works with **scanned invoices and digital PDFs**

### 🤖 AI Data Structuring
- Uses **OpenRouter LLM API**
- Converts messy OCR text into **structured JSON**

### 📊 Invoice Table Extraction
Extracts fields like:

- Vendor Name
- Invoice Number
- Invoice Date
- Buyer Name
- GST Number
- Total Amount
- Tax Amount
- Item Description
- Quantity
- Unit Price
- Item Total

### 📁 CSV Export (NEW)
- Download extracted invoice data as **CSV**
- One click **Download CSV button**
- Perfect for Excel / reporting workflows

### 🎨 Modern UI (NEW)
Frontend built using:

- **React**
- **TailwindCSS**
- **Responsive UI**
- **Syntax highlighted JSON viewer**
- **Modern cards & gradient UI**

### ⚡ Other Features
- Automatic image compression using **Sharp**
- Error handling
- Temporary file cleanup
- Works for **images and PDFs**

---

# 🛠️ Tech Stack

## Backend
- Node.js
- TypeScript
- Express.js
- Axios
- Sharp
- OpenRouter API

## AI / OCR
- Python 3.10+
- PaddleOCR
- Poppler / pdf2image

## Frontend (NEW)
- React
- Vite
- TailwindCSS
- Modern responsive UI

---

# 📦 Prerequisites

## 1️⃣ Install Node.js (LTS)

Download:

https://nodejs.org/

Check installation:

```bash
node -v
npm -v

2️⃣ Install Python 3.10+

Download:

https://www.python.org/downloads/

Check installation:

python --version
pip --version

3️⃣ Setup Python Virtual Environment

Create virtual environment:

python -m venv ocr_env

Activate environment:

Windows
.\ocr_env\Scripts\activate

macOS / Linux
source ocr_env/bin/activate

Upgrade pip:

python -m pip install --upgrade pip

Install dependencies:

pip install -r requirements.txt

📄 Install Poppler (Required for PDF)

Download Poppler:

http://blog.alivate.com.au/poppler-windows/

Steps:

Extract the folder
Add poppler/bin to System PATH
Restart computer

Verify installation:

pdftoppm -version
⚙️ Environment Setup

Create .env file in root:

OPENROUTER_API_KEY=your_api_key_here
AI_MODEL=google/gemini-3.1-flash-lite-preview
PORT=5000

You can change models easily by modifying:

AI_MODEL

Example:

AI_MODEL=mistralai/mistral-nemo:free

▶️ Run the Project

1️⃣ Start Backend Server

From project root:

npm run dev

Server will start at:

http://localhost:5000

2️⃣ Start Frontend (React)

Navigate to frontend folder:

cd frontend
npm install
npm run dev

Frontend runs at:

http://localhost:5173
📤 API Endpoint
POST /extract

Send JSON request:

{
  "image": "BASE64_STRING"
}

Response:

{
  "vendor_name": "",
  "invoice_number": "",
  "invoice_date": "",
  "buyer_name": "",
  "gst_number": "",
  "total_amount": "",
  "tax_amount": "",
  "items": [
    {
      "description": "",
      "quantity": "",
      "unit_price": "",
      "total": ""
    }
  ]
}

📊 CSV Export (NEW)

After extraction, users can:

View invoice data in table format

Click Download CSV
Export invoice data to Excel
Example CSV columns:

Vendor Name
Invoice Number
Invoice Date
Buyer Name
GST Number
Total Amount
Tax Amount
Item Description
Quantity
Unit Price
Item Total

📂 Project Structure
│invoice-to-json
│
├── src
│   ├── server.ts
│   ├── temp/
│   └── output/
│
├── frontend
│   ├── node_modules/
│   ├── src
│   │   ├── components/
│   │   │                  ├── InvoiceExtractor.jsx
│   │   │                  └── SplashScreen.jsx
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── eslint.config.js
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── ocr_env/
│
├── output/
│
├── ocr.py
├── eng.traineddata
├── requirements.txt
├── package.json
├── package-lock.json
├── tsconfig.json
├── .env
└── README.md

⚠️ Common Errors
PaddleOCR / numpy conflicts

Use exact versions from requirements.txt.

PDF conversion errors

Ensure Poppler is added to PATH.

Model API errors

Verify:

OPENROUTER_API_KEY
AI_MODEL

in .env.

💡 Future Improvements

Multi-page PDF support

Batch invoice processing

Database storage

Authentication

Cloud deployment (Render / Railway / AWS)

AI model optimization

Drag-and-drop upload

Invoice analytics dashboard

⭐ Project Summary

Smart Invoice Extractor is a full-stack AI application that converts invoices into structured data using:

OCR + AI + Modern Web UI

Workflow:

Invoice Image/PDF
      ↓
OCR (PaddleOCR)
      ↓
AI Processing (OpenRouter LLM)
      ↓
Structured JSON
      ↓
Downloadable CSV

Perfect for:

Finance automation

Accounting systems

Invoice processing pipelines

AI document extraction systems 
