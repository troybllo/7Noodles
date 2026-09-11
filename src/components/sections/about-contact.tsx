import { PhotoSlot } from "@/components/media/photo-slot";
import { ABOUT } from "@/content/about";
import { PaletteMosaic } from "./palette-mosaic";

/**
 * Three bands, following the brand-book spread the client referenced: the mark
 * over the room, the written history, then the palette.
 *
 * The history is three columns. The left one carries the heading and is
 * sticky and wider than the two beside it, so one idea holds steady while the
 * detail moves past — the reason the column is wide is that it is the anchor,
 * not a margin note.
 */
export function AboutContact() {
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

          <div className="flex flex-col gap-8 lg:col-span-3">
            {ABOUT.contact.map((entry) => (
              <div key={entry.label} className="flex flex-col gap-2">
                <h3 className="text-[0.68rem] font-semibold tracking-[0.22em] uppercase">
                  {entry.label}
                </h3>
                <p className="text-agar-text text-sm leading-relaxed whitespace-pre-line">
                  {entry.body}
                </p>
              </div>
            ))}

            {/*
              Markup only. No inputs and no submit control, because it cannot
              send yet — a form that looks live and quietly drops messages is
              worse than no form. Wiring lands with Resend.
            */}
            <div className="border-paper flex flex-col gap-4 border-t pt-8">
              <h3 className="text-[0.68rem] font-semibold tracking-[0.22em] uppercase">
                {ABOUT.form.title}
              </h3>
              {ABOUT.form.fields.map((field) => (
                <label key={field} className="flex flex-col gap-1">
                  <span className="text-agar-text text-[0.6rem] tracking-[0.2em] uppercase">
                    {field}
                  </span>
                  <span
                    aria-hidden="true"
                    data-placeholder-field
                    className="border-paper h-8 border-b"
                  />
                </label>
              ))}
              <p className="text-agar-text text-xs leading-relaxed">{ABOUT.form.note}</p>
            </div>
          </div>
        </div>
      </div>

      <PaletteMosaic />
    </section>
  );
}
