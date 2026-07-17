"use client";

import { Blocks, Cloud, Cpu, Database, Server, Wrench } from "lucide-react";
import { SectionReveal, StaggerGroup, staggerItem } from "@/components/ui/SectionReveal";
import { GlassCard } from "@/components/ui/GlassCard";
import { GradientText } from "@/components/ui/GradientText";
import { motion } from "framer-motion";

const SKILL_GROUPS = [
  {
    icon: Cpu,
    title: "AI Tools",
    skills: ["Claude", "Claude Code", "ChatGPT", "Gemini", "Groq API"],
  },
  {
    icon: Blocks,
    title: "Frontend",
    skills: ["Next.js 15", "React", "TypeScript", "Tailwind CSS"],
  },
  {
    icon: Server,
    title: "Backend",
    skills: ["Node.js", "Express", "Google Apps Script"],
  },
  {
    icon: Database,
    title: "Database",
    skills: ["Supabase", "PostgreSQL", "Row-Level Security"],
  },
  {
    icon: Cloud,
    title: "Hosting",
    skills: ["Vercel", "Render.com", "GitHub"],
  },
  {
    icon: Wrench,
    title: "Integrations",
    skills: ["Resend", "hCaptcha", "GA4", "Search Console", "Web3Forms"],
  },
];

export function SkillsSection() {
  return (
    <section className="container-px mx-auto max-w-6xl py-28">
      <SectionReveal>
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-gold">
          Toolbox
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
          Skills &amp; <GradientText>tools</GradientText>
        </h2>
      </SectionReveal>

      <StaggerGroup className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {SKILL_GROUPS.map((group) => (
          <motion.div key={group.title} variants={staggerItem}>
            <GlassCard className="h-full">
              <group.icon className="h-6 w-6 text-gold" />
              <h3 className="mt-4 text-lg font-semibold">{group.title}</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {group.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full border border-border px-3 py-1 text-xs text-muted"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </StaggerGroup>
    </section>
  );
}
