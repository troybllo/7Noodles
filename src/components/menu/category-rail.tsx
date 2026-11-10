"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export type RailCategory = { slug: string; nameEn: string; nameZh: string };

/**
 * The category rail itself.
 *
 * These are links, not client-side tab state: each category is its own page,
 * so it can be shared, bookmarked and indexed. On the overview pages they jump
 * to sections instead, and the tab for the section in view lights up.
 *
 * From `lg` the tabs wrap, so none is ever cut off. Below that the rail
 * scrolls sideways, fading at whichever edge has more, and keeps the current
 * tab in view. The rail's height is published as `--rail-h` so the sections
 * it jumps to stop clear of it (`scroll-mt-rail`).
 */
export function CategoryRail({
  categories,
  active,
  anchors = false,
  className,
}: {
  categories: RailCategory[];
  active?: string | undefined;
  anchors?: boolean | undefined;
  className?: string | undefined;
}) {
  const rail = useRef<HTMLElement>(null);
  const [inView, setInView] = useState<string | undefined>(undefined);
  const [edges, setEdges] = useState({ start: true, end: true });
  const current = anchors ? inView : active;

  // Publish the rail's height, and track which edges have more to scroll to.
  useEffect(() => {
    const element = rail.current;
    if (!element) return;
    const measure = () => {
      document.documentElement.style.setProperty("--rail-h", `${element.offsetHeight}px`);
      const { scrollLeft, scrollWidth, clientWidth } = element;
      setEdges({
        start: scrollLeft <= 2,
        end: scrollLeft + clientWidth >= scrollWidth - 2,
      });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    element.addEventListener("scroll", measure, { passive: true });
    return () => {
      observer.disconnect();
      element.removeEventListener("scroll", measure);
    };
  }, []);

  // On the overview pages, follow the section in the middle of the screen.
  useEffect(() => {
    if (!anchors) return;
    const sections = categories
      .map(({ slug }) => document.getElementById(slug))
      .filter((section): section is HTMLElement => section !== null);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setInView(entry.target.id);
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    for (const section of sections) observer.observe(section);
    return () => observer.disconnect();
  }, [anchors, categories]);

  // Keep the current tab in view, scrolling the rail only, never the page.
  useEffect(() => {
    const element = rail.current;
    const tab = element?.querySelector<HTMLElement>(`[data-slug="${current}"]`);
    if (!element || !tab || element.scrollWidth <= element.clientWidth) return;
    element.scrollTo({
      left: tab.offsetLeft - (element.clientWidth - tab.offsetWidth) / 2,
      behavior: "smooth",
    });
  }, [current]);

  const fade = `linear-gradient(to right, ${edges.start ? "#000" : "transparent"}, #000 2.5rem, #000 calc(100% - 2.5rem), ${edges.end ? "#000" : "transparent"})`;

  return (
    <nav
      ref={rail}
      aria-label="Menu categories"
      style={{ maskImage: fade, WebkitMaskImage: fade }}
      className={`bg-paper sticky top-16 z-30 -mx-6 snap-x scroll-px-6 [scrollbar-width:none] overflow-x-auto px-6 py-3 md:-mx-10 md:scroll-px-10 md:px-10 lg:overflow-visible [&::-webkit-scrollbar]:hidden ${className ?? ""}`}
    >
      <ul className="flex w-max gap-2 lg:w-auto lg:flex-wrap">
        {categories.map((category) => {
          const isActive = category.slug === current;
          const tab = `flex min-h-11 snap-start items-center gap-2 border px-4 text-sm font-medium whitespace-nowrap transition-[background-color,border-color,color,scale] duration-(--duration-fast) ease-(--ease-out-soft) active:scale-[0.97] ${
            isActive
              ? "border-brand bg-brand text-paper"
              : "border-brand/30 text-brand hover:border-brand"
          }`;
          const label = (
            <>
              {category.nameEn}
              <span
                lang="zh"
                className={`font-cjk text-xs ${isActive ? "text-paper" : "text-brand-deep"}`}
              >
                {category.nameZh}
              </span>
            </>
          );

          return (
            <li key={category.slug} data-slug={category.slug} className="snap-start">
              {anchors ? (
                // A plain anchor, not a router link: this stays on the page, and
                // smooth scrolling takes it from here.
                <a
                  href={`#${category.slug}`}
                  aria-current={isActive ? "true" : undefined}
                  className={tab}
                >
                  {label}
                </a>
              ) : (
                <Link
                  href={`/menu/${category.slug}`}
                  aria-current={isActive ? "page" : undefined}
                  transitionTypes={["tab"]}
                  className={tab}
                >
                  {label}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
