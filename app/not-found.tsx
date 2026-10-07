import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";

// Having our own not-found also stops Next's default 404 from injecting a global
// <style> (body { background: #000 }) that lingers after navigating away.
export const metadata: Metadata = {
  title: "Offside",
};

export default function NotFound() {
  return (
    <section className="py-24 sm:py-32">
      <Container className="flex flex-col items-start gap-6">
        <span className="bg-surface text-muted rounded-full px-3 py-1 font-mono text-sm">
          404 · page not found
        </span>

        <h1 className="text-5xl font-bold tracking-tight sm:text-7xl">
          <span className="text-primary">Offside!</span> 🚩
        </h1>

        <p className="text-muted max-w-xl text-xl sm:text-2xl">
          This page was caught behind the last defender. It doesn&apos;t exist —
          or not yet.
        </p>

        <Link
          href="/"
          className="bg-primary text-bg focus-visible:outline-primary rounded-full px-5 py-2 font-semibold transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-4"
        >
          Back to kick-off
        </Link>
      </Container>
    </section>
  );
}
