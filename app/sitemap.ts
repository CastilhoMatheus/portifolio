import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { getFeaturedProjects } from "@/lib/projects";

/** castilho.dev/sitemap.xml: every page Google should know about. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = ["", "/about", "/projects", "/lab", "/contact"].map(
    (route) => ({
      url: `${site.url}${route}`,
      changeFrequency: "monthly" as const,
      priority: route === "" ? 1 : 0.8,
    }),
  );

  const projects = (await getFeaturedProjects()).map((project) => ({
    url: `${site.url}/projects/${project.slug}`,
    changeFrequency: "yearly" as const,
    priority: 0.6,
  }));

  return [...pages, ...projects];
}
