"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { PhotoSlot } from "@/components/media/photo-slot";
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
}: {
  media: DishMediaData | undefined;
  label: string;
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
            sizes="(min-width: 1024px) 30vw, 50vw"
            quality={75}
            className="object-cover"
          />
        ) : (
          <PhotoSlot label={label} tone="bg-paper" labelTone="text-ink" />
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
