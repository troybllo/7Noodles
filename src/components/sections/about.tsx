import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { PhotoSlot } from "@/components/media/photo-slot";
import { TapedFrame } from "@/components/hand/taped-frame";
import { ABOUT } from "@/content/about";

/**
 * Two bands: the logo over the room, then the brand story. Contact detail
 * lives in the footer.
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
      <div className="bg-brand relative isolate flex min-h-[60svh] items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 grid grid-cols-1 md:grid-cols-2">
          <PhotoSlot label="Room from the doorway, low light" tone="bg-brand-deep" />
          <PhotoSlot label="Pass and kitchen, steam, night" tone="bg-brand" />
        </div>
        <div className="from-brand/80 via-brand/40 absolute inset-0 z-0 bg-gradient-to-t to-transparent" />

        <p
          aria-hidden="true"
          lang="zh"
          className="font-cjk text-paper/40 absolute top-28 left-6 z-10 hidden text-lg font-bold tracking-[0.3em] xl:block"
          style={{ writingMode: "vertical-rl" }}
        >
          {ABOUT.tagline.zh}
        </p>

        <div className="text-paper relative z-10 flex flex-col items-center gap-5 text-center">
          <Logo className="w-[min(80vw,34rem)]" />
          <p className="font-accent text-lede">{ABOUT.tagline.en}</p>
        </div>
      </div>

      {/* The brand story, in brief; the whole of it is on /about. */}
      <div
        data-nav-theme="light"
        className="bg-paper text-brand px-6 py-24 md:px-10 md:py-32"
      >
        <div className="mx-auto grid max-w-[1700px] gap-10 lg:grid-cols-12 lg:gap-x-16">
          <div className="lg:sticky lg:top-28 lg:col-span-5 lg:self-start">
            <p className="eyebrow text-brand-deep flex items-center gap-3">
              <span
                lang="zh"
                className="font-cjk text-brand-deep text-sm font-bold tracking-[0.2em]"
              >
                {ABOUT.headingZh}
              </span>
              About us
            </p>
            <h2 className="font-display text-display mt-5">{ABOUT.heading}</h2>
            <p className="text-brand mt-6 max-w-sm text-xl leading-snug">{ABOUT.lede}</p>
            <Link
              href="/about"
              className="eyebrow mt-8 inline-block underline underline-offset-4"
            >
              Read our story
            </Link>
          </div>

          <div className="flex flex-col gap-8 lg:col-span-4">
            {[ABOUT.story.qia, ABOUT.story.wanza, ABOUT.story.roots].map((entry) => (
              <div key={entry.title} className="flex flex-col gap-3">
                <h3 className="font-display border-paper self-start border-b-2 pb-1 text-xl">
                  {entry.title}
                </h3>
                <p className="text-brand-deep text-[0.95rem] leading-relaxed">
                  {entry.body}
                </p>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-10 lg:col-span-3">
            <div className="flex flex-col gap-3">
              <h3 className="font-display border-paper self-start border-b-2 pb-1 text-xl">
                {ABOUT.aside.room.title}
              </h3>
              <p className="text-brand-deep text-[0.95rem] leading-relaxed">
                {ABOUT.aside.room.body}
              </p>
            </div>

            <TapedFrame tape="top" tilt={-1.5} className="mt-4 text-sm">
              <figure className="bg-paper flex flex-col gap-4 p-6">
                <blockquote className="text-brand text-lg leading-snug">
                  “{ABOUT.aside.quote.text}”
                </blockquote>
                <figcaption className="eyebrow text-brand-deep">
                  {ABOUT.aside.quote.author} · {ABOUT.aside.quote.date}
                </figcaption>
              </figure>
            </TapedFrame>
          </div>
        </div>
      </div>
    </section>
  );
}
