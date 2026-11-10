"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Wordmark } from "@/components/brand/wordmark";
import { CartButton } from "@/components/order/cart-button";
import { useMediaQuery } from "@/lib/use-media-query";
import { MobileNav } from "./mobile-nav";
import { isCurrent, NAV_ITEMS, type NavItem } from "./nav-items";

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 12 8"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`h-[0.45em] w-[0.7em] opacity-70 transition-transform duration-(--duration-base) ease-(--ease-out-expo) ${open ? "rotate-180" : ""}`}
    >
      <path d="M1.5 1.75 6 6.25l4.5-4.5" />
    </svg>
  );
}

/** A rule under the current page's link, drawn in from the left on hover. */
function Underline({ current }: { current: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`absolute inset-x-0 -bottom-1 h-px origin-left bg-current transition-transform duration-(--duration-base) ease-(--ease-out-expo) group-hover:scale-x-100 ${current ? "scale-x-100" : "scale-x-0"}`}
    />
  );
}

const menuIdOf = (label: string) =>
  `nav-menu-${label.toLowerCase().replace(/\W+/g, "-")}`;

/** How far the page scrolls before the large bar settles into the compact one. */
const COMPACT_AFTER = 48;

/** Where, from the top of the viewport, the bar reads the section beneath it. */
const PROBE_Y = 40;

const subscribeToScroll = (onChange: () => void) => {
  window.addEventListener("scroll", onChange, { passive: true });
  return () => window.removeEventListener("scroll", onChange);
};

/** Whether the page has scrolled past the top. False on the server. */
function useScrolled(): boolean {
  return useSyncExternalStore(
    subscribeToScroll,
    () => window.scrollY > COMPACT_AFTER,
    () => false,
  );
}

/**
 * Whether the home page's hero, which carries its own name and navigation,
 * has scrolled out from under the bar. True on the server so the bar is
 * hidden in the home page's static HTML rather than flashing over the hero.
 */
let heroShowing = true;

function useHeroInView(active: boolean): boolean {
  // Watched with an observer rather than measured on every scroll, which
  // would force a layout per frame.
  const subscribe = useCallback(
    (onChange: () => void) => {
      const hero = active ? document.getElementById("hero") : null;
      if (!hero) return () => {};
      heroShowing = true;
      const observer = new IntersectionObserver(
        ([entry]) => {
          heroShowing = entry?.isIntersecting ?? false;
          onChange();
        },
        { rootMargin: "-80px 0px 0px 0px" },
      );
      observer.observe(hero);
      return () => observer.disconnect();
    },
    [active],
  );
  return useSyncExternalStore(
    subscribe,
    () => active && heroShowing,
    () => active,
  );
}

/** Eases every size change between the large and compact bar. */
const SETTLE = "duration-(--duration-slow) ease-(--ease-out-expo)";

const LABEL = "relative flex items-center gap-1.5 uppercase";

/**
 * The site's navigation bar.
 *
 * On the home page, on large screens, it stays hidden while the hero (which
 * has its own row of links) is on screen. Elsewhere it is compact from the
 * start. Its colours follow the nearest `data-nav-theme` under it.
 *
 * Below `lg` it is the logo, the cart and a Menu button (see MobileNav).
 * Items with children open a small menu on hover or click, closing on Escape
 * (focus goes back to the trigger), a press elsewhere, or a followed link.
 */
