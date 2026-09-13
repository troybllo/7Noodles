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
      <div className="bg-ink-deep relative isolate flex min-h-[80svh] items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 grid grid-cols-1 md:grid-cols-2">
          <PhotoSlot label="Room from the doorway, low light" tone="bg-ink-soft" />
          <PhotoSlot label="Pass and kitchen, steam, night" tone="bg-ink" />
        </div>
        <div className="from-ink/70 absolute inset-0 z-0 bg-gradient-to-b to-transparent" />

        <p
          aria-hidden="true"
          lang="zh"
          className="text-agar-glow/50 absolute top-24 left-4 z-10 hidden text-xs tracking-[0.4em] xl:block"
          style={{ writingMode: "vertical-rl" }}
        >
          {ABOUT.vertical}
        </p>

        <div className="relative z-10 flex flex-col items-center gap-4 text-center">
          <p
            lang="zh"
            className="font-brush text-rice text-[clamp(3.5rem,12vw,10rem)] leading-none"
          >
            {ABOUT.nameZh}
          </p>
          <p className="text-rice text-xs font-semibold tracking-[0.55em] uppercase">
            {ABOUT.nameEn}
          </p>
        </div>
      </div>

      {/* Brand history. */}
      <div className="bg-rice text-ink px-6 py-20 md:px-10 md:py-28">
        <div className="mx-auto grid max-w-[1700px] gap-10 lg:grid-cols-12 lg:gap-x-16">
          <div className="lg:sticky lg:top-28 lg:col-span-5 lg:self-start">
            <p lang="zh" className="font-brush text-peach-text text-4xl leading-none">
              {ABOUT.headingZh}
            </p>
            <h2 className="text-display mt-4 font-black">{ABOUT.heading}</h2>
            <p className="text-agar-text mt-6 max-w-sm text-base leading-relaxed">
              {ABOUT.lede}
            </p>
          </div>

          <div className="flex flex-col gap-10 lg:col-span-4">
            {ABOUT.story.map((entry) => (
              <div key={entry.title} className="flex flex-col gap-3">
                <h3
                  lang="zh"
                  className="text-[0.68rem] font-semibold tracking-[0.22em] uppercase"
                >
                  {entry.title}
                </h3>
                <p className="text-agar-text text-sm leading-relaxed">{entry.body}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-10 lg:col-span-3">
            <div className="flex flex-col gap-3">
              <h3 className="text-[0.68rem] font-semibold tracking-[0.22em] uppercase">
                {ABOUT.aside.room.title}
              </h3>
              <p className="text-agar-text text-sm leading-relaxed">
                {ABOUT.aside.room.body}
              </p>
            </div>

            <figure className="border-paper flex flex-col gap-4 border-t pt-8">
              <blockquote className="text-ink text-lg leading-snug font-semibold">
                “{ABOUT.aside.quote.text}”
              </blockquote>
              <figcaption className="text-agar-text text-xs tracking-[0.16em] uppercase">
                {ABOUT.aside.quote.author} · {ABOUT.aside.quote.date}
              </figcaption>
            </figure>
          </div>
        </div>
      </div>

      <PaletteMosaic />
    </section>
  );
}
