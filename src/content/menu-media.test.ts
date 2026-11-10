import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { findDish, getCategory } from "@/lib/menu";
import { croppedSizes } from "@/components/menu/dish-media";
import { DISH_PHOTO_ASPECT } from "./dish-photo-aspect";
import { CATEGORY_COVERS, DISH_MEDIA } from "./menu-media";

const publicFile = (src: string) => join(process.cwd(), "public", src);

describe("menu photography", () => {
  it("only names dishes that are on the menu", () => {
    for (const slug of Object.keys(DISH_MEDIA)) {
      expect(findDish(slug), slug).toBeDefined();
    }
  });

  it("only names categories that are on the menu", () => {
    for (const slug of Object.keys(CATEGORY_COVERS)) {
      expect(getCategory(slug), slug).toBeDefined();
    }
  });

  it("points at files that exist, each with alt text", () => {
    const media = [
      ...Object.values(DISH_MEDIA).flatMap((m) => (m?.photo ? [m.photo] : [])),
      ...Object.values(CATEGORY_COVERS).flatMap((m) => (m ? [m] : [])),
    ];
    for (const photo of media) {
      expect(existsSync(publicFile(photo.src)), photo.src).toBe(true);
      expect(photo.alt.length, photo.src).toBeGreaterThan(10);
    }
  });

  it("knows the shape of every dish photograph, so crops stay sharp", () => {
    for (const media of Object.values(DISH_MEDIA)) {
      if (media?.photo)
        expect(DISH_PHOTO_ASPECT[media.photo.src], media.photo.src).toBeDefined();
    }
  });

  it("asks for a wider image when a frame crops a landscape photograph", () => {
    expect(croppedSizes("(min-width: 1024px) 576px, 100vw", 1.5)).toBe(
      "(min-width: 1024px) 1080px, 188vw",
    );
    expect(croppedSizes("(min-width: 1024px) 23vw, 50vw", 0.6667)).toBe(
      "(min-width: 1024px) 23vw, 50vw",
    );
  });
});
