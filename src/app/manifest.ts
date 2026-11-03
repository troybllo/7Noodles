import type { MetadataRoute } from "next";

/**
 * Lets the kitchen board be added to a phone's or tablet's home screen, which
 * iPhones require before they will deliver push notifications.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Seven Noodles Kitchen",
    short_name: "7N Kitchen",
    start_url: "/kitchen",
    display: "standalone",
    background_color: "#862218",
    theme_color: "#862218",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
