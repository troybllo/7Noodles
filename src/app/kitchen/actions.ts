"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  KITCHEN_COOKIE,
  SESSION_SECONDS,
  safeEqual,
  signSession,
} from "@/lib/kitchen-auth";
import { orderEnv } from "@/lib/orders/env";
import { clientIp, hit, LIMITS, reset } from "@/lib/orders/rate-limit";

export type SignInState = { error?: string };

/** Exchanges the staff PIN for the kitchen session cookie. A few tries per address, then a lockout. */
export async function signIn(_: SignInState, form: FormData): Promise<SignInState> {
  const limitKey = `kitchen:${await clientIp()}`;
  if (!(await hit(limitKey, LIMITS.kitchenSignIn))) {
    return { error: "Too many tries. Wait 15 minutes and try again." };
  }

  const pin = String(form.get("pin") ?? "");
  const env = orderEnv();
  if (!safeEqual(pin, env.KITCHEN_PIN)) return { error: "That PIN isn't right." };

  await reset(limitKey);
  const token = await signSession({ secret: env.KITCHEN_SECRET, pin: env.KITCHEN_PIN });
  (await cookies()).set(KITCHEN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_SECONDS,
  });
  redirect("/kitchen");
}

export async function signOut(): Promise<void> {
  (await cookies()).delete(KITCHEN_COOKIE);
  redirect("/kitchen/sign-in");
}
