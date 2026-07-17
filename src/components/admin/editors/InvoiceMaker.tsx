"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Printer, RotateCcw } from "lucide-react";
import { AdminField, inputClass } from "@/components/admin/AdminField";

interface LineItem {
  id: string;
  description: string;
  qty: number;
  rate: number;
}

interface InvoiceState {
  businessName: string;
  businessEmail: string;
  businessAddress: string;
  clientName: string;
  clientEmail: string;
  clientAddress: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  currency: "USD" | "INR";
  taxPercent: number;
  notes: string;
  items: LineItem[];
}

const STORAGE_KEY = "sb_invoice_draft";
const COUNTER_KEY = "sb_invoice_counter";
const CURRENCY_SYMBOL: Record<InvoiceState["currency"], string> = {
  USD: "$",
  INR: "₹",
};

function newItem(): LineItem {
  return { id: crypto.randomUUID(), description: "", qty: 1, rate: 0 };
}

function nextInvoiceNumber(): string {
  const current = Number(localStorage.getItem(COUNTER_KEY) || "0") + 1;
  localStorage.setItem(COUNTER_KEY, String(current));
  return `INV-${String(current).padStart(4, "0")}`;
}

function defaultInvoice(): InvoiceState {
  return {
    businessName: "Somen Biswas",
    businessEmail: "somen.office@gmail.com",
    businessAddress: "Kolkata, India",
    clientName: "",
    clientEmail: "",
    clientAddress: "",
    invoiceNumber: "",
    invoiceDate: new Date().toISOString().slice(0, 10),
    dueDate: "",
    currency: "USD",
    taxPercent: 0,
    notes: "Payment due within 7 days. Thank you for your business.",
    items: [newItem()],
  };
}

