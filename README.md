# 📄 Smart Invoice Extractor (Image + PDF → JSON + CSV)

A **full-stack AI powered invoice extraction system** that converts **PNG, JPEG, and PDF invoices into structured JSON and downloadable CSV files**.

The system performs:

Image / PDF → OCR → AI Structuring → JSON → CSV Export

---

# 🚀 Features

### 📥 File Upload

* Upload **PNG**
* Upload **JPEG**
* Upload **PDF**

### 🔍 OCR Processing

* Uses **PaddleOCR (Python)** for text extraction
* Works with **scanned invoices and digital PDFs**

### 🤖 AI Data Structuring

* Uses **OpenRouter LLM API**
* Converts messy OCR text into **structured JSON**

### 📊 Invoice Table Extraction

Extracts fields like:

* Vendor Name
* Invoice Number
* Invoice Date
* Buyer Name
* GST Number
* Total Amount
* Tax Amount
* Item Description
* Quantity
* Unit Price
* Item Total

### 📁 CSV Export

* Download extracted invoice data as **CSV**
* One click **Download CSV button**
* Perfect for Excel / reporting workflows

### 🎨 Modern UI

Frontend built using:

* **React**
* **TailwindCSS**
* **Responsive UI**
* **Syntax highlighted JSON viewer**
* **Modern cards & gradient UI**

### ⚡ Other Features

* Automatic image compression using **Sharp**
* Error handling
* Temporary file cleanup
* Works for **images and PDFs**

---

# 🛠️ Tech Stack

## Backend

* Node.js
* TypeScript
* Express.js
* Axios
* Sharp
* OpenRouter API

## AI / OCR

* Python 3.10+
* PaddleOCR
* Poppler

## Frontend

* React
* Vite
* TailwindCSS

---

# 🐧 Ubuntu / WSL Setup (Recommended)

This project is designed to run inside **Ubuntu using Windows Subsystem for Linux (WSL)**.

## 1️⃣ Install WSL (Windows)

Open **PowerShell as Administrator** and run:

```
wsl --install
```

Restart your computer.

After restart, open **Ubuntu** and create your Linux username and password.

---

# 💻 Install VS Code + WSL Extension

Install:

Visual Studio Code

Then install extension:

**Remote - WSL**

This allows VS Code to run directly inside Ubuntu.

To open project in WSL:

Press:

```
Ctrl + Shift + P
```

Then select:

```
WSL: Open Folder in WSL
```

Open your project folder.

---

# 📦 Install System Dependencies (Ubuntu)

Update packages:

```
sudo apt update
```

Install Node.js:

```
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

Verify installation:

```
node -v
npm -v
```

Install Python:

```
sudo apt install python3 python3-pip python3-venv -y
```

Verify:

```
python3 --version
pip3 --version
```

---

# 📄 Install Poppler (Required for PDF Support)

Poppler converts **PDF → image** before OCR.

Install:

```
sudo apt install poppler-utils -y
```

Verify installation:

```
pdftoppm -v
```

---

# 🧠 Setup Python OCR Environment

Navigate to project folder:

```
cd invoice-to-json
```

Create virtual environment:

```
python3 -m venv ocr_env
```

Activate environment:

```
source ocr_env/bin/activate
```

Upgrade pip:

```
python -m pip install --upgrade pip
```

Install OCR dependencies:

```
pip install -r requirements.txt
```

This installs:

* PaddleOCR
* OpenCV
* NumPy
* Image processing libraries

---

# ⚙️ Environment Setup

Create a `.env` file in project root:

```
OPENROUTER_API_KEY=your_api_key_here
AI_MODEL=google/gemini-3.1-flash-lite-preview
PORT=5000
```

You can change models easily:

Example:

```
AI_MODEL=mistralai/mistral-nemo:free
```

---

# ▶️ Run the Project

## 1️⃣ Start Backend Server

From project root:

```
npm install
npm run dev
```

Server starts at:

```
http://localhost:5000
```

---

## 2️⃣ Start Frontend (React)

Open a new terminal:

```
cd frontend
npm install
npm run dev
```

Frontend runs at:

```
http://localhost:5173
```

Open in browser.

---

# 📤 API Endpoint

### POST `/extract`

Send JSON request:

```
{
  "image": "BASE64_STRING"
}
```

Response:

```
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
```

---

# 📊 CSV Export

After extraction, users can:

* View invoice data in table format
* Click **Download CSV**
* Export invoice data to Excel

Example CSV columns:

* Vendor Name
* Invoice Number
* Invoice Date
* Buyer Name
* GST Number
* Total Amount
* Tax Amount
* Item Description
* Quantity
* Unit Price
* Item Total

---

# 📂 Project Structure

```
invoice-to-json/
│
├── src/
│   ├── server.ts
│   ├── temp/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── InvoiceExtractor.jsx
│   │   │   └── SplashScreen.jsx
│   │   └── main.jsx
│
├── ocr.py
├── requirements.txt
├── .env
├── package.json
├── tsconfig.json
└── README.md
```

---

# ⚠️ Common Errors

### OCR errors

Ensure Python environment is activated:

```
source ocr_env/bin/activate
```

### PDF conversion error

Install Poppler:

```
sudo apt install poppler-utils
```

### API errors

Verify `.env` contains:

```
OPENROUTER_API_KEY
AI_MODEL
```

---

# 💡 Future Improvements

* Multi-page PDF support
* Batch invoice processing
* Database storage
* Authentication
* Cloud deployment (Render / Railway / AWS)
* AI model optimization
* Drag-and-drop upload
* Invoice analytics dashboard

---

# ⭐ Project Summary

Smart Invoice Extractor is a **full-stack AI application** that converts invoices into structured data using:

**OCR + AI + Modern Web UI**

Workflow:

```
Invoice Image/PDF
      ↓
OCR (PaddleOCR)
      ↓
AI Processing (OpenRouter LLM)
      ↓
Structured JSON
      ↓
Downloadable CSV
```

Perfect for:

* Finance automation
* Accounting systems
* Invoice processing pipelines
* AI document extraction systems
