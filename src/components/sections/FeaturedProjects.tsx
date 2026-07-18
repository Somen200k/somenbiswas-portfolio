import { ArrowUpRight } from "lucide-react";
import { PopReveal, SectionReveal } from "@/components/ui/SectionReveal";
import { TiltCard } from "@/components/ui/TiltCard";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { GradientText } from "@/components/ui/GradientText";
import { Eyebrow } from "@/components/ui/Eyebrow";
import type { Project } from "@/lib/types";

export function FeaturedProjects({ projects }: { projects: Project[] }) {
  const featured = projects.filter((p) => p.visible && p.featured);

  return (
    <section className="container-px mx-auto max-w-6xl py-28">
      <SectionReveal>
        <Eyebrow>Selected Work</Eyebrow>
        <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
          Live products, <GradientText>shipped solo</GradientText>
        </h2>
      </SectionReveal>

      <div className="mt-14 grid gap-8 lg:grid-cols-2">
        {featured.map((project, i) => (
          <PopReveal key={project.slug} index={i}>
            <TiltCard className="group h-full" maxTilt={5}>
              <GlassCard strong terminal className="flex h-full flex-col">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-2xl font-semibold">{project.name}</h3>
                    <p className="mt-1 text-sm text-gold">{project.tagline}</p>
                  </div>
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor-hover
                    aria-label={`Visit ${project.name}`}
                    className="glass flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-transform duration-200 group-hover:scale-110 group-hover:border-border-hover"
                  >
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                </div>

                <p className="mt-5 text-sm leading-relaxed text-muted">
                  {project.description}
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {project.techStack.slice(0, 6).map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full border border-border px-3 py-1 text-xs text-muted"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4 border-t border-border pt-6 sm:grid-cols-4">
                  {project.stats.map((stat) => (
                    <div key={stat.label}>
                      <div className="text-lg font-semibold text-foreground">
                        {stat.value}
                      </div>
                      <div className="text-[11px] uppercase tracking-wide text-dim">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex-1" />
                <div className="mt-6 flex gap-3">
                  <Button href={`/portfolio#${project.slug}`} variant="secondary" magnetic={false}>
                    Case Study
                  </Button>
                  <Button href={project.url} variant="ghost" magnetic={false}>
                    Visit Live ↗
                  </Button>
                </div>
              </GlassCard>
            </TiltCard>
          </PopReveal>
        ))}
      </div>
    </section>
  );
}
