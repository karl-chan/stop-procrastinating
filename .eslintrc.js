module.exports = {
	extends: ["plugin:svelte/recommended"],
	parser: "@typescript-eslint/parser",
	parserOptions: {
		project: "path/to/your/tsconfig.json",
		extraFileExtensions: [".svelte"],
	},
	overrides: [
		{
			files: ["*.svelte"],
			parser: "svelte-eslint-parser",
			parserOptions: {
				parser: "@typescript-eslint/parser",
			},
		},
	],
};
