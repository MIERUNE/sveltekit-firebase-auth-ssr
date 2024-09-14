import { sequence } from '@sveltejs/kit/hooks';
import { createAuthHook } from '$lib/firebase/server';
import { ServiceAccountCredential } from 'firebase-auth-cloudflare-workers-x509';
import { PUBLIC_FIREBASE_PROJECT_ID } from '$env/static/public';
import { GOOGLE_SERVICE_ACCOUNT_KEY } from '$env/static/private';

const serviceAccountCredential = new ServiceAccountCredential(GOOGLE_SERVICE_ACCOUNT_KEY);

export const handle = sequence(
	createAuthHook({
		projectId: PUBLIC_FIREBASE_PROJECT_ID,
		serviceAccountCredential,
		tokenToUser: async (decodedToken) => ({
			uid: decodedToken.uid,
			email: decodedToken.email,
			name: decodedToken.name
		}),
		guardPath: /^\/(private|shop)(\/.*)?/
	})
);
