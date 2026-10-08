import type { ReactNode } from "react";

type FadeInProps = {
  children: ReactNode;
  delay?: number;
  className?: string;
};

/**
 * Subtle fade-up on load. Stagger siblings with increasing `delay` (seconds).
 * Pure CSS: runs before React hydrates and is skipped for reduced-motion users.
 */
export default function FadeIn({
  children,
  delay = 0,
  className = "",
}: FadeInProps) {
  return (
    <div
      className={`motion-safe:animate-fade-up ${className}`.trim()}
      style={{ animationDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
}
