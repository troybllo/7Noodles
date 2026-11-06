import { useState } from "react";
import { formatCad } from "@/lib/money";
import type { OrderStatus } from "@/lib/orders/status";
import { formatClock } from "@/lib/time";
import type { BoardOrder } from "./use-board";

const BACK: Partial<Record<OrderStatus, OrderStatus>> = {
  preparing: "new",
  ready: "preparing",
};

const OUTLINE = "border-brand h-14 rounded-full border px-4 text-sm font-semibold";

/** One order on the board, as a ticket: when, who, what, and the next step. */
export function Ticket({
  order,
  next,
  busy,
  onMove,
  onPrint,
}: {
  order: BoardOrder;
  next: { to: OrderStatus; label: string } | undefined;
  busy: boolean;
  onMove: (order: BoardOrder, to: OrderStatus) => void;
  onPrint: (id: string) => void;
}) {
  const [confirmCancel, setConfirmCancel] = useState(false);
  const back = BACK[order.status];
  const isNew = order.status === "new";

  return (
    <article
      data-order={order.id}
      className={`kitchen-ticket rounded-2xl border-2 p-4 ${
        isNew
          ? "border-brand bg-brand-soft motion-safe:animate-pulse"
          : "border-brand/25 bg-paper"
      }`}
    >
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-3xl font-extrabold tabular-nums">
          {formatClock(order.pickupAt)}
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
            <span className="text-xl font-extrabold tabular-nums">{line.quantity}×</span>{" "}
            <span className="text-lg font-semibold">{line.nameEn}</span>{" "}
            <span lang="zh" className="font-cjk">
              {line.nameZh}
            </span>
            {line.choices.length > 0 ? (
              <span className="text-brand-deep block pl-7 text-sm">
                {line.choices.map((c) => `${c.choice} ${c.choiceZh}`).join(" · ")}
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
        disabled={busy}
        className="mt-4 flex flex-wrap gap-2 disabled:opacity-60 print:hidden"
      >
        {next ? (
          <button
            type="button"
            onClick={() => onMove(order, next.to)}
            className="bg-brand text-paper h-14 flex-1 rounded-full px-6 text-base font-extrabold tracking-[0.06em] uppercase"
          >
            {next.label}
          </button>
        ) : null}
        {back ? (
          <button type="button" onClick={() => onMove(order, back)} className={OUTLINE}>
            Back
          </button>
        ) : null}
        <button type="button" onClick={() => onPrint(order.id)} className={OUTLINE}>
          Print
        </button>
        {/* Two taps to cancel, so a stray touch never drops an order. */}
        <button
          type="button"
          onClick={() =>
            confirmCancel ? onMove(order, "cancelled") : setConfirmCancel(true)
          }
          onBlur={() => setConfirmCancel(false)}
          className="h-14 px-3 text-sm underline"
        >
          {confirmCancel ? "Tap again to cancel" : "Cancel"}
        </button>
      </fieldset>
    </article>
  );
}
