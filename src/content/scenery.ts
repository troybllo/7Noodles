/**
 * The client's illustrations (November 2026), set around the site for
 * atmosphere. Bamboo and hibiscus are cut out to sit on any paper section;
 * the two scenes keep their own painted ground. Originals in data/photos-nov/.
 */
export const SCENERY = {
  bamboo: { src: "/scenery/bamboo.webp", width: 900, height: 953 },
  hibiscus: { src: "/scenery/hibiscus.webp", width: 900, height: 870 },
  dujiangyan: {
    src: "/scenery/dujiangyan.webp",
    width: 1254,
    height: 1254,
    alt: "Illustration of the Dujiangyan waterworks in Sichuan: the Fish Mouth levee splitting a jade river between wooded banks and misty mountains",
  },
  shadowTheatre: {
    src: "/scenery/shadow-theatre.webp",
    width: 1448,
    height: 1086,
    alt: "Illustration of two puppeteers in embroidered robes performing a shadow-puppet play behind a lantern-lit screen",
  },
} as const;
