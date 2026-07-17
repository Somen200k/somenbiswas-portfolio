"use client";

import { useEffect, useState } from "react";
import {
  Home,
  User,
  Briefcase,
  Wrench,
  Newspaper,
  BarChart3,
  Mail,
  Search,
  Lock,
  LogOut,
} from "lucide-react";
import { isAdminAuthed, setAdminAuthed } from "@/lib/admin-client";
import { inputClass } from "@/components/admin/AdminField";
import { GithubSettings } from "@/components/admin/GithubSettings";
import { HeroEditor } from "@/components/admin/editors/HeroEditor";
import { AboutEditor } from "@/components/admin/editors/AboutEditor";
import { ProjectsEditor } from "@/components/admin/editors/ProjectsEditor";
import { ServicesEditor } from "@/components/admin/editors/ServicesEditor";
import { BlogManager } from "@/components/admin/editors/BlogManager";
import { StatsEditor } from "@/components/admin/editors/StatsEditor";
import { ContactEditor } from "@/components/admin/editors/ContactEditor";
import { SeoEditor } from "@/components/admin/editors/SeoEditor";

const TABS = [
  { id: "hero", label: "Hero", icon: Home, Component: HeroEditor },
  { id: "about", label: "About", icon: User, Component: AboutEditor },
  { id: "projects", label: "Projects", icon: Briefcase, Component: ProjectsEditor },
  { id: "services", label: "Services", icon: Wrench, Component: ServicesEditor },
  { id: "blog", label: "Blog", icon: Newspaper, Component: BlogManager },
  { id: "stats", label: "Stats", icon: BarChart3, Component: StatsEditor },
  { id: "contact", label: "Contact", icon: Mail, Component: ContactEditor },
  { id: "seo", label: "SEO", icon: Search, Component: SeoEditor },
] as const;

function LoginScreen({ onSuccess }: { onSuccess: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    const json = await res.json();
    setLoading(false);
    if (json.success) {
      setAdminAuthed(true);
      onSuccess();
    } else {
      setError(json.error || "Incorrect password.");
    }
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <form onSubmit={handleSubmit} className="glass-strong w-full max-w-sm rounded-2xl p-8">
        <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-gold/10 text-gold">
          <Lock className="h-6 w-6" />
        </div>
        <h1 className="text-xl font-semibold">Admin Access</h1>
        <p className="mt-1 text-sm text-muted">Enter the admin password to continue.</p>

        <input
          type="password"
          autoFocus
          className={`${inputClass} mt-6`}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="mt-2 text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-5 w-full rounded-full bg-gold px-5 py-3 text-sm font-semibold text-[#0a0a0a] disabled:opacity-60"
        >
          {loading ? "Checking..." : "Enter"}
        </button>
      </form>
    </div>
  );
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [checked, setChecked] = useState(false);
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]["id"]>("hero");

  useEffect(() => {
    setAuthed(isAdminAuthed());
    setChecked(true);
  }, []);

  if (!checked) return null;
  if (!authed) return <LoginScreen onSuccess={() => setAuthed(true)} />;

  const ActiveComponent = TABS.find((t) => t.id === activeTab)?.Component ?? HeroEditor;

  return (
    <div className="container-px mx-auto max-w-6xl py-16">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-gold">Admin Panel</p>
          <h1 className="mt-2 text-3xl font-semibold">Content Manager</h1>
        </div>
        <button
          type="button"
          onClick={() => {
            setAdminAuthed(false);
            setAuthed(false);
          }}
          className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm text-muted hover:text-foreground"
        >
          <LogOut className="h-4 w-4" /> Log out
        </button>
      </div>

      <div className="mt-8">
        <GithubSettings />
      </div>

      <div className="mt-8 flex flex-wrap gap-2 border-b border-border pb-4">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm transition-colors ${
              activeTab === tab.id
                ? "bg-gold text-[#0a0a0a] font-semibold"
                : "glass text-muted hover:text-foreground"
            }`}
          >
            <tab.icon className="h-4 w-4" /> {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-8">
        <ActiveComponent />
      </div>
    </div>
  );
}
