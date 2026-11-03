/**
 * The documented palette.
 *
 * The values here mirror the `@theme` block in src/app/globals.css, which is
 * what the running site actually uses. palette.test.ts parses that file and
 * fails if the two ever drift, so this stays a description of the truth rather
 * than a second copy of it.
 */

/** The grounds text is set on. */
export type Ground = "paper" | "brand" | "brand-soft";

export type Swatch = {
  /** Token name, matching `--color-{token}` and the Tailwind utility. */
  token: string;
  hex: string;
  /** A Chinese name, where the colour carries one in the brand story. */
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
  paper: "#f3eee5",
  brand: "#862218",
  "brand-soft": "#e9e0d1",
};

export const PALETTE: SwatchGroup[] = [
  {
    name: "Heritage Red on Paper Ivory",
    note: "The brand guide's main colours: Heritage Red for type, bands, buttons and the logo, on Paper Ivory. Photographs carry every other colour.",
    swatches: [
      {
        token: "paper",
        hex: "#f3eee5",
        chinese: "宣纸白",
        english: "Paper Ivory",
        usage: "The page; text and buttons on red bands.",
        textOn: ["brand"],
      },
      {
        token: "brand",
        hex: "#862218",
        chinese: "朱红",
        english: "Heritage Red",
        usage: "All type on ivory, the red bands, buttons, the logo.",
        textOn: ["paper", "brand-soft"],
      },
      {
        token: "brand-deep",
        hex: "#641910",
        english: "Deep red",
        usage: "Pressed states and small print.",
        textOn: ["paper", "brand-soft"],
      },
      {
        token: "brand-soft",
        hex: "#e9e0d1",
        english: "Soft ivory",
        usage: "Wells and photo placeholders on ivory.",
        textOn: ["brand"],
      },
    ],
  },
  {
    name: "Supporting",
    note: "The guide's supporting colours, for accents. Gold reads on red; ink reads on ivory.",
    swatches: [
      {
        token: "gold",
        hex: "#f2d288",
        chinese: "蜀绣金",
        english: "Embroidery Gold",
        usage: "Accents on red bands.",
        textOn: ["brand"],
      },
      {
        token: "ink",
        hex: "#110c05",
        chinese: "墨砚黑",
        english: "Ink Black",
        usage: "The guide's functional colour.",
        textOn: ["paper", "brand-soft"],
      },
      {
        token: "bamboo",
        hex: "#aeb975",
        chinese: "竹影青",
        english: "Bamboo Green",
        usage: "Accents only — too light for text.",
        textOn: [],
      },
    ],
  },
  {
    name: "Badges",
    note: "The marks on every dish — vegetarian, seafood and the owner's allergen marks — on ivory.",
    swatches: [
      {
        token: "jade",
        hex: "#3d6a44",
        english: "Jade",
        usage: "Vegetarian and vegan badges.",
        textOn: ["paper"],
      },
      {
        token: "sea",
        hex: "#2b5f7a",
        english: "Sea",
        usage: "Seafood badges.",
        textOn: ["paper"],
      },
      {
        token: "bronze",
        hex: "#7a5320",
        english: "Bronze",
        usage: "Peanut, sesame and mustard badges.",
        textOn: ["paper"],
      },
    ],
  },
];
