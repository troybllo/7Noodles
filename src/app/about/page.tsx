import type { Metadata } from "next";
import Image from "next/image";
import { pageMetadata } from "@/lib/seo";
import { Logo } from "@/components/brand/logo";
import { Panda7 } from "@/components/brand/panda-7";
import { TapedFrame } from "@/components/hand/taped-frame";
import { NoodleLift } from "@/components/hand/noodle-lift";
import { DrawOn } from "@/components/motion/draw-on";
import { PinUp } from "@/components/motion/pin-up";
import { RevealFrame } from "@/components/motion/reveal-frame";
import { PageTransition } from "@/components/motion/page-transition";
import { Button } from "@/components/ui/button";
import { ABOUT } from "@/content/about";
import { CONTACT } from "@/content/contact";
import { PHOTOS } from "@/content/photos";
import type { Media } from "@/content/menu-media";
import { SCENERY } from "@/content/scenery";

export const metadata: Metadata = pageMetadata({
  title: "Our Story",
  description:
    "7 Noodles, 恰小面: 恰 means to eat, and sounds like 7 in Mandarin. Sichuan and Chongqing noodles on Yonge Street, Toronto. A bowl to come back for.",
  path: "/about",
});

const { name, roots } = ABOUT.story;

function Chapter({ n, onRed }: { n: number; onRed?: boolean }) {
  return (
    <p className={`eyebrow ${onRed ? "text-gold" : "text-brand-deep"}`}>Chapter {n}</p>
  );
}

/** A photograph taped onto the page. */
function Snapshot({
  photo,
  tilt,
  sizes,
  className,
}: {
  photo: Media;
  tilt: number;
  sizes: string;
  className?: string;
}) {
  return (
    <PinUp turn={tilt > 0 ? 5 : -5} className={className}>
      <TapedFrame tilt={tilt} className="text-sm">
        <div className="relative aspect-[4/5]">
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            sizes={sizes}
            className="object-cover"
          />
        </div>
      </TapedFrame>
    </PinUp>
  );
}

/** The room, in four frames: the door, the tables, the corner, the shelf. */
const ROOM = [
  PHOTOS.storefront,
  PHOTOS.diningRoomBooths,
  PHOTOS.diningRoomCorner,
  PHOTOS.kitchenCurtain,
];

/**
 * The restaurant's story in its own words (content/about.ts), in three
 * chapters, with the Chinese story beside the English rather than under it,
 * and the restaurant's own photographs between them.
 */
