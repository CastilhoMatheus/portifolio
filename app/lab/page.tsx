import type { Metadata } from "next";
import Container from "@/components/Container";
import FadeIn from "@/components/FadeIn";
import Pathfinder from "@/components/pathfinder/Pathfinder";

export const metadata: Metadata = {
  title: "Lab",
  description:
    "An interactive pathfinding visualiser: watch BFS and A* find the shortest path around my name.",
};

export default function LabPage() {
  return (
    <Container className="py-16 sm:py-24">
      <FadeIn className="flex flex-col items-start gap-4">
        <span className="bg-surface text-muted rounded-full px-3 py-1 font-mono text-sm">
          Lab
        </span>
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          Logic you can see.
        </h1>
        <p className="text-muted max-w-2xl text-xl">
          Pick a goal anywhere on the grid and watch the algorithm find the
          shortest way around my name. Hover to preview, click to replay the
          search.
        </p>
      </FadeIn>

      <FadeIn delay={0.1} className="mt-12">
        <Pathfinder />
      </FadeIn>

      <FadeIn delay={0.2}>
        <section className="mt-20 grid gap-10 md:grid-cols-2">
          <div className="flex flex-col gap-3">
            <h2 className="text-2xl font-bold tracking-tight">
              BFS: breadth-first search
            </h2>
            <p className="text-muted text-lg leading-relaxed">
              Explores outwards in rings, every cell one step away, then two,
              then three. The first time it reaches the goal is guaranteed to be
              a shortest path, but it searches in every direction to get there.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <h2 className="text-2xl font-bold tracking-tight">A* search</h2>
            <p className="text-muted text-lg leading-relaxed">
              Same guarantee, smarter order. It ranks cells by steps taken so
              far plus an estimate of the distance left, and always expands the
              most promising one first. Compare the visited counts: on an open
              grid it often checks a fraction of what BFS does.
            </p>
          </div>
        </section>
      </FadeIn>
    </Container>
  );
}
