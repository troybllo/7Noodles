/**
 * Applies db/migrations/*.sql in name order, each once, recording what has
 * run in `schema_migrations`. Uses the direct (unpooled) connection, as
 * schema changes should. Run with `pnpm db:migrate` after `vercel env pull`.
 */

import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import pg from "pg";

const ROOT = join(import.meta.dirname, "..");
const url = process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;
if (!url)
  throw new Error("DATABASE_URL_UNPOOLED is not set — run `vercel env pull` first.");

const client = new pg.Client({ connectionString: url });
await client.connect();
try {
  await client.query(
    "create table if not exists schema_migrations (name text primary key, applied_at timestamptz not null default now())",
  );
  const done = new Set(
    (await client.query("select name from schema_migrations")).rows.map((r) => r.name),
  );
  const files = (await readdir(join(ROOT, "db", "migrations")))
    .filter((f) => f.endsWith(".sql"))
    .sort();
  for (const file of files) {
    if (done.has(file)) continue;
    const sql = await readFile(join(ROOT, "db", "migrations", file), "utf8");
    await client.query("begin");
    try {
      await client.query(sql);
      await client.query("insert into schema_migrations (name) values ($1)", [file]);
      await client.query("commit");
      console.log(`applied ${file}`);
    } catch (error) {
      await client.query("rollback");
      throw error;
    }
  }
  console.log("database up to date");
} finally {
  await client.end();
}
