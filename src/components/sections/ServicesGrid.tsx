"use client";

import { PopReveal } from "@/components/ui/SectionReveal";
import { ServiceCard } from "@/components/sections/ServiceCard";
import type { ServiceItem } from "@/lib/types";

export function ServicesGrid({
  services,
  cols = "lg:grid-cols-4",
}: {
  services: ServiceItem[];
  cols?: string;
}) {
  return (
    <div className={`mt-8 grid gap-5 sm:grid-cols-2 ${cols}`}>
      {services.map((service, i) => (
        <PopReveal key={service.title} index={i} delay={(i % 4) * 0.05}>
          <ServiceCard service={service} />
        </PopReveal>
      ))}
    </div>
  );
}
