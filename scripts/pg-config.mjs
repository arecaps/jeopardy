// @ts-check
/**
 * node-postgres config from the environment.
 *
 * `DATABASE_URL` wins (hosted Postgres / a full URL). Otherwise discrete local
 * vars from `.env`:
 *   DB_HOST, DB_PORT, DB_USERNAME (or DB_USER), DB_PASSWORD, DB_NAME
 *
 * Returns null when neither is set so the app can stay on the embedded PGLite
 * fallback.
 *
 * @param {NodeJS.ProcessEnv} [env]
 * @returns {import("pg").PoolConfig | null}
 */
export function resolvePgConfig(env = process.env) {
  const url = env.DATABASE_URL?.trim();
  if (url) return { connectionString: url };

  const database = (env.DB_NAME || env.DB_DATABASE || "").trim();
  const host = (env.DB_HOST || "").trim();
  const user = (env.DB_USERNAME || env.DB_USER || "").trim();
  const portRaw = (env.DB_PORT || "").trim();
  const passwordSet = env.DB_PASSWORD !== undefined;
  if (!database && !host && !user && !portRaw && !passwordSet) return null;

  const port = portRaw ? Number(portRaw) : 5432;
  if (!Number.isInteger(port) || port <= 0) {
    throw new Error(`DB_PORT must be a positive integer, got ${JSON.stringify(env.DB_PORT)}`);
  }

  return {
    host: host || "localhost",
    port,
    user: user || "postgres",
    // Empty password is valid (trust auth / a local Docker Postgres).
    password: env.DB_PASSWORD ?? "",
    database: database || "postgres",
  };
}

/**
 * Safe identifier for CREATE DATABASE. Refuses anything that is not a plain name.
 * @param {string} name
 */
export function quoteIdent(name) {
  if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(name)) {
    throw new Error(`Refusing unsafe database name: ${JSON.stringify(name)}`);
  }
  return `"${name}"`;
}
