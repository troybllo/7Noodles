"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGsap } from "@/components/motion/use-gsap";
import { HOME_SECTIONS } from "@/content/home-sections";
import { HandUnderline } from "@/components/hand/hand-underline";
import { NAV_ITEMS } from "./nav-items";

/**
 * Temporary top navigation, replacing the left rail.
 *
 * Fixed and overlaying content rather than occupying a column, so every
 * section below it reaches the full width of the viewport.
 *
 * Colour comes from the `[data-bar]` custom properties, which flip as each
 * section passes the viewport midpoint — the same mechanism the rail used, and
 * the reason sections still declare `data-nav-theme`.
 */
export function TopNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ticks = useRef<(HTMLSpanElement | null)[]>([]);

  const showProgress = pathname === "/";

  const scope = useGsap<HTMLElement>(
    ({ gsap, scope: bar }) => {
      for (const section of document.querySelectorAll<HTMLElement>("[data-nav-theme]")) {
        const theme = section.dataset.navTheme ?? "light";
        const apply = () => bar.setAttribute("data-bar", theme);

        gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top 50%",
            end: "bottom 50%",
            onEnter: apply,
            onEnterBack: apply,
          },
        });
      }

      if (!showProgress) return;

      /*
       * The pillars, carried over from the rail: one tick per section, lighting
       * as the reader reaches it.
       *
       * Progress is read from the document directly. A ScrollTrigger spanning
       * documentElement from "top top" to "bottom bottom" resolves to a
       * degenerate range and emits no progress at all, which is how this
       * silently did nothing the first time it was built.
       */
      let fractions: number[] = [];

      const measure = () => {
        const maxScroll = Math.max(
          1,
          document.documentElement.scrollHeight - window.innerHeight,
        );
        fractions = HOME_SECTIONS.map((section) => {
          const element = document.getElementById(section.id);
          return element ? Math.min(1, element.offsetTop / maxScroll) : 0;
        });
      };

      const light = () => {
        const maxScroll = Math.max(
          1,
          document.documentElement.scrollHeight - window.innerHeight,
        );
        const progress = window.scrollY / maxScroll;
        fractions.forEach((fraction, index) => {
          const tick = ticks.current[index];
          if (tick) tick.dataset.reached = String(progress >= fraction - 0.01);
        });
      };

      const refresh = () => {
        measure();
        light();
      };

      refresh();
      window.addEventListener("scroll", light, { passive: true });
      ScrollTrigger.addEventListener("refresh", refresh);

      return () => {
        window.removeEventListener("scroll", light);
        ScrollTrigger.removeEventListener("refresh", refresh);
      };
    },
    // Re-run on every navigation, not only when crossing to or from the
    // homepage. The bar stays mounted across client-side route changes, and
    // triggers built for one page's sections would otherwise keep reading the
    // previous page's elements, leaving the bar coloured for a page the reader
    // has already left.
    [pathname, showProgress],
  );

  return (
    <>
      <a
        href="#main"
        className="bg-ink text-rice sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] focus:px-4 focus:py-2 focus:text-sm"
      >
        Skip to content
      </a>

      <header
        ref={scope}
        data-bar="light"
        className="fixed inset-x-0 top-0 z-50 flex flex-col"
        // Named so page transitions leave the bar in place; see globals.css.
        style={{ viewTransitionName: "site-nav" }}
      >
        <div className="flex items-center justify-between px-6 py-5 md:px-10">
          {/*
            The client's logo, used as a mask and filled with the bar's own
            label colour. The only version available is white on transparent,
            which would vanish over the light sections; as a mask it takes
            whatever colour the bar is currently using and inverts with it.

            Shown at up to 48px from an 85px source, so it stays sharp on
            high-density screens.
          */}
          <Link href="/" aria-label="Seven Noodles, home" className="block">
            <span
              aria-hidden="true"
              className="block aspect-[283/85] h-9 transition-colors duration-[--duration-base] md:h-12"
              style={{
                backgroundColor: "var(--bar-label)",
                maskImage: "url(/brand/logo-horizontal-light.png)",
                WebkitMaskImage: "url(/brand/logo-horizontal-light.png)",
                maskSize: "contain",
                WebkitMaskSize: "contain",
                maskRepeat: "no-repeat",
                WebkitMaskRepeat: "no-repeat",
              }}
            />
          </Link>

          <nav aria-label="Primary" className="hidden md:block">
            <ul className="flex items-center gap-9">
              {NAV_ITEMS.map((item, index) => {
                const active =
                  item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className="group font-nav relative block py-1 text-[1.05rem] font-semibold tracking-[0.04em] uppercase"
                      style={{ color: "var(--bar-label)" }}
                    >
                      {item.label}
                      {/* Drawn under the current page, and drawn on when hovered. */}
                      <HandUnderline
                        seed={index * 13 + 5}
                        drawn={active}
                        className="absolute inset-x-0 -bottom-1 h-2"
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            className="font-nav text-sm font-semibold tracking-[0.06em] uppercase md:hidden"
            style={{ color: "var(--bar-label)" }}
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>

        {showProgress ? (
          <div
            aria-hidden="true"
            className="flex h-px w-full items-center gap-1 px-6 md:px-10"
          >
            {HOME_SECTIONS.map((section, index) => (
              <span
                key={section.id}
                ref={(node) => {
                  ticks.current[index] = node;
                }}
                data-reached="false"
                className="h-px flex-1 bg-[var(--bar-muted)] opacity-40 transition-all duration-[--duration-slow] ease-[--ease-out-expo] data-[reached=true]:bg-[var(--bar-accent)] data-[reached=true]:opacity-100"
              />
            ))}
          </div>
        ) : null}
      </header>

      <div
        id="mobile-nav"
        hidden={!open}
        className="paper-red text-cream fixed inset-0 z-40 flex flex-col justify-center gap-7 px-8 md:hidden"
      >
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            className="flex items-baseline gap-4"
          >
            <span className="font-poster text-5xl leading-none">{item.label}</span>
            <span lang="zh" className="font-hand-cjk text-cream/80 text-xl">
              {item.zh}
            </span>
          </Link>
        ))}
      </div>
    </>
  );
}
