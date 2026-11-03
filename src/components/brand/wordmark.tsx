import { Logo } from "./logo";

/**
 * The name, as the restaurant's own logo lockup: the noodle-bowl mark, 恰小面
 * and "7 Noodles". Sized by the font size of its context (it is 1.8em tall)
 * and drawn in `currentColor`, so it inverts with the navigation bar.
 */
export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={`inline-flex leading-none ${className ?? ""}`}>
      <Logo variant="lockup" title={null} className="h-[1.8em] w-auto" />
      <span className="sr-only">Seven Noodles 恰小面, home</span>
    </span>
  );
}
