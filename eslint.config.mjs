import js from '@eslint/js';
import pluginVue from 'eslint-plugin-vue';
import tseslint from 'typescript-eslint';
import globals from 'globals';

export default tseslint.config(
	{ ignores: [ 'dist/**', 'playground-dist/**', 'node_modules/**' ] },
	js.configs.recommended,
	...tseslint.configs.recommended,
	...pluginVue.configs['flat/essential'],
	{
		files: [ '**/*.vue' ],
		languageOptions: {
			parserOptions: { parser: tseslint.parser }
		}
	},
	{
		languageOptions: {
			ecmaVersion: 'latest',
			sourceType: 'module',
			globals: globals.browser
		},
		rules: {
			'no-console': 'warn',
			semi: 'error'
		}
	},
	{
		files: [ '*.config.*', 'scripts/**' ],
		languageOptions: { globals: globals.node }
	},
	{
		files: [ 'scripts/**' ],
		rules: { 'no-console': 'off' }
	}
);
