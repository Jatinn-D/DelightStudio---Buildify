import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  experimental: {
    // Enables React's <ViewTransition> shared-element morph (product card →
    // product detail page). See node_modules/next/dist/docs/01-app/02-guides/view-transitions.md
    viewTransition: true,
  },
};

export default nextConfig;
