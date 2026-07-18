"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { ParticleField } from "@/components/ui/ParticleField";
import { StaggerText } from "@/components/ui/StaggerText";
import { Button } from "@/components/ui/Button";
import type { HeroData } from "@/lib/types";

export function Hero({ data }: { data: HeroData }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const parts = data.headline.split(data.highlightWord);

  return (
    <section
      ref={ref}
      className="relative flex min-h-[92vh] items-center overflow-hidden"
    >
      <div className="absolute inset-0">
        <ParticleField count={80} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_55%_50%_at_30%_0%,rgba(139,92,246,0.22),transparent_70%),radial-gradient(ellipse_50%_45%_at_75%_10%,rgba(245,158,11,0.16),transparent_70%)]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />
      </div>

      <motion.div
        style={{ y, opacity }}
        className="container-px relative mx-auto max-w-6xl"
      >
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="glass-pill mb-6 inline-flex items-center gap-2 px-4 py-1.5 font-mono text-xs uppercase tracking-[0.2em] text-muted"
        >
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-gold" />
          {data.eyebrow}
        </motion.p>

        <h1 className="font-display max-w-4xl text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl">
          <StaggerText text={parts[0]?.trim() ?? ""} />{" "}
          <StaggerText
            text={data.highlightWord}
            delay={0.2}
            wordClassName="text-gradient-gold"
          />{" "}
          <StaggerText text={parts[1]?.trim() ?? ""} delay={0.35} />
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.9 }}
          className="mt-8 max-w-xl text-base leading-relaxed text-muted md:text-lg"
        >
          {data.subheadline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.1 }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <Button href={data.ctaPrimaryLink} variant="primary">
            {data.ctaPrimaryText} <ArrowRight className="h-4 w-4" />
          </Button>
          <Button href={data.ctaSecondaryLink} variant="secondary">
            {data.ctaSecondaryText}
          </Button>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="flex h-9 w-6 items-start justify-center rounded-full border border-border p-1.5">
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            className="h-1.5 w-1.5 rounded-full bg-gold"
          />
        </div>
      </motion.div>
    </section>
  );
}
