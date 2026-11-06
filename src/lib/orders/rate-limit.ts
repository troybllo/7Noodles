import "server-only";
import { headers } from "next/headers";
import { db } from "./db";

export type Limit = { max: number; windowSeconds: number };

export const LIMITS = {
  /** Orders started from one address. A family ordering twice is fine; a script is not. */
  checkout: { max: 10, windowSeconds: 10 * 60 },
  /** Kitchen PIN attempts from one address, right or wrong. */
  kitchenSignIn: { max: 8, windowSeconds: 15 * 60 },
} satisfies Record<string, Limit>;

/**
 * Counts one hit against `key` and reports whether it is within the limit.
 * One atomic upsert, so parallel requests cannot slip past the count.
 */
export async function hit(key: string, { max, windowSeconds }: Limit): Promise<boolean> {
  const { rows } = await db().query<{ hits: number }>(
    `insert into rate_limits (key, hits, window_started) values ($1, 1, now())
     on conflict (key) do update set
       hits = case when rate_limits.window_started < now() - make_interval(secs => $2)
                   then 1 else rate_limits.hits + 1 end,
       window_started = case when rate_limits.window_started < now() - make_interval(secs => $2)
                             then now() else rate_limits.window_started end
     returning hits`,
    [key, windowSeconds],
  );
  if (Math.random() < 0.01) {
    await db().query(
      "delete from rate_limits where window_started < now() - interval '1 day'",
    );
  }
  return rows[0]!.hits <= max;
}

export async function reset(key: string): Promise<void> {
  await db().query("delete from rate_limits where key = $1", [key]);
}

/** The caller's address, as Vercel reports it. */
export async function clientIp(): Promise<string> {
  const list = await headers();
  return (
    list.get("x-real-ip") ??
    list.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown"
  );
}
