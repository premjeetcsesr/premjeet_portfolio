import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  reactStrictMode: true,
  transpilePackages: ["three"],
  allowedDevOrigins: ["192.168.137.1", "localhost"],
};

export default nextConfig;
