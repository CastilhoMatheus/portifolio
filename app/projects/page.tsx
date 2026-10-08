import type { Metadata } from "next";
import Container from "@/components/Container";
import FadeIn from "@/components/FadeIn";
import ProjectIndex from "@/components/ProjectIndex";
import { getProjects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Things I've built: full-stack web apps, AI-powered tools, mobile apps and algorithm practice.",
};

export default async function ProjectsPage() {
  const projects = await getProjects();
  const featured = projects.filter((p) => p.featured);
  const others = projects.filter((p) => !p.featured);

  return (
    <Container className="py-16 sm:py-24">
      <FadeIn className="flex flex-col items-start gap-4">
        <span className="bg-surface text-muted rounded-full px-3 py-1 font-mono text-sm">
          Projects
        </span>
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          Things I&apos;ve built.
        </h1>
        <p className="text-muted max-w-2xl text-xl">
          A few I&apos;m proud of, with notes on how they work and what I
          learned building them.
        </p>
      </FadeIn>

      <FadeIn delay={0.1} className="mt-14">
        <ProjectIndex projects={featured} />
      </FadeIn>

      {others.length > 0 && (
        <FadeIn delay={0.2} className="mt-20">
          <h2 className="text-2xl font-bold tracking-tight">Also built</h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {others.map((project) => {
              const href = project.live ?? project.repo;
              return (
                <li key={project.slug}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group bg-surface hover:ring-primary focus-visible:outline-primary flex h-full flex-col gap-2 rounded-xl p-5 transition-shadow hover:ring-2 focus-visible:outline-2"
                  >
                    <span className="flex items-baseline justify-between gap-4">
                      <span className="group-hover:text-primary font-semibold transition-colors">
                        {project.title}
                      </span>
                      <span className="text-muted font-mono text-xs">
                        {project.year}
                      </span>
                    </span>
                    <span className="text-muted text-sm">
                      {project.summary}
                    </span>
                    <span className="text-muted mt-auto pt-2 font-mono text-xs">
                      {project.stack.join(" · ")}
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        </FadeIn>
      )}
    </Container>
  );
}
