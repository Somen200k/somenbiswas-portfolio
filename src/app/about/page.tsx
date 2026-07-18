import type { Metadata } from "next";
import Image from "next/image";
import { Download, MapPin, Award } from "lucide-react";
import { SectionReveal } from "@/components/ui/SectionReveal";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { GradientText } from "@/components/ui/GradientText";
import { Timeline } from "@/components/sections/Timeline";
import { getAbout, getSeo } from "@/lib/data";

export function generateMetadata(): Metadata {
  const seo = getSeo();
  const page = seo.pages.about;
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: `${seo.siteUrl}/about` },
  };
}

export default function AboutPage() {
  const about = getAbout();

  return (
    <div className="container-px mx-auto max-w-6xl py-20">
      <SectionReveal>
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-gold">
          About
        </p>
        <h1 className="mt-3 max-w-2xl font-display text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
          From data operations to <GradientText>solo AI builder</GradientText>
        </h1>
      </SectionReveal>

      <div className="mt-16 grid gap-12 lg:grid-cols-[320px_1fr]">
        <SectionReveal>
          <div className="lg:sticky lg:top-28">
            <div className="gradient-border relative overflow-hidden rounded-3xl">
              <Image
                src={about.photoUrl}
                alt="Somen Biswas, solo AI builder and founder"
                width={480}
                height={560}
                className="h-auto w-full object-cover"
                priority
              />
            </div>

            <div className="mt-6 space-y-3 text-sm text-muted">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gold" /> {about.location}
              </div>
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-gold" /> {about.yearsExperience} years in digital operations
              </div>
            </div>

            <div className="mt-6">
              <Button href={about.cvUrl} variant="primary" className="w-full" external>
                <Download className="h-4 w-4" /> Download CV
              </Button>
            </div>
          </div>
        </SectionReveal>

        <div>
          <SectionReveal>
            <div className="space-y-5 text-base leading-relaxed text-muted">
              {about.bio.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </SectionReveal>

          <SectionReveal delay={0.1} className="mt-14">
            <h2 className="text-2xl font-semibold">Certifications</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {about.certifications.map((cert) => (
                <GlassCard key={cert.name} className="p-5">
                  <h3 className="font-semibold leading-snug">{cert.name}</h3>
                  <p className="mt-1 text-sm text-muted">{cert.issuer}</p>
                  <p className="mt-2 font-mono text-xs text-gold">{cert.year}</p>
                </GlassCard>
              ))}
            </div>
          </SectionReveal>
        </div>
      </div>

      <SectionReveal className="mt-24" delay={0.1}>
        <h2 className="text-2xl font-semibold">Career Timeline</h2>
        <div className="mt-10 max-w-3xl">
          <Timeline entries={about.timeline} />
        </div>
      </SectionReveal>
    </div>
  );
}
