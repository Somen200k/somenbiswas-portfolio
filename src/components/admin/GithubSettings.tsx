"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { getGithubSettings, setGithubSettings } from "@/lib/admin-client";
import { AdminField, inputClass } from "@/components/admin/AdminField";
import { GitHubIcon } from "@/components/ui/BrandIcons";

export function GithubSettings() {
  const [open, setOpen] = useState(false);
  const [owner, setOwner] = useState("");
  const [repo, setRepo] = useState("");
  const [token, setToken] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const s = getGithubSettings();
    setOwner(s.owner);
    setRepo(s.repo);
    setToken(s.token);
  }, []);

  function save() {
    setGithubSettings({ owner, repo, token });
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  }

  return (
    <div className="glass rounded-2xl">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-5 py-4 text-sm"
      >
        <span className="flex items-center gap-2 font-medium">
          <GitHubIcon className="h-4 w-4 text-gold" /> GitHub Connection
        </span>
        <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="space-y-4 border-t border-border px-5 py-5">
          <p className="text-xs text-muted">
            Saves publish straight to GitHub, which triggers a Vercel rebuild. If left
            blank here, the server&apos;s <code>GITHUB_TOKEN</code> / <code>GITHUB_OWNER</code> /{" "}
            <code>GITHUB_REPO</code> env vars are used instead.
          </p>
          <AdminField label="Repo Owner">
            <input
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
              placeholder="somen2k0"
              className={inputClass}
            />
          </AdminField>
          <AdminField label="Repo Name">
            <input
              value={repo}
              onChange={(e) => setRepo(e.target.value)}
              placeholder="somenbiswas-portfolio"
              className={inputClass}
            />
          </AdminField>
          <AdminField label="Personal Access Token" hint="Needs 'contents: write' permission. Stored only in this browser.">
            <input
              value={token}
              onChange={(e) => setToken(e.target.value)}
              type="password"
              placeholder="ghp_..."
              className={inputClass}
            />
          </AdminField>
          <button
            type="button"
            onClick={save}
            className="rounded-full bg-gold px-4 py-2 text-xs font-semibold text-[#0a0a0a]"
          >
            {saved ? "Saved" : "Save Connection"}
          </button>
        </div>
      )}
    </div>
  );
}
