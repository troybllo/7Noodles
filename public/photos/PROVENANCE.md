# Photograph provenance

## dishes/

The restaurant's own shoot, supplied by the client in `7noodle websize/`
(3456 × 5184 JPEGs, each labelled with the dish in Chinese and English).

Every photograph was checked against the menu before use — all labels were
correct. One shot was chosen per dish. Re-exported in November 2026 from the
originals at 2400 px on the long side, lightly sharpened, WebP quality 84
(the first pass, at 1200 px and quality 78, looked soft on large and retina
screens). `src/content/menu-media.ts` maps slug to file.

The skewers were only photographed as mixed platters, so the skewer section
uses platter shots (`leshan-skewers-*.webp`) captioned with what is visible,
never as a single skewer dish.

Not used:

- `DNU*` — the client's "do not use" alternates.
- `7Noodles__MG_9872–9880` — a cream dessert tray that is not on the menu.
- Drinks (iced teas, Coconut Sweetie, the fermented rice drink) — drinks are
  not on the website.

The previous interim photographs, copied from the old ordering platform, were
retired once the shoot arrived; they remain in git history.

## 7noodle websize/

The client's originals (~250 MB). Kept out of git and out of deploys — see
`.gitignore` — since only the converted `dishes/` files are served.

## story/ (November 2026)

The restaurant's own photographs, supplied by the client (originals in the
gitignored `data/photos-nov/`): the Tezza shoot of the kitchen and tables, and
the DSC shoot of the dining room and storefront. Resized to 1800px WebP; alt
text in `src/content/photos.ts`. `birthday-bowl` is cropped to leave out a pair
of chopsticks. Tezza-0714, -2376 and -3144 are not used because they show
diners eating with chopsticks, and the client asked for forks.

Update: Tezza-0714, -2376 and -3144 are now used in the home page's red
story band (`diner-at-the-table`, `noodle-pull-booth`, `noodle-pull-high`),
approved despite the chopsticks.

Update (November 2026, second batch): `bowl-held-up` (Tezza-9036) and
`wok-flame` (Tezza-6885) are the home hero, at 2400px; `noodle-slurp`
(-9977), `birthday-table` (-2047) and `wok-to-bowl` (-0103) fill the home
chapters' side columns; `the-team` (-0443) and `friends-at-the-table`
(-0803) are on Our Story; `lucky-cat-shelf` (-6928) is in the footer strip.

Update (November 2026, third pass): the home hero's left photograph is now
`noodle-pull-high` (Tezza-3144, re-exported at 2400px); `bowl-held-up` moved
into the red story band in its place.

Update (November 2026, Google Drive): five dishes come from the client's 2025
shoot on a dark wood table (`Creatives > Professional Photo`; originals in the
gitignored `data/photos-drive/`), exported the same way as the rest of
`dishes/`. Named for the dish in Drive: `pickled-pepper-pork-liver-noodles`
(泡椒猪肝拌面), `beef-skewers` (牛肉（8串）), `chicken-winglet-skewers`
(鸡中翅（2串）). Identified by appearance and awaiting the client's
confirmation: `wontons-in-chicken-soup` (DSC06519) and `ham-sausage-skewers`
(DSC06649, which could be the sweet sausage).
