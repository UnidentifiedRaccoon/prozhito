import { readFileSync } from "node:fs";
import pg from "pg";
export function makePool() {
  const local = process.env.PROZHITO_LOCAL_TEST === "1";
  if (!local && (!process.env.PGHOST || !process.env.PGPASSWORD || !process.env.PGSSLROOTCERT)) throw new Error("Database configuration is incomplete");
  const pool = new pg.Pool({
    host: process.env.PGHOST, port: Number(process.env.PGPORT ?? 6432),
    database: process.env.PGDATABASE ?? "prozhito", user: process.env.PGUSER ?? "prozhito_app",
    password: process.env.PGPASSWORD, max: 3, idleTimeoutMillis: 10000,
    connectionTimeoutMillis: 4000, statement_timeout: 8000, query_timeout: 10000,
    ssl: local ? false : { ca: readFileSync(process.env.PGSSLROOTCERT!,"utf8"), rejectUnauthorized: true },
    application_name: "prozhito-api",
  });
  pool.on("error", () => console.error("database_connection_error"));
  return pool;
}
export async function transaction<T>(pool: pg.Pool, work: (db: pg.PoolClient) => Promise<T>): Promise<T> {
  const db = await pool.connect();
  try { await db.query("BEGIN"); const result = await work(db); await db.query("COMMIT"); return result; }
  catch(error) { await db.query("ROLLBACK").catch(() => {}); throw error; }
  finally { db.release(); }
}
