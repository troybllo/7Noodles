import Image from "next/image";
import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { Panda7 } from "@/components/brand/panda-7";
import { NAV_ITEMS } from "@/components/nav/nav-items";
import { CartButton } from "@/components/order/cart-button";
import { Button } from "@/components/ui/button";
import { HERO } from "@/content/hero";
import { HeroIntro } from "./hero-intro";

/**
 * The hero: SEVEN NOODLES across the top, two photographs, the logo beside
 * Panda 7, and a row of links. From `md` up it is exactly one screen tall,
 * the photographs taking whatever height the type leaves. On phones the
 * photographs sit side by side and Order and Menu buttons follow, so the way
 * to a bowl is on the first screen.
 *
 * On large screens the nav bar hides while this is on screen (see TopNav), so
 * its row of links is the navigation. HeroIntro animates the `data-` pieces.
 */
export function Hero() {
  return (
    <HeroIntro>
      <section
        id="hero"
        data-nav-theme="light"
        className="bg-paper text-brand px-4 pt-24 pb-4 md:flex md:h-svh md:min-h-[36rem] md:flex-col md:px-5 lg:pt-5"
      >
        <h1 className="font-display shrink-0 text-[clamp(3.25rem,min(calc((100vw_-_2.5rem)/9.8),21svh),18rem)] leading-[0.85]">
          <span className="sr-only">{HERO.title}</span>
          <span
            aria-hidden="true"
            className="flex flex-wrap gap-x-[0.2em] md:flex-nowrap"
          >
            {HERO.title.split(" ").map((word) => (
              <span key={word} className="inline-block overflow-hidden pt-[0.06em]">
                <span data-rise className="inline-block">
                  {word}
                </span>
              </span>
            ))}
          </span>
        </h1>

        <div className="mt-4 grid grid-cols-2 gap-2 md:mt-5 md:min-h-0 md:flex-1 md:grid-rows-[minmax(0,1fr)] md:gap-5">
          <div
            data-photo
            className="relative aspect-[3/4] overflow-hidden md:aspect-auto"
          >
            <Image
              src={HERO.photos.primary.src}
              alt={HERO.photos.primary.alt}
              fill
              preload
              sizes="50vw"
              className="object-cover"
              style={{ objectPosition: HERO.photos.primary.focus }}
            />
          </div>

          <div className="contents md:flex md:min-h-0 md:flex-col md:gap-5">
            <div
              data-photo
              className="relative aspect-[3/4] overflow-hidden md:aspect-auto md:min-h-0 md:flex-1"
            >
              <Image
                src={HERO.photos.secondary.src}
                alt={HERO.photos.secondary.alt}
                fill
                preload
                sizes="50vw"
                className="object-cover"
                style={{ objectPosition: HERO.photos.secondary.focus }}
              />
            </div>
            <div className="col-span-2 mt-2 flex shrink-0 items-end justify-between gap-4 md:col-span-1 md:mt-0">
              <span data-stamp className="block min-w-0">
                <Logo
                  className="h-[clamp(4.5rem,min(10vw,16svh),13rem)] w-auto max-w-full"
                  title={`${HERO.nameZh} 7 Noodles`}
                />
              </span>
              <span
                data-seal
                className="w-[clamp(4rem,min(8.5vw,14svh),9.5rem)] shrink-0"
              >
                <Panda7 alt="" sizes="9.5rem" className="w-full" />
              </span>
            </div>
          </div>
        </div>

        {/* The first step, on phones and tablets. */}
        <div data-row className="mt-5 grid grid-cols-2 gap-2 lg:hidden">
          <Button
            href={HERO.action.href}
            size="lg"
            arrow={false}
            className="px-3 whitespace-nowrap"
          >
            Order pickup
          </Button>
          <Button
            href="/menu"
            tone="outline"
            size="lg"
            arrow={false}
            className="px-3 whitespace-nowrap"
          >
            See the menu
          </Button>
        </div>

        {/* The navigation, as a row under the photographs. Desktop only. */}
        <nav
          data-row
          aria-label="Site"
          className="mt-5 hidden shrink-0 items-center justify-between gap-8 lg:flex"
        >
          <Link href="/" aria-label="Seven Noodles, home">
            <Logo variant="mark" title={null} className="h-10 w-auto" />
          </Link>
          <ul className="flex items-center gap-10 text-[0.8125rem] tracking-[0.02em] uppercase">
            {NAV_ITEMS.map((item) => (
              <li key={item.label}>
                <Link href={item.href} className="underline-offset-4 hover:underline">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-5">
            <Link
              href={HERO.action.href}
              className="border-brand hover:bg-brand hover:text-paper inline-flex h-8 items-center border px-6 text-[0.75rem] tracking-[0.14em] uppercase transition-colors"
            >
              {HERO.action.label}
            </Link>
            <CartButton />
          </div>
        </nav>
      </section>
    </HeroIntro>
  );
}
