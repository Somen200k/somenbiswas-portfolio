"use client";

import { useEffect, useRef, useState } from "react";
import { Plus, Trash2, Download, RotateCcw, Loader2 } from "lucide-react";
import { AdminField, inputClass } from "@/components/admin/AdminField";
import { LogoMark } from "@/components/ui/Logo";
import { downloadElementAsPdf } from "@/lib/download-pdf";

interface LineItem {
  id: string;
  description: string;
  qty: number;
  rate: number;
}

interface DocState {
  businessName: string;
  businessEmail: string;
  businessWebsite: string;
  businessAddress: string;
  clientName: string;
  clientEmail: string;
  clientAddress: string;
  docNumber: string;
  docDate: string;
  secondaryDate: string;
  currency: "USD" | "INR";
  taxPercent: number;
  notes: string;
  items: LineItem[];
}

const CURRENCY_SYMBOL: Record<DocState["currency"], string> = {
  USD: "$",
  INR: "₹",
};

function newItem(): LineItem {
  return { id: crypto.randomUUID(), description: "", qty: 1, rate: 0 };
}

interface DocumentMakerConfig {
  kind: "invoice" | "quote";
  title: string;
  numberPrefix: string;
  secondaryDateLabel: string;
  defaultNotes: string;
  storageKey: string;
  counterKey: string;
}

function nextNumber(config: DocumentMakerConfig): string {
  const current = Number(localStorage.getItem(config.counterKey) || "0") + 1;
  localStorage.setItem(config.counterKey, String(current));
  return `${config.numberPrefix}-${String(current).padStart(4, "0")}`;
}

function defaultDoc(config: DocumentMakerConfig): DocState {
  return {
    businessName: "Somen Biswas",
    businessEmail: "somen.office@gmail.com",
    businessWebsite: "somenbiswas.com",
    businessAddress: "Kolkata, India",
    clientName: "",
    clientEmail: "",
    clientAddress: "",
    docNumber: "",
    docDate: new Date().toISOString().slice(0, 10),
    secondaryDate: "",
    currency: "USD",
    taxPercent: 0,
    notes: config.defaultNotes,
    items: [newItem()],
  };
}

