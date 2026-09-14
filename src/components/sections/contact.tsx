import Image from "next/image";
import Link from "next/link";
import { CONTACT } from "@/content/contact";
import { PHOTOS } from "@/content/hero";

const PANEL = "rounded-xl border border-rice/10 bg-ink";

/**
 * The foot of the page: a dark bento grid, after the client's reference.
 *
 * Every detail comes from content/contact.ts, so this section, the hero card
 * and the structured data cannot disagree. The reference's email and social
 * handles are absent on purpose — none exist for this restaurant yet, and a
 * placeholder address would get mail sent to nobody.
 *
 * The reference's navigation pill is omitted: the site already has a
 * persistent top bar, and a second one would duplicate it.
 */
export function Contact() {
  return (
    <section
      id="contact"
      data-nav-theme="dark"
      aria-labelledby="contact-heading"
      className="bg-ink-deep text-rice relative z-10 w-full px-3 pt-24 pb-3 md:px-4"
    >
      <div className="grid gap-3 lg:h-[calc(100svh-7rem)] lg:min-h-[40rem] lg:grid-cols-12 lg:grid-rows-2">
        {/* The large tile. */}
        <div
          className={`${PANEL} relative min-h-[18rem] overflow-hidden lg:col-span-6 lg:row-span-2`}
        >
          <Image
            src={PHOTOS.noodleSoup}
            alt="A bowl of beef noodle soup with greens and chilli oil"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            quality={90}
            className="object-cover"
          />
          <div className="from-ink-deep/85 absolute inset-0 bg-gradient-to-t via-transparent to-transparent" />
          <h2
            id="contact-heading"
            className="font-round text-rice absolute bottom-6 left-6 text-[clamp(3rem,7vw,7rem)] leading-none font-light tracking-[0.08em] md:bottom-8 md:left-8"
          >
            CONTACT
          </h2>
        </div>

        {/* Opening hours. */}
        <div className={`${PANEL} flex flex-col p-6 lg:col-span-3`}>
          <h3 className="text-center text-xs font-semibold tracking-[0.3em] uppercase">
            Opening hours
          </h3>
          <dl className="mt-6 flex flex-1 flex-col justify-between gap-2 text-sm">
            {CONTACT.hours.map((row) => (
              <div
                key={row.day}
                className="border-rice/10 flex items-baseline justify-between border-b border-dashed pb-2 last:border-b-0"
              >
                <dt className="text-agar-glow">{row.day}</dt>
                <dd className="tabular-nums">
                  {row.open} — {row.close}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Four photographs. */}
        <div className="grid min-h-[16rem] grid-cols-2 grid-rows-2 gap-3 lg:col-span-3">
          {[
            { src: PHOTOS.braisedBeef, alt: "Braised beef in chilli broth" },
            { src: PHOTOS.chicken, alt: "Sliced chicken in red chilli oil" },
            { src: PHOTOS.tossed, alt: "A dry tossed dish with greens" },
            { src: PHOTOS.noodleSoup, alt: "Beef noodle soup, close" },
          ].map((photo) => (
            <div
              key={photo.src + photo.alt}
              className={`${PANEL} relative overflow-hidden`}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(min-width: 1024px) 13vw, 50vw"
                quality={75}
                className="object-cover"
              />
            </div>
          ))}
        </div>

        {/* The map. */}
        <div className={`${PANEL} relative min-h-[18rem] overflow-hidden lg:col-span-3`}>
          {/*
            Darkened with a filter so it sits in the panel; an embedded map
            cannot be restyled from outside. Lazy, so the third-party frame
            costs nothing until the reader reaches the foot of the page.
          */}
          <iframe
            title={`Map showing ${CONTACT.name} at ${CONTACT.address.street}, ${CONTACT.address.locality}`}
            src={CONTACT.map.embedSrc}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute inset-0 h-full w-full border-0"
            style={{ filter: "grayscale(1) invert(0.92) contrast(0.9) brightness(0.95)" }}
          />
          <Link
            href={CONTACT.map.directionsHref}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-ink/90 border-rice/15 hover:bg-ink-deep absolute right-3 bottom-3 rounded-full border px-4 py-2 text-xs tracking-[0.18em] uppercase transition-colors"
          >
            Get directions
            <span className="sr-only"> (opens Google Maps in a new tab)</span>
          </Link>
        </div>

        {/* Get in touch. */}
        <div className={`${PANEL} flex flex-col p-6 lg:col-span-3`}>
          <h3 className="text-center text-xs font-semibold tracking-[0.3em] uppercase">
            Get in touch
          </h3>
          <dl className="mt-6 flex flex-col gap-5 text-sm">
            <div className="flex justify-between gap-6">
              <dt className="text-agar-glow text-xs tracking-[0.2em] uppercase">
                Address
              </dt>
              <dd className="text-right leading-relaxed">
                {CONTACT.address.street}
                <br />
                {CONTACT.address.locality}, {CONTACT.address.region}
                <br />
                {CONTACT.address.postalCode}
                <span className="text-agar-glow mt-1 block text-xs">
                  {CONTACT.address.note}
                </span>
              </dd>
            </div>
            <div className="border-rice/10 flex justify-between gap-6 border-t pt-5">
              <dt className="text-agar-glow text-xs tracking-[0.2em] uppercase">Phone</dt>
              <dd>
                <a
                  href={CONTACT.phone.href}
                  className="hover:text-lantern transition-colors"
                >
                  {CONTACT.phone.display}
                </a>
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <footer className="text-agar-glow flex flex-wrap items-center justify-between gap-4 px-3 pt-5 pb-2 text-xs">
        <span>
          © {new Date().getFullYear()} {CONTACT.name}
        </span>
        <nav aria-label="Footer" className="flex gap-6">
          <Link href="/menu" className="hover:text-rice transition-colors">
            Menu
          </Link>
          <Link href="/order" className="hover:text-rice transition-colors">
            Order
          </Link>
        </nav>
      </footer>
    </section>
  );
}
