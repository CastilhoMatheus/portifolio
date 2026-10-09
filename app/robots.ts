import type { MetadataRoute } from "next";
import { site } from "@/content/site";

/** castilho.dev/robots.txt: let every crawler in and point them at the sitemap. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
