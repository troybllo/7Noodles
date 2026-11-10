"use client";

import Link from "next/link";
import { useEffect, useRef, type CSSProperties } from "react";
import { Wordmark } from "@/components/brand/wordmark";
import { CONTACT } from "@/content/contact";
import { NAV_ITEMS } from "./nav-items";

/** Ordering leads the menu as buttons, so its group is not repeated as links. */
const LINKS = NAV_ITEMS.filter((item) => item.href !== "/order");

const ACTION =
  "border-paper/40 flex h-12 flex-1 items-center justify-center border text-xs font-semibold tracking-[0.14em] uppercase transition-transform duration-(--duration-fast) ease-(--ease-out-soft) active:scale-[0.97]";

function Item({ label, zh, href }: { label: string; zh: string; href?: string }) {
  const content = (
    <>
      <span className="font-display text-4xl">{label}</span>
      <span lang="zh" className="font-cjk text-paper text-base font-black">
        {zh}
      </span>
    </>
  );
  return href ? (
    <Link
      href={href}
      className="flex min-h-11 items-baseline gap-3 transition-opacity active:opacity-70"
    >
      {content}
    </Link>
  ) : (
    <p className="flex items-baseline gap-3">{content}</p>
  );
}

/**
 * The menu below `lg`: a full-screen modal dialog, so focus stays inside it,
 * Escape closes it and the page behind holds still. Following a link closes it.
 * Ordering comes first, as buttons; the rest rises in, one line after another
 * (`.mobile-nav` in globals.css).
 */
export function MobileNav({ open, onClose }: { open: boolean; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    if (open && !element.open) element.showModal();
    if (!open && element.open) element.close();
  }, [open]);

  return (
    <dialog
      ref={dialog}
      id="mobile-nav"
      aria-label="Menu"
      onClose={onClose}
      onClick={(event) => {
        if ((event.target as Element).closest("a")) onClose();
      }}
      className="mobile-nav bg-brand text-paper m-0 h-dvh max-h-none w-full max-w-none overflow-y-auto px-[max(1.5rem,env(safe-area-inset-left))] pb-[max(3rem,env(safe-area-inset-bottom))] backdrop:hidden lg:hidden"
    >
      <div className="flex h-16 items-center justify-between">
        <Link href="/" className="text-[1.35rem]">
          <Wordmark />
        </Link>
        <button
          type="button"
          onClick={onClose}
          className="-mr-2 inline-flex min-h-11 items-center px-2 text-sm font-semibold tracking-[0.08em] uppercase"
        >
          Close
        </button>
      </div>

      <div data-rise style={{ "--i": 0 } as CSSProperties} className="mt-6 flex flex-col gap-2">
        <Link
          href="/order"
          className="bg-paper text-brand flex h-14 items-center justify-between px-5 text-sm font-semibold tracking-[0.14em] uppercase transition-transform duration-(--duration-fast) ease-(--ease-out-soft) active:scale-[0.98]"
        >
          Order for pickup
          <span aria-hidden="true">→</span>
        </Link>
        <div className="flex gap-2">
          <a href={CONTACT.phone.href} className={ACTION}>
            Call us
          </a>
          <a
            href={CONTACT.map.directionsHref}
            target="_blank"
            rel="noopener noreferrer"
            className={ACTION}
          >
            Directions
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </div>
      </div>

      <ul className="mt-10 flex flex-col gap-6">
        {LINKS.map((item, index) => (
          <li key={item.label} data-rise style={{ "--i": index + 1 } as CSSProperties}>
            {item.children ? (
              <>
                <Item label={item.label} zh={item.zh} />
                <ul className="mt-1 flex flex-col pl-1">
                  {item.children.map((child) => (
                    <li key={child.href + child.label}>
                      <Link
                        href={child.href}
                        className="text-paper flex min-h-11 items-center text-lg transition-opacity active:opacity-70"
                      >
                        {child.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <Item label={item.label} zh={item.zh} href={item.href} />
            )}
          </li>
        ))}
      </ul>
    </dialog>
  );
}
