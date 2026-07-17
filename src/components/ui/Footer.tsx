import Link from "next/link";
import { Mail, MessageCircle, Send } from "lucide-react";
import { getContact } from "@/lib/data";
import { InstagramIcon, LinkedInIcon, XIcon, YouTubeIcon } from "@/components/ui/BrandIcons";

export function Footer() {
  const contact = getContact();
  const year = new Date().getFullYear();

  const socials = [
    { href: contact.linkedin, label: "LinkedIn", icon: LinkedInIcon },
    { href: contact.twitter, label: "X", icon: XIcon },
    { href: contact.instagram, label: "Instagram", icon: InstagramIcon },
    { href: contact.youtube, label: "YouTube", icon: YouTubeIcon },
    { href: contact.telegram, label: "Telegram", icon: Send },
  ];

  return (
    <footer className="relative mt-32 border-t border-border">
      <div className="container-px mx-auto max-w-6xl py-16">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Link href="/" className="font-mono text-lg font-semibold">
              Somen<span className="text-gold">.</span>Biswas
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
              Solo AI builder from West Bengal, India — shipping production-ready
              AI-powered web platforms with Claude Code.
            </p>
            <div className="mt-6 flex items-center gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  data-cursor-hover
                  className="glass flex h-10 w-10 items-center justify-center rounded-full text-muted transition-colors duration-200 hover:border-border-hover hover:text-gold"
                >
                  <s.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-dim">
              Navigate
            </h3>
            <ul className="mt-4 space-y-3 text-sm">
              {[
                ["About", "/about"],
                ["Portfolio", "/portfolio"],
                ["Blog", "/blog"],
                ["Hire Me", "/hire-me"],
                ["Contact", "/contact"],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="text-muted transition-colors hover:text-foreground">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-dim">
              Get in touch
            </h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <a
                  href={`mailto:${contact.email}`}
                  className="inline-flex items-center gap-2 text-muted transition-colors hover:text-foreground"
                >
                  <Mail className="h-4 w-4 text-gold" /> {contact.email}
                </a>
              </li>
              <li>
                <a
                  href={`https://wa.me/${contact.whatsapp.replace("+", "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-muted transition-colors hover:text-foreground"
                >
                  <MessageCircle className="h-4 w-4 text-gold" /> {contact.whatsappDisplay}
                </a>
              </li>
              <li>
                <a
                  href="https://nexguild.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gold transition-opacity hover:opacity-80"
                >
                  Join NexGuild →
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 text-xs text-dim md:flex-row">
          <p>© {year} Somen Biswas. All rights reserved.</p>
          <p>Designed &amp; built solo with Claude Code.</p>
        </div>
      </div>
    </footer>
  );
}
