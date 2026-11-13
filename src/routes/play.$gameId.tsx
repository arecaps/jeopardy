import { createFileRoute } from "@tanstack/react-router";
import { PlayScreen } from "@/components/play-screen";
import { LoadingLine, RouteError } from "@/components/studio";
import { getBoard } from "@/lib/jeopardy.functions";

export const Route = createFileRoute("/play/$gameId")({
  loader: ({ params }) => getBoard({ data: { gameId: Number(params.gameId) } }),
  pendingComponent: () => <LoadingLine>Loading the board…</LoadingLine>,
  errorComponent: RouteError,
  component: PlayPage,
});

function PlayPage() {
  const board = Route.useLoaderData();
  return <PlayScreen key={board.id} board={board} />;
}
