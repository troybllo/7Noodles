# Texture provenance

Everything in this directory is produced by `pnpm textures`
(scripts/generate-textures.mjs). Regenerate rather than edit.

## paper-red.webp, paper-cream.webp, paper-ink.webp

| | |
|---|---|
| Source | Paper003, a scanned sheet of creased paper, by ambientCG |
| Asset page | https://ambientcg.com/view?id=Paper003 |
| File used | `Paper003_2K-JPG_NormalGL.jpg` from `Paper003_2K-JPG.zip`, pinned by SHA-256 in the script |
| Licence | CC0 1.0 Universal (public domain), per https://docs.ambientcg.com/license/. Unrestricted commercial use, no attribution required. |

Only the normal map is used. Each paper is the site's own colour lit through
the scanned creases from the upper left, with seeded fibre grain and, on the
red, a few pale flecks laid over it. Seamless 1200px tiles.

## print-speckle.webp, chili-slice-a/b/c.webp

Drawn from seeded noise by the same script and owned outright. The speckle is
a 384px tile mask that wears display type like old print; the slices are
painted chilli rings with a transparent ground. Nothing is traced from or
derived from the reference images.
