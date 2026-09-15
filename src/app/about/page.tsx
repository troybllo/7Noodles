import type { Metadata } from "next";
import Link from "next/link";
import { InkArt } from "@/components/brand/ink-art";
import { Seal } from "@/components/brand/seal";
import { HandArrow } from "@/components/hand/hand-arrow";
import { HandUnderline } from "@/components/hand/hand-underline";
import { NoodleLift } from "@/components/hand/noodle-lift";
import { StampedText } from "@/components/hand/stamped-text";
import { TapedFrame } from "@/components/hand/taped-frame";
import { DrawOn } from "@/components/motion/draw-on";
import { PageTransition } from "@/components/motion/page-transition";
import { PaperButton } from "@/components/ui/paper-button";
import { ABOUT } from "@/content/about";
import { CONTACT } from "@/content/contact";
import { STORY } from "@/content/story";
import { findDish } from "@/lib/menu";
import { formatCad } from "@/lib/money";

export const metadata: Metadata = {
  title: "Our story",
  description:
    "A Sichuan kitchen below street level at Yonge and Florence, cooking the noodles of Chongqing and the skewers of Leshan.",
};

/** Dishes that carry the names of the people they came from. */
const NAMED_DISHES = [
  "aunt-zhao-s-burning-noodles",
  "grandma-jiang-s-osmanthus-jelly",
  "grandma-jiang-s-milk-rice-milk",
] as const;

const [cooking, mala, named] = ABOUT.story;

/**
 * The restaurant's story, set out as chapters in the handmade style. Every
 * line is copy already approved on the site (content/about.ts and
 * content/story.ts); nothing is written here about the restaurant that the
 * restaurant has not said.
 */
