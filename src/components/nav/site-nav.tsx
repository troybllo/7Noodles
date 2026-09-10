"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useGsap } from "@/components/motion/use-gsap";
import { HOME_SECTIONS } from "@/content/home-sections";
import { NavSpine } from "./nav-spine";
import { SectionPillars } from "./section-pillars";
import { NAV_ITEMS } from "./nav-items";

/** Node i sits at (i + 1) / (items + 1) of the rail height, matching the spine. */
function nodeOffset(index: number, total: number): string {
  return `${((index + 1) / (total + 1)) * 100}%`;
}

function useActiveIndex(): number {
  const pathname = usePathname();
  return NAV_ITEMS.findIndex((item) =>
    item.href === "/" ? pathname === "/" : pathname.startsWith(item.href),
  );
}

function NavLink({
  item,
  index,
  active,
  onNavigate = () => {},
}: {
  item: (typeof NAV_ITEMS)[number];
  index: number;
  active: boolean;
  /** Called on click so the mobile overlay can close itself. */
  onNavigate?: () => void;
}) {
  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      onClick={onNavigate}
      className="group absolute flex -translate-y-1/2 items-center gap-3 pl-[calc(50%-0.4rem)]"
      style={{ top: nodeOffset(index, NAV_ITEMS.length) }}
    >
      <span
        className={`size-3 shrink-0 rounded-full transition-transform duration-[--duration-base] ease-[--ease-out-expo] group-hover:scale-125 ${
          active ? "bg-peach scale-125" : "bg-ink"
        }`}
      />
      <span className="flex flex-col leading-tight">
        <span
          className={`text-xs font-semibold tracking-[0.18em] uppercase transition-colors duration-[--duration-fast] ${
            active ? "text-peach-text" : "text-ink group-hover:text-peach-text"
          }`}
        >
          {item.label}
        </span>
        <span lang="zh" className="text-agar-text text-[0.7rem]">
          {item.zh}
        </span>
      </span>
    </Link>
  );
}

export function SiteNav() {
  const activeIndex = useActiveIndex();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Pillars map the sections of the page being read, so they only mean
  // anything on the homepage.
  const showPillars = pathname === "/";

  // Body scroll is locked while the overlay is open, or the page behind it
  // scrolls under the reader's finger.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  const railScope = useGsap<HTMLElement>(({ gsap }) => {
    // The peach strand fills as the page scrolls, so the rail doubles as a
    // position indicator rather than only a menu.
    gsap.to("[data-spine-progress]", {
      strokeDashoffset: 0,
      ease: "none",
      scrollTrigger: {
        trigger: document.documentElement,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.4,
      },
    });
  });

  return (
    <>
      <a
        href="#main"
        className="bg-ink text-rice sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] focus:px-4 focus:py-2 focus:text-sm"
      >
        Skip to content
      </a>

      {/* Desktop rail */}
      <nav
        ref={railScope}
        aria-label="Primary"
        className="fixed top-0 left-0 z-50 hidden h-svh w-36 lg:block xl:w-44"
      >
        <NavSpine
          nodes={NAV_ITEMS.length}
          activeIndex={activeIndex}
          className="absolute inset-0 h-full w-16 xl:w-20"
        />
        <div className="absolute inset-0 w-16 xl:w-20">
          {showPillars ? <SectionPillars sections={HOME_SECTIONS} /> : null}
          {NAV_ITEMS.map((item, index) => (
            <NavLink
              key={item.href}
              item={item}
              index={index}
              active={index === activeIndex}
            />
          ))}
        </div>
      </nav>

      {/* Mobile bar */}
      <div className="bg-rice/85 fixed inset-x-0 top-0 z-50 flex items-center justify-between px-5 py-4 backdrop-blur-sm lg:hidden">
        <Link href="/" className="text-sm font-black tracking-[0.2em] uppercase">
          7 Noodles
        </Link>
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          className="text-xs font-semibold tracking-[0.18em] uppercase"
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      <div
        id="mobile-nav"
        hidden={!open}
        className="bg-rice fixed inset-0 z-40 lg:hidden"
      >
        <nav aria-label="Primary" className="relative h-full pt-20">
          <NavSpine
            nodes={NAV_ITEMS.length}
            activeIndex={activeIndex}
            className="absolute inset-y-0 left-0 h-full w-24"
          />
          <div className="absolute inset-y-0 left-0 w-24">
            {NAV_ITEMS.map((item, index) => (
              <NavLink
                key={item.href}
                item={item}
                index={index}
                active={index === activeIndex}
                onNavigate={() => setOpen(false)}
              />
            ))}
          </div>
        </nav>
      </div>
    </>
  );
}
