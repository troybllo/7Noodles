import { NextResponse, type NextRequest } from "next/server";
import { savePushSubscription } from "@/lib/orders/repo";
import { requireKitchen } from "@/lib/orders/require-kitchen";

/** Saves a phone's push subscription so it is alerted to new orders. */
export async function POST(request: NextRequest) {
  const denied = await requireKitchen(request);
  if (denied) return denied;
  const body = (await request.json().catch(() => null)) as {
    subscription?: { endpoint?: string; keys?: { p256dh?: string; auth?: string } };
    label?: string;
  } | null;
  const sub = body?.subscription;
  if (!sub?.endpoint?.startsWith("https://") || !sub.keys?.p256dh || !sub.keys.auth) {
    return NextResponse.json({ error: "Not a push subscription" }, { status: 400 });
  }
  await savePushSubscription(
    { endpoint: sub.endpoint, p256dh: sub.keys.p256dh, auth: sub.keys.auth },
    body?.label?.slice(0, 60) ?? null,
  );
  return NextResponse.json({ ok: true });
}
