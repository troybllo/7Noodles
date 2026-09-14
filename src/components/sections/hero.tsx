import Image from "next/image";
import type { CSSProperties } from "react";
import { ChiliDoodles } from "@/components/hand/chili-doodles";
import { HandArrow } from "@/components/hand/hand-arrow";
import { Steam } from "@/components/hand/steam";
import { PaperButton } from "@/components/ui/paper-button";
import { HERO, type Callout } from "@/content/hero";
import { HeroIntro } from "./hero-intro";

/**
 * Places an element at the mockup's own pixel coordinates on large screens.
 * `--u` is one pixel of the 1074 x 600 mockup (see `.frame` in globals.css).
 * Below `lg` the element sits in normal flow instead.
 */
const AT =
  "lg:absolute lg:top-[calc(var(--u)*var(--y))] lg:left-[calc(var(--u)*var(--x))]";
const at = (x: number, y: number, extra: Record<string, number> = {}): CSSProperties =>
  ({
    "--x": x,
    "--y": y,
    ...Object.fromEntries(Object.entries(extra).map(([k, v]) => [`--${k}`, v])),
  }) as CSSProperties;

/** Painted chilli slices on the paper, in mockup pixels: position, size, turn and strength. */
const SLICES = [
  { variant: "a", x: 616, y: 184, size: 49, rotate: -18, opacity: 0.65 },
  { variant: "b", x: 950, y: 142, size: 42, rotate: 24, opacity: 0.5 },
  { variant: "c", x: 548, y: 290, size: 53, rotate: 8, opacity: 0.6 },
  { variant: "a", x: 590, y: 372, size: 46, rotate: 40, opacity: 0.45 },
  { variant: "b", x: 964, y: 256, size: 60, rotate: -30, opacity: 0.7 },
  { variant: "c", x: 1020, y: 292, size: 49, rotate: 12, opacity: 0.55 },
  { variant: "a", x: 980, y: 372, size: 49, rotate: 64, opacity: 0.6 },
  { variant: "b", x: 1040, y: 412, size: 42, rotate: -8, opacity: 0.45 },
  { variant: "c", x: 632, y: 462, size: 38, rotate: 20, opacity: 0.4 },
  { variant: "a", x: 974, y: 452, size: 53, rotate: -44, opacity: 0.6 },
  { variant: "b", x: 478, y: 290, size: 46, rotate: 30, opacity: 0.35 },
  { variant: "c", x: 1052, y: 238, size: 34, rotate: -12, opacity: 0.4 },
] as const;

/** Dried chilli flakes under the brush characters, as proportions of the dish box. */
const FLAKES = [
  { left: "72%", top: "20%", size: "1.1%", rotate: 20, color: "#d8912f" },
  { left: "76.5%", top: "24.5%", size: "0.8%", rotate: -10, color: "#b3261e" },
  { left: "69%", top: "26%", size: "0.7%", rotate: 45, color: "#e0a24a" },
  { left: "80%", top: "18.5%", size: "0.9%", rotate: 12, color: "#c2331f" },
  { left: "35%", top: "22%", size: "0.7%", rotate: -30, color: "#d8912f" },
  { left: "86%", top: "27%", size: "0.6%", rotate: 60, color: "#e0a24a" },
] as const;

/** The few slices kept on small screens, placed around the bowl in its own box. */
const PHONE_SLICES = [
  { variant: "a", left: "6%", top: "18%", rotate: -18 },
  { variant: "b", left: "86%", top: "30%", rotate: 24 },
  { variant: "c", left: "84%", top: "82%", rotate: -30 },
] as const;

