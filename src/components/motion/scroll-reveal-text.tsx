"use client";

import { useGsap } from "@/components/motion/use-gsap";

/**
 * Text that fills from muted to full as it scrolls through the viewport,
 * word by word.
 *
 * The words are dimmed with opacity rather than a colour tween, which is what
 * the effect actually is on a dark ground — the text fading toward the
 * background — and it stays on the compositor instead of repainting text on
 * every scroll frame.
 *
 * Rendered at full strength. The dimmed state is applied by the timeline, so
 * with no JavaScript, or under reduced motion, the copy is simply readable.
 */
export function ScrollRevealText({
  text,
  className,
  as: Tag = "p",
  dimTo = 0.22,
}: {
  text: string;
  className?: string;
  as?: "p" | "h2" | "h3" | "blockquote";
  dimTo?: number;
}) {
  const scope = useGsap<HTMLDivElement>(({ gsap, scope: element }) => {
    gsap.fromTo(
      element.querySelectorAll("[data-reveal-word]"),
      { opacity: dimTo },
      {
        opacity: 1,
        ease: "none",
        stagger: 1,
        scrollTrigger: {
          trigger: element,
          start: "top 82%",
          end: "bottom 55%",
          scrub: 0.5,
        },
      },
    );
  });

  // Split on spaces, keeping the separators so the spacing survives and screen
  // readers still hear whole words rather than a run-on string.
  const words = text.split(" ");

  return (
    <div ref={scope} className="contents">
      <Tag className={className}>
        {words.map((word, index) => (
          <span key={`${word}-${index}`} data-reveal-word className="inline-block">
            {word}
            {index < words.length - 1 ? " " : ""}
          </span>
        ))}
      </Tag>
    </div>
  );
}
