"use client";

import { useState } from "react";
import { Loader2, Send, CheckCircle2, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

type Status = "idle" | "loading" | "success" | "error";

export function ContactForm({ compact = false }: { compact?: boolean }) {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          message: formData.get("message"),
          botcheck: formData.get("botcheck"),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className={compact ? "space-y-4" : "space-y-5"}>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className="mb-1.5 block text-xs uppercase tracking-wide text-dim">
            Name
          </label>
          <input
            id="contact-name"
            required
            type="text"
            name="name"
            placeholder="Your name"
            className="w-full rounded-xl border border-border bg-white/[0.02] px-4 py-3 text-sm outline-none transition-colors focus:border-border-hover"
          />
        </div>
        <div>
          <label htmlFor="contact-email" className="mb-1.5 block text-xs uppercase tracking-wide text-dim">
            Email
          </label>
          <input
            id="contact-email"
            required
            type="email"
            name="email"
            placeholder="you@company.com"
            className="w-full rounded-xl border border-border bg-white/[0.02] px-4 py-3 text-sm outline-none transition-colors focus:border-border-hover"
          />
        </div>
      </div>

      <div>
        <label htmlFor="contact-message" className="mb-1.5 block text-xs uppercase tracking-wide text-dim">
          Message
        </label>
        <textarea
          id="contact-message"
          required
          name="message"
          rows={compact ? 4 : 6}
          placeholder="Tell me about your project..."
          className="w-full resize-none rounded-xl border border-border bg-white/[0.02] px-4 py-3 text-sm outline-none transition-colors focus:border-border-hover"
        />
      </div>

      <input type="checkbox" name="botcheck" className="hidden" tabIndex={-1} autoComplete="off" />

      <motion.button
        whileTap={{ scale: 0.97 }}
        type="submit"
        disabled={status === "loading"}
        data-cursor-hover
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-semibold text-[#0a0a0a] transition-opacity disabled:opacity-60 sm:w-auto"
      >
        {status === "loading" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Sending...
          </>
        ) : (
          <>
            <Send className="h-4 w-4" /> Send Message
          </>
        )}
      </motion.button>

      {status === "success" && (
        <p className="flex items-center gap-2 text-sm text-emerald-400">
          <CheckCircle2 className="h-4 w-4" /> Message sent — I&apos;ll reply soon.
        </p>
      )}
      {status === "error" && (
        <p className="flex items-center gap-2 text-sm text-red-400">
          <AlertTriangle className="h-4 w-4" /> Something went wrong. Email me directly instead.
        </p>
      )}
    </form>
  );
}
