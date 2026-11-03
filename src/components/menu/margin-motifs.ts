import { roughPath, type Point } from "@/design/hand-drawn";

/**
 * The drawings in the menu's side margins, one per category, in the same
 * hand-drawn line as the site's arrows and underlines.
 *
 * Every drawing lives in a 100 × 800 box (the margin's shape). Paths are
 * strokes so they can draw themselves on; `idle` names the gentle loop the
 * drawing keeps up while it is shown.
 */

export const VIEW_W = 100;
export const VIEW_H = 800;

export type MotifPath = { d: string; width?: number; opacity?: number };

export type Motif = {
  paths: MotifPath[];
  /** A CSS animation class kept running while the drawing is shown. */
  idle: "sway" | "drift" | "rise" | "none";
};

/** A closed, hand-drawn loop through points around a centre. */
function blob(
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  seed: number,
  lobes = 0,
): string {
  const points: Point[] = [];
  const steps = 14;
  for (let i = 0; i <= steps; i++) {
    const a = (i / steps) * Math.PI * 2;
    const bump = lobes ? 1 + Math.sin(a * lobes) * 0.12 : 1;
    points.push([cx + Math.cos(a) * rx * bump, cy + Math.sin(a) * ry * bump]);
  }
  return roughPath(points, { seed, wobble: 1.2 });
}

const line = (points: Point[], seed: number, wobble = 1.5) =>
  roughPath(points, { seed, wobble });

/** A noodle hanging and swinging: a lazy S down the margin. */
function strand(
  seed: number,
  phase: number,
  reach: number,
  top = 96,
  bottom = VIEW_H - 20,
) {
  const points: Point[] = [[46 + phase * 2, top]];
  for (let y = top + 24; y <= bottom; y += 48) {
    const t = (y - top) / (bottom - top);
    points.push([50 + Math.sin(t * Math.PI * 3 + phase) * reach * (0.4 + t * 0.6), y]);
  }
  return line(points, seed, 2.2);
}

const CHOPSTICKS: MotifPath[] = [
  {
    d: line(
      [
        [8, 10],
        [52, 84],
      ],
      3,
      0.6,
    ),
    width: 3.5,
  },
  {
    d: line(
      [
        [30, 4],
        [56, 86],
      ],
      5,
      0.6,
    ),
    width: 3.5,
  },
];

/** Traditional xiaomian: noodles lifted on chopsticks. */
const noodles: Motif = {
  idle: "sway",
  paths: [
    ...CHOPSTICKS,
    { d: strand(11, 0, 22), width: 2.4 },
    { d: strand(23, 1.1, 18), width: 2, opacity: 0.6 },
    { d: strand(37, 2.3, 26), width: 1.6, opacity: 0.45 },
  ],
};

/** Chef's specials: noodles tossed out of a wok over flame. */
const wok: Motif = {
  idle: "sway",
  paths: [
    // Tossed noodles arcing up out of the pan.
    {
      d: line(
        [
          [22, 520],
          [18, 380],
          [44, 260],
          [70, 330],
          [62, 470],
        ],
        41,
        2,
      ),
      width: 2.2,
    },
    {
      d: line(
        [
          [34, 520],
          [36, 300],
          [60, 220],
          [80, 290],
          [72, 450],
        ],
        43,
        2,
      ),
      width: 1.8,
      opacity: 0.6,
    },
    {
      d: line(
        [
          [46, 520],
          [52, 360],
          [74, 340],
          [80, 420],
        ],
        47,
        2,
      ),
      width: 1.6,
      opacity: 0.45,
    },
    // The wok and its handle.
    {
      d: line(
        [
          [6, 560],
          [20, 610],
          [50, 626],
          [80, 610],
          [94, 560],
        ],
        49,
        1,
      ),
      width: 3,
    },
    {
      d: line(
        [
          [94, 560],
          [100, 548],
        ],
        51,
        0.4,
      ),
      width: 3,
    },
    // Flame licking up under the pan.
    {
      d: line(
        [
          [30, 700],
          [36, 660],
          [40, 690],
          [48, 640],
          [54, 690],
          [60, 656],
          [66, 700],
        ],
        53,
        1.5,
      ),
      width: 2.2,
    },
    {
      d: line(
        [
          [38, 720],
          [44, 690],
          [50, 712],
          [56, 686],
          [62, 720],
        ],
        55,
        1.2,
      ),
      width: 1.6,
      opacity: 0.6,
    },
  ],
};

