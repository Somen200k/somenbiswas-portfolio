import type { Metadata } from "next";
import { ExternalLink } from "lucide-react";
import { SectionReveal } from "@/components/ui/SectionReveal";
import { GlassCard } from "@/components/ui/GlassCard";
import { GradientText } from "@/components/ui/GradientText";
import { Button } from "@/components/ui/Button";
import { ServicesGrid } from "@/components/sections/ServicesGrid";
import { ContactForm } from "@/components/sections/ContactForm";
import { getContact, getRates, getSeo, getServices } from "@/lib/data";

export function generateMetadata(): Metadata {
  const seo = getSeo();
  const page = seo.pages.hireMe;
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: `${seo.siteUrl}/hire-me` },
  };
}

export default function HireMePage() {
  const services = getServices();
  const rates = getRates();
  const contact = getContact();

  return (
    <div className="container-px mx-auto max-w-6xl py-20">
      <SectionReveal>
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-gold">
          Hire Me
        </p>
        <h1 className="mt-3 max-w-2xl font-display text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
          Two ways to <GradientText>get things done</GradientText>
        </h1>
        <p className="mt-5 max-w-2xl text-muted">{services.intro}</p>
      </SectionReveal>

      <SectionReveal className="mt-16" delay={0.05}>
        <h2 className="text-2xl font-semibold">Personal Services</h2>
        <p className="mt-1 text-sm text-muted">Product builds I design and ship myself.</p>
      </SectionReveal>
      <ServicesGrid services={services.personal} />

      <SectionReveal className="mt-24" delay={0.05}>
        <h2 className="text-2xl font-semibold">NexGuild Client Services</h2>
        <p className="mt-1 text-sm text-muted">
          Human-powered work delivered through NexGuild&apos;s verified contributor network.
        </p>
      </SectionReveal>
      <ServicesGrid services={services.nexguild} />

      <SectionReveal className="mt-24" delay={0.05}>
        <div className="gradient-border relative overflow-hidden rounded-3xl glass-strong px-8 py-14 text-center md:px-16">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_60%_at_50%_0%,rgba(2,180,145,0.14),transparent_70%)]" />
          <h2 className="relative text-2xl font-semibold sm:text-3xl">
            {services.ctaBand.heading}
          </h2>
          <p className="relative mx-auto mt-3 max-w-lg text-muted">
            {services.ctaBand.body}
          </p>
          <div className="relative mt-8">
            <Button href={services.ctaBand.buttonLink} variant="primary">
              {services.ctaBand.buttonText}
            </Button>
          </div>
        </div>
      </SectionReveal>

      <SectionReveal className="mt-24" delay={0.05}>
        <h2 className="text-2xl font-semibold">Starting Rates</h2>
        <p className="mt-1 text-sm text-muted">{rates.note}</p>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {rates.tiers.map((tier) => (
            <GlassCard key={tier.name}>
              <h3 className="text-lg font-semibold">{tier.name}</h3>
              <p className="mt-2 text-2xl font-bold text-gradient-gold">{tier.price}</p>
              <p className="mt-3 text-sm text-muted">{tier.description}</p>
            </GlassCard>
          ))}
        </div>
      </SectionReveal>

      <div className="mt-24 grid gap-8 lg:grid-cols-2">
        <SectionReveal delay={0.05}>
          <GlassCard strong>
            <h2 className="text-xl font-semibold">Start a project</h2>
            <p className="mt-2 text-sm text-muted">
              Tell me what you&apos;re building — I&apos;ll reply personally.
            </p>
            <div className="mt-6">
              <ContactForm compact />
            </div>
          </GlassCard>
        </SectionReveal>

        <SectionReveal delay={0.1}>
          <GlassCard className="flex h-full flex-col justify-center">
            <h2 className="text-xl font-semibold">Find me elsewhere</h2>
            <p className="mt-2 text-sm text-muted">
              Prefer freelance platforms? Here&apos;s where else I take on work.
            </p>
            <div className="mt-6 space-y-3">
              {contact.upworkUrl ? (
                <a
                  href={contact.upworkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass flex items-center justify-between rounded-xl px-4 py-3 text-sm hover:border-border-hover"
                >
                  Upwork Profile <ExternalLink className="h-4 w-4 text-gold" />
                </a>
              ) : (
                <div className="glass flex items-center justify-between rounded-xl px-4 py-3 text-sm text-muted">
                  Upwork profile — available on request
                </div>
              )}
              <a
                href={`mailto:${contact.email}`}
                className="glass flex items-center justify-between rounded-xl px-4 py-3 text-sm hover:border-border-hover"
              >
                {contact.email} <ExternalLink className="h-4 w-4 text-gold" />
              </a>
            </div>
          </GlassCard>
        </SectionReveal>
      </div>
    </div>
  );
}
