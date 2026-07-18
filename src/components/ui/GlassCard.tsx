import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function GlassCard({
  children,
  className,
  strong = false,
  terminal = false,
  id,
}: {
  children: ReactNode;
  className?: string;
  strong?: boolean;
  terminal?: boolean;
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
      {terminal && (
        <div className="mb-5 flex items-center gap-1.5" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#27c93f]/70" />
        </div>
      )}
      {children}
    </div>
  );
}
