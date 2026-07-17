"use client";

import { useEffect, useState } from "react";
import { fetchDataFile, publishFile } from "@/lib/admin-client";
import { AdminField, inputClass } from "@/components/admin/AdminField";
import { SaveBar, type SaveStatus } from "@/components/admin/SaveBar";
import { GlassCard } from "@/components/ui/GlassCard";
import type { StatItem } from "@/lib/types";

export function StatsEditor() {
  const [stats, setStats] = useState<StatItem[] | null>(null);
  const [status, setStatus] = useState<SaveStatus>("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDataFile<StatItem[]>("stats.json").then(setStats).catch((e) => setError(e.message));
  }, []);

  function update(i: number, patch: Partial<StatItem>) {
    setStats((prev) => prev!.map((s, idx) => (idx === i ? { ...s, ...patch } : s)));
  }

  async function handleSave() {
    if (!stats) return;
    setStatus("saving");
    const res = await publishFile(
      "data/stats.json",
      JSON.stringify(stats, null, 2) + "\n",
      "Update stats via admin panel"
    );
    setStatus(res.success ? "success" : "error");
    setError(res.error || "");
  }

  if (!stats) return <p className="text-sm text-muted">Loading...</p>;

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        {stats.map((stat, i) => (
          <GlassCard key={i}>
            <AdminField label="Label">
              <input
                className={inputClass}
                value={stat.label}
                onChange={(e) => update(i, { label: e.target.value })}
              />
            </AdminField>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <AdminField label="Value">
                <input
                  type="number"
                  className={inputClass}
                  value={stat.value}
                  onChange={(e) => update(i, { value: Number(e.target.value) })}
                />
              </AdminField>
              <AdminField label="Suffix">
                <input
                  className={inputClass}
                  value={stat.suffix}
                  onChange={(e) => update(i, { suffix: e.target.value })}
                />
              </AdminField>
            </div>
          </GlassCard>
        ))}
      </div>

      <SaveBar status={status} errorMessage={error} onSave={handleSave} />
    </div>
  );
}
