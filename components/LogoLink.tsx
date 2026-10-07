"use client";

import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { site } from "@/content/site";

const MotionLink = motion.create(Link);

const slide = { type: "spring", stiffness: 420, damping: 32 } as const;

// "Kit swap": each letter's home-kit version slides up and out while the
// away-kit version (stacked right below it) slides into place, one after another.
const letterSwap: Variants = {
  home: (i: number) => ({ y: "0%", transition: { ...slide, delay: i * 0.02 } }),
  away: (i: number) => ({
    y: "-100%",
    transition: { ...slide, delay: i * 0.025 },
  }),
};

const underline: Variants = {
  home: { scaleX: 0, transition: { duration: 0.2 } },
  away: { scaleX: 1, transition: { ...slide, delay: 0.15 } },
};

type Part = { text: string; homeClass: string };

const PARTS: Part[] = [
  { text: site.shortName, homeClass: "text-text" },
  { text: " ", homeClass: "" },
  { text: site.lastName, homeClass: "text-primary" },
];

export default function LogoLink() {
  const reduceMotion = useReducedMotion();
  const swapVariant = reduceMotion ? undefined : "away";

  let index = 0;

  return (
    <MotionLink
      href="/"
      aria-label={`${site.shortName} ${site.lastName} — home`}
      initial="home"
      animate="home"
      whileHover={swapVariant}
      whileFocus={swapVariant}
      className="focus-visible:outline-primary relative rounded-sm text-xl font-bold tracking-tight focus-visible:outline-2 focus-visible:outline-offset-4"
    >
      <span aria-hidden="true" className="flex">
        {PARTS.map((part) =>
          part.text.split("").map((letter) => {
            const i = index++;
            return (
              <span key={i} className="inline-block overflow-hidden">
                <motion.span
                  className="relative inline-block"
                  custom={i}
                  variants={letterSwap}
                >
                  <span className={part.homeClass}>{letter}</span>
                  <span className="text-blue absolute top-full left-0 dark:[text-shadow:0_0_10px_rgb(127_162_255/0.45)]">
                    {letter}
                  </span>
                </motion.span>
              </span>
            );
          }),
        )}
      </span>

      {/* Gold stripe on the away kit */}
      <motion.span
        aria-hidden="true"
        className="bg-gold absolute inset-x-0 -bottom-1 h-0.5 origin-left rounded-full"
        variants={underline}
      />
    </MotionLink>
  );
}
