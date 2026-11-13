//#region node_modules/.nitro/vite/services/ssr/assets/jeopardy-Bx16hjSG.js
var CLUE_VALUES = [
	100,
	200,
	300,
	400,
	500
];
function formatDollars(n) {
	const abs = Math.abs(Math.trunc(n)).toLocaleString("en-US");
	return n < 0 ? `−$${abs}` : `$${abs}`;
}
function clueKey(position, value) {
	return `${position}:${value}`;
}
function playerLabel(name, slot) {
	const trimmed = name?.trim();
	return trimmed ? trimmed : `Player ${slot + 1}`;
}
//#endregion
export { playerLabel as i, clueKey as n, formatDollars as r, CLUE_VALUES as t };
