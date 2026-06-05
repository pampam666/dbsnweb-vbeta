import type { NextConfig } from "next";
import { writeHtmlVerificationFile } from "./src/lib/seo/gsc-verify";
import { withSentryConfig } from "@sentry/nextjs";

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

// Sentry configuration
export default withSentryConfig(
  nextConfig,
  {
    org: process.env.SENTRY_ORG || "pt-daya-berkah-sentosa-nusanta",
    project: process.env.SENTRY_PROJECT || "javascript-nextjs",
    authToken: process.env.SENTRY_AUTH_TOKEN,
    silent: !process.env.CI,
    sourcemaps: {
      disable: process.env.NODE_ENV === "development",
    },
    // SDK options
    widenClientFileUpload: true,
    tunnelRoute: "/api/monitoring",
  }
);
