# Photograph provenance

## dishes/

The restaurant's own shoot, supplied by the client in `7noodle websize/`
(3456 × 5184 JPEGs, each labelled with the dish in Chinese and English).

Every photograph was checked against the menu before use — all labels were
correct. One shot was chosen per dish, resized to 1200 px wide and converted
to WebP (quality 78), about 95 KB each. The source file for each is recorded in
the commit that added it, and `src/content/menu-media.ts` maps slug to file.

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