export default function AboutPage() {
  return (
    <PageTransition id="about">
      <main id="main">
        {/* The opening: the name, and Panda 7 at the table. */}
        <section
          data-nav-theme="dark"
          className="bg-brand text-paper relative overflow-hidden px-6 pt-28 pb-20 md:px-10 md:pt-36 md:pb-24"
        >
          <div className="mx-auto grid max-w-[1200px] items-center gap-12 lg:grid-cols-[1.2fr_1fr]">
            <div>
              <p className="eyebrow text-paper flex items-center gap-3">
                <span
                  lang="zh"
                  className="font-cjk text-gold text-sm font-bold tracking-[0.2em]"
                >
                  {ABOUT.headingZh}
                </span>
                About 7 Noodles
              </p>
              <h1 className="font-display text-hero mt-6">{ABOUT.heading}</h1>
              <p className="text-paper mt-8 max-w-[32ch] text-[clamp(1.3rem,2.2vw,1.75rem)] leading-snug">
                {ABOUT.lede}
              </p>
            </div>

            <div className="flex flex-col items-center gap-6 text-center">
              <Panda7 priority className="w-60 md:w-80" sizes="20rem" />
              <p
                lang="zh"
                className="font-cjk text-gold text-lg font-bold tracking-[0.1em]"
              >
                {ABOUT.tagline.zh}
              </p>
            </div>
          </div>
        </section>

        {/* 1. 恰: the name, explained, beside the logo. */}
        <section
          aria-labelledby="chapter-name"
          data-nav-theme="light"
          className="bg-paper text-brand px-6 py-28 md:px-10"
        >
          <div className="mx-auto grid max-w-[1100px] items-center gap-14 md:grid-cols-[1fr_minmax(0,22rem)]">
            <div>
              <Logo variant="stacked" title={null} className="mb-10 w-20 md:w-24" />
              <Chapter n={1} />
              <h2 id="chapter-name" className="font-display text-display mt-4">
                {name.title}
              </h2>
              <p className="text-brand-deep mt-6 max-w-[58ch] text-lg leading-relaxed">
                {name.body}
              </p>
            </div>
            <Snapshot
              photo={PHOTOS.birthdayBowl}
              tilt={2}
              sizes="(min-width: 768px) 22rem, 90vw"
            />
          </div>
        </section>

        {/* Sichuan, painted: the river the second chapter comes from. */}
        <figure className="bg-paper text-brand px-6 pb-28 md:px-10">
          <RevealFrame className="mx-auto aspect-[4/5] max-w-[1400px] sm:aspect-[16/9] lg:aspect-[21/9]">
            <div className="relative h-full w-full">
              <Image
                src={SCENERY.dujiangyan.src}
                alt={SCENERY.dujiangyan.alt}
                fill
                sizes="(min-width: 1400px) 1400px, 100vw"
                className="object-cover"
              />
            </div>
          </RevealFrame>
          <figcaption className="text-brand-deep mx-auto mt-4 max-w-[1400px] text-sm">
            Dujiangyan, Sichuan. The Fish Mouth levee has divided the Min River since the
            third century BC.
          </figcaption>
        </figure>

        {/* 2. The roots, in English and in Chinese, with noodles drawn on. */}
        <section
          aria-labelledby="chapter-roots"
          data-nav-theme="dark"
          className="bg-brand text-paper px-6 py-28 md:px-10"
        >
          <div className="mx-auto grid max-w-[1100px] gap-14 md:grid-cols-2">
            <div>
              <Chapter n={2} onRed />
              <h2
                id="chapter-roots"
                className="font-display text-title mt-4 max-w-[16ch]"
              >
                {roots.title}
              </h2>
              <p className="text-paper mt-6 max-w-[52ch] text-lg leading-relaxed">
                {roots.body}
              </p>
              <DrawOn duration={2.4} className="mt-12 w-48 md:w-56">
                <NoodleLift className="text-paper w-full [--noodle-ground:var(--color-brand)]" />
              </DrawOn>
            </div>
            <div lang="zh" className="font-cjk flex flex-col gap-5 md:pt-10">
              <p className="text-gold text-2xl font-bold">{ABOUT.storyZh[0]}</p>
              <p className="text-paper text-lg leading-loose">{ABOUT.storyZh[1]}</p>
              <p className="text-gold text-2xl font-bold">{ABOUT.storyZh[2]}</p>
              <Snapshot
                photo={PHOTOS.chiliOilOnWontons}
                tilt={-2}
                sizes="(min-width: 768px) 20rem, 80vw"
                className="mt-6 w-[min(100%,20rem)]"
              />
            </div>
          </div>
        </section>

        {/* The room, below street level on Yonge. */}
        <section
          aria-labelledby="the-room"
          data-nav-theme="light"
          className="bg-paper text-brand px-6 pt-28 md:px-10"
        >
          <div className="mx-auto max-w-[1400px]">
            <h2 id="the-room" className="font-display text-title">
              {ABOUT.aside.room.title}
            </h2>
            <p className="text-brand-deep mt-4 max-w-[48ch] text-lg leading-relaxed">
              {ABOUT.aside.room.body}
            </p>
            <ul className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
              {ROOM.map((photo, index) => (
                <li key={photo.src}>
                  <RevealFrame delay={index * 0.1} className="aspect-[3/4]">
                    <div className="relative h-full w-full">
                      <Image
                        src={photo.src}
                        alt={photo.alt}
                        fill
                        sizes="(min-width: 768px) 25vw, 50vw"
                        className="object-cover"
                      />
                    </div>
                  </RevealFrame>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 3. The brand line, the address, and what a diner said about it. */}
        <section
          aria-labelledby="chapter-welcome"
          data-nav-theme="light"
          className="bg-paper text-brand px-6 py-28 md:px-10"
        >
          <div className="mx-auto grid max-w-[1100px] items-center gap-14 md:grid-cols-2">
            <div>
              <Chapter n={3} />
              <h2
                id="chapter-welcome"
                className="font-display text-title mt-4 max-w-[16ch]"
              >
                {ABOUT.tagline.en}
              </h2>
              <address className="text-brand-deep mt-6 text-sm leading-relaxed not-italic">
                {CONTACT.address.street}, {CONTACT.address.locality}
                <br />
                {CONTACT.hoursSummary}
              </address>
              <div className="mt-8">
                <Button href="/locations" tone="outline">
                  Find us
                </Button>
              </div>
            </div>

            <PinUp turn={-4}>
              <TapedFrame tilt={-1.5} className="text-sm">
                <figure className="bg-paper text-brand flex flex-col gap-5 p-8">
                  <blockquote className="text-2xl leading-snug">
                    &ldquo;{ABOUT.aside.quote.text}&rdquo;
                  </blockquote>
                  <figcaption className="eyebrow text-brand-deep">
                    {ABOUT.aside.quote.author} · {ABOUT.aside.quote.date}
                  </figcaption>
                </figure>
              </TapedFrame>
            </PinUp>
          </div>
        </section>

        {/* The way on. */}
        <section
          data-nav-theme="dark"
          className="bg-brand text-paper flex flex-col items-center px-6 py-24 text-center"
        >
          <Panda7 alt="" className="w-44 md:w-56" sizes="14rem" />
          <p className="font-display text-display mt-8">Come hungry</p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Button href="/order" tone="inverse">
              Order for pickup
            </Button>
            <Button href="/menu" tone="inverse">
              See the menu
            </Button>
          </div>
        </section>
      </main>
    </PageTransition>
  );
}
