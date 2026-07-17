"use client";

import { DocumentMaker } from "@/components/admin/editors/DocumentMaker";

export function InvoiceMaker() {
  return (
    <DocumentMaker
      kind="invoice"
      title="Invoice"
      numberPrefix="INV"
      secondaryDateLabel="Due Date"
      defaultNotes="Payment due within 7 days. Thank you for your business."
      storageKey="sb_invoice_draft"
      counterKey="sb_invoice_counter"
    />
  );
}
