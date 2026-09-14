import type { ReactNode } from "react";

type StampedTextProps = {
  children: ReactNode;
  /** Colour of the letters. */
  tone?: string;
  /** Colour of the stamped shadow behind them. */
  shadow?: string;
  className?: string;
};

/**
 * Poster lettering printed in worn ink with a stamped shadow, as the hero's
 * name: the text again behind itself, dropped down and to the left, both
 * layers roughened at the edge and worn by the print-speckle mask.
 *
 * Inline, and sized by its parent's font. The shadow copy is hidden from
 * assistive technology, so the words are read once.
 */
export function StampedText({
  children,
  tone = "text-parchment",
  shadow = "text-ink",
  className,
}: StampedTextProps) {
  return (
    <span className={`relative inline-block ${className ?? ""}`}>
      <span
        aria-hidden="true"
        className={`print-worn absolute inset-0 translate-x-[-0.036em] translate-y-[0.17em] ${shadow}`}
        style={{ filter: "url(#rough-edges)" }}
      >
        {children}
      </span>
      <span
        className={`print-worn relative ${tone}`}
        style={{ filter: "url(#rough-edges)" }}
      >
        {children}
      </span>
    </span>
  );
}
