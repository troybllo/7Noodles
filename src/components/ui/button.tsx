import Link from "next/link";
import type { ReactNode } from "react";

type ButtonProps = {
  href: string;
  children: ReactNode;
  /** `solid` red, `inverse` white for red bands, `outline` for the second action. */
  tone?: "solid" | "inverse" | "outline";
  size?: "lg" | "md" | "sm";
  /** Opens in a new tab, for links that leave the site. */
  external?: boolean;
  className?: string;
};

const TONE = {
  solid: "bg-brand text-paper hover:bg-brand-deep",
  inverse: "bg-paper text-brand hover:bg-brand-soft",
  outline: "border border-current hover:bg-current/[0.06]",
} as const;

const SIZE = {
  lg: "h-12 px-8 text-[0.8125rem]",
  md: "h-10 px-6 text-[0.75rem]",
  sm: "h-8 px-5 text-[0.6875rem]",
} as const;

/**
 * The site's call to action, after Bokman's BOOK A TABLE: a pill in small,
 * spaced capitals, with an arrow that slides on hover.
 * A link underneath, because every action on this site goes somewhere.
 */
export function Button({
  href,
  children,
  tone = "solid",
  size = "md",
  external = false,
  className,
}: ButtonProps) {
  const classes = `group inline-flex items-center justify-center gap-2.5 rounded-full tracking-[0.14em] uppercase transition-[background-color,transform] duration-[--duration-fast] ease-[--ease-out-soft] active:scale-[0.98] ${TONE[tone]} ${SIZE[size]} ${className ?? ""}`;
  const content = (
    <>
      {children}
      <span
        aria-hidden="true"
        className="transition-transform duration-[--duration-base] ease-[--ease-out-expo] group-hover:translate-x-1"
      >
        →
      </span>
    </>
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {content}
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {content}
    </Link>
  );
}
