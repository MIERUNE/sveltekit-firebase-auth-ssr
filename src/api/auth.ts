import type { Context } from 'hono';
import { getCookie } from 'hono/cookie';
import { createMiddleware } from 'hono/factory';
import { HTTPException } from 'hono/http-exception';
import {
	getAuth,
	InMemoryKeyStore,
	ServiceAccountCredential,
	WorkersKVStoreSingle
} from '$lib/firebase-auth/server';

import { PUBLIC_FIREBASE_PROJECT_ID } from '$env/static/public';
import { env } from '$env/dynamic/private';

const serviceAccountCredential = new ServiceAccountCredential(env.GOOGLE_SERVICE_ACCOUNT_KEY);

export type CurrentUser = {
	uid: string;
	name: string;
};

export interface AuthVariables {
	currentUser?: CurrentUser;
}

const memKeyStore = new InMemoryKeyStore();

export const authMiddleware = createMiddleware(async (c, next) => {
	const sessionCookie = getCookie(c, 'session');
	if (sessionCookie) {
		const kv = c.env?.KV;
		const keyStore = kv ? WorkersKVStoreSingle.getOrInitialize('pubkeys', kv) : memKeyStore;
		const auth = getAuth(PUBLIC_FIREBASE_PROJECT_ID, keyStore, serviceAccountCredential);

		try {
			const idToken = await auth.verifySessionCookie(sessionCookie, false);
			c.set('currentUser', {
				uid: idToken.uid,
				name: idToken.name
			});
		} catch {
			// ignore
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
