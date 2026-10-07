import Container from "@/components/Container";
import { site } from "@/content/site";

export default function Home() {
  return (
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
  );
}
