"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { totals } from "@/lib/cart";
import { useCart } from "@/lib/cart-store";
import { formatCad } from "@/lib/money";
import { CONTACT } from "@/content/contact";

/** Pages where the bar would only get in the way of finishing something. */
const HIDDEN_ON = /^\/(checkout|account|kitchen|order\/)/;

const SIDE =
  "border-brand/25 text-brand flex h-12 min-w-12 flex-col items-center justify-center gap-0.5 border px-3 text-[0.625rem] font-semibold tracking-[0.12em] uppercase transition-transform duration-(--duration-fast) ease-(--ease-out-soft) active:scale-95";

function PhoneIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="size-4 fill-none stroke-current stroke-2"
    >
      <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="size-4 fill-none stroke-current stroke-2"
    >
      <path d="M12 21s-7-6.1-7-11a7 7 0 0 1 14 0c0 4.9-7 11-7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

/**
 * The phone's way in, pinned to the foot of the screen: Order, Call and
 * Directions, or once something is in the bowl, the running order. On the
 * home page it waits until the hero has scrolled away. Phones and tablets
 * only; the desktop bar carries these.
 */
export function MobileActionBar() {
  const pathname = usePathname();
  const { lines, setOpen } = useCart();
  const { itemCount, totalCents } = totals(lines);
  const home = pathname === "/";
  const [pastHero, setPastHero] = useState(false);

  useEffect(() => {
    if (!home) return;
    const hero = document.getElementById("hero");
    if (!hero) return;
    const observer = new IntersectionObserver(
      ([entry]) => setPastHero(!(entry?.isIntersecting ?? true)),
      { rootMargin: "0px 0px -35% 0px" },
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, [home]);

  const empty = itemCount === 0;
  const hidden =
    HIDDEN_ON.test(pathname) || (home && !pastHero) || (empty && pathname === "/order");

  return (
    <div
      inert={hidden}
      className={`bg-paper/97 border-brand/15 fixed inset-x-0 bottom-0 z-40 border-t px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] transition-[translate,opacity] duration-(--duration-base) ease-(--ease-out-expo) lg:hidden ${
        hidden
          ? "pointer-events-none translate-y-full opacity-0"
          : "translate-y-0 opacity-100"
      }`}
    >
      {empty ? (
        <div className="flex gap-2">
          <Link
            href="/order"
            className="bg-brand text-paper flex h-12 flex-1 items-center justify-center gap-2 text-[0.8125rem] font-semibold tracking-[0.14em] uppercase transition-transform duration-(--duration-fast) ease-(--ease-out-soft) active:scale-[0.98]"
          >
            Order pickup <span aria-hidden="true">→</span>
          </Link>
          <a href={CONTACT.phone.href} className={SIDE}>
            <PhoneIcon />
            Call
          </a>
          <a
            href={CONTACT.map.directionsHref}
            target="_blank"
            rel="noopener noreferrer"
            className={SIDE}
          >
            <PinIcon />
            Map
            <span className="sr-only"> (directions, opens in a new tab)</span>
          </a>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="bg-brand text-paper flex h-12 w-full items-center justify-between px-5 text-sm font-semibold transition-transform duration-(--duration-fast) ease-(--ease-out-soft) active:scale-[0.98]"
        >
          <span>
            View order ·{" "}
            <span
              key={itemCount}
              className="inline-block motion-safe:animate-[badge-pop_420ms_var(--ease-pop)]"
            >
              {itemCount}
            </span>{" "}
            {itemCount === 1 ? "dish" : "dishes"}
          </span>
          <span className="tabular-nums">{formatCad(totalCents)}</span>
        </button>
      )}
    </div>
  );
}
