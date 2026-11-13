import { useState } from "react";
import { Button } from "@/components/ui";

export function ConfirmDelete({
  label = "Delete",
  pending = false,
  onConfirm,
}: {
  label?: string;
  pending?: boolean;
  onConfirm: () => void;
}) {
  const [armed, setArmed] = useState(false);
  if (!armed) {
    return (
      <Button variant="ghost" disabled={pending} onClick={() => setArmed(true)}>
        {label}
      </Button>
    );
  }
  return (
    <span className="inline-flex flex-wrap items-center gap-1">
      <Button variant="quiet" disabled={pending} onClick={onConfirm}>
        {pending ? "Deleting…" : "Confirm delete"}
      </Button>
      <Button variant="ghost" disabled={pending} onClick={() => setArmed(false)}>
        Cancel
      </Button>
    </span>
  );
}
