/**
 * Events at the restaurant: tastings, festival menus, collaborations.
 *
 * The owner announces them here. Add one to the list and it appears on
 * /events, and on the home page while it is the next one coming up. Once its
 * date has passed it moves to "Past events" by itself.
 *
 * Dates are calendar dates in Toronto, written YYYY-MM-DD. Times are free
 * text ("6 – 9 pm") because that is how the owner will write them.
 */

export type RestaurantEvent = {
  slug: string;
  title: string;
  titleZh?: string;
  /** The day it happens, or the first day of a run. */
  date: string;
  /** The last day of a run, when it lasts more than one day. */
  endDate?: string;
  time?: string;
  description: string;
  image?: { src: string; alt: string };
  /** Somewhere to book, RSVP or read more. */
  link?: { href: string; label: string };
  /** A placeholder written by us, not announced by the owner: never shown in production. */
  placeholder?: boolean;
};

export const EVENTS: RestaurantEvent[] = [
  {
    slug: "sample-event",
    title: "Sample event — replace with the owner's first announcement",
    titleZh: "活动示例",
    date: "2026-11-14",
    time: "6 – 9 pm",
    description:
      "This is a placeholder showing how an event will look. Give it a title, a date and a few lines about what is happening, and an optional photo and link.",
    placeholder: true,
  },
];
