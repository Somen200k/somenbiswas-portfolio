"use client";

import { useEffect, useState } from "react";
import { fetchDataFile, publishFile } from "@/lib/admin-client";
import { AdminField, inputClass } from "@/components/admin/AdminField";
import { SaveBar, type SaveStatus } from "@/components/admin/SaveBar";
import type { HeroData } from "@/lib/types";

export function HeroEditor() {
  const [data, setData] = useState<HeroData | null>(null);
  const [status, setStatus] = useState<SaveStatus>("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDataFile<HeroData>("hero.json").then(setData).catch((e) => setError(e.message));
  }, []);

  async function handleSave() {
    if (!data) return;
    setStatus("saving");
    const res = await publishFile(
      "data/hero.json",
      JSON.stringify(data, null, 2) + "\n",
      "Update hero section via admin panel"
    );
    setStatus(res.success ? "success" : "error");
    setError(res.error || "");
  }

  if (!data) return <p className="text-sm text-muted">Loading...</p>;

  return (
    <div className="space-y-5">
      <AdminField label="Eyebrow">
        <input
          className={inputClass}
          value={data.eyebrow}
          onChange={(e) => setData({ ...data, eyebrow: e.target.value })}
        />
      </AdminField>
      <AdminField label="Headline" hint="Must contain the highlight word exactly.">
        <input
          className={inputClass}
          value={data.headline}
          onChange={(e) => setData({ ...data, headline: e.target.value })}
        />
      </AdminField>
      <AdminField label="Highlight Word">
        <input
          className={inputClass}
          value={data.highlightWord}
          onChange={(e) => setData({ ...data, highlightWord: e.target.value })}
        />
      </AdminField>
      <AdminField label="Subheadline">
        <textarea
          rows={3}
          className={inputClass}
          value={data.subheadline}
          onChange={(e) => setData({ ...data, subheadline: e.target.value })}
        />
      </AdminField>
      <div className="grid gap-5 sm:grid-cols-2">
        <AdminField label="Primary CTA Text">
          <input
            className={inputClass}
            value={data.ctaPrimaryText}
            onChange={(e) => setData({ ...data, ctaPrimaryText: e.target.value })}
          />
        </AdminField>
        <AdminField label="Primary CTA Link">
          <input
            className={inputClass}
            value={data.ctaPrimaryLink}
            onChange={(e) => setData({ ...data, ctaPrimaryLink: e.target.value })}
          />
        </AdminField>
        <AdminField label="Secondary CTA Text">
          <input
            className={inputClass}
            value={data.ctaSecondaryText}
            onChange={(e) => setData({ ...data, ctaSecondaryText: e.target.value })}
          />
        </AdminField>
        <AdminField label="Secondary CTA Link">
          <input
            className={inputClass}
            value={data.ctaSecondaryLink}
            onChange={(e) => setData({ ...data, ctaSecondaryLink: e.target.value })}
          />
        </AdminField>
      </div>

      <SaveBar status={status} errorMessage={error} onSave={handleSave} />
    </div>
  );
}
