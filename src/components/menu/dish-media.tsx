import Image from "next/image";
import type { DishMedia as DishMediaData } from "@/content/menu-media";
import { DISH_PHOTO_ASPECT } from "@/content/dish-photo-aspect";

/**
 * `object-cover` shows only the middle of a photo wider than its frame, so the
 * browser must fetch it wider than the frame or the visible part is upscaled.
 * Scales every length in `sizes` by how much wider the photo is than a 4:5
 * frame (the narrowest the frames get).
 */
export function croppedSizes(sizes: string, photoAspect: number | undefined): string {
  const factor = Math.max(1, (photoAspect ?? 0.8) / 0.8);
  if (factor === 1) return sizes;
  return sizes.replace(
    /(\([^)]*\)\s*)?(\d+(?:\.\d+)?)(px|vw)/g,
    // A media query is kept as is; only the length after it is scaled.
    (_match, query: string | undefined, value: string, unit: string) =>
      `${query ?? ""}${Math.round(Number(value) * factor)}${unit}`,
  );
}

/** A dish's photograph, or, until it is photographed, its Chinese name set as a tile. */
export function DishMedia({
  media,
  label,
  zh,
  sizes = "(min-width: 1024px) 23vw, 50vw",
  preload = false,
  aspect = "aspect-[4/5]",
}: {
  media: DishMediaData | undefined;
  label: string;
  zh: string;
  /** `sizes` for the photograph; the default fits a card in the dish grid. */
  sizes?: string;
  /** For a dish page's hero, where the photograph is the largest paint. */
  preload?: boolean;
  /** The frame's shape, as Tailwind classes; a featured card is wider below `lg`. */
  aspect?: string;
}) {
  return (
    <div className={`bg-paper relative overflow-hidden ${aspect}`}>
      <div className="absolute inset-0 transition-transform duration-(--duration-slow) ease-(--ease-out-expo) group-hover:scale-[1.04]">
        {media?.photo ? (
          <Image
            src={media.photo.src}
            alt={media.photo.alt}
            fill
            sizes={croppedSizes(sizes, DISH_PHOTO_ASPECT[media.photo.src])}
            preload={preload}
            quality={preload ? 90 : 75}
            className="object-cover"
          />
        ) : (
          <div
            role="img"
            aria-label={label}
            className="bg-brand-soft flex h-full items-center justify-center p-6 text-center"
          >
            <span
              lang="zh"
              aria-hidden="true"
              className="font-cjk text-brand text-[clamp(1.4rem,2.6vw,2.1rem)] leading-tight font-black tracking-[0.06em] text-balance"
            >
              {zh}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
