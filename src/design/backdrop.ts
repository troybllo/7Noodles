/**
 * How strongly the dragon shows behind the menu, as an ink wash, per paper.
 *
 * Kept in a plain module, not the component, so the contrast tests read the
 * real values. Raise either and palette.test.ts checks that text over the
 * dragon's darkest strokes still reads.
 */
export const DRAGON_STRENGTH = { cream: 0.09, red: 0.14 } as const;
