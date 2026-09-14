import Image from "next/image";
import type { CSSProperties } from "react";

const LANTERNS = {
  a: { src: "/ornaments/lantern-a.png", width: 420, height: 918 },
  b: { src: "/ornaments/lantern-b.png", width: 420, height: 888 },
} as const;

type HangingLanternProps = {
  variant: keyof typeof LANTERNS;
  /** Rendered width of the lantern, as a CSS length. */
  width: string;
  /** Length of thread above the lantern, as a CSS length. */
  drop: string;
  /** `sizes` for the image, matching `width` at each breakpoint. */
  sizes: string;
  /** A warm light behind the paper. Only reads on a dark ground. */
  glow?: boolean;
  /** Seconds per swing, so neighbouring lanterns never move in step. */
  sway?: number;
  /** Seconds into the swing to start, for the same reason. */
  offset?: number;
  /** Positioning, from the composition that places it. */
  className?: string;
};

/**
 * A lantern hanging from the top of its container on a thread, swaying.
 *
 * The swing pivots at the top of the thread, so the lantern moves as a hung
 * weight rather than rocking in place. The glow is a separate layer that
 * breathes on its own timing. Both are CSS keyframes, and both come to rest
 * under reduced motion.
 *
 * Decorative: hidden from assistive technology and never interactive.
 */
export function HangingLantern({
  variant,
  width,
  drop,
  sizes,
  glow = false,
  sway = 7,
  offset = 0,
  className,
}: HangingLanternProps) {
  const lantern = LANTERNS[variant];
  const timing: CSSProperties = {
    animationDuration: `${sway}s`,
    animationDelay: `${-offset}s`,
  };

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute top-0 ${className ?? ""}`}
      style={{ width }}
    >
      <div className="animate-lantern-sway origin-top" style={timing}>
        <div
          className={`mx-auto w-px ${glow ? "bg-rice/30" : "bg-ink/40"}`}
          style={{ height: drop }}
        />
        <div className="relative">
          {glow ? (
            <div
              className="animate-lantern-glow absolute top-[42%] left-1/2 aspect-square w-[210%] -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                animationDelay: `${-offset * 0.7}s`,
                background:
                  "radial-gradient(closest-side, color-mix(in srgb, var(--color-lantern) 30%, transparent), color-mix(in srgb, var(--color-peach-glow) 12%, transparent) 55%, transparent)",
              }}
            />
          ) : null}
          <Image
            src={lantern.src}
            width={lantern.width}
            height={lantern.height}
            alt=""
            sizes={sizes}
            className="relative h-auto w-full"
          />
        </div>
      </div>
    </div>
  );
}
