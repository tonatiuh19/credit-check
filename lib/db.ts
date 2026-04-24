import mysql from "mysql2/promise";

let pool: mysql.Pool | null = null;

export function getDb(): mysql.Pool {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT ?? 4000),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl:
        process.env.DB_SSL === "true"
          ? { rejectUnauthorized: true }
          : undefined,
      waitForConnections: true,
      // TiDB Serverless drops idle connections aggressively — keep pool tiny
      connectionLimit: 3,
      queueLimit: 0,
      // Validate connections before use so stale ones are discarded
      enableKeepAlive: true,
      keepAliveInitialDelay: 10000,
    });
  }
  return pool;
}

const RETRYABLE = new Set([
  "ECONNRESET",
  "ECONNREFUSED",
  "EPIPE",
  "PROTOCOL_CONNECTION_LOST",
  "ER_QUERY_INTERRUPTED",
]);

/**
 * Execute a parameterised query with one automatic retry on transient
 * connection errors (ECONNRESET etc.) caused by TiDB Serverless idle drops.
 */
export async function dbQuery<T extends mysql.QueryResult>(
  sql: string,
  values?: unknown[],
): Promise<[T, mysql.FieldPacket[]]> {
  const db = getDb();
  try {
    return await db.query<T>(sql, values);
  } catch (err: any) {
    if (RETRYABLE.has(err.code)) {
      // Pool will open a fresh connection on the retry
      return await db.query<T>(sql, values);
    }
    throw err;
  }
}
