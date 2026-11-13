import { createFileRoute } from "@tanstack/react-router";
import { LibraryScreen } from "@/components/library-screen";
import { LoadingLine, RouteError, StudioFrame } from "@/components/studio";
import { listLibrary } from "@/lib/jeopardy.functions";

export const Route = createFileRoute("/settings")({
  loader: () => listLibrary(),
  pendingComponent: () => <LoadingLine>Loading the library…</LoadingLine>,
  errorComponent: RouteError,
  component: SettingsPage,
});

function SettingsPage() {
  const library = Route.useLoaderData();
  return (
    <StudioFrame>
      <LibraryScreen categories={library.categories} finals={library.finals} />
    </StudioFrame>
  );
}
