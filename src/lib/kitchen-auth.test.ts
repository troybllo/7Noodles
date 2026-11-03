import { describe, expect, it } from "vitest";
import { SESSION_SECONDS, safeEqual, signSession, verifySession } from "./kitchen-auth";

const SECRET = "a".repeat(40);

describe("kitchen session", () => {
  it("accepts its own cookie and rejects a tampered one", async () => {
    const token = await signSession(SECRET);
    expect(await verifySession(SECRET, token)).toBe(true);
    const [expires, signature] = token.split(".");
    expect(await verifySession(SECRET, `${Number(expires) + 999}.${signature}`)).toBe(
      false,
    );
    expect(await verifySession("b".repeat(40), token)).toBe(false);
    expect(await verifySession(SECRET, undefined)).toBe(false);
    expect(await verifySession(SECRET, "nonsense")).toBe(false);
  });

  it("expires", async () => {
    const issued = Date.UTC(2026, 0, 1);
    const token = await signSession(SECRET, issued);
    expect(
      await verifySession(SECRET, token, issued + (SESSION_SECONDS - 60) * 1000),
    ).toBe(true);
    expect(
      await verifySession(SECRET, token, issued + (SESSION_SECONDS + 60) * 1000),
    ).toBe(false);
  });

  it("compares PINs exactly", () => {
    expect(safeEqual("482913", "482913")).toBe(true);
    expect(safeEqual("482913", "482914")).toBe(false);
    expect(safeEqual("48291", "482913")).toBe(false);
  });
});
