import Link from "next/link";
import { dateParts, formatEventDate, splitEvents } from "@/lib/events";

/**
 * A strip on the home page announcing the next event. Renders nothing when
 * nothing is coming up, so an empty calendar never shows as an empty box.
 */
export function NextEvent() {
  const next = splitEvents().upcoming[0];
  if (!next) return null;

  return (
    <section
      aria-label="Next event"
      data-nav-theme="dark"
      className="bg-brand text-paper relative z-10 px-6 py-14 md:px-10"
    >
      <Link
        href={`/events#${next.slug}`}
        className="group mx-auto flex max-w-[1400px] flex-col gap-6 md:flex-row md:items-center md:justify-between"
      >
        <div className="flex items-center gap-5">
          {/* The date, set large, as the strip's mark. */}
          <p
            aria-hidden="true"
            className="flex shrink-0 flex-col items-center leading-none"
          >
            <span className="text-xs font-semibold tracking-[0.18em]">
              {dateParts(next.date).month}
            </span>
            <span className="text-5xl font-extrabold tabular-nums">
              {dateParts(next.date).day}
            </span>
          </p>
          <div>
            <p className="eyebrow text-paper">Coming up · {formatEventDate(next)}</p>
            <p className="font-display mt-2 text-[clamp(1.75rem,3.2vw,2.75rem)] leading-tight tracking-[-0.02em]">
              {next.title}
            </p>
          </div>
        </div>
        <span className="border-paper/30 group-hover:bg-paper group-hover:text-brand inline-flex h-12 shrink-0 items-center gap-2 self-start border px-6 text-sm font-semibold transition-colors md:self-auto">
          All events <span aria-hidden="true">→</span>
        </span>
      </Link>
    </section>
  );
}
