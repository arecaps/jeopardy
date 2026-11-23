import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { markPlayed, resetBoard, setFinalPlayed, setScore } from "@/lib/jeopardy.functions";
import { Button } from "@/components/ui";
import {
  CLUE_VALUES,
  clueKey,
  formatDollars,
  teamLabel,
  type BoardData,
  type ClueValue,
  type TeamScore,
} from "@/lib/jeopardy";
import { cn } from "@/lib/cn";

export function PlayScreen({ board }: { board: BoardData }) {
  const [teams, setTeams] = useState(board.teams);
  const [played, setPlayed] = useState(
    () => new Set(board.played.map((item) => clueKey(item.position, item.value))),
  );
  const [finalPlayed, setFinalPlayedState] = useState(board.final.played);
  const [clue, setClue] = useState<{ position: number; value: ClueValue } | null>(null);
  const [finalStep, setFinalStep] = useState<"category" | "answer" | "question" | null>(null);
  const [finalSession, setFinalSession] = useState(0);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [resetting, setResetting] = useState(false);
  const lock = useRef(false);
  const teamsRef = useRef(teams);
  teamsRef.current = teams;
  const modal = clue !== null || finalStep !== null;

  useEffect(() => {
    if (!modal) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setClue(null);
        setFinalStep(null);
      }
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
    };
  }, [modal]);

  async function commitScore(teamId: number, score: number) {
    if (lock.current) throw new Error("Wait for the last score to save.");
    lock.current = true;
    setBusy(true);
    setError("");
    const nextScore = Math.max(-1_000_000, Math.min(1_000_000, score));
    try {
      const saved = await setScore({
        data: { gameId: board.id, teamId, score: nextScore },
      });
      setTeams((prev) => {
        const next = prev.map((team) =>
          team.id === saved.id ? { ...team, score: saved.score } : team,
        );
        teamsRef.current = next;
        return next;
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update the score.");
      throw err;
    } finally {
      lock.current = false;
      setBusy(false);
    }
  }

  async function bump(teamId: number, delta: number) {
    const current = teamsRef.current.find((team) => team.id === teamId);
    if (!current) return;
    await commitScore(teamId, current.score + delta);
  }

  async function reset() {
    if (lock.current) return;
    lock.current = true;
    setBusy(true);
    setResetting(true);
    setError("");
    try {
      await resetBoard({ data: { gameId: board.id } });
      setPlayed(new Set());
      setFinalPlayedState(false);
      setClue(null);
      setFinalStep(null);
      setFinalSession((session) => session + 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not reset the board.");
    } finally {
      lock.current = false;
      setBusy(false);
      setResetting(false);
    }
  }

  const openClue = clue
    ? board.clues.find((item) => item.position === clue.position && item.value === clue.value)
    : undefined;
  const openCategory = clue
    ? board.categories.find((category) => category.position === clue.position)
    : undefined;

  return (
    <div className="h-dvh overflow-hidden bg-bg text-fg">
      <div className="flex h-full flex-col" inert={modal ? true : undefined}>
        <header className="flex shrink-0 flex-wrap items-center gap-2 px-2 py-1 sm:px-3">
          <Link
            to="/"
            className="inline-flex min-h-11 shrink-0 items-center rounded-md px-2 text-sm text-muted"
          >
            Boards
          </Link>
          <h1 className="order-first w-full min-w-0 truncate text-center font-display text-lg font-medium sm:order-none sm:w-auto sm:flex-1 sm:text-2xl">
            {board.title}
          </h1>
          <Button
            variant="quiet"
            className="ml-auto shrink-0 px-3"
            disabled={busy || (played.size === 0 && !finalPlayed)}
            title="Restore all questions and the final round. Team names and scores stay the same."
            onClick={() => void reset()}
          >
            {resetting ? "Resetting…" : "Reset board"}
          </Button>
          <button
            type="button"
            disabled={resetting}
            onClick={() => setFinalStep(finalPlayed ? "question" : "category")}
            className="inline-flex min-h-11 shrink-0 items-center rounded-md bg-fg px-3 text-sm font-medium text-bg"
          >
            {finalPlayed ? "Final · done" : "Final round"}
          </button>
        </header>
        {error ? <p className="px-3 pb-1 text-center text-sm">{error}</p> : null}
        <div className="grid min-h-0 flex-1 grid-cols-6 grid-rows-6 gap-1 px-1 sm:gap-1.5 sm:px-2">
          {board.categories.map((category) => (
            <div
              key={category.position}
              className="flex min-h-0 min-w-0 items-center justify-center overflow-hidden rounded-sm bg-cell px-1 text-center"
            >
              <span className="line-clamp-4 text-balance text-cat font-display font-medium uppercase leading-tight text-fg sm:tracking-wide">
                {category.name}
              </span>
            </div>
          ))}
          {CLUE_VALUES.map((value) =>
            board.categories.map((category) => {
              const used = played.has(clueKey(category.position, value));
              return (
                <button
                  key={clueKey(category.position, value)}
                  type="button"
                  disabled={used || resetting}
                  onClick={() => setClue({ position: category.position, value })}
                  aria-label={
                    used
                      ? `${category.name} ${formatDollars(value)} already played`
                      : `${category.name} for ${formatDollars(value)}`
                  }
                  className={cn(
                    "min-h-0 min-w-0 rounded-sm text-money font-semibold tabular-nums transition-opacity duration-150",
                    used
                      ? "bg-surface text-transparent"
                      : "bg-cell text-fg hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fg",
                  )}
                >
                  {used ? "" : formatDollars(value)}
                </button>
              );
            }),
          )}
        </div>
        <footer className="score-dock grid shrink-0 grid-cols-2 gap-2 border-t border-line px-2 pt-2">
          {teams.map((team) => (
            <TeamDock
              key={team.id}
              team={team}
              busy={busy}
              onBump={(delta) => void bump(team.id, delta).catch(() => undefined)}
              onCommit={(score) => void commitScore(team.id, score).catch(() => undefined)}
            />
          ))}
        </footer>
      </div>

      {clue && openClue && openCategory ? (
        <ClueOverlay
          categoryName={openCategory.name}
          value={openClue.value}
          answer={openClue.answer}
          question={openClue.question}
          teams={teams}
          busy={busy}
          onAdjust={bump}
          onCancel={() => setClue(null)}
          onDone={async () => {
            await markPlayed({
              data: { gameId: board.id, position: clue.position, value: clue.value },
            });
            setPlayed((prev) => new Set(prev).add(clueKey(clue.position, clue.value)));
            setClue(null);
          }}
        />
      ) : null}

      {finalStep ? (
        <FinalOverlay
          key={finalSession}
          final={board.final}
          step={finalStep}
          reviewing={finalPlayed && finalStep === "question"}
          teams={teams}
          busy={busy}
          onStep={setFinalStep}
          onAdjust={bump}
          onClose={() => setFinalStep(null)}
          onDone={async () => {
            const saved = await setFinalPlayed({ data: { gameId: board.id, played: true } });
            setFinalPlayedState(saved.played);
            setFinalStep(null);
          }}
          onRerun={async () => {
            const saved = await setFinalPlayed({ data: { gameId: board.id, played: false } });
            setFinalPlayedState(saved.played);
            setFinalStep("category");
            setFinalSession((session) => session + 1);
          }}
        />
      ) : null}
    </div>
  );
}

function TeamDock({
  team,
  busy,
  onBump,
  onCommit,
}: {
  team: TeamScore;
  busy: boolean;
  onBump: (delta: number) => void;
  onCommit: (score: number) => void;
}) {
  const label = teamLabel(team.name, team.slot);
  const [text, setText] = useState(String(team.score));
  const [focused, setFocused] = useState(false);
  useEffect(() => {
    if (!focused) setText(String(team.score));
  }, [team.score, focused]);

  return (
    <div className="min-w-0">
      <p className="truncate px-2 py-2 text-base font-medium" title={label}>{label}</p>
      <input
        inputMode="numeric"
        aria-label={`Score for ${label}`}
        disabled={busy}
        value={focused ? text : String(team.score)}
        onFocus={() => {
          setFocused(true);
          setText(String(team.score));
        }}
        onChange={(event) => setText(event.target.value)}
        onBlur={() => {
          setFocused(false);
          const cleaned = text.replace(/[$,\s]/g, "");
          const negative = cleaned.startsWith("-") || cleaned.startsWith("−");
          const digits = cleaned.replace(/[-−]/g, "");
          if (!/^\d+$/.test(digits)) {
            setText(String(team.score));
            return;
          }
          const score = negative ? -Number(digits) : Number(digits);
          if (score !== team.score) onCommit(score);
        }}
        className="mt-1 h-11 w-full rounded-md border border-line bg-bg text-center text-lg font-semibold tabular-nums text-fg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fg"
      />
      <div className="mt-1 grid grid-cols-2 gap-1">
        <button
          type="button"
          disabled={busy}
          onClick={() => onBump(100)}
          aria-label={`Add 100 to ${label}`}
          className="min-h-11 rounded-md bg-surface text-sm font-medium tabular-nums disabled:opacity-40"
        >
          +100
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={() => onBump(-100)}
          aria-label={`Subtract 100 from ${label}`}
          className="min-h-11 rounded-md bg-surface text-sm font-medium tabular-nums disabled:opacity-40"
        >
          −100
        </button>
      </div>
    </div>
  );
}

function ClueOverlay({
  categoryName,
  value,
  answer,
  question,
  teams,
  busy,
  onAdjust,
  onCancel,
  onDone,
}: {
  categoryName: string;
  value: number;
  answer: string;
  question: string;
  teams: TeamScore[];
  busy: boolean;
  onAdjust: (teamId: number, delta: number) => Promise<void>;
  onCancel: () => void;
  onDone: () => Promise<void>;
}) {
  const [revealed, setRevealed] = useState(false);
  const [applied, setApplied] = useState<Record<number, number>>({});
  const [localError, setLocalError] = useState("");
  const [closing, setClosing] = useState(false);

  async function award(teamId: number, delta: number) {
    setLocalError("");
    try {
      await onAdjust(teamId, delta);
      setApplied((prev) => ({ ...prev, [teamId]: (prev[teamId] ?? 0) + delta }));
    } catch {
      setLocalError("Score did not save.");
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="clue-heading"
      className="rise fixed inset-0 z-30 flex flex-col bg-bg text-fg"
    >
      <div className="flex items-center justify-between gap-2 px-2 py-1 sm:px-3">
        <button type="button" onClick={onCancel} className="min-h-11 rounded-md px-2 text-sm text-muted">
          Put back
        </button>
        <p className="min-w-0 truncate text-sm text-muted">{categoryName}</p>
        <button
          type="button"
          disabled={closing}
          onClick={() => {
            setClosing(true);
            void onDone().catch((err: unknown) => {
              setLocalError(err instanceof Error ? err.message : "Could not close that square.");
              setClosing(false);
            });
          }}
          className="inline-flex min-h-11 items-center rounded-md bg-fg px-3 text-sm font-medium text-bg disabled:opacity-40"
        >
          {closing ? "Closing…" : "Done"}
        </button>
      </div>
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center overflow-y-auto px-4 py-6 text-center">
        <p className="font-display text-3xl font-medium tabular-nums sm:text-5xl">{formatDollars(value)}</p>
        <p className="mt-6 text-xs font-medium tracking-widest text-muted uppercase">Answer</p>
        <h2
          id="clue-heading"
          className="mt-3 max-w-4xl text-center font-display text-3xl font-medium whitespace-pre-wrap sm:text-5xl"
        >
          {answer}
        </h2>
        {revealed ? (
          <>
            <p className="mt-8 text-xs font-medium tracking-widest text-muted uppercase">Question</p>
            <p className="mt-3 max-w-4xl text-center font-display text-2xl font-medium whitespace-pre-wrap sm:text-4xl">
              {question}
            </p>
          </>
        ) : (
          <button
            type="button"
            autoFocus
            onClick={() => setRevealed(true)}
            className="mt-8 inline-flex min-h-11 items-center rounded-md bg-fg px-4 text-sm font-medium text-bg"
          >
            Reveal the question
          </button>
        )}
        {localError ? <p className="mt-4 text-sm">{localError}</p> : null}
      </div>
      <div className="score-dock grid grid-cols-2 gap-2 border-t border-line px-2 pt-2">
        {teams.map((team) => {
          const label = teamLabel(team.name, team.slot);
          const marked = applied[team.id];
          return (
            <div key={team.id} className="min-w-0">
              <p className="truncate text-sm font-medium">{label}</p>
              <p className="text-lg font-semibold tabular-nums">{formatDollars(team.score)}</p>
              {marked != null && marked !== 0 ? (
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void award(team.id, -marked)}
                  className="mt-1 min-h-11 w-full rounded-md border border-line text-sm"
                >
                  Undo
                </button>
              ) : (
                <div className="mt-1 grid grid-cols-2 gap-1">
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => void award(team.id, value)}
                    className="flex min-h-14 flex-col items-center justify-center rounded-md bg-fg text-bg disabled:opacity-40"
                  >
                    <span className="text-xs font-medium">Right</span>
                    <span className="text-sm font-semibold tabular-nums">{formatDollars(value)}</span>
                  </button>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => void award(team.id, -value)}
                    className="flex min-h-14 flex-col items-center justify-center rounded-md border border-line disabled:opacity-40"
                  >
                    <span className="text-xs font-medium">Wrong</span>
                    <span className="text-sm font-semibold tabular-nums">{formatDollars(-value)}</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function FinalOverlay({
  final,
  step,
  reviewing,
  teams,
  busy,
  onStep,
  onAdjust,
  onClose,
  onDone,
  onRerun,
}: {
  final: BoardData["final"];
  step: "category" | "answer" | "question";
  reviewing: boolean;
  teams: TeamScore[];
  busy: boolean;
  onStep: (step: "category" | "answer" | "question") => void;
  onAdjust: (teamId: number, delta: number) => Promise<void>;
  onClose: () => void;
  onDone: () => Promise<void>;
  onRerun: () => Promise<void>;
}) {
  const [wagers, setWagers] = useState(["", ""]);
  const [applied, setApplied] = useState<Record<number, number>>({});
  const [localError, setLocalError] = useState("");
  const [closing, setClosing] = useState(false);

  function wagerOf(slot: number) {
    const digits = Number((wagers[slot] ?? "").replace(/[^0-9]/g, ""));
    if (!Number.isFinite(digits)) return 0;
    return Math.min(1_000_000, Math.floor(digits));
  }

  async function award(team: TeamScore, delta: number) {
    setLocalError("");
    try {
      await onAdjust(team.id, delta);
      setApplied((prev) => ({ ...prev, [team.id]: delta }));
    } catch {
      setLocalError("Score did not save.");
    }
  }

  async function undo(team: TeamScore) {
    const marked = applied[team.id];
    if (marked == null) return;
    setLocalError("");
    try {
      await onAdjust(team.id, -marked);
      setApplied((prev) => {
        const next = { ...prev };
        delete next[team.id];
        return next;
      });
    } catch {
      setLocalError("Score did not save.");
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="final-heading"
      className="rise fixed inset-0 z-30 flex flex-col bg-bg text-fg"
    >
      <div className="flex items-center justify-between px-2 py-1 sm:px-3">
        <button type="button" onClick={onClose} className="min-h-11 rounded-md px-2 text-sm text-muted">
          Close
        </button>
        <p className="text-sm text-muted">Final round</p>
        <span className="w-16" />
      </div>
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center overflow-y-auto px-4 py-6 text-center">
        <p className="text-xs font-medium tracking-widest text-muted uppercase">Category</p>
        <h2 id="final-heading" className="mt-3 max-w-4xl font-display text-4xl font-medium text-balance sm:text-6xl">
          {final.category}
        </h2>
        {step !== "category" ? (
          <>
            <p className="mt-8 text-xs font-medium tracking-widest text-muted uppercase">Answer</p>
            <p className="mt-3 max-w-4xl font-display text-2xl font-medium whitespace-pre-wrap sm:text-4xl">
              {final.answer}
            </p>
          </>
        ) : null}
        {step === "question" ? (
          <>
            <p className="mt-8 text-xs font-medium tracking-widest text-muted uppercase">Question</p>
            <p className="mt-3 max-w-4xl font-display text-2xl font-medium whitespace-pre-wrap sm:text-4xl">
              {final.question}
            </p>
          </>
        ) : null}
        {step === "category" ? (
          <button
            type="button"
            autoFocus
            onClick={() => onStep("answer")}
            className="mt-8 inline-flex min-h-11 items-center rounded-md bg-fg px-4 text-sm font-medium text-bg"
          >
            Show the answer
          </button>
        ) : null}
        {step === "answer" ? (
          <>
            <p className="mt-6 max-w-md text-pretty text-sm text-muted">
              Have teams lock a wager before you continue.
            </p>
            <button
              type="button"
              autoFocus
              onClick={() => onStep("question")}
              className="mt-4 inline-flex min-h-11 items-center rounded-md bg-fg px-4 text-sm font-medium text-bg"
            >
              Reveal the question
            </button>
          </>
        ) : null}
        {localError ? <p className="mt-4 text-sm">{localError}</p> : null}
      </div>
      {step === "question" ? (
        <div className="score-dock border-t border-line px-2 pt-2">
          {reviewing ? (
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2">
              <p className="text-sm text-muted">This final round is already marked done.</p>
              <button
                type="button"
                onClick={() => void onRerun().catch(() => setLocalError("Could not reopen the final round."))}
                className="inline-flex min-h-11 items-center rounded-md border border-line px-3 text-sm"
              >
                Run it again
              </button>
            </div>
          ) : (
            <>
              <p className="pb-2 text-sm text-muted">
                Enter each wager, then mark it right or wrong. Scoring again adds to the current total.
              </p>
              <div className="grid grid-cols-2 gap-2">
                {teams.map((team) => {
                  const label = teamLabel(team.name, team.slot);
                  const marked = applied[team.id];
                  return (
                    <div key={team.id} className="min-w-0">
                      <p className="truncate text-sm font-medium">{label}</p>
                      <p className="tabular-nums">{formatDollars(team.score)}</p>
                      <label className="sr-only" htmlFor={`wager-${team.slot}`}>
                        Wager for {label}
                      </label>
                      <input
                        id={`wager-${team.slot}`}
                        inputMode="numeric"
                        placeholder="Wager"
                        value={wagers[team.slot] ?? ""}
                        onChange={(event) =>
                          setWagers((prev) => {
                            const next = [...prev];
                            next[team.slot] = event.target.value;
                            return next;
                          })
                        }
                        className="mt-1 h-11 w-full rounded-md border border-line bg-bg px-2 text-center text-base tabular-nums"
                      />
                      {marked != null ? (
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => void undo(team)}
                          className="mt-1 min-h-11 w-full rounded-md border border-line text-sm"
                        >
                          Undo
                        </button>
                      ) : (
                        <div className="mt-1 grid grid-cols-2 gap-1">
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => void award(team, wagerOf(team.slot))}
                            className="min-h-11 rounded-md bg-fg text-sm font-medium text-bg disabled:opacity-40"
                          >
                            Right
                          </button>
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => void award(team, -wagerOf(team.slot))}
                            className="min-h-11 rounded-md border border-line text-sm disabled:opacity-40"
                          >
                            Wrong
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              <button
                type="button"
                disabled={closing}
                onClick={() => {
                  setClosing(true);
                  void onDone().catch((err: unknown) => {
                    setLocalError(err instanceof Error ? err.message : "Could not finish the final round.");
                    setClosing(false);
                  });
                }}
                className="mt-3 inline-flex min-h-11 items-center rounded-md bg-fg px-4 text-sm font-medium text-bg disabled:opacity-40"
              >
                {closing ? "Saving…" : "Done"}
              </button>
            </>
          )}
        </div>
      ) : null}
    </div>
  );
}
