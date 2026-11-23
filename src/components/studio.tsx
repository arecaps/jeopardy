import type { ErrorComponentProps } from "@tanstack/react-router";
import { Link, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function AppHeader() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const boards = pathname === "/";
  const library = pathname.startsWith("/settings") || pathname.startsWith("/category");
  return (
    <header className="border-b border-line">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link to="/" className="font-display text-xl font-medium tracking-tight text-fg">
          Answer First
        </Link>
        <nav className="flex items-center gap-1">
          <Link
            to="/"
            className={cn(
              "inline-flex min-h-11 items-center rounded-md px-3 text-sm font-medium",
              boards ? "bg-fg text-bg" : "text-muted hover:text-fg",
            )}
            aria-current={boards ? "page" : undefined}
          >
            Boards
          </Link>
          <Link
            to="/settings"
            className={cn(
              "inline-flex min-h-11 items-center rounded-md px-3 text-sm font-medium",
              library ? "bg-fg text-bg" : "text-muted hover:text-fg",
            )}
            aria-current={library ? "page" : undefined}
          >
            Settings
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function StudioFrame({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-bg text-fg">
      <AppHeader />
      <main className="mx-auto w-full max-w-5xl px-4 pt-8 pb-24 sm:px-6 sm:pt-10">{children}</main>
    </div>
  );
}

export function RouteError({ error }: ErrorComponentProps) {
  const message = error instanceof Error && error.message ? error.message : "Something went wrong.";
  return (
    <StudioFrame>
      <h1 className="font-display text-3xl font-medium tracking-tight">Something went wrong</h1>
      <p className="mt-3 max-w-xl text-pretty text-muted">{message}</p>
      <Link
        to="/"
        className="mt-6 inline-flex min-h-11 items-center rounded-md bg-fg px-4 text-sm font-medium text-bg"
      >
        Back to boards
      </Link>
    </StudioFrame>
  );
}

export function LoadingLine({ children }: { children: ReactNode }) {
  return (
    <StudioFrame>
      <p className="text-muted">{children}</p>
    </StudioFrame>
  );
}
