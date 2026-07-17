"use client";

import { Loader2, CheckCircle2, AlertTriangle, Save } from "lucide-react";

export type SaveStatus = "idle" | "saving" | "success" | "error";

export function SaveBar({
  status,
  errorMessage,
  onSave,
  label = "Save Changes",
}: {
  status: SaveStatus;
  errorMessage?: string;
  onSave: () => void;
  label?: string;
}) {
  return (
    <div className="sticky bottom-4 z-10 mt-8 flex flex-wrap items-center gap-4 rounded-2xl border border-border bg-[#111111]/95 px-5 py-4 backdrop-blur">
      <button
        type="button"
        onClick={onSave}
        disabled={status === "saving"}
        className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-[#0a0a0a] transition-opacity disabled:opacity-60"
      >
        {status === "saving" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Publishing...
          </>
        ) : (
          <>
            <Save className="h-4 w-4" /> {label}
          </>
        )}
      </button>
      {status === "success" && (
        <span className="flex items-center gap-1.5 text-sm text-emerald-400">
          <CheckCircle2 className="h-4 w-4" /> Published — Vercel will rebuild shortly.
        </span>
      )}
      {status === "error" && (
        <span className="flex items-center gap-1.5 text-sm text-red-400">
          <AlertTriangle className="h-4 w-4" /> {errorMessage || "Save failed."}
        </span>
      )}
    </div>
  );
}
