import { Link, useNavigate } from "@tanstack/react-router";
import { ChevronDown, ChevronUp, GripVertical } from "lucide-react";
import { type FormEvent, type PointerEvent, useCallback, useEffect, useRef, useState } from "react";
import { ConfirmDelete } from "@/components/confirm-delete";
import { Button, Input, Label, Textarea } from "@/components/ui";
import { cn } from "@/lib/cn";
import { deleteCategory, saveCategory } from "@/lib/jeopardy.functions";
import { CLUE_VALUES, formatDollars, type CategoryDetail, type ClueValue } from "@/lib/jeopardy";

type ClueDrag = {
  handle: HTMLSpanElement;
  pointerId: number;
  from: number;
  x: number;
  y: number;
  moved: boolean;
};

function slotAtPoint(list: HTMLDivElement | null, { x, y, from }: ClueDrag) {
  const card = document.elementFromPoint(x, y)?.closest<HTMLElement>("[data-clue-slot]");
  if (card && card.parentElement === list) return Number(card.dataset.clueSlot);
  if (!list) return null;
  const { left, right, top, bottom } = list.getBoundingClientRect();
  if (x < left || x > right || y < top - 12 || y > bottom + 12) return null;

  // In the gap between two cards, keep the insertion line on the same side.
  const next = Array.from(list.children).findIndex((card) => y < card.getBoundingClientRect().top);
  if (next === -1) return list.children.length - 1;
  return next <= from ? next : next - 1;
}

