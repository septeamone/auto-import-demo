import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fully static site: plain HTML/JS goes to ./out (works on GitHub Pages)
  output: "export",
  images: { unoptimized: true },
};

export default nextConfig;
