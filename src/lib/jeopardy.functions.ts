import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getSql } from "@/lib/db";
import {
  CLUE_VALUES,
  type BoardData,
  type CategoryDetail,
  type ClueValue,
  type FinalPrompt,
  type GameSummary,
  type LibraryCategory,
  type TeamNames,
} from "@/lib/jeopardy";

function read<T>(schema: z.ZodType<T>, input: unknown, fallback: string): T {
  const result = schema.safeParse(input);
  if (!result.success) throw new Error(fallback);
  return result.data;
}

const clueValueSchema = z.union([
  z.literal(100),
  z.literal(200),
  z.literal(300),
  z.literal(400),
  z.literal(500),
]);

export const getTeamNames = createServerFn({ method: "GET" }).handler(async (): Promise<TeamNames> => {
  const sql = await getSql();
  const rows = await sql<{ slot: number; name: string }>`select slot, name from team_names order by slot`;
  return [rows[0]?.name ?? "Team 1", rows[1]?.name ?? "Team 2"];
});

export const saveTeamNames = createServerFn({ method: "POST" })
  .validator((input: unknown) =>
    read(
      z.object({ names: z.tuple([z.string().trim().min(1).max(40), z.string().trim().min(1).max(40)]) }),
      input,
      "Give both teams a name, 40 characters or fewer.",
    ),
  )
  .handler(async ({ data }) => {
    const sql = await getSql();
    await sql`
      insert into team_names (slot, name) values (0, ${data.names[0]}), (1, ${data.names[1]})
      on conflict (slot) do update set name = excluded.name
    `;
    return { names: data.names };
  });

export const listGames = createServerFn({ method: "GET" }).handler(async (): Promise<GameSummary[]> => {
  const sql = await getSql();
  const games = await sql<{
    id: number;
    title: string;
    created_label: string;
    played: number;
    final_played: boolean;
  }>`
    select g.id, g.title,
      to_char(g.created_at, 'Mon DD, YYYY') as created_label,
      (select count(*)::int from played_clues p where p.game_id = g.id) as played,
      g.final_played
    from games g
    order by g.id desc
  `;
  const names = await sql<{ game_id: number; position: number; category_name: string }>`
    select game_id, position, min(category_name) as category_name
    from game_clues
    group by game_id, position
    order by position
  `;
  const byGame = new Map<number, string[]>();
  for (const row of names) {
    const list = byGame.get(row.game_id) ?? [];
    list[Number(row.position)] = row.category_name;
    byGame.set(row.game_id, list);
  }
  return games.map((game) => ({
    id: game.id,
    title: game.title,
    createdLabel: game.created_label.replace(/\s+/g, " ").trim(),
    played: Number(game.played),
    finalPlayed: Boolean(game.final_played),
    categories: (byGame.get(game.id) ?? []).filter((name) => Boolean(name)),
  }));
});

export const listLibrary = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ categories: LibraryCategory[]; finals: FinalPrompt[] }> => {
    const sql = await getSql();
    const categories = await sql<{ id: number; name: string; filled: number }>`
      select c.id, c.name,
        coalesce(sum(
          case
            when length(trim(cl.answer)) > 0 and length(trim(cl.question)) > 0 then 1
            else 0
          end
        ), 0)::int as filled
      from categories c
      left join clues cl on cl.category_id = c.id
      group by c.id, c.name
      order by lower(c.name), c.id
    `;
    const finals = await sql<FinalPrompt>`
      select id, category, answer, question
      from finals
      order by id desc
    `;
    return {
      categories: categories.map((category) => ({
        id: category.id,
        name: category.name,
        filled: Number(category.filled),
      })),
      finals,
    };
  },
);

export const getCategory = createServerFn({ method: "GET" })
  .validator((input: unknown) =>
    read(z.object({ id: z.number().int().positive() }), input, "Category not found."),
  )
  .handler(async ({ data }): Promise<CategoryDetail> => {
    const sql = await getSql();
    const cats = await sql<{ id: number; name: string }>`
      select id, name from categories where id = ${data.id}
    `;
    const cat = cats[0];
    if (!cat) throw new Error("That category is gone.");
    const rows = await sql<{ value: number; answer: string; question: string }>`
      select value, answer, question from clues where category_id = ${data.id}
    `;
    return {
      id: cat.id,
      name: cat.name,
      clues: CLUE_VALUES.map((value) => {
        const row = rows.find((clue) => Number(clue.value) === value);
        return { value, answer: row?.answer ?? "", question: row?.question ?? "" };
      }),
    };
  });

