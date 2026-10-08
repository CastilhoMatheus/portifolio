import { readdirSync, statSync } from "node:fs";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { cacheLife } from "next/cache";
import { loadMdx } from "@/lib/mdx";

/** Frontmatter at the top of every content/projects/*.mdx file. */
export type ProjectFrontmatter = {
  title: string;
  summary: string;
  year: number;
  stack: string[];
  repo?: string;
  live?: string;
  /** Featured projects get their own page and appear in the index; others go to "Also built". */
  featured: boolean;
  /** Lower comes first. */
  order: number;
};

export type Project = ProjectFrontmatter & { slug: string };

const PROJECTS_DIR = path.join(process.cwd(), "content", "projects");

/** All projects, sorted by `order`. Only reads frontmatter, so it's cheap. */
export async function getProjects(): Promise<Project[]> {
  // Every file's name + modified time is part of the cache key, so adding,
  // removing or editing a project invalidates the cached list.
  const version = readdirSync(PROJECTS_DIR)
    .map((f) => `${f}:${statSync(path.join(PROJECTS_DIR, f)).mtimeMs}`)
    .join("|");
  return readProjects(version);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function readProjects(version: string): Promise<Project[]> {
  "use cache";
  cacheLife("max");

  const files = (await readdir(PROJECTS_DIR)).filter((f) => f.endsWith(".mdx"));

  const projects = await Promise.all(
    files.map(async (file) => {
      const raw = await readFile(path.join(PROJECTS_DIR, file), "utf8");
      const data = matter(raw).data as ProjectFrontmatter;
      return { ...data, slug: file.replace(/\.mdx$/, "") };
    }),
  );

  return projects.sort((a, b) => a.order - b.order);
}

export async function getFeaturedProjects() {
  return (await getProjects()).filter((p) => p.featured);
}

/** One featured project with its compiled MDX body, or null if the slug isn't a featured project. */
export async function getProject(slug: string) {
  const meta = (await getFeaturedProjects()).find((p) => p.slug === slug);
  if (!meta) return null;

  const { content } = await loadMdx<ProjectFrontmatter>(`projects/${slug}.mdx`);
  return { meta, content };
}
