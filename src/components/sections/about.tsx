import { HandUnderline } from "@/components/hand/hand-underline";
import { StampedText } from "@/components/hand/stamped-text";
import { TapedFrame } from "@/components/hand/taped-frame";
import { PhotoSlot } from "@/components/media/photo-slot";
import { ABOUT } from "@/content/about";
import { PaletteMosaic } from "./palette-mosaic";

/**
 * Three bands, following the brand-book spread the client referenced: the mark
 * over the room, the written history, then the palette. Contact detail lives
 * in its own section at the foot of the page.
 *
 * The history is three columns. The left one carries the heading and is
 * sticky and wider than the two beside it, so one idea holds steady while the
 * detail moves past — the reason the column is wide is that it is the anchor,
 * not a margin note.
 */
export function About() {
  return (
    <section id="about" data-nav-theme="dark" className="relative z-10 w-full">
      {/* The mark over the room. */}
      <div className="paper-ink relative isolate flex min-h-[55svh] items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 grid grid-cols-1 md:grid-cols-2">
          <PhotoSlot label="Room from the doorway, low light" tone="bg-ink-soft" />
          <PhotoSlot label="Pass and kitchen, steam, night" tone="bg-ink" />
        </div>
        <div className="from-ink/70 absolute inset-0 z-0 bg-gradient-to-b to-transparent" />

        <p
          aria-hidden="true"
          lang="zh"
          className="font-brush text-cream/45 absolute top-24 left-4 z-10 hidden text-2xl tracking-[0.2em] xl:block"
          style={{ writingMode: "vertical-rl" }}
        >
          {ABOUT.vertical}
        </p>

        <div className="relative z-10 flex flex-col items-center gap-4 text-center">
          <p
            lang="zh"
            className="font-brush text-parchment text-[clamp(3.5rem,12vw,10rem)] leading-none"
            style={{ textShadow: "-0.035em 0.035em 0 var(--color-chili)" }}
          >
            {ABOUT.nameZh}
          </p>
          <p className="font-nav text-cream text-sm font-bold tracking-[0.5em] uppercase">
            {ABOUT.nameEn}
          </p>
        </div>
      </div>

      {/* Brand history. */}
      <div
        data-nav-theme="light"
        className="paper-cream text-ink px-6 py-16 md:px-10 md:py-20"
      >
        <div className="mx-auto grid max-w-[1700px] gap-10 lg:grid-cols-12 lg:gap-x-16">
          <div className="lg:sticky lg:top-28 lg:col-span-5 lg:self-start">
            <p lang="zh" className="font-brush text-chili text-4xl leading-none">
              {ABOUT.headingZh}
            </p>
            <h2 className="font-poster mt-4 text-[clamp(2.25rem,4.5vw,4.25rem)] leading-[1.02]">
              <StampedText tone="text-ink" shadow="text-chili">
                {ABOUT.heading}
              </StampedText>
            </h2>
            <p className="font-hand text-ink/85 mt-6 max-w-sm text-xl leading-snug">
              {ABOUT.lede}
            </p>
          </div>

          <div className="flex flex-col gap-8 lg:col-span-4">
            {ABOUT.story.map((entry) => (
              <div key={entry.title} className="flex flex-col gap-3">
                <h3 className="font-hand-caps relative self-start text-lg tracking-[0.06em] uppercase">
                  {entry.title}
                  <HandUnderline
                    seed={entry.title.length * 5}
                    drawn
                    className="text-chili absolute inset-x-0 -bottom-1 h-2"
                  />
                </h3>
                <p className="text-ink/80 text-[0.95rem] leading-relaxed">{entry.body}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-10 lg:col-span-3">
            <div className="flex flex-col gap-3">
              <h3 className="font-hand-caps relative self-start text-lg tracking-[0.06em] uppercase">
                {ABOUT.aside.room.title}
                <HandUnderline
                  seed={23}
                  drawn
                  className="text-chili absolute inset-x-0 -bottom-1 h-2"
                />
              </h3>
              <p className="text-ink/80 text-[0.95rem] leading-relaxed">
                {ABOUT.aside.room.body}
              </p>
            </div>

            <TapedFrame tape="top" tilt={-1.5} className="mt-2 text-sm">
              <figure className="flex flex-col gap-4 px-4 py-5">
                <blockquote className="font-hand text-ink text-xl leading-snug">
                  “{ABOUT.aside.quote.text}”
                </blockquote>
                <figcaption className="font-hand-caps text-chili text-sm tracking-[0.06em] uppercase">
                  {ABOUT.aside.quote.author} · {ABOUT.aside.quote.date}
                </figcaption>
              </figure>
            </TapedFrame>
          </div>
        </div>
      </div>

      <PaletteMosaic />
    </section>
  );
}
