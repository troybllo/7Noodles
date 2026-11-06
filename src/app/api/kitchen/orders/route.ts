import { NextResponse, type NextRequest } from "next/server";
import { isOrderingPaused, listKitchenOrders } from "@/lib/orders/repo";
import { requireKitchen } from "@/lib/orders/require-kitchen";

/** The board's poll: every order in play, and whether online ordering is paused. */
export async function GET(request: NextRequest) {
  const denied = await requireKitchen(request);
  if (denied) return denied;
  const [orders, paused] = await Promise.all([listKitchenOrders(), isOrderingPaused()]);
  return NextResponse.json(
    { orders, paused },
    { headers: { "Cache-Control": "no-store" } },
  );
}
