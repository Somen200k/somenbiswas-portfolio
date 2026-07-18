"use client";

import { useEffect, useState } from "react";
import { Download, Plus, Trash2, Pencil, X, Sparkles } from "lucide-react";
import { AdminField, inputClass } from "@/components/admin/AdminField";
import { GlassCard } from "@/components/ui/GlassCard";

type YesNo = "Yes" | "No";

interface Brief {
  id: string;
  clientName: string;
  projectType: string;
  pages: string[];
  colorMood: string;
  primaryColor: string;
  uiStyle: string;
  animationLevel: string;
  animationTypes: string[];
  databaseNeeded: YesNo;
  dataTypes: string[];
  authNeeded: YesNo;
  authTypes: string[];
  paymentsNeeded: YesNo;
  paymentMethods: string[];
  cmsNeeded: YesNo;
  fileUploads: YesNo;
  realtime: YesNo;
  seoPriority: string;
  multiLanguage: YesNo;
  platform: string;
  timeline: string;
  notes: string;
}

const STORAGE_KEY = "sb_project_briefs";

const PROJECT_TYPES = [
  "Portfolio / Personal Site",
  "Business / Landing Page",
  "E-commerce Store",
  "Blog / Content Platform",
  "SaaS / Web App",
  "Community / Social Platform",
  "Booking / Reservation System",
  "Other",
];

const PAGE_OPTIONS = [
  "Home", "About", "Services", "Portfolio / Projects", "Blog", "Pricing",
  "FAQ", "Contact", "Login / Signup", "Dashboard", "Admin Panel", "Checkout / Cart",
];

const COLOR_MOODS = [
  "Dark & Bold", "Light & Minimal", "Colorful & Playful", "Corporate & Professional",
  "Pastel & Soft", "Luxury & Gold-accented", "Custom (see notes)",
];

const UI_STYLES = [
  "Glassmorphism", "Flat / Minimal", "Neumorphism", "Material Design",
  "Brutalist", "Corporate Clean", "Playful / Rounded",
];

const ANIMATION_LEVELS = ["None", "Subtle", "Moderate", "Heavy / Immersive"];

const ANIMATION_TYPES = [
  "Scroll reveal", "Hover effects", "Page transitions", "Parallax",
  "Loading screen", "Micro-interactions", "3D elements",
];

const DATA_TYPES = [
  "User accounts", "Product / inventory data", "Blog / content", "Bookings / orders",
  "Messages / chat", "Form submissions only",
];

const AUTH_TYPES = ["Email & password", "Social login (Google etc.)", "Magic link", "Admin-only login"];

const PAYMENT_METHODS = ["Stripe", "Razorpay", "PayPal", "Manual / offline"];

const SEO_PRIORITIES = ["Low", "Medium", "High — organic search is the main channel"];

const PLATFORMS = ["Responsive website only", "Website + installable PWA", "Native mobile app needed"];

const TIMELINES = ["ASAP / rush", "1-2 weeks", "2-4 weeks", "Flexible / ongoing"];

function emptyBrief(): Brief {
  return {
    id: crypto.randomUUID(),
    clientName: "",
    projectType: PROJECT_TYPES[0],
    pages: [],
    colorMood: COLOR_MOODS[0],
    primaryColor: "",
    uiStyle: UI_STYLES[0],
    animationLevel: ANIMATION_LEVELS[1],
    animationTypes: [],
    databaseNeeded: "No",
    dataTypes: [],
    authNeeded: "No",
    authTypes: [],
    paymentsNeeded: "No",
    paymentMethods: [],
    cmsNeeded: "No",
    fileUploads: "No",
    realtime: "No",
    seoPriority: SEO_PRIORITIES[1],
    multiLanguage: "No",
    platform: PLATFORMS[0],
    timeline: TIMELINES[1],
    notes: "",
  };
}

function toggleInArray(arr: string[], value: string): string[] {
  return arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
}

