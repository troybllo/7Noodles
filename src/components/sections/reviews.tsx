import { TapedFrame } from "@/components/hand/taped-frame";
import { SectionHeading } from "@/components/ui/section-heading";
import { Marquee } from "@/components/ui/marquee";
import { REVIEWS, type Review } from "@/content/reviews";

function Stars({ rating }: { rating: number }) {
  return (
    <span
      role="img"
      aria-label={`Rated ${rating} out of 5`}
      className="text-brand flex gap-1"
    >
      {Array.from({ length: 5 }, (_, i) => (
        <svg
          key={i}
          aria-hidden="true"
          viewBox="0 0 20 20"
          className={`size-4 ${i < rating ? "fill-current" : "fill-brand/15"}`}
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
 * fabrication; the initial sits in a disc instead.
 */
function Card({ review, index }: { review: Review; index: number }) {
  return (
    <li className="w-[min(21rem,82vw)] shrink-0 py-6">
      <TapedFrame tape="top" tilt={TILTS[index % TILTS.length] ?? 0} className="text-sm">
        <div className="bg-paper text-brand flex h-[22rem] flex-col justify-between p-7">
          <Stars rating={review.rating} />
          <p className="my-6 text-lg leading-snug">“{review.text}”</p>
          <div className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className="bg-brand-deep text-paper flex size-10 rotate-[-4deg] items-center justify-center rounded-[3px] text-sm font-bold"
            >
              {review.name.charAt(0).toUpperCase()}
            </span>
            <div className="flex flex-col">
              <span className="text-sm font-semibold">{review.name}</span>
              <span className="text-brand-deep text-xs">{review.date}</span>
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
      data-nav-theme="dark"
      className="bg-brand text-paper relative z-10 w-full py-24 md:py-32"
    >
      <div className="px-6 md:px-10">
        <div className="mx-auto max-w-[1700px]">
          <SectionHeading
            eyebrow="Reviews"
            zh="食客评价"
            tone="dark"
            className="max-w-4xl"
          >
            What people say after the first bowl.
          </SectionHeading>
        </div>
      </div>

      <div className="mt-14">
        <Marquee label="Reviews">
          {REVIEWS.map((review, index) => (
            <Card key={`${review.name}-${review.date}`} review={review} index={index} />
          ))}
        </Marquee>
      </div>
    </section>
  );
}
