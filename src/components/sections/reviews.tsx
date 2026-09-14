import { Seal } from "@/components/brand/seal";
import { StampedText } from "@/components/hand/stamped-text";
import { TapedFrame } from "@/components/hand/taped-frame";
import { REVIEWS, type Review } from "@/content/reviews";

function Stars({ rating }: { rating: number }) {
  return (
    <span
      role="img"
      aria-label={`Rated ${rating} out of 5`}
      className="text-chili flex gap-1"
    >
      {Array.from({ length: 5 }, (_, i) => (
        <svg
          key={i}
          aria-hidden="true"
          viewBox="0 0 20 20"
          className={`size-4 ${i < rating ? "fill-current" : "fill-ink/15"}`}
          style={{ filter: "url(#rough-edges)" }}
        >
          <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.5 7.7l5.9-.9z" />
        </svg>
      ))}
    </span>
  );
}

/** Each note turns a little differently, as notes pinned by hand do. */
const TILTS = [-2, 1.5, -1, 2.5, -1.5, 1, -2.5, 2] as const;

/**
 * One review, as a note taped up on the wall. Notes share a fixed height so a
 * one-word review does not collapse the row, and the longest one is set to fit
 * rather than truncated — cutting a customer's words short would be editing
 * them.
 *
 * No portrait. There are none, and a stock face beside a real name would be a
 * fabrication; the initial sits in a seal instead.
 */
function Card({ review, index }: { review: Review; index: number }) {
  return (
    <li className="w-[22rem] shrink-0 py-6">
      <TapedFrame tape="top" tilt={TILTS[index % TILTS.length] ?? 0} className="text-sm">
        <div className="flex h-[23rem] flex-col items-center justify-between px-7 py-8 text-center">
          <p className="font-hand text-ink my-auto text-lg leading-snug">{review.text}</p>
          <div className="mt-6 flex flex-col items-center gap-3">
            <Stars rating={review.rating} />
            <Seal character={review.name.charAt(0).toUpperCase()} />
            <div className="flex flex-col gap-0.5">
              <span className="font-nav text-ink text-base font-bold">{review.name}</span>
              <span className="text-ink/70 font-mono text-xs">{review.date}</span>
            </div>
          </div>
        </div>
      </TapedFrame>
    </li>
  );
}

/**
 * The review row, moving continuously.
 *
 * The track holds the list twice so moving it by half lands on an identical
 * frame. The second copy is hidden from assistive technology, which reads one
 * list of eight rather than sixteen.
 *
 * Under reduced motion the animation is removed outright, the copy is dropped
 * and the row becomes a horizontal scroller — otherwise a stopped marquee would
 * leave every card past the edge of the screen unreachable.
 */
export function Reviews() {
  return (
    <section
      id="reviews"
      data-nav-theme="light"
      className="paper-cream relative z-10 w-full py-24 md:py-32"
    >
      <div className="px-6 md:px-10">
        <div className="mx-auto max-w-[1700px]">
          <p className="font-hand-caps text-ink flex items-baseline gap-3 text-lg tracking-[0.06em] uppercase">
            <span lang="zh" className="font-brush text-chili text-4xl">
              食客
            </span>
            Reviews
          </p>
          <h2 className="font-poster mt-4 max-w-3xl text-[clamp(2rem,4vw,3.75rem)] leading-[1.05]">
            <StampedText tone="text-ink" shadow="text-chili">
              What people say after the first bowl.
            </StampedText>
          </h2>
        </div>
      </div>

      <div className="marquee-fade mt-14 overflow-hidden motion-reduce:overflow-x-auto">
        <div className="animate-marquee-left flex w-max gap-8 pr-8 hover:[animation-play-state:paused] motion-reduce:animate-none">
          <ul className="flex gap-8">
            {REVIEWS.map((review, index) => (
              <Card key={`${review.name}-${review.date}`} review={review} index={index} />
            ))}
          </ul>
          <ul aria-hidden="true" className="flex gap-8 motion-reduce:hidden">
            {REVIEWS.map((review, index) => (
              <Card
                key={`copy-${review.name}-${review.date}`}
                review={review}
                index={index}
              />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
