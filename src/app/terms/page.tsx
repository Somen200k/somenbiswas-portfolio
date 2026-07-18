import type { Metadata } from "next";
import { SectionReveal } from "@/components/ui/SectionReveal";
import { GradientText } from "@/components/ui/GradientText";
import { getContact, getSeo } from "@/lib/data";

export function generateMetadata(): Metadata {
  const seo = getSeo();
  return {
    title: "Terms of Service",
    description: "Terms governing use of somenbiswas.me.",
    alternates: { canonical: `${seo.siteUrl}/terms` },
    robots: { index: true, follow: true },
  };
}

export default function TermsPage() {
  const contact = getContact();

  return (
    <div className="container-px mx-auto max-w-3xl py-20">
      <SectionReveal>
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-gold">Legal</p>
        <h1 className="mt-3 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
          Terms of <GradientText>Service</GradientText>
        </h1>
        <p className="mt-4 text-sm text-dim">Last updated: July 17, 2026</p>
      </SectionReveal>

      <SectionReveal delay={0.05} className="prose prose-invert prose-gold mt-12 max-w-none">
        <p>
          By using somenbiswas.me (&ldquo;this site&rdquo;), you agree to the terms below. If you
          don&apos;t agree, please don&apos;t use the site.
        </p>

        <h2>Content</h2>
        <p>
          All written content, design, and code on this site is © Somen Biswas unless otherwise
          noted. You&apos;re welcome to share links to pages on this site; please don&apos;t
          republish full articles without permission or attribution.
        </p>

        <h2>Accuracy</h2>
        <p>
          Portfolio case studies, statistics, and blog content reflect the state of the projects
          described at the time of writing and are updated periodically. We make reasonable
          efforts to keep information accurate but don&apos;t guarantee it&apos;s current at every
          moment.
        </p>

        <h2>Hiring &amp; services</h2>
        <p>
          Information on the Hire Me page describes services offered and general pricing
          approach. Submitting the contact or hiring form does not create a binding agreement —
          any actual engagement is governed by a separate agreement made directly between the
          parties.
        </p>

        <h2>External links</h2>
        <p>
          This site links to third-party sites (NexGuild, xtoolkit.live, StarScoopDaily, social
          profiles, and others). We don&apos;t control and aren&apos;t responsible for the content,
          policies, or practices of those third-party sites.
        </p>

        <h2>No warranty</h2>
        <p>
          This site and its content are provided &ldquo;as is,&rdquo; without warranties of any
          kind, express or implied. We&apos;re not liable for any damages arising from your use of
          this site.
        </p>

        <h2>Governing law</h2>
        <p>
          These terms are governed by the laws of India, without regard to conflict-of-law
          principles.
        </p>

        <h2>Changes</h2>
        <p>
          We may update these terms from time to time. Continued use of the site after changes
          means you accept the updated terms.
        </p>

        <h2>Contact</h2>
        <p>
          Questions about these terms? Email <a href={`mailto:${contact.email}`}>{contact.email}</a>.
        </p>
      </SectionReveal>
    </div>
  );
}
