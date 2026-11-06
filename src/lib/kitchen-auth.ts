/**
 * The kitchen's sign-in: a staff PIN exchanged for a signed, expiring cookie,
 * `<expiry>.<hmac>`. The HMAC key mixes KITCHEN_SECRET with the PIN, so
 * changing the PIN signs every device out. Web Crypto only, so the same code
 * runs in proxy.ts and in route handlers.
 */

export const KITCHEN_COOKIE = "kitchen_session";

/** A kitchen tablet stays signed in for 30 days. */
export const SESSION_SECONDS = 60 * 60 * 24 * 30;

export type SessionKey = { secret: string; pin: string };

const encoder = new TextEncoder();

async function hmac({ secret, pin }: SessionKey, message: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(`${secret}:${pin}`),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(message));
  return Buffer.from(signature).toString("base64url");
}

/** Compares in time that depends only on the longer input, not on what matched. */
export function safeEqual(a: string, b: string): boolean {
  const length = Math.max(a.length, b.length);
  let diff = a.length ^ b.length;
  for (let i = 0; i < length; i++)
    diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  return diff === 0;
}

export async function signSession(key: SessionKey, now = Date.now()): Promise<string> {
  const expires = Math.floor(now / 1000) + SESSION_SECONDS;
  return `${expires}.${await hmac(key, String(expires))}`;
}

export async function verifySession(
  key: SessionKey,
  token: string | undefined,
  now = Date.now(),
): Promise<boolean> {
  if (!token) return false;
  const [expires, signature] = token.split(".");
  if (!expires || !signature || !/^\d+$/.test(expires)) return false;
  if (Number(expires) * 1000 < now) return false;
  return safeEqual(signature, await hmac(key, expires));
}

/** The session key from the environment, or null when the kitchen isn't configured. */
export function sessionKeyFromEnv(): SessionKey | null {
  const { KITCHEN_SECRET: secret, KITCHEN_PIN: pin } = process.env;
  return secret && pin ? { secret, pin } : null;
}

/** Whether a request carries a valid kitchen session cookie. */
export async function isKitchenSession(token: string | undefined): Promise<boolean> {
  const key = sessionKeyFromEnv();
  return key ? verifySession(key, token) : false;
}
