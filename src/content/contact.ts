/**
 * The restaurant's contact details, written down once: every section, the
 * footer and the structured data read them from here. No email yet; add one
 * when the owner supplies it.
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
  /** Shown at checkout. TODO(owner): replace with the restaurant's own cancellation policy. */
  orderPolicy:
    "Need to change or cancel? Call us before your pickup time and we'll sort it out.",
  map: {
    /** Keyless embed. TODO(launch): the official Maps Embed API, with the client's key. */
    embedSrc: `https://maps.google.com/maps?q=${encodeURIComponent(ADDRESS_QUERY)}&z=16&output=embed`,
    /** The documented Maps URLs format; needs no key. */
    directionsHref: `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(ADDRESS_QUERY)}`,
  },
  /** TODO(owner): confirm which account is official (@7noodles_qia or @qia7noodles). */
  instagram: {
    handle: "@7noodles_qia",
    href: "https://www.instagram.com/7noodles_qia/",
  },
} as const;
