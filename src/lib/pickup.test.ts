import { describe, expect, it } from "vitest";
import { pickupSlots } from "./pickup";

const DAILY = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
].map((day) => ({ day, open: "11:00", close: "22:00" }));

/** A moment given as Toronto wall-clock time in September (EDT, UTC-4). */
const toronto = (iso: string) => new Date(`${iso}:00-04:00`);

describe("pickup slots", () => {
  it("starts twenty minutes out, on the quarter hour, and stops at last orders", () => {
    const slots = pickupSlots(toronto("2026-09-15T12:07"), DAILY);
    expect(slots[0]).toEqual({ value: "2026-09-15T12:30", label: "Today, 12:30" });
    expect(slots.at(-1)?.value).toBe("2026-09-15T21:45");
  });

  it("starts at opening when ordered before the restaurant opens", () => {
    expect(pickupSlots(toronto("2026-09-15T08:00"), DAILY)[0]?.value).toBe(
      "2026-09-15T11:00",
    );
  });

  it("moves to the next day after last orders", () => {
    const slots = pickupSlots(toronto("2026-09-15T21:40"), DAILY);
    expect(slots[0]).toEqual({ value: "2026-09-16T11:00", label: "Wednesday, 11:00" });
  });

  it("skips a day the restaurant is closed", () => {
    const hours = DAILY.filter((entry) => entry.day !== "Wednesday");
    expect(pickupSlots(toronto("2026-09-15T23:00"), hours)[0]?.label).toBe(
      "Thursday, 11:00",
    );
  });

  it("runs past midnight when closing is earlier than opening", () => {
    const late = DAILY.map((entry) => ({ ...entry, open: "18:00", close: "02:00" }));
    const slots = pickupSlots(toronto("2026-09-15T23:30"), late);
    // 23:30 plus twenty minutes is 23:50, which rounds up to midnight.
    expect(slots[0]).toEqual({ value: "2026-09-16T00:00", label: "Wednesday, 00:00" });
    expect(slots.at(-1)?.value).toBe("2026-09-16T01:45");
  });

  it("uses the restaurant's time zone, not the reader's", () => {
    // 16:07 UTC is 12:07 in Toronto.
    const slots = pickupSlots(new Date("2026-09-15T16:07:00Z"), DAILY);
    expect(slots[0]?.value).toBe("2026-09-15T12:30");
  });
});
