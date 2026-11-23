import { Link, useNavigate, useRouter } from "@tanstack/react-router";
import { type FormEvent, useState } from "react";
import { ConfirmDelete } from "@/components/confirm-delete";
import { Button, Input, Label, Textarea } from "@/components/ui";
import { createCategory, createFinal, deleteFinal, saveFinal } from "@/lib/jeopardy.functions";
import { CLUE_VALUES, type FinalPrompt, type LibraryCategory } from "@/lib/jeopardy";
import { cn } from "@/lib/cn";

export function LibraryScreen({
  categories,
  finals,
}: {
  categories: LibraryCategory[];
  finals: FinalPrompt[];
}) {
  return (
    <div className="grid gap-12 lg:grid-cols-2">
      <section>
        <h2 className="font-display text-3xl font-medium tracking-tight">Library</h2>
        <p className="mt-3 text-pretty text-muted">
          Each category holds five clues, from 100 to 500. On the board, a square shows the answer.
          Teams respond with the question.
        </p>
        <CategoryCreator />
        {categories.length === 0 ? (
          <p className="mt-6 text-muted">No categories yet.</p>
        ) : (
          <ul className="mt-6 space-y-3">
            {categories.map((category) => (
              <li key={category.id}>
                <Link
                  to="/category/$categoryId"
                  params={{ categoryId: String(category.id) }}
                  className="block rounded-xl border border-line bg-surface p-4 transition-opacity duration-150 hover:opacity-90"
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <h2 className="min-w-0 font-display text-xl font-medium">{category.name}</h2>
                    <span className="shrink-0 text-sm tabular-nums text-muted">{category.filled}/5</span>
                  </div>
                  <div className="mt-3 flex gap-1" aria-hidden>
                    {CLUE_VALUES.map((value, index) => (
                      <span
                        key={value}
                        className={cn("h-1 flex-1 rounded-full", index < category.filled ? "bg-fg" : "bg-line")}
                      />
                    ))}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
      <FinalSection finals={finals} />
    </div>
  );
}

function CategoryCreator() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Give the category a name.");
      return;
    }
    setPending(true);
    setError("");
    try {
      const created = await createCategory({ data: { name: trimmed } });
      await navigate({ to: "/category/$categoryId", params: { categoryId: String(created.id) } });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not add that category.");
      setPending(false);
    }
  }

  return (
    <form onSubmit={(event) => void onSubmit(event)} className="mt-6 space-y-3">
      <Label htmlFor="new-category">New category</Label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Input
          id="new-category"
          value={name}
          maxLength={80}
          autoComplete="off"
          placeholder="Category name"
          onChange={(event) => setName(event.target.value)}
        />
        <Button type="submit" disabled={pending}>
          {pending ? "Adding…" : "Add category"}
        </Button>
      </div>
      {error ? <p className="text-sm text-fg">{error}</p> : null}
    </form>
  );
}

function FinalSection({ finals }: { finals: FinalPrompt[] }) {
  const router = useRouter();
  const [category, setCategory] = useState("");
  const [answer, setAnswer] = useState("");
  const [question, setQuestion] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<number | null>(null);
  const [edit, setEdit] = useState({ category: "", answer: "", question: "" });

  async function onCreate(event: FormEvent) {
    event.preventDefault();
    setPending(true);
    setError("");
    try {
      await createFinal({
        data: { category: category.trim(), answer: answer.trim(), question: question.trim() },
      });
      setCategory("");
      setAnswer("");
      setQuestion("");
      await router.invalidate();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not add that final round.");
    } finally {
      setPending(false);
    }
  }

  async function onSave(id: number) {
    setPending(true);
    setError("");
    try {
      await saveFinal({
        data: {
          id,
          category: edit.category.trim(),
          answer: edit.answer.trim(),
          question: edit.question.trim(),
        },
      });
      setEditing(null);
      await router.invalidate();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save that final round.");
    } finally {
      setPending(false);
    }
  }

  async function onDelete(id: number) {
    setPending(true);
    setError("");
    try {
      await deleteFinal({ data: { id } });
      if (editing === id) setEditing(null);
      await router.invalidate();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete that final round.");
    } finally {
      setPending(false);
    }
  }

  return (
    <section>
      <h2 className="font-display text-3xl font-medium tracking-tight">Final round</h2>
      <p className="mt-3 text-pretty text-muted">
        One prompt for the end of the board. Existing boards keep the wording they were created with.
      </p>
      {finals.length === 0 ? <p className="mt-6 text-muted">No final rounds yet.</p> : null}
      <ul className="mt-6 space-y-3">
        {finals.map((final) => (
          <li key={final.id} className="rounded-xl border border-line bg-surface p-4">
            {editing === final.id ? (
              <div className="space-y-3">
                <Label htmlFor={`final-cat-${final.id}`}>Category</Label>
                <Input
                  id={`final-cat-${final.id}`}
                  value={edit.category}
                  maxLength={80}
                  onChange={(event) => setEdit((prev) => ({ ...prev, category: event.target.value }))}
                />
                <Label htmlFor={`final-answer-${final.id}`}>Answer</Label>
                <Textarea
                  id={`final-answer-${final.id}`}
                  value={edit.answer}
                  maxLength={600}
                  onChange={(event) => setEdit((prev) => ({ ...prev, answer: event.target.value }))}
                />
                <Label htmlFor={`final-question-${final.id}`}>Question</Label>
                <Textarea
                  id={`final-question-${final.id}`}
                  value={edit.question}
                  maxLength={600}
                  onChange={(event) => setEdit((prev) => ({ ...prev, question: event.target.value }))}
                />
                <div className="flex flex-wrap gap-2">
                  <Button disabled={pending} onClick={() => void onSave(final.id)}>
                    Save
                  </Button>
                  <Button variant="ghost" disabled={pending} onClick={() => setEditing(null)}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <h3 className="font-display text-xl font-medium">{final.category}</h3>
                <p className="mt-2 text-pretty text-sm text-muted">{final.answer}</p>
                <p className="mt-2 text-pretty text-sm">{final.question}</p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <Button
                    variant="quiet"
                    onClick={() => {
                      setEditing(final.id);
                      setEdit({
                        category: final.category,
                        answer: final.answer,
                        question: final.question,
                      });
                    }}
                  >
                    Edit
                  </Button>
                  <ConfirmDelete pending={pending} onConfirm={() => void onDelete(final.id)} />
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>

      <form onSubmit={(event) => void onCreate(event)} className="mt-6 space-y-3">
        <h3 className="font-medium">Add a final round</h3>
        <Label htmlFor="new-final-category">Category</Label>
        <Input
          id="new-final-category"
          value={category}
          maxLength={80}
          autoComplete="off"
          onChange={(event) => setCategory(event.target.value)}
        />
        <Label htmlFor="new-final-answer">Answer</Label>
        <Textarea
          id="new-final-answer"
          value={answer}
          maxLength={600}
          placeholder="What the host reads"
          onChange={(event) => setAnswer(event.target.value)}
        />
        <Label htmlFor="new-final-question">Question</Label>
        <Textarea
          id="new-final-question"
          value={question}
          maxLength={600}
          placeholder="What is … ?"
          onChange={(event) => setQuestion(event.target.value)}
        />
        {error ? <p className="text-sm text-fg">{error}</p> : null}
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : "Add final round"}
        </Button>
      </form>
    </section>
  );
}
