import Image from "next/image";

/**
 * Panda 7, the restaurant's mascot (November 2026 artwork): a fluffy panda in
 * a red scarf, holding up a bowl of noodles with a thumbs-up. Cut from the
 * client's artwork onto a transparent background.
 */
const WIDTH = 974;
const HEIGHT = 1148;

export function Panda7({
  className,
  alt = "Panda 7 holding up a bowl of noodles and giving a thumbs-up",
  sizes = "(min-width: 768px) 20rem, 60vw",
  priority,
}: {
  className?: string;
  /** Pass "" where the panda is decoration. */
  alt?: string;
  sizes?: string;
  priority?: boolean | undefined;
}) {
  return (
    <Image
      src="/brand/panda-7.webp"
      width={WIDTH}
      height={HEIGHT}
      alt={alt}
      sizes={sizes}
      preload={priority ?? false}
      className={`h-auto select-none ${className ?? ""}`}
      draggable={false}
    />
  );
}
