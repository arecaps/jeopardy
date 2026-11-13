import { C as require_jsx_runtime, b as Link, p as useRouterState } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as clsx } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/studio-DBxoOWkX.js
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function AppHeader() {
	const pathname = useRouterState({ select: (state) => state.location.pathname });
	const boards = pathname === "/";
	const library = pathname.startsWith("/settings") || pathname.startsWith("/category");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
		className: "border-b border-line",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex w-full max-w-5xl items-center justify-between gap-3 px-4 py-3 sm:px-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/",
				className: "font-display text-xl font-medium tracking-tight text-fg",
				children: "Answer First"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
				className: "flex items-center gap-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					className: cn("inline-flex min-h-11 items-center rounded-md px-3 text-sm font-medium", boards ? "bg-fg text-bg" : "text-muted hover:text-fg"),
					"aria-current": boards ? "page" : void 0,
					children: "Boards"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/settings",
					className: cn("inline-flex min-h-11 items-center rounded-md px-3 text-sm font-medium", library ? "bg-fg text-bg" : "text-muted hover:text-fg"),
					"aria-current": library ? "page" : void 0,
					children: "Library"
				})]
			})]
		})
	});
}
function StudioFrame({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-bg text-fg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppHeader, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
			className: "mx-auto w-full max-w-5xl px-4 pt-8 pb-24 sm:px-6 sm:pt-10",
			children
		})]
	});
}
function RouteError({ error }) {
	const message = error instanceof Error && error.message ? error.message : "Something went wrong.";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(StudioFrame, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-3xl font-medium tracking-tight",
			children: "Something went wrong"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-3 max-w-xl text-pretty text-muted",
			children: message
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/",
			className: "mt-6 inline-flex min-h-11 items-center rounded-md bg-fg px-4 text-sm font-medium text-bg",
			children: "Back to boards"
		})
	] });
}
function LoadingLine({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StudioFrame, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-muted",
		children
	}) });
}
//#endregion
export { cn as i, RouteError as n, StudioFrame as r, LoadingLine as t };
