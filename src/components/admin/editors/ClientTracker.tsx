"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Pencil, X } from "lucide-react";
import { AdminField, inputClass } from "@/components/admin/AdminField";
import { GlassCard } from "@/components/ui/GlassCard";

type ClientStatus = "Lead" | "Active" | "Completed" | "On Hold";

interface Client {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  status: ClientStatus;
  projectValue: string;
  notes: string;
}

const STORAGE_KEY = "sb_clients";
const STATUSES: ClientStatus[] = ["Lead", "Active", "Completed", "On Hold"];

const STATUS_COLOR: Record<ClientStatus, string> = {
  Lead: "text-blue-400 border-blue-400/30 bg-blue-400/10",
  Active: "text-emerald-400 border-emerald-400/30 bg-emerald-400/10",
  Completed: "text-gold border-border-hover bg-gold/10",
  "On Hold": "text-dim border-border bg-white/5",
};

function emptyClient(): Client {
  return {
    id: crypto.randomUUID(),
    name: "",
    company: "",
    email: "",
    phone: "",
    status: "Lead",
    projectValue: "",
    notes: "",
  };
}

export function ClientTracker() {
  const [clients, setClients] = useState<Client[] | null>(null);
  const [editing, setEditing] = useState<Client | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    setClients(saved ? JSON.parse(saved) : []);
  }, []);

  useEffect(() => {
    if (clients) localStorage.setItem(STORAGE_KEY, JSON.stringify(clients));
  }, [clients]);

  if (!clients) return <p className="text-sm text-muted">Loading...</p>;

  function saveEditing() {
    if (!editing) return;
    setClients((prev) => {
      const exists = prev!.some((c) => c.id === editing.id);
      return exists
        ? prev!.map((c) => (c.id === editing.id ? editing : c))
        : [...prev!, editing];
    });
    setEditing(null);
  }

  function deleteClient(id: string) {
    if (!confirm("Delete this client?")) return;
    setClients((prev) => prev!.filter((c) => c.id !== id));
  }

  if (editing) {
    return (
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            {clients.some((c) => c.id === editing.id) ? "Edit Client" : "New Client"}
          </h3>
          <button
            type="button"
            onClick={() => setEditing(null)}
            className="rounded-full border border-border p-2"
            aria-label="Cancel"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <AdminField label="Name">
            <input
              className={inputClass}
              value={editing.name}
              onChange={(e) => setEditing({ ...editing, name: e.target.value })}
            />
          </AdminField>
          <AdminField label="Company">
            <input
              className={inputClass}
              value={editing.company}
              onChange={(e) => setEditing({ ...editing, company: e.target.value })}
            />
          </AdminField>
          <AdminField label="Email">
            <input
              className={inputClass}
              value={editing.email}
              onChange={(e) => setEditing({ ...editing, email: e.target.value })}
            />
          </AdminField>
          <AdminField label="Phone">
            <input
              className={inputClass}
              value={editing.phone}
              onChange={(e) => setEditing({ ...editing, phone: e.target.value })}
            />
          </AdminField>
          <AdminField label="Status">
            <select
              className={inputClass}
              value={editing.status}
              onChange={(e) =>
                setEditing({ ...editing, status: e.target.value as ClientStatus })
              }
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </AdminField>
          <AdminField label="Project Value" hint="Optional — e.g. $500 or ₹40,000">
            <input
              className={inputClass}
              value={editing.projectValue}
              onChange={(e) => setEditing({ ...editing, projectValue: e.target.value })}
            />
          </AdminField>
        </div>

        <AdminField label="Notes">
          <textarea
            rows={4}
            className={inputClass}
            value={editing.notes}
            onChange={(e) => setEditing({ ...editing, notes: e.target.value })}
          />
        </AdminField>

        <button
          type="button"
          onClick={saveEditing}
          className="rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-[#0a0a0a]"
        >
          Save Client
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={() => setEditing(emptyClient())}
        className="inline-flex items-center gap-1.5 rounded-full bg-gold px-4 py-2 text-xs font-semibold text-[#0a0a0a]"
      >
        <Plus className="h-3.5 w-3.5" /> New Client
      </button>

      {clients.length === 0 ? (
        <p className="text-sm text-muted">No clients tracked yet.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {clients.map((client) => (
            <GlassCard key={client.id}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate font-semibold">{client.name || "Untitled"}</p>
                  {client.company && (
                    <p className="truncate text-sm text-muted">{client.company}</p>
                  )}
                </div>
                <span
                  className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${STATUS_COLOR[client.status]}`}
                >
                  {client.status}
                </span>
              </div>

              <div className="mt-3 space-y-1 text-xs text-muted">
                {client.email && <p>{client.email}</p>}
                {client.phone && <p>{client.phone}</p>}
                {client.projectValue && (
                  <p className="text-gold">{client.projectValue}</p>
                )}
              </div>

              {client.notes && (
                <p className="mt-3 line-clamp-2 text-xs text-dim">{client.notes}</p>
              )}

              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => setEditing(client)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs"
                >
                  <Pencil className="h-3.5 w-3.5" /> Edit
                </button>
                <button
                  type="button"
                  onClick={() => deleteClient(client.id)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs hover:text-red-400"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </button>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}