/** Noodles in soup: steam rising off a bowl. */
const steam: Motif = {
  idle: "rise",
  paths: [
    {
      d: line(
        [
          [30, 470],
          [22, 400],
          [36, 330],
          [24, 250],
          [34, 170],
        ],
        61,
        1.5,
      ),
      width: 2,
      opacity: 0.6,
    },
    {
      d: line(
        [
          [50, 470],
          [60, 390],
          [44, 310],
          [58, 220],
          [48, 120],
        ],
        63,
        1.5,
      ),
      width: 2.2,
    },
    {
      d: line(
        [
          [70, 470],
          [78, 410],
          [66, 340],
          [76, 270],
        ],
        67,
        1.5,
      ),
      width: 1.8,
      opacity: 0.5,
    },
    // The bowl, its rim and foot.
    {
      d: line(
        [
          [4, 520],
          [96, 520],
        ],
        69,
        0.6,
      ),
      width: 3,
    },
    {
      d: line(
        [
          [6, 524],
          [16, 600],
          [50, 640],
          [84, 600],
          [94, 524],
        ],
        71,
        1,
      ),
      width: 3,
    },
    {
      d: line(
        [
          [36, 644],
          [64, 644],
        ],
        73,
        0.6,
      ),
      width: 3,
    },
    // A ripple on the broth.
    {
      d: line(
        [
          [22, 540],
          [38, 548],
          [54, 540],
          [70, 548],
          [80, 542],
        ],
        75,
        0.8,
      ),
      width: 1.4,
      opacity: 0.5,
    },
  ],
};

/** A dumpling: a pouch with a pinched, pleated top. */
function dumpling(cx: number, cy: number, s: number, seed: number): MotifPath[] {
  return [
    {
      d: line(
        [
          [cx - 14 * s, cy],
          [cx - 12 * s, cy + 12 * s],
          [cx, cy + 16 * s],
          [cx + 12 * s, cy + 12 * s],
          [cx + 14 * s, cy],
          [cx + 6 * s, cy - 10 * s],
          [cx, cy - 16 * s],
          [cx - 6 * s, cy - 10 * s],
          [cx - 14 * s, cy],
        ],
        seed,
        1,
      ),
      width: 2,
    },
    {
      d: line(
        [
          [cx - 4 * s, cy - 8 * s],
          [cx, cy - 2 * s],
          [cx + 4 * s, cy - 8 * s],
        ],
        seed + 1,
        0.5,
      ),
      width: 1.4,
      opacity: 0.6,
    },
  ];
}

/** House-made dumplings, drifting down the margin. */
const dumplings: Motif = {
  idle: "drift",
  paths: [
    ...dumpling(36, 140, 1.6, 81),
    ...dumpling(68, 300, 1.2, 83),
    ...dumpling(34, 450, 1.4, 85),
    ...dumpling(66, 610, 1.7, 87),
  ],
};

/** A wide, flat BiangBiang ribbon: two edges folding down the margin. */
function ribbon(offset: number, seed: number): MotifPath[] {
  const left: Point[] = [];
  const right: Point[] = [];
  for (let y = 60; y <= VIEW_H - 40; y += 70) {
    const x = 50 + Math.sin(y / 110 + offset) * 26;
    left.push([x - 9, y]);
    right.push([x + 9, y + 6]);
  }
  return [
    { d: line(left, seed, 1.5), width: 2.2 },
    { d: line(right, seed + 1, 1.5), width: 2.2, opacity: 0.7 },
  ];
}

/** Something special: wide, hand-pulled ribbon noodles. */
const ribbons: Motif = {
  idle: "sway",
  paths: [
    ...ribbon(0, 91),
    ...ribbon(2.4, 95).map((p) => ({ ...p, opacity: (p.opacity ?? 1) * 0.5 })),
  ],
};

