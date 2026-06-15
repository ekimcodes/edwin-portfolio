import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root so Next doesn't pick up an unrelated lockfile
  // in the parent home directory.
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
