"use client";

import { AnimatePresence, motion } from "motion/react";
import { Check, Info } from "lucide-react";
import { useUI } from "@/store/ui";

export function Toaster() {
  const { toasts } = useUI();
  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed bottom-4 left-1/2 z-[90] flex w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 flex-col gap-2 sm:bottom-6"
    >
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            layout
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.96 }}
            className="glass-strong edge pointer-events-auto flex items-center gap-3 rounded-2xl px-4 py-3 text-sm shadow-xl shadow-black/50"
          >
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10">
              {t.tone === "error" ? <Info className="h-3.5 w-3.5 text-danger" /> : <Check className="h-3.5 w-3.5 text-success" />}
            </span>
            {t.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
