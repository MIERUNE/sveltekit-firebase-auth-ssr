// Firebase Authentication のサーバ側用のコード

import {
	Auth,
	ServiceAccountCredential,
	type FirebaseIdToken,
	type KeyStorer
} from 'firebase-auth-cloudflare-workers-x509';
import { type Handle, redirect, error, type Cookies } from '@sveltejs/kit';
export {
	ServiceAccountCredential,
	WorkersKVStoreSingle
} from 'firebase-auth-cloudflare-workers-x509';

export type AuthHookOptions = {
	projectId: string;
	serviceAccountCredential?: ServiceAccountCredential;
	keyStore: (platform: Readonly<App.Platform> | undefined) => KeyStorer;
	tokenToUser: (decodedToken: FirebaseIdToken) => Promise<App.Locals['currentUser']>;
	guardPathPattern?: RegExp;
};

/**
 * 認証ミドルウェア
 */
export function createAuthHook({
	projectId,
	serviceAccountCredential,
	tokenToUser,
	keyStore: keyStoreMaker
}: AuthHookOptions): Handle {
	return async ({ event, resolve }) => {
		const auth = getAuth(projectId, keyStoreMaker(event.platform), serviceAccountCredential);
		const { request, cookies, fetch } = event;

		if (event.url.pathname.startsWith('/__/auth/')) {
			// ref: Best practices for using signInWithRedirect on browsers that block third-party storage access
			// "Option 3: Proxy auth requests to firebaseapp.com"
			// https://firebase.google.com/docs/auth/web/redirect-best-practices#proxy-requests
			return proxyFirebaseAuthRequest(projectId, request, fetch);
		} else if (event.url.pathname === '/session') {
			return handleSessionEndpoint(request, auth, cookies);
		}

		// Verify session cookie
		const session = cookies.get('session');
		if (session) {
			let decodedToken: FirebaseIdToken | null = null;
			try {
				decodedToken = await auth.verifySessionCookie(session, false);
			} catch {
				// ignore
			}
			if (decodedToken) {
				event.locals.currentUser = await tokenToUser(decodedToken);
			}
		}

		const currentUser = event.locals.currentUser;
		if (currentUser && event.url.pathname === '/login') {
			const next = event.url.searchParams.get('next');
			const url = next ? decodeURIComponent(next) : '/';
			redirect(303, url);
		}
		return resolve(event);
	};
}

export function getAuth(
	projectId: string,
	keyStore: KeyStorer,
	credential?: ServiceAccountCredential
) {
	return Auth.getOrInitialize(projectId, keyStore, credential);
}

// Cloudflare 以外の環境ではメモリに公開鍵をキャッシュする
export class InMemoryKeyStore implements KeyStorer {
	private val: string | null = null;
	private expireAt: number = 0;

	async get() {
		if (Date.now() > this.expireAt) {
			this.val = null;
		}
		return this.val ? JSON.parse(this.val) : null;
	}
	async put(value: string, expirationTtl: number) {
		this.expireAt = Date.now() + expirationTtl * 1000;
		this.val = value;
	}
}

// ref: "Option 3: Proxy auth requests to firebaseapp.com"
// https://firebase.google.com/docs/auth/web/redirect-best-practices#proxy-requests
function proxyFirebaseAuthRequest(
	projectId: string,
	request: Request,
	fetch: typeof globalThis.fetch
) {
	const newUrl = new URL(request.url);
	newUrl.protocol = 'https';
	newUrl.host = `${projectId}.firebaseapp.com`;
	newUrl.port = '';
	const newRequest = new Request(newUrl.toString(), request);
	return fetch(newRequest);
}

/**
 * セッションクッキーを発行する
 */
async function handleSessionEndpoint(request: Request, auth: Auth, cookies: Cookies) {
	const data = await request.json().catch(() => {
		error(400, { message: 'Invalid JSON' });
	});
	const idToken = (data as { idToken?: string }).idToken;
	const days = 14; // min: 5 min, max: 14 days
	let setCookie: string;
	if (idToken) {
		const sessionCookie = await auth.createSessionCookie(idToken, {
			expiresIn: days * 24 * 60 * 60 * 1000
		});
		// set session cookie
		// (event.cookies.set doesn't work in custom responses)
		setCookie = cookies.serialize('session', sessionCookie, {
			path: '/',
			maxAge: days * 24 * 60 * 60,
			sameSite: 'lax'
		});
	} else {
		// delete session cookie
		setCookie = cookies.serialize('session', '', {
			path: '/',
			maxAge: 0
		});
	}
	return new Response('ok', {
		headers: {
			'Set-Cookie': setCookie
		}
	});
}
