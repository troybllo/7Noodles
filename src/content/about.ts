/**
 * About and contact.
 *
 * The address, phone and hours are the restaurant's own published details.
 * The prose is PLACEHOLDER and needs replacing after the owner interview —
 * it draws only on what the menu and public listings state, and invents no
 * family history. The Chinese needs a native review.
 */

export const ABOUT = {
  nameZh: "恰小面",
  nameEn: "7 Noodles",
  vertical: "川味小面",
  heading: "About",
  columns: [
    {
      title: "The kitchen",
      body: "Sichuan and Chongqing cooking, from a room below street level at Yonge and Florence. Noodles tossed at the pass, wontons folded by hand, skewers fried the way Leshan fries them.",
    },
    {
      title: "Find us",
      body: "4664 Yonge St, Unit 13\nNorth York, Ontario\nM2N 5M1",
    },
    {
      title: "Hours",
      body: "Monday to Sunday\n11:00 — 22:00\nPickup orders until close.",
    },
  ],
  form: {
    title: "Send a message",
    /** Stated plainly, because the form does not send yet. */
    note: "The message form is not connected yet — call the restaurant to reach them today.",
    fields: ["Name", "Email", "Message"],
  },
  panels: [
    {
      key: "hours",
      label: "Hours",
      zh: "营业时间",
      detail: "11:00 — 22:00, seven days",
      ground: "pine",
      shot: "Room at service, warm light, people eating",
    },
    {
      key: "find",
      label: "Find us",
      zh: "地址",
      detail: "4664 Yonge St, Unit 13, North York",
      ground: "peach",
      shot: "Stairs down to the entrance from Yonge Street",
    },
    {
      key: "call",
      label: "Call",
      zh: "电话",
      detail: "+1 416-992-1203",
      ground: "bronze",
      shot: "Pass, tickets up, hands working",
    },
    {
      key: "order",
      label: "Order",
      zh: "点餐",
      detail: "Pickup, ready in about 15 minutes",
      ground: "rice",
      shot: "Bag on the counter, folded top, receipt stapled",
    },
  ],
} as const;
