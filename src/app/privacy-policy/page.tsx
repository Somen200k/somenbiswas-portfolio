import type { Metadata } from "next";
import { SectionReveal } from "@/components/ui/SectionReveal";
import { GradientText } from "@/components/ui/GradientText";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { getContact, getSeo } from "@/lib/data";

export function generateMetadata(): Metadata {
  const seo = getSeo();
  return {
    title: "Privacy Policy",
    description: "How somenbiswas.me collects, uses, and protects your information.",
    alternates: { canonical: `${seo.siteUrl}/privacy-policy` },
    robots: { index: true, follow: true },
  };
}

export default function PrivacyPolicyPage() {
  const contact = getContact();

  return (
    <div className="container-px mx-auto max-w-3xl py-20">
      <SectionReveal>
        <Eyebrow>Legal</Eyebrow>
        <h1 className="mt-3 font-display text-4xl font-extrabold leading-[1.2] tracking-tight sm:text-5xl">
          Privacy <GradientText>Policy</GradientText>
        </h1>
        <p className="mt-4 text-sm text-dim">Last updated: July 17, 2026</p>
      </SectionReveal>

      <SectionReveal delay={0.05} className="prose prose-invert prose-gold mt-12 max-w-none">
        <p>
          This Privacy Policy explains how somenbiswas.me (&ldquo;this site,&rdquo; &ldquo;we,&rdquo;
          &ldquo;us&rdquo;) collects, uses, and protects information when you visit. This site is
          operated by Somen Biswas as a personal portfolio and blog.
        </p>

        <h2>Information we collect</h2>
        <p>We collect information in a few limited ways:</p>
        <ul>
          <li>
            <strong>Contact form submissions.</strong> When you submit the contact form on the
            Contact or Hire Me pages, your name, email address, and message are sent to us via
            Web3Forms, a third-party form processing service, and forwarded to our email inbox.
            We use this information solely to respond to your inquiry.
          </li>
          <li>
            <strong>Analytics.</strong> We may use Google Analytics 4 to understand how visitors
            use this site — pages viewed, general location (country/city level), device type, and
            referral source. Google Analytics uses cookies and similar technologies to collect
            this information in aggregate and does not identify you personally.
          </li>
          <li>
            <strong>Advertising.</strong> This site may display third-party advertisements,
            including through Google AdSense. Google and its partners may use cookies to serve
            ads based on your prior visits to this or other websites. You can opt out of
            personalized advertising by visiting{" "}
            <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer">
              Google Ads Settings
            </a>
            .
          </li>
        </ul>

        <h2>What we don&apos;t do</h2>
        <p>
          This site does not require account creation, does not process payments, and does not
          knowingly collect information from children under 13. The <code>/admin</code> content
          manager is password-protected for the site owner only and is not a public user account
          system.
        </p>

        <h2>Third-party links</h2>
        <p>
          This site links to NexGuild, xtoolkit.live, StarScoopDaily, and various social media
          profiles. Each of those is operated separately and governed by its own privacy policy —
          this policy only covers somenbiswas.me itself.
        </p>

        <h2>Cookies</h2>
        <p>
          Cookies set on this site are limited to analytics (Google Analytics 4) and, where
          enabled, advertising (Google AdSense). You can disable cookies through your browser
          settings at any time; doing so may affect how analytics and ads function but will not
          prevent you from using the site.
        </p>

        <h2>Data retention &amp; security</h2>
        <p>
          Contact form messages are retained only as long as needed to respond to your inquiry.
          We take reasonable measures to protect information in transit (HTTPS) but cannot
          guarantee absolute security of data transmitted over the internet.
        </p>

        <h2>Your rights</h2>
        <p>
          You can request access to, correction of, or deletion of any personal information you&apos;ve
          submitted through the contact form by emailing us at the address below.
        </p>

        <h2>Changes to this policy</h2>
        <p>
          We may update this policy from time to time. The &ldquo;Last updated&rdquo; date at the
          top of this page reflects the most recent revision.
        </p>

        <h2>Contact</h2>
        <p>
          Questions about this policy? Email{" "}
          <a href={`mailto:${contact.email}`}>{contact.email}</a>.
        </p>
      </SectionReveal>
    </div>
  );
}
