/**
 * Pickup times, in the restaurant's own time zone whatever the reader's
 * browser is set to.
 */

export type OpeningHours = readonly { day: string; open: string; close: string }[];

export type PickupSlot = {
  /** Toronto wall-clock time, `YYYY-MM-DDTHH:mm`, as the kitchen reads it. */
  value: string;
  /** For the select: "Today, 12:15" or "Tuesday, 11:00". */
  label: string;
};

export const RESTAURANT_TIME_ZONE = "America/Toronto";

/** How long the kitchen needs before the first pickup. */
export const LEAD_MINUTES = 20;
/** The spacing of pickup times. */
export const SLOT_MINUTES = 15;
/** No pickups in the last this-many minutes before closing. */
export const LAST_ORDER_MINUTES = 15;

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const toMinutes = (time: string) => {
  const [hours = "0", minutes = "0"] = time.split(":");
  return Number(hours) * 60 + Number(minutes);
};

const pad = (value: number) => String(value).padStart(2, "0");

/** The wall-clock date, weekday and minute of the day for `now` in the time zone. */
function wallClock(now: Date, timeZone: string) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-CA", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    })
      .formatToParts(now)
      .map((part) => [part.type, part.value]),
  );
  const date = new Date(
    Date.UTC(Number(parts.year), Number(parts.month) - 1, Number(parts.day)),
  );
  return { date, minute: Number(parts.hour) * 60 + Number(parts.minute) };
}

/**
 * Every pickup time from the soonest the kitchen can manage until last orders,
 * today if the restaurant is still taking them, otherwise on the next day it
 * opens. A closing time earlier than the opening time runs past midnight.
 */
export function pickupSlots(
  now: Date,
  hours: OpeningHours,
  timeZone = RESTAURANT_TIME_ZONE,
): PickupSlot[] {
  const clock = wallClock(now, timeZone);

  for (let offset = 0; offset < 8; offset += 1) {
    const date = new Date(clock.date.getTime() + offset * 86_400_000);
    const weekday = DAYS[date.getUTCDay()];
    const today = hours.find((entry) => entry.day === weekday);
    if (!today) continue;

    const open = toMinutes(today.open);
    let close = toMinutes(today.close);
    if (close <= open) close += 24 * 60;
    const last = close - LAST_ORDER_MINUTES;

    const soonest = offset === 0 ? Math.max(open, clock.minute + LEAD_MINUTES) : open;
    const first = Math.ceil(soonest / SLOT_MINUTES) * SLOT_MINUTES;
    if (first > last) continue;

    const slots: PickupSlot[] = [];
    for (let minute = first; minute <= last; minute += SLOT_MINUTES) {
      const at = new Date(date.getTime() + minute * 60_000);
      const time = `${pad(at.getUTCHours())}:${pad(at.getUTCMinutes())}`;
      const day = offset === 0 && minute < 24 * 60 ? "Today" : DAYS[at.getUTCDay()];
      slots.push({
        value: `${at.getUTCFullYear()}-${pad(at.getUTCMonth() + 1)}-${pad(at.getUTCDate())}T${time}`,
        label: `${day}, ${time}`,
      });
    }
    return slots;
  }

  return [];
}
