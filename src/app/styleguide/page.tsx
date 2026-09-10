import type { Metadata } from "next";
import { contrastLevel, contrastRatio } from "@/lib/contrast";
import { GROUND_HEX, PALETTE, type Ground, type Swatch } from "@/design/palette";

export const metadata: Metadata = {
  title: "Style guide",
  robots: { index: false, follow: false },
};

const GROUNDS: Ground[] = ["rice", "ink"];

function Ratio({ hex, ground }: { hex: string; ground: Ground }) {
  const ratio = contrastRatio(hex, GROUND_HEX[ground]);
  const level = contrastLevel(ratio);
  const failing = level === "Fail" || level === "AA Large";

  return (
    <span className="flex items-baseline justify-between gap-2 tabular-nums">
      <span className="text-agar-text">on {ground}</span>
      <span className={failing ? "text-agar-text" : "text-ink font-medium"}>
        {ratio.toFixed(2)} · {level}
      </span>
    </span>
  );
}

function SwatchCard({ swatch }: { swatch: Swatch }) {
  return (
    <div className="border-paper flex flex-col border">
      <div className="h-24 w-full" style={{ backgroundColor: swatch.hex }} />
      <div className="flex flex-1 flex-col gap-2 p-3">
        <div>
          <p className="flex items-baseline gap-2 text-sm font-medium">
            <code>{swatch.token}</code>
            {swatch.chinese ? (
              <span lang="zh" className="text-peach-text">
                {swatch.chinese}
              </span>
            ) : null}
          </p>
          <p className="text-agar-text text-xs tracking-wide uppercase">{swatch.hex}</p>
        </div>
        <p className="text-agar-text flex-1 text-xs leading-relaxed">{swatch.usage}</p>
        <div className="flex flex-col gap-0.5 text-xs">
          {GROUNDS.map((ground) => (
            <Ratio key={ground} hex={swatch.hex} ground={ground} />
          ))}
        </div>
        <p className="border-paper border-t pt-2 text-xs">
          {swatch.textOn.length > 0 ? (
            <span className="text-pine-text">
              Body text on {swatch.textOn.join(" and ")}
            </span>
          ) : (
            <span className="text-agar-text">Surface and display only</span>
          )}
        </p>
      </div>
    </div>
  );
}

function Section({
  title,
  note,
  children,
}: {
  title: string;
  note?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-paper border-t py-12">
      <h2 className="text-title font-black">{title}</h2>
      {note ? <p className="text-agar-text mt-2 max-w-2xl text-sm">{note}</p> : null}
      <div className="mt-8">{children}</div>
    </section>
  );
}

const EASINGS = [
  { token: "--ease-out-expo", use: "Reveals and entrances. The house curve." },
  {
    token: "--ease-in-out-quart",
    use: "Panel expansion, anything that travels and settles.",
  },
  { token: "--ease-out-soft", use: "Hover and small state changes." },
];

export default function StyleGuidePage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-16">
      <header>
        <p className="text-peach-text text-sm font-medium tracking-[0.2em] uppercase">
          7 Noodles
        </p>
        <h1 className="text-display mt-3 font-black">Style guide</h1>
        <p className="text-agar-text text-lede mt-4 max-w-2xl">
          The working design system. Every value here is the one the site ships — the
          contrast figures are computed from the tokens at render, not written down.
        </p>
      </header>

      {PALETTE.map((group) => (
        <Section key={group.name} title={group.name} note={group.note}>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {group.swatches.map((swatch) => (
              <SwatchCard key={swatch.token} swatch={swatch} />
            ))}
          </div>
        </Section>
      ))}

      <Section
        title="Type"
        note="Archivo across the board, using its width axis so the wordmark can run Black Expanded while body copy stays normal. Chinese sets in the reader's system face until the subset build lands."
      >
        <div className="flex flex-col gap-10">
          <div>
            <p className="text-agar-text text-xs tracking-wide uppercase">
              text-hero · the wordmark
            </p>
            <p className="text-hero mt-2 font-black" style={{ fontStretch: "125%" }}>
              7 NOODLES
            </p>
          </div>

          <div>
            <p className="text-agar-text text-xs tracking-wide uppercase">
              The bilingual pairing
            </p>
            <div className="mt-3 flex flex-wrap items-baseline gap-x-6 gap-y-1">
              <span lang="zh" className="text-peach-text text-title">
                招牌干馏豌杂面
              </span>
              <span className="text-title font-black">Signature Wanza Noodles</span>
            </div>
            <p className="text-agar-text mt-3 max-w-2xl text-sm">
              Both names carry equal optical weight. This pairing is the signature
              typographic device, not an afterthought bolted onto the English.
            </p>
          </div>

          <dl className="flex flex-col gap-6">
            {[
              {
                token: "text-display",
                sample: "Made by hand, daily",
                cls: "text-display",
              },
              {
                token: "text-title",
                sample: "Chongqing, in North York",
                cls: "text-title",
              },
              {
                token: "text-lede",
                sample: "Noodles pulled to order, broth built over days.",
                cls: "text-lede",
              },
              {
                token: "text-base",
                sample: "Body copy sits here at sixteen pixels.",
                cls: "text-base",
              },
              { token: "text-sm", sample: "Metadata, prices, captions.", cls: "text-sm" },
            ].map((row) => (
              <div key={row.token}>
                <dt className="text-agar-text text-xs tracking-wide uppercase">
                  {row.token}
                </dt>
                <dd className={`${row.cls} mt-1 font-black`}>{row.sample}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Section>

      <Section
        title="Motion"
        note="Curves and durations are tokens so the whole site can be retimed from one place. Hover a bar to see its curve. Every one of these is neutralised under prefers-reduced-motion."
      >
        <div className="flex flex-col gap-5">
          {EASINGS.map((easing) => (
            <div key={easing.token} className="group">
              <p className="flex items-baseline justify-between text-xs">
                <code>{easing.token}</code>
                <span className="text-agar-text">{easing.use}</span>
              </p>
              <div className="bg-rice-dim mt-2 h-10 w-full overflow-hidden">
                <div
                  className="bg-peach h-full w-16 group-hover:w-full"
                  style={{
                    transitionProperty: "width",
                    transitionDuration: "var(--duration-slow)",
                    transitionTimingFunction: `var(${easing.token})`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="On ink"
        note="The same system reversed. Most of the site's motion sections sit here."
      >
        <div className="bg-ink text-rice flex flex-col gap-6 p-8">
          <p className="text-display font-black" style={{ fontStretch: "125%" }}>
            麻辣
          </p>
          <p className="text-lede max-w-xl">
            Numbing, then hot. <span className="text-lantern">Lantern</span> carries
            highlights here and only here — on rice it drops to 1.94:1 and stops being
            text at all.
          </p>
          <div className="flex flex-wrap gap-3 text-sm">
            <span className="bg-peach text-rice px-4 py-2 font-medium">Order now</span>
            <span className="border-agar-glow text-rice border px-4 py-2 font-medium">
              View menu
            </span>
          </div>
        </div>
      </Section>
    </main>
  );
}