export function DocumentMaker(config: DocumentMakerConfig) {
  const [doc, setDoc] = useState<DocState | null>(null);
  const [downloading, setDownloading] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem(config.storageKey);
    if (saved) {
      setDoc(JSON.parse(saved));
    } else {
      const d = defaultDoc(config);
      d.docNumber = nextNumber(config);
      setDoc(d);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (doc) localStorage.setItem(config.storageKey, JSON.stringify(doc));
  }, [doc, config]);

  if (!doc) return <p className="text-sm text-muted">Loading...</p>;

  function update<K extends keyof DocState>(key: K, value: DocState[K]) {
    setDoc((prev) => (prev ? { ...prev, [key]: value } : prev));
  }

  function updateItem(id: string, patch: Partial<LineItem>) {
    setDoc((prev) =>
      prev
        ? { ...prev, items: prev.items.map((it) => (it.id === id ? { ...it, ...patch } : it)) }
        : prev
    );
  }

  function addItem() {
    setDoc((prev) => (prev ? { ...prev, items: [...prev.items, newItem()] } : prev));
  }

  function removeItem(id: string) {
    setDoc((prev) => (prev ? { ...prev, items: prev.items.filter((it) => it.id !== id) } : prev));
  }

  function startNew() {
    const d = defaultDoc(config);
    d.docNumber = nextNumber(config);
    setDoc(d);
  }

  async function handleDownload() {
    if (!previewRef.current || !doc) return;
    setDownloading(true);
    try {
      await downloadElementAsPdf(previewRef.current, `${doc.docNumber}.pdf`);
    } finally {
      setDownloading(false);
    }
  }

  const symbol = CURRENCY_SYMBOL[doc.currency];
  const subtotal = doc.items.reduce((sum, it) => sum + it.qty * it.rate, 0);
  const tax = subtotal * (doc.taxPercent / 100);
  const total = subtotal + tax;

  return (
    <div className="grid items-start gap-8 lg:grid-cols-2">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{config.title} Details</h3>
          <button
            type="button"
            onClick={startNew}
            className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs"
          >
            <RotateCcw className="h-3.5 w-3.5" /> New {config.title}
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <AdminField label={`${config.title} Number`}>
            <input
              className={inputClass}
              value={doc.docNumber}
              onChange={(e) => update("docNumber", e.target.value)}
            />
          </AdminField>
          <AdminField label="Currency">
            <select
              className={inputClass}
              value={doc.currency}
              onChange={(e) => update("currency", e.target.value as DocState["currency"])}
            >
              <option value="USD">USD ($)</option>
              <option value="INR">INR (₹)</option>
            </select>
          </AdminField>
          <AdminField label={`${config.title} Date`}>
            <input
              type="date"
              className={inputClass}
              value={doc.docDate}
              onChange={(e) => update("docDate", e.target.value)}
            />
          </AdminField>
          <AdminField label={config.secondaryDateLabel}>
            <input
              type="date"
              className={inputClass}
              value={doc.secondaryDate}
              onChange={(e) => update("secondaryDate", e.target.value)}
            />
          </AdminField>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gold">
            Your Details
          </h4>
          <div className="space-y-3">
            <AdminField label="Name / Business">
              <input
                className={inputClass}
                value={doc.businessName}
                onChange={(e) => update("businessName", e.target.value)}
              />
            </AdminField>
            <AdminField label="Email">
              <input
                className={inputClass}
                value={doc.businessEmail}
                onChange={(e) => update("businessEmail", e.target.value)}
              />
            </AdminField>
            <AdminField label="Website" hint="Shown on the document — leave blank to omit">
              <input
                className={inputClass}
                value={doc.businessWebsite}
                onChange={(e) => update("businessWebsite", e.target.value)}
              />
            </AdminField>
            <AdminField label="Address">
              <input
                className={inputClass}
                value={doc.businessAddress}
                onChange={(e) => update("businessAddress", e.target.value)}
              />
            </AdminField>
          </div>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gold">
            Bill To
          </h4>
          <div className="space-y-3">
            <AdminField label="Client Name">
              <input
                className={inputClass}
                value={doc.clientName}
                onChange={(e) => update("clientName", e.target.value)}
              />
            </AdminField>
            <AdminField label="Client Email">
              <input
                className={inputClass}
                value={doc.clientEmail}
                onChange={(e) => update("clientEmail", e.target.value)}
              />
            </AdminField>
            <AdminField label="Client Address">
              <input
                className={inputClass}
                value={doc.clientAddress}
                onChange={(e) => update("clientAddress", e.target.value)}
              />
            </AdminField>
          </div>
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between">
            <h4 className="text-sm font-semibold uppercase tracking-wide text-gold">
              Line Items
            </h4>
            <button
              type="button"
              onClick={addItem}
              className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs"
            >
              <Plus className="h-3.5 w-3.5" /> Add
            </button>
          </div>
          <div className="space-y-3">
            {doc.items.map((item) => (
              <div key={item.id} className="glass rounded-xl p-3">
                <input
                  className={`${inputClass} mb-2`}
                  placeholder="Description"
                  value={item.description}
                  onChange={(e) => updateItem(item.id, { description: e.target.value })}
                />
                <div className="grid grid-cols-[1fr_1fr_auto] gap-2">
                  <input
                    type="number"
                    className={inputClass}
                    placeholder="Qty"
                    value={item.qty}
                    onChange={(e) => updateItem(item.id, { qty: Number(e.target.value) })}
                  />
                  <input
                    type="number"
                    className={inputClass}
                    placeholder="Rate"
                    value={item.rate}
                    onChange={(e) => updateItem(item.id, { rate: Number(e.target.value) })}
                  />
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="rounded-lg border border-border px-3 text-dim hover:text-red-400"
                    aria-label="Remove item"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <AdminField label="Tax %">
          <input
            type="number"
            className={inputClass}
            value={doc.taxPercent}
            onChange={(e) => update("taxPercent", Number(e.target.value))}
          />
        </AdminField>

        <AdminField label="Notes / Payment Instructions">
          <textarea
            rows={3}
            className={inputClass}
            value={doc.notes}
            onChange={(e) => update("notes", e.target.value)}
          />
        </AdminField>

        <button
          type="button"
          onClick={handleDownload}
          disabled={downloading}
          className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-[#0a0a0a] disabled:opacity-60"
        >
          {downloading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Generating...
            </>
          ) : (
            <>
              <Download className="h-4 w-4" /> Download PDF
            </>
          )}
        </button>
      </div>

      <div className="lg:sticky lg:top-8 overflow-hidden rounded-2xl shadow-lg">
        <div ref={previewRef} className="w-full bg-white text-[#111]">
          <div className="h-2 bg-gradient-to-r from-[#fcd34d] to-[#f59e0b]" />
          <div className="p-8">
            <div className="flex items-start justify-between border-b border-gray-200 pb-6">
              <div className="flex items-start gap-3">
                <LogoMark className="mt-0.5 h-9 w-9 shrink-0" />
                <div>
                  <h2 className="text-2xl font-bold leading-none text-[#0a0a0a]">
                    {config.title.toUpperCase()}
                  </h2>
                  <p className="mt-1.5 text-sm leading-none text-gray-500">{doc.docNumber}</p>
                </div>
              </div>
              <div className="text-right text-sm text-gray-600">
                <p className="font-semibold text-[#0a0a0a]">{doc.businessName}</p>
                <p>{doc.businessEmail}</p>
                {doc.businessWebsite && <p>{doc.businessWebsite}</p>}
                <p>{doc.businessAddress}</p>
              </div>
            </div>

            <div className="mt-6 flex justify-between text-sm">
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-400">Bill To</p>
                <p className="mt-1 font-semibold text-[#0a0a0a]">{doc.clientName || "—"}</p>
                <p className="text-gray-600">{doc.clientEmail}</p>
                <p className="text-gray-600">{doc.clientAddress}</p>
              </div>
              <div className="text-right">
                <p className="text-xs uppercase tracking-wide text-gray-400">
                  {config.title} Date
                </p>
                <p className="font-medium text-[#0a0a0a]">{doc.docDate}</p>
                {doc.secondaryDate && (
                  <>
                    <p className="mt-2 text-xs uppercase tracking-wide text-gray-400">
                      {config.secondaryDateLabel}
                    </p>
                    <p className="font-medium text-[#0a0a0a]">{doc.secondaryDate}</p>
                  </>
                )}
              </div>
            </div>

            <table className="mt-8 w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left text-xs uppercase tracking-wide text-gray-400">
                  <th className="pb-2">Description</th>
                  <th className="pb-2 text-right">Qty</th>
                  <th className="pb-2 text-right">Rate</th>
                  <th className="pb-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {doc.items.map((item) => (
                  <tr key={item.id} className="border-b border-gray-100">
                    <td className="py-2 pr-4">{item.description || "—"}</td>
                    <td className="py-2 text-right">{item.qty}</td>
                    <td className="py-2 text-right">
                      {symbol}
                      {item.rate.toFixed(2)}
                    </td>
                    <td className="py-2 text-right font-medium">
                      {symbol}
                      {(item.qty * item.rate).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-4 flex justify-end">
              <div className="w-56 space-y-1 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>
                    {symbol}
                    {subtotal.toFixed(2)}
                  </span>
                </div>
                {doc.taxPercent > 0 && (
                  <div className="flex justify-between text-gray-600">
                    <span>Tax ({doc.taxPercent}%)</span>
                    <span>
                      {symbol}
                      {tax.toFixed(2)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between border-t border-gray-200 pt-2 text-base font-bold text-[#0a0a0a]">
                  <span>Total</span>
                  <span>
                    {symbol}
                    {total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {doc.notes && (
              <div className="mt-8 border-t border-gray-100 pt-4 text-xs text-gray-500">
                {doc.notes}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
