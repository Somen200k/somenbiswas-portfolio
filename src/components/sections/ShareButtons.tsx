"use client";

import { useState } from "react";
import { Link2, MessageCircle, Check } from "lucide-react";
import { LinkedInIcon, XIcon } from "@/components/ui/BrandIcons";

export function ShareButtons({ title, url }: { title: string; url: string }) {
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const links = [
    {
      label: "Share on X",
      icon: XIcon,
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    },
    {
      label: "Share on LinkedIn",
      icon: LinkedInIcon,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
    {
      label: "Share on WhatsApp",
      icon: MessageCircle,
      href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    },
  ];

  async function copyLink() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex items-center gap-3">
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={link.label}
          data-cursor-hover
          className="glass flex h-10 w-10 items-center justify-center rounded-full text-muted transition-colors hover:border-border-hover hover:text-gold"
        >
          <link.icon className="h-4 w-4" />
        </a>
      ))}
      <button
        type="button"
        onClick={copyLink}
        aria-label="Copy link"
        data-cursor-hover
        className="glass flex h-10 w-10 items-center justify-center rounded-full text-muted transition-colors hover:border-border-hover hover:text-gold"
      >
        {copied ? <Check className="h-4 w-4 text-gold" /> : <Link2 className="h-4 w-4" />}
      </button>
    </div>
  );
}
