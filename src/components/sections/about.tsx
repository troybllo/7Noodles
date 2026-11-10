import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import Image from "next/image";
import { PHOTOS } from "@/content/photos";
import { TapedFrame } from "@/components/hand/taped-frame";
import { PinUp } from "@/components/motion/pin-up";
import { ABOUT } from "@/content/about";

/**
 * Two bands: the logo over the dining room, then the brand story. Contact detail
 * lives in the footer.
 *
 * The history is three columns. The left one carries the heading and is
 * sticky and wider than the two beside it, so one idea holds steady while the
 * detail moves past — the reason the column is wide is that it is the anchor,
 * not a margin note.
 */
/** The dining room, behind the logo under a wash of red. */
const BACKDROP = [PHOTOS.diningRoomBooths, PHOTOS.diningRoomCorner];

export function About() {
  return (
    <section id="about" data-nav-theme="dark" className="relative z-10 w-full">
      {/* The logo over the room. */}
      <div className="bg-brand relative isolate flex min-h-[60svh] items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 grid grid-cols-1 md:grid-cols-2">
          {BACKDROP.map((photo, index) => (
            <div
              key={photo.src}
              className={`relative ${index > 0 ? "hidden md:block" : ""}`}
            >
              <Image
                src={photo.src}
                alt=""
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>
        <div className="bg-brand/75 absolute inset-0 z-0" />

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
          <p className="font-display text-lede">{ABOUT.tagline.en}</p>
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
              className="eyebrow mt-5 inline-block py-3.5 underline underline-offset-4"
            >
              Read our story
            </Link>
          </div>

          <div className="flex flex-col gap-8 lg:col-span-4">
            {[ABOUT.story.name, ABOUT.story.roots].map((entry) => (
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

            <PinUp turn={-4} className="mt-4">
              <TapedFrame tape="top" tilt={-1.5} className="text-sm">
                <figure className="bg-paper flex flex-col gap-4 p-6">
                  <blockquote className="text-brand text-lg leading-snug">
                    “{ABOUT.aside.quote.text}”
                  </blockquote>
                  <figcaption className="eyebrow text-brand-deep">
                    {ABOUT.aside.quote.author} · {ABOUT.aside.quote.date}
                  </figcaption>
                </figure>
              </TapedFrame>
            </PinUp>
          </div>
        </div>
      </div>
    </section>
  );
}
