import { createFileRoute } from "@tanstack/react-router";
import { CategoryEditor } from "@/components/category-editor";
import { LoadingLine, RouteError, StudioFrame } from "@/components/studio";
import { getCategory } from "@/lib/jeopardy.functions";

export const Route = createFileRoute("/category/$categoryId")({
  loader: ({ params }) => getCategory({ data: { id: Number(params.categoryId) } }),
  pendingComponent: () => <LoadingLine>Loading category…</LoadingLine>,
  errorComponent: RouteError,
  component: CategoryPage,
});

function CategoryPage() {
  const detail = Route.useLoaderData();
  return (
    <StudioFrame>
      <CategoryEditor key={detail.id} detail={detail} />
    </StudioFrame>
  );
}
