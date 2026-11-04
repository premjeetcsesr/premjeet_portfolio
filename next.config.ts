import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  reactStrictMode: true,
  transpilePackages: ["three"],
  allowedDevOrigins: ["192.168.137.1", "localhost"],
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
