"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function StaggerText({
  text,
  className,
  wordClassName,
  delay = 0,
}: {
  text: string;
  className?: string;
  wordClassName?: string;
  delay?: number;
}) {
  const words = text.split(" ");

  return (
    <motion.span
      initial="hidden"
      animate="show"
      variants={{
        hidden: {},
        show: {
          transition: { staggerChildren: 0.06, delayChildren: delay },
        },
      }}
      className={cn("inline-block", className)}
      aria-label={text}
    >
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden pb-1 pr-[0.28em] align-top">
          <motion.span
            variants={{
              hidden: { y: "110%", opacity: 0 },
              show: {
                y: "0%",
                opacity: 1,
                transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
              },
            }}
            className={cn("inline-block", wordClassName)}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}