export const createCategory = createServerFn({ method: "POST" })
  .validator((input: unknown) =>
    read(
      z.object({ name: z.string().trim().min(1).max(80) }),
      input,
      "Give the category a name, 80 characters or fewer.",
    ),
  )
  .handler(async ({ data }) => {
    const sql = await getSql();
    const rows = await sql<{ id: number }>`
      with c as (
        insert into categories (name) values (${data.name}) returning id
      ),
      ins as (
        insert into clues (category_id, value, answer, question)
        select c.id, v.value, '', ''
        from c
        cross join (values (100), (200), (300), (400), (500)) as v(value)
        returning category_id
      )
      select c.id as id from c where (select count(*) from ins) = 5
    `;
    const id = Number(rows[0]?.id ?? 0);
    if (!id) throw new Error("Could not add that category.");
    return { id };
  });

export const saveCategory = createServerFn({ method: "POST" })
  .validator((input: unknown) =>
    read(
      z.object({
        id: z.number().int().positive(),
        name: z.string().trim().min(1).max(80),
        clues: z
          .array(
            z.object({
              value: clueValueSchema,
              answer: z.string().trim().max(600),
              question: z.string().trim().max(600),
            }),
          )
          .length(5),
      }),
      input,
      "Check the category name and the five clues, then save again.",
    ),
  )
  .handler(async ({ data }) => {
    const byValue = new Map<ClueValue, { answer: string; question: string }>();
    for (const clue of data.clues) byValue.set(clue.value, clue);
    if (byValue.size !== 5) throw new Error("Include every value from 100 to 500.");
    const sql = await getSql();
    const exists = await sql<{ id: number }>`select id from categories where id = ${data.id}`;
    if (!exists[0]) throw new Error("That category is gone.");
    const clue = (value: ClueValue) => byValue.get(value)!;
    await sql`update categories set name = ${data.name} where id = ${data.id}`;
    await sql`
      insert into clues (category_id, value, answer, question) values
        (${data.id}, 100, ${clue(100).answer}, ${clue(100).question}),
        (${data.id}, 200, ${clue(200).answer}, ${clue(200).question}),
        (${data.id}, 300, ${clue(300).answer}, ${clue(300).question}),
        (${data.id}, 400, ${clue(400).answer}, ${clue(400).question}),
        (${data.id}, 500, ${clue(500).answer}, ${clue(500).question})
      on conflict (category_id, value) do update
      set answer = excluded.answer, question = excluded.question
    `;
    return { ok: true as const };
  });

export const deleteCategory = createServerFn({ method: "POST" })
  .validator((input: unknown) =>
    read(z.object({ id: z.number().int().positive() }), input, "Category not found."),
  )
  .handler(async ({ data }) => {
    const sql = await getSql();
    await sql`delete from categories where id = ${data.id}`;
    return { ok: true as const };
  });

const finalFields = {
  category: z.string().trim().min(1).max(80),
  answer: z.string().trim().min(1).max(600),
  question: z.string().trim().min(1).max(600),
};

export const createFinal = createServerFn({ method: "POST" })
  .validator((input: unknown) =>
    read(
      z.object(finalFields),
      input,
      "Add a category, an answer, and a question for the final round.",
    ),
  )
  .handler(async ({ data }) => {
    const sql = await getSql();
    const rows = await sql<{ id: number }>`
      insert into finals (category, answer, question)
      values (${data.category}, ${data.answer}, ${data.question})
      returning id
    `;
    const id = Number(rows[0]?.id ?? 0);
    if (!id) throw new Error("Could not add that final round.");
    return { id };
  });

export const saveFinal = createServerFn({ method: "POST" })
  .validator((input: unknown) =>
    read(
      z.object({ id: z.number().int().positive(), ...finalFields }),
      input,
      "Add a category, an answer, and a question for the final round.",
    ),
  )
  .handler(async ({ data }) => {
    const sql = await getSql();
    const rows = await sql<{ id: number }>`
      update finals
      set category = ${data.category}, answer = ${data.answer}, question = ${data.question}
      where id = ${data.id}
      returning id
    `;
    if (!rows[0]) throw new Error("That final round is gone.");
    return { ok: true as const };
  });

