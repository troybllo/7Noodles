"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/**
 * Renders the customer site's chrome — navigation, footer, cart — everywhere
 * except the kitchen board, which is a working screen on a tablet, not a page
 * of the website.
 */
export function SiteOnly({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return pathname.startsWith("/kitchen") ? null : children;
}
