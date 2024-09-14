import { sequence } from '@sveltejs/kit/hooks';
import { createAuthHook, ServiceAccountCredential } from '$lib/firebase-auth/server';

import { PUBLIC_FIREBASE_PROJECT_ID } from '$env/static/public';
import { GOOGLE_SERVICE_ACCOUNT_KEY } from '$env/static/private';

const serviceAccountCredential = new ServiceAccountCredential(GOOGLE_SERVICE_ACCOUNT_KEY);

export const handle = sequence(
	createAuthHook({
		projectId: PUBLIC_FIREBASE_PROJECT_ID,
		serviceAccountCredential,
		tokenToUser: async (decodedToken) => {
			// トークンをもとにユーザ情報を取得して返す
			return {
				uid: decodedToken.uid,
				email: decodedToken.email,
				name: decodedToken.name
			};
		},
		guardPathPattern: /^\/(private|shop)(\/.*)?/
	})
);
