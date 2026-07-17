import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { MagneticButton } from "./MagneticButton";

type Variant = "primary" | "secondary" | "ghost";

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-gold text-[#0a0a0a] hover:bg-gold-light shadow-[0_0_0_1px_rgba(245,158,11,0.4),0_8px_30px_-8px_rgba(245,158,11,0.55)]",
  secondary:
    "glass text-foreground hover:border-border-hover hover:bg-white/[0.06]",
  ghost: "text-muted hover:text-foreground",
};

interface ButtonProps {
  children: ReactNode;
  href: string;
  variant?: Variant;
  className?: string;
  external?: boolean;
  magnetic?: boolean;
}

export function Button({
  children,
  href,
  variant = "primary",
  className,
  external,
  magnetic = true,
}: ButtonProps) {
  const isExternal = external ?? /^(https?:|mailto:|tel:)/.test(href);
  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold tracking-wide transition-colors duration-300",
    variantClasses[variant],
    className
  );

  const content = isExternal ? (
    <a
      href={href}
      className={classes}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      data-cursor-hover
    >
      {children}
    </a>
  ) : (
    <Link href={href} className={classes} data-cursor-hover>
      {children}
    </Link>
  );

  if (!magnetic) return content;
  return <MagneticButton>{content}</MagneticButton>;
}
