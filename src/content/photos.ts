import type { Media } from "./menu-media";

/**
 * The restaurant's own photographs (November 2026): the Tezza shoot of the
 * kitchen and the tables, and the DSC shoot of the room and storefront.
 * 1800px WebP in public/photos/story; originals in data/photos-nov/.
 * The diners' shots show chopsticks; the client's forks request covers the
 * site's own artwork, and these were approved for the red story band.
 */
const photo = (name: string, alt: string): Media => ({
  src: `/photos/story/${name}.webp`,
  alt,
});

export const PHOTOS = {
  dryNoodlesUntossed: photo(
    "dry-noodles-untossed",
    "A bowl of dry noodles before tossing: wide noodles under minced pork sauce, tomato and greens",
  ),
  servedAtThePass: photo(
    "served-at-the-pass",
    "Gloved hands setting a bowl of wanza noodles on the steel counter at the kitchen pass",
  ),
  seasoningAtThePass: photo(
    "seasoning-at-the-pass",
    "A cook shaking seasoning over a bowl of noodles with green and red chilies",
  ),
  noodlesInTheWok: photo(
    "noodles-in-the-wok",
    "Noodles being stirred in a steaming pot on the kitchen's burner",
  ),
  braisedBeefSoup: photo(
    "braised-beef-soup",
    "A bowl of braised beef noodle soup in red broth, topped with cilantro and scallion, held at the pass",
  ),
  chiliPastePot: photo(
    "chili-paste-pot",
    "Hot oil poured into a deep pot of red chili paste",
  ),
  wokFire: photo("wok-fire", "Peppers and onions in a smoking wok over the flame"),
  chiliOilOnWontons: photo(
    "chili-oil-on-wontons",
    "A ladle of red chili oil drizzled over a bowl of wontons",
  ),
  kitchenCurtain: photo(
    "kitchen-curtain",
    "The red curtain into the kitchen, beside gold shelves of lucky figurines and candles",
  ),
  vitasoy: photo("vitasoy", "Two glass bottles of Vitasoy soy milk, held up"),
  birthdayBowl: photo(
    "birthday-bowl",
    "Wanza noodles with a Happy Birthday topper, among party hats and streamers",
  ),
  noodlePullBooth: photo(
    "noodle-pull-booth",
    "A diner in a leather booth lifting a tall pull of noodles from her bowl",
  ),
  noodlePullHigh: photo(
    "noodle-pull-high",
    "Noodles lifted high above an orange bowl of dry noodles with greens",
  ),
  dinerAtTheTable: photo(
    "diner-at-the-table",
    "A diner at a wooden table lifting noodles from his bowl, a cold beer beside him",
  ),
  bowlHeldUp: photo(
    "bowl-held-up",
    "A smiling diner holding up a bowl of dry noodles with peppers, pork and sesame",
  ),
  wokFlame: photo(
    "wok-flame",
    "Flames leaping from a wok of vegetables over the burner in the kitchen",
  ),
  noodleSlurp: photo(
    "noodle-slurp",
    "A diner in a booth slurping a long pull of noodles from an orange bowl",
  ),
  wokToBowl: photo(
    "wok-to-bowl",
    "A cook tipping a dish from the wok into a waiting bowl at the pass",
  ),
  theTeam: photo(
    "the-team",
    "Three of the 7 Noodles team in aprons and party hats, holding bowls of noodles under the shop's red sign",
  ),
  friendsAtTheTable: photo(
    "friends-at-the-table",
    "Two friends sharing a meal of noodles at a wooden table",
  ),
  luckyCatShelf: photo(
    "lucky-cat-shelf",
    "Lucky cat figurines on glowing orange shelves in the dining room",
  ),
  birthdayTable: photo(
    "birthday-table",
    "A birthday table from above: wanza noodles and a noodle soup among party hats and streamers",
  ),
  storefront: photo(
    "storefront",
    "The Seven Noodles storefront: a red 恰小面 sign over the stairs down to the door",
  ),
  diningRoomCorner: photo(
    "dining-room-corner",
    "A round table by the windows, under a woven pendant lamp, with calligraphy scrolls and potted plants",
  ),
  diningRoomBooths: photo(
    "dining-room-booths",
    "The dining room: wooden tables, tan leather booths and a row of potted palms under hanging lights",
  ),
} as const;