export const deleteFinal = createServerFn({ method: "POST" })
  .validator((input: unknown) =>
    read(z.object({ id: z.number().int().positive() }), input, "Final round not found."),
  )
  .handler(async ({ data }) => {
    const sql = await getSql();
    await sql`delete from finals where id = ${data.id}`;
    return { ok: true as const };
  });

export const createGame = createServerFn({ method: "POST" })
  .validator((input: unknown) =>
    read(
      z.object({
        title: z.string().trim().min(1).max(80),
        categoryIds: z.array(z.number().int().positive()).length(6),
        finalId: z.number().int().positive(),
      }),
      input,
      "Name the board, choose six categories, and choose a final round.",
    ),
  )
  .handler(async ({ data }) => {
    if (new Set(data.categoryIds).size !== 6) {
      throw new Error("Choose six different categories.");
    }
    const sql = await getSql();
    const [a, b, c, d, e, f] = data.categoryIds;
    const cats = await sql<{ id: number; filled: number }>`
      select c.id,
        coalesce(sum(
          case
            when length(trim(cl.answer)) > 0 and length(trim(cl.question)) > 0 then 1
            else 0
          end
        ), 0)::int as filled
      from categories c
      left join clues cl on cl.category_id = c.id
      where c.id in (${a}, ${b}, ${c}, ${d}, ${e}, ${f})
      group by c.id
    `;
    if (cats.length !== 6) throw new Error("One of those categories no longer exists.");
    if (cats.some((cat) => Number(cat.filled) < 5)) {
      throw new Error("Each category needs an answer and a question for every value.");
    }
    const finals = await sql<{ category: string; answer: string; question: string }>`
      select category, answer, question from finals where id = ${data.finalId}
    `;
    const final = finals[0];
    if (!final?.category.trim() || !final.answer.trim() || !final.question.trim()) {
      throw new Error("Choose a finished final round.");
    }
    const ids = data.categoryIds;
    const created = await sql<{ id: number; n: number }>`
      with g as (
        insert into games (title, final_category, final_answer, final_question)
        values (
          ${data.title},
          ${final.category.trim()},
          ${final.answer.trim()},
          ${final.question.trim()}
        )
        returning id
      ),
      src(category_id, position) as (
        values
          (${ids[0]}::int, 0),
          (${ids[1]}::int, 1),
          (${ids[2]}::int, 2),
          (${ids[3]}::int, 3),
          (${ids[4]}::int, 4),
          (${ids[5]}::int, 5)
      ),
      ins as (
        insert into game_clues (game_id, position, category_name, value, answer, question)
        select g.id, src.position, c.name, cl.value, cl.answer, cl.question
        from g
        join src on true
        join categories c on c.id = src.category_id
        join clues cl on cl.category_id = c.id
        where length(trim(cl.answer)) > 0 and length(trim(cl.question)) > 0
        returning game_id
      ),
      teams_inserted as (
        insert into teams (game_id, slot, score)
        select d.game_id, s.slot, 0
        from (select distinct game_id from ins) d
        cross join (values (0), (1)) as s(slot)
        returning game_id
      ),
      counted as (
        select game_id, count(*)::int as n from ins group by game_id
      )
      select g.id as id, coalesce(counted.n, 0)::int as n
      from g
      left join counted on counted.game_id = g.id
      where (select count(*) from teams_inserted) >= 0
    `;
    const id = Number(created[0]?.id ?? 0);
    const n = Number(created[0]?.n ?? 0);
    if (!id || n !== 30) {
      if (id) await sql`delete from games where id = ${id}`;
      throw new Error("Could not copy all thirty clues. Finish every category and try again.");
    }
    return { id };
  });

export const deleteGame = createServerFn({ method: "POST" })
  .validator((input: unknown) =>
    read(z.object({ id: z.number().int().positive() }), input, "Board not found."),
  )
  .handler(async ({ data }) => {
    const sql = await getSql();
    await sql`delete from games where id = ${data.id}`;
    return { ok: true as const };
  });

