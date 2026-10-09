import js from '@eslint/js';
import pluginVue from 'eslint-plugin-vue';
import globals from 'globals';

export default [
	{ ignores: [ 'dist/**' ] },
	js.configs.recommended,
	...pluginVue.configs['flat/essential'],
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
		files: [ '*.config.mjs' ],
		languageOptions: { globals: globals.node }
	}
];
