"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { formatCad } from "@/lib/money";
import type { OrderLine } from "@/lib/orders/snapshot";
import type { OrderStatus } from "@/lib/orders/status";
import { signOut } from "./actions";

/** An order as the board receives it: the API's JSON, so dates are strings. */
type BoardOrder = {
  id: string;
  code: string;
  status: OrderStatus;
  lines: OrderLine[];
  totalCents: number;
  customerName: string;
  customerPhone: string;
  note: string | null;
  pickupAt: string;
  paidAt: string | null;
};

const POLL_MS = 4000;
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

const BACK: Partial<Record<OrderStatus, OrderStatus>> = {
  preparing: "new",
  ready: "preparing",
};

const clock = (iso: string) =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Toronto",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(iso));

/** Two rising tones, loud enough for a kitchen. Web Audio, so no sound file to load. */
function chime(context: AudioContext) {
  const now = context.currentTime;
  [880, 1320].forEach((frequency, i) => {
    const osc = context.createOscillator();
    const gain = context.createGain();
    osc.type = "triangle";
    osc.frequency.value = frequency;
    gain.gain.setValueAtTime(0.0001, now + i * 0.22);
    gain.gain.exponentialRampToValueAtTime(0.9, now + i * 0.22 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.22 + 0.5);
    osc.connect(gain).connect(context.destination);
    osc.start(now + i * 0.22);
    osc.stop(now + i * 0.22 + 0.55);
  });
}

function base64ToBytes(base64: string): Uint8Array<ArrayBuffer> {
  const padded = (base64 + "=".repeat((4 - (base64.length % 4)) % 4))
    .replace(/-/g, "+")
    .replace(/_/g, "/");
  const raw = atob(padded);
  const bytes = new Uint8Array(new ArrayBuffer(raw.length));
  for (let i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i);
  return bytes;
}

/**
 * The kitchen's order board, for a tablet propped by the pass.
 *
 * It polls for paid orders every few seconds. A new order flashes and chimes
 * — again and again — until someone taps Accept, so an order cannot sit
 * unseen. Browsers only allow sound after a tap, so the board starts with a
 * "Start shift" button, which also keeps the screen awake.
 */
