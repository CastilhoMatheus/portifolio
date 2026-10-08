import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import Container from "@/components/Container";
import FadeIn from "@/components/FadeIn";
import { getFeaturedProjects, getProject } from "@/lib/projects";

type Props = PageProps<"/projects/[slug]">;

export async function generateStaticParams() {
  const projects = await getFeaturedProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) return {};
  return { title: project.meta.title, description: project.meta.summary };
}

// The page itself never awaits params: the shell (back link + layout) is shared by
// every project and shows instantly on navigation; the URL-specific part streams in.
export default function ProjectPage({ params }: Props) {
  return (
    <Container className="py-16 sm:py-24">
      <Link
        href="/projects"
        className="text-muted hover:text-primary font-mono text-sm transition-colors"
      >
        ← All projects
      </Link>

      <Suspense fallback={<ProjectSkeleton />}>
        <ProjectDetails params={params} />
      </Suspense>
    </Container>
  );
}

async function ProjectDetails({ params }: Pick<Props, "params">) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) notFound();

  const { meta, content } = project;

  return (
    <>
      <FadeIn className="mt-5 flex flex-col items-start gap-5">
        <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl">
          {meta.title}
        </h1>
        <p className="text-muted max-w-2xl text-xl">{meta.summary}</p>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-muted mr-2 font-mono text-sm">{meta.year}</span>
          {meta.stack.map((tech) => (
            <span
              key={tech}
              className="bg-surface text-muted rounded-full px-3 py-1 font-mono text-xs"
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          {meta.live && (
            <a
              href={meta.live}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-primary text-bg rounded-full px-5 py-2 font-semibold transition-transform hover:scale-105"
            >
              Visit live site ↗
            </a>
          )}
          {meta.repo && (
            <a
              href={meta.repo}
              target="_blank"
              rel="noopener noreferrer"
              className="border-primary text-primary hover:bg-primary hover:text-bg rounded-full border-2 px-5 py-2 font-semibold transition-colors"
            >
              View code ↗
            </a>
          )}
        </div>
      </FadeIn>

      <FadeIn delay={0.1}>
        <article className="mt-14 flex max-w-2xl flex-col gap-5 text-lg leading-relaxed">
          {content}
        </article>
      </FadeIn>
    </>
  );
}

function ProjectSkeleton() {
  return (
    <div className="mt-5 flex animate-pulse flex-col gap-5" aria-hidden="true">
      <div className="bg-surface h-14 w-2/3 rounded-lg" />
      <div className="bg-surface h-6 w-1/2 rounded-lg" />
      <div className="bg-surface mt-10 h-64 max-w-2xl rounded-lg" />
    </div>
  );
}
