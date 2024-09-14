import type { Context } from 'hono';
import { getCookie } from 'hono/cookie';
import { createMiddleware } from 'hono/factory';
import { HTTPException } from 'hono/http-exception';
import { getAuth, ServiceAccountCredential } from '$lib/firebase-auth/server';

import { PUBLIC_FIREBASE_PROJECT_ID } from '$env/static/public';
import { GOOGLE_SERVICE_ACCOUNT_KEY } from '$env/static/private';

const serviceAccountCredential = new ServiceAccountCredential(GOOGLE_SERVICE_ACCOUNT_KEY);

export type CurrentUser = {
	uid: string;
	name: string;
};

export interface AuthVariables {
	currentUser?: CurrentUser;
}

export const authMiddleware = createMiddleware(async (c, next) => {
	const sessionCookie = getCookie(c, 'session');
	if (sessionCookie) {
		const auth = getAuth(PUBLIC_FIREBASE_PROJECT_ID, serviceAccountCredential, c.env?.KV);
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
