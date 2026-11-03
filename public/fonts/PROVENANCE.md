# Font provenance

## noto-sans-sc-subset.woff2

Noto Sans SC (variable, weights 100–900), SIL Open Font License 1.1, from the
google/fonts repository (`ofl/notosanssc/NotoSansSC[wght].ttf`), checksummed in
`scripts/subset-fonts.mjs`.

Cut down to only the Chinese characters the site sets — collected from `src/`
and `data/menu.json` by the script, listed in `noto-sans-sc-subset.glyphs.txt`
— with the weight axis kept, so one ~63 KB file serves every weight. Re-run
`pnpm fonts` after adding Chinese copy; `src/app/fonts.test.ts` fails until you
do.

Latin text is set in Inter Tight, served through next/font.
