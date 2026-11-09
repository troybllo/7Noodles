import type { NextConfig } from "next";
import menu from "./data/menu.json";
import { menuSchema } from "./src/lib/menu-schema";

/**
 * The menu is checked here, once, when the site builds or the dev server
 * starts: a malformed price, a duplicated slug or a missing field fails the
 * build. The site itself reads the JSON without re-checking it, so the
 * validator never ships to the browser (see src/lib/menu-schema.ts).
 */
const checked = menuSchema.safeParse(menu);
if (!checked.success) {
  const issues = checked.error.issues
    .map((issue) => `  ${issue.path.join(".")}: ${issue.message}`)
    .join("\n");
  throw new Error(`data/menu.json is invalid:\n${issues}`);
}

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
      { pathname: "/scenery/**", search: "" },
    ],
  },
  async redirects() {
    // Contact became Locations when the navigation took the mockup's labels.
    return [
      { source: "/contact", destination: "/locations", permanent: true },
      // Sustainability became Events at the client's request.
      { source: "/sustainability", destination: "/events", permanent: true },
    ];
  },
  async headers() {
    return [{ source: "/:path*", headers: [...securityHeaders] }];
  },
};

export default nextConfig;
