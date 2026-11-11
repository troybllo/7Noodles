"use client";

import { useEffect, useRef, useState } from "react";
import { Logo } from "@/components/brand/logo";
import type { OrderStatus } from "@/lib/orders/status";
import { signOut } from "./actions";
import { chime } from "./chime";
import { enablePush, type PushState } from "./push";
import { Ticket } from "./ticket";
import { useBoard } from "./use-board";

/** While an order waits to be accepted, the chime repeats this often. */
const CHIME_EVERY_MS = 4000;

const COLUMNS: {
  status: OrderStatus;
  title: string;
  next?: { to: OrderStatus; label: string };
}[] = [
  { status: "new", title: "New", next: { to: "preparing", label: "Accept & start" } },
  { status: "preparing", title: "Preparing", next: { to: "ready", label: "Ready" } },
  {
    status: "ready",
    title: "Ready for pickup",
    next: { to: "picked_up", label: "Picked up" },
  },
];

const PUSH_LABEL: Record<PushState, string> = {
  idle: "Alerts on this phone",
  on: "Phone alerts on",
  denied: "Alerts blocked in settings",
  unsupported: "Add to Home Screen first",
  failed: "Alerts failed — try again",
};

const HEADER_BUTTON = "h-11 px-5 text-sm font-bold uppercase";

/**
 * The kitchen's order board, for a tablet propped by the pass. A new order
 * flashes and chimes, again and again, until someone taps Accept. Browsers
 * only allow sound after a tap, so the board starts with "Start shift", which
 * also keeps the screen awake.
 */
export function Board({ vapidKey }: { vapidKey: string }) {
  const board = useBoard();
  const [started, setStarted] = useState(false);
  const [push, setPush] = useState<PushState>("idle");
  const audio = useRef<AudioContext | null>(null);

  const waiting = board.orders.filter((o) => o.status === "new").length;
  const rings = started && board.leader && waiting > 0;

  useEffect(() => {
    const context = audio.current;
    if (!rings || !context) return;
    chime(context);
    const timer = window.setInterval(() => chime(context), CHIME_EVERY_MS);
    return () => window.clearInterval(timer);
  }, [rings]);

  useEffect(() => {
    document.title = waiting > 0 ? `(${waiting}) New order — Kitchen` : "Kitchen";
  }, [waiting]);

  // Sleep releases the wake lock and suspends audio (iOS especially): take both back on waking.
  useEffect(() => {
    if (!started) return;
    let lock: WakeLockSentinel | null = null;
    const wake = async () => {
      if (document.visibilityState !== "visible") return;
      void audio.current?.resume();
      if ("wakeLock" in navigator) {
        lock = await navigator.wakeLock.request("screen").catch(() => null);
      }
    };
    void wake();
    document.addEventListener("visibilitychange", wake);
    return () => {
      document.removeEventListener("visibilitychange", wake);
      void lock?.release();
    };
  }, [started]);

  const startShift = () => {
    audio.current ??= new AudioContext();
    void audio.current.resume();
    chime(audio.current);
    setStarted(true);
  };

  const print = (id: string) => {
    const ticket = document.querySelector(`[data-order="${CSS.escape(id)}"]`);
    ticket?.classList.add("print-target");
    document.body.classList.add("printing-one");
    window.print();
    document.body.classList.remove("printing-one");
    ticket?.classList.remove("print-target");
  };

  return (
    <main className="bg-paper text-brand min-h-svh">
      <header className="bg-brand text-paper flex flex-wrap items-center gap-3 px-5 py-3 print:hidden">
        <p className="mr-auto flex items-center gap-4">
          <Logo variant="lockup" title="Seven Noodles 恰小面" className="h-11 w-auto" />
          <span className="border-paper/40 border-l pl-4 text-xl font-extrabold tracking-[-0.02em] uppercase">
            Kitchen
          </span>
        </p>
        {board.offline ? (
          <span className="bg-paper text-brand rounded-full px-3 py-1 text-xs font-bold uppercase">
            Connection lost — retrying
          </span>
        ) : null}
        <button
          type="button"
          onClick={() => board.setPaused(!board.paused)}
          className={`${HEADER_BUTTON} ${board.paused ? "bg-paper text-brand" : "border-paper border"}`}
        >
          {board.paused ? "Online orders paused — resume" : "Pause online orders"}
        </button>
        <button
          type="button"
          onClick={async () => setPush(await enablePush(vapidKey))}
          disabled={push === "on"}
          className={`${HEADER_BUTTON} border-paper border disabled:opacity-60`}
        >
          {PUSH_LABEL[push]}
        </button>
        <form action={signOut}>
          <button type="submit" className="h-11 px-3 text-sm underline">
            Sign out
          </button>
        </form>
      </header>

      {board.notice ? (
        <div
          role="alert"
          className="bg-brand-soft border-brand flex items-center justify-between gap-4 border-b px-5 py-3 font-semibold print:hidden"
        >
          {board.notice}
          <button type="button" onClick={board.dismissNotice} className="underline">
            OK
          </button>
        </div>
      ) : null}

      {!board.leader ? (
        <p className="bg-brand-soft px-5 py-3 text-center text-sm print:hidden">
          This board is also open in another tab on this device. The sound plays from that
          tab.
        </p>
      ) : !started ? (
        <div className="flex flex-col items-center gap-4 px-6 py-16 text-center print:hidden">
          <p className="text-2xl font-semibold">
            Tap to start, so the board can ring for new orders.
          </p>
          <button
            type="button"
            onClick={startShift}
            className="bg-brand text-paper h-20 px-12 text-xl font-extrabold tracking-[0.08em] uppercase"
          >
            Start shift
          </button>
        </div>
      ) : null}

      <div className="grid gap-4 p-4 lg:grid-cols-3">
        {COLUMNS.map((column) => {
          const list = board.orders.filter((o) => o.status === column.status);
          return (
            <section
              key={column.status}
              aria-label={column.title}
              className="flex flex-col gap-3"
            >
              <h2 className="eyebrow flex items-center justify-between border-b border-current pb-2 print:hidden">
                {column.title}
                <span className="tabular-nums">{list.length}</span>
              </h2>
              {list.map((order) => (
                <Ticket
                  key={order.id}
                  order={order}
                  next={column.next}
                  busy={board.busy(order.id)}
                  onMove={board.move}
                  onPrint={print}
                />
              ))}
              {list.length === 0 ? (
                <p className="text-brand-deep py-6 text-center text-sm print:hidden">
                  Nothing here.
                </p>
              ) : null}
            </section>
          );
        })}
      </div>
    </main>
  );
}