export default function AboutPage() {
  const dishes = NAMED_DISHES.flatMap((slug) => {
    const found = findDish(slug);
    return found ? [found] : [];
  });

  return (
    <PageTransition id="about">
      <main id="main">
        {/* The opening: the name, and an ink dragon on vermilion. */}
        <section
          data-nav-theme="dark"
          className="paper-ink text-cream relative overflow-hidden px-6 pt-32 pb-20 md:px-10"
        >
          <div className="mx-auto grid max-w-[1200px] items-center gap-12 lg:grid-cols-[1fr_1.05fr]">
            <div>
              <div className="flex items-center gap-4">
                <Seal character="恰" />
                <span lang="zh" className="font-brush text-parchment text-4xl">
                  品牌故事
                </span>
              </div>
              <h1 className="font-poster mt-6 text-[clamp(3rem,8vw,7rem)] leading-[0.92] uppercase">
                <StampedText>Our story</StampedText>
              </h1>
              <p className="font-hand text-cream/90 mt-6 max-w-[32ch] text-[clamp(1.3rem,2.2vw,1.8rem)] leading-snug">
                {ABOUT.lede}
              </p>
            </div>

            <div
              className="bg-vermilion relative rotate-[1.5deg] p-[6%] shadow-[0_1rem_2.5rem_rgb(0_0_0/0.45)]"
              style={{ filter: "url(#torn-edge)" }}
            >
              <InkArt art="dragon" tone="bg-ink" className="w-full" />
            </div>
          </div>
        </section>

        {/* The cooking, beside noodles drawn on as the chapter scrolls in. */}
        {cooking ? (
          <section
            aria-labelledby="chapter-cooking"
            data-nav-theme="light"
            className="paper-cream text-ink px-6 py-24 md:px-10"
          >
            <div className="mx-auto grid max-w-[1100px] items-center gap-12 md:grid-cols-[1fr_auto]">
              <div>
                <p className="font-mono text-sm">Chapter 1</p>
                <h2
                  id="chapter-cooking"
                  className="font-poster mt-2 text-[clamp(2.25rem,5vw,4rem)] leading-none uppercase"
                >
                  <StampedText tone="text-ink" shadow="text-chili">
                    {cooking.title}
                  </StampedText>
                </h2>
                <p className="mt-6 max-w-[58ch] text-lg leading-relaxed">
                  {cooking.body}
                </p>
              </div>
              <DrawOn duration={2.4} className="mx-auto w-56 md:w-72">
                <NoodleLift className="text-chili w-full [--noodle-ground:var(--color-cream-paper)]" />
              </DrawOn>
            </div>
          </section>
        ) : null}

        {/* 麻辣, with the order drawn out. */}
        {mala ? (
          <section
            aria-labelledby="chapter-mala"
            data-nav-theme="red"
            className="paper-red text-cream px-6 py-24 md:px-10"
          >
            <div className="mx-auto max-w-[1100px]">
              <p className="font-mono text-sm">Chapter 2</p>
              <h2
                id="chapter-mala"
                className="mt-2 flex flex-wrap items-baseline gap-x-5"
              >
                <span lang="zh" className="font-brush text-parchment text-6xl">
                  {mala.title}
                </span>
                <span className="font-poster text-[clamp(2rem,4vw,3.25rem)] leading-none uppercase">
                  <StampedText>Numbing, then heat</StampedText>
                </span>
              </h2>

              <div className="mt-12 grid items-center gap-12 md:grid-cols-[1fr_1fr]">
                <blockquote className="font-poster text-parchment text-[clamp(1.6rem,3vw,2.5rem)] leading-[1.12]">
                  &ldquo;{STORY.quote}&rdquo;
                </blockquote>

                {/* The order, as a note on the page: peppercorn first, chilli second. */}
                <figure className="relative mx-auto w-full max-w-[26rem]">
                  <figcaption className="sr-only">
                    Sichuan peppercorn first, for the numbing; chilli second, for the
                    heat.
                  </figcaption>
                  <DrawOn
                    duration={1.4}
                    className="grid grid-cols-[1fr_auto_1fr] items-center gap-2"
                  >
                    <div aria-hidden="true" className="text-center">
                      <span className="font-mono text-sm">1</span>
                      <p lang="zh" className="font-brush text-6xl leading-none">
                        花椒
                      </p>
                      <p className="font-hand-caps mt-2 text-base tracking-[0.06em] uppercase">
                        Numbing first
                      </p>
                    </div>
                    <HandArrow
                      seed={61}
                      size={[80, 40]}
                      points={[
                        [4, 26],
                        [30, 12],
                        [54, 14],
                        [76, 22],
                      ]}
                      className="text-cream w-16"
                    />
                    <div aria-hidden="true" className="text-center">
                      <span className="font-mono text-sm">2</span>
                      <p lang="zh" className="font-brush text-6xl leading-none">
                        辣椒
                      </p>
                      <p className="font-hand-caps mt-2 text-base tracking-[0.06em] uppercase">
                        Heat second
                      </p>
                    </div>
                  </DrawOn>
                  <p className="font-hand text-cream/90 mt-8 text-xl leading-snug">
                    {mala.body}
                  </p>
                </figure>
              </div>
            </div>
          </section>
        ) : null}

        {/* Named for someone, with the dishes themselves. */}
        {named ? (
          <section
            aria-labelledby="chapter-named"
            data-nav-theme="light"
            className="paper-cream text-ink px-6 py-24 md:px-10"
          >
            <div className="mx-auto max-w-[1100px]">
              <p className="font-mono text-sm">Chapter 3</p>
              <h2
                id="chapter-named"
                className="font-poster mt-2 text-[clamp(2.25rem,5vw,4rem)] leading-none uppercase"
              >
                <StampedText tone="text-ink" shadow="text-chili">
                  {named.title}
                </StampedText>
              </h2>
              <p className="mt-6 max-w-[58ch] text-lg leading-relaxed">{named.body}</p>

              <ul className="mt-14 grid gap-10 sm:grid-cols-3">
                {dishes.map(({ category, item }, index) => (
                  <li key={item.slug}>
                    <Link
                      href={`/menu/${category.slug}/${item.slug}`}
                      className="group focus-visible:outline-ink block outline-offset-8"
                    >
                      <TapedFrame
                        tape="top"
                        tilt={[-2, 1.5, -1][index] ?? 0}
                        className="text-sm transition-[rotate] duration-[--duration-slow] ease-[--ease-out-expo] group-hover:!rotate-0"
                      >
                        <div className="flex flex-col gap-2 px-5 py-6">
                          <span lang="zh" className="text-chili text-2xl font-bold">
                            {item.nameZh}
                          </span>
                          <span className="font-nav relative self-start text-lg leading-snug font-bold">
                            {item.nameEn}
                            <HandUnderline
                              seed={index * 17 + 3}
                              className="text-chili absolute inset-x-0 -bottom-1 h-2"
                            />
                          </span>
                          <span className="font-mono">{formatCad(item.priceCents)}</span>
                        </div>
                      </TapedFrame>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ) : null}

        {/* The room, and what a diner said about it. */}
        <section
          aria-labelledby="chapter-room"
          data-nav-theme="dark"
          className="paper-ink text-cream px-6 py-24 md:px-10"
        >
          <div className="mx-auto grid max-w-[1100px] items-center gap-14 md:grid-cols-[1fr_1fr]">
            <div>
              <p className="font-mono text-sm">Chapter 4</p>
              <h2
                id="chapter-room"
                className="font-poster mt-2 text-[clamp(2.25rem,5vw,4rem)] leading-none uppercase"
              >
                <StampedText>{ABOUT.aside.room.title}</StampedText>
              </h2>
              <p className="font-hand text-cream/90 mt-6 max-w-[34ch] text-2xl leading-snug">
                {ABOUT.aside.room.body}
              </p>
              <address className="mt-6 font-mono text-sm leading-relaxed not-italic">
                {CONTACT.address.street}, {CONTACT.address.locality}
                <br />
                {CONTACT.hoursSummary}
              </address>
              <div className="mt-8">
                <PaperButton href="/locations">Find us</PaperButton>
              </div>
            </div>

            <TapedFrame tilt={-1.5} className="text-ink text-sm">
              <figure className="flex flex-col gap-4 px-6 py-7">
                <blockquote className="font-hand text-2xl leading-snug">
                  &ldquo;{ABOUT.aside.quote.text}&rdquo;
                </blockquote>
                <figcaption className="font-hand-caps text-chili text-base tracking-[0.06em] uppercase">
                  {ABOUT.aside.quote.author} · {ABOUT.aside.quote.date}
                </figcaption>
              </figure>
            </TapedFrame>
          </div>
        </section>

        {/* The way on. */}
        <section
          data-nav-theme="red"
          className="paper-red text-cream flex flex-col items-center px-6 py-20 text-center"
        >
          <p lang="zh" className="font-brush text-parchment text-5xl">
            恰小面
          </p>
          <p className="font-poster mt-3 text-[clamp(2rem,4vw,3.25rem)] leading-none uppercase">
            <StampedText>Come hungry</StampedText>
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <PaperButton href="/order">Order for pickup</PaperButton>
            <Link
              href="/menu"
              className="border-cream text-cream inline-flex h-12 items-center rounded-full border-2 px-8 font-mono"
            >
              See the menu
            </Link>
          </div>
        </section>
      </main>
    </PageTransition>
  );
}
