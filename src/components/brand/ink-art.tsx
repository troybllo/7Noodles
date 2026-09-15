import type { CSSProperties } from "react";

const ART = {
  tiger: { src: "/artwork/nichokuan-tiger-ink.webp", ratio: "1200 / 875" },
  dragon: { src: "/artwork/nichokuan-dragon-head-ink.webp", ratio: "1000 / 902" },
} as const;

/**
 * One of the ink extractions from Soga Nichokuan's Dragon and Tiger screens
 * (Cleveland Museum of Art, CC0), used as a mask and filled with a colour, so
 * the same brushwork can be red on cream or black on red. Provenance in
 * public/artwork/PROVENANCE.md.
 *
 * Decorative: hidden from assistive technology.
 */
export function InkArt({
  art,
  tone = "bg-chili",
  mirrored = false,
  className,
  style,
}: {
  art: keyof typeof ART;
  /** Background class that fills the brushwork. */
  tone?: string;
  mirrored?: boolean;
  className?: string;
  style?: CSSProperties;
}) {
  const { src, ratio } = ART[art];
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none ${tone} ${mirrored ? "-scale-x-100" : ""} ${className ?? ""}`}
      style={{
        aspectRatio: ratio,
        maskImage: `url(${src})`,
        WebkitMaskImage: `url(${src})`,
        maskSize: "contain",
        WebkitMaskSize: "contain",
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
        maskPosition: "center",
        WebkitMaskPosition: "center",
        ...style,
      }}
    />
  );
}
