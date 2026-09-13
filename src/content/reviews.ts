/**
 * Reviews left for the restaurant on its previous ordering platform
 * (7noodles.com/reviews), captured 2026-09-13.
 *
 * Verbatim — spelling, capitalisation and punctuation as posted, including the
 * lower-case and the stray space in "well -balanced". Names and dates are as
 * published. Each rating was read from that review's own star markup rather
 * than assumed; all eight are genuinely five of five.
 *
 * Interim. These move into the reviews table in the commerce phase, where new
 * reviews are written and moderated.
 */

export type Review = {
  name: string;
  date: string;
  /** Out of five. */
  rating: number;
  text: string;
};

export const REVIEWS: Review[] = [
  {
    name: "Kevin",
    date: "August 29, 2026",
    rating: 5,
    text: "Fresh and delicious",
  },
  {
    name: "thalia",
    date: "August 22, 2026",
    rating: 5,
    text: "first time trying it; the place inside is adorable, and i ordered the traditional beef noodle soup- so so good and filling. spicier than i expected but i loved it.",
  },
  {
    name: "Divya Arya",
    date: "August 12, 2026",
    rating: 5,
    text: "peanut and cucumber salad is just amazing :)",
  },
  {
    name: "Kelly",
    date: "July 10, 2026",
    rating: 5,
    text: "Some of the best noodles I’ve had!",
  },
  {
    name: "Charles Trinh",
    date: "June 29, 2026",
    rating: 5,
    text: "Very good and authentic Chinese cuisine.",
  },
  {
    name: "Fulbert",
    date: "April 05, 2026",
    rating: 5,
    text: "Recommended by @i.get.food and @insta.noodls, it was definitely worth the trek. The Braised Beef Noodle Soup and Wonton in Chicken Soup were both delectable, with the combination of the ingredients well -balanced with the herbs and spices and the broth. Has become a new favourite of ours, so we'll definitely be visiting sooner than later to try the other dishes.",
  },
  {
    name: "Ben Kim",
    date: "March 20, 2026",
    rating: 5,
    text: "Amazing food. Very authentic Chinese noodle place.",
  },
  {
    name: "Selina",
    date: "December 06, 2025",
    rating: 5,
    text: "Good",
  },
];
