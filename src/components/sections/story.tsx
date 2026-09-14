import { BrushFrame } from "@/components/brand/brush-frame";
import { PhotoSlot } from "@/components/media/photo-slot";
import { ScrollRevealText } from "@/components/motion/scroll-reveal-text";
import { Seal } from "@/components/brand/seal";
import { PaintButton } from "@/components/ui/paint-button";
import { STORY } from "@/content/story";

/**
 * Black ground, with two brush-shaped windows onto the photography — a tall one
 * on the right and a smaller one over its lower-left corner — each painted on
 * as the reader scrolls in.
 *
 * The quote fills from muted to full as it passes through the viewport, which
 * is why it is set large: at body size the fill is a detail nobody notices, at
 * this size it is the reason to keep reading.
 */
export function Story() {
  return (
    <section
      id="story"
      data-nav-theme="dark"
      className="bg-ink-deep text-rice relative overflow-hidden px-6 py-20 md:px-10 md:py-24"
    >
      {/* About one screen tall on a laptop: the second photograph tucks over
          the corner of the first instead of adding a row beneath it. */}
      <div className="mx-auto grid max-w-[1400px] items-center gap-12 lg:grid-cols-12 lg:gap-x-12">
        <div className="lg:col-span-7">
          <div className="flex items-center gap-4">
            <Seal character={STORY.sealCharacter} />
            <span lang="zh" className="text-lantern font-brush text-2xl md:text-3xl">
              {STORY.vertical}
            </span>
          </div>

          <ScrollRevealText
            as="blockquote"
            text={`“${STORY.quote}”`}
            className="mt-8 max-w-[22ch] text-[clamp(1.75rem,3.3vw,3.25rem)] leading-[1.1] font-black text-balance"
          />

          <div className="mt-8 flex max-w-xl flex-col gap-4">
            {STORY.supporting.map((line) => (
              <ScrollRevealText
                key={line}
                text={line}
                className="text-agar-glow text-base leading-relaxed md:text-lg"
              />
            ))}
          </div>

          <div className="mt-8">
            <PaintButton href={STORY.cta.href} tone="rice">
              {STORY.cta.label}
            </PaintButton>
          </div>
        </div>

        <div className="relative lg:col-span-5">
          <BrushFrame
            brush="story-right"
            className="aspect-[4/3] lg:ml-auto lg:aspect-[4/5] lg:max-w-[calc(72svh*0.8)]"
          >
            <PhotoSlot
              label={STORY.photos.primary}
              tone="bg-agar/40"
              labelTone="text-rice/70"
            />
          </BrushFrame>

          <BrushFrame
            brush="story-left"
            delay={0.25}
            className="absolute -bottom-[8%] -left-[22%] hidden aspect-[4/3] w-[58%] lg:block"
          >
            <PhotoSlot
              label={STORY.photos.secondary}
              tone="bg-agar/40"
              labelTone="text-rice/70"
            />
          </BrushFrame>
        </div>
      </div>
    </section>
  );
}
