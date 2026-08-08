import type { MetadataRoute } from "next";

// Required for static export -- see
// https://nextjs.org/docs/advanced-features/static-html-export
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://nityagati.com/sitemap.xml",
  };
}
