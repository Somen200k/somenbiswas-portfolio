"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

export function SectionReveal({
  children,
  delay = 0,
  y = 32,
  className,
  once = false,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  once?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount: 0.2, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** Standalone alternating left/right "pop in" reveal, triggered on scroll into view. */
export function PopReveal({
  children,
  index = 0,
  delay = 0,
  className,
}: {
  children: ReactNode;
  index?: number;
  delay?: number;
  className?: string;
}) {
  const fromLeft = index % 2 === 0;
  return (
    <motion.div
      initial={{ opacity: 0, x: fromLeft ? -70 : 70, scale: 0.85 }}
      whileInView={{ opacity: 1, x: 0, scale: 1 }}
      viewport={{ once: false, amount: 0.3, margin: "0px 0px -10% 0px" }}
      transition={{ type: "spring", stiffness: 140, damping: 16, mass: 0.7, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
