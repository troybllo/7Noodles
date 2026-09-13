import Link from "next/link";

type PaintButtonProps = {
  href: string;
  children: string;
  /** The filled stroke reads as the primary action. */
  primary?: boolean;
  /**
   * Label colour. Set on the label itself, because a colour inherited from a
   * wrapper loses to any class on the label — which is how a light wrapper
   * around this button once had no effect.
   */
  tone?: "ink" | "rice";
};

/**
 * A call to action drawn as a line of paint rather than a rectangle.
 *
 * The stroke is the same generated brush mask used elsewhere, tinted and set
 * behind the label. On hover it extends, which is the gesture of finishing the
 * stroke rather than lighting up a box.
 */
export function PaintButton({
  href,
  children,
  primary = false,
  tone = "ink",
}: PaintButtonProps) {
  return (
    <Link
      href={href}
      className="group relative inline-flex items-center justify-center px-3 py-3"
    >
      <span
        aria-hidden="true"
        className={`absolute inset-x-0 bottom-1 origin-left transition-transform duration-[--duration-base] ease-[--ease-out-expo] group-hover:scale-x-105 ${
          primary
            ? "bg-peach h-[0.72em]"
            : tone === "rice"
              ? "bg-rice/50 h-[0.28em]"
              : "bg-agar h-[0.28em]"
        }`}
        style={{
          maskImage: "url(/brushes/underline.png)",
          WebkitMaskImage: "url(/brushes/underline.png)",
          maskSize: "100% 100%",
          WebkitMaskSize: "100% 100%",
          maskRepeat: "no-repeat",
          WebkitMaskRepeat: "no-repeat",
        }}
      />
      <span
        className={`relative text-sm font-semibold tracking-[0.14em] uppercase ${
          tone === "rice" ? "text-rice" : "text-ink"
        }`}
      >
        {children}
      </span>
    </Link>
  );
}
