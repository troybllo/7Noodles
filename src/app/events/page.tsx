import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/json-ld";
import { eventsJsonLd, pageMetadata } from "@/lib/seo";
import { Panda7 } from "@/components/brand/panda-7";
import { EventCard } from "@/components/events/event-card";
import { PageTransition } from "@/components/motion/page-transition";
import { SectionHeading } from "@/components/ui/section-heading";
import { CONTACT } from "@/content/contact";
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
        className="bg-paper text-brand min-h-svh pt-32 pb-24"
      >
        {upcoming.length > 0 ? <JsonLd data={eventsJsonLd(upcoming)} /> : null}
        <div className="mx-auto max-w-[1200px] px-6 md:px-10">
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
              <div className="border-brand/10 flex flex-col items-center gap-6 border-t py-16 text-center">
                <Panda7 pose="wave" alt="" className="w-40" />
                <p className="font-display text-2xl">Nothing on the calendar just yet.</p>
                <p className="text-brand-deep max-w-[40ch]">
                  We announce new events on Instagram first. Check back soon.
                </p>
              </div>
            )}
          </section>

          <section
            id="past"
            aria-labelledby="past-heading"
            className="mt-20 scroll-mt-28"
          >
            {past.length > 0 ? (
              <details className="group">
                <summary className="eyebrow text-brand-deep flex cursor-pointer list-none items-center gap-2">
                  <span id="past-heading">Past events ({past.length})</span>
                  <span
                    aria-hidden="true"
                    className="transition-transform group-open:rotate-90"
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
