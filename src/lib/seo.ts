import type { Metadata } from "next";
import { CONTACT } from "@/content/contact";
import { DISH_MEDIA } from "@/content/menu-media";
import type { RestaurantEvent } from "@/content/events";
import { clientEnv } from "@/env";
import { getCategories, type MenuItem } from "@/lib/menu";

/**
 * Search: absolute URLs, and the structured data (schema.org JSON-LD) that
 * tells Google this is a restaurant, where it is, when it is open, what is on
 * its menu and what is coming up. Everything is read from the same content
 * the pages show (content/contact.ts, data/menu.json, content/events.ts), so
 * the two cannot disagree.
 *
 * Check changes with Google's Rich Results Test or validator.schema.org.
 */

export const SITE_URL = clientEnv.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");

/** An absolute URL for a path on this site. */
export function absolute(path: string): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/** The name as searched in both languages. */
export const SITE_NAME = "7 Noodles";
export const SITE_NAME_FULL = "7 Noodles 恰小面";

/** Matches `alt` in app/opengraph-image.tsx. */
const DEFAULT_SHARE_ALT = "7 Noodles 恰小面: Sichuan noodles on Yonge Street, North York";

const RESTAURANT_ID = absolute("/#restaurant");

const DAY_URL = (day: string) => `https://schema.org/${day}`;

/** Days that share hours, as one specification each. */
function openingHours() {
  const groups = new Map<string, string[]>();
  for (const { day, open, close } of CONTACT.hours) {
    const key = `${open}-${close}`;
    groups.set(key, [...(groups.get(key) ?? []), day]);
  }
  return [...groups].map(([key, days]) => {
    const [opens, closes] = key.split("-");
    return {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: days.map(DAY_URL),
      opens,
      closes,
    };
  });
}

function priceRange(): string {
  const categories = getCategories();
  const min = Math.min(...categories.map((c) => c.minPriceCents));
  const max = Math.max(...categories.map((c) => c.maxPriceCents));
  return `CA$${Math.floor(min / 100)}–${Math.ceil(max / 100)}`;
}

const POSTAL_ADDRESS = {
  "@type": "PostalAddress",
  streetAddress: CONTACT.address.street,
  addressLocality: CONTACT.address.locality,
  addressRegion: "ON",
  postalCode: CONTACT.address.postalCode,
  addressCountry: "CA",
};

/** The restaurant itself: for the home and locations pages. */
export function restaurantJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "@id": RESTAURANT_ID,
    name: SITE_NAME,
    alternateName: [CONTACT.nameZh, CONTACT.name],
    description:
      "Sichuan and Chongqing noodles, wontons and Leshan fried skewers on Yonge Street in North York, Toronto.",
    url: absolute("/"),
    logo: absolute("/icon.svg"),
    image: [
      absolute("/photos/dishes/wanza-noodles.webp"),
      absolute("/photos/dishes/signature-braised-beef-noodle-soup.webp"),
    ],
    telephone: CONTACT.phone.href.replace("tel:", ""),
    address: POSTAL_ADDRESS,
    hasMap: CONTACT.map.directionsHref,
    openingHoursSpecification: openingHours(),
    servesCuisine: ["Sichuan", "Chongqing", "Chinese", "Noodles"],
    priceRange: priceRange(),
    hasMenu: absolute("/menu"),
    potentialAction: {
      "@type": "OrderAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: absolute("/order"),
        actionPlatform: [
          "https://schema.org/DesktopWebPlatform",
          "https://schema.org/MobileWebPlatform",
        ],
      },
      deliveryMethod: "https://schema.org/OnSitePickup",
    },
  };
}

function dishJson(item: MenuItem, categorySlug: string) {
  const photo = DISH_MEDIA[item.slug]?.photo;
  const diets = item.tags.flatMap((tag) =>
    tag === "vegan"
      ? ["https://schema.org/VeganDiet"]
      : tag === "vegetarian"
        ? ["https://schema.org/VegetarianDiet"]
        : [],
  );
  return {
    "@type": "MenuItem",
    name: `${item.nameEn} ${item.nameZh}`,
    url: absolute(`/menu/${categorySlug}/${item.slug}`),
    ...(item.description ? { description: item.description } : {}),
    ...(photo ? { image: absolute(photo.src) } : {}),
    ...(diets.length ? { suitableForDiet: diets } : {}),
    offers: {
      "@type": "Offer",
      price: (item.priceCents / 100).toFixed(2),
      priceCurrency: "CAD",
      ...(item.available ? {} : { availability: "https://schema.org/OutOfStock" }),
    },
  };
}

/** The whole menu, by section: for /menu. Pass a slug for one category's page. */
export function menuJsonLd(categorySlug?: string) {
  const categories = getCategories().filter(
    (category) => !categorySlug || category.slug === categorySlug,
  );
  return {
    "@context": "https://schema.org",
    "@type": "Menu",
    name: `${SITE_NAME} menu`,
    url: absolute(categorySlug ? `/menu/${categorySlug}` : "/menu"),
    inLanguage: ["en", "zh"],
    hasMenuSection: categories.map((category) => ({
      "@type": "MenuSection",
      name: `${category.nameEn} ${category.nameZh}`,
      url: absolute(`/menu/${category.slug}`),
      hasMenuItem: category.items.map((item) => dishJson(item, category.slug)),
    })),
  };
}

/** One dish: for its own page. */
export function dishJsonLd(item: MenuItem, categorySlug: string) {
  return { "@context": "https://schema.org", ...dishJson(item, categorySlug) };
}

/** Upcoming events at the restaurant: for /events. */
export function eventsJsonLd(events: RestaurantEvent[]) {
  return events.map((event) => ({
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.titleZh ? `${event.title} ${event.titleZh}` : event.title,
    description: event.description,
    startDate: event.date,
    ...(event.endDate ? { endDate: event.endDate } : {}),
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    url: absolute(`/events#${event.slug}`),
    ...(event.image ? { image: absolute(event.image.src) } : {}),
    location: {
      "@type": "Restaurant",
      "@id": RESTAURANT_ID,
      name: SITE_NAME,
      address: POSTAL_ADDRESS,
    },
    organizer: { "@type": "Organization", name: SITE_NAME, url: absolute("/") },
  }));
}

/** Breadcrumbs for the menu pages. */
export function breadcrumbJsonLd(trail: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: absolute(crumb.path),
    })),
  };
}

/**
 * A page's metadata: its title and description, its one canonical address,
 * and the same for link previews. Open Graph does not inherit piecemeal (a
 * page's `openGraph` replaces the layout's whole), so it is written out here
 * in full for each page.
 */
export function pageMetadata({
  title,
  description,
  path,
  image,
}: {
  title?: string;
  description: string;
  path: string;
  /** A photograph for link previews; otherwise the branded card. */
  image?: { src: string; alt: string } | undefined;
}): Metadata {
  const shareTitle = title ? `${title} | ${SITE_NAME_FULL}` : SITE_NAME_FULL;
  // A page that sets `openGraph` can lose the root opengraph-image, so the
  // branded card is named here as the fallback.
  const share = image ?? { src: "/opengraph-image", alt: DEFAULT_SHARE_ALT };
  return {
    ...(title ? { title } : {}),
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: SITE_NAME_FULL,
      locale: "en_CA",
      alternateLocale: ["zh_CN"],
      title: shareTitle,
      description,
      url: path,
      images: [{ url: share.src, alt: share.alt }],
    },
    twitter: {
      card: "summary_large_image",
      title: shareTitle,
      description,
      images: [share.src],
    },
  };
}
