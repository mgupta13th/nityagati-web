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
};

export default nextConfig;
