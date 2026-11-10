import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { HandArrow } from "@/components/hand/hand-arrow";
import { HOW_TO_EAT, KITCHEN, NUMBING, SIGNATURES, type Step } from "@/content/chapters";
import { DISH_MEDIA, type Media } from "@/content/menu-media";
import { findDish } from "@/lib/menu";
import { CategoriesTrack } from "./categories-track";

const TOTAL = "04";

function Photo({
  photo,
  sizes,
  className,
}: {
  photo: Media | undefined;
  sizes: string;
  className?: string;
}) {
  return (
    <div className={`bg-brand-soft relative overflow-hidden ${className ?? ""}`}>
      {photo ? (
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          sizes={sizes}
          className="object-cover"
        />
      ) : null}
    </div>
  );
}

/**
 * One chapter: the shared chrome — a rule with the chapter's label and its
 * place in the run — over the chapter's own layout. `data-panel-dim` is the
 * shade CategoriesTrack lays over a panel as the next one covers it.
 */
function ChapterPanel({
  id,
  index,
  label,
  title,
  titleZh,
  intro,
  children,
}: {
  id: string;
  index: string;
  label: string;
  title: string;
  titleZh: string;
  intro: string;
  children: ReactNode;
}) {
  return (
    <section
      aria-labelledby={`chapter-${id}`}
      className="bg-paper border-brand/10 relative flex w-full flex-col border-t px-5 pt-14 pb-14 first:border-t-0 md:h-svh md:border-t-0 md:px-10 md:pt-28 md:pb-8"
    >
      <div
        data-panel-dim
        aria-hidden="true"
        className="bg-brand pointer-events-none absolute inset-0 z-20 opacity-0"
      />

      <div className="text-brand border-brand/15 relative flex items-center justify-between border-b pb-3">
        <span className="eyebrow flex items-baseline gap-2">
          <span lang="zh" className="font-cjk text-sm font-bold">
            故事
          </span>
          Our story
        </span>
        <span className="eyebrow hidden md:inline">{label}</span>
        <span className="text-xs tabular-nums">
          {index} <span className="text-brand-deep">/ {TOTAL}</span>
        </span>
      </div>

      <div className="mt-6 flex flex-col gap-8 md:min-h-0 md:flex-1 md:flex-row md:gap-10">
        <header className="md:w-[30%] md:shrink-0">
          <h3
            id={`chapter-${id}`}
            className="font-display text-brand text-[clamp(2.25rem,4.2vw,4.25rem)] leading-[0.95]"
          >
            {title}
          </h3>
          <p lang="zh" className="font-cjk text-brand mt-3 text-2xl font-black">
            {titleZh}
          </p>
          <p className="text-brand-deep mt-5 max-w-[36ch] text-[0.95rem] leading-relaxed">
            {intro}
          </p>
        </header>
        <div className="md:min-h-0 md:flex-1">{children}</div>
      </div>
    </section>
  );
}

/**
 * A numbered step with its photograph: above the text in a row of columns
 * (the how-to), or beside it in a grid of cards (the kitchen).
 */
function StepCard({
  step,
  number,
  sizes,
  beside = false,
}: {
  step: Step;
  number: number;
  sizes: string;
  beside?: boolean;
}) {
  return (
    <li
      className={`flex min-h-0 flex-row items-stretch gap-4 ${beside ? "md:gap-5" : "md:flex-col md:gap-3"}`}
    >
      <Photo
        photo={step.photo}
        sizes={sizes}
        className={
          beside
            ? "aspect-square w-[42%] shrink-0 md:aspect-auto"
            : "aspect-square w-[42%] shrink-0 md:aspect-auto md:min-h-0 md:w-auto md:flex-1"
        }
      />
      <div
        className={`flex flex-col justify-center gap-3 ${beside ? "" : "md:min-h-[5.5rem] md:flex-row md:justify-start"}`}
      >
        <span className="font-display text-brand text-3xl leading-none tabular-nums">
          {String(number).padStart(2, "0")}
        </span>
        <div>
          <p className="text-brand font-semibold uppercase">{step.title}</p>
          <p className="text-brand-deep mt-1 text-sm leading-snug">{step.body}</p>
        </div>
      </div>
    </li>
  );
}

function HowToEat() {
  return (
    <ChapterPanel id="how-to-eat" {...HOW_TO_EAT}>
      <ol className="relative grid h-full gap-6 md:grid-cols-3 md:gap-8">
        {HOW_TO_EAT.steps.map((step, index) => (
          <StepCard
            key={step.title}
            step={step}
            number={index + 1}
            sizes="(min-width: 768px) 22vw, 80vw"
          />
        ))}
        {/* Arrows between the steps, drawn as on a note. */}
        {[0, 1].map((gap) => (
          <HandArrow
            key={gap}
            seed={41 + gap * 7}
            size={[80, 40]}
            points={[
              [4, 30],
              [30, 10],
              [56, 12],
              [76, 26],
            ]}
            className="text-brand absolute top-[38%] hidden w-14 md:block"
            style={{ left: `calc(${(gap + 1) * 33.33}% - 2.4rem)` }}
          />
        ))}
      </ol>
    </ChapterPanel>
  );
}

