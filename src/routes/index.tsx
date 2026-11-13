import { createFileRoute } from "@tanstack/react-router";
import { HomeScreen } from "@/components/home-screen";
import { LoadingLine, RouteError, StudioFrame } from "@/components/studio";
import { listGames, listLibrary } from "@/lib/jeopardy.functions";

export const Route = createFileRoute("/")({
  loader: async () => {
    const [games, library] = await Promise.all([listGames(), listLibrary()]);
    return { games, categories: library.categories, finals: library.finals };
  },
  pendingComponent: () => <LoadingLine>Loading boards…</LoadingLine>,
  errorComponent: RouteError,
  component: HomePage,
});

function HomePage() {
  const data = Route.useLoaderData();
  return (
    <StudioFrame>
      <HomeScreen games={data.games} categories={data.categories} finals={data.finals} />
    </StudioFrame>
  );
}
