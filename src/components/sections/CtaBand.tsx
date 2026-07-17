import { ArrowRight } from "lucide-react";
import { SectionReveal } from "@/components/ui/SectionReveal";
import { Button } from "@/components/ui/Button";
import { GradientText } from "@/components/ui/GradientText";

export function CtaBand() {
  return (
    <section className="container-px mx-auto max-w-6xl pb-28">
      <SectionReveal>
        <div className="gradient-border relative overflow-hidden rounded-3xl glass-strong px-8 py-16 text-center md:px-16 md:py-24">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_60%_at_50%_0%,rgba(245,158,11,0.14),transparent_70%)]" />
          <h2 className="relative text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
            Have a product idea?{" "}
            <GradientText>Let&apos;s build it.</GradientText>
          </h2>
          <p className="relative mx-auto mt-5 max-w-xl text-muted">
            From AI-powered platforms to automated content systems — I design,
            build, and ship it solo.
          </p>
          <div className="relative mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button href="/hire-me" variant="primary">
              Hire Me <ArrowRight className="h-4 w-4" />
            </Button>
            <Button href="https://nexguild.in" variant="secondary">
              Join NexGuild
            </Button>
          </div>
        </div>
      </SectionReveal>
    </section>
  );
}
