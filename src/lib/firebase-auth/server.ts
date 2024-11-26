// Firebase Authentication for server-side

import {
	Auth,
	type FirebaseIdToken,
	type KeyStorer,
	type Credential
} from 'firebase-auth-cloudflare-workers-x509';

import { type Handle, redirect, error, type Cookies } from '@sveltejs/kit';
import { env } from '$env/dynamic/public';

export {
	InMemoryStore,
	type FirebaseIdToken,
	ServiceAccountCredential,
	WorkersKVStoreSingle
} from 'firebase-auth-cloudflare-workers-x509';

export type AuthHandleOptions = {
	projectId: string;
	serviceAccountCredential?: Credential;
	keyStore: (platform: Readonly<App.Platform> | undefined) => KeyStorer;
	guardPathPattern?: RegExp;
};

// You can use the Firebase Auth Emulator by setting PUBLIC_FIREBASE_AUTH_EMULATOR_HOST
const emulatorEnv = {
	FIREBASE_AUTH_EMULATOR_HOST: env.PUBLIC_FIREBASE_AUTH_EMULATOR_HOST
};

export class NopCredential implements Credential {
	async getAccessToken() {
		return {
			access_token: 'owner',
			expires_in: 9 * 3600
		};
	}
}

/**
 * Create the authentication handle (middleware)
 */
export function createAuthHandle({
	projectId,
	serviceAccountCredential,
	keyStore: keyStoreMaker
}: AuthHandleOptions): Handle {
	return async ({ event, resolve }) => {
		if (!serviceAccountCredential) {
			if (emulatorEnv.FIREBASE_AUTH_EMULATOR_HOST) {
				serviceAccountCredential ||= new NopCredential();
			} else {
				console.error('service account credential is not set. Authentication will not work.');
			}
		}

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
			let decodedToken: FirebaseIdToken | undefined = undefined;
			try {
				decodedToken = await auth.verifySessionCookie(session, false, emulatorEnv);
			} catch {
				// ignore
			}
			if (decodedToken) {
				event.locals.currentIdToken = decodedToken;
			}
		}

		if (event.locals.currentIdToken && event.url.pathname === '/login') {
			const next = event.url.searchParams.get('next');
			const url = next ? decodeURIComponent(next) : '/';
			redirect(303, url);
		}
		return resolve(event);
	};
}

export function getAuth(projectId: string, keyStore: KeyStorer, credential?: Credential) {
	return Auth.getOrInitialize(projectId, keyStore, credential);
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
 * handler for POST /session
 */
async function handleSessionEndpoint(request: Request, auth: Auth, cookies: Cookies) {
	const data = await request.json().catch(() => {
		error(400, { message: 'Invalid JSON' });
	});
	const idToken = (data as { idToken?: string }).idToken;
	const days = 14; // min: 5 min, max: 14 days
	let setCookie: string;
	if (idToken) {
		const sessionCookie = await auth.createSessionCookie(
			idToken,
			{
				expiresIn: days * 24 * 60 * 60 * 1000
			},
			emulatorEnv
		);
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
