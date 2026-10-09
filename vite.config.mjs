import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import cssInjectedByJs from 'vite-plugin-css-injected-by-js';

export default defineConfig({
	plugins: [
		vue(),
		// Inject component styles from the JS bundle so users don't need to import a CSS file
		cssInjectedByJs()
	],
	build: {
		lib: {
			entry: fileURLToPath(new URL('./src/components/index.js', import.meta.url)),
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
});
