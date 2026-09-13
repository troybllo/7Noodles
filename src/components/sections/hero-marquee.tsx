import Image from "next/image";
import { HERO_ROWS, type Tile } from "@/content/hero";

/** Seconds per loop. Different per row so the grid never re-aligns. */
const DURATIONS = [92, 78, 104];

function Row({ tiles, index }: { tiles: Tile[]; index: number }) {
  // Twice over, so translating by half the track lands on an identical frame.
  const doubled = [...tiles, ...tiles];
  const leftward = index % 2 === 0;

  return (
    <div className="h-1/3 overflow-hidden">
      <ul
        className={`hero-track flex h-full w-max hover:[animation-play-state:paused] ${
          leftward ? "animate-marquee-left" : "animate-marquee-right"
        }`}
        // Set as animation-duration directly, not through --marquee-duration.
        // That variable is read inside a theme token resolved at :root, so a
        // per-element override never reached the animation — every row ran at
        // the same default speed and the grid re-aligned.
        style={{ animationDuration: `${DURATIONS[index] ?? 90}s` }}
      >
        {doubled.map((tile, i) => (
          <li
            key={`${tile.src}-${tile.position}-${i}`}
            className="hero-tile relative aspect-[462/639] h-full shrink-0"
          >
            {/*
              Decorative: the grid is atmosphere, the headline is the content.
              Sixteen tiles a row with real alt text would read out the same
              four dishes to a screen reader dozens of times.

              Every tile shares one `sizes`, so the four photographs resolve to
              the same optimised URLs and the browser fetches each once.
            */}
            <Image
              src={tile.src}
              alt=""
              fill
              // Eager, not the default lazy. Tiles slide in from off-screen,
              // and a lazy tile waits until it is already visible to load —
              // it arrives as a black hole. There are only four photographs
              // behind every tile, so eager costs almost nothing.
              loading="eager"
              sizes="(min-width: 768px) 16vw, 40vw"
              quality={75}
              className="object-cover"
              style={{ objectPosition: tile.position }}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

export function HeroMarquee() {
  return (
    <div
      aria-hidden="true"
      data-hero-grid
      className="hero-grid absolute inset-0 flex flex-col gap-px"
    >
      {HERO_ROWS.map((tiles, index) => (
        <Row key={index} tiles={tiles} index={index} />
      ))}
    </div>
  );
}
