import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { SectionReveal } from "@/components/ui/SectionReveal";
import type { StatItem } from "@/lib/types";

export function StatsBand({ stats }: { stats: StatItem[] }) {
  return (
    <section className="border-y border-border bg-bg-elevated/40">
      <div className="container-px mx-auto max-w-6xl py-14">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat, i) => (
            <SectionReveal key={stat.label} delay={i * 0.08}>
              <div className="text-center">
                <div className="text-4xl font-bold tracking-tight text-gradient-gold md:text-5xl">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </div>
                <p className="mt-2 text-xs uppercase tracking-[0.15em] text-muted md:text-sm">
                  {stat.label}
                </p>
              </div>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
