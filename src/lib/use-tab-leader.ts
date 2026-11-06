"use client";

import { useEffect, useState } from "react";

/**
 * Whether this tab is the one, among this browser's tabs sharing `name`, that
 * should do the work (poll, chime). Uses a Web Lock: the first tab holds it,
 * and when that tab closes the next one takes over. Browsers without Web Locks
 * treat every tab as the leader.
 */
export function useTabLeader(name: string): boolean {
  const [leader, setLeader] = useState(false);

  useEffect(() => {
    if (!("locks" in navigator)) {
      queueMicrotask(() => setLeader(true));
      return;
    }
    const controller = new AbortController();
    let release: () => void = () => {};
    navigator.locks
      .request(name, { signal: controller.signal }, () => {
        setLeader(true);
        return new Promise<void>((resolve) => (release = resolve));
      })
      .catch(() => {});
    return () => {
      controller.abort();
      release();
      setLeader(false);
    };
  }, [name]);

  return leader;
}
