/**
 * The kitchen's sign-in: a staff PIN exchanged for a signed, expiring cookie.
 *
 * The cookie is `<expiry>.<signature>`, an HMAC-SHA256 of the expiry under
 * KITCHEN_SECRET. Web Crypto only, so the same code runs in proxy.ts and in
 * route handlers. Nothing secret is stored in the browser.
 */

export const KITCHEN_COOKIE = "kitchen_session";

/** A kitchen tablet stays signed in for 30 days. */
export const SESSION_SECONDS = 60 * 60 * 24 * 30;

const encoder = new TextEncoder();

async function hmac(secret: string, message: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(message));
  return Buffer.from(signature).toString("base64url");
}

/** Compares without leaking, through timing, how much of the input matched. */
export function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function signSession(secret: string, now = Date.now()): Promise<string> {
  const expires = Math.floor(now / 1000) + SESSION_SECONDS;
  return `${expires}.${await hmac(secret, String(expires))}`;
}

export async function verifySession(
  secret: string,
  token: string | undefined,
  now = Date.now(),
): Promise<boolean> {
  if (!token) return false;
  const [expires, signature] = token.split(".");
  if (!expires || !signature || !/^\d+$/.test(expires)) return false;
  if (Number(expires) * 1000 < now) return false;
  return safeEqual(signature, await hmac(secret, expires));
}
