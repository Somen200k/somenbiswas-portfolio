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
        <linearGradient id="logo-mark" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#fcd34d" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="10" fill="url(#logo-bg)" />
      <rect
        x="0.75"
        y="0.75"
        width="38.5"
        height="38.5"
        rx="9.25"
        stroke="url(#logo-mark)"
        strokeOpacity="0.35"
        strokeWidth="1"
      />
      <path
        d="M10.5 26.5 Q19.5 23.5 28.5 11.5"
        stroke="url(#logo-mark)"
        strokeOpacity="0.85"
        strokeWidth="1.6"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="10.5" cy="26.5" r="2.3" fill="url(#logo-mark)" />
      <circle cx="19.7" cy="20.6" r="3" fill="url(#logo-mark)" />
      <circle cx="28.5" cy="11.5" r="3.8" fill="url(#logo-mark)" />
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
