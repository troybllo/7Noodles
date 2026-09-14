import Link from "next/link";
import { PaintedLantern } from "@/components/brand/painted-lantern";
import { HandUnderline } from "@/components/hand/hand-underline";
import { CONTACT } from "@/content/contact";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menus" },
  { href: "/order", label: "Order online" },
  { href: "/locations", label: "Locations" },
  { href: "/sustainability", label: "Sustainability" },
] as const;

const LEGAL = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms & Conditions" },
] as const;

/** Small line icons for the bottom row, drawn to one stroke weight. */
const ICONS = {
  instagram: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" />
    </>
  ),
  phone: (
    <path d="M6.6 3.8 9 3.4l1.6 4.2-2 1.3a11 11 0 0 0 6.5 6.5l1.3-2 4.2 1.6-.4 2.4a2 2 0 0 1-2.1 1.6A16.2 16.2 0 0 1 5 5.9a2 2 0 0 1 1.6-2.1Z" />
  ),
  pin: (
    <>
      <path d="M12 21s-6.5-5.9-6.5-11.2a6.5 6.5 0 0 1 13 0C18.5 15.1 12 21 12 21Z" />
      <circle cx="12" cy="9.8" r="2.4" />
    </>
  ),
} as const;

const REACH = [
  {
    icon: "instagram",
    label: `Instagram, ${CONTACT.instagram.handle}`,
    href: CONTACT.instagram.href,
  },
  { icon: "phone", label: `Call ${CONTACT.phone.display}`, href: CONTACT.phone.href },
  { icon: "pin", label: "Directions on Google Maps", href: CONTACT.map.directionsHref },
] as const;

function FooterLink({ href, children }: { href: string; children: string }) {
  return (
    <Link href={href} className="group relative inline-block py-1">
      {children}
      <HandUnderline
        seed={children.length * 7}
        className="text-chili absolute inset-x-0 -bottom-0.5 h-[0.45em]"
      />
    </Link>
  );
}

/**
 * The foot of every page, after the client's reference: navigation and hours
 * across the top, the name and a line about the food in the middle between two
 * painted lanterns, and the ways to reach the restaurant with the small print
 * along the bottom.
 *
 * Set on cream paper in ink, with red only in the lanterns and the drawn
 * underlines. Every line of copy here is already approved elsewhere on the
 * site; nothing is written for the footer alone.
 */
export function SiteFooter() {
  return (
    <footer
      data-nav-theme="light"
      className="paper-cream text-ink relative overflow-hidden px-6 pt-16 pb-8 md:px-10 lg:pt-20"
    >
      <div className="mx-auto flex max-w-[1400px] flex-col gap-12 lg:gap-6">
        <div className="font-nav flex flex-col items-center gap-6 font-bold lg:flex-row lg:justify-between">
          <nav aria-label="Footer">
            <ul className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-[0.95rem]">
              {LINKS.map((link) => (
                <li key={link.href}>
                  <FooterLink href={link.href}>{link.label}</FooterLink>
                </li>
              ))}
            </ul>
          </nav>
          <p className="text-[0.95rem]">{CONTACT.hoursSummary}</p>
        </div>

        <div className="relative grid items-center lg:grid-cols-[1fr_minmax(0,34rem)_1fr]">
          <PaintedLantern
            sizes="18rem"
            className="hidden w-[min(18rem,100%)] justify-self-start lg:block"
          />

          <div className="flex flex-col items-center text-center">
            <PaintedLantern sizes="6rem" className="mb-4 w-24 lg:hidden" />
            <Link href="/" aria-label="Seven Noodles, home">
              <span
                aria-hidden="true"
                className="bg-chili block aspect-[283/85] h-12"
                style={{
                  maskImage: "url(/brand/logo-horizontal-light.png)",
                  WebkitMaskImage: "url(/brand/logo-horizontal-light.png)",
                  maskSize: "contain",
                  WebkitMaskSize: "contain",
                  maskRepeat: "no-repeat",
                  WebkitMaskRepeat: "no-repeat",
                }}
              />
            </Link>
            <p className="font-poster mt-6 text-[clamp(2rem,4vw,3.25rem)] leading-[1.02] tracking-[-0.02em] text-balance">
              Authentic Chongqing Noodles
            </p>
            <p className="mt-5 max-w-[42ch] text-base leading-relaxed text-balance">
              Sichuan and Chongqing noodles, hand-folded wontons and Leshan fried skewers
              on Yonge Street in North York.
            </p>
            <address className="mt-3 text-sm not-italic">
              {CONTACT.address.street}, {CONTACT.address.locality}
            </address>
          </div>

          <PaintedLantern
            mirrored
            sway={8.2}
            offset={2.6}
            sizes="18rem"
            className="hidden w-[min(18rem,100%)] justify-self-end lg:block"
          />
        </div>

        <div className="border-ink/15 flex flex-col items-center gap-6 border-t pt-6 text-sm lg:flex-row lg:justify-between">
          <ul className="flex items-center gap-5">
            {REACH.map((item) => (
              <li key={item.icon}>
                <a
                  href={item.href}
                  aria-label={item.label}
                  {...(item.icon === "phone"
                    ? {}
                    : { target: "_blank", rel: "noreferrer" })}
                  className="hover:text-chili block transition-colors duration-[--duration-fast]"
                >
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.8}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="size-6"
                  >
                    {ICONS[item.icon]}
                  </svg>
                </a>
              </li>
            ))}
          </ul>

          <ul className="flex flex-wrap items-center justify-center gap-x-7 gap-y-2">
            <li>
              © {new Date().getFullYear()} {CONTACT.name}. All rights reserved.
            </li>
            {LEGAL.map((link) => (
              <li key={link.href}>
                <FooterLink href={link.href}>{link.label}</FooterLink>
              </li>
            ))}
            <li>Built by BLLO</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
