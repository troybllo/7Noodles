import { RESTAURANT_TIME_ZONE } from "./pickup";

const CLOCK = new Intl.DateTimeFormat("en-CA", {
  timeZone: RESTAURANT_TIME_ZONE,
  hour: "numeric",
  minute: "2-digit",
});

const DAY_AND_CLOCK = new Intl.DateTimeFormat("en-CA", {
  timeZone: RESTAURANT_TIME_ZONE,
  weekday: "long",
  hour: "numeric",
  minute: "2-digit",
});

const toDate = (at: Date | string) => (typeof at === "string" ? new Date(at) : at);

/** A time of day at the restaurant, "2:15 p.m.", whatever the reader's time zone. */
export function formatClock(at: Date | string): string {
  return CLOCK.format(toDate(at));
}

/** "Tuesday 2:15 p.m.", at the restaurant. */
export function formatDayAndClock(at: Date | string): string {
  return DAY_AND_CLOCK.format(toDate(at));
}
