import { NextResponse } from "next/server";
import { isOrderingPaused, listKitchenOrders } from "@/lib/orders/repo";

/** The board's poll: every order in play, and whether online ordering is paused. Behind the PIN (proxy.ts). */
export async function GET() {
  const [orders, paused] = await Promise.all([listKitchenOrders(), isOrderingPaused()]);
  return NextResponse.json(
    { orders, paused },
    { headers: { "Cache-Control": "no-store" } },
  );
}
