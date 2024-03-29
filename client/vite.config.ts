import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [sveltekit()],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	},
	server: {
		proxy: {
				'/stop-procrastinating/api': {
					target: 'http://localhost:3000',
					changeOrigin: true,
					rewrite: (path) => path.replace(/^\/stop-procrastinating/, ''),
				}
		},
},
});
