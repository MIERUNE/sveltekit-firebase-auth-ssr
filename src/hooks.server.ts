import { sequence } from '@sveltejs/kit/hooks';
import { type Handle, redirect } from '@sveltejs/kit';
import { verifySessionCookie } from '$lib/firebase/server';
import { WorkersKVStoreSingle } from 'firebase-auth-cloudflare-workers-x509';

/**
 * セッションクッキーの検証
 */
const verifySessionToken: Handle = async ({ event, resolve }) => {
	const session = event.cookies.get('session');
	const keys = WorkersKVStoreSingle.getOrInitialize('pubkeys', event.platform?.env?.KV);

	if (session) {
		try {
			const decoded = await verifySessionCookie(keys, session);
			event.locals.currentUser = {
				uid: decoded.uid,
				name: decoded.name || '',
				email: decoded.email
			};
		} catch (e) {
			console.log('Failed', e, session);
			// ignore
		}
	}
	return resolve(event);
};

/**
 * 認証ガード
 *
 * 未認証ユーザなどを、別のページにリダイレクトするのが良い場合に。
 */
const authGuard: Handle = async ({ event, resolve }) => {
	const currentUser = event.locals.currentUser;

	if (!currentUser) {
		const path = event.url.pathname;
		if (path.startsWith('/private') || path.startsWith('/shop')) {
			return redirect(303, '/login?next=' + encodeURIComponent(event.url.pathname));
		}
	}

	if (currentUser && event.url.pathname === '/login') {
		const next = event.url.searchParams.get('next');
		const url = next ? decodeURIComponent(next) : '/private';
		return redirect(303, url);
	}

	return resolve(event);
};

export const handle: Handle = sequence(verifySessionToken, authGuard);
