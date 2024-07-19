import { loadEnv } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig(({ mode }) => {
	// .env の内容を process.env に取り込むための処理
	const env = loadEnv(mode, process.cwd(), '');
	process.env.GOOGLE_SERVICE_ACCOUNT_KEY = env.GOOGLE_SERVICE_ACCOUNT_KEY;

	return {
		plugins: [sveltekit()],
		test: {
			include: ['src/**/*.{test,spec}.{js,ts}']
		}
	};
});