function buildRecommendation(b: Brief): string[] {
  const tools: string[] = [];
  tools.push("Modern React framework (Next.js) with server-side rendering for SEO and speed");
  tools.push("Tailwind CSS for the design system");

  if (b.databaseNeeded === "Yes") {
    tools.push("Managed cloud database with row-level security enforced at the data layer");
  }
  if (b.authNeeded === "Yes") {
    tools.push(`Authentication (${b.authTypes.length ? b.authTypes.join(", ") : "email & password"})`);
  }
  if (b.paymentsNeeded === "Yes") {
    tools.push(`Payment processing (${b.paymentMethods.length ? b.paymentMethods.join(", ") : "a payment gateway"})`);
  }
  if (b.cmsNeeded === "Yes") {
    tools.push("MDX-based blog / content system with listing and category pages");
  }
  if (b.fileUploads === "Yes") {
    tools.push("Cloud object storage for uploaded files and images");
  }
  if (b.realtime === "Yes") {
    tools.push("Realtime data sync for live updates, chat, or notifications");
  }
  if (b.animationLevel !== "None") {
    tools.push(`Animation library (Framer Motion) — ${b.animationLevel.toLowerCase()} level`);
  }
  if (b.multiLanguage === "Yes") {
    tools.push("i18n routing and translation management");
  }
  if (b.platform === "Website + installable PWA") {
    tools.push("PWA manifest and service worker for installability");
  }
  if (b.platform === "Native mobile app needed") {
    tools.push("Cross-platform mobile framework (React Native / Expo) alongside the web build");
  }
  if (b.seoPriority.startsWith("High")) {
    tools.push("Full SEO layer: sitemap, structured data, per-page metadata");
  }
  tools.push("Hosting platform with CI/CD for automatic deploys");
  return tools;
}

function buildPrompt(b: Brief, tools: string[]): string {
  const lines: string[] = [];
  lines.push(`# Project Brief${b.clientName ? `: ${b.clientName}` : ""}`);
  lines.push("");
  lines.push("## Project Type");
  lines.push(b.projectType);
  lines.push("");
  lines.push("## Pages Needed");
  lines.push(b.pages.length ? b.pages.map((p) => `- ${p}`).join("\n") : "- (not specified)");
  lines.push("");
  lines.push("## Design Direction");
  lines.push(`- Color mood: ${b.colorMood}${b.primaryColor ? ` (primary color: ${b.primaryColor})` : ""}`);
  lines.push(`- UI style: ${b.uiStyle}`);
  lines.push(`- Animation level: ${b.animationLevel}`);
  if (b.animationTypes.length) {
    lines.push(`- Animation types: ${b.animationTypes.join(", ")}`);
  }
  lines.push("");
  lines.push("## Features");
  lines.push(`- Database: ${b.databaseNeeded}${b.dataTypes.length ? ` (${b.dataTypes.join(", ")})` : ""}`);
  lines.push(`- Authentication: ${b.authNeeded}${b.authTypes.length ? ` (${b.authTypes.join(", ")})` : ""}`);
  lines.push(`- Payments: ${b.paymentsNeeded}${b.paymentMethods.length ? ` (${b.paymentMethods.join(", ")})` : ""}`);
  lines.push(`- Blog / CMS: ${b.cmsNeeded}`);
  lines.push(`- File uploads: ${b.fileUploads}`);
  lines.push(`- Realtime features: ${b.realtime}`);
  lines.push(`- SEO priority: ${b.seoPriority}`);
  lines.push(`- Multi-language: ${b.multiLanguage}`);
  lines.push(`- Platform: ${b.platform}`);
  lines.push(`- Timeline: ${b.timeline}`);
  lines.push("");
  lines.push("## Recommended Tools & Stack");
  lines.push(tools.map((t) => `- ${t}`).join("\n"));
  if (b.notes.trim()) {
    lines.push("");
    lines.push("## Additional Notes From Client");
    lines.push(b.notes.trim());
  }
  lines.push("");
  lines.push("---");
  lines.push("");
  lines.push(
    "Build this project end to end based on the brief above. Set up the project structure, implement every page and feature listed, apply the design direction consistently throughout, and use the recommended stack unless a better-suited alternative makes more sense for a specific requirement — explain any substitution before implementing it."
  );
  return lines.join("\n");
}

