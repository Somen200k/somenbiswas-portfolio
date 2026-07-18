import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function GlassCard({
  children,
  className,
  strong = false,
  id,
}: {
  children: ReactNode;
  className?: string;
  strong?: boolean;
  id?: string;
}) {
  return (
    <div
      id={id}
      className={cn(
        "group gradient-border rounded-[2rem] p-6 md:p-8 transition-all duration-300",
        "hover:-translate-y-1 hover:border-border-hover hover:shadow-[0_16px_40px_-16px_rgba(245,158,11,0.28)]",
        strong ? "glass-strong" : "glass",
        className
      )}
    >
      {children}
    </div>
  );
}
