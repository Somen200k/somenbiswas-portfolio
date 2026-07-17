import { cn } from "@/lib/utils";
import type { ElementType, ReactNode } from "react";

export function GradientText({
  children,
  as: Component = "span",
  className,
}: {
  children: ReactNode;
  as?: ElementType;
  className?: string;
}) {
  return (
    <Component className={cn("text-gradient-gold", className)}>
      {children}
    </Component>
  );
}
