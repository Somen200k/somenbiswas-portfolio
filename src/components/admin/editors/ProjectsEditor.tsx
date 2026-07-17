"use client";

import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { fetchDataFile, publishFile } from "@/lib/admin-client";
import { AdminField, inputClass } from "@/components/admin/AdminField";
import { SaveBar, type SaveStatus } from "@/components/admin/SaveBar";
import { GlassCard } from "@/components/ui/GlassCard";
import type { Project } from "@/lib/types";

export function ProjectsEditor() {
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [status, setStatus] = useState<SaveStatus>("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDataFile<Project[]>("projects.json").then(setProjects).catch((e) => setError(e.message));
  }, []);

  function update(slug: string, patch: Partial<Project>) {
    setProjects((prev) => prev!.map((p) => (p.slug === slug ? { ...p, ...patch } : p)));
  }

  async function handleSave() {
    if (!projects) return;
    setStatus("saving");
    const res = await publishFile(
      "data/projects.json",
      JSON.stringify(projects, null, 2) + "\n",
      "Update projects via admin panel"
    );
    setStatus(res.success ? "success" : "error");
    setError(res.error || "");
  }

  if (!projects) return <p className="text-sm text-muted">Loading...</p>;

  return (
    <div className="space-y-6">
      {projects.map((project) => (
        <GlassCard key={project.slug}>
          <div className="flex items-center justify-between gap-4">
            <h3 className="font-mono text-sm text-gold">{project.slug}</h3>
            <button
              type="button"
              onClick={() => update(project.slug, { visible: !project.visible })}
              className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-xs"
            >
              {project.visible ? (
                <>
                  <Eye className="h-3.5 w-3.5 text-gold" /> Visible
                </>
              ) : (
                <>
                  <EyeOff className="h-3.5 w-3.5 text-dim" /> Hidden
                </>
              )}
            </button>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <AdminField label="Title">
              <input
                className={inputClass}
                value={project.name}
                onChange={(e) => update(project.slug, { name: e.target.value })}
              />
            </AdminField>
            <AdminField label="Live Link">
              <input
                className={inputClass}
                value={project.url}
                onChange={(e) => update(project.slug, { url: e.target.value })}
              />
            </AdminField>
          </div>

          <div className="mt-4">
            <AdminField label="Description">
              <textarea
                rows={3}
                className={inputClass}
                value={project.description}
                onChange={(e) => update(project.slug, { description: e.target.value })}
              />
            </AdminField>
          </div>

          <div className="mt-4">
            <AdminField label="Tech Stack" hint="Comma-separated">
              <input
                className={inputClass}
                value={project.techStack.join(", ")}
                onChange={(e) =>
                  update(project.slug, {
                    techStack: e.target.value.split(",").map((t) => t.trim()).filter(Boolean),
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
