"use client";

import { useEffect, useRef, useState } from "react";
import { Upload, Loader2, CheckCircle2 } from "lucide-react";
import { fetchDataFile, publishFile, fileToBase64 } from "@/lib/admin-client";
import { AdminField, inputClass } from "@/components/admin/AdminField";
import { SaveBar, type SaveStatus } from "@/components/admin/SaveBar";
import type { AboutData } from "@/lib/types";

export function AboutEditor() {
  const [data, setData] = useState<AboutData | null>(null);
  const [bioText, setBioText] = useState("");
  const [status, setStatus] = useState<SaveStatus>("idle");
  const [error, setError] = useState("");
  const [cvUploading, setCvUploading] = useState(false);
  const [cvUploaded, setCvUploaded] = useState(false);
  const [cvError, setCvError] = useState("");
  const cvInputRef = useRef<HTMLInputElement>(null);

  async function handleCvUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !data) return;
    if (file.type !== "application/pdf") {
      setCvError("Please choose a PDF file.");
      return;
    }
    setCvUploading(true);
    setCvUploaded(false);
    setCvError("");
    try {
      const base64 = await fileToBase64(file);
      // cvUrl is a site-relative path (e.g. "/cv/somen-biswas-cv.pdf") —
      // strip the leading slash to get the repo path under public/.
      const repoPath = `public${data.cvUrl}`;
      const res = await publishFile(repoPath, base64, "Update CV via admin panel", "base64");
      if (res.success) {
        setCvUploaded(true);
        setTimeout(() => setCvUploaded(false), 2500);
      } else {
        setCvError(res.error || "Upload failed.");
      }
    } catch (err) {
      setCvError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setCvUploading(false);
    }
  }

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

      <AdminField label="CV / Resume" hint="Uploading replaces the file the About page's Download CV button links to.">
        <div className="flex items-center gap-3">
          <input
            className={inputClass}
            value={data.cvUrl}
            onChange={(e) => setData({ ...data, cvUrl: e.target.value })}
          />
          <button
            type="button"
            onClick={() => cvInputRef.current?.click()}
            disabled={cvUploading}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border px-4 py-2.5 text-sm text-muted hover:text-foreground disabled:opacity-60"
          >
            {cvUploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : cvUploaded ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            {cvUploading ? "Uploading..." : cvUploaded ? "Uploaded" : "Upload PDF"}
          </button>
          <input
            ref={cvInputRef}
            type="file"
            accept="application/pdf"
            onChange={handleCvUpload}
            className="hidden"
          />
        </div>
        {cvError && <p className="mt-1.5 text-xs text-red-400">{cvError}</p>}
      </AdminField>

      <SaveBar status={status} errorMessage={error} onSave={handleSave} />
    </div>
  );
}
