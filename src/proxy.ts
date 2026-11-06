import { NextResponse, type NextRequest } from "next/server";
import { isKitchenSession, KITCHEN_COOKIE } from "@/lib/kitchen-auth";

/**
 * Keeps the kitchen board and its API behind the staff PIN. The sign-in page
 * is open. Pages are sent to sign in; API calls get a 401. Each API route
 * checks the session again (see requireKitchen), so a change to the matcher
 * can't expose one.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === "/kitchen/sign-in") return NextResponse.next();

  if (await isKitchenSession(request.cookies.get(KITCHEN_COOKIE)?.value)) {
    return NextResponse.next();
  }
  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Sign in to the kitchen first." }, { status: 401 });
  }
  return NextResponse.redirect(new URL("/kitchen/sign-in", request.url));
}

export const config = {
  matcher: ["/kitchen/:path*", "/api/kitchen/:path*"],
};
