import type { MetadataRoute } from "next";
import { getCategories } from "@/lib/menu";
import { absolute } from "@/lib/seo";

/**
 * Every page worth finding in search: the public pages, the menu and each of
 * its categories and dishes. Ordering, checkout, account, kitchen and the
 * style guide are left out (and blocked in robots.ts).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const pages: MetadataRoute.Sitemap = [
    { url: absolute("/"), changeFrequency: "weekly", priority: 1 },
    { url: absolute("/menu"), changeFrequency: "weekly", priority: 0.9 },
    { url: absolute("/order"), changeFrequency: "weekly", priority: 0.8 },
    { url: absolute("/locations"), changeFrequency: "monthly", priority: 0.8 },
    { url: absolute("/about"), changeFrequency: "monthly", priority: 0.6 },
    { url: absolute("/events"), changeFrequency: "weekly", priority: 0.6 },
    { url: absolute("/privacy"), changeFrequency: "yearly", priority: 0.1 },
    { url: absolute("/terms"), changeFrequency: "yearly", priority: 0.1 },
  ];

  const menu = getCategories().flatMap((category) => [
    {
      url: absolute(`/menu/${category.slug}`),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    ...category.items.map((item) => ({
      url: absolute(`/menu/${category.slug}/${item.slug}`),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ]);

  return [...pages, ...menu];
}
