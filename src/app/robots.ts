import type { MetadataRoute } from "next";
import { absolute } from "@/lib/seo";

/**
 * Search engines may read every public page. The kitchen, the API, checkout,
 * order status, accounts and the style guide are private or worthless in
 * search. Preview deployments are kept out entirely so they never compete
 * with the real site.
 */
export default function robots(): MetadataRoute.Robots {
  if (process.env.VERCEL_ENV && process.env.VERCEL_ENV !== "production") {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/kitchen", "/api/", "/checkout", "/order/", "/account", "/styleguide"],
    },
    sitemap: absolute("/sitemap.xml"),
  };
}
