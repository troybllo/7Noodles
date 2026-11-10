import Image from "next/image";
import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { RevealFrame } from "@/components/motion/reveal-frame";
import { Panda7 } from "@/components/brand/panda-7";
import { ABOUT } from "@/content/about";
import { CONTACT } from "@/content/contact";
import { PHOTOS } from "@/content/photos";
import { SCENERY } from "@/content/scenery";

/** The links either side of the mark in the bottom row. */
const LEFT = [
  { href: "/locations", label: "Contact" },
  { href: "/events", label: "Events" },
  { href: CONTACT.instagram.href, label: "Instagram", external: true },
] as const;

/** A few frames from the shop, above the links. */
const SNAPSHOTS = [
  PHOTOS.chiliOilOnWontons,
  PHOTOS.birthdayBowl,
  PHOTOS.kitchenCurtain,
  PHOTOS.vitasoy,
];

const RIGHT = [
  { href: "/menu", label: "Menu" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
] as const;

function FooterLink({
  href,
  label,
  external = false,
}: {
  href: string;
  label: string;
  external?: boolean;
}) {
  const className =
    "inline-flex min-h-11 items-center underline-offset-4 hover:underline";
  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {label}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  ) : (
    <Link href={href} className={className}>
      {label}
    </Link>
  );
}

/**
 * The foot of every page: Panda 7 with the brand line between bamboo and a
 * hibiscus, a strip of photographs from the shop, then one row of links with
 * the logo's round mark at its centre.
 */
export function SiteFooter() {
  return (
    <footer
      data-nav-theme="light"
      className="bg-paper text-brand relative overflow-hidden px-4 pt-24 pb-[calc(6rem+env(safe-area-inset-bottom))] md:px-5 lg:pb-6"
    >
      <Image
        src={SCENERY.bamboo.src}
        width={SCENERY.bamboo.width}
        height={SCENERY.bamboo.height}
        alt=""
        sizes="(min-width: 768px) 20vw, 7rem"
        className="motion-safe:animate-margin-sway pointer-events-none absolute top-10 -left-8 h-auto w-28 origin-bottom select-none md:top-6 md:-left-6 md:w-[clamp(11rem,20vw,22rem)]"
      />
      <Image
        src={SCENERY.hibiscus.src}
        width={SCENERY.hibiscus.width}
        height={SCENERY.hibiscus.height}
        alt=""
        sizes="(min-width: 768px) 18vw, 7rem"
        className="motion-safe:animate-margin-drift pointer-events-none absolute top-16 -right-8 h-auto w-28 select-none md:top-12 md:-right-4 md:w-[clamp(10rem,18vw,20rem)]"
      />
      <div className="relative flex flex-col items-center gap-6 text-center">
        <Panda7 alt="" className="w-36 sm:w-44" sizes="11rem" />
        <p className="flex flex-col items-center gap-2 text-sm">
          <span lang="zh" className="font-cjk text-lg font-bold">
            {ABOUT.tagline.zh}
          </span>
          <span className="sr-only">: </span>
          {ABOUT.tagline.en}
        </p>
      </div>

      <a
        href={CONTACT.instagram.href}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative mx-auto mt-16 block max-w-3xl"
      >
        <span className="sr-only">
          More from the shop on Instagram, {CONTACT.instagram.handle} (opens in a new tab)
        </span>
        <ul aria-hidden="true" className="grid grid-cols-4 gap-2 md:gap-3">
          {SNAPSHOTS.map((photo, index) => (
            <li
              key={photo.src}
              className={`transition-transform duration-(--duration-slow) ease-(--ease-out-expo) group-hover:rotate-0 group-active:scale-[0.98] group-active:rotate-0 ${index % 2 ? "rotate-[1.5deg]" : "-rotate-[1.5deg]"}`}
            >
              <RevealFrame delay={index * 0.08} className="aspect-square">
                <div className="relative h-full w-full">
                  <Image
                    src={photo.src}
                    alt=""
                    fill
                    sizes="(min-width: 768px) 12rem, 25vw"
                    className="object-cover"
                  />
                </div>
              </RevealFrame>
            </li>
          ))}
        </ul>
        <span className="eyebrow mt-4 block text-center underline-offset-4 group-hover:underline">
          {CONTACT.instagram.handle}
        </span>
      </a>

      <div className="relative mt-16 flex flex-col items-center gap-6 text-[0.75rem] tracking-[0.04em] uppercase lg:flex-row lg:justify-between">
        <ul className="flex flex-wrap justify-center gap-x-8 lg:flex-1 lg:justify-between lg:pr-10">
          {LEFT.map((link) => (
            <li key={link.label}>
              <FooterLink {...link} />
            </li>
          ))}
        </ul>
        <Link
          href="/"
          aria-label="Seven Noodles, home"
          className="inline-flex min-h-12 items-center"
        >
          <Logo variant="mark" title={null} className="w-12" />
        </Link>
        <ul className="flex flex-wrap justify-center gap-x-8 lg:flex-1 lg:justify-between lg:pl-10">
          {RIGHT.map((link) => (
            <li key={link.label}>
              <FooterLink {...link} />
            </li>
          ))}
          <li>Site by BLLO</li>
          <li>© {new Date().getFullYear()}</li>
        </ul>
      </div>
    </footer>
  );
}
