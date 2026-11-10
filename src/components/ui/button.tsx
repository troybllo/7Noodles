import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

const TONE = {
  solid: "bg-brand text-paper hover:bg-brand-deep",
  inverse: "bg-paper text-brand hover:bg-brand-soft",
  outline: "border border-current hover:bg-current/[0.06]",
} as const;

const SIZE = {
  sm: "h-8 px-5 text-[0.6875rem]",
  md: "h-11 px-6 text-[0.75rem]",
  lg: "h-12 px-8 text-[0.8125rem]",
  /** The one action that finishes a step: checkout, pay. */
  xl: "h-14 px-10 text-sm",
} as const;

export type ButtonTone = keyof typeof TONE;
export type ButtonSize = keyof typeof SIZE;

type Look = {
  children: ReactNode;
  tone?: ButtonTone | undefined;
  size?: ButtonSize | undefined;
  /** The arrow that slides on hover. On by default for links. */
  arrow?: boolean | undefined;
  className?: string | undefined;
};

type LinkButton = Look & {
  href: string;
  /** Opens in a new tab, for links that leave the site. */
  external?: boolean | undefined;
  onClick?: (() => void) | undefined;
};

type PlainButton = Look &
  Omit<ComponentProps<"button">, "className" | "children"> & {
    href?: undefined;
  };

export function buttonClass({
  tone = "solid",
  size = "md",
  className,
}: Pick<Look, "tone" | "size" | "className"> = {}): string {
  return `group inline-flex items-center justify-center gap-2.5 font-medium tracking-[0.14em] uppercase tabular-nums transition-[background-color,transform,opacity] duration-(--duration-fast) ease-(--ease-out-soft) active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60 ${TONE[tone]} ${SIZE[size]} ${className ?? ""}`;
}

function Arrow() {
  return (
    <span
      aria-hidden="true"
      className="transition-transform duration-(--duration-base) ease-(--ease-out-expo) group-hover:translate-x-1"
    >
      →
    </span>
  );
}

/** The site's pill action: a link when given `href`, otherwise a `<button>`. */
export function Button(props: LinkButton | PlainButton) {
  if (props.href === undefined) {
    const {
      children,
      tone,
      size,
      arrow = false,
      className,
      type = "button",
      ...rest
    } = props;
    return (
      <button type={type} className={buttonClass({ tone, size, className })} {...rest}>
        {children}
        {arrow ? <Arrow /> : null}
      </button>
    );
  }

  const {
    href,
    children,
    tone,
    size,
    arrow = true,
    className,
    external,
    onClick,
  } = props;
  const classes = buttonClass({ tone, size, className });
  const content = (
    <>
      {children}
      {arrow ? <Arrow /> : null}
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
    <Link href={href} className={classes} {...(onClick ? { onClick } : {})}>
      {content}
    </Link>
  );
}
