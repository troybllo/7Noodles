import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import Image from "next/image";
import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { Panda7 } from "@/components/brand/panda-7";
import { TapedFrame } from "@/components/hand/taped-frame";
import { NoodleLift } from "@/components/hand/noodle-lift";
import { DrawOn } from "@/components/motion/draw-on";
import { PageTransition } from "@/components/motion/page-transition";
import { Button } from "@/components/ui/button";
import { ABOUT } from "@/content/about";
import { CONTACT } from "@/content/contact";

export const metadata: Metadata = pageMetadata({
  title: "Our Story",
  description:
    "7 Noodles, known in Chinese as 恰小面: the everyday noodles of Sichuan and Chongqing, brought to Toronto. Come for a bowl. Stay for a little warmth.",
  path: "/about",
});

const { everyday, qia, wanza, roots, welcome } = ABOUT.story;

function Chapter({ n, onRed }: { n: number; onRed?: boolean }) {
  return <p className={`eyebrow ${onRed ? "text-gold" : "text-brand-deep"}`}>Chapter {n}</p>;
}

/**
 * The restaurant's story, in its own words (content/about.ts, from the brand
 * guide), set out as chapters at its paragraph breaks, with the Chinese story
 * beside the English rather than under it as a translation.
 */
export default function AboutPage() {
  return (
    <PageTransition id="about">
      <main id="main">
        {/* The opening: the name, and Panda 7 at the table. */}
        <section
          data-nav-theme="dark"
          className="bg-brand text-paper relative overflow-hidden px-6 pt-36 pb-24 md:px-10"
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
              <Panda7 pose="eating" priority className="w-60 md:w-80" sizes="20rem" />
              <p lang="zh" className="font-cjk text-gold text-lg font-bold tracking-[0.1em]">
                {ABOUT.tagline.zh}
              </p>
            </div>
          </div>
        </section>

        {/* 1. Everyday life, beside noodles drawn on as the chapter scrolls in. */}
        <section
          aria-labelledby="chapter-everyday"
          data-nav-theme="light"
          className="bg-paper text-brand px-6 py-28 md:px-10"
        >
          <div className="mx-auto grid max-w-[1100px] items-center gap-12 md:grid-cols-[1fr_auto]">
            <div>
              <Chapter n={1} />
              <h2 id="chapter-everyday" className="font-display text-display mt-4">
                {everyday.title}
              </h2>
              <p className="text-brand-deep mt-6 max-w-[58ch] text-lg leading-relaxed">
                {everyday.body}
              </p>
            </div>
            <DrawOn duration={2.4} className="mx-auto w-56 md:w-72">
              <NoodleLift className="text-brand-deep w-full [--noodle-ground:var(--color-paper)]" />
            </DrawOn>
          </div>
        </section>

        {/* 2. 恰: the name, explained, beside the logo. */}
        <section
          aria-labelledby="chapter-qia"
          data-nav-theme="dark"
          className="bg-brand text-paper px-6 py-28 md:px-10"
        >
          <div className="mx-auto grid max-w-[1100px] items-center gap-14 md:grid-cols-[auto_1fr]">
            <Logo variant="stacked" title={null} className="mx-auto w-28 md:w-36" />
            <div>
              <Chapter n={2} onRed />
              <h2 id="chapter-qia" className="font-display text-display mt-4">
                {qia.title}
              </h2>
              <p className="text-paper mt-6 max-w-[52ch] text-lg leading-relaxed">
                {qia.body}
              </p>
            </div>
          </div>
        </section>

        {/* 3. The signature Wanza, with the bowl itself. */}
        <section
          aria-labelledby="chapter-wanza"
          data-nav-theme="light"
          className="bg-paper text-brand px-6 py-28 md:px-10"
        >
          <div className="mx-auto grid max-w-[1100px] items-center gap-14 md:grid-cols-2">
            <div>
              <Chapter n={3} />
              <h2 id="chapter-wanza" className="font-display text-display mt-4">
                {wanza.title}
              </h2>
              <p className="text-brand-deep mt-6 max-w-[52ch] text-lg leading-relaxed">
                {wanza.body}
              </p>
              <div className="mt-8">
                <Button href="/menu/traditional-xiaomian/wanza-noodles" tone="outline">
                  See the Wanza Noodles
                </Button>
              </div>
            </div>
            <Link
              href="/menu/traditional-xiaomian/wanza-noodles"
              className="group focus-visible:outline-brand block outline-offset-8"
              aria-label="Wanza Noodles on the menu"
            >
              <TapedFrame
                tape="top"
                tilt={-2}
                className="transition-[rotate] duration-[--duration-slow] ease-[--ease-out-expo] group-hover:!rotate-0"
              >
                <span className="relative block aspect-[4/5] w-full">
                  <Image
                    src="/photos/dishes/wanza-noodles.webp"
                    alt="Wanza noodles: slow-cooked yellow peas and pork sauce over noodles, with preserved greens, peanuts and scallion"
                    fill
                    sizes="(min-width: 768px) 32rem, 100vw"
                    className="object-cover"
                  />
                </span>
              </TapedFrame>
            </Link>
          </div>
        </section>

        {/* 4. The roots, in English and in Chinese. */}
        <section
          aria-labelledby="chapter-roots"
          data-nav-theme="dark"
          className="bg-brand text-paper px-6 py-28 md:px-10"
        >
          <div className="mx-auto grid max-w-[1100px] gap-14 md:grid-cols-2">
            <div>
              <Chapter n={4} onRed />
              <h2 id="chapter-roots" className="font-display text-display mt-4">
                {roots.title}
              </h2>
              <p className="text-paper mt-6 max-w-[52ch] text-lg leading-relaxed">
                {roots.body}
              </p>
            </div>
            <div lang="zh" className="font-cjk flex flex-col gap-5 md:pt-10">
              <p className="text-gold text-2xl font-bold">{ABOUT.storyZh[0]}</p>
              <p className="text-paper text-lg leading-loose">{ABOUT.storyZh[1]}</p>
              <p className="text-gold text-2xl font-bold">{ABOUT.storyZh[2]}</p>
            </div>
          </div>
        </section>

        {/* 5. A place at the table: the room, and what a diner said about it. */}
        <section
          aria-labelledby="chapter-welcome"
          data-nav-theme="light"
          className="bg-paper text-brand px-6 py-28 md:px-10"
        >
          <div className="mx-auto grid max-w-[1100px] items-center gap-14 md:grid-cols-2">
            <div>
              <Chapter n={5} />
              <h2 id="chapter-welcome" className="font-display text-display mt-4">
                {welcome.title}
              </h2>
              <p className="text-brand-deep mt-6 max-w-[42ch] text-lg leading-relaxed">
                {welcome.body}
              </p>
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
          </div>
        </section>

        {/* The way on. */}
        <section
          data-nav-theme="dark"
          className="bg-brand text-paper flex flex-col items-center px-6 py-24 text-center"
        >
          <Panda7 pose="wave" alt="" className="w-44 md:w-56" sizes="14rem" />
          <p className="font-display text-display mt-8 max-w-[18ch]">{ABOUT.tagline.en}</p>
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
