import assert from "node:assert/strict";
import test from "node:test";
import { quoteIdent, resolvePgConfig } from "./pg-config.mjs";

test("DATABASE_URL wins over discrete vars", () => {
  const config = resolvePgConfig({
    DATABASE_URL: "postgres://neon/app",
    DB_HOST: "localhost",
    DB_NAME: "jeopardy",
  });
  assert.deepEqual(config, { connectionString: "postgres://neon/app" });
});

test("discrete local vars become a pg config", () => {
  const config = resolvePgConfig({
    DB_HOST: "localhost",
    DB_USERNAME: "postgres",
    DB_PASSWORD: "",
    DB_NAME: "jeopardy",
    DB_PORT: "5434",
  });
  assert.deepEqual(config, {
    host: "localhost",
    port: 5434,
    user: "postgres",
    password: "",
    database: "jeopardy",
  });
});

test("unset env stays on the fallback", () => {
  assert.equal(resolvePgConfig({}), null);
  assert.equal(resolvePgConfig({ DATABASE_URL: "  " }), null);
});

test("quoteIdent rejects unsafe names", () => {
  assert.equal(quoteIdent("jeopardy"), `"jeopardy"`);
  assert.throws(() => quoteIdent("jeopardy;drop"), /unsafe/);
});
