import type { NextConfig } from "next";
import { writeHtmlVerificationFile } from "./src/lib/seo/gsc-verify";

// Trigger HTML verification file creation
writeHtmlVerificationFile();

const nextConfig: NextConfig = {
  typescript: {
    // Run tsc separately; skip during Turbopack build to avoid OOM on Windows
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
  allowedDevOrigins: [
    "lvh.me",
    "pju.lvh.me",
    "solarcell.lvh.me",
    "alatpetir.lvh.me",
    "baterai.lvh.me",
    "dashboard.lvh.me",
    "unknown.lvh.me",
  ],
};

export default nextConfig;
