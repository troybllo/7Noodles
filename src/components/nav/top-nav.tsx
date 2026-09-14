"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { HandUnderline } from "@/components/hand/hand-underline";
import { isCurrent, NAV_ITEMS, type NavItem } from "./nav-items";

/** A hand-drawn chevron, as a thick rounded tick under the baseline. */
function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 14 8"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`h-[0.62em] w-[1.3em] transition-transform duration-[--duration-base] ease-[--ease-out-expo] ${open ? "rotate-180" : ""}`}
    >
      <path d="M1.5 1.8 Q 7 7.4 12.5 1.6" />
    </svg>
  );
}

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

/** Eases every size and position change between the large and compact bar. */
const SETTLE = "duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]";

const LABEL = `font-nav relative flex items-center gap-[0.6em] font-bold uppercase [text-shadow:var(--bar-label-shadow)]`;

/**
 * The site's navigation bar.
 *
 * At the top of the home page it is large and laid out exactly as the approved
 * hero mockup, in the same design units as the hero (`--u`, one pixel of the
 * 1074 x 600 mockup), sitting straight on the red paper. Once the reader
 * scrolls, or on any other page, it settles into a compact bar: the logo
 * shrinks to the left, the links gather to the right, and a surface slides in
 * behind them.
 *
 * Colour follows whatever is under the bar. On every scroll it looks at the
 * page beneath its own position and takes the nearest `data-nav-theme`
 * (red, dark or light), which sets the label colour and the compact surface.
 * Nested themes work, so a light block inside a dark section reads as light.
 *
 * Below `lg` it is a logo and a Menu button opening a full-screen menu.
 * Items with children open a small menu on hover or click, closing on Escape,
 * on a press elsewhere, or when a link is followed.
 */
