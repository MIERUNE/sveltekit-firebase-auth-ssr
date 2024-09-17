import { sequence } from '@sveltejs/kit/hooks';
import {
	createAuthHook,
	ServiceAccountCredential,
	WorkersKVStoreSingle,
	InMemoryKeyStore
} from '$lib/firebase-auth/server';

import { PUBLIC_FIREBASE_PROJECT_ID } from '$env/static/public';
import { GOOGLE_SERVICE_ACCOUNT_KEY } from '$env/static/private';

const serviceAccountCredential = new ServiceAccountCredential(GOOGLE_SERVICE_ACCOUNT_KEY);
const memKeyStore = new InMemoryKeyStore();

export const handle = sequence(
	createAuthHook({
		projectId: PUBLIC_FIREBASE_PROJECT_ID,
		serviceAccountCredential,
		keyStore: (platform) => {
			const kv = platform?.env?.KV;
			return kv ? WorkersKVStoreSingle.getOrInitialize('pubkeys', kv) : memKeyStore;
		},
		tokenToUser: async (decodedToken) => {
			// トークンをもとにユーザ情報を取得して返す
			return {
				uid: decodedToken.uid,
				email: decodedToken.email,
				name: decodedToken.name
			};
		}
	})
);
