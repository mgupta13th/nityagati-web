import type { MetadataRoute } from "next";

// Required for static export -- see
// https://nextjs.org/docs/advanced-features/static-html-export
export const dynamic = "force-static";

const BASE_URL = "https://nityagati.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/about", "/products", "/contact", "/privacy", "/terms"];

  return routes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
  }));
}
