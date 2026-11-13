import { Link, useNavigate, useRouter } from "@tanstack/react-router";
import { type FormEvent, useState } from "react";
import { ConfirmDelete } from "@/components/confirm-delete";
import { Button, Input, Label } from "@/components/ui";
import { createGame, deleteGame } from "@/lib/jeopardy.functions";
import { BOARD_COLUMNS, type FinalPrompt, type GameSummary, type LibraryCategory } from "@/lib/jeopardy";
import { cn } from "@/lib/cn";

export function HomeScreen({
  games,
  categories,
  finals,
}: {
  games: GameSummary[];
  categories: LibraryCategory[];
  finals: FinalPrompt[];
}) {
  return (
    <div>
      <p className="text-sm font-medium tracking-wide text-muted uppercase">Host board</p>
      <h1 className="mt-2 max-w-3xl font-display text-4xl font-medium tracking-tight text-balance">
        Answer first. Question second.
      </h1>
      <p className="mt-3 max-w-2xl text-pretty text-muted">
        Six categories across, five values down. Open a square to read the answer, then reveal the
        question. A final round waits when the board is clear.
      </p>

      <section className="mt-10">
        <h2 className="font-display text-2xl font-medium">Boards</h2>
        {games.length === 0 ? (
          <p className="mt-3 text-pretty text-muted">
            No boards yet. Finish six categories in the library, then build one below.
          </p>
        ) : (
          <ul className="mt-4 space-y-3">
            {games.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </ul>
        )}
      </section>

      <section className="mt-12">
        <h2 className="font-display text-2xl font-medium">New board</h2>
        <p className="mt-2 max-w-2xl text-pretty text-sm text-muted">
          A board keeps its own copy of the clues, so later library edits do not change it.
        </p>
        <BoardBuilder categories={categories} finals={finals} />
      </section>
    </div>
  );
}

function GameCard({ game }: { game: GameSummary }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const finalLabel = game.finalPlayed ? "Final done" : "Final not yet";
  return (
    <li className="rounded-xl border border-line bg-surface p-4 sm:p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="font-display text-2xl font-medium">{game.title}</h3>
        <p className="text-sm text-muted">{game.createdLabel}</p>
      </div>
      <p className="mt-2 text-pretty text-muted">{game.categories.join(" · ")}</p>
      <p className="mt-3 text-sm tabular-nums text-fg">
        {game.played} of 30 played · {finalLabel}
      </p>
      <div className="mt-3 h-1 overflow-hidden rounded-full bg-line" aria-hidden>
        <div className="h-full bg-fg" style={{ width: `${Math.round((game.played / 30) * 100)}%` }} />
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-2">
        <Button asChild>
          <Link to="/play/$gameId" params={{ gameId: String(game.id) }}>
            Open board
          </Link>
        </Button>
        <ConfirmDelete
          label="Delete board"
          pending={pending}
          onConfirm={() => {
            setPending(true);
            setError("");
            void deleteGame({ data: { id: game.id } })
              .then(() => router.invalidate())
              .catch((err: unknown) => {
                setError(err instanceof Error ? err.message : "Could not delete that board.");
              })
              .finally(() => setPending(false));
          }}
        />
      </div>
      {error ? <p className="mt-2 text-sm text-fg">{error}</p> : null}
    </li>
  );
}

function BoardBuilder({
  categories,
  finals,
}: {
  categories: LibraryCategory[];
  finals: FinalPrompt[];
}) {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [selected, setSelected] = useState<number[]>([]);
  const [finalId, setFinalId] = useState<number | null>(finals[0]?.id ?? null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const readyCount = categories.filter((category) => category.filled >= 5).length;
  const full = selected.length >= BOARD_COLUMNS;

  function toggle(id: number) {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((item) => item !== id);
      if (prev.length >= BOARD_COLUMNS) return prev;
      return [...prev, id];
    });
  }

  function move(index: number, dir: -1 | 1) {
    setSelected((prev) => {
      const next = [...prev];
      const target = index + dir;
      if (target < 0 || target >= next.length) return prev;
      const current = next[index];
      const swap = next[target];
      if (current === undefined || swap === undefined) return prev;
      next[index] = swap;
      next[target] = current;
      return next;
    });
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!finalId || selected.length !== BOARD_COLUMNS || !title.trim()) return;
    setPending(true);
    setError("");
    try {
      const created = await createGame({
        data: { title: title.trim(), categoryIds: selected, finalId },
      });
      await navigate({ to: "/play/$gameId", params: { gameId: String(created.id) } });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create that board.");
      setPending(false);
    }
  }

  return (
    <form onSubmit={(event) => void onSubmit(event)} className="mt-4 space-y-6">
      <div className="space-y-2">
        <Label htmlFor="board-title">Board name</Label>
        <Input
          id="board-title"
          value={title}
          maxLength={80}
          autoComplete="off"
          placeholder="Friday night"
          onChange={(event) => setTitle(event.target.value)}
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="font-medium">Categories</h3>
          <p className="text-sm tabular-nums text-muted">{selected.length} of 6</p>
        </div>
        {readyCount < 6 ? (
          <p className="text-pretty text-sm text-muted">
            {readyCount} of 6 categories are finished.{" "}
            <Link to="/settings" className="text-fg underline decoration-line underline-offset-4">
              Add clues in the library.
            </Link>
          </p>
        ) : (
          <p className="text-sm text-muted">Pick six. The order is left to right on the board.</p>
        )}
        <div className="grid gap-2 sm:grid-cols-2">
          {categories.map((category) => {
            const on = selected.includes(category.id);
            const ready = category.filled >= 5;
            const disabled = !ready || (full && !on);
            return (
              <button
                key={category.id}
                type="button"
                disabled={disabled}
                aria-pressed={on}
                onClick={() => toggle(category.id)}
                className={cn(
                  "flex min-h-11 items-center justify-between gap-3 rounded-md border px-3 py-2 text-left",
                  on ? "border-fg bg-fg text-bg" : "border-line bg-bg text-fg",
                  !ready && "text-muted",
                )}
              >
                <span className="min-w-0 truncate font-medium">{category.name}</span>
                <span className="shrink-0 text-sm tabular-nums">
                  {on ? "Added" : ready ? "Ready" : `${category.filled}/5`}
                </span>
              </button>
            );
          })}
        </div>
        {selected.length > 0 ? (
          <ol className="space-y-2">
            {selected.map((id, index) => {
              const category = categories.find((item) => item.id === id);
              return (
                <li key={id} className="rounded-lg border border-line bg-bg p-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 text-center text-sm tabular-nums text-muted">{index + 1}</span>
                    <span className="min-w-0 flex-1 truncate">{category?.name ?? "Category"}</span>
                  </div>
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    <Button variant="quiet" disabled={index === 0} onClick={() => move(index, -1)}>
                      Up
                    </Button>
                    <Button
                      variant="quiet"
                      disabled={index === selected.length - 1}
                      onClick={() => move(index, 1)}
                    >
                      Down
                    </Button>
                    <Button variant="ghost" onClick={() => toggle(id)}>
                      Remove
                    </Button>
                  </div>
                </li>
              );
            })}
          </ol>
        ) : null}
      </div>

      <fieldset className="space-y-3">
        <legend className="font-medium">Final round</legend>
        {finals.length === 0 ? (
          <p className="text-pretty text-sm text-muted">
            No final round yet.{" "}
            <Link to="/settings" className="text-fg underline decoration-line underline-offset-4">
              Write one in the library.
            </Link>
          </p>
        ) : (
          <div className="grid gap-2">
            {finals.map((final) => {
              const on = finalId === final.id;
              return (
                <label
                  key={final.id}
                  className={cn(
                    "flex cursor-pointer gap-3 rounded-md border px-3 py-3",
                    on ? "border-fg bg-bg" : "border-line",
                  )}
                >
                  <input
                    type="radio"
                    name="final"
                    className="mt-1"
                    checked={on}
                    onChange={() => setFinalId(final.id)}
                  />
                  <span className="min-w-0">
                    <span className="block font-medium">{final.category}</span>
                    <span className="mt-1 block line-clamp-2 text-sm text-pretty text-muted">{final.answer}</span>
                  </span>
                </label>
              );
            })}
          </div>
        )}
      </fieldset>

      {error ? <p className="text-sm text-fg">{error}</p> : null}
      <Button
        type="submit"
        disabled={pending || !title.trim() || selected.length !== 6 || finalId == null}
      >
        {pending ? "Creating…" : "Create board"}
      </Button>
    </form>
  );
}
