import Image from "next/image";
import Link from "next/link";
import { RevealFrame } from "@/components/motion/reveal-frame";
import { Button } from "@/components/ui/button";
import { CONTACT } from "@/content/contact";
import { PHOTOS } from "@/content/photos";

/**
 * Where and when: the address and ways in beside the week's hours, and the
 * storefront. The locations page adds the map. Everything comes from
 * content/contact.ts, so this, the footer and the structured data agree.
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

          {/* Phones: the three ways in, as buttons a thumb can find. */}
          <div className="mt-8 grid grid-cols-2 gap-2 lg:hidden">
            <Button href="/order" size="lg" className="col-span-2">
              Order for pickup
            </Button>
            <Button href={CONTACT.phone.href} tone="outline" size="lg" arrow={false}>
              Call
            </Button>
            <Button
              href={CONTACT.map.directionsHref}
              external
              tone="outline"
              size="lg"
              arrow={false}
            >
              Directions
            </Button>
          </div>

          <div className="mt-10 grid gap-10 text-[0.95rem] leading-snug sm:grid-cols-[1fr_1.4fr] lg:mt-16">
            <div className="flex flex-col gap-5">
              <p>
                Walk-ins welcome. Or{" "}
                <Link href="/order" className="underline underline-offset-2">
                  order online
                </Link>{" "}
                for pickup.
              </p>
              <address className="not-italic">
                <a
                  href={CONTACT.phone.href}
                  className="-my-3 inline-block py-3 underline underline-offset-2"
                >
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
                className="-my-3 self-start py-3 underline underline-offset-2"
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

        <RevealFrame className="aspect-[4/3]">
          <div className="relative h-full w-full">
            <Image
              src={PHOTOS.storefront.src}
              alt={PHOTOS.storefront.alt}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover object-[50%_40%]"
            />
          </div>
        </RevealFrame>
      </div>

      {map ? (
        <div className="border-brand relative mt-16 h-80 overflow-hidden border md:aspect-[16/7] md:h-auto">
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
