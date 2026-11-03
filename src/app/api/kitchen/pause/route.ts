import { NextResponse, type NextRequest } from "next/server";
import { setOrderingPaused } from "@/lib/orders/repo";

/** Pauses or resumes online ordering: { paused: boolean }. Behind the PIN (proxy.ts). */
export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => ({}))) as { paused?: unknown };
  if (typeof body.paused !== "boolean") {
    return NextResponse.json({ error: "Send { paused: true | false }" }, { status: 400 });
  }
  await setOrderingPaused(body.paused);
  return NextResponse.json({ paused: body.paused });
}
