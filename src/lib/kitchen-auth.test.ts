import { describe, expect, it } from "vitest";
import { SESSION_SECONDS, safeEqual, signSession, verifySession } from "./kitchen-auth";

const KEY = { secret: "a".repeat(40), pin: "482913" };

describe("kitchen session", () => {
  it("accepts its own cookie and rejects a tampered one", async () => {
    const token = await signSession(KEY);
    expect(await verifySession(KEY, token)).toBe(true);
    const [expires, signature] = token.split(".");
    expect(await verifySession(KEY, `${Number(expires) + 999}.${signature}`)).toBe(false);
    expect(await verifySession({ ...KEY, secret: "b".repeat(40) }, token)).toBe(false);
    expect(await verifySession(KEY, undefined)).toBe(false);
    expect(await verifySession(KEY, "nonsense")).toBe(false);
  });

  it("signs every device out when the PIN changes", async () => {
    const token = await signSession(KEY);
    expect(await verifySession({ ...KEY, pin: "305177" }, token)).toBe(false);
  });

  it("expires", async () => {
    const issued = Date.UTC(2026, 0, 1);
    const token = await signSession(KEY, issued);
    expect(await verifySession(KEY, token, issued + (SESSION_SECONDS - 60) * 1000)).toBe(
      true,
    );
    expect(await verifySession(KEY, token, issued + (SESSION_SECONDS + 60) * 1000)).toBe(
      false,
    );
  });

  it("compares PINs exactly, whatever their lengths", () => {
    expect(safeEqual("482913", "482913")).toBe(true);
    expect(safeEqual("482913", "482914")).toBe(false);
    expect(safeEqual("48291", "482913")).toBe(false);
    expect(safeEqual("4829130", "482913")).toBe(false);
    expect(safeEqual("", "482913")).toBe(false);
  });
});
