#!/usr/bin/env node
/**
 * Deploy-time database migrator (node-postgres, `pg`).
 *
 * Runs during `npm run build` and `npm run db:migrate`, applying pending files
 * in ../migrations to Postgres (`DATABASE_URL`, or local `DB_*` from `.env`).
 * Each file is applied in one transaction and recorded in `_migrations`, so it
 * runs once and is safe to re-run. When `DB_NAME` is set and that database does
 * not exist yet, it is created on the server first.
 *
 * The read is non-recursive, so the opt-in auth schema under migrations/auth/
 * is not applied to an app that never asked for sign-in.
 *
 * No Postgres config (local / preview builds) -> skip; the PGLite fallback
 * applies the same files at startup instead (see src/lib/db.ts).
 */
import { readdir, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import pg from "pg";
import { pendingMigrations } from "./migration-plan.mjs";
import { quoteIdent, resolvePgConfig } from "./pg-config.mjs";

const pgConfig = resolvePgConfig();
if (!pgConfig) {
  console.log(
    "[migrate] no Postgres config — set DATABASE_URL or DB_HOST/DB_NAME (the PGLite fallback migrates itself).",
  );
  process.exit(0);
}

const migrationsDir = join(dirname(fileURLToPath(import.meta.url)), "..", "migrations");

async function main() {
  let entries;
  try {
    entries = await readdir(migrationsDir);
  } catch {
    console.log("[migrate] no migrations/ directory — nothing to do.");
    return;
  }
  // An app with no schema of its own must not pay for a database connection.
  if (pendingMigrations(entries, []).length === 0) {
    console.log("[migrate] no migrations — nothing to do.");
    return;
  }

  await ensureDatabase(pgConfig);
  const pool = new pg.Pool({ ...pgConfig, max: 1 });
  const client = await pool.connect();
  try {
    await client.query(
      "CREATE TABLE IF NOT EXISTS _migrations (name TEXT PRIMARY KEY, applied_at TIMESTAMPTZ NOT NULL DEFAULT now())",
    );
    const applied = (await client.query("SELECT name FROM _migrations")).rows.map(
      (r) => r.name,
    );

    let count = 0;
    for (const { name } of pendingMigrations(entries, applied)) {
      const text = await readFile(join(migrationsDir, name), "utf8");
      try {
        await client.query("BEGIN");
        // pg's simple-query protocol runs a whole multi-statement file at once.
        await client.query(text);
        await client.query("INSERT INTO _migrations (name) VALUES ($1)", [name]);
        await client.query("COMMIT");
      } catch (err) {
        console.error(`[migrate] error applying ${name}`);
        try {
          await client.query("ROLLBACK");
        } catch {
          // ROLLBACK fails when the connection died — keep the original error.
        }
        throw err;
      }
      console.log(`[migrate] applied ${name}`);
      count += 1;
    }
    console.log(count ? `[migrate] done — ${count} migration(s) applied.` : "[migrate] up to date.");
  } finally {
    client.release();
    await pool.end();
  }
}

/**
 * Local Docker often has the server up before the app database exists.
 * A URL (`DATABASE_URL`) is assumed to already point at the right database.
 * @param {import("pg").PoolConfig} config
 */
async function ensureDatabase(config) {
  if (config.connectionString || !config.database || config.database === "postgres") return;
  const name = String(config.database);
  const admin = new pg.Client({ ...config, database: "postgres" });
  await admin.connect();
  try {
    const existing = await admin.query("SELECT 1 FROM pg_database WHERE datname = $1", [name]);
    if (existing.rowCount) return;
    await admin.query(`CREATE DATABASE ${quoteIdent(name)}`);
    console.log(`[migrate] created database ${name}`);
  } finally {
    await admin.end();
  }
}

main().catch((err) => {
  console.error("[migrate] failed:", err?.message || err);
  // pg errors carry the context needed to debug a bad SQL file.
  for (const key of ["code", "detail", "hint", "position", "where"]) {
    if (err?.[key] != null) console.error(`[migrate]   ${key}: ${err[key]}`);
  }
  process.exit(1);
});
