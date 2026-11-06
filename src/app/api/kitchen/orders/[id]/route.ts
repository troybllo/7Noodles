import { NextResponse, type NextRequest } from "next/server";
import { advanceOrder } from "@/lib/orders/repo";
import { requireKitchen } from "@/lib/orders/require-kitchen";
import { isOrderStatus } from "@/lib/orders/status";

/**
 * Moves an order on the board: { from, to }. `from` is the status the device
 * was showing; if another device has moved the order since, this is a 409.
 */
export async function POST(
  request: NextRequest,
  ctx: RouteContext<"/api/kitchen/orders/[id]">,
) {
  const denied = await requireKitchen(request);
  if (denied) return denied;
  const { id } = await ctx.params;
  const body = (await request.json().catch(() => ({}))) as {
    from?: unknown;
    to?: unknown;
  };
  if (!isOrderStatus(body.from) || !isOrderStatus(body.to)) {
    return NextResponse.json({ error: "Send { from, to } statuses" }, { status: 400 });
  }
  const order = await advanceOrder(id, body.from, body.to);
  if (!order) {
    return NextResponse.json(
      { error: "Someone else has already moved this order." },
      { status: 409 },
    );
  }
  return NextResponse.json({ order });
}
