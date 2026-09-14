"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useGsap } from "@/components/motion/use-gsap";
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

const LABEL =
  "font-nav relative flex items-center gap-[0.6em] font-bold uppercase [text-shadow:0_0.08em_0.12em_rgb(40_6_4/0.55)]";

/**
 * The site's navigation bar, after the approved hero mockup.
 *
 * On large screens it is laid out in the same design units as the hero
 * (`--u`, one pixel of the 1074 x 600 mockup), so the logo and every label sit
 * exactly where the mockup puts them at any width. Below that, it becomes a
 * logo and a Menu button opening a full-screen menu on red paper.
 *
 * Items with children open a small menu: on hover for a mouse, on click or
 * Enter for everyone, closing on Escape, on a click elsewhere, or when a link
 * is followed.
 *
 * Colour comes from the `[data-bar]` custom properties, which flip as each
 * section declaring `data-nav-theme` passes the middle of the viewport.
 */
export function TopNav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const bar = useRef<HTMLDivElement>(null);

  const scope = useGsap<HTMLElement>(
    ({ gsap, scope: header }) => {
      for (const section of document.querySelectorAll<HTMLElement>("[data-nav-theme]")) {
        const theme = section.dataset.navTheme ?? "light";
        const apply = () => header.setAttribute("data-bar", theme);

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
    },
    // Re-run on every navigation: the bar stays mounted across client-side
    // route changes, and triggers built for one page's sections would keep
    // reading the previous page's elements.
    [pathname],
  );

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
        ref={scope}
        data-bar="light"
        className="frame-stage fixed inset-x-0 top-0 z-50"
        // Named so page transitions leave the bar in place; see globals.css.
        style={{ viewTransitionName: "site-nav" }}
      >
        <div
          ref={bar}
          data-nav-bar
          className="frame relative mx-auto flex items-center justify-between px-6 py-4 lg:block lg:h-[calc(var(--u)*90)] lg:w-[calc(var(--u)*1074)] lg:p-0"
        >
          {/*
            The client's logo, used as a mask and filled with the bar's own
            label colour, so it inverts with the bar over light sections.
            The file's artwork sits inside a small margin, so the box is placed
            to land the drawn logo on the mockup's 211 x 52 at (69, 35).
          */}
          <Link
            href="/"
            aria-label="Seven Noodles, home"
            onClick={closeAll}
            className="block lg:absolute lg:top-[calc(var(--u)*26.5)] lg:left-[calc(var(--u)*58.7)]"
          >
            <span
              aria-hidden="true"
              className="block aspect-[283/85] h-11 transition-colors duration-[--duration-base] lg:h-[calc(var(--u)*69.2)]"
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
            className="hidden lg:absolute lg:top-[calc(var(--u)*43)] lg:left-[calc(var(--u)*365)] lg:block"
          >
            <ul className="flex items-center gap-[calc(var(--u)*38)] text-[calc(var(--u)*14.5)]">
              {NAV_ITEMS.map((item, index) => {
                const current = isCurrent(item, pathname);
                const menuId = `nav-menu-${index}`;
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
                        style={{ color: "var(--bar-label)" }}
                      >
                        {item.label}
                        <Chevron open={open} />
                        <HandUnderline
                          seed={index * 13 + 5}
                          drawn={current}
                          className="absolute inset-x-0 -bottom-[0.45em] h-[0.5em]"
                        />
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
                        <HandUnderline
                          seed={index * 13 + 5}
                          drawn={current}
                          className="absolute inset-x-0 -bottom-[0.45em] h-[0.5em]"
                        />
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
