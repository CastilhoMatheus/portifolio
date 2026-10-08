import { readFile } from "node:fs/promises";
import path from "node:path";
import { cacheLife } from "next/cache";
import { compileMDX } from "next-mdx-remote/rsc";
import { mdxComponents } from "@/components/mdx/mdx-components";

/**
 * Compile an MDX file from /content into React, plus its typed frontmatter.
 * Cached: files only change when you redeploy, so this runs once at build.
 */
export async function loadMdx<TFrontmatter>(relativePath: string) {
  "use cache";
  cacheLife("max");

  const source = await readFile(
    path.join(process.cwd(), "content", relativePath),
    "utf8",
  );

  return compileMDX<TFrontmatter>({
    source,
    components: mdxComponents,
    options: { parseFrontmatter: true },
  });
}
