import { fileURLToPath, URL } from 'node:url';
import { defineConfig, type UserConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import cssInjectedByJs from 'vite-plugin-css-injected-by-js';

const resolvePath = (path: string) => fileURLToPath(new URL(path, import.meta.url));

// The playground (dev server and GitHub Pages site) imports the library from source
const playgroundConfig = (base: string): UserConfig => ({
	root: resolvePath('./playground'),
	base,
	plugins: [ vue() ],
	resolve: {
		alias: { 'vue-circular-count-down-timer': resolvePath('./src/index.ts') }
	},
	build: {
		outDir: resolvePath('./playground-dist'),
		emptyOutDir: true
	}
});

const libraryConfig: UserConfig = {
	plugins: [
		vue(),
		// Inject component styles from the JS bundle so users don't need to import a CSS file
		cssInjectedByJs()
	],
	build: {
		lib: {
			entry: resolvePath('./src/index.ts'),
			name: 'VueCircularCountDownTimer',
			fileName: (format) => format === 'es' ? 'vue-circular-count-down-timer.mjs' : 'vue-circular-count-down-timer.umd.js',
			formats: [ 'es', 'umd' ]
		},
		sourcemap: true,
		rolldownOptions: {
			external: [ 'vue' ],
			output: {
				exports: 'named',
				globals: { vue: 'Vue' }
			}
		}
	}
};

export default defineConfig(({ command, mode }) => {
	if (mode === 'playground') {
		return playgroundConfig('/vue-circular-count-down-timer/');
	}
	return command === 'serve' ? playgroundConfig('/') : libraryConfig;
});
