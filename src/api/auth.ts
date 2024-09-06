import type { Context } from 'hono';
import { getCookie } from 'hono/cookie';
import { createMiddleware } from 'hono/factory';
import {
	Auth,
	ServiceAccountCredential,
	WorkersKVStoreSingle
} from 'firebase-auth-cloudflare-workers-x509';
import { GOOGLE_SERVICE_ACCOUNT_KEY } from '$env/static/private';
import { HTTPException } from 'hono/http-exception';

type CurrentUser = {
	uid: string;
	name: string;
};

export interface AuthVariables {
	currentUser?: CurrentUser;
}

export const authMiddleware = createMiddleware(async (c, next) => {
	const sessionCookie = getCookie(c, 'session');
	if (sessionCookie) {
		const keys = WorkersKVStoreSingle.getOrInitialize('pubkeys', c.env.KV);
		const auth = Auth.getOrInitialize(
			'fukada-delete-me',
			keys,
			new ServiceAccountCredential(GOOGLE_SERVICE_ACCOUNT_KEY)
		);
		try {
			const idToken = await auth.verifySessionCookie(sessionCookie);
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
