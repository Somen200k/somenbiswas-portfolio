"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { fetchDataFile, publishFile } from "@/lib/admin-client";
import { AdminField, inputClass } from "@/components/admin/AdminField";
import { SaveBar, type SaveStatus } from "@/components/admin/SaveBar";
import { GlassCard } from "@/components/ui/GlassCard";
import { ICON_MAP } from "@/lib/icon-map";
import type { ServiceItem, ServicesData } from "@/lib/types";

const ICON_NAMES = Object.keys(ICON_MAP);

function emptyService(): ServiceItem {
  return {
    icon: ICON_NAMES[0],
    title: "New Service",
    description: "",
    cta: "Get Started",
    ctaLink: "mailto:admin@nexguild.in",
  };
}

function ServiceRow({
  service,
  onChange,
  onRemove,
}: {
  service: ServiceItem;
  onChange: (s: ServiceItem) => void;
  onRemove: () => void;
}) {
  return (
    <GlassCard className="relative">
      <button
        type="button"
        onClick={onRemove}
        aria-label="Remove service"
        className="absolute right-4 top-4 text-dim transition-colors hover:text-red-400"
      >
        <Trash2 className="h-4 w-4" />
      </button>
      <div className="grid gap-4 pr-8 sm:grid-cols-2">
        <AdminField label="Title">
          <input
            className={inputClass}
            value={service.title}
            onChange={(e) => onChange({ ...service, title: e.target.value })}
          />
        </AdminField>
        <AdminField label="Icon">
          <select
            className={inputClass}
            value={service.icon}
            onChange={(e) => onChange({ ...service, icon: e.target.value })}
          >
            {ICON_NAMES.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </AdminField>
      </div>
      <div className="mt-4">
        <AdminField label="Description">
          <textarea
            rows={2}
            className={inputClass}
            value={service.description}
            onChange={(e) => onChange({ ...service, description: e.target.value })}
          />
        </AdminField>
      </div>
      <div className="mt-4">
        <AdminField label="CTA Link">
          <input
            className={inputClass}
            value={service.ctaLink}
            onChange={(e) => onChange({ ...service, ctaLink: e.target.value })}
          />
        </AdminField>
      </div>
    </GlassCard>
  );
}

export function ServicesEditor() {
  const [data, setData] = useState<ServicesData | null>(null);
  const [status, setStatus] = useState<SaveStatus>("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDataFile<ServicesData>("services.json").then(setData).catch((e) => setError(e.message));
  }, []);

  async function handleSave() {
    if (!data) return;
    setStatus("saving");
    const res = await publishFile(
      "data/services.json",
      JSON.stringify(data, null, 2) + "\n",
      "Update services via admin panel"
    );
    setStatus(res.success ? "success" : "error");
    setError(res.error || "");
  }

  if (!data) return <p className="text-sm text-muted">Loading...</p>;

  return (
    <div className="space-y-8">
      <section>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Personal Services</h3>
          <button
            type="button"
            onClick={() => setData({ ...data, personal: [...data.personal, emptyService()] })}
            className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs"
          >
            <Plus className="h-3.5 w-3.5" /> Add
          </button>
        </div>
        <div className="mt-4 space-y-4">
          {data.personal.map((service, i) => (
            <ServiceRow
              key={i}
              service={service}
              onChange={(s) =>
                setData({
                  ...data,
                  personal: data.personal.map((x, idx) => (idx === i ? s : x)),
                })
              }
              onRemove={() =>
                setData({ ...data, personal: data.personal.filter((_, idx) => idx !== i) })
              }
            />
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">NexGuild Client Services</h3>
          <button
            type="button"
            onClick={() => setData({ ...data, nexguild: [...data.nexguild, emptyService()] })}
            className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs"
          >
            <Plus className="h-3.5 w-3.5" /> Add
          </button>
        </div>
        <div className="mt-4 space-y-4">
          {data.nexguild.map((service, i) => (
            <ServiceRow
              key={i}
              service={service}
              onChange={(s) =>
                setData({
                  ...data,
                  nexguild: data.nexguild.map((x, idx) => (idx === i ? s : x)),
                })
              }
              onRemove={() =>
                setData({ ...data, nexguild: data.nexguild.filter((_, idx) => idx !== i) })
              }
            />
          ))}
        </div>
      </section>

      <SaveBar status={status} errorMessage={error} onSave={handleSave} />
    </div>
  );
}
