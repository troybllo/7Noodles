import { ViewTransition, type ReactNode } from "react";

/**
 * The ink-bloom page transition (keyframes in globals.css). Wrap each page's
 * content, not a layout. `id` names the page, so moving between two pages of
 * the same route (one dish to the next) still plays.
 */
export function PageTransition({ id, children }: { id: string; children: ReactNode }) {
  return (
    <ViewTransition key={id} enter="ink-in" exit="ink-out" default="none">
      {children}
    </ViewTransition>
  );
}
