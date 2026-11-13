import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { C as require_jsx_runtime, b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as cn } from "./studio-DBxoOWkX.mjs";
import { i as playerLabel, n as clueKey, r as formatDollars, t as CLUE_VALUES } from "./jeopardy-Bx16hjSG.mjs";
import { f as markPlayed, g as setScore, h as setFinalPlayed, n as Route } from "./router-BK5H8eFB.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/play._gameId-ZAGo42Rr.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var DEFAULT_NAMES = [
	"Player 1",
	"Player 2",
	"Player 3"
];
function useNames(gameId) {
	const [names, setNames] = (0, import_react.useState)(DEFAULT_NAMES);
	(0, import_react.useEffect)(() => {
		try {
			const raw = localStorage.getItem(`answer-first-names:${gameId}`);
			if (!raw) return;
			const parsed = JSON.parse(raw);
			if (!Array.isArray(parsed) || parsed.length !== 3) return;
			setNames(parsed.map((name, index) => typeof name === "string" ? name.slice(0, 40) : DEFAULT_NAMES[index] ?? "Player"));
		} catch {}
	}, [gameId]);
	function setName(slot, name) {
		setNames((prev) => {
			const next = [...prev];
			next[slot] = name.slice(0, 40);
			localStorage.setItem(`answer-first-names:${gameId}`, JSON.stringify(next));
			return next;
		});
	}
	return {
		names,
		setName
	};
}
function PlayScreen({ board }) {
	const { names, setName } = useNames(board.id);
	const [contestants, setContestants] = (0, import_react.useState)(board.contestants);
	const [played, setPlayed] = (0, import_react.useState)(() => new Set(board.played.map((item) => clueKey(item.position, item.value))));
	const [finalPlayed, setFinalPlayedState] = (0, import_react.useState)(board.final.played);
	const [clue, setClue] = (0, import_react.useState)(null);
	const [finalStep, setFinalStep] = (0, import_react.useState)(null);
	const [finalSession, setFinalSession] = (0, import_react.useState)(0);
	const [error, setError] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const lock = (0, import_react.useRef)(false);
	const contestantsRef = (0, import_react.useRef)(contestants);
	contestantsRef.current = contestants;
	const modal = clue !== null || finalStep !== null;
	(0, import_react.useEffect)(() => {
		if (!modal) return;
		const previous = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		function onKey(event) {
			if (event.key === "Escape") {
				setClue(null);
				setFinalStep(null);
			}
		}
		document.addEventListener("keydown", onKey);
		return () => {
			document.body.style.overflow = previous;
			document.removeEventListener("keydown", onKey);
		};
	}, [modal]);
	async function commitScore(contestantId, score) {
		if (lock.current) throw new Error("Wait for the last score to save.");
		lock.current = true;
		setBusy(true);
		setError("");
		const nextScore = Math.max(-1e6, Math.min(1e6, score));
		try {
			const saved = await setScore({ data: {
				gameId: board.id,
				contestantId,
				score: nextScore
			} });
			setContestants((prev) => {
				const next = prev.map((contestant) => contestant.id === saved.id ? {
					...contestant,
					score: saved.score
				} : contestant);
				contestantsRef.current = next;
				return next;
			});
		} catch (err) {
			setError(err instanceof Error ? err.message : "Could not update the score.");
			throw err;
		} finally {
			lock.current = false;
			setBusy(false);
		}
	}
	async function bump(contestantId, delta) {
		const current = contestantsRef.current.find((contestant) => contestant.id === contestantId);
		if (!current) return;
		await commitScore(contestantId, current.score + delta);
	}
	const openClue = clue ? board.clues.find((item) => item.position === clue.position && item.value === clue.value) : void 0;
	const openCategory = clue ? board.categories.find((category) => category.position === clue.position) : void 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "h-dvh overflow-hidden bg-bg text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex h-full flex-col",
				inert: modal ? true : void 0,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
						className: "flex shrink-0 items-center gap-2 px-2 py-1 sm:px-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/",
								className: "inline-flex min-h-11 shrink-0 items-center rounded-md px-2 text-sm text-muted",
								children: "Boards"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "min-w-0 flex-1 truncate text-center font-display text-lg font-medium sm:text-2xl",
								children: board.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setFinalStep(finalPlayed ? "question" : "category"),
								className: "inline-flex min-h-11 shrink-0 items-center rounded-md bg-fg px-3 text-sm font-medium text-bg",
								children: finalPlayed ? "Final · done" : "Final round"
							})
						]
					}),
					error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "px-3 pb-1 text-center text-sm",
						children: error
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid min-h-0 flex-1 grid-cols-6 grid-rows-6 gap-1 px-1 sm:gap-1.5 sm:px-2",
						children: [board.categories.map((category) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex min-h-0 min-w-0 items-center justify-center overflow-hidden rounded-sm bg-cell px-1 text-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "line-clamp-4 text-balance text-cat font-display font-medium uppercase leading-tight text-fg sm:tracking-wide",
								children: category.name
							})
						}, category.position)), CLUE_VALUES.map((value) => board.categories.map((category) => {
							const used = played.has(clueKey(category.position, value));
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								disabled: used,
								onClick: () => setClue({
									position: category.position,
									value
								}),
								"aria-label": used ? `${category.name} ${formatDollars(value)} already played` : `${category.name} for ${formatDollars(value)}`,
								className: cn("min-h-0 min-w-0 rounded-sm text-money font-semibold tabular-nums transition-opacity duration-150", used ? "bg-surface text-transparent" : "bg-cell text-fg hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fg"),
								children: used ? "" : formatDollars(value)
							}, clueKey(category.position, value));
						}))]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
						className: "score-dock grid shrink-0 grid-cols-3 gap-2 border-t border-line px-2 pt-2",
						children: contestants.map((contestant) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlayerDock, {
							contestant,
							name: names[contestant.slot] ?? "",
							busy,
							onName: (name) => setName(contestant.slot, name),
							onBump: (delta) => void bump(contestant.id, delta).catch(() => void 0),
							onCommit: (score) => void commitScore(contestant.id, score).catch(() => void 0)
						}, contestant.id))
					})
				]
			}),
			clue && openClue && openCategory ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClueOverlay, {
				categoryName: openCategory.name,
				value: openClue.value,
				answer: openClue.answer,
				question: openClue.question,
				contestants,
				names,
				busy,
				onAdjust: bump,
				onCancel: () => setClue(null),
				onDone: async () => {
					await markPlayed({ data: {
						gameId: board.id,
						position: clue.position,
						value: clue.value
					} });
					setPlayed((prev) => new Set(prev).add(clueKey(clue.position, clue.value)));
					setClue(null);
				}
			}) : null,
			finalStep ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FinalOverlay, {
				final: board.final,
				step: finalStep,
				reviewing: finalPlayed && finalStep === "question",
				contestants,
				names,
				busy,
				onStep: setFinalStep,
				onAdjust: bump,
				onClose: () => setFinalStep(null),
				onDone: async () => {
					const saved = await setFinalPlayed({ data: {
						gameId: board.id,
						played: true
					} });
					setFinalPlayedState(saved.played);
					setFinalStep(null);
				},
				onRerun: async () => {
					const saved = await setFinalPlayed({ data: {
						gameId: board.id,
						played: false
					} });
					setFinalPlayedState(saved.played);
					setFinalStep("category");
					setFinalSession((session) => session + 1);
				}
			}, finalSession) : null
		]
	});
}
function PlayerDock({ contestant, name, busy, onName, onBump, onCommit }) {
	const label = playerLabel(name, contestant.slot);
	const [text, setText] = (0, import_react.useState)(String(contestant.score));
	const [focused, setFocused] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (!focused) setText(String(contestant.score));
	}, [contestant.score, focused]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-w-0",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "sr-only",
				htmlFor: `name-${contestant.slot}`,
				children: ["Name for ", label]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				id: `name-${contestant.slot}`,
				value: name,
				maxLength: 40,
				autoComplete: "off",
				"aria-label": `Name for player ${contestant.slot + 1}`,
				onChange: (event) => onName(event.target.value),
				className: "h-11 w-full min-w-0 rounded-md border border-line bg-bg px-2 text-base text-fg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fg"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				inputMode: "numeric",
				"aria-label": `Score for ${label}`,
				disabled: busy,
				value: focused ? text : String(contestant.score),
				onFocus: () => {
					setFocused(true);
					setText(String(contestant.score));
				},
				onChange: (event) => setText(event.target.value),
				onBlur: () => {
					setFocused(false);
					const cleaned = text.replace(/[$,\s]/g, "");
					const negative = cleaned.startsWith("-") || cleaned.startsWith("−");
					const digits = cleaned.replace(/[-−]/g, "");
					if (!/^\d+$/.test(digits)) {
						setText(String(contestant.score));
						return;
					}
					const score = negative ? -Number(digits) : Number(digits);
					if (score !== contestant.score) onCommit(score);
				},
				className: "mt-1 h-11 w-full rounded-md border border-line bg-bg text-center text-lg font-semibold tabular-nums text-fg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fg"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-1 grid grid-cols-2 gap-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					disabled: busy,
					onClick: () => onBump(100),
					"aria-label": `Add 100 to ${label}`,
					className: "min-h-11 rounded-md bg-surface text-sm font-medium tabular-nums disabled:opacity-40",
					children: "+100"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					disabled: busy,
					onClick: () => onBump(-100),
					"aria-label": `Subtract 100 from ${label}`,
					className: "min-h-11 rounded-md bg-surface text-sm font-medium tabular-nums disabled:opacity-40",
					children: "−100"
				})]
			})
		]
	});
}
function ClueOverlay({ categoryName, value, answer, question, contestants, names, busy, onAdjust, onCancel, onDone }) {
	const [revealed, setRevealed] = (0, import_react.useState)(false);
	const [applied, setApplied] = (0, import_react.useState)({});
	const [localError, setLocalError] = (0, import_react.useState)("");
	const [closing, setClosing] = (0, import_react.useState)(false);
	async function award(contestantId, delta) {
		setLocalError("");
		try {
			await onAdjust(contestantId, delta);
			setApplied((prev) => ({
				...prev,
				[contestantId]: (prev[contestantId] ?? 0) + delta
			}));
		} catch {
			setLocalError("Score did not save.");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		role: "dialog",
		"aria-modal": "true",
		"aria-labelledby": "clue-heading",
		className: "rise fixed inset-0 z-30 flex flex-col bg-bg text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-2 px-2 py-1 sm:px-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onCancel,
						className: "min-h-11 rounded-md px-2 text-sm text-muted",
						children: "Put back"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "min-w-0 truncate text-sm text-muted",
						children: categoryName
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						disabled: closing,
						onClick: () => {
							setClosing(true);
							onDone().catch((err) => {
								setLocalError(err instanceof Error ? err.message : "Could not close that square.");
								setClosing(false);
							});
						},
						className: "inline-flex min-h-11 items-center rounded-md bg-fg px-3 text-sm font-medium text-bg disabled:opacity-40",
						children: closing ? "Closing…" : "Done"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex min-h-0 flex-1 flex-col items-center justify-center overflow-y-auto px-4 py-6 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-3xl font-medium tabular-nums sm:text-5xl",
						children: formatDollars(value)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-6 text-xs font-medium tracking-widest text-muted uppercase",
						children: "Answer"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						id: "clue-heading",
						className: "mt-3 max-w-4xl text-center font-display text-3xl font-medium whitespace-pre-wrap sm:text-5xl",
						children: answer
					}),
					revealed ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-8 text-xs font-medium tracking-widest text-muted uppercase",
						children: "Question"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 max-w-4xl text-center font-display text-2xl font-medium whitespace-pre-wrap sm:text-4xl",
						children: question
					})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						autoFocus: true,
						onClick: () => setRevealed(true),
						className: "mt-8 inline-flex min-h-11 items-center rounded-md bg-fg px-4 text-sm font-medium text-bg",
						children: "Reveal the question"
					}),
					localError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-sm",
						children: localError
					}) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "score-dock grid grid-cols-3 gap-2 border-t border-line px-2 pt-2",
				children: contestants.map((contestant) => {
					const label = playerLabel(names[contestant.slot], contestant.slot);
					const marked = applied[contestant.id];
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "truncate text-sm font-medium",
								children: label
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-lg font-semibold tabular-nums",
								children: formatDollars(contestant.score)
							}),
							marked != null && marked !== 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								disabled: busy,
								onClick: () => void award(contestant.id, -marked),
								className: "mt-1 min-h-11 w-full rounded-md border border-line text-sm",
								children: "Undo"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-1 grid grid-cols-2 gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									disabled: busy,
									onClick: () => void award(contestant.id, value),
									className: "flex min-h-14 flex-col items-center justify-center rounded-md bg-fg text-bg disabled:opacity-40",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs font-medium",
										children: "Right"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-sm font-semibold tabular-nums",
										children: formatDollars(value)
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									disabled: busy,
									onClick: () => void award(contestant.id, -value),
									className: "flex min-h-14 flex-col items-center justify-center rounded-md border border-line disabled:opacity-40",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs font-medium",
										children: "Wrong"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-sm font-semibold tabular-nums",
										children: formatDollars(-value)
									})]
								})]
							})
						]
					}, contestant.id);
				})
			})
		]
	});
}
function FinalOverlay({ final, step, reviewing, contestants, names, busy, onStep, onAdjust, onClose, onDone, onRerun }) {
	const [wagers, setWagers] = (0, import_react.useState)([
		"",
		"",
		""
	]);
	const [applied, setApplied] = (0, import_react.useState)({});
	const [localError, setLocalError] = (0, import_react.useState)("");
	const [closing, setClosing] = (0, import_react.useState)(false);
	function wagerOf(slot) {
		const digits = Number((wagers[slot] ?? "").replace(/[^0-9]/g, ""));
		if (!Number.isFinite(digits)) return 0;
		return Math.min(1e6, Math.floor(digits));
	}
	async function award(contestant, delta) {
		setLocalError("");
		try {
			await onAdjust(contestant.id, delta);
			setApplied((prev) => ({
				...prev,
				[contestant.id]: delta
			}));
		} catch {
			setLocalError("Score did not save.");
		}
	}
	async function undo(contestant) {
		const marked = applied[contestant.id];
		if (marked == null) return;
		setLocalError("");
		try {
			await onAdjust(contestant.id, -marked);
			setApplied((prev) => {
				const next = { ...prev };
				delete next[contestant.id];
				return next;
			});
		} catch {
			setLocalError("Score did not save.");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		role: "dialog",
		"aria-modal": "true",
		"aria-labelledby": "final-heading",
		className: "rise fixed inset-0 z-30 flex flex-col bg-bg text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between px-2 py-1 sm:px-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onClose,
						className: "min-h-11 rounded-md px-2 text-sm text-muted",
						children: "Close"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "Final round"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-16" })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex min-h-0 flex-1 flex-col items-center justify-center overflow-y-auto px-4 py-6 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium tracking-widest text-muted uppercase",
						children: "Category"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						id: "final-heading",
						className: "mt-3 max-w-4xl font-display text-4xl font-medium text-balance sm:text-6xl",
						children: final.category
					}),
					step !== "category" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-8 text-xs font-medium tracking-widest text-muted uppercase",
						children: "Answer"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 max-w-4xl font-display text-2xl font-medium whitespace-pre-wrap sm:text-4xl",
						children: final.answer
					})] }) : null,
					step === "question" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-8 text-xs font-medium tracking-widest text-muted uppercase",
						children: "Question"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 max-w-4xl font-display text-2xl font-medium whitespace-pre-wrap sm:text-4xl",
						children: final.question
					})] }) : null,
					step === "category" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						autoFocus: true,
						onClick: () => onStep("answer"),
						className: "mt-8 inline-flex min-h-11 items-center rounded-md bg-fg px-4 text-sm font-medium text-bg",
						children: "Show the answer"
					}) : null,
					step === "answer" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-6 max-w-md text-pretty text-sm text-muted",
						children: "Have players lock a wager before you continue."
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						autoFocus: true,
						onClick: () => onStep("question"),
						className: "mt-4 inline-flex min-h-11 items-center rounded-md bg-fg px-4 text-sm font-medium text-bg",
						children: "Reveal the question"
					})] }) : null,
					localError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-sm",
						children: localError
					}) : null
				]
			}),
			step === "question" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "score-dock border-t border-line px-2 pt-2",
				children: reviewing ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center justify-between gap-2 pb-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "This final round is already marked done."
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => void onRerun().catch(() => setLocalError("Could not reopen the final round.")),
						className: "inline-flex min-h-11 items-center rounded-md border border-line px-3 text-sm",
						children: "Run it again"
					})]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "pb-2 text-sm text-muted",
						children: "Enter each wager, then mark it right or wrong. Scoring again adds to the current total."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-3 gap-2",
						children: contestants.map((contestant) => {
							const label = playerLabel(names[contestant.slot], contestant.slot);
							const marked = applied[contestant.id];
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "truncate text-sm font-medium",
										children: label
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "tabular-nums",
										children: formatDollars(contestant.score)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "sr-only",
										htmlFor: `wager-${contestant.slot}`,
										children: ["Wager for ", label]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										id: `wager-${contestant.slot}`,
										inputMode: "numeric",
										placeholder: "Wager",
										value: wagers[contestant.slot] ?? "",
										onChange: (event) => setWagers((prev) => {
											const next = [...prev];
											next[contestant.slot] = event.target.value;
											return next;
										}),
										className: "mt-1 h-11 w-full rounded-md border border-line bg-bg px-2 text-center text-base tabular-nums"
									}),
									marked != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										disabled: busy,
										onClick: () => void undo(contestant),
										className: "mt-1 min-h-11 w-full rounded-md border border-line text-sm",
										children: "Undo"
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-1 grid grid-cols-2 gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											disabled: busy,
											onClick: () => void award(contestant, wagerOf(contestant.slot)),
											className: "min-h-11 rounded-md bg-fg text-sm font-medium text-bg disabled:opacity-40",
											children: "Right"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											disabled: busy,
											onClick: () => void award(contestant, -wagerOf(contestant.slot)),
											className: "min-h-11 rounded-md border border-line text-sm disabled:opacity-40",
											children: "Wrong"
										})]
									})
								]
							}, contestant.id);
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						disabled: closing,
						onClick: () => {
							setClosing(true);
							onDone().catch((err) => {
								setLocalError(err instanceof Error ? err.message : "Could not finish the final round.");
								setClosing(false);
							});
						},
						className: "mt-3 inline-flex min-h-11 items-center rounded-md bg-fg px-4 text-sm font-medium text-bg disabled:opacity-40",
						children: closing ? "Saving…" : "Done"
					})
				] })
			}) : null
		]
	});
}
function PlayPage() {
	const board = Route.useLoaderData();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlayScreen, { board }, board.id);
}
//#endregion
export { PlayPage as component };
