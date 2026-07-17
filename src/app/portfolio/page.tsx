import type { Metadata } from "next";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import { SectionReveal } from "@/components/ui/SectionReveal";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { GradientText } from "@/components/ui/GradientText";
import { getProjects, getSeo } from "@/lib/data";

export function generateMetadata(): Metadata {
  const seo = getSeo();
  const page = seo.pages.portfolio;
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: `${seo.siteUrl}/portfolio` },
  };
}

export default function PortfolioPage() {
  const projects = getProjects().filter((p) => p.visible);
  const [primary, brief] = [
    projects.filter((p) => p.featured),
    projects.filter((p) => !p.featured),
  ];

  return (
    <div className="container-px mx-auto max-w-6xl py-20">
      <SectionReveal>
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-gold">
          Portfolio
        </p>
        <h1 className="mt-3 max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
          Case studies of <GradientText>live products</GradientText>
        </h1>
        <p className="mt-5 max-w-xl text-muted">
          Three production platforms, architected and shipped solo — every
          system below is live today.
        </p>
      </SectionReveal>

      <div className="mt-20 space-y-24">
        {primary.map((project, i) => (
          <SectionReveal key={project.slug}>
            <div id={project.slug} className="scroll-mt-28">
              <div className="flex flex-wrap items-start justify-between gap-6">
                <div>
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-gold">
                    {String(i + 1).padStart(2, "0")} · {project.role}
                  </p>
                  <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
                    {project.name}
                  </h2>
                  <p className="mt-1 text-muted">{project.tagline}</p>
                </div>
                <Button href={project.url} variant="primary">
                  Visit Live <ArrowUpRight className="h-4 w-4" />
                </Button>
              </div>

              <p className="mt-8 max-w-3xl text-base leading-relaxed text-muted">
                {project.description}
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {project.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full border border-border px-3 py-1 text-xs text-muted"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="mt-10 grid gap-8 lg:grid-cols-[1.3fr_1fr]">
                <GlassCard>
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-gold">
                    What was built
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">
                    {project.whatWasBuilt}
                  </p>

                  <h3 className="mt-8 text-sm font-semibold uppercase tracking-wide text-gold">
                    Highlights
                  </h3>
                  <ul className="mt-3 space-y-3">
                    {project.highlights.map((h) => (
                      <li key={h} className="flex items-start gap-3 text-sm text-muted">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </GlassCard>

                <GlassCard strong className="flex flex-col justify-center">
                  <div className="grid grid-cols-2 gap-6">
                    {project.stats.map((stat) => (
                      <div key={stat.label}>
                        <div className="text-2xl font-bold text-gradient-gold">
                          {stat.value}
                        </div>
                        <div className="mt-1 text-xs uppercase tracking-wide text-dim">
                          {stat.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </div>
            </div>
          </SectionReveal>
        ))}
      </div>

      {brief.length > 0 && (
        <SectionReveal className="mt-28" delay={0.1}>
          <h2 className="text-2xl font-semibold">Also shipped</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {brief.map((project) => (
              <GlassCard key={project.slug} id={project.slug} className="scroll-mt-28">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-semibold">{project.name}</h3>
                    <p className="mt-1 text-sm text-gold">{project.tagline}</p>
                  </div>
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor-hover
                    className="glass flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
                  >
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-muted">
                  {project.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.techStack.slice(0, 5).map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full border border-border px-3 py-1 text-xs text-muted"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </GlassCard>
            ))}
          </div>
        </SectionReveal>
      )}
    </div>
  );
}
