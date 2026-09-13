/**
 * Contact details — the one place they are written down.
 *
 * The hero card, the contact section and, later, the structured data all read
 * from here, so an address or an opening hour cannot drift between them.
 *
 * Address, phone and hours are the restaurant's own published details, as
 * listed on its previous site and public listings. Email and social handles
 * are deliberately absent: none were found for this restaurant, and they are
 * not ours to invent. Add them here when the owner supplies them.
 */

const ADDRESS_QUERY = "4664 Yonge St Unit 13, North York, ON M2N 5M1";

export const CONTACT = {
  name: "Seven Noodles",
  nameZh: "恰小面",
  address: {
    street: "4664 Yonge St, Unit 13",
    locality: "North York",
    region: "Ontario",
    postalCode: "M2N 5M1",
    /** The room is below street level, at Yonge and Florence. */
    note: "Below street level, at Yonge and Florence",
  },
  phone: { display: "+1 416-992-1203", href: "tel:+14169921203" },
  hours: [
    { day: "Monday", open: "11:00", close: "22:00" },
    { day: "Tuesday", open: "11:00", close: "22:00" },
    { day: "Wednesday", open: "11:00", close: "22:00" },
    { day: "Thursday", open: "11:00", close: "22:00" },
    { day: "Friday", open: "11:00", close: "22:00" },
    { day: "Saturday", open: "11:00", close: "22:00" },
    { day: "Sunday", open: "11:00", close: "22:00" },
  ],
  hoursSummary: "Open daily, 11:00 — 22:00",
  map: {
    /**
     * Keyless Google Maps embed. It works, but it is not a documented Google
     * contract. Before launch, swap to the official Maps Embed API, which is
     * free and unlimited but needs a key from the client's Google Cloud
     * project.
     */
    embedSrc: `https://maps.google.com/maps?q=${encodeURIComponent(ADDRESS_QUERY)}&z=16&output=embed`,
    /** The documented Maps URLs format; needs no key. */
    directionsHref: `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(ADDRESS_QUERY)}`,
  },
} as const;
