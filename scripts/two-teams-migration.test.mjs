import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { PGlite } from "@electric-sql/pglite";

test("two-team migration preserves the first two scores and board progress", async () => {
  const db = new PGlite();
  try {
    const original = await readFile(new URL("../migrations/0002_jeopardy.sql", import.meta.url), "utf8");
    await db.exec(original.split("insert into categories")[0]);
    await db.exec(`
      insert into games (title, final_category, final_answer, final_question, final_played)
      values ('Existing board', 'Category', 'Answer', 'Question', true);
      insert into contestants (game_id, slot, score) values (1, 0, 500), (1, 1, -200), (1, 2, 900);
      insert into played_clues (game_id, position, value) values (1, 0, 100);
    `);
    await db.exec(await readFile(new URL("../migrations/0003_two_teams.sql", import.meta.url), "utf8"));
    assert.deepEqual((await db.query("select slot, score from teams order by slot")).rows, [
      { slot: 0, score: 500 }, { slot: 1, score: -200 },
    ]);
    assert.deepEqual((await db.query("select slot, name from team_names order by slot")).rows, [
      { slot: 0, name: "Team 1" }, { slot: 1, name: "Team 2" },
    ]);
    assert.equal((await db.query("select final_played from games where id = 1")).rows[0].final_played, true);
    assert.equal((await db.query("select * from played_clues")).rows.length, 1);
    await assert.rejects(db.query("insert into teams (game_id, slot, score) values (1, 2, 0)"), /teams_slot_check/);
    await assert.rejects(db.query("update team_names set name = ' ' where slot = 0"), /check constraint/);
  } finally {
    await db.close();
  }
});
