/**
 * The documented palette.
 *
 * The values here mirror the `@theme` block in src/app/globals.css, which is
 * what the running site actually uses. palette.test.ts parses that file and
 * fails if the two ever drift, so this stays a description of the truth rather
 * than a second copy of it.
 */

/**
 * Grounds text is checked against. The two paper grounds are measured from the
 * generated tiles at their worst case for the text they carry: red paper at its
 * lightest crease (it only carries light text), cream paper at its darkest (it
 * only carries dark text). See scripts/generate-textures.mjs.
 */
export type Ground = "rice" | "ink" | "red-paper" | "cream-paper";

export type Swatch = {
  /** Token name, matching `--color-{token}` and the Tailwind utility. */
  token: string;
  hex: string;
  /** Traditional name, where the colour comes from one. */
  chinese?: string;
  english: string;
  /** What this value is for. */
  usage: string;
  /** Grounds this colour is allowed to carry body text on. */
  textOn: Ground[];
};

export type SwatchGroup = {
  name: string;
  note: string;
  swatches: Swatch[];
};

export const GROUND_HEX: Record<Ground, string> = {
  rice: "#f2eee5",
  ink: "#12100e",
  "red-paper": "#9a211c",
  "cream-paper": "#ded5c6",
};

export const PALETTE: SwatchGroup[] = [
  {
    name: "Handmade",
    note: "The redesign's palette: red paper, cream paper and ink, with red as the only accent. The paper itself is a texture; these are its fallback colours and the colours set on it.",
    swatches: [
      {
        token: "chili",
        hex: "#8b1f1b",
        chinese: "辣椒红",
        english: "Chilli red",
        usage:
          "The red paper ground (the tile's median tone), and red type on cream paper.",
        textOn: ["cream-paper"],
      },
      {
        token: "chili-deep",
        hex: "#6b1814",
        english: "Deep chilli",
        usage: "Pressed states and offset shadows on red paper.",
        textOn: ["cream-paper"],
      },
      {
        token: "cream",
        hex: "#f6f5e9",
        english: "Cream",
        usage: "Buttons, handwriting and notes on red paper and on ink.",
        textOn: ["red-paper", "ink"],
      },
      {
        token: "parchment",
        hex: "#e3ccb2",
        english: "Parchment",
        usage: "Poster lettering and brush characters on red paper.",
        textOn: ["red-paper"],
      },
      {
        token: "mist",
        hex: "#dad8d8",
        english: "Mist",
        usage: "Navigation labels on red paper, a shade quieter than the headline.",
        textOn: ["red-paper"],
      },
      {
        token: "vermilion",
        hex: "#d63a26",
        chinese: "朱红",
        english: "Vermilion",
        usage: "The flat ground under black ink paintings. Carries no text.",
        textOn: [],
      },
      {
        token: "cream-paper",
        hex: "#e5ddcb",
        english: "Cream paper",
        usage: "The cream paper ground (the tile's median tone).",
        textOn: [],
      },
    ],
  },
  {
    name: "Ground",
    note: "Structural surfaces. Everything else sits on one of these two.",
    swatches: [
      {
        token: "ink",
        hex: "#12100e",
        english: "Ink",
        usage: "Primary dark ground. Warm, not neutral black.",
        textOn: [],
      },
      {
        token: "ink-deep",
        hex: "#0a0908",
        english: "Deep ink",
        usage: "Full-bleed sections that need to recede behind ink panels.",
        textOn: [],
      },
      {
        token: "ink-soft",
        hex: "#211d19",
        english: "Soft ink",
        usage: "Raised panels and cards on an ink ground.",
        textOn: [],
      },
      {
        token: "rice",
        hex: "#f2eee5",
        chinese: "白",
        english: "Rice paper",
        usage: "Primary light ground.",
        textOn: ["ink"],
      },
      {
        token: "rice-dim",
        hex: "#e7e7dc",
        english: "Dim rice",
        usage: "Alternating band to separate two light sections.",
        textOn: ["ink"],
      },
      {
        token: "paper",
        hex: "#dad6cb",
        english: "Paper",
        usage: "Rules, borders, disabled surfaces.",
        textOn: ["ink"],
      },
    ],
  },
  {
    name: "Peach red",
    note: "The primary accent, and the only colour that should ever read as loud. Used sparingly is what separates this from every other Chinese restaurant site.",
    swatches: [
      {
        token: "peach",
        hex: "#c14a50",
        chinese: "桃紅",
        english: "Peach red",
        usage: "Panel fills, graphic elements, display type above 24px.",
        textOn: [],
      },
      {
        token: "peach-deep",
        hex: "#b12959",
        english: "Deep peach",
        usage: "Pressed states, deeper fills.",
        textOn: ["rice"],
      },
      {
        token: "peach-text",
        hex: "#bd4147",
        english: "Peach, text safe",
        usage: "Body-size text and icons on a light ground.",
        textOn: ["rice"],
      },
      {
        token: "peach-glow",
        hex: "#c6595e",
        english: "Peach, reversed",
        usage: "Body-size text and icons on an ink ground.",
        textOn: ["ink"],
      },
    ],
  },
  {
    name: "Pine",
    note: "The secondary. Matcha olive, taken from 風入松 — wind in the pines. Retuned 1.4% darker than the reference so the same value works as a fill and as a ground for small rice-coloured text.",
    swatches: [
      {
        token: "pine",
        hex: "#736e3e",
        chinese: "風入松",
        english: "Wind in the pines",
        usage: "Panel fills, display type, and grounds carrying rice-coloured body text.",
        textOn: ["rice"],
      },
      {
        token: "pine-deep",
        hex: "#76796e",
        chinese: "绿沉",
        english: "Deep green",
        usage: "Cool counterweight to the warm neutrals.",
        textOn: [],
      },
      {
        token: "pine-glow",
        hex: "#837d46",
        english: "Pine, reversed",
        usage: "Body-size text on an ink ground.",
        textOn: ["ink"],
      },
    ],
  },
  {
    name: "Agarwood",
    note: "Warm neutral. Secondary text, metadata, hairlines.",
    swatches: [
      {
        token: "agar",
        hex: "#897367",
        chinese: "沉香",
        english: "Agarwood",
        usage: "Hairlines and large muted type.",
        textOn: [],
      },
      {
        token: "agar-text",
        hex: "#7c685e",
        english: "Agarwood, text safe",
        usage: "Secondary body text on a light ground.",
        textOn: ["rice"],
      },
      {
        token: "agar-glow",
        hex: "#8d776a",
        english: "Agarwood, reversed",
        usage: "Secondary body text on an ink ground.",
        textOn: ["ink"],
      },
    ],
  },
  {
    name: "Panel shades",
    note: "Behind the showcase placeholders. Each is its own panel's colour taken down, so a reserved frame reads as part of the panel rather than a grey hole in it.",
    swatches: [
      {
        token: "pine-shade",
        hex: "#302e1a",
        english: "Pine, shaded",
        usage: "Placeholder ground in the pine panel.",
        textOn: [],
      },
      {
        token: "peach-shade",
        hex: "#4a1125",
        english: "Peach, shaded",
        usage: "Placeholder ground in the peach panel.",
        textOn: [],
      },
      {
        token: "rice-shade",
        hex: "#3a362e",
        english: "Rice, shaded",
        usage:
          "Placeholder ground in the rice panel. Desaturated rather than simply darkened — taking rice down by lightness alone turns it brown.",
        textOn: [],
      },
    ],
  },
  {
    name: "Bronze",
    note: "From the poster reference. The only accent that clears body-text contrast against rice without a derived variant.",
    swatches: [
      {
        token: "bronze",
        hex: "#72511e",
        english: "Bronze",
        usage: "Vertical Chinese columns, rules and marks on a rice ground.",
        textOn: ["rice"],
      },
    ],
  },
  {
    name: "Lantern",
    note: "Warm yellow, from the lantern light in the reference. Dark-ground only: it sits at 1.94:1 on rice, so it can never carry text on a light surface.",
    swatches: [
      {
        token: "lantern",
        hex: "#d9a441",
        english: "Lantern",
        usage: "Accent and text on ink. Glow, highlights, hover states.",
        textOn: ["ink"],
      },
      {
        token: "lantern-text",
        hex: "#8d651c",
        english: "Lantern, light ground",
        usage: "The fallback when lantern is needed on rice.",
        textOn: ["rice"],
      },
    ],
  },
];