/** A skewer: a stick at an angle, threaded with chunks. */
function skewer(x: number, y: number, seed: number): MotifPath[] {
  const end: Point = [x + 34, y + 150];
  const chunks = [0.18, 0.38, 0.58].map((t, i) => {
    const cx = x + (end[0] - x) * t;
    const cy = y + (end[1] - y) * t;
    return { d: blob(cx, cy, 11, 9, seed + i + 1, 3), width: 2 };
  });
  return [{ d: line([[x, y], end], seed, 0.6), width: 2.2 }, ...chunks];
}

/** Leshan fried skewers. */
const skewers: Motif = {
  idle: "sway",
  paths: [...skewer(14, 70, 101), ...skewer(40, 290, 111), ...skewer(10, 500, 121)],
};

/** A chili: a curved pod with a stalk. */
function chili(x: number, y: number, s: number, seed: number): MotifPath[] {
  return [
    {
      d: line(
        [
          [x, y],
          [x + 10 * s, y + 6 * s],
          [x + 18 * s, y + 26 * s],
          [x + 14 * s, y + 52 * s],
          [x + 6 * s, y + 40 * s],
          [x + 2 * s, y + 16 * s],
          [x, y],
        ],
        seed,
        0.8,
      ),
      width: 2,
    },
    {
      d: line(
        [
          [x + 2 * s, y],
          [x - 4 * s, y - 10 * s],
        ],
        seed + 1,
        0.4,
      ),
      width: 1.8,
    },
  ];
}

/** Appetizers: chilies and Sichuan peppercorns. */
const chilies: Motif = {
  idle: "drift",
  paths: [
    ...chili(30, 90, 1.4, 131),
    ...chili(58, 300, 1.1, 133),
    ...chili(24, 480, 1.3, 135),
    ...chili(60, 640, 1, 137),
    ...[200, 410, 580, 730].map((y, i) => ({
      d: blob(i % 2 ? 30 : 70, y, 5, 5, 141 + i),
      width: 1.8,
      opacity: 0.7,
    })),
  ],
};

/** Extra toppings: stewed yellow peas and a fried egg. */
const toppings: Motif = {
  idle: "drift",
  paths: [
    { d: blob(50, 170, 34, 26, 151, 4), width: 2 },
    { d: blob(54, 172, 11, 10, 153), width: 2 },
    ...[
      [30, 360],
      [52, 380],
      [70, 352],
      [40, 410],
      [62, 430],
      [34, 560],
      [58, 590],
      [46, 640],
      [70, 620],
      [28, 690],
    ].map(([x, y], i) => ({
      d: blob(x!, y!, 7, 7, 161 + i),
      width: 1.8,
      opacity: i % 3 ? 0.65 : 1,
    })),
  ],
};

/** A jelly cube, a little turned. */
function cube(cx: number, cy: number, s: number, seed: number): MotifPath[] {
  const corners: Point[] = [
    [cx - s, cy - s * 0.8],
    [cx + s * 0.8, cy - s],
    [cx + s, cy + s * 0.8],
    [cx - s * 0.8, cy + s],
    [cx - s, cy - s * 0.8],
  ];
  return [{ d: line(corners, seed, 0.8), width: 2 }];
}

/** Desserts: ice jelly cubes and osmanthus blossoms. */
const sweets: Motif = {
  idle: "drift",
  paths: [
    ...cube(36, 140, 16, 171),
    ...cube(64, 330, 13, 173),
    ...cube(32, 520, 15, 175),
    ...[240, 430, 640].map((y, i) => ({
      d: blob(i % 2 ? 34 : 66, y, 9, 9, 181 + i, 4),
      width: 1.8,
      opacity: 0.75,
    })),
  ],
};

export const MOTIFS = {
  noodles,
  wok,
  steam,
  dumplings,
  ribbons,
  skewers,
  chilies,
  toppings,
  sweets,
};

export type MotifKey = keyof typeof MOTIFS;

/** Which drawing each menu category shows. */
export const CATEGORY_MOTIF: Record<string, MotifKey> = {
  "traditional-xiaomian": "noodles",
  "chefs-special-noodles": "wok",
  "noodles-in-soup": "steam",
  "sichuan-wontons": "dumplings",
  "something-special": "ribbons",
  "leshan-fried-skewers": "skewers",
  appetizers: "chilies",
  "extra-toppings": "toppings",
  desserts: "sweets",
};
