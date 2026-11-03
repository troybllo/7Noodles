import Image from "next/image";
import Link from "next/link";
import { CONTACT } from "@/content/contact";

/**
 * Where and when, after the Bokman reference: CONTACT & OPENING HOURS in
 * capitals, the address and ways in beside the week's hours in two plain
 * columns, and a photograph on the right. The locations page adds the map.
 *
 * Every detail comes from content/contact.ts, so this section, the footer and
 * the structured data cannot disagree.
 */
export function Contact({
  headingLevel = 2,
  map = false,
}: {
  headingLevel?: 1 | 2;
  /** Show the map beneath, as the locations page does. */
  map?: boolean;
}) {
  const Heading = headingLevel === 1 ? "h1" : "h2";
  return (
    <section
      id="contact"
      data-nav-theme="light"
      aria-labelledby="contact-heading"
      className="bg-paper text-brand relative z-10 w-full px-4 py-24 md:px-5 md:py-32"
    >
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-5">
        <div>
          <Heading
            id="contact-heading"
            className="font-display text-[clamp(1.75rem,3vw,2.75rem)] leading-[1.02]"
          >
            Contact
            <br />
            &amp; opening hours
          </Heading>

          <div className="mt-16 grid gap-10 text-[0.95rem] leading-snug sm:grid-cols-[1fr_1.4fr]">
            <div className="flex flex-col gap-5">
              <p>
                Walk-ins welcome. Or{" "}
                <Link href="/order" className="underline underline-offset-2">
                  order online
                </Link>{" "}
                for pickup.
              </p>
              <address className="not-italic">
                <a href={CONTACT.phone.href} className="underline underline-offset-2">
                  {CONTACT.phone.display}
                </a>
                <br />
                {CONTACT.address.street}
                <br />
                {CONTACT.address.locality}, {CONTACT.address.region}{" "}
                {CONTACT.address.postalCode}
                <br />
                <span>{CONTACT.address.note}</span>
              </address>
              <a
                href={CONTACT.map.directionsHref}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2"
              >
                Get directions<span className="sr-only"> (opens in a new tab)</span>
              </a>
            </div>

            <dl className="grid grid-cols-[auto_1fr] gap-x-10">
              {CONTACT.hours.map((row) => (
                <div key={row.day} className="contents">
                  <dt>{row.day}</dt>
                  <dd className="tabular-nums">
                    {row.open}–{row.close}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src="/photos/dishes/biangbiang-noodles.webp"
            alt="BiangBiang noodles with tomato and egg, minced pork, greens and hot chili oil"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      </div>

      {map ? (
        <div className="border-brand relative mt-16 aspect-[16/7] min-h-[20rem] overflow-hidden border">
          {/* Lazy, so the third-party frame costs nothing until it is reached. */}
          <iframe
            title={`Map showing ${CONTACT.name} at ${CONTACT.address.street}, ${CONTACT.address.locality}`}
            src={CONTACT.map.embedSrc}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute inset-0 h-full w-full border-0 grayscale"
          />
        </div>
      ) : null}
    </section>
  );
}
