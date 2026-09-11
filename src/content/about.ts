/**
 * Brand history and contact.
 *
 * Address, phone and hours are the restaurant's own published details. The
 * prose is PLACEHOLDER and needs replacing after the owner interview — it
 * draws only on what the menu and public listings state, and invents no family
 * history. Putting a brand-history heading on the page makes that gap more
 * visible, not less. The Chinese needs a native review.
 */

export const ABOUT = {
  nameZh: "恰小面",
  nameEn: "7 Noodles",
  vertical: "川味小面",
  heading: "Brand history",
  headingZh: "品牌故事",
  lede: "A Sichuan kitchen on Yonge Street, cooking the food of Chongqing and Leshan the way it is cooked there.",
  /** Scrolls past the sticky column. */
  story: [
    {
      title: "The cooking",
      body: "Sichuan and Chongqing, from a room below street level at Yonge and Florence. Noodles tossed at the pass so nothing sits. Wontons pleated one at a time. Skewers fried the way Leshan fries them, then tossed in chilli.",
    },
    {
      title: "麻辣",
      body: "Sichuan peppercorn before chilli, in that order, on purpose. The numbing arrives first and the heat follows it. Get the order the wrong way round and it is just spicy food.",
    },
    {
      title: "Named for someone",
      body: "Grandma Jiang's osmanthus jelly. Aunt Zhao's burning noodles. Dishes here carry the names of the people they came from, which is not a marketing decision — it is how the recipes arrived.",
    },
  ],
  /** The practical detail, in the second scrolling column. */
  contact: [
    { label: "Find us", body: "4664 Yonge St, Unit 13\nNorth York, Ontario\nM2N 5M1" },
    { label: "Hours", body: "Monday to Sunday\n11:00 — 22:00" },
    { label: "Call", body: "+1 416-992-1203" },
    { label: "Order", body: "Pickup, ready in about 15 minutes" },
  ],
  form: {
    title: "Send a message",
    note: "The message form is not connected yet — call the restaurant to reach them today.",
    fields: ["Name", "Email", "Message"],
  },
} as const;
