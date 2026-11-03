import { EVENTS, type RestaurantEvent } from "@/content/events";

const ZONE = "America/Toronto";

/** Today's date in Toronto as YYYY-MM-DD, which sorts and compares as a string. */
export function torontoToday(now: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: ZONE }).format(now);
}

/**
 * The events to show, split into what is still to come (soonest first) and
 * what has passed (most recent first). An event stays upcoming through its
 * last day. Placeholders are only shown outside production.
 */
export function splitEvents(
  now: Date = new Date(),
  events: RestaurantEvent[] = EVENTS,
  includePlaceholders = process.env.NODE_ENV !== "production",
): { upcoming: RestaurantEvent[]; past: RestaurantEvent[] } {
  const today = torontoToday(now);
  const shown = events.filter((event) => includePlaceholders || !event.placeholder);
  const lastDay = (event: RestaurantEvent) => event.endDate ?? event.date;

  return {
    upcoming: shown
      .filter((event) => lastDay(event) >= today)
      .sort((a, b) => a.date.localeCompare(b.date)),
    past: shown
      .filter((event) => lastDay(event) < today)
      .sort((a, b) => b.date.localeCompare(a.date)),
  };
}

/** A calendar date as its parts for the date block: "NOV", "14", "Sat". */
export function dateParts(date: string): { month: string; day: string; weekday: string } {
  // Noon UTC keeps the calendar date the same in every zone it is formatted in.
  const at = new Date(`${date}T12:00:00Z`);
  const part = (options: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat("en-CA", { timeZone: "UTC", ...options }).format(at);
  return {
    month: part({ month: "short" }).replace(".", "").toUpperCase(),
    day: part({ day: "numeric" }),
    weekday: part({ weekday: "short" }).replace(".", ""),
  };
}

/** "Saturday, November 14", or "November 14 – November 16" for a run. */
export function formatEventDate(event: RestaurantEvent): string {
  const format = (date: string, options: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat("en-CA", { timeZone: "UTC", ...options }).format(
      new Date(`${date}T12:00:00Z`),
    );
  if (!event.endDate || event.endDate === event.date) {
    return format(event.date, { weekday: "long", month: "long", day: "numeric" });
  }
  return `${format(event.date, { month: "long", day: "numeric" })} – ${format(event.endDate, { month: "long", day: "numeric" })}`;
}
