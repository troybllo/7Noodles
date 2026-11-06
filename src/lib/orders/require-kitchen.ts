import "server-only";
import { NextResponse, type NextRequest } from "next/server";
import { isKitchenSession, KITCHEN_COOKIE } from "@/lib/kitchen-auth";

/** A 401 unless the request carries a kitchen session. proxy.ts checks first; this is the second lock. */
export async function requireKitchen(request: NextRequest): Promise<NextResponse | null> {
  if (await isKitchenSession(request.cookies.get(KITCHEN_COOKIE)?.value)) return null;
  return NextResponse.json({ error: "Sign in to the kitchen first." }, { status: 401 });
}
