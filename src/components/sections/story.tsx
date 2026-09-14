import { BrushFrame } from "@/components/brand/brush-frame";
import { Seal } from "@/components/brand/seal";
import { HandArrow } from "@/components/hand/hand-arrow";
import { PhotoSlot } from "@/components/media/photo-slot";
import { ScrollRevealText } from "@/components/motion/scroll-reveal-text";
import { PaperButton } from "@/components/ui/paper-button";
import { STORY } from "@/content/story";

/**
 * Ink paper, with two brush-shaped windows onto the photography — a tall one
 * on the right and a smaller one over its lower-left corner — each painted on
 * as the reader scrolls in.
 *
 * The quote is set in the poster lettering and fills from muted to full as it
 * passes through the viewport; the lines beneath it are handwritten, as notes
 * in the margin of a menu.
 */
export function Story() {
  return (
    <section
      id="story"
      data-nav-theme="dark"
      className="paper-ink text-cream relative overflow-hidden px-6 py-20 md:px-10 md:py-24"
    >
      {/* About one screen tall on a laptop: the second photograph tucks over
          the corner of the first instead of adding a row beneath it. */}
      <div className="mx-auto grid max-w-[1400px] items-center gap-12 lg:grid-cols-12 lg:gap-x-12">
        <div className="lg:col-span-7">
          <div className="flex items-center gap-4">
            <Seal character={STORY.sealCharacter} />
            <span lang="zh" className="text-parchment font-brush text-3xl md:text-4xl">
              {STORY.vertical}
            </span>
          </div>

          <ScrollRevealText
            as="blockquote"
            text={`“${STORY.quote}”`}
            className="font-poster text-parchment mt-8 max-w-[22ch] text-[clamp(1.75rem,3.3vw,3.25rem)] leading-[1.1] text-balance"
          />

          <div className="mt-8 flex max-w-xl flex-col gap-4">
            {STORY.supporting.map((line) => (
              <ScrollRevealText
                key={line}
                text={line}
                className="font-hand text-cream/80 text-lg leading-relaxed md:text-xl"
              />
            ))}
          </div>

          <div className="mt-10">
            <PaperButton href={STORY.cta.href}>{STORY.cta.label}</PaperButton>
          </div>
        </div>

        <div className="relative lg:col-span-5">
          <BrushFrame
            brush="story-right"
            className="aspect-[4/3] lg:ml-auto lg:aspect-[4/5] lg:max-w-[calc(72svh*0.8)]"
          >
            <PhotoSlot
              label={STORY.photos.primary}
              tone="bg-ink-soft"
              labelTone="text-cream/60"
            />
          </BrushFrame>

          <BrushFrame
            brush="story-left"
            delay={0.25}
            className="absolute -bottom-[8%] -left-[22%] hidden aspect-[4/3] w-[58%] lg:block"
          >
            <PhotoSlot
              label={STORY.photos.secondary}
              tone="bg-ink-soft"
              labelTone="text-cream/60"
            />
          </BrushFrame>

          {/* A note in the margin, pointing at the bowl. */}
          <p className="font-hand-caps text-cream/85 absolute -top-2 -left-10 hidden rotate-[-6deg] text-sm leading-tight tracking-[0.06em] uppercase lg:block">
            Numbing first,
            <br />
            heat second
          </p>
          <HandArrow
            seed={52}
            size={[80, 60]}
            points={[
              [12, 6],
              [30, 20],
              [48, 40],
              [74, 52],
            ]}
            className="text-cream/85 absolute top-10 -left-2 hidden w-16 lg:block"
          />
        </div>
      </div>
    </section>
  );
}
