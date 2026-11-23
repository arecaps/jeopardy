import { createFileRoute } from "@tanstack/react-router";
import { LibraryScreen } from "@/components/library-screen";
import { TeamSettings } from "@/components/team-settings";
import { LoadingLine, RouteError, StudioFrame } from "@/components/studio";
import { getTeamNames, listLibrary } from "@/lib/jeopardy.functions";

export const Route = createFileRoute("/settings")({
  loader: async () => {
    const [library, names] = await Promise.all([listLibrary(), getTeamNames()]);
    return { library, names };
  },
  pendingComponent: () => <LoadingLine>Loading settings…</LoadingLine>,
  errorComponent: RouteError,
  component: SettingsPage,
});

function SettingsPage() {
  const { library, names } = Route.useLoaderData();
  return (
    <StudioFrame>
      <h1 className="mb-6 font-display text-3xl font-medium tracking-tight">Settings</h1>
      <TeamSettings names={names} />
      <LibraryScreen categories={library.categories} finals={library.finals} />
    </StudioFrame>
  );
}
