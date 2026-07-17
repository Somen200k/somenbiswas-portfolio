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
        "group gradient-border rounded-2xl p-6 md:p-8",
        strong ? "glass-strong" : "glass",
        className
      )}
    >
      {children}
    </div>
  );
}
