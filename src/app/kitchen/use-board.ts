"use client";

import { useRouter } from "next/navigation";
import { useEffect, useEffectEvent, useRef, useState } from "react";
import type { OrderLine } from "@/lib/orders/snapshot";
import type { OrderStatus } from "@/lib/orders/status";
import { usePoll } from "@/lib/use-poll";
import { useTabLeader } from "@/lib/use-tab-leader";

/** An order as the board receives it: the API's JSON, so dates are strings. */
export type BoardOrder = {
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

type Snapshot = { orders: BoardOrder[]; paused: boolean };
type Message = { type: "snapshot"; snapshot: Snapshot } | { type: "refresh" };

const CHANNEL = "kitchen-board";

/**
 * The board's data, shared by every tab of it open on this device: one tab
 * (the leader) polls and passes each snapshot to the others, so a forgotten
 * second tab neither doubles the load nor rings twice. Moves show at once and
 * are reconciled with the server; a move another device beat us to is
 * reported, not silently undone.
 */
export function useBoard() {
  const router = useRouter();
  const leader = useTabLeader(CHANNEL);
  const [snapshot, setSnapshot] = useState<Snapshot>({ orders: [], paused: false });
  const [moving, setMoving] = useState<ReadonlyMap<string, OrderStatus>>(new Map());
  const [pausing, setPausing] = useState<boolean | null>(null);
  const [offline, setOffline] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const channel = useRef<BroadcastChannel | null>(null);

  const pollNow = usePoll(
    async (signal) => {
      try {
        const response = await fetch("/api/kitchen/orders", {
          cache: "no-store",
          signal,
        });
        if (response.status === 401) {
          router.push("/kitchen/sign-in");
          return false;
        }
        if (!response.ok) throw new Error(`Board poll failed: ${response.status}`);
        const next = (await response.json()) as Snapshot;
        setSnapshot(next);
        setOffline(false);
        channel.current?.postMessage({
          type: "snapshot",
          snapshot: next,
        } satisfies Message);
      } catch (error) {
        if (!signal.aborted) setOffline(true);
        throw error;
      }
    },
    { every: 4_000, whenHidden: 15_000, maxBackoff: 30_000, enabled: leader },
  );

  const onMessage = useEffectEvent((message: Message) => {
    if (message.type === "snapshot") setSnapshot(message.snapshot);
    if (message.type === "refresh" && leader) pollNow();
  });

  useEffect(() => {
    const opened = new BroadcastChannel(CHANNEL);
    opened.onmessage = ({ data }: MessageEvent<Message>) => onMessage(data);
    channel.current = opened;
    return () => opened.close();
  }, []);

  const refresh = () => {
    if (leader) pollNow();
    else channel.current?.postMessage({ type: "refresh" } satisfies Message);
  };

  const orders = snapshot.orders.map((order) => {
    const to = moving.get(order.id);
    return to ? { ...order, status: to } : order;
  });

  const move = async (order: BoardOrder, to: OrderStatus) => {
    setNotice(null);
    setMoving((current) => new Map(current).set(order.id, to));
    try {
      const response = await fetch(`/api/kitchen/orders/${order.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ from: order.status, to }),
      });
      if (response.status === 409) {
        setNotice(`Order ${order.code} was already moved on another device.`);
      } else if (!response.ok) {
        setNotice(
          `Couldn't update order ${order.code}. Check the connection and try again.`,
        );
      }
    } catch {
      setNotice(
        `Couldn't update order ${order.code}. Check the connection and try again.`,
      );
    } finally {
      setMoving((current) => {
        const next = new Map(current);
        next.delete(order.id);
        return next;
      });
      refresh();
    }
  };

  const setPaused = async (paused: boolean) => {
    setPausing(paused);
    try {
      const response = await fetch("/api/kitchen/pause", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paused }),
      });
      if (!response.ok) throw new Error(`Pause failed: ${response.status}`);
      setSnapshot((current) => ({ ...current, paused }));
    } catch {
      setNotice("Couldn't change online ordering. Check the connection and try again.");
    } finally {
      setPausing(null);
      refresh();
    }
  };

  return {
    orders,
    paused: pausing ?? snapshot.paused,
    busy: (id: string) => moving.has(id),
    leader,
    offline,
    notice,
    dismissNotice: () => setNotice(null),
    move,
    setPaused,
  };
}
