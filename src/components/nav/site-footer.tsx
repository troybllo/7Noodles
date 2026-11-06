import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { Panda7 } from "@/components/brand/panda-7";
import { CONTACT } from "@/content/contact";

/** The links either side of the mark in the bottom row. */
const LEFT = [
  { href: "/locations", label: "Contact" },
  { href: "/events", label: "Events" },
  { href: CONTACT.instagram.href, label: "Instagram", external: true },
] as const;

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
  const className = "underline-offset-4 hover:underline";
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
 * The foot of every page: Panda 7 with the brand line, then one row of links
 * with the logo's round mark at its centre.
 */
export function SiteFooter() {
  return (
    <footer
      data-nav-theme="light"
      className="bg-paper text-brand px-4 pt-24 pb-6 md:px-5"
    >
      <div className="flex flex-col items-center gap-6 text-center">
        <Panda7 pose="wave" alt="" className="w-36 sm:w-44" sizes="11rem" />
        <p className="flex flex-col items-center gap-2 text-sm">
          <span lang="zh" className="font-cjk text-lg font-bold">
            一筷入魂，恰一碗川味人间
          </span>
          <span className="sr-only">: </span>
          Come for a bowl. Stay for a little warmth.
        </p>
      </div>

      <div className="mt-20 flex flex-col items-center gap-6 text-[0.75rem] tracking-[0.04em] uppercase lg:flex-row lg:justify-between">
        <ul className="flex flex-wrap justify-center gap-x-10 gap-y-2 lg:flex-1 lg:justify-between lg:pr-10">
          {LEFT.map((link) => (
            <li key={link.label}>
              <FooterLink {...link} />
            </li>
          ))}
        </ul>
        <Link href="/" aria-label="Seven Noodles, home">
          <Logo variant="mark" title={null} className="w-12" />
        </Link>
        <ul className="flex flex-wrap justify-center gap-x-10 gap-y-2 lg:flex-1 lg:justify-between lg:pl-10">
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