export function Board({ vapidKey }: { vapidKey: string }) {
  const router = useRouter();
  const [orders, setOrders] = useState<BoardOrder[]>([]);
  const [paused, setPaused] = useState(false);
  const [started, setStarted] = useState(false);
  const [offline, setOffline] = useState(false);
  const [pushState, setPushState] = useState<"idle" | "on" | "denied" | "unsupported">(
    "idle",
  );
  const [confirmCancel, setConfirmCancel] = useState<string | null>(null);
  /** Orders with a move on its way to the server: their buttons wait, so a fast second tap can't race it. */
  const [busy, setBusy] = useState<ReadonlySet<string>>(new Set());
  const audio = useRef<AudioContext | null>(null);
  const wakeLock = useRef<WakeLockSentinel | null>(null);

  const load = useCallback(async () => {
    try {
      const response = await fetch("/api/kitchen/orders", { cache: "no-store" });
      if (response.status === 401) {
        router.push("/kitchen/sign-in");
        return;
      }
      const data = (await response.json()) as { orders: BoardOrder[]; paused: boolean };
      setOrders(data.orders);
      setPaused(data.paused);
      setOffline(false);
    } catch {
      setOffline(true);
    }
  }, [router]);

  useEffect(() => {
    const first = window.setTimeout(load, 0);
    const timer = window.setInterval(load, POLL_MS);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(timer);
    };
  }, [load]);

  const waiting = orders.filter((o) => o.status === "new").length;

  // Chime on a loop while anything waits to be accepted.
  useEffect(() => {
    if (!started || waiting === 0 || !audio.current) return;
    const context = audio.current;
    chime(context);
    const timer = window.setInterval(() => chime(context), CHIME_EVERY_MS);
    return () => window.clearInterval(timer);
  }, [started, waiting]);

  // The waiting count in the tab title, for a board left in a background tab.
  useEffect(() => {
    document.title = waiting > 0 ? `(${waiting}) New order — Kitchen` : "Kitchen";
  }, [waiting]);

  // A screen wake lock is released whenever the page is hidden; take it back.
  useEffect(() => {
    if (!started) return;
    const reacquire = async () => {
      if (document.visibilityState === "visible" && "wakeLock" in navigator) {
        wakeLock.current = await navigator.wakeLock.request("screen").catch(() => null);
      }
    };
    void reacquire();
    document.addEventListener("visibilitychange", reacquire);
    return () => document.removeEventListener("visibilitychange", reacquire);
  }, [started]);

  const startShift = () => {
    audio.current ??= new AudioContext();
    void audio.current.resume();
    chime(audio.current);
    setStarted(true);
  };

  const move = async (id: string, to: OrderStatus) => {
    setConfirmCancel(null);
    setBusy((current) => new Set(current).add(id));
    // Move it on screen straight away; the next poll confirms or corrects it.
    setOrders((current) => current.map((o) => (o.id === id ? { ...o, status: to } : o)));
    try {
      await fetch(`/api/kitchen/orders/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to }),
      });
    } finally {
      setBusy((current) => {
        const next = new Set(current);
        next.delete(id);
        return next;
      });
      void load();
    }
  };

  const togglePause = async () => {
    const next = !paused;
    setPaused(next);
    await fetch("/api/kitchen/pause", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paused: next }),
    });
  };

  const enablePush = async () => {
    if (!("serviceWorker" in navigator) || !("PushManager" in window) || !vapidKey) {
      setPushState("unsupported");
      return;
    }
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      setPushState("denied");
      return;
    }
    const registration = await navigator.serviceWorker.register("/sw.js");
    await navigator.serviceWorker.ready;
    const subscription =
      (await registration.pushManager.getSubscription()) ??
      (await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: base64ToBytes(vapidKey),
      }));
    await fetch("/api/kitchen/push", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subscription, label: navigator.userAgent.slice(0, 60) }),
    });
    setPushState("on");
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
        <p className="mr-auto text-xl font-extrabold tracking-[-0.02em] uppercase">
          Kitchen <span className="font-normal opacity-80">· Seven Noodles</span>
        </p>
        {offline ? (
          <span className="bg-paper text-brand rounded-full px-3 py-1 text-xs font-bold uppercase">
            Connection lost — retrying
          </span>
        ) : null}
        <button
          type="button"
          onClick={togglePause}
          className={`h-11 rounded-full px-5 text-sm font-bold uppercase ${paused ? "bg-paper text-brand" : "border-paper border"}`}
        >
          {paused ? "Online orders paused — resume" : "Pause online orders"}
        </button>
        <button
          type="button"
          onClick={enablePush}
          disabled={pushState === "on"}
          className="border-paper h-11 rounded-full border px-5 text-sm font-bold uppercase disabled:opacity-60"
        >
          {pushState === "on"
            ? "Phone alerts on"
            : pushState === "denied"
              ? "Alerts blocked in settings"
              : pushState === "unsupported"
                ? "Add to Home Screen first"
                : "Alerts on this phone"}
        </button>
        <form action={signOut}>
          <button type="submit" className="h-11 px-3 text-sm underline">
            Sign out
          </button>
        </form>
      </header>

      {!started ? (
        <div className="flex flex-col items-center gap-4 px-6 py-16 text-center print:hidden">
          <p className="text-2xl font-semibold">
            Tap to start — so the board can ring for new orders.
          </p>
          <button
            type="button"
            onClick={startShift}
            className="bg-brand text-paper h-20 rounded-full px-12 text-xl font-extrabold tracking-[0.08em] uppercase"
          >
            Start shift
          </button>
        </div>
      ) : null}

      <div className="grid gap-4 p-4 lg:grid-cols-3">
        {COLUMNS.map((column) => {
          const list = orders.filter((o) => o.status === column.status);
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
                <article
                  key={order.id}
                  data-order={order.id}
                  className={`kitchen-ticket rounded-2xl border-2 p-4 ${
                    order.status === "new"
                      ? "border-brand bg-brand-soft motion-safe:animate-pulse"
                      : "border-brand/25 bg-paper"
                  }`}
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="text-3xl font-extrabold tabular-nums">
                      {clock(order.pickupAt)}
                    </p>
                    <p className="text-lg font-bold">{order.code}</p>
                  </div>
                  <p className="mt-1 font-semibold">
                    {order.customerName} ·{" "}
                    <a href={`tel:${order.customerPhone}`} className="underline">
                      {order.customerPhone}
                    </a>
                  </p>
                  <ul className="mt-3 flex flex-col gap-2 border-t border-current/20 pt-3">
                    {order.lines.map((line, i) => (
                      <li key={i} className="leading-snug">
                        <span className="text-xl font-extrabold tabular-nums">
                          {line.quantity}×
                        </span>{" "}
                        <span className="text-lg font-semibold">{line.nameEn}</span>{" "}
                        <span lang="zh" className="font-cjk">
                          {line.nameZh}
                        </span>
                        {line.choices.length > 0 ? (
                          <span className="text-brand-deep block pl-7 text-sm">
                            {line.choices
                              .map((c) => `${c.choice} ${c.choiceZh}`)
                              .join(" · ")}
                          </span>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                  {order.note ? (
                    <p className="bg-brand text-paper mt-3 rounded-lg px-3 py-2 font-semibold">
                      Note: {order.note}
                    </p>
                  ) : null}
                  <p className="text-brand-deep mt-2 text-sm">
                    Paid online · {formatCad(order.totalCents)}
                  </p>

                  <fieldset
                    disabled={busy.has(order.id)}
                    className="mt-4 flex flex-wrap gap-2 disabled:opacity-60 print:hidden"
                  >
                    {column.next ? (
                      <button
                        type="button"
                        onClick={() => move(order.id, column.next!.to)}
                        className="bg-brand text-paper h-14 flex-1 rounded-full px-6 text-base font-extrabold tracking-[0.06em] uppercase"
                      >
                        {column.next.label}
                      </button>
                    ) : null}
                    {BACK[order.status] ? (
                      <button
                        type="button"
                        onClick={() => move(order.id, BACK[order.status]!)}
                        className="border-brand h-14 rounded-full border px-4 text-sm font-semibold"
                      >
                        Back
                      </button>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => print(order.id)}
                      className="border-brand h-14 rounded-full border px-4 text-sm font-semibold"
                    >
                      Print
                    </button>
                    {/* Two taps to cancel, so a stray touch never drops an order. */}
                    <button
                      type="button"
                      onClick={() =>
                        confirmCancel === order.id
                          ? move(order.id, "cancelled")
                          : setConfirmCancel(order.id)
                      }
                      className="h-14 px-3 text-sm underline"
                    >
                      {confirmCancel === order.id ? "Tap again to cancel" : "Cancel"}
                    </button>
                  </fieldset>
                </article>
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
