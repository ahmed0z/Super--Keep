import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export disabled for now - dynamic routes need client-side routing
  // To enable static export, implement generateStaticParams in dynamic routes
  // output: 'export',
  images: {
    unoptimized: true, // Required for static export
  },
  reactCompiler: true,
};

export default nextConfig;
