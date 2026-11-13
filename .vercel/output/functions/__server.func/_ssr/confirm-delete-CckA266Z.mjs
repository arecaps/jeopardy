import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { C as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { i as cn } from "./studio-DBxoOWkX.mjs";
import { t as Slot } from "../_libs/radix-ui__react-slot.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/confirm-delete-CckA266Z.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var buttonVariants = cva("inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-4 text-sm font-medium transition-opacity duration-150 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fg disabled:pointer-events-none disabled:opacity-40 active:scale-95", {
	variants: { variant: {
		primary: "bg-fg text-bg hover:opacity-90",
		quiet: "border border-line bg-surface text-fg hover:opacity-90",
		ghost: "bg-transparent text-muted hover:text-fg"
	} },
	defaultVariants: { variant: "primary" }
});
function Button({ asChild, className, variant, type, ...props }) {
	if (asChild) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slot, {
		className: cn(buttonVariants({ variant }), className),
		...props
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: type ?? "button",
		className: cn(buttonVariants({ variant }), className),
		...props
	});
}
function Input({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		className: cn("h-11 w-full min-w-0 rounded-md border border-line bg-bg px-3 text-base text-fg placeholder:text-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fg", className),
		...props
	});
}
function Textarea({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		className: cn("min-h-28 w-full min-w-0 rounded-md border border-line bg-bg px-3 py-3 text-base text-fg placeholder:text-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fg", className),
		...props
	});
}
function Label({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
		className: cn("text-sm font-medium text-fg", className),
		...props
	});
}
function ConfirmDelete({ label = "Delete", pending = false, onConfirm }) {
	const [armed, setArmed] = (0, import_react.useState)(false);
	if (!armed) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
		variant: "ghost",
		disabled: pending,
		onClick: () => setArmed(true),
		children: label
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: "inline-flex flex-wrap items-center gap-1",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			variant: "quiet",
			disabled: pending,
			onClick: onConfirm,
			children: pending ? "Deleting…" : "Confirm delete"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			variant: "ghost",
			disabled: pending,
			onClick: () => setArmed(false),
			children: "Cancel"
		})]
	});
}
//#endregion
export { Textarea as a, Label as i, ConfirmDelete as n, Input as r, Button as t };
