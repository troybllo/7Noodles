import { PHOTOS } from "./photos";

/** Hero copy: the name, its two photographs (a pull of noodles lifted high, the wok on fire), and the call to action. */
export const HERO = {
  title: "Seven Noodles",
  nameZh: "恰小面",
  action: { label: "Order now", href: "/order" },
  photos: {
    /** `focus` is the object-position that keeps the subject in frame as the photo crops. */
    primary: { ...PHOTOS.noodlePullHigh, focus: "50% 45%" },
    secondary: { ...PHOTOS.wokFlame, focus: "50% 62%" },
  },
} as const;
