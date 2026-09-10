import Link from "next/link";
import { Branch } from "@/components/brand/branch";
import { HeroMotion } from "./hero-motion";

const WORDMARK = "7 NOODLES";

/**
 * The wordmark is split per character so the entrance can stagger. Each glyph
 * is hidden from assistive technology and the whole mark is announced once,
 * otherwise it reads out letter by letter.
 */
function Wordmark() {
  return (
    <h1 className="text-hero font-black" style={{ fontStretch: "125%" }}>
      <span className="sr-only">{WORDMARK}</span>
      <span aria-hidden="true" className="flex justify-between overflow-hidden">
        {WORDMARK.split("").map((character, index) => (
          <span key={`${character}-${index}`} data-hero-letter className="inline-block">
            {character === " " ? " " : character}
          </span>
        ))}
      </span>
    </h1>
  );
}

export function Hero() {
  return (
    <HeroMotion>
      <section className="relative flex min-h-[92svh] flex-col justify-center overflow-hidden px-6 pt-28 pb-12 md:px-10">
        <Branch
          className="pointer-events-none absolute -top-[6%] -right-[14%] h-[118%] w-auto opacity-95 md:-right-[4%]"
          limbColor="var(--color-ink)"
        />

        <div className="relative z-10">
          <div className="overflow-hidden">
            <p
              data-hero-eyebrow
              lang="zh"
              className="text-peach-text text-title font-medium"
            >
              恰小面
            </p>
          </div>

          <Wordmark />
        </div>

        <div
          data-hero-foot
          className="relative z-10 mt-14 flex flex-col gap-10 md:mt-20 md:flex-row md:items-end md:justify-between"
        >
          <p className="text-agar-text max-w-xs text-sm leading-relaxed">
            Sichuan and Chongqing noodles, hand-folded wontons and Leshan fried skewers.
            Yonge Street, North York.
          </p>

          <div className="flex max-w-md flex-col gap-5 md:items-end md:text-right">
            <p className="text-lede">
              Broth built over days. Noodles pulled to order. Nothing here is in a hurry
              except you.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/order"
                className="bg-peach text-rice hover:bg-peach-deep px-6 py-3 text-sm font-medium transition-colors duration-[--duration-fast]"
              >
                Order for pickup
              </Link>
              <Link
                href="/menu"
                className="border-agar text-ink hover:bg-ink hover:text-rice border px-6 py-3 text-sm font-medium transition-colors duration-[--duration-fast]"
              >
                View menu
              </Link>
            </div>
          </div>
        </div>
      </section>
    </HeroMotion>
  );
}
