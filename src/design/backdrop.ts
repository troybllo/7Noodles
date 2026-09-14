/**
 * How strongly the dragon backdrop shows behind the menu, per ground.
 *
 * Kept in a plain module, not the component, so the contrast tests read the
 * real values. Raise either and palette.test.ts checks that text over the
 * dragon's darkest strokes still reads.
 */
export const DRAGON_STRENGTH = { rice: 0.09, dark: 0.11 } as const;

/**
 * The scrim behind a category tile's name on the menu overview: its opacity at
 * the tile's bottom edge, and where the name sits. The contrast tests check the
 * name against it over a pure white photograph, the worst a cover can be.
 */
export const TILE_SCRIM = { base: 0.95, underText: 0.75 } as const;
