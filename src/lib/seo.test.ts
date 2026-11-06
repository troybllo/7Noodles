import { describe, expect, it } from "vitest";
import { CONTACT } from "@/content/contact";
import { getCategories } from "./menu";
import {
  absolute,
  eventsJsonLd,
  menuJsonLd,
  pageMetadata,
  restaurantJsonLd,
} from "./seo";

describe("structured data", () => {
  it("gives the restaurant's hours for every day it opens", () => {
    const days = restaurantJsonLd().openingHoursSpecification.flatMap(
      (spec) => spec.dayOfWeek,
    );
    expect(days).toHaveLength(CONTACT.hours.length);
  });

  it("lists every dish on the menu, priced in dollars", () => {
    const menu = menuJsonLd();
    const items = menu.hasMenuSection.flatMap((section) => section.hasMenuItem);
    const dishes = getCategories().flatMap((category) => category.items);
    expect(items).toHaveLength(dishes.length);
    expect(items[0]?.offers.price).toBe((dishes[0]!.priceCents / 100).toFixed(2));
    expect(items.every((item) => item.offers.priceCurrency === "CAD")).toBe(true);
  });

  it("narrows to one category when asked", () => {
    const [first] = getCategories();
    expect(menuJsonLd(first!.slug).hasMenuSection).toHaveLength(1);
  });

  it("places events at the restaurant", () => {
    const [event] = eventsJsonLd([
      {
        slug: "x",
        title: "Tasting",
        date: "2026-11-14",
        description: "A night of noodles.",
      },
    ]);
    expect(event?.location["@id"]).toBe(restaurantJsonLd()["@id"]);
    expect(event?.startDate).toBe("2026-11-14");
  });

  it("uses absolute URLs", () => {
    expect(absolute("/menu")).toMatch(/^https?:\/\/[^/]+\/menu$/);
  });
});

describe("page metadata", () => {
  it("gives each page its own canonical and a matching share title", () => {
    const meta = pageMetadata({ title: "Menu", description: "d", path: "/menu" });
    expect(meta.alternates?.canonical).toBe("/menu");
    expect(meta.openGraph?.title).toBe("Menu | 7 Noodles 恰小面");
  });
});
