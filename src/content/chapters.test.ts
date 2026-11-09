import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { findDish } from "@/lib/menu";
import { HOW_TO_EAT, KITCHEN, NUMBING, SIGNATURES } from "./chapters";
import { DISH_MEDIA } from "./menu-media";

describe("home chapters", () => {
  it("only names dishes on the menu, each with a photograph", () => {
    for (const { slug } of SIGNATURES.dishes) {
      expect(findDish(slug), slug).toBeDefined();
      expect(DISH_MEDIA[slug]?.photo, `${slug} has no photo`).toBeDefined();
    }
  });

  it("illustrates every step with a photograph that exists", () => {
    const photos = [...HOW_TO_EAT.steps, ...KITCHEN.steps, NUMBING].map((s) => s.photo);
    for (const { src, alt } of photos) {
      expect(existsSync(join(process.cwd(), "public", src)), src).toBe(true);
      expect(alt.length, src).toBeGreaterThan(10);
    }
  });

  it("lists the owner's signature dishes and nothing else as signatures", () => {
    for (const { slug } of SIGNATURES.dishes) {
      expect(findDish(slug)?.item.signature, slug).toBe(true);
    }
  });
});
