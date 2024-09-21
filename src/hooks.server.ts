import { sequence } from '@sveltejs/kit/hooks';
import {
	createAuthHook,
	ServiceAccountCredential,
	WorkersKVStoreSingle,
	InMemoryKeyStore
} from '$lib/firebase-auth/server';

import { PUBLIC_FIREBASE_PROJECT_ID } from '$env/static/public';
import { env } from '$env/dynamic/private';

const serviceAccountCredential = new ServiceAccountCredential(env.GOOGLE_SERVICE_ACCOUNT_KEY);
const memKeyStore = new InMemoryKeyStore();

export const handle = sequence(
	createAuthHook({
		projectId: PUBLIC_FIREBASE_PROJECT_ID,
		serviceAccountCredential,
		keyStore: (platform) => {
			return platform?.env?.KV
				? WorkersKVStoreSingle.getOrInitialize('pubkeys', platform?.env?.KV)
				: memKeyStore;
		}
	})
);
