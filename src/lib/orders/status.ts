/**
 * Where an order can go next. Kept pure so the rules are tested once and the
 * kitchen board, the API and the database all agree.
 *
 *   pending_payment → new          paid (Stripe webhook only)
 *   new → preparing → ready → picked_up
 *   one step back from preparing or ready, for a mistaken tap
 *   cancelled from anywhere before pickup
 */
export const ORDER_STATUSES = [
  "pending_payment",
  "new",
  "preparing",
  "ready",
  "picked_up",
  "cancelled",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

const NEXT: Record<OrderStatus, readonly OrderStatus[]> = {
  pending_payment: ["new", "cancelled"],
  new: ["preparing", "cancelled"],
  preparing: ["ready", "new", "cancelled"],
  ready: ["picked_up", "preparing", "cancelled"],
  picked_up: [],
  cancelled: [],
};

export function canMove(from: OrderStatus, to: OrderStatus): boolean {
  return NEXT[from].includes(to);
}

/** Moves the kitchen may make from the board. Payment is never one of them. */
export function kitchenCanMove(from: OrderStatus, to: OrderStatus): boolean {
  return from !== "pending_payment" && canMove(from, to);
}

export const STATUS_LABEL: Record<OrderStatus, string> = {
  pending_payment: "Awaiting payment",
  new: "Order received",
  preparing: "Being made",
  ready: "Ready for pickup",
  picked_up: "Picked up",
  cancelled: "Cancelled",
};
