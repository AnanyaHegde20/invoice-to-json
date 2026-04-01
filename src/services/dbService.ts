import { db } from "../db";

export const saveInvoiceData = async (
  data: any,
  rawText: string,
  cleanedText: string
) => {
  const conn = await db.getConnection();

  try {
    // 1. Save invoice
    const [result]: any = await conn.query(
      `INSERT INTO invoices 
      (vendor_name, invoice_number, invoice_date, buyer_name, gst_number, total_amount, tax_amount)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        data.vendor_name,
        data.invoice_number,
        data.invoice_date,
        data.buyer_name,
        data.gst_number,
        data.total_amount,
        data.tax_amount,
      ]
    );

    const invoiceId = result.insertId;

    // 2. Save OCR logs
    await conn.query(
      `INSERT INTO ocr_logs (invoice_id, raw_text, cleaned_text, status)
       VALUES (?, ?, ?, ?)`,
      [invoiceId, rawText, cleanedText, "SUCCESS"]
    );

    // 3. Save items
    if (data.items) {
      for (const item of data.items) {
        await conn.query(
          `INSERT INTO line_items 
          (invoice_id, description, quantity, unit_price, total)
          VALUES (?, ?, ?, ?, ?)`,
          [
            invoiceId,
            item.description,
            item.quantity,
            item.unit_price,
            item.total,
          ]
        );
      }
    }

  } catch (err) {
    console.error("❌ DB Error:", err);
  } finally {
    conn.release();
  }
};