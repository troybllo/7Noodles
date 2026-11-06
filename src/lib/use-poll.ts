"use client";

import { useEffect, useEffectEvent, useRef } from "react";

export type PollOptions = {
  /** Time between polls while all is well. */
  every: number;
  /** Time between polls while the tab is hidden; `null` stops polling until it is shown again. */
  whenHidden: number | null;
  /** Ceiling for the backoff after failures (each failure doubles the wait). */
  maxBackoff?: number;
  enabled?: boolean;
};

/**
 * Calls `poll` on a schedule, one call at a time: the next is timed from the
 * end of the last, so slow responses never pile up or land out of order.
 * Failures back off; a tab coming back into view polls at once. `poll` returns
 * false to stop for good (an order that has been picked up). The returned
 * function polls now.
 */
export function usePoll(
  poll: (signal: AbortSignal) => Promise<boolean | void>,
  { every, whenHidden, maxBackoff = 60_000, enabled = true }: PollOptions,
): () => void {
  const run = useEffectEvent(poll);
  const now = useRef<() => void>(() => {});

  useEffect(() => {
    if (!enabled) return;
    const controller = new AbortController();
    let timer: number | undefined;
    let failures = 0;
    let running = false;
    let stopped = false;

    const schedule = () => {
      window.clearTimeout(timer);
      if (stopped) return;
      const hidden = document.visibilityState === "hidden";
      if (hidden && whenHidden === null) return;
      const base = hidden ? whenHidden! : every;
      const wait = failures ? Math.min(base * 2 ** failures, maxBackoff) : base;
      timer = window.setTimeout(tick, wait);
    };

    const tick = async () => {
      if (running || stopped) return;
      running = true;
      window.clearTimeout(timer);
      try {
        if ((await run(controller.signal)) === false) stopped = true;
        failures = 0;
      } catch {
        if (controller.signal.aborted) return;
        failures += 1;
      } finally {
        running = false;
      }
      schedule();
    };

    const onVisible = () => {
      if (document.visibilityState === "visible") void tick();
      else schedule();
    };

    now.current = () => void tick();
    void tick();
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("online", onVisible);
    return () => {
      stopped = true;
      controller.abort();
      window.clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("online", onVisible);
    };
  }, [enabled, every, whenHidden, maxBackoff]);

  return () => now.current();
}
