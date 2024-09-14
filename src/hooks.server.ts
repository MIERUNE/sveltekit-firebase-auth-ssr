import { sequence } from '@sveltejs/kit/hooks';
import { createAuthHook } from '$lib/firebase/server';

export const handle = sequence(
	createAuthHook({
		guardPath: /^\/(private|shop)(\/.*)?/
	})
);
