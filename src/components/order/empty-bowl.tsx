import { roughPath } from "@/design/hand-drawn";

/** An empty noodle bowl with a pair of chopsticks resting across it, drawn by hand. */
export function EmptyBowl({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 160 110"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path
        d={roughPath(
          [
            [18, 48],
            [30, 82],
            [80, 98],
            [130, 82],
            [142, 48],
          ],
          { seed: 3, wobble: 1.2 },
        )}
      />
      <path
        d={roughPath(
          [
            [14, 48],
            [80, 42],
            [146, 48],
          ],
          { seed: 5, wobble: 1 },
        )}
      />
      <path
        d={roughPath(
          [
            [56, 98],
            [60, 106],
            [100, 106],
            [104, 98],
          ],
          { seed: 7, wobble: 0.8 },
        )}
      />
      <path
        d={roughPath(
          [
            [40, 36],
            [150, 10],
          ],
          { seed: 9, wobble: 0.8 },
        )}
      />
      <path
        d={roughPath(
          [
            [46, 42],
            [154, 20],
          ],
          { seed: 11, wobble: 0.8 },
        )}
      />
    </svg>
  );
}
