import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/images/logo-mark.png"
      alt="Somen Biswas"
      className={cn("h-8 w-8 object-contain", className)}
    />
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
