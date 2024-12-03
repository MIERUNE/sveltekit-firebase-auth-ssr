import type { Context } from 'hono';
import { getCookie } from 'hono/cookie';
import { createMiddleware } from 'hono/factory';
import { HTTPException } from 'hono/http-exception';
import { env } from 'hono/adapter';
import {
	getAuth,
	InMemoryStore,
	ServiceAccountCredential,
	WorkersKVStoreSingle
} from '$lib/firebase-auth/server';

export type CurrentUser = {
	uid: string;
	name: string;
};

export interface AuthVariables {
	currentUser?: CurrentUser;
}

const memKeyStore = new InMemoryStore();

export const authMiddleware = createMiddleware<{
	Bindings: Env & {
		PUBLIC_FIREBASE_PROJECT_ID: string;
		GOOGLE_SERVICE_ACCOUNT_KEY: string;
		PUBLIC_FIREBASE_AUTH_EMULATOR_HOST: string;
	};
	Variables: AuthVariables;
}>(async (c, next) => {
	// 環境変数
	const {
		PUBLIC_FIREBASE_PROJECT_ID,
		GOOGLE_SERVICE_ACCOUNT_KEY,
		PUBLIC_FIREBASE_AUTH_EMULATOR_HOST
	} = env(c);

	let serviceAccountCredential: ServiceAccountCredential | undefined;
	try {
		serviceAccountCredential = new ServiceAccountCredential(GOOGLE_SERVICE_ACCOUNT_KEY);
	} catch {
		if (!PUBLIC_FIREBASE_AUTH_EMULATOR_HOST) {
			console.error('FIREBASE_SERVICE_ACCOUNT_KEY is not set. Authentication will not work.');
		}
	}

	const sessionCookie = getCookie(c, 'session');
	if (sessionCookie) {
		const kv = c.env?.KV;
		const keyStore = kv ? WorkersKVStoreSingle.getOrInitialize('pubkeys', kv) : memKeyStore;
		const auth = getAuth(PUBLIC_FIREBASE_PROJECT_ID, keyStore, serviceAccountCredential);

		try {
			const idToken = await auth.verifySessionCookie(sessionCookie, false, {
				FIREBASE_AUTH_EMULATOR_HOST: PUBLIC_FIREBASE_AUTH_EMULATOR_HOST || undefined
			});
			c.set('currentUser', {
				uid: idToken.uid,
				name: idToken.name
			});
		} catch (error) {
			// ignore
			console.log('error', error);
		}
	}
	await next();
});

export function ensureUser(c: Context) {
	const currentUser = c.get('currentUser') as CurrentUser;
	if (!currentUser) {
		throw new HTTPException(401, { message: 'Not authorized' });
	}
	return currentUser;
}
