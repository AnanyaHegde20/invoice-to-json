export const schemas: any = {
  invoice: {
    requiredFields: [
      "vendor_name",
      "invoice_number",
      "invoice_date",
      "total_amount"
    ]
  },

  medical: {
    requiredFields: [
      "drug_name",
      "dosage",
      "expiry_date"
    ]
  },

  generic: {
    requiredFields: []
  }
};