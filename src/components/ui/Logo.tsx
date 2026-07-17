import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      className={cn("h-8 w-8", className)}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="logo-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#161104" />
          <stop offset="100%" stopColor="#0a0a0a" />
        </linearGradient>
        <linearGradient id="logo-text" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fcd34d" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="10" fill="url(#logo-bg)" />
      <rect
        x="0.75"
        y="0.75"
        width="38.5"
        height="38.5"
        rx="9.25"
        stroke="url(#logo-text)"
        strokeOpacity="0.4"
        strokeWidth="1"
      />
      <path
        d="M27 14.8c-1.1-1.6-2.9-2.5-5.4-2.5-3.6 0-5.7 1.7-5.7 4.1 0 2.2 1.5 3.3 4.3 3.9l2.3.5c3.6.8 5.6 2.3 5.6 5.1 0 3.3-2.9 5.4-7.2 5.4-3.4 0-6-1.2-7.4-3.5"
        stroke="url(#logo-text)"
        strokeWidth="2.6"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

export function Logo({ className, showText = true }: { className?: string; showText?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <LogoMark />
      {showText && (
        <span className="font-mono text-sm font-semibold tracking-wide text-foreground">
          Somen<span className="text-gold">.</span>Biswas
        </span>
      )}
    </span>
  );
}
