import { Seal } from "@/components/brand/seal";
import { REVIEWS, type Review } from "@/content/reviews";

function Stars({ rating }: { rating: number }) {
  return (
    <span
      role="img"
      aria-label={`Rated ${rating} out of 5`}
      className="text-peach flex gap-1"
    >
      {Array.from({ length: 5 }, (_, i) => (
        <svg
          key={i}
          aria-hidden="true"
          viewBox="0 0 20 20"
          className={`size-4 ${i < rating ? "fill-current" : "fill-paper"}`}
        >
          <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.5 7.7l5.9-.9z" />
        </svg>
      ))}
    </span>
  );
}

/**
 * One review. Cards share a fixed height so a one-word review does not
 * collapse the row, and the longest one is set to fit rather than truncated —
 * cutting a customer's words short would be editing them.
 *
 * No portrait. There are none, and a stock face beside a real name would be a
 * fabrication; the initial sits in a seal instead.
 */
function Card({ review }: { review: Review }) {
  return (
    <li className="bg-rice-dim flex h-[25rem] w-[22rem] shrink-0 flex-col items-center justify-between px-8 py-9 text-center">
      <p className="text-ink my-auto text-[0.95rem] leading-relaxed font-semibold">
        {review.text}
      </p>
      <div className="mt-6 flex flex-col items-center gap-3">
        <Stars rating={review.rating} />
        <Seal character={review.name.charAt(0).toUpperCase()} />
        <div className="flex flex-col gap-0.5">
          <span className="text-ink text-sm font-semibold">{review.name}</span>
          <span className="text-ink text-[0.65rem] tracking-[0.16em] uppercase">
            {review.date}
          </span>
        </div>
      </div>
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
      className="bg-rice relative z-10 w-full py-24 md:py-32"
    >
      <div className="px-6 md:px-10">
        <div className="mx-auto max-w-[1700px]">
          <p className="text-peach-text text-xs font-semibold tracking-[0.22em] uppercase">
            <span lang="zh">食客</span> · Reviews
          </p>
          <h2 className="font-round text-ink mt-4 max-w-2xl text-[clamp(2rem,4vw,3.75rem)] leading-[1.05] font-semibold">
            What people say after the first bowl.
          </h2>
        </div>
      </div>

      <div className="marquee-fade mt-14 overflow-hidden motion-reduce:overflow-x-auto">
        <div className="animate-marquee-left flex w-max gap-5 pr-5 hover:[animation-play-state:paused] motion-reduce:animate-none">
          <ul className="flex gap-5">
            {REVIEWS.map((review) => (
              <Card key={`${review.name}-${review.date}`} review={review} />
            ))}
          </ul>
          <ul aria-hidden="true" className="flex gap-5 motion-reduce:hidden">
            {REVIEWS.map((review) => (
              <Card key={`copy-${review.name}-${review.date}`} review={review} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