export function TopNav() {
  const pathname = usePathname();
  const scrolled = useScrolled();
  const compact = pathname !== "/" || scrolled;
  const hidden = useHeroInView(pathname === "/");
  const large = useMediaQuery("(min-width: 64rem)", false);

  // Held in state rather than written to the element, so a re-render can
  // never put back the initial value over what the probe found.
  const [bar, setBar] = useState("light");
  // Open for the page it was opened on, so navigating anywhere closes it.
  const [mobileOpenOn, setMobileOpenOn] = useState<string | null>(null);
  const mobileOpen = mobileOpenOn === pathname;
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const header = useRef<HTMLElement>(null);
  const barRow = useRef<HTMLDivElement>(null);

  // Read the theme of whatever sits beneath the bar, now and whenever the
  // page under it may have changed.
  useEffect(() => {
    let frame = 0;

    let retries = 0;

    const probe = () => {
      frame = 0;
      const element = header.current;
      if (!element) return;

      const y = Math.min(PROBE_Y, window.innerHeight - 1);
      for (const hit of document.elementsFromPoint(window.innerWidth / 2, y)) {
        if (element.contains(hit)) continue;
        const theme = hit.closest<HTMLElement>("[data-nav-theme]")?.dataset.navTheme;
        if (theme) {
          retries = 0;
          setBar(theme);
          return;
        }
      }

      // Nothing themed under the bar yet. On first load the page can be hit-
      // tested before it has laid out, so look again for a short while.
      if (retries < 120) {
        retries += 1;
        frame = requestAnimationFrame(probe);
      }
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(probe);
    };

    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    // Content can change under the bar without a scroll: a loading state
    // giving way to its page, or a section mounting. Nodes being added or
    // removed is the signal; style changes from animation are not observed.
    const observer = new MutationObserver(schedule);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [pathname]);

  // While a menu is open, Escape or a press outside the bar closes it.
  useEffect(() => {
    if (!openMenu) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      document
        .querySelector<HTMLElement>(`[aria-controls="${menuIdOf(openMenu)}"]`)
        ?.focus();
      setOpenMenu(null);
    };
    const onPointer = (event: PointerEvent) => {
      if (!barRow.current?.contains(event.target as Node)) setOpenMenu(null);
    };

    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [openMenu]);

  const closeAll = () => {
    setOpenMenu(null);
    setMobileOpenOn(null);
  };

  const hoverOpen = (item: NavItem) => (event: React.PointerEvent) => {
    if (event.pointerType === "mouse") setOpenMenu(item.label);
  };
  const hoverClose = (event: React.PointerEvent) => {
    if (event.pointerType === "mouse") setOpenMenu(null);
  };

  return (
    <>
      <a
        href="#main"
        className="bg-brand text-paper sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] focus:px-4 focus:py-2 focus:text-sm"
      >
        Skip to content
      </a>

      <header
        ref={header}
        data-bar={bar}
        data-compact={compact}
        // Only large screens hide it: below `lg` the bar holds the Menu button,
        // and the hero's own row of links is a desktop layout. Hidden, it is
        // also inert, so keyboard focus never lands on links out of sight.
        inert={hidden && large}
        className={`group/nav fixed inset-x-0 top-0 z-50 transition-transform duration-(--duration-slow) ease-(--ease-out-expo) ${hidden ? "lg:pointer-events-none lg:-translate-y-full" : ""}`}
        // Named so page transitions leave the bar in place; see globals.css.
        style={{ viewTransitionName: "site-nav" }}
      >
        {/* The compact bar's surface, faded in once the page has scrolled. */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 opacity-0 transition-opacity lg:backdrop-blur-md group-data-[compact=true]/nav:opacity-100 ${SETTLE}`}
          style={{ background: "var(--bar-surface)", boxShadow: "var(--bar-edge)" }}
        />

        <div
          ref={barRow}
          data-nav-bar
          className={`relative mx-auto flex h-16 max-w-[1400px] items-center justify-between gap-4 px-[max(1.25rem,env(safe-area-inset-left))] md:px-10 lg:h-24 lg:gap-8 lg:transition-[height] lg:group-data-[compact=true]/nav:h-16 ${SETTLE}`}
          style={{ color: "var(--bar-label)" }}
        >
          <Link
            href="/"

            onClick={closeAll}
            className={`flex min-h-11 shrink-0 origin-left items-center text-[1.35rem] transition-transform lg:scale-[1.4] lg:group-data-[compact=true]/nav:scale-100 ${SETTLE}`}
          >
            <Wordmark />
          </Link>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-10 text-[0.8125rem] tracking-[0.02em] whitespace-nowrap">
              {NAV_ITEMS.map((item) => {
                const current = isCurrent(item, pathname);
                const menuId = menuIdOf(item.label);
                const open = openMenu === item.label;

                return (
                  <li
                    key={item.label}
                    className="relative"
                    onPointerEnter={item.children ? hoverOpen(item) : undefined}
                    onPointerLeave={item.children ? hoverClose : undefined}
                  >
                    {item.children ? (
                      <button
                        type="button"
                        aria-expanded={open}
                        aria-controls={menuId}
                        onClick={() => setOpenMenu(open ? null : item.label)}
                        className={`group ${LABEL}`}
                      >
                        {item.label}
                        <Chevron open={open} />
                        <Underline current={current} />
                      </button>
                    ) : (
                      <Link
                        href={item.href}
                        aria-current={current ? "page" : undefined}
                        onClick={closeAll}
                        className={`group ${LABEL}`}
                      >
                        {item.label}
                        <Underline current={current} />
                      </Link>
                    )}

                    {item.children ? (
                      <div
                        id={menuId}
                        hidden={!open}
                        // The padding bridges the gap under the label, so the
                        // pointer can travel down without the menu closing.
                        className="absolute top-full -left-4 pt-4"
                      >
                        <ul className="bg-paper text-brand border-brand min-w-56 border p-2">
                          {item.children.map((child) => (
                            <li key={child.href + child.label}>
                              <Link
                                href={child.href}
                                onClick={closeAll}
                                className="hover:bg-brand hover:text-paper flex items-baseline justify-between gap-6 px-4 py-2.5 text-sm transition-colors"
                              >
                                {child.label}
                                <span lang="zh" className="font-cjk text-xs">
                                  {child.zh}
                                </span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-3 lg:gap-5">
            <Link
              href="/order"
              onClick={closeAll}
              className="inline-flex h-11 items-center border border-current px-3.5 text-[0.6875rem] tracking-[0.14em] uppercase transition-[background-color,color,scale] duration-(--duration-fast) ease-(--ease-out-soft) hover:bg-[var(--bar-label)] hover:text-[var(--bar-surface)] active:scale-95 lg:h-8 lg:px-5 lg:text-[0.75rem]"
            >
              Order<span className="hidden lg:inline">&nbsp;now</span>
            </Link>
            <CartButton />

            <button
              type="button"
              onClick={() => setMobileOpenOn(pathname)}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
              className="-mr-2 inline-flex min-h-11 items-center px-2 text-sm font-semibold tracking-[0.08em] uppercase lg:hidden"
            >
              Menu
            </button>
          </div>
        </div>
      </header>

      <MobileNav open={mobileOpen} onClose={() => setMobileOpenOn(null)} />
    </>
  );
}
