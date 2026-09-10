import { Archivo } from "next/font/google";

/**
 * Archivo carries both a weight and a width axis, which is what lets the
 * monumental wordmark sit at Black/Expanded while body copy uses the same
 * family at normal width. One family, no second download.
 */
export const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
});

/**
 * Chinese text is served from the reader's system face for now. A full CJK
 * webfont is several megabytes, and the alternative — subsetting to the exact
 * glyphs we ship — is only safe once the Chinese copy is final. The dish names
 * in data/menu-source.json already give us that glyph set; the subset build
 * lands with the translation pass.
 *
 * The 恰小面 wordmark is drawn as SVG so the brand mark never depends on
 * whichever face the reader happens to have.
 */
export const CJK_STACK =
  '"PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Source Han Sans SC", "Noto Sans SC", sans-serif';
