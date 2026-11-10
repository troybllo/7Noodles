import { ViewTransition, type ReactNode } from "react";

/**
 * The ink-bloom page transition (keyframes in globals.css). Wrap each page's
 * content, not a layout. `id` names the page, so moving between two pages of
 * the same route (one dish to the next) still plays. Moving between sibling
 * menu categories (links tagged "tab") is a quick crossfade instead.
 */
export function PageTransition({ id, children }: { id: string; children: ReactNode }) {
  return (
    <ViewTransition
      key={id}
      enter={{ tab: "tab-in", default: "ink-in" }}
      exit={{ tab: "tab-out", default: "ink-out" }}
      default="none"
    >
      {children}
    </ViewTransition>
  );
}
