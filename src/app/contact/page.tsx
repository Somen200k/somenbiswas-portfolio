import type { Metadata } from "next";
import { Mail, MessageCircle, Send } from "lucide-react";
import { SectionReveal } from "@/components/ui/SectionReveal";
import { GlassCard } from "@/components/ui/GlassCard";
import { GradientText } from "@/components/ui/GradientText";
import { ContactForm } from "@/components/sections/ContactForm";
import { LinkedInIcon, YouTubeIcon } from "@/components/ui/BrandIcons";
import { getContact, getSeo } from "@/lib/data";

export function generateMetadata(): Metadata {
  const seo = getSeo();
  const page = seo.pages.contact;
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: `${seo.siteUrl}/contact` },
  };
}

export default function ContactPage() {
  const contact = getContact();

  const channels = [
    {
      icon: Mail,
      label: "Email",
      value: contact.email,
      href: `mailto:${contact.email}`,
    },
    {
      icon: MessageCircle,
      label: "WhatsApp",
      value: contact.whatsappDisplay,
      href: `https://wa.me/${contact.whatsapp.replace("+", "")}`,
    },
    {
      icon: LinkedInIcon,
      label: "LinkedIn",
      value: "somen-biswas-410727215",
      href: contact.linkedin,
    },
    {
      icon: Send,
      label: "Telegram",
      value: "@so_m_en",
      href: contact.telegram,
    },
    {
      icon: YouTubeIcon,
      label: "YouTube",
      value: "Career Growth Remotely",
      href: contact.youtube,
    },
  ];

  return (
    <div className="container-px mx-auto max-w-6xl py-20">
      <SectionReveal>
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-gold">
          Contact
        </p>
        <h1 className="mt-3 max-w-2xl font-display text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
          Let&apos;s talk about <GradientText>your project</GradientText>
        </h1>
        <p className="mt-5 max-w-xl text-muted">
          Whether it&apos;s a platform build, a quick question, or a collaboration
          idea — reach out however&apos;s easiest for you.
        </p>
      </SectionReveal>

      <div className="mt-16 grid gap-8 lg:grid-cols-[1fr_1.2fr]">
        <SectionReveal>
          <div className="space-y-4">
            {channels.map((channel) => (
              <a
                key={channel.label}
                href={channel.href}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor-hover
                className="glass group flex items-center gap-4 rounded-2xl px-5 py-4 transition-colors duration-200 hover:border-border-hover"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gold/10 text-gold">
                  <channel.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-dim">
                    {channel.label}
                  </p>
                  <p className="font-medium text-foreground">{channel.value}</p>
                </div>
              </a>
            ))}
          </div>
        </SectionReveal>

        <SectionReveal delay={0.1}>
          <GlassCard strong>
            <h2 className="text-xl font-semibold">Send a message</h2>
            <p className="mt-2 text-sm text-muted">
              I read every message myself and reply within a day or two.
            </p>
            <div className="mt-6">
              <ContactForm />
            </div>
          </GlassCard>
        </SectionReveal>
      </div>
    </div>
  );
}
