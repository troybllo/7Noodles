import "server-only";
import { randomBytes } from "node:crypto";
import { db } from "./db";
import { orderCode, type OrderLine } from "./snapshot";
import { kitchenCanMove, type OrderStatus } from "./status";

export type Order = {
  id: string;
  code: string;
  status: OrderStatus;
  lines: OrderLine[];
  subtotalCents: number;
  taxCents: number;
  totalCents: number;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  note: string | null;
  pickupAt: Date;
  createdAt: Date;
  paidAt: Date | null;
};

type Row = {
  id: string;
  code: string;
  status: OrderStatus;
  lines: OrderLine[];
  subtotal_cents: number;
  tax_cents: number;
  total_cents: number;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  note: string | null;
  pickup_at: Date;
  created_at: Date;
  paid_at: Date | null;
};

const fromRow = (row: Row): Order => ({
  id: row.id,
  code: row.code,
  status: row.status,
  lines: row.lines,
  subtotalCents: row.subtotal_cents,
  taxCents: row.tax_cents,
  totalCents: row.total_cents,
  customerName: row.customer_name,
  customerPhone: row.customer_phone,
  customerEmail: row.customer_email,
  note: row.note,
  pickupAt: row.pickup_at,
  createdAt: row.created_at,
  paidAt: row.paid_at,
});

export type NewOrder = {
  lines: OrderLine[];
  subtotalCents: number;
  taxCents: number;
  totalCents: number;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  note: string | null;
  pickupAt: Date;
};

/** Saves an order awaiting payment, retrying the short code if it clashes with a live order. */
export async function createOrder(order: NewOrder): Promise<Order> {
  const id = randomBytes(12).toString("base64url");
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      const { rows } = await db().query<Row>(
        `insert into orders (id, code, lines, subtotal_cents, tax_cents, total_cents,
           customer_name, customer_phone, customer_email, note, pickup_at)
         values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
         returning *`,
        [
          id,
          orderCode(),
          JSON.stringify(order.lines),
          order.subtotalCents,
          order.taxCents,
          order.totalCents,
          order.customerName,
          order.customerPhone,
          order.customerEmail,
          order.note,
          order.pickupAt,
        ],
      );
      return fromRow(rows[0]!);
    } catch (error) {
      const clash =
        error instanceof Error &&
        "constraint" in error &&
        error.constraint === "orders_live_code";
      if (!clash) throw error;
    }
  }
  throw new Error("Could not allocate an order code");
}

export async function attachCheckoutSession(
  id: string,
  sessionId: string,
): Promise<void> {
  await db().query(
    "update orders set stripe_session_id = $2, updated_at = now() where id = $1",
    [id, sessionId],
  );
}

/** The Stripe checkout session an order was paid through. */
export type PaidSession = { sessionId: string; orderId: string | undefined };

/**
 * Marks an order paid, once. Stripe may deliver an event twice; only the first
 * delivery moves the order and returns it, so the kitchen is alerted once.
 * The order id from the session's metadata covers a webhook that arrives
 * before the session id was saved.
 */
export async function markPaid({
  sessionId,
  orderId,
}: PaidSession): Promise<Order | null> {
  const { rows } = await db().query<Row>(
    `update orders set status = 'new', paid_at = now(), updated_at = now(),
       stripe_session_id = $1
     where (stripe_session_id = $1 or id = $2) and status = 'pending_payment'
     returning *`,
    [sessionId, orderId ?? null],
  );
  return rows[0] ? fromRow(rows[0]) : null;
}

/** An abandoned, expired or failed payment: the order never reaches the kitchen. */
export async function markUnpaid({ sessionId, orderId }: PaidSession): Promise<void> {
  await db().query(
    `update orders set status = 'cancelled', updated_at = now()
     where (stripe_session_id = $1 or id = $2) and status = 'pending_payment'`,
    [sessionId, orderId ?? null],
  );
}

export async function getOrder(id: string): Promise<Order | null> {
  const { rows } = await db().query<Row>("select * from orders where id = $1", [id]);
  return rows[0] ? fromRow(rows[0]) : null;
}

/** Paid orders still in play, plus anything picked up in the last two hours. */
export async function listKitchenOrders(): Promise<Order[]> {
  // Two indexed reads rather than one OR, which would scan every order ever.
  const { rows } = await db().query<Row>(
    `select * from (
       select * from orders where status in ('new', 'preparing', 'ready')
       union all
       select * from orders
       where status = 'picked_up' and updated_at > now() - interval '2 hours'
     ) board order by pickup_at asc`,
  );
  return rows.map(fromRow);
}

/**
 * Moves an order on the board from the status the device last saw. If another
 * device moved it first, nothing changes and null comes back, so a stale
 * screen can never cancel an order someone else has already finished.
 */
export async function advanceOrder(
  id: string,
  from: OrderStatus,
  to: OrderStatus,
): Promise<Order | null> {
  if (!kitchenCanMove(from, to)) return null;
  const { rows } = await db().query<Row>(
    `update orders set status = $3, updated_at = now()
     where id = $1 and status = $2 returning *`,
    [id, from, to],
  );
  return rows[0] ? fromRow(rows[0]) : null;
}

export async function isOrderingPaused(): Promise<boolean> {
  const { rows } = await db().query<{ value: boolean }>(
    "select value from settings where key = 'ordering_paused'",
  );
  return rows[0]?.value === true;
}

export async function setOrderingPaused(paused: boolean): Promise<void> {
  await db().query(
    "update settings set value = $1::jsonb, updated_at = now() where key = 'ordering_paused'",
    [JSON.stringify(paused)],
  );
}

export type PushSubscriptionRow = { endpoint: string; p256dh: string; auth: string };

export async function savePushSubscription(
  sub: PushSubscriptionRow,
  label: string | null,
) {
  await db().query(
    `insert into push_subscriptions (endpoint, p256dh, auth, label) values ($1, $2, $3, $4)
     on conflict (endpoint) do update set p256dh = excluded.p256dh, auth = excluded.auth`,
    [sub.endpoint, sub.p256dh, sub.auth, label],
  );
}

export async function listPushSubscriptions(): Promise<PushSubscriptionRow[]> {
  const { rows } = await db().query<PushSubscriptionRow>(
    "select endpoint, p256dh, auth from push_subscriptions",
  );
  return rows;
}

export async function deletePushSubscription(endpoint: string): Promise<void> {
  await db().query("delete from push_subscriptions where endpoint = $1", [endpoint]);
}
