import Link from "next/link";
import Container from "@/components/Container";
import ProjectIndex from "@/components/ProjectIndex";
import { site } from "@/content/site";
import { getFeaturedProjects } from "@/lib/projects";

export default async function Home() {
  const featured = await getFeaturedProjects();

  return (
    <>
      <section className="py-24 sm:py-32">
        <Container className="flex flex-col items-start gap-6">
          <span className="bg-surface text-muted inline-flex items-center gap-2 rounded-full px-3 py-1 font-mono text-sm">
            <span className="bg-primary size-2 animate-pulse rounded-full" />
            {site.status}
          </span>

          <h1 className="text-5xl font-bold tracking-tight sm:text-7xl">
            Hi, I&apos;m <span className="text-primary">{site.shortName}</span>.
          </h1>

          <p className="text-muted max-w-xl text-xl sm:text-2xl">
            {site.tagline}
          </p>

          <p className="text-muted font-mono text-sm">
            {site.role} · {site.location}
          </p>
        </Container>
      </section>

      <section className="pb-24">
        <Container>
          <div className="mb-6 flex items-baseline justify-between gap-4">
            <h2 className="text-muted font-mono text-sm uppercase">
              Selected work
            </h2>
            <Link
              href="/projects"
              className="text-muted hover:text-primary font-mono text-sm transition-colors"
            >
              All projects →
            </Link>
          </div>
          <ProjectIndex projects={featured} />
        </Container>
      </section>
    </>
  );
}