export function TopNav() {
  const pathname = usePathname();
  const scrolled = useScrolled();
  const compact = pathname !== "/" || scrolled;

  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const header = useRef<HTMLElement>(null);
  const bar = useRef<HTMLDivElement>(null);

  // Read the theme of whatever sits beneath the bar, now and on every scroll,
  // resize and navigation.
  useEffect(() => {
    let frame = 0;

    const probe = () => {
      frame = 0;
      const element = header.current;
      if (!element) return;

      const y = Math.min(PROBE_Y, window.innerHeight - 1);
      for (const hit of document.elementsFromPoint(window.innerWidth / 2, y)) {
        if (element.contains(hit)) continue;
        const theme = hit.closest<HTMLElement>("[data-nav-theme]")?.dataset.navTheme;
        if (theme) {
          element.setAttribute("data-bar", theme);
          return;
        }
      }
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(probe);
    };

    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [pathname]);

  // While a menu is open, Escape or a press outside the bar closes it.
  useEffect(() => {
    if (!openMenu) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenMenu(null);
    };
    const onPointer = (event: PointerEvent) => {
      if (!bar.current?.contains(event.target as Node)) setOpenMenu(null);
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
    setMobileOpen(false);
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
        className="bg-ink text-rice sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] focus:px-4 focus:py-2 focus:text-sm"
      >
        Skip to content
      </a>

      <header
        ref={header}
        data-bar="light"
        data-compact={compact}
        className="frame-stage group/nav fixed inset-x-0 top-0 z-50"
        // Named so page transitions leave the bar in place; see globals.css.
        style={{ viewTransitionName: "site-nav" }}
      >
        {/* The compact bar's surface, faded in once the page has scrolled. */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 bg-transparent opacity-0 backdrop-blur-md transition-opacity group-data-[compact=true]/nav:opacity-100 ${SETTLE}`}
          style={{ boxShadow: "var(--bar-edge)" }}
        />

        <div
          ref={bar}
          data-nav-bar
          className={`frame relative mx-auto flex h-20 items-center justify-between px-6 transition-[height] group-data-[compact=true]/nav:h-14 lg:block lg:h-[calc(var(--u)*90)] lg:w-[calc(var(--u)*1074)] lg:px-0 lg:group-data-[compact=true]/nav:h-16 ${SETTLE}`}
        >
          {/*
            The client's logo, used as a mask and filled with the bar's label
            colour, so it inverts with the bar. Large, the box is placed so the
            drawn logo lands on the mockup's 211 x 52 at (69, 35); compact, it
            sits in the bar's left margin.
          */}
          <Link
            href="/"
            aria-label="Seven Noodles, home"
            onClick={closeAll}
            className={`block transition-[left,top] lg:absolute lg:top-[calc(var(--u)*26.5)] lg:left-[calc(var(--u)*58.7)] lg:group-data-[compact=true]/nav:top-3 lg:group-data-[compact=true]/nav:left-[calc(var(--u)*40)] ${SETTLE}`}
          >
            <span
              aria-hidden="true"
              className={`block aspect-[283/85] h-11 transition-[height] group-data-[compact=true]/nav:h-9 lg:h-[calc(var(--u)*69.2)] lg:group-data-[compact=true]/nav:h-10 ${SETTLE}`}
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

          <nav
            aria-label="Primary"
            className={`hidden transition-[left,top,translate] lg:absolute lg:top-[calc(var(--u)*43)] lg:left-[calc(var(--u)*365)] lg:block lg:group-data-[compact=true]/nav:top-1/2 lg:group-data-[compact=true]/nav:left-[calc(100%-var(--u)*40)] lg:group-data-[compact=true]/nav:-translate-x-full lg:group-data-[compact=true]/nav:-translate-y-1/2 ${SETTLE}`}
          >
            <ul
              className={`flex w-max items-center gap-[calc(var(--u)*38)] text-[calc(var(--u)*14.5)] whitespace-nowrap transition-[gap,font-size] group-data-[compact=true]/nav:gap-7 group-data-[compact=true]/nav:text-[0.8rem] ${SETTLE}`}
            >
              {NAV_ITEMS.map((item, index) => {
                const current = isCurrent(item, pathname);
                const menuId = `nav-menu-${index}`;
                const open = openMenu === item.label;
                const underline = (
                  <HandUnderline
                    seed={index * 13 + 5}
                    drawn={current}
                    className="absolute inset-x-0 -bottom-[0.45em] h-[0.5em]"
                  />
                );

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
                        style={{ color: "var(--bar-label)" }}
                      >
                        {item.label}
                        <Chevron open={open} />
                        {underline}
                      </button>
                    ) : (
                      <Link
                        href={item.href}
                        aria-current={current ? "page" : undefined}
                        onClick={closeAll}
                        className={`group ${LABEL}`}
                        style={{ color: "var(--bar-label)" }}
                      >
                        {item.label}
                        {underline}
                      </Link>
                    )}

                    {item.children ? (
                      <div
                        id={menuId}
                        hidden={!open}
                        // The padding bridges the gap under the label, so the
                        // pointer can travel down without the menu closing.
                        className="absolute top-full left-[-1.2em] pt-[1.1em]"
                      >
                        <ul className="paper-cream text-ink min-w-[15em] rounded-[0.9em] px-[0.4em] py-[0.5em] text-[1.05em] shadow-[0_0.8em_2em_rgb(40_6_4/0.35)]">
                          {item.children.map((child, childIndex) => (
                            <li key={child.href + child.label}>
                              <Link
                                href={child.href}
                                onClick={closeAll}
                                className="group font-nav relative block rounded-[0.5em] px-[0.8em] py-[0.55em] font-bold whitespace-nowrap"
                              >
                                <span className="relative">
                                  {child.label}
                                  <HandUnderline
                                    seed={index * 29 + childIndex * 7 + 3}
                                    className="text-chili absolute inset-x-0 -bottom-[0.35em] h-[0.45em]"
                                  />
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

          <button
            type="button"
            onClick={() => setMobileOpen((value) => !value)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            className="font-nav text-sm font-bold tracking-[0.06em] uppercase lg:hidden"
            style={{ color: "var(--bar-label)" }}
          >
            {mobileOpen ? "Close" : "Menu"}
          </button>
        </div>
      </header>

      <div
        id="mobile-nav"
        hidden={!mobileOpen}
        className="paper-red text-cream fixed inset-0 z-40 overflow-y-auto px-8 pt-28 pb-12 lg:hidden"
      >
        <ul className="flex flex-col gap-7">
          {NAV_ITEMS.map((item) => (
            <li key={item.label}>
              {item.children ? (
                <>
                  <p className="flex items-baseline gap-3">
                    <span className="font-poster text-parchment text-4xl uppercase">
                      {item.label}
                    </span>
                    <span lang="zh" className="text-cream/80 text-lg">
                      {item.zh}
                    </span>
                  </p>
                  <ul className="mt-2 flex flex-col gap-1.5 pl-1">
                    {item.children.map((child) => (
                      <li key={child.href + child.label}>
                        <Link
                          href={child.href}
                          onClick={closeAll}
                          className="font-nav text-cream text-lg font-bold"
                        >
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <Link
                  href={item.href}
                  onClick={closeAll}
                  className="flex items-baseline gap-3"
                >
                  <span className="font-poster text-parchment text-4xl uppercase">
                    {item.label}
                  </span>
                  <span lang="zh" className="text-cream/80 text-lg">
                    {item.zh}
                  </span>
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
