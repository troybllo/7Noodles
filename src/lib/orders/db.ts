import "server-only";
import { attachDatabasePool } from "@vercel/functions";
import { Pool } from "pg";
import { orderEnv } from "./env";

let pool: Pool | undefined;

/**
 * One pooled connection per function instance, as Neon recommends on Vercel:
 * `pg` over the pooled URL, attached so Fluid compute closes idle clients
 * before an instance is suspended.
 */
export function db(): Pool {
  if (!pool) {
    pool = new Pool({ connectionString: orderEnv().DATABASE_URL, max: 5 });
    attachDatabasePool(pool);
  }
  return pool;
}
