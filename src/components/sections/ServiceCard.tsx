import { ArrowUpRight } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { getIcon } from "@/lib/icon-map";
import type { ServiceItem } from "@/lib/types";

export function ServiceCard({ service }: { service: ServiceItem }) {
  const Icon = getIcon(service.icon);

  return (
    <GlassCard className="flex h-full flex-col">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold/10 text-gold">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="mt-4 text-lg font-semibold leading-snug">{service.title}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
        {service.description}
      </p>
      <a
        href={service.ctaLink}
        data-cursor-hover
        className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-gold transition-opacity hover:opacity-80"
      >
        {service.cta} <ArrowUpRight className="h-3.5 w-3.5" />
      </a>
    </GlassCard>
  );
}
