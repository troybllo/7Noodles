import { HangingLantern } from "@/components/brand/hanging-lantern";
import { PlumBranch } from "@/components/brand/plum-branch";

/** Fades the layer out toward its bottom edge, so nothing ends on a hard line. */
const FADE = "linear-gradient(to bottom, #000 62%, transparent)";

/**
 * Lanterns and plum blossom framing the top of a menu page.
 *
 * Lanterns hang on the left and the branch reaches in from the right, on both
 * grounds. The lanterns keep to the left because their threads run up behind
 * the navigation bar, and only the small logo sits there. On rice they hang
 * unlit, where a glow would only muddy the paper.
 *
 * The layer is confined to the page's head and faded out before the dishes
 * begin, so no name or price is ever set over a blossom. Lanterns only appear
 * where the margins are wide enough to hold them clear of the title; the
 * branch stays at every width, scaled so it stays outside a title held to
 * max-w-2xl.
 *
 * Place it before the page content and give that content `relative`, so the
 * content paints above it.
 */
export function MenuOrnaments({ tone }: { tone: "dark" | "rice" }) {
  const lit = tone === "dark";

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-x-0 top-0 overflow-hidden ${lit ? "h-[46rem]" : "h-[30rem]"}`}
      style={{ maskImage: FADE, WebkitMaskImage: FADE }}
    >
      <HangingLantern
        variant="a"
        glow={lit}
        width="clamp(5rem, 9vw, 10rem)"
        drop="clamp(3.5rem, 7vw, 6.5rem)"
        sizes="(min-width: 1780px) 160px, 9vw"
        sway={7}
        offset={1.2}
        className="left-[5%] hidden md:block lg:left-[7%]"
      />
      <HangingLantern
        variant="b"
        glow={lit}
        width="clamp(4rem, 7vw, 8rem)"
        drop="clamp(6rem, 12vw, 11rem)"
        sizes="(min-width: 1830px) 128px, 7vw"
        sway={8.6}
        offset={3.4}
        className="left-[16%] hidden lg:block"
      />
      <PlumBranch
        sizes="(min-width: 1724px) 448px, (min-width: 1280px) 26vw, 18vw"
        className={`top-20 -right-[3%] w-[clamp(6rem,18vw,28rem)] xl:w-[clamp(7rem,26vw,28rem)] ${lit ? "opacity-90" : ""}`}
      />
    </div>
  );
}