function downloadText(filename: string, text: string) {
  const blob = new Blob([text], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function ChipGroup({
  options,
  selected,
  onToggle,
}: {
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onToggle(opt)}
          className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
            selected.includes(opt)
              ? "border-gold bg-gold/10 text-gold"
              : "border-border text-muted hover:text-foreground"
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

export function ProjectScoper() {
  const [briefs, setBriefs] = useState<Brief[] | null>(null);
  const [editing, setEditing] = useState<Brief | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    setBriefs(raw ? JSON.parse(raw) : []);
  }, []);

  useEffect(() => {
    if (briefs) localStorage.setItem(STORAGE_KEY, JSON.stringify(briefs));
  }, [briefs]);

  if (!briefs) return <p className="text-sm text-muted">Loading...</p>;

  function saveEditing() {
    if (!editing) return;
    setBriefs((prev) => {
      const exists = prev!.some((b) => b.id === editing.id);
      return exists ? prev!.map((b) => (b.id === editing.id ? editing : b)) : [...prev!, editing];
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  }

  function deleteBrief(id: string) {
    if (!confirm("Delete this brief?")) return;
    setBriefs((prev) => prev!.filter((b) => b.id !== id));
    if (editing?.id === id) setEditing(null);
  }

  if (editing) {
    const tools = buildRecommendation(editing);
    const prompt = buildPrompt(editing, tools);

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            {briefs.some((b) => b.id === editing.id) ? "Edit Brief" : "New Brief"}
          </h3>
          <button
            type="button"
            onClick={() => setEditing(null)}
            className="rounded-full border border-border p-2"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <div className="space-y-5">
            <AdminField label="Client / Project Name">
              <input
                className={inputClass}
                value={editing.clientName}
                onChange={(e) => setEditing({ ...editing, clientName: e.target.value })}
              />
            </AdminField>

            <AdminField label="Project Type">
              <select
                className={inputClass}
                value={editing.projectType}
                onChange={(e) => setEditing({ ...editing, projectType: e.target.value })}
              >
                {PROJECT_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </AdminField>

            <AdminField label="Pages Needed">
              <ChipGroup
                options={PAGE_OPTIONS}
                selected={editing.pages}
                onToggle={(v) => setEditing({ ...editing, pages: toggleInArray(editing.pages, v) })}
              />
            </AdminField>

            <div className="grid gap-4 sm:grid-cols-2">
              <AdminField label="Color Mood">
                <select
                  className={inputClass}
                  value={editing.colorMood}
                  onChange={(e) => setEditing({ ...editing, colorMood: e.target.value })}
                >
                  {COLOR_MOODS.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </AdminField>
              <AdminField label="Primary Color" hint="Optional — hex or a name">
                <input
                  className={inputClass}
                  placeholder="#f59e0b or 'deep violet'"
                  value={editing.primaryColor}
                  onChange={(e) => setEditing({ ...editing, primaryColor: e.target.value })}
                />
              </AdminField>
            </div>

            <AdminField label="UI Style">
              <select
                className={inputClass}
                value={editing.uiStyle}
                onChange={(e) => setEditing({ ...editing, uiStyle: e.target.value })}
              >
                {UI_STYLES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </AdminField>

            <AdminField label="Animation Level">
              <select
                className={inputClass}
                value={editing.animationLevel}
                onChange={(e) => setEditing({ ...editing, animationLevel: e.target.value })}
              >
                {ANIMATION_LEVELS.map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </AdminField>

            {editing.animationLevel !== "None" && (
              <AdminField label="Animation Types">
                <ChipGroup
                  options={ANIMATION_TYPES}
                  selected={editing.animationTypes}
                  onToggle={(v) => setEditing({ ...editing, animationTypes: toggleInArray(editing.animationTypes, v) })}
                />
              </AdminField>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <AdminField label="Database Needed">
                <select
                  className={inputClass}
                  value={editing.databaseNeeded}
                  onChange={(e) => setEditing({ ...editing, databaseNeeded: e.target.value as YesNo })}
                >
                  <option>No</option>
                  <option>Yes</option>
                </select>
              </AdminField>
              <AdminField label="Authentication Needed">
                <select
                  className={inputClass}
                  value={editing.authNeeded}
                  onChange={(e) => setEditing({ ...editing, authNeeded: e.target.value as YesNo })}
                >
                  <option>No</option>
                  <option>Yes</option>
                </select>
              </AdminField>
            </div>

            {editing.databaseNeeded === "Yes" && (
              <AdminField label="What Kind of Data?">
                <ChipGroup
                  options={DATA_TYPES}
                  selected={editing.dataTypes}
                  onToggle={(v) => setEditing({ ...editing, dataTypes: toggleInArray(editing.dataTypes, v) })}
                />
              </AdminField>
            )}

            {editing.authNeeded === "Yes" && (
              <AdminField label="Auth Type">
                <ChipGroup
                  options={AUTH_TYPES}
                  selected={editing.authTypes}
                  onToggle={(v) => setEditing({ ...editing, authTypes: toggleInArray(editing.authTypes, v) })}
                />
              </AdminField>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <AdminField label="Payments Needed">
                <select
                  className={inputClass}
                  value={editing.paymentsNeeded}
                  onChange={(e) => setEditing({ ...editing, paymentsNeeded: e.target.value as YesNo })}
                >
                  <option>No</option>
                  <option>Yes</option>
                </select>
              </AdminField>
              <AdminField label="Blog / CMS Needed">
                <select
                  className={inputClass}
                  value={editing.cmsNeeded}
                  onChange={(e) => setEditing({ ...editing, cmsNeeded: e.target.value as YesNo })}
                >
                  <option>No</option>
                  <option>Yes</option>
                </select>
              </AdminField>
            </div>

            {editing.paymentsNeeded === "Yes" && (
              <AdminField label="Payment Methods">
                <ChipGroup
                  options={PAYMENT_METHODS}
                  selected={editing.paymentMethods}
                  onToggle={(v) => setEditing({ ...editing, paymentMethods: toggleInArray(editing.paymentMethods, v) })}
                />
              </AdminField>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <AdminField label="File Uploads Needed">
                <select
                  className={inputClass}
                  value={editing.fileUploads}
                  onChange={(e) => setEditing({ ...editing, fileUploads: e.target.value as YesNo })}
                >
                  <option>No</option>
                  <option>Yes</option>
                </select>
              </AdminField>
              <AdminField label="Realtime Features">
                <select
                  className={inputClass}
                  value={editing.realtime}
                  onChange={(e) => setEditing({ ...editing, realtime: e.target.value as YesNo })}
                >
                  <option>No</option>
                  <option>Yes</option>
                </select>
              </AdminField>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <AdminField label="SEO Priority">
                <select
                  className={inputClass}
                  value={editing.seoPriority}
                  onChange={(e) => setEditing({ ...editing, seoPriority: e.target.value })}
                >
                  {SEO_PRIORITIES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </AdminField>
              <AdminField label="Multi-language">
                <select
                  className={inputClass}
                  value={editing.multiLanguage}
                  onChange={(e) => setEditing({ ...editing, multiLanguage: e.target.value as YesNo })}
                >
                  <option>No</option>
                  <option>Yes</option>
                </select>
              </AdminField>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <AdminField label="Platform">
                <select
                  className={inputClass}
                  value={editing.platform}
                  onChange={(e) => setEditing({ ...editing, platform: e.target.value })}
                >
                  {PLATFORMS.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </AdminField>
              <AdminField label="Timeline">
                <select
                  className={inputClass}
                  value={editing.timeline}
                  onChange={(e) => setEditing({ ...editing, timeline: e.target.value })}
                >
                  {TIMELINES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </AdminField>
            </div>

            <AdminField label="Additional Notes" hint="Anything else the client mentioned">
              <textarea
                rows={4}
                className={inputClass}
                value={editing.notes}
                onChange={(e) => setEditing({ ...editing, notes: e.target.value })}
              />
            </AdminField>

            <button
              type="button"
              onClick={saveEditing}
              className="rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-[#0a0a0a]"
            >
              {saved ? "Saved" : "Save Brief"}
            </button>
          </div>

          <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            <GlassCard strong>
              <h4 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-gold">
                <Sparkles className="h-4 w-4" /> Recommended Tools
              </h4>
              <ul className="mt-4 space-y-2">
                {tools.map((t) => (
                  <li key={t} className="text-sm text-muted">
                    • {t}
                  </li>
                ))}
              </ul>
            </GlassCard>

            <button
              type="button"
              onClick={() =>
                downloadText(
                  `${(editing.clientName || "project").toLowerCase().replace(/\s+/g, "-")}-brief.md`,
                  prompt
                )
              }
              className="flex w-full items-center justify-center gap-2 rounded-full border border-border-hover bg-gold/10 px-5 py-3 text-sm font-semibold text-gold hover:bg-gold/20"
            >
              <Download className="h-4 w-4" /> Download Claude Build Prompt
            </button>

            <GlassCard>
              <h4 className="text-xs font-semibold uppercase tracking-wide text-dim">Prompt Preview</h4>
              <pre className="mt-3 max-h-80 overflow-auto whitespace-pre-wrap text-xs text-muted">
                {prompt}
              </pre>
            </GlassCard>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <button
          type="button"
          onClick={() => setEditing(emptyBrief())}
          className="inline-flex items-center gap-1.5 rounded-full bg-gold px-4 py-2 text-xs font-semibold text-[#0a0a0a]"
        >
          <Plus className="h-3.5 w-3.5" /> New Brief
        </button>
        <p className="mt-2 text-xs text-dim">
          Walk a client through the checklist, then download a build-ready prompt you can hand straight to Claude.
        </p>
      </div>

      {briefs.length === 0 ? (
        <p className="text-sm text-muted">No client briefs yet. Create one to generate a build-ready prompt.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {briefs.map((b) => (
            <GlassCard key={b.id}>
              <p className="truncate font-semibold">{b.clientName || "Untitled Brief"}</p>
              <p className="mt-1 text-sm text-muted">{b.projectType}</p>
              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => setEditing(b)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs"
                >
                  <Pencil className="h-3.5 w-3.5" /> Open
                </button>
                <button
                  type="button"
                  onClick={() => deleteBrief(b.id)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs hover:text-red-400"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </button>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}
