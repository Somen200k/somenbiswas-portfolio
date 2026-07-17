"use client";

import { DocumentMaker } from "@/components/admin/editors/DocumentMaker";

export function QuoteMaker() {
  return (
    <DocumentMaker
      kind="quote"
      title="Quote"
      numberPrefix="QUO"
      secondaryDateLabel="Valid Until"
      defaultNotes="This quote is valid for 14 days. Reach out with any questions before getting started."
      storageKey="sb_quote_draft"
      counterKey="sb_quote_counter"
    />
  );
}
