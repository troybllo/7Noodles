# Font provenance

Both files are subsets cut by `pnpm fonts` (scripts/subset-fonts.mjs), which
records the pinned source of each face. Anything added here must be recorded
below before it ships.

## ma-shan-zheng-subset.woff2

| | |
|---|---|
| Face | Ma Shan Zheng, by Ma Shan Zheng |
| Source | Google Fonts, pinned v18 |
| Licence | SIL Open Font License 1.1 |
| Used for | Brush lettering: the hero's 恰小面, the showcase eyebrow and the story section |

## resource-han-rounded-subset.woff2

| | |
|---|---|
| Face | Resource Han Rounded CN, Bold, by Cyano Hao |
| Source | https://github.com/CyanoHao/Resource-Han-Rounded, release v0.990, checksummed |
| Licence | SIL Open Font License 1.1. Copyright © 2018–2022 Cyano Hao; portions © 2014–2021 Adobe, with Reserved Font Name "Source" |
| Used for | Rounded 恰小面 beside the wordmark, the menu title and category names |

Chosen over M PLUS Rounded 1c, which matches the logo as closely but is a
Japanese face: it has no glyphs for simplified forms such as 单, 乐 and 汤, so
those characters were being set in the system face mid-word.

Both licences permit embedding and subsetting for commercial web use.
