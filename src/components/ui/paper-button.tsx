import Link from "next/link";

/**
 * The primary call to action on paper: a cream pill with a typewritten label,
 * after the approved hero mockup.
 *
 * On large screens it takes the mockup's own size in `--u` units when set
 * inside a `.frame`; elsewhere it falls back to a comfortable fixed size.
 * It presses like card rather than lighting up like a screen: a small lift on
 * hover, a sink when pressed.
 */
export function PaperButton({ href, children }: { href: string; children: string }) {
  return (
    <Link
      href={href}
      className="bg-cream text-ink focus-visible:outline-cream inline-flex h-14 w-full max-w-[20rem] items-center justify-center rounded-full font-mono text-lg transition-transform duration-[--duration-fast] ease-[--ease-out-soft] hover:-translate-y-0.5 active:translate-y-px active:scale-[0.98] lg:h-[calc(var(--u,1px)*51)] lg:w-[calc(var(--u,1px)*299)] lg:max-w-none lg:text-[calc(var(--u,1px)*18.3)]"
    >
      {children}
    </Link>
  );
}
