import Link from "next/link";

/**
 * The primary call to action on paper: a cream pill with a typewritten label.
 *
 * It presses like a card rather than lighting up like a screen: on hover it
 * lifts a touch, and when pressed it sinks back and its shadow closes up.
 */
export function PaperButton({ href, children }: { href: string; children: string }) {
  return (
    <Link
      href={href}
      className="bg-cream text-ink focus-visible:outline-cream inline-flex min-h-14 min-w-[min(20rem,100%)] items-center justify-center rounded-full px-10 py-4 font-mono text-xl shadow-[0_4px_0_rgb(0_0_0/0.18)] transition-[transform,box-shadow] duration-[--duration-fast] ease-[--ease-out-soft] hover:-translate-y-0.5 hover:shadow-[0_6px_0_rgb(0_0_0/0.2)] active:translate-y-0.5 active:scale-[0.98] active:shadow-[0_1px_0_rgb(0_0_0/0.2)]"
    >
      {children}
    </Link>
  );
}
