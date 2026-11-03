import { Inter, Lora } from "next/font/google";
import localFont from "next/font/local";

/**
 * The brand guide's type (data/brand/, page 3): Lora Bold for headings,
 * Inter Bold for subheadings, Inter for body copy, and Lora Italic as the
 * decoration face. Both are variable, so one file each covers every weight.
 */
export const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

/**
 * The guide's Chinese faces — HelloFont ID MoQu for titles, Canva's Rhyming
 * Mandarin script and HelloFont ZJ ZhuoHei for body — come with Canva for use
 * in Canva designs; putting them on a website needs a web licence from the
 * foundry. Until one is bought, the site sets Chinese in:
 *
 * Noto Sans SC for every Chinese character, from small labels to the huge
 * 恰小面 in the hero — self-hosted and cut to only the characters the site
 * sets, with the weight axis kept, so one ~63 KB file serves 400 to 900.
 * Google's own CSS for this family is ~300 unicode-range rules and a file per
 * slice. Built by scripts/subset-fonts.mjs (`pnpm fonts`).
 */
export const notoSansSc = localFont({
  src: "../../public/fonts/noto-sans-sc-subset.woff2",
  variable: "--font-noto-sans-sc",
  weight: "100 900",
  style: "normal",
  display: "swap",
});
