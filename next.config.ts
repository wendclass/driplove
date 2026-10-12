import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  outputFileTracingRoot: path.resolve(__dirname),
  devIndicators: false,
  allowedDevOrigins: [
    "localhost",
    "localhost:3000",
    "192.168.0.101",
    "192.168.0.101:3000",
    "0.0.0.0",
    "0.0.0.0:3000",
  ],
};

export default nextConfig;
