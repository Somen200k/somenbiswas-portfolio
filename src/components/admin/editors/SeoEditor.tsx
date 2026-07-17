"use client";

import { useEffect, useState } from "react";
import { fetchDataFile, publishFile } from "@/lib/admin-client";
import { AdminField, inputClass } from "@/components/admin/AdminField";
import { SaveBar, type SaveStatus } from "@/components/admin/SaveBar";
import { GlassCard } from "@/components/ui/GlassCard";
import type { SeoData } from "@/lib/types";

export function SeoEditor() {
  const [data, setData] = useState<SeoData | null>(null);
  const [status, setStatus] = useState<SaveStatus>("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDataFile<SeoData>("seo.json").then(setData).catch((e) => setError(e.message));
  }, []);

  async function handleSave() {
    if (!data) return;
    setStatus("saving");
    const res = await publishFile(
      "data/seo.json",
      JSON.stringify(data, null, 2) + "\n",
      "Update SEO settings via admin panel"
    );
    setStatus(res.success ? "success" : "error");
    setError(res.error || "");
  }

  if (!data) return <p className="text-sm text-muted">Loading...</p>;

  return (
    <div className="space-y-6">
      <GlassCard>
        <h3 className="text-lg font-semibold">Site-wide</h3>
        <div className="mt-4 space-y-4">
          <AdminField label="Default Title">
            <input
              className={inputClass}
              value={data.defaultTitle}
              onChange={(e) => setData({ ...data, defaultTitle: e.target.value })}
            />
          </AdminField>
          <AdminField label="Default Description">
            <textarea
              rows={2}
              className={inputClass}
              value={data.defaultDescription}
              onChange={(e) => setData({ ...data, defaultDescription: e.target.value })}
            />
          </AdminField>
          <div className="grid gap-4 sm:grid-cols-2">
            <AdminField label="GA4 Measurement ID">
              <input
                className={inputClass}
                value={data.ga4Id}
                placeholder="G-XXXXXXXXXX"
                onChange={(e) => setData({ ...data, ga4Id: e.target.value })}
              />
            </AdminField>
            <AdminField label="Search Console Verification">
              <input
                className={inputClass}
                value={data.gscVerification}
                onChange={(e) => setData({ ...data, gscVerification: e.target.value })}
              />
            </AdminField>
          </div>
        </div>
      </GlassCard>

      {Object.entries(data.pages).map(([key, page]) => (
        <GlassCard key={key}>
          <h3 className="text-sm font-mono uppercase tracking-wide text-gold">{key}</h3>
          <div className="mt-4 space-y-4">
            <AdminField label="Meta Title">
              <input
                className={inputClass}
                value={page.title}
                onChange={(e) =>
                  setData({
                    ...data,
                    pages: { ...data.pages, [key]: { ...page, title: e.target.value } },
                  })
                }
              />
            </AdminField>
            <AdminField label="Meta Description">
              <textarea
                rows={2}
                className={inputClass}
                value={page.description}
                onChange={(e) =>
                  setData({
                    ...data,
                    pages: { ...data.pages, [key]: { ...page, description: e.target.value } },
                  })
                }
              />
            </AdminField>
          </div>
        </GlassCard>
      ))}

      <SaveBar status={status} errorMessage={error} onSave={handleSave} />
    </div>
  );
}