function Signatures() {
  return (
    <ChapterPanel id="signatures" {...SIGNATURES}>
      <ul className="grid h-full grid-cols-2 gap-x-4 gap-y-5 md:grid-cols-3 md:grid-rows-2 md:gap-x-6">
        {SIGNATURES.dishes.map(({ slug, line }) => {
          const found = findDish(slug);
          if (!found) return null;
          const { item, category } = found;
          return (
            <li key={slug} className="min-h-0">
              <Link
                href={`/menu/${category.slug}/${item.slug}`}
                className="group flex h-full min-h-0 flex-col gap-2"
              >
                <Photo
                  photo={DISH_MEDIA[slug]?.photo}
                  sizes="(min-width: 768px) 20vw, 40vw"
                  className="aspect-[4/3] md:aspect-auto md:min-h-0 md:flex-1"
                />
                <p className="text-brand line-clamp-2 min-h-[2.5em] text-sm leading-tight font-semibold uppercase underline-offset-4 group-hover:underline">
                  {item.nameEn}
                </p>
                <p className="text-brand-deep -mt-1 line-clamp-2 min-h-[2.75em] text-xs leading-snug">
                  <span lang="zh" className="font-cjk font-bold">
                    {item.nameZh}
                  </span>{" "}
                  · {line}
                </p>
              </Link>
            </li>
          );
        })}
      </ul>
    </ChapterPanel>
  );
}

function Numbing() {
  return (
    <ChapterPanel id="numbing" {...NUMBING}>
      <div className="grid h-full gap-8 md:grid-cols-[1.1fr_1fr] md:gap-10">
        <div className="flex flex-col justify-between gap-8">
          <p
            lang="zh"
            aria-hidden="true"
            className="font-cjk text-brand text-[clamp(7rem,16vw,15rem)] leading-[0.8] font-black"
          >
            麻
          </p>
          {/* The order, as a diagram: peppercorn first, chili second. */}
          <figure>
            <figcaption className="sr-only">
              Sichuan peppercorn first, for the numbing; chili second, for the heat.
            </figcaption>
            <div aria-hidden="true" className="flex items-center gap-4">
              <div>
                <p lang="zh" className="font-cjk text-brand text-4xl font-black">
                  花椒
                </p>
                <p className="eyebrow text-brand-deep mt-1">Numbing first</p>
              </div>
              <HandArrow
                seed={61}
                size={[80, 40]}
                points={[
                  [4, 26],
                  [30, 12],
                  [54, 14],
                  [76, 22],
                ]}
                className="text-brand w-16"
              />
              <div>
                <p lang="zh" className="font-cjk text-brand text-4xl font-black">
                  辣椒
                </p>
                <p className="eyebrow text-brand-deep mt-1">Heat second</p>
              </div>
            </div>
          </figure>
          <div className="text-brand-deep flex max-w-[44ch] flex-col gap-3 text-sm leading-relaxed">
            <p className="text-brand text-base font-semibold">{NUMBING.order}</p>
            <p>{NUMBING.adjust}</p>
          </div>
        </div>
        <Photo
          photo={NUMBING.photo}
          sizes="(min-width: 768px) 30vw, 80vw"
          className="aspect-[4/5] md:aspect-auto"
        />
      </div>
    </ChapterPanel>
  );
}

function Kitchen() {
  return (
    <ChapterPanel id="kitchen" {...KITCHEN}>
      <ol className="grid h-full gap-5 md:grid-cols-2 md:grid-rows-2 md:gap-6">
        {KITCHEN.steps.map((step, index) => (
          <StepCard
            beside
            key={step.title}
            step={step}
            number={index + 1}
            sizes="(min-width: 768px) 14vw, 40vw"
          />
        ))}
      </ol>
    </ChapterPanel>
  );
}

/**
 * The story run: four chapters that slide over one another — how to eat dry
 * noodles, the signature dishes, the numbing of 麻, and the kitchen.
 *
 * Sits above the showcase in the stacking order so that, with the showcase
 * stuck to the top of the viewport, this section scrolls up over it and covers
 * it. That vertical overlap is pure CSS. The hand-over between chapters is in
 * CategoriesTrack.
 */
export function Chapters() {
  return (
    <section
      id="chapters"
      data-nav-theme="light"
      className="bg-paper relative z-10 w-full"
    >
      <h2 className="sr-only">Our story</h2>
      <CategoriesTrack>
        <HowToEat />
        <Signatures />
        <Numbing />
        <Kitchen />
      </CategoriesTrack>
    </section>
  );
}
