import { sequence } from '@sveltejs/kit/hooks';
import { type Handle, redirect } from '@sveltejs/kit';
import { getAuthWithKV } from '$lib/firebase/server';

/**
 * セッションクッキーの検証
 */
const verifySessionToken: Handle = async ({ event, resolve }) => {
	const auth = getAuthWithKV(event.platform?.env?.KV);

	const session = event.cookies.get('session');
	if (session) {
		try {
			const decoded = await auth.verifySessionCookie(session, false);
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
 * 未認証のユーザなどを、別のページにリダイレクトするのが良い場合に。
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
