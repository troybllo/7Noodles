import Image from "next/image";
import type { DishMedia as DishMediaData } from "@/content/menu-media";

/** A dish's photograph, or, until it is photographed, its Chinese name set as a tile. */
export function DishMedia({
  media,
  label,
  zh,
  sizes = "(min-width: 1024px) 23vw, 50vw",
  preload = false,
}: {
  media: DishMediaData | undefined;
  label: string;
  zh: string;
  /** `sizes` for the photograph; the default fits a card in the dish grid. */
  sizes?: string;
  /** For a dish page's hero, where the photograph is the largest paint. */
  preload?: boolean;
}) {
  return (
    <div className="bg-paper relative aspect-[4/5] overflow-hidden">
      <div className="absolute inset-0 transition-transform duration-(--duration-slow) ease-(--ease-out-expo) group-hover:scale-[1.04]">
        {media?.photo ? (
          <Image
            src={media.photo.src}
            alt={media.photo.alt}
            fill
            sizes={sizes}
            preload={preload}
            quality={75}
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
