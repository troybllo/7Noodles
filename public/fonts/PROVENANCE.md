# Font provenance

## oilvare-base.woff2

Oilvare Base (one weight), the brand guide's display face. Supplied by the
client from an OnlineWebFonts.com download (archived, with its licence note,
in `data/brand/fonts/`). That site redistributes fonts whose web-embedding
rights vary: **confirm a commercial web licence for Oilvare before launch.**

## noto-sans-sc-subset.woff2

Noto Sans SC (variable, weights 100–900), SIL Open Font License 1.1, from the
google/fonts repository (`ofl/notosanssc/NotoSansSC[wght].ttf`), checksummed in
`scripts/subset-fonts.mjs`. Cut to only the Chinese characters the site sets,
listed in `noto-sans-sc-subset.glyphs.txt`. Re-run `pnpm fonts` after adding
Chinese copy; `src/app/fonts.test.ts` fails until you do.

## Inter

Body text, served through next/font/google (SIL Open Font License 1.1).
