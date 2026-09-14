/**
 * How strongly the dragon backdrop shows behind the menu, per ground.
 *
 * Kept in a plain module, not the component, so the contrast tests read the
 * real values. Raise either and palette.test.ts checks that text over the
 * dragon's darkest strokes still reads.
 */
export const DRAGON_STRENGTH = { rice: 0.09, dark: 0.11 } as const;
