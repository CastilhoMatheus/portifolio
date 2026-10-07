"use client";

import { useId, useSyncExternalStore } from "react";
import { MotionConfig, motion } from "motion/react";
import { useTheme } from "next-themes";

const spring = { type: "spring", stiffness: 260, damping: 18 } as const;

const RAY_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315];

// true in the browser, false during server render: the theme is unknown on the server
const subscribe = () => () => {};
const useIsClient = () =>
  useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const isClient = useIsClient();
  const maskId = useId();

  const isDark = isClient && resolvedTheme === "dark";
  const label = isDark ? "Switch to light theme" : "Switch to dark theme";

  return (
    <MotionConfig transition={spring} reducedMotion="user">
      <motion.button
        type="button"
        onClick={() => setTheme(isDark ? "light" : "dark")}
        aria-label={label}
        title={label}
        whileHover={{ scale: 1.12 }}
        whileTap={{ scale: 0.9 }}
        // Hidden until mounted, so dark-mode visitors never see a sun flash into a moon
        className={`text-text hover:text-primary focus-visible:outline-primary grid size-9 place-items-center rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 ${
          isClient ? "opacity-100" : "opacity-0"
        }`}
      >
        <motion.svg
          viewBox="0 0 24 24"
          className="size-6"
          aria-hidden="true"
          initial={false}
          // Shadow sits top-right (−45°); +40° turns the opening to face right, like ☾
          animate={{ rotate: isDark ? 40 : 0 }}
        >
          <mask id={maskId}>
            <rect width="24" height="24" fill="white" />
            {/* The "shadow" that slides in to carve the crescent */}
            <motion.circle
              r="7"
              fill="black"
              initial={false}
              animate={isDark ? { cx: 17, cy: 7 } : { cx: 30, cy: -6 }}
            />
          </mask>

          {/* Sun core → moon body */}
          <motion.circle
            cx="12"
            cy="12"
            fill="currentColor"
            mask={`url(#${maskId})`}
            initial={false}
            animate={{ r: isDark ? 8.5 : 5 }}
          />

          {/* Rays: spin and shrink away at night */}
          <motion.g
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            style={{ originX: "12px", originY: "12px" }}
            initial={false}
            animate={
              isDark
                ? { rotate: 90, scale: 0, opacity: 0 }
                : { rotate: 0, scale: 1, opacity: 1 }
            }
          >
            {RAY_ANGLES.map((angle) => (
              <line
                key={angle}
                x1="12"
                y1="2.5"
                x2="12"
                y2="4.5"
                transform={`rotate(${angle} 12 12)`}
              />
            ))}
          </motion.g>
        </motion.svg>
      </motion.button>
    </MotionConfig>
  );
}