export function CategoryEditor({ detail }: { detail: CategoryDetail }) {
  const navigate = useNavigate();
  const [name, setName] = useState(detail.name);
  const [clues, setClues] = useState(() =>
    detail.clues.map(({ value, ...clue }) => ({ id: value, ...clue })),
  );
  const [pending, setPending] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [announcement, setAnnouncement] = useState("");
  const [dragging, setDragging] = useState<number | null>(null);
  const [dropSlot, setDropSlot] = useState<number | null>(null);
  const clueList = useRef<HTMLDivElement>(null);
  const drag = useRef<ClueDrag | null>(null);
  const busy = pending || deleting;

  function update(id: ClueValue, field: "answer" | "question", text: string) {
    setSaved(false);
    setClues((prev) => prev.map((clue) => (clue.id === id ? { ...clue, [field]: text } : clue)));
  }

  function moveClue(from: number, to: number) {
    if (busy || drag.current || from === to || to < 0 || to >= clues.length) return;
    setClues((prev) => {
      const reordered = [...prev];
      const [clue] = reordered.splice(from, 1);
      reordered.splice(to, 0, clue);
      return reordered;
    });
    setSaved(false);
    setAnnouncement(
      `${formatDollars(CLUE_VALUES[from])} clue moved to ${formatDollars(CLUE_VALUES[to])}.`,
    );
  }

  function startDrag(event: PointerEvent<HTMLSpanElement>, from: number) {
    if (busy || drag.current || !event.isPrimary || event.button !== 0) return;
    event.preventDefault();
    const { currentTarget: handle, pointerId, clientX: x, clientY: y } = event;
    handle.setPointerCapture(pointerId);
    drag.current = { handle, pointerId, from, x, y, moved: false };
  }

  function trackDrag(event: PointerEvent<HTMLSpanElement>) {
    const active = drag.current;
    if (!active || active.pointerId !== event.pointerId) return;
    if (!active.moved) {
      if (Math.hypot(event.clientX - active.x, event.clientY - active.y) < 5) return;
      active.moved = true;
      setDragging(active.from);
    }
    active.x = event.clientX;
    active.y = event.clientY;
    setDropSlot(slotAtPoint(clueList.current, active));
  }

  const endDrag = useCallback((pointerId: number) => {
    const active = drag.current;
    if (!active || active.pointerId !== pointerId) return;
    drag.current = null;
    setDragging(null);
    setDropSlot(null);
    if (active.handle.hasPointerCapture(pointerId)) {
      active.handle.releasePointerCapture(pointerId);
    }
  }, []);

  function dropClue(event: PointerEvent<HTMLSpanElement>) {
    const active = drag.current;
    if (!active || active.pointerId !== event.pointerId) return;
    const to = active.moved
      ? slotAtPoint(clueList.current, { ...active, x: event.clientX, y: event.clientY })
      : null;
    endDrag(event.pointerId);
    if (to !== null) moveClue(active.from, to);
  }

  useEffect(() => {
    if (dragging === null) return;
    const edgeSize = 64;
    let frame: number;
    function scrollAtEdge() {
      const active = drag.current;
      if (!active) return;
      const { y } = active;
      const top = Math.max(0, edgeSize - y);
      const bottom = Math.max(0, y - (window.innerHeight - edgeSize));
      if (top || bottom) window.scrollBy({ top: (bottom - top) / 3, behavior: "instant" });
      frame = requestAnimationFrame(scrollAtEdge);
    }
    function updateDropSlot() {
      const active = drag.current;
      if (active) setDropSlot(slotAtPoint(clueList.current, active));
    }
    function cancelOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape" && drag.current) endDrag(drag.current.pointerId);
    }
    frame = requestAnimationFrame(scrollAtEdge);
    window.addEventListener("scroll", updateDropSlot);
    window.addEventListener("keydown", cancelOnEscape);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", updateDropSlot);
      window.removeEventListener("keydown", cancelOnEscape);
    };
  }, [dragging, endDrag]);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (busy || drag.current) return;
    if (!name.trim()) {
      setError("Give the category a name.");
      return;
    }
    setPending(true);
    setError("");
    try {
      await saveCategory({
        data: {
          id: detail.id,
          name: name.trim(),
          clues: clues.map((clue, slot) => ({
            value: CLUE_VALUES[slot],
            answer: clue.answer.trim(),
            question: clue.question.trim(),
          })),
        },
      });
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save that category.");
    } finally {
      setPending(false);
    }
  }

  async function onDelete() {
    setDeleting(true);
    setError("");
    try {
      await deleteCategory({ data: { id: detail.id } });
      await navigate({ to: "/settings" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete that category.");
      setDeleting(false);
    }
  }

  return (
    <form onSubmit={(event) => void onSubmit(event)} className="mx-auto max-w-3xl">
      <Link
        to="/settings"
        className="text-sm text-muted underline decoration-line underline-offset-4"
      >
        Library
      </Link>
      <h1 className="mt-3 font-display text-3xl font-medium tracking-tight text-balance">
        Edit category
      </h1>
      <p className="mt-3 text-pretty text-muted">
        The answer is what the host reads when a square opens. The question is what teams must give.
      </p>
      <div className="mt-6 space-y-2">
        <Label htmlFor="category-name">Name</Label>
        <Input
          id="category-name"
          value={name}
          maxLength={80}
          autoComplete="off"
          onChange={(event) => {
            setSaved(false);
            setName(event.target.value);
          }}
        />
      </div>
      <p className="mt-6 text-sm text-muted">
        Drag the grip or use the arrows to reorder clues. Point values follow the order.
      </p>
      <div ref={clueList} className="mt-3 space-y-4">
        {clues.map((clue, slot) => {
          const value = formatDollars(CLUE_VALUES[slot]);
          const isDropTarget = dragging !== null && dropSlot === slot && dragging !== slot;
          return (
            <section
              key={clue.id}
              data-clue-slot={slot}
              className={cn(
                "relative rounded-xl border border-line bg-surface p-4",
                dragging === slot && "opacity-60",
              )}
            >
              {isDropTarget ? (
                <div
                  aria-hidden="true"
                  className={cn(
                    "pointer-events-none absolute inset-x-0 h-1 rounded-full bg-fg",
                    dragging > slot ? "-top-2.5" : "-bottom-2.5",
                  )}
                />
              ) : null}
              <div className="flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className={cn(
                    "flex size-11 shrink-0 touch-none select-none items-center justify-center rounded-md text-muted",
                    !busy && "cursor-grab hover:bg-bg hover:text-fg active:cursor-grabbing",
                  )}
                  onPointerDown={(event) => startDrag(event, slot)}
                  onPointerMove={trackDrag}
                  onPointerUp={dropClue}
                  onPointerCancel={(event) => endDrag(event.pointerId)}
                  onLostPointerCapture={(event) => endDrag(event.pointerId)}
                >
                  <GripVertical size={20} />
                </span>
                <h2 className="font-display text-2xl font-medium tabular-nums">{value}</h2>
                <div className="ml-auto flex">
                  <Button
                    variant="ghost"
                    className="w-11 px-0 aria-disabled:opacity-40"
                    aria-label={`Move ${value} clue up`}
                    aria-disabled={slot === 0}
                    disabled={busy}
                    onClick={() => moveClue(slot, slot - 1)}
                  >
                    <ChevronUp size={20} aria-hidden="true" />
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-11 px-0 aria-disabled:opacity-40"
                    aria-label={`Move ${value} clue down`}
                    aria-disabled={slot === clues.length - 1}
                    disabled={busy}
                    onClick={() => moveClue(slot, slot + 1)}
                  >
                    <ChevronDown size={20} aria-hidden="true" />
                  </Button>
                </div>
              </div>
              <div className="mt-3 space-y-2">
                <Label htmlFor={`answer-${clue.id}`}>Answer</Label>
                <Textarea
                  id={`answer-${clue.id}`}
                  value={clue.answer}
                  maxLength={600}
                  onChange={(event) => update(clue.id, "answer", event.target.value)}
                />
              </div>
              <div className="mt-3 space-y-2">
                <Label htmlFor={`question-${clue.id}`}>Question</Label>
                <Textarea
                  id={`question-${clue.id}`}
                  value={clue.question}
                  maxLength={600}
                  onChange={(event) => update(clue.id, "question", event.target.value)}
                />
              </div>
            </section>
          );
        })}
      </div>
      <p className="sr-only" role="status">
        {announcement}
      </p>
      {error ? <p className="mt-4 text-sm text-fg">{error}</p> : null}
      {saved ? <p className="mt-4 text-sm text-muted">Saved.</p> : null}
      <div className="mt-6 flex flex-wrap items-center gap-2">
        <Button type="submit" disabled={busy || dragging !== null}>
          {pending ? "Saving…" : "Save category"}
        </Button>
        <ConfirmDelete
          label="Delete category"
          pending={deleting}
          onConfirm={() => void onDelete()}
        />
      </div>
      <p className="mt-4 text-sm text-pretty text-muted">
        Deleting this category does not change boards you already created.
      </p>
    </form>
  );
}
