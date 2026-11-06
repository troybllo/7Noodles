import Image from "next/image";

/**
 * Panda 7, the restaurant's mascot, from its brand guide (data/brand/): a
 * fluffy panda in a red 7 Noodles scarf or a flame apron. Cut from the guide's
 * artwork with its transparent background, in public/brand/.
 */
const POSES = {
  wave: { width: 698, height: 536, alt: "Panda 7 waving hello" },
  chef: {
    width: 567,
    height: 581,
    alt: "Panda 7 in a chef's hat, tossing noodles in a wok",
  },
  spicy: {
    width: 481,
    height: 435,
    alt: "Panda 7 tasting something spicy, tongue out among chilies",
  },
  standing: { width: 527, height: 626, alt: "Panda 7 standing in a flame apron" },
} as const;

export type Panda7Pose = keyof typeof POSES;

export function Panda7({
  pose = "wave",
  className,
  alt,
  sizes = "(min-width: 768px) 20rem, 60vw",
  priority,
}: {
  pose?: Panda7Pose;
  className?: string;
  /** Defaults to a description of the pose. Pass "" where the panda is decoration. */
  alt?: string;
  sizes?: string;
  priority?: boolean | undefined;
}) {
  const { width, height, alt: described } = POSES[pose];
  return (
    <Image
      src={`/brand/panda-${pose}.webp`}
      width={width}
      height={height}
      alt={alt ?? described}
      sizes={sizes}
      preload={priority ?? false}
      className={`h-auto select-none ${className ?? ""}`}
      draggable={false}
    />
  );
}
