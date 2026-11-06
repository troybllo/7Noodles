import { Inter } from "next/font/google";
import localFont from "next/font/local";

/** Oilvare Base, the brand's display face: headings, the hero, section titles. One weight. */
export const oilvare = localFont({
  src: "../../public/fonts/oilvare-base.woff2",
  variable: "--font-oilvare",
  weight: "400",
  display: "swap",
});

/** Inter for everything that is read rather than seen: body copy, labels, forms. */
export const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

/**
 * Noto Sans SC for every Chinese character, cut to only the characters the
 * site sets (`pnpm fonts`). The brand guide's Chinese faces are licensed for
 * Canva only.
 */
export const notoSansSc = localFont({
  src: "../../public/fonts/noto-sans-sc-subset.woff2",
  variable: "--font-noto-sans-sc",
  weight: "100 900",
  style: "normal",
  display: "swap",
});
