"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { Wordmark } from "@/components/brand/wordmark";
import { NAV_ITEMS } from "./nav-items";

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
    <Link href={href} className="flex items-baseline gap-3">
      {content}
    </Link>
  ) : (
    <p className="flex items-baseline gap-3">{content}</p>
  );
}

/**
 * The menu below `lg`: a full-screen modal dialog, so focus stays inside it,
 * Escape closes it and the page behind holds still. Following a link closes it.
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
      className="bg-brand text-paper m-0 h-dvh max-h-none w-full max-w-none overflow-y-auto px-8 pb-12 backdrop:hidden lg:hidden"
    >
      <div className="flex h-20 items-center justify-between">
        <Link href="/" className="text-[1.6rem]">
          <Wordmark />
        </Link>
        <button
          type="button"
          onClick={onClose}
          className="text-sm font-semibold tracking-[0.08em] uppercase"
        >
          Close
        </button>
      </div>
      <ul className="mt-8 flex flex-col gap-7">
        {NAV_ITEMS.map((item) => (
          <li key={item.label}>
            {item.children ? (
              <>
                <Item label={item.label} zh={item.zh} />
                <ul className="mt-3 flex flex-col gap-2 pl-1">
                  {item.children.map((child) => (
                    <li key={child.href + child.label}>
                      <Link href={child.href} className="text-paper text-lg">
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