export const getBoard = createServerFn({ method: "GET" })
  .validator((input: unknown) =>
    read(z.object({ gameId: z.number().int().positive() }), input, "Board not found."),
  )
  .handler(async ({ data }): Promise<BoardData> => {
    const sql = await getSql();
    const games = await sql<{
      id: number;
      title: string;
      final_category: string;
      final_answer: string;
      final_question: string;
      final_played: boolean;
    }>`
      select id, title, final_category, final_answer, final_question, final_played
      from games where id = ${data.gameId}
    `;
    const game = games[0];
    if (!game) throw new Error("That board is gone.");
    const clues = await sql<{
      position: number;
      category_name: string;
      value: number;
      answer: string;
      question: string;
    }>`
      select position, category_name, value, answer, question
      from game_clues
      where game_id = ${data.gameId}
      order by position, value
    `;
    const playedRows = await sql<{ position: number; value: number }>`
      select position, value from played_clues where game_id = ${data.gameId}
    `;
    const teams = await sql<{ id: number; slot: number; name: string; score: number }>`
      select t.id, t.slot, n.name, t.score
      from teams t join team_names n on n.slot = t.slot
      where t.game_id = ${data.gameId} order by t.slot
    `;
    const categories: { position: number; name: string }[] = [];
    for (const clue of clues) {
      const position = Number(clue.position);
      if (!categories.some((category) => category.position === position)) {
        categories.push({ position, name: clue.category_name });
      }
    }
    categories.sort((left, right) => left.position - right.position);
    if (categories.length !== 6 || teams.length !== 2) {
      throw new Error("This board is incomplete.");
    }
    return {
      id: game.id,
      title: game.title,
      categories,
      clues: clues.map((clue) => ({
        position: Number(clue.position),
        value: Number(clue.value),
        answer: clue.answer,
        question: clue.question,
      })),
      played: playedRows.map((row) => ({
        position: Number(row.position),
        value: Number(row.value),
      })),
      teams: teams.map((row) => ({
        id: row.id,
        slot: Number(row.slot),
        name: row.name,
        score: Number(row.score),
      })),
      final: {
        category: game.final_category,
        answer: game.final_answer,
        question: game.final_question,
        played: Boolean(game.final_played),
      },
    };
  });

export const markPlayed = createServerFn({ method: "POST" })
  .validator((input: unknown) =>
    read(
      z.object({
        gameId: z.number().int().positive(),
        position: z.number().int().min(0).max(5),
        value: clueValueSchema,
      }),
      input,
      "That square could not be closed.",
    ),
  )
  .handler(async ({ data }) => {
    const sql = await getSql();
    const games = await sql<{ id: number }>`select id from games where id = ${data.gameId}`;
    if (!games[0]) throw new Error("That board is gone.");
    await sql`
      insert into played_clues (game_id, position, value)
      values (${data.gameId}, ${data.position}, ${data.value})
      on conflict do nothing
    `;
    return { ok: true as const };
  });

export const resetBoard = createServerFn({ method: "POST" })
  .validator((input: unknown) =>
    read(z.object({ gameId: z.number().int().positive() }), input, "Board not found."),
  )
  .handler(async ({ data }) => {
    const sql = await getSql();
    const rows = await sql<{ id: number }>`
      with reset as (
        update games set final_played = false
        where id = ${data.gameId}
        returning id
      ), cleared as (
        delete from played_clues where game_id in (select id from reset)
      )
      select id from reset
    `;
    if (!rows[0]) throw new Error("That board is gone.");
    return { ok: true as const };
  });

export const setFinalPlayed = createServerFn({ method: "POST" })
  .validator((input: unknown) =>
    read(
      z.object({ gameId: z.number().int().positive(), played: z.boolean() }),
      input,
      "Could not update the final round.",
    ),
  )
  .handler(async ({ data }) => {
    const sql = await getSql();
    const rows = await sql<{ final_played: boolean }>`
      update games set final_played = ${data.played}
      where id = ${data.gameId}
      returning final_played
    `;
    if (!rows[0]) throw new Error("That board is gone.");
    return { played: Boolean(rows[0].final_played) };
  });

export const setScore = createServerFn({ method: "POST" })
  .validator((input: unknown) =>
    read(
      z.object({
        gameId: z.number().int().positive(),
        teamId: z.number().int().positive(),
        score: z.number().int().min(-1_000_000).max(1_000_000),
      }),
      input,
      "That score could not be saved.",
    ),
  )
  .handler(async ({ data }) => {
    const sql = await getSql();
    const rows = await sql<{ id: number; slot: number; score: number }>`
      update teams
      set score = ${data.score}
      where id = ${data.teamId} and game_id = ${data.gameId}
      returning id, slot, score
    `;
    const row = rows[0];
    if (!row) throw new Error("That team is not on this board.");
    return { id: row.id, slot: Number(row.slot), score: Number(row.score) };
  });
