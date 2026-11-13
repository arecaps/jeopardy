import { Link, useNavigate } from "@tanstack/react-router";
import { type FormEvent, useState } from "react";
import { ConfirmDelete } from "@/components/confirm-delete";
import { Button, Input, Label, Textarea } from "@/components/ui";
import { deleteCategory, saveCategory } from "@/lib/jeopardy.functions";
import { formatDollars, type CategoryDetail, type ClueValue } from "@/lib/jeopardy";

export function CategoryEditor({ detail }: { detail: CategoryDetail }) {
  const navigate = useNavigate();
  const [name, setName] = useState(detail.name);
  const [clues, setClues] = useState(detail.clues);
  const [pending, setPending] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  function update(value: ClueValue, field: "answer" | "question", text: string) {
    setSaved(false);
    setClues((prev) => prev.map((clue) => (clue.value === value ? { ...clue, [field]: text } : clue)));
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
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
          clues: clues.map((clue) => ({
            value: clue.value,
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
      <Link to="/settings" className="text-sm text-muted underline decoration-line underline-offset-4">
        Library
      </Link>
      <h1 className="mt-3 font-display text-3xl font-medium tracking-tight text-balance">Edit category</h1>
      <p className="mt-3 text-pretty text-muted">
        The answer is what the host reads when a square opens. The question is what players must give.
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
      <div className="mt-6 space-y-4">
        {clues.map((clue) => (
          <section key={clue.value} className="rounded-xl border border-line bg-surface p-4">
            <h2 className="font-display text-2xl font-medium tabular-nums">{formatDollars(clue.value)}</h2>
            <div className="mt-3 space-y-2">
              <Label htmlFor={`answer-${clue.value}`}>Answer</Label>
              <Textarea
                id={`answer-${clue.value}`}
                value={clue.answer}
                maxLength={600}
                onChange={(event) => update(clue.value, "answer", event.target.value)}
              />
            </div>
            <div className="mt-3 space-y-2">
              <Label htmlFor={`question-${clue.value}`}>Question</Label>
              <Textarea
                id={`question-${clue.value}`}
                value={clue.question}
                maxLength={600}
                onChange={(event) => update(clue.value, "question", event.target.value)}
              />
            </div>
          </section>
        ))}
      </div>
      {error ? <p className="mt-4 text-sm text-fg">{error}</p> : null}
      {saved ? <p className="mt-4 text-sm text-muted">Saved.</p> : null}
      <div className="mt-6 flex flex-wrap items-center gap-2">
        <Button type="submit" disabled={pending || deleting}>
          {pending ? "Saving…" : "Save category"}
        </Button>
        <ConfirmDelete label="Delete category" pending={deleting} onConfirm={() => void onDelete()} />
      </div>
      <p className="mt-4 text-sm text-pretty text-muted">
        Deleting this category does not change boards you already created.
      </p>
    </form>
  );
}
