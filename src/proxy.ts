import { NextResponse, type NextRequest } from "next/server";
import { KITCHEN_COOKIE, verifySession } from "@/lib/kitchen-auth";

/**
 * Keeps the kitchen board and its API behind the staff PIN. The sign-in page
 * itself is open. Pages get sent to sign in; API calls get a plain 401.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === "/kitchen/sign-in") return NextResponse.next();

  const secret = process.env.KITCHEN_SECRET;
  const ok = secret
    ? await verifySession(secret, request.cookies.get(KITCHEN_COOKIE)?.value)
    : false;
  if (ok) return NextResponse.next();

  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Sign in to the kitchen first." }, { status: 401 });
  }
  return NextResponse.redirect(new URL("/kitchen/sign-in", request.url));
}

export const config = {
  matcher: ["/kitchen/:path*", "/api/kitchen/:path*"],
};
