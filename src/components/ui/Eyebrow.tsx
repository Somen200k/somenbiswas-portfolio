import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p
      className={cn(
        "inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-gold",
        className
      )}
    >
      <span className="text-dim/70 normal-case tracking-normal">{"<"}</span>
      {children}
      <span className="inline-block h-3 w-[2px] animate-pulse bg-gold" aria-hidden="true" />
    </p>
  );
}
