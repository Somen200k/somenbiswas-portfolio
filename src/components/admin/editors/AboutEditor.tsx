"use client";

import { useEffect, useState } from "react";
import { fetchDataFile, publishFile } from "@/lib/admin-client";
import { AdminField, inputClass } from "@/components/admin/AdminField";
import { SaveBar, type SaveStatus } from "@/components/admin/SaveBar";
import type { AboutData } from "@/lib/types";

export function AboutEditor() {
  const [data, setData] = useState<AboutData | null>(null);
  const [bioText, setBioText] = useState("");
  const [status, setStatus] = useState<SaveStatus>("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDataFile<AboutData>("about.json").then((d) => {
      setData(d);
      setBioText(d.bio.join("\n\n"));
    }).catch((e) => setError(e.message));
  }, []);

  async function handleSave() {
    if (!data) return;
    setStatus("saving");
    const updated: AboutData = {
      ...data,
      bio: bioText.split(/\n\n+/).map((p) => p.trim()).filter(Boolean),
    };
    const res = await publishFile(
      "data/about.json",
      JSON.stringify(updated, null, 2) + "\n",
      "Update about section via admin panel"
    );
    setStatus(res.success ? "success" : "error");
    setError(res.error || "");
  }

  if (!data) return <p className="text-sm text-muted">Loading...</p>;

  return (
    <div className="space-y-5">
      <AdminField label="Bio" hint="Separate paragraphs with a blank line.">
        <textarea
          rows={10}
          className={inputClass}
          value={bioText}
          onChange={(e) => setBioText(e.target.value)}
        />
      </AdminField>
      <div className="grid gap-5 sm:grid-cols-3">
        <AdminField label="Years of Experience">
          <input
            className={inputClass}
            value={data.yearsExperience}
            onChange={(e) => setData({ ...data, yearsExperience: e.target.value })}
          />
        </AdminField>
        <AdminField label="Location">
          <input
            className={inputClass}
            value={data.location}
            onChange={(e) => setData({ ...data, location: e.target.value })}
          />
        </AdminField>
        <AdminField label="Photo URL">
          <input
            className={inputClass}
            value={data.photoUrl}
            onChange={(e) => setData({ ...data, photoUrl: e.target.value })}
          />
        </AdminField>
      </div>

      <SaveBar status={status} errorMessage={error} onSave={handleSave} />
    </div>
  );
}
