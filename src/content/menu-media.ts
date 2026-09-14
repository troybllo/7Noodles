import { PHOTOS } from "./hero";

/**
 * Photography and video for the menu, keyed by slug.
 *
 * Deliberately sparse. The four photographs we hold show dishes whose exact
 * menu names are unconfirmed, so none is pinned to a single dish — a photo of
 * the wrong noodles under a dish name is worse than a placeholder. They cover
 * only the two categories where what they show is unambiguous.
 *
 * When the shoot lands, dishes gain entries here (and later a column in the
 * database); a `video` adds the Aritzia hover loop.
 */

export type Media = { src: string; alt: string };

export type DishMedia = {
  photo?: Media;
  /** 2–3s silent loop, 4:5, with the photo used as its poster. */
  video?: { src: string };
};

export const CATEGORY_COVERS: Partial<Record<string, Media>> = {
  "traditional-noodle-soup": {
    src: PHOTOS.noodleSoup,
    alt: "Beef noodle soup with greens and chilli oil",
  },
  appetizers: {
    src: PHOTOS.chicken,
    alt: "Sliced chicken in red chilli oil with peanuts and scallion",
  },
};

export const DISH_MEDIA: Partial<Record<string, DishMedia>> = {};
