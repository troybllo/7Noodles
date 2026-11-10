import { PHOTOS } from "./photos";

/** Hero copy: the name, its two photographs (a diner and her bowl, the wok on fire), and the call to action. */
export const HERO = {
  title: "Seven Noodles",
  nameZh: "恰小面",
  action: { label: "Order now", href: "/order" },
  photos: {
    /** `focus` is the object-position that keeps the subject in frame as the photo crops. */
    primary: { ...PHOTOS.bowlHeldUp, focus: "50% 67%" },
    secondary: { ...PHOTOS.wokFlame, focus: "50% 62%" },
  },
} as const;
