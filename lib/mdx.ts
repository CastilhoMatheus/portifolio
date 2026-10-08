import { statSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { cacheLife } from "next/cache";
import { compileMDX } from "next-mdx-remote/rsc";
import { mdxComponents } from "@/components/mdx/mdx-components";

const CONTENT_DIR = path.join(process.cwd(), "content");

/**
 * Compile an MDX file from /content into React, plus its typed frontmatter.
 * The file's modified time is part of the cache key, so editing the file
 * (e.g. while `npm run dev` is running) gives a fresh result instead of a stale one.
 */
export async function loadMdx<TFrontmatter>(relativePath: string) {
  const version = statSync(path.join(CONTENT_DIR, relativePath)).mtimeMs;
  return compileMdxFile<TFrontmatter>(relativePath, version);
}

async function compileMdxFile<TFrontmatter>(
  relativePath: string,
  // Only used as part of the cache key
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  version: number,
) {
  "use cache";
  cacheLife("max");

  const source = await readFile(path.join(CONTENT_DIR, relativePath), "utf8");

  return compileMDX<TFrontmatter>({
    source,
    components: mdxComponents,
    options: { parseFrontmatter: true },
  });
}
