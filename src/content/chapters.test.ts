import { describe, expect, it } from "vitest";
import { findDish } from "@/lib/menu";
import { HOW_TO_EAT, KITCHEN, NUMBING, SIGNATURES } from "./chapters";
import { DISH_MEDIA } from "./menu-media";

const photographed = [
  ...HOW_TO_EAT.steps.map((s) => s.photo),
  ...KITCHEN.steps.map((s) => s.photo),
  ...SIGNATURES.dishes.map((d) => d.slug),
  NUMBING.photo,
];

describe("home chapters", () => {
  it("only names dishes on the menu, each with a photograph", () => {
    for (const slug of photographed) {
      expect(findDish(slug), slug).toBeDefined();
      expect(DISH_MEDIA[slug]?.photo, `${slug} has no photo`).toBeDefined();
    }
  });

  it("lists the owner's signature dishes and nothing else as signatures", () => {
    for (const { slug } of SIGNATURES.dishes) {
      expect(findDish(slug)?.item.signature, slug).toBe(true);
    }
  });
});
