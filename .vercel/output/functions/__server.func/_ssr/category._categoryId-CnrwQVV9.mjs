import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { C as require_jsx_runtime, b as Link, x as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as StudioFrame } from "./studio-DBxoOWkX.mjs";
import { r as formatDollars } from "./jeopardy-Bx16hjSG.mjs";
import { l as deleteCategory, p as saveCategory, r as Route$1 } from "./router-BK5H8eFB.mjs";
import { a as Textarea, i as Label, n as ConfirmDelete, r as Input, t as Button } from "./confirm-delete-CckA266Z.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/category._categoryId-CnrwQVV9.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CategoryEditor({ detail }) {
	const navigate = useNavigate();
	const [name, setName] = (0, import_react.useState)(detail.name);
	const [clues, setClues] = (0, import_react.useState)(detail.clues);
	const [pending, setPending] = (0, import_react.useState)(false);
	const [deleting, setDeleting] = (0, import_react.useState)(false);
	const [saved, setSaved] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)("");
	function update(value, field, text) {
		setSaved(false);
		setClues((prev) => prev.map((clue) => clue.value === value ? {
			...clue,
			[field]: text
		} : clue));
	}
	async function onSubmit(event) {
		event.preventDefault();
		if (!name.trim()) {
			setError("Give the category a name.");
			return;
		}
		setPending(true);
		setError("");
		try {
			await saveCategory({ data: {
				id: detail.id,
				name: name.trim(),
				clues: clues.map((clue) => ({
					value: clue.value,
					answer: clue.answer.trim(),
					question: clue.question.trim()
				}))
			} });
			setSaved(true);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Could not save that category.");
		} finally {
			setPending(false);
		}
	}
	async function onDelete() {
		setDeleting(true);
		setError("");
		try {
			await deleteCategory({ data: { id: detail.id } });
			await navigate({ to: "/settings" });
		} catch (err) {
			setError(err instanceof Error ? err.message : "Could not delete that category.");
			setDeleting(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		onSubmit: (event) => void onSubmit(event),
		className: "mx-auto max-w-3xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/settings",
				className: "text-sm text-muted underline decoration-line underline-offset-4",
				children: "Library"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-3 font-display text-3xl font-medium tracking-tight text-balance",
				children: "Edit category"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-pretty text-muted",
				children: "The answer is what the host reads when a square opens. The question is what players must give."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 space-y-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					htmlFor: "category-name",
					children: "Name"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					id: "category-name",
					value: name,
					maxLength: 80,
					autoComplete: "off",
					onChange: (event) => {
						setSaved(false);
						setName(event.target.value);
					}
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6 space-y-4",
				children: clues.map((clue) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "rounded-xl border border-line bg-surface p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-2xl font-medium tabular-nums",
							children: formatDollars(clue.value)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: `answer-${clue.value}`,
								children: "Answer"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								id: `answer-${clue.value}`,
								value: clue.answer,
								maxLength: 600,
								onChange: (event) => update(clue.value, "answer", event.target.value)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: `question-${clue.value}`,
								children: "Question"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								id: `question-${clue.value}`,
								value: clue.question,
								maxLength: 600,
								onChange: (event) => update(clue.value, "question", event.target.value)
							})]
						})
					]
				}, clue.value))
			}),
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm text-fg",
				children: error
			}) : null,
			saved ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm text-muted",
				children: "Saved."
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 flex flex-wrap items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					disabled: pending || deleting,
					children: pending ? "Saving…" : "Save category"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmDelete, {
					label: "Delete category",
					pending: deleting,
					onConfirm: () => void onDelete()
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm text-pretty text-muted",
				children: "Deleting this category does not change boards you already created."
			})
		]
	});
}
function CategoryPage() {
	const detail = Route$1.useLoaderData();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StudioFrame, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CategoryEditor, { detail }, detail.id) });
}
//#endregion
export { CategoryPage as component };
