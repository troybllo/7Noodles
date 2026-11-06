import type { Metadata } from "next";
import { contrastLevel, contrastRatio } from "@/lib/contrast";
import { Logo } from "@/components/brand/logo";
import { Panda7 } from "@/components/brand/panda-7";
import { DishTags } from "@/components/menu/dish-tags";
import { Button } from "@/components/ui/button";
import { GROUND_HEX, PALETTE, type Ground, type Swatch } from "@/design/palette";
import { findDish } from "@/lib/menu";

export const metadata: Metadata = {
  title: "Style guide",
  robots: { index: false, follow: false },
};

const GROUNDS: Ground[] = ["paper", "brand", "brand-soft"];

function Ratio({ hex, ground }: { hex: string; ground: Ground }) {
  const ratio = contrastRatio(hex, GROUND_HEX[ground]);
  const level = contrastLevel(ratio);
  const failing = level === "Fail" || level === "AA Large";

  return (
    <span className="flex items-baseline justify-between gap-2 tabular-nums">
      <span className="text-brand-deep">on {ground}</span>
      <span className={failing ? "text-brand-deep" : "text-brand font-medium"}>
        {ratio.toFixed(2)} · {level}
      </span>
    </span>
  );
}

function SwatchCard({ swatch }: { swatch: Swatch }) {
  return (
    <div className="border-brand/10 flex flex-col border">
      <div className="h-24 w-full" style={{ backgroundColor: swatch.hex }} />
      <div className="flex flex-1 flex-col gap-2 p-3">
        <div>
          <p className="flex items-baseline gap-2 text-sm font-medium">
            <code>{swatch.token}</code>
            {swatch.chinese ? (
              <span lang="zh" className="text-brand-deep">
                {swatch.chinese}
              </span>
            ) : null}
          </p>
          <p className="text-brand-deep text-xs tracking-wide uppercase">{swatch.hex}</p>
        </div>
        <p className="text-brand-deep flex-1 text-xs leading-relaxed">{swatch.usage}</p>
        <div className="flex flex-col gap-0.5 text-xs">
          {GROUNDS.map((ground) => (
            <Ratio key={ground} hex={swatch.hex} ground={ground} />
          ))}
        </div>
        <p className="border-brand/10 border-t pt-2 text-xs">
          {swatch.textOn.length > 0 ? (
            <span className="text-jade">Body text on {swatch.textOn.join(" and ")}</span>
          ) : (
            <span className="text-brand-deep">Surface and display only</span>
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
    <section className="border-brand/10 border-t py-12">
      <h2 className="font-display text-title">{title}</h2>
      {note ? <p className="text-brand-deep mt-2 max-w-2xl text-sm">{note}</p> : null}
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
    <main id="main" className="bg-paper text-brand w-full px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <header>
          <p className="text-brand-deep text-sm font-medium tracking-[0.2em] uppercase">
            7 Noodles
          </p>
          <h1 className="font-display text-display mt-3">Style guide</h1>
          <p className="text-brand-deep text-lede mt-4 max-w-2xl">
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
          note="Oilvare Base in capitals for display and headings, Inter for everything read, Noto Sans SC for the Chinese."
        >
          <div className="flex flex-col gap-10">
            <div>
              <p className="text-brand-deep text-xs tracking-wide uppercase">
                text-hero · the wordmark
              </p>
              <p className="font-display text-hero mt-2">Seven Noodles</p>
            </div>

            <div>
              <p className="text-brand-deep text-xs tracking-wide uppercase">
                The bilingual pairing
              </p>
              <div className="mt-3 flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <span className="font-display text-title">Wanza Noodles</span>
                <span lang="zh" className="font-cjk text-brand-deep text-lg font-bold">
                  招牌豌杂面
                </span>
              </div>
              <p className="text-brand-deep mt-3 max-w-2xl text-sm">
                English leads; the Chinese sits beside it as a quiet, constant mark of
                where the food is from.
              </p>
            </div>

            <dl className="flex flex-col gap-6">
              {[
                {
                  token: "text-display",
                  sample: "Noodles, wontons & skewers",
                  cls: "font-display text-display",
                },
                {
                  token: "text-title",
                  sample: "Chongqing, in North York",
                  cls: "font-display text-title",
                },
                {
                  token: "text-lede",
                  sample: "House-made noodles, tossed at the pass.",
                  cls: "text-lede",
                },
                {
                  token: "text-base",
                  sample: "Body copy sits here at sixteen pixels.",
                  cls: "text-base",
                },
                { token: "eyebrow", sample: "Our menu", cls: "eyebrow" },
              ].map((row) => (
                <div key={row.token}>
                  <dt className="text-brand-deep text-xs tracking-wide uppercase">
                    {row.token}
                  </dt>
                  <dd className={`${row.cls} mt-1`}>{row.sample}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Section>

        <Section
          title="Logo"
          note="From the brand guide: the full lockup, the round mark alone, and the stacked lockup. Drawn in the colour of its context."
        >
          <div className="flex flex-wrap items-end gap-12">
            <Logo className="w-80" />
            <Logo variant="mark" className="w-24" />
            <Logo variant="stacked" className="w-20" />
            <span className="bg-brand text-paper p-6">
              <Logo className="w-56" />
            </span>
          </div>
        </Section>

        <Section title="Mascot" note="Panda 7, from the brand guide.">
          <div className="flex flex-wrap items-end gap-10">
            {(["wave", "chef", "spicy", "standing"] as const).map((pose) => (
              <Panda7 key={pose} pose={pose} className="w-40" sizes="10rem" />
            ))}
          </div>
        </Section>

        <Section title="Dish marks" note="Spice, diet and the owner's allergen marks.">
          <div className="flex flex-col gap-4">
            {[
              "wanza-noodles",
              "mala-noodle-soup",
              "shrimp-and-pork-wonton-noodle-soup",
              "wontons-in-sesame-sauce",
              "yellow-pea-noodles",
              "super-spicy-beef-or-chicken-noodles",
            ].map((slug) => {
              const item = findDish(slug)?.item;
              return item ? (
                <div key={slug} className="flex flex-wrap items-center gap-4">
                  <span className="font-display w-64">{item.nameEn}</span>
                  <DishTags item={item} />
                </div>
              ) : null;
            })}
          </div>
        </Section>

        <Section title="Buttons">
          <div className="flex flex-wrap gap-3">
            <Button href="/styleguide" tone="solid">
              Order now
            </Button>
            <Button href="/styleguide">See the menu</Button>
            <Button href="/styleguide" tone="outline">
              Back home
            </Button>
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
                  <span className="text-brand-deep">{easing.use}</span>
                </p>
                <div className="bg-brand-soft mt-2 h-10 w-full overflow-hidden">
                  <div
                    className="bg-brand h-full w-16 group-hover:w-full"
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
          note="The same system reversed, for the photo-led dark sections."
        >
          <div className="bg-brand text-paper flex flex-col gap-6 rounded-3xl p-8">
            <p lang="zh" className="font-cjk text-display text-paper font-bold">
              麻辣
            </p>
            <p className="text-lede max-w-xl">
              Numbing, then hot. <span className="text-gold">Embroidery Gold</span> is the
              one accent that reads on red.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button href="/styleguide" tone="solid">
                Order now
              </Button>
              <Button href="/styleguide" tone="inverse">
                View menu
              </Button>
            </div>
          </div>
        </Section>
      </div>
    </main>
  );
}
