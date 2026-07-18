"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export function LoadingScreen() {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const alreadySeen = sessionStorage.getItem("sb_loaded");
    if (alreadySeen) return;
    setVisible(true);
    sessionStorage.setItem("sb_loaded", "1");
    const timer = setTimeout(() => setVisible(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-[#0a0a0a]"
          initial={{ y: 0 }}
          exit={{ y: "-100%", transition: { duration: 0.55, ease: [0.65, 0, 0.35, 1] } }}
        >
          <div className="flex flex-col items-center gap-4">
            <motion.span
              className="font-mono text-xs uppercase tracking-[0.4em] text-dim"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
            >
              Somen Biswas
            </motion.span>
            <div className="relative h-px w-40 overflow-hidden bg-white/10">
              <motion.div
                className="absolute inset-y-0 left-0 bg-gold"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.1, ease: [0.65, 0, 0.35, 1] }}
              />
            </div>
            <motion.span
              className="text-gradient-gold text-sm font-semibold tracking-wide"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              Building with AI
            </motion.span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
