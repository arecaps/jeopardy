import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { C as require_jsx_runtime, S as useRouter, b as Link, x as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as cn, r as StudioFrame } from "./studio-DBxoOWkX.mjs";
import { a as Route$3, c as createGame, d as deleteGame } from "./router-BK5H8eFB.mjs";
import { i as Label, n as ConfirmDelete, r as Input, t as Button } from "./confirm-delete-CckA266Z.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-6DftJ-d5.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function HomeScreen({ games, categories, finals }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm font-medium tracking-wide text-muted uppercase",
			children: "Host board"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "mt-2 max-w-3xl font-display text-4xl font-medium tracking-tight text-balance",
			children: "Answer first. Question second."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-3 max-w-2xl text-pretty text-muted",
			children: "Six categories across, five values down. Open a square to read the answer, then reveal the question. A final round waits when the board is clear."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mt-10",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-2xl font-medium",
				children: "Boards"
			}), games.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-pretty text-muted",
				children: "No boards yet. Finish six categories in the library, then build one below."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-4 space-y-3",
				children: games.map((game) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GameCard, { game }, game.id))
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mt-12",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-2xl font-medium",
					children: "New board"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 max-w-2xl text-pretty text-sm text-muted",
					children: "A board keeps its own copy of the clues, so later library edits do not change it."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BoardBuilder, {
					categories,
					finals
				})
			]
		})
	] });
}
function GameCard({ game }) {
	const router = useRouter();
	const [pending, setPending] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)("");
	const finalLabel = game.finalPlayed ? "Final done" : "Final not yet";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
		className: "rounded-xl border border-line bg-surface p-4 sm:p-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-baseline justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-display text-2xl font-medium",
					children: game.title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: game.createdLabel
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-pretty text-muted",
				children: game.categories.join(" · ")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-3 text-sm tabular-nums text-fg",
				children: [
					game.played,
					" of 30 played · ",
					finalLabel
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 h-1 overflow-hidden rounded-full bg-line",
				"aria-hidden": true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-full bg-fg",
					style: { width: `${Math.round(game.played / 30 * 100)}%` }
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 flex flex-wrap items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/play/$gameId",
						params: { gameId: String(game.id) },
						children: "Open board"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmDelete, {
					label: "Delete board",
					pending,
					onConfirm: () => {
						setPending(true);
						setError("");
						deleteGame({ data: { id: game.id } }).then(() => router.invalidate()).catch((err) => {
							setError(err instanceof Error ? err.message : "Could not delete that board.");
						}).finally(() => setPending(false));
					}
				})]
			}),
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-fg",
				children: error
			}) : null
		]
	});
}
function BoardBuilder({ categories, finals }) {
	const navigate = useNavigate();
	const [title, setTitle] = (0, import_react.useState)("");
	const [selected, setSelected] = (0, import_react.useState)([]);
	const [finalId, setFinalId] = (0, import_react.useState)(finals[0]?.id ?? null);
	const [pending, setPending] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)("");
	const readyCount = categories.filter((category) => category.filled >= 5).length;
	const full = selected.length >= 6;
	function toggle(id) {
		setSelected((prev) => {
			if (prev.includes(id)) return prev.filter((item) => item !== id);
			if (prev.length >= 6) return prev;
			return [...prev, id];
		});
	}
	function move(index, dir) {
		setSelected((prev) => {
			const next = [...prev];
			const target = index + dir;
			if (target < 0 || target >= next.length) return prev;
			const current = next[index];
			const swap = next[target];
			if (current === void 0 || swap === void 0) return prev;
			next[index] = swap;
			next[target] = current;
			return next;
		});
	}
	async function onSubmit(event) {
		event.preventDefault();
		if (!finalId || selected.length !== 6 || !title.trim()) return;
		setPending(true);
		setError("");
		try {
			const created = await createGame({ data: {
				title: title.trim(),
				categoryIds: selected,
				finalId
			} });
			await navigate({
				to: "/play/$gameId",
				params: { gameId: String(created.id) }
			});
		} catch (err) {
			setError(err instanceof Error ? err.message : "Could not create that board.");
			setPending(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		onSubmit: (event) => void onSubmit(event),
		className: "mt-4 space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					htmlFor: "board-title",
					children: "Board name"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					id: "board-title",
					value: title,
					maxLength: 80,
					autoComplete: "off",
					placeholder: "Friday night",
					onChange: (event) => setTitle(event.target.value)
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-baseline justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-medium",
							children: "Categories"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm tabular-nums text-muted",
							children: [selected.length, " of 6"]
						})]
					}),
					readyCount < 6 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-pretty text-sm text-muted",
						children: [
							readyCount,
							" of 6 categories are finished.",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/settings",
								className: "text-fg underline decoration-line underline-offset-4",
								children: "Add clues in the library."
							})
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "Pick six. The order is left to right on the board."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid gap-2 sm:grid-cols-2",
						children: categories.map((category) => {
							const on = selected.includes(category.id);
							const ready = category.filled >= 5;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								disabled: !ready || full && !on,
								"aria-pressed": on,
								onClick: () => toggle(category.id),
								className: cn("flex min-h-11 items-center justify-between gap-3 rounded-md border px-3 py-2 text-left", on ? "border-fg bg-fg text-bg" : "border-line bg-bg text-fg", !ready && "text-muted"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "min-w-0 truncate font-medium",
									children: category.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "shrink-0 text-sm tabular-nums",
									children: on ? "Added" : ready ? "Ready" : `${category.filled}/5`
								})]
							}, category.id);
						})
					}),
					selected.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
						className: "space-y-2",
						children: selected.map((id, index) => {
							const category = categories.find((item) => item.id === id);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "rounded-lg border border-line bg-bg p-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "w-6 text-center text-sm tabular-nums text-muted",
										children: index + 1
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "min-w-0 flex-1 truncate",
										children: category?.name ?? "Category"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-2 grid grid-cols-3 gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											variant: "quiet",
											disabled: index === 0,
											onClick: () => move(index, -1),
											children: "Up"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											variant: "quiet",
											disabled: index === selected.length - 1,
											onClick: () => move(index, 1),
											children: "Down"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											variant: "ghost",
											onClick: () => toggle(id),
											children: "Remove"
										})
									]
								})]
							}, id);
						})
					}) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", {
				className: "space-y-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", {
					className: "font-medium",
					children: "Final round"
				}), finals.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-pretty text-sm text-muted",
					children: [
						"No final round yet.",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/settings",
							className: "text-fg underline decoration-line underline-offset-4",
							children: "Write one in the library."
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-2",
					children: finals.map((final) => {
						const on = finalId === final.id;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: cn("flex cursor-pointer gap-3 rounded-md border px-3 py-3", on ? "border-fg bg-bg" : "border-line"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "radio",
								name: "final",
								className: "mt-1",
								checked: on,
								onChange: () => setFinalId(final.id)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block font-medium",
									children: final.category
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mt-1 block line-clamp-2 text-sm text-pretty text-muted",
									children: final.answer
								})]
							})]
						}, final.id);
					})
				})]
			}),
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-fg",
				children: error
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "submit",
				disabled: pending || !title.trim() || selected.length !== 6 || finalId == null,
				children: pending ? "Creating…" : "Create board"
			})
		]
	});
}
function HomePage() {
	const data = Route$3.useLoaderData();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StudioFrame, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HomeScreen, {
		games: data.games,
		categories: data.categories,
		finals: data.finals
	}) });
}
//#endregion
export { HomePage as component };