export function InvoiceMaker() {
  const [invoice, setInvoice] = useState<InvoiceState | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setInvoice(JSON.parse(saved));
    } else {
      const inv = defaultInvoice();
      inv.invoiceNumber = nextInvoiceNumber();
      setInvoice(inv);
    }
  }, []);

  useEffect(() => {
    if (invoice) localStorage.setItem(STORAGE_KEY, JSON.stringify(invoice));
  }, [invoice]);

  if (!invoice) return <p className="text-sm text-muted">Loading...</p>;

  function update<K extends keyof InvoiceState>(key: K, value: InvoiceState[K]) {
    setInvoice((prev) => (prev ? { ...prev, [key]: value } : prev));
  }

  function updateItem(id: string, patch: Partial<LineItem>) {
    setInvoice((prev) =>
      prev
        ? { ...prev, items: prev.items.map((it) => (it.id === id ? { ...it, ...patch } : it)) }
        : prev
    );
  }

  function addItem() {
    setInvoice((prev) => (prev ? { ...prev, items: [...prev.items, newItem()] } : prev));
  }

  function removeItem(id: string) {
    setInvoice((prev) =>
      prev ? { ...prev, items: prev.items.filter((it) => it.id !== id) } : prev
    );
  }

  function startNewInvoice() {
    const inv = defaultInvoice();
    inv.invoiceNumber = nextInvoiceNumber();
    setInvoice(inv);
  }

  const symbol = CURRENCY_SYMBOL[invoice.currency];
  const subtotal = invoice.items.reduce((sum, it) => sum + it.qty * it.rate, 0);
  const tax = subtotal * (invoice.taxPercent / 100);
  const total = subtotal + tax;

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="no-print space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Invoice Details</h3>
          <button
            type="button"
            onClick={startNewInvoice}
            className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs"
          >
            <RotateCcw className="h-3.5 w-3.5" /> New Invoice
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <AdminField label="Invoice Number">
            <input
              className={inputClass}
              value={invoice.invoiceNumber}
              onChange={(e) => update("invoiceNumber", e.target.value)}
            />
          </AdminField>
          <AdminField label="Currency">
            <select
              className={inputClass}
              value={invoice.currency}
              onChange={(e) => update("currency", e.target.value as InvoiceState["currency"])}
            >
              <option value="USD">USD ($)</option>
              <option value="INR">INR (₹)</option>
            </select>
          </AdminField>
          <AdminField label="Invoice Date">
            <input
              type="date"
              className={inputClass}
              value={invoice.invoiceDate}
              onChange={(e) => update("invoiceDate", e.target.value)}
            />
          </AdminField>
          <AdminField label="Due Date">
            <input
              type="date"
              className={inputClass}
              value={invoice.dueDate}
              onChange={(e) => update("dueDate", e.target.value)}
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
                value={invoice.businessName}
                onChange={(e) => update("businessName", e.target.value)}
              />
            </AdminField>
            <AdminField label="Email">
              <input
                className={inputClass}
                value={invoice.businessEmail}
                onChange={(e) => update("businessEmail", e.target.value)}
              />
            </AdminField>
            <AdminField label="Address">
              <input
                className={inputClass}
                value={invoice.businessAddress}
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
                value={invoice.clientName}
                onChange={(e) => update("clientName", e.target.value)}
              />
            </AdminField>
            <AdminField label="Client Email">
              <input
                className={inputClass}
                value={invoice.clientEmail}
                onChange={(e) => update("clientEmail", e.target.value)}
              />
            </AdminField>
            <AdminField label="Client Address">
              <input
                className={inputClass}
                value={invoice.clientAddress}
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
            {invoice.items.map((item) => (
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
            value={invoice.taxPercent}
            onChange={(e) => update("taxPercent", Number(e.target.value))}
          />
        </AdminField>

        <AdminField label="Notes / Payment Instructions">
          <textarea
            rows={3}
            className={inputClass}
            value={invoice.notes}
            onChange={(e) => update("notes", e.target.value)}
          />
        </AdminField>

        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-[#0a0a0a]"
        >
          <Printer className="h-4 w-4" /> Print / Save as PDF
        </button>
      </div>

      <div className="invoice-print-area rounded-2xl bg-white p-8 text-[#111] shadow-lg">
        <div className="flex items-start justify-between border-b border-gray-200 pb-6">
          <div>
            <h2 className="text-2xl font-bold text-[#0a0a0a]">INVOICE</h2>
            <p className="mt-1 text-sm text-gray-500">{invoice.invoiceNumber}</p>
          </div>
          <div className="text-right text-sm text-gray-600">
            <p className="font-semibold text-[#0a0a0a]">{invoice.businessName}</p>
            <p>{invoice.businessEmail}</p>
            <p>{invoice.businessAddress}</p>
          </div>
        </div>

        <div className="mt-6 flex justify-between text-sm">
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-400">Bill To</p>
            <p className="mt-1 font-semibold text-[#0a0a0a]">{invoice.clientName || "—"}</p>
            <p className="text-gray-600">{invoice.clientEmail}</p>
            <p className="text-gray-600">{invoice.clientAddress}</p>
          </div>
          <div className="text-right">
            <p className="text-xs uppercase tracking-wide text-gray-400">Invoice Date</p>
            <p className="font-medium text-[#0a0a0a]">{invoice.invoiceDate}</p>
            {invoice.dueDate && (
              <>
                <p className="mt-2 text-xs uppercase tracking-wide text-gray-400">Due Date</p>
                <p className="font-medium text-[#0a0a0a]">{invoice.dueDate}</p>
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
            {invoice.items.map((item) => (
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
            {invoice.taxPercent > 0 && (
              <div className="flex justify-between text-gray-600">
                <span>Tax ({invoice.taxPercent}%)</span>
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

        {invoice.notes && (
          <div className="mt-8 border-t border-gray-100 pt-4 text-xs text-gray-500">
            {invoice.notes}
          </div>
        )}
      </div>
    </div>
  );
}
