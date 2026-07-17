"use client";

import { motion } from "framer-motion";
import { StaggerGroup, staggerItem } from "@/components/ui/SectionReveal";
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
    <StaggerGroup className={`mt-8 grid gap-5 sm:grid-cols-2 ${cols}`}>
      {services.map((service) => (
        <motion.div key={service.title} variants={staggerItem}>
          <ServiceCard service={service} />
        </motion.div>
      ))}
    </StaggerGroup>
  );
}
