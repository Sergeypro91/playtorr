module.exports = {
	parser: '@typescript-eslint/parser',
	parserOptions: {
		project: 'tsconfig.json',
		tsconfigRootDir: __dirname,
		sourceType: 'module',
	},
	plugins: ['@typescript-eslint/eslint-plugin'],
	extends: [
		'plugin:@typescript-eslint/recommended',
		'plugin:prettier/recommended',
	],
	root: true,
	env: {
		node: true,
		jest: true,
	},
	ignorePatterns: ['.eslintrc.js'],
	rules: {
		'@typescript-eslint/interface-name-prefix': 'off',
		'@typescript-eslint/explicit-function-return-type': 'off',
		'@typescript-eslint/explicit-module-boundary-types': 'off',
		'@typescript-eslint/no-empty-interface': 'off',
		'@typescript-eslint/no-var-requires': 'error',
		'@typescript-eslint/promise-function-async': [
			'error',
			{
				allowedPromiseNames: ['Thenable'],
				checkArrowFunctions: true,
				checkFunctionDeclarations: true,
				checkFunctionExpressions: true,
				checkMethodDeclarations: true,
			},
		],
		'@typescript-eslint/prefer-for-of': 'warn',
		'@typescript-eslint/no-misused-new': 'error',
		'@typescript-eslint/no-require-imports': 'warn',
	},
};
