import type { NextConfig } from "next";

// Static export: produces plain HTML/CSS/JS in `out/`, no Node.js server
// required at runtime. `images.unoptimized` is required alongside
// `output: "export"` because the built-in image optimization endpoint
// does not exist in a statically exported build.
const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  // The floating dev-tools indicator (route/build info button) is a
  // next dev-only overlay, never present in the static export -- disabled
  // here so it doesn't appear during local preview either.
  devIndicators: false,
};

export default nextConfig;
