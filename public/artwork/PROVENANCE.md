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

Attribution is not required by CC0, but the record is kept because knowing
what the artwork is matters more than the licence does.
