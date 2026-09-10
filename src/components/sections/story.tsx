import Link from "next/link";
import { PullUp } from "@/components/motion/pull-up";
import { ScrollRevealText } from "@/components/motion/scroll-reveal-text";
import { PhotoSlot } from "@/components/media/photo-slot";
import { Seal } from "@/components/brand/seal";
import { STORY } from "@/content/story";

export function Story() {
  return (
    <section
      id="story"
      data-nav-theme="dark"
      className="bg-ink text-rice relative overflow-hidden px-6 py-24 md:px-10 md:py-32 lg:pr-10 lg:pl-36 xl:pl-44"
    >
      {/* Set vertically, the way a printed Sichuan menu would. */}
      <p
        aria-hidden="true"
        lang="zh"
        className="text-agar-glow/45 absolute top-32 left-2 hidden text-sm tracking-[0.4em] xl:block"
        style={{ writingMode: "vertical-rl" }}
      >
        {STORY.vertical}
      </p>

      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-12 lg:gap-x-12">
        <div className="lg:col-span-5 lg:col-start-1 lg:row-start-1 lg:self-center">
          <Seal character={STORY.sealCharacter} />

          <ScrollRevealText
            as="blockquote"
            text={`“${STORY.quote}”`}
            className="mt-6 text-2xl leading-[1.25] font-semibold text-balance md:text-3xl"
          />

          <div className="mt-7 flex flex-col gap-4">
            {STORY.supporting.map((line) => (
              <ScrollRevealText
                key={line}
                text={line}
                className="text-agar-glow max-w-md text-sm leading-relaxed"
              />
            ))}
          </div>

          <Link
            href={STORY.cta.href}
            className="bg-pine text-rice hover:bg-pine-glow mt-9 inline-flex rounded-full px-6 py-3 text-sm font-medium transition-colors duration-[--duration-fast]"
          >
            {STORY.cta.label}
          </Link>
        </div>

        <PullUp className="aspect-[4/3] lg:col-span-7 lg:col-start-6 lg:row-start-1">
          <PhotoSlot label={STORY.photos.primary} />
        </PullUp>

        <PullUp
          delay={0.12}
          className="aspect-[4/5] lg:col-span-3 lg:col-start-2 lg:row-start-2 lg:-mt-28"
        >
          <PhotoSlot label={STORY.photos.secondary} />
        </PullUp>
      </div>
    </section>
  );
}
