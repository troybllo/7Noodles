/**
 * The restaurant's logo, from its brand guide: noodles twirled on a fork,
 * 恰小面 drawn to match, and "7 Noodles" beneath. Traced to vector
 * (public/brand/logo-*.svg) and painted through a CSS mask in `currentColor`,
 * so it takes the colour of its context and each shape is downloaded once
 * rather than carried in every page.
 *
 * `lockup` is the full logo, `mark` the round symbol, `stacked` the vertical
 * lockup in its frame. Size it with a width, or a height and `w-auto`.
 */

const VARIANTS = {
  lockup: { file: "logo-lockup", ratio: "1956 / 604", label: "恰小面 7 Noodles" },
  mark: { file: "logo-mark", ratio: "676 / 508", label: "7 Noodles" },
  stacked: { file: "logo-stacked", ratio: "790 / 1970", label: "恰小面 7 Noodles" },
} as const;

export type LogoVariant = keyof typeof VARIANTS;

export function Logo({
  variant = "lockup",
  className,
  title,
}: {
  variant?: LogoVariant;
  className?: string;
  /** Leave out where the logo sits beside its name in text, or is decoration. */
  title?: string | null;
}) {
  const { file, ratio, label } = VARIANTS[variant];
  const name = title === undefined ? label : title;
  const mask = `url(/brand/${file}.svg) center / contain no-repeat`;
  return (
    <span
      role={name ? "img" : undefined}
      aria-label={name ?? undefined}
      aria-hidden={name ? undefined : true}
      className={`block bg-current ${className ?? ""}`}
      style={{ aspectRatio: ratio, mask, WebkitMask: mask }}
    />
  );
}
