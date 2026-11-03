"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import type { DishMedia as DishMediaData } from "@/content/menu-media";

/** Pointers that can hover. Touch devices never autoplay the loops. */
const CAN_HOVER = "(hover: hover) and (pointer: fine)";

/**
 * A dish's photograph, and its hover loop when it has one.
 *
 * The loop is not fetched until the pointer arrives (`preload="none"`), plays
 * only on devices that can hover, and resets when the pointer leaves, so a
 * page of cards costs one image each until someone actually looks.
 */
export function DishMedia({
  media,
  label,
  zh,
  sizes = "(min-width: 1024px) 23vw, 50vw",
  preload = false,
}: {
  media: DishMediaData | undefined;
  label: string;
  /** The dish's Chinese name, set large while it has no photograph. */
  zh: string;
  /** `sizes` for the photograph; the default fits a card in the dish grid. */
  sizes?: string;
  /** Preload the photograph, for a dish page's hero where it is the LCP image. */
  preload?: boolean;
}) {
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const start = () => {
    const element = video.current;
    if (!element || !window.matchMedia(CAN_HOVER).matches) return;
    element
      .play()
      .then(() => setPlaying(true))
      .catch(() => setPlaying(false));
  };

  const stop = () => {
    const element = video.current;
    if (!element) return;
    element.pause();
    element.currentTime = 0;
    setPlaying(false);
  };

  return (
    <div
      className="bg-paper relative aspect-[4/5] overflow-hidden"
      onPointerEnter={media?.video ? start : undefined}
      onPointerLeave={media?.video ? stop : undefined}
    >
      <div className="absolute inset-0 transition-transform duration-[--duration-slow] ease-[--ease-out-expo] group-hover:scale-[1.04]">
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
          // Until the shoot: the dish's name set in heavy Chinese type on soft
          // red, so an unphotographed dish reads as a designed tile, not a gap.
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

      {media?.video ? (
        <video
          ref={video}
          src={media.video.src}
          poster={media.photo?.src}
          muted
          loop
          playsInline
          preload="none"
          aria-hidden="true"
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[--duration-base] ${
            playing ? "opacity-100" : "opacity-0"
          }`}
        />
      ) : null}
    </div>
  );
}
