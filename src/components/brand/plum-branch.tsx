import Image from "next/image";

type PlumBranchProps = {
  /** `sizes` for the image, matching its rendered width at each breakpoint. */
  sizes: string;
  /** Size and position, from the composition that places it. */
  className?: string;
};

/**
 * A branch of red plum blossom, cut from Zhang Ruoai's album leaf (1700s,
 * Cleveland Museum of Art, CC0) with the blossoms recoloured to the palette.
 * Provenance and processing in public/artwork/PROVENANCE.md.
 *
 * Plum blossom opens in late winter, before the leaves, which is why it stands
 * for endurance and renewal. Decorative: hidden from assistive technology.
 */
export function PlumBranch({ sizes, className }: PlumBranchProps) {
  return (
    <Image
      src="/artwork/zhang-ruoai-plum-blossoms.webp"
      width={1000}
      height={1462}
      alt=""
      aria-hidden="true"
      sizes={sizes}
      className={`pointer-events-none absolute h-auto select-none ${className ?? ""}`}
    />
  );
}
