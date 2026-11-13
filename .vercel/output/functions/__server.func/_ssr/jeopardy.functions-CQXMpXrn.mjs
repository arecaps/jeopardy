import { t as CLUE_VALUES } from "./jeopardy-Bx16hjSG.mjs";
import { n as TSS_SERVER_FUNCTION, t as createServerFn } from "./ssr.mjs";
import { a as object, i as number, n as boolean, o as string, r as literal, s as union, t as array } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/jeopardy.functions-CQXMpXrn.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var _0002_jeopardy_default = "-- Host library and playable boards. A board copies clues at creation time\n-- so later library edits do not change a game already in progress.\n\ncreate table if not exists categories (\n  id serial primary key,\n  name text not null,\n  created_at timestamptz not null default now()\n);\n\ncreate table if not exists clues (\n  id serial primary key,\n  category_id integer not null references categories(id) on delete cascade,\n  value integer not null check (value in (100, 200, 300, 400, 500)),\n  answer text not null default '',\n  question text not null default '',\n  unique (category_id, value)\n);\n\ncreate table if not exists finals (\n  id serial primary key,\n  category text not null,\n  answer text not null,\n  question text not null,\n  created_at timestamptz not null default now()\n);\n\ncreate table if not exists games (\n  id serial primary key,\n  title text not null,\n  final_category text not null,\n  final_answer text not null,\n  final_question text not null,\n  final_played boolean not null default false,\n  created_at timestamptz not null default now()\n);\n\ncreate table if not exists game_clues (\n  game_id integer not null references games(id) on delete cascade,\n  position integer not null check (position between 0 and 5),\n  category_name text not null,\n  value integer not null check (value in (100, 200, 300, 400, 500)),\n  answer text not null,\n  question text not null,\n  primary key (game_id, position, value)\n);\n\ncreate table if not exists played_clues (\n  game_id integer not null references games(id) on delete cascade,\n  position integer not null check (position between 0 and 5),\n  value integer not null check (value in (100, 200, 300, 400, 500)),\n  primary key (game_id, position, value)\n);\n\ncreate table if not exists contestants (\n  id serial primary key,\n  game_id integer not null references games(id) on delete cascade,\n  slot integer not null check (slot between 0 and 2),\n  score integer not null default 0,\n  unique (game_id, slot)\n);\n\ninsert into categories (name) values\n  ('State Capitals'),\n  ('Kitchen Science'),\n  ('Classic Films'),\n  ('Oceans'),\n  ('Word Origins'),\n  ('Numbers');\n\ninsert into clues (category_id, value, answer, question)\nselect c.id, s.value, s.answer, s.question\nfrom (\n  values\n    ('State Capitals', 100, 'This is the capital of Ohio', 'What is Columbus?'),\n    ('State Capitals', 200, 'This Hudson River city is the capital of New York', 'What is Albany?'),\n    ('State Capitals', 300, 'This city, named for a mythic woman, is the capital of Montana', 'What is Helena?'),\n    ('State Capitals', 400, 'This inland city is the capital of Florida', 'What is Tallahassee?'),\n    ('State Capitals', 500, 'This Missouri River city is the capital of South Dakota', 'What is Pierre?'),\n    ('Kitchen Science', 100, 'At sea level, water boils at this Fahrenheit temperature', 'What is 212 degrees?'),\n    ('Kitchen Science', 200, 'Yeast makes dough rise by giving off this gas', 'What is carbon dioxide?'),\n    ('Kitchen Science', 300, 'Browning on a steak comes from sugars meeting these protein building blocks', 'What are amino acids?'),\n    ('Kitchen Science', 400, 'Soft ball and hard crack are stages of cooking sugar on this scale', 'What is the candy stage?'),\n    ('Kitchen Science', 500, 'Mayonnaise stays blended thanks to molecules that cling to both oil and water, called this', 'What is an emulsifier?'),\n    ('Classic Films', 100, 'A Kansas girl dreams in color in this 1939 musical', 'What is The Wizard of Oz?'),\n    ('Classic Films', 200, 'A beach town is menaced by a great white shark in this 1975 film', 'What is Jaws?'),\n    ('Classic Films', 300, 'Letters of transit drive the plot of this 1942 film set in Morocco', 'What is Casablanca?'),\n    ('Classic Films', 400, 'This director made Rear Window and Psycho', 'Who is Alfred Hitchcock?'),\n    ('Classic Films', 500, 'A robot named Maria appears in this 1927 silent film of a future city', 'What is Metropolis?'),\n    ('Oceans', 100, 'This is the largest ocean on Earth', 'What is the Pacific Ocean?'),\n    ('Oceans', 200, 'This warm Atlantic current moderates the climate of western Europe', 'What is the Gulf Stream?'),\n    ('Oceans', 300, 'This Pacific canyon holds the deepest known point in the ocean', 'What is the Mariana Trench?'),\n    ('Oceans', 400, 'These tiny drifters form the base of many marine food webs', 'What is plankton?'),\n    ('Oceans', 500, 'A ring of coral around a lagoon is called this', 'What is an atoll?'),\n    ('Word Origins', 100, 'This word for a yearly event comes from the Latin for year', 'What is annual?'),\n    ('Word Origins', 200, 'This word for a beginner comes from the Latin for new', 'What is novice?'),\n    ('Word Origins', 300, 'This Japanese word meaning empty orchestra names a sing-along pastime', 'What is karaoke?'),\n    ('Word Origins', 400, 'Greek roots for far and sound gave English this communication device', 'What is the telephone?'),\n    ('Word Origins', 500, 'Greek roots for people and writing name this study of populations', 'What is demography?'),\n    ('Numbers', 100, 'There are this many items in a dozen', 'What is 12?'),\n    ('Numbers', 200, 'A hexagon has this many sides', 'What is 6?'),\n    ('Numbers', 300, 'A full circle contains this many degrees', 'What is 360?'),\n    ('Numbers', 400, 'The Roman numeral L stands for this number', 'What is 50?'),\n    ('Numbers', 500, 'This is the only even prime number', 'What is 2?')\n) as s(name, value, answer, question)\njoin categories c on c.name = s.name;\n\ninsert into finals (category, answer, question) values\n  (\n    'Inventions',\n    'In 1876 he spoke the first words heard over a telephone, asking for Mr. Watson',\n    'Who is Alexander Graham Bell?'\n  );\n\ninsert into games (title, final_category, final_answer, final_question)\nselect 'Opening Night', category, answer, question\nfrom finals\nwhere category = 'Inventions'\norder by id\nlimit 1;\n\ninsert into game_clues (game_id, position, category_name, value, answer, question)\nselect g.id, p.position, c.name, cl.value, cl.answer, cl.question\nfrom games g\njoin (\n  values\n    ('State Capitals', 0),\n    ('Kitchen Science', 1),\n    ('Classic Films', 2),\n    ('Oceans', 3),\n    ('Word Origins', 4),\n    ('Numbers', 5)\n) as p(name, position) on true\njoin categories c on c.name = p.name\njoin clues cl on cl.category_id = c.id\nwhere g.title = 'Opening Night';\n\ninsert into contestants (game_id, slot, score)\nselect g.id, s.slot, 0\nfrom games g\ncross join (values (0), (1), (2)) as s(slot)\nwhere g.title = 'Opening Night';\n";
/**
* Migration bookkeeping shared by the two appliers — `scripts/migrate.mjs`
* (deploy, `readdir`) and `src/lib/db.ts` (PGLite preview, `import.meta.glob`).
*
* Applied files are keyed by BASENAME, so the same file applies once no matter
* which directory it is globbed from. That is what makes the auth schema safe to
* copy from `migrations/auth/` into `migrations/` when an app turns sign-in on:
* a database that already has `0001_auth.sql` will not re-run it.
*
* Neither applier descends into subdirectories, so `migrations/auth/*.sql` is
* out of scope for both until it is copied up.
*/
/**
* The `_migrations` key for a migration path (or bare filename).
* @param {string} path
* @returns {string}
*/
function migrationName(path) {
	return path.split("/").pop() ?? path;
}
/**
* @param {string} path
* @returns {boolean}
*/
function isMigrationFile(path) {
	return path.endsWith(".sql");
}
/**
* Migrations in `paths` that are not yet in `applied`, in apply order.
* Non-`.sql` entries (a `readdir` also yields `migrations/auth/`) are dropped.
* @param {Iterable<string>} paths
* @param {Iterable<string>} applied
* @returns {Array<{ name: string, path: string }>}
*/
function pendingMigrations(paths, applied) {
	const done = new Set(applied);
	return [...paths].filter(isMigrationFile).map((path) => ({
		name: migrationName(path),
		path
	})).sort((a, b) => a.name.localeCompare(b.name)).filter(({ name }) => !done.has(name));
}
var rawDatabaseUrl = typeof process !== "undefined" ? process.env.DATABASE_URL : void 0;
var databaseUrl = rawDatabaseUrl && rawDatabaseUrl.trim() ? rawDatabaseUrl : void 0;
/**
* Active backend: real **Neon** when `DATABASE_URL` is set (deployed / configured
* sandbox), otherwise a local embedded **PGLite** (Postgres compiled to WASM) so
* the app has a working database even with nothing configured — the live preview
* included. Swap in Neon later by just setting `DATABASE_URL`; no code changes.
*/
var dbSource = databaseUrl ? "neon" : "pglite";
/**
* Init state lives on globalThis as promises: dev HMR creates new instances of
* this module, and two instances racing module-level state would open a second
* pool or run two concurrent PGLite migration passes (whose duplicate
* `_migrations` insert rejects — and would get memoized, poisoning every later
* `getSql()`). A failed init clears its slot so the next call retries.
*/
var globalRef = globalThis;
/**
* Result-type parity: Postgres sends every value as text plus a type OID — the
* JS value is the DRIVER's parsing choice, and pg and PGLite disagree (pg:
* int8 -> string, date -> local-midnight Date; PGLite: int8 -> BigInt, which
* JSON.stringify rejects, date -> UTC Date). Normalize both so preview and
* production return identical, JSON-safe shapes:
*   int8/bigint (incl. count(*)) -> number (past 2^53 loses precision — cast
*                                   `::text` if you ever need huge integers)
*   date                         -> 'YYYY-MM-DD' string
*   interval                     -> Postgres interval text
* numeric already comes back as a string on both (arbitrary precision).
*/
var OID_INT8 = 20;
var OID_DATE = 1082;
var OID_INTERVAL = 1186;
var identity = (v) => v;
/** Wrap a query runner in the tagged-template + `.query()` `Sql` surface. */
function toSql(run) {
	const sql = (async (strings, ...values) => {
		let text = strings[0];
		for (let i = 0; i < values.length; i += 1) text += `$${i + 1}${strings[i + 1]}`;
		return run(text, values);
	});
	sql.query = (text, params = []) => run(text, params);
	return sql;
}
function createNeonSql() {
	globalRef.__pgSqlPromise__ ??= (async () => {
		const { Pool, types } = await import("../_libs/pg.mjs").then((n) => n.t);
		types.setTypeParser(OID_INT8, Number);
		types.setTypeParser(OID_DATE, identity);
		types.setTypeParser(OID_INTERVAL, identity);
		const pool = new Pool({ connectionString: databaseUrl });
		return toSql(async (text, params) => {
			return (await pool.query(text, params)).rows;
		});
	})().catch((err) => {
		globalRef.__pgSqlPromise__ = void 0;
		throw err;
	});
	return globalRef.__pgSqlPromise__;
}
async function createPgliteSql() {
	globalRef.__pgliteInstance__ ??= (async () => {
		const { PGlite } = await import("../_libs/electric-sql__pglite.mjs").then((n) => n.t);
		const pg = new PGlite({ parsers: {
			[OID_INT8]: Number,
			[OID_DATE]: identity,
			[OID_INTERVAL]: identity
		} });
		await pg.waitReady;
		await pg.exec("create table if not exists _migrations (name text primary key, applied_at timestamptz not null default now())");
		return pg;
	})().catch((err) => {
		globalRef.__pgliteInstance__ = void 0;
		throw err;
	});
	const pg = await globalRef.__pgliteInstance__;
	const migrate = async () => {
		const migrations = /* #__PURE__ */ Object.assign({ "/migrations/0002_jeopardy.sql": _0002_jeopardy_default });
		const done = (await pg.query("select name from _migrations")).rows.map((r) => r.name);
		for (const { name, path } of pendingMigrations(Object.keys(migrations), done)) await pg.transaction(async (tx) => {
			await tx.exec(migrations[path]);
			await tx.query("insert into _migrations (name) values ($1)", [name]);
		});
	};
	const pass = (globalRef.__pgliteMigrateChain__ ?? Promise.resolve()).catch(() => void 0).then(migrate);
	globalRef.__pgliteMigrateChain__ = pass;
	await pass;
	return toSql(async (text, params) => {
		return (await pg.query(text, params)).rows;
	});
}
var sqlPromise = null;
async function createSql() {
	if (typeof window !== "undefined") throw new Error("@/lib/db is server-only — call getSql() from a createServerFn handler or a server route loader, never from client code.");
	return dbSource === "neon" ? createNeonSql() : createPgliteSql();
}
/**
* Get the shared, **server-only** SQL client. Neon when `DATABASE_URL` is set,
* otherwise the local PGLite fallback. Memoized — safe to call per request.
*
* Schema comes from `migrations/*.sql`, auto-applied before the first query on
* both backends — define tables there, never inline in server functions.
*/
function getSql() {
	sqlPromise ??= createSql().catch((err) => {
		sqlPromise = null;
		throw err;
	});
	return sqlPromise;
}
/**
* Finish DB bootstrap before the server handles traffic.
*
* - **PGLite** (preview / no `DATABASE_URL`): open the in-memory DB and apply
*   `migrations/*.sql`. Idempotent — concurrent callers share one promise.
* - **Neon**: no-op (pool is created lazily on first query).
*
* Vite `configureServer` awaits this at dev startup; production imports of this
* module kick it off immediately (see bottom of file).
*/
function ensureDbReady() {
	if (dbSource !== "pglite") return Promise.resolve();
	return getSql().then(() => void 0);
}
var globalBoot = globalThis;
if (typeof window === "undefined" && dbSource === "pglite") globalBoot.__pgBootstrapPromise__ ??= ensureDbReady().catch((err) => {
	globalBoot.__pgBootstrapPromise__ = void 0;
	console.error("[db] PGLite bootstrap failed:", err);
	throw err;
});
function read(schema, input, fallback) {
	const result = schema.safeParse(input);
	if (!result.success) throw new Error(fallback);
	return result.data;
}
var clueValueSchema = union([
	literal(100),
	literal(200),
	literal(300),
	literal(400),
	literal(500)
]);
var listGames_createServerFn_handler = createServerRpc({
	id: "a4a357ef88a75168b0d2654f814889bd9bdb32ff542591f4a4faabc63a89d9d3",
	name: "listGames",
	filename: "src/lib/jeopardy.functions.ts"
}, (opts) => listGames.__executeServer(opts));
var listGames = createServerFn({ method: "GET" }).handler(listGames_createServerFn_handler, async () => {
	const sql = await getSql();
	const games = await sql`
    select g.id, g.title,
      to_char(g.created_at, 'Mon DD, YYYY') as created_label,
      (select count(*)::int from played_clues p where p.game_id = g.id) as played,
      g.final_played
    from games g
    order by g.id desc
  `;
	const names = await sql`
    select game_id, position, min(category_name) as category_name
    from game_clues
    group by game_id, position
    order by position
  `;
	const byGame = /* @__PURE__ */ new Map();
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
		categories: (byGame.get(game.id) ?? []).filter((name) => Boolean(name))
	}));
});
var listLibrary_createServerFn_handler = createServerRpc({
	id: "1904af2c16676ee8054e94d7d9639d4324ba2c112c8ff2ce46ae8df061c0bb0f",
	name: "listLibrary",
	filename: "src/lib/jeopardy.functions.ts"
}, (opts) => listLibrary.__executeServer(opts));
var listLibrary = createServerFn({ method: "GET" }).handler(listLibrary_createServerFn_handler, async () => {
	const sql = await getSql();
	const categories = await sql`
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
	const finals = await sql`
      select id, category, answer, question
      from finals
      order by id desc
    `;
	return {
		categories: categories.map((category) => ({
			id: category.id,
			name: category.name,
			filled: Number(category.filled)
		})),
		finals
	};
});
var getCategory_createServerFn_handler = createServerRpc({
	id: "a14e8b192ec921e63111c29b587f33d6a3882c47abfc3879fd5b62efb56d4848",
	name: "getCategory",
	filename: "src/lib/jeopardy.functions.ts"
}, (opts) => getCategory.__executeServer(opts));
var getCategory = createServerFn({ method: "GET" }).validator((input) => read(object({ id: number().int().positive() }), input, "Category not found.")).handler(getCategory_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const cat = (await sql`
      select id, name from categories where id = ${data.id}
    `)[0];
	if (!cat) throw new Error("That category is gone.");
	const rows = await sql`
      select value, answer, question from clues where category_id = ${data.id}
    `;
	return {
		id: cat.id,
		name: cat.name,
		clues: CLUE_VALUES.map((value) => {
			const row = rows.find((clue) => Number(clue.value) === value);
			return {
				value,
				answer: row?.answer ?? "",
				question: row?.question ?? ""
			};
		})
	};
});
var createCategory_createServerFn_handler = createServerRpc({
	id: "668e1be16a4bc84e71baf66b7796d3ae861278c03a31b4b414f487239bd45603",
	name: "createCategory",
	filename: "src/lib/jeopardy.functions.ts"
}, (opts) => createCategory.__executeServer(opts));
var createCategory = createServerFn({ method: "POST" }).validator((input) => read(object({ name: string().trim().min(1).max(80) }), input, "Give the category a name, 80 characters or fewer.")).handler(createCategory_createServerFn_handler, async ({ data }) => {
	const rows = await (await getSql())`
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
var saveCategory_createServerFn_handler = createServerRpc({
	id: "210aad2b6d076480a048db704dd4e1d3ed3c1174063e8e4548086cb63e719823",
	name: "saveCategory",
	filename: "src/lib/jeopardy.functions.ts"
}, (opts) => saveCategory.__executeServer(opts));
var saveCategory = createServerFn({ method: "POST" }).validator((input) => read(object({
	id: number().int().positive(),
	name: string().trim().min(1).max(80),
	clues: array(object({
		value: clueValueSchema,
		answer: string().trim().max(600),
		question: string().trim().max(600)
	})).length(5)
}), input, "Check the category name and the five clues, then save again.")).handler(saveCategory_createServerFn_handler, async ({ data }) => {
	const byValue = /* @__PURE__ */ new Map();
	for (const clue of data.clues) byValue.set(clue.value, clue);
	if (byValue.size !== 5) throw new Error("Include every value from 100 to 500.");
	const sql = await getSql();
	if (!(await sql`select id from categories where id = ${data.id}`)[0]) throw new Error("That category is gone.");
	const clue = (value) => byValue.get(value);
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
	return { ok: true };
});
var deleteCategory_createServerFn_handler = createServerRpc({
	id: "2e6d9533793176cb2d002fccb632a674eb9d3ef778d99e2fb1890c4a7a3d74a9",
	name: "deleteCategory",
	filename: "src/lib/jeopardy.functions.ts"
}, (opts) => deleteCategory.__executeServer(opts));
var deleteCategory = createServerFn({ method: "POST" }).validator((input) => read(object({ id: number().int().positive() }), input, "Category not found.")).handler(deleteCategory_createServerFn_handler, async ({ data }) => {
	await (await getSql())`delete from categories where id = ${data.id}`;
	return { ok: true };
});
var finalFields = {
	category: string().trim().min(1).max(80),
	answer: string().trim().min(1).max(600),
	question: string().trim().min(1).max(600)
};
var createFinal_createServerFn_handler = createServerRpc({
	id: "84b668ed8d26eb723d0892d20699797c56c71bc6269859e17a665fdae66065eb",
	name: "createFinal",
	filename: "src/lib/jeopardy.functions.ts"
}, (opts) => createFinal.__executeServer(opts));
var createFinal = createServerFn({ method: "POST" }).validator((input) => read(object(finalFields), input, "Add a category, an answer, and a question for the final round.")).handler(createFinal_createServerFn_handler, async ({ data }) => {
	const rows = await (await getSql())`
      insert into finals (category, answer, question)
      values (${data.category}, ${data.answer}, ${data.question})
      returning id
    `;
	const id = Number(rows[0]?.id ?? 0);
	if (!id) throw new Error("Could not add that final round.");
	return { id };
});
var saveFinal_createServerFn_handler = createServerRpc({
	id: "a83831a14f2d439eb292a9aea0736aee3fc873708bde735c2d95471ce402cd10",
	name: "saveFinal",
	filename: "src/lib/jeopardy.functions.ts"
}, (opts) => saveFinal.__executeServer(opts));
var saveFinal = createServerFn({ method: "POST" }).validator((input) => read(object({
	id: number().int().positive(),
	...finalFields
}), input, "Add a category, an answer, and a question for the final round.")).handler(saveFinal_createServerFn_handler, async ({ data }) => {
	if (!(await (await getSql())`
      update finals
      set category = ${data.category}, answer = ${data.answer}, question = ${data.question}
      where id = ${data.id}
      returning id
    `)[0]) throw new Error("That final round is gone.");
	return { ok: true };
});
var deleteFinal_createServerFn_handler = createServerRpc({
	id: "c5a7094508a868523408460d7642bcb7e2b01464244b17ab843c18d1d62851d2",
	name: "deleteFinal",
	filename: "src/lib/jeopardy.functions.ts"
}, (opts) => deleteFinal.__executeServer(opts));
var deleteFinal = createServerFn({ method: "POST" }).validator((input) => read(object({ id: number().int().positive() }), input, "Final round not found.")).handler(deleteFinal_createServerFn_handler, async ({ data }) => {
	await (await getSql())`delete from finals where id = ${data.id}`;
	return { ok: true };
});
var createGame_createServerFn_handler = createServerRpc({
	id: "8075f6e725bc97820dcb915e45ab3b74ddc7c2e48410b84219e12c358a035aea",
	name: "createGame",
	filename: "src/lib/jeopardy.functions.ts"
}, (opts) => createGame.__executeServer(opts));
var createGame = createServerFn({ method: "POST" }).validator((input) => read(object({
	title: string().trim().min(1).max(80),
	categoryIds: array(number().int().positive()).length(6),
	finalId: number().int().positive()
}), input, "Name the board, choose six categories, and choose a final round.")).handler(createGame_createServerFn_handler, async ({ data }) => {
	if (new Set(data.categoryIds).size !== 6) throw new Error("Choose six different categories.");
	const sql = await getSql();
	const [a, b, c, d, e, f] = data.categoryIds;
	const cats = await sql`
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
	if (cats.some((cat) => Number(cat.filled) < 5)) throw new Error("Each category needs an answer and a question for every value.");
	const final = (await sql`
      select category, answer, question from finals where id = ${data.finalId}
    `)[0];
	if (!final?.category.trim() || !final.answer.trim() || !final.question.trim()) throw new Error("Choose a finished final round.");
	const ids = data.categoryIds;
	const created = await sql`
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
      players as (
        insert into contestants (game_id, slot, score)
        select d.game_id, s.slot, 0
        from (select distinct game_id from ins) d
        cross join (values (0), (1), (2)) as s(slot)
        returning game_id
      ),
      counted as (
        select game_id, count(*)::int as n from ins group by game_id
      )
      select g.id as id, coalesce(counted.n, 0)::int as n
      from g
      left join counted on counted.game_id = g.id
      where (select count(*) from players) >= 0
    `;
	const id = Number(created[0]?.id ?? 0);
	const n = Number(created[0]?.n ?? 0);
	if (!id || n !== 30) {
		if (id) await sql`delete from games where id = ${id}`;
		throw new Error("Could not copy all thirty clues. Finish every category and try again.");
	}
	return { id };
});
var deleteGame_createServerFn_handler = createServerRpc({
	id: "c54a98034d7073b7513138e7704aeb2e277ea5636f9e5e7d5c0270a7edc8c2e7",
	name: "deleteGame",
	filename: "src/lib/jeopardy.functions.ts"
}, (opts) => deleteGame.__executeServer(opts));
var deleteGame = createServerFn({ method: "POST" }).validator((input) => read(object({ id: number().int().positive() }), input, "Board not found.")).handler(deleteGame_createServerFn_handler, async ({ data }) => {
	await (await getSql())`delete from games where id = ${data.id}`;
	return { ok: true };
});
var getBoard_createServerFn_handler = createServerRpc({
	id: "d05983d69668f6ad008a1882f61d4ba5cd0f5685deb2dd1639a14b1414e9227b",
	name: "getBoard",
	filename: "src/lib/jeopardy.functions.ts"
}, (opts) => getBoard.__executeServer(opts));
var getBoard = createServerFn({ method: "GET" }).validator((input) => read(object({ gameId: number().int().positive() }), input, "Board not found.")).handler(getBoard_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const game = (await sql`
      select id, title, final_category, final_answer, final_question, final_played
      from games where id = ${data.gameId}
    `)[0];
	if (!game) throw new Error("That board is gone.");
	const clues = await sql`
      select position, category_name, value, answer, question
      from game_clues
      where game_id = ${data.gameId}
      order by position, value
    `;
	const playedRows = await sql`
      select position, value from played_clues where game_id = ${data.gameId}
    `;
	const contestants = await sql`
      select id, slot, score from contestants where game_id = ${data.gameId} order by slot
    `;
	const categories = [];
	for (const clue of clues) {
		const position = Number(clue.position);
		if (!categories.some((category) => category.position === position)) categories.push({
			position,
			name: clue.category_name
		});
	}
	categories.sort((left, right) => left.position - right.position);
	if (categories.length !== 6 || contestants.length !== 3) throw new Error("This board is incomplete.");
	return {
		id: game.id,
		title: game.title,
		categories,
		clues: clues.map((clue) => ({
			position: Number(clue.position),
			value: Number(clue.value),
			answer: clue.answer,
			question: clue.question
		})),
		played: playedRows.map((row) => ({
			position: Number(row.position),
			value: Number(row.value)
		})),
		contestants: contestants.map((row) => ({
			id: row.id,
			slot: Number(row.slot),
			score: Number(row.score)
		})),
		final: {
			category: game.final_category,
			answer: game.final_answer,
			question: game.final_question,
			played: Boolean(game.final_played)
		}
	};
});
var markPlayed_createServerFn_handler = createServerRpc({
	id: "2e775aa6273f847e66f6daf9c1baf5873992783cd91ca6dd0285efdb507ca433",
	name: "markPlayed",
	filename: "src/lib/jeopardy.functions.ts"
}, (opts) => markPlayed.__executeServer(opts));
var markPlayed = createServerFn({ method: "POST" }).validator((input) => read(object({
	gameId: number().int().positive(),
	position: number().int().min(0).max(5),
	value: clueValueSchema
}), input, "That square could not be closed.")).handler(markPlayed_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	if (!(await sql`select id from games where id = ${data.gameId}`)[0]) throw new Error("That board is gone.");
	await sql`
      insert into played_clues (game_id, position, value)
      values (${data.gameId}, ${data.position}, ${data.value})
      on conflict do nothing
    `;
	return { ok: true };
});
var setFinalPlayed_createServerFn_handler = createServerRpc({
	id: "27146770692c9ad077a1ab712a0543bf3b220161075241d22a72cc8f6307888c",
	name: "setFinalPlayed",
	filename: "src/lib/jeopardy.functions.ts"
}, (opts) => setFinalPlayed.__executeServer(opts));
var setFinalPlayed = createServerFn({ method: "POST" }).validator((input) => read(object({
	gameId: number().int().positive(),
	played: boolean()
}), input, "Could not update the final round.")).handler(setFinalPlayed_createServerFn_handler, async ({ data }) => {
	const rows = await (await getSql())`
      update games set final_played = ${data.played}
      where id = ${data.gameId}
      returning final_played
    `;
	if (!rows[0]) throw new Error("That board is gone.");
	return { played: Boolean(rows[0].final_played) };
});
var setScore_createServerFn_handler = createServerRpc({
	id: "00c6393f7f12f4aafb4f92fdd3da95ae2e89abe051ad0c359076f6e6fe925237",
	name: "setScore",
	filename: "src/lib/jeopardy.functions.ts"
}, (opts) => setScore.__executeServer(opts));
var setScore = createServerFn({ method: "POST" }).validator((input) => read(object({
	gameId: number().int().positive(),
	contestantId: number().int().positive(),
	score: number().int().min(-1e6).max(1e6)
}), input, "That score could not be saved.")).handler(setScore_createServerFn_handler, async ({ data }) => {
	const row = (await (await getSql())`
      update contestants
      set score = ${data.score}
      where id = ${data.contestantId} and game_id = ${data.gameId}
      returning id, slot, score
    `)[0];
	if (!row) throw new Error("That player is not on this board.");
	return {
		id: row.id,
		slot: Number(row.slot),
		score: Number(row.score)
	};
});
//#endregion
export { createCategory_createServerFn_handler, createFinal_createServerFn_handler, createGame_createServerFn_handler, deleteCategory_createServerFn_handler, deleteFinal_createServerFn_handler, deleteGame_createServerFn_handler, getBoard_createServerFn_handler, getCategory_createServerFn_handler, listGames_createServerFn_handler, listLibrary_createServerFn_handler, markPlayed_createServerFn_handler, saveCategory_createServerFn_handler, saveFinal_createServerFn_handler, setFinalPlayed_createServerFn_handler, setScore_createServerFn_handler };
