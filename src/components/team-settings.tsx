import { type FormEvent, useState } from "react";
import { useRouter } from "@tanstack/react-router";
import { Button, Input, Label } from "@/components/ui";
import { saveTeamNames } from "@/lib/jeopardy.functions";
import type { TeamNames } from "@/lib/jeopardy";

export function TeamSettings({ names: initialNames }: { names: TeamNames }) {
  const router = useRouter();
  const [names, setNames] = useState(initialNames);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setPending(true);
    setError("");
    setSaved(false);
    try {
      const result = await saveTeamNames({ data: { names } });
      setNames(result.names);
      await router.invalidate();
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save the team names.");
    } finally {
      setPending(false);
    }
  }

  return (
    <section className="mb-12 border-b border-line pb-8" aria-labelledby="teams-heading">
      <h2 id="teams-heading" className="font-display text-2xl font-medium">Teams</h2>
      <p className="mt-2 text-pretty text-muted">Two teams play each board. These names apply to all boards.</p>
      <form onSubmit={(event) => void onSubmit(event)} className="mt-4 max-w-2xl space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          {names.map((name, slot) => (
            <div key={slot} className="space-y-2">
              <Label htmlFor={`team-name-${slot}`}>Team {slot + 1} name</Label>
              <Input
                id={`team-name-${slot}`}
                value={name}
                required
                maxLength={40}
                autoComplete="off"
                disabled={pending}
                onChange={(event) => {
                  const next: TeamNames = [...names];
                  next[slot] = event.target.value;
                  setNames(next);
                  setSaved(false);
                }}
              />
            </div>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button type="submit" disabled={pending}>{pending ? "Saving…" : "Save team names"}</Button>
          {saved ? <p role="status" className="text-sm text-muted">Team names saved.</p> : null}
          {error ? <p role="alert" className="text-sm text-fg">{error}</p> : null}
        </div>
      </form>
    </section>
  );
}