function Note({
  callout,
  chineseFirst,
  className,
}: {
  callout: Callout;
  chineseFirst: boolean;
  className: string;
}) {
  const chinese = (
    <span lang="zh" className="font-hand-cjk block text-[3.9cqw] tracking-[0.1em]">
      {callout.zh}
    </span>
  );
  return (
    <p
      data-note
      // A soft shadow keeps the notes legible where they cross the pale bowl.
      className={`text-cream absolute text-center leading-[1.05] [text-shadow:0_0.05em_0.25em_rgb(40_6_4/0.6)] ${className}`}
    >
      {chineseFirst ? chinese : null}
      <span className="font-hand-caps block text-[2.9cqw] tracking-[0.03em] uppercase [-webkit-text-stroke:0.02em_currentColor]">
        {callout.en.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </span>
      {chineseFirst ? null : chinese}
    </p>
  );
}

/**
 * The hero, built to the approved mockup at its own pixel coordinates: red
 * crumpled paper, 7 NOODLES in worn poster lettering with a stamped shadow, a
 * handwritten tagline, a cream Order Now pill, and the bowl cut out on the
 * paper under brush characters with chalk arrows pointing into it.
 *
 * Everything decorative is drawn or generated for the site: the paper, the
 * chilli doodles and slices, the arrows and the steam. Only the bowl is a
 * photograph.
 */
export function Hero() {
  const { dish } = HERO;
  const [numeral, word] = HERO.title.toUpperCase().split(" ") as [string, string];
  const rimHeight = dish.photo.rim.bottom - dish.photo.rim.top;

  return (
    <HeroIntro>
      <section
        id="hero"
        data-nav-theme="red"
        className="paper-red frame-stage text-cream relative isolate min-h-[100dvh] overflow-hidden"
      >
        {/* Roughens the edges of the poster lettering, as if printed by hand. */}
        <svg aria-hidden="true" className="absolute h-0 w-0">
          <filter id="hero-rough-edges" x="-5%" y="-10%" width="110%" height="120%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.9"
              numOctaves="2"
              seed="4"
            />
            <feDisplacementMap in="SourceGraphic" scale="2.2" />
          </filter>
        </svg>

        <ChiliDoodles className="-z-10 text-[#d0615a] opacity-30" />

        <div className="frame relative mx-auto flex min-h-[100dvh] flex-col px-6 pt-28 pb-16 lg:block lg:h-[calc(var(--u)*600)] lg:min-h-0 lg:w-[calc(var(--u)*1074)] lg:p-0">
          <Steam
            className={`text-cream/25 hidden -rotate-[58deg] lg:block ${AT} lg:w-[calc(var(--u)*150)]`}
            style={at(500, 300)}
          />

          {SLICES.map((slice, index) => (
            <div
              key={index}
              data-chili
              aria-hidden="true"
              className={`hidden lg:block ${AT} lg:w-[calc(var(--u)*var(--size))]`}
              style={at(slice.x, slice.y, { size: slice.size })}
            >
              <Image
                src={`/textures/chili-slice-${slice.variant}.webp`}
                width={320}
                height={320}
                alt=""
                sizes="48px"
                className="animate-drift h-auto w-full blur-[0.4px]"
                style={{
                  // Strength is set on the image, so the arrival can fade the
                  // wrapper in fully without overriding it.
                  opacity: slice.opacity,
                  rotate: `${slice.rotate}deg`,
                  animationDelay: `${-index * 1.3}s`,
                }}
              />
            </div>
          ))}

          <h1
            className={`font-poster text-parchment text-[clamp(3.25rem,15vw,5.5rem)] leading-none tracking-[-0.049em] whitespace-nowrap ${AT} lg:text-[calc(var(--u)*81.3)]`}
            style={at(83, 204)}
          >
            <span className="sr-only">{HERO.title}</span>
            <span aria-hidden="true" className="inline-flex gap-[0.32em]">
              {[
                { text: numeral, from: "left" },
                { text: word, from: "right" },
              ].map(({ text, from }) => (
                <span key={text} data-slide={from} className="relative inline-block">
                  {/* The stamped shadow: the word again in ink, dropped down and left. */}
                  <span
                    className="print-worn text-ink absolute inset-0 translate-x-[-0.036em] translate-y-[0.17em]"
                    style={{ filter: "url(#hero-rough-edges)" }}
                  >
                    {text}
                  </span>
                  <span
                    className="print-worn relative"
                    style={{ filter: "url(#hero-rough-edges)" }}
                  >
                    {text}
                  </span>
                </span>
              ))}
            </span>
          </h1>

          <p
            className={`font-hand mt-4 text-[clamp(1.25rem,5.4vw,1.75rem)] leading-[1.6] tracking-[0.045em] text-[#f5f6f6] [-webkit-text-stroke:0.018em_currentColor] lg:mt-0 ${AT} lg:text-[calc(var(--u)*27.5)] lg:leading-[calc(var(--u)*42)] lg:whitespace-nowrap`}
            style={at(83, 295)}
          >
            {HERO.tagline.map((line) => (
              <span key={line} data-write className="block">
                {line}
              </span>
            ))}
          </p>

          <div data-pop className={`mt-8 lg:mt-0 ${AT}`} style={at(70, 404)}>
            <PaperButton href={HERO.action.href}>{HERO.action.label}</PaperButton>
          </div>

          {/* The dish, a 450 x 450 box in mockup pixels. Everything inside is
              placed as a proportion of it, so it holds together at any size. */}
          <div
            className={`[container-type:inline-size] relative mx-auto mt-14 aspect-square w-full max-w-[28rem] lg:mt-0 lg:max-w-none ${AT} lg:w-[calc(var(--u)*450)]`}
            style={at(560, 80)}
          >
            {PHONE_SLICES.map((slice) => (
              <Image
                key={slice.left}
                src={`/textures/chili-slice-${slice.variant}.webp`}
                width={320}
                height={320}
                alt=""
                aria-hidden="true"
                sizes="48px"
                data-chili
                className="animate-drift absolute w-[8%] opacity-70 lg:hidden"
                style={{ left: slice.left, top: slice.top, rotate: `${slice.rotate}deg` }}
              />
            ))}

            <p
              lang="zh"
              className="font-brush text-parchment absolute top-[3%] left-[26%] text-[17.2cqw] leading-none tracking-[0.48em] whitespace-nowrap"
              style={{ textShadow: "-0.035em 0.035em 0 rgb(52 16 10 / 0.85)" }}
            >
              {[...dish.nameZh].map((character) => (
                <span key={character} data-brush className="inline-block">
                  {character}
                </span>
              ))}
            </p>

            {/* Dried chilli flakes scattered under the characters. */}
            {FLAKES.map((flake) => (
              <span
                key={`${flake.left}-${flake.top}`}
                aria-hidden="true"
                data-chili
                className="absolute rounded-[40%]"
                style={{
                  left: flake.left,
                  top: flake.top,
                  width: flake.size,
                  height: flake.size,
                  rotate: `${flake.rotate}deg`,
                  backgroundColor: flake.color,
                }}
              />
            ))}

            {/* The bowl, cut out along its rim and set down on the paper. */}
            <div
              data-bowl
              className="absolute top-[28.6%] left-[7.33%] w-[77.33%] drop-shadow-[0_1.6cqw_2.2cqw_rgb(40_6_4/0.5)]"
            >
              <div
                className="relative w-full overflow-hidden"
                style={{
                  aspectRatio: `1 / ${rimHeight}`,
                  clipPath: "ellipse(50% 50% at 50% 50%)",
                }}
              >
                <Image
                  src={dish.photo.src}
                  alt={dish.photo.alt}
                  fill
                  preload
                  sizes="(min-width: 1024px) 34vw, 90vw"
                  quality={90}
                  className="object-cover"
                  style={{
                    objectPosition: `50% ${(dish.photo.rim.top / (1 - rimHeight)) * 100}%`,
                  }}
                />
              </div>
            </div>

            <Note
              callout={dish.callouts.upper}
              chineseFirst
              className="top-[35.3%] left-[65.4%] w-[21.5%]"
            />
            <HandArrow
              seed={21}
              size={[75, 55]}
              points={[
                [60, 7],
                [70, 27],
                [54, 43],
                [14, 47],
              ]}
              className="text-cream absolute top-[44.4%] left-[66.7%] w-[16.7%]"
            />

            <Note
              callout={dish.callouts.lower}
              chineseFirst={false}
              className="top-[83.6%] left-[9.2%] w-[19%]"
            />
            <HandArrow
              seed={37}
              size={[75, 60]}
              points={[
                [12, 54],
                [7, 33],
                [24, 17],
                [60, 10],
              ]}
              className="text-cream absolute top-[71.1%] left-[12.2%] w-[16.7%]"
            />
          </div>
        </div>
      </section>
    </HeroIntro>
  );
}
