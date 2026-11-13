import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { C as require_jsx_runtime, S as useRouter, b as Link, x as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as cn, r as StudioFrame } from "./studio-DBxoOWkX.mjs";
import { t as CLUE_VALUES } from "./jeopardy-Bx16hjSG.mjs";
import { i as Route$2, m as saveFinal, o as createCategory, s as createFinal, u as deleteFinal } from "./router-BK5H8eFB.mjs";
import { a as Textarea, i as Label, n as ConfirmDelete, r as Input, t as Button } from "./confirm-delete-CckA266Z.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/settings-CqvQ75S1.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function LibraryScreen({ categories, finals }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-12 lg:grid-cols-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl font-medium tracking-tight",
				children: "Library"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-pretty text-muted",
				children: "Each category holds five clues, from 100 to 500. On the board, a square shows the answer. Players respond with the question."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CategoryCreator, {}),
			categories.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-6 text-muted",
				children: "No categories yet."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-6 space-y-3",
				children: categories.map((category) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/category/$categoryId",
					params: { categoryId: String(category.id) },
					className: "block rounded-xl border border-line bg-surface p-4 transition-opacity duration-150 hover:opacity-90",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-baseline justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "min-w-0 font-display text-xl font-medium",
							children: category.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "shrink-0 text-sm tabular-nums text-muted",
							children: [category.filled, "/5"]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 flex gap-1",
						"aria-hidden": true,
						children: CLUE_VALUES.map((value, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("h-1 flex-1 rounded-full", index < category.filled ? "bg-fg" : "bg-line") }, value))
					})]
				}) }, category.id))
			})
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FinalSection, { finals })]
	});
}
function CategoryCreator() {
	const navigate = useNavigate();
	const [name, setName] = (0, import_react.useState)("");
	const [pending, setPending] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)("");
	async function onSubmit(event) {
		event.preventDefault();
		const trimmed = name.trim();
		if (!trimmed) {
			setError("Give the category a name.");
			return;
		}
		setPending(true);
		setError("");
		try {
			const created = await createCategory({ data: { name: trimmed } });
			await navigate({
				to: "/category/$categoryId",
				params: { categoryId: String(created.id) }
			});
		} catch (err) {
			setError(err instanceof Error ? err.message : "Could not add that category.");
			setPending(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		onSubmit: (event) => void onSubmit(event),
		className: "mt-6 space-y-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
				htmlFor: "new-category",
				children: "New category"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-2 sm:flex-row",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					id: "new-category",
					value: name,
					maxLength: 80,
					autoComplete: "off",
					placeholder: "Category name",
					onChange: (event) => setName(event.target.value)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					disabled: pending,
					children: pending ? "Adding…" : "Add category"
				})]
			}),
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-fg",
				children: error
			}) : null
		]
	});
}
function FinalSection({ finals }) {
	const router = useRouter();
	const [category, setCategory] = (0, import_react.useState)("");
	const [answer, setAnswer] = (0, import_react.useState)("");
	const [question, setQuestion] = (0, import_react.useState)("");
	const [pending, setPending] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)("");
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [edit, setEdit] = (0, import_react.useState)({
		category: "",
		answer: "",
		question: ""
	});
	async function onCreate(event) {
		event.preventDefault();
		setPending(true);
		setError("");
		try {
			await createFinal({ data: {
				category: category.trim(),
				answer: answer.trim(),
				question: question.trim()
			} });
			setCategory("");
			setAnswer("");
			setQuestion("");
			await router.invalidate();
		} catch (err) {
			setError(err instanceof Error ? err.message : "Could not add that final round.");
		} finally {
			setPending(false);
		}
	}
	async function onSave(id) {
		setPending(true);
		setError("");
		try {
			await saveFinal({ data: {
				id,
				category: edit.category.trim(),
				answer: edit.answer.trim(),
				question: edit.question.trim()
			} });
			setEditing(null);
			await router.invalidate();
		} catch (err) {
			setError(err instanceof Error ? err.message : "Could not save that final round.");
		} finally {
			setPending(false);
		}
	}
	async function onDelete(id) {
		setPending(true);
		setError("");
		try {
			await deleteFinal({ data: { id } });
			if (editing === id) setEditing(null);
			await router.invalidate();
		} catch (err) {
			setError(err instanceof Error ? err.message : "Could not delete that final round.");
		} finally {
			setPending(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "font-display text-3xl font-medium tracking-tight",
			children: "Final round"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-3 text-pretty text-muted",
			children: "One prompt for the end of the board. Existing boards keep the wording they were created with."
		}),
		finals.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-6 text-muted",
			children: "No final rounds yet."
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-6 space-y-3",
			children: finals.map((final) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
				className: "rounded-xl border border-line bg-surface p-4",
				children: editing === final.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: `final-cat-${final.id}`,
							children: "Category"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: `final-cat-${final.id}`,
							value: edit.category,
							maxLength: 80,
							onChange: (event) => setEdit((prev) => ({
								...prev,
								category: event.target.value
							}))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: `final-answer-${final.id}`,
							children: "Answer"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							id: `final-answer-${final.id}`,
							value: edit.answer,
							maxLength: 600,
							onChange: (event) => setEdit((prev) => ({
								...prev,
								answer: event.target.value
							}))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: `final-question-${final.id}`,
							children: "Question"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							id: `final-question-${final.id}`,
							value: edit.question,
							maxLength: 600,
							onChange: (event) => setEdit((prev) => ({
								...prev,
								question: event.target.value
							}))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								disabled: pending,
								onClick: () => void onSave(final.id),
								children: "Save"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								disabled: pending,
								onClick: () => setEditing(null),
								children: "Cancel"
							})]
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-display text-xl font-medium",
						children: final.category
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-pretty text-sm text-muted",
						children: final.answer
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-pretty text-sm",
						children: final.question
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex flex-wrap items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "quiet",
							onClick: () => {
								setEditing(final.id);
								setEdit({
									category: final.category,
									answer: final.answer,
									question: final.question
								});
							},
							children: "Edit"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmDelete, {
							pending,
							onConfirm: () => void onDelete(final.id)
						})]
					})
				] })
			}, final.id))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: (event) => void onCreate(event),
			className: "mt-6 space-y-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-medium",
					children: "Add a final round"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					htmlFor: "new-final-category",
					children: "Category"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					id: "new-final-category",
					value: category,
					maxLength: 80,
					autoComplete: "off",
					onChange: (event) => setCategory(event.target.value)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					htmlFor: "new-final-answer",
					children: "Answer"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
					id: "new-final-answer",
					value: answer,
					maxLength: 600,
					placeholder: "What the host reads",
					onChange: (event) => setAnswer(event.target.value)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					htmlFor: "new-final-question",
					children: "Question"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
					id: "new-final-question",
					value: question,
					maxLength: 600,
					placeholder: "What is … ?",
					onChange: (event) => setQuestion(event.target.value)
				}),
				error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-fg",
					children: error
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					disabled: pending,
					children: pending ? "Saving…" : "Add final round"
				})
			]
		})
	] });
}
function SettingsPage() {
	const library = Route$2.useLoaderData();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StudioFrame, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LibraryScreen, {
		categories: library.categories,
		finals: library.finals
	}) });
}
//#endregion
export { SettingsPage as component };
