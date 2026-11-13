//#region node_modules/.nitro/vite/services/ssr/assets/_tanstack-start-manifest_v-DNMEzjrT.js
var tsrStartManifest = () => ({ routes: {
	__root__: {
		filePath: "/workspace/src/routes/__root.tsx",
		children: [
			"/",
			"/settings",
			"/category/$categoryId",
			"/play/$gameId"
		],
		preloads: ["/assets/index-GwN_RXsA.js", "/assets/studio-Cmr_3FVI.js"],
		scripts: [{ attrs: {
			type: "module",
			async: !0,
			src: "/assets/index-GwN_RXsA.js"
		} }]
	},
	"/": {
		filePath: "/workspace/src/routes/index.tsx",
		children: void 0,
		preloads: [
			"/assets/routes-D7iS03ui.js",
			"/assets/routes-Dguvsl6M.js",
			"/assets/confirm-delete-D1MkxsMn.js"
		]
	},
	"/settings": {
		filePath: "/workspace/src/routes/settings.tsx",
		children: void 0,
		preloads: [
			"/assets/settings-Bvnh3Nnh.js",
			"/assets/confirm-delete-D1MkxsMn.js",
			"/assets/jeopardy-Bitzz2GU.js",
			"/assets/settings-D7iS03ui.js"
		]
	},
	"/category/$categoryId": {
		filePath: "/workspace/src/routes/category.$categoryId.tsx",
		children: void 0,
		preloads: [
			"/assets/category._categoryId-D-wHi4TO.js",
			"/assets/confirm-delete-D1MkxsMn.js",
			"/assets/jeopardy-Bitzz2GU.js",
			"/assets/category._categoryId-D7iS03ui.js"
		]
	},
	"/play/$gameId": {
		filePath: "/workspace/src/routes/play.$gameId.tsx",
		children: void 0,
		preloads: [
			"/assets/play._gameId-BsfUp_pp.js",
			"/assets/jeopardy-Bitzz2GU.js",
			"/assets/play._gameId-D7iS03ui.js"
		]
	}
} });
//#endregion
export { tsrStartManifest };
