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

export type SignInState = { error?: string };

/** Exchanges the staff PIN for the kitchen session cookie. */
export async function signIn(_: SignInState, form: FormData): Promise<SignInState> {
  const pin = String(form.get("pin") ?? "");
  const env = orderEnv();
  if (!safeEqual(pin, env.KITCHEN_PIN)) {
    // A short pause makes guessing a PIN by brute force slow going.
    await new Promise((resolve) => setTimeout(resolve, 800));
    return { error: "That PIN isn't right." };
  }
  (await cookies()).set(KITCHEN_COOKIE, await signSession(env.KITCHEN_SECRET), {
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
