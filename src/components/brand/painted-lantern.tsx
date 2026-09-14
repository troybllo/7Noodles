import Image from "next/image";

type PaintedLanternProps = {
  /** Mirror it, so a pair can face each other. */
  mirrored?: boolean;
  /** Seconds per swing; give neighbours different values so they never move in step. */
  sway?: number;
  /** Seconds into the swing to start, for the same reason. */
  offset?: number;
  /** `sizes` for the image, matching its rendered width. */
  sizes: string;
  /** Size and position, from the composition that places it. */
  className?: string;
};

/**
 * The painted red lantern (public/ornaments/lantern-painted.png), swinging
 * gently from the top of its box as a hung weight would.
 *
 * The sway is a CSS keyframe that starts and ends at rest, so under reduced
 * motion the lantern simply hangs still. Decorative: hidden from assistive
 * technology and never interactive.
 */
export function PaintedLantern({
  mirrored = false,
  sway = 7,
  offset = 0,
  sizes,
  className,
}: PaintedLanternProps) {
  return (
    <div aria-hidden="true" className={`pointer-events-none ${className ?? ""}`}>
      <div
        className="animate-lantern-sway origin-top"
        style={{ animationDuration: `${sway}s`, animationDelay: `${-offset}s` }}
      >
        <Image
          src="/ornaments/lantern-painted.png"
          width={700}
          height={875}
          alt=""
          sizes={sizes}
          className={`h-auto w-full ${mirrored ? "-scale-x-100" : ""}`}
        />
      </div>
    </div>
  );
}
