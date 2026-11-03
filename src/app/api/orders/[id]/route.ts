import { NextResponse, type NextRequest } from "next/server";
import { getOrder } from "@/lib/orders/repo";

/**
 * An order's status, for the customer's status page to poll. Public, but the
 * id is 96 random bits, so the URL itself is the key; it returns nothing the
 * customer did not enter themselves.
 */
export async function GET(_: NextRequest, ctx: RouteContext<"/api/orders/[id]">) {
  const { id } = await ctx.params;
  const order = await getOrder(id);
  if (!order) return NextResponse.json({ error: "No such order" }, { status: 404 });
  return NextResponse.json(
    { status: order.status },
    { headers: { "Cache-Control": "no-store" } },
  );
}
