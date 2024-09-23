import { sequence } from '@sveltejs/kit/hooks';
import {
	createAuthHandle,
	ServiceAccountCredential,
	WorkersKVStoreSingle,
	InMemoryStore
} from '$lib/firebase-auth/server';

import { PUBLIC_FIREBASE_PROJECT_ID } from '$env/static/public';
import { env } from '$env/dynamic/private';

const serviceAccountCredential = new ServiceAccountCredential(env.GOOGLE_SERVICE_ACCOUNT_KEY);
const memKeyStore = new InMemoryStore();

export const handle = sequence(
	createAuthHandle({
		projectId: PUBLIC_FIREBASE_PROJECT_ID,
		serviceAccountCredential,
		keyStore: (platform) => {
			return platform?.env?.KV
				? WorkersKVStoreSingle.getOrInitialize('pubkeys', platform?.env?.KV)
				: memKeyStore;
		}
	})
);
