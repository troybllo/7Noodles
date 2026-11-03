import Image from "next/image";
import type { RestaurantEvent } from "@/content/events";
import { dateParts, formatEventDate } from "@/lib/events";

/**
 * One event: a date block, the title with its Chinese, when, a few lines on
 * what is happening, and an optional photo and link. `past` mutes it.
 */
export function EventCard({
  event,
  past = false,
}: {
  event: RestaurantEvent;
  past?: boolean;
}) {
  const { month, day, weekday } = dateParts(event.date);

  return (
    <article
      id={event.slug}
      className={`border-brand/10 grid gap-6 border-t py-10 md:grid-cols-[7rem_1fr_minmax(0,22rem)] md:gap-10 ${past ? "opacity-70" : ""}`}
    >
      <div className="flex items-baseline gap-3 md:flex-col md:gap-1">
        <span className={`eyebrow ${past ? "text-brand-deep" : "text-brand-deep"}`}>
          {month}
        </span>
        <span className="font-display text-6xl leading-none tracking-[-0.04em] tabular-nums">
          {day}
        </span>
        <span className="text-brand-deep text-sm">{weekday}</span>
      </div>

      <div>
        {event.titleZh ? (
          <p
            lang="zh"
            className="font-cjk text-brand-deep text-sm font-bold tracking-[0.15em]"
          >
            {event.titleZh}
          </p>
        ) : null}
        <h3 className="font-display mt-1 text-3xl leading-tight tracking-[-0.02em] text-balance">
          {event.title}
        </h3>
        <p className="text-brand-deep mt-2 text-sm">
          {formatEventDate(event)}
          {event.time ? ` · ${event.time}` : ""}
        </p>
        <p className="text-brand-deep mt-4 max-w-[60ch] leading-relaxed">
          {event.description}
        </p>
        {event.link && !past ? (
          <a
            href={event.link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="decoration-brand-deep mt-5 inline-block text-sm font-semibold underline decoration-2 underline-offset-[0.4em]"
          >
            {event.link.label} →<span className="sr-only"> (opens in a new tab)</span>
          </a>
        ) : null}
      </div>

      {event.image ? (
        <div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
          <Image
            src={event.image.src}
            alt={event.image.alt}
            fill
            sizes="(min-width: 768px) 22rem, 100vw"
            className="object-cover"
          />
        </div>
      ) : null}
    </article>
  );
}
