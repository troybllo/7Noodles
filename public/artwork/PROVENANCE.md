# Artwork provenance

Every image in this directory is used under a licence that permits commercial
use. Anything added here must be recorded below before it ships.

## soga-nichokuan-dragon-ink.webp

| | |
|---|---|
| Title | Dragon |
| Artist | Soga Nichokuan (Japanese) |
| Date | Early to mid-1600s |
| Period | Edo period (1615–1868) |
| Medium | Six-panel folding screen; ink, slight colour, gold and silver on paper |
| Source | The Cleveland Museum of Art, Leonard C. Hanna Jr. Fund |
| Accession | 1985.134.1 |
| Object page | https://clevelandart.org/art/1985.134.1 |
| Licence | CC0 1.0 Universal, via the museum's Open Access programme, verified on the object's own record (`share_license_status: CC0`). Unrestricted commercial use, no attribution required. |

Retrieved from the museum's open access API as the 3400 x 1571 print image. The
33654 x 15546 master TIFF exists but is not suitable for the web.

Processing, so the painting can act as a tintable ink layer rather than a
photograph of a screen:

1. Cropped the brocade mount from all four sides and resized to 2000 px wide.
2. Converted to greyscale. Softened the five panel seams with a horizontal
   median across a 12 px band at each seam (columns 316, 659, 1003, 1346 and
   1689), which leaves the vertical ink drips either side untouched. Then a
   5 x 5 median over the whole image to soften paper texture.
3. Mapped ink to opacity (levels 22%–50%, inverted): dark ink opaque, and the
   paper, which sits between 50% and 62% grey, fully transparent. The dragon
   is painted in reserve — its body is unpainted paper — so it becomes
   negative space within the ink clouds.
4. Multiplied that alpha by a feathered rectangle (inset 140 x 90 px, blurred
   by 70 px), so the ink fades out at every edge instead of stopping at the
   image boundary.
5. Solid black with that alpha, WebP at quality 70 (125 KB).

Used as a CSS mask filled with a token colour: black paint on the rice pages,
pale ink on the dark overview.

## zhang-ruoai-plum-blossoms.webp

| | |
|---|---|
| Title | Desk Album: Flower and Bird Paintings (Bird with Plum Blossoms) |
| Artist | Zhang Ruoai (Chinese, 1713–1746) |
| Date | 1700s |
| Period | Qing dynasty (1644–1911) |
| Medium | Album leaf; ink and colour on paper |
| Source | The Cleveland Museum of Art, Anonymous Gift |
| Accession | 1967.193.j |
| Object page | https://clevelandart.org/art/1967.193.j |
| Licence | CC0 1.0 Universal, verified on the object's own record (`share_license_status: CC0`). Unrestricted commercial use, no attribution required. |

Retrieved as the 3400 x 2438 print image. Only the right-hand branch is used;
the bird and the left leaf are not.

Processing, so the branch can sit on either ground as a cut-out:

1. Cropped to the right-hand branch (x 1751–3290, y 110–2360), clear of the
   bird, the mount and the album fold.
2. Estimated the paper colour across the leaf, so stains and uneven toning are
   measured against their own surroundings rather than one average.
3. Separated the painting from the paper by colour relative to that estimate:
   branches are darker than the paper; blossoms are pinker or bluer, and their
   open petals lighter. Small enclosed gaps inside blossoms were filled and
   isolated specks of paper texture dropped.
4. Deepened the branch browns slightly, and **recoloured the blossoms** from the
   original pale pink to the site's red, keeping each blossom's own light and
   shade. The painted stamens, calyxes and moss dots keep their colours.
5. Feathered the edges the crop cuts through, resized to 1000 px wide, WebP at
   quality 82 with alpha (254 KB).

The recolouring is a deliberate change to the artwork, recorded here so the
image is never presented as the painting as Zhang Ruoai left it.

## nichokuan-tiger-ink.webp

| | |
|---|---|
| Title | Tiger (the companion screen to the Dragon above) |
| Artist | Soga Nichokuan (Japanese) |
| Date | Early to mid-1600s |
| Medium | Six-panel folding screen; ink, slight colour, gold and silver on paper |
| Source | The Cleveland Museum of Art, Leonard C. Hanna Jr. Fund |
| Accession | 1985.134.2 |
| Object page | https://clevelandart.org/art/1985.134.2 |
| Licence | CC0 1.0 Universal, verified on the object's own record (`share_license_status: CC0`). |

Retrieved as the 3400 x 1537 print image. Processing:

1. Cropped to the tiger (x 1790–3010, y 360–1250), clear of the bamboo.
2. Softened the panel seams with a horizontal median, as for the dragon.
3. Estimated the paper by a large grey closing and blur, and mapped how much
   darker than its paper each pixel is to opacity, so the brushwork — stripes,
   spots, fur and outline — becomes the image and the paper and washes drop
   out.
4. Dropped specks under 18 px; cleared a remnant of a panel seam above the
   back, a bamboo leaf at the bottom right and a mark at the left edge.
5. Feathered the crop edges, resized to 1200 px wide, WebP at quality 70.

Used as a mask filled with the site's red, so it reads as a tiger drawn in red
brush.

## nichokuan-dragon-head-ink.webp

From the same Dragon screen (1985.134.1) as `soga-nichokuan-dragon-ink.webp`,
processed separately for use at full strength:

1. Cropped to the head, claws and the clouds around them (x 1990–3320,
   y 250–1450 of the 3400 px print).
2. Softened the panel seams and applied a 3 x 3 median.
3. Mapped darkness to opacity with a strong curve (14th to 62nd percentile,
   power 0.8), so the ink clouds read as solid black and the dragon, painted
   in reserve, as the paper colour showing through.
4. Added seeded ink flecks thrown to the upper right. These are drawn for the
   site and are not part of the painting.
5. Removed the artist's signature and seal from the bottom right of the crop,
   feathered the edges, resized to 1000 px wide, WebP at quality 55.

Used as black ink over red paper.

Attribution is not required by CC0, but the record is kept because knowing
what the artwork is matters more than the licence does.
