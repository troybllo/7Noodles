import { describe, expect, it } from "vitest";
import type { RestaurantEvent } from "@/content/events";
import { dateParts, formatEventDate, splitEvents, torontoToday } from "./events";

const event = (slug: string, date: string, extra: Partial<RestaurantEvent> = {}) => ({
  slug,
  title: slug,
  date,
  description: "",
  ...extra,
});

describe("events", () => {
  it("reads today in Toronto, not UTC", () => {
    // 02:00 UTC on the 15th is still the evening of the 14th in Toronto.
    expect(torontoToday(new Date("2026-11-15T02:00:00Z"))).toBe("2026-11-14");
  });

  it("keeps an event upcoming through its last day, then moves it to past", () => {
    const events = [
      event("later", "2026-12-01"),
      event("today", "2026-11-14"),
      event("run", "2026-11-10", { endDate: "2026-11-14" }),
      event("gone", "2026-11-13"),
      event("older", "2026-10-01"),
    ];
    const now = new Date("2026-11-14T20:00:00Z");
    const { upcoming, past } = splitEvents(now, events, true);
    expect(upcoming.map((e) => e.slug)).toEqual(["run", "today", "later"]);
    expect(past.map((e) => e.slug)).toEqual(["gone", "older"]);
  });

  it("leaves placeholders out when asked to", () => {
    const events = [
      event("real", "2026-12-01"),
      event("demo", "2026-12-02", { placeholder: true }),
    ];
    const { upcoming } = splitEvents(new Date("2026-11-01T12:00:00Z"), events, false);
    expect(upcoming.map((e) => e.slug)).toEqual(["real"]);
  });

  it("formats dates without shifting the day", () => {
    expect(dateParts("2026-11-14")).toEqual({ month: "NOV", day: "14", weekday: "Sat" });
    expect(formatEventDate(event("a", "2026-11-14"))).toBe("Saturday, November 14");
    expect(formatEventDate(event("b", "2026-11-14", { endDate: "2026-11-16" }))).toBe(
      "November 14 – November 16",
    );
  });
});
