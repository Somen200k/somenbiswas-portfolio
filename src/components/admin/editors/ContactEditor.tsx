"use client";

import { useEffect, useState } from "react";
import { fetchDataFile, publishFile } from "@/lib/admin-client";
import { AdminField, inputClass } from "@/components/admin/AdminField";
import { SaveBar, type SaveStatus } from "@/components/admin/SaveBar";
import type { ContactData } from "@/lib/types";

export function ContactEditor() {
  const [data, setData] = useState<ContactData | null>(null);
  const [status, setStatus] = useState<SaveStatus>("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDataFile<ContactData>("contact.json").then(setData).catch((e) => setError(e.message));
  }, []);

  async function handleSave() {
    if (!data) return;
    setStatus("saving");
    const res = await publishFile(
      "data/contact.json",
      JSON.stringify(data, null, 2) + "\n",
      "Update contact info via admin panel"
    );
    setStatus(res.success ? "success" : "error");
    setError(res.error || "");
  }

  if (!data) return <p className="text-sm text-muted">Loading...</p>;

  return (
    <div className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <AdminField label="Email">
          <input
            className={inputClass}
            value={data.email}
            onChange={(e) => setData({ ...data, email: e.target.value })}
          />
        </AdminField>
        <AdminField label="WhatsApp (with country code)">
          <input
            className={inputClass}
            value={data.whatsapp}
            onChange={(e) =>
              setData({ ...data, whatsapp: e.target.value, whatsappDisplay: e.target.value })
            }
          />
        </AdminField>
        <AdminField label="LinkedIn URL">
          <input
            className={inputClass}
            value={data.linkedin}
            onChange={(e) => setData({ ...data, linkedin: e.target.value })}
          />
        </AdminField>
        <AdminField label="X (Twitter) URL">
          <input
            className={inputClass}
            value={data.twitter}
            onChange={(e) => setData({ ...data, twitter: e.target.value })}
          />
        </AdminField>
        <AdminField label="Instagram URL">
          <input
            className={inputClass}
            value={data.instagram}
            onChange={(e) => setData({ ...data, instagram: e.target.value })}
          />
        </AdminField>
        <AdminField label="YouTube URL">
          <input
            className={inputClass}
            value={data.youtube}
            onChange={(e) => setData({ ...data, youtube: e.target.value })}
          />
        </AdminField>
        <AdminField label="Telegram URL">
          <input
            className={inputClass}
            value={data.telegram}
            onChange={(e) => setData({ ...data, telegram: e.target.value })}
          />
        </AdminField>
        <AdminField label="Upwork URL" hint="Leave blank to show 'available on request'.">
          <input
            className={inputClass}
            value={data.upworkUrl}
            onChange={(e) => setData({ ...data, upworkUrl: e.target.value })}
          />
        </AdminField>
      </div>

      <SaveBar status={status} errorMessage={error} onSave={handleSave} />
    </div>
  );
}
