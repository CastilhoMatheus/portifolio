import { existsSync } from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import Image from "next/image";
import Container from "@/components/Container";
import FadeIn from "@/components/FadeIn";
import { site } from "@/content/site";
import { loadMdx } from "@/lib/mdx";

type AboutFrontmatter = {
  title: string;
  lead: string;
  supports: string;
};

export const metadata: Metadata = {
  title: "About",
  description: `About ${site.name} — ${site.role} in ${site.location}.`,
};

// Only show the photo / CV once the files exist in /public
const publicFileExists = (url: string) =>
  existsSync(path.join(process.cwd(), "public", url));

export default async function AboutPage() {
  const { content, frontmatter } = await loadMdx<AboutFrontmatter>("about.mdx");
  const hasAvatar = publicFileExists(site.avatar);
  const hasResume = publicFileExists(site.resumeUrl);

  const facts = [
    { label: "Based in", value: site.location.split(" · ")[0] },
    { label: "Role", value: site.role },
    { label: "Status", value: site.status },
    { label: "Supports", value: `${frontmatter.supports} 🐷` },
  ];

  return (
    <Container className="py-16 sm:py-24">
      <FadeIn className="flex flex-col items-start gap-4">
        <span className="bg-surface text-muted rounded-full px-3 py-1 font-mono text-sm">
          About
        </span>
        <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl">
          {frontmatter.title}
        </h1>
        <p className="text-muted max-w-2xl text-xl">{frontmatter.lead}</p>
      </FadeIn>

      <div className="mt-14 grid gap-14 md:grid-cols-[1fr_17rem]">
        <FadeIn delay={0.1}>
          <article className="flex max-w-2xl flex-col gap-5 text-lg leading-relaxed">
            {content}
          </article>
        </FadeIn>

        <FadeIn delay={0.2}>
          <aside className="bg-surface flex flex-col gap-6 rounded-2xl p-6 md:sticky md:top-8">
            {hasAvatar ? (
              <Image
                src={site.avatar}
                alt={site.name}
                width={480}
                height={480}
                className="aspect-square w-full rounded-xl object-cover"
              />
            ) : (
              <div className="bg-primary text-bg grid aspect-square w-full place-items-center rounded-xl text-6xl font-bold tracking-tight">
                {site.shortName[0]}
                {site.lastName[0]}
              </div>
            )}

            <dl className="flex flex-col gap-3 text-sm">
              {facts.map((fact) => (
                <div key={fact.label}>
                  <dt className="text-muted font-mono text-xs uppercase">
                    {fact.label}
                  </dt>
                  <dd className="font-medium">{fact.value}</dd>
                </div>
              ))}
            </dl>

            <ul className="flex flex-wrap gap-2">
              {site.skills.map((skill) => (
                <li
                  key={skill}
                  className="bg-bg text-muted rounded-full px-3 py-1 font-mono text-xs"
                >
                  {skill}
                </li>
              ))}
            </ul>

            {hasResume && (
              <a
                href={site.resumeUrl}
                className="bg-primary text-bg rounded-full px-4 py-2 text-center font-semibold transition-transform hover:scale-105"
              >
                Download CV
              </a>
            )}
          </aside>
        </FadeIn>
      </div>
    </Container>
  );
}
