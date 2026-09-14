import { PhotoSlot } from "@/components/media/photo-slot";
import { parseHex } from "@/lib/contrast";
import { PALETTE } from "@/design/palette";

/**
 * The palette, set as a brand-book spread.
 *
 * Every value is read from src/design/palette.ts, so the band cannot drift
 * from the tokens the site actually ships. Since the handmade redesign the
 * landing page is black, white and red, so these are those colours: cream
 * (白), ink (墨), cream paper (纸), and the two reds of the chilli paper.
 *
 * The code lines stay at the large-text threshold, a size that reads as a
 * brand book rather than fine print.
 */

const SWATCHES = PALETTE.flatMap((group) => group.swatches);

function swatch(token: string) {
  const found = SWATCHES.find((s) => s.token === token);
  if (!found) throw new Error(`Palette mosaic references unknown token: ${token}`);
  return found;
}

/** Nominal conversion for display. Real CMYK depends on an output profile. */
function nominalCmyk(hex: string) {
  const { r, g, b } = parseHex(hex);
  const [rn, gn, bn] = [r / 255, g / 255, b / 255];
  const k = 1 - Math.max(rn, gn, bn);
  if (k === 1) return { c: 0, m: 0, y: 0, k: 100 };
  const to = (v: number) => Math.round(((1 - v - k) / (1 - k)) * 100);
  return { c: to(rn), m: to(gn), y: to(bn), k: Math.round(k * 100) };
}

type BlockProps = {
  token: string;
  /** Set large; this is the block's title. */
  name?: string;
  /** Text tone that clears its ground. */
  tone: "ink" | "rice";
  className?: string;
};

function Block({ token, name, tone, className }: BlockProps) {
  const { hex } = swatch(token);
  const { r, g, b } = parseHex(hex);
  const { c, m, y, k } = nominalCmyk(hex);
  const text = tone === "ink" ? "text-ink-deep" : "text-rice";

  return (
    <div
      className={`flex flex-col justify-between p-5 md:p-7 ${text} ${className ?? ""}`}
      style={{ backgroundColor: hex }}
    >
      {name ? (
        <p lang="zh" className="font-brush text-[clamp(2rem,3.2vw,3.5rem)] leading-none">
          {name}
        </p>
      ) : (
        <span />
      )}

      {/* Typewritten, like the values in a printed colour book. */}
      <dl className="mt-4 flex flex-col gap-0.5 font-mono text-[1.1rem] leading-snug md:mt-6">
        {/* Phones show the hex alone; the full breakdown needs the width. */}
        <div className="hidden gap-2 md:flex">
          <dt className="sr-only">RGB</dt>
          <dd>
            R:{r} G:{g} B:{b}
          </dd>
        </div>
        <div className="hidden gap-2 md:flex">
          <dt className="sr-only">CMYK, nominal</dt>
          <dd>
            C:{c} M:{m} Y:{y} K:{k}
          </dd>
        </div>
        <div className="flex gap-2">
          <dt className="sr-only">Hex</dt>
          <dd>{hex.replace("#", "").toUpperCase()}</dd>
        </div>
      </dl>
    </div>
  );
}

/**
 * Four columns by three rows, the last row shorter: cream and ink tall in the
 * first two rows with photographs between them, then cream paper, deep red and
 * a wide red closing the bottom right. Deliberately uneven — a palette laid on
 * an even grid reads as a swatch chart rather than a spread.
 */
export function PaletteMosaic() {
  return (
    <section
      aria-label="Colour palette"
      data-nav-theme="light"
      className="grid w-full grid-cols-2 md:h-[78svh] md:grid-cols-4 md:grid-rows-[1fr_1fr_0.6fr]"
    >
      <Block
        token="cream"
        name="白"
        tone="ink"
        className="md:col-start-1 md:row-span-2 md:row-start-1 md:pt-28"
      />

      <div className="hidden md:col-start-2 md:row-span-2 md:row-start-1 md:block">
        <PhotoSlot label="Roofline from above, rain, red umbrella" tone="bg-ink-soft" />
      </div>

      <Block
        token="ink"
        name="墨"
        tone="rice"
        className="md:col-start-3 md:row-span-2 md:row-start-1 md:pt-28"
      />

      <div className="hidden md:col-start-4 md:row-span-2 md:row-start-1 md:block">
        <PhotoSlot label="Room at night, warm slats, banquette" tone="bg-ink" />
      </div>

      <Block
        token="cream-paper"
        name="纸"
        tone="ink"
        className="md:col-start-1 md:row-start-3"
      />

      <Block token="chili-deep" tone="rice" className="md:col-start-2 md:row-start-3" />

      <Block
        token="chili"
        name="红"
        tone="rice"
        className="col-span-2 md:col-span-2 md:col-start-3 md:row-start-3"
      />
    </section>
  );
}
