import { PaintedLantern } from "@/components/brand/painted-lantern";
import { PlumBranch } from "@/components/brand/plum-branch";

/** Fades the layer out toward its bottom edge, so nothing ends on a hard line. */
const FADE = "linear-gradient(to bottom, #000 62%, transparent)";

/**
 * Painted lanterns and plum blossom framing the top of a menu page.
 *
 * Two lanterns hang on the left, beside the page title and clear of the tab
 * row above it, and the branch reaches in from the right.
 *
 * The layer is confined to the page's head and faded out before the content
 * below it begins, so no heading, name or price is ever set over a blossom.
 * Lanterns only appear where the margins are wide enough to hold them clear of
 * the title; the branch stays at every width, scaled so it stays outside a
 * title held to max-w-2xl.
 *
 * Place it before the page content and give that content `relative`, so the
 * content paints above it.
 */
export function MenuOrnaments() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-0 h-[40rem] overflow-hidden"
      style={{ maskImage: FADE, WebkitMaskImage: FADE }}
    >
      <PaintedLantern
        sway={7}
        offset={1.2}
        sizes="(min-width: 1745px) 192px, 11vw"
        className="absolute top-[12rem] left-[4%] hidden w-[clamp(6rem,11vw,12rem)] md:block lg:left-[6%]"
      />
      <PaintedLantern
        mirrored
        sway={8.6}
        offset={3.4}
        sizes="(min-width: 1813px) 136px, 7.5vw"
        className="absolute top-[15rem] left-[17%] hidden w-[clamp(4.5rem,7.5vw,8.5rem)] xl:block"
      />
      <PlumBranch
        sizes="(min-width: 1724px) 448px, (min-width: 1280px) 26vw, 18vw"
        className="top-20 -right-[3%] w-[clamp(6rem,18vw,28rem)] xl:w-[clamp(7rem,26vw,28rem)]"
      />
    </div>
  );
}
