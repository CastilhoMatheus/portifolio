"use client";

import { useState, type ReactNode } from "react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";

const pop = { type: "spring", stiffness: 500, damping: 22 } as const;

/**
 * Easter egg for MDX: <Porco>Palmeiras</Porco>
 * Hover/focus → a pig pops up. Click → it jumps and oinks.
 */
export default function Porco({ children }: { children: ReactNode }) {
  const [visible, setVisible] = useState(false);
  const [oinks, setOinks] = useState(0);

  return (
    <MotionConfig reducedMotion="user">
      <span className="relative inline-block">
        <button
          type="button"
          onMouseEnter={() => setVisible(true)}
          onMouseLeave={() => setVisible(false)}
          onFocus={() => setVisible(true)}
          onBlur={() => setVisible(false)}
          onClick={() => {
            setVisible(true);
            setOinks((n) => n + 1);
          }}
          className="text-primary decoration-primary/50 focus-visible:outline-primary cursor-pointer rounded-sm font-semibold underline decoration-dotted decoration-2 underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          {children}
        </button>

        <AnimatePresence>
          {visible && (
            <motion.span
              aria-hidden="true"
              className="pointer-events-none absolute bottom-full left-1/2 flex flex-col items-center"
              initial={{ x: "-50%", y: 12, scale: 0.3, opacity: 0 }}
              animate={{ x: "-50%", y: -2, scale: 1, opacity: 1 }}
              exit={{ x: "-50%", y: 8, scale: 0.3, opacity: 0 }}
              transition={pop}
            >
              {/* Re-keyed per click so the jump replays every time */}
              {oinks > 0 && (
                <motion.span
                  key={`bubble-${oinks}`}
                  className="bg-text text-bg mb-5 rounded-full px-2 py-0.5 font-mono text-xs whitespace-nowrap"
                  initial={{ opacity: 0, y: 6, scale: 0.6 }}
                  animate={{ opacity: [0, 1, 1, 0], y: -6, scale: 1 }}
                  transition={{ duration: 1.2, times: [0, 0.15, 0.7, 1] }}
                >
                  oink!
                </motion.span>
              )}
              <motion.span
                key={`pig-${oinks}`}
                className="text-3xl leading-none"
                animate={
                  oinks > 0
                    ? { y: [0, -14, 0], rotate: [0, -12, 12, 0] }
                    : { rotate: [0, -8, 8, 0] }
                }
                transition={{ duration: 0.5 }}
              >
                🐷
              </motion.span>
            </motion.span>
          )}
        </AnimatePresence>
      </span>
    </MotionConfig>
  );
}
