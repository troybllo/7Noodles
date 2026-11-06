import "server-only";
import { attachDatabasePool } from "@vercel/functions";
import { Pool } from "pg";
import { orderEnv } from "./env";

let pool: Pool | undefined;

/**
 * A small pool per function instance over Neon's pooled URL, attached so Fluid
 * compute closes idle clients before an instance is suspended. Timeouts make a
 * database outage fail fast instead of hanging checkout and the board.
 */
export function db(): Pool {
  if (!pool) {
    pool = new Pool({
      connectionString: orderEnv().DATABASE_URL,
      max: 5,
      connectionTimeoutMillis: 5_000,
      idleTimeoutMillis: 30_000,
      statement_timeout: 10_000,
    });
    attachDatabasePool(pool);
  }
  return pool;
}
