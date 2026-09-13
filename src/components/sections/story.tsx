import { BrushFrame } from "@/components/brand/brush-frame";
import { PhotoSlot } from "@/components/media/photo-slot";
import { ScrollRevealText } from "@/components/motion/scroll-reveal-text";
import { Seal } from "@/components/brand/seal";
import { PaintButton } from "@/components/ui/paint-button";
import { STORY } from "@/content/story";

/**
 * Black ground, with two brush-shaped windows onto the photography — one on
 * the right, one lower left — each painted on as the reader scrolls in.
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
      className="bg-ink-deep text-rice relative overflow-hidden px-6 py-28 md:px-10 md:py-40"
    >
      <div className="mx-auto grid max-w-[1700px] gap-12 lg:grid-cols-12 lg:gap-x-12">
        <div className="lg:col-span-7 lg:col-start-1 lg:row-start-1">
          <div className="flex items-center gap-4">
            <Seal character={STORY.sealCharacter} />
            <span lang="zh" className="text-lantern font-brush text-3xl">
              {STORY.vertical}
            </span>
          </div>

          <ScrollRevealText
            as="blockquote"
            text={`“${STORY.quote}”`}
            className="mt-10 text-[clamp(2rem,4.2vw,4.25rem)] leading-[1.08] font-black text-balance"
          />

          <div className="mt-10 flex max-w-xl flex-col gap-5">
            {STORY.supporting.map((line) => (
              <ScrollRevealText
                key={line}
                text={line}
                className="text-agar-glow text-base leading-relaxed md:text-lg"
              />
            ))}
          </div>

          <div className="text-rice mt-10">
            <PaintButton href={STORY.cta.href}>{STORY.cta.label}</PaintButton>
          </div>
        </div>

        <BrushFrame
          brush="story-right"
          className="aspect-[4/5] lg:col-span-5 lg:col-start-8 lg:row-span-2 lg:row-start-1"
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
          className="aspect-[4/3] lg:col-span-6 lg:col-start-1 lg:row-start-2"
        >
          <PhotoSlot
            label={STORY.photos.secondary}
            tone="bg-agar/40"
            labelTone="text-rice/70"
          />
        </BrushFrame>
      </div>
    </section>
  );
}
