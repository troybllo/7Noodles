"use client";

import dynamic from "next/dynamic";
import { useMediaQuery } from "@/lib/use-media-query";

const MarginDrawings = dynamic(
  () => import("./margin-drawings").then((module) => module.MarginDrawings),
  { ssr: false },
);

/**
 * The menu's side-margin drawings, one per category. Only screens wide enough
 * to hold them (1640px+) ever download them. Mount as the first child of a
 * `relative` main whose content sits above it (`relative z-10`).
 */
export function MenuMargins({ category }: { category?: string }) {
  const wide = useMediaQuery("(min-width: 1640px)", false);
  return wide ? <MarginDrawings {...(category ? { category } : {})} /> : null;
}
