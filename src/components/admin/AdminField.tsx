import type { ReactNode } from "react";

export function AdminField({
  label,
  children,
  hint,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs uppercase tracking-wide text-dim">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-dim">{hint}</span>}
    </label>
  );
}

export const inputClass =
  "w-full rounded-xl border border-border bg-white/[0.02] px-4 py-2.5 text-sm outline-none transition-colors focus:border-border-hover";
