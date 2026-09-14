import Image from "next/image";
import { ChiliDoodles } from "@/components/hand/chili-doodles";
import { HandArrow } from "@/components/hand/hand-arrow";
import { Steam } from "@/components/hand/steam";
import { PaperButton } from "@/components/ui/paper-button";
import { HERO } from "@/content/hero";
import { HeroIntro } from "./hero-intro";

/** A shadow stepped one pixel at a time, so the letters read as stamped in relief. */
const STAMPED_SHADOW = Array.from(
  { length: 6 },
  (_, i) => `-${i + 1}px ${i + 1}px 0 var(--color-ink)`,
).join(", ");

/** Painted chilli slices scattered around the bowl, in the dish column's own units. */
const SLICES = [
  { src: "a", left: "2%", top: "12%", size: "14%", rotate: -18, depth: 0.6, phone: true },
  { src: "b", left: "84%", top: "2%", size: "12%", rotate: 24, depth: 1.1, phone: false },
  { src: "c", left: "90%", top: "40%", size: "15%", rotate: 8, depth: 0.8, phone: true },
  {
    src: "a",
    left: "-8%",
    top: "56%",
    size: "12%",
    rotate: 40,
    depth: 1.2,
    phone: false,
  },
  {
    src: "b",
    left: "76%",
    top: "84%",
    size: "13%",
    rotate: -30,
    depth: 0.7,
    phone: true,
  },
  { src: "c", left: "30%", top: "90%", size: "10%", rotate: 12, depth: 1, phone: false },
  { src: "a", left: "58%", top: "10%", size: "8%", rotate: 64, depth: 1.3, phone: false },
] as const;

/**
 * The hero, after the approved mockup: red crumpled paper, the name in worn
 * poster lettering with a stamped shadow, a handwritten line, and a bowl cut
 * out on the paper with hand-drawn notes pointing into it.
 *
 * Everything decorative is drawn or generated for the site: the paper, the
 * chilli doodles and slices, the arrows and the steam. Only the bowl is a
 * photograph.
 */
export function Hero() {
  const { dish } = HERO;
  // Letters are stamped one at a time, but each word stays on one line.
  const words = HERO.title.toUpperCase().split(" ");
  const rimHeight = dish.photo.rim.bottom - dish.photo.rim.top;

  return (
    <HeroIntro>
      <section
        id="hero"
        data-nav-theme="red"
        className="paper-red text-cream relative isolate overflow-hidden"
      >
        <ChiliDoodles className="text-chili-deep -z-10 opacity-45" />

        <div className="mx-auto grid min-h-[100dvh] max-w-[1400px] items-center gap-y-6 px-6 pt-28 pb-16 md:px-10 lg:grid-cols-[1.05fr_1fr] lg:gap-x-10 lg:pt-24">
          <div className="relative">
            <h1 className="font-poster text-[clamp(3rem,7.1vw,7.75rem)] leading-[0.92]">
              <span className="sr-only">{HERO.title}</span>
              <span aria-hidden="true" className="flex flex-wrap gap-x-[0.28em]">
                {words.map((word) => (
                  <span key={word} className="inline-flex whitespace-nowrap">
                    {[...word].map((letter, index) => (
                      <span
                        // Letters repeat within a word ("OO"), so position is the key.
                        key={`${word}-${index}`}
                        data-stamp
                        className="relative inline-block"
                      >
                        {/* The stamped shadow: the letter again in ink, stepped down and left. */}
                        <span
                          className="text-ink absolute inset-0"
                          style={{ textShadow: STAMPED_SHADOW }}
                        >
                          {letter}
                        </span>
                        <span className="text-cream print-worn relative">{letter}</span>
                      </span>
                    ))}
                  </span>
                ))}
              </span>
            </h1>

            <p
              data-rise
              className="font-hand mt-5 max-w-[30ch] text-[clamp(1.3rem,2.2vw,2.1rem)] leading-snug tracking-[0.04em] text-balance"
            >
              {HERO.tagline}
            </p>

            <div data-rise className="mt-9">
              <PaperButton href={HERO.action.href}>{HERO.action.label}</PaperButton>
            </div>
          </div>

          {/* The dish. Positions inside are proportions of this column, so the
              composition scales as one piece. */}
          <div className="relative mx-auto aspect-[1/1.05] w-full max-w-[34rem]">
            <p
              lang="zh"
              data-rise
              className="font-brush absolute inset-x-0 top-0 text-center text-[clamp(3rem,7vw,6rem)] leading-none tracking-[0.5em]"
              style={{ textShadow: "-3px 3px 0 var(--color-ink)" }}
            >
              {dish.nameZh}
            </p>

            <Steam className="text-cream/45 absolute top-[12%] left-[4%] w-[36%]" />

            {SLICES.map((slice, index) => (
              <div
                key={index}
                data-parallax={slice.depth}
                aria-hidden="true"
                className={`absolute ${slice.phone ? "" : "hidden sm:block"}`}
                style={{ left: slice.left, top: slice.top, width: slice.size }}
              >
                <Image
                  src={`/textures/chili-slice-${slice.src}.webp`}
                  width={320}
                  height={320}
                  alt=""
                  sizes="80px"
                  className="animate-drift h-auto w-full"
                  style={{
                    rotate: `${slice.rotate}deg`,
                    animationDelay: `${-index * 1.3}s`,
                  }}
                />
              </div>
            ))}

            {/* The bowl, cut out along its rim and set down on the paper. */}
            <div
              data-bowl
              className="absolute inset-x-[4%] top-[22%] drop-shadow-[0_18px_22px_rgb(40_6_4/0.45)]"
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
                  sizes="(min-width: 1024px) 520px, 90vw"
                  quality={90}
                  className="object-cover"
                  style={{
                    objectPosition: `50% ${(dish.photo.rim.top / (1 - rimHeight)) * 100}%`,
                  }}
                />
              </div>
            </div>

            <p
              data-rise
              className="absolute top-[18%] right-0 w-[32%] text-center leading-tight sm:right-[-2%] sm:w-[26%]"
            >
              <span
                lang="zh"
                className="font-hand-cjk block text-[clamp(0.95rem,1.4vw,1.25rem)]"
              >
                {dish.callouts.upper.zh}
              </span>
              <span className="font-hand block text-[clamp(0.7rem,0.95vw,0.85rem)] font-bold tracking-[0.06em] uppercase">
                {dish.callouts.upper.en}
              </span>
            </p>
            <HandArrow
              seed={21}
              size={[90, 80]}
              points={[
                [74, 2],
                [80, 30],
                [60, 58],
                [26, 72],
              ]}
              className="absolute top-[30%] right-[4%] w-[17%]"
            />

            <p
              data-rise
              className="absolute bottom-[4%] left-0 w-[32%] text-center leading-tight sm:w-[26%]"
            >
              <span className="font-hand block text-[clamp(0.7rem,0.95vw,0.85rem)] font-bold tracking-[0.06em] uppercase">
                {dish.callouts.lower.en}
              </span>
              <span
                lang="zh"
                className="font-hand-cjk block text-[clamp(0.95rem,1.4vw,1.25rem)]"
              >
                {dish.callouts.lower.zh}
              </span>
            </p>
            <HandArrow
              seed={37}
              size={[90, 80]}
              points={[
                [12, 78],
                [8, 48],
                [30, 22],
                [66, 12],
              ]}
              className="absolute bottom-[16%] left-[12%] w-[17%]"
            />
          </div>
        </div>
      </section>
    </HeroIntro>
  );
}
