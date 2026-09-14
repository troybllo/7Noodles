import { ViewTransition, type ReactNode } from "react";

/**
 * The motion between pages: the page being left sinks back into shadow while
 * the new one spreads over it as a bloom of ink from wherever the reader
 * clicked. The keyframes live in globals.css under "Page transitions".
 *
 * Built on React's ViewTransition, which the App Router starts on every
 * navigation, so a page is never held back waiting for an animation, and a
 * browser without the View Transitions API simply swaps the page.
 *
 * Wrap each page's content, not the layout: layouts persist across
 * navigations and would never enter or exit. `id` names the page, so moving
 * between two pages built from the same route — one category to the next,
 * one dish to another — still plays.
 */
export function PageTransition({ id, children }: { id: string; children: ReactNode }) {
  return (
    <ViewTransition key={id} enter="ink-in" exit="ink-out" default="none">
      {children}
    </ViewTransition>
  );
}
