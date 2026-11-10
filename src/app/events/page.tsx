import type { Metadata } from "next";
import Image from "next/image";
import { JsonLd } from "@/components/seo/json-ld";
import { eventsJsonLd, pageMetadata } from "@/lib/seo";
import { Panda7 } from "@/components/brand/panda-7";
import { EventCard } from "@/components/events/event-card";
import { TapedFrame } from "@/components/hand/taped-frame";
import { PinUp } from "@/components/motion/pin-up";
import { RevealFrame } from "@/components/motion/reveal-frame";
import { Button } from "@/components/ui/button";
import { PHOTOS } from "@/content/photos";
import { PageTransition } from "@/components/motion/page-transition";
import { SectionHeading } from "@/components/ui/section-heading";
import { CONTACT } from "@/content/contact";
import { SCENERY } from "@/content/scenery";
import { splitEvents } from "@/lib/events";

export const metadata: Metadata = pageMetadata({
  title: "Events",
  description:
    "Tastings, festival menus and nights at 7 Noodles 恰小面 on Yonge Street in North York.",
  path: "/events",
});

/**
 * Rebuilt hourly, so an event moves from "What's on" to "Past events" the day
 * after it ends without anyone redeploying.
 */
export const revalidate = 3600;

export default function EventsPage() {
  const { upcoming, past } = splitEvents();

  return (
    <PageTransition id="events">
      <main
        id="main"
        data-nav-theme="light"
        className="bg-paper text-brand min-h-svh pt-24 pb-24 md:pt-32"
      >
        {upcoming.length > 0 ? <JsonLd data={eventsJsonLd(upcoming)} /> : null}
        <div className="mx-auto max-w-[1200px] px-6 md:px-10">
          <div className="grid items-center gap-12 lg:grid-cols-[1fr_minmax(0,34rem)]">
            <div>
              <SectionHeading as="h1" eyebrow="Events" zh="活动">
                What&rsquo;s on at 7 Noodles
              </SectionHeading>
              <p className="text-brand-deep text-lede mt-6 max-w-[48ch] leading-relaxed">
                Tastings, festival menus and the odd night of something new. Follow{" "}
                <a
                  href={CONTACT.instagram.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="decoration-brand-deep underline decoration-2 underline-offset-[0.3em]"
                >
                  {CONTACT.instagram.handle}
                </a>{" "}
                to hear first.
              </p>
            </div>
            <PinUp fade={false}>
              <TapedFrame tilt={1.5} className="text-sm">
                <Image
                  src={SCENERY.shadowTheatre.src}
                  width={SCENERY.shadowTheatre.width}
                  height={SCENERY.shadowTheatre.height}
                  alt={SCENERY.shadowTheatre.alt}
                  sizes="(min-width: 1024px) 34rem, 100vw"
                  preload
                  className="block h-auto w-full"
                />
              </TapedFrame>
            </PinUp>
          </div>

          <section
            id="upcoming"
            aria-labelledby="upcoming-heading"
            className="mt-16 scroll-mt-28"
          >
            <h2 id="upcoming-heading" className="eyebrow text-brand-deep mb-2">
              Coming up
            </h2>
            {upcoming.length > 0 ? (
              upcoming.map((event) => <EventCard key={event.slug} event={event} />)
            ) : (
              <div className="border-brand/15 flex flex-col gap-6 border-t py-10 sm:flex-row sm:items-center sm:gap-10">
                <Panda7 alt="" className="w-24 shrink-0 sm:w-28" sizes="7rem" />
                <div className="flex-1">
                  <p className="font-display text-2xl md:text-3xl">
                    The next one is being planned.
                  </p>
                  <p className="text-brand-deep mt-2 max-w-[48ch] leading-relaxed">
                    New events are announced on Instagram first, then posted here.
                  </p>
                </div>
                <Button
                  href={CONTACT.instagram.href}
                  tone="outline"
                  className="self-start sm:self-center"
                >
                  Follow {CONTACT.instagram.handle}
                </Button>
              </div>
            )}
          </section>

          <section
            aria-labelledby="gather-heading"
            className="bg-brand text-paper relative -mx-6 mt-20 overflow-hidden px-6 py-16 md:-mx-10 md:mt-28 md:px-10 md:py-24"
          >
            <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-20">
              <div>
                <p className="eyebrow text-paper/80">
                  Birthdays &amp; get-togethers{" "}
                  <span lang="zh" className="font-cjk ml-2 tracking-[0.2em]">
                    聚会
                  </span>
                </p>
                <h2
                  id="gather-heading"
                  className="font-display text-title mt-4 max-w-[14ch] leading-[0.95]"
                >
                  Bring the whole table
                </h2>
                <p className="text-paper/85 mt-6 max-w-[46ch] leading-relaxed">
                  Birthdays, team dinners and long catch-ups over bowls of noodles: the
                  booths and the big tables were made for them. Coming with a group? Call
                  ahead so we can set the tables together.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Button href={CONTACT.phone.href} tone="inverse">
                    Call {CONTACT.phone.display}
                  </Button>
                  <Button href="/menu" tone="outline">
                    See the menu
                  </Button>
                </div>
              </div>
              <div className="relative pb-16 sm:pb-24">
                <RevealFrame className="bg-paper p-[0.4rem]">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={PHOTOS.diningRoomBooths.src}
                      alt={PHOTOS.diningRoomBooths.alt}
                      fill
                      sizes="(min-width: 1024px) 40vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                </RevealFrame>
                <PinUp className="absolute right-[-4%] bottom-0 w-[46%] sm:right-[-6%]">
                  <TapedFrame tilt={-3} className="text-xs">
                    <div className="relative aspect-[4/5] overflow-hidden">
                      <Image
                        src={PHOTOS.birthdayTable.src}
                        alt={PHOTOS.birthdayTable.alt}
                        fill
                        sizes="(min-width: 1024px) 20vw, 46vw"
                        className="object-cover"
                      />
                    </div>
                  </TapedFrame>
                </PinUp>
              </div>
            </div>
          </section>

          <section
            id="past"
            aria-labelledby="past-heading"
            className="mt-16 scroll-mt-28"
          >
            {past.length > 0 ? (
              <details className="group">
                <summary className="eyebrow text-brand-deep flex min-h-11 cursor-pointer list-none items-center gap-2 [&::-webkit-details-marker]:hidden">
                  <span id="past-heading">Past events ({past.length})</span>
                  <span
                    aria-hidden="true"
                    className="transition-transform duration-(--duration-base) ease-(--ease-out-expo) group-open:rotate-90"
                  >
                    →
                  </span>
                </summary>
                <div className="mt-4">
                  {past.map((event) => (
                    <EventCard key={event.slug} event={event} past />
                  ))}
                </div>
              </details>
            ) : (
              <>
                <h2 id="past-heading" className="eyebrow text-brand-deep">
                  Past events
                </h2>
                <p className="text-brand-deep mt-3 text-sm">
                  Our first events are still to come.
                </p>
              </>
            )}
          </section>
        </div>
      </main>
    </PageTransition>
  );
}
