import { PaintButton } from "@/components/ui/paint-button";
import { CONTACT } from "@/content/contact";
import { HERO } from "@/content/hero";
import { HeroMarquee } from "./hero-marquee";
import { HeroMotion } from "./hero-motion";

/**
 * The hero, after the Framer prototype: three rows of dish photography moving
 * in alternating directions behind a centred wordmark.
 *
 * The text layer ignores the pointer except where it has something to click,
 * so hovering anywhere over the grid still reaches the tiles beneath.
 */
export function Hero() {
  return (
    <HeroMotion>
      <section
        id="hero"
        data-nav-theme="dark"
        className="bg-ink-deep relative isolate h-svh min-h-[40rem] w-full overflow-hidden"
      >
        <HeroMarquee />

        {/* The bar sits over the top row; without this its labels vanish
            against a bright tile. */}
        <div
          aria-hidden="true"
          className="from-ink-deep/85 pointer-events-none absolute inset-x-0 top-0 z-10 h-32 bg-gradient-to-b to-transparent"
        />

        {/* A soft pool of dark behind the type, so it reads over any tile. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10"
          style={{
            background:
              "radial-gradient(ellipse 55% 45% at 50% 50%, rgba(10,9,8,0.72), rgba(10,9,8,0.15) 70%, transparent)",
          }}
        />

        <div className="pointer-events-none relative z-20 flex h-full flex-col items-center justify-center px-6 text-center">
          <p
            data-hero-rise
            lang="zh"
            className="font-round-cjk text-rice/90 text-[clamp(1.5rem,2.6vw,2.5rem)] leading-none"
          >
            {HERO.nameZh}
          </p>

          <h1
            data-hero-rise
            className="font-round text-rice mt-4 text-[clamp(2.25rem,7.2vw,7.5rem)] leading-[0.95] font-semibold tracking-[0.14em]"
          >
            {HERO.wordmark}
          </h1>

          <p
            data-hero-rise
            className="text-rice/80 mt-6 max-w-md text-sm leading-relaxed md:text-base"
          >
            {HERO.lede}
          </p>

          <div
            data-hero-rise
            className="pointer-events-auto mt-8 flex flex-wrap items-center justify-center gap-6"
          >
            {HERO.actions.map((action) => (
              <PaintButton
                key={action.href}
                href={action.href}
                primary={action.primary}
                tone="rice"
              >
                {action.label}
              </PaintButton>
            ))}
          </div>
        </div>

        <address
          data-hero-rise
          className="bg-ink-deep/85 text-rice/85 absolute bottom-6 left-6 z-20 flex flex-col gap-3 px-5 py-4 text-sm not-italic backdrop-blur-sm md:left-10"
        >
          <span>{CONTACT.hoursSummary}</span>
          <span className="leading-snug">
            {CONTACT.address.street}
            <br />
            {CONTACT.address.locality}, {CONTACT.address.region}
          </span>
        </address>
      </section>
    </HeroMotion>
  );
}
