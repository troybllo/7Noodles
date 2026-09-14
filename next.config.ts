import type { NextConfig } from "next";

/**
 * A Content-Security-Policy is deliberately absent until the third-party
 * origins are known (Stripe, Google Maps). It lands with the launch hardening
 * pass so it can be written once against the real set.
 */
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(self)" },
] as const;

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    // Required from Next.js 16. Without an allowlist the optimiser will encode
    // any quality a URL asks for, which is free work for anyone scripting it.
    qualities: [75, 90],
    // Only our own photography, brand assets, artwork and ornaments are optimised. Omitting
    // `search` would let arbitrary query strings mint new cached variants.
    localPatterns: [
      { pathname: "/photos/**", search: "" },
      { pathname: "/brand/**", search: "" },
      { pathname: "/artwork/**", search: "" },
      { pathname: "/ornaments/**", search: "" },
      { pathname: "/textures/**", search: "" },
    ],
  },
  async redirects() {
    // Contact became Locations when the navigation took the mockup's labels.
    return [{ source: "/contact", destination: "/locations", permanent: true }];
  },
  async headers() {
    return [{ source: "/:path*", headers: [...securityHeaders] }];
  },
};

export default nextConfig;
