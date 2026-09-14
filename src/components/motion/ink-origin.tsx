"use client";

import { useEffect } from "react";

/**
 * Records where the reader last pressed, so the ink that reveals the next page
 * blooms from under their finger or cursor rather than from a fixed point.
 *
 * Written as custom properties on the root element, which the view transition
 * pseudo-elements inherit. A keyboard press resets the origin to the centre of
 * the screen, since a focused link has no pointer position to grow from.
 */
export function InkOrigin() {
  useEffect(() => {
    const root = document.documentElement;

    const fromPointer = (event: PointerEvent) => {
      root.style.setProperty("--ink-x", `${event.clientX}px`);
      root.style.setProperty("--ink-y", `${event.clientY}px`);
    };
    const fromKeyboard = () => {
      root.style.removeProperty("--ink-x");
      root.style.removeProperty("--ink-y");
    };

    document.addEventListener("pointerdown", fromPointer, {
      capture: true,
      passive: true,
    });
    document.addEventListener("keydown", fromKeyboard, { capture: true, passive: true });
    return () => {
      document.removeEventListener("pointerdown", fromPointer, { capture: true });
      document.removeEventListener("keydown", fromKeyboard, { capture: true });
    };
  }, []);

  return null;
}
