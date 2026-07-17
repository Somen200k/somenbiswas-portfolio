"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import type { TimelineEntry } from "@/lib/types";

export function Timeline({ entries }: { entries: TimelineEntry[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (lineRef.current) {
        gsap.fromTo(
          lineRef.current,
          { height: "0%" },
          {
            height: "100%",
            ease: "none",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 70%",
              end: "bottom 80%",
              scrub: 0.6,
            },
          }
        );
      }

      const items = gsap.utils.toArray<HTMLElement>(".timeline-item");
      items.forEach((item) => {
        gsap.fromTo(
          item,
          { opacity: 0, x: -24 },
          {
            opacity: 1,
            x: 0,
            duration: 0.6,
            ease: "power2.out",
            scrollTrigger: {
              trigger: item,
              start: "top 85%",
            },
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <div className="absolute left-[7px] top-0 h-full w-px bg-border md:left-[9px]" />
      <div
        ref={lineRef}
        className="absolute left-[7px] top-0 w-px bg-gold md:left-[9px]"
        style={{ height: "0%" }}
      />

      <ul className="space-y-10">
        {entries.map((entry) => (
          <li key={`${entry.year}-${entry.title}`} className="timeline-item relative pl-8 md:pl-10">
            <span className="absolute left-0 top-1.5 h-3.5 w-3.5 rounded-full border-2 border-gold bg-background md:h-[18px] md:w-[18px]" />
            <p className="font-mono text-xs uppercase tracking-wider text-gold">
              {entry.year}
            </p>
            <h3 className="mt-1 text-lg font-semibold">{entry.title}</h3>
            <p className="text-sm text-muted">{entry.org}</p>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
              {entry.description}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
