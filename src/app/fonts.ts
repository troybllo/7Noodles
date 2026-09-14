import { Archivo, Quicksand } from "next/font/google";
import localFont from "next/font/local";

/**
 * Archivo carries both a weight and a width axis, which is what lets display
 * type sit at Black/Expanded while body copy uses the same family at normal
 * width. One family, no second download.
 */
export const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
});

/**
 * Brush calligraphy, for the restaurant's name and section marks.
 *
 * Self-hosted and cut down to only the characters the site sets — 3.8 KB from
 * a 5.6 MB original. See scripts/subset-fonts.mjs; add characters there and
 * re-run `pnpm fonts` before setting anything new in this face.
 *
 * `display: block` rather than swap: this face carries the brand mark, and a
 * flash of the fallback sans in its place is worse than a beat of nothing.
 * At 3.8 KB the block period is imperceptible.
 */
export const maShanZheng = localFont({
  src: "../../public/fonts/ma-shan-zheng-subset.woff2",
  variable: "--font-brush-face",
  display: "block",
  weight: "400",
  style: "normal",
});

/**
 * The wordmark face. The client's logo sets SEVEN NOODLES in a wide, rounded
 * geometric sans; Quicksand was the closest free match when set against it,
 * with the same soft terminals and near-circular O. It does not reproduce the
 * logo's rounded E, which appears to be custom lettering.
 */
export const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
  display: "swap",
});

/**
 * Rounded Chinese, for 恰小面 where it sits beside the Quicksand wordmark, and
 * for the menu's titles. The brush face reads as a different brand next to it.
 * Subset to the glyphs the site sets; add characters in
 * scripts/subset-fonts.mjs first, which refuses any the face lacks.
 */
export const hanRounded = localFont({
  src: "../../public/fonts/resource-han-rounded-subset.woff2",
  variable: "--font-round-cjk-face",
  display: "block",
  weight: "700",
  style: "normal",
});

/**
 * Chinese body text is served from the reader's system face until the
 * translation pass, when the same subsetting pipeline will cut a proper one.
 */
export const CJK_STACK =
  '"PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Source Han Sans SC", "Noto Sans SC", sans-serif';
