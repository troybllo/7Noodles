import { NextResponse, type NextRequest } from "next/server";
import { advanceOrder } from "@/lib/orders/repo";
import { ORDER_STATUSES, type OrderStatus } from "@/lib/orders/status";

/** Moves an order on the board: { to: "preparing" | "ready" | ... }. Behind the PIN (proxy.ts). */
export async function POST(
  request: NextRequest,
  ctx: RouteContext<"/api/kitchen/orders/[id]">,
) {
  const { id } = await ctx.params;
  const body = (await request.json().catch(() => ({}))) as { to?: string };
  if (!body.to || !ORDER_STATUSES.includes(body.to as OrderStatus)) {
    return NextResponse.json({ error: "Unknown status" }, { status: 400 });
  }
  const order = await advanceOrder(id, body.to as OrderStatus);
  if (!order)
    return NextResponse.json({ error: "That move isn't allowed" }, { status: 409 });
  return NextResponse.json({ order });
}
