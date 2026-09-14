import Link from "next/link";

type PaperButtonProps = {
  href: string;
  children: string;
  /**
   * `cream` sits on red paper or ink; `ink` sits on cream paper. The hero's
   * button is cream.
   */
  tone?: "cream" | "ink";
  /** `hero` takes the mockup's own size in `--u` units inside a `.frame`. */
  size?: "hero" | "md" | "sm";
  /** Opens in a new tab, for links that leave the site. */
  external?: boolean;
};

const TONE = {
  cream: "bg-cream text-ink focus-visible:outline-cream",
  ink: "bg-ink text-cream focus-visible:outline-ink",
} as const;

const SIZE = {
  hero: "h-14 w-full max-w-[20rem] text-lg lg:h-[calc(var(--u,1px)*51)] lg:w-[calc(var(--u,1px)*299)] lg:max-w-none lg:text-[calc(var(--u,1px)*18.3)]",
  md: "h-12 px-8 text-base",
  sm: "h-10 px-5 text-sm",
} as const;

/**
 * The call to action on paper: a pill with a typewritten label, after the
 * approved hero mockup.
 *
 * It presses like card rather than lighting up like a screen: a small lift on
 * hover, a sink when pressed.
 */
export function PaperButton({
  href,
  children,
  tone = "cream",
  size = "md",
  external = false,
}: PaperButtonProps) {
  const className = `inline-flex items-center justify-center rounded-full font-mono transition-transform duration-[--duration-fast] ease-[--ease-out-soft] hover:-translate-y-0.5 active:translate-y-px active:scale-[0.98] ${TONE[tone]} ${SIZE[size]}`;

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}
